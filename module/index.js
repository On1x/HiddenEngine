#!/usr/bin/env node
"use strict";
module.exports=class he_module{
	constructor(finish_request,obj){
		this.content=obj.content;
		this.replace=obj.replace;
		this.session=obj.session;
		this.global=obj.global;
		this.path_array=obj.path_array;
		this._GET=obj._GET;
		this._POST=obj._POST;
		this.cookies=obj.cookies;
		this.response=obj.response;

		this.exec(finish_request);
	}
	exec(callback){//http://expressjs.com/ru/4x/api.html#res
		this.content+='<h1>Hidden Engine Index</h1>';
		if(this.session.auth){
			this.content+='<p><a href="/change-admin/">Change admin access'+(this.global.admin.password=='admin'?' <strong>(Important!)</strong>':'')+'</a></p>';
			this.content+='<hr><p><a href="/clear-global/" style="color:red;">Clear global json database</a></p>';
		}
		else{
			this.content+='<p>Not authorized</p>';
			this.content+='<p><a href="/login/">Login</a></p>';
		}

		callback({
			'content':this.content,
			'replace':this.replace,
			'session':this.session,
			'global':this.global,
			'response':this.response,
			'path_array':this.path_array,
			'_GET':this._GET,
			'_POST':this._POST,
			'cookies':this.cookies,
		});
	}
}