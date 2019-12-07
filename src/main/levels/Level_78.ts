import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";
import Session from "../sessions/Session";

export default class Level_78 extends BaseLevel{
    private ui: ui.level78UI;
    
    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level78UI();
        this.addChild(this.ui);
        this.isInit = true;

        this.addEvent(this.ui.item0,this.onClick);
        this.addEvent(this.ui.item1,this.onClick);
        this.addEvent(this.ui.item2,this.onClick);
        this.addEvent(this.ui.item3,this.onClick);
        this.addEvent(this.ui.item4,this.onClick);
    }

    private onClick(sprite):void
    {
        this.setAnswer(sprite,sprite == this.ui.item4);
    }
    
    refresh():void
    {
        super.refresh();
    }
}