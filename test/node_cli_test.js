#!/usr/bin/env node 

var shared_utils = require("../src/node_utils");
var audio_utils  = require("../src/audio_utils");

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


	// var show_object = function (given_obj, given_label, given_mode, limit_size_buffer)

    shared_utils.show_object(input_obj, "input_obj", "total", 88);

    // var buff_size_from_file = input_obj[property_buffer_input_file].length;
    // var size_buffer = 256;
};

// ------------------------------------------------------------------------------------ //

var that = {},
	spec = spec || { name : "Corinde Wiers"};

shared_utils.set_random_seed(17);

var max_index = 3;
var curr_value;
for (var index = 0; index < max_index; index++) {


	curr_value = shared_utils.get_random_in_range_inclusive_float(-1.0, 1.0);

	console.log(index, " random float ", curr_value);
}


var source_obj = {

	aaa :  "aaaa",
	bbb :  "babab"
};

var target_obj = {};



shared_utils.copy_properties_across_objects(source_obj, target_obj);

console.log("here is source_obj ", source_obj);

console.log("here is target_obj ", target_obj);


// ------------  synthesize an audio buffer  ------------  //


SIZE_BUFFER_SOURCE = 256;
// SIZE_BUFFER_SOURCE = 16384;

// ---- must be one of : 256, 512, 1024, 2048, 4096, 8192, or 16384

// SIZE_BUFFER_RENDER = 1024; // web audio node buffer size which does actual rendering

// var samples_per_cycle = 64;
var samples_per_cycle = 256;

var source_obj = {};

var source_obj = audio_utils.pop_audio_buffer(SIZE_BUFFER_SOURCE, samples_per_cycle);

// var max_index = 3;
var max_index = SIZE_BUFFER_SOURCE;

for (var index = 0; index < max_index; index++) {

    console.log(index, " pop_audio_buffer ", source_obj.buffer[index]);
}


// --- exercise both read and write WAV audio format file --- //

console.log("... OK   exercise both read and write WAV audio format file  ");

var property_buffer_raw_input_file = "buffer_raw_input_file";
var property_buffer_input_file     = "buffer_input_file";

// bbb

// var audio_file_obj = {};

// for (var property in audio_file_obj) {

//     console.log("ttttttttt grow_tune property ", property, audio_file_obj[property]);
// }

var wav_file_input_obj = {};  // create stub object to which we attach .buffer

// shared_utils.copy_properties_across_objects(audio_file_obj, wav_file_input_obj);

// wav_file_input_obj.filename = audio_file_obj.wav_input_filename;
// wav_file_input_obj.filename = "Elephant_sounds_rgUFu_hVhlk_roar_mono_tiny.wav";
wav_file_input_obj.filename = "/tmp/source_wave.wav";

// -rw-rw-r--  1 stens stens 8236 Jul  1 17:24 source_wave.wav
// -rw-rw-r--  1 stens stens 8236 Jul  1 17:24 genome_synth_raw.wav
// -rw-rw-r--  1 stens stens 8236 Jul  1 17:24 genome_synth_evolved.wav



wav_file_input_obj[property_buffer_raw_input_file] = new Buffer(0);

console.log("grow curve  read input file ", wav_file_input_obj.filename);
console.log("grow curve  read input file ", wav_file_input_obj.filename);
console.log("grow curve  read input file ", wav_file_input_obj.filename);
console.log("grow curve  read input file ", wav_file_input_obj.filename);
console.log("grow curve  read input file ", wav_file_input_obj.filename);
console.log("grow curve  read input file ", wav_file_input_obj.filename);
console.log("grow curve  read input file ", wav_file_input_obj.filename);
console.log("grow curve  read input file ", wav_file_input_obj.filename);
console.log("grow curve  read input file ", wav_file_input_obj.filename);
console.log("grow curve  read input file ", wav_file_input_obj.filename);
console.log("grow curve  read input file ", wav_file_input_obj.filename);

// wav_file_input_obj.socket_conn = given_socket_conn; // to enable comm back to client

// wav_file_input_obj.cb_to_client = send_answer_back_to_browser;
wav_file_input_obj.cb_to_client = cb_send_to_browser;

// wav_file_input_obj.flavor = given_flavor;

shared_utils.read_file_into_buffer(wav_file_input_obj, property_buffer_raw_input_file,
                                property_buffer_input_file,
                                cb_after_reading_input_file_grow_curve);






