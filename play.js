const board = document.querySelector('main');
const dimensions = [7, 5];
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
    for (let r = 0; r < dimensions[1]; r++) {
        const row = document.createElement('div');
        const name = 'row' + r;
        row.classList.add('row');
        row.classList.add(name);
        board.appendChild(row);
        rows.js.push([]);
        rows.css.push([]);
        for (let c = 0; c < dimensions[0]; c++) {
            const pocket = document.createElement('div');
            pocket.classList.add('pocket');
            pocket.classList.add('pocket' + c);
            row.appendChild(pocket);
            pocket.addEventListener('click', () => checkDrop(dimensions[1]-1, c), false);
            rows.js[r].push(0);
            rows.css[r].push(pocket);
        }
    }
}

function checkDrop(r, c) {
    if (!won && r > -1) {
        if (rows.js[r][c] === 0) {
            drop(r, c);
        } else {
            r--;
            checkDrop(r, c);
        }
    }
}

function drop(r, c) {
    const token = document.createElement('div');
    token.classList.add('token');
    token.classList.add(who ? 'player1' : 'player2');
    token.classList.add('drop' + r);
    document.querySelectorAll('.indicator').forEach(item => item.classList.toggle('hidden'));
    rows.js[r][c] = who ? 1 : 2;
    rows.css[r][c].appendChild(token);
    checkWin();
}

function checkWin() {
    checkHorizontal();
    if (!won) checkVertical();
    if (!won) checkDiagonalForward();
    if (!won) checkDiagonalBackward();
    if (won) {
        winner = who ? 1 : 2;
        document.getElementById('who-won').textContent = 'Player ' + winner + ' wins!';
        who ? scores.player1++ : scores.player2++;
        showScores();
        setScores();
    } else who = !who;
}

function checkHorizontal() {
    for (let r = 0; r < dimensions[1]; r++) {
        let tally = [];
        for (let c = 0; c < dimensions[0]; c++) {
            if (rows.js[r][c+1] !== undefined && rows.js[r][c] > 0) {
                if (rows.js[r][c] === rows.js[r][c+1]) {
                    tally.push(rows.js[r][c]);
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
    for (let c = 0; c < dimensions[0]; c++) {
        let tally = [];
        for (let r = 0; r < dimensions[1]; r++) {
            if (rows.js[r+1] !== undefined && rows.js[r][c] > 0) {
                if (rows.js[r][c] === rows.js[r+1][c]) {
                    tally.push(rows.js[r][c]);
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
    for (let c = 0; c < dimensions[0] - line + 1; c++) {
        for (let r = 0; r < dimensions[1] - line + 1; r++) {
            let tally = [];
            checkNext(r, c);
            function checkNext(s, d) {
                if (rows.js[s+1] !== undefined && rows.js[s][d] > 0) {
                    if (rows.js[s][d] === rows.js[s+1][d+1]) {
                        tally.push(rows.js[s][d]);
                    } else tally = [];
                    if (tally.length > line - 2) {
                        console.log(tally, 'diagonal forward');
                        return won = true;
                    }
                    checkNext(s+1, d+1);
                }
            }
        }
    }
}

function checkDiagonalBackward() {
    for (let c = dimensions[0]; c > -1; c--) {
        for (let r = dimensions[1]; r > -1; r--) {
            let tally = [];
            checkNext(r, c);
            function checkNext(s, d) {
                if (rows.js[s+1] !== undefined && rows.js[s][d] > 0) {
                    if (rows.js[s][d] === rows.js[s+1][d-1]) {
                        tally.push(rows.js[s][d]);
                    } else tally = [];
                    if (tally.length > line - 2) {
                        console.log(tally, 'diagonal back');
                        return won = true;
                    }
                    checkNext(s+1, d-1);
                }
            }
        }
    }
}

// function computerPlays() {
//     let r = rows.js.length - 1;
//     let p = Math.floor(rows.js[r].length / 2);
//     if (rows.js[r][p] === 0) {
//         computerClicks(r, p);
//     } else if (rows.js[r][p-1] === 0) {
//         computerClicks(r, p-1);
//     } else if (rows.js[r][p+1] === 0) {
//         computerClicks(r, p+1);
//     } else if (rows.js[r][p-2] === 0) {
//         computerClicks(r, p-2);
//     } else if (rows.js[r][p+2] === 0) {
//         computerClicks(r, p+2);
//     }
// }

// function computerClicks(r, p) {
//     const rtc = board.querySelector('.row' + r);
//     rtc.querySelector('.pocket' + p).click();
// }

// board.addEventListener('click', function() {
//     if (!who) computerPlays();
// });

document.getElementById('reset-scores').addEventListener('click', resetScores, false);
document.getElementById('new-game').addEventListener('click', newGame, false);

makeBoard();
getScores();
