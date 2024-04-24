package org.example;

import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        int numberOfFloors = 6;
        Elevator e = new Elevator(numberOfFloors);
        Scanner s = new Scanner(System.in);
        int userRequest = 1;

        if(userRequest == 0){
            System.exit(0);
        }
        while(userRequest != 0){
            if (userRequest == 1){
                System.out.println("You are at the ground floor.");
                System.out.println("To push the up button, enter: 2");
                System.out.println("To exit, enter 0");
                userRequest = s.nextInt();
                if(userRequest == 2){
                    Floor currFloor = e.arriveAtFloor();
                    currFloor.pressUpButton();
                    System.out.println("You are in the elevator. To what floor?");
                    userRequest = s.nextInt();
                    e.callElevator(userRequest);
                } else {
                    System.out.println("Incorrect input.");
                }
            } else if((userRequest >= 2) && (userRequest < numberOfFloors)){
                Floor currFloor = e.arriveAtFloor();
                currFloor.pressUpButton();
                System.out.println("You are now on floor: " + currFloor.getFloorNumber());
                userRequest = s.nextInt();
                if(userRequest <= 0){
                    System.out.println("incorrect floor, enter a value greater than 1");
                } else if (userRequest > numberOfFloors){
                    System.out.println("floor exceeds total floors");
                }
                if((userRequest > 0) && (userRequest <= numberOfFloors)){
                    Floor newFloor = e.callElevator(userRequest);
                    while(userRequest != 0){
                        if(newFloor.getFloorNumber() == userRequest){
                            System.out.println("You are now on Floor: " + newFloor.getFloorNumber());
                            System.out.println("Press 2 to request to go up");
                            System.out.println("Press 1 to request to go down");
                            userRequest = s.nextInt();
                        } else {
                            System.out.println("Execution failed");
                        }
                    }
                    
                    
                }
            }
        }
    s.close();
    }
}
