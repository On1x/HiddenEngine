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
	exec(callback){
		this.global.accounts=[];
		this.global.counters={};
		this.global.counters.accounts=0;

		this.session.redirect=true;
		this.response.redirect(302,'/');

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