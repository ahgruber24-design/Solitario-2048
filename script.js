// ==========================================
// VARIABLES GLOBALES Y CONFIGURACIÓN
// ==========================================
const COLUMNS = 4;
const MAX_CARDS = 8; // Límite de cartas por columna para la condición de derrota[cite: 1]
let score = 0;
let currentCardValue = 0;
let grid = [[], [], [], []]; // Representa las 4 columnas
let gameOver = false; // Controla si el juego ha terminado

const possibleCards = [2, 4, 8, 16, 32]; // Valores generados aleatoriamente[cite: 1]

// ==========================================
// REFERENCIAS AL DOM
// ==========================================
const scoreEl = document.getElementById('score');
const currentCardEl = document.getElementById('current-card');
const columnsEl = document.querySelectorAll('.column');
const restartBtn = document.getElementById('restart-btn');

// ==========================================
// FUNCIONES PRINCIPALES
// ==========================================

// Inicializa o reinicia el estado del juego
function initGame() {
    score = 0;
    grid = [[], [], [], []];
    gameOver = false; // Reiniciamos el estado al empezar
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

// Actualiza el DOM para reflejar la cuadrícula internamente
function renderBoard() {
    columnsEl.forEach((colEl, index) => {
        colEl.innerHTML = ''; // Limpiar la columna antes de re-dibujar

        grid[index].forEach(value => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.textContent = value;
            card.setAttribute('data-value', value);
            colEl.appendChild(card);
        });
    });
}

// Lógica de interacción al hacer clic para soltar la carta[cite: 1]
function dropCard(colIndex) {
    // Si el juego ya terminó, ignoramos los clics
    if (gameOver) return;

    // Verificamos si la columna excede el límite máximo de cartas
    let topCard = grid[colIndex].length > 0 ? grid[colIndex][grid[colIndex].length - 1] : null;
    
    // Condición de derrota: si la columna está llena Y la carta no puede fusionarse
    if (grid[colIndex].length >= MAX_CARDS && currentCardValue !== topCard) {
        gameOver = true;
        alert("¡Columna llena y no hay fusiones posibles! Fin del juego. Presiona Reiniciar para volver a jugar.");
        return;
    }

    // Añadimos la carta a la lógica interna de la columna
    grid[colIndex].push(currentCardValue);

    // Iniciar el sistema de fusión de la columna[cite: 1]
    mergeCards(colIndex);

    renderBoard();

    // Solo generamos una nueva carta si no hemos perdido tras este movimiento
    if (!gameOver) {
        generateNewCard();
    }
}

// Lógica recursiva de fusión múltiple[cite: 1]
function mergeCards(colIndex) {
    let column = grid[colIndex];
    if (column.length < 2) return; // Se necesitan al menos 2 cartas para fusionar

    let topCard = column[column.length - 1];
    let cardBelow = column[column.length - 2];

    // Combinar si la carta superior y la de abajo tienen el mismo valor[cite: 1]
    if (topCard === cardBelow) {
        column.pop(); // Quitar la carta superior de la memoria
        column[column.length - 1] *= 2; // Duplicar el valor de la carta base ($2+2=4$)[cite: 1]

        // Sumar al marcador global
        updateScore(column[column.length - 1]);

        // Efecto especial: Limpiar columna al alcanzar el 2048[cite: 1]
        if (column[column.length - 1] === 2048) {
            alert("¡2048 Alcanzado! Limpiando columna.");
            grid[colIndex] = []; // Vaciamos el arreglo de esta columna
            return; // Termina la función para esta columna
        }

        // Llamada recursiva: verifica si el nuevo número se puede seguir fusionando[cite: 1]
        mergeCards(colIndex);
    }
}

// Actualiza la puntuación visual y lógica
function updateScore(points) {
    score += points;
    scoreEl.textContent = score;
}

// ==========================================
// EVENT LISTENERS
// ==========================================

// Configurar clics para las 4 columnas disponibles[cite: 1]
columnsEl.forEach(col => {
    col.addEventListener('click', (e) => {
        const colIndex = parseInt(col.getAttribute('data-col'));
        dropCard(colIndex);
    });
});

// Configurar el botón de reinicio
restartBtn.addEventListener('click', initGame);

// ==========================================
// INICIO DEL JUEGO
// ==========================================
initGame();
