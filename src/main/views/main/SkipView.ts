import { ui } from "../../../ui/layaMaxUI";
import GM from "../../GM";
import Session from "../../sessions/Session";

export default class SkipView extends ui.tishi2UI {
    constructor() { 
        super(); 
        GM.imgEffect.addEffect(this.cha);

        this.cha.on(Laya.Event.CLICK,this,this.onClose);
        this.nextAdBtn.clickHandler = new Laya.Handler(this,this.onNext);
    }

    private onClose():void
    {
        this.removeSelf();
    }

    private onNext():void
    {
        if(Session.gameData.keyNum >= 2)
        {
            Session.gameData.keyNum -= 2;
            Session.onSave();
            this.onClose();
        }
    }
}