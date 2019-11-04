import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";
import GM from "../GM";
import RightIcon from "./RightIcon";

export default class Level_62 extends BaseLevel {
    private ui: ui.level62UI;

    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level62UI();
        this.addChild(this.ui);
        this.isInit = true;

        for(let i = 1; i <= 6; i++)
        {
            let btn:Laya.Button = this.ui["btn" + i];
            btn.clickHandler = new Laya.Handler(this,this.onClick,[btn]);
        }

        this.refresh();
    }
    private onClick(btn):void
    {
        this.setAnswer(btn,btn == this.ui.btn6);
    }

    refresh(): void  {
        Laya.MouseManager.enabled = true;
        super.refresh();
    }
}