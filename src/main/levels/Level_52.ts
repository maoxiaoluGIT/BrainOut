import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";
import GM from "../GM";
import RightIcon from "./RightIcon";
import Game from "../../core/Game";
import GameEvent from "../GameEvent";

export default class Level_52 extends BaseLevel {
    private ui: ui.level52UI;

    constructor() { 
        super(); 
    }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level52UI();
        this.addChild(this.ui);
        this.isInit = true;

        this.addEvent(this.ui.maoBox,this.onClick);
        this.addEvent(this.ui.img,this.onClick);
    }

    private onClick(sprite):void
    {
        this.setAnswer(sprite,sprite == this.ui.maoBox);
    }

}