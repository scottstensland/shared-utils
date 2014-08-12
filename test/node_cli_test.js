#!/usr/bin/env node 

var output_dir = process.argv[2] || "/tmp";

var shared_utils = require("../");

console.log("shared_utils ", shared_utils);

// ---

var path = require('path');

function resolvePath(str) {
  if (str.substr(0, 2) === '~/') {
    str = (process.env.HOME || process.env.HOMEPATH || process.env.HOMEDIR || process.cwd()) + str.substr(1);
  }
  return path.resolve(str);
}

// -------------------------------------------------------- //

function cb_send_to_browser() {

	console.log("TOP TOP TOP cb_send_to_browser");

};

// ---

var cb_read_file_done = function(audio_obj) {

    console.log("cb_read_file_done ");
    console.log("cb_read_file_done ");
    console.log("cb_read_file_done ");
    console.log("cb_read_file_done ");

    shared_utils.show_object(audio_obj, 
        "backHome audio_obj 32 bit signed float   read_file_done", "total", 0);
};

// ------------------------------------------------------------------------------------ //

var some_var = 2.07;

console.log(shared_utils.toFixed(some_var, 5));

var some_neg_var = -2.08;

console.log(shared_utils.toFixed(some_neg_var, 5));

// ---------------------

shared_utils.set_random_seed(17); // comment out if U want fresh random sequence for each run ... o/w sequence repeats

// ------------  synthesize an audio buffer  ------------  //

// var SIZE_BUFFER_SOURCE = 5;
var SIZE_BUFFER_SOURCE = 256;
// var SIZE_BUFFER_SOURCE = 4096;
// var SIZE_BUFFER_SOURCE = 16384;


var source_obj = {};

source_obj.buffer = new Float32Array(SIZE_BUFFER_SOURCE);

var max_index = SIZE_BUFFER_SOURCE;

for (var index = 0; index < max_index; index++) {

    source_obj.buffer[index] = shared_utils.get_random_in_range_inclusive_float(-1.0, 1.0);

    console.log(index, " pop_audio_buffer ", source_obj.buffer[index]);
}

// ----------------------------



// var output_dir = resolvePath(process.env.AUDIO_DIR);

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

shared_utils.read_wav_file(source_wave_filename, (function(audio_obj) {

    console.log("cb_read_file_done ");

	console.log("populated buffer size ", audio_obj.buffer.length);

    shared_utils.show_object(audio_obj,
        "backHome audio_obj 32 bit signed float   read_file_done", "total", 10);
}));


// --- done --- //


