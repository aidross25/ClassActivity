package org.example;

public class Floor{
private int floorNumber;
private Button upButton, downButton;
private Elevator e;


public Floor(int fN, Elevator e) {
    floorNumber = fN;
    upButton = new Button();
    downButton = new Button();
    this.e = e;
}

//getters and setters
public Button getUpButton() {
    return upButton;
}

public Button getDownButton() {
    return downButton;
}

public boolean isUpButtonPressed() {
    return upButton.isPressed();
}

public boolean isDownButtonPressed() {
    return downButton.isPressed();
}

public void pressUpButton() {
    System.out.println("Button illuminated");
    upButton.press();
    e.callElevator(floorNumber);
    System.out.println("Button deluminated");
}

public void pressDownButton() {
    downButton.press();
    e.callElevator(floorNumber);
}

public void resetUpButton() {
    upButton.reset();
}

public void resetDownButton() {
    downButton.reset();
}
public int getFloorNumber() {
    return floorNumber;
}

}
