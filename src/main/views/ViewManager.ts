import MainView from "./main/MainView";
import { ViewID } from "./ViewID";
import Game from "../../core/Game";
import GM from "../GM";
import PlatformID from "../platforms/PlatformID";
import OppoPlatform from "../platforms/OppoPlatform";
import Session from "../sessions/Session";
import { DataKey } from "../sessions/DataKey";

export default class ViewManager {

    allView: any = {};
    showView(viewId: ViewID): void {
        let curView = this.allView[viewId];
        if (curView == null) {
            let VIEW = Laya.ClassUtils.getClass(viewId + "");
            if (VIEW) {
                this.allView[viewId] = new VIEW();
            }
        }
        curView = this.allView[viewId];
        Game.layerManager.viewLayer.removeChildren();
        Game.layerManager.viewLayer.addChild(curView);
        Game.layerManager.y = (Laya.stage.height - Laya.stage.designHeight) * 0.5;

        if (GM.platform instanceof OppoPlatform)  {
            if (viewId == ViewID.cells)  {
                (GM.platform as OppoPlatform).hideBanner();
            }
            else  {
                if(Session.gameData[DataKey.bannerTimes] > 0)
                {
                    (GM.platform as OppoPlatform).showBanner();
                }
            }
        }

        if (viewId == ViewID.main)  {
            GM.hideTTBanner();
        }
        else  {
            GM.showTTBanner();
        }
    }

    showView2(viewId: ViewID): void {
        let curView = this.allView[viewId];
        if (curView == null) {
            let VIEW = Laya.ClassUtils.getClass(viewId + "");
            if (VIEW) {
                this.allView[viewId] = new VIEW();
            }
        }
        curView = this.allView[viewId];

        Game.layerManager.faceLayer.addChild(curView);
        if (viewId == ViewID.setting || viewId == ViewID.signin) {
            curView.x = -750;
            Laya.Tween.to(curView, { x: 0 }, 300, null, new Laya.Handler(this, this.addBox, [curView]));
        }
        Game.layerManager.y = (Laya.stage.height - Laya.stage.designHeight) * 0.5;

        if (GM.platform instanceof OppoPlatform)  {
            (GM.platform as OppoPlatform).showOVBanner(viewId);
        }
        GM.showTTBanner();
    }

    private addBox(curView): void  {
        curView.addBox();
    }

    closeView2(viewId: ViewID): void {
        let curView = this.allView[viewId];
        curView && curView.removeBox();
        if (curView) {
            curView.x = 0;
            Laya.Tween.to(curView, { x: -750 }, 300);
        }
    }
}