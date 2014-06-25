#!/usr/bin/env node 


// var shared_utils_obj = require("shared-utils");
var shared_utils = require("../src/node_utils");
var audio_utils  = require("../src/audio_utils");

console.log("shared_utils ", shared_utils);


// var shared_utils = shared_utils_obj.shared_utils();
// var shared_utils = shared_utils_obj.shared_utils;

// ---

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




