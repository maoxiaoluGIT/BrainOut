import { ui } from "../../ui/layaMaxUI";
import PlatformID from "../platforms/PlatformID";
import GM from "../GM";
import MainGameBox from "./MainGameBox";
import RightGameBox from "./RightGameBox";
import CenterGameBox from "./CenterGameBox";

export default class OppoBox extends ui.oppo.OppoBoxUI {

    private _oppoGameBox: MainGameBox;
    private _rightGameBox: RightGameBox;
    private _centerGameBox: CenterGameBox;
    constructor() {
        super();
        this.mouseThrough = true;
        this.oppoBtn.on(Laya.Event.CLICK, this, this.onClickOppo);
        this._oppoGameBox = new MainGameBox();
        this.addChild(this._oppoGameBox);
        this._oppoGameBox.x = -750;
        this.oppoBtn.on(Laya.Event.CLICK, this, this.onClickOppo);

        this._rightGameBox = new RightGameBox();
        this.rightBox.addChild(this._rightGameBox);

        this._centerGameBox = new CenterGameBox();
        this.centerBox.addChild(this._centerGameBox);

        this.hideCenter();
    }

    hideCenter():void
    {
        this._centerGameBox.visible = false;
        this.rightBox.x = 300;
        this.rightBox.y = 30;
    }

    showCenter():void
    {
        this._centerGameBox.visible = true;
        this.rightBox.x = 600;
        this.rightBox.y = 225;
    }

    private onClickOppo(): void {
        this.redPoint.visible = false;
        Laya.Tween.to(this._oppoGameBox, { x: 0 }, 300);
    }
}