const board = document.querySelector('main');
const dimensions = [5, 5];
const line = 4;
let rows = {
    js: [],
    css: []
};
let scores = {
    player1: 0,
    player2: 0
}
let who = true;
let won = false;
let winner = 0;

function getScores() {
    if (localStorage.getItem('jiScore')) scores = JSON.parse(localStorage.getItem('jiScore'));
    showScores();
}

function setScores() {
    localStorage.setItem('jiScore', JSON.stringify(scores));
}

function showScores() {
    document.getElementById('p1score').textContent = scores.player1;
    document.getElementById('p2score').textContent = scores.player2;
}

function resetScores() {
    scores.player1 = 0;
    scores.player2 = 0;
}

function newGame() {
    who = true;
    won = false;
    winner = 0;
    rows = {js: [], css: []};
    board.querySelectorAll('.row').forEach(row => board.removeChild(row));
    makeBoard();
}

function makeBoard() {
    for (let i = 0; i < dimensions[1]; i++) {
        const row = document.createElement('div');
        const name = 'row' + i;
        row.classList.add('row');
        row.classList.add(name);
        board.appendChild(row);
        rows.js.push([]);
        rows.css.push([]);
        for (let j = 0; j < dimensions[0]; j++) {
            const pocket = document.createElement('div');
            pocket.classList.add('pocket');
            pocket.classList.add('pocket' + j);
            row.appendChild(pocket);
            pocket.addEventListener('click', () => checkDrop(dimensions[0]-1, j), false);
            rows.js[i].push(0);
            rows.css[i].push(pocket);
        }
    }
}

function checkDrop(i, j) {
    if (!won && i > -1) {
        if (rows.js[i][j] === 0) {
            drop(i, j);
        } else {
            i--;
            checkDrop(i, j);
        }
    }
}

function drop(i, j) {
    const token = document.createElement('div');
    token.classList.add('token');
    token.classList.add(who ? 'player1' : 'player2');
    token.classList.add('drop' + i);
    document.querySelectorAll('.indicator').forEach(item => item.classList.toggle('hidden'));
    rows.js[i][j] = who ? 1 : 2;
    rows.css[i][j].appendChild(token);
    checkWin();
}

function checkWin() {
    checkHorizontal();
    if (!won) checkVertical();
    if (!won) checkDiagonalForward();
    if (!won) checkDiagonalBackward();
    if (won) {
        winner = who ? 1 : 2;
        who ? scores.player1++ : scores.player2++;
        showScores();
        setScores();
    } else who = !who;
}

function checkHorizontal() {
    for (let j = 0; j < dimensions[1]; j++) {
        let tally = [];
        for (let i = 0; i < dimensions[0]; i++) {
            if (rows.js[j][i+1] !== undefined && rows.js[j][i] > 0) {
                if (rows.js[j][i] === rows.js[j][i+1]) {
                    tally.push(rows.js[j][i]);
                } else tally = [];
                if (tally.length > line - 2) {
                    console.log(tally, 'horizontal');
                    return won = true;
                }
            }
        }
    }
}

function checkVertical() {
    for (let i = 0; i < dimensions[0]; i++) {
        let tally = [];
        for (let j = 0; j < dimensions[1]; j++) {
            if (rows.js[j+1] !== undefined && rows.js[j][i] > 0) {
                if (rows.js[j][i] === rows.js[j+1][i]) {
                    tally.push(rows.js[j][i]);
                } else tally = [];
                if (tally.length > line - 2) {
                    console.log(tally, 'vertical');
                    return won = true;
                }
            }
        }
    }
}

function checkDiagonalForward() {
    for (let i = 0; i < dimensions[0] - line + 1; i++) {
        for (let j = 0; j < dimensions[0] - line + 1; j++) {
            let tally = [];
            checkNext(i, j);
            function checkNext(r, d) {
                if (rows.js[r+1] !== undefined && rows.js[r][d] > 0) {
                    if (rows.js[r][d] === rows.js[r+1][d+1]) {
                        tally.push(rows.js[r][d]);
                    } else tally = [];
                    if (tally.length > line - 2) {
                        console.log(tally, 'diagonal forward');
                        return won = true;
                    }
                    checkNext(r+1, d+1);
                }
            }
        }
    }
}

function checkDiagonalBackward() {
    for (let i = 4; i > 0; i--) {
        for (let j = 4; j > 0; j--) {
            let tally = [];
            checkNext(i, j);
            function checkNext(r, d) {
                if (rows.js[r+1] !== undefined && rows.js[r][d] > 0) {
                    if (rows.js[r][d] === rows.js[r+1][d-1]) {
                        tally.push(rows.js[r][d]);
                    } else tally = [];
                    if (tally.length > line - 2) {
                        console.log(tally, 'diagonal back');
                        return won = true;
                    }
                    checkNext(r+1, d-1);
                }
            }
        }
    }
}

document.getElementById('reset-scores').addEventListener('click', resetScores, false);
document.getElementById('new-game').addEventListener('click', newGame, false);

makeBoard();
getScores();
