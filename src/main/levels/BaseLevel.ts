import Game from "../../core/Game";
import GameEvent from "../GameEvent";
import SysTitles from "../sys/SysTitles";
import RightIcon from "./RightIcon";
import WrongIcon from "./WrongIcon";
import GameConfig from "../../GameConfig";
import GM from "../GM";
import PlatformID from "../platforms/PlatformID";

export default class BaseLevel extends Laya.Box{
    isInit:boolean;
    sys:SysTitles;
    curLevel:number;
    weixin;

    wrongCount:number;

    static noRes:number[] = [22,41,44,64];
    constructor(){
        super();
        if(GM.platformId == PlatformID.WX)
        {
            this.weixin = Laya.Browser.window.wx;
        }
        else if(GM.platformId == PlatformID.TT)
        {
            this.weixin = Laya.Browser.window.tt;
        }
        else if(GM.platformId == PlatformID.QQ)
        {
            this.weixin = Laya.Browser.window.qq;
        }
        else if(GM.platformId == PlatformID.OPPO)
        {
            this.weixin = Laya.Browser.window.qg;
        }

        this.wrongCount = 0;
    }

    onInit():void
    {
    }

    refresh():void
    {
        RightIcon.ins.removeSelf();
        WrongIcon.ins.removeSelf();
    }

    addEvent(sprite: Laya.Sprite, func: Function,isDrag:boolean = false): void {
        func && sprite.on(Laya.Event.CLICK, this, func, [sprite]);
        if(isDrag)
        {
            sprite.on(Laya.Event.MOUSE_DOWN,this,this.onDown,[sprite]);
            sprite.on(Laya.Event.MOUSE_UP,this,this.onUp,[sprite]);
        }
    }

    onDown(sprite: Laya.Sprite):void
    {
        sprite.startDrag();
    }
    

    onUp(sprite: Laya.Sprite):void
    {
        sprite.stopDrag();
    }

    setAnswer(sprite:Laya.Sprite,isRight:boolean):void
    {
        RightIcon.ins.removeSelf();
        WrongIcon.ins.removeSelf();
        Laya.MouseManager.enabled = false;
        if(isRight)
        {
            RightIcon.ins.add(sprite);
            Laya.timer.once(800, this, this.onRight);
        }
        else
        {
            WrongIcon.ins.add(sprite);
            setTimeout(() => {
                Laya.MouseManager.enabled = true;
            }, 1300);
            this.wrongCount++;
            if(this.wrongCount == 3)
            {
                Game.eventManager.event(GameEvent.SHOW_HAND);
            }
        }
    }

    onRight():void
    {
        Game.eventManager.event(GameEvent.SHOW_RIGHT,this.sys);
    }

    onShow(level:number,parentBox:Laya.Sprite):void
    {
        this.curLevel = level;
        this.sys = SysTitles.allData[this.curLevel];
        parentBox && parentBox.addChild(this);
        if(BaseLevel.noRes.indexOf(level) == -1)
        {
            Laya.loader.load("atlas/guanqia/" + level + ".atlas",Laya.Handler.create(this,this.onInit));
        }
        else
        {
            this.onInit();
        }
    }

    onClear():void
    {
        if(this.curLevel > 0)
        {
            if(BaseLevel.noRes.indexOf(this.curLevel) != -1)
            {
                Laya.loader.clearRes("atlas/guanqia/" + this.curLevel + ".atlas");
                Laya.loader.clearTextureRes("atlas/guanqia/" + this.curLevel + ".atlas");
            }
        }
    }
}