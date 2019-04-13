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

document.querySelector('#buttonRXProtoClear').onclick = function() {
    
  //Clears the textbox
  document.querySelector('#termRXProtocol').value = "";
  
  rxPacketPacketCount = 0;
  
  updateStatsCounters();
}

document.querySelector('#buttonRXFilterClear').onclick = function() {
    
  //Clears the textbox
  document.querySelector('#termRXFilter').value = "";
  
  rxPacketFilterCount = 0;
  
  updateStatsCounters();
}

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

document.querySelector('#buttonUserInputOptions').onclick = function() {
    
  //
  if(document.querySelector('#divUserInputOptions').style.display === "") {
    document.querySelector('#divUserInputOptions').style.display = "none";
  }
  else {
    document.querySelector('#divUserInputOptions').style.display = "";
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
  
  updateAllTerminalFontSettings();
   
};

document.querySelector('#buttonFontN').onclick = function() {
    
  //
  currentFontSize--;
  
  updateAllTerminalFontSettings();
    
  
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
  ui_update_rxFormateOptionSelected();

};

document.querySelector('#rxFormateOptionBeforeByte').onchange = function() {
  
  //Set the Radio Button as selected
  document.querySelector('#rxFormateOptionBeforeByteRB').checked = true;
  document.querySelector('#rxFormateOptionSelected').checked = true;
  ui_update_rxFormateOptionSelected();

};

document.querySelector('#rxFormateOptionAfterTime').onchange = function() {
  
  //Set the Radio Button as selected
  document.querySelector('#rxFormateOptionAfterTimeRB').checked = true;
  document.querySelector('#rxFormateOptionSelected').checked = true;
  ui_update_rxFormateOptionSelected();

};

document.querySelector('#rxFormateOptionAfterBytes').onchange = function() {
  
  //Set the Radio Button as selected
  document.querySelector('#rxFormateOptionAfterBytesRB').checked = true;
  document.querySelector('#rxFormateOptionSelected').checked = true;
  ui_update_rxFormateOptionSelected();

};

document.querySelector('#rxDateTimeStampList').onchange = function() {
  
  //show example row identifier info
  document.querySelector('#rxFormateOptionExampleTimeStamp').style.display = "";
  document.querySelector('#rxFormateOptionExampleTimeStamp').style.color = "blue";
  document.querySelector('#rxFormateOptionExampleTimeStamp').innerHTML = getRowIdentifierText(0,false);
  
};

document.querySelector('#rxOutputFormatList').onchange = function() {
  
  document.querySelector('#rxFormateOptionSelected').checked = true;
  ui_update_rxFormateOptionSelected();
  
};

document.querySelector('#rxAppendStringBefore').onchange = function() {
  
  document.querySelector('#rxFormateOptionSelected').checked = true;
  ui_update_rxFormateOptionSelected();
};

document.querySelector('#rxAppendStringAfter').onchange = function() {
  
  document.querySelector('#rxFormateOptionSelected').checked = true;
  ui_update_rxFormateOptionSelected();
  
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

document.querySelector('#buttonRXProtoCopyToCB').onclick = function() {
  
  //need to enabel or I can not select
  document.getElementById("termRXProtocol").disabled = false; 
  
  //select the textarea & copy to clipboard
  document.getElementById("termRXProtocol").select();
  document.execCommand('copy');
  
  //return to normal
  document.getElementById("termRXProtocol").disabled = true;
};

document.querySelector('#buttonRXFilterCopyToCB').onclick = function() {
  
  //need to enabel or I can not select
  document.getElementById("termRXFilter").disabled = false; 
  
  //select the textarea & copy to clipboard
  document.getElementById("termRXFilter").select();
  document.execCommand('copy');
  
  //return to normal
  document.getElementById("termRXFilter").disabled = true;
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
  
  document.querySelector('#termRXFilter').style.width= "98%";
  document.querySelector('#termRXFilter').style.margin.left = "auto";
  document.querySelector('#termRXFilter').style.margin.right = "auto";
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
    document.getElementById('buttonUserInputHide').innerHTML = "show";
  }
  else {
    document.querySelector('#divUserInputSection').style.display = "";
    document.querySelector('#divUserInputSectionHide').style.display = "none";
    document.getElementById('buttonUserInputHide').innerHTML = "hide";
  }  
};

// - 
document.querySelector('#buttonTXHide').onclick = function() {
    
  if(document.querySelector('#divTXSection').style.display === "") {
    document.querySelector('#divTXSection').style.display = "none";
    document.querySelector('#divTXSectionHide').style.display = "";
    document.getElementById('buttonTXHide').innerHTML = "show";
  }
  else {
    document.querySelector('#divTXSection').style.display = "";
    document.querySelector('#divTXSectionHide').style.display = "none";
    document.getElementById('buttonTXHide').innerHTML = "hide";
  }  
};
// - 
document.querySelector('#buttonRXHide').onclick = function() {
    
  if(document.querySelector('#divRXSection').style.display === "") {
    document.querySelector('#divRXSection').style.display = "none";
    document.getElementById('buttonRXHide').innerHTML = "show";
  }
  else {
    document.querySelector('#divRXSection').style.display = "";
    document.getElementById('buttonRXHide').innerHTML = "hide";
  }  
};
//
document.querySelector('#buttonHeaderHide').onclick = function() {
    
  if(document.querySelector('#divHeaderSection').style.display === "") {
    document.querySelector('#divHeaderSection').style.display = "none";
    document.querySelector('#divHeaderSectionHide').style.display = "";
    document.getElementById('buttonHeaderHide').innerHTML = "show";
  }
  else {
    document.querySelector('#divHeaderSection').style.display = "";
    document.querySelector('#divHeaderSectionHide').style.display = "none";
    document.getElementById('buttonHeaderHide').innerHTML = "hide";
  }  
};

//
document.querySelector('#showNumberLines').onclick = function() {
    
  if(document.querySelector('#termTXNumberLineHide').style.display === "") {
    document.querySelector('#termTXNumberLineHide').style.display = "none";
    document.querySelector('#termRXNumberLineHide').style.display = "none";
      
    document.querySelector('#termRXProtocolNumberLineHide').style.display = "none";
    document.querySelector('#termRXFilterNumberLineHide').style.display = "none";
  }
  else {
    document.querySelector('#termTXNumberLineHide').style.display = "";
    document.querySelector('#termRXNumberLineHide').style.display = "";
    
    document.querySelector('#termRXProtocolNumberLineHide').style.display = "";
    document.querySelector('#termRXFilterNumberLineHide').style.display = "";
  }
  
};

document.querySelector('#logToFile').onclick = function() {

  //Select the DIR for logging to file, this also starts the logging feature
  chrome.fileSystem.chooseEntry({type: "openDirectory"}, chromeFileSystemChooseEntryCallBack);

}

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
      ui_update_rxFormateOptionSelected();
      break;
  }

};

document.querySelector('#rxFormateOptionSelected').onchange = function() {

  ui_update_rxFormateOptionSelected();
};

document.querySelector('#rxFilterOptionSelected').onchange = function() {
  ui_update_rxFilterOptionSelected();
};

document.querySelector('#divRXOptionsFilterByteNumber').onchange = function() {
    
    document.querySelector('#rxFilterOptionSelected').checked = true;
    ui_update_rxFilterOptionSelected();
}

document.querySelector('#divRXOptionsFilterByteValue').onchange = function() {
    
    document.querySelector('#rxFilterOptionSelected').checked = true;
    ui_update_rxFilterOptionSelected();
}

/*************************************************************************************************

*************************************************************************************************/
function ui_update_rxFormateOptionSelected(){
  if(document.querySelector('#rxFormateOptionSelected').checked === true) {
    document.querySelector('#divRXOptionsFilter').style.display = "";
    
  }
  else {
    document.querySelector('#divRXOptionsFilter').style.display = "none";
    
  }  
}

function ui_update_rxFilterOptionSelected(){
  if(document.querySelector('#rxFilterOptionSelected').checked === true) {
    
    document.querySelector('#divRXFilterSection').style.display = "";
  }
  else {
    
    document.querySelector('#divRXFilterSection').style.display = "none";
  }  
}

/*************************************************************************************************
Colour Items
*************************************************************************************************/

document.querySelector('#colourMainText').onchange = function() {

  var newColour = document.querySelector('#colourMainText').value;

  console.log("colourMainText - onchange():"+newColour);

  var elements = document.getElementsByTagName("h1");

  for(var i = 0; i < elements.length; i++) {
    
    elements[i].style.color = newColour;
  }

  var elements = document.getElementsByTagName("h4");

  for(var i = 0; i < elements.length; i++) {
    
    elements[i].style.color = newColour;
  }

  var elements = document.getElementsByTagName("h3");

  for(var i = 0; i < elements.length; i++) {
    
    elements[i].style.color = newColour;
  }

  var elements = document.getElementsByTagName("div");

  for(var i = 0; i < elements.length; i++) {
    
    elements[i].style.color = newColour;
  }

  var elements = document.getElementsByTagName("p");

  for(var i = 0; i < elements.length; i++) {
    
    elements[i].style.color = newColour;
  }

  var elements = document.getElementsByTagName("customeHeadings");

  for(var i = 0; i < elements.length; i++) {
    
    elements[i].style.color = newColour;
  }
};

document.querySelector('#colourMainBG').onchange = function() {

  var newColour = document.querySelector('#colourMainBG').value;

  var elements = document.getElementsByTagName("body");

  for(var i = 0; i < elements.length; i++) {
    
    elements[i].style.background = newColour;
  }


  var elements = document.getElementsByTagName("html");

  for(var i = 0; i < elements.length; i++) {
    
    elements[i].style.background = newColour;
  }

};

//colourDataWindowBG
document.querySelector('#colourDataWindowBG').onchange = function() {

  var newColour = document.querySelector('#colourDataWindowBG').value;

  var elements = document.getElementsByTagName("textarea");

  for(var i = 0; i < elements.length; i++) {
    
    elements[i].style.background = newColour;
  }

  //input

  var elements = document.getElementsByTagName("input");

  for(var i = 0; i < elements.length; i++) {
    
    elements[i].style.background = newColour;
  }

};

//colourDataWindowText
document.querySelector('#colourDataWindowText').onchange = function() {

  var newColour = document.querySelector('#colourDataWindowText').value;

  var elements = document.getElementsByTagName("textarea");

  for(var i = 0; i < elements.length; i++) {
    
    elements[i].style.color = newColour;
  }

  var elements = document.getElementsByTagName("input");

  for(var i = 0; i < elements.length; i++) {
    
    elements[i].style.color = newColour;
  }
};

//colourButtonsBG
document.querySelector('#colourButtonsBG').onchange = function() {

  var newColour = document.querySelector('#colourButtonsBG').value;

  var elements = document.getElementsByTagName("button");

  for(var i = 0; i < elements.length; i++) {
    
    elements[i].style.background = newColour;
  }


};

//colourButtonsText
document.querySelector('#colourButtonsText').onchange = function() {

  var newColour = document.querySelector('#colourButtonsText').value;

  var elements = document.getElementsByTagName("button");

  for(var i = 0; i < elements.length; i++) {
    
    elements[i].style.color = newColour;
  }

};

document.querySelector('#themesList').onchange = function() {
  

  var selectedOption = document.querySelector('#themesList').value;

  switch(selectedOption)
  {
    case "Matrix Boy":
    
      document.querySelector('#colourMainBG').value = "#000000";
      document.querySelector('#colourMainBG').onchange();

      document.querySelector('#colourMainText').value = "#41e799";
      document.querySelector('#colourMainText').onchange();
    
      document.querySelector('#colourDataWindowBG').value = "#000000";
      document.querySelector('#colourDataWindowBG').onchange();

      document.querySelector('#colourDataWindowText').value = "#41e799";
      document.querySelector('#colourDataWindowText').onchange();

      document.querySelector('#colourButtonsBG').value = "#444444";
      document.querySelector('#colourButtonsBG').onchange();

      document.querySelector('#colourButtonsText').value = "#41e799";
      document.querySelector('#colourButtonsText').onchange();

      break;
    default:

      document.querySelector('#colourMainBG').value = "#FFFFFF";
      document.querySelector('#colourMainBG').onchange();

      document.querySelector('#colourMainText').value = "#000000";
      document.querySelector('#colourMainText').onchange();
    
      document.querySelector('#colourDataWindowBG').value = "#FFFFFF";
      document.querySelector('#colourDataWindowBG').onchange();

      document.querySelector('#colourDataWindowText').value = "#000000";
      document.querySelector('#colourDataWindowText').onchange();

      document.querySelector('#colourButtonsBG').value = "#000000";
      document.querySelector('#colourButtonsBG').onchange();

      document.querySelector('#colourButtonsText').value = "#FFFFFF";
      document.querySelector('#colourButtonsText').onchange();

      /*
      //Debug display defaults
      var elements = document.getElementsByTagName("button");

      for(var i = 0; i < elements.length; i++) {
        
        
        console.log("button - colour:"+elements[i].style.color+"\n");
        console.log("button - colour bg:"+elements[i].style.background+"\n");
      }

      var elements = document.getElementsByTagName("textarea");

      for(var i = 0; i < elements.length; i++) {
        
        console.log("textarea - colour:"+elements[i].style.color+"\n");
        console.log("textarea - colour bg:"+elements[i].style.background+"\n");
      }
    
      var elements = document.getElementsByTagName("input");
    
      for(var i = 0; i < elements.length; i++) {
        
        console.log("input - colour:"+elements[i].style.color+"\n");
        console.log("input - colour bg:"+elements[i].style.background+"\n");
      }

      var elements = document.getElementsByTagName("body");

      for(var i = 0; i < elements.length; i++) {
        
        console.log("body - colour:"+elements[i].style.background+"\n");
      }
    
    
      var elements = document.getElementsByTagName("html");
    
      for(var i = 0; i < elements.length; i++) {
        
        console.log("html - colour:"+elements[i].style.background+"\n");
      }
      var elements = document.getElementsByTagName("h1");

      for(var i = 0; i < elements.length; i++) {
        
        console.log("h1 - colour:"+elements[i].style.color+"\n");
      }
    
      var elements = document.getElementsByTagName("h4");
    
      for(var i = 0; i < elements.length; i++) {
        
        console.log("h4 - colour:"+elements[i].style.color+"\n");
      }
    
      var elements = document.getElementsByTagName("h3");
    
      for(var i = 0; i < elements.length; i++) {
        
        console.log("h3 - colour:"+elements[i].style.color+"\n");
      }
    
      var elements = document.getElementsByTagName("div");
    
      for(var i = 0; i < elements.length; i++) {
        
        console.log("div - colour:"+elements[i].style.color+"\n");
      }
    
      var elements = document.getElementsByTagName("p");
    
      for(var i = 0; i < elements.length; i++) {
        
        console.log("p - colour:"+elements[i].style.color+"\n");
      }
    
      var elements = document.getElementsByTagName("customeHeadings");
    
      for(var i = 0; i < elements.length; i++) {
        
        console.log("customeHeadings - colour:"+elements[i].style.color+"\n");
      }
      */
      break;
  }

};
