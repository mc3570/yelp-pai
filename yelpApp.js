var express = require('express');
var Yelp = require('node-yelp-api');
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
	var parameters = {
	  term: 'food',
	  location: 'Montreal',
	};
	Yelp.search(merge(options, parameters), (err, response, body) => {
		if(err == null){
			res.sendFile(path.join(__dirname + '/public/index.html'));
		}
	});
});
app.get('/search', function(req, res){
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
	if(query.term && query.location){
		var parameters = {
		term: query.term,
		location: query.location,
		}
		Yelp.search(merge(options, parameters), (err, response, body) => {
			if(err){
				res.send("Could not find search results with term:" + query.term + " and " + query.location);
			} else {
				var result = JSON.parse(body);
				if(result.businesses && result.total > 0){
					// Compile the source code
					const mainCompile = pug.compileFile(path.join(__dirname + '/public/result_template.pug'));
					var _vars = [];
					result.businesses.forEach(function(arrayItem){
						var _rating = arrayItem.rating;
						var _ratingImageUrl = arrayItem.rating_img_url;
						var _categories = arrayItem.categories;
						var _phone = arrayItem.phone;
						var _snippetImage = arrayItem.snippet_image_url;
						var _snippetText = arrayItem.snippet_text;
						var _id = arrayItem.id;
						var _name = arrayItem.name;
						var _url = arrayItem.url;
						var _reviewCount = arrayItem.review_count;
						_vars.push({
							rating: _rating,
							ratingImageUrl: _ratingImageUrl,
							// categories: _categories,
							phone: _phone,
							snippetImage: _snippetImage,
							snippetText: _snippetText,
							name: _name,
							url: _url,
							reviewCount: _reviewCount,
							});
					});
					res.send(mainCompile({vars: _vars}));
				}
			}
		});
	} else {
		res.send("Invalid input data.");
	}
});

app.listen(3000, function(){
	console.log('Example app listening on port 3000!');
});