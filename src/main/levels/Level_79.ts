import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";
import Session from "../sessions/Session";

export default class Level_79 extends BaseLevel{
    private ui: ui.level79UI;
    private gPoint:Laya.Point;
    
    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level79UI();
        this.addChild(this.ui);
        this.isInit = true;

        this.refresh();

        this.ui.item.on(Laya.Event.MOUSE_DOWN,this,this.onDown2);
        this.ui.item.on(Laya.Event.MOUSE_UP,this,this.onUp2);

        this.gPoint = this.ui.item.localToGlobal(new Laya.Point());
        
    }

    private onMove2():void
    {
        let rr = Math.atan2(Laya.stage.mouseY - this.gPoint.y,Laya.stage.mouseX -this.gPoint.x);
        this.ui.item.rotation = rr * 180 / Math.PI + 90;
    }

    private onDown2():void
    {
        this.ui.item.on(Laya.Event.MOUSE_MOVE,this,this.onMove2);
    }


    private onUp2():void
    {
        this.ui.item.off(Laya.Event.MOUSE_MOVE,this,this.onMove2);
        if(Math.abs(this.ui.item.rotation) >= 170 && Math.abs(this.ui.item.rotation) <= 190)
        {
            this.setAnswer(this.ui.rightBox,true);
        }
    }

    refresh():void
    {
        super.refresh();
        this.ui.item.rotation = 0;
    }
}