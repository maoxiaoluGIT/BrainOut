import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";
import GM from "../GM";
import RightIcon from "./RightIcon";
import Game from "../../core/Game";
import GameEvent from "../GameEvent";

export default class Level_55 extends BaseLevel {
    private ui: ui.level55UI;

    constructor() { 
        super(); 
    }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level55UI();
        this.addChild(this.ui);
        this.isInit = true;

        for(let i = 0; i < 6; i++)
        {
            this.addEvent(this.ui["item" + i],this.onClick);
        }

        this.ui.item2.on(Laya.Event.MOUSE_DOWN,this,this.onDown2);
        this.ui.item2.on(Laya.Event.MOUSE_UP,this,this.onUp2);
        this.ui.item2.on(Laya.Event.MOUSE_MOVE,this,this.onMove2);

        this.addEvent(this.ui.hong,this.onClick2);

        this.refresh();
    }

    private onClick2(img):void
    {
        this.setAnswer(img,true);
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
            this.ui.shen.visible = true;
            this.ui.btnBox.visible = true;
            this.ui.hong.visible = true;
        }
    }

    private onClick(img):void
    {
        this.setAnswer(img,false);
    }

    private _count:number;
    refresh(): void {
        super.refresh();
        this.ui.hong.visible = false;
        this.ui.shen.visible = false;
        this.ui.btnBox.visible = false;
        this._count = 100;
    }

}