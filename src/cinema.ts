/**
 * Type definitions for the Cinema Seat Manager
 */
type Seat = 0 | 1;
type SeatMatrix = Seat[][];

interface ReservationResult {
  success: boolean;
  message: string;
}

interface AdjacentSeatsResult {
  found: boolean;
  seats: Array<[number, number]> | null;
  message: string;
}

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
 */
export function reserveSeat(
  cinema: SeatMatrix,
  row: number,
  column: number
): ReservationResult {
  // Validate row and column exist
  if (row < 0 || row >= cinema.length) {
    return {
      success: false,
      message: `❌ Error: Row ${row} does not exist. Valid rows: 0-${cinema.length - 1}`,
    };
  }

  if (column < 0 || column >= cinema[row].length) {
    return {
      success: false,
      message: `❌ Error: Column ${column} does not exist. Valid columns: 0-${cinema[row].length - 1}`,
    };
  }

  // Check if seat is already occupied
  if (cinema[row][column] === 1) {
    return {
      success: false,
      message: `❌ Error: Seat at row ${row}, column ${column} is already occupied.`,
    };
  }

  // Reserve the seat
  cinema[row][column] = 1;
  return {
    success: true,
    message: `✅ Seat successfully reserved at row ${row}, column ${column}.`,
  };
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
 */
export function findAdjacentSeats(cinema: SeatMatrix): AdjacentSeatsResult {
  for (let row = 0; row < cinema.length; row++) {
    for (let col = 0; col < cinema[row].length - 1; col++) {
      if (cinema[row][col] === 0 && cinema[row][col + 1] === 0) {
        return {
          found: true,
          seats: [
            [row, col],
            [row, col + 1],
          ],
          message: `✅ Found 2 adjacent seats at row ${row}, columns ${col}-${col + 1}`,
        };
      }
    }
  }

  return {
    found: false,
    seats: null,
    message: "❌ No adjacent seats found.",
  };
}

/**
 * Get cinema statistics
 */
export function getCinemaStats(cinema: SeatMatrix): {
  totalSeats: number;
  availableSeats: number;
  occupiedSeats: number;
  occupancyPercentage: number;
} {
  const totalSeats = cinema.length * cinema[0].length;
  const availableSeats = countAvailableSeats(cinema);
  const occupiedSeats = countOccupiedSeats(cinema);
  const occupancyPercentage = (occupiedSeats / totalSeats) * 100;

  return {
    totalSeats,
    availableSeats,
    occupiedSeats,
    occupancyPercentage: Math.round(occupancyPercentage * 100) / 100,
  };
}
