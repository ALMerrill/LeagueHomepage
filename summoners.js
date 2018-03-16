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

let summoner = {};
let id = 0;
let api_key = "RGAPI-13320ace-e222-4f7b-9334-f7e8b1297eb8";

// request("https://na1.api.riotgames.com/lol/static-data/v3/profile-icons?api_key=RGAPI-b3619dbd-6b7a-4851-88d3-d531fbeead88", function(error, response, body) {
//   if (!error && response.statusCode == 200) {
//     var info = JSON.parse(body);
//     let icon = info.image;
//     console.log(icon);
//   }
// });

// for(let i = 10000; i < 20000; i++) {
  
//   http.get("http://ddragon.leagueoflegends.com/cdn/6.24.1/img/profileicon/" + String(i) + ".png ", function(res) {
//     if (res.statusCode == 200) {
//       res.pipe(fs.createWriteStream("public/img/" + String(i) + ".png"));
//     }
//   });
// }

app.get('/api/summoner', (req, res) => {
  res.send(summoner);
});

app.post('/api/summoner', (req, res) => {
  request('https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/' + req.body.name + '?api_key=' + api_key, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body);
      id = id + 1;
      summoner = {id:id, name:info.name, lvl:info.summonerLevel, icon:info.profileIconId};
      // summoner = summoner;
      res.send(summoner);
    }
    else {
      console.log(response.body);
    }
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