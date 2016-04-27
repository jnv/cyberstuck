import gab.opencv.*;
import gifAnimation.GifMaker;
import java.awt.*;

class FaceGifGenerator {
  private static OpenCV OPENCV;
  
  final static int TARGET_WIDTH = 64;
  final static int TARGET_HEIGHT = 64;
  
  public static setOpenCV(OpenCV ocv) {
    OPENCV = ocv;
  }
  
  public static getOpenCV() {
    return OPENCV;
  }
  
  private ArrayList<PImage> frames;
  private GifMaker gifMaker;
  
  FaceGifGenerator(ArrayList<PImage> f, GifMaker gm) {
    frames = f;
    gifMaker = gm;
  }
  
  
  private PImage cropFace(PImage image) {
    OPENCV.loadImage(c);
    Rectangle[] faces = opencv.detect();
  }
}