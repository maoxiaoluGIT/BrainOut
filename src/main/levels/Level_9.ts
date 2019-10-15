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
    }
}