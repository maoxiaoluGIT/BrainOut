import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";
import GM from "../GM";

export default class Level_38 extends BaseLevel {
    private ui: ui.level38UI;

    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level38UI();
        this.addChild(this.ui);
        this.isInit = true;

        for (let i = 0; i < 5; i++)  {
            let img = this.ui["item" + i];
            img.tag = [img.x, img.y];
            this.addEvent(img, null, true);
        }


        this.refresh();
    }

    onDown(sprite: Laya.Sprite): void  {
        sprite.startDrag();
    }


    onUp(sprite: Laya.Sprite): void  {
        sprite.stopDrag();
        if (GM.hit(sprite, this.ui.myBox))  {
            Laya.Tween.to(sprite,{rotation:360,scaleX:0,scaleY:0},500);
            this._num++;
        }

        if(this._num == 5)
        {
            this.setAnswer(this.ui.rightBox,true);
        }
    }

    private showRight(): void  {
        this.setAnswer(this.ui.rightBox, true);
    }

    private onClick(img: Laya.Image): void  {
        this.setAnswer(img, true);
    }


    private _num:number = 0;
    refresh(): void  {
        Laya.MouseManager.enabled = true;
        super.refresh();
        this._num = 0;
        for (let i = 0; i < 5; i++)  {
            let img = this.ui["item" + i];
            img.pos(img.tag[0], img.tag[1]);
            img.rotation = 0;
            img.scale(1,1);
        }
    }
}