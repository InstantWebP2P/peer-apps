var fs = require('fs');
var Ffmpeg = require('fluent-ffmpeg');
var command = Ffmpeg();

// set bin path
command.setFfmpegPath(__dirname+'/vendor/ffmpeg-win/bin/ffmpeg.exe');
command.setFfprobePath(__dirname+'/vendor/ffmpeg-win/bin/ffprobe.exe');

// ffmpeg info
/*
command.getAvailableFormats(function(err, formats) {
  console.log('Available formats:');
  console.dir(formats);
});

command.getAvailableCodecs(function(err, codecs) {
  console.log('Available codecs:');
  console.dir(codecs);
});

command.getAvailableEncoders(function(err, encoders) {
  console.log('Available encoders:');
  console.dir(encoders);
});

command.getAvailableFilters(function(err, filters) {
  console.log("Available filters:");
  console.dir(filters);
});
*/

var outStream = fs.createWriteStream('wcx.webm');
var outStream1 = fs.createWriteStream('wcx1.webm');

// list avaible webcam devices
command
.input('video=USB Webcam:audio=麦克风 (Realtek High Definition Au')
///.input('video=Default:audio=Default')
.inputFormat('dshow')
.inputFps('15')
.size('320x240')
///.output('./media/hlsd_.m3u8')
///.outputFps('15')
///.outputOptions('-hls_wrap 5')
///.output('hlsb_.m3u8')
///.output('hlsa_%03d.ts')
///.audioCodec('copy')
///.videoCodec('mpeg4')
//.outputFps('1')
.outputOptions(['-map 0', '-f segment'])
.outputOptions(['-segment_time 2', '-segment_format webm'])
.outputOptions(['-segment_list wlsa.list', '-segment_list_entry_prefix /medias/'])
.output('wlsa_%04d.webm')
//.audioCodec('libfaac')
///.videoCodec('libx264')
//.outputFps('10')
///.outputOptions(['-f ssegment', '-segment_list hlsb.list'])
///.size('320x200')
///.inputFps('25')
///.inputOptions('-list_devices true')
///.input('yo.mp4')
///.output('wc.webm')
///.outputFps('6')
///.format('webm')
///.videoCodec('libx264')
///.audioCodec('libmp3lame')
///.size('320x240')
.on('start', function(commandLine) {
	console.log('Spawned Ffmpeg with command: ' + commandLine);
})
.on('codecData', function(data) {
    console.log('Input is ' + data.audio + ' audio ' +
      'with ' + data.video + ' video');
})
.on('progress', function(progress) {
    ///console.log('Processing: ' + progress.percent + '% done');
	console.log('Processing: ' + JSON.stringify(progress));
})
.on('error', function(err, stdout, stderr) {
    console.log('Cannot process video: ' + err.message);
})
.on('end', function() {
   console.log('Transcoding succeeded !');
})
///.pipe(outStream, { end: true })
///.save('./wc.webm');
.run();

/*
var first = true;
var second = false;

var ffstream = command.pipe();
ffstream.on('data', function(chunk) {
  console.log('ffmpeg just wrote ' + chunk.length + ' bytes');
  
  outStream.write(chunk);
  if (first) {
	  first = false;
	  console.log('first trunk');
	  outStream1.write(chunk);
  }
  
  if (second) outStream1.write(chunk);
  
  setTimeout(function(){
	  second = true;
  }, 6000)
});
*/

// capture webcam on demand

