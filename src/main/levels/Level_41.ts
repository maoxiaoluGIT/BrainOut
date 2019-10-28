import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";
import GM from "../GM";

export default class Level_41 extends BaseLevel {
    private ui: ui.level41UI;

    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level41UI();
        this.addChild(this.ui);
        this.isInit = true;

        for(let i = 0; i < 10; i++)
        {
            let btn = this.ui["btn" + i];
            btn.tag = i;
            this.addEvent(btn,this.onClick);
        }

        this.ui.qingchu.clickHandler = new Laya.Handler(this,this.onClear2);
        this.ui.queding.clickHandler = new Laya.Handler(this,this.onSure);

        this.refresh();
    }

    private onClear2():void
    {
        this.refresh();
    }

    private onSure():void
    {
        if(this.ui.shuzi.text == "39")
        {
            this.ui.timuBox.visible = false;
            this.ui.daanTxt.visible = true;
            setTimeout(() => {
                this.setAnswer(this.ui.rightBox,true);
            }, (300));
        }
        else
        {
            this.setAnswer(this.ui.rightBox,false);
            setTimeout(() => {
                this.refresh();
            }, 1000);
        }
        
    }

    private onClick(btn):void
    {
        if(this.ui.shuzi.text == "0")
        {
            this.ui.shuzi.text = "";
        }
        this.ui.shuzi.text += btn.tag + "";
    }

    onDown(sprite: Laya.Sprite): void  {
        sprite.startDrag();
    }

    refresh(): void  {
        Laya.MouseManager.enabled = true;
        super.refresh();

        this.ui.timuBox.visible = true;
        this.ui.daanTxt.visible = false;

        this.ui.shuzi.text = "0";
    }
}