import { ui } from "../../../ui/layaMaxUI";
import GM from "../../GM";
import AdType from "./AdType";

export default class KeyNullTips extends ui.keyTipsUI {
    
    constructor() { 
        super(); 
        this.nextAdBtn.clickHandler = new Laya.Handler(this,this.onPlay);
        this.cha.on(Laya.Event.CLICK,this,this.onClose);
        GM.imgEffect.addEffect(this.cha);
    }

    private onPlay():void
    {
        GM.platform.playAd("",AdType.nullKey);
        this.removeSelf();
    }

    private onClose():void
    {
        this.removeSelf();
    }
}