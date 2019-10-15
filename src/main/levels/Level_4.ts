import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";

export default class Level_4 extends BaseLevel{
    private ui: ui.level4UI;
    
    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level4UI();
        this.addChild(this.ui);
        this.isInit = true;
    }
}