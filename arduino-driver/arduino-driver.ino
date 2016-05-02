/* Rotary encoder handler for arduino.
 *
 * Copyright 2011 Ben Buxton. Licenced under the GNU GPL Version 3.
 * Contact: bb@cactii.net
 *
 * Quick implementation of rotary encoder routine.
 *
 * More info: http://www.buxtronix.net/2011/10/rotary-encoders-done-properly.html
 *
 */

#define BUTTON_PIN 8

// Half-step mode?
#define HALF_STEP
// Arduino pins the encoder is attached to. Attach the center to ground.
#define ROTARY_PIN1 2
#define ROTARY_PIN2 3
// define to enable weak pullups.
#define ENABLE_PULLUPS

#define DIR_CCW 0x10
#define DIR_CW 0x20

#define OUTPUT_ROTARY_CW "l"
#define OUTPUT_ROTARY_CCW "r"
#define OUTPUT_BUTTON_ON "b"
#define OUTPUT_BUTTON_OFF "o"

#ifdef HALF_STEP
// Use the half-step state table (emits a code at 00 and 11)
const unsigned char ttable[6][4] = {
  {0x3 , 0x2, 0x1,  0x0}, {0x23, 0x0, 0x1,  0x0},
  {0x13, 0x2, 0x0,  0x0}, {0x3 , 0x5, 0x4,  0x0},
  {0x3 , 0x3, 0x4, 0x10}, {0x3 , 0x5, 0x3, 0x20}
};
#else
// Use the full-step state table (emits a code at 00 only)
const unsigned char ttable[7][4] = {
  {0x0, 0x2, 0x4, 0x0}, {0x3, 0x0, 0x1, 0x10},
  {0x3, 0x2, 0x0, 0x0}, {0x3, 0x2, 0x1, 0x0},
  {0x6, 0x0, 0x4, 0x0}, {0x6, 0x5, 0x0, 0x20},
  {0x6, 0x5, 0x4, 0x0},
};
#endif
volatile unsigned char state = 0;

// Timing for polling the encoder
unsigned long currentTime;
unsigned long lastTime;

int buttonState = 0;
int lastButtonState;

/* Call this once in setup(). */
void rotary_init() {
  pinMode(ROTARY_PIN1, INPUT);
  pinMode(ROTARY_PIN2, INPUT);
#ifdef ENABLE_PULLUPS
  digitalWrite(ROTARY_PIN1, HIGH);
  digitalWrite(ROTARY_PIN2, HIGH);
#endif
}

/* Read input pins and process for events. Call this either from a
 * loop or an interrupt (eg pin change or timer).
 *
 * Returns 0 on no event, otherwise 0x80 or 0x40 depending on the direction.
 */
unsigned char rotary_process() {
  unsigned char pinstate = (digitalRead(ROTARY_PIN2) << 1) | digitalRead(ROTARY_PIN1);
  state = ttable[state & 0xf][pinstate];
  return (state & 0x30);
}

void setup() {
  Serial.begin(115200);
  rotary_init();
  // init button
  pinMode(BUTTON_PIN, INPUT);
  digitalWrite(BUTTON_PIN, HIGH);
}

void loop() {
  currentTime = millis();
  // Check if it's time to read
  if (currentTime >= (lastTime + 5)) {
    unsigned char result = rotary_process();
    if (result) {
      // FIXME: the output is switched, dunno why
      Serial.print(result == DIR_CCW ? OUTPUT_ROTARY_CCW : OUTPUT_ROTARY_CW);
    }

    int buttonState = digitalRead(BUTTON_PIN);
    if (lastButtonState != buttonState) {
      if(buttonState == LOW) {
        // off -> on
        Serial.print(OUTPUT_BUTTON_ON);
      } else {
        Serial.print(OUTPUT_BUTTON_OFF);
      }
      //Serial.println("B");
      lastButtonState = buttonState;
    }
    lastTime = currentTime;
  }
}

