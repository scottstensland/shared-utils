shared-utils
===========


Contains useful utilities like random number generator for ints or floats in min - max range inclusive


Available at https://github.com/scottstensland/shared-utils



### synthesize an audio buffer with random noise OR sinusoidal curve

```js

// ------------  populate buffer with sin curve ------------  //

// var SIZE_BUFFER_SOURCE = 5;
var SIZE_BUFFER_SOURCE = 256;
// var SIZE_BUFFER_SOURCE = 4096;
// var SIZE_BUFFER_SOURCE = 16384;

var samples_per_cycle = 64;

var source_obj = {}; // we populate its buffer then save to output WAV file 
var target_obj = {}; // then read back WAV file to populate this target buffer then do curve diff to confirm curves match

source_obj = audio_utils.pop_audio_buffer(SIZE_BUFFER_SOURCE, samples_per_cycle);

```


### synthesize an audio buffer with random noise

```js

var shared_utils = require("shared-utils");
var path = require('path');

shared_utils.set_random_seed(17); // comment out if U want fresh random sequence for each run 
                                  // otherwise random sequence repeats across subsequent runs of this script

var SIZE_BUFFER_SOURCE = 256;

var source_obj = {}; // we populate its buffer with random float values then save to output WAV file 

source_obj.buffer = new Float32Array(SIZE_BUFFER_SOURCE);

var max_index = SIZE_BUFFER_SOURCE;

for (var index = 0; index < max_index; index++) {

    source_obj.buffer[index] = shared_utils.get_random_in_range_inclusive_float(-1.0, 1.0);

    // console.log(index, " pop_audio_buffer ", source_obj.buffer[index]);
}

```

### write typed array 32 bit float buffer (Float32Array) to output file WAV format 16 bit precision

```js

var output_dir = process.argv[2] || "/tmp";
var output_format = ".wav";
var source_wave = "source_wave_shared_utils_test";
var source_wave_filename = path.join(output_dir, source_wave + output_format);

shared_utils.write_32_bit_float_buffer_to_16_bit_wav_file(source_obj, source_wave_filename);

```


