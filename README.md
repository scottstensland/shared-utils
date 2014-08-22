shared-utils
===========


Contains useful utilities like random number generator for ints or floats in min - max range inclusive


Available at https://github.com/scottstensland/shared-utils

### synthesize an audio buffer

```js

var shared_utils = require("shared-utils");
var path = require('path');

var SIZE_BUFFER_SOURCE = 256;

var source_obj = {}; // we populate its buffer with random float values then save to output WAV file 

source_obj.buffer = new Float32Array(SIZE_BUFFER_SOURCE);

var max_index = SIZE_BUFFER_SOURCE;

for (var index = 0; index < max_index; index++) {

    source_obj.buffer[index] = shared_utils.get_random_in_range_inclusive_float(-1.0, 1.0);

    // console.log(index, " pop_audio_buffer ", source_obj.buffer[index]);
}

```

### write typed array 32 bit float buffer (Float32Array) to output file WAV format

```js

var output_dir = process.argv[2] || "/tmp";
var output_format = ".wav";
var source_wave = "source_wave_shared_utils_test";
var source_wave_filename = path.join(output_dir, source_wave + output_format);

shared_utils.write_32_bit_float_buffer_to_16_bit_wav_file(source_obj, source_wave_filename);

```


