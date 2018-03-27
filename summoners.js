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

var summoner = {name:"-1"};
var topChamps;
let api_key = "RGAPI-8c0ef0d6-0f34-43d4-9361-f6b459d358c3";

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
      // console.log(infoSummoner);
      summoner = {name:infoSummoner.name, lvl:infoSummoner.summonerLevel, icon:infoSummoner.profileIconId};
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
          var topChampNames = ["", "", ""];
          for(let champ in infoChamps.data) {
            if(infoChamps.data[champ].id == topChamps[0]) {
              topChampNames[0] = champ;
            }
            else if(infoChamps.data[champ].id == topChamps[1]) {
              topChampNames[1] = champ;
            }
            else if(infoChamps.data[champ].id == topChamps[2]) {
              topChampNames[2] = champ;
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