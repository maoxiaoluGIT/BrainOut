import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";
import GM from "../GM";

export default class Level_59 extends BaseLevel {
    private ui: ui.level59UI;

    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level59UI();
        this.addChild(this.ui);
        this.isInit = true;
        this.refresh();

        this.ui.hudie.tag = [this.ui.hudie.x,this.ui.hudie.y];

        this.addEvent(this.ui.hudie,null,true);

        this.ui.bizi.on(Laya.Event.MOUSE_DOWN,this,this.onDown2);
        this.ui.bizi.on(Laya.Event.MOUSE_UP,this,this.onUp2);
    }

    private onDown2():void
    {
        this.ui.item2.visible = true;
        Laya.timer.frameLoop(1,this,this.onLoop);
    }

    private onLoop():void
    {
        this.ui.item1.alpha -= 0.02;
        if(this.ui.item1.alpha == 0)
        {
            Laya.timer.clear(this,this.onLoop);
            this.ui.item3.visible = true;
            this.setAnswer(this.ui.rightBox,true);
        }
    }

    private onUp2():void
    {
        Laya.timer.clear(this,this.onLoop);
        if(this.ui.item1.alpha > 0)
        {
            this.refresh();
        }
    }

    refresh():void
    {
        Laya.MouseManager.enabled = true;
        super.refresh();
        this.ui.item1.visible = true;
        this.ui.item2.visible = this.ui.item3.visible = false;
    }

    onDown(sprite: Laya.Sprite):void
    {
        sprite.startDrag(new Laya.Rectangle(this.ui.box.x,this.ui.box.y,this.ui.box.width,this.ui.box.height));
    }

    onUp(sprite: Laya.Sprite):void
    {
        super.onUp(sprite);
        if(sprite == this.ui.hudie)
        {
            this.setAnswer(this.ui.rightBox,false);
            this.gotoStartPos(this.ui.hudie);
        }
    }

    private gotoStartPos(sprite):void
    {
        Laya.Tween.to(sprite,{x:sprite.tag[0],y:sprite.tag[1]},100);
    }

}