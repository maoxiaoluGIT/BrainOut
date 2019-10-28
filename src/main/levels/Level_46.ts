import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";
import GM from "../GM";

export default class Level_46 extends BaseLevel {
    private ui: ui.level46UI;

    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level46UI();
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
        if(this.ui.shuzi.text == "909")
        {
            Laya.Tween.to(this.ui.item15,{x:200,y:440},800,null,new Laya.Handler(this,()=>{
                this.setAnswer(this.ui.rightBox,true);
            }));
        }
        else
        {
            this.setAnswer(this.ui.rightBox,false);
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

        this.ui.shuzi.text = "0";
    }
}