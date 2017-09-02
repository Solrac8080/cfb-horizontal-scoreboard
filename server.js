var http = require('http');
var fs = require('fs');
var request = require('request');
var moment = require('moment-timezone')
var size ='';
var data;
var url = 'https://cfb-solrac.herokuapp.com/v1/date/'+moment().tz('America/Chicago').format('YYYYMMDD');

function getdata(callback){
  request({
    url: url,
    json: true
}, function (error, response, body) {

    if (!error && response.statusCode === 200) {
      data = body.games;
      callback(data)
    }

})
}
getdata(function(data){
  fs.writeFile('index.html', "<head><style>body{background-color: darkgrey;color: white;font-family: 'Arial';font-size: 12px;font-weight: bold;}.floatingbox {float: left;width:150px;height:85px;margin:0px;border:2px solid}.split1 {float: left;width:70%;height:100%;margin-left:5px;}.split2 {float: right;width:20%;height:100%;text-align: right;margin-right:5px}</style></head>", function(err){if(err) throw err;})
for (var i=0;i<data.length;i++){
  var home = '';
  var away = '';
  var homes =data[i].scores.home;
  var aways =data[i].scores.away;
  var q ='Q';
  var timetill=moment(data[i].date).fromNow()
  
  if (data[i].homeTeam.rank<26){home=data[i].homeTeam.rank+' '} //add rank if <26
  if (data[i].awayTeam.rank<26){home=data[i].awayTeam.rank+' '}
  
  if (data[i].homeTeam.location.length<15){ //names
  home=home+data[i].homeTeam.location;
  }else{home=home+data[i].homeTeam.abbreviation} 
  if (data[i].awayTeam.location.length<15){ //names
  away=away+data[i].awayTeam.location;
  }else{away=away+data[i].awayTeam.abbreviation}
  
  fs.appendFile("index.html",'<div class="floatingbox"><div class="split1"><p>'+timetill+'</p><p style="color:#'+data[i].homeTeam.color+'">'+home+'</p><p style="color:#'+data[i].awayTeam.color+'">'+away+'</p></div><div class="split2"><p>'+q+'</p><p>'+homes+'</p><p>'+aways+'</p></div></div>')
}
  fs.readFile('./index.html', function (err, html) {
    if (err) {
        throw err; 
    }       
    http.createServer(function(request, response) {  
        response.writeHeader(200, {"Content-Type": "text/html"});  
        response.write(html);  
        response.end();  
    }).listen(3000);
});

})