import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";

export default class Level_37 extends BaseLevel {
    private ui: ui.level37UI;
    private clickCount: number = 0;

    private fontArr: Laya.FontClip[] = [];
    private myAnswer:number;

    private posList:number[][]= [];

    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level37UI();
        this.addChild(this.ui);
        this.isInit = true;

        for (let i = 0; i < 5; i++) {
            let itemImg: Laya.Image = this.ui["item" + i];
            itemImg.tag = [];
            this.addEvent(itemImg, this.onClick);
            this.fontArr.push(this.ui["font" + i]);

            this.posList.push([itemImg.x,itemImg.y]);
        }

        this.ui.nextBtn.clickHandler = new Laya.Handler(this,this.onClickBtn);

        this.refresh();
    }

    refresh(): void  {
        Laya.MouseManager.enabled = true;
        super.refresh();
        this.clickCount = 0;
        this.posList.sort((a: any, b: any) => {
            return Math.random() > 0.5 ? 1 : -1;
        })
        this.myAnswer = 0;
        for (let i = 0; i < this.posList.length; i++) {
            let itemImg: Laya.Image = this.ui["item" + i];
            itemImg.pos(this.posList[i][0],this.posList[i][1]);
            this.fontArr[i].removeSelf();
            this.fontArr[i].pos(-100, -100);
        }
    }

    private onClick(img: Laya.Image): void {
        if(this.clickCount == 3)
        {
            return;
        }
        this.clickCount++;
        let fc: Laya.FontClip = this.fontArr[this.clickCount - 1];
        fc.value = "" + this.clickCount;
        img.addChild(fc);
        img.tag.push(fc);
        let arr:Laya.FontClip[] = img.tag;
        for(let i = 0; i < arr.length; i++)
        {
            if(i < 3)
            {
                arr[i].pos(0,i * img.height / 3);
            }
            else
            {
                arr[i].pos(img.width - 40,(i - 3) * img.height / 3);
            }
        }
        
        this.myAnswer += Number(img.name);
    }

    private onClickBtn():void
    {
        if(this.myAnswer == 12)
        {
            this.setAnswer(this.ui.rightBox,true);
        }
        else
        {
            this.setAnswer(this.ui.rightBox,false);
            setTimeout(() => {
                this.refresh();
            }, 1200);
        }
    }
}