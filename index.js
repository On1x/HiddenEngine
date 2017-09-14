#!/usr/bin/env node
var app_port=3000;
var zlib = require('zlib');
var http=require('http');
var express=require('express');
var bodyparser=require('body-parser');
var fs=require('fs');

var steem = require('steem');
var golos = require('steem');
golos.config.set('websocket','wss://ws.golos.io');
golos.config.set('address_prefix','GLS');
golos.config.set('chain_id','782a3039b478c839e4cb0c941ff4eaeb7df40bdd68bd441afd444b9da763de12');

var app=express();
var url_reg = new RegExp('^[a-z0-9A-Z\-_!~@\$\% \+\=\*\&:;,\.]+$');
var global={};
var global_file='./global.json';
if(fs.existsSync(global_file)){
	var global_buf='';
	var stream=fs.createReadStream(global_file);
	stream.on('data',function(chunk){
		global_buf+=chunk;
	}).on('end', function(){
		global=JSON.parse(global_buf);
		this.close();
	});
}
else{
	global.steem_queue=[];
	global.steem_queue.push();
	global.golos_queue=[];
	global.golos_queue.push();
	global.accounts=[];
	global.counters={};
	global.counters.accounts=0;
	global.counters.steem_queue=0;
	global.counters.golos_queue=0;
	global.admin={'login':'admin','password':'admin'};
}

var he_template=require('./class/template.js');
var t=new he_template('./templates/');
t.open('index.tpl','content');

app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());

function look_in_accounts(login,type){
	var found=false;
	for(var m of global.accounts){
		if(type==m.type){
			if(login==m.login){
				found=true;
			}
		}
	}
	return found;
}
var golos_watch_block_id=0;
function start_golos_watch(){
	golos.api.getDynamicGlobalProperties(function(err,result) {
		if(!err){
			golos_watch_block_id=result.head_block_number;
			console.log('Starting Golos Watch... on block: #'+golos_watch_block_id);
			golos_watch();
		}
	});
}
start_golos_watch();
function golos_watch(){
	golos.api.getBlock(golos_watch_block_id,function(err,result){
		if(null!=result){
			console.log('Golos Watch: fetching block #'+golos_watch_block_id);
			for(var i in result.transactions){
				for(var j in result.transactions[i].operations){
					var op_name=result.transactions[i].operations[j][0];
					var op_data=result.transactions[i].operations[j][1];
					if('comment'==op_name){
						if(''==op_data.parent_author){
							if(look_in_accounts(op_data.author,2)){
								console.log('Found new post by @'+op_data.author+', apply upvote circle...');
								for(var account of global.accounts){
									if(typeof account.posting_key !== 'undefined'){
										var queue_item={'action':'vote','data':{'user_login':account.login,'user_posting_key':account.posting_key,'target_login':op_data.author,'target_permlink':op_data.permlink,'vote_weight':10000}};
										queue_item.id=++global.counters.golos_queue;
										global.golos_queue.push(queue_item);
									}
								}
							}
						}
					}
				}
			}
			golos_watch_block_id=golos_watch_block_id+1;
		}
	});
	//{api:"database_api",method:"get_ops_in_block",params:["blockNum","onlyVirtual"]}
	setTimeout(function(){golos_watch()},1000);
}
function golos_queue(){
	/*
	id
	action=vote
	data{
	user_login
	user_posting_key
	user_active_key
	target_login
	target_permlink
	vote_weight=10000
	flag_weight=10000
	}
	*/
	if(typeof global.golos_queue !== 'undefined'){
		for(var i in global.golos_queue){
			var queue_item_remove=false;
			if('vote'==global.golos_queue[i].action){
				console.log('Golos queue action #'+global.golos_queue[i].id+': '+global.golos_queue[i].action+', by user: '+global.golos_queue[i].data.user_login);
				golos.broadcast.vote(global.golos_queue[i].data.user_posting_key,global.golos_queue[i].data.user_login,global.golos_queue[i].data.target_login,global.golos_queue[i].data.target_permlink,global.golos_queue[i].data.vote_weight,function(err, result){});
				queue_item_remove=true;
			}
			if('witness_vote'==global.golos_queue[i].action){
				console.log('Golos queue action #'+global.golos_queue[i].id+': '+global.golos_queue[i].action+', by user: '+global.golos_queue[i].data.user_login);
				golos.broadcast.accountWitnessVote(global.golos_queue[i].data.user_active_key,global.golos_queue[i].data.user_login,global.golos_queue[i].data.target_login,true,function(err, result){});
				queue_item_remove=true;
			}
			if(queue_item_remove){
				global.golos_queue.splice(i,1);
			}
		}
		var stream=fs.createWriteStream(global_file,{flags:'w'});
		stream.write(JSON.stringify(global));
		stream.on('finish', function () {
			this.close();
		});
	}
	setTimeout(function(){golos_queue()},10000);
}
golos_queue();

function parse_cookies(request){
	var list = {},
		rc = request.headers.cookie;
	rc && rc.split(';').forEach(function( cookie ) {
		var parts = cookie.split('=');
		list[parts.shift().trim()] = decodeURI(parts.join('='));
	});
	return list;
}

app.all('*',function(req,res){
	var _GET={};
	var _POST={};
	var cookies={};
	var path_query='';
	var path='';
	var path_array=[];
	var result='';
	var	content='';
	var replace={};
	var session={};
	_POST=req.body;
	cookies=parse_cookies(req);
	if(-1!=req.url.indexOf('?')){
		var path_query_arr=req.url.split('?');
		path=''+path_query_arr[0];
		path_query=''+path_query_arr[1];
		if(-1!=path_query.indexOf('&')){
			path_query_arr=path_query.split('&');
			for(i=0;i<path_query_arr.length;i++){
				if(-1!=path_query_arr[i].indexOf('=')){
					var buf_arr=path_query_arr[i].split('=');
					if(buf_arr[0]){
						_GET[buf_arr[0]]=buf_arr[1];
					}
				}
				else{
					_GET[path_query_arr[i]]='';
				}
			}
		}
		else{
			if(-1!=path_query.indexOf('=')){
				var buf_arr=path_query.split('=');
				if(buf_arr[0]){
					_GET[buf_arr[0]]=buf_arr[1];
				}
			}
			else{
				_GET[path_query]='';
			}
		}
	}
	else{
		path=req.url;
		path_query='';
	}
	path_array=path.split('/');
	t.open('index.tpl','content');

	var module_name='prepare';
	var module_file='./module/'+module_name+'.js';
	if(fs.existsSync(module_file)){
		var he_module=require(module_file);
		var module=new he_module({'path_array':path_array,'content':content,'_GET':_GET,'_POST':_POST,'replace':replace,'res':res,'cookies':cookies,'global':global,'session':session});
		module.exec();
		content=module.result().content;
		replace=module.result().replace;
		global=module.result().global;
		session=module.result().session;
		res=module.result().response;
		delete require.cache[require.resolve(module_file)];
	}

	var module_name='index';
	if(''!=path_array[1]){
		if(url_reg.test(path_array[1])){
			module_name=path_array[1];
		}
	}
	var module_file='./module/'+module_name+'.js';
	if(fs.existsSync(module_file)){
		var he_module=require(module_file);
		var module=new he_module({'path_array':path_array,'content':content,'_GET':_GET,'_POST':_POST,'replace':replace,'res':res,'cookies':cookies,'global':global,'session':session});
		module.exec();
		content=module.result().content;
		replace=module.result().replace;
		global=module.result().global;
		session=module.result().session;
		res=module.result().response;
		delete require.cache[require.resolve(module_file)];
	}

	var stream=fs.createWriteStream(global_file,{flags:'w'});
	stream.write(JSON.stringify(global));
	stream.on('finish', function () {
		this.close();
	});

	if(!session.redirect){
		replace.content=content;
		Object.keys(replace).forEach(function(key){
			t.assign(key,replace[key]);
		});
		if(''!=replace.content){
			result=t.get();
			var buf = new Buffer(result, 'utf-8');
			res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8', 'Content-Encoding': 'gzip'});
			zlib.gzip(buf, function (_, result) {
				res.end(result);
			});
		}
		else{
			res.status(404).end('Not Found');
		}
	}
});

app.listen(app_port,function(){
	console.log(`Starting Hidden Engine on ${app_port} port...`);
});