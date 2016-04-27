CameraScene camera;

void setup() {
  size(480, 640);
  
  String[] cameras = Capture.list();
  
  if (cameras.length == 0) {
    println("There are no cameras available for capture.");
    exit();
  } else {
    println("Available cameras:");
    for (int i = 0; i < cameras.length; i++) {
      println(cameras[i]);
    }
  } 
  
  camera = new CameraScene(this);
  camera.onActivate();
}

void draw() {
  background(0);
  camera.onDraw();
}

void captureEvent(Capture c) {
  camera.onCaptureEvent(c);
}

void keyPressed() {
  camera.onKeyPressed();
}