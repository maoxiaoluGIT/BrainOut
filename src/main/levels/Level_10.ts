import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";

export default class Level_10 extends BaseLevel{
    private ui: ui.level10UI;
    
    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level10UI();
        this.addChild(this.ui);
        this.isInit = true;
    }
}