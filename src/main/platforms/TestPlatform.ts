import { BasePlatform } from "./BasePlatform";
import CookieKey from "../gameCookie/CookieKey";

export default class TestPlatform extends BasePlatform{
    checkUpdate():void
    {

    }

    login(callback):void
    {
        // callback && callback("" + Date.now());
        callback && callback("shfdsaomghjgai123fdafda456");
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

    onShare(callback):void
    {
        callback && callback();
    }
}