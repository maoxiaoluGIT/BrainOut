import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";

export default class Level_51 extends BaseLevel{
    private ui: ui.level51UI;

    private posList:number[][] = [];
    private posList2:number[][] = [];
    
    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level51UI();
        this.addChild(this.ui);
        this.isInit = true;

        this.ui.jian.on(Laya.Event.CLICK,this,this.onJian);
        this.ui.jia.on(Laya.Event.CLICK,this,this.onJia);
        this.ui.clearBtn.clickHandler = new Laya.Handler(this,this.refresh);
        this.ui.sureBtn.clickHandler = new Laya.Handler(this,this.onSure);

        for(let i = 0; i < 6;i++)
        {
            let img:Laya.Image = this.ui["item" + i];
            this.addEvent(img,null,true);
            this.posList.push([img.x,img.y]);
            this.posList2.push([img.x,img.y]);

            if(i < 4)
            {
                img = this.ui["img" + i];
                this.addEvent(img,null,true);
            }
        }
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

    onDown(sprite: Laya.Sprite):void
    {
        sprite.startDrag(new Laya.Rectangle(this.ui.box.x,this.ui.box.y,this.ui.box.width,this.ui.box.height));
    }

    private _value:number;
    refresh(): void {
        super.refresh();
        this.posList2.sort((a,b)=>{return Math.random() > 0.5 ? 1 : -1});
        for(let i = 0; i < 6;i++)
        {
            let img:Laya.Image = this.ui["item" + i];
            img.pos(this.posList[i][0],this.posList[i][1]);

            if(i < 4)
            {
                let img:Laya.Image = this.ui["item" + i];
                img.pos(this.posList2[i][0],this.posList2[i][1]);
            }
        }
        this._value = 0;
        this.ui.shuzi.value = "" + this._value;
    }

    private onSure():void
    {
        this.setAnswer(this.ui.rightBox,this._value == 10);
    }

}