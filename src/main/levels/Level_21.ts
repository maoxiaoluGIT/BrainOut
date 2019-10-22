import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";
import GM from "../GM";

export default class Level_21 extends BaseLevel {
    private ui: ui.level21UI;

    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level21UI();
        this.addChild(this.ui);
        this.isInit = true;

        this.addEvent(this.ui.closeImg,null,true);
        this.addEvent(this.ui.btn,this.onClick);
        this.addEvent(this.ui.openImg,null,true);
        this.addEvent(this.ui.ringImg,this.onClick);

        this.ui.closeImg.tag = [this.ui.closeImg.x,this.ui.closeImg.y];
        this.ui.openImg.tag = [this.ui.openImg.x,this.ui.openImg.y];


        this.refresh();
    }

    refresh(): void {
        Laya.MouseManager.multiTouchEnabled = true;
        Laya.MouseManager.enabled = true;
        super.refresh();
        this.ui.closeImg.visible = true;
        this.ui.openImg.visible = false;
        this.ui.shitImg.visible = false;
        this.ui.eatImg.visible = false;
        this.ui.gou.visible = true;
        this.ui.closeImg.pos(this.ui.closeImg.tag[0],this.ui.closeImg.tag[1]);
        this.ui.openImg.pos(this.ui.closeImg.tag[0],this.ui.openImg.tag[1]);
    }

    private onClick(spr:Laya.Sprite):void
    {
        if(spr == this.ui.btn)
        {
            this.ui.closeImg.visible = false;
            this.ui.openImg.visible = true;
        }
        else if(spr == this.ui.ringImg)
        {
            this.setAnswer(this.ui.ringImg,true);
        }
    }

    onDown(sprite: Laya.Sprite):void
    {
        sprite.startDrag(new Laya.Rectangle(this.ui.box.x,this.ui.box.y,this.ui.box.width - 180,this.ui.box.height - 180));
    }
    

    onUp(sprite):void
    {
        sprite.stopDrag();
        if(sprite == this.ui.openImg)
        {
            if(GM.hit(this.ui.openImg,this.ui.headBox))
            {
                this.ui.openImg.visible = false;
                this.ui.gou.visible = false;
                this.ui.eatImg.visible = true;
                setTimeout(() => {
                    this.ui.eatImg.visible = false;
                    this.ui.gou.visible = true;
                    this.ui.shitImg.visible = true;
                }, 1500);
            }
            else
            {
                this.gotoStartPos(sprite);
            }
        }
        else
        {
            this.gotoStartPos(sprite);
        }
    }

    private gotoStartPos(sprite):void
    {
        Laya.Tween.to(sprite,{x:sprite.tag[0],y:sprite.tag[1]},200);
    }
}