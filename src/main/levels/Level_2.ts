import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";
import RightIcon from "./RightIcon";
import WrongIcon from "./WrongIcon";

export default class Level_2 extends BaseLevel{
    private ui: ui.level2UI;
    
    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level2UI();
        this.addChild(this.ui);
        this.isInit = true;
    }
    private onClick(img: Laya.Image): void {
        if (img.tag == 1)  {
            RightIcon.ins.add(img);
            Laya.MouseManager.enabled = false;
            Laya.timer.once(500, this, this.onRight);
        }
        else  {
            WrongIcon.ins.add(img);
        }
    }
}