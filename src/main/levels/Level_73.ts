import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";
import GM from "../GM";

export default class Level_73 extends BaseLevel {
    private ui: ui.level73UI;

    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level73UI();
        this.addChild(this.ui);
        this.isInit = true;

        this.addEvent(this.ui.zuo, this.onZuo);
        this.addEvent(this.ui.you, this.onYou);
        this.addEvent(this.ui.nextBtn, this.onJump);

        this.addEvent(this.ui.luoboBox, null, true);
        this.addEvent(this.ui.timuBox, null, true);

        this.refresh();
    }

    private onZuo(): void {
        this.ui.tu.scaleX = -1;
        this.ui.tu.x -= 40;
        this.ui.tu.skin = "guanqia/73/4_6_2.png";
        setTimeout(() => {
            this.ui.tu.skin = "guanqia/73/4_6_1.png";
        }, 100);
        if (this.ui.tu.x <= -90) {
            Laya.Tween.to(this.ui.tu, { y: 1200 }, 100, null, new Laya.Handler(this, this.showWrong));
        }
    }

    private onYou(): void {
        this.ui.tu.scaleX = 1;
        this.ui.tu.x += 40;
        this.ui.tu.skin = "guanqia/73/4_6_2.png";
        setTimeout(() => {
            this.ui.tu.skin = "guanqia/73/4_6_1.png";
        }, 100);
        if (this._isOk) {
            if (this.ui.tu.x >= 550) {
                Laya.Tween.to(this.ui.tu, { x: 600, y: 793 }, 100, null, new Laya.Handler(this, this.showRight));
            }
        }
        else {
            if (this.ui.tu.x >= 300) {
                Laya.Tween.to(this.ui.tu, { x: 400, y: 1200 }, 100, null, new Laya.Handler(this, this.showWrong));
            }
        }
    }

    private showRight(): void  {
        this.setAnswer(this.ui.rightBox, true)
    }

    private showWrong(): void {
        this.setAnswer(this.ui.rightBox, false);
        setTimeout(() => {
            this.ui.tu.skin = "guanqia/73/4_6_1.png";
            this.ui.tu.scaleX = 1;
            this.ui.tu.pos(90, 795);
        }, 1500);
    }

    private onJump(): void {
        this.ui.nextBtn.mouseEnabled = false;
        this.ui.tu.skin = "guanqia/73/4_6_2.png";
        setTimeout(() => {
            this.ui.tu.skin = "guanqia/73/4_6_1.png";
            this.ui.nextBtn.mouseEnabled = true;
        }, 200);

        let t = new Laya.TimeLine();
        t.to(this.ui.tu, { y: 595 }, 100);
        t.to(this.ui.tu, { y: 795 }, 100, Laya.Ease.backOut);
        t.play();
    }

    private _isOk: boolean = false;
    refresh(): void {
        Laya.MouseManager.enabled = true;
        this.ui.timuBox.pos(374, 250);
        this._isOk = false;
        super.refresh();
    }

    onDown(sprite: Laya.Sprite): void {
        sprite.startDrag(new Laya.Rectangle(this.ui.box.x, this.ui.box.y, this.ui.box.width, this.ui.box.height));
    }


    onUp(sprite: Laya.Sprite): void {
        sprite.stopDrag();

        if (sprite == this.ui.luoboBox) {
            if (this.hit(this.ui.luoboBox, this.ui.tu)) {
                this.setAnswer(this.ui.rightBox, true)
            }
        }
        else if (sprite == this.ui.timuBox) {
            if (GM.hitPoint(this.ui.timuBox, this.ui.posBox)) {
                this.ui.timuBox.pos(374, 775);
                this._isOk = true;
            }
        }
    }

    private hit(b0: Laya.Sprite, b1: Laya.Sprite): boolean {
        return b0.x < b1.x + b1.width * 0.5 &&
            b0.x + b0.width > b1.x - b1.width * 0.5 &&
            b0.y < b1.y &&
            b0.y + b0.height > b1.y - b1.height
    }
}