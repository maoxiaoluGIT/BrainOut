import GM from "../GM";
import SenderHttp from "../net/SenderHttp";
import Game from "../../core/Game";
import GameEvent from "../GameEvent";

export default class Session{
    static SKEY:string = "ntxntxntx";
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
            Session.gameData.signinDay = 0;//该签哪一天
            Session.gameData.signinState = 0;//是否签过
            Session.gameData.lastIndex = 1;
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
            if(Session.gameData.signinDay == null)
            {
                Session.gameData.signinDay = 0;
            }
            if(Session.gameData.signinState == null)
            {
                Session.gameData.signinState = 0;
            }

            if(Date.now() > Session.gameData.lastTime)
            {
                if(Session.gameData.signinState == 1)
                {
                    Session.gameData.signinDay++;
                    if(Session.gameData.signinDay > 4)
                    {
                        Session.gameData.signinDay = 0;
                    }
                    Session.gameData.signinState = 0;
                }
            }

            if(Session.gameData.lastIndex == null)
            {
                Session.gameData.lastIndex = 1;
            }
        }
        Session.onSave();
    }

    static onSave():void
    {
        SenderHttp.create().send();
        Game.eventManager.event(GameEvent.UPDATE_DATA);
    }
}