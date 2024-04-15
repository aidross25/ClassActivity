package org.example;
public class Main {
    public static void main(String[] args) {
        Elevator e = new Elevator(6);
        System.out.println("Welcome to floor: " + e.currentFloor());
    }
}
