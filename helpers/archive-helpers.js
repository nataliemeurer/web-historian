var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'archivedSites' : path.join(__dirname, '../archives/sites'),
  'list' : path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for jasmine tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback){
  // read file
  fs.readFile(exports.paths.list, function(err, data){
    if (err) {
      throw err;
    }
    // go through each line and push to global array
    callback(data.toString().split("\n"));
  });
};

exports.isUrlInList = function(list, url){
  return _.contains(list, url);
};

exports.addUrlToList = function(list, url){
  list.push(url);
  // write to file
  fs.appendFile(exports.paths.list, url.toString() + "\n" , function(err){
    if (err) {
      throw err;
    }
  });
  exports.downloadUrls(url);
};

exports.isURLArchived = function(url){
  return fs.existsSync(exports.paths.archivedSites + '/' + url);
};

exports.downloadUrls = function(url){
  http.get("http://" + url, function(res) {
    console.log("Got response: " + res.statusCode);
    var str = '';
    res.on('data', function(data){
      str += data;
    });
    res.on('end', function(data){
      fs.writeFile(exports.paths.archivedSites + '/' + url, str, function(err){
        if (err) {
          console.log(err);
        }
      });
    });
  }).on('error', function(e) {
    console.log("Got error: " + e.message);
  });
};
