import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";

export default class Level_4 extends BaseLevel{
    private ui: ui.level4UI;
    
    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level4UI();
        this.addChild(this.ui);
        this.isInit = true;

        for(let i = 0; i < 7;i++)
        {
            let img:Laya.Image = this.ui["img" + 0];
            this.addEvent(img,this.onClick);
        }
    }

    private onClick(img:Laya.Image):void
    {
        if(img == this.ui.img6)
        {
            
        }
    }
}