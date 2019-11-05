import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";
import GM from "../GM";
import RightIcon from "./RightIcon";
import Game from "../../core/Game";
import GameEvent from "../GameEvent";

export default class Level_68 extends BaseLevel {
    private ui: ui.level68UI;

    constructor() { 
        super(); 
    }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level68UI();
        this.addChild(this.ui);
        this.isInit = true;

        this.ui.item0.on(Laya.Event.MOUSE_DOWN,this,this.onDown2);
        this.ui.item0.on(Laya.Event.MOUSE_UP,this,this.onUp2);
        this.ui.item0.on(Laya.Event.MOUSE_MOVE,this,this.onMove2);
        this.refresh();
    }

    private onDown2():void
    {

    }

    private onUp2():void
    {

    }   

    private onMove2():void
    {
        this._count -= 2;
        if(this._count <= 0)
        {
            this.setAnswer(this.ui.item0,true);
        }
    }

    private _count:number = 0;
    refresh(): void {
        super.refresh();
        this._count = 100;
    }

}