var express = require('express');
var Yelp = require('node-yelp-api');
var yelpHelper = require('./utils/yelpHelper');
var merge = require('merge');
var url = require('url');
var path = require('path');
var app = express();
app.set('view engine', 'pug');
app.locals.pretty = true

var options = {
  consumer_key: '0A7dbWuFuWWyx9Vqh5rgOQ',
  consumer_secret: 'oZjyGChKbpdQlePRe-0r-b6PmVc',
  token: 'R-H_GfmTDgUPd4MrXAIF2J5cU4fmGMLq',
  token_secret: '_Aek8HF2cdxw_tQZ2z9B5S4cP1A',
};

app.get('/', function(req, res){
	res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.get('/search', function(req, res){
	var query = url.parse(req.url, true).query;
	if(query.term && query.location){
		var parameters = yelpHelper.param(query);
		Yelp.search(merge(options, parameters), (err, response, body) => {
			if(err){
				res.send("Could not find search results with term:" + query.term + " and " + query.location);
			} else {
				yelpHelper.viewCompile(query, parameters, res, body);
			}
		});
	} else {
		res.send("Need to sepecify input location and keywords.");
	}
});

app.listen(3000, function(){
	console.log('Listening on port 3000!');
});