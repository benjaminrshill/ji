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
    rows.js[i][j] = who ? 1 : 2;
    rows.css[i][j].appendChild(token);
    checkWin();
    if (won) {
        document.body.style.backgroundColor = '#564534';
    } else who = !who;
    // console.log('___________');
    // rows.js.forEach(row => console.log(row));
}

function checkWin() {
    checkHorizontal();
    if (!won) checkVertical();
    if (won && who) {
        winner = 1;
    } else if (won) winner = 2;
}

function checkHorizontal() {
    rows.js.forEach(row => {
        let tally = [];
        row.forEach((pocket, i) => {
            if (row[i] > 0) {
                if (row[i+1] !== undefined && row[i] === row[i+1]) tally.push(row[i]);
            } else tally = [];
            if (tally.length > line - 2) won = true;
        });
    });
}

function checkVertical() {
    for (let i = 0; i < dimensions[0]; i++) {
        let tally = [];
        for (let j = 0; j < dimensions[1]; j++) {
            if (rows.js[j+1] !== undefined && rows.js[j][i] > 0) {
                if (rows.js[j][i] === rows.js[j+1][i]) tally.push(rows.js[j][i]);
            } else tally = [];
            if (tally.length > line - 2) won = true;
        }
    }
}

makeBoard();
