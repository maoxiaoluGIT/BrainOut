import { ui } from "../ui/layaMaxUI";
import GM from "./GM";

export default class GameBox extends ui.gameBoxUI {
    constructor() { 
        super(); 
        this.on(Laya.Event.DISPLAY,this,this.onDis);
        this.on(Laya.Event.UNDISPLAY,this,this.onUndis);
        for(let i = 0; i < 10; i++)
        {
            let gameIcon:Laya.Image = this["icon" + i];
            gameIcon.skin = "gamebox/" + GM.gamesInfo[i][0] + ".png";
            gameIcon.on(Laya.Event.CLICK,this,this.onClick,[GM.gamesInfo[i][0]]);
        }
    }

    private index:number;
    private isLeft:boolean;

    private onClick(id:string):void
    {
        console.log("点击的appid",id);
        Laya.Browser.window.wx.navigateToMiniProgram({
        appId: id,
        path: '',
        envVersion: "release",
        success(res) {
            console.log("按钮跳转小游戏成功");
        }
        });
    }

    private onDis():void
    {
        this.index = 0;
        this.isLeft = true;
        this.box.x = 0;
        Laya.timer.loop(2500,this,this.onLoop);
    }

    private onUndis():void
    {
        this.index = 0;
        this.isLeft = true;
        this.box.x = 0;
        Laya.timer.clear(this,this.onLoop);
        Laya.Tween.clearTween(this.box);
    }

    private onLoop():void
    {
        if(this.isLeft)
        {
            this.index++;
            if(this.index > 6)
            {
                this.isLeft = false;
            }
        }
        else
        {
            this.index--;
            if(this.index <= 1)
            {
                this.isLeft = true;
            }
        }

        if(this.isLeft)
        {
            Laya.Tween.to(this.box,{x:this.box.x - 186},1000);
        }
        else
        {
            Laya.Tween.to(this.box,{x:this.box.x + 186},1000);
        }
        
    }

}