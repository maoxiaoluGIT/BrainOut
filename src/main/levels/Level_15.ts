import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";

export default class Level_15 extends BaseLevel{
    private ui: ui.level15UI;
    
    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level15UI();
        this.addChild(this.ui);
        this.isInit = true;

        this.addEvent(this.ui.targetBox,this.onClick);
        this.addEvent(this.ui.colorBox,this.onClick);
    }

    private onClick(box:Laya.Sprite):void
    {
        this.setAnswer(this.ui.rightBox,box == this.ui.targetBox);
    }
}