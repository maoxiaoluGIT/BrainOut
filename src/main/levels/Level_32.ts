import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";
import GM from "../GM";

export default class Level_32 extends BaseLevel {
    private ui: ui.level32UI;
    private quanList:Laya.Image[] = [];

    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level32UI();
        this.addChild(this.ui);
        this.isInit = true;

        for(let i = 0; i < 3; i++)
        {
            let item = this.ui["item" + i];
            item.tag = [item.x,item.y];
            this.addEvent(item,null,true);
        }

        this.refresh();
    }

    private onClick(img:Laya.Image):void
    {
        this.setAnswer(img,true);
    }

    onDown(sprite: Laya.Sprite): void  {
        sprite.startDrag();
    }


    onUp(sprite: Laya.Sprite): void  {
        if(sprite == this.ui.item2)
        {
            if(GM.hit(this.ui.monthBox,this.ui.item2))
            {
                this._num++;
                this.ui.item2.pos(318,498);
            }
            else
            {
                this.ui.rightBox.pos(Laya.stage.mouseX,Laya.stage.mouseY);
                this.setAnswer(this.ui.rightBox,false);
                this.gotoStartPos(sprite);
            }
        }
        else if(sprite == this.ui.item0)
        {
            if(GM.hit(this.ui.headBox,this.ui.item0))
            {
                this._num++;
                this.ui.item0.pos(200,216);
            }
            else
            {
                this.ui.rightBox.pos(Laya.stage.mouseX,Laya.stage.mouseY);
                this.setAnswer(this.ui.rightBox,false);
                this.gotoStartPos(sprite);
            }
        }
        else
        {
            this.ui.rightBox.pos(Laya.stage.mouseX,Laya.stage.mouseY);
            this.setAnswer(this.ui.rightBox,false);
            this.gotoStartPos(sprite);
        }

        if(this._num == 2)
        {
            this.ui.rightBox.pos(Laya.stage.mouseX,Laya.stage.mouseY);
            this.setAnswer(this.ui.rightBox,true);
        }
    }

    private gotoStartPos(sprite):void
    {
        Laya.Tween.to(sprite,{x:sprite.tag[0],y:sprite.tag[1]},100);
    }


    private _num:number = 0;
    refresh():void
    {
        Laya.MouseManager.enabled = true;
        super.refresh();
        this._num = 0;
    }
}