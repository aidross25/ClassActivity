public static void main(String[] args) {
        Elevator elevator = new Elevator(10); // Create an elevator with 10 floors

        elevator.requestFloor(5, true); // Request 5th floor going up
        elevator.requestFloor(2, false); // Request 2nd floor going down
        elevator.requestFloor(8, true); // Request 8th floor going up

        elevator.moveElevator(); // Move the elevator

        elevator.requestFloor(1, false); // Request 1st floor going down (from floor 8)

        elevator.moveElevator(); // Move the elevator again
}