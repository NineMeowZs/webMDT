// โหลด Library 'LiquidCrystal_I2C' ก่อนใช้งาน
#include <Wire.h> 
#include <LiquidCrystal_I2C.h>
// แก้ไข Address (0x27) ตาม LCD I2C Module ของคุณ
LiquidCrystal_I2C lcd(0x27, 16, 2); 

// ตัวแปรและค่าคงที่จากโค้ด ECG เดิม
long instance1=0, timer;
double hrv =0;
double hr = 72; // ค่าเริ่มต้น HR
double interval = 0;
int value = 0;
volatile int count = 0;
bool flag = 0; // ใช้สำหรับตรวจจับ R-peak

#define ECG_THRESHOLD 100 // เกณฑ์สัญญาณสำหรับ R-peak (ต้องปรับจูนตามจริง)
#define TIMER_VALUE 10000 // 10 วินาที สำหรับคำนวณ HR

// การตั้งค่าขาสำหรับ ESP32 และอุปกรณ์ภายนอก
#define ECG_OUTPUT_PIN 34    // A0 ในโค้ดเดิม -> เปลี่ยนเป็นขา ADC ของ ESP32
#define LO_PLUS_PIN 35       // 8 ในโค้ดเดิม -> ขา Digital Input สำหรับ Lead Off +
#define LO_MINUS_PIN 32      // 9 ในโค้ดเดิม -> ขา Digital Input สำหรับ Lead Off -

#define RELAY_FAN_PIN_1 18   // พัดลมตัวที่ 1 - อันนี้รอ relay
#define RELAY_FAN_PIN_2 19   // พัดลมตัวที่ 2 - อันนี้รอ relay
#define VIB_MOTOR_PIN 232    // Vibration Motor

// เกณฑ์อัตราการเต้นของหัวใจสำหรับการแจ้งเตือน (Panic Zone)
#define THRESHOLD_MIN 80    // HR ขั้นต่ำที่อุปกรณ์จะทำงาน
#define THRESHOLD_MAX 120    // HR ขั้นสูงที่อุปกรณ์จะทำงาน

// -----------------------------------------------------------------------------------
// 2. SETUP FUNCTION
// -----------------------------------------------------------------------------------

void setup() {
  Serial.begin(115200);

  // 1. ตั้งค่าขา Input/Output
  // Input สำหรับ AD8232 Lead Off
  pinMode(LO_PLUS_PIN, INPUT); 
  pinMode(LO_MINUS_PIN, INPUT); 

  // Output สำหรับอุปกรณ์ควบคุม
  pinMode(RELAY_FAN_PIN_1, OUTPUT);
  pinMode(RELAY_FAN_PIN_2, OUTPUT);
  pinMode(VIB_MOTOR_PIN, OUTPUT);

  // ตั้งค่า ADC Resolution สำหรับ ESP32
  analogReadResolution(12); // 12-bit resolution (0-4095)

  // 2. ตั้งค่า LCD I2C
  lcd.init(); 
  lcd.backlight();
  
  // *** ฟังก์ชันใหม่: แสดงข้อความ "Turn On" เมื่อบอร์ดเริ่มทำงาน ***
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("System Status:");
  lcd.setCursor(0, 1);
  lcd.print("Board Turn ON"); 
  Serial.println("System Initialized: Board Turn ON"); 
  
  delay(2000); // แสดงข้อความ 2 วินาที

  // 3. ตั้งค่าเริ่มต้นของระบบ
  // พัดลมและ Motor ปิด (Relay Active-LOW: HIGH = OFF)
  digitalWrite(RELAY_FAN_PIN_1, HIGH); 
  digitalWrite(RELAY_FAN_PIN_2, HIGH); 
  digitalWrite(VIB_MOTOR_PIN, LOW); // หรือ HIGH ขึ้นอยู่กับโมดูล Vibrator

  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("BPM Monitor Ready");
  lcd.setCursor(0, 1);
  lcd.print("Place Sensor...");
  
  // ตั้งค่าเริ่มต้นของตัวจับเวลาสำหรับ HR Calculation
  instance1 = micros();
  timer = millis();
}

// -----------------------------------------------------------------------------------
// 3. LOOP FUNCTION
// -----------------------------------------------------------------------------------

void loop() { 
    // ตรวจสอบ Lead Off Detection (AD8232)
    if((digitalRead(LO_PLUS_PIN) == 1)||(digitalRead(LO_MINUS_PIN) == 1)){
        Serial.println("Leads Off!");
        // lcd.setCursor(0, 1); 
        // lcd.print("Leads Off!      ");
        
        // เข้าสู่โหมด Standby/หยุดนับ
        digitalWrite(RELAY_FAN_PIN_1, HIGH); // ปิดพัดลม
        digitalWrite(VIB_MOTOR_PIN, LOW); // ปิด Motor
        instance1 = micros(); // รีเซ็ตตัวจับเวลา
        timer = millis();
    }
    else {
        // 1. อ่านค่า ECG และ R-Peak Detection
        value = analogRead(ECG_OUTPUT_PIN); // อ่านค่า Analog จากขา 34
        // การ Map ค่าช่วยลด Noise แต่ควรใช้การกรองสัญญาณ (Filtering) จริง ๆ
        value = map(value, 0, 4095, 0, 100); 

        if((value > ECG_THRESHOLD) && (!flag)) { // ตรวจจับ R-peak
            count++;
            flag = 1;
            interval = micros() - instance1; // คำนวณ RR interval
            instance1 = micros();
        }
        else if((value < ECG_THRESHOLD)) {
            flag = 0; // รีเซ็ต Flag เมื่อสัญญาณลดลงจาก Threshold
        }
        
        // 2. คำนวณ HR ทุก 10 วินาที
        if ((millis() - timer) > TIMER_VALUE) {
            hr = count * (60000 / TIMER_VALUE); // (count / 10s) * 60s
            timer = millis();
            count = 0; 

            // **********************************************
            // ********* 3. Logic ควบคุมอุปกรณ์ (Panic Logic) *********
            // **********************************************
            if (hr >= THRESHOLD_MIN && hr <= THRESHOLD_MAX) { // 100 <= HR <= 120 BPM
                // เปิดพัดลมทั้งสองตัวและ Vibrator
                digitalWrite(RELAY_FAN_PIN_1, LOW); 
                digitalWrite(RELAY_FAN_PIN_2, LOW);
                digitalWrite(VIB_MOTOR_PIN, HIGH);
            } else {
                // ปิดพัดลมและ Vibrator
                digitalWrite(RELAY_FAN_PIN_1, HIGH); 
                digitalWrite(RELAY_FAN_PIN_2, HIGH);
                digitalWrite(VIB_MOTOR_PIN, LOW);
            }
        }
        
        // 4. คำนวณ HRV (ใช้แค่ HR ก็พอสำหรับโครงการนี้ แต่คงไว้ตามโค้ดเดิม)
        hrv = hr/60 - interval/1000000;

        // **********************************************
        // ********* 5. แสดงผลบน LCD และ Serial Monitor *********
        // **********************************************
        
        // บรรทัดที่ 1: แสดงค่า HR
        lcd.setCursor(0, 0);
        lcd.print("HR: ");
        lcd.print(hr);
        lcd.print(" BPM   ");

        // บรรทัดที่ 2: แสดงสถานะ
        lcd.setCursor(0, 1);
        if (hr >= THRESHOLD_MIN && hr <= THRESHOLD_MAX) {
            lcd.print("!!! PANIC ALERT !!!");
            Serial.println("STATUS: PANIC ALERT");
        } else {
            lcd.print("Status: Normal    "); 
            Serial.println("STATUS: Normal");
        }
        
        // Debugging via Serial (คงไว้ตามโค้ดเดิม)
        Serial.print("HR:");
        Serial.print(hr);
        Serial.print(", Value:");
        Serial.println(value);

        delay(100); // หน่วงเวลาตามโค้ดเดิม
    }
}