import gab.opencv.*;
import processing.video.*;
import java.awt.*;

FaceCamera camera;

void setup() {
  size(480, 640);
  
  camera = new FaceCamera(this);
  camera.start();
}

void draw() {
  background(0);
  camera.draw();
}

void captureEvent(Capture c) {
  camera.captureEvent(c);
}

void keyPressed() {
  camera.startRecording();
}