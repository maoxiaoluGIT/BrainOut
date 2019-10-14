import { ui } from "../../../ui/layaMaxUI";
import SysTitles from "../../sys/SysTitles";
import GM from "../../GM";

export default class TipsView extends ui.tishiUI{
    constructor() { 
        super(); 
        GM.imgEffect.addEffect(this.cha);

        this.cha.on(Laya.Event.CLICK,this,this.onClose);
    }

    private onClose():void
    {
        this.removeSelf();
    }

    setTips(sys:SysTitles):void
    {
        this.zi2.text = sys.stageTips;
    }
}