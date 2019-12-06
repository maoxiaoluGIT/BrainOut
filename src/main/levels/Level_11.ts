import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";
import Session from "../sessions/Session";

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

        this.ui.sureBtn.clickHandler = new Laya.Handler(this,this.onSure);
        this.refresh();

        if (Session.isNew)  {
            Laya.Browser.window.wx.aldSendEvent('新用户第11关进入人数');
        }
    }

    refresh():void
    {
        super.refresh();
        this.ui.shuru.text = "";
    }

    private onSure():void
    {
        this.setAnswer(this.ui.rightBox,this.ui.shuru.text == "9");
    }
}