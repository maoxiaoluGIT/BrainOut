import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";
import GM from "../GM";

export default class Level_23 extends BaseLevel {
    private ui: ui.level23UI;
    private clickNum:number = 0;

    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level23UI();
        this.addChild(this.ui);
        this.isInit = true;

        this.addEvent(this.ui.xie,null,true);
        this.addEvent(this.ui.cha,null,true);
        this.addEvent(this.ui.heng,null,true);

        this.ui.xie.tag = [this.ui.xie.x,this.ui.xie.y];
        this.ui.cha.tag = [this.ui.cha.x,this.ui.cha.y];
        this.ui.heng.tag = [this.ui.heng.x,this.ui.heng.y];

        this.addEvent(this.ui.yanBox,this.onClick);

        this.refresh();
    }

    private onClick(sprite:Laya.Sprite)
    {
        this.clickNum++;
        this.ui.item0.alpha = 1 - this.clickNum * 1/3;
        if(this.ui.item0.alpha <= 0)
        {
            this.ui.yan.visible = false;
            this.ui.rightBox.pos(sprite.x,sprite.y);
            this.setAnswer(this.ui.rightBox,true);
        }
    }

    refresh(): void {
        Laya.MouseManager.enabled = true;
        super.refresh();
        this.clickNum = 0;
        this.ui.item0.alpha = 1 - this.clickNum * 1/3;
        this.ui.yan.visible = true;
    }

    onDown(sprite: Laya.Sprite):void
    {
        this.ui.addChild(sprite);
        sprite.startDrag(new Laya.Rectangle(this.ui.box.x,this.ui.box.y,this.ui.box.width,this.ui.box.height));
    }
    

    onUp(sprite):void
    {
        sprite.stopDrag();
        this.ui.rightBox.pos(sprite.x,sprite.y);
        this.ui.addChild(this.ui.rightBox)
        this.setAnswer(this.ui.rightBox,false);
        this.gotoStartPos(sprite);
    }

    private gotoStartPos(sprite):void
    {
        Laya.Tween.to(sprite,{x:sprite.tag[0],y:sprite.tag[1]},100);
    }
}