## Что такое HiddenEngine?
Hidden Engine это легкий движок для сайтов и приложений специализированных для блокчейна Steem/Golos.
### Что сделано
Переработана структура приложения, настроена правильная работа с глобальной переменной global.he, сделана авто-загрузка и сохранение базы в файл global.json.  Включена поддержка параллельной работы Steem и Golos (установка с помощью встроенного скрипта install.sh).

![](http://on1x.com/screen/09-2017/f468-52b1.png)
### Планы
Создать механизм отложенных действий в очереди. Написать механизм автоматического курирования/флагования постов авторов из списка с указанием задержки во времени и силой голоса. Модуль для делегатов по publish_feed, слежение за пропущенными блоками, интерфейс для установки паузы на подпись блоков.
## Разработка
Легкая модульная подсистема позволяет расширять сайт или приложение отдельными файлами-модулями. Порог входа программистов снижен интуитивной структурой:
- index.js &mdash; Основной каркас приложения, который подготавливает окружение, выполняет модуль и завершает соединение (по-умолчанию включена поддержка gzip-сжатия);
- /class/ содержит классы:
	- template.js &mdash; легкий класс для html-шаблонов;
	- watchers.js &mdash; класс наблюдателя, который следит за выполнением операций из очереди;
- /module/ содержит исполняемые модули:
	- prepare.js &mdash; выполняется автоматически для каждого запроса, содержит предопределенные настройки сайта и подготовительные операции (такие как проверка авторизации администратора);
	- login.js &mdash; форма авторизации;
	- logout.js &mdash; выход;
	- change-admin.js &mdash; смена пароля администратора;
	- accounts.js &mdash; управление базой аккаунтов;
	- watch-control.js &mdash; управление наблюдателями (steem/golos);
	- upvote-circle.js &mdash; управление связкой аккаунтов, добавление в очередь задач по upvote, флагам и голосованию за делегата;
	- index.js &mdash; главный файл доступный из корня сайта, содержит служебное меню;
- /templates/ содержит html-шаблоны;
- /public/ &mdash; для публичных файлов (css/js/img);
- /uploads/ &mdash; для загружаемых файлов.

## Установка
```
cd ~
curl -sL https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh -o install_nvm.sh
bash install_nvm.sh
nvm ls-remote
nvm install 8.4.0
node -v
sudo apt-get install nodejs-legacy
source ~/.profile
npm install express -g
npm install http -g
npm install pm2 -g
npm install cross-env -g
npm install zlib -g
npm install hash-base -g
npm install fs -g
npm install md5 -g
npm install uglify-js -g
npm install babel -g
npm install steem -g
npm install ws -g
npm install options -g
npm install babel-core -g
npm install webpack -g
npm install webpack-visualizer-plugin -g
npm install async-limiter -g
npm install npm-cli -g

mkdir -p /var/www/nodejs/
cd /var/www/nodejs/

git clone https://github.com/On1x/HiddenEngine.git
cd HiddenEngine
https://github.com/On1x/golos-js.git
cd golos-js
npm install webpack --save
npm install hash-base --save
npm install base-x --save
npm install bigi --save
npm install buffer-xor --save
npm install browserify-aes --save
npm install create-hash --save
npm install create-hmac --save
npm install is-windows --save
npm install isexe --save
npm install long --save
npm install ms --save
npm install pseudomap --save
npm install shebang-regex --save
npm install shebang-command --save
npm install ultron --save
npm install which --save
npm install webpack-visualizer-plugin --save
npm install async-limiter --save
npm install babel-core --save
npm install babel --save
npm install --save
cd ..
npm install
```
## Запуск
```
pm2 start index.js --watch
```