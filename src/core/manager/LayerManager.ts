import GameConfig from "../../GameConfig";
export default class LayerManager extends Laya.Box {
    viewLayer: Laya.Box = new Laya.Box();
    faceLayer: Laya.Box = new Laya.Box();
    alertLayer: Laya.Box = new Laya.Box();
    guideLayer: Laya.Box = new Laya.Box();
    logTxt:Laya.Label = new Laya.Label();

    constructor() { 
        super();
        // this.graphics.drawRect(0,0,GameConfig.width,GameConfig.height,"#0000ff");
        this.addChild(this.viewLayer);
        // this.viewLayer.mouseThrough = true;
        this.addChild(this.faceLayer);
        this.addChild(this.alertLayer);
        this.addChild(this.guideLayer);

        this.viewLayer.name = "viewLayer";
        this.faceLayer.name = "faceLayer";
        this.alertLayer.name = "alertLayer";
        this.guideLayer.name = "guideLayer";
        // this.addChild(this.logTxt);
        // this.logTxt.width = 500;
        // this.logTxt.height = 1334;
        // this.logTxt.color = "#000000";
        // this.logTxt.fontSize = 24;
    }
    
}