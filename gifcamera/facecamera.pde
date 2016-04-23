import gab.opencv.*;
import processing.video.*;
import java.awt.*;

class FaceCamera {
  Capture video;
  OpenCV opencv;
  
  final int FACE_WIDTH = 64;
  final int FACE_HEIGHT = 64;
  
  final int FRAMES_LIMIT = 5;
  final long FRAME_DELAY = 1500;
  final int CAPTURE_OVERLAY_FADE = 15;
  boolean recording = false;
  ArrayList<Capture> frames = new ArrayList<Capture>();
  long lastCaptureTime = 0;
  int captureOverlay = 0;
  
  Rectangle[] faces;
  
  FaceCamera(PApplet applet) {
    video = new Capture(applet, 640/2, 480/2);
    opencv = new OpenCV(applet, 640/2, 480/2);
    opencv.loadCascade(OpenCV.CASCADE_FRONTALFACE);
  }
  
  void start() {
    video.start();
  }
  
  void stop() {
    video.stop();
  }
  
  void startRecording() {
    if(!recording && canSeeFace()){    
      recording = true;
      println("Recording started");
    }
  }
  
  void stopRecording() {
    recording = false;
    frames.clear();
  }
  
  private boolean canSeeFace() {
    return faces != null && faces.length > 0;
  }
  
  private void startOverlay() {
    captureOverlay = 200;
  }
  
  private boolean recordFrame(Capture c) {
    long current = millis();
    boolean captured = false;
    if((current - lastCaptureTime) > FRAME_DELAY) {
      frames.add(c);
      lastCaptureTime = current;
      captured = true;
      startOverlay();
    }
    
    if(frames.size() >= FRAMES_LIMIT) {
      stopRecording();
    }
    
    return captured;
  }
  
  void draw() {
    draw(0, 0);
  }
  
  void draw(int x, int y) { 
    textSize(32);
    fill(255, 255);
    if(!canSeeFace()) {
      text("Show me ur face!", 0, 400);
    } else {
      text("Hello handsome!", 0, 400);
    }
    PImage img = video.copy();
    img.filter(POSTERIZE, 8);
    img.resize(160,120);
    scale(2);
    image(img, x, y);
    scale(1);

    if(captureOverlay > 0) {
      fill(255, captureOverlay);
      rect(0, 0, 480, 640);
      captureOverlay -= CAPTURE_OVERLAY_FADE;
    }
  }
  
  void captureEvent(Capture c) {
    c.read();
    opencv.loadImage(c);
    faces = opencv.detect();
    
    if(recording) {
      recordFrame(c);      
    }
  }
  
  void pixelizeImage(Capture c) {
    
    c.filter(POSTERIZE, 8);
    
  }
}