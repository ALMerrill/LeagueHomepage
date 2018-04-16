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

// Knex Setup
const env = process.env.NODE_ENV || 'development';
const config = require('./knexfile')[env];  
const db = require('knex')(config);

// bcrypt setup
let bcrypt = require('bcrypt');
const saltRounds = 10;

// jwt setup
const jwt = require('jsonwebtoken');
let jwtSecret = process.env.jwtSecret;
if (jwtSecret === undefined) {
  console.log("You need to define a jwtSecret environment variable to continue.");
  knex.destroy();
  process.exit();
}

var summoner = {name:"-1"};
var topChamps;
let api_key = "RGAPI-100858eb-f925-462a-933b-20286c607dd0";
// let api_key = "RGAPI-e7aef6bb-c596-4b0d-9a94-13115b3a599f"; //permanent

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token){
    console.log("No token provided");
    return res.status(403).send({ error: 'No token provided.' });
  }
  jwt.verify(token, jwtSecret, function(err, decoded) {
    if (err)
      return res.status(500).send({ error: 'Failed to authenticate token.' });
    // if everything good, save to request for use in other routes
    req.userID = decoded.id;
    next();
  });
}


app.get('/api/summoner', (req, res) => {
  // str = JSON.stringify(summoner);
  // str = JSON.stringify(summoner, null, 4); // (Optional) beautiful indented output.
  // console.log("get summoner: " + str);
  
  res.send(summoner);
});

app.post('/api/summoner', verifyToken, (req, res) => {
  // if (id !== req.userID) {
  //   res.status(403).send();
  //   return;
  // }
  var infoSummoner;
  var infoMastery;
  var infoChamps;
  // db('league').select().where('name', req.body.name).from('summoners').then(summoner => {
  //   console.log("summoner found: " + summoner);
  // }).catch(error => {
  //   console.log("Summoner not found");
  //   res.status(500).json({ error });
  // });

  //Check if summoner is in database  
  db('summoners').where('name', req.body.name).first().then(summoner => {
    if (summoner === undefined) {

      request('https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/' + req.body.name + '?api_key=' + api_key, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          infoSummoner = JSON.parse(body);
          // console.log(infoSummoner);
          summoner = {name:infoSummoner.name.toLowerCase(), lvl:infoSummoner.summonerLevel, icon:infoSummoner.profileIconId};
        }
        else {
          res.send(error);
          console.log("Error1: " + response.body);
          return;
        }
        request('https://na1.api.riotgames.com/lol/champion-mastery/v3/champion-masteries/by-summoner/' + String(infoSummoner.id) + '?api_key=' + api_key, function(error, response, body) {
          if(!error && response.statusCode == 200) {
            infoMastery = JSON.parse(body);
            topChamps = [infoMastery[0].championId, infoMastery[1].championId, infoMastery[2].championId];
          }
          else {
            console.log("Error2: " + response.body)
          }
          var incomplete = true;
          while(incomplete) {
            request('https://na1.api.riotgames.com/lol/static-data/v3/champions?api_key=' + api_key, function(error, response, body) {
              if(!error && response.statusCode == 200) {
                incomplete = false;
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
                db('summoners').insert({name:summoner.name, lvl:summoner.lvl, icon:summoner.icon, topChamp1:summoner.topChamps[0], topChamp2:summoner.topChamps[1], topChamp3:summoner.topChamps[2], created_at: new Date()}).whereNotExists(db('league').select().where('name',summoner.name)).then(summoner => {
                  // res.status(200).json({id:summoner[0]});
                }).catch(error => {
                  console.log("Summoner not inserted");
                  console.log(error);
                  res.status(500).json({ error });
                });
                // db('summoners').where('name', summoner.name).first().then(summoner => {
                //   if (summoner !== undefined) {
                //     return db('summoners').insert({name:summoner.name, lvl:summoner.lvl, icon:summoner.icon, topChamp1:topChamps[0], topChamp2:topChamps[1], topChamp3:topChamps[2], created_at: new Date()});
                //   }
                // });
                res.send(summoner);
              }
              else {
                console.log("Error3: " + body);
                sleep(200);
                console.log("done");
              }
            });
            incomplete = false;
          }
        });
      });

    }
    else {
      console.log("Selecting from database");
      db('league').select().where('name', summoner.name).from('summoners').then(summoner_ => {
        summoner = summoner_[0];

        new_summoner = {name:summoner.name, lvl:summoner.lvl, icon:summoner.icon, topChamps:[summoner.topChamp1, summoner.topChamp2, summoner.topChamp3]};
        // str = JSON.stringify(new_summoner);
        // str = JSON.stringify(new_summoner, null, 4); // (Optional) beautiful indented output.
        // console.log("new: " + str); // Logs output to dev tools console.

        res.send(new_summoner);
      }).catch(error => {
        console.log("Summoner not selected");
        console.log(error)
        res.status(500).json({ error });
      });
    }
  });
});

app.post('/api/login', (req, res) => {
  if (!req.body.username || !req.body.password)
    return res.status(400).send();
  db('users').where('username',req.body.username).first().then(user => {
    if (user === undefined) {
      res.status(403).send("Invalid credentials");
      throw new Error('abort');
    }
    return [bcrypt.compare(req.body.password, user.hash),user];
  }).spread((result,user) => {
    // if (result)
    //   res.status(200).json({user:user});
    // else
    //   res.status(403).send("Invalid credentials");
    if (result) {
      let token = jwt.sign({ id: user.id }, jwtSecret, {
        expiresIn: 86400 // expires in 24 hours
      });
      res.status(200).json({user:user,token:token});
    } else {
      res.status(403).send("Invalid credentials");
    }
    return;
  }).catch(error => {
    if (error.message !== 'abort') {
      console.log(error);
      res.status(500).json({ error });
    }
  });
});

app.post('/api/users', (req, res) => {
  if (!req.body.email || !req.body.password || !req.body.username || !req.body.name)
    return res.status(400).send();
  db('users').where('email',req.body.email).first().then(user => {
    if (user !== undefined) {
      res.status(403).send("Email address already exists");
      throw new Error('abort');
    }
    return db('users').where('username',req.body.username).first();
  }).then(user => {
    if (user !== undefined) {
      res.status(409).send("User name already exists");
      throw new Error('abort');
    }
    return bcrypt.hash(req.body.password, saltRounds);
  }).then(hash => {
    return db('users').insert({email: req.body.email, hash: hash, username:req.body.username,
         name:req.body.name});
  }).then(ids => {
    return db('users').where('id',ids[0]).first().select('username','name','id');
  }).then(user => {
    // res.status(200).json({user:user});
    let token = jwt.sign({ id: user.id }, jwtSecret, {
      expiresIn: 86400 // expires in 24 hours
    });
    res.status(200).json({user:user,token:token});
    return;
  }).catch(error => {
    if (error.message !== 'abort') {
      console.log(error);
      res.status(500).json({ error });
    }
  });
});

// Get my account
app.get('/api/me', verifyToken, (req,res) => {
  db('users').where('id',req.userID).first().select('username','name','id').then(user => {
    res.status(200).json({user:user});
  }).catch(error => {
    res.status(500).json({ error });
  });
});

app.listen(3033, () => console.log('Server listening on port 3033!'));
