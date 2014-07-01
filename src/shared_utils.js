
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

	// ----------------------

	var show_object = function (given_obj, given_label, given_mode, limit_size_buffer) {

		console.log("_______TOP show_object ", given_label, given_mode);

		// populate defaults if not supplied
		
		var mode = given_mode || "partial";
		var label = given_label || "";

		var size_buffer = limit_size_buffer;

		// if (0 != size_buffer) {

		// 	size_buffer = 10;
		// }

		console.log("_______TOP limit_size_buffer ", limit_size_buffer);
		console.log("_______TOP size_buffer       ", size_buffer);


		if ("partial" == mode) {

		    for (var property in given_obj) {

		        console.log(given_label, " property ", property);
		    }

		} else {

		    for (var property in given_obj) {

		        // console.log(property, "\t property.substring(0,3) \t", property.substring(0,3));

		        if (property.substring(0,3) == "cb_") {

		        	console.log(given_label, property, " ignoring callback");

		        } else if (property == "socket_conn") {

		        	console.log(given_label, property, " ignoring socket connection details");


		        } else if ("buffer" == property || 
		        	   "raw_buffer" == property || 
		  "buffer_input_file_float" == property || 
		        "buffer_input_file" == property)   {

		        		var max_value_seen = -9999999, min_value_seen = 9999999;

			        	console.log(given_label, " about to show ", property);
			        	console.log(given_label, property, " of length ", given_obj[property].length);

			        	var local_min_size_buffer = (given_obj[property].length < size_buffer) ? 
			        							     given_obj[property].length : size_buffer;

			        	var local_max_size_buffer = local_min_size_buffer;

			        	if (local_min_size_buffer == 0) {

			        		local_max_size_buffer = given_obj[property].length;
			        	}

			    		for (var index = 0; index < local_max_size_buffer; index++) {

			        		console.log(given_label, property, "\t", index, given_obj[property][index]);

			        		min_value_seen = (given_obj[property][index] < min_value_seen) ? given_obj[property][index] : min_value_seen;
			        		max_value_seen = (given_obj[property][index] > max_value_seen) ? given_obj[property][index] : max_value_seen;
			    		}
			    		// if (given_obj.buffer.length > local_size_buffer) {
			    		if (given_obj[property].length > local_max_size_buffer) {

			        		console.log(given_label, "\t....... ");
			    		}

			        	console.log(given_label, " min_value_seen ", min_value_seen,
			        							 " max_value_seen ", max_value_seen);
		    	} else {

		    		// if (typeof property === "object") {
		    		// if (typeof given_obj[property] === "object") {

		    		// 	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof

		    		// 	console.log("cool seeing property ", property, " IS typeof object so recurse");

		    		// 	show_object(given_obj[property], given_label + " " + property, 
		    		// 				given_mode, limit_size_buffer);

		    		// } else {

		        		console.log(given_label, " property -->" + property + "<--\t", given_obj[property]);
		    		// }
		    	}
		    }
		}

		console.log("_______ BOTTOM show_object ", given_label, given_mode, " buffer size ",
					given_obj[property].length);
	};
	exports.show_object = show_object;

	// ----------------------

	var diff_entire_buffers = function(left_obj, right_obj, size_buffer, given_spec) {

		console.log("TOP of diff_entire_buffers");

		var total_diffs = 0;

		var left_buffer = left_obj.buffer;
		var right_buffer = right_obj.buffer;

		for (var index = 0; index < size_buffer; index++) {

			total_diffs += Math.abs(left_buffer[index] - right_buffer[index]);
		};

		console.log("total_diffs ", total_diffs);

		given_spec.total_diffs = total_diffs;
	};

	// ---

	var diff_buffers = function (left_obj, right_obj, given_spec) {

		// console.log("here is left_obj ", left_obj);
		// console.log("here is right_obj ", right_obj);


		var extent = "entire";	// default - diff which portions of buffers
		var master = "left";	// default - determines which buffer determines buffer length

		var spec;

	    if (typeof given_spec === "undefined") {

	        console.log("seeing NO input spec so populating with defaults");

	    	spec = { 
						extent : extent,	// diff which portions of buffers
						master : master,	// determines which buffer determines buffer length
					};
		} else {
	        spec = given_spec;
	        console.log("seeing input spec ", spec);
	    };

	    if (typeof spec.extent !== "undefined") {
	        extent = spec.extent;
	        console.log("seeing input spec with spec.extent ", spec.extent);
	    };
	    if (typeof spec.master !== "undefined") {
	        master = spec.master;
	        console.log("seeing input spec with spec.master ", spec.master);
	    };

	    given_spec.extent = extent;
	    given_spec.master = master;

	    console.log("here is spec ", given_spec);
	    console.log("here is extent ", extent);
	    console.log("here is master ", master);

	    var size_buffer;

        switch (master) {

            case "left" : {

                size_buffer = left_obj.buffer.length;
                break;
            }

            case "right" : {

                size_buffer = right_obj.buffer.length;
                break;
            }

            // --- default - catch all if not identifed above

            default :

            console.error("ERROR - failed to find spec.master in diff_buffers");
            process.exit(8);

            break;
        };

	    console.log("size_buffer ", size_buffer);

	    if (size_buffer > left_obj.buffer.length || size_buffer > right_obj.buffer.length) {

            console.error("ERROR - you defined master as : ", master, " yet buffer size is larger than other buffer");
            process.exit(8);
	    };

	    spec.size_buffer = size_buffer;

	    // ---

        switch (extent) {

            case "entire" : {

	            console.log("OK extent is ", extent)    ;

	    		diff_entire_buffers(left_obj, right_obj, size_buffer, given_spec);

	    		break;
            }

            // --- default - catch all if not identifed above

            default :

            console.error("ERROR - failed to find recognized value of spec.extent : ", extent);
            process.exit(8);

            break;
        };

	    console.log("extent ", extent);



	};
	exports.diff_buffers = diff_buffers;

})(typeof exports === "undefined" ? this["shared-utils"]={}: exports);


