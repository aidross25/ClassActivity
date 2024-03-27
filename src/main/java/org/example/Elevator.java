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
        // Implement logic to determine next floor based on requests and current direction
        // This is a simplified example that prioritizes up requests over down requests
        // and moves up until no more up requests, then down until no more down requests.

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

}