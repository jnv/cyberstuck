import gab.opencv.*;
import gifAnimation.GifMaker;
import java.awt.*;

class FaceGifGenerator {

  final static int TARGET_WIDTH = 64;
  final static int TARGET_HEIGHT = 64;

  private OpenCV opencv;
  private ArrayList<PImage> frames;
  private GifMaker gifMaker;
  
  FaceGifGenerator(ArrayList<PImage> f, GifMaker gm, OpenCV ocv) {
    frames = f;
    gifMaker = gm;
    opencv = ocv;
  }
  
  public boolean process() {
    ArrayList<PImage> croppedFrames = new ArrayList<PImage>();
    
    gifMaker.setSize(TARGET_WIDTH, TARGET_HEIGHT);
    // Process frames and add them to the GIF
    for (PImage frame : frames) {
      PImage cropped = resizeImage(cropFace(frame));
      croppedFrames.add(cropped);
      gifMaker.addFrame(cropped);
    }
    // And iterate and add them backwards for smooth looping
    for (int i = croppedFrames.size() - 1; i >= 0; i--) {
      gifMaker.addFrame(croppedFrames.get(i));
    }
    return gifMaker.finish();
  }
  
  
  private PImage cropFace(PImage image) {
    opencv.loadImage(image);
    Rectangle[] faces = opencv.detect();
    if(faces.length == 0) {
      return image;
    }
    Rectangle faceRect = faces[0];
    PImage face = image.get(faceRect.x, faceRect.y, faceRect.width, faceRect.height);
    
    return face;
  }
  
  private PImage resizeImage(PImage image) {
    if(image.width > image.height) {
      image.resize(TARGET_WIDTH, 0);
    } else {
      image.resize(0, TARGET_HEIGHT);
    }
    return image;
  }
}