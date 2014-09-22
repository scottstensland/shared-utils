#!/usr/bin/env node 

console.log("here is __dirname ", __dirname );

var input_filename = process.argv[2] || __dirname + "/Elephant_sounds_rgUFu_hVhlk_roar_mono_tiny.wav";

console.log("input_filename ", input_filename );

var shared_utils = require("../");

// ---

// ------------ read wav file -------------------- //

var list_files_this_dir = process.env.PWD;
var all_files = [];

shared_utils.list_files_in_dir_sync(list_files_this_dir, all_files);

console.log("list_files_in_dir_sync for dir ", list_files_this_dir, " is ",  all_files);


// -------- end of run ---------- //

