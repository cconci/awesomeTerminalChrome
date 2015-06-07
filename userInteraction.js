/*******************************************************************************
Awesome Terminal
cconci
*******************************************************************************/

document.querySelector('#buttonInputTX').addEventListener("click", function() {
    
    //sends data out the open port
    //document.querySelector('#heading').innerHTML = "TX";
    
    var byteBuffer = new ArrayBuffer(9);
    
    //cant edit the ArrayBuffer, ned to og through this method
    var byteBufferView   = new Int8Array(byteBuffer);
    
    byteBufferView[0] = 0x40;
    byteBufferView[1] = 0x41;
    byteBufferView[2] = 0x42;
    byteBufferView[3] = 0x43;
    byteBufferView[4] = 0x44;
    byteBufferView[5] = 0x45;
    byteBufferView[6] = 0x46;
    byteBufferView[7] = 0x47;
    byteBufferView[8] = '\n';
    
    send_data(byteBuffer);
    
    //add text in the user input as a row in the output
    if( (document.querySelector('#termInput').value).length > 0) {
      document.querySelector('#termTX').value += (document.querySelector('#termInput').value +"\n");
      
      //auto scroll
      var ta = document.getElementById('termTX');
      ta.scrollTop = ta.scrollHeight;
      
    }
});
document.querySelector('#buttonInputClear').onclick = function() {
    
    //Clears the textbox
    document.querySelector('#termInput').value = "";
};
document.querySelector('#buttonTXClear').onclick = function() {
    
    //Clears the textbox
    document.querySelector('#termTX').value = "";
};
document.querySelector('#buttonRXClear').onclick = function() {
    
    //Clears the textbox
    document.querySelector('#termRX').value = "";
};
document.querySelector('#buttonRefreshPorts').onclick = function() {
    
    //
    update_ports();
};

document.querySelector('#baudRatesList').onchange = function() {
  
  if(document.querySelector('#baudRatesList').value == "Other"){
    //we reveal the text box
    document.querySelector('#customBaudRate').style.display = "";
  }
  else{
    //why hide the text box
    document.querySelector('#customBaudRate').style.display = "none";
  }
  
  console.log("Drop DOwn Selection Changed");
};

document.querySelector('#buttonAdvancedOptions').onclick = function() {
    
    //
    if(document.querySelector('#divAdvancedOptions').style.display === ""){
      document.querySelector('#divAdvancedOptions').style.display = "none";
    }
    else{
      document.querySelector('#divAdvancedOptions').style.display = "";
      //change button text to hide advanced options etc...
    }
    
};

document.querySelector('#buttonConnectToPort').onclick = function() {
    
    //
    connect_to_port();
};
