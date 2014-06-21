#!/usr/bin/env node 





// var shared_utils_obj = require("shared-utils");
var shared_utils_obj = require("../src/shared_utils");
var shared_utils = shared_utils_obj.shared_utils();

// ---

var that = {},
	spec = spec || { name : "Corinde Wiers"};


var max_index = 3;
var curr_value;
for (var index = 0; index < max_index; index++) {


	curr_value = shared_utils.get_random_in_range_inclusive_float(-1.0, 1.0);

	console.log(index, " random float ", curr_value);
}


