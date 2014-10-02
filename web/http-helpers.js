var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

module.exports.serveAssets = function(res, asset, callback) {
  // Write some code here that helps serve up your static files!

  // (Static files are things like html (yours or archived from others...), css, or anything that doesn't change often.)
  var data = "";
  fs.readFile(asset, function(err, chunk){
    if (err) {
      throw err;
    }
    data += chunk;
    callback(data);
  });
};



// As you progress, keep thinking about what helper functions you can put here!
