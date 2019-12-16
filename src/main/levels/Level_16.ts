import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";

export default class Level_16 extends BaseLevel{
    private ui: ui.level16UI;
    
    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level16UI();
        this.addChild(this.ui);
        this.isInit = true;

        this.addEvent(this.ui.windowImg,this.onClick);
        this.ui.sureBtn.clickHandler = new Laya.Handler(this,this.onSure);
        this.refresh();
    }

    private clickNum:number = 0;
    refresh():void
    {
        super.refresh();
        this.ui.shuru.text = "";
        this.ui.windowImg.skin = 'guanqia/16/3_pic_24_2.png';
        this.clickNum = 0;
    }

    private onClick():void
    {
        this.clickNum++;
        if(this.clickNum == 1)
        {
            this.ui.windowImg.skin = 'guanqia/16/3_pic_24_3.png';
        }
        else if(this.clickNum == 2)
        {
            this.ui.windowImg.skin = 'guanqia/16/3_pic_24_4.png';
            Laya.MouseManager.enabled = false;

            setTimeout(() => {
                this.ui.humanImg.skin = "guanqia/16/3_pic_24_11.png";
                Laya.MouseManager.enabled = true;
            }, 1000);
        }
        
    }

    private onSure():void
    {
        this.setAnswer(this.ui.rightBox,this.ui.shuru.text == "4");
    }

    onDown(sprite: Laya.Sprite):void
    {
        // sprite.startDrag(new Laya.Rectangle(this.ui.box.x,this.ui.box.y,this.ui.box.width,this.ui.box.height));
    }
    

    onUp(sprite: Laya.Sprite):void
    {
        sprite.stopDrag();
    }

}