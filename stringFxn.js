/*******************************************************************************
Awesome Terminal
cconci
*******************************************************************************/


function padStringLeft(stringToPad,NumberToPadFor,stringToPadWith) {

  /*
  js has not got a string padding fxn?????
  */

  console.log(stringToPad.length +'\n');

  while(stringToPad.length < NumberToPadFor) {

    stringToPad = stringToPadWith+stringToPad;
  
  }
  
  return stringToPad;
  
}

function arrayElementToDecimalString(arrayElement) {
  return padStringLeft(arrayElement.toString(10),3,"0")+" ";
}

function arrayElementToBinaryString(arrayElement) {
  return padStringLeft(arrayElement.toString(2),8,"0")+" ";
}


function arrayElementToHexString(arrayElement) {
  return padStringLeft(arrayElement.toString(16),2,"0")+" ";
}

function arrayElementToHexStringUppercase(arrayElement){
  return (padStringLeft(arrayElement.toString(16),2,"0")+" ").toUpperCase();
}

function arrayElementToOctalString(arrayElement) {
  return padStringLeft(arrayElement.toString(8),3,"0")+" ";
}

function arrayElementToAsciiString(arrayElement,showSpecialChars) {
  //no padding or spacing on Ascii strings

  var specialCharsDetailed = [
    "Null char",
    "Start of Heading",
    "Start of Text",
    "End of Text",
    "End of Transmission",
    "Enquiry",
    "Acknowledgment",
    "Bell",
    "Back Space",
    "Horizontal Tab",
    "Line Feed",
    "Vertical Tab",
    "Form Feed",
    "Carriage Return",
    "Shift Out / X-On",
    "Shift In / X-Off",
    "Data Line Escape",
    "Device Control 1 (oft. XON)",
    "Device Control 2",
    "Device Control 3 (oft. XOFF)",
    "Device Control 4",
    "Negative Acknowledgement",
    "Synchronous Idle",
    "End of Transmit Block",
    "Cancel",
    "End of Medium",
    "Substitute",
    "Escape",
    "File Separator",
    "Group Separator",
    "Record Separator",
    "Unit Separator",
  ];
  

  var specialCharsSimple = [
    "NUL",
    "SOH",
    "STX",
    "ETX",
    "EOT",
    "ENQ",
    "ACK",
    "BEL",
    "BS",
    "HT",
    "LF",
    "VT",
    "FF",
    "CR",
    "SO",
    "SI",
    "DLE",
    "DC1",
    "DC2",
    "DC3",
    "DC4",
    "NAK",
    "SYN",
    "ETB",
    "CAN",
    "EM",
    "SUB",
    "ESC",
    "FS",
    "GS",
    "RS",
    "US",
  ];
  

  var specialCharsCode = [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "\\a",
    "\\b",
    "\\t",
    "\\n",
    "\\v",
    "\\f",
    "\\r",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ];


  if(showSpecialChars === 1 && arrayElement <= 31) {
    return "["+specialCharsSimple[arrayElement]+"]";
  }
  else if (showSpecialChars === 2 && arrayElement <= 31){
    return "["+specialCharsDetailed[arrayElement]+"]";
  }
  else if (showSpecialChars === 3 && arrayElement <= 31){
    return specialCharsCode[arrayElement];
  }
  else if (showSpecialChars === 4 && (arrayElement >= 127 || arrayElement <= 31)){
    return "<0x"+padStringLeft(arrayElement.toString(16),2,"0")+">";
  }
  
  return padStringLeft(String.fromCharCode(arrayElement.toString()),0,"0")+"";
}

function arrayElementsToString(arrayData) {
  
  var output = "";
  
  for(i=0;i<arrayData.byteLength;i++) {
    output += padStringLeft(arrayData[i].toString(16),2,"0")+" "; //.toString(16); turns our int to a hex string
    
  }
  
  return output;
}

function hexStringToByte(hexString) {
  
  return parseInt(hexString,'16');
  
}

function hexStringToByteArray(hexString) {
  
  /*
  Convertes a string like 'AB 00 01 22 FF 10'
  
  to a Byte array
  
  var byteBuffer = new ArrayBuffer(9);
  var byteBufferView   = new Int8Array(byteBuffer);
    
  byteBufferView[0] = 0xAB;
  byteBufferView[1] = 0x00;
  byteBufferView[2] = 0x01;
  byteBufferView[3] = 0x22;
  byteBufferView[4] = 0xFF;
  byteBufferView[5] = 0x10;
  byteBufferView[6] = '\n';
  */
  
  //strip spaces
  var hexStringTrim = hexString.trim();
  
  //step one sepeate the string data, explode on spaces
  var splitHexString = hexStringTrim.split(' ');
  
  var byteBuffer = new ArrayBuffer(splitHexString.length);
  //can not edit the ArrayBuffer, need to go through this method
  var byteBufferView   = new Int8Array(byteBuffer);
  
  for(i=0;i<splitHexString.length;i++) {
    
    //form each byte 
    //http://www.w3schools.com/jsref/jsref_parseint.asp
    var byte;
    
    if(splitHexString[i] === '?') //special feature, puts a random byte in this position
    {
      byte = Math.floor((Math.random() * 256) + 0);  
    }
    else if(splitHexString[i] === "?+") //special feature, puts auto incrementing byte in the buffer
    {
      //static var in js
      hexStringToByteArray.autoIncNumber = hexStringToByteArray.autoIncNumber || 0;
      
      byte =  hexStringToByteArray.autoIncNumber;
      hexStringToByteArray.autoIncNumber++;
    }
    else
    {
      byte = parseInt(splitHexString[i],'16'); //it is a hex string, thus 16
    }
    
    byteBufferView[i] = byte;
    
    console.log(byte +'\n');
    
  }
  
  return byteBuffer;
}

function asciiStringToByteArray(asciiString){

  var byteBuffer = new ArrayBuffer(asciiString.length);
  //can not edit the ArrayBuffer, need to go through this method
  var byteBufferView   = new Int8Array(byteBuffer);
  
  for(i=0;i<asciiString.length;i++) {
    var byte = asciiString.charCodeAt(i);

    byteBufferView[i] = byte;
  }

  return byteBuffer;
}
