#!/usr/bin/env node
var app_port=3000;
var zlib=require('zlib');
var http=require('http');
var express=require('express');
var bodyparser=require('body-parser');
var fs=require('fs');

var steem=require('steem');
var golos=require('golos-js');

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
		global.steem_watch_block_id=0;
		global.golos_watch_block_id=0;
		start_watchers();
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
	global.steem_watch_block_id=0;
	global.golos_watch_block_id=0;
	global.counters.accounts=0;
	global.counters.steem_queue=0;
	global.counters.golos_queue=0;
	global.admin={'login':'admin','password':'admin'};
	global.watch_manager={'steem':1,'golos':1,'save_global':1};
	start_watchers();
}

var he_template=require('./class/template.js');

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

function restart_golos_watch(wait){
	if(wait){
		if(0==global.watch_manager.golos){
			setTimeout(function(){restart_golos_watch(wait)},5000);
		}
		if(1==global.watch_manager.golos){
			setTimeout(function(){restart_golos_watch(false)},1000);
			setTimeout(function(){golos_watch()},2000);
		}
		if(2==global.watch_manager.golos){
			setTimeout(function(){restart_golos_watch(false)},1000);
		}
	}
	else{
		if(0==global.watch_manager.golos){
			golos.api.getDynamicGlobalProperties(function(err,result) {
				if(!err){
					global.golos_watch_block_id=result.head_block_number;
					console.log('Starting Golos Watch... on block: #'+global.golos_watch_block_id);
					global.watch_manager.golos=1;
					setTimeout(function(){golos_watch()},1000);
				}
			});
		}
		if(1==global.watch_manager.golos){
			golos.api.getDynamicGlobalProperties(function(err,result) {
				if(!err){
					global.golos_watch_block_id=result.head_block_number;
					console.log('Restarting Golos Watch... on block: #'+global.golos_watch_block_id);
				}
			});
		}
		if(2==global.watch_manager.golos){
			global.watch_manager.golos=1;
			if(0==global.golos_watch_block_id){
				global.golos_watch_block_id=1;
			}
			console.log('Continue Golos Watch... on block: #'+global.golos_watch_block_id);
			setTimeout(function(){golos_watch()},1000);
		}
	}
}

function restart_steem_watch(wait){
	if(wait){
		if(0==global.watch_manager.steem){
			setTimeout(function(){restart_steem_watch(wait)},5000);
		}
		if(1==global.watch_manager.steem){
			setTimeout(function(){restart_steem_watch(false)},1000);
			setTimeout(function(){steem_watch()},2000);
		}
		if(2==global.watch_manager.steem){
			setTimeout(function(){restart_steem_watch(false)},1000);
		}
	}
	else{
		if(0==global.watch_manager.steem){
			steem.api.getDynamicGlobalProperties(function(err,result) {
				if(!err){
					global.steem_watch_block_id=result.head_block_number;
					console.log('Starting Steem Watch... on block: #'+global.steem_watch_block_id);
					global.watch_manager.steem=1;
					setTimeout(function(){steem_watch()},1000);
				}
			});
		}
		if(1==global.watch_manager.steem){
			steem.api.getDynamicGlobalProperties(function(err,result) {
				if(!err){
					global.steem_watch_block_id=result.head_block_number;
					console.log('Restarting Steem Watch... on block: #'+global.steem_watch_block_id);
					setTimeout(function(){steem_watch()},1000);
				}
			});
		}
		if(2==global.watch_manager.steem){
			global.watch_manager.steem=1;
			if(0==global.steem_watch_block_id){
				global.steem_watch_block_id=1;
			}
			console.log('Continue Steem Watch... on block: #'+global.steem_watch_block_id);
			setTimeout(function(){steem_watch()},1000);
		}
	}
}

function save_global_watch(){
	if(1==global.watch_manager.save_global){
		var stream=fs.createWriteStream(global_file,{flags:'w'});
		stream.write(JSON.stringify(global));
		stream.on('finish',function(){
			global.watch_manager.save_global=0;
			this.close();
		});
	}
	setTimeout(function(){save_global_watch()},30000);
}

function start_watchers(){
	restart_golos_watch(true);
	restart_steem_watch(true);
	save_global_watch();
}

function golos_watch(){
	if(1!=global.watch_manager.golos){
		console.log('Stopping Golos Watch... on block: #'+global.golos_watch_block_id);
		restart_golos_watch(true);
	}
	if(1==global.watch_manager.golos){
		golos.api.getBlock(global.golos_watch_block_id,function(err,result){
			if(null!=result){
				console.log('Golos Watch: fetching block #'+global.golos_watch_block_id);
				for(var i in result.transactions){
					for(var j in result.transactions[i].operations){
						var op_name=result.transactions[i].operations[j][0];
						var op_data=result.transactions[i].operations[j][1];
						if('comment'==op_name){
							if(''==op_data.parent_author){
								if(look_in_accounts(op_data.author,2)){
									console.log('Found new post by @'+op_data.author+', apply upvote circle...');
									for(var account of global.accounts){
										if(2==account.type){
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
				}
				global.golos_watch_block_id=global.golos_watch_block_id+1;
			}
		});
		setTimeout(function(){golos_watch()},1000);
	}
}

function steem_watch(){
	if(1!=global.watch_manager.steem){
		console.log('Stopping Steem Watch... on block: #'+global.steem_watch_block_id);
		restart_steem_watch(true);
	}
	if(1==global.watch_manager.steem){
		steem.api.getBlock(global.steem_watch_block_id,function(err,result){
			if(null!=result){
				console.log('Steem Watch: fetching block #'+global.steem_watch_block_id);
				for(var i in result.transactions){
					for(var j in result.transactions[i].operations){
						var op_name=result.transactions[i].operations[j][0];
						var op_data=result.transactions[i].operations[j][1];
						if('comment'==op_name){
							if(''==op_data.parent_author){
								if(look_in_accounts(op_data.author,1)){
									console.log('Found new post by @'+op_data.author+', apply upvote circle...');
									for(var account of global.accounts){
										if(1==account.type){
											if(typeof account.posting_key !== 'undefined'){
												var queue_item={'action':'vote','data':{'user_login':account.login,'user_posting_key':account.posting_key,'target_login':op_data.author,'target_permlink':op_data.permlink,'vote_weight':10000}};
												queue_item.id=++global.counters.steem_queue;
												global.steem_queue.push(queue_item);
											}
										}
									}
								}
							}
						}
					}
				}
				global.steem_watch_block_id=global.steem_watch_block_id+1;
			}
		});
		setTimeout(function(){steem_watch()},1000);
	}
}

/*
queue struct:
id
action=vote,flag,witness_vote,witness_unvote
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
function golos_queue(){
	if(typeof global.golos_queue !== 'undefined'){
		for(var i in global.golos_queue){
			var queue_item_remove=false;
			if('vote'==global.golos_queue[i].action){
				console.log('Golos queue action #'+global.golos_queue[i].id+': '+global.golos_queue[i].action+', by user: '+global.golos_queue[i].data.user_login);
				golos.broadcast.vote(global.golos_queue[i].data.user_posting_key,global.golos_queue[i].data.user_login,global.golos_queue[i].data.target_login,global.golos_queue[i].data.target_permlink,global.golos_queue[i].data.vote_weight,function(err, result){});
				queue_item_remove=true;
			}
			if('flag'==global.golos_queue[i].action){
				console.log('Golos queue action #'+global.golos_queue[i].id+': '+global.golos_queue[i].action+', by user: '+global.golos_queue[i].data.user_login);
				golos.broadcast.vote(global.golos_queue[i].data.user_posting_key,global.golos_queue[i].data.user_login,global.golos_queue[i].data.target_login,global.golos_queue[i].data.target_permlink,-1*global.golos_queue[i].data.flag_weight,function(err, result){});
				queue_item_remove=true;
			}
			if('witness_vote'==global.golos_queue[i].action){
				console.log('Golos queue action #'+global.golos_queue[i].id+': '+global.golos_queue[i].action+', by user: '+global.golos_queue[i].data.user_login);
				golos.broadcast.accountWitnessVote(global.golos_queue[i].data.user_active_key,global.golos_queue[i].data.user_login,global.golos_queue[i].data.target_login,true,function(err, result){});
				queue_item_remove=true;
			}
			if('witness_unvote'==global.golos_queue[i].action){
				console.log('Golos queue action #'+global.golos_queue[i].id+': '+global.golos_queue[i].action+', by user: '+global.golos_queue[i].data.user_login);
				golos.broadcast.accountWitnessVote(global.golos_queue[i].data.user_active_key,global.golos_queue[i].data.user_login,global.golos_queue[i].data.target_login,false,function(err, result){});
				queue_item_remove=true;
			}
			if(queue_item_remove){
				global.golos_queue.splice(i,1);
			}
		}
		global.watch_manager.save_global=1;
	}
	setTimeout(function(){golos_queue()},10000);
}
golos_queue();

function steem_queue(){
	if(typeof global.steem_queue !== 'undefined'){
		for(var i in global.steem_queue){
			var queue_item_remove=false;
			if('vote'==global.steem_queue[i].action){
				console.log('Golos queue action #'+global.steem_queue[i].id+': '+global.steem_queue[i].action+', by user: '+global.steem_queue[i].data.user_login);
				golos.broadcast.vote(global.steem_queue[i].data.user_posting_key,global.steem_queue[i].data.user_login,global.steem_queue[i].data.target_login,global.steem_queue[i].data.target_permlink,global.steem_queue[i].data.vote_weight,function(err, result){});
				queue_item_remove=true;
			}
			if('flag'==global.steem_queue[i].action){
				console.log('Golos queue action #'+global.steem_queue[i].id+': '+global.steem_queue[i].action+', by user: '+global.steem_queue[i].data.user_login);
				golos.broadcast.vote(global.steem_queue[i].data.user_posting_key,global.steem_queue[i].data.user_login,global.steem_queue[i].data.target_login,global.steem_queue[i].data.target_permlink,-1*global.steem_queue[i].data.flag_weight,function(err, result){});
				queue_item_remove=true;
			}
			if('witness_vote'==global.steem_queue[i].action){
				console.log('Golos queue action #'+global.steem_queue[i].id+': '+global.steem_queue[i].action+', by user: '+global.steem_queue[i].data.user_login);
				golos.broadcast.accountWitnessVote(global.steem_queue[i].data.user_active_key,global.steem_queue[i].data.user_login,global.steem_queue[i].data.target_login,true,function(err, result){});
				queue_item_remove=true;
			}
			if('witness_unvote'==global.steem_queue[i].action){
				console.log('Golos queue action #'+global.steem_queue[i].id+': '+global.steem_queue[i].action+', by user: '+global.steem_queue[i].data.user_login);
				golos.broadcast.accountWitnessVote(global.steem_queue[i].data.user_active_key,global.steem_queue[i].data.user_login,global.steem_queue[i].data.target_login,false,function(err, result){});
				queue_item_remove=true;
			}
			if(queue_item_remove){
				global.steem_queue.splice(i,1);
			}
		}
		global.watch_manager.save_global=1;
	}
	setTimeout(function(){steem_queue()},10000);
}
steem_queue();

function parse_cookies(request){
	var list = {},
		rc = request.headers.cookie;
	rc && rc.split(';').forEach(function( cookie ) {
		var parts = cookie.split('=');
		list[parts.shift().trim()] = decodeURI(parts.join('='));
	});
	return list;
}

var finish_request=function(module_result){
	content=module_result.content;
	replace=module_result.replace;
	session=module_result.session;
	global=module_result.global;
	var path_array=module_result.path_array;
	var _GET=module_result._GET;
	var _POST=module_result._POST;
	var cookies=module_result.cookies;
	var response=module_result.response;

	var result='';
	var t=new he_template('./templates/');
	global.watch_manager.save_global=1;

	if(!session.redirect){
		t.open(global.change_template,'content',function(){
			replace.content=content;
			Object.keys(replace).forEach(function(key){
				t.assign(key,replace[key]);
			});
			if(''!=replace.content){
				result=t.get();
				var buf = new Buffer(result, 'utf-8');
				response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8', 'Content-Encoding': 'gzip'});
				zlib.gzip(buf, function (_, result) {
					response.end(result);
				});
			}
			else{
				response.status(404).end('Not Found');
			}
		});
	}
	else{
		response.end();
	}
}

var prepare_module=function(module_result){
	content=module_result.content;
	replace=module_result.replace;
	session=module_result.session;
	global=module_result.global;
	var path_array=module_result.path_array;
	var _GET=module_result._GET;
	var _POST=module_result._POST;
	var cookies=module_result.cookies;
	var response=module_result.response;

	var module_name='index';
	if(''!=path_array[1]){
		if(url_reg.test(path_array[1])){
			module_name=path_array[1];
		}
	}
	var module_file='./module/'+module_name+'.js';
	if(fs.existsSync(module_file)){
		var he_module=require(module_file);
		var module=new he_module(finish_request,{
			'content':content,
			'replace':replace,
			'session':session,
			'global':global,
			'path_array':path_array,
			'_GET':_GET,
			'_POST':_POST,
			'cookies':cookies,
			'response':response,
		});
	}
}

app.all('*',function(req,response){
	var _GET={};
	var _POST={};
	var cookies={};
	var path_query='';
	var path='';
	var path_array=[];
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

	var module_name='prepare';
	var module_file='./module/'+module_name+'.js';
	if(fs.existsSync(module_file)){
		var he_module=require(module_file);
		var module=new he_module(prepare_module,{
			'content':content,
			'replace':replace,
			'session':session,
			'global':global,
			'path_array':path_array,
			'_GET':_GET,
			'_POST':_POST,
			'cookies':cookies,
			'response':response,
		});
	}
});

app.listen(app_port,function(){
	console.log(`Starting Hidden Engine on ${app_port} port...`);
});