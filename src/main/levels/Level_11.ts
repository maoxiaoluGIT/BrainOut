import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";

export default class Level_11 extends BaseLevel{
    private ui: ui.level11UI;
    
    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level11UI();
        this.addChild(this.ui);
        this.isInit = true;
    }
}