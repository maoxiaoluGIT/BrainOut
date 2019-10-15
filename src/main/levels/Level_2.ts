import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";
import RightIcon from "./RightIcon";
import WrongIcon from "./WrongIcon";

export default class Level_2 extends BaseLevel{
    private ui: ui.level2UI;
    
    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level2UI();
        this.addChild(this.ui);
        this.isInit = true;

        for (let i = 0; i < 4; i++)  {
            let itemImg = this.ui["item" + i];
            this.addEvent(itemImg, this.onClick);
        }
        this.refresh();

        this.isInit = true;

        
    }
    private onClick(img): void {
        this.setAnswer(img,img == this.ui.item1);
    }
}