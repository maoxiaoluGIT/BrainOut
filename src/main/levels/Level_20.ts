import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";
import GM from "../GM";

export default class Level_20 extends BaseLevel {
    private ui: ui.level20UI;
    static startStr: string = "开始";
    static moveStr: string = "前进";

    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level20UI();
        this.addChild(this.ui);
        this.isInit = true;

        this.ui.item0.tag = 0;
        this.ui.item1.tag = 0;

        this.ui.item0.on(Laya.Event.CLICK, this, null);
        this.ui.item1.on(Laya.Event.CLICK, this, null);
        this.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
        this.on(Laya.Event.MOUSE_UP, this, this.onMouseUp);

        this.ui.btn.clickHandler = new Laya.Handler(this, this.onStart);

        this.refresh();
    }

    private onStart(): void {
        Laya.timer.frameLoop(1, this, this.onLoop);
        GM.imgEffect2.addEffect2(this.ui.item0, 2);
        GM.imgEffect2.addEffect2(this.ui.item1, 2);
        GM.imgEffect2.addEffect2(this.ui.item2, 2);
        GM.imgEffect2.start();
        this.ui.btn.mouseEnabled = false;
    }

    refresh(): void {
        Laya.MouseManager.multiTouchEnabled = true;
        Laya.MouseManager.enabled = true;
        super.refresh();
    }

    private onLoop(): void {
        if (this.ui.item0.tag == 0) {
            this.ui.item0.x += 6;
        }
        if (this.ui.item1.tag == 0) {
            this.ui.item1.x += 8;
        }
        this.ui.item2.x += 4;

        if (this.ui.item1.x > 500 || this.ui.item0.x > 500 || this.ui.item2.x > 500) {
            Laya.timer.clear(this, this.onLoop);
            GM.imgEffect.removeEffect2(this.ui.item0);
            GM.imgEffect.removeEffect2(this.ui.item1);
            GM.imgEffect2.clear();
            this.ui.item0.skin = "guanqia/20/4_13_1.png";
            this.ui.item1.skin = "guanqia/20/4_12_1.png";
            this.ui.item2.skin = "guanqia/20/4_6_1.png";
            this.setAnswer(this.ui.rightBox, this.ui.item2.x > 500);
            setTimeout(() => {
                this.ui.item0.tag = 0;
                this.ui.item1.tag = 0;
                this.ui.item0.x = -30;
                this.ui.item1.x = 0;
                this.ui.item2.x = 30;
                this.ui.btn.mouseEnabled = true;
            }, 1200);
        }
    }

    private onMouseDown(e: Laya.Event): void  {
        let touches: any[] = e.touches;
        if (touches && touches.length == 2)  {
            let p1 = touches[0];
            let p2 = touches[1];
            if (this.ui.item0.hitTestPoint(p1.stageX, p1.stageY) || this.ui.item0.hitTestPoint(p2.stageX, p2.stageY))  {
                this.ui.item0.tag = 1;
            }
            if (this.ui.item1.hitTestPoint(p1.stageX, p1.stageY) || this.ui.item1.hitTestPoint(p2.stageX, p2.stageY))  {
                this.ui.item1.tag = 1;
            }
        }
        else  {
            if (e.target == this.ui.item0 || e.target == this.ui.item1)  {
                (e.target as Laya.Image).tag = 1;
            }
        }
    }

    private onMouseUp(e: Laya.Event): void  {
        if (e.target == this.ui.item0 || e.target == this.ui.item1)  {
            (e.target as Laya.Image).tag = 0;
        }
    }
}