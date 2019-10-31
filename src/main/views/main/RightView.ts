import { ui } from "../../../ui/layaMaxUI";
import GM from "../../GM";
import SysTitles from "../../sys/SysTitles";
import Game from "../../../core/Game";
import GameEvent from "../../GameEvent";
import AdType from "./AdType";
import LogType from "../../LogType";
export default class RightView extends ui.shengliUI{
    
    constructor() { 
        super(); 
        this.on(Laya.Event.DISPLAY,this,this.onDis);
        this.on(Laya.Event.UNDISPLAY,this,this.onunDis);
        this.nextBtn.clickHandler = new Laya.Handler(this,this.onNext);
        this.nextAdBtn.clickHandler = new Laya.Handler(this,this.playAd);
    }

    private playAd():void
    {
        this.removeSelf();
        GM.platform.playAd("",AdType.answerRight);
        GM.sysLog(LogType.shengli_ad_play);
    }

    private onNext():void
    {
        this.removeSelf();
        Game.eventManager.event(GameEvent.ON_NEXT);
    }

    private onDis():void
    {
        this.paishou.y = 1334;
        Laya.Tween.to(this.paishou,{y:857},500,null,new Laya.Handler(this,this.onEff),600);
        this.nextBtn.alpha = 0;
        setTimeout(() => {
            Laya.Tween.to(this.nextBtn,{alpha:1},500);
        }, 1500);
    }

    private onunDis():void
    {
        GM.imgEffect.removeEffect2(this.paishou);
    }

    private onEff():void
    {
        this.nextBtn.visible = true;
        GM.imgEffect.addEffect2(this.paishou,2);
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