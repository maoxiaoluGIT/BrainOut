import { ui } from "../../../ui/layaMaxUI";
import SysTitles from "../../sys/SysTitles";
import Session from "../../sessions/Session";
import Game from "../../../core/Game";
import GameEvent from "../../GameEvent";
import GM from "../../GM";
import { ViewID } from "../ViewID";
import MyEffect from "../../../core/utils/MyEffect";
import { DataKey } from "../../sessions/DataKey";

export default class CellItem extends ui.xuanguan2UI {
    private sys:SysTitles;
    private _state:number;
    constructor() { 
        super(); 
        this.on(Laya.Event.CLICK,this,this.onClick);

        let t = new Laya.TimeLine();
        t.to( this.curImg , { rotation:-50 } , 200 ,null,300);
        t.to( this.curImg , { rotation:0 } , 200,null,300 );
        t.play(0,true);
    }

    private onClick():void
    {
        if(this._state >= 3)
        {
            return;
        }
        GM.viewManager.showView(ViewID.main);
        Game.eventManager.event(GameEvent.SELECT_CELL,this.sys.id)
    }

    public update(sys:SysTitles):void
    {
        this.sys = sys;
        this.nullTxt.visible = this.sys == null;
        this.shuzi.visible = false;
        this.gridImg.visible = false;
        this.gouImg.visible = false;
        this.curImg.visible = false;
        this.lockImg.visible = false;
        this._state = 4;
        if(this.sys)
        {
            if(sys.id <= Session.gameData[DataKey.maxIndex])
            {
                this._state = 1;
            }
            else if(sys.id <= Session.gameData[DataKey.maxIndex] + 1)
            {
                this._state = 2;
            }
            else
            {
                this._state = 3;
            }
            this.shuzi.visible = true;
            this.shuzi.skin = this._state <= 2 ? "pubRes/shuzi.png" : "pubRes/shuzi4.png";
            this.shuzi.value = this.getVV(sys.stageLv);
            this.gridImg.visible = this._state <= 2;
            this.gouImg.visible = this._state == 1;
            this.curImg.visible = this._state == 2;
            this.lockImg.visible = this._state == 3;
        }
    }

    private getVV(vv:number):string
    {
        if(vv < 10)
        {
            return "0" + vv;
        }
        return "" + vv;
    }
}