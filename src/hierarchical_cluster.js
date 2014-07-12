
(function(exports) {

	/*

		hierarchical agglomerative clustering - bottom up clustering approach

	*/

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

	var hierarchical_cluster = {}; // bottom up tree start from each curve number, branching up through cluster layers
	var curr_cluster_depth = 0;
	var centroid = "centroid";

	var all_clusters = [];
	var curr_num_cluster = 0;

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

	// ---

	var gen_pair_str = function(left_number, right_number) {

		return (left_number < right_number) ? (left_number  + ":" + right_number) :
											  (right_number + ":" + left_number);
	};


	var do_clustering = function() {		//		hierarchical agglomerative clustering

		console.log("_________ do_clustering _____________");


		// var hierarchical_cluster = [];
		// var curr_cluster_depth = 0;

		var curr_cluster_this_depth_level = 0;

		for (var curr_curve = 0; curr_curve < max_num_curves; curr_curve++) {

			console.log("\n      ", curr_curve, " <><><>   <><><>   <><><>   curr_curve <><><>   <><><>   <><><>\n");

			var curr_curve_samples = all_curves[curr_curve];

			var min_distance = 99999.99;
			var closest_other_inner_curve;
			var curr_distance;

			for (var curr_inner_curve = 0; curr_inner_curve < max_num_curves; curr_inner_curve++) {

				if (curr_inner_curve === curr_curve) continue; // skip over self

				// var combo_key = (curr_curve < curr_inner_curve) ? (curr_curve       + ":" + curr_inner_curve) :
				// 												  (curr_inner_curve + ":" + curr_curve);

				var combo_key = gen_pair_str(curr_curve, curr_inner_curve);


				if (curve_pairs_already_calculated.hasOwnProperty(combo_key)) {

					//   already did calc on this pair of curves ... no need to redo same calculation

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

			// --- burrow down to find or create cluster to put current pair of curves --- //

			var curr_own_key   = curr_cluster_depth + ":" + curr_curve;
			var curr_other_key = curr_cluster_depth + ":" + closest_other_inner_curve;

			console.log("curr_own_key ", curr_own_key);
			console.log("curr_other_key ", curr_other_key);


			var curr_active_num_cluster;
			var curr_active_cluster;

			// we know current curve is NOT yet in a cluster ... BUT we do NOT know if other curve is or not

			if (hierarchical_cluster.hasOwnProperty(curr_other_key)) {

				console.log("OOOKKKKKK found curr_other_key in hierarchical_cluster");

				curr_active_num_cluster = hierarchical_cluster[curr_other_key];

				curr_active_cluster = all_clusters[curr_active_num_cluster];

				console.log("OK found curr_other_key ", curr_other_key, 
							" as key of hierarchical_cluster ", hierarchical_cluster);

				console.log("curr_active_num_cluster ", curr_active_num_cluster);
				console.log("curr_active_cluster ", curr_active_cluster);

				// -----


				curr_active_cluster[curr_curve] = curr_curve;

				all_clusters[curr_active_num_cluster] = curr_active_cluster;

				hierarchical_cluster[curr_own_key]   = curr_active_num_cluster;

			} else {

			// if (typeof curr_active_cluster === "undefined") { // neither curve is in a cluster for this cluster depth

				console.log("seeing curr_active_cluster undefined ... so create new curr_active_cluster");
				console.log("curr_num_cluster ", curr_num_cluster);
				console.log("curr_num_cluster ", curr_num_cluster);
				console.log("curr_num_cluster ", curr_num_cluster);
				console.log("curr_num_cluster ", curr_num_cluster);

				// curr_active_cluster = {

				// 	curr_curve : curr_curve,
				// 	closest_other_inner_curve : closest_other_inner_curve
				// };

				curr_active_cluster = {};

				curr_active_cluster[curr_curve] = curr_curve;
				curr_active_cluster[closest_other_inner_curve] = closest_other_inner_curve;
				
				console.log("curr_active_cluster ", curr_active_cluster);

				all_clusters[curr_num_cluster] = curr_active_cluster;

				hierarchical_cluster[curr_own_key]   = curr_num_cluster;
				hierarchical_cluster[curr_other_key] = curr_num_cluster;

				curr_num_cluster++;
			};


			// --------------- ignore below ---------------- //

			/*
			var clusters_this_level = {};

			if (hierarchical_cluster.hasOwnProperty(curr_cluster_depth)) {

				clusters_this_level = hierarchical_cluster[curr_cluster_depth];
			};

			var this_cluster_str;

			if (clusters_this_level.hasOwnProperty(closest_other_inner_curve)) {

				this_cluster_str = clusters_this_level[closest_other_inner_curve];

				console.log(".......... just retrieved this_cluster_str ", this_cluster_str, 
							" from clusters_this_level ", closest_other_inner_curve);
			};

			if (typeof this_cluster_str === "undefined") {

				console.log("pppppp curr_cluster_depth ", curr_cluster_depth, 
							" curr_cluster_this_depth_level ", curr_cluster_this_depth_level);

				this_cluster_str = curr_cluster_depth + ":" + curr_cluster_this_depth_level;

				curr_cluster_this_depth_level++;
			};

			console.log("ssssssssssss  this_cluster_str ", this_cluster_str);

			var this_cluster = {};

			if (all_clusters.hasOwnProperty(this_cluster_str)) {

				this_cluster = all_clusters[this_cluster_str];
			};

			this_cluster[curr_curve]				= this_cluster_str;
			this_cluster[closest_other_inner_curve] = this_cluster_str;

			// --- now build it back up --- //

			all_clusters[this_cluster_str] = this_cluster;

			clusters_this_level[curr_curve] 			   = this_cluster_str;
			clusters_this_level[closest_other_inner_curve] = this_cluster_str;

			hierarchical_cluster[curr_cluster_depth] = clusters_this_level;
			*/

			console.log("\n\n--------- hierarchical_cluster ", hierarchical_cluster);
			console.log("\n\n--------- all_clusters ", all_clusters);
		};
	
		curr_cluster_depth++;

	};
	exports.do_clustering = do_clustering;

	// ---

})(typeof exports === "undefined" ? this["hierarchical_cluster"]={}: exports);

