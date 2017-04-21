
var Inscrit  = require('../class/inscrit.js');
var oInscrit = new Inscrit();

var POne    = oInscrit.one("`serial` = 'ngynNoU'");
var p;

// promise One
p = POne.then(( oRow)=>{
    console.log( oRow);
}).catch((e)=>{
  console.log(e);
});
