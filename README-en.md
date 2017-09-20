## What is HiddenEngine?
Hidden Engine an light engine for sites/apps speciality for Steem/Golos blockchains.

## Development status
Current version: v0.0.5

GitHub: https://github.com/On1x/HiddenEngine

Home page (rus): https://goldvoice.club/@hiddenengine/

### News
Added support for delayed actions in queue. It's implemented in interface (delay input in seconds):

![](http://on1x.com/screen/09-2017/90f9-514e.png)

In current pre-release don't needed to start nginx proxy. Now HiddenEngine have http/https work properly on 80 and 443 ports (Yes! with SSL-certificates support). Installation contain commands for generate self-signed openssl. Password in json global file saved as md5-hash.

Fully support fast install with all dependencies by npm. Full support watchers for Steem and Golos (CPU usage near 0%, it's going higher only on transaction broadcast).

### Future plans
Programming auto-upvote mechanisms for author-list with delay support.

Witness module: broadcast publish_feed, looking for missed blocks, interface for start/pause signing blocks.

Module for E-mail notifies, mail queue.

## Development
Light sub-module system allow to expand site/app for any modules. It's easy for new programmers:
- index.js &mdash; Initial structure, env variables, execute module functions (supports gzip response);
- /class/ contains classes:
	- global.js &mdash; preset for global.json database (default login and password: admin);
	- template.js &mdash; light html-template class;
	- watchers.js &mdash; watchers class, looking for new blocks and execute actions in golos/steem queue;
- /module/ contains sub-modules:
	- prepare.js &mdash; sub-module initialization, pre-configurated options (like authorization checking);
	- login.js &mdash; authorization form;
	- logout.js &mdash; clearing auth-cookies;
	- change-admin.js &mdash; changing admin login and password;
	- accounts.js &mdash; manage accounts (posting, active keys);
	- watch-control.js &mdash; manage watchers (you can just power off steem/golos);
	- upvote-circle.js &mdash; manage account circle for group actions (like upvote/flag/witness_vote/witness_unvote);
	- index.js &mdash; just starting module for check authorization;
- /templates/ contains html-templates;
- /ssl/ contains ssl-certificate (if you have SSL-cert for domain, you need to copy bundle.crt as ssl.crt, and server.key as ssl.key);
- /public/ &mdash; for public files (css/js/img);
- /uploads/ &mdash; for uploaded files (for future support).

## Installation
HiddenEngine will be added into pm2 startup for fast start after server reboot.
```
cd ~
curl -sL https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh -o install_nvm.sh
bash install_nvm.sh
source ~/.profile
nvm ls-remote
nvm install 8.5.0
node -v
sudo apt-get install nodejs-legacy
npm install npm -g
npm install pm2 -g
git clone https://github.com/On1x/HiddenEngine.git
cd HiddenEngine
apt-get install openssl
mkdir ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ./ssl/ssl.key -out ./ssl/ssl.crt -subj "/C=HE/ST=HE/L=HE/O=HE"
npm install
```
## Controls for app
```
npm stop
npm start
npm restart
pm2 monit hiddenengine
```