package org.example;

public class Button {
    private boolean pressed;

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
