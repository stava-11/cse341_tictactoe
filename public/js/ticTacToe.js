let player1 = true; 
let play = true;
let clickCount = 0;

let game = {
    "1": null,
    "2": null,
    "3": null,
    "4": null,
    "5": null,
    "6": null,
    "7": null,
    "8": null,
    "9": null,
    "winner": null
}

document.getElementById("1").addEventListener("click", playerturn);
document.getElementById("2").addEventListener("click", playerturn);
document.getElementById("3").addEventListener("click", playerturn);
document.getElementById("4").addEventListener("click", playerturn);
document.getElementById("5").addEventListener("click", playerturn);
document.getElementById("6").addEventListener("click", playerturn);
document.getElementById("7").addEventListener("click", playerturn);
document.getElementById("8").addEventListener("click", playerturn);
document.getElementById("9").addEventListener("click", playerturn);

function playerturn() {
    if (this.innerHTML == ''){
        if (play) {
            if (player1) {
                this.innerHTML = 'X';
                game[this.id] = this.innerHTML;
                console.log(game);
                player1 = false;
            }
            else {
                this.innerHTML = 'O';
                game[this.id] = this.innerHTML;
                console.log(game);
                player1 = true;
            }
        }
        clickCount++;
    }
    checkwin();
}

function checkwin() {
    grid = document.querySelectorAll('#myTable td');
    // check vert
    let i = 0;
    for (i = 0; i < 3; i++) {
        if (grid[i].innerHTML != ''){
            if (grid[i].innerHTML === grid[i+3].innerHTML && grid[i+3].innerHTML === grid[i+6].innerHTML){
                checkWinner(i, i, i+3, i+6);
            }
        }
    }
    // check horizontal
    for (i = 0; i < 7; i += 3) {
        if (grid[i].innerHTML != ''){
            if (grid[i].innerHTML === grid[i+1].innerHTML && grid[i+1].innerHTML === grid[i+2].innerHTML) {
                checkWinner(i, i, i+1, i+2);
            }
        }
    }
    // diagonal down
    if (grid[0].innerHTML != ''){
        if (grid[0].innerHTML == grid[4].innerHTML && grid[4].innerHTML == grid[8].innerHTML) {
            checkWinner(0, 0, 4, 8);
        }
    }
    // diagonal up
    if (grid[2].innerHTML != ''){
        if (grid[2].innerHTML == grid[4].innerHTML && grid[4].innerHTML == grid[6].innerHTML) {
            checkWinner(2, 2, 4, 6);
        }
    }
    // tie game
    if (clickCount == 9 && play == true) {
        document.getElementById("title").innerText = "Tie Game!";
        document.querySelectorAll('#myTable td').forEach(e => e.classList.add("winner"));
        game["winner"] = "tie";
        play = false;
    }
}

function checkWinner(input, a, b, c){
    if (grid[input].innerHTML === 'X'){
        document.getElementById("title").innerText = "Player 1 Wins!";
        game["winner"] = "player1";
        background(a, b, c)
        play = false;
    } else {
        document.getElementById("title").innerText = "Player 2 Wins!";
        game["winner"] = "player2";
        background(a, b, c)
        play = false;
    }
}

function background(a, b, c){
    grid[a].classList.add("winner");
    grid[b].classList.add("winner");
    grid[c].classList.add("winner");
}

document.getElementById("reset").addEventListener("click", reset);

function reset() {
    document.querySelectorAll('#myTable td').forEach(e => e.innerHTML = "");
    document.querySelectorAll('#myTable td').forEach(e => e.classList.remove("winner"));
    document.getElementById("title").innerText = "Tic Tac Toe"
    player1 = true;
    play = true;
    clickCount = 0;
}

console.log(game);