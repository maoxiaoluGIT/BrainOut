import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";


export default class Level_3 extends BaseLevel{
    private ui: ui.level3UI;
    
    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level3UI();
        this.addChild(this.ui);
        this.isInit = true;

        for (let i = 0; i < 5; i++)  {
            let itemImg = this.ui["item" + i];
            this.addEvent(itemImg, this.onClick);
        }
        this.refresh();

        this.isInit = true;
    }

    refresh():void
    {
        super.refresh();
    }

    
    private onClick(img): void {
        this.setAnswer(img,img == this.ui.item0);
    }
}