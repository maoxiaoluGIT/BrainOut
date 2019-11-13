import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";
import GM from "../GM";
import RightIcon from "./RightIcon";
import Game from "../../core/Game";
import GameEvent from "../GameEvent";

export default class Level_5 extends BaseLevel {
    private ui: ui.level5UI;
    private _num1: number = 0;
    private _num2: number = 0;
    private _num3: number = 0;
    constructor() {
        super();
    }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level5UI();
        this.addChild(this.ui);
        this.isInit = true;

        for(let i = 0; i < 4; i++)
        {
            this.addEvent(this.ui["item" + i],this.onClick);
        }

        this.refresh();
    }

   
    private onClick(img): void  {
        this.setAnswer(img,img == this.ui.item3);
    }

    refresh(): void {
        super.refresh();
    }

}