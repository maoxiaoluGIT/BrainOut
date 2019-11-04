import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";
import GM from "../GM";
import RightIcon from "./RightIcon";

export default class Level_43 extends BaseLevel {
    private ui: ui.level43UI;

    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level43UI();
        this.addChild(this.ui);
        this.isInit = true;

        for(let i = 0; i < 4; i++)
        {
            let btn = this.ui["item" + i];
            this.addEvent(btn,null,true);
            btn.tag = [btn.x,btn.y];
        }

        this.ui.menBox.on(Laya.Event.CLICK,this,this.onClick);

        this.refresh();
    }

    onDown(sprite: Laya.Sprite): void  {
        sprite.startDrag(new Laya.Rectangle(this.ui.box.x,this.ui.box.y,this.ui.box.width,this.ui.box.height));
    }


    onUp(sprite: Laya.Sprite): void  {
        this.setAnswer(this.ui.rightBox,false);
        this.gotoStartPos(sprite);
    }

    private gotoStartPos(sprite):void
    {
        Laya.Tween.to(sprite,{x:sprite.tag[0],y:sprite.tag[1]},100);
    }

    private onClick():void
    {
        this.ui.menBox.mouseEnabled = false;
        setTimeout(() => {
            this.ui.men.skin = "guanqia/43/4_3_4.png";
        }, 300);
        setTimeout(() => {
            this.ui.maImg.visible = true;
        }, 1000);
        setTimeout(() => {
            this.ui.xiaohai.skin = "guanqia/43/4_3_2.png";
        }, 1500);
        setTimeout(() => {
            this.setAnswer(this.ui.rightBox,true);
        }, 2000);
    }

    refresh(): void  {
        this.ui.menBox.mouseEnabled = true;
        Laya.MouseManager.enabled = true;
        super.refresh();
        this.ui.maImg.visible = false;
        this.ui.men.skin = "guanqia/43/4_3_3.png";
        this.ui.xiaohai.skin = "guanqia/43/4_3_1.png";
    }
}