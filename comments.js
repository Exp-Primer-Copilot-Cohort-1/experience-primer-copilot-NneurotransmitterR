//Create web server
var http = require('http');
//File I/O
var fs = require('fs');
//URL parsing
var url = require('url');
//Query string parsing
var qs = require('querystring');
//Template engine
var ejs = require('ejs');
//MySQL
var mysql = require('mysql');
var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "1234",
	database: "o2"
});
con.connect();

var app = http.createServer(function(request,response){
	var _url = request.url;
	var queryData = url.parse(_url, true).query;
	var pathname = url.parse(_url, true).pathname;
	if(pathname === '/'){
		if(queryData.id === undefined){
			fs.readdir('./data', function(error, filelist){
				//console.log(filelist);
				var title = 'Welcome';
				var description = 'Hello, Node.js';
				var list = templateList(filelist);
				var template = templateHTML(title, list,
					`<h2>${title}</h2>${description}`,
					`<a href="/create">create</a>`);
				response.writeHead(200);
				response.end(template);
			});
		} else {
			fs.readdir('./data', function(error, filelist){
				var filteredId = path.parse(queryData.id).base;
				fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
					var title = queryData.id;
					var list = templateList(filelist);
					var template = templateHTML(title, list,
						`<h2>${title}</h2>${description}`,
						`<a href="/create">create</a>
						<a href="/update?id=${title}">update</a>
						<form action="delete_process" method="post">
							<input type="hidden" name="id" value="${title}">
							<input type="submit" value="delete">
						</form>
						`);
					response.writeHead(200);
					response.end(template);
				});
			});
		}
	} else if(pathname === '/create'){
		fs.readdir('./data', function(error, filelist){
			//console.log(filelist);
			var title = 'WEB - create';
			var list = templateList(filelist);
			var template = templateHTML(title, list, `
				<form action="/