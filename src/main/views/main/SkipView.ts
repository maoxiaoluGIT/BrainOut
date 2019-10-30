import { ui } from "../../../ui/layaMaxUI";
import GM from "../../GM";
import Session from "../../sessions/Session";
import KeyIcon from "./KeyIcon";
import Game from "../../../core/Game";
import GameEvent from "../../GameEvent";
import AdType from "./AdType";
import { DataKey } from "../../sessions/DataKey";

export default class SkipView extends ui.tishi2UI {
    constructor() { 
        super(); 
        GM.imgEffect.addEffect(this.cha);

        this.cha.on(Laya.Event.CLICK,this,this.onClose);
        this.nextBtn.clickHandler = new Laya.Handler(this,this.onNext)
        this.nextAdBtn.clickHandler = new Laya.Handler(this,this.playAd);

        this.on(Laya.Event.DISPLAY,this,this.onDis);
        Game.eventManager.on(GameEvent.UPDATE_DATA,this,this.onDis);
    }

    private onDis():void
    {
        this.nextBtn.visible = Session.gameData[DataKey.keyNum] >= 2;
        this.nextAdBtn.visible = !this.nextBtn.visible;

        this.cha.alpha = 0;
        setTimeout(() => {
            Laya.Tween.to(this.cha,{alpha:1},500);
        }, 600);
    }

    private onClose():void
    {
        this.removeSelf();
    }

    private onNext():void
    {
        if(Session.gameData[DataKey.keyNum] >= 2)
        {
            Session.gameData[DataKey.keyNum] -= 2;
            Session.onSave();
            this.onClose();
            KeyIcon.fly("-2");
            Game.eventManager.event(GameEvent.ON_NEXT);
        }
    }

    private playAd():void
    {
        GM.platform.playAd("",AdType.skip);
    }
}