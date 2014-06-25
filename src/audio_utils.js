

(function(exports) {

// var audio_utils_obj = function() {

// ---

var pop_audio_buffer = function (size_buff, given_samples_per_cycle) {

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

    // var count_num_cycles = 2;

    audio_obj.buffer = source_buffer;
    audio_obj.running_index = 0;
    audio_obj.num_samples_per_cycle = size_buff / count_num_cycles;

    console.log("count_num_cycles ", count_num_cycles, 
                " num_samples_per_cycle ", audio_obj.num_samples_per_cycle);


    var num_samples_per_cycle = audio_obj.num_samples_per_cycle;

    var incr_theta = (2.0 * Math.PI) / num_samples_per_cycle;

    for (var index = 0; index < count_num_cycles; index++) {

        // console.log("____ another cycle ___");

        var index_buff = 0;
        var theta = 0.0;
        do {

            audio_obj.buffer[audio_obj.running_index] = Math.sin(theta);

            theta += incr_theta;
            audio_obj.running_index++;

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


