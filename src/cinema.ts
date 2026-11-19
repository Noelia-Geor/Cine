/**
 * Type definitions for the Cinema Seat Manager
 */
type Seat = 0 | 1;
type SeatMatrix = Seat[][];

/**
 * Initialize the cinema with 8 rows and 10 columns
 * All seats start as available (0)
 */
export function initializeCinema(): SeatMatrix {
  const rows = 8;
  const seatsPerRow = 10;
  const cinema: SeatMatrix = [];

  for (let i = 0; i < rows; i++) {
    cinema[i] = Array(seatsPerRow).fill(0) as Seat[];
  }

  return cinema;
}

/**
 * Display the cinema state in console
 * L = libre (available), X = ocupado (occupied)
 */
export function displayCinema(cinema: SeatMatrix): void {
  console.log("\n=== CINEMA SEAT MANAGER ===\n");
  console.log("   0 1 2 3 4 5 6 7 8 9");
  console.log("   --------------------");

  cinema.forEach((row, rowIndex) => {
    const seatDisplay = row
      .map((seat) => (seat === 0 ? "L" : "X"))
      .join(" ");
    console.log(`${rowIndex} | ${seatDisplay}`);
  });

  console.log("   --------------------");
  console.log("L = Libre | X = Ocupado\n");
}

/**
 * Reserve a seat at specified row and column
 * Returns: message string (success or error message)
 */
export function reserveSeat(
  cinema: SeatMatrix,
  row: number,
  column: number
): string {
  // Validate row and column exist
  if (row < 0 || row >= cinema.length) {
    return `❌ Error: Row ${row} does not exist. Valid rows: 0-${cinema.length - 1}`;
  }

  if (column < 0 || column >= cinema[row].length) {
    return `❌ Error: Column ${column} does not exist. Valid columns: 0-${cinema[row].length - 1}`;
  }

  // Check if seat is already occupied
  if (cinema[row][column] === 1) {
    return `❌ Error: Seat at row ${row}, column ${column} is already occupied.`;
  }

  // Reserve the seat
  cinema[row][column] = 1;
  return `✅ Seat successfully reserved at row ${row}, column ${column}.`;
}

/**
 * Count total available seats
 */
export function countAvailableSeats(cinema: SeatMatrix): number {
  let count = 0;
  cinema.forEach((row) => {
    row.forEach((seat) => {
      if (seat === 0) {
        count++;
      }
    });
  });
  return count;
}

/**
 * Count total occupied seats
 */
export function countOccupiedSeats(cinema: SeatMatrix): number {
  let count = 0;
  cinema.forEach((row) => {
    row.forEach((seat) => {
      if (seat === 1) {
        count++;
      }
    });
  });
  return count;
}

/**
 * Find two adjacent available seats in the same row
 * Returns: tuple [found: boolean, positions: [row, col1, col2] | null]
 */
export function findAdjacentSeats(cinema: SeatMatrix): [boolean, [number, number, number] | null] {
  for (let row = 0; row < cinema.length; row++) {
    for (let col = 0; col < cinema[row].length - 1; col++) {
      if (cinema[row][col] === 0 && cinema[row][col + 1] === 0) {
        return [true, [row, col, col + 1]];
      }
    }
  }

  return [false, null];
}

/**
 * Get cinema statistics as tuple
 * Returns: [totalSeats, availableSeats, occupiedSeats, occupancyPercentage]
 */
export function getCinemaStats(cinema: SeatMatrix): [number, number, number, number] {
  const totalSeats = cinema.length * cinema[0].length;
  const availableSeats = countAvailableSeats(cinema);
  const occupiedSeats = countOccupiedSeats(cinema);
  const occupancyPercentage = Math.round(((occupiedSeats / totalSeats) * 100) * 100) / 100;

  return [totalSeats, availableSeats, occupiedSeats, occupancyPercentage];
}
