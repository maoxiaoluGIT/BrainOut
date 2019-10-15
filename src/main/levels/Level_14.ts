import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";

export default class Level_14 extends BaseLevel{
    private ui: ui.level14UI;
    
    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level14UI();
        this.addChild(this.ui);
        this.isInit = true;
    }
}