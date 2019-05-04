/*******************************************************************************
Awesome Terminal
cconci
*******************************************************************************/


var connectionId = -1;  //this should be an invalid ID
var rxByteCount = 0;
var txByteCount = 0;
var rxPacketCount = 0;
var txPacketCount = 0;
var rxFilterXNumberOfBytesCount = 0;
var rxFilterTimeBetweenBytesStart = (new Date()).getTime(); //gives us ms since 1/1/1970
var rxFilterShowDate = 0; //0 is no date on update

var currentFontSize = 15;

var txAutomateActive = false;
var txAutomateCurrentRow = 0;
var txAutomateEnd = false;
var txAutomateCount = 0;
var periodicUpdateStarted = false;

//setTimeout is bad, very very bad
var automateSetTimeoutIDs = [];

//time since last packet stamp
var txLastTimeStamp = 0;
var rxLastTimeStamp = 0;

var rxPacketPacketCount = 0

var rxPacketFilterCount = 0
var rxPacketFilterCollectedData = [];
var rxPacketFilterCollectedDataPntr = 0;
var rxPacketFilterCollectedDataOutPutStr = "";

var windowID = 0;

//File IO for logging
var GLOBALFileAccess = null;
var txTermDataDumpToFileBuffer = "";
var rxTermDataDumpToFileBuffer = "";
var protoTermDataDumpToFileBuffer = "";
var filterTermDataDumpToFileBuffer = "";

/*
List all ports into drop down box on main page 
*/
window.onload = function() {
  
  chrome.app.window.onBoundsChanged.addListener(windowBoundsChanged);
  
  updatePorts();

  //Show the version on the header
  document.querySelector('#pageTitle').innerHTML = "Awesome Terminal Chrome V"+chrome.runtime.getManifest().version;
  document.querySelector('#heading').innerHTML = "Awesome Terminal V"+chrome.runtime.getManifest().version;

  console.log("window.onload "+Date()+"");
  
  
  //add the recive listener
  chrome.serial.onReceive.addListener(readDataCallback);
  
  updateStatsCounters();
  
  updateAllTerminalFontSettings();
  
  
  //Set default to somthing common
  document.getElementById('baudRatesList').value = "9600";
 
  initNumberLines();
  
};



function extensionOnClose() {
  
  disconnectFromPort();
  
  console.log("Window Closing");
}

function windowBoundsChanged() {
  console.log("Windows bounds have changed");
  
}

function addOnReciveListener()
{
  chrome.serial.onReceiveError.addListener(readDataErrorCallback);
}

function removeOnReciveListener()
{
  chrome.serial.onReceiveError.removeListener(readDataErrorCallback);
}

function updatePorts() { 
  /*
    var serial = new Serial('test1');
    
    serial.showDevices();
  */
  
  //clear the list
  document.querySelector('#portList').innerHTML = "";
  
  var onGetDevices = function(ports) {
      
    var portCount = 0;
      
    for (var i=0; i<ports.length; i++) {
      console.log(ports[i].path);//debug

      //document.querySelector('#heading').innerText += ports[i].path+",";
      document.querySelector('#portList').innerHTML += '<option value="' + ports[i].path + '">' + ports[i].path + '</option>';
      //document.querySelector('#heading').innerText += "--END";

      portCount++;
    }
    
    if(portCount === 0) {
      //no ports found
      document.querySelector('#portInfo').style.color = "blue";
      //document.querySelector('#portInfo').style.foregroundColor= "blue";
      document.querySelector('#portInfo').innerHTML = "No ports found :(";
      
    }
    else {
      document.querySelector('#portInfo').style.color = "green";
      document.querySelector('#portInfo').innerHTML = "Number of ports found:" + portCount;
    }
  };

  chrome.serial.getDevices(onGetDevices);
  
}


function connectToPort() {
  
  console.log("Connecting to port");
  
  disconnectFromPort();

  /*
  def of all the params,
    https://developer.chrome.com/apps/serial
    
  */
  
  var port = document.querySelector('#portList').value;
  var baudRate = "";
  var dataBitsVal = document.querySelector('#DataBitsList').value;
  var parityBitVal = document.querySelector('#ParityBitList').value;
  var stopBitsVal = document.querySelector('#StopBitsList').value;
  var flowControl = ((document.querySelector('#ctsFlowControlList').value) === "true")?true:false;
  
  if(document.querySelector('#baudRatesList').value == "Other") {
    baudRate = parseInt(document.querySelector('#customBaudRate').value);
  }
  else {
    baudRate = parseInt(document.querySelector('#baudRatesList').value);
  }
  
  
  console.log("Port Options:"+port +"@"+baudRate);
  
  //dataBits , parityBit , stopBits
  chrome.serial.connect(port, 
    {
      bitrate:baudRate,
      dataBits:dataBitsVal,
      parityBit:parityBitVal,
      stopBits:stopBitsVal,
      ctsFlowControl:flowControl
      
    }, serialConnectCallback);

}

function serialConnectCallback(info) {
  
  try {
    
    var port = document.querySelector('#portList').value;
    
    connectionId = info.connectionId;
  
    console.log('Connected on port '+port+', with id ' + connectionId + 'and Bitrate ' + info.bitrate);
  
    document.querySelector('#portInfo').style.color = "green";
    document.querySelector('#portInfo').innerHTML = "Connection open ("+port+")";
    
    //period update
    if(periodicUpdateStarted !== true) {
      //else it is already running
      periodicUpdateStarted = true;
      setTimeout(openConnectionPeriodicChecks,1000);
    }
    
    //set footer info
    document.querySelector('#footer').innerHTML = "Connected on: "+port+" @ "+info.bitrate+","+info.dataBits+","+info.parityBit+","+info.stopBits+","+info.ctsFlowControl;
    
  } catch (e) {
    console.log("Connect ERROR - check serial permisons on host");
    
    document.querySelector('#portInfo').style.color = "red";
    document.querySelector('#portInfo').innerHTML = "Connection Error, check configuration";
    
    document.querySelector('#footer').innerHTML = "NOT Connected";
    
  }  
}

function openConnectionPeriodicChecks() {
  
  console.log('openConnectionPeriodicChecks()');
  
  //
  getControlLinesStatus();
  
  writeLogsToFile();
  
  //check again...soon
  if(periodicUpdateStarted === true) {
    
    setTimeout(openConnectionPeriodicChecks,5000);
  }
}

function disconnectFromPort() {
  chrome.serial.disconnect(connectionId, serialDisconnectCallback);
}

function serialDisconnectCallback(result) {
  
  if(result === true) {
    console.log('serialDisconnectCallback() : Connection with id: ' + connectionId + ' is now closed');
  } else {
    console.log('serialDisconnectCallback() : Connection with id: ' + connectionId + ' did not close');
  }
  
}

function readDataCallback(info) {
  
  if(info.connectionId == connectionId){
  
    console.log("readDataCallback():enter");
    console.log(info);
    console.log(String.fromCharCode.apply(null, new Uint8Array(info.data)));
    var uint8View = new Uint8Array(info.data);
    console.log(uint8View);
    
    //stats
    rxByteCount += uint8View.length;
    
    //append the data to the RX Window
    updateRXoutput(uint8View);
    
    //update stats on ui
    updateStatsCounters();
  } else {
    console.log("readDataCallback():Not our data");
  }
}

function readDataErrorCallback(info){ 
  
  /*
  Info From 
    https://developer.chrome.com/apps/serial#event-onReceive
  disconnected
    The connection was disconnected.
  timeout
    No data has been received for receiveTimeout milliseconds.
  device_lost
    The device was most likely disconnected from the host.
  break
    The device detected a break condition.
  frame_error
    The device detected a framing error.
  overrun
    A character-buffer overrun has occurred. The next character is lost.
  buffer_overflow
    An input buffer overflow has occurred. There is either no room in the input buffer, or a character was received after the end-of-file (EOF) character.
  parity_error
    The device detected a parity error.
  system_error
    A system error occurred and the connection may be unrecoverable.
  */
  
  var errorDetails = "--";
  
  var unPause = 0;
  
  switch(info.error){
    
    case "disconnected":
      errorDetails = "disconnected";
      break;
    case "timeout":
      errorDetails = "timeout";
      break;
    case "device_lost":
      errorDetails = "device_lost";
      break;
    case "break":
      
      unPause = 1;
      
      errorDetails = "break";
      break;
    case "frame_error":
      
      unPause = 1;
      
      errorDetails = "frame_error";
      break;
    case "overrun":
      errorDetails = "overrun";
      break;
    case "buffer_overflow":
      errorDetails = "buffer_overflow";
      break;
    case "parity_error":
      
      unPause = 1;
      
      errorDetails = "parity_error";
      break;
    case "system_error":
      errorDetails = "system_error";
      
      unPause = 1;
      
      break;
    default:
      errorDetails = "Unknown_error";
      break;

  }
  
  if(unPause == 1)
  {
    //Connection is paused when called, I dnt want it to pause :)
    chrome.serial.setPaused(connectionId, false, serialSetPausedCallback);    
  }
  
  
  console.log('readDataErrorCallback():Error:'+errorDetails+'|'+info.error);
  
  addToTerminal("\n"+'[RX ERROR:'+errorDetails+']'+"\n",'#termRX');
 
  autoScrollRxWindow();
 
}

function serialSetPausedCallback() { 
  console.log('serialSetPausedCallback()');
}

function sendData(byteBuffer) {
  
  var uint8View = new Uint8Array(byteBuffer);
  
  //stats
  txByteCount += uint8View.length;
  
  chrome.serial.send(connectionId, byteBuffer, serialSendCallBack);

  updateStatsCounters();
}

function serialSendCallBack(sendInfo) {
  
  try {
    console.log('serialSendCallBack() : Write');
    console.log('serialSendCallBack() : Bytes Sent:'+sendInfo.bytesSent);
    //console.log('serialSendCallBack() : Error Stats:'+sendInfo.error);
  } catch(e) {
    //Error
    console.log("sendData() - ERROR");
    document.querySelector('#portInfo').style.color = "red";
    document.querySelector('#portInfo').innerHTML = "Connection Error, check configuration";
  }
}

function getControlLinesStatus() {
  
  try {
    chrome.serial.getControlSignals(connectionId, serialGetControlSignalsCallBack);
    
    return true;
    
  } catch(e) {
    console.log("getControlLinesStatus() - ERROR");
    document.querySelector('#portInfo').style.color = "red";
    document.querySelector('#portInfo').innerHTML = "Connection Error, check configuration";    
  }
  
  return false;
  
}

function serialGetControlSignalsCallBack(signals) {
  
  try {
    console.log("serialGetControlSignalsCallBack() - Enter");
  
    console.log("serialGetControlSignalsCallBack() - DCD:"+signals.dcd);
    console.log("serialGetControlSignalsCallBack() - CTS:"+signals.cts);
    console.log("serialGetControlSignalsCallBack() - RI:"+signals.ri);
    console.log("serialGetControlSignalsCallBack() - DSR:"+signals.dsr);
    
  } catch(e) {
    console.log("serialGetControlSignalsCallBack() - ERROR");
    document.querySelector('#portInfo').style.color = "red";
    document.querySelector('#portInfo').innerHTML = "Connection Error, check configuration";        
  }
  
  
}

//
//End of Serial layer
//

function updateStatsCounters()  {
  
  //update stats labels
  
  
  document.querySelector('#txStatsByteCount').innerHTML = "TX Byte Count:"+ padStringLeft(txByteCount+"",4," ");
  document.querySelector('#rxStatsByteCount').innerHTML = "RX Byte Count:"+ padStringLeft(rxByteCount+"",4," ");
  
  document.querySelector('#rxStatsProtocolCount').innerHTML = "RX Packet Count:"+ padStringLeft(rxPacketPacketCount+"",4," ");
  document.querySelector('#rxStatsFilterCount').innerHTML = "RX Packet Count:"+ padStringLeft(rxPacketFilterCount+"",4," ");
  
}

function collectRxPacketFilterData(rawByte,outputStr) {
  
  if(document.querySelector('#rxFormateOptionSelected').checked === true) {

    //Collect the Data to Show the Filtered output, Proc & reset on a '/n'
    rxPacketFilterCollectedData[rxPacketFilterCollectedDataPntr++] = rawByte;

    rxPacketFilterCollectedDataOutPutStr += outputStr;

  }
  else {
    rxPacketFilterCollectedDataPntr = 0;
  }
  
}

function processRxPacketFilterData() {

    if(document.querySelector('#rxFormateOptionSelected').checked === true) {
        
        var indexOfByteToCheck = document.querySelector('#divRXOptionsFilterByteNumber').value;
        var indexOfByteValueTOLookFor = hexStringToByte(document.querySelector('#divRXOptionsFilterByteValue').value.toLowerCase());
        
        //rxPacketFilterCollectedData[rxPacketFilterCollectedDataPntr++]
        
        if(indexOfByteToCheck < rxPacketFilterCollectedDataPntr)
        {
            if(indexOfByteValueTOLookFor === rxPacketFilterCollectedData[indexOfByteToCheck])
            {
               //Display the Packet in the Filter Packet Window
               addToTerminal( rxPacketFilterCollectedDataOutPutStr,'#termRXFilter');
               addToTerminal( "\n",'#termRXFilter');

               //Auto Scroll
               var ta = document.getElementById('termRXFilter');
               ta.scrollTop = ta.scrollHeight;

               rxPacketFilterCount++;
            }
        }
        
        //Reset
        rxPacketFilterCollectedDataPntr = 0;
        rxPacketFilterCollectedDataOutPutStr = "";
    }
    
}

function updateRXoutput(uint8View) {

  if(document.querySelector('#rxFormateOptionSelected').checked === true) {
    
    /*
    What options did the user select?
    */
    
    for(i=0;i<uint8View.length;i++) { 
    
      var nByte = getByteInUserSelectedFormat(uint8View[i]); 
      
      //byteFrequencyAnalysis
      if(document.querySelector('#byteFrequencyAnalysis').checked === true) {
        
        //inc the count for the particular byte
        //statsRxDataFrequencyCounter[nByte]++;
        
      }
        
      //Protocol options
      var protcolSelection = document.querySelector('#txPacketFormatProtocolList').value;
      switch(protcolSelection)
      {
        case "Custom 1":
          {
            var retStr = protocolRoutineRXActionCustom1(uint8View[i]);
          
            if(retStr !== "")
            {
              addToTerminal( retStr,'#termRXProtocol');
              addToTerminal( "\n",'#termRXProtocol');

              //Auto Scroll
              var ta = document.getElementById('termRXProtocol');
              ta.scrollTop = ta.scrollHeight;
              
              rxPacketPacketCount++;
              
            }
          }
          break;
      }
      
      
      if(document.querySelector('#rxFormateOptionAfterByteRB').checked === true) {
      
        if(rxFilterShowDate === 1) {
          addToTerminal(getRowIdentifierText(0,true),'#termRX');

          rxFilterShowDate = 0; //clear
        }
        
        //use to string to show the value in hex (that is the way it is entered on the UI)
        if(hexStringToByte(document.querySelector('#rxFormateOptionAfterByte').value.toLowerCase()) === uint8View[i]) {
          
          //after Byte, so we show the byte first
          addToTerminal( nByte,'#termRX');
          collectRxPacketFilterData(uint8View[i],nByte);
          
          //show byte and put \n
          addToTerminal("\n",'#termRX');

          processRxPacketFilterData();
            
          rxFilterShowDate = 1;
          
        }
        else {
          //Show byte
          addToTerminal( nByte,'#termRX');
          collectRxPacketFilterData(uint8View[i],nByte);

        }
        
      }
      else if(document.querySelector('#rxFormateOptionBeforeByteRB').checked === true) {
        
        //use to string to show the value in hex (that is the way it is entered on the UI)
        if(hexStringToByte(document.querySelector('#rxFormateOptionBeforeByte').value.toLowerCase()) === uint8View[i]) {
          
          processRxPacketFilterData();
          
          //Before Byte, so we show the \n first
        
          //show byte and put \n
          //show row identifier
          //show byte
          addToTerminal("\n" 
            + getRowIdentifierText(0,true) 
            + nByte,'#termRX');
          
          collectRxPacketFilterData(uint8View[i],nByte);
                    
        }
        else {
          //Show byte
          addToTerminal(nByte,'#termRX');
          collectRxPacketFilterData(uint8View[i],nByte);
        }
        
      }
      else if(document.querySelector('#rxFormateOptionAfterTimeRB').checked === true) {
        
        var rxFilterTimeBetweenBytesEnd = (new Date()).getTime();
        
        var timeBetweenBytes = (rxFilterTimeBetweenBytesEnd - rxFilterTimeBetweenBytesStart);
        
        //console.log(timeBetweenBytes+"="+rxFilterTimeBetweenBytesEnd+"-"+rxFilterTimeBetweenBytesStart);
        
        //update prevTime
        rxFilterTimeBetweenBytesStart = rxFilterTimeBetweenBytesEnd;
        
        if(timeBetweenBytes > document.querySelector('#rxFormateOptionAfterTime').value) {
          
          processRxPacketFilterData();
          
          addToTerminal("\n"
              + getRowIdentifierText(0,true)
              + nByte ,'#termRX');
          
          collectRxPacketFilterData(uint8View[i],nByte);
          
        }
        else {
          
          addToTerminal(nByte,'#termRX');
          
          collectRxPacketFilterData(uint8View[i],nByte);

        }
        
      }
      else if(document.querySelector('#rxFormateOptionAfterBytesRB').checked === true) {
        
        //X number of bytes filter
        
        
        if(rxFilterXNumberOfBytesCount >= document.querySelector('#rxFormateOptionAfterBytes').value
        || rxFilterXNumberOfBytesCount === 0 ) {
          
          processRxPacketFilterData();
          
          addToTerminal( "\n"
            + getRowIdentifierText(0,true)
            + nByte,'#termRX');
          
          collectRxPacketFilterData(uint8View[i],nByte);
          
          rxFilterXNumberOfBytesCount = 0;//zero the counter 
        }
        else {
          addToTerminal(nByte,'#termRX');
          collectRxPacketFilterData(uint8View[i],nByte);

        }
        
        rxFilterXNumberOfBytesCount++;
        
      }
      else {
        //normal
        addToTerminal(nByte,'#termRX');

      }
    }
    
  }
  else {
  
    //just add to the output window
    addToTerminal(arrayElementsToString(uint8View),'#termRX');

  }

  autoScrollRxWindow();
}

function autoScrollRxWindow() {
  
  //auto scroll
  var ta = document.getElementById('termRX');
  ta.scrollTop = ta.scrollHeight;
  
}

function getByteInUserSelectedFormat(rxByte){
  
  var selection = document.querySelector('#rxOutputFormatList').value;
  
  var retVar = "";
  
  switch(selection){
    
    case "ASCII_0":
      retVar = arrayElementToAsciiString(rxByte,0);
      break;
    case "ASCII_1":
      retVar = arrayElementToAsciiString(rxByte,1);
      break;
    case "ASCII_2":
      retVar = arrayElementToAsciiString(rxByte,2);
      break;
    case "ASCII_3":
      retVar = arrayElementToAsciiString(rxByte,3);
      break;
    case "Hex":
      retVar = arrayElementToHexString(rxByte);
      break;
    case "Octal":
      retVar = arrayElementToOctalString(rxByte);
      break;
    case "Binary":
      retVar = arrayElementToBinaryString(rxByte);
      break;
    case "Decimal":
      retVar = arrayElementToDecimalString(rxByte);
      break;
    
  }
  
  //any extra formating
  var appendTextBefore = document.querySelector('#rxAppendStringBefore').value;
  var appendTextAfter = document.querySelector('#rxAppendStringAfter').value;
  
  return appendTextBefore + retVar + appendTextAfter;
  
}

function getRowIdentifierText(txOrRxWindow,printSpacer) {
  
  //show the date stamp or other RX row id if the option is selected
  
  var date = new Date();
  
  var output = "";
  
  var selection;
  
  if(txOrRxWindow === 0) {
    selection = document.querySelector('#rxDateTimeStampList').value;
  }
  else {
    selection = document.querySelector('#txDateTimeStampList').value;
  }
    
  
  switch(selection) {
    case "None":
      //Hide
      output = "";
      break;
    case "Local":
      output = date.toString();
      break;
    case "Epoch":
      output = (new Date().getTime());
      break;
    case "Custom 1":
      
      output = date.getFullYear()
        +""+ padStringLeft((date.getMonth() + 1)  +"" ,2,"0") 
        +""+ padStringLeft( date.getDate()        +"" ,2,"0")
        +""+ padStringLeft( date.getHours()       +"" ,2,"0") 
        +""+ padStringLeft( date.getMinutes()     +"" ,2,"0")
        +""+ padStringLeft( date.getSeconds()     +"" ,2,"0");
      break;
    case "Time Since Last Packet":
      
      if(txOrRxWindow === 0) {
        //RX
        output = padStringLeft((new Date().getTime()) - rxLastTimeStamp+"",8,"0");
        rxLastTimeStamp = (new Date().getTime()); //update last rx time
      }
      else {
        //TX
        output = padStringLeft((new Date().getTime()) - txLastTimeStamp+"",8,"0");
        txLastTimeStamp = (new Date().getTime());//update last tx time
      }
      
      break;
     
  }
  
  if(printSpacer === true
    && output !== "") {
    return output+" - ";
  }
  else {
    return output;
  }
  
}

function txUserInputInit(callType) {
  
  if(callType === 1 && txAutomateEnd === true) {
    //we have stopped the automate calls
    txAutomateEnd = false;
    txAutomateActive = false;
    
    //kill any setTimeout calls
    clearAutomateSetTimeoutCalls();
    
    console.log("txUserInputInit() - STOP from timeout");
    
    return;
  }
  else if(callType === 0 && txAutomateActive === true) {
    
    //user pressed TX button while in automate, so drop out
    txAutomateActive = false;
    txAutomateCurrentRow = 0;
    txAutomateEnd = true;
    txAutomateCount = 0;
    //we are stopping the current TX operation
    
    console.log("txUserInputInit() - STOP from user");
    
    return;
    
  }
  else {
    //normal TX button press
  }
  
  //tx the input
  txUserInput();
  
}

function clearAutomateSetTimeoutCalls(){
  
  /*
  it is a Good idea to keep track of the setTimeout calls,
  http://stackoverflow.com/questions/3847121/how-can-i-disable-all-settimeout-events
  */
  
  console.log("clearAutomateSetTimeoutCalls() - Array Length:"+automateSetTimeoutIDs.length);
  
  for (var i = 0; i < automateSetTimeoutIDs.length; i++) {
    clearTimeout(automateSetTimeoutIDs[i]);
  }
  
  //clear array
  automateSetTimeoutIDs = [];
}

function txUserInput() { 
  
  var setTimeoutID;
  var runAutomateCheck = false;
  
  //Kill any setTimout calls from automate, otherwise there will be a list of expired setTimeout IDs
  clearAutomateSetTimeoutCalls();
  
  //add text in the user input as a row in the output
  if( (document.querySelector('#termInput').value).length > 0) {
    
    //convert the data in the termInput into a byteBuffer
    var byteBuffer; 
    
    var inputFormatSelection = document.querySelector('#userInputFormatList').selectedIndex;

    if(inputFormatSelection === 0){

      //Hex Input

      //check if the user input is Multi line
      if((document.querySelector('#termInput').value).includes("\n"))
      {
        console.log("User entered Multi Line input");
      
        txAutomateActive = true;
      
        //get the current Row
        var splitTxEntry = (document.querySelector('#termInput').value).split('\n');
      
        if(txAutomateCurrentRow >= splitTxEntry.length)
        {
          //we are done
          txAutomateActive = false;
          txAutomateCurrentRow = 0;
        
          runAutomateCheck = true;
        }
        else
        {
        
          var nextTxTimeMS = 1000;
          //Does the row have a pre set time? (look for the |)
          if(splitTxEntry[txAutomateCurrentRow].includes("|"))
          {
            //mark up for custome timing detected   '| X''    
            var splitTxEntryWithTiming = splitTxEntry[txAutomateCurrentRow].split('|');
          
            //set buffer to send with timing options stripped
            byteBuffer = hexStringToByteArray(splitTxEntryWithTiming[0]); //set the data
          
            nextTxTimeMS = splitTxEntryWithTiming[1]; //set the timing
          
          }
          else
          {
            //set buffer to send
            byteBuffer = hexStringToByteArray(splitTxEntry[txAutomateCurrentRow]);
          
            //use global setting
            nextTxTimeMS = document.querySelector('#txInputMultiLinRowGapXms').value;
          }
        
          txAutomateCurrentRow++;//next row
        
          //callback with param
          setTimeoutID = setTimeout(
            function() {txUserInputInit(1);}, 
            nextTxTimeMS);
          
          automateSetTimeoutIDs.push(setTimeoutID);
        
        }
      
      
      }
      else
      {
      
        //normal
        byteBuffer = hexStringToByteArray((document.querySelector('#termInput').value));
     
        runAutomateCheck = true; 
      }
    
      if(runAutomateCheck === true){
        //check if any of the repeat options are on,
        if(document.querySelector('#txFormateOptionSelected').checked === true) {
        
          if(  document.querySelector('#txInputEveryXmsRB').checked === true) {
          
            //automate is on
            txAutomateActive = true;
          
            //start count down till next tx
            setTimeoutID = setTimeout(
              function() { txUserInputInit(1);}, 
              document.querySelector('#txInputEveryXms').value);
            
            automateSetTimeoutIDs.push(setTimeoutID);
          }
          else if(document.querySelector('#txInputXtimesRB').checked === true) {
        
            if(txAutomateCount < document.querySelector('#txInputXtimes').value) {
          
              //automate is on
              txAutomateActive = true;
          
              //start count down till next tx
              setTimeoutID = setTimeout(
                function() { txUserInputInit(1);}, 
                document.querySelector('#txInputEveryXms').value);
            
              automateSetTimeoutIDs.push(setTimeoutID);
            
              txAutomateCount++;
          
            }
            else {
              txAutomateCount = 0;
              txAutomateActive = false;
            
              return;
            }
          }
        }
      }
    }
    else if(inputFormatSelection === 1){
      
      //ASCII Input
      byteBuffer = asciiStringToByteArray(document.querySelector('#termInput').value);
    }
    
    /*
    Check to see if any of the Packet Formatting options are active
    */
    
    //checksum or CRC items
    var checksumSelection = document.querySelector('#txPacketFormatChecksumOrCRCList').value;

    var calculationStartOffset = document.querySelector('#txPacketFormatChecksumOrCRCBufferOffset').value;

    switch(checksumSelection)
    {
      case "Checksum Parity":

        byteBuffer = appendByteToBuffer(byteBuffer,checksumParityCalculate(byteBuffer,calculationStartOffset));
        
        break;
      default:
      case "None":
        break;
    }

    //Protocol items

    var protcolSelection = document.querySelector('#txPacketFormatProtocolList').value;
    
    switch(protcolSelection)
    {
      case "Custom 1":
        byteBuffer = protocolRoutineTXActionCustom1(byteBuffer);
        break;
      default:
      case "None":
        break;
    }
    
    
    sendData(byteBuffer);

    var dataForTerm = getRowIdentifierText(1,true) + arrayElementsToString(new Uint8Array(byteBuffer)) +"\n";

    //row Identifier
    addToTerminal(dataForTerm,'#termTX');
    
    //auto scroll
    var ta = document.getElementById('termTX');
    ta.scrollTop = ta.scrollHeight;
    
  }  
  
}

function addToTerminal(textToAdd,terminal) {
  
  currentText = document.querySelector(terminal).value;
  
  currentText += textToAdd;
  
  maxText = document.querySelector('#terminalMaxBytes').value;
  
  //we cut out the earliest data
  if(currentText.length > maxText){
    currentText = currentText.substr(currentText.length - maxText);
  }
  
  document.querySelector(terminal).value = currentText;
  
  //File logging update buffers (periodically written out)
  switch(terminal){

    case '#termRX':
      rxTermDataDumpToFileBuffer += textToAdd;
      break;
    case '#termRXFilter':
      filterTermDataDumpToFileBuffer += textToAdd;
      break;
    case '#termRXProtocol':
      protoTermDataDumpToFileBuffer += textToAdd;
      break;
    case '#termTX':
      txTermDataDumpToFileBuffer += textToAdd;
      break;

  }

}

function initNumberLines() {
  
  document.querySelector('#termRXNumberLine').value = ""; // clear
  document.querySelector('#termTXNumberLine').value = ""; // clear
  document.querySelector('#termRXProtocolNumberLine').value = ""; // clear
  document.querySelector('#termRXFilterNumberLine').value = ""; // clear

  var cols = parseInt(document.getElementById('termInput').cols);

  var startVal = parseInt(document.querySelector('#numberLineStartVal').value);

  var startPadding = parseInt(document.querySelector('#numberLineStartPaddingVal').value);
  
  var valuePadding = parseInt(document.querySelector('#numberLinePaddingVal').value);

  for(i=0;i<startPadding;i++){
    document.querySelector('#termRXNumberLine').value += " "; 
    document.querySelector('#termTXNumberLine').value += " "; 
    document.querySelector('#termRXProtocolNumberLine').value += " "; 
    document.querySelector('#termRXFilterNumberLine').value += " "; 
  }

  for(i=startVal;i<(startVal+cols);i++){
    
    var numberFormatted = padStringLeft(i+'',2,"0");
    
    var numberFormattedPadded = padStringLeft(numberFormatted+'',valuePadding,"0")+" ";
    
    document.querySelector('#termRXNumberLine').value += ""+numberFormattedPadded; 
    document.querySelector('#termTXNumberLine').value += ""+numberFormattedPadded; 
    document.querySelector('#termRXProtocolNumberLine').value += ""+numberFormattedPadded; 
    document.querySelector('#termRXFilterNumberLine').value += ""+numberFormattedPadded; 
    
  }
  
}

function updateAllTerminalFontSettings(){
  
  document.querySelector('#termInput').style.fontSize = currentFontSize+"px";
  document.querySelector('#termTX').style.fontSize = currentFontSize+"px";
  document.querySelector('#termRX').style.fontSize = currentFontSize+"px";
  document.querySelector('#termRXNumberLine').style.fontSize = currentFontSize+"px";
  document.querySelector('#termTXNumberLine').style.fontSize = currentFontSize+"px";
  document.querySelector('#termRXProtocolNumberLine').style.fontSize = currentFontSize+"px";
  document.querySelector('#termRXFilterNumberLine').style.fontSize = currentFontSize+"px";
  document.querySelector('#termRXProtocol').style.fontSize = currentFontSize+"px";
  document.querySelector('#termRXFilter').style.fontSize = currentFontSize+"px";
    
}

//File Output

function writeLogsToFile(){

  if(GLOBALFileAccess != null){
    createFileInDirEntry(GLOBALFileAccess,txTermDataDumpToFileBuffer,"termTX");
    createFileInDirEntry(GLOBALFileAccess,rxTermDataDumpToFileBuffer,"termRX");
    createFileInDirEntry(GLOBALFileAccess,protoTermDataDumpToFileBuffer,"termRXProtocol");
    createFileInDirEntry(GLOBALFileAccess,filterTermDataDumpToFileBuffer,"termRXFilter");

    //clear
    txTermDataDumpToFileBuffer = "";
    rxTermDataDumpToFileBuffer = "";
    protoTermDataDumpToFileBuffer = "";
    filterTermDataDumpToFileBuffer = "";
  }
}

function chromeFileSystemChooseEntryCallBack(entry){
  chrome.fileSystem.getDisplayPath(entry, chromeFileSystemGetDisplayPathCallback)
  
  //wrie a file with the entry
  
  GLOBALFileAccess = entry;
  
  //FIle test
  //createFileInDirEntry(entry,"lineOfText","TerminalX");
}

function chromeFileSystemGetDisplayPathCallback(displayPath){
  
  //logToFilePath
  
  document.querySelector('#logToFilePath').style.display = "";
  document.querySelector('#logToFilePath').style.color = "blue";
  document.querySelector('#logToFilePath').innerHTML = displayPath;
   

  
}

function createFileInDirEntry(entry, textToAddToFile,fileStrId) {
  //Tip.
  //<https://stackoverflow.com/questions/38796878/create-file-within-in-the-user-selected-directory-using-chrome-filesystem>
  //
  var date = new Date();
  
  var comId = (document.querySelector('#portList').value).replace(/\//g,"");
  
  comId = comId.replace(/\./g,"");		//replace full stops
  comId = comId.replace(/\\/g,"");		//replace FWD Slash
  
  
  var windowID = document.querySelector('#windowNickName').value;

  var fileName = "aTermLog_"
        +""+ padStringLeft((date.getFullYear()) +"" ,4,"0") 
        +""+ padStringLeft((date.getMonth() + 1)  +"" ,2,"0") 
        +""+ padStringLeft( date.getDate()        +"" ,2,"0")
        +"_"+comId+"_"
        +"_"+windowID+"_"
        +"_"+fileStrId+"_"
        +".txt"; 
  
  console.log("createFileInDirEntry() -"+fileName);


  entry.getFile(fileName, {create: true}, function(file,text) {
        file.createWriter(function(writer,text) {
            writer.seek(writer.length); //Append to end of file
            writer.write(new Blob([textToAddToFile], { type: "text/plain" })); // async
            writer.onwrite = function(e) {
                writer.onwrite = null;

                console.log("File Action");

            };
        }, function(err) {
            console.log("Error:"+err.code);
        });
    }, function(err) {
        console.log("Error:"+err.code); //permission error in most cases check the manifest 
    });

}
