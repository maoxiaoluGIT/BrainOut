import { BasePlatform } from "./BasePlatform";
import GM from "../GM";
import Game from "../../core/Game";
import GameEvent from "../GameEvent";
import Session from "../sessions/Session";
import { DataKey } from "../sessions/DataKey";
import LogType from "../LogType";

export default class TTPlatform extends BasePlatform {
    private tt;
    constructor() { 
        super(); 
        this.tt = Laya.Browser.window.tt;
    }

    checkUpdate(): void {
        this.tt.setKeepScreenOn({
            keepScreenOn: true
        });

        if (this.tt.getUpdateManager) {
            GM.log("基础库 1.9.90 开始支持，低版本需做兼容处理");
            const updateManager = this.tt.getUpdateManager();
            updateManager.onCheckForUpdate(function (result) {
                if (result.hasUpdate) {
                    GM.log("有新版本");
                    updateManager.onUpdateReady(function () {
                        GM.log("新的版本已经下载好");
                        this.tt.showModal({
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
                        this.tt.showModal({
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
            this.tt.showModal({
                title: '温馨提示',
                content: '当前微信版本过低，无法使用该应用，请升级到最新微信版本后重试。'
            });
        }

        this.tt.onShow(res => {
            console.log("显示微信");
            Game.eventManager.event(GameEvent.WX_ON_SHOW);
        });

        this.tt.onHide(res => {
            console.log("隐藏微信");
            Game.eventManager.event(GameEvent.WX_ON_HIDE);
        });

        this.tt.onError(res => {
            res.message, res.stack
        });

        this.tt.updateShareMenu({});
        this.tt.showShareMenu({});
        this.tt.onShareAppMessage( ()=>{
            return this.getShareObj();
        } );
    }

    login(callback): void {
        this.tt.login(
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
        this.userBtn = this.tt.createUserInfoButton(
            {
                type: 'text',
                text: '',
                style:
                    {
                        width: this.tt.getSystemInfoSync().windowWidth,
                        height: this.tt.getSystemInfoSync().windowHeight
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
        this.tt.getSetting({
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
            this.tt.shareAppMessage(this.getShareObj());
            GM.log("主动分享");
        }
        else
        {
            this.shareTime = Date.now();
            Game.eventManager.once( GameEvent.WX_ON_SHOW ,this,this.shareSuccess,[type]);
            this.tt.shareAppMessage(this.getShareObj());
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
                this.tt.vibrateShort();
            }
            else  {
                this.tt.vibrateLong();
            }
        }
    }

    static shareMsgs:string[] = ["万万没想到，还有这种骚操作！","脑洞是个什么洞？","哎呀！妈呀！脑瓜疼！","有人@你 进来和我一起玩！"];

    private getShareObj():any
    {
        let arr:string[] = TTPlatform.shareMsgs;
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
        if(codeId == "")
        {
            this.ad = null;
        }
        if(this.ad)
        {
            this.ad.destroy();
            this.ad = null;
        }
        this.ad = this.tt.createRewardedVideoAd({adUnitId:codeId});
        if(this.ad)
        {
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
        }
        else
        {
            this.onShare(type,false);
        }
        GM.sysLog(LogType.play_ad_total);
    }

    private bannerAd;
    showBanner():void{
        const { windowWidth, windowHeight } = wx.getSystemInfoSync();
        var targetBannerAdWidth = 200;
        // 创建一个居于屏幕底部正中的广告
        this.bannerAd = this.tt.createBannerAd({
            adUnitId: "5bh4dotmr272fa2ne5",
            adIntervals:60,
            style: {
                width: targetBannerAdWidth,
                top: windowHeight - (targetBannerAdWidth / 16) * 9 // 根据系统约定尺寸计算出广告高度
            }
        });
        this.bannerAd.onError(function (res) { });
        // 也可以手动修改属性以调整广告尺寸
        this.bannerAd.style.left = (windowWidth - targetBannerAdWidth) / 2;

        // 尺寸调整时会触发回调，通过回调拿到的广告真实宽高再进行定位适配处理
        // 注意：如果在回调里再次调整尺寸，要确保不要触发死循环！！！
        this.bannerAd.onResize(size => {
            // good
            this.bannerAd.style.top = windowHeight - size.height;
            this.bannerAd.style.left = (windowWidth - size.width) / 2;
        })

        this.bannerAd.show();
    }

    showBanner2():void
    {
        this.bannerAd.show();
    }

    hideBanner():void
    {
        this.bannerAd.hide();
    }

    private recorde;
    recorder(): void {
        console.log("开始录屏");
        if (!this.recorde) {
            this.recorde = this.tt.getGameRecorderManager();
            this.recorde.onStart(res => {
            });
        }

        this.recorde.start({
            duration: 15,
        })
    }

    stopRecorder(): void {
        console.log("停止录屏");
        this.recorde.onStop(({ videoPath }) => {
            Game.eventManager.event(GameEvent.STOP_RECORDE);
            this.tt.shareVideo({
                videoPath: `${videoPath}`,
                success() {
                },
                fail(e) {
                }
            });
        })
        this.recorde.stop();
    }
}