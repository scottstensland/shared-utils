#!/usr/bin/env node 

var output_dir = process.argv[2] || "/tmp";

var shared_utils = require("../");

var audio_utils = require("audio-utils");

// console.log("shared_utils ", shared_utils);

// ---

var path = require('path');

// -------------------------------------------------------- //

// var cb_read_file_done = function(audio_obj) {

//     console.log("cb_read_file_done ");
//     console.log("cb_read_file_done ");
//     console.log("cb_read_file_done ");
//     console.log("cb_read_file_done ");

//     shared_utils.show_object(audio_obj, 
//         "backHome audio_obj 32 bit signed float   read_file_done", "total", 0);
// };

// ------------------------------------------------------------------------------------ //

var some_var = 2.07;

console.log(shared_utils.toFixed(some_var, 5));

var some_neg_var = -2.08;

console.log(shared_utils.toFixed(some_neg_var, 5));

// ---------------------

shared_utils.set_random_seed(17); // comment out if U want fresh random sequence for each run 
                                  // otherwise random sequence repeats across subsequent runs of this script

// ------------  synthesize an audio buffer with sin curve ------------  //

// var SIZE_BUFFER_SOURCE = 5;
var SIZE_BUFFER_SOURCE = 256;
// var SIZE_BUFFER_SOURCE = 4096;
// var SIZE_BUFFER_SOURCE = 16384;

var samples_per_cycle = 64;

var source_obj = {}; // we populate its buffer then save to output WAV file 
var target_obj = {}; // then read back WAV file to populate this target buffer then do curve diff to confirm curves match

source_obj = audio_utils.pop_audio_buffer(SIZE_BUFFER_SOURCE, samples_per_cycle);

// ----------------------------

var output_format = ".wav";

console.log(" output_dir ", output_dir);


// ---------- write to output file ------------- //


var source_wave = "source_wave_shared_utils_test";

var source_wave_filename = path.join(output_dir, source_wave + output_format);


console.log("source_wave_filename   ", source_wave_filename);

shared_utils.write_32_bit_float_buffer_to_16_bit_wav_file(source_obj, source_wave_filename);

console.log("source_wave_filename   ", source_wave_filename);

// return;


// ------------ read wav file -------------------- //

console.log("\n\nread wav file\n\n");

// IF you have a pre-defined callback to handle output buffer use this
// shared_utils.read_wav_file(source_wave_filename, cb_read_file_done);

// __ELSE__ this just defines a callback when DONE inline

var MAX_DIFF_ERROR_PERMITTED = 0.1; // percentage error allowed when diffing audio curve pre -vs- post storing in WAV file

var cb_read_done = function(audio_obj) {

    // console.log("cb_read_file_done ");

    console.log("populated buffer size ", audio_obj.buffer.length);

    shared_utils.show_object(audio_obj,
        "audio_obj 32 bit float   cb_read_done", "total", 10);

    var diff_spec = {};

    shared_utils.diff_buffers(source_obj, audio_obj, diff_spec);


    shared_utils.show_object(diff_spec,
        "diff_spec   cb_read_done", "total", 10);

    console.log("diff_spec.total_raw_left ", diff_spec.total_raw_left);
    console.log("diff_spec.total_raw_right ", diff_spec.total_raw_right);
    console.log("diff_spec.total_diffs ", diff_spec.total_diffs);
    console.log("diff_spec.size_buffer ", diff_spec.size_buffer);

    if (SIZE_BUFFER_SOURCE !== diff_spec.size_buffer) {

        console.error("ERROR - seeing mismatch diff_spec.size_buffer " + diff_spec.size_buffer,
            " is NOT same as SIZE_BUFFER_SOURCE " + SIZE_BUFFER_SOURCE);
    } else {

        console.log("OK - seeing exact match SIZE_BUFFER_SOURCE == diff_spec.size_buffer == ",
            diff_spec.size_buffer);
    }

    var actual_error_detected = (2.0 * SIZE_BUFFER_SOURCE * diff_spec.total_diffs) / 
                                (diff_spec.total_raw_left + diff_spec.total_raw_right);

    if (actual_error_detected < MAX_DIFF_ERROR_PERMITTED) {

        console.log("OK - actual_error_detected " + actual_error_detected + " < " +
            MAX_DIFF_ERROR_PERMITTED);

    } else {

        console.error("ERROR - actual_error_detected " + actual_error_detected +
                    " exceeds MAX_DIFF_ERROR_PERMITTED " + MAX_DIFF_ERROR_PERMITTED);
    }
};

shared_utils.read_wav_file(source_wave_filename, cb_read_done);


// ------------------ diff audio between source and target ------------- //
//
//      above we saved source audio buffer to output WAV file then read back WAV file to populate target buffer
//
//      below we diff buffers :  source -vs- target

console.log("source_obj.buffer.length ", source_obj.buffer.length);
// console.log("target_obj.buffer.length ", target_obj.buffer.length);

// ------------------- convert 32 bit float into 16 bit signed ints ------------------ //

var buffer_16_bit_obj = {};

// this method is LOSSY - intended as preliminary step when saving audio into WAV format files
//                        output is a byte array where the 16 bit output format 
//                        is spread across two bytes in little endian ordering

// buffer_16_bit_obj = convert_32_bit_float_into_signed_16_bit_int_lossy(source_obj.buffer);
buffer_16_bit_obj = shared_utils.convert_32_bit_float_into_signed_16_bit_int_lossy(source_obj.buffer);

shared_utils.show_object(buffer_16_bit_obj, "buffer_16_bit_obj", "total", 10);

// --- done --- //


