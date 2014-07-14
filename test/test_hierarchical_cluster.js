#!/usr/bin/env node 


/*

var aaaa = {};

var some_var1 = 0;
var some_var2 = 555;


aaaa[some_var1] = some_var2;

console.log("here is aaaa ", aaaa);

aaaa[222] = "bbbbb";

console.log("here is aaaa ", aaaa);



return;
*/


// ----------


var shared_utils = require("../src/node_utils");

console.log("shared_utils ", shared_utils);

// ------------------------------------------------------------------------------------ //


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

shared_utils.set_random_seed(17);   // seed random algorithm so it repeats same random sequence acros runs

var setup_one = {

    // max_num_curves : 5000,     // number of curves
    max_num_curves : 5,     // number of curves
    // max_samples : 1000,       // number of data points per curve 
    max_samples : 10,       // number of data points per curve 
    min_value : -5, 
    max_value : 5,
    // flavor_random : "integer",
    flavor_random : "float",
    flag_print : true,
    // flag_print : false,
};


var setup_one_N_half = {

    // max_num_curves : 5000,     // number of curves
    max_num_curves : 17,     // number of curves
    // max_samples : 1000,       // number of data points per curve 
    max_samples : 3,       // number of data points per curve 
    min_value : -5, 
    max_value : 5,
    // flavor_random : "integer",
    flavor_random : "float",
    flag_print : true,
    // flag_print : false,
};


var setup_two = {

    // max_num_curves : 5000,     // number of curves
    max_num_curves : 500,     // number of curves
    // max_samples : 1000,       // number of data points per curve 
    max_samples : 100000,       // number of data points per curve 
    min_value : -1.0, 
    max_value : 1.0,
    // flavor_random : "integer",
    flavor_random : "float",
    // flag_print : true,
    flag_print : false,
};



// shared_utils.gen_curves(setup_one);
shared_utils.gen_curves(setup_one_N_half);
// shared_utils.gen_curves(setup_two);


// shared_utils.show_curves();

shared_utils.do_clustering();





console.log("<><><>  <><><>  <><><>   end of processing   <><><>  <><><>  <><><>");

return;


