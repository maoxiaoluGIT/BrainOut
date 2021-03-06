import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";

export default class Level_71 extends BaseLevel{
    private ui: ui.level71UI;
    private posList:number[][] = [];
    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level71UI();
        this.addChild(this.ui);
        this.isInit = true;

        this.ui.item0.name = "item0";
        this.ui.item1.name = "item1";
        this.ui.item2.name = "item2";
        this.ui.item3.name = "item3";

        this.ui.bigBox.name = "bigBox";

        this.addEvent(this.ui.item0,this.onClickImg,true);
        this.addEvent(this.ui.item1,this.onClickImg,true);
        this.addEvent(this.ui.item2,this.onClickImg,true);
        this.addEvent(this.ui.item3,this.onClickImg,true);
        this.addEvent(this.ui.bigBox,null,true);

        this.posList = [[this.ui.item0.x,this.ui.item0.y],[this.ui.item1.x,this.ui.item1.y],[this.ui.item2.x,this.ui.item2.y],[this.ui.item3.x,this.ui.item3.y]];
        this.refresh();
    }

    private onClickImg():void
    {
        console.log("点击图片");
    }


    private _curName:string;
    private _startTime:number;
    onDown(sprite: Laya.Sprite):void
    {
        console.log("================" + sprite.name);
        if(this._curName != null)
        {
            return;
        }
        this._startTime = Date.now();
        this._curName = sprite.name;
        sprite.startDrag();
    }

    onUp(sprite:Laya.Sprite):void
    {
        this._curName = null;
        if(Date.now() - this._startTime < 200)
        {
            this.onClick(sprite);
        }
        else
        {
            super.onUp(sprite);
        }
    }

    refresh(): void  {
        Laya.MouseManager.enabled = true;
        super.refresh();
        this.ui.item0.pos(this.posList[0][0],this.posList[0][1]);
        this.ui.item1.pos(this.posList[1][0],this.posList[1][1]);
        this.ui.item2.pos(this.posList[2][0],this.posList[2][1]);
        this.ui.item3.pos(this.posList[3][0],this.posList[3][1]);
        this.ui.bigBox.pos(0,40);
    }

    private onClick(img): void {
        if(img == this.ui.bigBox)
        {
            return;
        }
        this.setAnswer(img,img == this.ui.item3);
    }
}