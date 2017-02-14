var creds = {};
var fs = require('fs');
var twit = require('twit');
var diseases = require('./diseases.js');
var tweeted = require('./tweeted.js');
var tweeted = [];

if (process.env.creds) {
  console.log('process.env.creds == true');
  creds = {
    consumer_key: process.env.K,
    consumer_secret: process.env.S,
    access_token: process.env.T,
    access_token_secret: process.env.TS
  };
} else {
  console.log('process.env.creds == false');
  creds = require('./creds.js');
}
var T = new twit(creds);

function tweet() {
  console.log('tweet: start');

  var disease = diseases.splice(0, 1)[0];
  while (tweeted.indexOf(disease) != -1){
    console.log('duplicate disease');
    disease = diseases.splice(0, 1)[0];
  }

  var params = {
    status: disease
  };

  T.post('statuses/update', params, function () {
    console.log('tweeted: ' + disease);
    tweeted.push(disease);
    fs.writeFile('./tweeted.js', 'module.exports = ' + JSON.stringify(tweeted), function (err){
        if (!err){
          console.log('tweeted.js written');
        } else {
          console.log('tweeted.js write error');
        }
      }
    );
    fs.writeFile('./diseases.js', 'module.exports = ' + JSON.stringify(diseases), function (err){
        if (!err){
          console.log('diseases.js written');
        } else {
          console.log('diseases.js write error');
        }
      }
    );
    console.log('');
  });
};

var prevTime = new Date();
function checkTime(){
  var now = new Date();
  // if ((now - prevTime) / 60000 > .5){
  if ((now - prevTime) / 60000 > 120){
    tweet();
    prevTime = now;
  }
}

tweet();
setInterval(checkTime, 15000);
