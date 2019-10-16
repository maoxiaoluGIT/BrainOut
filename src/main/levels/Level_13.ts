import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";

export default class Level_13 extends BaseLevel{
    private ui: ui.level13UI;
    
    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level13UI();
        this.addChild(this.ui);
        this.isInit = true;

        this.on(Laya.Event.MOUSE_DOWN,this,this.onMouseDown);

        this.addEvent(this.ui.box3,null,true);
        this.addEvent(this.ui.box4,null,true);
        this.addEvent(this.ui.box5,null,true);
        this.addEvent(this.ui.box9,null,true);

        this.refresh();
    }

    onDown(sprite:Laya.Sprite):void
    {

    }

    onUp(sprite:Laya.Sprite):void
    {
        Laya.MouseManager.enabled = false;
        let flag = sprite.name;
        this.ui["img" + flag].skin = "guanqia/13/quan.jpg";
        if(sprite == this.ui.box3)
        {
            this.ui.img4.skin = "guanqia/13/cha.jpg";
            this.ui.redLine2.visible = true;
        }
        else
        {
            this.ui.img3.skin = "guanqia/13/cha.jpg";
            this.ui.redLine1.visible = true;
        }
        this.setAnswer(this.ui.rightBox,false);
        setTimeout(() => {
            this.refresh();
        }, 1200);
    }

    private onMouseDown(e:Laya.Event):void
    {
        let touches:any[] = e.touches;
        if(touches && touches.length == 2)
        {
            let p1 = touches[0];
            let p2 = touches[1];
            if((this.ui.box3.hitTestPoint(p1.stageX,p1.stageY) && this.ui.box9.hitTestPoint(p2.stageX,p2.stageY)) 
            || (this.ui.box3.hitTestPoint(p2.stageX,p2.stageY) && this.ui.box9.hitTestPoint(p1.stageX,p1.stageY)))
            {
                this.ui.blueLine1.visible = true;
                this.ui.img3.skin = "guanqia/13/quan.jpg";
                this.ui.img9.skin = "guanqia/13/quan.jpg";
                this.setAnswer(this.ui.rightBox,true);
            }
            else if((this.ui.box4.hitTestPoint(p1.stageX,p1.stageY) && this.ui.box5.hitTestPoint(p2.stageX,p2.stageY)) 
            || (this.ui.box4.hitTestPoint(p2.stageX,p2.stageY) && this.ui.box5.hitTestPoint(p1.stageX,p1.stageY)))
            {
                this.ui.blueLine2.visible = true;
                this.ui.img4.skin = "guanqia/13/quan.jpg";
                this.ui.img5.skin = "guanqia/13/quan.jpg";
                this.setAnswer(this.ui.rightBox,true);
            }
            else
            {
                this.refresh();
            }
        }
    }

    refresh(): void  {
        Laya.MouseManager.multiTouchEnabled = true;
        Laya.MouseManager.enabled = true;
        super.refresh();
        this.ui.blueLine1.visible = this.ui.blueLine2.visible = false;
        this.ui.redLine1.visible = false;
        this.ui.redLine2.visible = false;
        this.ui.img3.skin = this.ui.img4.skin = this.ui.img5.skin = this.ui.img9.skin = "";
    }
}