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
var compare = require('../lib/javascripts/compare.js');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'KING PONG' });
});

router.post('/players', function (req, res, next) {
  for (var i = 1; i < players.length; i++) {
    var playerDoc = {id: players[i][0], name: players[i][1]};
    playerCollection.insert(playerDoc, function (err, player) {
    });
  }
  res.redirect('/');
});

router.get('/add', function (req, res, next) {
  playerCollection.find({$query: {}, $orderby: { name : 1 } },function (err, players) {
    var names = players.map(function (record) {
      return record.name;
    });
    var today = new Date();
    res.render('new', {title: 'Add Game Stats', names: names, today: today, errors: []});
  });
});

router.post('/add', function (req, res, next) {
  playerCollection.find({$query: {}, $orderby: { name : 1 } },function (err, players) {
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
    playerCollection.find({$query: {}, $orderby: { name : 1 } },function (err, players) {
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

  router.post('/compare', function (req, res, next) {
    var name1 = req.body.player1_select;
    var name2 = req.body.player2_select;
    var error = '';
    if (name1 === undefined || name2 === undefined) {
      error = 'Please choose 2 different players before comparing them.';
    }
    else if (name1 === name2) {
      error = 'Come on now, we\'re not that lonely here, no one has to be their own opponent...';
    }

    if (error !== '') {
    {playerCollection.find({$query: {}, $orderby: { name : 1 } },function (err, players) {
      res.render('players', {title: 'Pong Players', players: players, error: error});
    });
    }
  }

    else {

    gameCollection.find({ $or: [ {$and: [
      {player1: name1}, {player2:name2}] },
      { $and: [ {player1: name2}, {player2: name1} ] }
    ]}, function (err, games) {
      var name1 = req.body.player1_select;
      var name2 = req.body.player2_select;
      var firstOnly = function (fullName) {
        return fullName.substring(0, fullName.indexOf(' '));
      };
      var gamesWon = compare.gamesWon(games, name1, name2);
      var gamesPlayed = games.length;
      var ptDiff = compare.ptDiff(games, name1, name2);
      var avgPtDiff = compare.avgPtDiff(ptDiff);
      var consecWins = compare.consecWins(games, name1, name2);
      var wr1;
      if ((gamesWon[name1] / gamesPlayed * 100).toFixed(0) === 'NaN') {
        wr1 = 0;
      } else {
        wr1 = (gamesWon[name1] / gamesPlayed * 100).toFixed(0);
      }
      var wr2;
      if ((gamesWon[name2] / gamesPlayed * 100).toFixed(0) === 'NaN') {
        wr2 = 0;
      } else {
        wr2 = (gamesWon[name2] / gamesPlayed * 100).toFixed(0);
      }
      var pd1;
      var avgpd1;
      if (ptDiff[name1].length === 0) {
        pd1= 'N/A';
        avgpd1= 'N/A';
      } else {
        pd1 = ptDiff[name1][0];
        avgpd1 = avgPtDiff[name1];
      }
      var pd2;
      var avgpd2;
      if (ptDiff[name2].length === 0) {
        pd2= 'N/A';
        avgpd2= 'N/A';
      } else {
        pd2 = ptDiff[name2][0];
        avgpd2 = avgPtDiff[name2];
      }
      var ws1;
      if (consecWins[name1].length === 0) {
        ws1 = 0;
      } else {
        ws1 = consecWins[name1][0];
      }
      var ws2;
      if (consecWins[name2].length === 0) {
        ws2 = 0;
      } else {
        ws2 = consecWins[name2][0];
      }
      var comments = compare.comments(games);

      res.render('compare', {
        title: name1 + ' vs. ' + name2,
        name1: firstOnly(name1),
        name2: firstOnly(name2),
        gamesPlayed: gamesPlayed,
        gw1: gamesWon[name1],
        gw2: gamesWon[name2],
        wr1: wr1,
        wr2: wr2,
        pd1: pd1,
        pd2: pd2,
        avgpd1: avgpd1,
        avgpd2: avgpd2,
        ws1: ws1,
        ws2: ws2,
        comments: comments
      });
    });
  }
  });

  module.exports = router;
