import { ui } from "../../../ui/layaMaxUI";
import GM from "../../GM";
import SysTitles from "../../sys/SysTitles";
import Game from "../../../core/Game";
import GameEvent from "../../GameEvent";
import { ViewID } from "../ViewID";

export default class MainFace extends ui.mainuiUI {
    constructor() { 
        super(); 
        this.shezhi.on(Laya.Event.CLICK,this,this.onClick,[1]);
        this.xuanguan.on(Laya.Event.CLICK,this,this.onClick,[2]);
        this.shuaxin.on(Laya.Event.CLICK,this,this.onClick,[3]);
        this.kuaijin.on(Laya.Event.CLICK,this,this.onClick,[4]);

        GM.imgEffect.addEffect(this.shezhi);
        GM.imgEffect.addEffect(this.xuanguan);
        GM.imgEffect.addEffect(this.shuaxin);
        GM.imgEffect.addEffect(this.kuaijin);
        GM.imgEffect.addEffect(this.jinyaoshi);

        this.jinyaoshi.on(Laya.Event.CLICK,this,this.onTips);

        this.mouseThrough = true;
    }

    private onTips():void
    {
        Game.eventManager.event(GameEvent.SHOW_TIPS);
    }

    setTitle(sys:SysTitles):void
    {
        this.titleTxt.text = sys.stageQuestion;
        this.dengjishuzi.value = "" + sys.id;
    }

    private onClick(type:number):void
    {
        if(type == 1)
        {
            GM.viewManager.showView(ViewID.setting);//满意
        }
        else if(type == 2)
        {
            GM.viewManager.showView(ViewID.cells);//选关
        }
        else if(type == 3)
        {
            Game.eventManager.event(GameEvent.ON_REFRESH);//刷新
        }
        else if(type == 4)
        {
            //快进
        }
    }
}