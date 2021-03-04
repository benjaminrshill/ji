const scoreboard = document.getElementById('scoreboard');
const board = document.querySelector('main');
const dimensions = [5, 5];
const line = 4;
const rows = {
    js: [],
    css: []
};
let who = true;
let won = false;
let winner = 0;

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
            pocket.addEventListener('click', () => checkDrop(dimensions[0]-1, j));
            rows.js[i].push(0);
            rows.css[i].push(pocket);
        }
    }
}

function checkDrop(i, j) {
    if (i > -1) {
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
        scoreboard.textContent = 'Player ' + winner + ' wins!';
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

makeBoard();
