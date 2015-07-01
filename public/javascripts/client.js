//ADD CHECKBOXES TO SELECT WINNER BASED ON PLAYER 1 AND PLAYER 2 SELECTED
var player1 = document.getElementById('player1');
var player2 = document.getElementById('player2');
var winnerDiv = document.getElementById('winner');

var firstName = function (fullName) {
  return fullName.substring(0, (fullName.indexOf(' ') + 2)) + '.';
};

var execute1 = function () {
  var player1Name = document.getElementById('player1').value;
  var name1 = document.getElementById('name1');
  var score1 = document.getElementById('score1');
  if (player1Name === 'choose') {
    name1.innerHTML = 'Choose Player 1'.italics();
    score1.innerHTML = 'Choose Player 1'.italics();
  } else {
  name1.innerHTML = firstName(player1Name) + ' &nbsp';
  score1.innerHTML = firstName(player1Name) + ' &nbsp';
}
};

var execute2 = function () {
  var player2Name = document.getElementById('player2').value;
  var name2 = document.getElementById('name2');
  var score2 = document.getElementById('score2');
  if (player2Name === 'choose') {
    name2.innerHTML = 'Choose Player 2'.italics();
    score2.innerHTML = 'Choose Player 2'.italics();
  } else {
  name2.innerHTML = firstName(player2Name) + ' &nbsp';
  score2.innerHTML = firstName(player2Name) + ' &nbsp';
}
};

document.onLoad =
  execute1();
  execute2();

player1.addEventListener('change', execute1);

player2.addEventListener('change', execute2);


//----------------------------------------------------------
