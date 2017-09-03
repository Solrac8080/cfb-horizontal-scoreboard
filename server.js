var express = require('express');
var app = express();
var child = require('child_process')

function runScript(scriptPath, callback) {
  
  var invoked = false;
  
  var process = child.fork('gethtml.js');
  
  process.on('error', function(err) {
    if (invoked) return;
    invoked = true;
    callback(err);
  });
  
  process.on('exit', function (code) {
    if (invoked) return;
    invoked = true;
    var err = code === 0 ? null : new Error('exit code '+ code);
    callback(err);
  });
}

app.get('/', function(req, res){
  runScript('./gethtml.js',function (err) {
    if (err) throw err;
    console.log('finished running script');
  })
  var options = {
    root: __dirname
  }
  var fileName = 'index.html';
  res.sendFile(fileName, options, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log('Sent:', fileName);
    }
  });
});

app.listen(3000)
