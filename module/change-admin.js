#!/usr/bin/env node
"use strict";
var crypto = require('crypto');
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
			_this.replace.title='Change admin access - '+_this.replace.title;
			_this.content+='<h1>Change admin access</h1>';
			if(_this.session.auth){
				if(typeof _this._POST.login !== 'undefined'){
					if(_this._POST.password==_this._POST.password2){
						global.he.admin.login=_this._POST.login;
						global.he.admin.password=crypto.createHash('md5').update(_this._POST.password).digest("hex");
						_this.response.cookie('login',_this._POST.login,{});
						_this.response.cookie('password',global.he.admin.password,{});

						_this.session.redirect=true;
						_this.response.redirect(302,'/');
					}
					else{
						_this.content+='<p><strong>Passwords missmatch!</strong></p>';
					}
				}
				_this.content+=`<form action="" method="POST">
				<input type="text" name="login" placeholder="New login"><br>
				<input type="password" name="password" placeholder="New password"><br>
				<input type="password" name="password2" placeholder="Repeat new password"><br>
				<input type="submit" value="Submit">
				</form>`;
			}
			else{
				_this.content+='<p><strong>Warning! </strong>Not authorized</p>';
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