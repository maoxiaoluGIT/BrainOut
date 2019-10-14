import Sprite = Laya.Sprite;
export default class LayerManager extends Sprite {
    viewLayer: Sprite = new Sprite();
    faceLayer: Sprite = new Sprite();
    alertLayer: Sprite = new Sprite();
    guideLayer: Sprite = new Sprite();

    constructor() { 
        super();
        this.addChild(this.viewLayer);
        this.addChild(this.faceLayer);
        this.addChild(this.alertLayer);
        this.addChild(this.guideLayer);
    }
    
}