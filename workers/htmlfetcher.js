// eventually, you'll have some code here that uses the code in `archive-helpers.js`
// to actually download the urls you want to download.
var archive = require('../helpers/archive-helpers.js');

(function(){
  archive.readListOfUrls(function(data){
    var urls = data;
    for( var i = 0; i < urls.length; i++ ){
      if (!archive.isURLArchived(urls[i])) {
        archive.downloadUrls(urls[i]);
      }
    }
  });
})(archive);
