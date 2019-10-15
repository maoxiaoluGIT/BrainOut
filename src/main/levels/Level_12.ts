import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";

export default class Level_12 extends BaseLevel{
    private ui: ui.level12UI;
    
    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level12UI();
        this.addChild(this.ui);
        this.isInit = true;
    }
}