import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";
import GM from "../GM";

export default class Level_18 extends BaseLevel{
    private ui: ui.level18UI;
    
    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level18UI();
        this.addChild(this.ui);
        this.isInit = true;

        this.addEvent(this.ui.hengBox,null,true);
        this.ui.hengBox.tag = [this.ui.hengBox.x,this.ui.hengBox.y];
        this.refresh();
    }

    refresh():void
    {
        super.refresh();
        this.ui.hengBox.pos(this.ui.hengBox.tag[0],this.ui.hengBox.tag[1]);
    }

    onDown(sprite: Laya.Sprite):void
    {
        sprite.startDrag(new Laya.Rectangle(this.ui.box.x,this.ui.box.y,this.ui.box.width,this.ui.box.height));
    }
    

    onUp(sprite: Laya.Sprite):void
    {
        sprite.stopDrag();
        if(GM.hit(sprite,this.ui.hitBox))
        {
            Laya.Tween.to(this.ui.hengBox,{x:583,y:705},100,null,Laya.Handler.create(this,this.showRigit));
        }
    }

    private showRigit():void
    {
        this.setAnswer(this.ui.rightBox,true);
    }

}