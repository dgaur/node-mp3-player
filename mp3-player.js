"use strict";

//
// Trivial little MP3 player for the CLI, for node.js
//
// Usage:
//	% node mp3-player.js /path/to/file.mp3
//

var async	= require("async");
var fs		= require("fs");
var lame	= require("lame");
var speaker	= require("speaker");


var playMP3 = function(file, callback) {
	var decoder	= lame.Decoder();
	var mp3		= fs.createReadStream(file);

	// Pipe the file contents to the decoder
	mp3.on('readable', function() {
		mp3.pipe(decoder);
	});

	// Pipe the decoder output into the actual speaker interface
	decoder.on('format', function(format) {
		var s = new speaker(format);
		s.on('flush', function() {
			callback();
		});

		decoder.pipe(s);
	});
};


//
// Play each audio file given on the command-line, in turn
//
async.eachSeries(process.argv.slice(2), playMP3, function(error) {
	if (error) {
		console.error(error);
	}
});

