import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";
import Session from "../sessions/Session";

export default class Level_76 extends BaseLevel {
    private ui: ui.level76UI;

    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level76UI();
        this.addChild(this.ui);
        this.isInit = true;

        this.ui.startBtn.clickHandler = new Laya.Handler(this, this.onStart);
        this.refresh();
    }

    private _startTime: number;
    private onStart(): void  {
        if (this._btnState == 0)  {
            this._btnState = 1;
            this.ui.startBtn.label = "暂停";
            this._startTime = Date.now();
            Laya.timer.frameLoop(1, this, this.onLoop);
        }
        else if (this._btnState == 1)  {
            Laya.timer.clear(this, this.onLoop);
            this._btnState = 0;
            this.ui.startBtn.label = "开始";

            if(this._curIndex == 2)
            {
                this.setAnswer(this.ui.rightBox,true);
            }
        }
    }

    private onLoop(): void  {
        if(this._curIndex != 2)
        {
            if (Date.now() - this._startTime >= 350)  {
                this.resetImgs();
                this._curIndex++;
                if (this._curIndex > 4)  {
                    this._curIndex = 0;
                }
                let img = this.ui["img" + this._curIndex];
                img.skin = "guanqia/76/pic_14_2.png";
                this._startTime = Date.now();
            }
        }
        else
        {
            if (Date.now() - this._startTime >= 200)  {
                this.resetImgs();
                this._curIndex++;
                if (this._curIndex > 4)  {
                    this._curIndex = 0;
                }
                let img = this.ui["img" + this._curIndex];
                img.skin = "guanqia/76/pic_14_2.png";
                this._startTime = Date.now();
            }
        }
    }

    private resetImgs(): void  {
        this.ui.img0.skin = "guanqia/76/pic_14_1.png";
        this.ui.img1.skin = "guanqia/76/pic_14_1.png";
        this.ui.img2.skin = "guanqia/76/pic_14_1.png";
        this.ui.img3.skin = "guanqia/76/pic_14_1.png";
        this.ui.img4.skin = "guanqia/76/pic_14_1.png";
    }

    private _btnState = 0;
    private _curIndex: number = 0;
    refresh(): void  {
        super.refresh();
        this.ui.startBtn.label = "开始";
        this._btnState = 0;
        this._curIndex = 0;
        Laya.timer.clear(this, this.onLoop);
    }
}