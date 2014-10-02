var path = require('path');
var archive = require('../helpers/archive-helpers');
var helpers = require('./http-helpers');
var url = require('url');
var fs = require('fs');
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
  var siteList;
  archive.readListOfUrls(function( list ){
    siteList = list;
  });

exports.handleRequest = function (req, res) {
  var pathname = url.parse(req.url).pathname;
  if(req.method === 'GET'){
      if( req.url === '/'){
        helpers.serveAssets(res, archive.paths.siteAssets + '/index.html', function(data){
          returnResponse(res, data, 200, "text/html");
        });
      } else if( req.url === '/styles.css' || req.url === '/public/styles.css'){
        helpers.serveAssets(res, archive.paths.siteAssets + '/styles.css', function(data){
          returnResponse(res, data, 200, "text/css");
        });
      } else if ( req.url === '/robot.gif' ) {
        var img = fs.readFileSync(archive.paths.siteAssets + '/robot.gif');
        res.writeHead(200, {'Content-Type': 'image/gif' });
        res.end(img, 'binary');
      } else if (req.url === '/loading') {
        helpers.serveAssets(res, archive.paths.siteAssets + '/loading.html', function(data){
          returnResponse(res, data, 200, "text/html");
        });
      } else if (path.dirname(pathname) === '/archives/sites'){
        //to get our website
        if(archive.isUrlInList(siteList, path.basename(pathname))){
          helpers.serveAssets(res, archive.paths.archivedSites + '/' + path.basename(pathname), function(data){
            returnResponse(res, data, 200, "text/html");
          });
        } else{
          var help = helpers.headers;
          help['Location'] = '/loading';
          res.writeHead(302, help);
          res.end();
        }
      } else {
        returnResponse(res, "Error 404: Not Found", 404);
      }
  } else if (req.method === 'POST'){
    if ( req.url === "/" ){
      var body = '';
      req.on('data', function(data){
        body += data;
      });
      req.on('end', function(){
        // Parse data
        var newEarl = body.split("=")[1];
        if (archive.isURLArchived(newEarl)){
          console.log("ARCHIVED", newEarl);
          var help = helpers.headers;
          help['Location'] = '/archives/sites/' + newEarl;
          res.writeHead(302, help);
          res.end();
        } else {
          archive.addUrlToList(siteList, newEarl);
          // Send to cron job
          var help = helpers.headers;
          help['Location'] = '/loading';
          res.writeHead(302, help);
          res.end();
        }
      });
    }
  } else{
      returnResponse(res, "Error 404: Not Found", 404)
  }

};
