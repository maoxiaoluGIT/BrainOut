import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";

export default class Level_16 extends BaseLevel {
    private ui: ui.level16UI;

    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level16UI();
        this.addChild(this.ui);
        this.isInit = true;

        this.addEvent(this.ui.windowImg2, this.onClick);
        this.addEvent(this.ui.windowImg, null, true);
        this.ui.sureBtn.clickHandler = new Laya.Handler(this, this.onSure);
        this.ui.windowImg.tag = [this.ui.windowImg.x,this.ui.windowImg.y];
        this.refresh();
    }

    refresh(): void {
        super.refresh();
        this.ui.shuru.text = "";
        this.ui.windowImg.skin = 'guanqia/16/3_pic_24_2.png';
        this.ui.windowImg.pos(this.ui.windowImg.tag[0],this.ui.windowImg.tag[1]);
    }

    private onClick(): void {
        this.ui.windowImg2.skin = 'guanqia/16/3_pic_24_4.png';
        Laya.MouseManager.enabled = false;

        setTimeout(() => {
            this.ui.humanImg.skin = "guanqia/16/3_pic_24_11.png";
            Laya.MouseManager.enabled = true;
        }, 1000);
    }

    private onSure(): void {
        this.setAnswer(this.ui.rightBox, this.ui.shuru.text == "4");
    }

    onDown(sprite: Laya.Sprite): void {
        sprite.startDrag();
    }


    onUp(sprite: Laya.Sprite): void {
        sprite.stopDrag();
    }

}