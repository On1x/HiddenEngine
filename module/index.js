#!/usr/bin/env node
"use strict";
module.exports=class he_module{
	constructor(obj){
		let _this=this;
		return new Promise(function(resolve,reject){
			_this.content=obj.content;
			_this.replace=obj.replace;
			_this.session=obj.session;
			_this.path_array=obj.path_array;
			_this._GET=obj._GET;
			_this._POST=obj._POST;
			_this.cookies=obj.cookies;
			_this.response=obj.response;
			resolve(_this.exec());
		});
	}
	exec(){
		let _this=this;
		return new Promise(function(resolve,reject){
			_this.content+='<h1>Hidden Engine Index</h1>';
			if(_this.session.auth){
				_this.content+='<p><a href="/change-admin/">Change admin access'+(global.he.admin.password=='admin'?' <strong>(Important!)</strong>':'')+'</a></p>';
			}
			else{
				_this.content+='<p>Not authorized</p>';
				_this.content+='<p><a href="/login/">Login</a></p>';
			}

			resolve({
				'content':_this.content,
				'replace':_this.replace,
				'session':_this.session,
				'response':_this.response,
				'path_array':_this.path_array,
				'_GET':_this._GET,
				'_POST':_this._POST,
				'cookies':_this.cookies,
			});
		});
	}
}