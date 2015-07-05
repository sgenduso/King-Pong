// returns number of games won by each
var gamesWon = function (games, name1, name2) {
  var players = {};
  players[name1]=0;
  players[name2]=0;
  games.forEach(function (game) {
    if (game.winner === name1) {
      players[name1] ++;
    } else {
      players[name2] ++;
    }
});
    return players;
};

//returns array of point differences in games won by each
var ptDiff = function (games, name1, name2) {
  var leaders = {};
  leaders[name1] = [];
  leaders[name2] = [];
  var winPts;
  var losePts;
  var loser;
  games.forEach(function (game) {
    var winner = game.winner;
    var ptDiff = Math.abs(game.p1Score - game.p2Score);
    leaders[winner].push(ptDiff);
  leaders[winner].sort(function (a, b) {
    return b[1]-a[1];
  });
  });
  return leaders;
};

//returns array of winning streaks by each
var consecWins = function (games, name1, name2) {
  var leaders = {};

  var dateTime = function (date, time) {
    return new Date(date + ' ' + time);
  };

  games = games.sort(function (a,b) {
    var dateSort = dateTime(a.date, a.time) - dateTime(b.date, b.time);
    if (dateSort) {
      return dateSort;
    }
    return b.winner - a.winner;
  });

  for (var i = 0; i < games.length; i++) {
    var p1 = games[i].player1;
    var p2 = games[i].player2;
    var winner = games[i].winner;
    if (leaders[p1]) {
      if (p1 === winner) {
        leaders[p1].push('won');
      } else {
        leaders[p1].push('lost');
      }
    } else {
      leaders[p1] = [];
      if (p1 === winner) {
        leaders[p1].push('won');
      } else {
        leaders[p1].push('lost');
      }
    }
    if (leaders[p2]) {
      if (p2 === winner) {
        leaders[p2].push('won');
      } else {
        leaders[p2].push('lost');
      }
    } else {
      leaders[p2] = [];
      if (p2 === winner) {
        leaders[p2].push('won');
      } else {
        leaders[p2].push('lost');
      }
    }
  }

  var streaks = [];
  var streak = 0;
  for (var key in leaders) {
    streak = 0;
    for (var i = 0; i < leaders[key].length; i++) {
      if (leaders[key][i] === 'won' && leaders[key][i] === leaders[key][i+1]) {
        streak ++;
      } else if (leaders[key][i] === 'won') {
        streak ++;
        streaks.push([key, streak]);
        streak = 0;
      } else {
        streaks.push([key, streak]);
        streak = 0;
      }
    }
  }
  var ourStreaks = {};
  ourStreaks[name1] = [];
  ourStreaks[name2] = [];
  streaks.forEach(function (streak) {
    ourStreaks[streak[0]].push(streak[1]);
  });
  for (var person in ourStreaks) {
      ourStreaks[person].sort(function (a,b) {
        return b-a;
      });

  }
  return ourStreaks;
};

var comments = function (games) {
  var comments = games.map(function (game) {
    return [game.date, game.time, game.comments];
  });
  return comments.sort(function (a,b) {
    return a[0]-b[0];
  });
};

module.exports = {
gamesWon: gamesWon,
ptDiff: ptDiff,
consecWins: consecWins,
comments: comments
};
