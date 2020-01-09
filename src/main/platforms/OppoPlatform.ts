import { BasePlatform } from "./BasePlatform";
import GM from "../GM";
import Game from "../../core/Game";
import GameEvent from "../GameEvent";
import Session from "../sessions/Session";
import { DataKey } from "../sessions/DataKey";
import LogType from "../LogType";
import PlatformID from "./PlatformID";
import { ViewID } from "../views/ViewID";

export default class OppoPlatform extends BasePlatform {
    constructor() { super(); }
    gameBtn;
    checkUpdate(): void {
        Laya.Browser.window.qg.setKeepScreenOn({
            keepScreenOn: true
        });

        // if (Laya.Browser.window.qg.getUpdateManager) {
        //     GM.log("基础库 1.9.90 开始支持，低版本需做兼容处理");
        //     const updateManager = Laya.Browser.window.qg.getUpdateManager();
        //     updateManager.onCheckForUpdate(function (result) {
        //         if (result.hasUpdate) {
        //             GM.log("有新版本");
        //             updateManager.onUpdateReady(function () {
        //                 GM.log("新的版本已经下载好");
        //                 Laya.Browser.window.qg.showModal({
        //                     title: '更新提示',
        //                     content: '新版本已经下载，是否重启？',
        //                     success: function (result) {
        //                         if (result.confirm) { // 点击确定，调用 applyUpdate 应用新版本并重启
        //                             updateManager.applyUpdate();
        //                         }
        //                     }
        //                 });
        //             });
        //             updateManager.onUpdateFailed(function () {
        //                 GM.log("新的版本下载失败");
        //                 Laya.Browser.window.qg.showModal({
        //                     title: '已经有新版本了',
        //                     content: '新版本已经上线啦，请您删除当前小游戏，重新搜索打开'
        //                 });
        //             });
        //         }
        //         else {
        //             GM.log("没有新版本");
        //         }
        //     });
        // }
        // else {
        //     GM.log("有更新肯定要用户使用新版本，对不支持的低版本客户端提示");
        //     Laya.Browser.window.qg.showModal({
        //         title: '温馨提示',
        //         content: '当前微信版本过低，无法使用该应用，请升级到最新微信版本后重试。'
        //     });
        // }

        // this.gameBtn = Laya.Browser.window.qg.createGameClubButton({
        //     icon: 'light',
        //     style: {
        //       left: 10,
        //       top: Laya.Browser.window.qg.getSystemInfoSync().windowHeight * 0.5,
        //       width: 40,
        //       height: 40
        //     }
        //   });

        Laya.Browser.window.qg.onShow(res => {
            console.log("显示微信");
            // this.gameBtn.show();
            Game.eventManager.event(GameEvent.WX_ON_SHOW);
        });

        Laya.Browser.window.qg.onHide(res => {
            console.log("隐藏微信");
            // this.gameBtn.hide();
            Game.eventManager.event(GameEvent.WX_ON_HIDE);
        });

        Laya.Browser.window.qg.initAdService({
            appId: "30222864",
            success: (res) =>{
                GM.addLog("initAdService success");
                this.preloadChaping();
            },
            fail: (res)=> {
                GM.addLog("initAdService fail:" + res.code + res.msg);
            },
            complete: (res)=> {
                GM.addLog("initAdService complete");
            }
        })

        // Laya.Browser.window.qg.onError(res => {
        //     res.message, res.stack
        // });

        // Laya.Browser.window.qg.updateShareMenu({});
        // Laya.Browser.window.qg.showShareMenu({});
        // Laya.Browser.window.qg.onShareAppMessage(() => {
        //     return this.getShareObj();
        // });
    }

    login(callback): void {
        Laya.Browser.window.qg.login(
            {
                success: (res) => {
                    console.log("oppo token", res, res.token);
                    GM.addLog("oppo token:" + res + "-------" + res.token)
                    if (res.token) {
                        callback && callback(res.token);
                    }
                },
                fail: (res) => {
                    GM.addLog("oppo login fail:" + res);
                }
            });
    }

    private userBtn;
    getUserInfo(callback): void {
        if (this.userBtn) {
            return;
        }
        this.userBtn = Laya.Browser.window.qg.createUserInfoButton(
            {
                type: 'text',
                text: '',
                style:
                    {
                        width: Laya.Browser.window.qg.getSystemInfoSync().windowWidth,
                        height: Laya.Browser.window.qg.getSystemInfoSync().windowHeight
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
        Laya.Browser.window.qg.getSetting({
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

    onShare(type: number, isMain): void {
        if (isMain) {
            Laya.Browser.window.qg.shareAppMessage(this.getShareObj());
            GM.log("主动分享");
        }
        else {
            this.shareTime = Date.now();
            Game.eventManager.once(GameEvent.WX_ON_SHOW, this, this.shareSuccess, [type]);
            Laya.Browser.window.qg.shareAppMessage(this.getShareObj());
            GM.log("视频失败分享");
        }
        GM.sysLog(LogType.share_msg);
    }

    private shareTime: number;

    private shareSuccess(type: number): void {
        if (Session.gameData[DataKey.shareTimes] > 0) {
            // if(Date.now() - this.shareTime >= 2500)
            // {
            Session.gameData[DataKey.shareTimes]--;
            Game.eventManager.event(GameEvent.SHARE_SUCCESS, type);
            return;
            // }
        }
    }


    shake(isRight: boolean): void {
        if (GM.shakeState == 1) {
            if (isRight) {
                Laya.Browser.window.qg.vibrateShort();
            }
            else {
                Laya.Browser.window.qg.vibrateLong();
            }
        }
    }

    static shareMsgs: string[] = ["万万没想到，还有这种骚操作！", "脑洞是个什么洞？", "哎呀！妈呀！脑瓜疼！", "有人@你 进来和我一起玩！"];

    private getShareObj(): any {
        let arr: string[] = OppoPlatform.shareMsgs;
        let obj: any = {};
        let index: number = Math.floor(arr.length * Math.random());
        obj.title = arr[index];
        obj.imageUrl = "https://img.kuwan511.com/brainOut/share.jpg";
        obj.destWidth = 500;
        obj.destHeight = 400;
        return obj;
    }

    private videoAd;
    private _type: number;
    playAd(codeId: string, type: number): void {
        if (this.videoAd) {
            this.videoAd.destroy();
            this.videoAd = null;
        }
        this._type = type;
        // if (!this.ad) {
        this.videoAd = Laya.Browser.window.qg.createRewardedVideoAd({ adUnitId: codeId });
        this.videoAd.offError(function (res) { });
        this.videoAd.offLoad(function (res) { });
        this.videoAd.offClose(function (res) { });
        this.videoAd.onError(function (res) {
            GM.addLog('videoAd onError====' + res.errMsg);
        })
        this.videoAd.onVideoStart(function () {
            GM.addLog('激励视频 开始播放');
        })
        this.videoAd.onClose((res) => {
            GM.addLog('videoAd onClose=====' + res);
            if (res.isEnded) {
                GM.addLog("关闭广告");
                GM.sysLog(LogType.play_ad_com_total);
                Game.eventManager.event(GameEvent.AD_SUCCESS_CLOSE, this._type);
            }
        });
        this.videoAd.onLoad((res) => {
            if (res.msg == "ok") {
                GM.addLog('激励视频加载成功' + this.videoAd);
                this.videoAd.show();
            }
            else {
                GM.addLog('激励视频加载失败');
                // this.onShare(this._type, false);
            }
        });
        this.videoAd.load();
    }


    private isBool: boolean;
    showBanner(bannerId?: string): void {
        let sysInfo = Laya.Browser.window.qg.getSystemInfoSync();
        GM.addLog("======================" + sysInfo.model + "," + sysInfo.windowWidth + "," + sysInfo.windowHeight + "," + sysInfo.pixelRatio);
        let obj: any = {};
        obj.adUnitId = "142892";
        obj.style = { left: 0, top: sysInfo.windowHeight - 100, width: sysInfo.windowWidth, height: 100 };

        if (!this.banner) {
            this.banner = Laya.Browser.window.qg.createBannerAd(obj);
            this.banner.onError((res) => {
                GM.addLog("banner error====" + res.errMsg);
            });

            this.banner.onResize((res) => {
                this.banner.style.top = sysInfo.windowHeight - res.height;
                GM.addLog("banner top=========" + this.banner.style.top + "," + res.height);
            });

            this.banner.onHide((res) => {
                console.log("调用banner的hide", this.isBool);
                if (!this.isBool)  {
                    if (Session.gameData[DataKey.bannerTimes] > 0) {
                        Session.gameData[DataKey.bannerTimes]--;
                        Session.onSave();
                        console.log("刷新banner的次数");
                    }
                }
            });
        }
        
        if (Session.gameData[DataKey.bannerTimes] > 0) {
            this.isBool = false;
            this.banner.show();
            console.log("显示banner");
        }
    }

    showOVBanner(viewId): void {
        if (GM.platformId == PlatformID.OPPO || GM.platformId == PlatformID.VIVO) {
            if (viewId == ViewID.setting) {
                this.showBanner("142892");
            }
            else if (viewId == ViewID.signin) {
                this.showBanner("142893");
            }
        }
    }

    hideBanner(): void {
        console.log("自动隐藏banner");
        this.isBool = true;
        // this.banner && this.banner.offHide();
        this.banner && this.banner.hide();
    }


    private preloadChaping():void
    {
        this.insertAds = Laya.Browser.window.qg.createInsertAd({
            adUnitId: '142904'
        });
        this.insertAds.onError((res) => {
            GM.addLog("insertAD error====" + res.errMsg);
        });
        this.insertAds.onClose(() => {
            if (Session.gameData[DataKey.insertAdTimes] > 0) {
                Session.gameData[DataKey.insertAdTimes]--;
                Session.onSave();
            }
        });
        this.insertAds.load();
        this.insertAds.onLoad((res) => {
            console.log('插屏已经加载好了');
        });
    }

    private lastTime:number;
    private insertAds;
    InsertAd(codeId?): void {
        if(this.lastTime != null)
        {
            if(Date.now() <= this.lastTime)
            {
                return;
            }
        }

        console.log("显示插屏");
        this.hideBanner();

        // if (this.insertAds) {
        //     this.insertAds.destroy();
        // }

        // this.insertAds = Laya.Browser.window.qg.createInsertAd({
        //     adUnitId: codeId
        // });
        // this.insertAds.onError((res) => {
        //     GM.addLog("insertAD error====" + res.errMsg);
        // });
        // this.insertAds.onClose(() => {
        //     if (Session.gameData[DataKey.insertAdTimes] > 0) {
        //         Session.gameData[DataKey.insertAdTimes]--;
        //         Session.onSave();
        //     }
        // });
        // this.insertAds.load();
        // this.insertAds.onLoad((res) => {
            
        // });
        if (Session.gameData[DataKey.insertAdTimes] > 0) {
            this.insertAds.show();
            this.preloadChaping();
        }
        this.lastTime = Date.now() + 60000;
    }
}