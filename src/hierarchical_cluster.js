
(function(exports) {

	var shared_utils = require('./shared_utils');

	var get_random = shared_utils.get_random_in_range_inclusive_float;	// default
	var flavor_random = "float";			// default
	// var flavor_random = "integer";			// default
	var flavor_typed_array = Float32Array;	// default
	var print_output = {};

	var max_num_curves = 10;		// default values
	var max_samples = 5;	// default
	var min_value = 0.0;			// default
	var max_value = 10.0;			// default
	var flag_print = true;			// default

	var flag_are_curves_populated = false;
	var all_curves = [];	// main datastructure holding all curves and all their samples per curve

	var curve_pairs_already_calculated = {}; // during distance calc record pairings of curve A and curve B
											 // to avoid redundant calc of same pair when visiting B once A has happened

	// ---

	var set_flavor_random_curves = function(desired_data_type) {

		switch (desired_data_type) {

			case "integer" :
				get_random = shared_utils.get_random_in_range_inclusive_int;
				flavor_typed_array = Int32Array;
				break;

			case "float" :
				get_random = shared_utils.get_random_in_range_inclusive_float;
				flavor_typed_array = Float32Array;
				break;

			default :
				var err_msg = "ERROR - invalid parm desired_data_type - legal values are 'integer' or 'float'";
				console.error(err_msg);
				process.exit(8);
		};

		flavor_random = desired_data_type;

	};		//		do NOT export - this is ONLY visible locally

	var no_op = function() {

		// place holder for a  no operation function
	}

	// ---

	var show_curves = function() {

		if (! flag_are_curves_populated) {

			console.error("ERROR - you have NOT populated curves yet ... try calling : gen_curves or ...");
			process.exit(8);
		}

		console.log("\n_____________ show_curves  with ", 
					max_num_curves, " curves, ", max_samples, " samples per curve\n");

		for (var curr_curve = 0; curr_curve < max_num_curves; curr_curve++) {

			var curr_curve_samples = all_curves[curr_curve];

			for (var curr_sample = 0; curr_sample < max_samples; curr_sample++) {

				var curr_value = curr_curve_samples[curr_sample];

				console.log(curr_curve, curr_sample, curr_value);
			};

			all_curves[curr_curve] = curr_curve_samples;
		};
	};
	exports.show_curves = show_curves;

	// ---

	var gen_curves = function(given_spec) {

		var spec = {};

		if (typeof given_spec !== "undefined") {

			spec = given_spec;
		};

		max_num_curves = typeof spec.max_num_curves !== "undefined" ? spec.max_num_curves : max_num_curves;
		max_samples	   = typeof spec.max_samples    !== "undefined" ? spec.max_samples    : max_samples;
		min_value	   = typeof spec.min_value      !== "undefined" ? spec.min_value      : min_value;
		max_value	   = typeof spec.max_value      !== "undefined" ? spec.max_value      : max_value;
		flavor_random  = typeof spec.flavor_random  !== "undefined" ? spec.flavor_random  : flavor_random;
		flag_print	   = typeof spec.flag_print     !== "undefined" ? spec.flag_print     : flag_print;

		// ---

		console.log(" max_num_curves ", max_num_curves, 
					" max_samples ", max_samples,
					" min_value ", min_value,
					" max_value ", max_value,
					" flavor_random ", flavor_random,
					" flag_print ", flag_print
					);

		print_output = flag_print ? console.log : no_op;

		set_flavor_random_curves(flavor_random);	// set relevant methods based on chosen data type

		for (var curr_curve = 0; curr_curve < max_num_curves; curr_curve++) {

			var curr_curve_samples = new flavor_typed_array(max_samples);

			for (var curr_sample = 0; curr_sample < max_samples; curr_sample++) {

				curr_curve_samples[curr_sample] = get_random(min_value, max_value);

				print_output(curr_curve, curr_sample, curr_curve_samples[curr_sample]);				
			};

			all_curves[curr_curve] = curr_curve_samples;
		};
		flag_are_curves_populated = true;
	};
	exports.gen_curves = gen_curves;

	// ---

	var calc_distance = function(left_curve_samples, right_curve_samples) {

		var total_distance = 0;
		var tmp_value;

		for (var curr_sample = 0; curr_sample < max_samples; curr_sample++) {

			var curr_value_left  =  left_curve_samples[curr_sample];
			var curr_value_right = right_curve_samples[curr_sample];

			tmp_value = (left_curve_samples[curr_sample] - right_curve_samples[curr_sample]);
			total_distance +=  Math.sqrt(tmp_value * tmp_value);
		};

		return total_distance;	
	};


	var do_clustering = function() {

		console.log("_________ do_clustering _____________");

		for (var curr_curve = 0; curr_curve < max_num_curves; curr_curve++) {

			var curr_curve_samples = all_curves[curr_curve];

			var min_distance = 99999.99;
			var closest_other_inner_curve;
			var curr_distance;

			for (var curr_inner_curve = 0; curr_inner_curve < max_num_curves; curr_inner_curve++) {

				if (curr_inner_curve === curr_curve) continue; // skip over self

				// all_curves[curr_curve] = curr_curve_samples;

				var combo_key = (curr_curve < curr_inner_curve) ? ("" + curr_curve + ":" + curr_inner_curve) :
																  ("" + curr_inner_curve + ":" + curr_curve);

				if (curve_pairs_already_calculated.hasOwnProperty(combo_key)) {

					// console.log("already did calc on ", combo_key);

					curr_distance = curve_pairs_already_calculated[combo_key];

				} else {

					curr_distance = calc_distance(curr_curve_samples, all_curves[curr_inner_curve]);

					curve_pairs_already_calculated[combo_key] = curr_distance;
				}

				if (curr_distance < min_distance) {

					min_distance = curr_distance;
					closest_other_inner_curve = curr_inner_curve;
				}

				console.log(curr_curve, curr_inner_curve, combo_key, curr_distance);
			};

			console.log(curr_curve, "closest_other_inner_curve ", closest_other_inner_curve, min_distance);
		};

	};
	exports.do_clustering = do_clustering;

	// ---

})(typeof exports === "undefined" ? this["hierarchical_cluster"]={}: exports);

