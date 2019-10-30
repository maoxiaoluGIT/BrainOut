import { ui } from "../../../ui/layaMaxUI";
import SysTitles from "../../sys/SysTitles";
import GM from "../../GM";

export default class TipsView42 extends ui.tishi42UI{
    constructor() { 
        super(); 
        GM.imgEffect.addEffect(this.cha);

        this.cha.on(Laya.Event.CLICK,this,this.onClose);
        this.on(Laya.Event.DISPLAY,this,this.onDis);
    }

    private onDis():void
    {
        this.cha.alpha = 0;
        setTimeout(() => {
            Laya.Tween.to(this.cha,{alpha:1},500);
        }, 600);
    }

    private onClose():void
    {
        this.removeSelf();
    }

    setTips(sys:SysTitles):void
    {
    }
}