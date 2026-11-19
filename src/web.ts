import {
    initializeCinema,
    reserveSeat,
    countAvailableSeats,
    countOccupiedSeats,
    findAdjacentSeats,
    displayCinema,
    type Seat
} from './cinema';

// Global cinema state
let cinema: Seat[][];
let selectedSeats: Set<string> = new Set(); // Format: "row,col"
let recommendedSeats: [number, number, number, number] | null = null;

// Initial occupancy pattern (creates ~25% occupancy)
const INITIAL_OCCUPIED = [
    [0, 2], [0, 5], [0, 8],
    [1, 1], [1, 4], [1, 7], [1, 9],
    [2, 3], [2, 6],
    [3, 0], [3, 5], [3, 9],
    [4, 2], [4, 7],
    [5, 1], [5, 4], [5, 8],
    [6, 3], [6, 6],
    [7, 5]
];

// Storage keys
const STORAGE_KEY = 'cinemaState';
const INITIAL_STATE_KEY = 'cinemaInitialState';

// Initialize application
function initApp(): void {
    // Try to load from localStorage
    const savedState = localStorage.getItem(STORAGE_KEY);
    
    if (savedState) {
        cinema = JSON.parse(savedState);
    } else {
        // Initialize with empty cinema
        cinema = initializeCinema();
        
        // Apply initial occupancy
        for (const [row, col] of INITIAL_OCCUPIED) {
            cinema[row][col] = 1;
        }
        
        // Save to localStorage
        saveCinemaState();
    }

    // Render the UI
    renderSeats();
    updateStats();
    setupEventListeners();
}

// Save cinema state to localStorage
function saveCinemaState(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cinema));
}

// Convert key to [row, col]
function keyToCoords(key: string): [number, number] {
    const [r, c] = key.split(',').map(Number);
    return [r, c];
}

// Render all seats
function renderSeats(): void {
    const seatsGrid = document.getElementById('seatsGrid') as HTMLDivElement;
    seatsGrid.innerHTML = '';

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 10; col++) {
            const seatBtn = document.createElement('button');
            const isOccupied = cinema[row][col] === 1;
            const key = `${row},${col}`;
            const isSelected = selectedSeats.has(key);
            const isRecommended = recommendedSeats && 
                (recommendedSeats[2] === row && (recommendedSeats[3] === col || recommendedSeats[3] + 1 === col));

            seatBtn.className = 'seat';
            seatBtn.textContent = `${col + 1}`;
            
            if (isOccupied) {
                seatBtn.classList.add('occupied');
                seatBtn.disabled = true;
                seatBtn.setAttribute('aria-label', 
                    `Fila ${String.fromCharCode(65 + row)}, asiento ${col + 1}, ocupado`);
            } else {
                seatBtn.classList.add('available');
                seatBtn.setAttribute('aria-label', 
                    `Fila ${String.fromCharCode(65 + row)}, asiento ${col + 1}, disponible`);
                
                seatBtn.addEventListener('click', () => toggleSeat(row, col));
                seatBtn.addEventListener('mouseover', () => {
                    if (!isSelected && !isOccupied) {
                        seatBtn.style.opacity = '0.9';
                    }
                });
                seatBtn.addEventListener('mouseout', () => {
                    seatBtn.style.opacity = '1';
                });
            }

            if (isSelected) {
                seatBtn.classList.add('selected');
            }

            if (isRecommended) {
                seatBtn.classList.add('recommended');
            }

            seatsGrid.appendChild(seatBtn);
        }
    }
}

// Toggle seat selection
function toggleSeat(row: number, col: number): void {
    // If seat is occupied, show message
    if (cinema[row][col] === 1) {
        showResultMessage('Este asiento ya está ocupado.', 'error');
        return;
    }

    const key = `${row},${col}`;
    
    // Clear previous recommendation
    recommendedSeats = null;

    // Toggle selection
    if (selectedSeats.has(key)) {
        selectedSeats.delete(key);
    } else {
        selectedSeats.add(key);
    }

    // Update UI
    updateSelection();
    renderSeats();
}

// Update selection display
function updateSelection(): void {
    const selectionBox = document.getElementById('selectionBox') as HTMLDivElement;
    const selectionDetails = document.getElementById('selectionDetails') as HTMLDivElement;
    const reserveBtn = document.getElementById('reserveBtn') as HTMLButtonElement;

    if (selectedSeats.size > 0) {
        const seatsList = Array.from(selectedSeats)
            .sort()
            .map(key => {
                const [row, col] = keyToCoords(key);
                return `Fila ${String.fromCharCode(65 + row)} - Asiento ${col + 1}`;
            })
            .join(' | ');

        selectionDetails.innerHTML = `<div style="text-align: center; padding: 12px; background: rgba(212, 175, 55, 0.05); border-left: 3px solid var(--color-primary); border-radius: 8px;">
            <div style="font-size: 0.8rem; color: var(--color-text-secondary); text-transform: uppercase; letter-spacing: 0.3px; margin-bottom: 6px;">Asientos seleccionados (${selectedSeats.size})</div>
            <div style="font-size: 0.85rem; color: var(--color-primary); font-weight: 600;">${seatsList}</div>
        </div>`;

        selectionBox.style.display = 'none';
        selectionDetails.style.display = 'block';
        reserveBtn.disabled = false;
    } else {
        selectionBox.style.display = 'flex';
        selectionDetails.style.display = 'none';
        reserveBtn.disabled = true;
    }
}

// Reserve all selected seats
function reserveSelected(): void {
    if (selectedSeats.size === 0) {
        showResultMessage('Selecciona al menos un asiento.', 'error');
        return;
    }

    const seatsArray = Array.from(selectedSeats).map(key => keyToCoords(key));
    const reservedSeats: string[] = [];
    const failedSeats: string[] = [];

    for (const [row, col] of seatsArray) {
        const result = reserveSeat(cinema, row, col);
        const rowLetter = String.fromCharCode(65 + row);
        
        if (result === 'success') {
            reservedSeats.push(`Fila ${rowLetter} - Asiento ${col + 1}`);
        } else {
            failedSeats.push(`Fila ${rowLetter} - Asiento ${col + 1}`);
        }
    }

    // Clear selection
    selectedSeats.clear();
    recommendedSeats = null;

    // Update state and UI
    saveCinemaState();
    updateSelection();
    renderSeats();
    updateStats();

    // Show results
    if (reservedSeats.length > 0 && failedSeats.length === 0) {
        showResultMessage(
            `✅ Reserva confirmada · ${reservedSeats.length} asiento(s)`,
            'success'
        );
    } else if (reservedSeats.length > 0 && failedSeats.length > 0) {
        showResultMessage(
            `⚠️ ${reservedSeats.length} reservado(s) · ${failedSeats.length} falló`,
            'info'
        );
    } else {
        showResultMessage(
            `❌ No se pudieron reservar los asientos.`,
            'error'
        );
    }
}

// Find adjacent seats
function findAdjacent(): void {
    const [found, positions] = findAdjacentSeats(cinema);

    if (found && positions) {
        const [row, col1, col2] = positions;
        const rowLetter = String.fromCharCode(65 + row);
        
        recommendedSeats = [row, row, row, col1]; // Store for rendering
        
        // Auto-select the recommended seats
        selectedSeats.clear();
        selectedSeats.add(`${row},${col1}`);
        selectedSeats.add(`${row},${col2}`);

        showResultMessage(
            `Encontramos 2 asientos juntos · Fila ${rowLetter} · Asientos ${col1 + 1} y ${col2 + 1}`,
            'info'
        );

        updateSelection();
        renderSeats();
    } else {
        showResultMessage('No quedan dos asientos contiguos disponibles.', 'error');
        recommendedSeats = null;
        renderSeats();
    }
}

// Show result message
function showResultMessage(message: string, type: 'success' | 'error' | 'info'): void {
    const msgElement = document.getElementById('resultMessage') as HTMLDivElement;
    msgElement.textContent = message;
    msgElement.className = `result-message show ${type}`;
    
    // Auto-hide after 4 seconds
    setTimeout(() => {
        msgElement.classList.remove('show');
    }, 4000);
}

// Update statistics
function updateStats(): void {
    const available = countAvailableSeats(cinema);
    const occupied = countOccupiedSeats(cinema);

    const availableCount = document.getElementById('availableCount') as HTMLSpanElement;
    const occupiedCount = document.getElementById('occupiedCount') as HTMLSpanElement;

    availableCount.textContent = String(available);
    occupiedCount.textContent = String(occupied);
}

// Reset cinema
function resetCinema(): void {
    cinema = initializeCinema();
    
    // Apply initial occupancy again
    for (const [row, col] of INITIAL_OCCUPIED) {
        cinema[row][col] = 1;
    }

    saveCinemaState();
    selectedSeats.clear();
    recommendedSeats = null;
    
    updateSelection();
    renderSeats();
    updateStats();
    
    showResultMessage('Sala reiniciada.', 'success');
    closeConfirmModal();
}

// Setup event listeners
function setupEventListeners(): void {
    const reserveBtn = document.getElementById('reserveBtn') as HTMLButtonElement;
    const findAdjacentBtn = document.getElementById('findAdjacent') as HTMLButtonElement;
    const resetBtn = document.getElementById('resetBtn') as HTMLButtonElement;
    const confirmModal = document.getElementById('confirmModal') as HTMLDivElement;
    const confirmReset = document.getElementById('confirmReset') as HTMLButtonElement;
    const confirmCancel = document.getElementById('confirmCancel') as HTMLButtonElement;

    reserveBtn.addEventListener('click', reserveSelected);
    findAdjacentBtn.addEventListener('click', findAdjacent);
    resetBtn.addEventListener('click', openConfirmModal);
    confirmReset.addEventListener('click', resetCinema);
    confirmCancel.addEventListener('click', closeConfirmModal);

    // Close modal on background click
    confirmModal.addEventListener('click', (e) => {
        if (e.target === confirmModal) {
            closeConfirmModal();
        }
    });
}

// Open confirm modal
function openConfirmModal(): void {
    const confirmModal = document.getElementById('confirmModal') as HTMLDivElement;
    confirmModal.classList.add('show');
}

// Close confirm modal
function closeConfirmModal(): void {
    const confirmModal = document.getElementById('confirmModal') as HTMLDivElement;
    confirmModal.classList.remove('show');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initApp);
