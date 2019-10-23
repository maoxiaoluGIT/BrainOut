import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";
import GM from "../GM";

export default class Level_30 extends BaseLevel {
    private ui: ui.level30UI;

    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level30UI();
        this.addChild(this.ui);
        this.isInit = true;

        this.on(Laya.Event.MOUSE_DOWN,this,this.onMouseDown);

        this.refresh();
    }

    private onMouseDown(e:Laya.Event):void
    {
        let touches:any[] = e.touches;
        if(touches && touches.length == 2)
        {
            let p1 = touches[0];
            let p2 = touches[1];
            if((this.ui.item0.hitTestPoint(p1.stageX,p1.stageY) && this.ui.item1.hitTestPoint(p2.stageX,p2.stageY)) 
            || (this.ui.item1.hitTestPoint(p2.stageX,p2.stageY) && this.ui.item0.hitTestPoint(p1.stageX,p1.stageY)))
            {
                this.ui.img.skin = "guanqia/30/youdian.png";
                setTimeout(() => {
                    this.setAnswer(this.ui.rightBox,true);
                }, 200);
            }
        }
    }

    refresh(): void  {
        Laya.MouseManager.multiTouchEnabled = true;
        Laya.MouseManager.enabled = true;
        super.refresh();
    }
}