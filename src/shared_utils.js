
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


