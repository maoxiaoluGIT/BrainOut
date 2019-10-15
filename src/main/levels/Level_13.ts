import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";

export default class Level_13 extends BaseLevel{
    private ui: ui.level13UI;
    
    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level13UI();
        this.addChild(this.ui);
        this.isInit = true;
    }
}