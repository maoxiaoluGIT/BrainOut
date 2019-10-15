import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";

export default class Level_9 extends BaseLevel{
    private ui: ui.level9UI;
    
    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level9UI();
        this.addChild(this.ui);
        this.isInit = true;
        for (let i = 0; i < 6; i++)  {
            let itemImg = this.ui["item" + i];
            this.addEvent(itemImg, this.onClick);
        }
        this.refresh();

        this.isInit = true;
    }
    private onClick(img): void {
        this.setAnswer(img,img == this.ui.item4);
    }
}