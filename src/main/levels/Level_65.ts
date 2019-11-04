import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";
import GM from "../GM";
import RightIcon from "./RightIcon";
import Game from "../../core/Game";
import GameEvent from "../GameEvent";

export default class Level_65 extends BaseLevel {
    private ui: ui.level65UI;

    constructor() { 
        super(); 
    }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level65UI();
        this.addChild(this.ui);
        this.isInit = true;

        this.ui.gang.on(Laya.Event.MOUSE_DOWN,this,this.onDown2);
        this.ui.gang.on(Laya.Event.MOUSE_UP,this,this.onUp2);
        this.ui.gang.on(Laya.Event.MOUSE_MOVE,this,this.onMove2)
    }

    private onDown2():void
    {

    }

    private onUp2():void
    {

    }   

    private onMove2():void
    {
        this.ui.gang.alpha -= 0.02;
        if(this.ui.gang.alpha == 0)
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
        this.ui.gang.alpha = 1;
    }

}