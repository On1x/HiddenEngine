#!/usr/bin/env node
"use strict";
module.exports=class he_module{
	constructor(obj){
		this.global=obj.global;
		this.session=obj.session;
		this.content=obj.content;
		this.replace=obj.replace;
		this.path_array=obj.path_array;
		this._GET=obj._GET;
		this._POST=obj._POST;
		this.cookies=obj.cookies;
		this.res=obj.res;
	}
	exec(){//http://expressjs.com/ru/4x/api.html#res
		this.content+='<h1>Hidden Engine Index</h1>';
		if(this.session.auth){
			this.content+='<p>Authorized</p>';
			this.content+='<p><a href="/upvote-circle/">Upvote circle</a></p>';
			this.content+='<p><a href="/clear-global/">Clear global json database</a></p>';
			this.content+='<p><a href="/logout/">Logout</a></p>';
		}
		else{
			this.content+='<p>Not authorized</p>';
			this.content+='<p><a href="/login/">Login</a></p>';
		}
		this.content+='<h2>POST data test</h2>';
		if(typeof this._POST.data !== 'undefined'){
			this.content+=`<p>Your data: ${this._POST.data}</p>`;
		}
		else{
			this._POST.data='';
		}
		this.content+='<form action="" method="POST"><input type="text" name="data" value="'+this._POST.data+'"><input type="submit" name="send" value="Send!"></form>';
	}
	result(){
		return {'content':this.content,'replace':this.replace,'response':this.res,'global':this.global,'session':this.session}
	}
}