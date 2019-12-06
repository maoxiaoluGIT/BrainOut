import { ui } from "../../../ui/layaMaxUI";
import GM from "../../GM";
import { ViewID } from "../ViewID";
import Game from "../../../core/Game";
import CookieKey from "../../gameCookie/CookieKey";
import Session from "../../sessions/Session";
import { DataKey } from "../../sessions/DataKey";
import PlatformID from "../../platforms/PlatformID";
import GameBox from "../../GameBox";

export default class SettingView extends ui.shezhiUI {
    private gameBox: GameBox;
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

        if (GM.platformId == PlatformID.WX)  {
            this.gameBox = new GameBox();
            this.gameBox.fromTag = GameBox.shezhi;
        }

        this.on(Laya.Event.DISPLAY,this,this.onDis);

        this.verTxt.text = "version:" + GM.codeVer;

        this.qiuzhu.visible = GM.platformId != PlatformID.OPPO;
        this.shareTxt.visible = this.qiuzhu.visible;
    }

    addBox():void
    {
        if (GM.platformId == PlatformID.WX)  {
            this.addChild(this.gameBox);
            this.gameBox.pos(0,220);
        }
    }

    removeBox():void
    {
        this.gameBox && this.gameBox.removeSelf();
    }

    private onDis(): void  {
        console.log("按钮状态",GM.musicState,GM.soundState,GM.shakeState);
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
            GM.viewManager.closeView2(ViewID.setting);
            this.gameBox && this.gameBox.removeSelf();
            GM.hideTTBanner();
            break;
            case this.yinyue:
            if(GM.musicState == 1)
            {
                GM.musicState = 0;
                Game.soundManager.setMusicVolume(0);
                this.yinyue.skin = "pubRes/ic_muisc_no_1.png";
                
            }
            else
            {
                GM.musicState = 1;
                Game.soundManager.setMusicVolume(1);
                GM.playMusic("bg.mp3");
                this.yinyue.skin = "pubRes/ic_muisc_yes_1.png";
            }
            Session.gameData[DataKey.musicState] = GM.musicState;

            Session.onSave();
            break;
            case this.yinxiao:
            if(GM.soundState == 1)
            {
                GM.soundState = 0;
                Game.soundManager.setSoundVolume(0);
                this.yinxiao.skin = "pubRes/ic_sound_no_1.png";
            }
            else
            {
                GM.soundState = 1;
                Game.soundManager.setSoundVolume(1);
                this.yinxiao.skin = "pubRes/ic_sound_yes_1.png";
            }
            Session.gameData[DataKey.soundState] = GM.soundState;
            Session.onSave();
            break;
            case this.zhendong:
            if(GM.shakeState == 1)
            {
                GM.shakeState = 0;
                this.zhendong.skin = "pubRes/ic_shock_no_1.png";
            }
            else
            {
                GM.shakeState = 1;
                this.zhendong.skin = "pubRes/ic_shock_yes_1.png";
            }
            Session.gameData[DataKey.shakeState] = GM.shakeState;
            Session.onSave();
            break;
            case this.fankui:
            break;
            case this.meiri:
            GM.viewManager.showView2(ViewID.signin);
            break;
            case this.qiuzhu:
            GM.platform.onShare(0,true);
            break;
        }
    }
}