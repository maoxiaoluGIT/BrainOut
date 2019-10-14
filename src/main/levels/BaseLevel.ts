import Game from "../../core/Game";
import GameEvent from "../GameEvent";
import SysTitles from "../sys/SysTitles";

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