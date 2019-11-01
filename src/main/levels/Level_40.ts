import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";
import GM from "../GM";
import Game from "../../core/Game";
import GameEvent from "../GameEvent";
import PlatformID from "../platforms/PlatformID";

export default class Level_40 extends BaseLevel {
    private ui: ui.level40UI;

    constructor() { 
        super(); 
        this.on(Laya.Event.DISPLAY,this,this.onDis);
        this.on(Laya.Event.UNDISPLAY,this,this.onUndis);
    }

    private onRotate():void
    {
        if(this.weixin)
        {
            this.weixin.stopAccelerometer();
        }
        this.ui.keyImg.visible = true;
        Laya.Tween.to(this.ui.keyImg,{y:800},500);
    }


    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level40UI();
        this.addChild(this.ui);
        this.isInit = true;

        for(let i = 0; i < 4;i++)
        {
            let sp = this.ui["item" + i];
            sp.tag = [sp.x,sp.y];
            this.addEvent(sp,null,true);
        }

        this.addEvent(this.ui.keyImg,null,true);

        this.refresh();
    }

    onDown(sprite: Laya.Sprite): void  {
        sprite.startDrag();
    }


    onUp(sprite: Laya.Sprite): void  {
        if(sprite == this.ui.keyImg)
        {
            if(GM.hit(this.ui.keyImg,this.ui.kongBox))
            {
                this.ui.rightBox.pos(sprite.x,sprite.y);
                this.ui.addChild(this.ui.rightBox)
                this.setAnswer(this.ui.rightBox,true);
            }
        }
        else
        {
            this.ui.rightBox.pos(sprite.x,sprite.y);
            this.ui.addChild(this.ui.rightBox)
            this.setAnswer(this.ui.rightBox,false);
            this.gotoStartPos(sprite);
        }
    }

    private gotoStartPos(sprite):void
    {
        Laya.Tween.to(sprite,{x:sprite.tag[0],y:sprite.tag[1]},100);
    }

    refresh(): void  {
        Laya.MouseManager.enabled = true;
        super.refresh();
        this.ui.keyImg.visible = false;
        this.ui.keyImg.pos(620,1040);
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
                if(res.y > 0.9)
                {
                    Game.eventManager.event(GameEvent.WX_ROTATE);
                }
            });
            this.weixin.startAccelerometer({
                interval: 'normal'
              });
        }
    }
}