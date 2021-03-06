'use strict';
let fs = require('fs');

let rs = fs.createReadStream('sample.txt','utf-8');

rs.on('data',(chunk)=>{
    console.log('DATA:');
    console.log(chunk);
});

rs.on('end', ()=>{
    console.log('END');
});

rs.on('error',(err)=>{
    console.log(`ERROR: ${err}`);
});
