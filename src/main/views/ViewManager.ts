import MainView from "./main/MainView";
import { ViewID } from "./ViewID";
import Game from "../../core/Game";
import GameBox from "../GameBox";
import GM from "../GM";
import PlatformID from "../platforms/PlatformID";
import OppoPlatform from "../platforms/OppoPlatform";

export default class ViewManager {

    allView: any = {};
    showView(viewId: ViewID): void  {
        let curView = this.allView[viewId];
        if (curView == null)  {
            let VIEW = Laya.ClassUtils.getClass(viewId + "");
            if (VIEW)  {
                this.allView[viewId] = new VIEW();
            }
        }
        curView = this.allView[viewId];
        Game.layerManager.viewLayer.removeChildren();
        Game.layerManager.viewLayer.addChild(curView);
        Game.layerManager.y = (Laya.stage.height - Laya.stage.designHeight) * 0.5;

        if(GM.platform instanceof OppoPlatform)
        {
            if(viewId == ViewID.cells)
            {
                (GM.platform as OppoPlatform).hideBanner();
            }
            else
            {
                (GM.platform as OppoPlatform).banner.show();
            }
        }
    }

    showView2(viewId: ViewID): void  {
        let curView = this.allView[viewId];
        if (curView == null)  {
            let VIEW = Laya.ClassUtils.getClass(viewId + "");
            if (VIEW)  {
                this.allView[viewId] = new VIEW();
            }
        }
        curView = this.allView[viewId];
        
        Game.layerManager.faceLayer.addChild(curView);
        if (viewId == ViewID.setting || viewId == ViewID.signin)  {
            curView.x = -750;
            Laya.Tween.to(curView, { x: 0 }, 300,null,new Laya.Handler(this,this.addBox,[curView]));
        }
        Game.layerManager.y = (Laya.stage.height - Laya.stage.designHeight) * 0.5;

        if(GM.platform instanceof OppoPlatform)
        {
            (GM.platform as OppoPlatform).showOVBanner(viewId);
        }
    }

    private addBox(curView):void
    {
        curView.addBox();
    }

    closeView2(viewId:ViewID): void  {
        let curView = this.allView[viewId];
        curView && curView.removeBox();
        if (curView)  {
            curView.x = 0;
            Laya.Tween.to(curView, { x: -750 }, 300);
        }
    }
}