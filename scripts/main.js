"use strict";
class CControls extends CTableData {
    constructor() {
        super(["control", "id", "element", "className", "controlNamePath", "name"], ["control", "id", "element", "className", "controlNamePath", "name"], ["object", "id", "controlNamePath"]);
    }
    findControls(values) {
        let rt = new Array();
        let arr = this.find(values);
        for (let n = 0; n < arr.length; n++) {
            rt.push({
                control: arr[n].get(0).asObject,
                id: arr[n].get(1).asString,
                element: arr[n].get(2).asObject,
                className: arr[n].get(3).asString,
                controlNamePath: arr[n].get(4).asString,
                name: arr[n].get(5).asString
            });
        }
        return rt;
    }
    addControl(control) {
        CSystem.controls.add([control, control.id, control.controlElement, control.className, control.getNamPath(), control.name]);
        window[control.name] = control;
    }
    deleteControl(control) {
        let arr = this.findIndexRow("control", control);
        this.delete(arr);
        delete window[control.name];
    }
    getControlFromElement(e) {
        let arr = CSystem.controls.findControls([{ columnName: "element", value: e }]);
        if (arr.length > 0) {
            return arr[0].control;
        }
        else {
            return undefined;
        }
    }
    getControlFromId(id) {
        let arr = CSystem.controls.findControls([{ columnName: "id", value: id }]);
        if (arr.length > 0) {
            return arr[0].control;
        }
        else {
            return undefined;
        }
    }
}
class CPaper extends CSelectArea {
    constructor() {
        super(...arguments);
        this._useDraw = true;
    }
    get useDraw() {
        return this._useDraw;
    }
    set useDraw(value) {
        this._useDraw = value;
    }
    doThisPointerMove(e, points) {
        super.doThisPointerMove(e, points);
    }
    doPenDraw(e) {
        super.doPenDraw(e);
    }
}
class CIcon extends CPanel {
    constructor(parent, name) {
        super(parent, name);
        this.linkClassName = "";
        this.useMove = true;
        this.moveAreaLength = -1;
        this.useResize = false;
        this.resizeAreaLength = 0;
        this.usePointerCapture = true;
        this.useMoveClick = true;
    }
    doResource() {
        super.doResource();
        this.useMove = true;
        this.moveAreaLength = -1;
        this.useResize = false;
        this.resizeAreaLength = 0;
        this.usePointerCapture = true;
        this.useMoveClick = true;
    }
    doFromData(data) {
        super.doFromData(data);
        this.useMove = true;
        this.moveAreaLength = -1;
        this.useResize = false;
        this.resizeAreaLength = 0;
        this.usePointerCapture = true;
        this.useMoveClick = true;
    }
    doThisPointerDown(e, points) {
        if (!this.selected) {
            if (this.parent != undefined && this.parent instanceof CICons) {
                let arr = this.parent.getSelectedIcons();
                for (let n = 0; n < arr.length; n++) {
                    arr[n].selected = false;
                }
            }
            this.selected = true;
        }
        super.doThisPointerDown(e, points);
    }
    doMove(e) {
        super.doMove(e);
        if (this.parent != undefined && this.parent instanceof CICons) {
            let arr = this.parent.getSelectedIcons();
            for (let n = 0; n < arr.length; n++) {
                if (arr[n] != this) {
                    arr[n].position.left += this.position.left - this.__preMovePoint.x;
                    arr[n].position.top += this.position.top - this.__preMovePoint.y;
                }
            }
        }
    }
    doClick(e) {
        super.doClick(e);
        let f = new Function("return new " + this.linkClassName + "()");
        let app = f();
        app.desktop = CSystem.desktopList.get(0);
        app.data = this.data;
        app.execute();
    }
}
class CTaskbarIcon extends CIcon {
    get seq() {
        return this._seq;
    }
    set seq(value) {
        if (this._seq != value) {
            this._seq = value;
            if (this.taskbar != undefined)
                this.taskbar.doChangeTaskbarIconSeq(this);
        }
    }
    constructor(parent, name) {
        super(parent, name);
        this._seq = -1;
        this.lockMoveY = true;
    }
    doResource() {
        super.doResource();
        this.lockMoveY = true;
    }
    doRemove() {
        this.taskbar = undefined;
        this.data = undefined;
        super.doRemove();
    }
}
class CICons extends CPaper {
    doSelectArea(startPoint, stopPoint) {
        super.doSelectArea(startPoint, stopPoint);
        let arr = this.getIcons();
        let rtSel = new CRect(startPoint.x, startPoint.y, stopPoint.x, stopPoint.y);
        for (let n = 0; n < arr.length; n++) {
            let rt = new CRect(arr[n].position.left, arr[n].position.top, arr[n].position.left + arr[n].position.width, arr[n].position.top + arr[n].position.height);
            arr[n].selected = rtSel.isIntersection(rt);
        }
    }
    doKeyDown(e) {
        super.doKeyDown(e);
        if (e.ctrlKey && e.key.toUpperCase() == "A") {
            let arr = this.getIcons();
            for (let n = 0; n < arr.length; n++) {
                arr[n].selected = true;
            }
        }
    }
    getIcons() {
        let arr = new Array();
        let ar = CSystem.getChildControls(this);
        for (let n = 0; n < ar.length; n++) {
            if (ar[n] instanceof CIcon) {
                arr.push(ar[n]);
            }
        }
        return arr;
    }
    getSelectedIcons() {
        let arr = new Array();
        let ar = CSystem.getChildControls(this);
        for (let n = 0; n < ar.length; n++) {
            if (ar[n] instanceof CIcon && ar[n].selected) {
                arr.push(ar[n]);
            }
        }
        return arr;
    }
    alignIcons(kind, length, margin, rightOrBottom) {
        if (kind == "force") {
            let arr = this.getIcons();
            let x = margin;
            let y = margin;
            if (rightOrBottom == "right") {
                for (let n = 0; n < arr.length; n++) {
                    if (x + length > window.innerWidth) {
                        x = margin;
                        y += length + margin;
                    }
                    arr[n].position.left = x;
                    arr[n].position.top = y;
                    x += length + margin;
                }
            }
            else {
                for (let n = 0; n < arr.length; n++) {
                    if (y + length > window.innerHeight) {
                        y = margin;
                        x += length + margin;
                    }
                    arr[n].position.left = x;
                    arr[n].position.top = y;
                    y += length + margin;
                }
            }
        }
        else {
            let set = new Set();
            let arr = this.getIcons();
            for (let n = 0; n < arr.length; n++) {
                let v = Math.floor(arr[n].position.left / (length + margin));
                let x = v * (length + margin);
                v = Math.floor(arr[n].position.top / (length + margin));
                let y = v * (length + margin);
                while (true) {
                    if (set.has(x + "," + y)) {
                        if (rightOrBottom == "right") {
                            x += length + margin;
                            if (x + length > window.innerWidth) {
                                x = margin;
                                y += length + margin;
                            }
                        }
                        else {
                            y += length + margin;
                            if (y + length > window.innerHeight) {
                                y = margin;
                                x += length + margin;
                            }
                        }
                    }
                    else {
                        set.add(x + "," + y);
                        arr[n].position.left = x + margin;
                        arr[n].position.top = y + margin;
                        break;
                    }
                }
            }
        }
    }
}
class CApplication extends CDataClass {
    static doBeforeExecute(app) {
    }
    static doAfterExecute(app) {
    }
    static doBeforeTerminate(app) {
    }
    static doAfterTerminate(app) {
    }
    get applicationId() {
        return this._applicationId;
    }
    constructor() {
        super();
        this._applicationId = CSequence.getSequence(this.className);
    }
    doRemove() {
        super.doRemove();
        this.desktop = undefined;
    }
    doExecute() {
        CApplication.applications.set(this.applicationId, this);
    }
    doTerminate() {
        CApplication.applications.delete(this.applicationId);
        this.remove();
    }
    execute() {
        CApplication.doBeforeExecute(this);
        this.doExecute();
        CApplication.doAfterExecute(this);
    }
    terminate() {
        CApplication.doBeforeTerminate(this);
        this.doTerminate();
        CApplication.doAfterTerminate(this);
    }
}
CApplication.systemIcon = new Map();
CApplication.applications = new Map();
class CCoverApplication extends CApplication {
    constructor() {
        super();
        this.defaultWidth = 1000;
        this.defaultHeight = 600;
        this.appName = "";
    }
    doExecute() {
        super.doExecute();
        if (this.desktop != undefined && this.desktop.cover != undefined) {
            let self = this;
            this.desktop.cover.onHide = function () {
                if (self.desktop != undefined && self.desktop.cover != undefined)
                    self.doCoverHide(self.desktop.cover);
            };
            this.doCoverShow(this.desktop.cover);
        }
        else {
            this.terminate();
        }
    }
    doCoverShow(cover) {
        cover.showCover();
    }
    doCoverHide(cover) {
    }
}
class CWindowApplication extends CApplication {
    get mainWindow() {
        return this._mainWindow;
    }
    constructor() {
        super();
        this.defaultWidth = 1000;
        this.defaultHeight = 600;
        this.appName = "";
        let self = this;
        this._mainWindow = new CWindowModel(undefined, this.applicationId);
        //this._mainWindow.resource = "window_black.frame"
        this._mainWindow.resource = "window_sky.frame";
        this._mainWindow.closeAction = "hide";
        this._mainWindow.onHide = function () {
            self.doWindowClose();
        };
    }
    doRemove() {
        this._mainWindow.remove();
        super.doRemove();
    }
    doExecute() {
        super.doExecute();
        if (this.desktop != undefined) {
            this.mainWindow.parent = this.desktop.applicationLayer;
            this.mainWindow.showCenter(this.defaultWidth, this.defaultHeight, this.appName, "hide");
        }
    }
    doWindowClose() {
        this.terminate();
        if (this.onWindowClose != undefined) {
            this.onWindowClose(this);
        }
    }
}
class CTaskbar extends CPanel {
    get iconLength() {
        return this._iconLength;
    }
    set iconLength(value) {
        if (this._iconLength != value) {
            this._iconLength = value;
            this.doChangeIconLengthMargin();
        }
    }
    get iconMargin() {
        return this._iconMargin;
    }
    set iconMargin(value) {
        if (this._iconMargin != value) {
            this._iconMargin = value;
            this.doChangeIconLengthMargin();
        }
    }
    constructor(parent, name) {
        super(parent, name);
        this._iconLength = 50;
        this._iconMargin = 10;
        this.iconsLeft = new CList();
        this.iconsRight = new CList();
        let self = this;
        CSystem.onResourceLoad.push(function () {
            self.init();
        });
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "iconLength", this.iconLength, 50);
        CDataClass.putData(data, "iconMargin", this.iconMargin, 10);
    }
    doFromData(data) {
        super.doFromData(data);
        this.iconLength = CDataClass.getData(data, "iconLength", 50);
        this.iconMargin = CDataClass.getData(data, "iconMargin", 10);
    }
    doRemove() {
        super.doRemove();
        this.desktop = undefined;
    }
    doChangeSize() {
        super.doChangeSize();
        this.doSetIconsPosition();
    }
    doNotifyAppsChange() {
    }
    doChangeTaskbarIconSeq(icon) {
        let x = (icon.seq * (this.iconLength + this.iconMargin)) + this.iconMargin;
        icon.position.left = x;
        icon.position.top = this.position.height - this.iconLength - this.iconMargin;
    }
    doChangeIconLengthMargin() {
        this.doSetIconsPosition();
    }
    doSetIconsPosition() {
        for (let n = 0; n < this.iconsLeft.length; n++) {
            let x = (n * (this.iconLength + this.iconMargin)) + this.iconMargin;
            this.iconsLeft.get(n).position.left = x;
            this.iconsLeft.get(n).position.top = this.position.height - this.iconLength - this.iconMargin;
            this.iconsLeft.get(n).position.width = this.iconLength;
            this.iconsLeft.get(n).position.height = this.iconLength;
        }
        for (let n = 0; n < this.iconsRight.length; n++) {
            let x = this.position.width - (((n + 1) * (this.iconLength + this.iconMargin)));
            this.iconsRight.get(n).position.left = x;
            this.iconsRight.get(n).position.top = this.position.height - this.iconLength - this.iconMargin;
            this.iconsRight.get(n).position.width = this.iconLength;
            this.iconsRight.get(n).position.height = this.iconLength;
        }
    }
    doCreateIcons() {
        let self = this;
        function setIconResource(icon) {
            let rc = CApplication.systemIcon.get(icon.linkClassName);
            if (rc != undefined) {
                if (CSystem.resources.has(rc)) {
                    icon.resource = rc;
                }
                else {
                    icon.resource = "empty_icon_button.control";
                    icon.text = rc;
                }
            }
            else {
                icon.resource = "empty_icon_button.control";
                icon.text = icon.linkClassName;
            }
            /*icon.onClick = function() {
                let f = new Function("return new " + icon.linkClassName + "()")
                let app = f()
                app.desktop = self.desktop
                app.data = icon.data
                app.execute()
            }*/
        }
        for (let n = 0; n < CTaskbar.fixListLeft.length; n++) {
            let ti = new CTaskbarIcon(this);
            ti.linkClassName = CTaskbar.fixListLeft.get(n);
            setIconResource(ti);
            ti.taskbar = this;
            ti.seq = n;
            this.iconsLeft.add(ti);
        }
        for (let n = 0; n < CTaskbar.fixListRight.length; n++) {
            let ti = new CTaskbarIcon(this);
            ti.linkClassName = CTaskbar.fixListRight.get(n);
            setIconResource(ti);
            ti.taskbar = this;
            ti.seq = n;
            ti.useMove = false;
            this.iconsRight.add(ti);
        }
    }
    init() {
        this.doCreateIcons();
        this.doSetIconsPosition();
    }
}
CTaskbar.fixListLeft = new CList();
CTaskbar.fixListRight = new CList();
CTaskbar.systemTaskbars = new CList();
class CDesktop extends CICons {
    get backgroundImageSrc() {
        return this._backgroundImageSrc;
    }
    set backgroundImageSrc(value) {
        if (this._backgroundImageSrc != value) {
            this._backgroundImageSrc = value;
            let arr = this.layers.getCanvasItems("backgroundImage");
            for (let n = 0; n < arr.length; n++) {
                arr[n].imageSrc = value;
            }
        }
    }
    constructor(parent, name) {
        super(parent, name);
        this.backgroundLayer = new CAnimationControl(this);
        this.iconLayer = new CPanel(this);
        this.gadgetLayer = new CPanel(this);
        this.clock = new CClock(this.gadgetLayer);
        this.applicationLayer = new CPanel(this);
        this.frontLayer = new CPanel(this);
        this.cover = new CCover(this);
        this.menu = new CPanel(this);
        this.popupDesktop = new CPopup();
        this.popupTaskbar = new CPopup();
        this.popupTaskbarIcon = new CPopup();
        this.popupIcon = new CPopup();
        this.taskbar = new CTaskbar(this);
        this._backgroundImageSrc = "";
        this.taskbar.desktop = this;
        this.iconLayer.position.align = EPositionAlign.CLIENT;
        this.gadgetLayer.position.align = EPositionAlign.CLIENT;
        this.applicationLayer.position.align = EPositionAlign.CLIENT;
        this.frontLayer.position.align = EPositionAlign.CLIENT;
        this.backgroundLayer.position.align = EPositionAlign.CLIENT;
        this.clock.on();
    }
    doResource() {
        super.doResource();
        this.iconLayer.position.align = EPositionAlign.CLIENT;
        this.gadgetLayer.position.align = EPositionAlign.CLIENT;
        this.applicationLayer.position.align = EPositionAlign.CLIENT;
        this.frontLayer.position.align = EPositionAlign.CLIENT;
        this.backgroundLayer.position.align = EPositionAlign.CLIENT;
        this.applicationLayer.transform.translateZ = 0;
        CSystem.setDesktopSize(CSystem.desktopAlignKind);
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "taskbar", this.taskbar.toData(), {}, true);
        CDataClass.putData(data, "menu", this.menu.toData(), {}, true);
        CDataClass.putData(data, "popupDesktop", this.popupDesktop.toData(), {}, true);
        CDataClass.putData(data, "popupTaskbar", this.popupTaskbar.toData(), {}, true);
        CDataClass.putData(data, "popupTaskbarIcon", this.popupTaskbarIcon.toData(), {}, true);
        CDataClass.putData(data, "popupIcon", this.popupIcon.toData(), {}, true);
        CDataClass.putData(data, "iconLayer", this.iconLayer.toData(), {}, true);
        CDataClass.putData(data, "backgroundLayer", this.backgroundLayer.toData(), {}, true);
        CDataClass.putData(data, "gadgetLayer", this.gadgetLayer.toData(), {}, true);
        CDataClass.putData(data, "clock", this.clock.toData(), {}, true);
        CDataClass.putData(data, "applicationLayer", this.applicationLayer.toData(), {}, true);
        CDataClass.putData(data, "frontLayer", this.frontLayer.toData(), {}, true);
        CDataClass.putData(data, "cover", this.cover.toData(), {}, true);
    }
    doFromData(data) {
        super.doFromData(data);
        this.taskbar.fromData(CDataClass.getData(data, "taskbar", {}, true));
        this.menu.fromData(CDataClass.getData(data, "menu", {}, true));
        this.popupDesktop.fromData(CDataClass.getData(data, "popupDesktop", {}, true));
        this.popupTaskbar.fromData(CDataClass.getData(data, "popupTaskbar", {}, true));
        this.popupTaskbarIcon.fromData(CDataClass.getData(data, "popupTaskbarIcon", {}, true));
        this.popupIcon.fromData(CDataClass.getData(data, "popupIcon", {}, true));
        this.iconLayer.fromData(CDataClass.getData(data, "iconLayer", {}, true));
        this.backgroundLayer.fromData(CDataClass.getData(data, "backgroundLayer", {}, true));
        this.gadgetLayer.fromData(CDataClass.getData(data, "gadgetLayer", {}, true));
        this.clock.fromData(CDataClass.getData(data, "clock", {}, true));
        this.applicationLayer.fromData(CDataClass.getData(data, "applicationLayer", {}, true));
        this.frontLayer.fromData(CDataClass.getData(data, "frontLayer", {}, true));
        this.cover.fromData(CDataClass.getData(data, "cover", {}, true));
        this.iconLayer.position.align = EPositionAlign.CLIENT;
        this.gadgetLayer.position.align = EPositionAlign.CLIENT;
        this.applicationLayer.position.align = EPositionAlign.CLIENT;
        this.frontLayer.position.align = EPositionAlign.CLIENT;
        this.backgroundLayer.position.align = EPositionAlign.CLIENT;
        this.applicationLayer.transform.translateZ = 0;
    }
    doChangeSize() {
        super.doChangeSize();
        this.cover.position.width = this.position.width;
        this.cover.position.height = this.position.height;
    }
    alignIcons(kind, length, margin, rightOrBottom) {
        if (kind == "force") {
            let arr = this.getIcons();
            let x = margin;
            let y = margin;
            if (rightOrBottom == "right") {
                for (let n = 0; n < arr.length; n++) {
                    if (x + length > window.innerWidth) {
                        x = margin;
                        y += length + margin;
                    }
                    arr[n].position.left = x;
                    arr[n].position.top = y;
                    x += length + margin;
                }
            }
            else {
                for (let n = 0; n < arr.length; n++) {
                    if (y + length > window.innerHeight - this.taskbar.position.height) {
                        y = margin;
                        x += length + margin;
                    }
                    arr[n].position.left = x;
                    arr[n].position.top = y;
                    y += length + margin;
                }
            }
        }
        else {
            let set = new Set();
            let arr = this.getIcons();
            for (let n = 0; n < arr.length; n++) {
                let v = Math.floor(arr[n].position.left / (length + margin));
                let x = v * (length + margin);
                v = Math.floor(arr[n].position.top / (length + margin));
                let y = v * (length + margin);
                while (true) {
                    if (set.has(x + "," + y)) {
                        if (rightOrBottom == "right") {
                            x += length + margin;
                            if (x + length > window.innerWidth) {
                                x = margin;
                                y += length + margin;
                            }
                        }
                        else {
                            y += length + margin;
                            if (y + length > window.innerHeight - this.taskbar.position.height) {
                                y = margin;
                                x += length + margin;
                            }
                        }
                    }
                    else {
                        set.add(x + "," + y);
                        arr[n].position.left = x + margin;
                        arr[n].position.top = y + margin;
                        break;
                    }
                }
            }
        }
    }
    static newDesktopCover(coverName) {
        let cover = new CCover(document.body);
        let i = cover.addLayer().addItem();
        i.fill.styleKind = EStyleKind.SOLID;
        i.fill.solidColor = "rgba(0,0,0,0.8)";
        cover.showAnimationTrigger = new CAnimator(cover, ["line_10000.graph"]);
        cover.showAnimationTrigger.addAnimationGraphProperty("opacity", "line_10000.graph", 0, 1);
        cover.showAnimationTrigger.onGraphAnimate = function (obj, t, v, ct, gn, gv) {
            CSystem.desktopList.get(0).filter.blurValue = gv * 10;
        };
        cover.hideAnimationTrigger = new CAnimator(cover, ["line_10000.graph"]);
        cover.hideAnimationTrigger.addAnimationGraphProperty("opacity", "line_10000.graph", 1, 0);
        cover.hideAnimationTrigger.onGraphAnimate = function (obj, t, v, ct, gn, gv) {
            CSystem.desktopList.get(0).filter.blurValue = 10 - (gv * 10);
        };
        cover.position.left = 0;
        cover.position.top = 0;
        cover.position.width = window.innerWidth;
        cover.position.height = window.innerHeight;
        CSystem.browserCovers.set(coverName, cover);
        return cover;
    }
}
class CSystem {
    static doAnimationFrame(preTime, time) {
        try {
            //if(CSystem.isDraw) CSystem.doRequestOffscreenLayersDraw()
            if (CSystem.isDraw)
                CSystem.doRequestLayersDraw();
            for (let n = 0; n < CSystem.onAnimationFrame.length; n++) {
                CSystem.onAnimationFrame[n](preTime, time);
            }
        }
        catch (e) {
            console.log("do animation frame error", e);
        }
    }
    /*static doRequestOffscreenLayersDraw() {
        if(CSystem.requestOffscreenDraw.size > 0) {
            let arr = new Array()
            CSystem.requestOffscreenDraw.forEach(function(layer) {
                let o:any = {}
                o.id = layer.id
                o.data = layer.toData()
                arr.push(o)
            })
            CSystem.requestOffscreenDraw.clear()
            if(arr.length > 0) {
                let o = {command:"drawLayers", datas:arr}
                CSystem.drawWorker.postMessage(o)
            }
        }
    }*/
    static doRequestLayersDraw() {
        if (CSystem.requestDraw.size > 0) {
            CSystem.requestDraw.forEach(function (layer) {
                try {
                    layer.doDraw();
                }
                catch (e) {
                    console.log("layer draw error", e);
                }
            });
            CSystem.requestDraw.clear();
        }
    }
    static doResourceLoad() {
        for (let n = 0; n < CSystem.requestResources.length; n++) {
            CSystem.requestResources[n].doResource();
        }
        CSystem.requestResources = [];
        for (let n = 0; n < CSystem.onResourceLoad.length; n++) {
            CSystem.onResourceLoad[n]();
        }
    }
    static doGlobalPointerDown(e) {
        let tag = e.target;
        CSystem.hidePickups(tag);
        CSystem.points.set(e.pointerId, e);
        for (let n = 0; n < CSystem.onPointerDown.length; n++) {
            CSystem.onPointerDown[n](e);
        }
    }
    static doGlobalPointerMove(e) {
        for (let n = 0; n < CSystem.onPointerMove.length; n++) {
            CSystem.onPointerMove[n](e);
        }
    }
    static doGlobalPointerUp(e) {
        for (let n = 0; n < CSystem.onPointerUp.length; n++) {
            CSystem.onPointerUp[n](e);
        }
        CSystem.points.delete(e.pointerId);
    }
    static doGlobalPointerCancel(e) {
        for (let n = 0; n < CSystem.onPointerCancel.length; n++) {
            CSystem.onPointerCancel[n](e);
        }
        CSystem.points.delete(e.pointerId);
    }
    static hidePickups(e) {
        let pickups = new Set();
        let arr = CSystem.controls.findControls([{ columnName: "className", value: "CPickupControl" }]);
        let arr2 = CSystem.controls.findControls([{ columnName: "className", value: "CPopup" }]);
        for (let n = 0; n < arr2.length; n++) {
            arr.push(arr2[n]);
        }
        for (let n = 0; n < arr.length; n++) {
            pickups.add(arr[n].control);
        }
        if (pickups.size == 0)
            return;
        let clickcon = CSystem.controls.getControlFromElement(e);
        let ignorePick;
        let pr = e;
        while (pr != null) {
            if (pr.tagName == "CONTROL") {
                let con = CSystem.controls.getControlFromElement(pr);
                if (con instanceof CPickupControl) {
                    ignorePick = con;
                    break;
                }
            }
            pr = pr.parentElement;
        }
        pickups.forEach(function (c) {
            if (ignorePick != undefined) {
                if (c != ignorePick) {
                    c.hide();
                }
            }
            else if (clickcon != undefined) {
                if (!c.ignoreControls.has(clickcon)) {
                    c.hide();
                }
            }
            else {
                c.hide();
            }
        });
    }
    static getOverControls(e, points) {
        let rtn = new Array();
        for (let n = 0; n < CSystem.controls.length; n++) {
            let con = CSystem.controls.getRow(n).get(0).asObject;
            let rt = con.getElementBounds();
            let x = 0;
            let y = 0;
            let be = rt.left <= e.pageX && rt.right >= e.pageX && rt.top <= e.pageY && rt.bottom >= e.pageY;
            if (be) {
                x = e.pageX - rt.left;
                y = e.pageY - rt.top;
            }
            let bp = false;
            for (let i = 0; i < points.length; i++) {
                if (rt.left <= points.get(i).point.pageX && rt.right >= points.get(i).point.pageX && rt.top <= points.get(i).point.pageY && rt.bottom >= points.get(i).point.pageY) {
                    bp = true;
                    x = points.get(i).point.pageX - rt.left;
                    y = points.get(i).point.pageY - rt.top;
                }
            }
            if (be || bp) {
                rtn.push({ control: con, x: x, y: y });
            }
        }
        return rtn;
    }
    static getControl(idOrElement) {
        if (idOrElement instanceof HTMLElement) {
            let row = this.controls.findIndex(2, idOrElement);
            if (row.length > 0)
                return row[0].get(0).asObject;
        }
        else {
            let row = this.controls.findIndex(1, idOrElement);
            if (row.length > 0)
                return row[0].get(0).asObject;
        }
    }
    static getControlsFromClassName(className) {
        let arr = new Array();
        let rows = CSystem.controls.findIndex(3, className);
        for (let n = 0; n < rows.length; n++) {
            arr.push(rows[n].get(0).asObject);
        }
        return arr;
    }
    static getControlsFromName(name) {
        let arr = new Array();
        let rows = CSystem.controls.findIndex(4, name);
        for (let n = 0; n < rows.length; n++) {
            arr.push(rows[n].get(0).asObject);
        }
        return arr;
    }
    static getBroControls(control) {
        let arr = new Array();
        let pr = control.parent;
        if (pr != undefined) {
            for (let n = 0; n < pr.controlElement.children.length; n++) {
                let el = pr.controlElement.children[n];
                if (el.tagName == "CONTROL") {
                    let con = this.getControl(el);
                    arr.push(con);
                }
            }
        }
        else {
            if (control.controlElement.parentElement != null) {
                for (let n = 0; n < control.controlElement.parentElement.children.length; n++) {
                    let el = control.controlElement.parentElement.children[n];
                    if (el.tagName == "CONTROL") {
                        let con = this.getControl(el);
                        arr.push(con);
                    }
                }
            }
        }
        return arr;
    }
    static getBroVisiblePositions(control) {
        let rt = new Array();
        let arr = CSystem.getBroControls(control);
        for (let n = 0; n < arr.length; n++) {
            if (arr[n].visible) {
                rt.push(arr[n].position);
            }
        }
        return rt;
    }
    static getChildControls(control) {
        let arr = new Array();
        for (let n = 0; n < control.controlElement.children.length; n++) {
            let el = control.controlElement.children[n];
            if (el.tagName == "CONTROL") {
                let con = this.getControl(el);
                arr.push(con);
            }
        }
        return arr;
    }
    static getAllChildControls(control) {
        let arr = new Array();
        function setChilds(parent, childs) {
            childs.push(parent);
            let arr = CSystem.getChildControls(parent);
            for (let n = 0; n < arr.length; n++) {
                setChilds(arr[n], childs);
            }
        }
        let ar = CSystem.getChildControls(control);
        for (let n = 0; n < ar.length; n++) {
            setChilds(ar[n], arr);
        }
        return arr;
    }
    static findControls(element) {
        let arr = new Array();
        for (let n = 0; n < element.children.length; n++) {
            let el = element.children[n];
            if (el.tagName == "CONTROL") {
                let con = this.getControl(el);
                arr.push(con);
            }
        }
        return arr;
    }
    static async threadExec(proc) {
        /*let lib = await CBackend.getLib()
        const blob = new Blob([
            lib +
        `
            (async function() {
                await (` + proc.toString() + `)();
                postMessage("t");
            })();
        `], {type:'text/javascript'});
        const url = URL.createObjectURL(blob);
        const worker = new Worker(url);
        worker.onmessage = function(e) {
            if(e.data == "t") worker.terminate();
        }
        URL.revokeObjectURL(url);*/
    }
    static scriptExec(script) {
        let head = document.getElementsByTagName('head')[0];
        let sc = document.createElement('script');
        sc.innerText = script;
        head.appendChild(sc);
    }
    static styleLoad(style) {
        let head = document.getElementsByTagName('head')[0];
        let sc = document.createElement('style');
        sc.innerText = style;
        head.appendChild(sc);
    }
    static showBrowserCover(coverName, beforeShow, isClickHide = true) {
        let co = CSystem.browserCovers.get(coverName);
        if (co != undefined) {
            if (beforeShow != undefined)
                beforeShow(co);
            co.bringToFront();
            co.position.left = 0;
            co.position.top = 0;
            co.position.width = window.innerWidth;
            co.position.height = window.innerHeight;
            co.showCover(isClickHide);
        }
    }
    static hideBrowserCover(coverName) {
        let co = CSystem.browserCovers.get(coverName);
        if (co != undefined) {
            co.hideCover();
        }
    }
    static getZPlus() {
        CSystem.zPlus++;
        return this.zPlus;
    }
    static getZMinus() {
        CSystem.zMinus--;
        return CSystem.zMinus;
    }
    static showMessage(title, msg, callbackfn, width) {
        let cover = CSystem.browserCovers.get("cover");
        if (cover != undefined) {
            let pan = new CPanel(cover);
            let i = pan.addLayer().addItem();
            i.fill.styleKind = EStyleKind.SOLID;
            i.fill.solidColor = "#181818";
            i.radiusX = 5;
            i.radiusY = 5;
            pan.position.align = EPositionAlign.CENTER;
            if (width == undefined) {
                pan.position.width = 300;
            }
            else {
                pan.position.width = width;
            }
            let lbl = new CLabel(pan);
            lbl.position.align = EPositionAlign.TOP;
            lbl.position.height = 40;
            lbl.textSet.fill.solidColor = "#FFFFFF";
            lbl.text = title;
            let btn = new CButton(lbl);
            btn.resource = "button8.control";
            btn.position.align = EPositionAlign.RIGHT;
            btn.position.width = 50;
            btn.position.margins.all = 5;
            btn.text = "확인";
            btn.onClick = function () {
                if (cover != undefined)
                    cover.hideCover();
                if (callbackfn != undefined)
                    callbackfn();
            };
            btn = new CButton(lbl);
            btn.resource = "button8.control";
            btn.position.align = EPositionAlign.LEFT;
            btn.position.width = 50;
            btn.position.margins.all = 5;
            btn.text = "취소";
            btn.onClick = function () {
                if (cover != undefined)
                    cover.hideCover();
            };
            let lblMsg = new CLabel(pan);
            lblMsg.position.align = EPositionAlign.CLIENT;
            lblMsg.textSet.fill.solidColor = "#FFFFFF";
            lblMsg.text = msg;
            let w = CStringUtil.getTextWidth(lblMsg.textSet, msg);
            let h = CStringUtil.getTextHeight(lblMsg.textSet, msg);
            if (w + 20 > pan.position.width) {
                pan.position.width = w + 20;
            }
            pan.position.height = 85;
            if (h + 20 > 40) {
                pan.position.height = h + 20 + 45;
            }
            pan.filter.filterSet.shadow = true;
            pan.filter.shadowX = 0;
            pan.filter.shadowY = 0;
            cover.onHide = function () {
                pan.remove();
            };
            cover.showCover();
        }
    }
    static confirm(title, msg, buttons, cover, callbackfn, width) {
        let pan = new CPanel(cover);
        let i = pan.addLayer().addItem();
        i.fill.styleKind = EStyleKind.SOLID;
        i.fill.solidColor = "#181818";
        i.radiusX = 5;
        i.radiusY = 5;
        pan.position.align = EPositionAlign.CENTER;
        if (width == undefined) {
            pan.position.width = 300;
        }
        else {
            pan.position.width = width;
        }
        let lbl = new CLabel(pan);
        lbl.position.align = EPositionAlign.TOP;
        lbl.position.height = 40;
        lbl.textSet.fill.solidColor = "#FFFFFF";
        lbl.text = title;
        let lblMsg = new CLabel(pan);
        lblMsg.position.align = EPositionAlign.TOP;
        lblMsg.position.height = 40;
        lblMsg.textSet.fill.solidColor = "#FFFFFF";
        lblMsg.text = msg;
        for (let n = 0; n < buttons.length; n++) {
            let btn = new CButton(pan);
            btn.resource = "button8.control";
            btn.position.align = EPositionAlign.TOP;
            btn.position.height = 30;
            btn.position.margins.all = 5;
            btn.position.margins.bottom = 0;
            btn.text = buttons[n];
            btn["index"] = n;
            btn.onClick = function () {
                cover.hideCover();
                callbackfn(btn["index"]);
            };
        }
        pan.position.height = (buttons.length * 35) + 85;
        pan.filter.filterSet.shadow = true;
        pan.filter.shadowX = 0;
        pan.filter.shadowY = 0;
        cover.onHide = function () {
            pan.remove();
        };
        cover.showCover();
    }
    static prompt(title, labels, cover, callbackfn, defaultValue, width) {
        let pan = new CPanel(cover);
        let i = pan.addLayer().addItem();
        i.fill.styleKind = EStyleKind.SOLID;
        i.fill.solidColor = "#181818";
        i.radiusX = 5;
        i.radiusY = 5;
        pan.position.align = EPositionAlign.CENTER;
        if (width == undefined) {
            pan.position.width = 300;
        }
        else {
            pan.position.width = width;
        }
        let lbl = new CLabel(pan);
        lbl.position.align = EPositionAlign.TOP;
        lbl.position.height = 40;
        lbl.textSet.fill.solidColor = "#FFFFFF";
        lbl.text = title;
        let btn = new CButton(lbl);
        btn.resource = "button8.control";
        btn.position.align = EPositionAlign.RIGHT;
        btn.position.width = 50;
        btn.position.margins.all = 5;
        btn.text = "확인";
        btn.onClick = function () {
            let ar = new Array();
            for (let n = 0; n < arr.length; n++) {
                ar.push(arr[n].value);
            }
            if (cover != undefined)
                cover.hideCover();
            callbackfn(ar);
        };
        btn = new CButton(lbl);
        btn.resource = "button8.control";
        btn.position.align = EPositionAlign.LEFT;
        btn.position.width = 50;
        btn.position.margins.all = 5;
        btn.text = "취소";
        btn.onClick = function () {
            if (cover != undefined)
                cover.hideCover();
        };
        let arr = new Array();
        for (let n = 0; n < labels.length; n++) {
            let lbl = new CLabelTextBox(pan);
            lbl.textBox.resource = "textbox32.control";
            lbl.textBox.position.width = 200;
            lbl.textSet.fill.solidColor = "#808080";
            lbl.position.align = EPositionAlign.TOP;
            lbl.position.height = 30;
            lbl.position.margins.all = 5;
            lbl.position.margins.bottom = 0;
            lbl.label = labels[n];
            arr.push(lbl);
        }
        if (defaultValue != undefined) {
            for (let n = 0; n < defaultValue.length; n++) {
                arr[n].value = defaultValue[n];
            }
        }
        pan.position.height = (labels.length * 35) + 45;
        pan.filter.filterSet.shadow = true;
        pan.filter.shadowX = 0;
        pan.filter.shadowY = 0;
        if (cover != undefined) {
            cover.onHide = function () {
                pan.remove();
            };
            cover.showCover();
        }
    }
    static promptSystem(title, labels, callbackfn, defaultValue, width) {
        let cover = CSystem.browserCovers.get("cover");
        if (cover != undefined) {
            CSystem.prompt(title, labels, cover, callbackfn, defaultValue, width);
        }
    }
    static elementSendToBack(element) {
        if (element.parentElement != null) {
            let pr = element.parentElement;
            pr.removeChild(element);
            pr.prepend(element);
        }
    }
    static elementBrintToFront(element) {
        if (element.parentElement != null) {
            let pr = element.parentElement;
            pr.removeChild(element);
            pr.appendChild(element);
        }
    }
    static setClipborad(value) {
    }
    static getClipboard() {
        return "";
    }
    static init(initResourceName) {
        let data = CSystem.resources.get(initResourceName);
        if (data.init != undefined) {
            let fn = new Function(data.init);
            return fn();
        }
    }
    static setToArray(set) {
        let arr = new Array();
        set.forEach(function (v) {
            arr.push(v);
        });
        return arr;
    }
    static setFromArray(set, arr) {
        set.clear();
        for (let n = 0; n < arr.length; n++) {
            set.add(arr[n]);
        }
    }
    static uploadFiles(fnFileList) {
        let el = document.createElement("input");
        el.setAttribute("type", "file");
        el.setAttribute("webkitdirectory", "");
        el.setAttribute("directory", "");
        el.onchange = function (ev) {
            const fl = el.files;
            if (fl != null) {
                if (fnFileList != undefined)
                    fnFileList(fl);
            }
            el.remove();
        };
        el.click();
    }
    static uploadFilesEach(fnFile) {
        let el = document.createElement("input");
        el.setAttribute("type", "file");
        el.setAttribute("webkitdirectory", "");
        el.setAttribute("directory", "");
        el.onchange = function (ev) {
            const fl = el.files;
            if (fl != null) {
                for (let n = 0; n < fl.length; n++) {
                    //console.log((fl[n] as any).webkitRelativePath )
                    fnFile(fl[n]);
                }
            }
            el.remove();
        };
        el.click();
    }
    static saveAsFile(text, filename) {
        // 텍스트 데이터를 Blob 객체로 변환
        const blob = new Blob([text], { type: 'text/plain' });
        // 다운로드 링크 생성
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = filename;
        // 클릭하여 다운로드 시작
        downloadLink.click();
        URL.revokeObjectURL(downloadLink.href);
        /*let hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:attachment/text,' + encodeURI(text);
        hiddenElement.target = '_blank';
        hiddenElement.download = filename;
        hiddenElement.click();*/
    }
    static saveBlobAsFile(blob, filename) {
        var url = URL.createObjectURL(blob);
        var link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
    }
    static loadFromFile(fn) {
        let input = document.createElement("input");
        input.type = "file";
        input.click();
        input.onchange = function (e) {
            if (input.files != null) {
                fn(input.files[0]);
            }
        };
    }
    static loadFromFiles(fn) {
        let input = document.createElement("input");
        input.type = "file";
        input.multiple = true;
        input.click();
        input.onchange = function (e) {
            if (input.files != null) {
                fn(input.files);
            }
        };
    }
    static async loadSystemResource() {
        CTimeChecker.startChecker();
        await loadSystemResource();
        /*let o = JSON.parse(await fetchBody(CON_HOST + "/api/resource/v1/systemresource"))
        console.log(o)
        if(o.result == "success") {
            for(let n = 0; n < o.resources.length; n++) {
                let arr = o.resources[n].fileName.split("/")
                console.log(arr[arr.length - 1], JSON.parse(o.resources[n].data))
                CSystem.resources.set(arr[arr.length - 1], JSON.parse(o.resources[n].data))
            }
        } else {
            alert(o.message)
        }*/
        console.log("system resource load", CTimeChecker.stopChecker());
    }
    static isDarkMode() {
        if (window.matchMedia) {
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        else {
            return false;
        }
    }
    static setDesktopSize(align) {
        if (align == undefined || align == "client") {
            for (let n = 0; n < CSystem.desktopList.length; n++) {
                CSystem.desktopList.get(n).position.left = 0;
                CSystem.desktopList.get(n).position.top = 0;
                CSystem.desktopList.get(n).position.width = window.innerWidth;
                CSystem.desktopList.get(n).position.height = window.innerHeight;
            }
        }
        else if (align == "vert") {
            let h = window.innerHeight / CSystem.desktopList.length;
            for (let n = 0; n < CSystem.desktopList.length; n++) {
                CSystem.desktopList.get(n).position.left = 0;
                CSystem.desktopList.get(n).position.top = n * h;
                CSystem.desktopList.get(n).position.width = window.innerWidth;
                CSystem.desktopList.get(n).position.height = h;
            }
        }
        else if (align == "horz") {
            let w = window.innerWidth / CSystem.desktopList.length;
            for (let n = 0; n < CSystem.desktopList.length; n++) {
                CSystem.desktopList.get(n).position.left = n * w;
                CSystem.desktopList.get(n).position.top = 0;
                CSystem.desktopList.get(n).position.width = w;
                CSystem.desktopList.get(n).position.height = window.innerHeight;
            }
        }
        else if (align == "grid") {
            let cnt = Math.floor(Math.sqrt(CSystem.desktopList.length));
            let idx = 0;
            let x = 0;
            let y = 0;
            let w = window.innerWidth / cnt;
            let h = window.innerHeight / Math.ceil((CSystem.desktopList.length / cnt));
            while (true) {
                let l = x * w;
                let t = y * h;
                CSystem.desktopList.get(idx).position.left = l;
                CSystem.desktopList.get(idx).position.top = t;
                CSystem.desktopList.get(idx).position.width = w;
                CSystem.desktopList.get(idx).position.height = h;
                x++;
                if (x >= cnt) {
                    x = 0;
                    y++;
                }
                idx++;
                if (idx >= CSystem.desktopList.length)
                    break;
            }
        }
    }
    static newDesktop() {
        let d = new CDesktop(CSystem.clientBody, CSequence.getSequence("desktop"));
        CSystem.desktopList.add(d);
        CSystem.setDesktopSize(CSystem.desktopAlignKind);
        return d;
    }
}
CSystem.points = new Map();
CSystem.dragControls = new Set();
CSystem.resourcesLoad = false;
CSystem.controls = new CControls(); //0:object 1:id 2:HTMLElement 3:className 4:controlNamePath 5:name    
CSystem.resources = new Map();
CSystem.requestResources = new Array();
CSystem.clientBody = new CPanel();
CSystem.desktopList = new CList();
CSystem.desktopAlignKind = "client";
CSystem.browserCovers = new Map();
CSystem.systemFont = new Map();
//static requestOffscreenDraw = new CSet<COffscreenCanvasLayer>()
CSystem.requestDraw = new CSet();
CSystem.isDraw = true;
CSystem.onAnimationFrame = new Array();
CSystem.onResourceLoad = new Array();
CSystem.onResourceLazyLoad = new Array();
CSystem.onPointerDown = new Array();
CSystem.onPointerMove = new Array();
CSystem.onPointerUp = new Array();
CSystem.onPointerCancel = new Array();
CSystem.zPlus = 0;
CSystem.zMinus = 0;
const CON_SOCKET_URL = "ws://localhost";
const CON_HOST = "http://localhost";
{
    CSystem.styleLoad(`
        .scrollno {-ms-overflow-style: none;scrollbar-width: none;}
        .scrollno::-webkit-scrollbar {display: none;}
    `);
    let bufferingCanvas = document.createElement("canvas");
    let ctx = bufferingCanvas.getContext("2d");
    if (ctx != null) {
        CSystem.bufferingContext = ctx;
    }
    let preTime;
    function _t(t) {
        let now = new Date().getTime();
        if (preTime != undefined) {
            CSystem.doAnimationFrame(preTime, now);
        }
        preTime = now;
        window.requestAnimationFrame(_t);
    }
    window.requestAnimationFrame(_t);
    (async function () {
        await CSystem.loadSystemResource();
        CSystem.resourcesLoad = true;
        CSystem.doResourceLoad();
    })();
    loadLazyResource();
    window.addEventListener("pointerdown", function (e) {
        CSystem.doGlobalPointerDown(e);
    });
    window.addEventListener("pointermove", function (e) {
        CSystem.doGlobalPointerMove(e);
    });
    window.addEventListener("pointerup", function (e) {
        CSystem.doGlobalPointerUp(e);
    });
    window.addEventListener("pointercancel", function (e) {
        CSystem.doGlobalPointerCancel(e);
    });
    window.addEventListener("load", function () {
        this.document.body.appendChild(CSystem.clientBody.controlElement);
        CSystem.clientBody.position.left = 0;
        CSystem.clientBody.position.top = 0;
        CSystem.clientBody.position.width = window.innerWidth;
        CSystem.clientBody.position.height = window.innerHeight;
        CDesktop.newDesktopCover("cover");
        window.onresize = function () {
            CSystem.clientBody.position.left = 0;
            CSystem.clientBody.position.top = 0;
            CSystem.clientBody.position.width = window.innerWidth;
            CSystem.clientBody.position.height = window.innerHeight;
            CSystem.clientBody.transform.translateZ = 0;
            CSystem.setDesktopSize(CSystem.desktopAlignKind);
            CSystem.browserCovers.forEach(function (v) {
                v.position.left = 0;
                v.position.top = 0;
                v.position.width = window.innerWidth;
                v.position.height = window.innerHeight;
            });
        };
        //CSystem.onResourceLoad.push(function() {
        //let desktop = CSystem.newDesktop()        
        //desktop.resource = "desktop_dark2.control"
        //CApplication.systemIcon.set("CAppBell", "bell_button.control")
        //CApplication.systemIcon.set("CAppFinder", "directory_button.control")
        //CApplication.systemIcon.set("CAppTextEditor", "text_button.control")
        //CApplication.systemIcon.set("CAppSearchNaver", "text_button.control")
        //CApplication.systemIcon.set("CAppLayersEditor", "shape_button.control")
        //CApplication.systemIcon.set("CAppPathEditor", "shape_button.control")
        //CApplication.systemIcon.set("CAppLayersAnimationEditor", "shape_button.control")
        //CApplication.systemIcon.set("CAppLayersSceneEditor", "scene_button.control")
        //CApplication.systemIcon.set("CAppGraphEditor", "graph_button.control")
        //CApplication.systemIcon.set("CAppControlEditor", "control_button.control")
        //CApplication.systemIcon.set("CAppFrameEditor", "frame_button.control")
        //CApplication.systemIcon.set("CAppTrash", "Trash")
        //CApplication.systemIcon.set("CAppLogin", "login_button.control")
        //CApplication.systemIcon.set("CAppSetting", "gear_button.control")
        //CTaskbar.fixListLeft.add("CAppBell")
        //CTaskbar.fixListLeft.add("CAppFinder")
        //CTaskbar.fixListLeft.add("CAppTextEditor")
        //CTaskbar.fixListLeft.add("CAppSearchNaver")
        //CTaskbar.fixListLeft.add("CAppLayersEditor")
        //CTaskbar.fixListLeft.add("CAppPathEditor")
        //CTaskbar.fixListLeft.add("CAppLayersAnimationEditor")
        //CTaskbar.fixListLeft.add("CAppLayersSceneEditor")
        //CTaskbar.fixListLeft.add("CAppGraphEditor")
        //CTaskbar.fixListLeft.add("CAppControlEditor")
        //CTaskbar.fixListLeft.add("CAppFrameEditor")
        //CTaskbar.fixListRight.add("CAppSetting")
        //CTaskbar.fixListRight.add("CAppBell")
        //CTaskbar.fixListRight.add("CAppLogin")
        //CTaskbar.fixListRight.add("CAppTrash")   
        //CSystem.setDesktopSize(CSystem.desktopAlignKind)
        //})
        //let tm = new CTimeChecker()
        //tm.startChecker()
        /*fetchBody("/api/file/v1/fontlist").then(function(msg) {
            let o = JSON.parse(msg)
            if(o.result == "success") {
                for(let n = 0; n < o.fontList.length; n++) {
                    CSystem.systemFont.set(o.fontList[n].fileName, o.fontList[n].fileName)
                }
                console.log("font load : " + tm.stopChecker())
            } else {
                console.error(o.message)
            }
        })*/
    });
}
