import { ui } from "../../../ui/layaMaxUI";
import GM from "../../GM";
import Session from "../../sessions/Session";
import KeyIcon from "../main/KeyIcon";
import { DataKey } from "../../sessions/DataKey";
import LogType from "../../LogType";
import { ViewID } from "../ViewID";

export default class SigninCell extends ui.qiandao1UI{
    private state:number = 0;
    private _keyNum:number = 0;
    private _index:number = 0;
    constructor() { 
        super(); 
        GM.imgEffect.addEffect(this.jinyaoshi);
        this.on(Laya.Event.CLICK,this,this.onClick);
    }

    private onClick():void
    {
        if(this.state == 1)
        {
            Session.gameData[DataKey.signinState] = 1;
            Session.gameData[DataKey.keyNum] += this._keyNum;
            Session.onSave();
            KeyIcon.fly("+" + this._keyNum);
            for(let i = 0; i < this._keyNum; i++)
            {
                GM.sysLog(LogType.get_key);
            }
            this.update(this._index,this._keyNum);
            GM.viewManager.closeView2(ViewID.signin);
        }
    }

    update(index:number,keyNum:number):void
    {
        this._index = index;
        this._keyNum = keyNum;
        let day = index + 1;
        this.tian.text = "第"+day+"天";
        this.yaoshishu.text = "X" + keyNum;
        this.lan.visible = false;
        this.gouImg.visible = false;
        this.lockImg.visible = false;
        this.state = -1;
        if(index <= Session.gameData[DataKey.signinDay])
        {
            this.jinyaoshi.skin = "pubRes/ic_key_1.png";
            this.bg.skin = "pubRes/fram_big_yellow.png";
            if(index == Session.gameData[DataKey.signinDay])
            {
                this.lan.visible = Session.gameData[DataKey.signinState] == 0;
                this.gouImg.visible = Session.gameData[DataKey.signinState] == 1;
                if(this.lan.visible)
                {
                    this.state = 1;
                }
            }
            else
            {
                this.gouImg.visible = true;
            }
        }
        else
        {
            this.jinyaoshi.skin = "pubRes/h_ic_key_1.png";
            this.bg.skin = "pubRes/fram_big.png";
            this.lockImg.visible = true;
            this.state = 3;
        }
    }
}