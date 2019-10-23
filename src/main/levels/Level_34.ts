import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";
import GM from "../GM";

export default class Level_34 extends BaseLevel {
    private ui: ui.level34UI;

    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level34UI();
        this.addChild(this.ui);
        this.isInit = true;

        for (let i = 0; i < 3; i++)  {
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
        if (sprite == this.ui.item0)  {
            if (!GM.hit(this.ui.item0, this.ui.sunImg))  {
                Laya.MouseManager.enabled = false;
                setTimeout(() => {
                    this.ui.bing.visible = false;
                    this.ui.bing2.alpha = 1;
                    Laya.Tween.to(this.ui.bing2,{alpha:0},2000);
                    Laya.Tween.to(this.ui.che, { x: this.ui.pai.x }, 2000, null, new Laya.Handler(this, this.showRight),2000);
                }, 1000);

            }
        }
    }

    private showRight(): void  {
        this.setAnswer(this.ui.rightBox, true);
    }

    private onClick(img: Laya.Image): void  {
        this.setAnswer(img, true);
    }


    refresh(): void  {
        Laya.MouseManager.enabled = true;
        super.refresh();
        this.ui.bing.visible = true;
        this.ui.bing2.alpha = 0;

        for (let i = 0; i < 3; i++)  {
            let img = this.ui["item" + i];
            img.pos(img.tag[0], img.tag[1]);
        }
    }
}