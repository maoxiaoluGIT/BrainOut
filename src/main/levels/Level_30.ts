import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";
import GM from "../GM";

export default class Level_30 extends BaseLevel {
    private ui: ui.level30UI;

    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level30UI();
        this.addChild(this.ui);
        this.isInit = true;

        this.refresh();
    }

    refresh(): void {
        Laya.MouseManager.enabled = true;
        super.refresh();
    }
}