var sortObj = function (obj) {
  var sortable = [];
  for (var key in obj) {
    sortable.push([key, obj[key]]);
  }
  sortable.sort(function (a, b) {
    return b[1]-a[1];
  });
  return sortable;
};

var firstName = function (fullName) {
  return fullName.substring(0, (fullName.indexOf(' ') + 2)) + '.';
};

var gamesWon = function (games) {
  var leaders = {};
  games.forEach(function (game) {
    var name = firstName(game.winner);
    leaders[name] = leaders[name] || 0;
    leaders[name] += 1;
  });
  leaders = sortObj(leaders);
  return leaders;
};

var gamesPlayed = function (games) {
  var leaders = {};
  games.forEach(function (game) {
    var name1 = firstName(game.player1);
    var name2 = firstName(game.player2);
    leaders[name1] = leaders[name1] || 0;
    leaders[name2] = leaders[name2] || 0;
    leaders[name1] += 1;
    leaders[name2] += 1;
  });
  leaders = sortObj(leaders);
  return leaders;
};

var winRates = function (playedArray, wonArray) {
  var leaders = [];
  for (var i = 0; i < playedArray.length; i++) {
    if (i<wonArray.length) {
      for (var j = 0; j < wonArray.length; j++) {
        if (wonArray[j][0] === playedArray[i][0]) {
          leaders.push([wonArray[j][0], ((wonArray[j][1]/playedArray[i][1])*100).toFixed(0)]);
        }
      }
    } else {
      leaders.push([playedArray[i][0], 0]);
    }
  }
  leaders.sort(function (a, b) {
    return b[1]-a[1];
  });
  return leaders;
};

var ptDiff = function (games) {
  var leaders = [];
  var winPts;
  var losePts;
  var loser;
  games.forEach(function (game) {
    var winner = firstName(game.winner);
    if (game.winner === game.player1) {
      loser = firstName(game.player2);
      winPts = game.p1Score;
      losePts = game.p2Score;
    } else {
      loser = firstName(game.player1);
      winPts = game.p2Score;
      losePts = game.p1Score;
    }
    var ptDiff = winPts - losePts;
    leaders.push([(winner + ' vs. ' + loser), ptDiff]);
  });
  leaders.sort(function (a, b) {
    return b[1]-a[1];
  });
  return leaders;
};

var consecWins = function (games) {
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
        streaks.push([firstName(key), streak]);
        streak = 0;
      } else {
        streaks.push([firstName(key), streak]);
        streak = 0;
      }
    }
  }
  return streaks.sort(function (a, b) {
    return b[1]-a[1];
  });
};



module.exports = {
  sortObj: sortObj,
  firstName: firstName,
  gamesWon: gamesWon,
  gamesPlayed: gamesPlayed,
  winRates: winRates,
  ptDiff: ptDiff,
  consecWins: consecWins
};
