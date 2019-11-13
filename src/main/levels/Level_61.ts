import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";
import GM from "../GM";
import RightIcon from "./RightIcon";
import Game from "../../core/Game";
import GameEvent from "../GameEvent";

export default class Level_61 extends BaseLevel {
    private ui: ui.level61UI;

    constructor() {
        super();
    }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level61UI();
        this.addChild(this.ui);
        this.isInit = true;

        this.addEvent(this.ui.maoBox, this.onClick);
        this.addEvent(this.ui.img, this.onClick);
        this.refresh();
    }

    refresh(): void  {
        super.refresh();
    }

    private onClick(sprite): void  {
        this.setAnswer(sprite, sprite == this.ui.maoBox);
    }

}