
(function(exports) {

// console.log(require('../package.json').name, require('../package.json').version);

var shared_utils = require('./shared_utils');

var fs = require('fs');
    
// ---

exports.get_random_in_range_inclusive_float             = shared_utils.get_random_in_range_inclusive_float;
exports.get_random_in_range_inclusive_int               = shared_utils.get_random_in_range_inclusive_int;
exports.set_random_seed                                 = shared_utils.set_random_seed;
exports.diff_buffers                                    = shared_utils.diff_buffers;
exports.show_object                                     = shared_utils.show_object;
exports.release_all_prop_from_object                    = shared_utils.release_all_prop_from_object;


exports.convert_32_bit_float_into_unsigned_16_bit_int_lossy = shared_utils.convert_32_bit_float_into_unsigned_16_bit_int_lossy;
exports.convert_16_bit_unsigned_int_to_32_bit_float         = shared_utils.convert_16_bit_unsigned_int_to_32_bit_float;


exports.convert_16_bit_signed_int_to_32_bit_float           = shared_utils.convert_16_bit_signed_int_to_32_bit_float;
exports.convert_32_bit_float_into_signed_16_bit_int_lossy   = shared_utils.convert_32_bit_float_into_signed_16_bit_int_lossy;

// ---

/*  SEE shared_utils.convert_16_bit_signed_int_to_32_bit_float

var convert_16_bit_signed_ints_into_32_bit_floats = function(audio_buffer) {

    var size_buffer = audio_buffer.length;

    var buffer_32_bit_floats = new Float32Array(~~(size_buffer / 2)); // integer division by 2
    var index_float = 0;

    for (var index_16_bit = 0; index_16_bit < size_buffer;) {

        buffer_32_bit_floats[index_float] =  -1 + (audio_buffer[index_16_bit] | (audio_buffer[index_16_bit + 1] << 8)) / 32768;

        index_16_bit += 2;
        index_float++;
    }

    return buffer_32_bit_floats;

};
exports.convert_16_bit_signed_ints_into_32_bit_floats = convert_16_bit_signed_ints_into_32_bit_floats;
*/

// ---

var toFixed = function(value, precision) {

    var sign_or_padding = " ";
    if (value < 0) sign_or_padding = "";

    var power = Math.pow(10, precision || 0);

    return sign_or_padding + String(Math.round(value * power) / power);
};
exports.toFixed = toFixed;


var copy_properties_across_objects = function(input_obj, output_obj) {

    for (var property in input_obj) {

        output_obj[property] = input_obj[property];
    }
};

exports.copy_properties_across_objects = copy_properties_across_objects;



var list_files_in_dir_sync = function(dir, files_) {

    var files_ = files_ || [];

	if (! fs.existsSync(dir)) {
		// directory does not exist - silently return
		return files_;
	}

    if (typeof files_ === 'undefined') { files_=[]; };

    var files = fs.readdirSync(dir);

    for(var i in files) {

        if (! files.hasOwnProperty(i)) continue;

        var name = dir +'/' + files[i];

        if (fs.statSync(name).isDirectory()) {

            list_files_in_dir_sync(name,files_);
        } else {
            files_.push(name);
        }
    }
    return files_;
}
exports.list_files_in_dir_sync = list_files_in_dir_sync;



// ---

var parse_wav = function(wav_input_file_obj, property_input_buffer, property_output_buffer) {

    // http://stackoverflow.com/questions/19991405/how-can-i-detect-whether-a-wav-file-has-a-44-or-46-byte-header?lq=1

    // http://www-mmsp.ece.mcgill.ca/Documents/AudioFormats/WAVE/WAVE.html
    // http://www-mmsp.ece.mcgill.ca/Documents/AudioFormats/WAVE/Samples.html

    // var raw_buffer = wav_input_file_obj.raw_buffer;   // entire contents of input file which is parsed 
    var local_input_buffer = wav_input_file_obj[property_input_buffer];   // entire contents of input file which is parsed 

    // console.log("top of parse_wav +++++++++++++++++++++  local_input_buffer.length ", local_input_buffer.length,
    //             " typeof local_input_buffer ", typeof local_input_buffer,
    //             " instanceof local_input_buffer ", (local_input_buffer instanceof Array) ? "Array" : "other"
    //             );

    var size_header = 44;
    var offset = 0;

    var RIFF = new Buffer(4);   // these MUST remain size 4 ... Resource Interchange File Format
    var WAVE = new Buffer(4);
    var fmt  = new Buffer(4);
    var data = new Buffer(4);

    local_input_buffer.copy(RIFF, 0, offset, RIFF.length);  //  chunckID 0 offset 4 bytes
    offset += 4;

    // console.log("is this RIFF or what ",RIFF.toString('ascii',0,RIFF.length)," RIFF.length ",RIFF.length);

    if (RIFF != "RIFF") {

        if (RIFF == " RIFX") {

            console.error("ERROR - this WAV file is stored Big Endian - currently we only handle Little Endian");
            process.exit(8);

        } else {

            var err_msg = "ERROR - failed to see RIFF at top of input WAV file parse, or RIFX for that matter";
            console.error(err_msg);
            console.error("instead saw : ", RIFF);
            process.exit(8);

            // return new Error(err_msg);  // stens TODO - have caller to handle this error

            // https://stackoverflow.com/questions/7310521/node-js-best-practice-exception-handling
        }
    }

    var chunckSize;
    chunckSize = local_input_buffer.readUInt32LE(offset);   //  chunckSize 4 offset 4 bytes
    offset += 4;
    // console.log("on read ... chunckSize ", chunckSize);


    local_input_buffer.copy(WAVE, 0, offset, offset + WAVE.length); //  format 8 offset 4 bytes
    offset += 4;
    // console.log("on read ... WAVE is what  ", WAVE.toString('ascii', 0, WAVE.length), " WAVE.length ", WAVE.length);




    local_input_buffer.copy(fmt, 0, offset, offset + fmt.length);// subchunk1ID  12 offset 4 bytes
    offset += 4;
    // console.log("on read ... fmt is what  ", fmt.toString('ascii', 0, fmt.length), " fmt.length ", fmt.length);



    wav_input_file_obj.pcm_format = local_input_buffer.readUInt32LE(offset);   //  subchunk1Size 16 offset 4 bytes
    offset += 4;
    // console.log("on read ... pcm_format ", wav_input_file_obj.pcm_format);
    // valid values of Chunk size :   16 or 18 or 40




    wav_input_file_obj.audio_format = local_input_buffer.readUInt16LE(offset);   //  audioFormat 20 offset 2 bytes
    offset += 2;
    // console.log('on read ... audio_format ', wav_input_file_obj.audio_format);


    wav_input_file_obj.num_channels = local_input_buffer.readUInt16LE(offset);   //  numChannels 22 offset 2 bytes
    offset += 2;
    // console.log('on read ... num_channels ', wav_input_file_obj.num_channels);
    //  Number of interleaved channels



    wav_input_file_obj.sample_rate = local_input_buffer.readUInt32LE(offset);   //  sampleRate 24 offset 4 bytes
    offset += 4;
    // console.log('on read ... sample_rate ', wav_input_file_obj.sample_rate);
    // blocks per second


    wav_input_file_obj.byte_rate = local_input_buffer.readUInt32LE(offset);   //  byteRate 28 offset 4 bytes
    offset += 4;
    // console.log("on read ... byte_rate ", wav_input_file_obj.byte_rate);

    wav_input_file_obj.bit_depth = (wav_input_file_obj.byte_rate * 8.0) / 
                                    (wav_input_file_obj.sample_rate * wav_input_file_obj.num_channels);
    // console.log("on read ... bit_depth    ", wav_input_file_obj.bit_depth);
    // average bytes per second - data rate


    wav_input_file_obj.block_align = local_input_buffer.readUInt16LE(offset);   //  blockAlign 32 offset 2 bytes
    offset += 2;
    // console.log("on read ... block_align ", wav_input_file_obj.block_align);
    // data block size in bytes


    wav_input_file_obj.bits_per_sample = local_input_buffer.readUInt16LE(offset);   //  bitsPerSample 34 offset 2 bytes
    offset += 2;
    // console.log("on read ... bits_per_sample ", wav_input_file_obj.bits_per_sample);
    // bits per sample



    local_input_buffer.copy(data, 0, offset, offset + data.length); //  subchunk2ID 36 offset 4 bytes
    offset += 4;
    // console.log("data is what  ", data.toString('ascii', 0, data.length), " data.length ", data.length);


    var subchunk2Size;
    subchunk2Size = local_input_buffer.readUInt32LE(offset);   //  subchunk2Size 36 offset 4 bytes
    offset += 4;
    // console.log("subchunk2Size ", subchunk2Size);


    if (! (size_header == offset)) {

        var err_msg = "ERROR - input file header must contain " + size_header + 
                            " bytes it incorrectly contains : " + offset;

        console.log(err_msg);
    }

    // console.log("end of read header ......... offset ", offset);


    var size_buffer = wav_input_file_obj[property_input_buffer].length - size_header;

    // console.log(" ......... size_buffer ", size_buffer);

    // wav_input_file_obj.buffer = new Buffer(size_buffer);
    // local_input_buffer.copy(wav_input_file_obj.buffer, 0, offset, offset + size_buffer);
    // console.log("end of read payload buffer size  ", wav_input_file_obj.buffer.length);    

    wav_input_file_obj[property_output_buffer] = new Buffer(size_buffer);

    local_input_buffer.copy(wav_input_file_obj[property_output_buffer], 0, offset, offset + size_buffer);

    // console.log("end of read payload buffer size  ", wav_input_file_obj[property_output_buffer].length);

    // -------- now show count number samples

    // NumSamples = NumBytes / (NumChannels * BitsPerSample / 8)


    // console.log("ssssssssssss      size_buffer ", size_buffer);
    // console.log("ssssssssssss     num_channels ", wav_input_file_obj.num_channels);
    // console.log("ssssssssssss  bits_per_sample ", wav_input_file_obj.bits_per_sample);

    // var num_samples = size_buffer / (wav_input_file_obj.num_channels * wav_input_file_obj.bits_per_sample / 8);
    // console.log("ssssssssssss  num_samples ", num_samples);

};       //      parse_wav
// exports.parse_wav = parse_wav;

// ---

var read_file_into_buffer = function(input_file_obj, property_buffer_raw_input_file, 
                                    property_buffer_input_file, cb_post_process, cb_when_done) {

    // console.log("thuthuthu IIIIIIIII inside read_file_into_buffer   filename ", input_file_obj.filename);


    // console.log("thuthuthu IIIIIIIII cb_when_done ", cb_when_done.name);
    // console.log("thuthuthu IIIIIIIII cb_post_process ", cb_post_process.name);





    var input_read_stream = fs.createReadStream(input_file_obj.filename);

    // var max_print_count = 5;
    // var curr_print_count = 0;

    var current_byte_count = 0;

    // var size_limit_buffer;

    input_read_stream.on('readable', function() {

        var newData;

        // console.log('inside READABLEEEEEEEEEE of read_file_into_buffer ');

        while (null !== (newData = input_read_stream.read())) {

            // if (curr_print_count < max_print_count) {

            // console.log('CCCCCC binary newData length this callback cycle is ', newData.length);
            // }

            // size_limit_buffer = (newData.length < limit_size_input_file_buffer) ?
            //                      newData.length : limit_size_input_file_buffer;

            // console.log("size_limit_buffer ", size_limit_buffer);

            input_file_obj[property_buffer_raw_input_file] = 
                    Buffer.concat([input_file_obj[property_buffer_raw_input_file], newData], 
                                   input_file_obj[property_buffer_raw_input_file].length+newData.length);

            // input_file_obj[property_buffer_raw_input_file] = 
            //         Buffer.concat([input_file_obj[property_buffer_raw_input_file], newData], 
            //                        input_file_obj[property_buffer_raw_input_file].length+size_limit_buffer);


            // if (curr_print_count < max_print_count) {

            // console.log('binary input_file_obj.raw_buffer length post concat  ', 
            //                 input_file_obj[property_buffer_raw_input_file].length);
            // }
            // curr_print_count++;
        }
    });

    input_read_stream.on("error", function (error) {

        console.error("ERROR - failure when attempting to read input file : ", input_file_obj.filename, error);
        // process.exit(8);

        new Error("ERROR - failure when attempting to read input file : ", input_file_obj.filename, error);

    });

    // Done, process the data

    input_read_stream.on("end", function () {


        // do something with data read from file - parse_wav

        // console.log("INNN read_file_into_buffer with cb_post_process.name ",cb_post_process.name);

        cb_post_process(input_file_obj, property_buffer_raw_input_file, property_buffer_input_file, cb_when_done);

        // ---

        // console.log("post callback to parse_wav with property iteration of input_file_obj");
    });

};       //      read_file_into_buffer
// this is NOT for export for INTERNAL usage ONLY

// ---

// exports.write_wav = function(wav_file_obj) {
var write_wav = function(wav_file_obj) {

    // console.log("~~~~~~~~~ TOP write_wav ~~~~~~~~~");

    // --- iterate across all properties of given audio file object to see things like sample_rate

    // var sampleRate  = 44100;    // defaults to be overridden in below switch statement
    // var bitDepth    = 16;
    // var numChannels = 1;
    // var pcm_format = 16;
    // var audio_format = 1; // raw PCM


    var sample_rate  = 44100;    // defaults to be overridden in below switch statement
    var bit_depth    = 16;
    var num_channels = 1;
    var pcm_format = 16;   // valid values of Chunk size :   16 or 18 or 40
    var audio_format = 1; // raw PCM

    var path = "unknown_filename_must_populate_filename";
    // var data_length = wav_file_obj.buffer.length;
    var data_length = "unknown_filename_must_populate_buffer";




    // show_object_with_buffer(wav_file_obj, "in write_wav");


    // shared_utils.show_object(wav_file_obj, "total",
    //         "in write_wav", 10);



    for (var property in wav_file_obj) {

        // console.log("1111111  write_wav ", property, wav_file_obj[property]);

        if (wav_file_obj.hasOwnProperty(property)) {

            switch (property) {

                case "sample_rate" : {

                    sample_rate = wav_file_obj[property];
                    break;
                }

                case "bit_depth" : {

                    bit_depth = wav_file_obj[property];
                    break;
                }

                case "num_channels" : {

                    num_channels = wav_file_obj[property];
                    break;
                }

                case "filename" : {

                    path = wav_file_obj[property];
                    break;
                }

                case "buffer" : {

                    data_length = wav_file_obj[property].length;
                    break;
                }

                // --- default - catch all if not identifed above

                default :

                console.log("NOTICE - write_wav ignore this ... seeing property NOT on authorized list : ", 
                                property, " value ", wav_file_obj[property]);
                process.exit(8);

                break;
            };
        };
    };

    // console.log("FFFFFFFF sample_rate  ", sample_rate);
    // console.log("FFFFFFFF bit_depth    ", bit_depth);
    // console.log("FFFFFFFF num_channels ", num_channels);
    // console.log("FFFFFFFF data_length ", data_length);
    // console.log("FFFFFFFF filename ", path);


    // ---

    var size_header = 44;   // constant number of bytes in WAV header as per spec

    var RIFF = new Buffer('RIFF');  // each of these constant MUST remain 4 bytes in size
    var WAVE = new Buffer('WAVE');
    var fmt  = new Buffer('fmt ');
    var data = new Buffer('data');

    // ---

    // var path = wav_file_obj.filename;

    // console.log("/////////// about to write wav output file path ", path);
    // console.log("size buffer to write  ", wav_file_obj.buffer.length);  // deal with 1 channel for now

    // console.log(shared_utils.checkEndian()); // stens TODO - confirm we are on little endian else fiddle

    // ---

    // var data_length = wav_file_obj.buffer.length;

    var entire_size_file = data_length + size_header;

    var write_stream = fs.createWriteStream(path);

    // This is here incase any errors occur
    write_stream.on('error', function (err) {

        console.log("ERROR - seeing error in write_stream");
        console.log(err);
        // process.exit(8);
        return;
    });

    // ---


    write_stream.on('finish', function() {

        // console.error('all writes are now complete.');
    });



    // ---

    var header = new Buffer(size_header);
    var offset = 0;

    // write the "RIFF" identifier
    RIFF.copy(header, offset);  //  chunckID 0 offset  4 bytes
    offset += 4;


    var chunckSize = entire_size_file - 8;
    // write the file size minus the identifier and this 32-bit int
    // header['writeUInt32' + this.endianness](entire_size_file - 8, offset);
    header.writeUInt32LE(chunckSize, offset);   //  chunckSize 4 offset 4 bytes
    offset += 4;
    

    // write the "WAVE" identifier
    WAVE.copy(header, offset);                  // format   8 offset 4 bytes
    offset += 4;


    // write the "fmt " sub-chunk identifier
    fmt.copy(header, offset);                   //  subchunk1ID 12 offset 4 bytes
    offset += 4;


    // write the size of the "fmt " chunk
    // XXX: value of 16 is hard-coded for raw PCM format. other formats have
    // different size.
    // header['writeUInt32' + this.endianness](16, offset);
    // var pcm_format = 16;
    header.writeUInt32LE(pcm_format, offset);   //  subchunk1Size 16 offset 4 bytes
    offset += 4;
    // console.log('write pcm_format ', pcm_format, " post incr offset ", offset);
    // valid values of Chunk size :   16 or 18 or 40



    // write the audio format code
    // header['writeUInt16' + this.endianness](this.format, offset);
    // var audio_format = 1; // raw PCM
    header.writeUInt16LE(audio_format, offset);   //  audioFormat  20 offset 2 bytes    
    offset += 2;
    // console.log('write audio_format ', audio_format, " post incr offset ", offset);


    // write the number of channels
    // var num_channels = 1;
    // header['writeUInt16' + this.endianness](this.channels, offset);
    header.writeUInt16LE(num_channels, offset);   //  num_channels  22 offset 2 bytes     
    offset += 2;

    // console.log('write num_channels ', num_channels, " post incr offset ", offset);

    // write the sample rate
    // var sampleRate = 44100;
    // header['writeUInt32' + this.endianness](this.sampleRate, offset);
    header.writeUInt32LE(sample_rate, offset);   //  sampleRate  24 offset 4 bytes     
    offset += 4;
    // console.log('write sample_rate ', sample_rate, " post incr offset ", offset);


    // var bitDepth = 16;
    // write the byte rate
    var byteRate = this.byteRate;
    if (null == byteRate) {

        byteRate = sample_rate * num_channels * bit_depth / 8;

        // console.log("on write byteRate was null so post calculation its ", byteRate);
    }
    // header['writeUInt32' + this.endianness](byteRate, offset);
    header.writeUInt32LE(byteRate, offset);   //  byteRate  28 offset 4 bytes
    offset += 4;
    // console.log("on write ... byteRate ", byteRate);
    // console.log("on write ... sample_rate ", sample_rate);
    // console.log("on write ... num_channels ", num_channels);
    // console.log("on write ... bit_depth ", bit_depth);


    // console.log('write byteRate ', byteRate, " post incr offset ", offset);


    // write the block align
    var blockAlign = this.blockAlign;
    if (null == blockAlign) {
    blockAlign = num_channels * bit_depth / 8;
    }
    // header['writeUInt16' + this.endianness](blockAlign, offset);
    header.writeUInt16LE(blockAlign, offset);   //  blockAlign  32 offset 2 bytes     
    offset += 2;
    // console.log("on write ... blockAlign ", blockAlign);


    // write the bits per sample
    var bitsPerSample = bit_depth;
    // header['writeUInt16' + this.endianness](this.bitDepth, offset);
    header.writeUInt16LE(bitsPerSample, offset);    //  bitsPerSample  34 offset 2 bytes     
    offset += 2;

    // offset += 2;                                    // filler_01  36 offset 2 bytes - just ignore

    // write the "data" sub-chunk ID
    data.copy(header, offset);                      // subchunk2ID  36 offset 4 bytes
    offset += 4;

    // write the remaining length of the rest of the data
    // header['writeUInt32' + this.endianness](dataLength, offset);
    var subchunk2Size = data_length;
    header.writeUInt32LE(data_length, offset);   //  subchunk2Size  40 offset 4 bytes
    offset += 4;

    if (! (44 == offset)) {

        var err_msg = "ERROR - input file header must contain " + size_header + 
                            " bytes it incorrectly contains : " + offset;

        console.log(err_msg);
        // process.exit(4);
        return;
    }

    // console.log("end of write ........... offset ", offset);

    // ---

    write_stream.write(header);

    // ---

    var buffer_to_file = new Buffer( new Int16Array(wav_file_obj.buffer) );


    write_stream.write(buffer_to_file);

    // console.log("wav_file_obj.buffer ", wav_file_obj.buffer.length);

    // console.log("~~~~~~~~~ BOT write_wav ~~~~~~~~~");

};       //      write_wav
// exports.write_wav = write_wav;

// ---

exports.interleave = function(leftChannel, rightChannel) {

  var length = leftChannel.length + rightChannel.length;
  var result = new Float32Array(length);
 
  var inputIndex = 0;
 
  for (var index = 0; index < length; ){
    result[index++] = leftChannel[inputIndex];
    result[index++] = rightChannel[inputIndex];
    inputIndex++;
  }
  return result;
};

// ---

var write_json_to_file = function(output_filename, given_json, given_options) {

    var options = given_options || 'utf8';

    var json_as_string = JSON.stringify(given_json); // convert json into string

    try {

        fs.writeFileSync(output_filename, json_as_string, options); // or async : writeFile

    } catch (err) {

            console.log(err);
            process.exit(8);
    };

    // console.log("just wrote to output file ", output_filename);
};
exports.write_json_to_file = write_json_to_file;

// ---


var read_file_retrieve_json = function(input_filename, given_options) {

    var options = given_options || 'utf8';

    var json_back_to_caller;

    try {

        json_back_to_caller = JSON.parse(fs.readFileSync(input_filename, given_options));

    } catch (err) {

            console.log(err);
            process.exit(8);
    };

    // console.log("just read from input file ", input_filename);

    return json_back_to_caller;
};
exports.read_file_retrieve_json = read_file_retrieve_json;



// ---
/*
convert_8_bit_buffer_from_32_bit_float_to_16_bit_int = function(input_data, output_data) {

    // http://www.html5rocks.com/en/tutorials/webgl/typed_arrays/

    var size_one_16_bit_in_bytes = Int16Array.BYTES_PER_ELEMENT;

    // Int16Array

    console.log("size_one_16_bit_in_bytes ", size_one_16_bit_in_bytes);

    console.log("size input_data ", input_data.buffer.length);
    console.log("size output_data ", output_data.buffer.length);

    var offset = 0;
    var index_float = 0;
    var buffer_single_byte_sized = new Buffer(4);   // holds enough to populate a single float
    var number_float;

    // var buffer_single_16bit_sized = new Buffer(2);   // holds enough to populate a single 16 bit signed int

    var size_buff = input_data.buffer.length;
    var index_int = 0;

    console.log("size_buff ", size_buff);

    for (var index = 0; index < size_buff; index += 4) {
    // for (var index = 0; index < size_buff; index++) {
        
        // for (var inneri = 0; inneri < 4; inneri++) { // take float sized gulps endian
        for (var inneri = 3; inneri >= 0; inneri--) {  // take float sized gulps other endian

            buffer_single_byte_sized[inneri] = input_data.buffer[index_int];

            if (index < 100) {

                console.log('rawrawraw ', index, inneri, buffer_single_byte_sized[inneri],
                                input_data.buffer[index_int]);
            }

            index_int++;
        }

        // var view = new jDataView(buffer_single_byte_sized);
        var view = new jdataview(buffer_single_byte_sized);

        number_float = view.getFloat32(0);


        // output_data.buffer[index_float++] = number_float;
        // output_data.buffer[index_float++] = number_float;

        // var same_value_in_16_bit_signed_int = number_float * (32768 - 1)
        var same_value_in_16_bit_signed_int = ~~(number_float * (32768 - 1));

        if (index < 20) {

            console.log(index, ' binary number_float ', number_float, ' int ',
                                same_value_in_16_bit_signed_int);
        }

        output_data.buffer.writeInt16LE(same_value_in_16_bit_signed_int, offset);
        offset += 2;
    }

    // write_json_serialized(big_binary_float);
    // write_buffer_to_file(big_binary_float);
    // write_buffer_to_file(output_data.buffer);

};       //      convert_8_bit_buffer_from_32_bit_float_to_16_bit_int

exports.convert_8_bit_buffer_from_32_bit_float_to_16_bit_int = convert_8_bit_buffer_from_32_bit_float_to_16_bit_int;
*/

// ---

// var convert_32_bit_floats_into_16_bit_ints = function(input_32_bit_float_audio_obj, output_16_bit_audio_obj) {
var convert_32_bit_floats_into_16_bit_signed_ints = function(input_32_bit_float_audio_obj, output_16_bit_audio_obj) {

    // MUST assure input float is BOUNDED between +1.0 to -1.0 ONLY

    // this is a lossless process - no information is thrown away

    // this logic MAINTAINS full information of input ... 32 bit float --> two 16 bit integers 
    // so NO loss of information - output buffer size is twice input buffer size
    // output 16 bit format can be later converted back into identical input 32 bit floats
    // DO NOT use this method to convert floats into 16 bit ints as preliminary step to save into WAV format
    // because that is a LOSSY process 

    var size_32_bit_float_buff = input_32_bit_float_audio_obj.buffer.length;

    // console.log("size 32 bit float ", size_32_bit_float_buff);

    var num_16_bit_chunks_per_32_bit_float = Float32Array.BYTES_PER_ELEMENT / 
                                    Uint16Array.BYTES_PER_ELEMENT;

    // console.log("num_16_bit_chunks_per_32_bit_float ", num_16_bit_chunks_per_32_bit_float);


    var size_16_bit_int_buff = size_32_bit_float_buff * num_16_bit_chunks_per_32_bit_float;

    // console.log("size 16 bit ints ", size_16_bit_int_buff); //  is OK

    output_16_bit_audio_obj.buffer = new Buffer(size_16_bit_int_buff);// input buffer is 32 bit we want 16 bit so half it

    // var one_float = new Float32Array(1);

    var one_float_in_2_16_bit_ints;
    // var curr_float;
    // var index_16_bit_ints = 0;

    var offset = 0;
    var same_value_in_16_bit_signed_int;
    // var local_divisor;

    // stens TODO - put below for loop into a try catch so when :

    /*

    14 ' aboutttttt to show raw float ' 1.2392250299453735
buffer.js:564
    throw new TypeError('value is out of bounds');
          ^
TypeError: value is out of bounds
    at checkInt (buffer.js:564:11)
    at Buffer.writeInt16LE (buffer.js:642:5)
    at convert_32_bit_floats_into_16_bit_ints (node-genome/src/node_utils.js:689:40)
    at Object.exports.write_buffer_to_file 

        when above happens - due to input raw float OUTSIDE boundary +1 <=> -1

    */

    for (var index_float = 0; index_float < size_32_bit_float_buff; index_float++) {

        // one_float[0] = input_32_bit_float_audio_obj.buffer[index_float];

        // if (index_float < 20) {

        //     console.log(index_float, " one_float ", one_float[0], 
        //                 " convert_32_bit_floats_into_16_bit_ints"); // is OK            
        // }

        // var same_value_in_16_bit_signed_int = ~~(one_float[0] * (32768 - 1));
        // https://stackoverflow.com/questions/11682804/confusion-in-16-bit-data-type-range

        /*
        if (one_float[0] < 0) {

        	same_value_in_16_bit_signed_int = ~~(one_float[0] * (0x8000)); // 32768

        } else {

        	same_value_in_16_bit_signed_int = ~~(one_float[0] * (0x7FFF)); // 32767
        }
        */

        // local_divisor = (one_float[0] < 0) ? 0x8000 : 0x7FFF; // 0x8000 = 32768 ... 0x7FFF = 32767

		// same_value_in_16_bit_signed_int = ~~(one_float[0] * (local_divisor));
		// same_value_in_16_bit_signed_int = ~~(one_float[0] * ((one_float[0] < 0) ? 0x8000 : 0x7FFF));// WORKS

        // console.log(index_float, " aboutttttt to show raw float ", input_32_bit_float_audio_obj.buffer[index_float]);

		same_value_in_16_bit_signed_int = ~~(input_32_bit_float_audio_obj.buffer[index_float] * 
                                            ((input_32_bit_float_audio_obj.buffer[index_float] < 0) ? 0x8000 : 0x7FFF));

        // if (index_float < 20) {

        //     console.log("same_value_in_16_bit_signed_int ", same_value_in_16_bit_signed_int);
        // }

        // output_16_bit_audio_obj.buffer[index_16_bit_ints++] = one_float_in_two_16_bit_ints[index_16_bit];

        output_16_bit_audio_obj.buffer.writeInt16LE(same_value_in_16_bit_signed_int, offset);
        offset += num_16_bit_chunks_per_32_bit_float;
    }

    // process.exit(3);

};       //      convert_32_bit_floats_into_16_bit_ints

// exports.convert_32_bit_floats_into_16_bit_ints = convert_32_bit_floats_into_16_bit_ints;
exports.convert_32_bit_floats_into_16_bit_signed_ints = convert_32_bit_floats_into_16_bit_signed_ints;

// normalize_buffer = function(audio_obj, property_buffer, desired_max, desired_min) {
var normalize_buffer = function(audio_obj, spec) {

    var property_buffer = "buffer";   // defaults
    var allowed_minimum = -1.0;       // defaults
    var allowed_maximum = +1.0;       // defaults

    var really_big_number = 999999.9;

    var spec = spec || {};

    if (typeof spec.property_buffer !== "undefined") {

        property_buffer = spec.property_buffer;

        // console.log("seeing input spec with spec.property_buffer ", spec.property_buffer);
    };
    if (typeof spec.allowed_minimum !== "undefined") {

        allowed_minimum = spec.allowed_minimum;

        // console.log("seeing input spec with spec.allowed_minimum ", spec.allowed_minimum);
    };
    if (typeof spec.allowed_maximum !== "undefined") {

        allowed_maximum = spec.allowed_maximum;

        // console.log("seeing input spec with spec.allowed_maximum ", spec.allowed_maximum);
    };

    // console.log("here is spec ", spec);
    // console.log("here is spec property_buffer ", property_buffer);
    // console.log("here is spec allowed_minimum ", allowed_minimum);
    // console.log("here is spec allowed_maximum ", allowed_maximum);

    // var given_buffer = audio_obj[property_buffer];

    var size_buffer = audio_obj[property_buffer].length;

    // console.log("size_buffer ", size_buffer);

    var observed_min =  really_big_number; // pull from some max float constant if possible
    var observed_max = -1.0 * really_big_number; // pull from some max float constant if possible

    // --- probe input buffer to determine whether any values are outside boundary

    for (var index = 0; index < size_buffer; index++) {

        var curr_value = audio_obj[property_buffer][index];

        // console.log(index, " curr_value ", curr_value);


        if (observed_min > curr_value) {

            observed_min = curr_value;

        } else if (observed_max < curr_value) {

            observed_max = curr_value;
        }
    };

    // ---

    // console.log("observed_min ", observed_min);
    // console.log("observed_max ", observed_max);

    // console.log("allowed_minimum ", allowed_minimum);
    // console.log("allowed_maximum ", allowed_maximum);


    // if (observed_min > allowed_minimum && observed_max < allowed_maximum) {
    if (observed_min >= allowed_minimum && observed_max <= allowed_maximum) {

        // console.log("OK  no work to do ... values already inside boundary");

        return; // no work to do ... values already inside boundary
    }

    // --- do normalize 

    var  allowed_difference_btw_max_N_min = allowed_maximum - allowed_minimum;
    var observed_difference_btw_max_N_min = observed_max - observed_min;

    // var observed_midpoint = observed_difference_btw_max_N_min / 2.0;
    var observed_midpoint = (observed_max + observed_min) / 2.0;


    // console.log("allowed_difference_btw_max_N_min ", allowed_difference_btw_max_N_min);
    // console.log("observed_difference_btw_max_N_min ", observed_difference_btw_max_N_min);
    // console.log("observed_midpoint ", observed_midpoint);


    if (observed_difference_btw_max_N_min == 0) {

        // seeing flatline input so just shift to zero

        // console.log("OK seeing unruly values YET all are same so just shift to zero");

        for (var index = 0; index < size_buffer; index++) {

            audio_obj[property_buffer][index] = 0.0;
        };

    } else { // now implement normalize of unruly input values into allowed values inside boundary

        // console.log("OK about to normalize values from observed min,max : ", observed_min, observed_max,
        //                 " to allowed min,max : ", allowed_minimum, allowed_maximum);

        var correction_factor = allowed_difference_btw_max_N_min / observed_difference_btw_max_N_min;

        // console.log("observed_midpoint ", observed_midpoint);
        // console.log("correction_factor ", correction_factor);

        var post_processing_min =  really_big_number;
        var post_processing_max = -1.0 * really_big_number;

        for (var index = 0; index < size_buffer; index++) {

            var prior_value = parseFloat(audio_obj[property_buffer][index]);

            // audio_obj[property_buffer][index] = (correction_factor * audio_obj[property_buffer][index]) - observed_midpoint;
            // audio_obj[property_buffer][index] = correction_factor * audio_obj[property_buffer][index];
            // audio_obj[property_buffer][index] = correction_factor * (1.0 * audio_obj[property_buffer][index] - observed_midpoint);
            audio_obj[property_buffer][index] = correction_factor * (audio_obj[property_buffer][index] - observed_midpoint);

            // console.log(index, " CCCCCCC input value ", prior_value, " output value ", audio_obj[property_buffer][index]);

            if (post_processing_min > audio_obj[property_buffer][index]) {

                post_processing_min = audio_obj[property_buffer][index];

            } else if (post_processing_max < audio_obj[property_buffer][index]) {

                post_processing_max = audio_obj[property_buffer][index];
            }
        };   

        // console.log(" CCCCCCC post_processing_min ", post_processing_min, " post_processing_max ", post_processing_max);
    };
};
exports.normalize_buffer = normalize_buffer;

// ---

function cb_parse_buffer_as_wav_format(audio_obj, property_buffer_raw_input_file, property_buffer_input_file, cb_when_done) {

    // sync NOT async ... output into buffer_input_file

    parse_wav(audio_obj, property_buffer_raw_input_file, property_buffer_input_file);

    delete audio_obj[property_buffer_raw_input_file];    // no longer need raw pre parse buffer

    // console.log("buffer size ", audio_obj[property_buffer_input_file].length);

    audio_obj.buffer = shared_utils.convert_16_bit_signed_int_to_32_bit_float(audio_obj[property_buffer_input_file]);

    delete audio_obj[property_buffer_input_file];    // no longer need raw pre parse buffer

    cb_when_done(audio_obj);  //  this is defined by original caller to hand back audio object with populated buffer

};      //      cb_parse_buffer_as_wav_format

// ---

var read_16_bit_wav_file_into_32_bit_float_buffer = function(read_wav_file_obj, wav_input_filename, spec, cb_when_done) {

    // console.log("TTT ___ read_16_bit_wav_file_into_32_bit_float_buffer ___ ");

    // ---

    var property_buffer_raw_input_file = "buffer_raw_input_file";
    var property_buffer_input_file     = "buffer_input_file";

    read_wav_file_obj.filename = wav_input_filename;

    read_wav_file_obj[property_buffer_raw_input_file] = new Buffer(0);

    // console.log("name cb cb_parse_buffer_as_wav_format ", cb_parse_buffer_as_wav_format.name);
    // console.log("name cb cb_when_done ", cb_when_done.name);

    read_file_into_buffer(read_wav_file_obj, property_buffer_raw_input_file,
                                    property_buffer_input_file,
                                    cb_parse_buffer_as_wav_format,
                                    cb_when_done);

    // console.log("BBB ___ read_16_bit_wav_file_into_32_bit_float_buffer ___ ");

};      //      read_16_bit_wav_file_into_32_bit_float_buffer
// NOT for export --- internal consumption ONLY its outer wrapper is called read_wav_file

// ---

var read_wav_file = function(input_filename, cb_read_file_done) {

    // ------------ read wav file -------------------- //

    // console.log("read_wav_file with input_filename ", input_filename);

    // bbb

    var wav_file_input_obj = {};  // create stub object to which we attach .buffer

    var property_buffer_raw_input_file = "buffer_raw_input_file";

    wav_file_input_obj.filename = input_filename;

    wav_file_input_obj[property_buffer_raw_input_file] = new Buffer(0);

    // console.log("abouttttt to read wav_file_input_obj.filename ", wav_file_input_obj.filename);

    var spec = {};

    read_16_bit_wav_file_into_32_bit_float_buffer(
                                    wav_file_input_obj,
                                    wav_file_input_obj.filename, 
                                    spec,
                                    cb_read_file_done);
};
exports.read_wav_file = read_wav_file;

// ---

exports.write_32_bit_float_buffer_to_16_bit_wav_file = function(audio_obj, wav_output_filename, spec, db_done) {

    var property_buffer = "buffer";   // defaults

    var really_big_number = 999999.9;

    var spec = spec || { flag_normalize : false }; // flag to normalize input into float range -1 <--> +1
    // var spec = spec || { flag_normalize : true };

    if (typeof spec.property_buffer !== "undefined") {

        property_buffer = spec.property_buffer;
    };

    if (true == spec.flag_normalize) {

        normalize_buffer(audio_obj, spec);
    }

    var output_16_bit_audio_obj = {};

    copy_properties_across_objects(audio_obj, output_16_bit_audio_obj);

    output_16_bit_audio_obj.filename = wav_output_filename;
    
    // shared_utils.show_object(audio_obj, "total",
    //         "hhhhhhhhhhhhhhh corindddeeee audio_obj corindddeeee", 10);

    output_16_bit_audio_obj.buffer = shared_utils.convert_32_bit_float_into_signed_16_bit_int_lossy(audio_obj[property_buffer]);

    write_wav(output_16_bit_audio_obj);

};      //      write_32_bit_float_buffer_to_16_bit_wav_file

// ---

})(typeof exports === "undefined" ? this["node_utils"]={}: exports);

