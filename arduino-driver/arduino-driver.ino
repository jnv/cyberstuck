//#define DEBUG

#include <Mouse.h>
#include <Keyboard.h>
#include <Encoder.h>

#define ROTARY_PIN1 2
#define ROTARY_PIN2 3
#define BUTTON_PIN 7
const char BUTTON_CHAR = ' ';

Encoder myEnc(ROTARY_PIN1, ROTARY_PIN2);

const long interval = 100;
const float sensitivity = 1;

// Distance to scroll
long scrollDistance = 0;

long previousMillis = 0;
bool lastButtonState = true;

void setup() {
#ifdef DEBUG
  Serial.begin(9600);
#endif
  Mouse.begin();
  Keyboard.begin();
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  //attachInterrupt(digitalPinToInterrupt(BUTTON_PIN), onButtonPress, CHANGE);
}

// Main loop handles rotary encoder to mouse wheel
void loop() {
  //Serial.println(digitalRead(BUTTON_PIN));
  unsigned long currentMillis = millis();
  long newPos = myEnc.read();
  bool buttonState = digitalRead(BUTTON_PIN);

  if(currentMillis - previousMillis > interval) {
    if (newPos != 0) {
      scrollDistance = newPos * sensitivity;
#ifdef DEBUG
      Serial.println(scrollDistance);
#else
      Mouse.move(0,0, scrollDistance);
#endif
    }

    if (buttonState != lastButtonState) {
      if(buttonState == LOW) {
        // off -> on
#ifdef DEBUG
        Serial.println("on");
#else
        Keyboard.press(BUTTON_CHAR);
#endif
      } else {
#ifdef DEBUG
        Serial.println("off");
#else
        Keyboard.release(BUTTON_CHAR);
#endif
      }
      lastButtonState = buttonState;
    }

    // Reset scroll position
    myEnc.write(0);
    previousMillis = currentMillis;
  }
}


