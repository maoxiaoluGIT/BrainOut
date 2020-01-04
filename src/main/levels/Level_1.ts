import BaseLevel from "./BaseLevel";
import { ui } from "../../ui/layaMaxUI";
import Session from "../sessions/Session";
import GM from "../GM";
import PlatformID from "../platforms/PlatformID";

export default class Level_1 extends BaseLevel {
    private ui: ui.level1UI;
    private isClick:boolean = false;
    static itemskins: any[] = [
        { skin: "guanqia/1/3_pic_3_1.png", right: 1 },
        { skin: "guanqia/1/pic_20_2.png", right: 0 },
        { skin: "guanqia/1/pic_20_1.png", right: 0 },
        { skin: "guanqia/1/apple.png", right: 0 }
    ];
    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level1UI();
        this.addChild(this.ui);

        for (let i = 0; i < 4; i++)  {
            let itemImg: Laya.Image = this.ui["item" + i];
            this.addEvent(itemImg, this.onClick);
        }

        this.refresh();

        this.isInit = true;
    }

    refresh(): void {
        super.refresh();
        let skins: any[] = Level_1.itemskins;
        skins.sort((a: any, b: any) => {
            return Math.random() > 0.5 ? 1 : -1;
        })
        for (let i = 0; i < skins.length; i++)  {
            let obj:any = skins[i];
            let itemImg: Laya.Image = this.ui["item" + i];
            itemImg.skin = obj.skin;
            itemImg.tag = obj.right;
            itemImg.size(obj.ww,obj.hh);
        }
    }

    private onClick(img: Laya.Image): void {
        this.setAnswer(img,img.tag == 1);
        if(!this.isClick)
        {
            if(Session.isNew)
            {
                if(GM.platformId == PlatformID.WX)
                {
                    Laya.Browser.window.wx.aldSendEvent('新用户首关点击人数');
                }
            }
        }
    }
}