import BaseLevel from "./BaseLevel";
import { ui } from "../../ui/layaMaxUI";

export default class Level_1 extends BaseLevel {
    private ui: ui.level1UI;
    static itemskins: any[] = [
        { skin: "guanqia/1/3_pic_3_1.png", right: 1, ww: 184, hh: 173 },
        { skin: "guanqia/1/pic_20_2.png", right: 0, ww: 222, hh: 167 },
        { skin: "guanqia/1/pic_20_1.png", right: 0, ww: 215, hh: 256 },
        { skin: "guanqia/1/apple.png", right: 0, ww: 282, hh: 282 }
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
    }
}