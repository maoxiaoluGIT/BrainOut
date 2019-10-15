import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";

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
    }
}