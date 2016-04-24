import gab.opencv.*;
import processing.video.*;
import java.awt.*;

class CameraScene extends Scene {
  final int FACE_WIDTH = 64;
  final int FACE_HEIGHT = 64;
  
  final int CAPTURE_WIDTH = 320;
  final int CAPTURE_HEIGHT = 240;
  final int CAPTURE_RATE = 20;
  
  Capture video;
  OpenCV opencv;
  CameraStateEnum currentState;
  CameraStateScene currentScene;
  
  CameraScene(PApplet applet) {
    video = new Capture(applet, CAPTURE_WIDTH, CAPTURE_HEIGHT, CAPTURE_RATE);
    opencv = new OpenCV(applet, CAPTURE_WIDTH, CAPTURE_HEIGHT);
    opencv.loadCascade(OpenCV.CASCADE_FRONTALFACE);
  }
  
  void onActivate() {
    switchState(CameraStateEnum.NO_FACE);
    video.start();
  }
  
  void onDeactivate() {
    video.stop();
  }
  
  boolean isSceneOk() {
    return currentScene.getResult() == CameraSceneResult.OK; 
  }
  
  boolean isSceneFail() {
    return currentScene.getResult() == CameraSceneResult.FAIL; 
  }
  
  boolean isSceneFinished() {
    return currentScene.getResult() != CameraSceneResult.NOT_FINISHED;
  }
  
  private void switchState(CameraStateEnum toState) {
    currentState = toState;
    switch(toState) {
      case NO_FACE:
        currentScene = new NoFaceScene(video, opencv);
        break;
      case FACE_READY:
        currentScene = new FaceReadyScene(video, opencv);
        break;
      case COUNTDOWN:
        currentScene = new CountdownScene(video, opencv);
        break;
      case RECORDING:
        currentScene = new RecordingScene(video, opencv);
        break;
      case DISPLAY:
        break;
    }
  }
  
  void onUpdate() {
    if(!isSceneFinished()) {
      return;
    }

    switch(currentState) {
      case NO_FACE:
        switchState(CameraStateEnum.FACE_READY);
        break;
      case FACE_READY:
        if(isSceneOk()) {
          switchState(CameraStateEnum.COUNTDOWN);
        } else {
          switchState(CameraStateEnum.NO_FACE);
        }
        break;
      case COUNTDOWN:
        switchState(CameraStateEnum.RECORDING);
        break;
      case RECORDING:
        break;
      case DISPLAY:
        break;
    }
  }
  
  void onDraw() {
    onUpdate();
    currentScene.onDraw();
  }
  
  void onCaptureEvent(Capture c) {
    currentScene.onCaptureEvent(c);
  }
  
  void onKeyPressed() {
    currentScene.onKeyPressed();
  }
  
  class CameraStateScene extends Scene {
    protected Capture capture;
    protected OpenCV opencv;
    private CameraSceneResult result = CameraSceneResult.NOT_FINISHED;
    
    CameraStateScene(Capture c, OpenCV ocv) {
      capture = c;
      opencv = ocv;
    }
    
    public CameraSceneResult getResult() {
      return result;
    }
    
    protected void resultOk() {
      setResult(CameraSceneResult.OK);
    }
    
    protected void resultFail() {
      setResult(CameraSceneResult.FAIL);
    }
    
    protected void setResult(CameraSceneResult r) {
      result = r;
    }
    
    void onDraw() {
      onDraw(0, 0);
    }
    
    void onDraw(int x, int y) {
      
    }
    
    void onCaptureEvent(Capture c) {
      c.read();
    }
  }
  
  class NoFaceScene extends CameraStateScene {
    NoFaceScene(Capture c, OpenCV ocv) {
      super(c, ocv);
      println("NoFaceState");
    }
    
    void onDraw(int x, int y) {
      image(capture, x, y);
      fill(255, 255);
      textSize(32);
      int centerX = x + capture.width / 2;
      int centerY = y = capture.height / 2;
      textAlign(CENTER, CENTER);
      text("Face the camera", centerX, centerY);
    }
    
    void onCaptureEvent(Capture c) {
      super.onCaptureEvent(c);
      opencv.loadImage(c);
      Rectangle[] faces = opencv.detect();
      if(faces.length > 0) {
        resultOk();
      }
    }
  }
  
  class FaceReadyScene extends CameraStateScene {
    FaceReadyScene(Capture c, OpenCV ocv) {
      super(c, ocv);
      println("FaceReadyState");
    }
    
    void onDraw(int x, int y) {
      image(capture, x, y);
      fill(255, 255);
      textSize(20);
      int centerX = x + capture.width / 2;
      int bottomY = y + capture.height - 20;
      textAlign(CENTER, TOP);
      text("Press any key to start capture", centerX, bottomY);
    }
    
    void onCaptureEvent(Capture c) {
      super.onCaptureEvent(c);
      /*opencv.loadImage(c);
      Rectangle[] faces = opencv.detect();
      if(faces.length <= 0) {
        resultFail();
      }*/
    }
    
    void onKeyPressed() {
      resultOk();
    }
  }
  
  class CountdownScene extends CameraStateScene {
    int countdown = 4;
    long lastCountdown = 0;
    
    CountdownScene(Capture c, OpenCV ocv) {
      super(c, ocv);
      println("CountdownScene");
    }
    
    private void drawCounter(int x, int y) {
      fill(255, 255);
      textSize(40);
      int centerX = x + capture.width / 2;
      int centerY = y = capture.height / 2;
      textAlign(CENTER, CENTER);
      text(countdown, centerX, centerY);
    }
    
    void onDraw(int x, int y) {
      image(capture, x, y);

      long currentTime = millis();
      if(currentTime - lastCountdown > 1000) {
        drawCounter(x, y);
        lastCountdown = currentTime;
        countdown -= 1;
      }
      
      if(countdown <= 0) {
        resultOk();
      } else {
        drawCounter(x, y);
      }
      
    }
  }
  
  class RecordingScene extends CameraStateScene {
    final int FRAME_DELAY = 1000;
    final float FADE_DELAY = 600;
    int countdown = 3;
    long lastCapture = 0;
    
    RecordingScene(Capture c, OpenCV ocv) {
      super(c, ocv);
      println("RecordingScene");
    }
    
    private void addCapture(Capture c) {
    }
    
    void onDraw(int x, int y) {
      image(capture, x, y);

      long currentTime = millis();
      long delta = currentTime - lastCapture;
      
      if(delta < FADE_DELAY) {
        float fadeAlpha = lerp(255, 0, delta / FADE_DELAY);
        fill(255, fadeAlpha);
        rect(0, 0, 480, 640);
      }
      
      if(delta > FRAME_DELAY) {
        println("Capture", countdown);
        addCapture(capture);
        lastCapture = currentTime;
        countdown -= 1;
      }
      
      if(countdown <= 0) {
        resultOk();
      }
      
    }
  }
  
  class DisplayScene extends CameraStateScene {
    DisplayScene(Capture c, OpenCV ocv) {
      super(c, ocv);
      println("DisplayScene");
    }
  }
  
}