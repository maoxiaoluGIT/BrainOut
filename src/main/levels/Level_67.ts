import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";

export default class Level_67 extends BaseLevel{
    private ui: ui.level67UI;
    
    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level67UI();
        this.addChild(this.ui);
        this.isInit = true;

        this.ui.jian.on(Laya.Event.CLICK,this,this.onJian);
        this.ui.jia.on(Laya.Event.CLICK,this,this.onJia);
        this.ui.clearBtn.clickHandler = new Laya.Handler(this,this.onClear2);
        this.ui.sureBtn.clickHandler = new Laya.Handler(this,this.onSure);

        for(let i = 0; i < 11;i++)
        {
            let img = this.ui["item" + i];
            this.addEvent(img,null,true);
            img.tag = [img.x,img.y];
        }
        this.addEvent(this.ui.clearBtn,null,true);
        this.ui.clearBtn.tag = [this.ui.clearBtn.x,this.ui.clearBtn.y];
        this.refresh();
    }

    private onClear2():void
    {
        this._value = 0;
        this.ui.shuzi.value = "" + this._value;
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
        for(let i = 0; i < 11;i++)
        {
            let img = this.ui["item" + i];
            img.pos(img.tag[0],img.tag[1]);
        }
        this._value = 0;
        this.ui.shuzi.value = "" + this._value;

        this.ui.clearBtn.pos(this.ui.clearBtn.tag[0],this.ui.clearBtn.tag[1]);
    }

    private onSure():void
    {
        if(this._value == 11)
        {
            this.startFly();
        }
        else
        {
            this.setAnswer(this.ui.rightBox,false);
        }
    }

    private _index:number = 0;
    private startFly():void
    {
        if(this._index > 10)
        {
            this.setAnswer(this.ui.rightBox,true);
            this.ui.clearBtn.pos(this.ui.clearBtn.tag[0],this.ui.clearBtn.tag[1]);
            return;
        }
        let img = this.ui["item" + this._index];
        img.scale(0.6,0.6);
        let xx = 0;
        let yy = 0;
        let fc = new Laya.FontClip("pubRes/shuzi.png","01234 56789");
        fc.value = "" + Number(this._index + 1);
        img.addChild(fc);
        Laya.Tween.to(img,{x:this.ui["pos" + this._index].x,y:this.ui["pos" + this._index].y},100,null,new Laya.Handler(this,this.startFly));
        this._index++;
    }

}