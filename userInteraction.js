/*******************************************************************************
Awesome Terminal
cconci
*******************************************************************************/

document.querySelector('#buttonInputTX').onclick = function() {
    
  //sends data out the open port
  txUserInputInit(0);//0 for manual tx (via button press)

};

document.querySelector('#termInput').oninput = function() {
  

  var numberOfLines = ((document.querySelector('#termInput').value).split('\n')).length;
    
  //extend the user input box when enter is pressed
  document.querySelector('#termInput').style.height = (numberOfLines*currentFontSize)+"px"; 

};

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

document.querySelector('#buttonTXOptions').onclick = function() {
    
  //
  if(document.querySelector('#divTXOptions').style.display === "") {
    document.querySelector('#divTXOptions').style.display = "none";
  }
  else {
    document.querySelector('#divTXOptions').style.display = "";
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

/*
RX Option Selections
*/

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

document.querySelector('#rxDateTimeStampList').onchange = function() {
  
  //show example row identifier info
  document.querySelector('#rxFormateOptionExampleTimeStamp').style.display = "";
  document.querySelector('#rxFormateOptionExampleTimeStamp').style.color = "blue";
  document.querySelector('#rxFormateOptionExampleTimeStamp').innerHTML = getRowIdentifierText(0,false);
  
};

/*
TX Option Selections
*/

document.querySelector('#txInputEveryXms').onchange = function() {
  
  //Set the Radio Button as selected
  document.querySelector('#txInputEveryXmsRB').checked = true;
  document.querySelector('#txFormateOptionSelected').checked = true;

};

document.querySelector('#txInputXtimes').onchange = function() {
  
  //Set the Radio Button as selected
  document.querySelector('#txInputXtimesRB').checked = true;
  document.querySelector('#txFormateOptionSelected').checked = true;

};

document.querySelector('#txInputXbyteRX').onchange = function() {
  
  //Set the Radio Button as selected
  document.querySelector('#txInputXbyteRXRB').checked = true;
  document.querySelector('#txFormateOptionSelected').checked = true;

};

document.querySelector('#txInputXbytesRX').onchange = function() {
  
  //Set the Radio Button as selected
  document.querySelector('#txInputXbytesRXRB').checked = true;
  document.querySelector('#txFormateOptionSelected').checked = true;

};

document.querySelector('#txDateTimeStampList').onchange = function() {
  
  //show example row identifier info
  document.querySelector('#txFormateOptionExampleTimeStamp').style.display = "";
  document.querySelector('#txFormateOptionExampleTimeStamp').style.color = "blue";
  document.querySelector('#txFormateOptionExampleTimeStamp').innerHTML = getRowIdentifierText(1,false);
  
};

document.querySelector('#buttonTXCopyToCB').onclick = function() {
  
  //need to enabel or I can not select
  document.getElementById("termTX").disabled = false; 
  
  //select the textarea & copy to clipboard
  document.getElementById("termTX").select();
  document.execCommand('copy');
  
  //return to normal
  document.getElementById("termTX").disabled = true;
};

document.querySelector('#buttonRXCopyToCB').onclick = function() {
  
  //need to enabel or I can not select
  document.getElementById("termRX").disabled = false; 
  
  //select the textarea & copy to clipboard
  document.getElementById("termRX").select();
  document.execCommand('copy');
  
  //return to normal
  document.getElementById("termRX").disabled = true;
};

document.querySelector('#buttonRestoreView').onclick = function() {
  
  //restore view options to the textarea, if they have been dragged
  
  //from my css
  document.querySelector('#termInput').style.width= "98%";
  document.querySelector('#termInput').style.margin.left = "auto";
  document.querySelector('#termInput').style.margin.right = "auto";

  document.querySelector('#termTX').style.width= "98%";
  document.querySelector('#termTX').style.margin.left = "auto";
  document.querySelector('#termTX').style.margin.right = "auto";

  document.querySelector('#termRX').style.width= "98%";
  document.querySelector('#termRX').style.margin.left = "auto";
  document.querySelector('#termRX').style.margin.right = "auto";
  
};
