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


var some_var = 2.07;

console.log(shared_utils.toFixed(some_var, 5));

var some_neg_var = -2.08;

console.log(shared_utils.toFixed(some_neg_var, 5));

// var toFixed = function(value, precision) {


return;

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


/*
// var aaa = 0xFFFFFFFFF;
var aaa = 0x00000FFFF; // 2^16 == 65535

var bbb = 75535;

var ccc = 75535 & 0x00000FFFF;

console.log("ccc ", ccc);

process.exit(8);
*/


// ---

shared_utils.copy_properties_across_objects(source_obj, target_obj);

console.log("here is source_obj ", source_obj);

console.log("here is target_obj ", target_obj);


// ------------  synthesize an audio buffer  ------------  //


SIZE_BUFFER_SOURCE = 16;
// SIZE_BUFFER_SOURCE = 256;
// SIZE_BUFFER_SOURCE = 16384;

// ---- must be one of : 256, 512, 1024, 2048, 4096, 8192, or 16384

// SIZE_BUFFER_RENDER = 1024; // web audio node buffer size which does actual rendering

var samples_per_cycle = SIZE_BUFFER_SOURCE;
var samples_per_cycle = 4;
// var samples_per_cycle = 64;
// var samples_per_cycle = 256;

var source_obj = {};

var source_obj = audio_utils.pop_audio_buffer(SIZE_BUFFER_SOURCE, samples_per_cycle);

// var max_index = 3;
// var max_index = SIZE_BUFFER_SOURCE;

for (var index = 0; index < source_obj.buffer.length; index++) {

    console.log(index, " source_obj ", source_obj.buffer[index]);
}


return;

// --- take 32 bit float buffer ... convert into 16 bit integer array then back into 32 bit float buffer

var output_16_bit_audio_obj = {};

output_16_bit_audio_obj.buffer = shared_utils.convert_32_bit_float_into_signed_16_bit_int_lossy(source_obj.buffer);


for (var index = 0; index < output_16_bit_audio_obj.buffer.length; index++) {

    console.log(index, " output_16_bit_audio_obj ", output_16_bit_audio_obj.buffer[index]);
}



return;


/*
var bigger = 0x80;    // 128
var littler = 0x7F;   // 127

var source_number = -0.5;
var target_number;

target_number = ~~((source_number + 1.0) * 32768) - 1;

// target_number = source_number << 1;

console.log(" source_number ", source_number);
console.log(" target_number ", target_number);
*/
// ---
/*
var array_source_nums = [];
var array_target_nums = [];

array_source_nums.push(0.0);
array_source_nums.push(1.0);
array_source_nums.push(-1.0);


console.log(" array_source_nums ", array_source_nums);

array_source_nums.forEach(function( curr_number, i ) {  //  where 0x80 == 128  ... == 0x7F == 127

    // array_target_nums[i] = curr_number < 0 ? curr_number / 0x80 : curr_number / 0x7F;
    // array_target_nums[i] = ~~(curr_number >> 16 + 32767);
    array_target_nums[i] = ~~(curr_number >> 16);
});

console.log(" array_target_nums ", array_target_nums);


process.exit(8);
*/


  // dstU8.set(srcU8);
  
// new_16_bit_array.set(source_obj.buffer);


var new_16_bit_obj = {};

// new_16_bit_obj.buffer = shared_utils.convert_32_bit_float_into_unsigned_16_bit_int(source_obj.buffer);

// shared_utils.show_object(new_16_bit_obj.buffer, "total",
//             "teeeest new_16_bit_obj teeeest", new_16_bit_obj.buffer.length);

// ---

var size_source_buffer = 4;

var new_16_bit_array = new Uint16Array(size_source_buffer);

new_16_bit_array[0] = 0;
new_16_bit_array[1] = 32767;
new_16_bit_array[2] = 32768;
// new_16_bit_array[3] = 65520;
new_16_bit_array[3] = 65536 - 1;

new_16_bit_obj.buffer = new_16_bit_array;

// for (var index = 0; index < new_16_bit_array.length; index++) {

//     console.log("new_16_bit_array ", index, new_16_bit_array[index]);
// }

// --------------------------------

var new_32_bit_obj = {};

            // new_32_bit_array[index] = given_16_bit_buffer[index] / 32767 - 1.0;


for (var index = 0; index < size_source_buffer; index++) {

    // console.log("new_16_bit_array ", index, new_16_bit_array[index], new_16_bit_array[index] / 32767 - 1.0);
    console.log("new_16_bit_array ", index, new_16_bit_array[index], new_16_bit_array[index] / 32768 - 1.0);
}


process.exit(8);



new_32_bit_obj.buffer = shared_utils.convert_16_bit_unsigned_int_to_32_bit_float(new_16_bit_obj.buffer);



shared_utils.show_object(new_32_bit_obj.buffer, "total",
            "teeeest new_32_bit_obj teeeest", new_32_bit_obj.buffer.length);

 // --- now convert back into 16 bit ints --- //

for (var index = 0; index < size_source_buffer; index++) {

            // new_16_bit_array[index] = ~~((new_32_bit_obj.buffer[index] + 1.0) * 32768) - 1;

    var some_var = 1.0 + new_32_bit_obj.buffer[index];
    var other_var = (1.0 + new_32_bit_obj.buffer[index]) << 15;
    var again_var = ~~((1.0 + new_32_bit_obj.buffer[index]) * 32768);

    console.log("CCCCcscc new_16_bit_obj ", index, new_16_bit_array[index], new_32_bit_obj.buffer[index], 
                                        some_var, other_var, again_var);

/*
    console.log("CCCCcscc new_16_bit_obj ", index, new_16_bit_array[index], new_32_bit_obj.buffer[index], 
                                        // ~~((new_32_bit_obj.buffer[index] + 1.0) * 32768) - 1);
                                        // ~~((new_32_bit_obj.buffer[index] + 1.0) * 32768)); // OK good one
                                        // ~~(some_var * 32768)); 
                                        ~~(some_var << 15)); 
                                        // ~~((new_32_bit_obj.buffer[index] + 1.0) << 16));
                                        // ~~((new_32_bit_obj.buffer[index] + 1.0) << 16));
                                        // ~~((new_32_bit_obj.buffer[index] + 1.0) << 15));
*/
}


// new_16_bit_obj.buffer = shared_utils.convert_32_bit_float_into_unsigned_16_bit_int(source_obj.buffer);

var back_again_16_bit_unsigned_obj = {};

back_again_16_bit_unsigned_obj.buffer = shared_utils.convert_32_bit_float_into_unsigned_16_bit_int_lossy(new_32_bit_obj.buffer);

shared_utils.show_object(back_again_16_bit_unsigned_obj.buffer, "total",
            "bbbbbbacd back_again_16_bit_unsigned_obj bbbbbbacd", back_again_16_bit_unsigned_obj.buffer.length);

process.exit(8);


// var bigger = 0x8000;    // 32768
// var littler = 0x7FFF;   // 32767

var new_spot = {};

// var new_buffer = new Uint16Array(source_obj.buffer);
new_spot.buffer = new Uint16Array(source_obj.buffer);

// console.log(" new_buffer.length ", new_buffer.buffer[index]);

// new_spot.buffer = new_buffer;

shared_utils.show_object(new_spot.buffer, "total",
            "teeeest new_spot teeeest", new_spot.buffer.length);

// ---

var bigger = 0x80;    // 128
var littler = 0x7F;   // 127


var source_number = -0.5;
var target_number;

target_number = ~~(source_number * ((source_number < 0) ? bigger : littler));

console.log("source_number ", source_number, " target_number ", target_number);



target_number = (source_number < 0) ?  ~~(source_number / bigger) : ~~(source_number / littler);

console.log("source_number ", source_number, " target_number ", target_number);


        // same_value_in_16_bit_signed_int = ~~(input_32_bit_float_audio_obj.buffer[index_float] * 
        //                                     ((input_32_bit_float_audio_obj.buffer[index_float] < 0) ? 0x8000 : 0x7FFF));



process.exit(8);



var output_16_bit_audio_obj = {};

// shared_utils.convert_32_bit_floats_into_16_bit_ints(source_obj, output_16_bit_audio_obj);

output_16_bit_audio_obj.buffer = shared_utils.convert_32_bit_float_into_signed_16_bit_int_lossy(source_obj.buffer);



shared_utils.show_object(output_16_bit_audio_obj, "total",
            "teeeest output_16_bit_audio_obj teeeest", output_16_bit_audio_obj.buffer.length);

// bbb

var play_32_bit_float_obj = {};

// var play_32_bit_float_obj.buffer = convert_16_bit_signed_ints_into_32_bit_floats(output_16_bit_audio_obj.buffer, output_16_bit_audio_obj.buffer.length);
// var some_32_bit_float_buffer = shared_utils.convert_16_bit_signed_ints_into_32_bit_floats(
//                                                 output_16_bit_audio_obj.buffer, 
//                                                 output_16_bit_audio_obj.buffer.length);
// play_32_bit_float_obj.buffer = some_32_bit_float_buffer;

// play_32_bit_float_obj.buffer = new Float32Array(output_16_bit_audio_obj.buffer);

shared_utils.show_object(play_32_bit_float_obj, "total",
        "pppsssyyyuuuu play_32_bit_float_obj pppsssyyyuuuu", play_32_bit_float_obj.buffer.length);


process.exit(8);


// --- exercise both read and write WAV audio format file --- //

console.log("... OK   exercise both read and write WAV audio format file  ");

// bbb


var source_wave_filename = "/tmp/source_wave_test.wav";

shared_utils.write_buffer_to_wav_file(source_obj, source_wave_filename);

console.log("source_wave_filename   ", source_wave_filename);






process.exit(8);



// var audio_file_obj = {};

// for (var property in audio_file_obj) {

//     console.log("ttttttttt grow_tune property ", property, audio_file_obj[property]);
// }

var wav_file_input_obj = {};  // create stub object to which we attach .buffer


var property_buffer_raw_input_file = "buffer_raw_input_file";
var property_buffer_input_file     = "buffer_input_file";

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




