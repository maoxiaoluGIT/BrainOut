import MainView from "./main/MainView";
import { ViewID } from "./ViewID";
import Game from "../../core/Game";

export default class ViewManager{

    allView:any = {};
    showView(viewId:ViewID,isTween:boolean = true):void
    {
        let curView = this.allView[viewId];
        if(curView == null)
        {
            let VIEW = Laya.ClassUtils.getClass(viewId + "");
            if(VIEW)
            {
                this.allView[viewId] = new VIEW();
            }
        }
        curView = this.allView[viewId];
        Game.layerManager.viewLayer.removeChildren();
        Game.layerManager.viewLayer.addChild(curView);
        if(isTween)
        {
            if(viewId == ViewID.setting || viewId == ViewID.signin)
            {
                curView.x = -750;
                Laya.Tween.to(curView,{x : 0},300);
            }
        }
    }
}