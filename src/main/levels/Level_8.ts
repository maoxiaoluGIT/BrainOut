import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";

export default class Level_8 extends BaseLevel{
    private ui: ui.level8UI;
    private curValue:number;
    private _startX:number;
    private _startY:number;
    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level8UI();
        this.addChild(this.ui);
        this.isInit = true;

        this.ui.jian.on(Laya.Event.CLICK,this,this.onJian);
        this.ui.jia.on(Laya.Event.CLICK,this,this.onJia);
        this.ui.clearBtn.clickHandler = new Laya.Handler(this,this.refresh);
        this.ui.sureBtn.clickHandler = new Laya.Handler(this,this.onSure);

        this.curValue = 0;
        this.ui.shuzi.value  = "" + this.curValue;

        this.addEvent(this.ui.carImg,null,true);
        this._startX = this.ui.carImg.x;
        this._startY = this.ui.carImg.y;
    }

    onDown(sprite: Laya.Sprite):void
    {
        sprite.startDrag(new Laya.Rectangle(this.ui.box.x,this.ui.box.y,this.ui.box.width,this.ui.box.height));
    }

    private onJian():void
    {
        if(this.curValue == 0)
        {
            return;
        }
        this.curValue--;
        this.ui.shuzi.value  = "" + this.curValue;
    }

    private onJia():void
    {
        if(this.curValue == 99)
        {
            return;
        }
        this.curValue++;
        this.ui.shuzi.value  = "" + this.curValue;
    }

    refresh():void
    {
        this.ui.carImg.pos(this._startX,this._startY);
        this.curValue = 0;
        this.ui.shuzi.value  = "" + this.curValue;
    }

    private onSure():void
    {
        this.setAnswer(this.ui.rightBox,this.curValue == 9);
    }
}