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
		if(''==this.path_array[2]){
			this.replace.title='Accounts - '+this.replace.title;
			if(this.session.auth){
				if('delete'==this._GET.action){
					var id=parseInt(this._GET.id);
					for(var i=0;i<this.global.accounts.length;i++){
						if(this.global.accounts[i].id==id){
							this.global.accounts.splice(i,1);
						}
					}
					this.session.redirect=true;
					this.response.redirect(302,'/accounts/');
				}
				else
				if(typeof this._POST.add_account !== 'undefined'){
					var m={'login':this._POST.login,'posting_key':this._POST.posting_key,'active_key':this._POST.active_key,'type':parseInt(this._POST.type)};
					m.id=++this.global.counters.accounts;
					this.global.accounts.push(m);

					this.session.redirect=true;
					this.response.redirect(302,'/accounts/');
				}
				else
				if('insert'==this._GET.action){
					this.content+=`<h1>Accounts list</h1>`;
					this.content+=`<h2>Adding new account</h2>`;
					this.content+=`<form action="" method="POST">
					Blockchain:<br>
					<select name="type">
						<option value="1">Steem</option>
						<option value="2" selected>Golos</option>
					</select>
					<br>Login:<br><input type="text" name="login" value="" autocomplete="off">
					<br>Posting key:<br><input type="text" name="posting_key" value="" autocomplete="off">
					<br>Active key:<br><input type="text" name="active_key" value="" autocomplete="off">
					<hr><input type="submit" class="button" name="add_account" value="Submit">
					</form>`;
				}
				else{
					this.content+=`<h1>Accounts list</h1>`;
					this.content+=`<p><a class="button" href="?action=insert">Add new item</a></p>`;
					this.content+=`<table class="object_view"><thead><tr>
						<th width="5%">id</th>
						<th width="5%">Type</th>
						<th width="15%">Login</th>
						<th width="30%">Posting key</th>
						<th width="30%">Active key</th>
						<th width="15%">Actions</th>
					</tr>
					</thead>
					<tbody>`;
					for(var m of this.global.accounts){
						this.content+=`
					<tr>
						<td>${m.id}</td>
						<td>`+(1==m.type?'STEEM':'GOLOS')+`</td>
						<td>${m.login}</td>`;
					if(''!=m.posting_key){
						this.content+=`
							<td><span class="hidden-text" data-text="${m.posting_key}">hidden</span></td>`;
					}
					else{
						this.content+=`<td></td>`;
					}
					if(''!=m.active_key){
						this.content+=`
							<td><span class="hidden-text" data-text="${m.active_key}">hidden</span></td>`;
					}
					else{
						this.content+=`<td></td>`;
					}
					this.content+=`
						<th><a href="/upvote-circle/?action=delete&id=${m.id}">DELETE</a></th>`;
					this.content+=`</tr>`;
					}
					this.content+=`</tbody></table>`;
				}
			}
			else{
				this.content+='<p><strong>Warning! </strong>Not authorized</p>';
				this.content+='<p><a href="/login/">Login</a></p>';
			}
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