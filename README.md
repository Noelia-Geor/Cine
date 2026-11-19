# Cinema Seat Manager

A TypeScript console prototype for managing cinema seats efficiently and reliably.

## Overview

**Cinema Seat Manager** is a command-line application built with TypeScript that simulates a cinema ticket reservation system. It manages seat availability across 8 rows with 10 seats each, providing essential functionality for reservations and seat analysis.

## Features

- **8 rows × 10 columns** cinema layout (80 total seats)
- **Seat reservation** with validation (avoid double-booking)
- **Visual display** of seat status in console
- **Seat counters** for available and occupied seats
- **Adjacent seat finder** for group bookings
- **Input validation** with clear error messages
- **Full TypeScript support** with strict type checking

## Seat Representation

```
L = Libre (Available)
X = Ocupado (Occupied)
```

Matrix format: `Seat[][]` where:
- `0` = Available
- `1` = Occupied

## Installation

```bash
npm install
```

## Usage

### Run the application

```bash
npm start
```

This executes a comprehensive test suite demonstrating all features.

### Compile TypeScript

```bash
npm run build
```

### Type checking

```bash
npm run typecheck
```

### Development (compile and run)

```bash
npm run dev
```

## Implemented Functions

### Core Functions

1. **`initializeCinema()`** - Creates an 8×10 matrix with all seats available
2. **`displayCinema(cinema)`** - Renders the cinema layout in console with L/X symbols
3. **`reserveSeat(cinema, row, column)`** - Reserves a seat with validation
4. **`countAvailableSeats(cinema)`** - Returns the number of free seats
5. **`countOccupiedSeats(cinema)`** - Returns the number of reserved seats
6. **`findAdjacentSeats(cinema)`** - Finds and returns two adjacent available seats
7. **`getCinemaStats(cinema)`** - Returns comprehensive cinema statistics

### Return Values

- **Reservation Result**:
  ```typescript
  {
    success: boolean;
    message: string;
  }
  ```

- **Adjacent Seats Result**:
  ```typescript
  {
    found: boolean;
    seats: Array<[number, number]> | null;
    message: string;
  }
  ```

## Test Coverage

The application includes comprehensive tests covering:

1. ✅ Empty cinema (all seats available)
2. ✅ Partially occupied cinema
3. ✅ Successful seat reservation
4. ✅ Attempting to reserve an occupied seat
5. ✅ Attempting invalid positions
6. ✅ Finding adjacent seat pairs
7. ✅ Nearly full cinema (79/80 seats)
8. ✅ Completely full cinema
9. ✅ Counter verification (available + occupied = total)
10. ✅ Cinema dimensions (8×10)
11. ✅ Matrix representation integrity
12. ✅ Edge cases (corner seats)

## Example Output

```
=== CINEMA SEAT MANAGER ===

   0 1 2 3 4 5 6 7 8 9
   --------------------
0 | L L L L L L L L L L
1 | L L L L L L L L L L
2 | L L L X L L L L L L
3 | L L L L L L L L L L
4 | L L L L L L L L L L
5 | L L L L L L L L L L
6 | L L L L L L L L L L
7 | L L L L L L L L L L
   --------------------
L = Libre | X = Ocupado

✅ Seat successfully reserved at row 2, column 3.
Available seats: 79
Occupied seats: 1
✅ Found 2 adjacent seats at row 0, columns 0-1
```

## Project Structure

```
Cine/
├── src/
│   ├── cinema.ts     # Core cinema logic and functions
│   └── main.ts       # Test suite and entry point
├── dist/             # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
└── README.md
```

## Implementation Details

- **No classes** - Functional programming approach using pure functions
- **2D Array only** - Seats represented exclusively as `Seat[][]`
- **TypeScript strict mode** - Full type safety enabled
- **Clear API** - Simple, reusable functions with explicit return types
- **Validation** - All inputs validated before operations
- **Error messages** - User-friendly feedback for all scenarios

## Validation

All features have been validated:

- ✅ TypeScript compilation (strict mode)
- ✅ All 12 test scenarios pass
- ✅ Correct 8×10 dimensions
- ✅ No classes used
- ✅ 2D array representation
- ✅ Edge cases handled
- ✅ Type safety enforced

## License

MIT
