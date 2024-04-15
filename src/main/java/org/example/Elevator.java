package org.example;

public class Elevator {
    public Elevator(int floorNumbers){
        int totalFloors = floorNumbers;
        Floor floors[] = new Floor[totalFloors];
        for(int i = 0; i < totalFloors; i++){
            Floor f = new Floor(i);
            floors[i] = f;
        }
        Button buttons[] = new Button[totalFloors];
        for (int i = 0; i < buttons.length; i++) {
            Button floorButton = new Button(i+1);
            buttons[i] = floorButton;
        }
    }
}
