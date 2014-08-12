#!/usr/bin/env node 

console.log("here is __dirname ", __dirname );

var input_filename = process.argv[2] || __dirname + "/Elephant_sounds_rgUFu_hVhlk_roar_mono_tiny.wav";

console.log("input_filename ", input_filename );

var shared_utils = require("../");

// ---

var cb_read_file_done = function(audio_obj) {

    console.log("cb_read_file_done ");
    console.log("cb_read_file_done ");
    console.log("cb_read_file_done ");
    console.log("cb_read_file_done ");

    shared_utils.show_object(audio_obj, 
        "backHome audio_obj 32 bit signed float   read_file_done", "total", 10);
};

// ------------ read wav file -------------------- //

// shared_utils.read_wav_file(input_filename, cb_read_file_done);

shared_utils.read_wav_file(input_filename, (function(audio_obj) {

    console.log("cb_read_file_done ");

	console.log("populated buffer size ", audio_obj.buffer.length);

    shared_utils.show_object(audio_obj,
        "backHome audio_obj 32 bit signed float   read_file_done", "total", 10);
}));

// -------- end of run ---------- //

