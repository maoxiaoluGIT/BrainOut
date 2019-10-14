import { ui } from "../../../ui/layaMaxUI";
import MainFace from "./MainFace";

export default class MainView extends ui.mainViewUI {
    private _mainFace:MainFace;
    constructor() { 
        super(); 
        this._mainFace = new MainFace();
        this.addChild(this._mainFace);
    }
}