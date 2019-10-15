import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";

export default class Level_8 extends BaseLevel{
    private ui: ui.level8UI;
    
    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level8UI();
        this.addChild(this.ui);
        this.isInit = true;
    }
}