
(function(exports) {

	var local_random = Math.random;

	var set_random_seed = function(given_seed) {

		Math.seed = function(s) {
		    return function() {
		        s = Math.sin(s) * 10000; return s - Math.floor(s);
		    };
		};

		// usage:
		var random1 = Math.seed(given_seed);
		var random2 = Math.seed(random1());
		// Math.random = Math.seed(random2());
		local_random = Math.seed(random2());
	};
	exports.set_random_seed = set_random_seed;

	// ---


	/**
	 * Returns a random number between min and max inclusive   
	 */
	var get_random_in_range_inclusive_float = function (min, max) {
	    // return Math.random() * (max - min) + min;
	    return local_random() * (max - min) + min;
	};
	exports.get_random_in_range_inclusive_float = get_random_in_range_inclusive_float;

	/**
	 * Returns a random integer between min and max inclusive 
	 * Using Math.round() will give you a non-uniform distribution!
	 */
	var get_random_in_range_inclusive_int = function (min, max) {
	    // return Math.floor(Math.random() * (max - min + 1)) + min;
	    return Math.floor(local_random() * (max - min + 1)) + min;
	};
	exports.get_random_in_range_inclusive_int = get_random_in_range_inclusive_int;

	// ---

})(typeof exports === "undefined" ? this["shared-utils"]={}: exports);


