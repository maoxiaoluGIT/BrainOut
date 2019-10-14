import BaseLevel from "./BaseLevel";
import { ui } from "../../ui/layaMaxUI";
import RightIcon from "./RightIcon";
import WrongIcon from "./WrongIcon";

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

    private addEvent(img: Laya.Image, func: Function): void {
        img.on(Laya.Event.CLICK, this, func, [img]);
    }

    private onClick(img: Laya.Image): void {
        if (img.tag == 1)  {
            RightIcon.ins.add(img);
            Laya.MouseManager.enabled = false;
            Laya.timer.once(500, this, this.onRight);
        }
        else  {
            WrongIcon.ins.add(img);
        }
    }
}