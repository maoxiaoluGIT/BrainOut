import { ui } from "../ui/layaMaxUI";
import GM from "./GM";

export default class GameBox extends ui.gameBoxUI {
    static qiandao:string = "qiandao";
    static shezhi:string = "shezhi";
    static jiesuan:string = "jiesuan";


    fromTag:string;
    constructor() { 
        super(); 
        this.on(Laya.Event.DISPLAY,this,this.onDis);
        this.on(Laya.Event.UNDISPLAY,this,this.onUndis);
        for(let i = 0; i < 10; i++)
        {
            let gameIcon:Laya.Image = this["icon" + i];
            gameIcon.skin = "gamebox/" + GM.gamesInfo[i][0] + ".png";
            gameIcon.on(Laya.Event.CLICK,this,this.onClick,[GM.gamesInfo[i][0],GM.gamesInfo[i][1]]);
        }
    }

    private index:number;
    private isLeft:boolean;

    private onClick(id:string,gameName:string):void
    {
        console.log("点击的appid",id,gameName);
        Laya.Browser.window.wx.aldSendEvent('所有位置 icon点击数（跳转点击）');
        Laya.Browser.window.wx.navigateToMiniProgram({
        appId: id,
        path: '',
        envVersion: "release",
        success:(res)=> {
            console.log("按钮跳转小游戏成功");
            Laya.Browser.window.wx.aldSendEvent('《' + gameName + '》点击允许的次数');
            Laya.Browser.window.wx.aldSendEvent('所有位置 导出成功人数');

            if(this.fromTag == GameBox.qiandao)
            {
                Laya.Browser.window.wx.aldSendEvent('签到界面跳转成功');
            }
            else if(this.fromTag == GameBox.shezhi)
            {
                Laya.Browser.window.wx.aldSendEvent('设置界面跳转成功');
            }
            else if(this.fromTag == GameBox.jiesuan)
            {
                Laya.Browser.window.wx.aldSendEvent('结算页跳转成功');
            }
        },
        fail:(res)=>{
            console.log("按钮跳转小游戏失败");
            Laya.Browser.window.wx.aldSendEvent('《' + gameName + '》点击取消的次数');
            Laya.Browser.window.wx.aldSendEvent('所有位置 导出失败人数');

            if(this.fromTag == GameBox.qiandao)
            {
                Laya.Browser.window.wx.aldSendEvent('签到界面跳转失败');
            }
            else if(this.fromTag == GameBox.shezhi)
            {
                Laya.Browser.window.wx.aldSendEvent('设置界面跳转失败');
            }
            else if(this.fromTag == GameBox.jiesuan)
            {
                Laya.Browser.window.wx.aldSendEvent('结算页跳转失败');
            }
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