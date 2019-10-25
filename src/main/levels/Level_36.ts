import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";
import GM from "../GM";

export default class Level_36 extends BaseLevel {
    private ui: ui.level36UI;

    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level36UI();
        this.addChild(this.ui);
        this.isInit = true;

        this.ui.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
        this.ui.on(Laya.Event.MOUSE_UP, this, this.onMouseUp);
    }

    private _lastDistance: number = 0;
    private _downScale: number = 0;
    private onMouseDown(e: Laya.Event = null): void {
        let touches: any[] = e.touches;
        if (touches && touches.length == 2) {
            // _mapImg.stopDrag();
            this._lastDistance = this.getDistance(touches);
            this._downScale = this.ui.chuan.scaleX;
            this.ui.on(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
        }
    }

    private onMouseMove(e: Laya.Event = null): void {
        let touches: any[] = e.touches;
        if (touches && touches.length == 2) {
            var distance: number = this.getDistance(touches);
            //判断当前距离与上次距离变化，确定是放大还是缩小
            var a: number = distance / this._lastDistance;
            let ss = this._downScale * a;
            ss = Math.min(3,ss);
            this.ui.chuan.scale(ss, ss);
        }
    }

    private onMouseUp():void
    {
        this.ui.off(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);

        if(this.ui.chuan.scaleX >= 3)
        {
            this.setAnswer(this.ui.rightBox, true);
        }
    }

    /**计算两个触摸点之间的距离*/
    private getDistance(points: any[]): number {
        var distance: number = 0;
        if (points && points.length == 2) {
            var dx: number = points[0].stageX - points[1].stageX;
            var dy: number = points[0].stageY - points[1].stageY;
            distance = Math.sqrt(dx * dx + dy * dy);
        }
        return distance;
    }

    refresh(): void {
        Laya.MouseManager.multiTouchEnabled = true;
        Laya.MouseManager.enabled = true;
        super.refresh();
        this.ui.chuan.scaleX = this.ui.chuan.scaleY = 1;
    }
}