const express = require('express');
const request = require('request');
const bodyParser = require("body-parser");
const http = require('http');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("img", express.static(__dirname + '/img'));


app.use(express.static('public'));

var summoner = {};
let id = 0;
var topChamps;
let api_key = "RGAPI-13320ace-e222-4f7b-9334-f7e8b1297eb8";

// request("https://na1.api.riotgames.com/lol/static-data/v3/profile-icons?api_key=RGAPI-b3619dbd-6b7a-4851-88d3-d531fbeead88", function(error, response, body) {
//   if (!error && response.statusCode == 200) {
//     var info = JSON.parse(body);
//     let icon = info.image;
//     console.log(icon);
//   }
// });

// for(let i = 1449; i < 3000; i++) {
  
//   http.get("http://ddragon.leagueoflegends.com/cdn/6.24.1/img/profileicon/" + String(i) + ".png", function(res) {
//     if (res.statusCode == 200) {
//       res.pipe(fs.createWriteStream("public/img/" + String(i) + ".png"));
//     }
//   });
// }

app.get('/api/summoner', (req, res) => {
  res.send(summoner);
});

app.post('/api/summoner', (req, res) => {
  var infoSummoner;
  var infoMastery;
  var infoChamps;
  request('https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/' + req.body.name + '?api_key=' + api_key, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      infoSummoner = JSON.parse(body);
      id = id + 1;
      summoner = {id:id, name:infoSummoner.name, lvl:infoSummoner.summonerLevel, icon:infoSummoner.profileIconId};
    }
    else {
      console.log("Summoner: " + response.body);
    }
    request('https://na1.api.riotgames.com/lol/champion-mastery/v3/champion-masteries/by-summoner/' + String(infoSummoner.id) + '?api_key=' + api_key, function(error, response, body) {
      if(!error && response.statusCode == 200) {
        infoMastery = JSON.parse(body);
        topChamps = [infoMastery[0].championId, infoMastery[1].championId, infoMastery[2].championId];
      }
      else {
        console.log("Mastery: " + response.body)
      }
      request('https://na1.api.riotgames.com/lol/static-data/v3/champions?api_key=' + api_key, function(error, response, body) {
        if(!error && response.statusCode == 200) {
          infoChamps = JSON.parse(body);
          var topChampNames = [];
          console.log('1');
          for(let champ in infoChamps.data) {
            if(infoChamps.data[champ].id == topChamps[0]) {
              topChampNames.push(champ);
            }
          }
          console.log('2');
          for(let champ in infoChamps.data) {
            if(infoChamps.data[champ].id == topChamps[1]) {
              topChampNames.push(champ);
            }
          }
          console.log('3');
          for(let champ in infoChamps.data) {
            if(infoChamps.data[champ].id == topChamps[2]) {
              topChampNames.push(champ);
            }
          }
          summoner.topChamps = topChampNames;
          res.send(summoner);
        }
        else {
          console.log("Champ: " + response.body);
        }
      });
    });
  });
});

// app.delete('/api/summoners/:id', (req, res) => {
//   let id = parseInt(req.params.id);
//   let removeIndex = summoners.map(summoner => { return summoner.id; }).indexOf(id);
//   if (removeIndex === -1) {
//     res.status(404).send("Sorry, that summoner doesn't exist");
//     return;
//   }
//   summoners.splice(removeIndex, 1);
//   res.sendStatus(200);
// });

app.listen(3030, () => console.log('Server listening on port 3030!'))