import GM from "../GM";
import SenderHttp from "../net/SenderHttp";
import Game from "../../core/Game";
import GameEvent from "../GameEvent";

export default class Session{
    static SKEY:string = "ntx08";
    static gameData:any = {};

    static userData:any = {};
    constructor() {}

    static onParse(data:string):void
    {
        GM.log("player Data:" + data);
        if(data == null || data == "" || data == "0")
        {
            Session.gameData.maxIndex = 0;
            Session.gameData.keyNum = 0;
            Session.gameData.shareTimes = 3;
            Session.gameData.lastTime = new Date().setHours(24,0,0,0);
            Session.onSave();
            GM.log("new player");
        }
        else
        {
            Session.gameData = JSON.parse(data);
            if(Date.now() > Session.gameData.lastTime)
            {
                Session.gameData.shareTimes = 3;
                Session.gameData.lastTime = new Date().setHours(24,0,0,0);
            }

            if(Session.gameData.lastTime == null)
            {
                Session.gameData.lastTime = new Date().setHours(24,0,0,0);
            }

            if(Session.gameData.shareTimes == null)
            {
                Session.gameData.shareTimes = 3;
            }
        }
        
    }

    static onSave():void
    {
        SenderHttp.create().send();
        Game.eventManager.event(GameEvent.UPDATE_DATA);
    }
}