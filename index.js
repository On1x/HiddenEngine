#!/usr/bin/env node
var express=require('express');
var app=express();
var zlib=require('zlib');
var http=require('http');
var bodyparser=require('body-parser');
var fs=require('fs');

var steem=require('steem');
var golos=require('golos-js');
global.he=require('./class/global.js');
var he_watchers=require('./class/watchers.js');
var watchers;
watchers=new he_watchers();

var url_reg = new RegExp('^[a-z0-9A-Z\-_!~@\$\% \+\=\*\&:;,\.]+$');

var he_template=require('./class/template.js');

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

var finish_request=function(module_result){
	content=module_result.content;
	replace=module_result.replace;
	session=module_result.session;
	var path_array=module_result.path_array;
	var _GET=module_result._GET;
	var _POST=module_result._POST;
	var cookies=module_result.cookies;
	var response=module_result.response;

	var result='';
	var t=new he_template('./templates/');
	global.he.watch_manager.save_global=1;

	if(!session.redirect){
		t.open(session.change_template,'content',function(){
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
			'path_array':path_array,
			'_GET':_GET,
			'_POST':_POST,
			'cookies':cookies,
			'response':response,
		});
	}
});
app.listen(global.he.app_port,function(){
	console.log(`Starting Hidden Engine on ${global.he.app_port} port...`);
});