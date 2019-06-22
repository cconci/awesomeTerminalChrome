class RxMonitorRecord{
    constructor(recordDataString,recordDataBuffer){
        this.recordString = JSON.parse(JSON.stringify(recordDataString));//Object.assign({}, recordDataString);
        this.recordBuffer = JSON.parse(JSON.stringify(recordDataBuffer));//Object.assign({}, recordDataBuffer);
        this.count = 0;
        this.lastMessageTimeStamp = new Date();
        this.frequency = 0;

        //bind
        this.updateRecord = this.updateRecord.bind(this);
        this.matchRecord = this.matchRecord.bind(this);
        this.showRecord = this.showRecord.bind(this);
    }

    getRecordString(){
        return this.recordString;
    }
    getCount(){
        return this.count;
    }
    getFrequency(){
        return this.frequency;
    }
    getLastMessageTimeStamp(){
        return this.lastMessageTimeStamp;
    }
    
    updateRecord(nRecordDataString,nRecordDataBuffer){

        console.log("[updateRecord]");

        this.recordString = JSON.parse(JSON.stringify(nRecordDataString));
        this.recordBuffer = JSON.parse(JSON.stringify(nRecordDataBuffer));//Object.assign({},nRecordDataBuffer);
        
        this.count = this.count+1;

        //update frequency
        var currentTime = new Date();
        var timeDifference = currentTime.getTime() - this.lastMessageTimeStamp.getTime();

        var secondsDifference= timeDifference / 1000;

        this.frequency = secondsDifference;

        //set new time
        this.lastMessageTimeStamp = new Date();
    }

    matchRecord(recordDataBuffer,matchStartIndex,matchEndIndex){

        console.log("[matchRecord]");

        for(var i=matchStartIndex;i<matchEndIndex;i++){

            if(recordDataBuffer[i] === this.recordBuffer[i]){
                console.log("[matchRecord] "+recordDataBuffer[i]+"");
            }else{
                //No Match over match index
                console.log("[matchRecord] - no match");
                return false;
            }

        }

        //match found
        console.log("[matchRecord] - match");
        return true;

    }

    showRecord(){
        console.log("recordString:"+this.recordString+"\n");
        console.log("recordBuffer:"+this.recordBuffer+"\n");
        console.log("count:"+this.count+"\n");
        console.log("lastMessageTimeStamp:"+this.lastMessageTimeStamp+"\n");
        console.log("frequency:"+this.frequency+"\n");
    }
}