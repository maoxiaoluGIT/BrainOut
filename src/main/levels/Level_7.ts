import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";

export default class Level_7 extends BaseLevel{
    private ui: ui.level7UI;
    
    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level7UI();
        this.addChild(this.ui);
        this.isInit = true;
    }
}