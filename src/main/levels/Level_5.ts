import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";

export default class Level_5 extends BaseLevel{
    private ui: ui.level5UI;

    static itemskins: any[] = [
        { skin: "guanqia/5/pic_03_4.png", right: 0, ww: 267, hh: 256 },
        { skin: "guanqia/5/pic_03_3.png", right: 0, ww: 267, hh: 271 },
        { skin: "guanqia/5/pic_03_2.png", right: 0, ww: 268, hh: 165 },
        { skin: "guanqia/5/pic_.png", right: 1, ww: 262, hh: 271 },
        { skin: "guanqia/5/pic_39_2.png", right: 0, ww: 273, hh: 268 },
    ];
    
    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level5UI();
        this.addChild(this.ui);
        this.isInit = true;

        for (let i = 0; i < 5; i++)  {
            let itemImg: Laya.Image = this.ui["item" + i];
            this.addEvent(itemImg, null,true);
        }

        this.refresh();
    }

    refresh(): void {
        super.refresh();
        let skins: any[] = Level_5.itemskins;
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

    onDown(sprite: Laya.Sprite):void
    {
        sprite.startDrag(new Laya.Rectangle(this.ui.box.x,this.ui.box.y,this.ui.box.width,this.ui.box.height));
    }

    onUp(sprite):void
    {
        super.onUp(sprite);

        if(sprite.tag == 1)
        {
            if(sprite.x < 131 || sprite.x > 619)
            {
                this.setAnswer(this.ui.rightBox,true);
            }
        }
    }

}