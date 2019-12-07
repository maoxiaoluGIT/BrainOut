import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";
import Session from "../sessions/Session";

export default class Level_74 extends BaseLevel{
    private ui: ui.level74UI;
    
    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level74UI();
        this.addChild(this.ui);
        this.isInit = true;

        this.ui.sureBtn.clickHandler = new Laya.Handler(this,this.onSure);
        this.refresh();
    }

    refresh():void
    {
        super.refresh();
        this.ui.shuru.text = "";
    }

    private onSure():void
    {
        this.setAnswer(this.ui.rightBox,this.ui.shuru.text == "70773");
    }
}