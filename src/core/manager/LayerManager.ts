import GameConfig from "../../GameConfig";
export default class LayerManager extends Laya.Box {
    viewLayer: Laya.Box = new Laya.Box();
    faceLayer: Laya.Box = new Laya.Box();
    alertLayer: Laya.Box = new Laya.Box();
    guideLayer: Laya.Box = new Laya.Box();

    constructor() { 
        super();
        // this.graphics.drawRect(0,0,GameConfig.width,GameConfig.height,"#0000ff");
        this.addChild(this.viewLayer);
        this.addChild(this.faceLayer);
        this.addChild(this.alertLayer);
        this.addChild(this.guideLayer);
    }
    
}