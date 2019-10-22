import GM from "../GM";
import SenderHttp from "../net/SenderHttp";

export default class Session{
    static SKEY:string = "ntx04";
    static gameData:any = {};

    static userData:any = {};
    constructor() {}

    static onParse(data:string):void
    {
        GM.log("player Data:" + data);
        if(data == null || data == "" || data == "0")
        {
            Session.gameData.maxIndex = 0;
            Session.gameData.keyNum = 5;
            Session.onSave();
            GM.log("new player");
        }
        else
        {
            Session.gameData = JSON.parse(data);
        }
    }

    static onSave():void
    {
        SenderHttp.create().send();
    }
}