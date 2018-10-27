/* global Elm */

require('../dist/app.js');

const app = Elm.Main.init({
    flags: {},
});

console.log('document', _VirtualDom_doc);
console.log('<body>', _VirtualDom_doc.body);
