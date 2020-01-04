import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";

export default class Level_66 extends BaseLevel{
    private ui: ui.level66UI;

    private posList:number[][] = [];
    private posList2:number[][] = [];
    
    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level66UI();
        this.addChild(this.ui);
        this.isInit = true;

        this.ui.jian.on(Laya.Event.CLICK,this,this.onJian);
        this.ui.jia.on(Laya.Event.CLICK,this,this.onJia);
        this.ui.clearBtn.clickHandler = new Laya.Handler(this,this.refresh);
        this.ui.sureBtn.clickHandler = new Laya.Handler(this,this.onSure);

        this.refresh();
    }

    private onJian():void
    {
        this._value--;
        if(this._value < 0)
        {
            this._value = 0;
        }
        this.ui.shuzi.value = "" + this._value;
    }

    private onJia():void
    {
        this._value++;
        if(this._value > 99)
        {
            this._value = 99;
        }
        this.ui.shuzi.value = "" + this._value;
    }
    private _value:number;
    refresh(): void {
        super.refresh();
        this._value = 0;
        this.ui.shuzi.value = "" + this._value;
    }

    private onSure():void
    {
        this.setAnswer(this.ui.rightBox,this._value == 8);
    }

}