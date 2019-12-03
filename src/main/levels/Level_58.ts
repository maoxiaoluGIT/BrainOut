import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";
import GM from "../GM";
import RightIcon from "./RightIcon";
import Game from "../../core/Game";
import GameEvent from "../GameEvent";
import PlatformID from "../platforms/PlatformID";

export default class Level_58 extends BaseLevel {
    private ui: ui.level58UI;

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
        if(this.ui.feng.tag)
        {
            this.ui.img.visible = true;
            Laya.Tween.to(this.ui.img,{x:465},300);
            this.setAnswer(this.ui.rightBox,true);
        }
        else
        {
            Laya.Tween.to(this.ui.feng,{x:375},300);
            this.setAnswer(this.ui.rightBox,false);
            setTimeout(() => {
                this.refresh();
            }, 600);
        }
        
    }

    refresh():void
    {
        super.refresh();
        this.ui.feng.x = 33;
        this.ui.feng.tag = false;
        this.ui.img.x = 65;
        this.ui.img.visible = false;

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

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level58UI();
        this.addChild(this.ui);
        this.isInit = true;

        this.addEvent(this.ui.feng,null,true);

        this.refresh();
    }

    onDown(sprite):void
    {
        sprite.tag = true;
    }
    

    onUp(sprite):void
    {
        sprite.tag = true;
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