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
  document.querySelector('#termRXProtocol').value = "";
    
  //filter counter
  rxFilterXNumberOfBytesCount = 0;
    
  //byte count
  rxByteCount = 0;
    
  updateStatsCounters();
};
document.querySelector('#buttonRefreshPorts').onclick = function() {
    
  //
  updatePorts();
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

//
document.querySelector('#buttonTXPacketFormattingOptions').onclick = function() {
    
  //
  if(document.querySelector('#divTXPacketFormattingOptions').style.display === "") {
    document.querySelector('#divTXPacketFormattingOptions').style.display = "none";
  }
  else {
    document.querySelector('#divTXPacketFormattingOptions').style.display = "";
    //change button text to hide advanced options etc...
  }
    
};

document.querySelector('#buttonFontP').onclick = function() {
    
  //
  currentFontSize++;
  document.querySelector('#termInput').style.fontSize = currentFontSize+"px";
  document.querySelector('#termTX').style.fontSize = currentFontSize+"px";
  document.querySelector('#termRX').style.fontSize = currentFontSize+"px";
  document.querySelector('#termRXNumberLine').style.fontSize = currentFontSize+"px";
  document.querySelector('#termTXNumberLine').style.fontSize = currentFontSize+"px";
  document.querySelector('#termRXProtocol').style.fontSize = currentFontSize+"px";
   
};

document.querySelector('#buttonFontN').onclick = function() {
    
  //
  currentFontSize--;
  document.querySelector('#termInput').style.fontSize = currentFontSize+"px";
  document.querySelector('#termTX').style.fontSize = currentFontSize+"px";
  document.querySelector('#termRX').style.fontSize = currentFontSize+"px";
  document.querySelector('#termRXNumberLine').style.fontSize = currentFontSize+"px";
  document.querySelector('#termTXNumberLine').style.fontSize = currentFontSize+"px";
  document.querySelector('#termRXProtocol').style.fontSize = currentFontSize+"px";
  
};

document.querySelector('#buttonConnectToPort').onclick = function() {
    
  //
  connectToPort();
};

document.querySelector('#buttonDisconnectFromPort').onclick = function() {
    
  //
  disconnectFromPort();
  
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

document.querySelector('#buttonStatistics').onclick = function() {
  
  if(document.querySelector('#divStatistics').style.display === "") {
    document.querySelector('#divStatistics').style.display = "none";
  }
  else {
    document.querySelector('#divStatistics').style.display = "";
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

document.querySelector('#rxOutputFormatList').onchange = function() {
  
  document.querySelector('#rxFormateOptionSelected').checked = true;
  
};

document.querySelector('#rxAppendStringBefore').onchange = function() {
  
  document.querySelector('#rxFormateOptionSelected').checked = true;
  
};

document.querySelector('#rxAppendStringAfter').onchange = function() {
  
  document.querySelector('#rxFormateOptionSelected').checked = true;
  
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
  
  document.querySelector('#termRXProtocol').style.width= "98%";
  document.querySelector('#termRXProtocol').style.margin.left = "auto";
  document.querySelector('#termRXProtocol').style.margin.right = "auto";
  
};

document.querySelector('#newInstance').onclick = function() {
  
  var windowInstanceUniqueID = (new Date().getTime());
  
  chrome.app.window.create(
  'index.html',
  {
    id: 'mainWindow_'+windowInstanceUniqueID+"",
    bounds: {width: 680, height: 800}
  }
  ); 
  
};

document.querySelector('#windowNickName').onchange = function() {

  var nickName = document.querySelector('#windowNickName').value;

  document.querySelector('#pageTitle').innerHTML = "Awesome Terminal Chrome V"+chrome.runtime.getManifest().version+" ["+nickName+"]";
  document.querySelector('#heading').innerHTML = "Awesome Terminal V"+chrome.runtime.getManifest().version +" ["+nickName+"]";
  
};
/*
UI Show/Hide
*/
// - 
document.querySelector('#buttonUserInputHide').onclick = function() {
    
  if(document.querySelector('#divUserInputSection').style.display === "") {
    document.querySelector('#divUserInputSection').style.display = "none";
    document.querySelector('#divUserInputSectionHide').style.display = "";
  }
  else {
    document.querySelector('#divUserInputSection').style.display = "";
    document.querySelector('#divUserInputSectionHide').style.display = "none";
  }  
};

// - 
document.querySelector('#buttonTXHide').onclick = function() {
    
  if(document.querySelector('#divTXSection').style.display === "") {
    document.querySelector('#divTXSection').style.display = "none";
    document.querySelector('#divTXSectionHide').style.display = "";
  }
  else {
    document.querySelector('#divTXSection').style.display = "";
    document.querySelector('#divTXSectionHide').style.display = "none";
  }  
};
// - 
document.querySelector('#buttonRXHide').onclick = function() {
    
  if(document.querySelector('#divRXSection').style.display === "") {
    document.querySelector('#divRXSection').style.display = "none";
  }
  else {
    document.querySelector('#divRXSection').style.display = "";
  }  
};
//
document.querySelector('#buttonHeaderHide').onclick = function() {
    
  if(document.querySelector('#divHeaderSection').style.display === "") {
    document.querySelector('#divHeaderSection').style.display = "none";
    document.querySelector('#divHeaderSectionHide').style.display = "";
  }
  else {
    document.querySelector('#divHeaderSection').style.display = "";
    document.querySelector('#divHeaderSectionHide').style.display = "none";
  }  
};

//
document.querySelector('#showNumberLines').onclick = function() {
    
  if(document.querySelector('#termTXNumberLineHide').style.display === "") {
    document.querySelector('#termTXNumberLineHide').style.display = "none";
    document.querySelector('#termRXNumberLineHide').style.display = "none";
  }
  else {
    document.querySelector('#termTXNumberLineHide').style.display = "";
    document.querySelector('#termRXNumberLineHide').style.display = "";
  }
  
};

//
document.querySelector('#numberLineStartVal').onchange = function() {

  initNumberLines();
  
};

document.querySelector('#numberLineStartPaddingVal').onchange = function() {

  initNumberLines();
  
};
document.querySelector('#numberLinePaddingVal').onchange = function() {

  initNumberLines();
  
};

document.querySelector('#handleRXErrors').onchange = function() {

   if(document.querySelector('#handleRXErrors').checked === true) {
    addOnReciveListener();
  }
  else {
    removeOnReciveListener();
  }

};

document.querySelector('#txPacketFormatChecksumOrCRCList').onchange = function() {
  
  //show example row identifier info
  //document.querySelector('#rxFormateOptionExampleTimeStamp').style.display = "";
  //document.querySelector('#rxFormateOptionExampleTimeStamp').style.color = "blue";
  //document.querySelector('#rxFormateOptionExampleTimeStamp').innerHTML = getRowIdentifierText(0,false);

};

document.querySelector('#txPacketFormatProtocolList').onchange = function() {
  
  //show RX proto break down
  //<div id="divRXprotocolSection" style="display: none;">

  var selectedOption = document.querySelector('#txPacketFormatProtocolList').value;

  switch(selectedOption)
  {
    case "None":
      //Hide
      document.querySelector('#divRXprotocolSection').style.display = "none";
      break;
    default:
      //Show
      document.querySelector('#divRXprotocolSection').style.display = "";
      document.querySelector('#rxFormateOptionSelected').checked = true;
      break;
  }

};

