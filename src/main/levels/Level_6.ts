import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";
import Session from "../sessions/Session";

export default class Level_6 extends BaseLevel {
    private ui: ui.level6UI;

    constructor() { super(); }

    private curValue: number;

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level6UI();
        this.addChild(this.ui);
        this.isInit = true;

        this.ui.jian.on(Laya.Event.CLICK, this, this.onJian);
        this.ui.jia.on(Laya.Event.CLICK, this, this.onJia);
        this.ui.clearBtn.clickHandler = new Laya.Handler(this, this.refresh);
        this.ui.sureBtn.clickHandler = new Laya.Handler(this, this.onSure);

        this.curValue = 0;
        this.ui.shuzi.value = "" + this.curValue;

        if (Session.isNew)  {
            Laya.Browser.window.wx.aldSendEvent('新用户第6关进入人数');
        }
    }

    private onJian(): void  {
        if (this.curValue == 0)  {
            return;
        }
        this.curValue--;
        this.ui.shuzi.value = "" + this.curValue;
    }

    private onJia(): void  {
        if (this.curValue == 99)  {
            return;
        }
        this.curValue++;
        this.ui.shuzi.value = "" + this.curValue;
    }

    refresh(): void  {
        this.curValue = 0;
        this.ui.shuzi.value = "" + this.curValue;
    }

    private onSure(): void  {
        this.setAnswer(this.ui.rightBox, this.curValue == 11);
    }
}