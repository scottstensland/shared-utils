#!/usr/bin/env node 

"use strict";

var shared_utils = require("../");

console.log("here is __dirname ", __dirname );

// var requested_input_filename = process.argv[2] || __dirname + "/Elephant_sounds_rgUFu_hVhlk_roar_mono_tiny.wav";
var requested_input_filename = process.argv[2] || __dirname + "/Elephant_sounds_rgUFu_hVhlk_roar_mono_tiny.wav";




console.log("requested_input_filename ", requested_input_filename );

// ---

// var cb_show_headers = function(error, wav_input_file_obj) {

// 	console.log("TOOOOOOOOOOOP  show_headers");

// 	if (error) {

// 		console.error(error);
// 		return;

// 	} else {

// 		console.log("aaaaaaaaaaabout to call show_object");

// 		shared_utils.show_object(wav_input_file_obj, "file headers", "total", 3);
// 	}
// }

// ------------- now parse headers ------------- //

var wav_input_file_obj = {};

// shared_utils.parse_wav_header(wav_input_file_obj, requested_input_filename, cb_show_headers);
shared_utils.parse_wav_header(wav_input_file_obj, requested_input_filename, function(error, wav_input_file_obj) {

	// console.log("TOOOOOOOOOOOP  show_headers");

	if (error) {
		console.error(error);
		return;
	} else {

		// console.log("aaaaaaaaaaabout to call show_object");

		shared_utils.show_object(wav_input_file_obj, "file headers", "total", 3);
	}
});

// -------- end of run ---------- //

