import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";
import GM from "../GM";

export default class Level_60 extends BaseLevel {
    private ui: ui.level60UI;

    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level60UI();
        this.addChild(this.ui);
        this.isInit = true;

        for(let i = 0; i < 3; i++)
        {
            let img = this.ui["item" + i];
            this.addEvent(img,null,true);
            img.tag = [img.x,img.y];
        }

        this.addEvent(this.ui.dog,this.onClick);

        this.refresh();
    }

    private _count:number = 0;
    refresh(): void {
        Laya.MouseManager.enabled = true;
        super.refresh();
        this.ui.dog.visible = true;
        this.ui.dog2.visible = false;
        this._count = 0;
    }

    private onClick(spr:Laya.Sprite):void
    {
        this._count++;
        if(this._count == 3)
        {
            this.ui.dog2.visible = true;
            this.ui.dog.visible = false;
            this.setAnswer(this.ui.rightBox,true);
        }
    }

    onDown(sprite: Laya.Sprite):void
    {
        sprite.startDrag();
    }
    

    onUp(sprite):void
    {
        sprite.stopDrag();
        this.gotoStartPos(sprite);
        this.setAnswer(this.ui.rightBox,false);
    }

    private gotoStartPos(sprite):void
    {
        Laya.Tween.to(sprite,{x:sprite.tag[0],y:sprite.tag[1]},200);
    }
}