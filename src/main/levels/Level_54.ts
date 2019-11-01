import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";
import GM from "../GM";
import RightIcon from "./RightIcon";
import Game from "../../core/Game";
import GameEvent from "../GameEvent";

export default class Level_54 extends BaseLevel {
    private ui: ui.level54UI;
    private _num1: number = 0;
    private _num2: number = 0;
    private _num3: number = 0;
    constructor() {
        super();
    }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level54UI();
        this.addChild(this.ui);
        this.isInit = true;

        this.addEvent(this.ui.huang, this.onClick1);
        this.addEvent(this.ui.lv, this.onClick2);
        this.addEvent(this.ui.huang2, this.onClick3);

        this.refresh();
    }

    private onClick1(img): void  {
        this._num1++;
        this.ui.fc1.visible = true;
        this.ui.fc1.value = "" + this._num1;

        if (this._num1 >= 8)  {
            this.onWrong();
        }
    }

    private onClick2(img): void  {
        this._num2++;
        this.ui.fc2.visible = true;
        let total:number = this._num2 + this._num3;
        this.ui.fc2.value = "" + total;
        if (this._num2 == 3)  {
            this.ui.huang2.visible = true;
            setTimeout(() => {
                this.ui.huang2.visible = false;
            }, 2000);
        }

        if (this._num2 == 5 && this._num1 == 3 && this._num3 == 0)  {
            this.setAnswer(this.ui.rightBox, true);
        }

        if(this._num1 + this._num2 + this._num3 > 8)
        {
            this.setAnswer(this.ui.rightBox,false);
        }
    }

    private onClick3(img): void  {
        this._num3++;
        this.ui.fc2.visible = true;
        let total:number = this._num2 + this._num3;
        this.ui.fc2.value = "" + total;
        if (this._num3 >= 2)  {
            this.onWrong();
        }
    }

    private onWrong(): void  {
        this.setAnswer(this.ui.rightBox, false);
        setTimeout(() => {
            this.refresh();
        }, 1300);
    }

    refresh(): void {
        super.refresh();
        this._num1 = this._num2 = this._num3 = 0;
        this.ui.fc1.value = "" + this._num1;
        this.ui.fc2.value = "" + this._num2;
        this.ui.fc1.visible = this.ui.fc2.visible = false;
        this.ui.huang2.visible = false;
    }

}