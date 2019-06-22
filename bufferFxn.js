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
  for(var i=0;i<(byteBufferView.length);i++) { 
        
    var byteToAdd = byteBufferView[i];
        
    outputByteBufferView[outputByteBufferViewPntr++] = byteToAdd;
  }
  
  //add the one new byte
  outputByteBufferView[outputByteBufferViewPntr++] = newByte;
    
  return outputByteBuffer;
}

function appendBufferToBufferStart(byteBuffer,newByteBuffer) {

  var byteBufferView = new Int8Array(byteBuffer);
  var newByteBufferView = new Int8Array(newByteBuffer);
  var outputBufferSize = byteBufferView.length + newByteBufferView.length;
    
  //can not edit the ArrayBuffer, need to go through this method
  var outputByteBuffer = new ArrayBuffer(outputBufferSize);
  var outputByteBufferView = new Int8Array(outputByteBuffer);
    
  var outputByteBufferViewPntr = 0;

  //add new data
  for(var i=0;i<newByteBufferView.length;i++){

    var byteToAdd = newByteBufferView[i];
        
    outputByteBufferView[outputByteBufferViewPntr++] = byteToAdd;

  }
  
  //copy data into outputBuffer
  for(var i=0;i<(byteBufferView.length);i++) { 
        
    var byteToAdd = byteBufferView[i];
        
    outputByteBufferView[outputByteBufferViewPntr++] = byteToAdd;
  }
  
  return outputByteBuffer;
}

function appendBufferToBufferEnd(byteBuffer,newByteBuffer) {

  var byteBufferView = new Int8Array(byteBuffer);
  var newByteBufferView = new Int8Array(newByteBuffer);
  var outputBufferSize = byteBufferView.length + newByteBufferView.length;
    
  //can not edit the ArrayBuffer, need to go through this method
  var outputByteBuffer = new ArrayBuffer(outputBufferSize);
  var outputByteBufferView = new Int8Array(outputByteBuffer);
    
  var outputByteBufferViewPntr = 0;
  
  //copy data into outputBuffer
  for(var i=0;i<(byteBufferView.length);i++) { 
        
    var byteToAdd = byteBufferView[i];
        
    outputByteBufferView[outputByteBufferViewPntr++] = byteToAdd;
  }

  //add new data
  for(var i=0;i<newByteBufferView.length;i++){

    var byteToAdd = newByteBufferView[i];
        
    outputByteBufferView[outputByteBufferViewPntr++] = byteToAdd;

  }
  
  return outputByteBuffer;

}