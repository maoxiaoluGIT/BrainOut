(function () {
    'use strict';

    class GameConfig {
        constructor() { }
        static init() {
            var reg = Laya.ClassUtils.regClass;
        }
    }
    GameConfig.width = 750;
    GameConfig.height = 1334;
    GameConfig.scaleMode = "fixedwidth";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "middle";
    GameConfig.alignH = "center";
    GameConfig.startScene = "level12.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = false;
    GameConfig.init();

    var Sprite = Laya.Sprite;
    class LayerManager extends Sprite {
        constructor() {
            super();
            this.viewLayer = new Sprite();
            this.faceLayer = new Sprite();
            this.alertLayer = new Sprite();
            this.guideLayer = new Sprite();
            this.addChild(this.viewLayer);
            this.addChild(this.faceLayer);
            this.addChild(this.alertLayer);
            this.addChild(this.guideLayer);
        }
    }

    class TableManager {
        constructor() {
            this.map = {};
            this.mapList = {};
        }
        register(fileName, cla) {
            this.map[fileName] = cla;
        }
        getOneByName(fileName) {
            return this.map[fileName];
        }
        getTable(tabelId) {
            return this.mapList[tabelId];
        }
        getDataByNameAndId(tabelId, id) {
            var arr = this.getTable(tabelId);
            var len = arr.length;
            for (var i = 0; i < len; i++) {
                if (arr[i].id == id) {
                    return arr[i];
                }
            }
        }
        onParse(arr) {
            for (var i = 0; i < arr.length; i += 2) {
                var keyname = arr[i];
                var Cla = this.getOneByName(keyname);
                if (Cla == null) {
                    console.error("没有注册表-------" + keyname);
                    continue;
                }
                var contente = arr[i + 1];
                var strary = contente.split("\n");
                var tmp = strary[strary.length - 1];
                if (tmp === "") {
                    strary.pop();
                }
                var head = String(strary[0]).replace("\r", "");
                var headary = head.split("\t");
                var contentary = strary.slice(1);
                var dataList = [];
                for (var k = 0; k < contentary.length; k++) {
                    var propstr = String(contentary[k]).replace("\r", "");
                    var propary = propstr.split("\t");
                    var clazz = new Cla();
                    for (var j = 0, len2 = propary.length; j < len2; j++) {
                        var now = clazz[headary[j]];
                        var value = propary[j];
                        if (typeof now === 'number') {
                            now = parseInt(value + "");
                            if ((now + "") != value) {
                                now = parseFloat(value + "");
                            }
                        }
                        else {
                            now = value;
                        }
                        clazz[headary[j]] = now;
                    }
                    dataList.push(clazz);
                }
                dataList.sort((a, b) => {
                    return a.id - b.id;
                });
                this.mapList[keyname] = dataList;
            }
        }
    }

    class GameEvent {
    }
    GameEvent.WX_ON_SHOW = "WX_ON_SHOW";
    GameEvent.WX_ON_HIDE = "WX_ON_HIDE";
    GameEvent.AD_OVER = "AD_OVER";
    GameEvent.SHOW_RIGHT = "SHOW_RIGHT";
    GameEvent.ON_NEXT = "ON_NEXT";
    GameEvent.ON_REFRESH = "ON_REFRESH";
    GameEvent.SHOW_TIPS = "SHOW_TIPS";

    class GameSoundManager {
        constructor() {
            this.bgmMap = {};
            this.currentWxSound = null;
            this.bgmUrl = null;
            this.noBgm = false;
            this.noEff = false;
            Laya.timer.callLater(this, this.initEvent);
        }
        onWX_ON_SHOW() {
            if (Laya.Browser.onMiniGame && this.currentWxSound) {
                this.currentWxSound.play();
            }
        }
        onWX_ON_HIDE() {
            if (Laya.Browser.onMiniGame && this.currentWxSound) {
                this.currentWxSound.pause();
            }
        }
        initEvent() {
            Laya.stage.once(GameEvent.WX_ON_SHOW, this, this.onWX_ON_SHOW);
            Laya.stage.once(GameEvent.WX_ON_HIDE, this, this.onWX_ON_HIDE);
            Laya.stage.once(GameEvent.AD_OVER, this, this.onWX_ON_SHOW);
        }
        openSceneFun(url) {
            if (this.bgmMap[url]) {
                this.playBgm(this.bgmMap[url]);
            }
        }
        reg(url, bgm) {
            this.bgmMap[url] = bgm;
            if (url == GameSoundManager.BTN) {
                Laya.stage.on(Laya.Event.CLICK, this, this.clickFun);
            }
        }
        clickFun(e) {
            if (e.target instanceof Laya.Button) {
                this.playEffect(this.bgmMap[GameSoundManager.BTN]);
            }
        }
        playBgm(url) {
            this.bgmUrl = url;
            if (Laya.Browser.onMiniGame) {
                if (this.currentWxSound) {
                    this.currentWxSound.stop();
                    this.currentWxSound.destroy();
                    this.currentWxSound = null;
                }
                let wxSound = Laya.Browser.window.wx.createInnerAudioContext();
                wxSound.autoplay = true;
                wxSound.loop = true;
                wxSound.src = Laya.URL.basePath + url;
                this.currentWxSound = wxSound;
                this.setBgmMuted(this.noBgm);
            }
            else {
                Laya.SoundManager.playMusic(url);
            }
        }
        setBgmMuted(v) {
            this.noBgm = v;
            if (Laya.Browser.onMiniGame && this.currentWxSound) {
                if (v) {
                    this.currentWxSound.volume = 0;
                }
                else {
                    this.currentWxSound.volume = 1;
                }
            }
            else {
                Laya.SoundManager.musicMuted = v;
            }
        }
        setEffMuted(v) {
            this.noEff = v;
        }
        stopBgm() {
            if (Laya.Browser.onMiniGame) {
                if (this.currentWxSound) {
                    this.currentWxSound.stop();
                    this.currentWxSound.destroy();
                    this.currentWxSound = null;
                    console.log("音频已经销毁");
                }
            }
            else {
                Laya.SoundManager.stopMusic();
            }
        }
        playEffect(url) {
            if (this.noEff) {
                return;
            }
            if (Laya.Browser.onMiniGame) {
                let b = Laya.Pool.getItem(url);
                if (b == null) {
                    new WXSound(url);
                }
                else {
                    b.play();
                }
            }
            else {
                Laya.SoundManager.playSound(url);
            }
        }
    }
    GameSoundManager.BTN = "BTN";
    class WXSound {
        constructor(url) {
            this.url = url;
            this.wxSound = Laya.Browser.window.wx.createInnerAudioContext();
            this.wxSound.autoplay = true;
            this.wxSound.loop = false;
            this.wxSound.src = Laya.URL.basePath + url;
            this.wxSound.onEnded(() => {
                Laya.Pool.recover(this.url, this.wxSound);
            });
        }
    }

    class SoundManager {
        constructor() {
            this.pre = "";
            this._sm = new GameSoundManager();
        }
        setMusicVolume(value) {
            Laya.SoundManager.setMusicVolume(value);
            Laya.SoundManager.musicMuted = value == 0;
        }
        setSoundVolume(value) {
            Laya.SoundManager.setSoundVolume(value);
            Laya.SoundManager.soundMuted = value == 0;
        }
        play(soundName, isMusic = false) {
            this.soundName = soundName;
            this.isMusic = isMusic;
            var url = this.pre + soundName;
            if (isMusic) {
                this._sm.playBgm(url);
            }
            else {
                this._sm.playEffect(url);
            }
        }
        onLoadCom(url, isMusic) {
            if (isMusic) {
                Laya.SoundManager.playMusic(url, 0);
            }
            else {
                Laya.SoundManager.playSound(url, 1);
            }
        }
    }

    class DialogManager {
        constructor() {
            this.dialogMap = {};
        }
        register(dialogName, dialogClass, res = null) {
            this.dialogMap[dialogName] = [dialogClass, res];
        }
        open(dialogName) {
            let arr = this.dialogMap[dialogName];
            Laya.loader.load(arr[1], new Laya.Handler(this, this.loaderFun, [dialogName]));
        }
        loaderFun(dialogName) {
            let arr = this.dialogMap[dialogName];
            let dc = arr[0];
            let a = new dc();
            a.popup(true, a.isShowEffect);
            a.once(Laya.Event.UNDISPLAY, this, this.undisFun, [a]);
        }
        undisFun(a) {
            a.destroy(true);
        }
    }

    class Game {
        static init(soundPre) {
            Game.layerManager = new LayerManager();
            Laya.stage.addChild(Game.layerManager);
            Game.tableManager = new TableManager();
            Game.soundManager = new SoundManager();
            Game.soundManager.pre = soundPre;
        }
        static RandomByArray(arr, deleteArr = false) {
            let value = Math.random() * arr.length;
            let index = Math.floor(value);
            let resvalue = arr[index];
            if (deleteArr) {
                arr.splice(index, 1);
            }
            return resvalue;
        }
        static http(url, data, method, caller = null, listener = null, args = null) {
            var http = new Laya.HttpRequest();
            let arr = [];
            let str = "";
            if (typeof data === 'string') {
                str = data;
            }
            else {
                for (let k in data) {
                    arr.push(k + "=" + data[k]);
                }
                str = arr.join("&");
            }
            if (method == "GET") {
                url = url + "?" + str;
                data = null;
            }
            http.send(url, str, method);
            if (caller && listener) {
                http.once(Laya.Event.COMPLETE, caller, listener, args);
            }
            return http;
        }
    }
    Game.platformId = 0;
    Game.layerManager = null;
    Game.tableManager = null;
    Game.soundManager = null;
    Game.eventManager = new Laya.EventDispatcher();
    Game.dialogManager = new DialogManager();

    class ViewManager {
        constructor() {
            this.allView = {};
        }
        showView(viewId) {
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
        }
    }

    class ImageEffect {
        constructor() {
            this.arr = [];
        }
        start() {
            Laya.timer.loop(300, this, this.onUpdate);
        }
        onUpdate() {
            let vo;
            let img;
            let arr1;
            let s1;
            let s2;
            for (let i = 0; i < this.arr.length; i++) {
                vo = this.arr[i];
                img = vo.spr;
                arr1 = img.skin.split(".");
                if (arr1.length == 2) {
                    s1 = arr1[0];
                    s2 = arr1[1];
                    s1 = s1.substr(0, s1.length - 1);
                    img.skin = s1 + vo.curTimes + "." + s2;
                    vo.curTimes++;
                    if (vo.curTimes > vo.times) {
                        vo.curTimes = 1;
                    }
                }
            }
        }
        addEffect(spr, times = 3) {
            let vo = new EffectVO();
            vo.spr = spr;
            vo.times = times;
            vo.curTimes = 1;
            spr.on(Laya.Event.DISPLAY, this, this.onDis, [vo]);
            spr.on(Laya.Event.UNDISPLAY, this, this.onUndis, [vo]);
        }
        onDis(vo) {
            this.arr.push(vo);
        }
        onUndis(vo) {
            for (let i = 0; i < this.arr.length; i++) {
                let tvo = this.arr[i];
                if (tvo && tvo == vo) {
                    this.arr[i] = null;
                    this.arr.splice(i, 1);
                }
            }
        }
    }
    class EffectVO {
    }

    var ViewID;
    (function (ViewID) {
        ViewID[ViewID["main"] = 1001] = "main";
        ViewID[ViewID["setting"] = 1002] = "setting";
        ViewID[ViewID["cells"] = 1003] = "cells";
    })(ViewID || (ViewID = {}));

    var REG = Laya.ClassUtils.regClass;
    var ui;
    (function (ui) {
        class initViewUI extends Laya.View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(initViewUI.uiView);
            }
        }
        initViewUI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Label", "props": { "x": 225, "width": 300, "var": "txt", "text": "0%", "fontSize": 36, "color": "#000000", "centerY": 0, "bold": true, "align": "center" }, "compId": 3 }], "loadList": [], "loadList3D": [] };
        ui.initViewUI = initViewUI;
        REG("ui.initViewUI", initViewUI);
        class level1UI extends Laya.View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(level1UI.uiView);
            }
        }
        level1UI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 454, "x": 123.5, "width": 184, "var": "item0", "skin": "guanqia/1/3_pic_3_1.png", "height": 173 }, "compId": 6 }, { "type": "Image", "props": { "y": 860, "x": 397, "width": 282, "var": "item3", "skin": "guanqia/1/apple.png", "height": 282, "alpha": 1 }, "compId": 7 }, { "type": "Image", "props": { "y": 794, "x": 92.5, "width": 215, "var": "item2", "skin": "guanqia/1/pic_20_1.png", "height": 256 }, "compId": 8 }, { "type": "Image", "props": { "y": 543.5, "x": 443, "width": 222, "var": "item1", "skin": "guanqia/1/pic_20_2.png", "height": 167 }, "compId": 9 }], "loadList": ["guanqia/1/3_pic_3_1.png", "guanqia/1/apple.png", "guanqia/1/pic_20_1.png", "guanqia/1/pic_20_2.png"], "loadList3D": [] };
        ui.level1UI = level1UI;
        REG("ui.level1UI", level1UI);
        class level10UI extends Laya.View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(level10UI.uiView);
            }
        }
        level10UI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Box", "props": { "y": 234, "x": -50, "width": 850, "visible": false, "var": "box", "height": 1100, "bottom": 0, "bgColor": "#eadfdf" }, "compId": 8 }, { "type": "Sprite", "props": { "y": 397, "x": 4, "width": 562, "texture": "guanqia/10/pic_7_1.png", "height": 678 }, "compId": 4 }, { "type": "Sprite", "props": { "y": 571.5, "x": 390, "var": "birdImg0", "texture": "guanqia/10/pic_7_2.png" }, "compId": 5 }, { "type": "Sprite", "props": { "y": 574, "x": 381, "var": "birdImg1", "texture": "guanqia/10/pic_7_3.png" }, "compId": 11 }, { "type": "Box", "props": { "y": 434, "x": 550, "width": 400, "var": "sunImg", "height": 400, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 7, "child": [{ "type": "Image", "props": { "y": 111, "x": 105, "width": 189, "skin": "guanqia/10/pic_7_4.png", "height": 177 }, "compId": 6 }] }, { "type": "Box", "props": { "width": 750, "var": "blankBox", "mouseEnabled": false, "height": 1334, "bgColor": "#000000", "alpha": 0.75 }, "compId": 9 }, { "type": "Box", "props": { "y": 933, "x": 375, "width": 40, "var": "rightBox", "height": 40, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 12 }], "loadList": ["guanqia/10/pic_7_1.png", "guanqia/10/pic_7_2.png", "guanqia/10/pic_7_3.png", "guanqia/10/pic_7_4.png"], "loadList3D": [] };
        ui.level10UI = level10UI;
        REG("ui.level10UI", level10UI);
        class level11UI extends Laya.View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(level11UI.uiView);
            }
        }
        level11UI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Sprite", "props": { "y": 295, "x": 110, "texture": "guanqia/11/shuxue.png" }, "compId": 28 }, { "type": "Image", "props": { "y": 896, "x": 166, "width": 420, "skin": "pubRes/top_yellow.png", "sizeGrid": "0,181,0,173", "height": 74 }, "compId": 6 }, { "type": "Button", "props": { "y": 1032, "x": 145, "width": 468, "var": "sureBtn", "stateNum": 1, "skin": "pubRes/btn_2.png", "sizeGrid": "0,122,0,123", "labelStrokeColor": "‘", "labelSize": 40, "labelColors": "#000000", "label": "确定", "height": 125 }, "compId": 4 }, { "type": "TextInput", "props": { "y": 906, "x": 218, "width": 318, "var": "shuru", "prompt": "输入答案", "height": 55, "fontSize": 40, "align": "center" }, "compId": 5 }, { "type": "Box", "props": { "y": 933, "x": 375, "width": 40, "var": "rightBox", "height": 40, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 29 }], "loadList": ["guanqia/11/shuxue.png", "pubRes/top_yellow.png", "pubRes/btn_2.png"], "loadList3D": [] };
        ui.level11UI = level11UI;
        REG("ui.level11UI", level11UI);
        class level12UI extends Laya.View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(level12UI.uiView);
            }
        }
        level12UI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Box", "props": { "x": 138.5, "width": 157, "var": "box0", "name": "yuanxing", "height": 175, "bottom": 700, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 29, "child": [{ "type": "Image", "props": { "width": 175, "var": "item0", "skin": "guanqia/12/pic_03_3.png", "height": 175 }, "compId": 5 }] }, { "type": "Box", "props": { "x": 368.5, "width": 176, "var": "box1", "name": "juxing", "height": 176, "bottom": 700, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 30, "child": [{ "type": "Image", "props": { "width": 176, "var": "item1", "skin": "guanqia/12/pic_.png", "height": 176 }, "compId": 4 }] }, { "type": "Box", "props": { "x": 618.5, "width": 193, "var": "box2", "name": "caomei", "height": 193, "bottom": 700, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 32, "child": [{ "type": "Image", "props": { "width": 193, "var": "item2", "skin": "guanqia/12/pic_20_1.png", "height": 193 }, "compId": 6 }] }, { "type": "Box", "props": { "x": 156, "var": "box3", "name": "xiangjiao", "bottom": 400, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 33, "child": [{ "type": "Image", "props": { "width": 224, "var": "item3", "skin": "guanqia/12/pic_20_2.png", "height": 122 }, "compId": 7 }] }, { "type": "Box", "props": { "x": 386, "width": 196, "var": "box4", "name": "nangua", "height": 182, "bottom": 400, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 34, "child": [{ "type": "Image", "props": { "y": -37, "x": -30, "width": 256, "var": "item4", "skin": "guanqia/12/pic_20_3_1.png", "height": 256 }, "compId": 8 }] }, { "type": "Box", "props": { "x": 620, "width": 175, "var": "box5", "name": "liubianxing", "height": 175, "bottom": 397, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 35, "child": [{ "type": "Image", "props": { "width": 175, "var": "item5", "skin": "guanqia/12/pic_20_4.png", "height": 175 }, "compId": 9 }] }, { "type": "Box", "props": { "y": 735, "x": 375, "width": 40, "var": "rightBox", "height": 40, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 10 }, { "type": "FontClip", "props": { "y": 509, "x": -212, "var": "font0", "value": "1", "skin": "pubRes/shuzi3.png", "sheet": "-+09 8765 4321", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 11 }, { "type": "FontClip", "props": { "y": 519, "x": -202, "var": "font1", "value": "1", "skin": "pubRes/shuzi3.png", "sheet": "-+09 8765 4321", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 20 }, { "type": "FontClip", "props": { "y": 529, "x": -192, "var": "font2", "value": "1", "skin": "pubRes/shuzi3.png", "sheet": "-+09 8765 4321", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 21 }, { "type": "FontClip", "props": { "y": 539, "x": -182, "var": "font3", "value": "1", "skin": "pubRes/shuzi3.png", "sheet": "-+09 8765 4321", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 22 }, { "type": "FontClip", "props": { "y": 549, "x": -172, "var": "font4", "value": "1", "skin": "pubRes/shuzi3.png", "sheet": "-+09 8765 4321", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 23 }, { "type": "FontClip", "props": { "y": 559, "x": -162, "var": "font5", "value": "1", "skin": "pubRes/shuzi3.png", "sheet": "-+09 8765 4321", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 24 }], "loadList": ["guanqia/12/pic_03_3.png", "guanqia/12/pic_.png", "guanqia/12/pic_20_1.png", "guanqia/12/pic_20_2.png", "guanqia/12/pic_20_3_1.png", "guanqia/12/pic_20_4.png", "pubRes/shuzi3.png"], "loadList3D": [] };
        ui.level12UI = level12UI;
        REG("ui.level12UI", level12UI);
        class level13UI extends Laya.View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(level13UI.uiView);
            }
        }
        level13UI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Sprite", "props": { "y": 493, "x": 687, "width": 615, "texture": "guanqia/13/pic_37_3.png", "rotation": 90, "height": 615 }, "compId": 4 }, { "type": "Text", "props": { "y": 346, "x": 105, "width": 112, "var": "yaoshishu", "text": "小明：", "height": 47, "fontSize": 46, "runtime": "laya.display.Text" }, "compId": 5 }, { "type": "Text", "props": { "y": 346, "x": 452, "width": 74, "text": "你：", "height": 47, "fontSize": 46, "runtime": "laya.display.Text" }, "compId": 6 }, { "type": "Sprite", "props": { "y": 302, "x": 542, "texture": "guanqia/13/quan.jpg" }, "compId": 7 }, { "type": "Sprite", "props": { "y": 306, "x": 241, "texture": "guanqia/13/cha.jpg" }, "compId": 8 }, { "type": "Box", "props": { "y": 493, "x": 490, "width": 181, "var": "box3", "name": "3", "height": 197 }, "compId": 14, "child": [{ "type": "Image", "props": { "y": 35, "x": 32, "var": "img3", "skin": "guanqia/13/quan.jpg" }, "compId": 12 }] }, { "type": "Box", "props": { "y": 702, "x": 91, "width": 181, "var": "box4", "name": "4", "height": 197 }, "compId": 21, "child": [{ "type": "Image", "props": { "y": 35, "x": 32, "var": "img4", "skin": "guanqia/13/quan.jpg" }, "compId": 22 }] }, { "type": "Box", "props": { "y": 702, "x": 285, "width": 181, "var": "box5", "name": "5", "height": 197 }, "compId": 23, "child": [{ "type": "Image", "props": { "y": 35, "x": 32, "var": "img5", "skin": "guanqia/13/quan.jpg" }, "compId": 24 }] }, { "type": "Box", "props": { "y": 914, "x": 490, "width": 177, "var": "box9", "name": "9", "height": 183 }, "compId": 15, "child": [{ "type": "Image", "props": { "y": 30, "x": 32, "var": "img9", "skin": "guanqia/13/quan.jpg" }, "compId": 16 }] }, { "type": "Box", "props": { "y": 575.5, "x": 570.5, "width": 10, "var": "blueLine1", "mouseEnabled": false, "height": 450, "bgColor": "#26b8e7" }, "compId": 19 }, { "type": "Box", "props": { "y": 801, "x": 158, "width": 230, "var": "blueLine2", "mouseEnabled": false, "height": 10, "bgColor": "#26b8e7" }, "compId": 28 }, { "type": "Box", "props": { "y": 801, "x": 375, "width": 40, "var": "rightBox", "mouseEnabled": false, "height": 40, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 20 }, { "type": "Box", "props": { "y": 597, "x": 181.5, "width": 400, "var": "redLine1", "mouseEnabled": false, "height": 10, "bgColor": "#e73525" }, "compId": 25 }, { "type": "Box", "props": { "y": 606, "x": 182.5, "width": 10, "var": "redLine2", "mouseEnabled": false, "height": 400, "bgColor": "#e73525" }, "compId": 27 }], "loadList": ["guanqia/13/pic_37_3.png", "guanqia/13/quan.jpg", "guanqia/13/cha.jpg"], "loadList3D": [] };
        ui.level13UI = level13UI;
        REG("ui.level13UI", level13UI);
        class level14UI extends Laya.View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(level14UI.uiView);
            }
        }
        level14UI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Box", "props": { "y": 300, "x": 100, "width": 550, "visible": false, "var": "box", "height": 900, "bgColor": "#e37373" }, "compId": 13 }, { "type": "Box", "props": { "y": 667, "x": 218, "width": 250, "var": "item0", "height": 268, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 7, "child": [{ "type": "Image", "props": { "width": 336, "skin": "guanqia/14/pic_42_1.png", "height": 336, "centerY": -30, "centerX": 0 }, "compId": 4 }] }, { "type": "Box", "props": { "y": 527, "x": 570, "width": 250, "var": "item2", "height": 268, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 8, "child": [{ "type": "Image", "props": { "width": 336, "skin": "guanqia/14/pic_42_1.png", "height": 336, "centerY": -30, "centerX": 0 }, "compId": 9 }] }, { "type": "Box", "props": { "y": 898, "x": 508, "width": 250, "var": "item1", "height": 268, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 10, "child": [{ "type": "Image", "props": { "width": 336, "skin": "guanqia/14/pic_42_1.png", "height": 336, "centerY": -30, "centerX": 0 }, "compId": 11 }] }, { "type": "Image", "props": { "y": 402, "x": 300, "var": "item3", "skin": "guanqia/14/3_pic_21_1.png", "scaleY": 0.4, "scaleX": 0.4, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 12 }], "loadList": ["guanqia/14/pic_42_1.png", "guanqia/14/3_pic_21_1.png"], "loadList3D": [] };
        ui.level14UI = level14UI;
        REG("ui.level14UI", level14UI);
        class level15UI extends Laya.View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(level15UI.uiView);
            }
        }
        level15UI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Sprite", "props": { "y": 459, "x": 127, "texture": "guanqia/15/pic_8_1.png" }, "compId": 3 }, { "type": "Box", "props": { "y": 249, "x": 212, "width": 332, "var": "targetBox", "height": 50 }, "compId": 5 }, { "type": "Box", "props": { "y": 534, "x": 174, "width": 422, "var": "colorBox", "height": 364 }, "compId": 8 }], "loadList": ["guanqia/15/pic_8_1.png"], "loadList3D": [] };
        ui.level15UI = level15UI;
        REG("ui.level15UI", level15UI);
        class level16UI extends Laya.View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(level16UI.uiView);
            }
        }
        level16UI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Box", "props": { "y": 310, "x": 0, "width": 374, "visible": false, "var": "box", "height": 900, "bgColor": "#e37373" }, "compId": 9 }, { "type": "Image", "props": { "y": 471, "x": 198, "width": 350, "skin": "guanqia/16/3_pic_24_1.png", "height": 369 }, "compId": 4 }, { "type": "Image", "props": { "y": 436, "x": 186, "width": 378, "var": "hairImg", "skin": "guanqia/16/3_pic_24_2.png", "height": 190 }, "compId": 5 }, { "type": "Image", "props": { "y": 884, "x": 165, "width": 420, "skin": "pubRes/top_yellow.png", "sizeGrid": "0,181,0,173", "height": 74 }, "compId": 6 }, { "type": "Button", "props": { "y": 1020, "x": 144, "width": 468, "var": "sureBtn", "stateNum": 1, "skin": "pubRes/btn_2.png", "sizeGrid": "0,122,0,123", "labelStrokeColor": "‘", "labelSize": 40, "labelColors": "#000000", "label": "确定", "height": 125 }, "compId": 7 }, { "type": "TextInput", "props": { "y": 894, "x": 217, "width": 318, "var": "shuru", "text": "输入答案", "prompt": "输入答案", "height": 55, "fontSize": 40, "align": "center" }, "compId": 8 }, { "type": "Box", "props": { "y": 749, "x": 378, "width": 40, "var": "rightBox", "height": 40, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 10 }], "loadList": ["guanqia/16/3_pic_24_1.png", "guanqia/16/3_pic_24_2.png", "pubRes/top_yellow.png", "pubRes/btn_2.png"], "loadList3D": [] };
        ui.level16UI = level16UI;
        REG("ui.level16UI", level16UI);
        class level2UI extends Laya.View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(level2UI.uiView);
            }
        }
        level2UI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Sprite", "props": { "y": 485, "x": 366, "width": 112, "var": "3", "texture": "guanqia/2/pic_157_2.png", "height": 155 }, "compId": 7 }, { "type": "Sprite", "props": { "y": 526, "x": 148, "width": 56, "var": "6", "texture": "guanqia/2/pic_157_1.png", "height": 96 }, "compId": 14 }, { "type": "Sprite", "props": { "y": 608, "x": 509, "width": 186, "var": "1", "texture": "guanqia/2/pic_157_2.png", "height": 257 }, "compId": 5 }, { "type": "Sprite", "props": { "y": 583, "x": 408, "width": 135, "var": "2", "texture": "guanqia/2/pic_157_2.png", "height": 187 }, "compId": 6 }, { "type": "Sprite", "props": { "y": 504, "x": 267, "width": 101, "var": "4", "texture": "guanqia/2/pic_157_2.png", "height": 140 }, "compId": 8 }, { "type": "Sprite", "props": { "y": 553.5, "x": 184, "width": 86, "var": "5", "texture": "guanqia/2/pic_157_2.png", "height": 119 }, "compId": 9 }, { "type": "Sprite", "props": { "y": 509, "x": 97, "width": 56, "var": "7", "texture": "guanqia/2/pic_157_2.png", "height": 77 }, "compId": 10 }, { "type": "Sprite", "props": { "y": 452, "x": 56, "width": 50, "var": "9", "texture": "guanqia/2/pic_157_2.png", "height": 69 }, "compId": 11 }, { "type": "Sprite", "props": { "y": 447, "x": -6, "width": 37, "var": "10", "texture": "guanqia/2/pic_157_2.png", "height": 51 }, "compId": 12 }, { "type": "Sprite", "props": { "y": 438, "x": 165, "width": 50, "var": "8", "texture": "guanqia/2/pic_157_2.png", "scaleX": -1, "height": 69 }, "compId": 13 }, { "type": "Button", "props": { "y": 891, "x": 86, "width": 282, "var": "item0", "stateNum": 1, "skin": "pubRes/btn_1.png", "labelStrokeColor": "‘", "labelSize": 40, "labelColors": "#000000", "label": "8", "height": 125 }, "compId": 15 }, { "type": "Button", "props": { "y": 1054, "x": 402, "width": 282, "var": "item3", "stateNum": 1, "skin": "pubRes/btn_1.png", "labelStrokeColor": "‘", "labelSize": 40, "labelColors": "#000000", "label": "11", "height": 125 }, "compId": 16 }, { "type": "Button", "props": { "y": 1054, "x": 93, "width": 282, "var": "item2", "stateNum": 1, "skin": "pubRes/btn_2.png", "labelStrokeColor": "‘", "labelSize": 40, "labelColors": "#000000", "label": "10", "height": 125 }, "compId": 17 }, { "type": "Button", "props": { "y": 891, "x": 402, "width": 282, "var": "item1", "stateNum": 1, "skin": "pubRes/btn_2.png", "labelStrokeColor": "‘", "labelSize": 40, "labelColors": "#000000", "label": "9", "height": 125 }, "compId": 18 }], "loadList": ["guanqia/2/pic_157_2.png", "guanqia/2/pic_157_1.png", "pubRes/btn_1.png", "pubRes/btn_2.png"], "loadList3D": [] };
        ui.level2UI = level2UI;
        REG("ui.level2UI", level2UI);
        class level3UI extends Laya.View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(level3UI.uiView);
            }
        }
        level3UI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 1003, "x": 478, "width": 178, "var": "item4", "skin": "guanqia/3/pic_12_6.png", "height": 161 }, "compId": 4 }, { "type": "Image", "props": { "y": 873, "x": 82, "width": 270, "var": "item3", "skin": "guanqia/3/pic_23_1.png", "height": 310 }, "compId": 5 }, { "type": "Image", "props": { "y": 427, "x": 431.5, "width": 271, "var": "item2", "skin": "guanqia/3/pic_23_2 2.png", "height": 389 }, "compId": 6 }, { "type": "Image", "props": { "y": 562, "x": 145.5, "width": 143, "var": "item1", "skin": "guanqia/3/pic_38_1 2.png", "height": 161 }, "compId": 7 }, { "type": "Image", "props": { "y": 186, "x": 26, "width": 191, "var": "item0", "skin": "guanqia/3/pic_7_4.png", "height": 179 }, "compId": 8 }], "loadList": ["guanqia/3/pic_12_6.png", "guanqia/3/pic_23_1.png", "guanqia/3/pic_23_2 2.png", "guanqia/3/pic_38_1 2.png", "guanqia/3/pic_7_4.png"], "loadList3D": [] };
        ui.level3UI = level3UI;
        REG("ui.level3UI", level3UI);
        class level4UI extends Laya.View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(level4UI.uiView);
            }
        }
        level4UI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Box", "props": { "y": 234, "x": 25, "width": 700, "visible": false, "var": "box", "height": 1100, "bottom": 0, "bgColor": "#eadfdf" }, "compId": 12 }, { "type": "Image", "props": { "y": 987, "x": 617, "width": 181, "var": "img6", "skin": "guanqia/4/pic_watermelon_2.png", "height": 128, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 10 }, { "type": "Image", "props": { "y": 649, "x": 139, "width": 202, "var": "img0", "skin": "guanqia/4/pic_watermelon_1.png", "height": 162, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 4 }, { "type": "Image", "props": { "y": 649, "x": 375, "width": 202, "var": "img1", "skin": "guanqia/4/pic_watermelon_1.png", "height": 162, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 5 }, { "type": "Image", "props": { "y": 649, "x": 624, "width": 202, "var": "img2", "skin": "guanqia/4/pic_watermelon_1.png", "height": 162, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 6 }, { "type": "Image", "props": { "y": 970, "x": 126, "width": 202, "var": "img3", "skin": "guanqia/4/pic_watermelon_1.png", "height": 162, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 7 }, { "type": "Image", "props": { "y": 970, "x": 375, "width": 202, "var": "img4", "skin": "guanqia/4/pic_watermelon_1.png", "height": 162, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 8 }, { "type": "Image", "props": { "y": 970, "x": 616, "width": 202, "var": "img5", "skin": "guanqia/4/pic_watermelon_1.png", "height": 162, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 9 }], "loadList": ["guanqia/4/pic_watermelon_2.png", "guanqia/4/pic_watermelon_1.png"], "loadList3D": [] };
        ui.level4UI = level4UI;
        REG("ui.level4UI", level4UI);
        class level5UI extends Laya.View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(level5UI.uiView);
            }
        }
        level5UI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Box", "props": { "y": 234, "x": 25, "width": 700, "visible": false, "var": "box", "height": 1100, "bottom": 0, "bgColor": "#eadfdf" }, "compId": 10 }, { "type": "Image", "props": { "y": 999, "x": 180, "width": 268, "var": "item2", "skin": "guanqia/5/pic_03_2.png", "height": 165, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 6 }, { "type": "Image", "props": { "y": 438, "x": 579, "width": 267, "var": "item1", "skin": "guanqia/5/pic_03_3.png", "height": 271, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 7 }, { "type": "Image", "props": { "y": 438, "x": 164, "width": 267, "var": "item0", "skin": "guanqia/5/pic_03_4.png", "height": 256, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 8 }, { "type": "Image", "props": { "y": 1000, "x": 582, "width": 273, "var": "item4", "skin": "guanqia/5/pic_39_2.png", "height": 268, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 9 }, { "type": "Image", "props": { "y": 709, "x": 356, "width": 262, "var": "item3", "skin": "guanqia/5/pic_.png", "height": 271, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 5 }, { "type": "Box", "props": { "y": 764, "x": 391, "width": 40, "var": "rightBox", "height": 40, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 12 }], "loadList": ["guanqia/5/pic_03_2.png", "guanqia/5/pic_03_3.png", "guanqia/5/pic_03_4.png", "guanqia/5/pic_39_2.png", "guanqia/5/pic_.png"], "loadList3D": [] };
        ui.level5UI = level5UI;
        REG("ui.level5UI", level5UI);
        class level6UI extends Laya.View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(level6UI.uiView);
            }
        }
        level6UI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Sprite", "props": { "y": 358, "x": 122, "width": 506, "texture": "guanqia/6/pic_31.png", "height": 513 }, "compId": 4 }, { "type": "Image", "props": { "y": 960, "x": 505, "width": 87, "var": "jia", "skin": "pubRes/pic_color_add.png", "height": 106, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 5 }, { "type": "Image", "props": { "y": 960, "x": 241, "width": 87, "var": "jian", "skin": "pubRes/pic_color_reduce.png", "scaleX": -1, "height": 106, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 6 }, { "type": "Button", "props": { "y": 1160, "x": 219, "width": 282, "var": "clearBtn", "stateNum": 1, "skin": "pubRes/btn_1.png", "labelStrokeColor": "‘", "labelSize": 40, "labelColors": "#000000", "label": "清除", "height": 125, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 7 }, { "type": "Button", "props": { "y": 1161, "x": 540, "width": 282, "var": "sureBtn", "stateNum": 1, "skin": "pubRes/btn_2.png", "labelStrokeColor": "‘", "labelSize": 40, "labelColors": "#000000", "label": "确定", "height": 125, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 8 }, { "type": "FontClip", "props": { "y": 920.5, "x": 313, "width": 112, "var": "shuzi", "value": "1", "skin": "pubRes/shuzi2.png", "sheet": "-+09 8765 4321", "height": 79, "align": "center" }, "compId": 10 }, { "type": "Box", "props": { "y": 851, "x": 375, "width": 40, "var": "rightBox", "height": 40, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 12 }], "loadList": ["guanqia/6/pic_31.png", "pubRes/pic_color_add.png", "pubRes/pic_color_reduce.png", "pubRes/btn_1.png", "pubRes/btn_2.png", "pubRes/shuzi2.png"], "loadList3D": [] };
        ui.level6UI = level6UI;
        REG("ui.level6UI", level6UI);
        class level7UI extends Laya.View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(level7UI.uiView);
            }
        }
        level7UI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Box", "props": { "y": 234, "x": 25, "width": 700, "visible": false, "var": "box", "height": 1100, "bottom": 0, "bgColor": "#eadfdf" }, "compId": 9 }, { "type": "Image", "props": { "y": 1059, "x": 256, "width": 146, "var": "item3", "skin": "guanqia/7/pic_22_1.png", "height": 209, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 7 }, { "type": "Image", "props": { "y": 474, "x": 565, "width": 181, "var": "item1", "skin": "guanqia/7/pic_22_1.png", "height": 232, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 5 }, { "type": "Image", "props": { "y": 842, "x": 538, "width": 203, "var": "item2", "skin": "guanqia/7/pic_22_1.png", "height": 291, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 6 }, { "type": "Image", "props": { "y": 571, "x": 227, "width": 246, "var": "item0", "skin": "guanqia/7/pic_22_1.png", "height": 352, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 4 }], "loadList": ["guanqia/7/pic_22_1.png"], "loadList3D": [] };
        ui.level7UI = level7UI;
        REG("ui.level7UI", level7UI);
        class level8UI extends Laya.View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(level8UI.uiView);
            }
        }
        level8UI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Box", "props": { "y": 267, "x": 0, "width": 750, "visible": false, "var": "box", "height": 692, "bgColor": "#e37373" }, "compId": 12 }, { "type": "Image", "props": { "y": 860, "x": 507, "width": 87, "var": "jia", "skin": "pubRes/pic_color_add.png", "height": 106, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 4 }, { "type": "Image", "props": { "y": 860, "x": 243, "width": 87, "var": "jian", "skin": "pubRes/pic_color_reduce.png", "scaleX": -1, "height": 106, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 5 }, { "type": "Button", "props": { "y": 1060, "x": 221, "width": 282, "var": "clearBtn", "stateNum": 1, "skin": "pubRes/btn_1.png", "labelStrokeColor": "‘", "labelSize": 40, "labelColors": "#000000", "label": "清除", "height": 125, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 6 }, { "type": "Button", "props": { "y": 1061, "x": 542, "width": 282, "var": "sureBtn", "stateNum": 1, "skin": "pubRes/btn_2.png", "labelStrokeColor": "‘", "labelSize": 40, "labelColors": "#000000", "label": "确定", "height": 125, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 7 }, { "type": "FontClip", "props": { "y": 820, "x": 315, "width": 112, "var": "shuzi", "value": "1", "skin": "pubRes/shuzi2.png", "sheet": "-+09 8765 4321", "height": 79, "align": "center" }, "compId": 8 }, { "type": "Sprite", "props": { "y": 306, "x": 128.5, "width": 493, "texture": "guanqia/8/pic_09_1.png", "height": 493, "alpha": 1 }, "compId": 9 }, { "type": "Image", "props": { "y": 524, "x": 298, "width": 154, "var": "carImg", "skin": "guanqia/8/pic_09_2.png", "height": 110 }, "compId": 10 }, { "type": "Box", "props": { "y": 935, "x": 375, "width": 40, "var": "rightBox", "height": 40, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 13 }], "loadList": ["pubRes/pic_color_add.png", "pubRes/pic_color_reduce.png", "pubRes/btn_1.png", "pubRes/btn_2.png", "pubRes/shuzi2.png", "guanqia/8/pic_09_1.png", "guanqia/8/pic_09_2.png"], "loadList3D": [] };
        ui.level8UI = level8UI;
        REG("ui.level8UI", level8UI);
        class level9UI extends Laya.View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(level9UI.uiView);
            }
        }
        level9UI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 468, "x": 270, "width": 71, "var": "item0", "skin": "guanqia/9/choice_frame_while_1.png", "height": 72 }, "compId": 4 }, { "type": "Text", "props": { "y": 486, "x": 345, "width": 95, "var": "yaoshishu", "text": "10分", "height": 38, "fontSize": 40, "runtime": "laya.display.Text" }, "compId": 5 }, { "type": "Text", "props": { "y": 626, "x": 345, "width": 95, "text": "20分", "height": 38, "fontSize": 40, "runtime": "laya.display.Text" }, "compId": 6 }, { "type": "Text", "props": { "y": 766, "x": 345, "width": 95, "text": "50分", "height": 38, "fontSize": 40, "runtime": "laya.display.Text" }, "compId": 7 }, { "type": "Text", "props": { "y": 906, "x": 345, "width": 95, "text": "80分", "height": 38, "fontSize": 40, "runtime": "laya.display.Text" }, "compId": 8 }, { "type": "Text", "props": { "y": 1046, "x": 345, "width": 95, "text": "满分", "height": 38, "fontSize": 40, "runtime": "laya.display.Text" }, "compId": 9 }, { "type": "Image", "props": { "y": 609, "x": 270, "width": 71, "var": "item1", "skin": "guanqia/9/choice_frame_while_1.png", "height": 72 }, "compId": 10 }, { "type": "Image", "props": { "y": 749, "x": 270, "width": 71, "var": "item2", "skin": "guanqia/9/choice_frame_while_1.png", "height": 72 }, "compId": 11 }, { "type": "Image", "props": { "y": 889, "x": 270, "width": 71, "var": "item3", "skin": "guanqia/9/choice_frame_while_1.png", "height": 72 }, "compId": 12 }, { "type": "Sprite", "props": { "y": 1029, "x": 270, "width": 71, "var": "item4", "texture": "guanqia/9/choice_frame_while_1.png", "height": 72 }, "compId": 13 }], "loadList": ["guanqia/9/choice_frame_while_1.png"], "loadList3D": [] };
        ui.level9UI = level9UI;
        REG("ui.level9UI", level9UI);
        class loadingUI extends Laya.View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(loadingUI.uiView);
            }
        }
        loadingUI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "FontClip", "props": { "y": 1215, "x": 404, "width": 118, "var": "dengjishuzi", "value": "100", "skin": "loading/shuzi2.png", "sheet": "-+09 8765 4321", "scaleY": 0.4, "scaleX": 0.4, "height": 79, "align": "right" }, "compId": 30 }, { "type": "Sprite", "props": { "y": 1215, "x": 258, "texture": "loading/jiazaizhong.png" }, "compId": 31 }, { "type": "Image", "props": { "y": 641, "x": 375, "skin": "loading/loding.png", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 32 }], "animations": [{ "nodes": [{ "target": 32, "keyframes": { "scaleY": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 32, "key": "scaleY", "index": 0 }, { "value": 1.5, "tweenMethod": "linearNone", "tween": true, "target": 32, "key": "scaleY", "index": 4 }, { "value": 0.7, "tweenMethod": "linearNone", "tween": true, "target": 32, "key": "scaleY", "index": 7 }, { "value": 1.2, "tweenMethod": "linearNone", "tween": true, "target": 32, "key": "scaleY", "index": 10 }, { "value": 0.9, "tweenMethod": "linearNone", "tween": true, "target": 32, "key": "scaleY", "index": 13 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 32, "key": "scaleY", "index": 16 }], "scaleX": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 32, "key": "scaleX", "index": 0 }, { "value": 1.5, "tweenMethod": "linearNone", "tween": true, "target": 32, "key": "scaleX", "index": 4 }, { "value": 0.7, "tweenMethod": "linearNone", "tween": true, "target": 32, "key": "scaleX", "index": 7 }, { "value": 1.2, "tweenMethod": "linearNone", "tween": true, "target": 32, "key": "scaleX", "index": 10 }, { "value": 0.9, "tweenMethod": "linearNone", "tween": true, "target": 32, "key": "scaleX", "index": 13 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 32, "key": "scaleX", "index": 16 }] } }], "name": "ani1", "id": 1, "frameRate": 24, "action": 1 }], "loadList": ["loading/shuzi2.png", "loading/jiazaizhong.png", "loading/loding.png"], "loadList3D": [] };
        ui.loadingUI = loadingUI;
        REG("ui.loadingUI", loadingUI);
        class mainuiUI extends Laya.View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(mainuiUI.uiView);
            }
        }
        mainuiUI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 25, "x": 559, "width": 171, "skin": "pubRes/qiandi.png", "sizeGrid": "0,44,0,42", "height": 78 }, "compId": 10 }, { "type": "Image", "props": { "y": 29, "x": 30, "width": 75, "var": "shezhi", "skin": "pubRes/ic_setting_1.png", "height": 73 }, "compId": 3 }, { "type": "Image", "props": { "y": 31, "x": 149, "width": 67, "var": "xuanguan", "skin": "pubRes/ic_list_1.png", "height": 71 }, "compId": 5 }, { "type": "Image", "props": { "y": 34, "x": 268, "width": 64, "var": "shuaxin", "skin": "pubRes/ic_reset_1.png", "height": 64 }, "compId": 6 }, { "type": "Image", "props": { "y": 34, "x": 383, "width": 70, "var": "kuaijin", "skin": "pubRes/ic_skip_1.png", "height": 59 }, "compId": 7 }, { "type": "Image", "props": { "y": 27, "x": 572, "width": 82, "var": "jinyaoshi", "skin": "pubRes/ic_key_1.png", "height": 80 }, "compId": 8 }, { "type": "Text", "props": { "y": 36, "x": 653, "width": 65, "var": "yaoshishu", "text": "2", "height": 60, "fontSize": 60, "runtime": "laya.display.Text" }, "compId": 11 }, { "type": "Sprite", "props": { "y": 157, "x": 300, "texture": "pubRes/dengji.png" }, "compId": 12 }, { "type": "FontClip", "props": { "y": 159, "x": 401, "var": "dengjishuzi", "value": "1", "skin": "pubRes/shuzi.png", "sheet": "01234 56789" }, "compId": 17 }, { "type": "Text", "props": { "y": 249, "x": 34, "wordWrap": true, "width": 678, "var": "titleTxt", "text": "哪个最大？", "height": 96, "fontSize": 46, "align": "center", "runtime": "laya.display.Text" }, "compId": 19 }], "loadList": ["pubRes/qiandi.png", "pubRes/ic_setting_1.png", "pubRes/ic_list_1.png", "pubRes/ic_reset_1.png", "pubRes/ic_skip_1.png", "pubRes/ic_key_1.png", "pubRes/dengji.png", "pubRes/shuzi.png"], "loadList3D": [] };
        ui.mainuiUI = mainuiUI;
        REG("ui.mainuiUI", mainuiUI);
        class mainViewUI extends Laya.View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(mainViewUI.uiView);
            }
        }
        mainViewUI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "loadList": [], "loadList3D": [] };
        ui.mainViewUI = mainViewUI;
        REG("ui.mainViewUI", mainViewUI);
        class mouseIconUI extends Laya.View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(mouseIconUI.uiView);
            }
        }
        mouseIconUI.uiView = { "type": "View", "props": { "width": 0, "height": 0 }, "compId": 2, "child": [{ "type": "Image", "props": { "skin": "pubRes/qiandi.png", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 3 }], "loadList": ["pubRes/qiandi.png"], "loadList3D": [] };
        ui.mouseIconUI = mouseIconUI;
        REG("ui.mouseIconUI", mouseIconUI);
        class rightIconUI extends Laya.View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(rightIconUI.uiView);
            }
        }
        rightIconUI.uiView = { "type": "View", "props": {}, "compId": 2, "child": [{ "type": "Image", "props": { "var": "icon", "skin": "pubRes/ic_choice.png", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 3 }], "loadList": ["pubRes/ic_choice.png"], "loadList3D": [] };
        ui.rightIconUI = rightIconUI;
        REG("ui.rightIconUI", rightIconUI);
        class shengliUI extends Laya.View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(shengliUI.uiView);
            }
        }
        shengliUI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Box", "props": { "y": 0, "x": 0, "width": 750, "height": 1334, "bgColor": "#ffffff", "alpha": 0.75 }, "compId": 20 }, { "type": "Image", "props": { "y": 328, "x": 47, "width": 656, "skin": "pubRes/fram_big.png", "height": 297 }, "compId": 3 }, { "type": "Image", "props": { "y": 375, "x": 192, "width": 366, "skin": "pubRes/top_yellow.png", "sizeGrid": "0,216,0,121", "height": 87 }, "compId": 5 }, { "type": "Button", "props": { "y": 667, "x": 398, "width": 305, "var": "nextAdBtn", "stateNum": 1, "skin": "pubRes/btn_3.png", "labelStrokeColor": "‘", "labelSize": 40, "labelPadding": "10,10,10,40", "labelColors": "#000000", "label": "下一关", "height": 125 }, "compId": 15, "child": [{ "type": "Sprite", "props": { "y": 25, "x": 48, "width": 69, "var": "ads", "texture": "pubRes/ic_ad_1.png", "height": 74 }, "compId": 10 }, { "type": "Sprite", "props": { "y": -24, "x": 180, "width": 134, "texture": "pubRes/hongyuan.png", "height": 69 }, "compId": 17, "child": [{ "type": "Text", "props": { "y": 16, "x": 6, "width": 127, "text": "+提示", "height": 50, "fontSize": 40, "align": "center", "runtime": "laya.display.Text" }, "compId": 18 }] }] }, { "type": "Text", "props": { "y": 393.5, "x": 248, "width": 254, "var": "zi1", "text": "恭喜你呀！", "height": 50, "fontSize": 46, "align": "center", "runtime": "laya.display.Text" }, "compId": 6 }, { "type": "Text", "props": { "y": 483, "x": 99, "wordWrap": true, "width": 539, "var": "zi2", "text": "恭喜你呀！", "height": 118, "fontSize": 46, "align": "center", "runtime": "laya.display.Text" }, "compId": 7 }, { "type": "Button", "props": { "y": 667, "x": 53, "width": 305, "var": "nextBtn", "stateNum": 1, "skin": "pubRes/btn_1.png", "labelStrokeColor": "‘", "labelSize": 40, "labelColors": "#000000", "label": "下一关", "height": 125 }, "compId": 9 }, { "type": "Image", "props": { "y": 857, "x": 0, "width": 752, "var": "paishou", "skin": "pubRes/pic_hand_1.png", "height": 477 }, "compId": 19 }], "loadList": ["pubRes/fram_big.png", "pubRes/top_yellow.png", "pubRes/btn_3.png", "pubRes/ic_ad_1.png", "pubRes/hongyuan.png", "pubRes/btn_1.png", "pubRes/pic_hand_1.png"], "loadList3D": [] };
        ui.shengliUI = shengliUI;
        REG("ui.shengliUI", shengliUI);
        class shezhiUI extends Laya.View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(shezhiUI.uiView);
            }
        }
        shezhiUI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 749, "var": "topImg", "skin": "pubRes/bg_top_1.png", "height": 308 }, "compId": 12 }, { "type": "Image", "props": { "y": 974, "x": 0, "width": 750, "var": "bottomImg", "skin": "pubRes/bg_down_1.png", "height": 360 }, "compId": 19 }, { "type": "Image", "props": { "y": 65, "x": 67, "var": "fanhui", "skin": "pubRes/ic_back_1.png", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 4 }, { "type": "Image", "props": { "y": 824, "x": 363, "var": "meiri", "skin": "pubRes/ic_daily_1.png", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 5 }, { "type": "Image", "props": { "y": 501, "x": 165, "var": "yinyue", "skin": "pubRes/ic_muisc_yes_1.png", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 7 }, { "type": "Image", "props": { "y": 824, "x": 551, "var": "qiuzhu", "skin": "pubRes/ic_share_1.png", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 8 }, { "type": "Image", "props": { "y": 502, "x": 552, "var": "zhendong", "skin": "pubRes/ic_shock_yes_1.png", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 9 }, { "type": "Image", "props": { "y": 501, "x": 362, "var": "yinxiao", "skin": "pubRes/ic_sound_yes_1.png", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 10 }, { "type": "Image", "props": { "y": 829, "x": 177, "var": "fankui", "skin": "pubRes/ic_feedback_1.png", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 6 }, { "type": "Text", "props": { "y": 888, "x": 294, "width": 143, "text": "每日奖励", "height": 50, "fontSize": 36, "align": "center", "runtime": "laya.display.Text" }, "compId": 17 }, { "type": "Text", "props": { "y": 562, "x": 112, "width": 107, "var": "zi1", "text": "音乐", "height": 50, "fontSize": 36, "align": "center", "runtime": "laya.display.Text" }, "compId": 13 }, { "type": "Text", "props": { "y": 888, "x": 498, "width": 107, "text": "求助", "height": 50, "fontSize": 36, "align": "center", "runtime": "laya.display.Text" }, "compId": 18 }, { "type": "Text", "props": { "y": 562, "x": 498, "width": 107, "text": "震动", "height": 50, "fontSize": 36, "align": "center", "runtime": "laya.display.Text" }, "compId": 15 }, { "type": "Text", "props": { "y": 888, "x": 119, "width": 107, "text": "反馈", "height": 50, "fontSize": 36, "align": "center", "runtime": "laya.display.Text" }, "compId": 16 }, { "type": "Text", "props": { "y": 562, "x": 312, "width": 107, "text": "音效", "height": 50, "fontSize": 36, "align": "center", "runtime": "laya.display.Text" }, "compId": 14 }], "loadList": ["pubRes/bg_top_1.png", "pubRes/bg_down_1.png", "pubRes/ic_back_1.png", "pubRes/ic_daily_1.png", "pubRes/ic_muisc_yes_1.png", "pubRes/ic_share_1.png", "pubRes/ic_shock_yes_1.png", "pubRes/ic_sound_yes_1.png", "pubRes/ic_feedback_1.png"], "loadList3D": [] };
        ui.shezhiUI = shezhiUI;
        REG("ui.shezhiUI", shezhiUI);
        class tishiUI extends Laya.View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(tishiUI.uiView);
            }
        }
        tishiUI.uiView = { "type": "View", "props": { "y": 667, "x": 375, "width": 750, "height": 1334, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 2, "child": [{ "type": "Box", "props": { "y": 0, "x": 0, "width": 750, "height": 1334, "bgColor": "#ffffff", "alpha": 0.75 }, "compId": 7 }, { "type": "Image", "props": { "y": 352, "x": 47, "width": 656, "skin": "pubRes/fram_big.png", "height": 316 }, "compId": 3 }, { "type": "Image", "props": { "y": 432, "x": 278, "width": 201, "skin": "pubRes/top_yellow.png", "sizeGrid": "0,86,0,87", "height": 87 }, "compId": 4 }, { "type": "Text", "props": { "y": 450.5, "x": 321.5, "width": 107, "var": "zi1", "text": "提示", "height": 50, "fontSize": 46, "align": "center", "runtime": "laya.display.Text" }, "compId": 5 }, { "type": "Text", "props": { "y": 553, "x": 109, "width": 539, "var": "zi2", "text": "恭喜你呀！", "height": 50, "fontSize": 46, "align": "center", "runtime": "laya.display.Text" }, "compId": 6 }, { "type": "Image", "props": { "y": 314, "x": 638, "var": "cha", "skin": "pubRes/ic_colse_1.png", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 8 }], "loadList": ["pubRes/fram_big.png", "pubRes/top_yellow.png", "pubRes/ic_colse_1.png"], "loadList3D": [] };
        ui.tishiUI = tishiUI;
        REG("ui.tishiUI", tishiUI);
        class tishi2UI extends Laya.View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(tishi2UI.uiView);
            }
        }
        tishi2UI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Box", "props": { "y": 0, "x": 0, "width": 750, "height": 1334, "bgColor": "#ffffff", "alpha": 0.75 }, "compId": 4 }, { "type": "Image", "props": { "y": 333, "x": 47, "width": 656, "skin": "pubRes/fram_big.png", "height": 504 }, "compId": 5 }, { "type": "Image", "props": { "y": 545, "x": 269, "width": 201, "skin": "pubRes/top_yellow.png", "sizeGrid": "0,86,0,87", "height": 87 }, "compId": 6 }, { "type": "Text", "props": { "y": 564, "x": 317, "width": 107, "var": "zi1", "text": "跳过", "height": 50, "fontSize": 46, "align": "center", "runtime": "laya.display.Text" }, "compId": 7 }, { "type": "Text", "props": { "y": 667, "x": 106, "wordWrap": true, "width": 539, "var": "zi2", "text": "跳过此关需要5个钥匙，是否跳过？", "height": 110, "fontSize": 46, "align": "center", "runtime": "laya.display.Text" }, "compId": 8 }, { "type": "Image", "props": { "y": 295, "x": 638, "var": "cha", "skin": "pubRes/ic_colse_1.png", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 9 }, { "type": "Image", "props": { "y": 394, "x": 250, "width": 113, "var": "jinyaoshi", "skin": "pubRes/ic_key_1.png", "height": 119 }, "compId": 10 }, { "type": "FontClip", "props": { "y": 414.5, "x": 342, "width": 164, "var": "shuzi", "value": "-2", "skin": "pubRes/shuzi2.png", "sheet": "-+09 8765 4321", "height": 78, "align": "center" }, "compId": 12 }, { "type": "Button", "props": { "y": 877, "x": 210.5, "width": 305, "var": "nextAdBtn", "stateNum": 1, "skin": "pubRes/btn_3.png", "labelStrokeColor": "‘", "labelSize": 40, "labelPadding": "10,10,10,40", "labelColors": "#000000", "label": "下一关", "height": 125 }, "compId": 13, "child": [{ "type": "Sprite", "props": { "y": 25, "x": 48, "width": 69, "var": "ads", "texture": "pubRes/ic_ad_1.png", "height": 74 }, "compId": 14 }, { "type": "Sprite", "props": { "y": -24, "x": 180, "width": 134, "texture": "pubRes/hongyuan.png", "height": 69 }, "compId": 15, "child": [{ "type": "Text", "props": { "y": 16, "x": 6, "width": 127, "text": "+提示", "height": 50, "fontSize": 40, "align": "center", "runtime": "laya.display.Text" }, "compId": 16 }] }] }], "loadList": ["pubRes/fram_big.png", "pubRes/top_yellow.png", "pubRes/ic_colse_1.png", "pubRes/ic_key_1.png", "pubRes/shuzi2.png", "pubRes/btn_3.png", "pubRes/ic_ad_1.png", "pubRes/hongyuan.png"], "loadList3D": [] };
        ui.tishi2UI = tishi2UI;
        REG("ui.tishi2UI", tishi2UI);
        class wrongIconUI extends Laya.View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(wrongIconUI.uiView);
            }
        }
        wrongIconUI.uiView = { "type": "View", "props": {}, "compId": 2, "child": [{ "type": "Image", "props": { "y": 10, "x": 10, "var": "icon", "skin": "pubRes/ic_wrong.png", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 3 }], "loadList": ["pubRes/ic_wrong.png"], "loadList3D": [] };
        ui.wrongIconUI = wrongIconUI;
        REG("ui.wrongIconUI", wrongIconUI);
        class xuanguan1UI extends Laya.View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(xuanguan1UI.uiView);
            }
        }
        xuanguan1UI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 749, "skin": "pubRes/bg_top_1.png", "height": 308 }, "compId": 3 }, { "type": "Image", "props": { "y": 974, "x": 0, "width": 750, "skin": "pubRes/bg_down_1.png", "height": 360 }, "compId": 4 }, { "type": "Image", "props": { "y": 65, "x": 67, "var": "fanhui", "skin": "pubRes/ic_back_1.png", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 5 }], "loadList": ["pubRes/bg_top_1.png", "pubRes/bg_down_1.png", "pubRes/ic_back_1.png"], "loadList3D": [] };
        ui.xuanguan1UI = xuanguan1UI;
        REG("ui.xuanguan1UI", xuanguan1UI);
        class xuanguan2UI extends Laya.View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(xuanguan2UI.uiView);
            }
        }
        xuanguan2UI.uiView = { "type": "View", "props": { "width": 336, "height": 348 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 336, "skin": "pubRes/fram_big.png", "height": 348 }, "compId": 3 }, { "type": "FontClip", "props": { "y": 63, "x": 26, "width": 164, "var": "shuzi", "value": "01", "skin": "pubRes/shuzi.png", "sheet": "01234 56789", "height": 63, "align": "center" }, "compId": 5 }, { "type": "Sprite", "props": { "y": 209, "x": 190, "texture": "pubRes/choice_frame_1.png" }, "compId": 6 }, { "type": "Sprite", "props": { "y": 185, "x": 168, "texture": "pubRes/ic_choice.png" }, "compId": 7 }], "loadList": ["pubRes/fram_big.png", "pubRes/shuzi.png", "pubRes/choice_frame_1.png", "pubRes/ic_choice.png"], "loadList3D": [] };
        ui.xuanguan2UI = xuanguan2UI;
        REG("ui.xuanguan2UI", xuanguan2UI);
    })(ui || (ui = {}));

    class MainFace extends ui.mainuiUI {
        constructor() {
            super();
            this.shezhi.on(Laya.Event.CLICK, this, this.onClick, [1]);
            this.xuanguan.on(Laya.Event.CLICK, this, this.onClick, [2]);
            this.shuaxin.on(Laya.Event.CLICK, this, this.onClick, [3]);
            this.kuaijin.on(Laya.Event.CLICK, this, this.onClick, [4]);
            GM.imgEffect.addEffect(this.shezhi);
            GM.imgEffect.addEffect(this.xuanguan);
            GM.imgEffect.addEffect(this.shuaxin);
            GM.imgEffect.addEffect(this.kuaijin);
            GM.imgEffect.addEffect(this.jinyaoshi);
            this.jinyaoshi.on(Laya.Event.CLICK, this, this.onTips);
            this.mouseThrough = true;
        }
        onTips() {
            Game.eventManager.event(GameEvent.SHOW_TIPS);
        }
        setTitle(sys) {
            this.titleTxt.text = sys.stageQuestion;
            this.dengjishuzi.value = "" + sys.id;
        }
        onClick(type) {
            if (type == 1) {
                GM.viewManager.showView(ViewID.setting);
            }
            else if (type == 2) {
                GM.viewManager.showView(ViewID.cells);
            }
            else if (type == 3) {
                Game.eventManager.event(GameEvent.ON_REFRESH);
            }
        }
    }

    class RightIcon extends ui.rightIconUI {
        constructor() {
            super();
        }
        add(parentSpr) {
            parentSpr && parentSpr.addChild(this);
            this.pos(parentSpr.width * 0.5, parentSpr.height * 0.5);
            this.icon.scale(0, 0);
            let t = new Laya.TimeLine();
            t.to(this.icon, { scaleX: 0.4, scaleY: 0.4 }, 100);
            t.to(this.icon, { scaleX: 1, scaleY: 1 }, 800, Laya.Ease.backOut);
            t.play();
            GM.playSound("right.mp3");
        }
    }

    class WrongIcon extends ui.wrongIconUI {
        constructor() { super(); }
        add(parentSpr) {
            parentSpr && parentSpr.addChild(this);
            this.pos(parentSpr.width * 0.5, parentSpr.height * 0.5);
            this.icon.scale(0, 0);
            let t = new Laya.TimeLine();
            t.to(this.icon, { scaleX: 0.4, scaleY: 0.4 }, 100);
            t.to(this.icon, { scaleX: 1, scaleY: 1 }, 800, Laya.Ease.backOut);
            t.to(this.icon, { scaleX: 0, scaleY: 0 }, 400);
            t.play();
            GM.playSound("wrong.mp3");
        }
    }

    class RightView extends ui.shengliUI {
        constructor() {
            super();
            this.on(Laya.Event.DISPLAY, this, this.onDis);
            GM.imgEffect.addEffect(this.paishou, 2);
            this.nextBtn.clickHandler = new Laya.Handler(this, this.onNext);
        }
        onNext() {
            this.removeSelf();
            Game.eventManager.event(GameEvent.ON_NEXT);
        }
        onDis() {
            this.paishou.y = 1334;
            Laya.Tween.to(this.paishou, { y: 857 }, 500, null, Laya.Handler.create(this, this.onEff), 600);
        }
        onEff() {
            Laya.MouseManager.enabled = true;
            GM.playSound("win.mp3");
        }
        setWin(sys) {
            this.zi2.text = sys.stageWin;
        }
    }

    class MyEffect {
        constructor() {
        }
        static light(sp) {
            let obj = {};
            obj.v = 100;
            let t = new Laya.Tween();
            let f = new Laya.ColorFilter();
            let farr = [f];
            t.to(obj, { v: 0, update: new Laya.Handler(null, () => {
                    f.reset();
                    f.adjustBrightness(obj.v);
                    sp.filters = farr;
                }) }, 1000);
        }
        static rotation(a, time = 100) {
            let t = new Laya.Tween();
            t.repeat = 0;
            a.once(Laya.Event.DISPLAY, null, () => {
                t.to(a, { rotation: 360 }, time);
            });
            a.once(Laya.Event.UNDISPLAY, null, () => {
                Laya.Tween.clearTween(a);
            });
        }
        static initBtnEffect() {
            Laya.stage.on(Laya.Event.CLICK, null, MyEffect.clickFun);
        }
        static clickFun(e) {
            if (e.target instanceof Laya.Button) {
                if (e.target.anchorX == 0.5 && e.target.anchorY == 0.5) {
                    MyEffect.clickEffect(e.target);
                }
            }
        }
        static clickEffect(sp) {
            let t = new Laya.Tween();
            let s = ((sp.scaleX > 0) ? 1 : -1);
            t.from(sp, { scaleX: 0.9 * s, scaleY: 0.9 }, 80);
        }
        static hide(e, time = 500) {
            let t = new Laya.Tween();
            t.to(e, { alpha: 0 }, time);
        }
        static show(e, time = 500) {
            let t = new Laya.Tween();
            t.to(e, { alpha: 1 }, time);
        }
        static flash(e, time = 500) {
            e.alpha = 0;
            let t = new Laya.TimeLine();
            t.to(e, { alpha: 1 }, time);
            t.to(e, { alpha: 0 }, time);
            t.play(0, true);
            MyEffect.clearTween(e);
        }
        static clearTween(e) {
            e.once(Laya.Event.UNDISPLAY, null, () => {
                Laya.Tween.clearAll(e);
            });
        }
        static scaleEffect(sp) {
            let t = new Laya.TimeLine();
            t.to(sp, { scaleX: 0.7, scaleY: 0.7 }, 100);
            t.to(sp, { scaleX: 1, scaleY: 1 }, 300, Laya.Ease.backOut);
            t.play();
        }
        static bigSmall(sp, big, small) {
            let t = new Laya.TimeLine();
            t.to(sp, { scaleX: big, scaleY: big }, 100);
            t.to(sp, { scaleX: small, scaleY: small }, 300, Laya.Ease.backOut);
            t.play();
        }
        static smallBig(sp, big, small) {
            let t = new Laya.TimeLine();
            sp.scale(small, small);
            sp.alpha = 0.8;
            t.to(sp, { scaleX: big, scaleY: big }, 300);
            t.to(sp, { alpha: 0 }, 100);
            t.play();
        }
        static popup(v, s, time, delay) {
            let t = new Laya.Tween();
            v.scale(0, 0);
            t.to(v, { scaleX: s, scaleY: s }, time, Laya.Ease.backOut, null, delay);
        }
    }

    class TipsView extends ui.tishiUI {
        constructor() {
            super();
            GM.imgEffect.addEffect(this.cha);
            this.cha.on(Laya.Event.CLICK, this, this.onClose);
        }
        onClose() {
            this.removeSelf();
        }
        setTips(sys) {
            this.zi2.text = sys.stageTips;
        }
    }

    class MainView extends ui.mainViewUI {
        constructor() {
            super();
            this._box = new Laya.Box();
            this._viewMap = {};
            this.addChild(this._box);
            this._mainFace = new MainFace();
            this.addChild(this._mainFace);
            RightIcon.ins = new RightIcon();
            WrongIcon.ins = new WrongIcon();
            Game.eventManager.on(GameEvent.SHOW_RIGHT, this, this.showRight);
            Game.eventManager.on(GameEvent.ON_NEXT, this, this.onNext);
            Game.eventManager.on(GameEvent.ON_REFRESH, this, this.onRefresh);
            Game.eventManager.on(GameEvent.SHOW_TIPS, this, this.showTips);
            this._monseIcon = new ui.mouseIconUI();
            Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
            this.showLevel(12);
        }
        onMouseDown() {
            this.addChild(this._monseIcon);
            this._monseIcon.pos(Laya.stage.mouseX, Laya.stage.mouseY - Game.layerManager.y);
            MyEffect.smallBig(this._monseIcon, 1.4, 0);
        }
        showTips() {
            if (!this._tipsView) {
                this._tipsView = new TipsView();
            }
            this.addChild(this._tipsView);
            this._tipsView.pos(GameConfig.width * 0.5, GameConfig.height * 0.5);
            MyEffect.popup(this._tipsView, 1, 500, 100);
            this._tipsView.setTips(this.curView.sys);
        }
        onRefresh() {
            this.curView.refresh();
        }
        showRight() {
            if (!this._rightView) {
                this._rightView = new RightView();
            }
            this.addChild(this._rightView);
            this._rightView.anchorX = this._rightView.anchorY = 0.5;
            this._rightView.pos(GameConfig.width * 0.5, GameConfig.height * 0.5);
            MyEffect.popup(this._rightView, 1, 500, 250);
            this._rightView.setWin(this.curView.sys);
        }
        onNext() {
            this.curLv++;
            this.showLevel(this.curLv);
        }
        showLevel(lv) {
            this._box.removeChildren();
            Laya.MouseManager.multiTouchEnabled = false;
            this.curLv = lv;
            this.curView = this._viewMap[lv];
            if (!this.curView) {
                let VIEW = Laya.ClassUtils.getClass(lv + "");
                if (VIEW) {
                    this.curView = new VIEW();
                }
                this._viewMap[lv] = this.curView;
            }
            else {
                this.curView.refresh();
            }
            this.curView.onShow(lv, this._box);
            this._mainFace.setTitle(this.curView.sys);
        }
    }

    class SysTitles {
        constructor() {
            this.id = 0;
            this.stageLv = 0;
            this.stageQuestion = '';
            this.stageTips = '';
            this.stageWin = '';
        }
    }
    SysTitles.NAME = "sys_titles.txt";

    class BaseLevel extends Laya.Box {
        constructor() {
            super();
        }
        onInit() {
        }
        refresh() {
            RightIcon.ins.removeSelf();
            WrongIcon.ins.removeSelf();
        }
        addEvent(sprite, func, isDrag = false) {
            func && sprite.on(Laya.Event.CLICK, this, func, [sprite]);
            if (isDrag) {
                sprite.on(Laya.Event.MOUSE_DOWN, this, this.onDown, [sprite]);
                sprite.on(Laya.Event.MOUSE_UP, this, this.onUp, [sprite]);
            }
        }
        onDown(sprite) {
            sprite.startDrag();
        }
        onUp(sprite) {
            sprite.stopDrag();
        }
        setAnswer(sprite, isRight) {
            Laya.MouseManager.enabled = false;
            if (isRight) {
                RightIcon.ins.add(sprite);
                Laya.timer.once(800, this, this.onRight);
            }
            else {
                WrongIcon.ins.add(sprite);
                setTimeout(() => {
                    Laya.MouseManager.enabled = true;
                }, 1300);
            }
        }
        onRight() {
            Game.eventManager.event(GameEvent.SHOW_RIGHT, this.sys);
        }
        onShow(level, parentBox) {
            this.sys = Game.tableManager.getDataByNameAndId(SysTitles.NAME, level);
            parentBox && parentBox.addChild(this);
            Laya.loader.load("res/atlas/guanqia/" + level + ".atlas", Laya.Handler.create(this, this.onInit));
        }
    }

    class Level_1 extends BaseLevel {
        constructor() { super(); }
        onInit() {
            if (this.isInit) {
                return;
            }
            this.ui = new ui.level1UI();
            this.addChild(this.ui);
            for (let i = 0; i < 4; i++) {
                let itemImg = this.ui["item" + i];
                this.addEvent(itemImg, this.onClick);
            }
            this.refresh();
            this.isInit = true;
        }
        refresh() {
            super.refresh();
            let skins = Level_1.itemskins;
            skins.sort((a, b) => {
                return Math.random() > 0.5 ? 1 : -1;
            });
            for (let i = 0; i < skins.length; i++) {
                let obj = skins[i];
                let itemImg = this.ui["item" + i];
                itemImg.skin = obj.skin;
                itemImg.tag = obj.right;
                itemImg.size(obj.ww, obj.hh);
            }
        }
        onClick(img) {
            this.setAnswer(img, img.tag == 1);
        }
    }
    Level_1.itemskins = [
        { skin: "guanqia/1/3_pic_3_1.png", right: 1, ww: 184, hh: 173 },
        { skin: "guanqia/1/pic_20_2.png", right: 0, ww: 222, hh: 167 },
        { skin: "guanqia/1/pic_20_1.png", right: 0, ww: 215, hh: 256 },
        { skin: "guanqia/1/apple.png", right: 0, ww: 282, hh: 282 }
    ];

    class Level_2 extends BaseLevel {
        constructor() { super(); }
        onInit() {
            if (this.isInit) {
                return;
            }
            this.ui = new ui.level2UI();
            this.addChild(this.ui);
            this.isInit = true;
            for (let i = 0; i < 4; i++) {
                let itemImg = this.ui["item" + i];
                this.addEvent(itemImg, this.onClick);
            }
            this.refresh();
            this.isInit = true;
        }
        refresh() {
            super.refresh();
        }
        onClick(img) {
            this.setAnswer(img, img == this.ui.item1);
        }
    }

    class Level_3 extends BaseLevel {
        constructor() { super(); }
        onInit() {
            if (this.isInit) {
                return;
            }
            this.ui = new ui.level3UI();
            this.addChild(this.ui);
            this.isInit = true;
            for (let i = 0; i < 5; i++) {
                let itemImg = this.ui["item" + i];
                this.addEvent(itemImg, this.onClick);
            }
            this.refresh();
            this.isInit = true;
        }
        refresh() {
            super.refresh();
        }
        onClick(img) {
            this.setAnswer(img, img == this.ui.item0);
        }
    }

    class Level_4 extends BaseLevel {
        constructor() {
            super();
            this.posList = [];
            this._downPos = new Laya.Point();
        }
        onInit() {
            if (this.isInit) {
                return;
            }
            this.ui = new ui.level4UI();
            this.addChild(this.ui);
            this.isInit = true;
            for (let i = 0; i < 7; i++) {
                let img = this.ui["img" + i];
                this.addEvent(img, this.onClick, i < 6);
                this.posList.push([img.x, img.y]);
            }
            this.refresh();
        }
        onDown(sprite) {
            this._downPos.x = Laya.stage.mouseX;
            this._downPos.y = Laya.stage.mouseY;
            sprite.off(Laya.Event.CLICK, this, this.onClick);
            sprite.startDrag(new Laya.Rectangle(this.ui.box.x, this.ui.box.y, this.ui.box.width, this.ui.box.height));
        }
        onUp(sprite) {
            if (Laya.stage.mouseX == this._downPos.x && Laya.stage.mouseY == this._downPos.y) {
                this.onClick(sprite);
            }
            else {
                super.onUp(sprite);
            }
        }
        refresh() {
            super.refresh();
            for (let i = 0; i < 6; i++) {
                let img = this.ui["img" + i];
                img.pos(this.posList[i][0], this.posList[i][1]);
            }
            let index = Math.floor(Math.random() * 6);
            let img = this.ui["img" + index];
            this.ui.img6.pos(img.x + 10, img.y + 16);
        }
        onClick(img) {
            this.setAnswer(img, img == this.ui.img6);
        }
    }

    class Level_5 extends BaseLevel {
        constructor() { super(); }
        onInit() {
            if (this.isInit) {
                return;
            }
            this.ui = new ui.level5UI();
            this.addChild(this.ui);
            this.isInit = true;
            for (let i = 0; i < 5; i++) {
                let itemImg = this.ui["item" + i];
                this.addEvent(itemImg, null, true);
            }
            this.refresh();
        }
        refresh() {
            super.refresh();
            let skins = Level_5.itemskins;
            skins.sort((a, b) => {
                return Math.random() > 0.5 ? 1 : -1;
            });
            for (let i = 0; i < skins.length; i++) {
                let obj = skins[i];
                let itemImg = this.ui["item" + i];
                itemImg.skin = obj.skin;
                itemImg.tag = obj.right;
                itemImg.size(obj.ww, obj.hh);
            }
        }
        onDown(sprite) {
            sprite.startDrag(new Laya.Rectangle(this.ui.box.x, this.ui.box.y, this.ui.box.width, this.ui.box.height));
        }
        onUp(sprite) {
            super.onUp(sprite);
            if (sprite.tag == 1) {
                if (sprite.x < 50 || sprite.x > 700) {
                    this.setAnswer(this.ui.rightBox, true);
                }
            }
        }
    }
    Level_5.itemskins = [
        { skin: "guanqia/5/pic_03_4.png", right: 0, ww: 267, hh: 256 },
        { skin: "guanqia/5/pic_03_3.png", right: 0, ww: 267, hh: 271 },
        { skin: "guanqia/5/pic_03_2.png", right: 0, ww: 268, hh: 165 },
        { skin: "guanqia/5/pic_.png", right: 1, ww: 262, hh: 271 },
        { skin: "guanqia/5/pic_39_2.png", right: 0, ww: 273, hh: 268 },
    ];

    class Level_6 extends BaseLevel {
        constructor() { super(); }
        onInit() {
            if (this.isInit) {
                return;
            }
            this.ui = new ui.level6UI();
            this.addChild(this.ui);
            this.isInit = true;
            this.ui.jian.on(Laya.Event.CLICK, this, this.onJian);
            this.ui.jia.on(Laya.Event.CLICK, this, this.onJia);
            this.ui.clearBtn.clickHandler = new Laya.Handler(this, this.refresh);
            this.ui.sureBtn.clickHandler = new Laya.Handler(this, this.onSure);
            this.curValue = 0;
            this.ui.shuzi.value = "" + this.curValue;
        }
        onJian() {
            if (this.curValue == 0) {
                return;
            }
            this.curValue--;
            this.ui.shuzi.value = "" + this.curValue;
        }
        onJia() {
            if (this.curValue == 99) {
                return;
            }
            this.curValue++;
            this.ui.shuzi.value = "" + this.curValue;
        }
        refresh() {
            this.curValue = 0;
            this.ui.shuzi.value = "" + this.curValue;
        }
        onSure() {
            this.setAnswer(this.ui.rightBox, this.curValue == 11);
        }
    }

    class Level_7 extends BaseLevel {
        constructor() {
            super();
            this.posList = [];
            this._downPos = new Laya.Point();
        }
        onInit() {
            if (this.isInit) {
                return;
            }
            this.ui = new ui.level7UI();
            this.addChild(this.ui);
            this.isInit = true;
            for (let i = 0; i < 4; i++) {
                let img = this.ui["item" + i];
                this.addEvent(img, this.onClick, i < 6);
                this.posList.push([img.x, img.y]);
            }
            this.refresh();
        }
        refresh() {
            super.refresh();
            for (let i = 0; i < 4; i++) {
                let img = this.ui["item" + i];
                img.pos(this.posList[i][0], this.posList[i][1]);
                img.scale(1, 1);
                img.visible = true;
            }
        }
        onClick(img) {
            let count = 0;
            for (let i = 0; i < 4; i++) {
                let timg = this.ui["item" + i];
                if (timg.visible) {
                    count++;
                }
            }
            this.setAnswer(img, count == 1);
        }
        onDown(sprite) {
            this._downPos.x = Laya.stage.mouseX;
            this._downPos.y = Laya.stage.mouseY;
            sprite.off(Laya.Event.CLICK, this, this.onClick);
            sprite.startDrag(new Laya.Rectangle(this.ui.box.x, this.ui.box.y, this.ui.box.width, this.ui.box.height));
        }
        onUp(sprite) {
            if (Laya.stage.mouseX == this._downPos.x && Laya.stage.mouseY == this._downPos.y) {
                this.onClick(sprite);
            }
            else {
                super.onUp(sprite);
                for (let i = 0; i < 4; i++) {
                    let img = this.ui["item" + i];
                    if (img.visible && img != sprite) {
                        if (this.hit(sprite, img)) {
                            if (img.width > sprite.width) {
                                sprite.visible = false;
                                Laya.Tween.to(img, { scaleX: img.scaleX + 0.1, scaleY: img.scaleY + 0.1 }, 300, Laya.Ease.backOut);
                            }
                            else {
                                img.visible = false;
                                Laya.Tween.to(sprite, { scaleX: sprite.scaleX + 0.1, scaleY: sprite.scaleY + 0.1 }, 300, Laya.Ease.backOut);
                            }
                        }
                    }
                }
            }
        }
        hit(b0, b1) {
            return b0.x < b1.x + b1.width &&
                b0.x + b0.width > b1.x &&
                b0.y < b1.y + b1.height &&
                b0.y + b0.height > b1.y;
        }
    }

    class Level_8 extends BaseLevel {
        constructor() { super(); }
        onInit() {
            if (this.isInit) {
                return;
            }
            this.ui = new ui.level8UI();
            this.addChild(this.ui);
            this.isInit = true;
            this.ui.jian.on(Laya.Event.CLICK, this, this.onJian);
            this.ui.jia.on(Laya.Event.CLICK, this, this.onJia);
            this.ui.clearBtn.clickHandler = new Laya.Handler(this, this.refresh);
            this.ui.sureBtn.clickHandler = new Laya.Handler(this, this.onSure);
            this.curValue = 0;
            this.ui.shuzi.value = "" + this.curValue;
            this.addEvent(this.ui.carImg, null, true);
            this._startX = this.ui.carImg.x;
            this._startY = this.ui.carImg.y;
        }
        onDown(sprite) {
            sprite.startDrag(new Laya.Rectangle(this.ui.box.x, this.ui.box.y, this.ui.box.width - 154, this.ui.box.height));
        }
        onJian() {
            if (this.curValue == 0) {
                return;
            }
            this.curValue--;
            this.ui.shuzi.value = "" + this.curValue;
        }
        onJia() {
            if (this.curValue == 99) {
                return;
            }
            this.curValue++;
            this.ui.shuzi.value = "" + this.curValue;
        }
        refresh() {
            this.ui.carImg.pos(this._startX, this._startY);
            this.curValue = 0;
            this.ui.shuzi.value = "" + this.curValue;
        }
        onSure() {
            this.setAnswer(this.ui.rightBox, this.curValue == 9);
        }
    }

    class Level_9 extends BaseLevel {
        constructor() { super(); }
        onInit() {
            if (this.isInit) {
                return;
            }
            this.ui = new ui.level9UI();
            this.addChild(this.ui);
            this.isInit = true;
            for (let i = 0; i < 5; i++) {
                let itemImg = this.ui["item" + i];
                this.addEvent(itemImg, this.onClick);
            }
            this.refresh();
            this.isInit = true;
        }
        refresh() {
            super.refresh();
        }
        onClick(img) {
            this.setAnswer(img, img == this.ui.item4);
        }
    }

    class Level_10 extends BaseLevel {
        constructor() { super(); }
        onInit() {
            if (this.isInit) {
                return;
            }
            this.ui = new ui.level10UI();
            this.addChild(this.ui);
            this.isInit = true;
            this.addEvent(this.ui.sunImg, null, true);
            this._startX = this.ui.sunImg.x;
            this._startY = this.ui.sunImg.y;
            this.refresh();
        }
        refresh() {
            super.refresh();
            this.ui.blankBox.visible = false;
            this.ui.birdImg0.visible = true;
            this.ui.birdImg1.visible = false;
            this.ui.sunImg.pos(this._startX, this._startY);
        }
        onDown(sprite) {
            sprite.startDrag(new Laya.Rectangle(this.ui.box.x, this.ui.box.y, this.ui.box.width, this.ui.box.height));
        }
        onUp(sprite) {
            super.onUp(sprite);
            if (this.ui.sunImg.x <= -50 || this.ui.sunImg.x >= GameConfig.width + 50) {
                this.setAnswer(this.ui.rightBox, true);
                this.ui.blankBox.visible = true;
                this.ui.birdImg0.visible = false;
                this.ui.birdImg1.visible = true;
            }
        }
    }

    class Level_11 extends BaseLevel {
        constructor() { super(); }
        onInit() {
            if (this.isInit) {
                return;
            }
            this.ui = new ui.level11UI();
            this.addChild(this.ui);
            this.isInit = true;
            this.ui.sureBtn.clickHandler = new Laya.Handler(this, this.onSure);
            this.refresh();
        }
        refresh() {
            super.refresh();
            this.ui.shuru.text = "";
        }
        onSure() {
            this.setAnswer(this.ui.rightBox, this.ui.shuru.text == "9");
        }
    }

    class Level_12 extends BaseLevel {
        constructor() {
            super();
            this.clickCount = 0;
            this.fontArr = [];
            this.myAnswerArr = [];
            this.posList = [];
            this.boxList = [];
        }
        onInit() {
            if (this.isInit) {
                return;
            }
            this.ui = new ui.level12UI();
            this.addChild(this.ui);
            this.isInit = true;
            for (let i = 0; i < 6; i++) {
                let itemImg = this.ui["box" + i];
                itemImg.tag = [];
                this.addEvent(itemImg, this.onClick);
                this.fontArr.push(this.ui["font" + i]);
                this.posList.push([itemImg.x, i < 3 ? 700 : 400]);
                this.boxList.push(itemImg);
            }
            this.refresh();
        }
        refresh() {
            Laya.MouseManager.enabled = true;
            super.refresh();
            this.clickCount = 0;
            this.boxList.sort((a, b) => {
                return Math.random() > 0.5 ? 1 : -1;
            });
            this.myAnswerArr.length = 0;
            for (let i = 0; i < this.boxList.length; i++) {
                this.boxList[i].tag.length = 0;
                this.boxList[i].x = this.posList[i][0];
                this.boxList[i].bottom = this.posList[i][1];
                this.fontArr[i].removeSelf();
                this.fontArr[i].pos(-100, -100);
            }
        }
        onClick(img) {
            this.clickCount++;
            let fc = this.fontArr[this.clickCount - 1];
            fc.value = "" + this.clickCount;
            img.addChild(fc);
            img.tag.push(fc);
            let arr = img.tag;
            for (let i = 0; i < arr.length; i++) {
                if (i < 3) {
                    arr[i].pos(0, i * img.height / 3);
                }
                else {
                    arr[i].pos(img.width - 40, (i - 3) * img.height / 3);
                }
            }
            this.myAnswerArr.push(img.name);
            if (this.clickCount == 5) {
                let bool1 = this.myAnswerArr[0] == "caomei" || this.myAnswerArr[0] == "xiangjiao";
                let bool2 = this.myAnswerArr[1] == "caomei" || this.myAnswerArr[1] == "xiangjiao";
                let bool3 = this.myAnswerArr[2] == "liubianxing";
                let bool4 = this.myAnswerArr[3] == "yuanxing";
                let bool5 = this.myAnswerArr[4] == "juxing";
                if (bool1 && bool2 && bool3 && bool4 && bool5) {
                    this.setAnswer(this.ui.rightBox, true);
                }
            }
            else if (this.clickCount == 6) {
                Laya.MouseManager.enabled = false;
                this.setAnswer(this.ui.rightBox, false);
                setTimeout(() => {
                    this.refresh();
                }, 800);
            }
        }
    }

    class Level_13 extends BaseLevel {
        constructor() { super(); }
        onInit() {
            if (this.isInit) {
                return;
            }
            this.ui = new ui.level13UI();
            this.addChild(this.ui);
            this.isInit = true;
            this.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
            this.addEvent(this.ui.box3, null, true);
            this.addEvent(this.ui.box4, null, true);
            this.addEvent(this.ui.box5, null, true);
            this.addEvent(this.ui.box9, null, true);
            this.refresh();
        }
        onDown(sprite) {
        }
        onUp(sprite) {
            Laya.MouseManager.enabled = false;
            let flag = sprite.name;
            this.ui["img" + flag].skin = "guanqia/13/quan.jpg";
            if (sprite == this.ui.box3) {
                this.ui.img4.skin = "guanqia/13/cha.jpg";
                this.ui.redLine2.visible = true;
            }
            else {
                this.ui.img3.skin = "guanqia/13/cha.jpg";
                this.ui.redLine1.visible = true;
            }
            this.setAnswer(this.ui.rightBox, false);
            setTimeout(() => {
                this.refresh();
            }, 1200);
        }
        onMouseDown(e) {
            let touches = e.touches;
            if (touches && touches.length == 2) {
                let p1 = touches[0];
                let p2 = touches[1];
                if ((this.ui.box3.hitTestPoint(p1.stageX, p1.stageY) && this.ui.box9.hitTestPoint(p2.stageX, p2.stageY))
                    || (this.ui.box3.hitTestPoint(p2.stageX, p2.stageY) && this.ui.box9.hitTestPoint(p1.stageX, p1.stageY))) {
                    this.ui.blueLine1.visible = true;
                    this.ui.img3.skin = "guanqia/13/quan.jpg";
                    this.ui.img9.skin = "guanqia/13/quan.jpg";
                    this.setAnswer(this.ui.rightBox, true);
                }
                else if ((this.ui.box4.hitTestPoint(p1.stageX, p1.stageY) && this.ui.box5.hitTestPoint(p2.stageX, p2.stageY))
                    || (this.ui.box4.hitTestPoint(p2.stageX, p2.stageY) && this.ui.box5.hitTestPoint(p1.stageX, p1.stageY))) {
                    this.ui.blueLine2.visible = true;
                    this.ui.img4.skin = "guanqia/13/quan.jpg";
                    this.ui.img5.skin = "guanqia/13/quan.jpg";
                    this.setAnswer(this.ui.rightBox, true);
                }
                else {
                    this.refresh();
                }
            }
        }
        refresh() {
            Laya.MouseManager.multiTouchEnabled = true;
            Laya.MouseManager.enabled = true;
            super.refresh();
            this.ui.blueLine1.visible = this.ui.blueLine2.visible = false;
            this.ui.redLine1.visible = false;
            this.ui.redLine2.visible = false;
            this.ui.img3.skin = this.ui.img4.skin = this.ui.img5.skin = this.ui.img9.skin = "";
        }
    }

    class Level_14 extends BaseLevel {
        constructor() {
            super();
            this.posList = [];
            this._lastX = 0;
            this._lastY = 0;
            this._count = 0;
            this._downPos = new Laya.Point();
        }
        onInit() {
            if (this.isInit) {
                return;
            }
            this.ui = new ui.level14UI();
            this.addChild(this.ui);
            this.isInit = true;
            this.addEvent(this.ui.item0, null, true);
            this.addEvent(this.ui.item1, null, true);
            this.addEvent(this.ui.item2, null, true);
            this.addEvent(this.ui.item3, this.onClick);
            this.posList = [[this.ui.item0.x, this.ui.item0.y], [this.ui.item1.x, this.ui.item1.y], [this.ui.item2.x, this.ui.item2.y]];
            this.refresh();
        }
        onDown(sprite) {
            this._downPos.x = Laya.stage.mouseX;
            this._downPos.y = Laya.stage.mouseY;
            this._lastX = this._lastY = this._count = 0;
            if (sprite == this.targetItem && !this.ui.item3.visible) {
                Laya.timer.frameLoop(1, this, this.onLoop);
            }
            sprite.startDrag(new Laya.Rectangle(this.ui.box.x, this.ui.box.y, this.ui.box.width, this.ui.box.height));
        }
        onUp(sprite) {
            Laya.timer.clear(this, this.onLoop);
            if (Laya.stage.mouseX == this._downPos.x && Laya.stage.mouseY == this._downPos.y) {
                this.onClick(sprite);
            }
            else {
                super.onUp(sprite);
            }
        }
        onLoop() {
            if (this._lastX != this.targetItem.x && this._lastY != this.targetItem.y) {
                this._count++;
                console.log("=============", this._count);
            }
            this._lastX = this.targetItem.x;
            this._lastY = this.targetItem.y;
            if (this._count >= 30) {
                Laya.timer.clear(this, this.onLoop);
                this.ui.item3.visible = true;
                this.ui.item3.pos(this.targetItem.x, this.targetItem.y);
                Laya.Tween.to(this.ui.item3, { x: this.ui.item3.x - 100, y: this.ui.item3.y + 150 }, 100, Laya.Ease.backOut);
            }
        }
        refresh() {
            Laya.MouseManager.enabled = true;
            this._count = 0;
            super.refresh();
            this.ui.item3.visible = false;
            this.ui.item0.pos(this.posList[0][0], this.posList[0][1]);
            this.ui.item1.pos(this.posList[1][0], this.posList[1][1]);
            this.ui.item2.pos(this.posList[2][0], this.posList[2][1]);
            let targetIndex = Math.floor(3 * Math.random());
            this.targetItem = this.ui["item" + targetIndex];
        }
        onClick(img) {
            this.setAnswer(img, img == this.ui.item3);
        }
    }

    class Level_15 extends BaseLevel {
        constructor() { super(); }
        onInit() {
            if (this.isInit) {
                return;
            }
            this.ui = new ui.level15UI();
            this.addChild(this.ui);
            this.isInit = true;
            this.addEvent(this.ui.targetBox, this.onClick);
            this.addEvent(this.ui.colorBox, this.onClick);
        }
        onClick(box) {
            this.setAnswer(box, box == this.ui.targetBox);
        }
    }

    class Level_16 extends BaseLevel {
        constructor() { super(); }
        onInit() {
            if (this.isInit) {
                return;
            }
            this.ui = new ui.level16UI();
            this.addChild(this.ui);
            this.isInit = true;
            this.addEvent(this.ui.hairImg, null, true);
            this.ui.sureBtn.clickHandler = new Laya.Handler(this, this.onSure);
            this.refresh();
        }
        refresh() {
            super.refresh();
            this.ui.shuru.text = "";
            this.ui.hairImg.pos(186, 436);
        }
        onSure() {
            this.setAnswer(this.ui.rightBox, this.ui.shuru.text == "3");
        }
        onDown(sprite) {
            sprite.startDrag(new Laya.Rectangle(this.ui.box.x, this.ui.box.y, this.ui.box.width, this.ui.box.height));
        }
        onUp(sprite) {
            sprite.stopDrag();
        }
    }

    var Handler = Laya.Handler;
    var Loader = Laya.Loader;
    class ZipLoader {
        constructor() {
            this.handler = null;
            this.fileNameArr = [];
            this.resultArr = [];
        }
        static load(fileName, handler) {
            this.instance.loadFile(fileName, handler);
        }
        loadFile(fileName, handler) {
            this.handler = handler;
            Laya.loader.load(fileName, new Handler(this, this.zipFun), null, Loader.BUFFER);
        }
        zipFun(ab, handler) {
            this.handler = handler;
            Laya.Browser.window.JSZip.loadAsync(ab).then((jszip) => {
                this.analysisFun(jszip);
            });
        }
        analysisFun(jszip) {
            this.currentJSZip = jszip;
            for (var fileName in jszip.files) {
                this.fileNameArr.push(fileName + "");
            }
            this.exeOne();
        }
        exeOne() {
            this.currentJSZip.file(this.fileNameArr[0]).async('text').then((content) => {
                this.over(content);
            });
        }
        over(content) {
            var fileName = this.fileNameArr.shift();
            this.resultArr.push(fileName);
            this.resultArr.push(content);
            if (this.fileNameArr.length != 0) {
                this.exeOne();
            }
            else {
                this.handler.runWith([this.resultArr]);
            }
        }
    }
    ZipLoader.instance = new ZipLoader();

    class HomeLoading extends ui.loadingUI {
        constructor() {
            super();
            this.on(Laya.Event.DISPLAY, this, this.onDis);
        }
        onDis() {
            this.off(Laya.Event.DISPLAY, this, this.onDis);
            this.dengjishuzi.value = "0";
            let arr = [{ url: "res/atlas/pubRes.atlas", type: Laya.Loader.ATLAS }, { url: "res/tables.zip", type: Laya.Loader.BUFFER }];
            Laya.loader.load(arr, Laya.Handler.create(this, this.onCom), new Laya.Handler(this, this.onProgress));
        }
        onProgress(value) {
            value = value * 100;
            this.dengjishuzi.value = value + "%";
        }
        onCom() {
            ZipLoader.instance.zipFun(Laya.loader.getRes("res/tables.zip"), new Laya.Handler(this, this.zipFun));
            Laya.loader.clearRes("res/tables.zip");
        }
        zipFun(arr) {
            GM.onReg();
            Game.tableManager.onParse(arr);
            GM.imgEffect.start();
            GM.viewManager.showView(ViewID.main);
            GM.playMusic("bg.mp3");
            this.destroy(true);
        }
    }

    class InitView extends ui.initViewUI {
        constructor() {
            super();
            this.on(Laya.Event.DISPLAY, this, this.onDis);
        }
        onDis() {
            this.txt.text = "0%";
            Laya.loader.load(["res/config.json"], Laya.Handler.create(this, this.onCom), new Laya.Handler(this, this.onProgress));
        }
        onProgress(value) {
            value = value * 100;
            this.txt.text = value + "%";
        }
        onCom() {
            Game.layerManager.y = (Laya.stage.height - Laya.stage.designHeight) * 0.5;
            let config = Laya.loader.getRes("res/config.json");
            GM.setConfig(config);
            Laya.loader.clearRes("res/config.json");
            if (!this._homeLoading) {
                this._homeLoading = new HomeLoading();
            }
            Game.layerManager.addChild(this._homeLoading);
            this.destroy(true);
        }
    }

    class CellsView extends ui.xuanguan1UI {
        constructor() { super(); }
    }

    class CookieKey {
    }
    CookieKey.MUSIC_SWITCH = "MUSIC_SWITCH";
    CookieKey.SOUND_SWITCH = "SOUND_SWITCH";
    CookieKey.SHAKE_SWITCH = "SHAKE_SWITCH";

    class SettingView extends ui.shezhiUI {
        constructor() {
            super();
            let arr = [this.fanhui, this.yinyue, this.yinxiao, this.zhendong, this.fankui, this.meiri, this.qiuzhu];
            for (let i = 0; i < arr.length; i++) {
                this.addEvent(arr[i], this.onClick);
                GM.imgEffect.addEffect(arr[i]);
            }
            GM.imgEffect.addEffect(this.topImg, 2);
            GM.imgEffect.addEffect(this.bottomImg, 2);
            this.on(Laya.Event.DISPLAY, this, this.onDis);
        }
        onDis() {
            this.yinyue.skin = GM.musicState == 1 ? "pubRes/ic_muisc_yes_1.png" : "pubRes/ic_muisc_no_1.png";
            this.yinxiao.skin = GM.soundState == 1 ? "pubRes/ic_sound_yes_1.png" : "pubRes/ic_sound_no_1.png";
            this.zhendong.skin = GM.shakeState == 1 ? "pubRes/ic_shock_yes_1.png" : "pubRes/ic_shock_no_1.png";
        }
        addEvent(sprite, func) {
            func && sprite.on(Laya.Event.CLICK, this, func, [sprite]);
        }
        onClick(sprite) {
            switch (sprite) {
                case this.fanhui:
                    GM.viewManager.showView(ViewID.main);
                    break;
                case this.yinyue:
                    if (GM.musicState == 1) {
                        GM.musicState = 0;
                        GM.cookie.setCookie(CookieKey.MUSIC_SWITCH, { "state": 0 });
                        Game.soundManager.setMusicVolume(0);
                        this.yinyue.skin = "pubRes/ic_muisc_no_1.png";
                    }
                    else {
                        GM.musicState = 1;
                        GM.cookie.setCookie(CookieKey.MUSIC_SWITCH, { "state": 1 });
                        Game.soundManager.setMusicVolume(1);
                        GM.playMusic("bg.mp3");
                        this.yinyue.skin = "pubRes/ic_muisc_yes_1.png";
                    }
                    break;
                case this.yinxiao:
                    if (GM.soundState == 1) {
                        GM.soundState = 0;
                        GM.cookie.setCookie(CookieKey.SOUND_SWITCH, { "state": 0 });
                        Game.soundManager.setSoundVolume(0);
                        this.yinxiao.skin = "pubRes/ic_sound_no_1.png";
                    }
                    else {
                        GM.soundState = 1;
                        GM.cookie.setCookie(CookieKey.SOUND_SWITCH, { "state": 1 });
                        Game.soundManager.setSoundVolume(1);
                        this.yinxiao.skin = "pubRes/ic_sound_yes_1.png";
                    }
                    break;
                case this.zhendong:
                    if (GM.shakeState == 1) {
                        GM.shakeState = 0;
                        GM.cookie.setCookie(CookieKey.SHAKE_SWITCH, { "state": 0 });
                        this.zhendong.skin = "pubRes/ic_shock_no_1.png";
                    }
                    else {
                        GM.shakeState = 1;
                        GM.cookie.setCookie(CookieKey.SHAKE_SWITCH, { "state": 1 });
                        this.zhendong.skin = "pubRes/ic_shock_yes_1.png";
                    }
                    break;
                case this.fankui:
                    break;
                case this.meiri:
                    break;
                case this.qiuzhu:
                    break;
            }
        }
    }

    class PlatformID {
    }
    PlatformID.TEST = 0;
    PlatformID.WX = 1;

    class BaseCookie {
    }

    class TestCookie extends BaseCookie {
        constructor() {
            super();
        }
        setCookie(code, data) {
            Laya.LocalStorage.setJSON(code, data);
        }
        getCookie(code, callback) {
            let data = Laya.LocalStorage.getJSON(code);
            callback && callback(data);
        }
        removeCookie(code) {
            Laya.LocalStorage.removeItem(code);
        }
        clearAll() {
            Laya.LocalStorage.clear();
        }
    }

    class BasePlatform {
    }

    class TestPlatform extends BasePlatform {
        checkUpdate() {
        }
        login(callback) {
            callback && callback("shfdsaomghjgai123fdafda456");
        }
        getUserInfo(callback) {
            this.cb = callback;
        }
        clickFun(e) {
        }
        onShare(callback) {
            callback && callback();
        }
    }

    class WXCookie extends BaseCookie {
        constructor() {
            super();
            this.wx = Laya.Browser.window.wx;
        }
        setCookie(code, data1) {
            this.wx.setStorage({
                key: code,
                data: data1,
                success(res) {
                }
            });
        }
        getCookie(code, callback) {
            this.wx.getStorage({
                key: code,
                success(res) {
                    callback && callback(res.data);
                },
                fail(res) {
                    callback && callback(null);
                },
                complete(res) {
                }
            });
        }
        removeCookie(code) {
            this.wx.removeStorage({
                key: code,
                success(res) {
                }
            });
        }
        clearAll() {
            this.wx.clearStorage();
        }
    }

    class WXPlatform extends BasePlatform {
        constructor() {
            super();
            this.tag = 0;
        }
        checkUpdate() {
            Laya.Browser.window.wx.setKeepScreenOn({
                keepScreenOn: true
            });
            if (Laya.Browser.window.wx.getUpdateManager) {
                console.log("基础库 1.9.90 开始支持，低版本需做兼容处理");
                const updateManager = Laya.Browser.window.wx.getUpdateManager();
                updateManager.onCheckForUpdate(function (result) {
                    if (result.hasUpdate) {
                        console.log("有新版本");
                        updateManager.onUpdateReady(function () {
                            console.log("新的版本已经下载好");
                            Laya.Browser.window.wx.showModal({
                                title: '更新提示',
                                content: '新版本已经下载，是否重启？',
                                success: function (result) {
                                    if (result.confirm) {
                                        updateManager.applyUpdate();
                                    }
                                }
                            });
                        });
                        updateManager.onUpdateFailed(function () {
                            console.log("新的版本下载失败");
                            Laya.Browser.window.wx.showModal({
                                title: '已经有新版本了',
                                content: '新版本已经上线啦，请您删除当前小游戏，重新搜索打开'
                            });
                        });
                    }
                    else {
                        console.log("没有新版本");
                    }
                });
            }
            else {
                console.log("有更新肯定要用户使用新版本，对不支持的低版本客户端提示");
                Laya.Browser.window.wx.showModal({
                    title: '温馨提示',
                    content: '当前微信版本过低，无法使用该应用，请升级到最新微信版本后重试。'
                });
            }
        }
        login(callback) {
            Laya.Browser.window.wx.login({
                success: (res) => {
                    if (res.code) {
                        callback && callback(res.code);
                    }
                }
            });
        }
        getUserInfo(callback) {
            if (this.userBtn) {
                return;
            }
            this.userBtn = Laya.Browser.window.wx.createUserInfoButton({
                type: 'text',
                text: '',
                style: {
                    width: Laya.Browser.window.wx.getSystemInfoSync().windowWidth,
                    height: Laya.Browser.window.wx.getSystemInfoSync().windowHeight
                }
            });
            this.userBtn.onTap((resButton) => {
                if (resButton.errMsg == "getUserInfo:ok") {
                    GM.userHeadUrl = resButton.userInfo.avatarUrl;
                    GM.userName = resButton.userInfo.nickName;
                    this.filterEmoji();
                    this.userBtn.destroy();
                    callback && callback();
                }
                else {
                    console.log("授权失败");
                }
            });
        }
        wxAuthSetting() {
            console.log("wx.getSetting");
            Laya.Browser.window.wx.getSetting({
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
        filterEmoji() {
            var strArr = GM.userName.split(""), result = "", totalLen = 0;
            for (var idx = 0; idx < strArr.length; idx++) {
                if (totalLen >= 16)
                    break;
                var val = strArr[idx];
                if (/[a-zA-Z]/.test(val)) {
                    totalLen = 1 + (+totalLen);
                    result += val;
                }
                else if (/[\u4e00-\u9fa5]/.test(val)) {
                    totalLen = 2 + (+totalLen);
                    result += val;
                }
                else if (/[\ud800-\udfff]/.test(val)) {
                    if (/[\ud800-\udfff]/.test(strArr[idx + 1])) {
                        idx++;
                    }
                    result += "?";
                }
            }
            GM.userName = result;
            console.log("过滤之后", GM.userName);
        }
        onShare(callback) {
            Laya.Browser.window.wx.shareAppMessage({
                title: "来吧，pk一下吧！",
                imageUrl: "https://img.kuwan511.com/arrowLegend/share.jpg",
                destWidth: 500,
                destHeight: 400
            });
            Laya.Browser.window.wx.onShow(res => {
                console.log("onShow", this.tag);
                if (this.tag == 1000) {
                    Laya.Browser.window.wx.offShow();
                    Laya.Browser.window.wx.offHide();
                    this.tag = -1;
                }
            });
            Laya.Browser.window.wx.onHide(res => {
                this.tag = 1000;
                console.log("onHide");
            });
        }
    }

    class GM {
        static setConfig(config) {
            GM.isConsoleLog = config.isConsoleLog;
            GM.platformId = config.platformId;
            if (config.platformId == PlatformID.TEST) {
                GM.cookie = new TestCookie();
                GM.platform = new TestPlatform();
            }
            else if (config.platformId == PlatformID.WX) {
                GM.cookie = new WXCookie();
                GM.platform = new WXPlatform();
            }
            this.setMusic();
            this.setSound();
            this.setShake();
        }
        static setMusic() {
            GM.cookie.getCookie(CookieKey.MUSIC_SWITCH, (res) => {
                if (res == null) {
                    GM.cookie.setCookie(CookieKey.MUSIC_SWITCH, { "state": 1 });
                    Game.soundManager.setMusicVolume(1);
                    GM.musicState = 1;
                }
                else {
                    Game.soundManager.setMusicVolume(res.state);
                    GM.musicState = res.state;
                }
            });
        }
        static setSound() {
            GM.cookie.getCookie(CookieKey.SOUND_SWITCH, (res) => {
                if (res == null) {
                    GM.cookie.setCookie(CookieKey.SOUND_SWITCH, { "state": 1 });
                    Game.soundManager.setSoundVolume(1);
                    GM.soundState = 1;
                }
                else {
                    Game.soundManager.setSoundVolume(res.state);
                    GM.soundState = res.state;
                }
            });
        }
        static setShake() {
            GM.cookie.getCookie(CookieKey.SHAKE_SWITCH, (res) => {
                if (res == null) {
                    GM.cookie.setCookie(CookieKey.SHAKE_SWITCH, { "state": 1 });
                    GM.shakeState = 1;
                }
                else {
                    GM.shakeState = res.state;
                }
            });
        }
        static playMusic(musicUrl) {
            if (GM.musicState == 1) {
                Game.soundManager.play(musicUrl, true);
            }
        }
        static playSound(soundUrl) {
            if (GM.soundState == 1) {
                Game.soundManager.play(soundUrl);
            }
        }
        static startGame() {
            Game.layerManager.addChild(new InitView());
        }
        static log(message, ...optionalParams) {
            if (GM.isConsoleLog == 1) {
                console.log(message, optionalParams);
            }
        }
        static onReg() {
            Game.tableManager.register(SysTitles.NAME, SysTitles);
            let REG = Laya.ClassUtils.regClass;
            REG(ViewID.main, MainView);
            REG(ViewID.setting, SettingView);
            REG(ViewID.cells, CellsView);
            let CLAS = [Level_1, Level_2, Level_3, Level_4, Level_5, Level_6, Level_7, Level_8, Level_9, Level_10, Level_11, Level_12, Level_13, Level_14, Level_15, Level_16];
            let index = 1;
            for (let i = 0; i < CLAS.length; i++) {
                REG(index, CLAS[i]);
                index++;
            }
        }
    }
    GM.codeVer = "0.0.1.1839";
    GM.resVer = "0.0.1.1839";
    GM.viewManager = new ViewManager();
    GM.imgEffect = new ImageEffect();
    GM.musicState = 1;
    GM.soundState = 1;
    GM.shakeState = 1;
    GM.nativefiles = ["loading/loding.png", "loading/shuzi2.png", "loading/jiazaizhong.png"];

    class Main {
        constructor() {
            Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
            Laya.stage.scaleMode = GameConfig.scaleMode;
            Laya.stage.screenMode = GameConfig.screenMode;
            Laya.stage.alignV = GameConfig.alignV;
            Laya.stage.alignH = GameConfig.alignH;
            Laya.stage.bgColor = "#ffffff";
            Laya.stage.frameRate = Laya.Stage.FRAME_SLOW;
            Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
            if (GameConfig.stat)
                Laya.Stat.show();
            console.log("代码版本", GM.codeVer);
            console.log("资源版本", GM.resVer);
            if (Laya.Browser.window.wx) {
                Laya.URL.basePath = "https://img.kuwan511.com/brainOut/" + GM.resVer + "/";
                Laya.MiniAdpter.nativefiles = GM.nativefiles;
            }
            Game.init("res/sounds/");
            GM.startGame();
        }
    }
    new Main();

}());
