import GM from "../GM";
import SenderHttp from "../net/SenderHttp";
import Game from "../../core/Game";
import GameEvent from "../GameEvent";
import { DataKey } from "./DataKey";
import LogType from "../LogType";
import PlatformID from "../platforms/PlatformID";

export default class Session{
    static SKEY:string;
    static gameData:number[] = [];
    static isNew:boolean = false;

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
            Session.gameData[DataKey.musicState] = 1;
            Session.gameData[DataKey.soundState] = 1;
            Session.gameData[DataKey.shakeState] = 1;
            if(GM.platformId == PlatformID.OPPO)
            {
                Session.gameData[DataKey.bannerTimes] = 5;
                Session.gameData[DataKey.insertAdTimes] = 7;
            }
            Session.isNew = true;
            GM.sysLog(LogType.new_player);
        }
        else
        {
            Session.isNew = false;
            Session.gameData = JSON.parse(data);
            if(Date.now() > Session.gameData[DataKey.lastTime])
            {
                Session.gameData[DataKey.shareTimes] = 3;
                Session.gameData[DataKey.lastTime] = new Date().setHours(24,0,0,0);

                if(Session.gameData[DataKey.signinState] == 1)
                {
                    Session.gameData[DataKey.signinDay]++;
                    if(Session.gameData[DataKey.signinDay] > 4)
                    {
                        Session.gameData[DataKey.signinDay] = 0;
                    }
                    Session.gameData[DataKey.signinState] = 0;
                }

                if(GM.platformId == PlatformID.OPPO)
                {
                    Session.gameData[DataKey.bannerTimes] = 5;
                    Session.gameData[DataKey.insertAdTimes] = 7;
                }
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

            if(Session.gameData[DataKey.lastIndex] == null)
            {
                Session.gameData[DataKey.lastIndex] = 1;
            }

            if(Session.gameData[DataKey.musicState] == null)
            {
                Session.gameData[DataKey.musicState] = 1;
            }

            if(Session.gameData[DataKey.soundState] == null)
            {
                Session.gameData[DataKey.soundState] = 1;
            }

            if(Session.gameData[DataKey.shakeState] == null)
            {
                Session.gameData[DataKey.shakeState] = 1;
            }

            if(GM.platformId == PlatformID.OPPO)
            {
                if(Session.gameData[DataKey.bannerTimes] == null)
                {
                    Session.gameData[DataKey.bannerTimes] = 5;
                }
                if(Session.gameData[DataKey.insertAdTimes] == null)
                {
                    Session.gameData[DataKey.insertAdTimes] = 7;
                }
            }

            if(!GM.fromOtherGame)
            {
                if(Session.gameData[DataKey.maxIndex] > 40)
                {
                    Session.gameData[DataKey.maxIndex] = 40;
                }
                if(Session.gameData[DataKey.lastIndex] > 40)
                {
                    Session.gameData[DataKey.lastIndex] = 40;
                }
            }
            // Session.gameData[DataKey.maxIndex] = Session.gameData[DataKey.lastIndex] = 79;
            // Session.gameData[DataKey.bannerTimes] = 5;
            // Session.gameData[DataKey.insertAdTimes] = 7;
        }
        Session.onSave();
    }

    static onSave():void
    {
        SenderHttp.create().send();
        Game.eventManager.event(GameEvent.UPDATE_DATA);
    }
}