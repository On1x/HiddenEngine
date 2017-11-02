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
			if(''==_this.path_array[2]){
				_this.replace.title='Accounts - '+_this.replace.title;
				if(_this.session.auth){
					if('delete'==_this._GET.action){
						var id=parseInt(_this._GET.id);
						for(var i=0;i<global.he.accounts.length;i++){
							if(global.he.accounts[i].id==id){
								global.he.accounts.splice(i,1);
							}
						}
						_this.session.redirect=true;
						_this.response.redirect(302,'/accounts/');
					}
					else
					if(typeof _this._POST.add_account !== 'undefined'){
						var m={'login':_this._POST.login,'posting_key':_this._POST.posting_key,'active_key':_this._POST.active_key,'type':parseInt(_this._POST.type)};
						m.id=++global.he.counters.accounts;
						global.he.accounts.push(m);

						_this.session.redirect=true;
						_this.response.redirect(302,'/accounts/');
					}
					else
					if('insert'==_this._GET.action){
						_this.content+=`<h1>Accounts list</h1>`;
						_this.content+=`<h2>Adding new account</h2>`;
						_this.content+=`<form action="" method="POST">
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
						_this.content+=`<h1>Accounts list</h1>`;
						_this.content+=`<p><a class="button" href="?action=insert">Add new item</a></p>`;
						_this.content+=`<table class="object_view"><thead><tr>
							<th width="5%">id</th>
							<th width="5%">Type</th>
							<th width="15%">Login</th>
							<th width="30%">Posting key</th>
							<th width="30%">Active key</th>
							<th width="15%">Actions</th>
						</tr>
						</thead>
						<tbody>`;
						for(var m of global.he.accounts){
							_this.content+=`
						<tr>
							<td>${m.id}</td>
							<td>`+(1==m.type?'STEEM':'GOLOS')+`</td>
							<td>${m.login}</td>`;
						if(''!=m.posting_key){
							_this.content+=`
								<td><span class="hidden-text" data-text="${m.posting_key}">hidden</span></td>`;
						}
						else{
							_this.content+=`<td></td>`;
						}
						if(''!=m.active_key){
							_this.content+=`
								<td><span class="hidden-text" data-text="${m.active_key}">hidden</span></td>`;
						}
						else{
							_this.content+=`<td></td>`;
						}
						_this.content+=`
							<th><a href="?action=delete&id=${m.id}">DELETE</a></th>`;
						_this.content+=`</tr>`;
						}
						_this.content+=`</tbody></table>`;
					}
				}
				else{
					_this.content+='<p><strong>Warning! </strong>Not authorized</p>';
					_this.content+='<p><a href="/login/">Login</a></p>';
				}
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