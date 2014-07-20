
(function(exports) {

// ---

var pop_audio_buffer = function (size_buff, given_samples_per_cycle) {

    /*

    value add of how this populates buffer with sinusoidal curve is the
    curve is assured to both start and stop at the zero cross over threshold,
    independant of supplied input parms which control samples per cycle and buffer size.
    This avoids that "pop" which otherwise happens when rendering audio curve
    which begins at say 0.5 of a possible range -1 to 0 to +1

    */

    // give a default value if not supplied by input parm

    var samples_per_cycle = (typeof given_samples_per_cycle != "undefined") ? 
                                    given_samples_per_cycle : 64;

    if (samples_per_cycle > size_buff) {

        console.log("ERROR - SIZE_BUFFER_SOURCE MUST be larger than samples_per_cycle");
        process.exit(1);
    }

    if (0 != size_buff % samples_per_cycle) {

        console.log("ERROR - samples_per_cycle MUST be a divisor to SIZE_BUFFER_SOURCE");
        process.exit(2);
    }

    var count_num_cycles = size_buff / samples_per_cycle;

    console.log("in pop source buffer  size_buff ", size_buff, 
                " samples_per_cycle ",samples_per_cycle);

    var audio_obj = {};
    
    var source_buffer = new Float32Array(size_buff);

    audio_obj.buffer = source_buffer;
    var running_index = 0;

    var num_samples_per_cycle = size_buff / count_num_cycles;

    console.log("count_num_cycles ", count_num_cycles, 
                " num_samples_per_cycle ", audio_obj.num_samples_per_cycle);

    var incr_theta = (2.0 * Math.PI) / num_samples_per_cycle;

    for (var index = 0; index < count_num_cycles; index++) {

        var index_buff = 0;
        var theta = 0.0;
        do {

            audio_obj.buffer[running_index] = Math.sin(theta);

            console.log("internal fresh ", audio_obj.buffer[running_index]);

            theta += incr_theta;
            running_index++;

        } while (++index_buff < num_samples_per_cycle);
    }
    
    return audio_obj;

};       //      pop_audio_buffer
exports.pop_audio_buffer = pop_audio_buffer;




// ---------------------------------------

// return {    // to make visible to calling reference frame list function here comma delimited,

//   pop_audio_buffer: pop_audio_buffer

// };

// }();    //  audio_utils_obj = function() 

// ---

})(typeof exports === "undefined" ? this["audio_utils"]={}: exports);


