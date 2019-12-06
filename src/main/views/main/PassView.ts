import { ui } from "../../../ui/layaMaxUI";
import GM from "../../GM";
import SysTitles from "../../sys/SysTitles";
import Game from "../../../core/Game";
import GameEvent from "../../GameEvent";
export default class PassView extends ui.passGameUI{
    
    constructor() { 
        super(); 
        this.on(Laya.Event.DISPLAY,this,this.onDis);
        GM.imgEffect.addEffect(this.paishou,2);
        this.nextBtn.clickHandler = new Laya.Handler(this,this.goHome);
    }

    private goHome():void
    {
        this.removeSelf();
        Game.eventManager.event(GameEvent.ON_FIRST);
    }

    private onDis():void
    {
        this.paishou.y = 1334;
        Laya.Tween.to(this.paishou,{y:857},500,null,Laya.Handler.create(this,this.onEff),600)
        GM.hideTTBanner();
    }

    private onEff():void
    {
        Laya.MouseManager.enabled = true;
        GM.playSound("win.mp3");
        let max:number = 1500;
        Laya.timer.loop(1,this,()=>{
            max--;
            Laya.SoundManager.setSoundVolume(max/1500);
        });
    }

    setWin(sys:SysTitles):void
    {
        this.zi2.text = sys.stageWin;
        if(this.zi2.lines.length > 1)
        {
            this.zi2.align = "left";
        }
        else
        {
            this.zi2.align = "center";
        }
    }


}