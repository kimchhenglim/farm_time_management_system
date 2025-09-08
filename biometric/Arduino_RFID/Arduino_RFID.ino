// Install Library: MFRC522 by GithubCommunity
// To check output: Open Serial Monitor or Ctrl + Shift + M
#include <SPI.h>
#include <MFRC522.h>
#define RST_PIN         9  
#define SS_PIN          10
MFRC522 mfrc522(SS_PIN, RST_PIN);
MFRC522::MIFARE_Key key;
void setup()
{
    Serial.begin(9600);
    while (!Serial);   
    SPI.begin();      
    mfrc522.PCD_Init();
    for (byte i = 0; i < 6; i++)
        key.keyByte[i] = 0xFF;
}
void loop()
{
    if ( ! mfrc522.PICC_IsNewCardPresent())
        return;
    if ( ! mfrc522.PICC_ReadCardSerial())
        return;
    send_tag_val(mfrc522.uid.uidByte, mfrc522.uid.size);
    delay(1000);
}
void send_tag_val(byte *buffer, byte bufferSize)
{
    for (byte i = 0; i < bufferSize; i++)
    {
        Serial.print(buffer[i], DEC);
    }
    Serial.println(0, DEC);
}