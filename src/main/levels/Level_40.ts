import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";
import GM from "../GM";

export default class Level_40 extends BaseLevel {
    private ui: ui.level40UI;

    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level40UI();
        this.addChild(this.ui);
        this.isInit = true;

        for(let i = 0; i < 4;i++)
        {
            let sp = this.ui["item" + i];
            sp.tag = [sp.x,sp.y];
            this.addEvent(sp,null,true);
        }


        this.refresh();
    }

    onDown(sprite: Laya.Sprite): void  {
        sprite.startDrag();
    }


    onUp(sprite: Laya.Sprite): void  {
        this.ui.rightBox.pos(sprite.x,sprite.y);
        this.ui.addChild(this.ui.rightBox)
        this.setAnswer(this.ui.rightBox,false);
        this.gotoStartPos(sprite);
    }

    private gotoStartPos(sprite):void
    {
        Laya.Tween.to(sprite,{x:sprite.tag[0],y:sprite.tag[1]},100);
    }

    private _num:number = 0;
    refresh(): void  {
        Laya.MouseManager.enabled = true;
        super.refresh();
    }
}