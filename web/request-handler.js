var path = require('path');
var archive = require('../helpers/archive-helpers');
var helpers = require('./http-helpers');
var url = require('url');
// require more modules/folders here!

var returnResponse = function(response, data, code, type){
  if(!type){
    response.writeHead(code, helpers.headers);
  } else {
    var help = helpers.headers;
    help["Content-Type"] = type;
    response.writeHead(code, help);
  }
  response.end(data);
}

exports.handleRequest = function (req, res) {
  var siteList;
  archive.readListOfUrls(function( list ){
    sitelist = list;
  });
  var pathname = url.parse(req.url).pathname;
  if(req.method === 'GET'){
      if( req.url === '/'){
        helpers.serveAssets(res, archive.paths.siteAssets + '/index.html', function(data){
          returnResponse(res, data, 200, "text/html");
        });
      } else if( req.url === '/styles.css'){
        helpers.serveAssets(res, archive.paths.siteAssets + '/styles.css', function(data){
          returnResponse(res, data, 200, "text/css");
        });
      }
      else if (req.url === '/loading.html'){
        helpers.serveAssets(res, archive.paths.siteAssets + '/loading.html', function(data){
          returnResponse(res, data, 200, "text/html");
        });
      } else if (path.dirname(pathname) === '/archives/sites'){
        //to get our website
        helpers.serveAssets(res, archive.paths.archivedSites + '/' + path.basename(pathname), function(data){
          returnResponse(res, data, 200, "text/html");
        });
      }
      else {
        returnResponse(res, "not found", 404);
      }
  } else if (req.method === 'POST'){

  } else{
      res.writeHead(404);
      res.end();
  }
    // res.end(archive.paths.list);

};