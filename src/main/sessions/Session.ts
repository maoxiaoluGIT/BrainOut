import GM from "../GM";
import SenderHttp from "../net/SenderHttp";
import Game from "../../core/Game";
import GameEvent from "../GameEvent";
import { DataKey } from "./DataKey";
import LogType from "../LogType";

export default class Session{
    static SKEY:string = "Session01";
    static gameData:number[] = [];

    static userData:any = {};
    constructor() {}

    static onParse(data:string):void
    {
        GM.log("player Data:" + data);
        if(data == null || data == "" || data == "0")
        {
            Session.gameData[DataKey.maxIndex] = 0;
            Session.gameData[DataKey.keyNum] = 0;
            Session.gameData[DataKey.shareTimes] = 3;
            Session.gameData[DataKey.lastTime] = new Date().setHours(24,0,0,0);
            Session.gameData[DataKey.signinDay] = 0;//该签哪一天
            Session.gameData[DataKey.signinState] = 0;//是否签过
            Session.gameData[DataKey.lastIndex] = 1;
            GM.sysLog(LogType.new_player);
        }
        else
        {
            Session.gameData = JSON.parse(data);
            if(Date.now() > Session.gameData[DataKey.lastTime])
            {
                Session.gameData[DataKey.shareTimes] = 3;
                Session.gameData[DataKey.lastTime] = new Date().setHours(24,0,0,0);
            }

            if(Session.gameData[DataKey.lastTime] == null)
            {
                Session.gameData[DataKey.lastTime] = new Date().setHours(24,0,0,0);
            }
            if(Session.gameData[DataKey.shareTimes] == null)
            {
                Session.gameData[DataKey.shareTimes] = 3;
            }
            if(Session.gameData[DataKey.signinDay] == null)
            {
                Session.gameData[DataKey.signinDay] = 0;
            }
            if(Session.gameData[DataKey.signinState] == null)
            {
                Session.gameData[DataKey.signinState] = 0;
            }

            if(Date.now() > Session.gameData[DataKey.lastTime])
            {
                if(Session.gameData[DataKey.signinState] == 1)
                {
                    Session.gameData[DataKey.signinDay]++;
                    if(Session.gameData[DataKey.signinDay] > 4)
                    {
                        Session.gameData[DataKey.signinDay] = 0;
                    }
                    Session.gameData[DataKey.signinState] = 0;
                }
            }

            if(Session.gameData[DataKey.lastIndex] == null)
            {
                Session.gameData[DataKey.lastIndex] = 1;
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