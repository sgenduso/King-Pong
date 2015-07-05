
  //converts full name to first name plus last initial
  var firstName = function (fullName) {
    return fullName.substring(0, (fullName.indexOf(' ') + 2)) + '.';
  };

  //returns number of games won by 'name'
  var gamesWon = function (games, name) {
    var count = 0;
    games.forEach(function (game) {
      if (game.winner === name) {
        count ++;
      }
  });
      return count;
};

  //returns array of point differences in games won by 'name'
  var ptDiff = function (games, name) {
    var margins = [];
    var winPts;
    var losePts;
    var loser;
    games.forEach(function (game) {
      var winner = firstName(game.winner);
      if (game.winner === name) {
        if (name === game.player1) {
          loser = firstName(game.player2);
          winPts = game.p1Score;
          losePts = game.p2Score;
        } else {
          loser = firstName(game.player1);
          winPts = game.p2Score;
          losePts = game.p1Score;
        }
        var ptDiff = winPts - losePts;
        margins.push([ptDiff + ', vs. ' + loser]);
        margins.sort(function (a, b) {
          return b[1]-a[1];
        });
      }
    });
        return margins;
  };

  //returns array of winning streaks by 'name'
  var consecWins = function (games, name) {
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
    var myStreaks = [];
    streaks.forEach(function (streak) {
      if (streak[0] === name) {
        myStreaks.push(streak[1]);
      }
    });
    return myStreaks.sort(function (a, b) {
      return b-a;
    });
};

  //returns array of arrays of [name, unique opponents beaten]
  var oppsBeaten = function (games, name) {
    var leaders = {};
    games.forEach(function (game) {
      var loser;
      var winner = game.winner;
        if (game.player1 === winner) {
          loser = game.player2;
        } else {
          loser = game.player1;
        }
        if (leaders[winner]) {
          if (leaders[winner].indexOf(loser) === -1) {
            leaders[winner].push(loser);
          }
        } else {
          leaders[winner] = [];
          leaders[winner].push(loser);
        }
    });
    if (leaders[name]) {
      return leaders[name].length;
    } else {
      return 0;
    }
  };


module.exports = {
  gamesWon: gamesWon,
  ptDiff: ptDiff,
  consecWins: consecWins,
  oppsBeaten: oppsBeaten
};
