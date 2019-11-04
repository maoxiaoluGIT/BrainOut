import { BasePlatform } from "./BasePlatform";
import GM from "../GM";
import Game from "../../core/Game";
import GameEvent from "../GameEvent";
import Session from "../sessions/Session";
import { DataKey } from "../sessions/DataKey";
import LogType from "../LogType";

export default class QQPlatform extends BasePlatform {
    private qq;
    constructor() { 
        super(); 
        this.qq = Laya.Browser.window.qq;
    }
    gameBtn;
    checkUpdate(): void {
        this.qq.setKeepScreenOn({
            keepScreenOn: true
        });

        if (this.qq.getUpdateManager) {
            GM.log("基础库 1.9.90 开始支持，低版本需做兼容处理");
            const updateManager = this.qq.getUpdateManager();
            updateManager.onCheckForUpdate(function (result) {
                if (result.hasUpdate) {
                    GM.log("有新版本");
                    updateManager.onUpdateReady(function () {
                        GM.log("新的版本已经下载好");
                        this.qq.showModal({
                            title: '更新提示',
                            content: '新版本已经下载，是否重启？',
                            success: function (result) {
                                if (result.confirm) { // 点击确定，调用 applyUpdate 应用新版本并重启
                                    updateManager.applyUpdate();
                                }
                            }
                        });
                    });
                    updateManager.onUpdateFailed(function () {
                        GM.log("新的版本下载失败");
                        this.qq.showModal({
                            title: '已经有新版本了',
                            content: '新版本已经上线啦，请您删除当前小游戏，重新搜索打开'
                        });
                    });
                }
                else {
                    GM.log("没有新版本");
                }
            });
        }
        else {
            GM.log("有更新肯定要用户使用新版本，对不支持的低版本客户端提示");
            this.qq.showModal({
                title: '温馨提示',
                content: '当前微信版本过低，无法使用该应用，请升级到最新微信版本后重试。'
            });
        }

        // this.gameBtn = this.qq.createGameClubButton({
        //     icon: 'light',
        //     style: {
        //       left: 10,
        //       top: this.qq.getSystemInfoSync().windowHeight * 0.5,
        //       width: 40,
        //       height: 40
        //     }
        //   });

        this.qq.onShow(res => {
            console.log("显示微信");
            // this.gameBtn.show();
            Game.eventManager.event(GameEvent.WX_ON_SHOW);
        });

        this.qq.onHide(res => {
            console.log("隐藏微信");
            // this.gameBtn.hide();
            Game.eventManager.event(GameEvent.WX_ON_HIDE);
        });

        this.qq.onError(res => {
            res.message, res.stack
        });

        this.qq.updateShareMenu({});
        this.qq.showShareMenu({});
        this.qq.onShareAppMessage( ()=>{
            return this.getShareObj();
        } );
    }

    login(callback): void {
        this.qq.login(
            {
                success: (res) => {
                    if (res.code) {
                        callback && callback(res.code);
                    }
                }
            });
    }

    private userBtn;
    getUserInfo(callback): void {
        if (this.userBtn)  {
            return;
        }
        this.userBtn = this.qq.createUserInfoButton(
            {
                type: 'text',
                text: '',
                style:
                    {
                        width: this.qq.getSystemInfoSync().windowWidth,
                        height: this.qq.getSystemInfoSync().windowHeight
                    }
            })
        this.userBtn.onTap((resButton) => {
            if (resButton.errMsg == "getUserInfo:ok") {
                //获取到用户信息
                GM.userHeadUrl = resButton.userInfo.avatarUrl;
                GM.userName = resButton.userInfo.nickName;
                this.filterEmoji();
                //清除微信授权按钮
                this.userBtn.destroy()
                callback && callback();
            }
            else {
                console.log("授权失败")
            }
        })
    }

    private wxAuthSetting() {
        console.log("wx.getSetting");
        this.qq.getSetting({
            success: (res) => {
                console.log(res.authSetting);
                var authSetting = res.authSetting;
                if (authSetting["scope.userInfo"]) {
                    console.log("已经授权");
                }
                else {
                    console.log("未授权");
                }
            }
        });
    }

    private filterEmoji() {
        var strArr = GM.userName.split(""),
            result = "",
            totalLen = 0;

        for (var idx = 0; idx < strArr.length; idx++) {
            // 超出长度,退出程序
            if (totalLen >= 16) break;
            var val = strArr[idx];
            // 英文,增加长度1
            if (/[a-zA-Z]/.test(val)) {
                totalLen = 1 + (+totalLen);
                result += val;
            }
            // 中文,增加长度2
            else if (/[\u4e00-\u9fa5]/.test(val)) {
                totalLen = 2 + (+totalLen);
                result += val;
            }
            // 遇到代理字符,将其转换为 "口", 不增加长度
            else if (/[\ud800-\udfff]/.test(val)) {
                // 代理对长度为2,
                if (/[\ud800-\udfff]/.test(strArr[idx + 1])) {
                    // 跳过下一个
                    idx++;
                }
                // 将代理对替换为 "口"
                result += "?";
            }
        }
        GM.userName = result;
        console.log("过滤之后", GM.userName);
    }

    onShare(type:number,isMain): void {
        if(isMain)
        {
            this.qq.shareAppMessage(this.getShareObj());
            GM.log("主动分享");
        }
        else
        {
            this.shareTime = Date.now();
            Game.eventManager.once( GameEvent.WX_ON_SHOW ,this,this.shareSuccess,[type]);
            this.qq.shareAppMessage(this.getShareObj());
            GM.log("视频失败分享");
        }
        GM.sysLog(LogType.share_msg);
    }

    private shareTime:number;

    private shareSuccess(type:number):void
    {
        if(Session.gameData[DataKey.shareTimes] > 0)
        {
            // if(Date.now() - this.shareTime >= 2500)
            // {
                Session.gameData[DataKey.shareTimes]--;
                Game.eventManager.event(GameEvent.SHARE_SUCCESS,type);
                return;
            // }
        }
    }


    shake(isRight: boolean): void  {
        if (GM.shakeState == 1) {
            if (isRight)  {
                this.qq.vibrateShort();
            }
            else  {
                this.qq.vibrateLong();
            }
        }
    }

    static shareMsgs:string[] = ["万万没想到，还有这种骚操作！","脑洞是个什么洞？","哎呀！妈呀！脑瓜疼！","有人@你 进来和我一起玩！"];

    private getShareObj():any
    {
        let arr:string[] = QQPlatform.shareMsgs;
        let obj:any = {};
        let index:number = Math.floor(arr.length * Math.random());
        obj.title = arr[index];
        obj.imageUrl = "https://img.kuwan511.com/brainOut/share.jpg";
        obj.destWidth = 500;
        obj.destHeight = 400;
        return obj;
    }

    private ad;
    playAd(codeId:string,type:number):void
    {
        if(this.ad)
        {
            this.ad.destroy();
            this.ad = null;
        }
        this.ad = this.qq.createRewardedVideoAd({adUnitId:codeId});
        this.ad.onClose( (res)=>{
            if ( res && res.isEnded || res===undefined ){
                GM.log("关闭广告");
                GM.sysLog(LogType.play_ad_com_total);
                Game.eventManager.event(GameEvent.AD_SUCCESS_CLOSE,type);
            }
        });

        this.ad.show().catch(() => {
            // 失败重试
            this.ad.load()
              .then(() => this.ad.show())
              .catch(err => {
                GM.log("广告拉取失败");
                this.onShare(type,false);
              })
          })
          GM.sysLog(LogType.play_ad_total);
    }

    showBanner(codeId:string):void{
        let obj:any = {};
        obj.adUnitId = codeId;
        let l = (Laya.Browser.clientWidth - 300)/2;
        obj.style = {left:l,top:0,width:300,height:125};
        
        let b = this.qq.createBannerAd( obj );
        b.onResize( res=>{
            b.style.top = Laya.Browser.clientHeight - res.height - 20;
        } );
        b.show();
    }
}