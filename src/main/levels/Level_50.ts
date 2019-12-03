import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";
import GM from "../GM";
import RightIcon from "./RightIcon";
import Game from "../../core/Game";
import GameEvent from "../GameEvent";
import PlatformID from "../platforms/PlatformID";

export default class Level_50 extends BaseLevel {
    private ui: ui.level50UI;

    constructor() { 
        super();
        this.on(Laya.Event.DISPLAY,this,this.onDis);
        this.on(Laya.Event.UNDISPLAY,this,this.onUndis);

        this.on(Laya.Event.CLICK,this,this.onClick);
    }

    private onClick():void
    {
        if(GM.platformId == PlatformID.TEST || GM.platformId == PlatformID.H5)
        {
            this.setAnswer(this.ui.rightBox,true);
        }
    }

    private onRotate():void
    {
        if(this.weixin)
        {
            this.weixin.stopAccelerometer();
        }
        this.setAnswer(this.ui.rightBox,true);
    }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level50UI();
        this.addChild(this.ui);
        this.isInit = true;

        this.refresh();
    }

    refresh():void
    {
        super.refresh();
    }

    private onUndis():void
    {
        if(this.weixin)
        {
            this.weixin.stopAccelerometer();
        }
    }

    private onDis():void
    {
        Game.eventManager.once(GameEvent.WX_ROTATE,this,this.onRotate);
        if(this.weixin)
        {
            this.weixin.onAccelerometerChange((res)=>{
                if (GM.platformId == PlatformID.OPPO)  {
                    if (res.y < -0.9)  {
                        Game.eventManager.event(GameEvent.WX_ROTATE);
                    }
                }
                else  {
                    if (res.y > 0.9)  {
                        Game.eventManager.event(GameEvent.WX_ROTATE);
                    }
                }
            });
            this.weixin.startAccelerometer({
                interval: 'normal'
              });
        }
    }
}