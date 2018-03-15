const express = require('express');
const app = express();

var request = require('request');
request('https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/RiotSchmick?api_key=RGAPI-b3619dbd-6b7a-4851-88d3-d531fbeead88', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body);
      console.log(info);
    }
});

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>');
});

app.post('/', (req, res) => {
  res.send('Here is the response to your POST, man!\n');
});

app.put('/', (req, res) => {
  res.send('I am updated.\n');
});

app.delete('/', (req, res) => {
  res.send('All my memories have been deleted. Are you happy now?\n');
});

app.get('/secret', (req, res) => {
  res.send('Psst. You are being watched.\n');
});

app.get('/api/user/1', (req, res) => {
  res.send({name: "Amy Caprietti", avatar: "/avatars/supergirl.jpg", role: "admin"});
});


app.listen(3000, () => console.log('Server listening on port 3000!'))
