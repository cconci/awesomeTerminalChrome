/*******************************************************************************
Awesome Terminal
cconci
*******************************************************************************/

function checksumParityCalculate(byteBuffer,calculationStartOffset) {

  var byteBufferView = new Int8Array(byteBuffer);
  
  var checksum =0x00;
  
  for(i=0;i<(byteBufferView.length);i++) {

    if(i >= calculationStartOffset){
      var byte = byteBufferView[i];
      checksum ^= byte;
    }
    
  }
  
  return checksum;

}
