
module.exports= {
	param: function(query){
		var parameters = {term: '', location: ''};
		if(query.term)
			parameters.term = query.term;
		else
			parameters.term = 'food';
		if(query.location)
			parameters.location = query.location;
		else 
			parameters.location = 'philadelphia';
		if(query.category) 
			parameters.category= query.category;
		if(query.sort) 
			parameters.sort = query.sort;
		if(query.limit) 
			parameters.limit = query.limit;
		if(query.offset) 
			parameters[offset] = query.offset;
		if(query.radius_filter) 
			parameters.radius_filter = query.radius_filter;
		return parameters;
	},
	jsonParser: function(body, callback){
		try{
			var result = JSON.parse(body);
			return callback(null, result);
		} catch(err){
			return callback(err, null);
		}
	},
	viewCompile: function(query, parameters, res, body){
		var path = require('path');
		const pug = require('pug');

		// try{
		// 	var result = JSON.parse(body);
		// }catch(err){
		// 	console.log("Fail to parse the JSON" + err.message);
		// 	windows.location.reload();
		// }
		module.exports.jsonParser(body, (err, result) => {
			if(err != null)
				res.send('Could not process your request, please try again or reload the page');
			else if(result != null){
				var popular_Filter = query.popularity_filter ? query.popularity_filter : 0;
				if(result && result.total > 0){
					if(parameters.offset && parameters.offset > result.total){
						//Not enought result offset has passed the result total.
						res.send("No more results");
					}
					// Compile the source code
					const mainCompile = pug.compileFile(path.join('../yelp-pai/public/result_template.pug'));
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
	}
}