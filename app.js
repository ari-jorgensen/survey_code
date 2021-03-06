/* global require:true, console:true, process:true, __dirname:true */
'use strict'

// Example run command: `node app.js 9000 6380 true`; listen on port 9000, connect to redis on 6380, debug printing on.
var express     = require('express')
  , http        = require('http')
  , redis       = require('redis')
    , bodyParser = require('body-parser')
    , cookieParser = require('cookie-parser')
  , redisClient
  , port        = process.argv[2] || 8000
  , rport       = process.argv[3] || 6379
    , debug     = process.argv[4] || null
    , opacity   = process.argv[5] || 0.4
    , method    = process.argv[6] || 'below'


// Database setup
redisClient = redis.createClient(rport)

redisClient.on('connect', function() {
  console.log('Connected to redis.')
})

// Data handling
var save = function save(d) {
  redisClient.hmset(d.postId, {"content": JSON.stringify(d)})
  if( debug )
    console.log('saved to redis: ' + d.postId +', at: '+ (new Date()).toString())
}

// Server setup
var app = express()
app.use(bodyParser())
app.use(cookieParser())

// Set starting opacity as cookie. This allows us to
// access the variable from experimentr.js
app.use(function (req, res, next) {
  var opacityCookie = req.cookies.opacity;
  var debugCookie = req.cookies.debug;
  var methodCookie = req.cookies.methodType;
  console.log('val of cookie: ', opacityCookie);
  if (opacityCookie === undefined || opacityCookie === "") {
    res.cookie('opacity', (Number(opacity)));
    console.log('opacity cookie created successfully: ', opacity);
  }
  if (debugCookie === undefined || debugCookie === "") {
    res.cookie('debug', debug);
    console.log('debug cookie created successfully: ', debug);
  }
  if (methodCookie === undefined || methodCookie === "") {
    res.cookie('methodType', method);
    console.log('method cookie created successfully: ', method);
  }
  next();
})

app.use(express.static(__dirname + '/public'))
app.use('/scripts', express.static(__dirname + '/node_modules/'));

// If the study has finished, write the data to file
app.post('/finish', function(req, res) {
  fs.readFile('public/modules/consent/blocked-workers.json', 'utf8', function(err,data) {
    if (err) console.log(err);
    var data = JSON.parse(data);
    data.push(req.body.workerId);
    data = JSON.stringify(data);
    fs.writeFile('public/modules/consent/blocked-workers.json', data, function(err) {
      if(err) console.log(err);
    });
  });

  res.send(200)
})

// Handle POSTs from frontend
app.post('/', function handlePost(req, res) {
  // Get experiment data from request body
  var d = req.body
  // If a postId doesn't exist, add one (it's random, based on date)
  if (!d.postId) d.postId = (+new Date()).toString(36)
  // Add a timestamp
  d.timestamp = (new Date()).getTime()
  // Save the data to our database
  save(d)
  // Send a 'success' response to the frontend
  res.send(200)
})

// Create the server and tell which port to listen to
http.createServer(app).listen(port, function (err) {
  if (!err) console.log('Listening on port ' + port)
})
