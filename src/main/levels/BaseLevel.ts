import Game from "../../core/Game";
import GameEvent from "../GameEvent";
import SysTitles from "../sys/SysTitles";
import RightIcon from "./RightIcon";
import WrongIcon from "./WrongIcon";
import GameConfig from "../../GameConfig";

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
        RightIcon.ins.removeSelf();
        WrongIcon.ins.removeSelf();
    }

    addEvent(sprite: Laya.Sprite, func: Function,isDrag:boolean = false): void {
        func && sprite.on(Laya.Event.CLICK, this, func, [sprite]);
        if(isDrag)
        {
            sprite.on(Laya.Event.MOUSE_DOWN,this,this.onDown,[sprite]);
            sprite.on(Laya.Event.MOUSE_UP,this,this.onUp,[sprite])
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