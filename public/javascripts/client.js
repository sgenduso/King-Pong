//ADD CHECKBOXES TO SELECT WINNER BASED ON PLAYER 1 AND PLAYER 2 SELECTED
var player1 = document.getElementById('player1');
var player2 = document.getElementById('player2');
var winnerDiv = document.getElementById('winner');

player1.addEventListener('change', function () {
var player1Name = document.getElementById('player1').value;
document.getElementById('name1').innerHTML = player1Name + ' &nbsp';
document.getElementById('score1').innerHTML = player1Name + ' &nbsp';
});

player2.addEventListener('change', function () {
var player2Name = document.getElementById('player2').value;
document.getElementById('name2').innerHTML = player2Name + ' &nbsp';
document.getElementById('score2').innerHTML = player2Name + ' &nbsp';
});



// player1.addEventListener('change', function () {
// var player1Name = document.getElementById('player1').value;
//     document.getElementById('score1').innerHTML = player1Name + '&nbsp';
//   if(document.getElementById('name1')) {
//     document.getElementById('name1').innerHTML = player1Name;
//   } else {
//     var label1 = document.createElement('label');
//     label1.htmlFor = 'one-won';
//     label1.innerHTML = player1Name;
//     label1.id = 'name1';
//     var oneWon = document.createElement('input');
//     oneWon.type = 'radio';
//     oneWon.id = 'one-won';
//     oneWon.name = 'winner';
//     winnerDiv.appendChild(oneWon);
//     winnerDiv.appendChild(label1);
//   }
// });
//
// player2.addEventListener('change', function () {
// var player2Name = document.getElementById('player2').value;
//     document.getElementById('score2').innerHTML = player2Name + '&nbsp';
//   if(document.getElementById('name2')) {
//     document.getElementById('name2').innerHTML = player2Name;
//   } else {
//     var label2 = document.createElement('label');
//     label2.htmlFor = 'two-won';
//     label2.innerHTML = player2Name;
//     label2.id = 'name2';
//     var twoWon = document.createElement('input');
//     twoWon.type = 'radio';
//     twoWon.id = 'two-won';
//     twoWon.name = 'winner';
//     winnerDiv.appendChild(twoWon);
//     winnerDiv.appendChild(label2);
//   }
// });

// return only first name: substring(0, player1.value.indexOf(' '))
//----------------------------------------------------------
