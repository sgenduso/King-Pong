var express = require('express');
var router = express.Router();
var db = require('monk')(process.env.PONG_DB);
var gameCollection = db.get('games');
var playerCollection = db.get('players');
var playerInfo = require('../lib/javascripts/players.js');
var players = playerInfo.playerNames;

/* GET home page. */
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
  playerCollection.find({},function (err, players) {
    var names = players.map(function (record) {
      return record.name;
    });
  res.render('new', {title: 'Add Stats', names: names});
  });
});




module.exports = router;
