import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";

export default class Level_12 extends BaseLevel {
    private ui: ui.level12UI;
    private clickCount: number = 0;

    private fontArr: Laya.FontClip[] = [];
    private myAnswerArr:string[] = [];

    private posList:number[][]= [];
    private boxList:Laya.Box[] = [];

    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level12UI();
        this.addChild(this.ui);
        this.isInit = true;

        for (let i = 0; i < 6; i++) {
            let itemImg: Laya.Box = this.ui["box" + i];
            this.addEvent(itemImg, this.onClick);
            this.fontArr.push(this.ui["font" + i]);

            this.posList.push([itemImg.x,itemImg.bottom]);
            this.boxList.push(itemImg);
        }

        this.refresh();
    }

    refresh(): void  {
        Laya.MouseManager.enabled = true;
        super.refresh();
        this.clickCount = 0;
        this.boxList.sort((a: any, b: any) => {
            return Math.random() > 0.5 ? 1 : -1;
        })
        this.myAnswerArr.length = 0;
        for (let i = 0; i < this.boxList.length; i++) {
            this.boxList[i].x = this.posList[i][0];
            this.boxList[i].bottom = this.posList[i][1];
            this.fontArr[i].removeSelf();
            this.fontArr[i].pos(-100, -100);
        }
    }

    private onClick(img: Laya.Box): void {
        this.clickCount++;
        let fc: Laya.FontClip = this.fontArr[this.clickCount - 1];
        fc.value = "" + this.clickCount;
        img.addChild(fc);
        fc.pos(0,0);
        this.myAnswerArr.push(img.name);
        if (this.clickCount == 5)  {
            let bool1:boolean = this.myAnswerArr[0] == "caomei" || this.myAnswerArr[0] == "xiangjiao";
            let bool2:boolean = this.myAnswerArr[1] == "caomei" || this.myAnswerArr[1] == "xiangjiao";
            let bool3:boolean = this.myAnswerArr[2] == "liubianxing";
            let bool4:boolean = this.myAnswerArr[3] == "yuanxing"
            let bool5:boolean = this.myAnswerArr[4] == "juxing"
            if(bool1 && bool2 && bool3 && bool4 && bool5)
            {
                this.setAnswer(this.ui.rightBox,true);
            }
        }
        else if(this.clickCount == 6)
        {
            Laya.MouseManager.enabled = false;
            this.setAnswer(this.ui.rightBox,false);
            setTimeout(() => {
                this.refresh();
            }, 800);
        }
    }
}