import Game from "../../core/Game";
import GameEvent from "../GameEvent";
import SysTitles from "../sys/SysTitles";
import RightIcon from "./RightIcon";
import WrongIcon from "./WrongIcon";

export default class BaseLevel extends Laya.Box{
    isInit:boolean;
    sys:SysTitles;
    constructor(){
        super();
    }

    onInit():void
    {
    }

    refresh():void
    {
        
    }

    addEvent(sprite: Laya.Sprite, func: Function): void {
        sprite.on(Laya.Event.CLICK, this, func, [sprite]);
    }

    setAnswer(sprite:Laya.Sprite,isRight:boolean):void
    {
        if(isRight)
        {
            RightIcon.ins.add(sprite);
            Laya.MouseManager.enabled = false;
            Laya.timer.once(500, this, this.onRight);
        }
        else
        {
            WrongIcon.ins.add(sprite);
        }
    }

    onRight():void
    {
        Game.eventManager.event(GameEvent.SHOW_RIGHT,this.sys);
    }

    onShow(level:number,parentBox:Laya.Sprite):void
    {
        this.sys = Game.tableManager.getDataByNameAndId(SysTitles.NAME,level);
        parentBox && parentBox.addChild(this);
        Laya.loader.load("res/atlas/guanqia/" + level + ".atlas",Laya.Handler.create(this,this.onInit));
    }
}