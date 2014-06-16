

module.exports.shared_utils = function(spec, my) { // functional inheritance Crockford 2008 pg 52
		
	var that = {},
		spec = spec || {};

	my = my || {};


	/**
	 * Returns a random number between min and max inclusive   
	 */
	var get_random_in_range_inclusive_float = function (min, max) {
	    return Math.random() * (max - min) + min;
	};
	that.get_random_in_range_inclusive_float = get_random_in_range_inclusive_float;

	/**
	 * Returns a random integer between min and max inclusive 
	 * Using Math.round() will give you a non-uniform distribution!
	 */
	var get_random_in_range_inclusive_int = function (min, max) {
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	};
	that.get_random_in_range_inclusive_int = get_random_in_range_inclusive_int;

	// ---

	return that;
};





