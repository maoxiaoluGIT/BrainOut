import { ui } from "../../../ui/layaMaxUI";
import SigninCell from "./SigninCell";
import GM from "../../GM";
import { ViewID } from "../ViewID";

export default class SigninView extends ui.qiandaoUI{
    
    private itemList:SigninCell[] = [];
    private data:number[] = [1,1,1,2,3];
    constructor() { 
        super();
        for(let i = 0; i < 5; i++)
        {
            let cell:SigninCell = new SigninCell();
            this.addChild(cell);
            this.itemList.push(cell);
            if(i < 3)
            {
                cell.pos(i * 250,480);
            }
            else
            {
                cell.pos(125 + (i - 3) * 225,760);
            }
            cell.update(i,this.data[i]);
        } 
        GM.imgEffect.addEffect(this.fanhui,3);
        GM.imgEffect.addEffect(this.topImg,2);
        GM.imgEffect.addEffect(this.bottomImg,2);

        this.fanhui.on(Laya.Event.CLICK,this,this.onBack);
    }

    private onBack():void
    {
        GM.viewManager.closeView2(ViewID.signin);
    }
}