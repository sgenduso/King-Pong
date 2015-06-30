var express = require('express');
var router = express.Router();
var db = require('monk')(process.env.PONG_DB);
var gameCollection = db.get('games');
var playerCollection = db.get('players');
var playerInfo = require('../lib/javascripts/players.js');
var players = playerInfo.playerNames;
var validate = require('../lib/javascripts/validate.js');

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
    var player1 = req.body.player1 || '';
    var player2 = req.body.player2 || '';
    var points = req.body.points;
    var winner = req.body.winner || '';
    var p1Score = req.body.p1_score;
    var p2Score = req.body.p2_score;
    var date = req.body.date;
    var errors = validate.form(player1, player2, points, winner, p1Score, p2Score, date);
    if (errors) {
      var names = players.map(function (record) {
        return record.name;
      });
      var today = new Date();
      res.render('new', {title: 'Add Game Stats', names: names, errors:errors});
    } else {
      res.redirect('/');
    }
  });
});


module.exports = router;
