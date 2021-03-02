const board = document.querySelector('main');
const dimensions = [5, 5];

let rows = [];
let who = true;

function makeBoard() {
    for (let i = 0; i < dimensions[1]; i++) {
        const row = document.createElement('div');
        const name = 'row' + i;
        rows.push([]);
        row.classList.add('row');
        row.classList.add(name);
        board.appendChild(row);
        for (let j = 0; j < dimensions[0]; j++) {
            rows[i].push(0);
            const pocket = document.createElement('div');
            pocket.classList.add('pocket');
            pocket.classList.add('pocket' + j);
            row.appendChild(pocket);
            pocket.addEventListener('click', () => turn(pocket, i, j));
        }
    }
}

function turn(pocket, i, j) {
    if (rows[i][j] === 0) {
        rows[i][j] = who ? 1 : 2;
        const token = document.createElement('div');
        token.classList.add('token');
        token.classList.add(who ? 'player1' : 'player2');
        pocket.appendChild(token);
        who = !who;
        console.log('break!');
        rows.forEach(row => console.log(row));
    }
}

function computerPlays() {
    let r = rows.length - 1;
    let p = Math.floor(rows[r].length / 2);
    if (rows[r][p] === 0) {
        computerClicks(r, p);
    } else if (rows[r][p-1] === 0) {
        computerClicks(r, p-1);
    } else if (rows[r][p+1] === 0) {
        computerClicks(r, p+1);
    } else if (rows[r][p-2] === 0) {
        computerClicks(r, p-2);
    } else if (rows[r][p+2] === 0) {
        computerClicks(r, p+2);
    }
}

function computerClicks(r, p) {
    const rtc = board.querySelector('.row' + r);
    rtc.querySelector('.pocket' + p).click();
}

board.addEventListener('click', function() {
    if (!who) computerPlays();
});

makeBoard();
