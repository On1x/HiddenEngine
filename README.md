# HiddenEngine
Hidden Engine это легкий движок для сайтов (данная реализация на node.js).
## Разработка
Легкая модульная подсистема позволяет расширять сайт или приложение отдельными файлами-модулями. Порог входа программистов снижен интуитивной структуройЖ
- /class/ содержит классы:
  - template.js &mdash; легкий класс для html-шаблонов;
- /module/ содержит исполняемые модули:
  - prepare.js &mdash; выполняется автоматически для каждого запроса, содержит предопределенные настройки сайта и подготовительные операции (такие как проверка авторизации);
  - login.js &mdash; форма авторизации;
  - logout.js &mdash; выход;
  - index.js &mdash; главный файл доступный из корня сайта.
- /templates/ содержит html-шаблоны.

Главный исполняемый файл подготовливает окружение (cookies, _GET, _POST), формирует объекты для удобного обращения (templates, global), выполняет модуль и завершает соединение (по-умолчанию включена поддержка gzip-сжатия).
## Установка
```
git clone https://github.com/On1x/HiddenEngine.git
cd HiddenEngine
npm install
```
## Запуск
```
pm2 start index.js --watch
```
