import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";
import GM from "../GM";
import RightIcon from "./RightIcon";

export default class Level_49 extends BaseLevel {
    private ui: ui.level49UI;

    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level49UI();
        this.addChild(this.ui);
        this.isInit = true;

        for(let i = 0; i < 6; i++)
        {
            let btn = this.ui["item" + i];
            this.addEvent(btn,null,true);
            btn.tag = [btn.x,btn.y];
        }

        this.refresh();
    }

    onDown(sprite: Laya.Sprite): void  {
        sprite.startDrag();
    }


    onUp(sprite: Laya.Sprite): void  {
        if(sprite == this.ui.item2)
        {
            if(GM.hit(this.ui.tuiBox,this.ui.item2))
            {
                this.ui.item2.x = 50;
                Laya.Tween.to(this.ui.item2,{y:this.ui.item2.y - 240},500,null,new Laya.Handler(this,()=>{
                    this.ui.gui.visible = true;
                    this.setAnswer(this.ui.gui,true);
                }));
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
    }

    private gotoStartPos(sprite):void
    {
        Laya.Tween.to(sprite,{x:sprite.tag[0],y:sprite.tag[1]},100);
    }

    private onClick():void
    {
    }

    refresh(): void  {
        Laya.MouseManager.enabled = true;
        super.refresh();
        this.ui.gui.visible = false;
    }
}