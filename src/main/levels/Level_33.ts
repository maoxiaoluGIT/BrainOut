import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";
import GM from "../GM";

export default class Level_33 extends BaseLevel {
    private ui: ui.level33UI;
    private quanList:Laya.Image[] = [];

    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level33UI();
        this.addChild(this.ui);
        this.isInit = true;

        this.addEvent(this.ui.item0,this.onClick);
        this.addEvent(this.ui.item1,this.onClick);

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
            || (this.ui.item0.hitTestPoint(p2.stageX,p2.stageY) && this.ui.item1.hitTestPoint(p1.stageX,p1.stageY)))
            {
                this.ui.jiuming.visible = false;
                this.ui.resultImg.visible = true;
                setTimeout(() => {
                    this.setAnswer(this.ui.rightBox,true);
                }, 200);
            }
        }
    }

    private onClick(spr):void
    {
        this.setAnswer(this.ui.rightBox,false);
    }

    refresh(): void  {
        Laya.MouseManager.multiTouchEnabled = true;
        Laya.MouseManager.enabled = true;
        this.ui.resultImg.visible = false;
        super.refresh();
    }
}