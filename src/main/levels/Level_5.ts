import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";

export default class Level_5 extends BaseLevel{
    private ui: ui.level5UI;
    
    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level5UI();
        this.addChild(this.ui);
        this.isInit = true;
    }
}