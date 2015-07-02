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
  console.log(leaders);
  return leaders;
};


module.exports = {
  sortObj: sortObj,
  firstName: firstName,
  gamesWon: gamesWon,
  gamesPlayed: gamesPlayed,
  winRates: winRates,
  ptDiff: ptDiff
};
