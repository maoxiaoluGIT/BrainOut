import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";

export default class Level_16 extends BaseLevel{
    private ui: ui.level16UI;
    
    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level16UI();
        this.addChild(this.ui);
        this.isInit = true;

        this.addEvent(this.ui.hairImg,null,true);
        this.ui.sureBtn.clickHandler = new Laya.Handler(this,this.onSure);
        this.refresh();
    }

    refresh():void
    {
        super.refresh();
        this.ui.shuru.text = "";
        this.ui.hairImg.pos(186,436);
    }

    private onSure():void
    {
        this.setAnswer(this.ui.rightBox,this.ui.shuru.text == "3");
    }

    onDown(sprite: Laya.Sprite):void
    {
        sprite.startDrag(new Laya.Rectangle(this.ui.box.x,this.ui.box.y,this.ui.box.width,this.ui.box.height));
    }
    

    onUp(sprite: Laya.Sprite):void
    {
        sprite.stopDrag();
    }

}