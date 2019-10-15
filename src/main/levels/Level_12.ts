import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";

export default class Level_12 extends BaseLevel {
    private ui: ui.level12UI;
    private clickCount: number = 0;

    private fontArr: Laya.FontClip[] = [];
    private answerArr:string[] = [];
    private myAnswerArr:string[] = [];

    static itemskins: any[] = [
        { skin: "guanqia/12/pic_03_3.png", type: 2, ww: 175, hh: 175,name:"圆形" },
        { skin: "guanqia/12/pic_.png", type: 2,ww: 176, hh: 176 ,name:"矩形"},
        { skin: "guanqia/12/pic_20_1.png", type: 1, ww: 193, hh: 193 ,name:"草莓"},
        { skin: "guanqia/12/pic_20_2.png", type: 1, ww: 256, hh: 128,name:"香蕉" },
        { skin: "guanqia/12/pic_20_3_1.png", type: 3, ww: 227, hh: 227,name:"南瓜" },
        { skin: "guanqia/12/pic_20_4.png", type: 2, ww: 175, hh: 175 ,name:"六边形"}
    ];

    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level12UI();
        this.addChild(this.ui);
        this.isInit = true;

        for (let i = 0; i < 6; i++) {
            let itemImg: Laya.Image = this.ui["item" + i];
            this.addEvent(itemImg, this.onClick);
            this.fontArr.push(this.ui["font" + i]);
        }

        this.refresh();
    }

    refresh(): void  {
        Laya.MouseManager.enabled = true;
        super.refresh();
        this.clickCount = 0;
        let skins: any[] = Level_12.itemskins;
        skins.sort((a: any, b: any) => {
            return Math.random() > 0.5 ? 1 : -1;
        })
        this.answerArr.length = 0;
        this.myAnswerArr.length = 0;
        for (let i = 0; i < skins.length; i++) {
            let obj: any = skins[i];
            let itemImg: Laya.Image = this.ui["item" + i];
            itemImg.skin = obj.skin;
            itemImg.size(obj.ww, obj.hh);

            this.fontArr[i].removeSelf();
            this.fontArr[i].pos(-100, -100);

            if(obj.type == 1)
            {
                this.answerArr.push(obj.skin);
            }
        }
        this.answerArr.push("guanqia/12/pic_20_4.png","guanqia/12/pic_03_3.png","guanqia/12/pic_.png");
    }

    private onClick(img: Laya.Image): void {
        this.clickCount++;
        let fc: Laya.FontClip = this.fontArr[this.clickCount - 1];
        fc.value = "" + this.clickCount;
        img.addChild(fc);
        fc.pos(20 + 80 * Math.random(), 20 + 80 * Math.random());
        this.myAnswerArr.push(img.skin);
        if (this.clickCount == 5)  {
            Laya.MouseManager.enabled = false;
            let isRight:boolean = true;
            for (let i = 0; i < 5; i++) {
                if(this.answerArr[i] != this.myAnswerArr[i])
                {
                    isRight = false;
                    break;
                }
            }
            this.setAnswer(this.ui.rightBox,isRight);
            if(!isRight)
            {
                setTimeout(() => {
                    this.refresh();
                }, 800);
            }
        }
        else if(this.clickCount == 6)
        {
            this.setAnswer(this.ui.rightBox,false);
        }
    }
}