/*******************************************************************************
Awesome Terminal
cconci
*******************************************************************************/

/*
List all ports into drop down box on main page
*/
window.onload = function() {
  
  chrome.app.window.onBoundsChanged.addListener(window_bounds_changed);
  
  update_ports();

  //Show the version on the header
  document.querySelector('#pageTitle').innerHTML = "Awesome Terminal Chrome V"+chrome.runtime.getManifest().version;

  console.log("window.onload "+Date()+"");
  
  
  //add the recive listener
  chrome.serial.onReceive.addListener(read_data_callback);
};

function window_bounds_changed() {
  console.log("Windows bounds have changed");
}

function update_ports() { 
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

var connectionId = -1; //this should be an invalid ID

function connect_to_port() {
  
  console.log("Connecting to port");
  
  //Check if we are connected first
  //if(connectionId != -1) { 
    disconnect_from_port();
  //}
  
  /*
  def of all the params,
    https://developer.chrome.com/apps/serial
    
  */
  
  var port = document.querySelector('#portList').value;
  var baudRate = "";
  var dataBitsVal = document.querySelector('#DataBitsList').value;
  var parityBitVal = document.querySelector('#ParityBitList').value;
  var stopBitsVal = document.querySelector('#StopBitsList').value;
  
  if(document.querySelector('#baudRatesList').value == "Other") {
    baudRate = parseInt(document.querySelector('#customBaudRate').value);
  }
  else {
    baudRate = parseInt(document.querySelector('#baudRatesList').value);
  }
  
  
  console.log("Port Options:"+port +"@"+baudRate);
  
  /*
  This try catch does not catch the permisson(I think its permissons on linux) issue I have been seeing
   -it goes away once you add yourself to the correct group, ref the Notes.txt
  */
  try {
    
    //dataBits , parityBit , stopBits
    chrome.serial.connect(port, {bitrate: baudRate,dataBits:dataBitsVal,parityBit:parityBitVal,stopBits:stopBitsVal}, function(info) {
      
                  try {
                    connectionId = info.connectionId;
                  
                    console.log('Connected on port '+port+', with id ' + connectionId + 'and Bitrate ' + info.bitrate);
                  
                    document.querySelector('#portInfo').style.color = "green";
                    document.querySelector('#portInfo').innerHTML = "Connection open ("+port+")";
                    
                  } catch (e) {
                    console.log("Connect ERROR - check serial permisons on host");
                    
                    document.querySelector('#portInfo').style.color = "red";
                    document.querySelector('#portInfo').innerHTML = "Connection Error, check configuration";
                    
                  }
              });
  } catch(e) {
    //Drama. possibly the permissons
    //console.log(e);
    console.log("Connect ERROR - check serial permisons on host");
    
    document.querySelector('#portInfo').style.color = "red";
    document.querySelector('#portInfo').innerHTML = "Connection Error, check configuration";
    
  }
  
}

function disconnect_from_port() {
  
  chrome.serial.disconnect(connectionId, function(result) {
                
                console.log('Connection with id: ' + connectionId + ' is now closed');
            });
            
  //connectionId = -1;//set to invalid
}

function read_data_callback(info) {
  console.log("read_data_callback():stuff");
  console.log(info);
  console.log(String.fromCharCode.apply(null, new Uint8Array(info.data)));
  var uint8View = new Uint8Array(info.data);
  console.log(uint8View);
  
  //append the data to the RX Window
  document.querySelector('#termRX').value += arrayAlementsToString(uint8View);
}

function send_data(byteBuffer) {
  
  var uint8View = new Uint8Array(byteBuffer);
  
  try {
    chrome.serial.send(connectionId, byteBuffer, function() {console.log('Write');});
  } catch(e) {
    //Error
    console.log("send_data() - ERROR");
  }
}

function arrayAlementsToString(arrayData) {
  
  var output = "";
  
  for(i=0;i<arrayData.byteLength;i++) {
    output += padByteString(arrayData[i].toString(16))+" "; //.toString(16); turns our int to a hex string
    
  }
  
  return output;
  
}

function padByteString(stringData) {

  /*
  js has not string padding fxn?????
  */

  //console.log(stringData.length +'\n');

  if(stringData.length === 1)
    return "0"+stringData;
  else
    return stringData;  
  
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
