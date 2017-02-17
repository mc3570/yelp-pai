var express = require('express');
var Yelp = require('node-yelp-api');
var yelpHelper = require('./yelpHelper');
var merge = require('merge');
var url = require('url');
var path = require('path');
const pug = require('pug');
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
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
	if(query.term && query.location){
		var parameters = yelpHelper.param(query);
		var popular_Filter = query.popularity_filter ? query.popularity_filter : 0;
		Yelp.search(merge(options, parameters), (err, response, body) => {
			if(err){
				res.send("Could not find search results with term:" + query.term + " and " + query.location);
			} else {
				var result = JSON.parse(body);
				if(result && result.total > parameters.offset){
					// Compile the source code
					const mainCompile = pug.compileFile(path.join(__dirname + '/public/result_template.pug'));
					var _obj = {popularity_filter: popular_Filter};
					var _vars = [];
					result.businesses.forEach(function(arrayItem){
						_vars.push({
							rating: arrayItem.rating,
							ratingImageUrl: arrayItem.rating_img_url,
							categories: arrayItem.categories,
							phone: arrayItem.phone,
							snippetImage: arrayItem.snippet_image_url,
							snippetText: arrayItem.snippet_text,
							name: arrayItem.name,
							id: arrayItem.id,
							url: arrayItem.url,
							reviewCount: arrayItem.review_count,
							});
					});
					_obj.vars = _vars;
					res.send(mainCompile({obj: _obj}));
				} else 
					res.send("No more results.");
			}
		});
	} else {
		res.send("Need to sepecify input location and keywords.");
	}
});

app.listen(3000, function(){
	console.log('Listening on port 3000!');
});