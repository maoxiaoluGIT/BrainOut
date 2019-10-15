import { ui } from "../../../ui/layaMaxUI";
import GM from "../../GM";
import SysTitles from "../../sys/SysTitles";
import Game from "../../../core/Game";
import GameEvent from "../../GameEvent";
export default class RightView extends ui.shengliUI{
    
    constructor() { 
        super(); 
        this.on(Laya.Event.DISPLAY,this,this.onDis);
        GM.imgEffect.addEffect(this.paishou,2);
        this.nextBtn.clickHandler = new Laya.Handler(this,this.onNext);
    }

    private onNext():void
    {
        this.removeSelf();
        Game.eventManager.event(GameEvent.ON_NEXT);
    }

    private onDis():void
    {
        Laya.MouseManager.enabled = true;
        this.paishou.y = 1334;
        Laya.Tween.to(this.paishou,{y:857},500,null,Laya.Handler.create(this,this.onEff),600)
    }

    private onEff():void
    {
        Game.soundManager.play("win.wav");
    }

    setWin(sys:SysTitles):void
    {
        this.zi2.text = sys.stageWin;
    }


}