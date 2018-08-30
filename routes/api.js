var express = require('express');
var router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');
var url = require('url');

/* GET users listing. */
router.get('/', function(req, res, next) {
  //var url = req.params.url;
  //console.log('url', url);
  res.set('Content-Type', 'text/html');
  var originalUrl = req.originalUrl;
  var actualUrl = originalUrl.substring(6);
  console.log('actualUrl', actualUrl);
  axios.get(actualUrl)
  .then(function (response) {
    // handle success
    var host = response.request.res.req.agent.protocol+"//"+response.request.res.connection._host+response.request.path;
    console.log('after redirect', host);
    var html = response.data;
    const $ = cheerio.load(html);
    $('img').each(function() {
        var old_src=$(this).attr('src');
        var hostName = url.parse(host).hostname
        var new_src = 'https://' + hostName + old_src;
        console.log('new src', new_src);
        $(this).attr('src', new_src);
    });

    res.send(new Buffer(html));
  })
  .catch(function (error) {
    // handle error
    console.log(error);
    res.send(error);
  })
  //res.send('respond with a resource');
});

module.exports = router;
