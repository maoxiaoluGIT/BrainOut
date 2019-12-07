import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";
import Session from "../sessions/Session";

export default class Level_75 extends BaseLevel{
    private ui: ui.level75UI;
    
    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level75UI();
        this.addChild(this.ui);
        this.isInit = true;

        this.ui.copyBtn.clickHandler = new Laya.Handler(this,this.onCopy);
        this.refresh();

        this.ui.img0.on(Laya.Event.MOUSE_DOWN,this,this.onMouseDown);
        this.ui.img0.on(Laya.Event.MOUSE_UP,this,this.onMouseUp);
    }

    private onCopy():void
    {
        Laya.Tween.to(this.ui.img0,{x:this.ui.img0.x - 150},500);
        Laya.Tween.to(this.ui.img1,{x:this.ui.img0.x + 150},500);

        setTimeout(() => {
            this.setAnswer(this.ui.rightBox,true);
        }, 600);
    }


    private _startTime:number;
    private onMouseDown():void
    {
        this._startTime = Date.now();
        Laya.timer.loop(100,this,this.onLoop);
    }

    private onLoop():void
    {
        if(Date.now() - this._startTime > 1000)
        {
            Laya.timer.clear(this,this.onLoop);
            this.ui.copyBtn.visible = true;
        }
    }

    private onMouseUp():void
    {
        this._startTime = 0;
        Laya.timer.clear(this,this.onLoop);
    }

    refresh():void
    {
        super.refresh();
        this.ui.copyBtn.visible = false;
    }
}