const path = require('path');

console.log(module.paths)

console.log(require.extensions)

console.log(require.extensions['.js'])

console.log(require.extensions['.js'].toString())

console.log(path.resolve(process.execPath, '..', '..', 'lib', 'node_modules'));

console.log(!!(typeof module!== 'undefined' && module.exports))

console.log(typeof define==='function')