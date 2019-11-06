import { BasePlatform } from "./BasePlatform";
import CookieKey from "../gameCookie/CookieKey";
import Session from "../sessions/Session";
import Game from "../../core/Game";
import GameEvent from "../GameEvent";
import { DataKey } from "../sessions/DataKey";

export default class TestPlatform extends BasePlatform{
    checkUpdate():void
    {

    }

    login(callback):void
    {
        // callback && callback("" + Date.now());
        callback && callback(Session.SKEY);
    }

    private cb;
    getUserInfo(callback):void
    {
        this.cb = callback;
        // callback && callback();
        // let uu:HomeLoading = <any>Laya.stage.getChildByName("HomeLoading");
        // uu.on( Laya.Event.CLICK ,this,this.clickFun);
    }

    clickFun( e:Laya.Event ):void{
        // if(e.target instanceof HomeLoading)
        // {
        //     let uu:HomeLoading = <any>Laya.stage.getChildByName("HomeLoading");
        //     LoginHttp.FRONT = "test" + uu.idTxt.text;
        //     Game.cookie.setCookie(CookieKey.USER_ID, { "userId": uu.idTxt.text });
        //     this.cb && this.cb();
        // }
    }

    onShare(type,isMain):void
    {
        if(Session.gameData[DataKey.shareTimes] > 0)
        {
            Session.gameData[DataKey.shareTimes]--;
        }
        Game.eventManager.event(GameEvent.SHARE_SUCCESS,type);
    }

    shake(isRight:boolean):void
    {
    }

    playAd(codeId:string,type:number):void
    {
        this.onShare(type,false);
    }

    showBanner():void{

    }
}