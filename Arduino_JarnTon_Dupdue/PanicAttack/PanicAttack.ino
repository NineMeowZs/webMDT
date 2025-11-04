// -----------------------------------------------------------------------------------
// 1. การตั้งค่า Library และ Global Variables
// -----------------------------------------------------------------------------------

// *** หากใช้ LCD I2C 16x2 ให้เปิดใช้งาน 3 บรรทัดนี้ และติดตั้ง Library 'LiquidCrystal_I2C' ***
/*
#include <Wire.h> 
#include <LiquidCrystal_I2C.h>
LiquidCrystal_I2C lcd(0x27, 16, 2); // แก้ไข Address 0x27 ตาม LCD I2C Module ของคุณ
*/

// กำหนดขา Digital Pin บน ESP32
#define ECG_OUTPUT_PIN 34 // ขา Analog Input ที่ต่อกับ OUTPUT ของ AD8232 (ADC1_CH6 - ขาที่ดีที่สุดสำหรับ ADC บน ESP32)
#define LO_PLUS_PIN 35    // ขาสำหรับ Lead Off Detection (LO+) ของ AD8232 (ใช้หรือไม่ก็ได้)
#define LO_MINUS_PIN 32   // ขาสำหรับ Lead Off Detection (LO-) ของ AD8232 (ใช้หรือไม่ก็ได้)

#define RELAY_FAN_PIN 18     // ขาควบคุม Relay สำหรับพัดลม (ตามตัวอย่างก่อนหน้า)
#define VIB_MOTOR_PIN 21     // ขาควบคุม Vibration Motor (ใช้แทน Buzzer)
#define THRESHOLD_BPM 100    // เกณฑ์อัตราการเต้นของหัวใจที่กำหนด (ปรับได้ตามความเหมาะสม)

// ตัวแปรสำหรับคำนวณ BPM
volatile int pulseCount = 0; // นับจำนวนการเต้นของหัวใจ
volatile unsigned long lastBeatTime = 0; // เวลาก่อนหน้าที่นับการเต้นครั้งล่าสุด
int currentBPM = 0; // ค่า BPM ปัจจุบัน
unsigned long lastDisplayTime = 0; // เวลาล่าสุดที่แสดงผล

// -----------------------------------------------------------------------------------
// 2. ฟังก์ชันตรวจสอบการเต้นของหัวใจ (Heartbeat Detection Logic)
// -----------------------------------------------------------------------------------

// ฟังก์ชันนี้ถูกเรียกใช้เป็นระยะ ๆ เพื่อตรวจสอบสัญญาณ
void checkPulse() {
    int sensorValue = analogRead(ECG_OUTPUT_PIN);
    
    // *** การประมวลผลสัญญาณ AD8232 ***
    // AD8232 ให้สัญญาณคลื่นไฟฟ้าหัวใจ (ECG) ซึ่งต้องใช้การกรองและหา Peak
    // โค้ดด้านล่างเป็นแนวทางแบบง่ายในการตรวจจับ Peak/Valley เพื่อจำลองการเต้น 
    // สำหรับการใช้งานจริง ควรใช้การกรองดิจิทัล (Digital Filtering)
    
    // สมมติว่าสัญญาณ Peak (การเต้น) อยู่ที่ค่าสูงกว่า 2500 (ปรับตามการวัดจริงของ AD8232)
    // และการเต้นครั้งถัดไปต้องห่างจากการเต้นก่อนหน้าอย่างน้อย 300ms (ประมาณ 200 BPM)
    if (sensorValue > 2500 && (millis() - lastBeatTime) > 300) {
        pulseCount++;
        lastBeatTime = millis();
    }
}

// -----------------------------------------------------------------------------------
// 3. Setup Function
// -----------------------------------------------------------------------------------

void setup() {
  Serial.begin(115200);

  // ตั้งค่าขา Output
  pinMode(RELAY_FAN_PIN, OUTPUT);
  pinMode(VIB_MOTOR_PIN, OUTPUT);

  // ตั้งค่าเริ่มต้น: พัดลมและ Vibration Motor ปิด
  // Relay ส่วนใหญ่มักเป็น Active-LOW (LOW = ทำงาน, HIGH = หยุด)
  digitalWrite(RELAY_FAN_PIN, HIGH); // เริ่มต้นปิดพัดลม
  digitalWrite(VIB_MOTOR_PIN, LOW); // เริ่มต้นปิด Motor (ใช้ HIGH/LOW ตามโมดูล)

  // *** หากใช้ LCD I2C ***
  /*
  lcd.init(); 
  lcd.backlight();
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Heart Rate Monitor");
  */
  
  // ตั้งค่า ADC Resolution (สำหรับ ESP32)
  analogReadResolution(12); // 12-bit resolution (0-4095)
  Serial.println("System Ready. Place AD8232 Electrodes.");
}

// -----------------------------------------------------------------------------------
// 4. Main Loop Function
// -----------------------------------------------------------------------------------

void loop() {
    checkPulse(); // ตรวจสอบสัญญาณชีพจรอย่างต่อเนื่อง

    // คำนวณ BPM ทุก 2 วินาที (เพื่อให้ได้ค่าที่แม่นยำขึ้น)
    if (millis() - lastDisplayTime >= 2000) {
        
        // คำนวณ BPM: (จำนวนครั้ง / เวลาที่ผ่านไปเป็นนาที)
        // 1 นาที = 60000 ms
        currentBPM = (pulseCount * 60000) / (millis() - (lastDisplayTime));
        
        // **********************************************
        // ********* A. แสดงผลค่า BPM *********
        // **********************************************
        
        Serial.print("BPM: ");
        Serial.println(currentBPM);

        // *** หากใช้ LCD I2C ***
        /*
        lcd.clear();
        lcd.setCursor(0, 0);
        lcd.print("BPM: ");
        lcd.print(currentBPM);
        */

        // **********************************************
        // ********* B. ตรวจสอบเงื่อนไขและควบคุมอุปกรณ์ *********
        // **********************************************
        
        if (currentBPM > THRESHOLD_BPM) {
            
            // 1. สั่งให้ Relay เปิดพัดลม
            digitalWrite(RELAY_FAN_PIN, LOW); // Active-LOW: LOW = ON
            
            // 2. สั่งให้ Vibration Motor ทำงาน