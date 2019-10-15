import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";

export default class Level_16 extends BaseLevel{
    private ui: ui.level6UI;
    
    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level6UI();
        this.addChild(this.ui);
        this.isInit = true;
    }
}