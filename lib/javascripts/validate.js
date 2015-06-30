module.exports = {

form: function (player1, player2, points, winner, p1Score, p2Score, date) {
  var errors = [];
  if (player1==='') {
    errors.push('Must choose Player 1 before proceeding.');
  }
  if (player2==='') {
    errors.push('Must choose Player 2 before proceeding.');
  }
  if (player1===player2) {
    errors.push('Player 1 and Player 2 must be different people.');
  }
  if (points.length===0) {
    errors.push('Must specify how many points this game went to.');
  }
  if (Number(p1Score) < Number(points) && Number(p2Score) < Number(points)) {
    errors.push('If you played to ' + points + ', someone must have scored at least that many!');
  }
  if (winner==='') {
    errors.push('Who won this game??');
  }
  if ((winner==='one-won' && Number(p1Score) < Number(p2Score)) || (winner==='two-won' && Number(p2Score) < Number(p1Score))) {
    errors.push('The winner you select must have more points than the loser.');
  }
  if (date.length===0) {
    errors.push('Please input the date of this game before proceeding.');
  }
  if (new Date(date) > new Date()) {
    errors.push('Oh you played this game in the future, did you?');
  }
return errors;
}

};
