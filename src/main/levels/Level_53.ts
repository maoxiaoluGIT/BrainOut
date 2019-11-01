import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";
import GM from "../GM";
import RightIcon from "./RightIcon";
import Game from "../../core/Game";
import GameEvent from "../GameEvent";

export default class Level_53 extends BaseLevel {
    private ui: ui.level53UI;

    constructor() { 
        super(); 
    }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level53UI();
        this.addChild(this.ui);
        this.isInit = true;

        this.addEvent(this.ui.tong,this.onClick);
        this.addEvent(this.ui.bi,this.onClick);
        this.addEvent(this.ui.hua,this.onClick);

        this.ui.hua.on(Laya.Event.MOUSE_DOWN,this,this.onDown2);
        this.ui.hua.on(Laya.Event.MOUSE_UP,this,this.onUp2);
        this.ui.hua.on(Laya.Event.MOUSE_MOVE,this,this.onMove2)
    }

    private onDown2():void
    {

    }

    private onUp2():void
    {

    }   

    private onMove2():void
    {
        this.ui.hua.alpha -= 0.02;
        if(this.ui.hua.alpha == 0)
        {
            this.setAnswer(this.ui.rightBox,true);
        }
    }

    private onClick(img):void
    {
        this.setAnswer(this.ui.rightBox,false);
    }

    refresh(): void {
        super.refresh();
        this.ui.hua.alpha = 1;
    }

}