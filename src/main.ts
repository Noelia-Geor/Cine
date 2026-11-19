import {
  initializeCinema,
  displayCinema,
  reserveSeat,
  countAvailableSeats,
  countOccupiedSeats,
  findAdjacentSeats,
  getCinemaStats,
} from "./cinema.js";

/**
 * Run all test scenarios
 */
function runTests(): void {
  console.log("╔════════════════════════════════════════╗");
  console.log("║   CINEMA SEAT MANAGER - TEST SUITE     ║");
  console.log("╚════════════════════════════════════════╝\n");

  // TEST 1: Empty cinema
  console.log("📌 TEST 1: Empty Cinema");
  console.log("─".repeat(50));
  const cinema1 = initializeCinema();
  displayCinema(cinema1);
  console.log(`Available seats: ${countAvailableSeats(cinema1)}`);
  console.log(`Occupied seats: ${countOccupiedSeats(cinema1)}`);
  const result1 = findAdjacentSeats(cinema1);
  console.log(result1.message);
  console.log();

  // TEST 2: Partially occupied cinema
  console.log("📌 TEST 2: Partially Occupied Cinema");
  console.log("─".repeat(50));
  const cinema2 = initializeCinema();
  reserveSeat(cinema2, 0, 0);
  reserveSeat(cinema2, 0, 1);
  reserveSeat(cinema2, 1, 5);
  reserveSeat(cinema2, 3, 8);
  reserveSeat(cinema2, 7, 0);
  displayCinema(cinema2);
  console.log(`Available seats: ${countAvailableSeats(cinema2)}`);
  console.log(`Occupied seats: ${countOccupiedSeats(cinema2)}`);
  const result2 = findAdjacentSeats(cinema2);
  console.log(result2.message);
  console.log();

  // TEST 3: Reserve a free seat
  console.log("📌 TEST 3: Reserve a Free Seat");
  console.log("─".repeat(50));
  const cinema3 = initializeCinema();
  const res3a = reserveSeat(cinema3, 2, 4);
  console.log(res3a.message);
  displayCinema(cinema3);
  console.log();

  // TEST 4: Try to reserve an already occupied seat
  console.log("📌 TEST 4: Try to Reserve an Occupied Seat");
  console.log("─".repeat(50));
  const cinema4 = initializeCinema();
  const res4a = reserveSeat(cinema4, 2, 4);
  console.log(res4a.message);
  const res4b = reserveSeat(cinema4, 2, 4);
  console.log(res4b.message);
  displayCinema(cinema4);
  console.log();

  // TEST 5: Try to reserve an invalid position
  console.log("📌 TEST 5: Try to Reserve Invalid Position");
  console.log("─".repeat(50));
  const cinema5 = initializeCinema();
  const res5a = reserveSeat(cinema5, 10, 5);
  console.log(res5a.message);
  const res5b = reserveSeat(cinema5, 2, 15);
  console.log(res5b.message);
  const res5c = reserveSeat(cinema5, -1, 2);
  console.log(res5c.message);
  console.log();

  // TEST 6: Search for two adjacent seats
  console.log("📌 TEST 6: Search for Two Adjacent Seats");
  console.log("─".repeat(50));
  const cinema6 = initializeCinema();
  // Create some gaps
  reserveSeat(cinema6, 0, 0);
  reserveSeat(cinema6, 0, 2);
  reserveSeat(cinema6, 0, 3);
  displayCinema(cinema6);
  const result6 = findAdjacentSeats(cinema6);
  console.log(result6.message);
  if (result6.found && result6.seats) {
    console.log(
      `Seat positions: [${result6.seats[0][0]}, ${result6.seats[0][1]}] and [${result6.seats[1][0]}, ${result6.seats[1][1]}]`
    );
  }
  console.log();

  // TEST 7: Almost full cinema
  console.log("📌 TEST 7: Almost Full Cinema");
  console.log("─".repeat(50));
  const cinema7 = initializeCinema();
  let reservationCount = 0;
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 10; col++) {
      if (!(row === 3 && col === 5)) {
        // Leave one free seat
        reserveSeat(cinema7, row, col);
        reservationCount++;
      }
    }
  }
  console.log(`Reserved ${reservationCount} seats`);
  displayCinema(cinema7);
  console.log(`Available seats: ${countAvailableSeats(cinema7)}`);
  console.log(`Occupied seats: ${countOccupiedSeats(cinema7)}`);
  const result7 = findAdjacentSeats(cinema7);
  console.log(result7.message);
  console.log();

  // TEST 8: Completely full cinema
  console.log("📌 TEST 8: Completely Full Cinema");
  console.log("─".repeat(50));
  const cinema8 = initializeCinema();
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 10; col++) {
      reserveSeat(cinema8, row, col);
    }
  }
  displayCinema(cinema8);
  console.log(`Available seats: ${countAvailableSeats(cinema8)}`);
  console.log(`Occupied seats: ${countOccupiedSeats(cinema8)}`);
  const result8 = findAdjacentSeats(cinema8);
  console.log(result8.message);
  console.log();

  // TEST 9: Verify counters are correct
  console.log("📌 TEST 9: Verify Counters (Random Scenario)");
  console.log("─".repeat(50));
  const cinema9 = initializeCinema();
  const reservations = [
    [0, 2],
    [1, 1],
    [1, 2],
    [2, 5],
    [3, 0],
    [3, 1],
    [3, 2],
    [5, 9],
  ];

  reservations.forEach(([row, col]) => {
    reserveSeat(cinema9, row, col);
  });

  const stats = getCinemaStats(cinema9);
  console.log(`Total seats: ${stats.totalSeats}`);
  console.log(`Available seats: ${stats.availableSeats}`);
  console.log(`Occupied seats: ${stats.occupiedSeats}`);
  console.log(`Occupancy: ${stats.occupancyPercentage}%`);

  // Manual verification
  const manualAvailable = countAvailableSeats(cinema9);
  const manualOccupied = countOccupiedSeats(cinema9);
  console.log(
    `\nCounter Verification: ${manualAvailable === stats.availableSeats ? "✅ PASS" : "❌ FAIL"}`
  );
  console.log(
    `Total Verification: ${manualAvailable + manualOccupied === stats.totalSeats ? "✅ PASS" : "❌ FAIL"}`
  );
  console.log();

  // TEST 10: Cinema dimensions
  console.log("📌 TEST 10: Cinema Dimensions Verification");
  console.log("─".repeat(50));
  const cinema10 = initializeCinema();
  console.log(`Number of rows: ${cinema10.length}`);
  console.log(`Seats per row: ${cinema10[0].length}`);
  console.log(`Total seats: ${cinema10.length * cinema10[0].length}`);
  console.log(
    `Dimensions correct (8x10): ${cinema10.length === 8 && cinema10[0].length === 10 ? "✅ PASS" : "❌ FAIL"}`
  );
  console.log();

  // TEST 11: Matrix representation check
  console.log("📌 TEST 11: Matrix Representation Check");
  console.log("─".repeat(50));
  const cinema11 = initializeCinema();
  let isValidMatrix = true;

  for (let row = 0; row < cinema11.length; row++) {
    if (!Array.isArray(cinema11[row])) {
      isValidMatrix = false;
      break;
    }
    for (let col = 0; col < cinema11[row].length; col++) {
      const seat = cinema11[row][col];
      if (typeof seat !== "number" || (seat !== 0 && seat !== 1)) {
        isValidMatrix = false;
        break;
      }
    }
  }

  console.log(
    `Valid 2D array with 0s and 1s: ${isValidMatrix ? "✅ PASS" : "❌ FAIL"}`
  );
  console.log();

  // TEST 12: Edge cases - corner seats
  console.log("📌 TEST 12: Edge Cases - Corner Seats");
  console.log("─".repeat(50));
  const cinema12 = initializeCinema();

  // Top-left corner
  const res12a = reserveSeat(cinema12, 0, 0);
  console.log(`Top-left (0,0): ${res12a.message}`);

  // Top-right corner
  const res12b = reserveSeat(cinema12, 0, 9);
  console.log(`Top-right (0,9): ${res12b.message}`);

  // Bottom-left corner
  const res12c = reserveSeat(cinema12, 7, 0);
  console.log(`Bottom-left (7,0): ${res12c.message}`);

  // Bottom-right corner
  const res12d = reserveSeat(cinema12, 7, 9);
  console.log(`Bottom-right (7,9): ${res12d.message}`);

  displayCinema(cinema12);
  console.log();

  console.log("╔════════════════════════════════════════╗");
  console.log("║      ALL TESTS COMPLETED ✅            ║");
  console.log("╚════════════════════════════════════════╝\n");
}

// Run the test suite
runTests();
