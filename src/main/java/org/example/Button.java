package org.example;

public class Button {
    private boolean pressed;
    private int floorNumber;
    public Button(){
        pressed = false;
    }
    public Button(int floor){
        this.floorNumber = floor;
        pressed = false;
    }

    public boolean isPressed() {
        return pressed;
    }

    public void press() {
        pressed = true;
    }

    public void reset() {
        pressed = false;
    }
}
