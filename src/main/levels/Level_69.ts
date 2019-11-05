import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";
import GM from "../GM";
import RightIcon from "./RightIcon";
import Game from "../../core/Game";
import GameEvent from "../GameEvent";
import PlatformID from "../platforms/PlatformID";

export default class Level_69 extends BaseLevel {
    private ui: ui.level69UI;

    constructor() { 
        super();
        this.on(Laya.Event.DISPLAY,this,this.onDis);
        this.on(Laya.Event.UNDISPLAY,this,this.onUndis);

        this.on(Laya.Event.CLICK,this,this.onClick);

    }

    private onClick():void
    {
        if(!this.weixin)
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
        this.ui.item0.visible = false;
        this.ui.item1.visible = true;

        this.setAnswer(this.ui.rightBox,true);
        GM.platform.shake(false);
    }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level69UI();
        this.addChild(this.ui);
        this.isInit = true;

        this.addEvent(this.ui.ji,this.onClick2);
        this.addEvent(this.ui.tu,this.onClick2);
        this.addEvent(this.ui.hu,this.onClick2);

        this.refresh();
    }

    private onClick2(sprite):void
    {
        this.setAnswer(sprite,false);
    }

    refresh():void
    {
        super.refresh();
        this.ui.item0.visible = true;
        this.ui.item1.visible = false;
        this._count = 0;
    }

    private onUndis():void
    {
        if(this.weixin)
        {
            this.weixin.stopAccelerometer();
        }
    }

    private _count = 0;

    private onDis():void
    {
        this._count = 0;
        Game.eventManager.once(GameEvent.WX_ROTATE,this,this.onRotate);
        if(this.weixin)
        {
            this.weixin.onAccelerometerChange((res)=>{
                if(res.x > 1 || res.y > 1)
                {
                    this._count++;
                    if(this._count == 3)
                    {
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