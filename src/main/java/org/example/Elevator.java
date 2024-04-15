package org.example;

public class Elevator {
    private Floor floors[];
    private Button buttons[];
    private int currentFloor;
    public Elevator(int floorNumbers){
        int totalFloors = floorNumbers;
        floors = new Floor[totalFloors];
        for(int i = 0; i < totalFloors; i++){
            Floor f = new Floor(i);
            floors[i] = f;
        }
        buttons = new Button[totalFloors];
        for (int i = 0; i < buttons.length; i++) {
            Button floorButton = new Button(i+1);
            buttons[i] = floorButton;
        }
        currentFloor = 0;
    }

    public int currentFloor(){
        return floors[currentFloor].getFloorNumber();
    }
}
