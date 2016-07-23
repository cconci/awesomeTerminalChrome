/*******************************************************************************
Awesome Terminal
cconci
*******************************************************************************/


function protocolRoutineTXActionCustom1(byteBuffer) {
  
  //add STX of 0x02
  //add ETX of 0x03
  //use a DLE of 0x10 to SLIP the above two values
  
  var byteBufferView = new Int8Array(byteBuffer);
  var slippArrayBufferSize = 3; //STX,ETX and checksum
  //get the length of the new array
  for(i=0;i<byteBufferView.length;i++) {
    
    switch(byteBufferView[i]) {
      case 0x02:
      case 0x03:
      case 0x10:
        slippArrayBufferSize += 2;
        break;
      default:
        slippArrayBufferSize += 1;
        break;
    }
  }
  
  //can not edit the ArrayBuffer, need to go through this method
  var slippedByteBuffer = new ArrayBuffer(slippArrayBufferSize);
  //can not edit the ArrayBuffer, need to go through this method
  var slippedByteBufferView = new Int8Array(slippedByteBuffer);
  
  var slippedByteBufferViewPntr = 0;
  
  var checkSumArray = new Uint8Array(1);   
  checkSumArray[0] =0x02;
  //var checkSum = 0x02;
  
  
  slippedByteBufferView[slippedByteBufferViewPntr++] = 0x02;
  
  for(i=0;i<byteBufferView.length;i++) {
    
    //checkSum += byteBufferView[i];
    checkSumArray[0] += byteBufferView[i];
    
    switch(byteBufferView[i]) {
      case 0x02:
      case 0x03:
      case 0x10:
        //Slip this byte
        slippedByteBufferView[slippedByteBufferViewPntr++] = 0x10;
        slippedByteBufferView[slippedByteBufferViewPntr++] = (byteBufferView[i] | 0x40);
        break;
      default:
        slippedByteBufferView[slippedByteBufferViewPntr++] = byteBufferView[i];
        break;
    }
    
  }
  
  //console.log("["+checkSumArray[0]+"],["+checkSum+"]");
  
  slippedByteBufferView[slippedByteBufferViewPntr++] = (0xFF - checkSumArray[0]);
  slippedByteBufferView[slippedByteBufferViewPntr++] = 0x03;
  
  //for(i=0;i<slippedByteBufferView.length;i++)
  //{
  //  console.log("["+slippedByteBufferView[i]+"],");
  //}
  
  
  return slippedByteBuffer;
}