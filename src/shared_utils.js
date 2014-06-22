
(function(exports) {

	/**
	 * Returns a random number between min and max inclusive   
	 */
	var get_random_in_range_inclusive_float = function (min, max) {
	    return Math.random() * (max - min) + min;
	};
	exports.get_random_in_range_inclusive_float = get_random_in_range_inclusive_float;

	/**
	 * Returns a random integer between min and max inclusive 
	 * Using Math.round() will give you a non-uniform distribution!
	 */
	var get_random_in_range_inclusive_int = function (min, max) {
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	};
	exports.get_random_in_range_inclusive_int = get_random_in_range_inclusive_int;

	// ---

})(typeof exports === "undefined" ? this["shared-utils"]={}: exports);


