#!/usr/bin/env node
"use strict";
var crypto = require('crypto');
module.exports=class he_module{
	constructor(finish_request,obj){
		this.finish_request=finish_request;

		this.content=obj.content;
		this.replace=obj.replace;
		this.session=obj.session;
		this.global=obj.global;
		this.path_array=obj.path_array;
		this._GET=obj._GET;
		this._POST=obj._POST;
		this.cookies=obj.cookies;
		this.response=obj.response;

		this.exec();
	}
	exec(){
		if(this.session.auth){
			this.session.redirect=true;
			this.response.redirect(302,'/');
		}
		else{
			if(typeof this._POST.login !== 'undefined'){
				this.response.cookie('login',this._POST.login,{});
				this.response.cookie('password',crypto.createHash('md5').update(this._POST.password).digest("hex"),{});
				this.session.redirect=true;
				this.response.redirect(302,'/login/');
			}
			this.global.change_template='engine-login.tpl';
			this.replace.title='Authorization - '+this.replace.title;
			if(''!=this.cookies.login){
				this.content+='<p><strong>Auth error!</strong></p>';
			}
			this.content+=`<form class="admin-login" action="/login/" method="POST">
<input type="text" name="login"> &mdash; Login<br>
<input type="password" name="password"> &mdash; Password<br>
<input type="submit" value="Enter">
</form>`;
		}
		this.finish_request({
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