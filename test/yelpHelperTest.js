var assert = require('assert');
var yelpHelper = require('../utils/yelpHelper');
describe('YelpHelper', function(){
	it('Test none input', function(){
		var val = yelpHelper.param({});
		var arr = {term: 'food', location: 'philadelphia'};
		assert.equal(val.term, arr.term);
		assert.equal(val.location, arr.location);
	});
});

describe('YelpHelper', function(){
	it('With only term and location', function(){
		var input = {term: 'tacos', location: 'philadelphia'};
		var val = yelpHelper.param(input);
		var arr = {term: 'tacos', location: 'philadelphia'};
		assert.equal(val.term, arr.term);
		assert.equal(val.location, arr.location);
	});
});

describe('YelpHelper', function(){
	it('With full value input', function(){
		var input = {
			term: 'tacos', 
			location: 'philadelphia', 
			category: 'milk',
			sort: 1,
			limit: 20
		};
		var val = yelpHelper.param(input);
		var arr = {
			term: 'tacos', 
			location: 'philadelphia',
			category: 'milk',
			sort: 1,
			limit: 20
		};
		assert.equal(val.term, arr.term);
		assert.equal(val.location, arr.location);
		assert.equal(val.category, arr.category);
		assert.equal(val.sort, arr.sort);
		assert.equal(val.limit, arr.limit);
	});
});
describe('YelpHelper', function(){
	it('Json parser with valid input', function(){
		var input ='{"id": 1, "name": "A green door"}';
		yelpHelper.jsonParser(input, (err, result) => {
			console.log(err);
			assert(err == null);
			assert(result);
		});
	});
});
describe('YelpHelper', function(){
	it('Json parser with invalid input', function(){
		var input = {food: 'taco', site: 'philadelphia'};
		yelpHelper.jsonParser(input, (err, result) => {
			console.log(err);
			assert(err);
			assert(result == null);
		});
	});
});