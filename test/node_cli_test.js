#!/usr/bin/env node 

var environment_mode = process.argv[2] || "dev";

console.warn("running code in environment_mode: ", environment_mode);

// ---

var path = require('path');

function resolvePath(str) {
  if (str.substr(0, 2) === '~/') {
    str = (process.env.HOME || process.env.HOMEPATH || process.env.HOMEDIR || process.cwd()) + str.substr(1);
  }
  return path.resolve(str);
}

// -------------------------------------------------------- //

console.log("do_clustering  ....  environment_mode ", environment_mode);

var that = {};
var shared_utils;

switch (environment_mode) {

    case "nubia": // repository owner tinkering mode - ignore it 
    
        var local_github_parent = process.env.GITHUB_REPO_PARENT;

        if ( ! local_github_parent ) {

            console.error("ERROR - do not use environment_mode value of :", environment_mode, 
                            " instead use dev or leave blank");
            process.exit(8);
        }

        console.log("environment_mode is ", environment_mode, " so pulling in sibling dir source code");
        shared_utils   = require(resolvePath(local_github_parent + "shared-utils/src/node_utils"));
        break;

    case "dev":
        shared_utils   = require("shared-utils");    // get these modules from global install
        break;

    default :
        shared_utils   = require("shared-utils");
        break;
};

console.log("shared_utils ", shared_utils);

// ---

function cb_send_to_browser() {

	console.log("TOP TOP TOP cb_send_to_browser");

};

function cb_after_reading_input_file_grow_curve(input_obj, property_buffer_raw_input_file, property_buffer_input_file) {

    console.log("TOP TOP TOP cb_after_reading_input_file_grow_curve");

    // sync NOT async ... output into buffer_input_file
    shared_utils.parse_wav(input_obj, property_buffer_raw_input_file, property_buffer_input_file);

    delete input_obj[property_buffer_raw_input_file];    // no longer need raw pre parse buffer

    console.log("buffer size ", input_obj[property_buffer_input_file].length);
    console.log("buffer size ", input_obj[property_buffer_input_file].length);
    console.log("buffer size ", input_obj[property_buffer_input_file].length);

    shared_utils.show_object(input_obj, "input_obj", "total", 88);
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

shared_utils.set_random_seed(17);

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


var output_dir = resolvePath("~/Dropbox/Documents/data/audio/");

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

var wav_file_input_obj = {};  // create stub object to which we attach .buffer


var property_buffer_raw_input_file = "buffer_raw_input_file";
var property_buffer_input_file     = "buffer_input_file";

wav_file_input_obj.filename = source_wave_filename;


wav_file_input_obj[property_buffer_raw_input_file] = new Buffer(0);


console.log("abouttttt to read wav_file_input_obj.filename ", wav_file_input_obj.filename);

var spec = {};

shared_utils.read_16_bit_wav_file_into_32_bit_float_buffer(
                                wav_file_input_obj,
                                wav_file_input_obj.filename, 
                                spec,
                                cb_read_file_done);







