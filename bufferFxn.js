/*******************************************************************************
Awesome Terminal
cconci
*******************************************************************************/

function appendByteToBuffer(byteBuffer,newByte) {

    var byteBufferView = new Int8Array(byteBuffer);
    var outputBufferSize = byteBufferView.length + 1; //+1 for new byte
      
    //can not edit the ArrayBuffer, need to go through this method
    var outputByteBuffer = new ArrayBuffer(outputBufferSize);
    var outputByteBufferView = new Int8Array(outputByteBuffer);
      
    var outputByteBufferViewPntr = 0;
    
    //copy data into outputBuffer
    for(i=0;i<(byteBufferView.length);i++) { 
          
      var byteToAdd = byteBufferView[i];
          
      outputByteBufferView[outputByteBufferViewPntr++] = byteToAdd;
    }
    
    //add the one new byte
    outputByteBufferView[outputByteBufferViewPntr++] = newByte;
      
    return outputByteBuffer;
  }