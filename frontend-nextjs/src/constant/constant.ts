export const enum UserRole {
  STUDENT = "STUDENT",
  TEACHER = "TEACHER",
}
export enum StatusLesson {
  STARTED = "STARTED",
  SUBMITTED = "SUBMITTED",
  COMPLETED = "COMPLETED",
}
export const REGEX =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

export const Headers: HeadersInit | undefined = {
  "Content-Type": "application/json",
  "accept": "application/json",
};
export enum StatusAttendance {
  ON_TIME = "ON_TIME",
  LATE = "LATE",
}
export enum ChatAIMode {
  NORMAL = "NORMAL",
  IOT = "IOT",
}
export const HttpStatus = {
  OK: 200,
  INTERNAL_SERVER_ERROR: 500,
  CREATED: 201,
  BADREQUEST: 400,
  NOT_FOUND: 404,
};

export const Languages = [
  {
    name: "Python",
    value: "python",
  },
  {
    name: "JavaScript",
    value: "javascript",
  },
  {
    name: "Java",
    value: "java",
  },
  {
    name: "C++",
    value: "cpp",
  },
  {
    name: "C",
    value: "c",
  },
];

export enum Themes {
  DARK = "dark",
  LIGHT = "light",
}

export const ModeUpload = [
  {
    value: "COURSE",
    name: "Khóa học"
  },
  {
    value: "LESSON",
    name: "Bài học"
  },
  {
    value: "DEVICE",
    name: "Thiết bị"
  }
]

export const codeExample =
  `// Khai báo các thư viện cần thiết 
#include <ArduinoJson.h> 
#include <SoftwareSerial.h> 
#include "DHT.h"  
const int DHTPIN = 9;  
//Đọc dữ liệu từ DHT11 ở chân 2 trên mạch Arduino 
const int DHTTYPE = DHT11;  
//Khai báo loại cảm biến, có 2 loại là DHT11 và DHT22  
DHT dht(DHTPIN, DHTTYPE);  
#include <LiquidCrystal_I2C.h>  
LiquidCrystal_I2C lcd(0x27,16,2);  // set the LCD address to 0x27 for a 16 chars and 2 line display 
// Tạo một đối tượng JsonDocument có dung lượng 100 byte
StaticJsonDocument<100> doc;  
#define RX_PIN 6 // Chân RX của EspSoftwareSerial 
#define TX_PIN 7 // Chân TX của EspSoftwareSerial 
// Tạo một đối tượng SoftwareSerial  
#define M0 4 #define M1 5  
SoftwareSerial mySerial(RX_PIN , TX_PIN ); // RX, TX #define relay 8 
#define led 13  
int status = 0; 
void setup() {   
// Khởi tạo giao tiếp nối tiếp với tốc độ baud là 9600   
// Khởi tạo cổng nối tiếp ảo   
mySerial.begin(9600);   
pinMode(M0, OUTPUT);           
pinMode(M1, OUTPUT);   
digitalWrite(M0, LOW);       // Set 2 chân M0 và M1 xuống LOW    
digitalWrite(M1, LOW);       // để hoạt động ở chế độ Normal   
dht.begin();         // Khởi động cảm biến   
pinMode(led,OUTPUT);   
pinMode(relay,OUTPUT);   
lcd.init();                      // initialize the lcd    
// Print a message to the LCD.   
lcd.backlight();   
Serial.begin(9600); }  
void loop() {   
if(mySerial.available()){     
String line = mySerial.readStringUntil('');     
// Chuyển đổi chuỗi JSON thành đối tượng JsonDocument     
DeserializationError error = deserializeJson(doc, line);      
status = doc["status"];     
digitalWrite(relay,status);     
Serial.println("CO DATA");   }    
// Đọc giá trị nhiệt độ và độ ẩm từ cảm biến   
float temperature = dht.readTemperature(); //Đọc nhiệt độ   
float humidity = dht.readHumidity();    //Đọc độ ẩm    
if(isnan(temperature) || isnan(humidity));   
else{     
digitalWrite(led,HIGH);     
delay(500);     
digitalWrite(led,LOW);     
delay(500);   }   
// Gán giá trị nhiệt độ và độ ẩm vào đối tượng JsonDocument   
doc["temperature"] = temperature;   
doc["humidity"] = humidity;      
lcd.setCursor(0,0);   
lcd.print("Temperature: ");   
lcd.print(temperature);   
lcd.setCursor(0,1);   
lcd.print("Humidity: ");   
lcd.print(humidity);   
// Chuyển đổi đối tượng JsonDocument thành chuỗi JSON và gửi nó qua cổng nối tiếp ảo   
serializeJson(doc, mySerial); 
}
`
