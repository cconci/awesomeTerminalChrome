/*******************************************************************************
Stuff
cconci
*******************************************************************************/


function Serial (name){
  
  this.name = name;
  
  this.tVar1 = 'pass?';
  
  this.portData = 0;
  
  //list available devices
  this.updateDevices = function (self) {
    
    var onGetDevices = function(ports) {
      
      this.portData = ports;
      console.log("1 "+this.portData.length);
    };
  
    console.log("2 "+this.portData.length);
  
    chrome.serial.getDevices(onGetDevices);
  };
  
  this.showDevices = function (self) {
    
    //update the devices
    this.updateDevices();
    
    for(var i=0;i<this.portData.length;i++){
      console.log(this.portData[i].path);
    }
      
  };
  
}