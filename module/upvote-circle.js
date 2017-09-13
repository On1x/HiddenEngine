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
		if(''==this.path_array[2]){
			this.content+='<h1>Upvote circle</h1>';
			if(this.session.auth){
				if('delete'==this._GET.action){
					var id=parseInt(this._GET.id);
					for(var i=0;i<this.global.accounts.length;i++){
						if(this.global.accounts[i].id==id){
							this.global.accounts.splice(i,1);
						}
					}
					this.session.redirect=true;
					this.res.redirect(302,'/upvote-circle/');
				}
				if(typeof this._POST.login !== 'undefined'){
					var m={'login':this._POST.login,'posting_key':this._POST.posting_key,'type':parseInt(this._POST.type)};
					m.id=++this.global.counters.accounts;
					this.global.accounts.push(m);
					this.session.redirect=true;
					this.res.redirect(302,'/upvote-circle/');
				}
				else{
					this.content+=`<p>Fill account's on database and use it all for upvotes single post.</p>`;
					this.content+=`<h2>Account's list</h2>`;
					for(var m of this.global.accounts){
						this.content+=`<p>#${m.id} &mdash; `+(1==m.type?'STEEM':'GOLOS')+` &mdash; ${m.login} &mdash; <a href="/upvote-circle/?action=delete&id=${m.id}">DELETE</a></p>`;
					}
					this.content+=`<h2>Add account</h2>`;
					this.content+=`<form action="" method="POST">
					<select name="type"><option value="1">Steem</option><option value="2">Golos</option></select> &mdash; Blockchain
					<br><input type="text" name="login" value="" placeholder="login">
					<br><input type="text" name="posting_key" value="" placeholder="posting_key">
					<br><input type="submit" value="Submit">
					</form>`;
					this.content+='<hr><p><a href="/">&larr; Return to index</a></p>';
				}
			}
			else{
				this.content+='<p><strong>Warning! </strong>Not authorized</p>';
				this.content+='<p><a href="/login/">Login</a></p>';
			}
		}
	}
	result(){
		return {'content':this.content,'replace':this.replace,'response':this.res,'global':this.global,'session':this.session}
	}
}