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
  var winners = {};
  games.forEach(function (game) {
    var name = firstName(game.winner);
    winners[name] = winners[name] || 0;
    winners[name] += 1;
  });
  winners = sortObj(winners);
  console.log(winners);
  return winners;
};

module.exports = {
  sortObj: sortObj,
  firstName: firstName,
  gamesWon: gamesWon

};
