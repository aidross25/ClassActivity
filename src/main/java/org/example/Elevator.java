package org.example;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Stack;

public class Elevator{
    private int doorState;// 0 is closed, 1 open
    private int totalFloors;
    private static Floor floors[];
    private Button buttons[];
    private int currentFloor;
    private static ArrayList<Floor> floorRequests;
    private int moving; //0 stationary, 1 up, -1 down

    public Elevator(int floorNumbers){
        totalFloors = floorNumbers;
        floors = new Floor[totalFloors];
        for(int i = 0; i < totalFloors; i++){
            Floor f = new Floor(i+1, this);
            Elevator.floors[i] = f;
        }
        floorRequests = new ArrayList<>();
        buttons = new Button[totalFloors];
        for (int i = 0; i < buttons.length; i++) {
            Button floorButton = new Button(i+1);
            this.buttons[i] = floorButton;
        }
        currentFloor = 1; //on first floor
        doorState = 0; //closed
        moving = 0; //stationary
        
    }

    public int currentFloor(){
        return floors[currentFloor].getFloorNumber();
    }

    public Floor move(Floor f){
        Floor destFloor = floorRequests.get(0);
        if (this.currentFloor != destFloor.getFloorNumber()) {
            doorState = 0; //closed
            if(this.currentFloor > f.getFloorNumber()){
                moving = -1; //moving downward
            } else {
                moving = 1; //moving upward
            }
            System.out.println("Elevator on floor: " + this.currentFloor);
            if((currentFloor == 0) && (moving < 0)){
                return floors[currentFloor-1];
            }
            if((currentFloor == totalFloors) && (moving > 0)){
                System.out.println("Elevator on floor: " + this.currentFloor);
                return floors[currentFloor-1];
            }
            try {
                Thread.sleep(1 * 1000); // Sleep for travel time 1 floor/sec in milliseconds
            } catch (InterruptedException ex) {
                ex.printStackTrace();
            }
            currentFloor = currentFloor + moving;
            return move(floors[currentFloor-1]);

        } else {
            System.out.println("Elevator on floor: " + destFloor.getFloorNumber());
            doorState = 1;
            return destFloor;
        }
        
    }
    
    private Floor requestFloor(Floor f){
        floorRequests.add(f);
        doorState = 0;
        Floor check = null;
        int size = floorRequests.size();
        while(size > 0){
            check = move(floorRequests.get(0));
            if(check.equals(f)){
                floorRequests.remove(0);
                size = floorRequests.size();
                if(size == 0){
                    break;
                }
            }
        }
        return check;
    }

    public Floor arriveAtFloor(){
        return Elevator.floors[currentFloor-1];
    }

    public Floor callElevator(int fromFloorNumber){
        if((fromFloorNumber > 0) && (fromFloorNumber <= totalFloors)) {
            Floor f = floors[fromFloorNumber-1];
            Floor check = requestFloor(f);
            if(check.equals(f)){
                if(doorState()){
                    System.out.println("The elevator doors are open on Floor: " + check.getFloorNumber());
                }
                return check;
            }
        } else {
            System.out.println("incorrect call");
        }
        return null;
        
    }

    public int isMoving(){
        return moving;
    }
    public boolean doorState(){
        if(doorState == 1){
            System.out.println("Doors are open");
            return true;
        } else {
            System.out.println("Doors are closed");
            return false;
        }
        
    }
    
}
