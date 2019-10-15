import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";

export default class Level_6 extends BaseLevel{
    private ui: ui.level6UI;
    
    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level6UI();
        this.addChild(this.ui);
        this.isInit = true;

        for (let i = 0; i < 2; i++)  {
            let itemImg = this.ui["item" + i];
            this.addEvent(itemImg, this.onClick);
        }
        this.refresh();

        this.isInit = true;
        

    }
    private onClick(fontclip): void {
        this.setAnswer(fontclip,fontclip.shuzi == 9);
    }
}
