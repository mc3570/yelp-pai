
module.exports= {param: function(query){
		var parameters = {
			term: query.term,
			location: query.location,
		}
		if(query.category) 
			parameters.category= query.category;
		if(query.sort) 
			parameters.sort = query.sort;
		if(query.limit) 
			parameters.limit = query.limit;
		if(query.offset) 
			parameters.offset = query.offset;
		if(query.radius_filter) 
			parameters.radius_filter = query.radius_filter;
		return parameters;
	}
}