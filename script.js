const COLUMNS = 4;
const MAX_CARDS = 8; // Límite de cartas por columna[cite: 1]
let score = 0;
let currentCardValue = 0;
let grid = [[], [], [], []]; // Representa las 4 columnas

const possibleCards = [2, 4, 8, 16, 32]; // Valores generados aleatoriamente[cite: 1]

// Referencias al DOM
const scoreEl = document.getElementById('score');
const currentCardEl = document.getElementById('current-card');
const columnsEl = document.querySelectorAll('.column');
const restartBtn = document.getElementById('restart-btn');

function initGame() {
    score = 0;
    grid = [[], [], [], []];
    updateScore(0);
    generateNewCard();
    renderBoard();
}

// Genera una carta aleatoria para el mazo[cite: 1]
function generateNewCard() {
    const randomIndex = Math.floor(Math.random() * possibleCards.length);
    currentCardValue = possibleCards[randomIndex];
    currentCardEl.textContent = currentCardValue;
    currentCardEl.setAttribute('data-value', currentCardValue);
}

// Actualiza el DOM para reflejar la cuadrícula
function renderBoard() {
    columnsEl.forEach((colEl, index) => {
        colEl.innerHTML = ''; // Limpiar
        grid[index].forEach(value => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.textContent = value;
            card.setAttribute('data-value', value);
            colEl.appendChild(card);
        });
    });
}

// Interacción al hacer clic para soltar la carta[cite: 1]
function dropCard(colIndex) {
    if (grid[colIndex].length >= MAX_CARDS) {
        alert("¡Columna llena! Fin del juego."); // Condición de derrota básica[cite: 1]
        return;
    }

    grid[colIndex].push(currentCardValue);

    // Iniciar el sistema de fusión[cite: 1]
    mergeCards(colIndex);

    renderBoard();
    generateNewCard();
}

// Lógica recursiva de fusión[cite: 1]
function mergeCards(colIndex) {
    let column = grid[colIndex];
    if (column.length < 2) return; // Nada que fusionar

    let topCard = column[column.length - 1];
    let cardBelow = column[column.length - 2];

    // Combinar si tienen el mismo valor[cite: 1]
    if (topCard === cardBelow) {
        column.pop(); // Quitar la carta superior
        column[column.length - 1] *= 2; // Duplicar el valor
        updateScore(column[column.length - 1]);

        // Efecto especial al alcanzar 2048[cite: 1]
        if (column[column.length - 1] === 2048) {
            alert("¡2048 Alcanzado! Limpiando columna.");
            grid[colIndex] = [];
            return;
        }

        // Fusión múltiple (recursividad)[cite: 1]
        mergeCards(colIndex);
    }
}

function updateScore(points) {
    score += points;
    scoreEl.textContent = score;
}

// Event Listeners para las 4 columnas
columnsEl.forEach(col => {
    col.addEventListener('click', (e) => {
        const colIndex = parseInt(col.getAttribute('data-col'));
        dropCard(colIndex);
    });
});

restartBtn.addEventListener('click', initGame);

// Iniciar el juego
initGame();