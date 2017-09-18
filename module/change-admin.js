#!/usr/bin/env node
"use strict";
var crypto = require('crypto');
module.exports=class he_module{
	constructor(finish_request,obj){
		this.content=obj.content;
		this.replace=obj.replace;
		this.session=obj.session;
		this.path_array=obj.path_array;
		this._GET=obj._GET;
		this._POST=obj._POST;
		this.cookies=obj.cookies;
		this.response=obj.response;

		this.exec(finish_request);
	}
	exec(callback){
		this.replace.title='Change admin access - '+this.replace.title;
		this.content+='<h1>Change admin access</h1>';
		if(this.session.auth){
			if(typeof this._POST.login !== 'undefined'){
				if(this._POST.password==this._POST.password2){
					global.he.admin.login=this._POST.login;
					global.he.admin.password=this._POST.password;
					this.response.cookie('login',this._POST.login,{});
					this.response.cookie('password',crypto.createHash('md5').update(this._POST.password).digest("hex"),{});

					this.session.redirect=true;
					this.response.redirect(302,'/');
				}
				else{
					this.content+='<p><strong>Passwords missmatch!</strong></p>';
				}
			}
			this.content+=`<form action="" method="POST">
			<input type="text" name="login" placeholder="New login"><br>
			<input type="password" name="password" placeholder="New password"><br>
			<input type="password" name="password2" placeholder="Repeat new password"><br>
			<input type="submit" value="Submit">
			</form>`;
		}
		else{
			this.content+='<p><strong>Warning! </strong>Not authorized</p>';
			this.content+='<p><a href="/login/">Login</a></p>';
		}
		callback({
			'content':this.content,
			'replace':this.replace,
			'session':this.session,
			'response':this.response,
			'path_array':this.path_array,
			'_GET':this._GET,
			'_POST':this._POST,
			'cookies':this.cookies,
		});
	}
}