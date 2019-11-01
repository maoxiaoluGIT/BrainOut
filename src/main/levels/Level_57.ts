import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";
import GM from "../GM";

export default class Level_57 extends BaseLevel {
    private ui: ui.level57UI;

    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level57UI();
        this.addChild(this.ui);
        this.isInit = true;

        this.ui.sureBtn.clickHandler = new Laya.Handler(this,this.onSure);
        this.refresh();
    }

    refresh():void
    {
        Laya.MouseManager.enabled = true;
        super.refresh();
        this.ui.shuru.text = "";
    }

    private onSure():void
    {
        this.setAnswer(this.ui.rightBox,this.ui.shuru.text == "91");
    }
}