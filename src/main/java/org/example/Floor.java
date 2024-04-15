package org.example;

public class Floor {
private int floorNumber;
private Button upButton, downButton;


public Floor(int fN, Button up, Button down) {
    floorNumber = fN;
    upButton = new Button();
    downbutton = new Button();
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
    upButton.press();
}

public void pressDownButton() {
    downButton.press();
}

public void resetUpButton() {
    upButton.reset();
}

public void resetDownButton() {
    downButton.reset();
}
private int getFloorNumber() {
    return floorNumber;
}




}
