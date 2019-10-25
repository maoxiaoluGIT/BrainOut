import { ui } from "../../../ui/layaMaxUI";
import GM from "../../GM";
import { ViewID } from "../ViewID";
import Game from "../../../core/Game";
import CookieKey from "../../gameCookie/CookieKey";

export default class SettingView extends ui.shezhiUI {
    constructor() { 
        super(); 
        let arr:Laya.Image[] = [this.fanhui,this.yinyue,this.yinxiao,this.zhendong,this.fankui,this.meiri,this.qiuzhu];
        for(let i = 0; i < arr.length; i++)
        {
            this.addEvent(arr[i],this.onClick);
            GM.imgEffect.addEffect(arr[i]);
        }
        GM.imgEffect.addEffect(this.topImg,2);
        GM.imgEffect.addEffect(this.bottomImg,2);

        this.on(Laya.Event.DISPLAY,this,this.onDis);
    }

    private onDis():void
    {
        this.yinyue.skin = GM.musicState == 1 ? "pubRes/ic_muisc_yes_1.png" : "pubRes/ic_muisc_no_1.png";
        this.yinxiao.skin = GM.soundState == 1 ? "pubRes/ic_sound_yes_1.png" : "pubRes/ic_sound_no_1.png";
        this.zhendong.skin = GM.shakeState == 1 ? "pubRes/ic_shock_yes_1.png" : "pubRes/ic_shock_no_1.png";
    }

    private addEvent(sprite:Laya.Sprite,func:Function):void
    {
        func && sprite.on(Laya.Event.CLICK, this, func, [sprite]);
    }

    private onClick(sprite:Laya.Sprite):void
    {
        switch(sprite)
        {
            case this.fanhui:
            GM.viewManager.showView(ViewID.main);
            break;
            case this.yinyue:
            if(GM.musicState == 1)
            {
                GM.musicState = 0;
                GM.cookie.setCookie(CookieKey.MUSIC_SWITCH,{"state":0});
                Game.soundManager.setMusicVolume(0);
                this.yinyue.skin = "pubRes/ic_muisc_no_1.png";
            }
            else
            {
                GM.musicState = 1;
                GM.cookie.setCookie(CookieKey.MUSIC_SWITCH,{"state":1});
                Game.soundManager.setMusicVolume(1);
                GM.playMusic("bg.mp3");
                this.yinyue.skin = "pubRes/ic_muisc_yes_1.png";
            }
            break;
            case this.yinxiao:
            if(GM.soundState == 1)
            {
                GM.soundState = 0;
                GM.cookie.setCookie(CookieKey.SOUND_SWITCH,{"state":0});
                Game.soundManager.setSoundVolume(0);
                this.yinxiao.skin = "pubRes/ic_sound_no_1.png";
            }
            else
            {
                GM.soundState = 1;
                GM.cookie.setCookie(CookieKey.SOUND_SWITCH,{"state":1});
                Game.soundManager.setSoundVolume(1);
                this.yinxiao.skin = "pubRes/ic_sound_yes_1.png";
            }
            break;
            case this.zhendong:
            if(GM.shakeState == 1)
            {
                GM.shakeState = 0;
                GM.cookie.setCookie(CookieKey.SHAKE_SWITCH,{"state":0});
                this.zhendong.skin = "pubRes/ic_shock_no_1.png";
            }
            else
            {
                GM.shakeState = 1;
                GM.cookie.setCookie(CookieKey.SHAKE_SWITCH,{"state":1});
                this.zhendong.skin = "pubRes/ic_shock_yes_1.png";
            }
            break;
            case this.fankui:
            break;
            case this.meiri:
            break;
            case this.qiuzhu:
            GM.platform.onShare(0,true);
            break;
        }
    }
}