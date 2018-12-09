var http = require('http');
var fs = require('fs');
var url = require('url');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){
      if(queryData.id === undefined){
        fs.readdir('./uploads', function(error, filelist){
          var title = 'Welcome';
          var description = 'Hello, Node.js';
          var list = '<ul>';
          var i = 0;
          while(i < filelist.length){
            list = list + `<li><input type="image" href="/?id=${filelist[i]}" src="1.png" value=" ${filelist[i]}"></li>`;
            i = i + 1;
          }
          list = list+'</ul>';
          var template = `
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
          </head>
          <body>
            <h1><a href="/">WEB</a></h1>
            ${list}
            <h2>${title}</h2>
            <p>${description}</p>
          `;
          response.writeHead(200);
          response.end(template);
        })
      } else {
        fs.readdir('./uploads', function(error, filelist){
          var list = '<ul>';
          var i = 0;
          while(i < filelist.length){
            list = list + `<li><input type="image" href="/?id=${filelist[i]}" src="1.png" value=" ${filelist[i]}"></li>`;
            i = i + 1;
          }
          list = list+'</ul>';
          fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
            var title = queryData.id;
            var template = `
            <!doctype html>
            <html>
            <head>
              <title>WEB1 - ${title}</title>
              <meta charset="utf-8">
            </head>
            <body>
              <h1><a href="/">WEB</a></h1>
              ${list}
              <h2>${title}</h2>
              <p>${description}</p>
            </body>
            </html>
            `;
            response.writeHead(200);
            response.end(template);
          });
        });
      }
    } else {
      response.writeHead(404);
      response.end('Not found');
    }
});
