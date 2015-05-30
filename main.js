/*******************************************************************************
Stuff
cconci
*******************************************************************************/

/*
List all ports into drop down box on main page
*/
window.onload = function() {
  
  chrome.app.window.onBoundsChanged.addListener(window_bounds_changed);
  
  update_ports();

  console.log("window.onload");
};

function window_bounds_changed(){
  console.log("Windows bounds have changed");
}

function update_ports(){
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
      document.querySelector('#portInfo').innerHTML = "Number of ports found:" + portCount;
    }
  };

  chrome.serial.getDevices(onGetDevices);
  
}

var connectionId;

function connect_to_port(){
  
  console.log("Connecting to port");
  
  /*
  def of all the params,
    https://developer.chrome.com/apps/serial
    
  */
  
  var port = document.querySelector('#portList').value;
  var baudRate = "";
  var dataBitsVal = document.querySelector('#DataBitsList').value;
  var parityBitVal = document.querySelector('#ParityBitList').value;
  var stopBitsVal = document.querySelector('#StopBitsList').value;
  
  if(document.querySelector('#baudRatesList').value == "Other")
  {
    baudRate = parseInt(document.querySelector('#customBaudRate').value);
  }
  else
  {
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
                  
                    console.log('Connection opened with id: ' + connectionId + ', Bitrate: ' + info.bitrate);
                  
                    //add the recive listener
                    chrome.serial.onReceive.addListener(read_data_callback);
                  } catch (e) {
                    console.log("Connect ERROR - check serial permisons on host");
                  }
              });
  } catch(e) {
    //Drama. possibly the permissons
    //console.log(e);
    console.log("Connect ERROR - check serial permisons on host");
    
  }
  
}

function read_data_callback(info){
  console.log("read_data_callback():stuff");
  console.log(info);
  console.log(String.fromCharCode.apply(null, new Uint8Array(info.data)));
  var uint8View = new Uint8Array(info.data);
  console.log(uint8View);
  
  //append the data to the RX Window
  document.querySelector('#termRX').value += arrayAlementsToString(uint8View);
}

function send_data(byteBuffer){
  
  var uint8View = new Uint8Array(byteBuffer);
  
  try {
    chrome.serial.send(connectionId, byteBuffer, function() {console.log('Write');});
  } catch(e) {
    //Error
    console.log("send_data() - ERROR");
  }
}

function arrayAlementsToString(arrayData){
  
  var output = "";
  
  for(i=0;i<arrayData.byteLength;i++){
    output += padByteString(arrayData[i]+"")+" ";
    
  }
  
  return output;
  
}

function padByteString(stringData){

  /*
  js jas not string padding?????
  */

  //console.log(stringData.length +'\n');

  if(stringData.length === 1)
    return "0"+stringData;
  else
    return stringData;  
  

}
