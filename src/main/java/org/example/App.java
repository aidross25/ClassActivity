package org.example;

/**
 * Hello world!
 *
 */

public class Elevator {

    private int currentFloor;
    private final int maxFloor;
    private boolean[] upRequests;
    private boolean[] downRequests;

    public Elevator(int maxFloor) {
        this.currentFloor = 1; // Start at ground floor
        this.maxFloor = maxFloor;
        upRequests = new boolean[maxFloor + 1];
        downRequests = new boolean[maxFloor + 1];
    }

    public void requestFloor(int floor, boolean goingUp) {
        if (floor < 1 || floor > maxFloor) {
            System.out.println("Invalid floor: " + floor);
            return;
        }

        if (goingUp) {
            upRequests[floor] = true;
        } else {
            downRequests[floor] = true;
        }
    }

    public void moveElevator() {
        if (hasUpRequests()) {
            for (int floor = currentFloor; floor <= maxFloor; floor++) {
                if (upRequests[floor]) {
                    currentFloor = floor;
                    upRequests[floor] = false;
                    System.out.println("Moving to floor " + currentFloor + " (up request)");
                    return;
                }
            }
        }

        if (hasDownRequests()) {
            for (int floor = currentFloor; floor >= 1; floor--) {
                if (downRequests[floor]) {
                    currentFloor = floor;
                    downRequests[floor] = false;
                    System.out.println("Moving to floor " + currentFloor + " (down request)");
                    return;
                }
            }
        }

        System.out.println("Elevator idle at floor " + currentFloor);
    }

    private boolean hasUpRequests() {
        for (int floor = currentFloor; floor <= maxFloor; floor++) {
            if (upRequests[floor]) {
                return true;
            }
        }
        return false;
    }

    private boolean hasDownRequests() {
        for (int floor = currentFloor; floor >= 1; floor--) {
            if (downRequests[floor]) {
                return true;
            }
        }
        return false;
    }

    public static void main(String[] args) {
        Elevator elevator = new Elevator(10); // Create an elevator with 10 floors

        elevator.requestFloor(5, true); // Request 5th floor going up
        elevator.requestFloor(2, false); // Request 2nd floor going down
        elevator.requestFloor(8, true); // Request 8th floor going up

        elevator.moveElevator(); // Move the elevator

        elevator.requestFloor(1, false); // Request 1st floor going down (from floor 8)

        elevator.moveElevator(); // Move the elevator again
    }
}
