import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";
import GM from "../GM";

export default class Level_32 extends BaseLevel {
    private ui: ui.level32UI;
    private quanList:Laya.Image[] = [];

    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level32UI();
        this.addChild(this.ui);
        this.isInit = true;

        this.addEvent(this.ui.er,this.onClick);

        this.refresh();
    }

    private onClick(img:Laya.Image):void
    {
        this.setAnswer(img,true);
    }


    refresh():void
    {
        Laya.MouseManager.enabled = true;
        super.refresh();
    }
}