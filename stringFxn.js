/*******************************************************************************
Awesome Terminal
cconci
*******************************************************************************/


function padStringLeft(stringToPad,NumberToPadFor,stringToPadWith) {

  /*
  js has not string padding fxn?????
  */

  console.log(stringToPad.length +'\n');

  while(stringToPad.length < NumberToPadFor) {

    stringToPad = stringToPadWith+stringToPad;
  
  }
  
  return stringToPad;
  
}

function arrayAlementToString(arrayElement) {
  return padStringLeft(arrayElement.toString(16),2,"0")+" ";
}

function arrayAlementsToString(arrayData) {
  
  var output = "";
  
  for(i=0;i<arrayData.byteLength;i++) {
    output += padStringLeft(arrayData[i].toString(16),2,"0")+" "; //.toString(16); turns our int to a hex string
    
  }
  
  return output;
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
  
  
  //step one sepeate the string data, explode on spaces
  var splitHexString = hexString.split(' ');
  
  var byteBuffer = new ArrayBuffer(splitHexString.length);
  //can not edit the ArrayBuffer, need to go through this method
  var byteBufferView   = new Int8Array(byteBuffer);
  
  for(i=0;i<splitHexString.length;i++) {
    
    //form each byte 
    //http://www.w3schools.com/jsref/jsref_parseint.asp
    var byte = parseInt(splitHexString[i],'16'); //it is a hex string, thus 16
    
    byteBufferView[i] = byte;
    
    console.log(byte +'\n');
    
  }
  
  return byteBuffer;
}