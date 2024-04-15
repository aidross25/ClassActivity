package org.example;

public class Floor {
private int floorNumber;
private Button upButton, downButton;


public Floor(int fN) {
    floorNumber = fN;
    upButton = new Button();
    downButton = new Button();
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
public int getFloorNumber() {
    return floorNumber;
}




}
