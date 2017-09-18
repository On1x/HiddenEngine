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
		var admin_login=this.global.admin.login;
		var admin_password=this.global.admin.password;
		var admin_password_hash=crypto.createHash('md5').update(admin_password).digest("hex");

		this.global.change_template='index.tpl';
		this.session.redirect=false;
		this.replace.title='HiddenEngine';
		this.replace.menu='';
		this.replace.description='Light engine for node.js apps';
		this.session.auth=false;
		if(typeof this.cookies.login !== 'undefined'){
			if(this.cookies.login==admin_login){
				if(this.cookies.password==admin_password_hash){
					this.session.auth=true;
					this.global.change_template='engine-index.tpl';
					this.replace.menu+=`<div class="grey" style="margin:10px;text-align:right;position:absolute;text-align:right;right:55px;">Your login: ${admin_login}</div>`;
					this.replace.menu+='<ul class="admin-menu">';
					var admin_menu={
						'accounts':'Accounts',
						'upvote-circle':'Upvote circle',
						'watch-control':'Watch control',
						//'api':'API',
					};
					for(var menu in admin_menu){
						this.replace.menu+='<li'+(this.path_array[1]==menu?' class="selected"':'')+'><a href="/'+menu+'/">'+admin_menu[menu]+'</a></li>';
					}
					this.replace.menu+='<li class="exit"><a href="/logout/">Logout</a></li></ul>';
				}
			}
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