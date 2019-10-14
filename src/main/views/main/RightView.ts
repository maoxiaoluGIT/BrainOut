import { ui } from "../../../ui/layaMaxUI";
import GM from "../../GM";
import SysTitles from "../../sys/SysTitles";
export default class RightView extends ui.shengliUI{
    
    constructor() { 
        super(); 
        this.on(Laya.Event.DISPLAY,this,this.onDis);
        GM.imgEffect.addEffect(this.paishou,2);
    }

    private onDis():void
    {
        this.paishou.y = 1334;
        Laya.Tween.to(this.paishou,{y:857},500,null,Laya.Handler.create(this,this.onEff),600)
    }

    private onEff():void
    {
        
    }

    setWin(sys:SysTitles):void
    {
        this.zi2.text = sys.stageWin;
    }


}