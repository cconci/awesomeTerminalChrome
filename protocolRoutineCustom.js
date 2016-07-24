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

/*
Protocol Vars
*/
var protocolRoutineCustom1RXData = [];
var protocolRoutineCustom1RXDataPntr = 0;
/*
0 = no start byte found
1 = start byte found and save data
*/
var protocolRoutineCustom1RXState = 0;
var protocolRoutineCustom1RXUnslipFlag = 0;
var protocolRoutineCustom1RXCheckSum = 0;

function protocolRoutineRXActionCustom1(nByte) {
  
  switch(nByte)
  {
    case 0x02:
      
      protocolRoutineCustom1RXData = []; //clear array
      protocolRoutineCustom1RXDataPntr = 0;
      protocolRoutineCustom1RXCheckSum = 0;
      
      protocolRoutineCustom1RXCheckSum += nByte;
      
      protocolRoutineCustom1RXState = 1;
      protocolRoutineCustom1RXData.push(nByte); //add STX
      protocolRoutineCustom1RXDataPntr++;
      
      break;
    case 0x03:
      
      if(protocolRoutineCustom1RXState == 1)
      {
      
        //we are done
        var checkSumResult = 0;
        
        //check the checksum we got vs what is in the packet
        //Remove the CHecksum from the packet
        console.log("protocolRoutineRXActionCustom1() - Check-sum:"+protocolRoutineCustom1RXCheckSum+"");
        protocolRoutineCustom1RXCheckSum -= protocolRoutineCustom1RXData[protocolRoutineCustom1RXDataPntr-1];
        
        if((0xFF-protocolRoutineCustom1RXCheckSum) == protocolRoutineCustom1RXData[protocolRoutineCustom1RXDataPntr-1])
        {
          //Check SUM OK            
          checkSumResult = 1;
        }
        else
        {
          //Check sum Error
          checkSumResult = 0;
        }
        
        protocolRoutineCustom1RXData.push(nByte); //add ETX
        
        protocolRoutineCustom1RXState = 0; //back to looking for a start byte
        
        //Push to UI Section....
        var packetAsStr = "";
        
        for(a=0;a<protocolRoutineCustom1RXData.length;a++)
        {
          packetAsStr += getByteInUserSelectedFormat(protocolRoutineCustom1RXData[a]);
        }
        
        if(checkSumResult === 0)
        {
          packetAsStr += "[CheckSum Error GOT:["+protocolRoutineCustom1RXData[protocolRoutineCustom1RXDataPntr-1]+"], Should have been ["+(0xFF-protocolRoutineCustom1RXCheckSum)+"]]";
        }
        
        //pass on to display
        return packetAsStr;
      }
      
      break;
    case 0x10:
      
      if(protocolRoutineCustom1RXState == 1)
      {
        protocolRoutineCustom1RXUnslipFlag = 1;
      }
      
      break;
    default:
    
      if(protocolRoutineCustom1RXState == 1)
      {
    
        if(protocolRoutineCustom1RXUnslipFlag == 1)
        {
          protocolRoutineCustom1RXUnslipFlag = 0;  
          
          nByte = (nByte & 0xBF);
          
          protocolRoutineCustom1RXData.push(nByte);
        }
        else
        {
          protocolRoutineCustom1RXData.push(nByte);
        }
        
        protocolRoutineCustom1RXCheckSum += nByte;
        protocolRoutineCustom1RXDataPntr++;
        
      }  
      break;
  }
  
  return ""; //nothing

}
