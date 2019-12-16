import { ui } from "../../../ui/layaMaxUI";
import GM from "../../GM";
import AdType from "./AdType";
import LogType from "../../LogType";
import PlatformID from "../../platforms/PlatformID";

export default class KeyNullTips extends ui.keyTipsUI {
    
    constructor() { 
        super(); 
        this.nextAdBtn.clickHandler = new Laya.Handler(this,this.onPlay);
        this.cha.on(Laya.Event.CLICK,this,this.onClose);
        this.shareBtn.on(Laya.Event.CLICK,this,this.onShare);
        GM.imgEffect.addEffect(this.cha);
        this.on(Laya.Event.DISPLAY,this,this.onDis);
        this.shareBtn.visible = GM.platformId != PlatformID.OPPO;
    }

    private onShare():void
    {
        GM.platform.onShare(0,true);
    }

    private onDis():void
    {
        this.cha.alpha = 0;
        setTimeout(() => {
            Laya.Tween.to(this.cha,{alpha:1},500);
        }, 600);
    }

    private onPlay():void
    {
        GM.platform.playAd("142901",AdType.nullKey);
        this.removeSelf();
        GM.hideTTBanner();
    }

    private onClose():void
    {
        this.removeSelf();
        GM.hideTTBanner();
    }
}