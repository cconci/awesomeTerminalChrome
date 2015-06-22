/*******************************************************************************
Awesome Terminal
cconci
*******************************************************************************/

document.querySelector('#buttonInputTX').addEventListener("click", function() {
    
    //sends data out the open port
    //document.querySelector('#heading').innerHTML = "TX";
    
    //debug hardcoded send
    //var byteBuffer = new ArrayBuffer(9);
    
    //cant edit the ArrayBuffer, ned to og through this method
    //var byteBufferView   = new Int8Array(byteBuffer);
    
    //byteBufferView[0] = 0x40;
    //byteBufferView[1] = 0x41;
    //byteBufferView[2] = 0x42;
    //byteBufferView[3] = 0x43;
    //byteBufferView[4] = 0x44;
    //byteBufferView[5] = 0x45;
    //byteBufferView[6] = 0x46;
    //byteBufferView[7] = 0x47;
    //byteBufferView[8] = '\n';
    
    //send_data(byteBuffer);
    
    //add text in the user input as a row in the output
    if( (document.querySelector('#termInput').value).length > 0) {
      
      //convert the data in the termInput into a byteBuffer
      var byteBuffer = hexStringToByteArray((document.querySelector('#termInput').value));
      
      send_data(byteBuffer);
      
      document.querySelector('#termTX').value += (arrayAlementsToString(new Uint8Array(byteBuffer)) +"\n");
      
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
    
    txByteCount = 0;
    
    updateStatsCounters();
};
document.querySelector('#buttonRXClear').onclick = function() {
    
    //Clears the textbox
    document.querySelector('#termRX').value = "";
    
    //filter counter
    rxFilterXNumberOfBytesCount = 0;
    
    //byte count
    rxByteCount = 0;
    
    updateStatsCounters();
};
document.querySelector('#buttonRefreshPorts').onclick = function() {
    
    //
    update_ports();
};

document.querySelector('#baudRatesList').onchange = function() {
  
  if(document.querySelector('#baudRatesList').value == "Other") {
    //we reveal the text box
    document.querySelector('#customBaudRate').style.display = "";
  }
  else {
    //we hide the text box
    document.querySelector('#customBaudRate').style.display = "none";
  }
  
  console.log("Drop DOwn Selection Changed");
};

document.querySelector('#buttonAdvancedOptions').onclick = function() {
    
    //
    if(document.querySelector('#divAdvancedOptions').style.display === "") {
      document.querySelector('#divAdvancedOptions').style.display = "none";
    }
    else {
      document.querySelector('#divAdvancedOptions').style.display = "";
      //change button text to hide advanced options etc...
    }
    
};

document.querySelector('#buttonRXOptions').onclick = function() {
    
    //
    if(document.querySelector('#divRXOptions').style.display === "") {
      document.querySelector('#divRXOptions').style.display = "none";
    }
    else {
      document.querySelector('#divRXOptions').style.display = "";
      //change button text to hide advanced options etc...
    }
    
};

document.querySelector('#buttonFontP').onclick = function() {
    
  //
  currentFontSize++;
  document.querySelector('#termInput').style.fontSize = currentFontSize+"px";
  document.querySelector('#termTX').style.fontSize = currentFontSize+"px";
  document.querySelector('#termRX').style.fontSize = currentFontSize+"px";
   
};

document.querySelector('#buttonFontN').onclick = function() {
    
  //
  currentFontSize--;
  document.querySelector('#termInput').style.fontSize = currentFontSize+"px";
  document.querySelector('#termTX').style.fontSize = currentFontSize+"px";
  document.querySelector('#termRX').style.fontSize = currentFontSize+"px";
    
};

document.querySelector('#buttonConnectToPort').onclick = function() {
    
    //
    connect_to_port();
};


document.querySelector('#UIOptions').onclick = function() {
    
    if(document.querySelector('#divUIOptions').style.display === "") {
      document.querySelector('#divUIOptions').style.display = "none";
    }
    else {
      document.querySelector('#divUIOptions').style.display = "";
      //change button text to hide advanced options etc...
    }  
    
};


document.querySelector('#rxFormateOptionAfterByte').onchange = function() {
  
  //Set the Radio Button as selected
  document.querySelector('#rxFormateOptionAfterByteRB').checked = true;
  document.querySelector('#rxFormateOptionSelected').checked = true;

};

document.querySelector('#rxFormateOptionBeforeByte').onchange = function() {
  
  //Set the Radio Button as selected
  document.querySelector('#rxFormateOptionBeforeByteRB').checked = true;
  document.querySelector('#rxFormateOptionSelected').checked = true;

};

document.querySelector('#rxFormateOptionAfterTime').onchange = function() {
  
  //Set the Radio Button as selected
  document.querySelector('#rxFormateOptionAfterTimeRB').checked = true;
  document.querySelector('#rxFormateOptionSelected').checked = true;

};

document.querySelector('#rxFormateOptionAfterBytes').onchange = function() {
  
  //Set the Radio Button as selected
  document.querySelector('#rxFormateOptionAfterBytesRB').checked = true;
  document.querySelector('#rxFormateOptionSelected').checked = true;

};


document.querySelector('#DateTimeStampList').onchange = function() {
  
  document.querySelector('#rxFormateOptionExampleTimeStamp').style.display = "";
  document.querySelector('#rxFormateOptionExampleTimeStamp').style.color = "blue";
  document.querySelector('#rxFormateOptionExampleTimeStamp').innerHTML = getRXRowIdentifier();
  
};

