#!/usr/bin/env node
var app_port=3000;
var zlib = require('zlib');
var http=require('http');
var express=require('express');
var bodyparser=require('body-parser');
var fs=require('fs');
var app=express();
var url_reg = new RegExp('^[a-z0-9A-Z\-_!~@\$\% \+\=\*\&:;,\.]+$');
var global={};
var global_file='./global.json';
if(fs.existsSync(global_file)){
	fs.readFile(global_file,function(err,data){
		global=JSON.parse(data);
		console.log(data);
	});
}
else{
	global.accounts=[];
	global.counters={};
	global.counters.accounts=0;
}

var he_template=require('./class/template.js');
var t=new he_template('./templates/');
t.open('index.tpl','content');

app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());

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
	stream.close();

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