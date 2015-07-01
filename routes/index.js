var express = require('express');
var router = express.Router();
var db = require('monk')(process.env.MONGOLAB_URI || process.env.PONG_DB);
var gameCollection = db.get('games');
var playerCollection = db.get('players');
var playerInfo = require('../lib/javascripts/players.js');
var players = playerInfo.playerNames;
var validate = require('../lib/javascripts/validate.js');
var leaders = require('../lib/javascripts/leaders.js');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'KING PONG' });
});

// router.post('/players', function (req, res, next) {
//   for (var i = 1; i < players.length; i++) {
//     var playerDoc = {id: players[i][0], name: players[i][1]};
//     playerCollection.insert(playerDoc, function (err, player) {
//     });
//   }
//   res.redirect('/');
// });

router.get('/add', function (req, res, next) {
  playerCollection.find({},function (err, players) {
    var names = players.map(function (record) {
      return record.name;
    });
    var today = new Date();
    res.render('new', {title: 'Add Game Stats', names: names, today: today, errors: []});
  });
});

router.post('/add', function (req, res, next) {
  playerCollection.find({},function (err, players) {
    console.log(req.body);
    var player1 = req.body.player1;
    var player2 = req.body.player2;
    var points = req.body.points;
    var winner = req.body.winner || '';
    var p1Score = req.body.p1_score;
    var p2Score = req.body.p2_score;
    var date = req.body.date;
    var time = req.body.time;
    var comments = req.body.comments;
    var errors = validate.form(player1, player2, points, winner, p1Score, p2Score, date);
    if (errors.length !== 0) {
      var names = players.map(function (record) {
        return record.name;
      });
      var today = new Date();
      res.render('new',
      {
        title: 'Add Game Stats',
        names: names,
        errors:errors,
        player1: player1,
        player2: player2,
        points: points,
        winner: winner,
        p1Score: p1Score,
        p2Score: p2Score,
        date: date,
        time: time,
        comments: comments
      });
    } else {
      if (winner === 'one-won') {
        winner = player1;
      } else if (winner === 'two-won') {
        winner = player2;
      }
      gameCollection.insert(
        {
          player1: player1,
          player2: player2,
          points: points,
          winner: winner,
          p1Score: p1Score,
          p2Score: p2Score,
          date: date,
          time: time,
          comments: comments
          });
      res.redirect('/leaderboard');
    }
  });
});

router.get('/leaderboard', function (req, res, next) {
  gameCollection.find({}, function (err, games) {
    var gamesWon = leaders.gamesWon(games);
  res.render('leaders', {
    title: 'LEADERBOARD',
    gameName1: gamesWon[0][0],
    gameCount1: gamesWon[0][1],
    gameName2: gamesWon[1][0],
    gameCount2: gamesWon[1][1],
    gameName3: gamesWon[2][0],
    gameCount3: gamesWon[2][1],
    gameName4: gamesWon[3][0],
    gameCount4: gamesWon[3][1],
    gameName5: gamesWon[4][0],
    gameCount5: gamesWon[4][1],
    });
  });
});


module.exports = router;
