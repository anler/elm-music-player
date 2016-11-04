require( './normalize.css' );
require( './main.css' );

var Elm = require('../../elm/Main');
Elm.Main.embed(document.getElementById('main'));
