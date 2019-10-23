import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";
import GM from "../GM";

export default class Level_26 extends BaseLevel {
    private ui: ui.level26UI;

    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level26UI();
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
        this.ui.yuan.visible = true;
        this.ui.resultImg.visible = false;
    }

    private onSure():void
    {
        if(this.ui.shuru.text == "1")
        {
            this.ui.yuan.visible = false;
            this.ui.resultImg.visible = true;
            setTimeout(() => {
                this.setAnswer(this.ui.rightBox,true);
            }, 500);
        }
        else
        {
            this.setAnswer(this.ui.rightBox,false);
        }
    }
}