const express = require('express');
const request = require('request');
const bodyParser = require("body-parser");
const http = require('http');
const fs = require('fs');

for(let i = 0; i < ?; i++)
  let file = fs.createWriteStream("img/icon" + i + ".png");
  http.get("http://ddragon.leagueoflegends.com/cdn/6.24.1/img/profileicon/588.png ", function(response) {
    response.pipe(file);
  });

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'));

let summoners = [];
let id = 0;
let api_key = "RGAPI-b3619dbd-6b7a-4851-88d3-d531fbeead88";

app.get('/api/summoners', (req, res) => {
  res.send(summoners);
});

app.post('/api/summoners', (req, res) => {
  console.log(req.body.name);
  request('https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/' + req.body.name + '?api_key=' + api_key, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body);
      id = id + 1;
      let summoner = {id:id, name:info.name, lvl:info.summonerLevel};
      summoners.push(summoner);
      res.send(summoner);
    }
  });
});

app.delete('/api/summoners/:id', (req, res) => {
  let id = parseInt(req.params.id);
  let removeIndex = summoners.map(summoner => { return summoner.id; }).indexOf(id);
  if (removeIndex === -1) {
    res.status(404).send("Sorry, that summoner doesn't exist");
    return;
  }
  summoners.splice(removeIndex, 1);
  res.sendStatus(200);
});

app.listen(3000, () => console.log('Server listening on port 3000!'))