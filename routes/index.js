var express = require('express');
var router = express.Router();
var db = require('monk')(process.env.MONGOLAB_URI || process.env.PONG_DB);
var gameCollection = db.get('games');
var playerCollection = db.get('players');
var playerInfo = require('../lib/javascripts/players.js');
var players = playerInfo.playerNames;
var validate = require('../lib/javascripts/validate.js');
var leaders = require('../lib/javascripts/leaders.js');
var individuals = require('../lib/javascripts/individuals.js');

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
      var gamesPlayed = leaders.gamesPlayed(games);
      var winRates = leaders.winRates(gamesPlayed, gamesWon);
      var ptDiff = leaders.ptDiff(games);
      var consecWins = leaders.consecWins(games);
      var oppsBeaten = leaders.oppsBeaten(games);

      res.render('leaders', {
        title: 'LEADERBOARD',
        gamesWon: gamesWon,
        gamesPlayed: gamesPlayed,
        winRates: winRates,
        ptDiff: ptDiff,
        consecWins: consecWins,
        oppsBeaten: oppsBeaten
      });
    });
  });

  router.get('/players', function (req, res, next) {
    playerCollection.find({},function (err, players) {
      res.render('players', {title: 'Pong Players', players: players});
    });
  });

  router.post('/individual', function (req, res, next) {
    var name = req.body.player_select;
    gameCollection.find({$or: [{player1: name}, {player2: name}]}, function (err, games) {
      var gamesWon = individuals.gamesWon(games, name);
      var gamesPlayed = games.length;
      var winRate = (gamesWon / gamesPlayed *100).toFixed(0);
        if (winRate === undefined || winRate === 'NaN') {
          winRate = 0;
        }
      var ptDiff = individuals.ptDiff(games, name);
        if (ptDiff.length === 0) {
          ptDiff = 'N/A';
        } else {
          ptDiff = ptDiff[0];
        }
      var consecWins = individuals.consecWins(games, name);
        if (consecWins.length === 0) {
          consecWins = 0;
        } else {
          consecWins = consecWins[0];
        }
      var oppsBeaten = individuals.oppsBeaten(games, name);

      res.render('individual', {
        title: name,
        games:games,
        gamesWon: gamesWon,
        gamesPlayed: gamesPlayed,
        winRate: winRate,
        ptDiff: ptDiff,
        consecWins: consecWins,
        oppsBeaten: oppsBeaten
        });
    });
  });

  module.exports = router;
