"use strict";
class CIFrame extends CElementControl {
    constructor(parent, name) {
        super("iframe", parent, name);
        this._src = "";
    }
    get src() {
        return this._src;
    }
    set src(value) {
        if (this._src != value) {
            this._src = value;
            this.element.src = value;
        }
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "src", this.src, "");
    }
    doFromData(data) {
        super.doFromData(data);
        this.src = CDataClass.getData(data, "src", "");
    }
    doInitInnerElement() {
        super.doInitInnerElement();
        this.element.setAttribute("className", this.className);
        this.element.style.outline = "none";
        this.element.style.position = "absolute";
        this.element.style.margin = "0px 0px 0px 0px";
        this.element.style.padding = "0px 0px 0px 0px";
        this.element.style.border = "none";
        this.element.style.zIndex = CSystem.getZPlus() + "";
        this.element.setAttribute("ondragstart", "return false");
        this.element.setAttribute("onselectstart", "return false");
        this.element.setAttribute("oncontextmenu", "return false");
        this.element.style.touchAction = "auto";
        this.element.style.userSelect = "text";
        this.element.style.pointerEvents = "auto";
    }
}
class CMultiSlideBox extends CPanel {
    constructor(parent, name) {
        super(parent, name);
        this._slideHandles = new CList();
        this._handleResource = "";
        let self = this;
        this._slideHandles.onChange = function () {
            self.doChangeHandles();
        };
    }
    get slideHandles() {
        return this._slideHandles;
    }
    get handleResource() {
        return this._handleResource;
    }
    set handleResource(value) {
        if (this._handleResource != value) {
            this._handleResource = value;
            for (let n = 0; n < this._slideHandles.length; n++) {
                let t = this._slideHandles.get(n).text;
                this._slideHandles.get(n).resource = value;
                this._slideHandles.get(n).text = t;
            }
        }
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "handleResource", this.handleResource, "");
    }
    doFromData(data) {
        super.doFromData(data);
        this.handleResource = CDataClass.getData(data, "handleResource", "");
    }
    doChangeHandles() {
        if (this.onChangeHandles != undefined) {
            this.onChangeHandles(this);
        }
    }
    doCreateHandle(resource, left, top, width, height) {
        let h = new CPanel(this);
        h.onResource = function () {
            h.usePointerCapture = true;
            h.useMove = true;
            h.position.left = left;
            h.position.top = top;
            if (width == undefined) {
                h.position.width = 30;
            }
            else {
                h.position.width = width;
            }
            if (height == undefined) {
                h.position.height = 30;
            }
            else {
                h.position.height = height;
            }
            h.moveAreaLength = h.position.height;
        };
        h.resource = resource;
        h.usePointerCapture = true;
        h.position.left = left;
        h.position.top = top;
        h.useMove = true;
        if (width == undefined) {
            h.position.width = 30;
        }
        else {
            h.position.width = width;
        }
        if (height == undefined) {
            h.position.height = 30;
        }
        else {
            h.position.height = height;
        }
        h.moveAreaLength = h.position.height;
        let self = this;
        h.onMove = function (s, e) {
            self.doHandleTrack(h, h.position.left, h.position.top, h.position.left + (h.position.width / 2), h.position.top + (h.position.height / 2));
        };
        if (this.onCreateHandle != undefined) {
            this.onCreateHandle(this, h);
        }
        return h;
    }
    doAddHandle(resource, left, top, width, height) {
        let pan = this.doCreateHandle(resource, left, top, width, height);
        this._slideHandles.add(pan);
        if (this.onAddHandle != undefined) {
            this.onAddHandle(this, resource, left, top, width, height);
        }
        return pan;
    }
    doDeleteHandle(index) {
        this._slideHandles.get(index).remove();
        this._slideHandles.delete(index);
        if (this.onDeleteHandle != undefined) {
            this.onDeleteHandle(this, index);
        }
    }
    doClearHandle() {
        for (let n = 0; n < this._slideHandles.length; n++) {
            this._slideHandles.get(n).remove();
        }
        this._slideHandles.clear();
        if (this.onClear != undefined) {
            this.onClear(this);
        }
    }
    doHandleTrack(handle, x, y, centerX, centerY) {
        if (this.onHandleTrack != undefined) {
            this.onHandleTrack(this, handle, x, y, centerX, centerY);
        }
    }
    addHandle(resource, left, top, width, height) {
        return this.doAddHandle(resource, left, top, width, height);
    }
    deleteHandle(index) {
        this.doDeleteHandle(index);
    }
    clearHandle() {
        this.doClearHandle();
    }
}
var ESlideDirection;
(function (ESlideDirection) {
    ESlideDirection[ESlideDirection["X"] = 0] = "X";
    ESlideDirection[ESlideDirection["Y"] = 1] = "Y";
})(ESlideDirection || (ESlideDirection = {}));
class CSlideControlBox extends CUnlimitedScrollBox {
    constructor(parent, name) {
        super(parent, name);
        this.__interval = 0;
        this._controls = new CList();
        this._controlContent = new CLayout(this.content);
        this.slideDirection = ESlideDirection.X;
        this.centerZ = -3000;
        this.y = 0;
        this.radiusX = 800;
        this.radiusY = 200;
        this.radiusZ = 1000;
        this.useHScrollbar = false;
        this.useVScrollbar = false;
        this._controlContent.transform.translateZ = 0.25;
        this.setControlPosition(this._controlContent);
    }
    get controls() {
        return this._controls;
    }
    get controlContent() {
        return this._controlContent;
    }
    getLeft() {
        return this.background.controlElement.scrollLeft;
    }
    getTop() {
        return this.background.controlElement.scrollTop;
    }
    setControlPosition(control) {
        if (control.position.align != EPositionAlign.NONE)
            control.position.align = EPositionAlign.NONE;
        control.position.left = this.getLeft();
        control.position.top = this.getTop();
        control.position.width = this.background.position.width;
        control.position.height = this.background.position.height;
    }
    doChangeSize() {
        super.doChangeSize();
        this.setControlPosition(this._controlContent);
    }
    doChangeScrollValue() {
        super.doChangeScrollArea();
        for (let n = 0; n < this.controls.length; n++) {
            this.controls.get(n).visible = true;
            this.controls.get(n).opacity = 0.5;
        }
        this.setControlPosition(this._controlContent);
        if (this.slideDirection == ESlideDirection.X) {
            this.doSetControlsTransfrom(this.scrollX);
        }
        else {
            this.doSetControlsTransfrom(this.scrollY);
        }
    }
    doSetControlsTransfrom(value) {
        let a = 360 / this._controls.length;
        for (let n = 0; n < this._controls.length; n++) {
            let zang = (n * a) - (value / 10);
            let pt;
            if (this.slideDirection == ESlideDirection.X) {
                pt = CPoint3D.getAngleToPoint3DEllipse(new CPoint3D(0, this.y, this.centerZ), 0, zang, this.radiusX, this.radiusY, this.radiusZ);
                this._controls.get(n).transform.rotateY = zang;
                this._controls.get(n).opacity = CCalc.crRange2Value(1, -1, CCalc.cosd(zang), 1, 0.1);
                this._controls.get(n).transform.translateX = pt.x;
                this._controls.get(n).transform.translateY = CCalc.cosd(zang) * this.radiusY;
                this._controls.get(n).transform.translateZ = pt.z;
                this._controls.get(n).controlElement.style.zIndex = (900000 - Math.floor(pt.z * -1)) + "";
            }
            if (this.slideDirection == ESlideDirection.Y) {
                pt = CPoint3D.getAngleToPoint3DEllipse(new CPoint3D(0, this.y, this.centerZ), 90, zang, this.radiusX, this.radiusY, this.radiusZ);
                this._controls.get(n).transform.rotateX = 360 - zang;
                this._controls.get(n).opacity = CCalc.crRange2Value(1, -1, CCalc.cosd(zang), 1, 0.1);
                this._controls.get(n).transform.translateX = CCalc.cosd(zang) * this.radiusX;
                this._controls.get(n).transform.translateY = pt.y;
                this._controls.get(n).transform.translateZ = pt.z;
                this._controls.get(n).controlElement.style.zIndex = (900000 - Math.floor(pt.z * -1)) + "";
            }
        }
    }
    doScrollStop() {
        super.doScrollStop();
        let arr = new Array();
        for (let n = 0; n < this._controls.length; n++) {
            arr.push(this._controls.get(n));
        }
        arr.sort(function (a, b) {
            let rt = 0;
            if (a.transform.translateZ > b.transform.translateZ)
                rt = -1;
            if (a.transform.translateZ < b.transform.translateZ)
                rt = 1;
            return rt;
        });
        for (let n = 0; n < arr.length; n++) {
            arr[n].visible = n == 0;
        }
        let x = arr[0].transform.translateX;
        let y = arr[0].transform.translateY;
        let z = arr[0].transform.translateZ;
        let ry = arr[0].transform.rotateY;
        let rx = arr[0].transform.rotateX;
        let op = arr[0].opacity;
        let op2 = 1 - arr[0].opacity;
        CAnimation.animate(100, function (t, v, ct) {
            arr[0].transform.translateX = x - (x * v);
            arr[0].transform.translateY = y - (y * v);
            arr[0].transform.translateZ = z - (z * v);
            arr[0].transform.rotateX = rx - (rx * v);
            arr[0].transform.rotateY = ry - (ry * v);
            arr[0].opacity = op2 + (op * v);
        });
    }
    addControl(control) {
        control.parent = this.controlContent;
        control.position.align = EPositionAlign.CLIENT;
        this._controls.add(control);
    }
}
class CHueCircleDrawModel extends CNotifyChangeNotifyObject {
    constructor() {
        super(...arguments);
        this._margin = 5;
        this._weight = 20;
        this._strokeColor = "rgba(255,255,255,1)";
        this._strokeLineWidth = 2;
        this._h = 0;
        this._s = 1;
        this._l = 0.5;
        this._a = 1;
    }
    get strokeColor() {
        return this._strokeColor;
    }
    set strokeColor(value) {
        if (this._strokeColor != value) {
            this._strokeColor = value;
            this.doChange();
        }
    }
    get strokeLineWidth() {
        return this._strokeLineWidth;
    }
    set strokeLineWidth(value) {
        if (this._strokeLineWidth != value) {
            this._strokeLineWidth = value;
            this.doChange();
        }
    }
    get margin() {
        return this._margin;
    }
    set margin(value) {
        if (this._margin != value) {
            this._margin = value;
            this.doChange();
        }
    }
    get weight() {
        return this._weight;
    }
    set weight(value) {
        if (this._weight != value) {
            this._weight = value;
            this.doChange();
        }
    }
    get h() {
        return this._h;
    }
    set h(value) {
        if (this._h != value) {
            this._h = value;
            this.doChange();
        }
    }
    get s() {
        return this._s;
    }
    set s(value) {
        if (this._s != value) {
            this._s = value;
            this.doChange();
        }
    }
    get l() {
        return this._l;
    }
    set l(value) {
        if (this._l != value) {
            this._l = value;
            this.doChange();
        }
    }
    get a() {
        return this._a;
    }
    set a(value) {
        if (this._a != value) {
            this._a = value;
            this.doChange();
        }
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "margin", this.margin, 5);
        CDataClass.putData(data, "weight", this.weight, 20);
        CDataClass.putData(data, "strokeColor", this.strokeColor, "rgba(255,255,255,1)");
        CDataClass.putData(data, "strokeLineWidth", this.strokeLineWidth, 2);
        CDataClass.putData(data, "h", this.h, 0);
        CDataClass.putData(data, "s", this.s, 1);
        CDataClass.putData(data, "l", this.l, 0.5);
        CDataClass.putData(data, "a", this.a, 1);
    }
    doFromData(data) {
        super.doFromData(data);
        this.margin = CDataClass.getData(data, "margin", 5);
        this.weight = CDataClass.getData(data, "weight", 20);
        this.strokeColor = CDataClass.getData(data, "strokeColor", "rgba(255,255,255,1)");
        this.strokeLineWidth = CDataClass.getData(data, "strokeLineWidth", 2);
        this.h = CDataClass.getData(data, "h", 0);
        this.s = CDataClass.getData(data, "s", 1);
        this.l = CDataClass.getData(data, "l", 0.5);
        this.a = CDataClass.getData(data, "a", 1);
    }
    draw(ctx, bounds) {
        if (bounds.width <= 0 || bounds.height <= 0)
            return;
        let id = ctx.getImageData(bounds.left, bounds.top, bounds.width, bounds.height);
        let center = new CPoint(bounds.left + (bounds.width / 2), bounds.top + (bounds.height / 2));
        let dMax = (CCalc.min(bounds.width, bounds.height) / 2) - this.margin;
        let dMin = dMax - this.weight;
        for (let n = 0; n < bounds.width; n++) {
            for (let i = 0; i < bounds.height; i++) {
                let x = bounds.left + n;
                let y = bounds.top + i;
                let distance = CPoint.getDistancePoints(center, new CPoint(x, y));
                let rIdx = i * (bounds.width * 4) + (n * 4);
                if (distance > dMin && distance <= dMax) {
                    let ang = CPoint.getAngleFromTwoPoint(center, new CPoint(x, y));
                    //let rgba = CColor.hslToRGB(new CHSLA(ang, this.s, this.l, this.a))
                    let rgba = CColor.hslToRGB(new CHSLA(ang, 1, 0.5, 1));
                    id.data[rIdx] = rgba.r;
                    id.data[rIdx + 1] = rgba.g;
                    id.data[rIdx + 2] = rgba.b;
                    id.data[rIdx + 3] = CCalc.cr(255, 0, 1, rgba.a, 2);
                }
            }
        }
        ctx.putImageData(id, bounds.left, bounds.top);
        ctx.strokeStyle = this._strokeColor;
        ctx.lineWidth = this._strokeLineWidth;
        let pd = new CPathPointList();
        let rt = new CRect(bounds.left + this.margin, bounds.top + this.margin, bounds.right - this.margin, bounds.bottom - this.margin);
        let rt2 = new CRect(rt.left, rt.top, rt.left + CCalc.min(rt.width, rt.height), rt.top + CCalc.min(rt.width, rt.height));
        rt2 = rt.getFitRect(rt2, true);
        rt2.offset(bounds.left + this.margin, bounds.top + this.margin);
        pd.makeEllipseData(rt2.left, rt2.top, rt2.width, rt2.height);
        pd.setPathData(ctx);
        ctx.stroke();
        rt2.inflate(-this.weight, -this.weight);
        pd.makeEllipseData(rt2.left, rt2.top, rt2.width, rt2.height);
        pd.setPathData(ctx);
        ctx.stroke();
        let r = dMin + ((dMax - dMin) / 2);
        let pt = CPoint.getAngleToPoint(center, r, r, this.h);
        let rtc = new CRect(pt.x - (this.weight / 2), pt.y - (this.weight / 2), pt.x + (this.weight / 2), pt.y + (this.weight / 2));
        pd.makeEllipseData(rtc.left, rtc.top, rtc.width, rtc.height);
        pd.setPathData(ctx);
        ctx.stroke();
    }
    toHSLA() {
        return new CHSLA(this.h, this.s, this.l, this.a);
    }
    toRGBA() {
        return CColor.hslToRGB(this.toHSLA());
    }
    toColor() {
        return this.toHSLA().toColor();
    }
    isHitCircle(bounds, point) {
        let dMax = (CCalc.min(bounds.width, bounds.height) / 2) - this.margin;
        let dMin = dMax - this.weight;
        let center = new CPoint(bounds.left + (bounds.width / 2), bounds.top + (bounds.height / 2));
        let distance = CPoint.getDistancePoints(center, point);
        return distance > dMin && distance <= dMax;
    }
}
class CHueCircleSLDrawModel extends CHueCircleDrawModel {
    constructor() {
        super(...arguments);
        this._slcursorWeight = 20;
    }
    get slcursorWeight() {
        return this._slcursorWeight;
    }
    set slcursorWeight(value) {
        if (this._slcursorWeight != value) {
            this._slcursorWeight = value;
            this.doChange();
        }
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "slcursorWeight", this.slcursorWeight, 20);
    }
    doFromData(data) {
        super.doFromData(data);
        this.slcursorWeight = CDataClass.getData(data, "slcursorWeight", 20);
    }
    draw(ctx, bounds) {
        if (bounds.width <= 0 || bounds.height <= 0)
            return;
        (new Function("ctx", "ctx.canvas.willReadFrequently = true"))(ctx);
        super.draw(ctx, bounds);
        let center = new CPoint(bounds.left + (bounds.width / 2), bounds.top + (bounds.height / 2));
        let dMax = (CCalc.min(bounds.width, bounds.height) / 2) - this.margin;
        let dMin = dMax - this.weight;
        let pt = CPoint.getAngleToPoint(center, dMin, dMin, 45);
        let x = pt.x - center.x - this.strokeLineWidth;
        let rt = new CRect(Math.floor(center.x - x), Math.floor(center.y - x), Math.floor(center.x + x), Math.floor(center.y + x));
        let id = ctx.getImageData(rt.left, rt.top, rt.width, rt.height);
        for (let n = 0; n < rt.width; n++) {
            for (let i = 0; i < rt.height; i++) {
                let rIdx = (i * (rt.width * 4)) + (n * 4);
                let rgba = CColor.hslToRGB(new CHSLA(this.h, CCalc.cr(rt.width - 1, n, 1, 0, 4), CCalc.cr(rt.height - 1, i, 1, 0, 4), this.a));
                id.data[rIdx] = rgba.r;
                id.data[rIdx + 1] = rgba.g;
                id.data[rIdx + 2] = rgba.b;
                id.data[rIdx + 3] = 255;
            }
        }
        ctx.putImageData(id, rt.left, rt.top);
        ctx.strokeStyle = this._strokeColor;
        ctx.lineWidth = this._strokeLineWidth;
        let s = CCalc.cr(rt.width, 0, 1, this.s, 2);
        let l = CCalc.cr(rt.height, 0, 1, this.l, 2);
        let rtc = new CRect(rt.left + s - (this._slcursorWeight / 2), rt.top + l - (this._slcursorWeight / 2), rt.left + s + (this._slcursorWeight / 2), rt.top + l + (this._slcursorWeight / 2));
        let pd = new CPathPointList();
        pd.makeEllipseData(rtc.left, rtc.top, rtc.width, rtc.height);
        pd.setPathData(ctx);
        ctx.stroke();
    }
    getSLArea(bounds) {
        let center = new CPoint(bounds.left + (bounds.width / 2), bounds.top + (bounds.height / 2));
        let dMax = (CCalc.min(bounds.width, bounds.height) / 2) - this.margin;
        let dMin = dMax - this.weight;
        let pt = CPoint.getAngleToPoint(center, dMin, dMin, 45);
        let x = pt.x - center.x - this.strokeLineWidth;
        let rt = new CRect(Math.floor(center.x - x), Math.floor(center.y - x), Math.floor(center.x + x), Math.floor(center.y + x));
        return rt;
    }
    isHitSLArea(bounds, point) {
        return this.getSLArea(bounds).isIn(point.x, point.y);
    }
}
class CHueColorBox extends CPanel {
    constructor(parent, name) {
        super(parent, name);
        this.__hit = -1;
        this._hueModel = new CHueCircleSLDrawModel();
        let self = this;
        this._hueModel.onChange = function (obj) {
            self.draw();
        };
    }
    get isEditing() {
        return this.__hit != -1;
    }
    get ringMargin() {
        return this._hueModel.margin;
    }
    get hueModel() {
        return this._hueModel;
    }
    get ringWeight() {
        return this._hueModel.weight;
    }
    set ringWeight(value) {
        if (this._hueModel.weight != value) {
            this._hueModel.weight = value;
            this.doChange("ringWeight", value);
        }
    }
    get slcursorWeight() {
        return this._hueModel.slcursorWeight;
    }
    set slcursorWeight(value) {
        if (this._hueModel.slcursorWeight != value) {
            this._hueModel.slcursorWeight = value;
            this.doChange("slcursorWeight", value);
        }
    }
    get strokeColor() {
        return this._hueModel.strokeColor;
    }
    set strokeColor(value) {
        if (this._hueModel.strokeColor != value) {
            this._hueModel.strokeColor = value;
            this.doChange("strokeColor", value);
        }
    }
    get strokeLineWidth() {
        return this._hueModel.strokeLineWidth;
    }
    set strokeLineWidth(value) {
        if (this._hueModel.strokeLineWidth != value) {
            this._hueModel.strokeLineWidth = value;
            this.doChange("strokeLineWidth", value);
        }
    }
    get rgba() {
        return this._hueModel.toRGBA();
    }
    get color() {
        return this._hueModel.toRGBA().toColor();
    }
    set color(value) {
        let col = new CColor(value);
        let h = col.toHSLA();
        if (this._hueModel.h != h.h || this._hueModel.s != h.s || this._hueModel.l != h.l || this._hueModel.a != h.a) {
            this._hueModel.h = h.h;
            this._hueModel.s = h.s;
            this._hueModel.l = h.l;
            this._hueModel.a = h.a;
            this.doChangeColor();
        }
    }
    get hslaColor() {
        return this._hueModel.toColor();
    }
    get hsla() {
        return this._hueModel.toHSLA();
    }
    get h() {
        return this._hueModel.h;
    }
    set h(value) {
        if (this._hueModel.h != value) {
            this._hueModel.h = value;
            this.doChangeColor();
        }
    }
    get s() {
        return this._hueModel.s;
    }
    set s(value) {
        if (this._hueModel.s != value) {
            this._hueModel.s = value;
            this.doChangeColor();
        }
    }
    get l() {
        return this._hueModel.l;
    }
    set l(value) {
        if (this._hueModel.l != value) {
            this._hueModel.l = value;
            this.doChangeColor();
        }
    }
    get a() {
        return this._hueModel.a;
    }
    set a(value) {
        if (this._hueModel.a != value) {
            this._hueModel.a = value;
            this.doChangeColor();
        }
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "hue", this.hueModel.toData());
    }
    doFromData(data) {
        super.doFromData(data);
        this.hueModel.fromData(CDataClass.getData(data, "hue"));
    }
    doThisPointerDown(e, points) {
        super.doThisPointerDown(e, points);
        let bounds = new CRect(0, 0, this.position.width, this.position.height);
        if (this._hueModel.isHitCircle(bounds, new CPoint(e.offsetX, e.offsetY))) {
            this.__hit = 0;
            this.setH(new CPoint(e.offsetX, e.offsetY));
        }
        if (this._hueModel.isHitSLArea(bounds, new CPoint(e.offsetX, e.offsetY))) {
            this.__hit = 1;
            this.setSL(new CPoint(e.offsetX, e.offsetY));
        }
    }
    doThisPointerMove(e, points) {
        super.doThisPointerMove(e, points);
        if (this.__hit == 0) {
            this.setH(new CPoint(e.offsetX, e.offsetY));
        }
        if (this.__hit == 1) {
            this.setSL(new CPoint(e.offsetX, e.offsetY));
        }
    }
    doThisPointerUp(e, points) {
        super.doThisPointerUp(e, points);
        this.__hit = -1;
    }
    doPointerOut(e) {
        super.doPointerOut(e);
        if (!this.usePointerCapture)
            this.__hit = -1;
    }
    doChangeColor() {
        if (this.onChangeColor != undefined) {
            this.onChangeColor(this);
        }
    }
    setH(point) {
        let bounds = new CRect(0, 0, this.position.width, this.position.height);
        let center = new CPoint(bounds.width / 2, bounds.height / 2);
        this._hueModel.h = CPoint.getAngleFromTwoPoint(center, point);
        this.doChangeColor();
    }
    setSL(point) {
        let rt = this._hueModel.getSLArea(new CRect(0, 0, this.position.width, this.position.height));
        let l = CCalc.cr(rt.height, point.y - rt.top, 1, 0, 4);
        if (l < 0)
            l = 0;
        if (l > 1)
            l = 1;
        let s = CCalc.cr(rt.width, point.x - rt.left, 1, 0, 4);
        if (s < 0)
            s = 0;
        if (s > 1)
            s = 1;
        this._hueModel.s = s;
        this._hueModel.l = l;
        this.doChangeColor();
    }
    doLayerDraw(layerIndex, layer, context) {
        super.doLayerDraw(layerIndex, layer, context);
        if (layerIndex == 0 && layer.canvas.width > 0 && layer.canvas.height > 0) {
            this._hueModel.draw(context, new CRect(0, 0, this.position.width, this.position.height));
        }
    }
}
class CColorBox extends CPanel {
    constructor(parent, name) {
        super(parent, name);
        this._color = "rgba(255,255,255,1)";
        this.layer = this.layers.addLayer();
    }
    get color() {
        return this._color;
    }
    set color(value) {
        if (this._color != value) {
            this._color = value;
            this.doChangeColor();
        }
    }
    get resource() {
        return "";
    }
    set resource(value) {
        this._resource = "";
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "color", this.color, "rgba(255,255,255,1)");
    }
    doFromData(data) {
        super.doFromData(data);
        this.color = CDataClass.getData(data, "color", "rgba(255,255,255,1)");
    }
    doChangeColor() {
        this.draw();
        if (this.onChangeColor != undefined) {
            this.onChangeColor(this);
        }
    }
    doLayerDraw(layerIndex, layer, context) {
        super.doLayerDraw(layerIndex, layer, context);
        if (layer.canvas.width > 0 && layer.canvas.height > 0) {
            let col = Math.ceil(this.position.width / 10) + 1;
            let row = Math.ceil(this.position.height / 10) + 1;
            for (let r = 0; r < row; r++) {
                let b = false;
                if (r % 2 == 1)
                    b = true;
                for (let c = 0; c < col; c++) {
                    let cc = "rgba(204,204,204,1)";
                    if (b) {
                        cc = "rgba(255,255,255,1)";
                    }
                    b = !b;
                    context.fillStyle = cc;
                    context.fillRect(c * 10, r * 10, (c * 10) + 10, (r * 10) + 10);
                }
            }
            context.fillStyle = this.color;
            context.fillRect(0, 0, this.position.width, this.position.height);
        }
    }
}
class CColorSelectorModel extends CPanel {
    constructor(parent, name) {
        super(parent, name);
        this.__changer = "";
        this._color = "rgba(255,255,255,1)";
        this.hueBox = new CHueColorBox(this);
        this.textBox = new CTextBox(this);
        this.colorBox = new CColorBox(this);
        this.opacityControl = new CScrollbar(this);
        let self = this;
        this.opacityControl.onChangeValue = function () {
            self.__changer = "opacityControl";
            let col = new CColor(self.color);
            col.a = self.opacityControl.valueRatio;
            self.color = col.toColor();
            self.__changer = "";
        };
        this.colorBox.onChangeColor = function () {
            self.__changer = "hueBox";
            self.color = self.colorBox.color;
            self.__changer = "";
        };
        this.textBox.onKeyDown = function (s, e) {
            if (e.key == "Enter") {
                self.color = self.textBox.text;
            }
        };
        this.hueBox.onChangeColor = function () {
            self.__changer = "hueBox";
            self.color = self.hueBox.color;
            self.__changer = "";
        };
    }
    get color() {
        return this._color;
    }
    set color(value) {
        if (this._color != value) {
            this._color = value;
            this.doChangeColor();
        }
    }
    get hueBoxResource() {
        return this.hueBox.resource;
    }
    set hueBoxResource(value) {
        this.hueBox.resource = value;
    }
    get opacityControlResource() {
        return this.opacityControl.resource;
    }
    set opacityControlResource(value) {
        this.opacityControl.resource = value;
    }
    get textBoxResource() {
        return this.textBox.resource;
    }
    set textBoxResource(value) {
        this.textBox.resource = value;
    }
    get opacityControlHeight() {
        return this.opacityControl.position.height;
    }
    set opacityControlHeight(value) {
        this.opacityControl.position.height = value;
    }
    get textBoxHeight() {
        return this.textBox.position.height;
    }
    set textBoxHeight(value) {
        this.textBox.position.height = value;
    }
    get colorBoxHeight() {
        return this.colorBox.position.height;
    }
    set colorBoxHeight(value) {
        this.colorBox.position.height = value;
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "hueBoxResource", this.hueBoxResource, "");
        CDataClass.putData(data, "opacityControlResource", this.opacityControlResource, "");
        CDataClass.putData(data, "textBoxResource", this.textBoxResource, "");
        CDataClass.putData(data, "opacityControlHeight", this.opacityControlHeight, 20);
        CDataClass.putData(data, "textBoxHeight", this.textBoxHeight, 25);
        CDataClass.putData(data, "colorBoxHeight", this.colorBoxHeight, 50);
        CDataClass.putData(data, "color", this.color, "rgba(255,255,255,1)");
        CDataClass.putData(data, "hueBox", this.hueBox.toData(), {}, true);
        CDataClass.putData(data, "textBox", this.textBox.toData(), {}, true);
        CDataClass.putData(data, "colorBox", this.colorBox.toData(), {}, true);
        CDataClass.putData(data, "opacityControl", this.opacityControl.toData(), {}, true);
    }
    doFromData(data) {
        super.doFromData(data);
        this.hueBoxResource = CDataClass.getData(data, "hueBoxResource", "");
        this.opacityControlResource = CDataClass.getData(data, "opacityControlResource", "");
        this.textBoxResource = CDataClass.getData(data, "textBoxResource", "");
        this.opacityControlHeight = CDataClass.getData(data, "opacityControlHeight", 20);
        this.textBoxHeight = CDataClass.getData(data, "textBoxHeight", 25);
        this.colorBoxHeight = CDataClass.getData(data, "colorBoxHeight", 50);
        this.color = CDataClass.getData(data, "color", "rgba(255,255,255,1)");
        this.hueBox.fromData(CDataClass.getData(data, "hueBox", {}, true));
        this.textBox.fromData(CDataClass.getData(data, "textBox", {}, true));
        this.colorBox.fromData(CDataClass.getData(data, "colorBox", {}, true));
        this.opacityControl.fromData(CDataClass.getData(data, "opacityControl", {}, true));
    }
    doChangeColor() {
        if (this.__changer != "hueBox")
            this.hueBox.color = this.color;
        if (this.__changer != "opacityControl") {
            let col = new CColor(this.color);
            this.opacityControl.valueRatio = col.a;
        }
        if (this.__changer != "textBox")
            this.textBox.text = this.color;
        this.colorBox.color = this.color;
        if (this.onChangeColor != undefined) {
            this.onChangeColor(this);
        }
    }
}
class CColorSelector extends CColorSelectorModel {
    constructor(parent, name) {
        super(parent, name);
        this.resource = "colorselector16.control";
    }
}
class CSelectArea extends CPanel {
    constructor(parent, name) {
        super(parent, name);
        this.__prePoint = new CPoint();
        this._selectAreaResource = "";
        this._useSelectArea = true;
        this.selectArea = new CPanel(this);
    }
    get selectAreaResource() {
        return this._selectAreaResource;
    }
    set selectAreaResource(value) {
        if (this._selectAreaResource != value) {
            this._selectAreaResource = value;
            if (value != "") {
                this.selectArea.resource = value;
            }
        }
    }
    get useSelectArea() {
        return this._useSelectArea;
    }
    set useSelectArea(value) {
        if (this._useSelectArea != value) {
            this._useSelectArea = value;
        }
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "selectAreaResource", this.selectAreaResource, "");
        CDataClass.putData(data, "useSelectArea", this.useSelectArea, true);
        CDataClass.putData(data, "selectArea", this.selectArea.toData(), {}, true);
    }
    doFromData(data) {
        super.doFromData(data);
        this.selectAreaResource = CDataClass.getData(data, "selectAreaResource", "");
        this.useSelectArea = CDataClass.getData(data, "useSelectArea", true);
        this.selectArea.fromData(CDataClass.getData(data, "selectArea", {}, true));
    }
    setSelected(point) {
        let x1 = Math.min(this.__prePoint.x, point.x);
        let y1 = Math.min(this.__prePoint.y, point.y);
        let x2 = Math.max(this.__prePoint.x, point.x);
        let y2 = Math.max(this.__prePoint.y, point.y);
        this.selectArea.position.left = x1;
        this.selectArea.position.top = y1;
        this.selectArea.position.width = x2 - x1;
        this.selectArea.position.height = y2 - y1;
        this.doTrackSelectArea(new CPoint(x1, y1), new CPoint(x2, y2));
    }
    doThisPointerDown(e, points) {
        super.doThisPointerDown(e, points);
        if (this.useSelectArea) {
            this.__prePoint.x = e.offsetX;
            this.__prePoint.y = e.offsetY;
            this.selectArea.position.left = e.offsetX;
            this.selectArea.position.top = e.offsetY;
            this.selectArea.position.width = 0;
            this.selectArea.position.height = 0;
            this.selectArea.visible = true;
            this.selectArea.bringToFront();
        }
    }
    doThisPointerMove(e, points) {
        super.doThisPointerMove(e, points);
        if (this.isPress && this.useSelectArea) {
            this.setSelected(new CPoint(e.offsetX, e.offsetY));
        }
    }
    doThisPointerUp(e, points) {
        super.doThisPointerUp(e, points);
        if (this.useSelectArea) {
            let x1 = Math.min(this.__prePoint.x, e.offsetX);
            let y1 = Math.min(this.__prePoint.y, e.offsetY);
            let x2 = Math.max(this.__prePoint.x, e.offsetX);
            let y2 = Math.max(this.__prePoint.y, e.offsetY);
            this.selectArea.visible = false;
            this.doSelectArea(new CPoint(x1, y1), new CPoint(x2, y2));
        }
    }
    doTrackSelectArea(startPoint, stopPoint) {
        if (this.onTrackSelectArea != undefined) {
            this.onTrackSelectArea(this, startPoint, stopPoint);
        }
    }
    doSelectArea(startPoint, stopPoint) {
        if (this.onSelectArea != undefined) {
            this.onSelectArea(this, startPoint, stopPoint);
        }
    }
}
class CSelectPoint extends CPanel {
    constructor() {
        super(...arguments);
        this.magneticPoint = new CList();
    }
    doBeforeMove(e, x, y) {
        let rt = new CPoint(x, y);
        return rt;
    }
}
class CControlPositionEditor extends CPanel {
    constructor() {
        super(...arguments);
        this.l1 = new CPanel(this);
        this.lblLeft = new CPanel(this.l1);
        this.edtLeft = new CTextBox(this.l1);
        this.l2 = new CPanel(this);
        this.lblTop = new CPanel(this.l2);
        this.edtTop = new CTextBox(this.l2);
        this.l3 = new CPanel(this);
        this.lblWidth = new CPanel(this.l3);
        this.edtWidth = new CTextBox(this.l3);
        this.l4 = new CPanel(this);
        this.lblHeight = new CPanel(this.l4);
        this.edtHeight = new CTextBox(this.l4);
        this.btnPosition = new CButton(this);
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "l1", this.l1.toData(), {}, true);
        CDataClass.putData(data, "lblLeft", this.lblLeft.toData(), {}, true);
        CDataClass.putData(data, "edtLeft", this.edtLeft.toData(), {}, true);
        CDataClass.putData(data, "l2", this.l2.toData(), {}, true);
        CDataClass.putData(data, "lblTop", this.lblTop.toData(), {}, true);
        CDataClass.putData(data, "edtTop", this.edtTop.toData(), {}, true);
        CDataClass.putData(data, "l3", this.l3.toData(), {}, true);
        CDataClass.putData(data, "lblWidth", this.lblWidth.toData(), {}, true);
        CDataClass.putData(data, "edtWidth", this.edtWidth.toData(), {}, true);
        CDataClass.putData(data, "l4", this.l4.toData(), {}, true);
        CDataClass.putData(data, "lblHeight", this.lblHeight.toData(), {}, true);
        CDataClass.putData(data, "edtHeight", this.edtHeight.toData(), {}, true);
        CDataClass.putData(data, "btnPosition", this.btnPosition.toData(), {}, true);
    }
    doFromData(data) {
        super.doFromData(data);
        this.l1.fromData(CDataClass.getData(data, "l1", {}, true));
        this.lblLeft.fromData(CDataClass.getData(data, "lblLeft", {}, true));
        this.edtLeft.fromData(CDataClass.getData(data, "edtLeft", {}, true));
        this.l2.fromData(CDataClass.getData(data, "l2", {}, true));
        this.lblTop.fromData(CDataClass.getData(data, "lblTop", {}, true));
        this.edtTop.fromData(CDataClass.getData(data, "edtTop", {}, true));
        this.l3.fromData(CDataClass.getData(data, "l3", {}, true));
        this.lblWidth.fromData(CDataClass.getData(data, "lblWidth", {}, true));
        this.edtWidth.fromData(CDataClass.getData(data, "edtWidth", {}, true));
        this.l4.fromData(CDataClass.getData(data, "l4", {}, true));
        this.lblHeight.fromData(CDataClass.getData(data, "lblHeight", {}, true));
        this.edtHeight.fromData(CDataClass.getData(data, "edtHeight", {}, true));
        this.btnPosition.fromData(CDataClass.getData(data, "btnPosition", {}, true));
    }
}
class CControlSelector extends CPanel {
    constructor(parent, name) {
        super(parent, name);
        this.pop = new CPickupControl();
    }
    get control() {
        return this._control;
    }
    set control(value) {
        if (this._control != value) {
            this._control = value;
            if (this._control != undefined) {
                this.parent = this._control.parent;
                this.position.fromData(this._control.position.toData());
            }
        }
    }
    get downPoint() {
        return this.__downMovePoint;
    }
    doChangeSize() {
        //this.moveAreaLength = this.position.height - 20
        if (this.control != undefined) {
            this.control.position.fromData(this.position.toData());
        }
        super.doChangeSize();
    }
    doChangePosition(kind, data) {
        if (this.control != undefined) {
            this.control.position.fromData(this.position.toData());
        }
        super.doChangePosition(kind, data);
    }
    doThisPointerUp(e, points) {
        super.doThisPointerUp(e, points);
        let self = this;
        if (e.button == 2) {
            CPickupControl.showPickup("empty.control", this, e.offsetX, e.offsetY, 300, 105, function (pick) {
                let con = new CControlPositionEditor(pick);
                con.resource = "control_position_editor.control";
                con.position.align = EPositionAlign.CLIENT;
                con.edtLeft.text = self.position.left + "";
                con.edtTop.text = self.position.top + "";
                con.edtWidth.text = self.position.width + "";
                con.edtHeight.text = self.position.height + "";
                con.btnPosition.onClick = function () {
                    self.position.left = parseFloat(con.edtLeft.text);
                    self.position.top = parseFloat(con.edtTop.text);
                    self.position.width = parseFloat(con.edtWidth.text);
                    self.position.height = parseFloat(con.edtHeight.text);
                };
            });
        }
    }
    showSelector() {
        if (this.control != undefined) {
            this.position.fromData(this.control.position.toData());
            this.visible = true;
            this.bringToFront();
        }
    }
    getBounds() {
        return new CRect(this.position.left, this.position.top, this.position.left + this.position.width, this.position.top + this.position.height);
    }
    static showSelector(control, resource) {
        let se = new CControlSelector();
        if (resource != undefined) {
            se.resource = resource;
        }
        else {
            se.resource = "controlSelector.control";
        }
        se.control = control;
        se.bringToFront();
        return se;
    }
}
class CControlSelectorRotate extends CControlSelector {
    constructor(parent, name) {
        super(parent, name);
        this.__centerDown = false;
        this.__downRotationHandle = false;
        this.__rotationDownPoint = new CPoint();
        this.rotationCenterHandle = new CPanel(this);
        this.rotationHandle = new CPanel(this);
        let self = this;
        this.rotationCenterHandle.onThisPointerDown = function () {
            self.__centerDown = true;
        };
        this.rotationCenterHandle.onThisPointerMove = function (s, e, poinst) {
            if (self.__centerDown)
                self.doCenterHandleMove(e);
        };
        this.rotationCenterHandle.onThisPointerUp = function (s, e, points) {
            self.__centerDown = false;
        };
        this.rotationHandle.onThisPointerDown = function (s, e, points) {
            let rt = self.rotationCenterHandle.controlElement.getBoundingClientRect();
            self.__rotationDownPoint = new CPoint(rt.x + (rt.width / 2), rt.y + (rt.height / 2));
            self.__downRotationHandle = true;
            self.doBeforeRotation(e);
        };
        this.rotationHandle.onThisPointerMove = function (s, e, poinst) {
            if (self.__downRotationHandle) {
                self.doRotation(e);
            }
        };
        this.rotationHandle.onThisPointerUp = function (s, e, points) {
            self.__downRotationHandle = false;
            self.doAfterRotation(e);
        };
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "rotationHandle", this.rotationHandle.toData(), {}, true);
        CDataClass.putData(data, "rotationCenterHandle", this.rotationCenterHandle.toData(), {}, true);
    }
    doFromData(data) {
        super.doFromData(data);
        this.rotationHandle.fromData(CDataClass.getData(data, "rotationHandle", {}, true));
        this.rotationCenterHandle.fromData(CDataClass.getData(data, "rotationCenterHandle", {}, true));
    }
    doChangeSize() {
        super.doChangeSize();
        this.rotationHandle.position.left = this.position.width + 10;
        this.rotationHandle.position.top = (this.position.height / 2) - (this.rotationHandle.position.height / 2);
        this.rotationCenterHandle.position.left = (this.position.width * this.transform.rotationPointX) - (this.rotationCenterHandle.position.width / 2);
        this.rotationCenterHandle.position.top = (this.position.height * this.transform.rotationPointY) - (this.rotationCenterHandle.position.height / 2);
    }
    doCenterHandleMove(e) {
        if (e.shiftKey) {
            this.rotationCenterHandle.position.left = Math.floor(this.rotationCenterHandle.position.left / 5) * 5;
            this.rotationCenterHandle.position.top = Math.floor(this.rotationCenterHandle.position.top / 5) * 5;
        }
        this.transform.rotationPointX = (this.rotationCenterHandle.position.left + (this.rotationCenterHandle.position.width / 2)) / this.position.width;
        this.transform.rotationPointY = (this.rotationCenterHandle.position.top + (this.rotationCenterHandle.position.height / 2)) / this.position.height;
        if (this.onCenterHandleMove != undefined) {
            this.onCenterHandleMove(this);
        }
    }
    doBeforeRotation(e) {
        if (this.onBeforeRotation != undefined) {
            this.onBeforeRotation(this, e);
        }
    }
    doRotation(e) {
        let ang = CPoint.getAngleFromTwoPoint(this.__rotationDownPoint, new CPoint(e.pageX, e.pageY));
        if (e.shiftKey) {
            ang = Math.floor(ang / 5) * 5;
        }
        this.transform.rotateZ = ang;
        if (this.onRotation != undefined) {
            this.onRotation(this, e);
        }
    }
    doAfterRotation(e) {
        if (this.onAfterRotation != undefined) {
            this.onAfterRotation(this, e);
        }
    }
    doKeyDown(e) {
        super.doKeyDown(e);
        if (e.key == "ArrowUp") {
            if (e.shiftKey) {
                this.position.height--;
            }
            else {
                this.position.top--;
            }
        }
        if (e.key == "ArrowDown") {
            if (e.shiftKey) {
                this.position.height++;
            }
            else {
                this.position.top++;
            }
        }
        if (e.key == "ArrowLeft") {
            if (e.shiftKey) {
                this.position.width--;
            }
            else {
                this.position.left--;
            }
        }
        if (e.key == "ArrowRight") {
            if (e.shiftKey) {
                this.position.width++;
            }
            else {
                this.position.left++;
            }
        }
    }
}
class CPathSelector extends CControlSelectorRotate {
}
class CControlSelectorAtypical extends CControlSelectorRotate {
    constructor() {
        super(...arguments);
        this.handleLeftTop = new CPanel(this);
        this.handleRightTop = new CPanel(this);
        this.handleLeftLeftBottom = new CPanel(this);
        this.handleRightBottom = new CPanel(this);
    }
}
class CProgress extends CPanel {
}
class CDial extends CPanel {
}
class CFillControl extends CPanel {
}
class CStrokeControl extends CFillControl {
}
class CTextSetControl extends CPanel {
}
class CFilterControl extends CPanel {
}
class CFold extends CPanel {
    constructor(parent, name) {
        super(parent, name);
        this.__orgHeight = 0;
        this._folded = false;
        this.caption = new CPanel(this);
        this.btnFold = new CButton(this.caption);
        this.body = new CPanel(this);
        let self = this;
        this.btnFold.onClick = function () {
            self.folded = !self.folded;
        };
        this.caption.onClick = function () {
            self.folded = !self.folded;
        };
    }
    get folded() {
        return this._folded;
    }
    set folded(value) {
        if (this._folded != value) {
            this._folded = value;
            this.doChangeFolded();
        }
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "caption", this.caption.toData(), {}, true);
        CDataClass.putData(data, "btnFold", this.btnFold.toData(), {}, true);
        CDataClass.putData(data, "body", this.body.toData(), {}, true);
        CDataClass.putData(data, "folded", this.folded, false);
        if (this.foldAnimationTrigger != undefined)
            CDataClass.putData(data, "foldAnimationTrigger", this.foldAnimationTrigger.toData(), {}, true);
    }
    doFromData(data) {
        super.doFromData(data);
        this.caption.fromData(CDataClass.getData(data, "caption", {}, true));
        this.btnFold.fromData(CDataClass.getData(data, "btnFold", {}, true));
        this.body.fromData(CDataClass.getData(data, "body", {}, true));
        this.folded = CDataClass.getData(data, "folded", false);
        CAnimator.fromAnimatorData(data, this, "foldAnimationTrigger");
    }
    doChangeFolded() {
        if (this.foldAnimationTrigger != undefined) {
            if (this.folded) {
                this.triggerTrue(this.foldAnimationTrigger);
            }
            else {
                this.triggerFalse(this.foldAnimationTrigger);
            }
        }
        else {
            if (this.folded) {
                this.__orgHeight = this.position.height;
                this.position.height = this.caption.position.height;
            }
            else {
                this.position.height = this.__orgHeight;
            }
        }
        if (this.onChangeFolded != undefined) {
            this.onChangeFolded(this);
        }
    }
    addProperties() {
        let arr = super.addProperties();
        arr.push({ instance: this.foldAnimationTrigger, propertyName: "foldAnimationTrigger", readOnly: false, enum: [] });
        return arr;
    }
}
class CPathPointSelectorModel extends CClass {
    constructor(pointResource, cpoint1Resource, cpoint2Resource) {
        super();
        this.point = new CPanel();
        this.isUpdate = true;
        this.alignPixel = 0;
        this.pointResource = "";
        this.cpoint1Resource = "";
        this.cpoint2Resource = "";
        this.pointResource = pointResource;
        this.cpoint1Resource = cpoint1Resource;
        this.cpoint2Resource = cpoint2Resource;
        this.point.resource = this.pointResource;
        this.point.position.width = 10;
        this.point.position.height = 10;
        this.point.useMove = true;
    }
    get pathPoint() {
        return this._pathPoint;
    }
    set pathPoint(value) {
        if (value != this._pathPoint) {
            this._pathPoint = value;
            if (this._pathPoint != undefined) {
                this.point.position.left = this._pathPoint.point.x - 5;
                this.point.position.top = this._pathPoint.point.y - 5;
                let self = this;
                this.point.onChangeOffset = function () {
                    if (self._pathPoint != undefined && self.isUpdate) {
                        if (self.alignPixel == 0) {
                            self._pathPoint.point.x = self.point.position.left + 5;
                            self._pathPoint.point.y = self.point.position.top + 5;
                        }
                        else {
                            self._pathPoint.point.x = Math.round((self.point.position.left + 5) / self.alignPixel) * self.alignPixel;
                            self._pathPoint.point.y = Math.round((self.point.position.top + 5) / self.alignPixel) * self.alignPixel;
                        }
                        if (self._parent != undefined)
                            self._parent.draw();
                    }
                };
                if (this._pathPoint.pointKind == EPathPointKind.CURVETO2) {
                    this.cpoint1 = new CPanel(this._parent);
                    this.cpoint1.resource = this.cpoint1Resource;
                    this.cpoint1.position.left = this._pathPoint.cPoint1.x - 3;
                    this.cpoint1.position.top = this._pathPoint.cPoint1.y - 3;
                    this.cpoint1.position.width = 6;
                    this.cpoint1.position.height = 6;
                    this.cpoint1.useMove = true;
                    this.cpoint1.onChangeOffset = function () {
                        if (self._pathPoint != undefined && self.cpoint1 != undefined && self.isUpdate) {
                            if (self.alignPixel == 0) {
                                self._pathPoint.cPoint1.x = self.cpoint1.position.left + 3;
                                self._pathPoint.cPoint1.y = self.cpoint1.position.top + 3;
                            }
                            else {
                                self._pathPoint.cPoint1.x = Math.round((self.cpoint1.position.left + 3) / self.alignPixel) * self.alignPixel;
                                self._pathPoint.cPoint1.y = Math.round((self.cpoint1.position.top + 3) / self.alignPixel) * self.alignPixel;
                            }
                            self._pathPoint.doChange();
                            if (self._parent != undefined)
                                self._parent.draw();
                        }
                    };
                }
                if (this._pathPoint.pointKind == EPathPointKind.CURVETO3) {
                    this.cpoint1 = new CPanel(this._parent);
                    this.cpoint1.resource = this.cpoint1Resource;
                    this.cpoint1.position.left = this._pathPoint.cPoint1.x - 3;
                    this.cpoint1.position.top = this._pathPoint.cPoint1.y - 3;
                    this.cpoint1.position.width = 6;
                    this.cpoint1.position.height = 6;
                    this.cpoint1.useMove = true;
                    this.cpoint1.onChangeOffset = function () {
                        if (self._pathPoint != undefined && self.cpoint1 != undefined && self.isUpdate) {
                            if (self.alignPixel == 0) {
                                self._pathPoint.cPoint1.x = self.cpoint1.position.left + 3;
                                self._pathPoint.cPoint1.y = self.cpoint1.position.top + 3;
                            }
                            else {
                                self._pathPoint.cPoint1.x = Math.round((self.cpoint1.position.left + 3) / self.alignPixel) * self.alignPixel;
                                self._pathPoint.cPoint1.y = Math.round((self.cpoint1.position.top + 3) / self.alignPixel) * self.alignPixel;
                            }
                            self._pathPoint.doChange();
                            if (self._parent != undefined)
                                self._parent.draw();
                        }
                    };
                    this.cpoint2 = new CPanel(this._parent);
                    this.cpoint2.resource = this.cpoint2Resource;
                    this.cpoint2.position.left = this._pathPoint.cPoint2.x - 3;
                    this.cpoint2.position.top = this._pathPoint.cPoint2.y - 3;
                    this.cpoint2.position.width = 6;
                    this.cpoint2.position.height = 6;
                    this.cpoint2.useMove = true;
                    this.cpoint2.onChangeOffset = function () {
                        if (self._pathPoint != undefined && self.cpoint2 != undefined && self.isUpdate) {
                            if (self.alignPixel == 0) {
                                self._pathPoint.cPoint2.x = self.cpoint2.position.left + 3;
                                self._pathPoint.cPoint2.y = self.cpoint2.position.top + 3;
                            }
                            else {
                                self._pathPoint.cPoint2.x = Math.round((self.cpoint2.position.left + 3) / self.alignPixel) * self.alignPixel;
                                self._pathPoint.cPoint2.y = Math.round((self.cpoint2.position.top + 3) / self.alignPixel) * self.alignPixel;
                            }
                            self._pathPoint.doChange();
                            if (self._parent != undefined)
                                self._parent.draw();
                        }
                    };
                }
            }
        }
    }
    get parent() {
        return this._parent;
    }
    set parent(value) {
        if (value != this._parent) {
            this._parent = value;
            this.point.parent = value;
        }
    }
}
class CPathPointControlArea extends CControlSelector {
    constructor() {
        super(...arguments);
        this._orgPosition = new CRect();
        this._orgPoints = new Array();
        this._points = new Array();
    }
    doChangeOffset() {
        super.doChangeOffset();
        if (this.visible)
            this.doSetPoints();
    }
    doChangeSize() {
        super.doChangeSize();
        if (this.visible)
            this.doSetPoints();
    }
    doKeyDown(e) {
        super.doKeyDown(e);
        if (e.key == "Delete") {
            this.doDeletePoints();
        }
    }
    doWheel(e) {
        super.doWheel(e);
        console.log(e.deltaY);
    }
    doSetPoints() {
        for (let n = 0; n < this._orgPoints.length; n++) {
            let x = (this._orgPoints[n].x + (this.position.left - this._orgPosition.left));
            let y = (this._orgPoints[n].y + (this.position.top - this._orgPosition.top));
            let dx = x - this.position.left;
            let dy = y - this.position.top;
            x = this.position.left + (dx * (this.position.width / this._orgPosition.width));
            y = this.position.top + (dy * (this.position.height / this._orgPosition.height));
            if (this._points[n].isCurveControl) {
                this._points[n].handle.position.left = x - 3;
                this._points[n].handle.position.top = y - 3;
            }
            else {
                this._points[n].handle.position.left = x - 5;
                this._points[n].handle.position.top = y - 5;
            }
        }
        if (this.onSetPoints != undefined) {
            this.onSetPoints(this);
        }
    }
    doDeletePoints() {
        if (this._pathPoints != undefined) {
            for (let n = 0; n < this._points.length; n++) {
                if (!this._points[n].isCurveControl) {
                    for (let i = 0; i < this._pathPoints.length; i++) {
                        if (this._points[n].point == this._pathPoints.get(i).point) {
                            this._pathPoints.deletePoint(i);
                        }
                    }
                }
            }
            if (this.onDelete != undefined) {
                this.onDelete(this);
            }
        }
    }
    showArea(left, top, width, height, pathPoints, arr) {
        this.position.left = left;
        this.position.top = top;
        this.position.width = width;
        this.position.height = height;
        this._orgPosition.left = this.position.left;
        this._orgPosition.top = this.position.top;
        this._orgPosition.width = this.position.width;
        this._orgPosition.height = this.position.height;
        this._orgPoints = [];
        this._points = [];
        this._pathPoints = pathPoints;
        for (let n = 0; n < arr.length; n++) {
            let p = arr[n].point.copyTo();
            this._orgPoints.push(p);
            this._points.push(arr[n]);
        }
        this.visible = true;
    }
    copyPoints() {
    }
}
class CGuideLine extends CResourceClass {
    constructor() {
        super(...arguments);
        this._kind = "y";
    }
}
class CPathEditorControl extends CSelectArea {
    constructor(parent, name) {
        super(parent, name);
        this.__points = new CList();
        this._mode = "None";
        this._pointResource = "";
        this._cpoint1Resource = "";
        this._cpoint2Resource = "";
        this.pathPointControlArea = new CPathPointControlArea(this);
        let self = this;
        this.pathPointControlArea.onDelete = function () {
            self.pathPointControlArea.visible = false;
            self.refresh();
        };
    }
    get mode() {
        return this._mode;
    }
    set mode(value) {
        if (this._mode != value) {
            this._mode = value;
            this.doChangeMode();
        }
    }
    get pathPointList() {
        return this._pathPointList;
    }
    set pathPointList(value) {
        this._pathPointList = value;
        if (this._pathPointList != undefined) {
            this.refresh();
            //this._pathPointList.onChange = function() {
            //}
        }
    }
    get pointResource() {
        return this._pointResource;
    }
    set pointResource(value) {
        this._pointResource = value;
    }
    get cpoint1Resource() {
        return this._cpoint1Resource;
    }
    set cpoint1Resource(value) {
        this._cpoint1Resource = value;
    }
    get cpoint2Resource() {
        return this._cpoint2Resource;
    }
    set cpoint2Resource(value) {
        this._cpoint2Resource = value;
    }
    get points() {
        return this.__points;
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "pointResource", this.pointResource, "");
        CDataClass.putData(data, "cpoint1Resource", this.cpoint1Resource, "");
        CDataClass.putData(data, "cpoint2Resource", this.cpoint2Resource, "");
        CDataClass.putData(data, "pathPointControlArea", this.pathPointControlArea.toData(), {}, true);
    }
    doFromData(data) {
        super.doFromData(data);
        this.pointResource = CDataClass.getData(data, "pointResource", "");
        this.cpoint1Resource = CDataClass.getData(data, "cpoint1Resource", "");
        this.cpoint2Resource = CDataClass.getData(data, "cpoint2Resource", "");
        this.pathPointControlArea.fromData(CDataClass.getData(data, "pathPointControlArea", {}, true));
    }
    doThisPointerDown(e, points) {
        super.doThisPointerDown(e, points);
        if (this._pathPointList != undefined && e.button == 0) {
            if (this._mode == "None") {
                this.pathPointControlArea.visible = false;
            }
            if (this._mode == "MoveTo") {
                let pt = CPoint.create(e.offsetX, e.offsetY);
                let ppt = this._pathPointList.addPointMoveTo(pt);
                this.__prePathPoint = pt;
                let selector = new CPathPointSelectorModel(this.pointResource, this.cpoint1Resource, this.cpoint2Resource);
                selector.parent = this;
                selector.pathPoint = ppt;
                this.__points.add(selector);
            }
            if (this._mode == "LineTo") {
                let pt = CPoint.create(e.offsetX, e.offsetY);
                let ppt = this._pathPointList.addPointLineTo(CPoint.create(e.offsetX, e.offsetY));
                this.__prePathPoint = pt;
                let selector = new CPathPointSelectorModel(this.pointResource, this.cpoint1Resource, this.cpoint2Resource);
                selector.parent = this;
                selector.pathPoint = ppt;
                this.__points.add(selector);
            }
            if (this._mode == "CurveTo") {
                let pt = CPoint.create(e.offsetX, e.offsetY);
                if (this.__prePathPoint != undefined) {
                    let ds = CPoint.getDistancePoints(pt, this.__prePathPoint);
                    let cpt1 = CPoint.getLineMiddlePoint(this.__prePathPoint, pt, CCalc.crRange2Value(0, ds, ds / 3, 0, 1));
                    let cpt2 = CPoint.getLineMiddlePoint(this.__prePathPoint, pt, CCalc.crRange2Value(0, ds, (ds / 3) * 2, 0, 1));
                    let ppt = this._pathPointList.addPointCurveTo3(pt, cpt1, cpt2);
                    this.__prePathPoint = pt;
                    let selector = new CPathPointSelectorModel(this.pointResource, this.cpoint1Resource, this.cpoint2Resource);
                    selector.parent = this;
                    selector.pathPoint = ppt;
                    this.__points.add(selector);
                }
                else {
                    let ppt = this._pathPointList.addPointCurveTo3(pt, pt, pt);
                    this.__prePathPoint = pt;
                    let selector = new CPathPointSelectorModel(this.pointResource, this.cpoint1Resource, this.cpoint2Resource);
                    selector.parent = this;
                    selector.pathPoint = ppt;
                    this.__points.add(selector);
                }
            }
        }
    }
    doKeyDown(e) {
        super.doKeyDown(e);
        if (e.key.toUpperCase() == "N") {
            this.mode = "None";
        }
        if (e.key.toUpperCase() == "M") {
            this.mode = "MoveTo";
        }
        if (e.key.toUpperCase() == "L") {
            this.mode = "LineTo";
        }
        if (e.key.toUpperCase() == "V") {
            this.mode = "CurveTo";
        }
        if (e.key.toUpperCase() == "E") {
            this.mode = "AddEllipse";
        }
        if (e.key.toUpperCase() == "C") {
            if (this.pathPointList != undefined)
                this.pathPointList.addPointClose();
        }
    }
    showArea(startPoint, stopPoint) {
        let arr = new Array();
        if (this.pathPointList != undefined) {
            let rt = new CRect(startPoint.x, startPoint.y, stopPoint.x, stopPoint.y);
            for (let n = 0; n < this.__points.length; n++) {
                let pp = this.__points.get(n).pathPoint;
                if (pp != undefined) {
                    if (rt.isIn(pp.point.x, pp.point.y)) {
                        arr.push({ point: pp.point, handle: this.__points.get(n).point, isCurveControl: false });
                    }
                    if (rt.isIn(pp.cPoint1.x, pp.cPoint1.y)) {
                        let hd = this.__points.get(n).cpoint1;
                        if (hd != undefined)
                            arr.push({ point: pp.cPoint1, handle: hd, isCurveControl: true });
                    }
                    if (rt.isIn(pp.cPoint2.x, pp.cPoint2.y)) {
                        let hd = this.__points.get(n).cpoint2;
                        if (hd != undefined)
                            arr.push({ point: pp.cPoint2, handle: hd, isCurveControl: true });
                    }
                }
            }
        }
        this.pathPointControlArea.showArea(startPoint.x, startPoint.y, stopPoint.x - startPoint.x, stopPoint.y - startPoint.y, this.pathPointList, arr);
        this.pathPointControlArea.focused = true;
    }
    doSelectArea(startPoint, stopPoint) {
        super.doSelectArea(startPoint, stopPoint);
        if (this.mode == "None") {
            this.showArea(startPoint, stopPoint);
        }
        if (this.mode == "AddEllipse") {
            if (this.pathPointList != undefined) {
                this.pathPointList.makeEllipseData(startPoint.x, startPoint.y, stopPoint.x - startPoint.x, stopPoint.y - startPoint.y, false);
                this.refresh();
                this.showArea(startPoint, stopPoint);
            }
        }
    }
    doChangeMode() {
        this.pathPointControlArea.visible = false;
        if (this.mode == "None" || this.mode == "AddEllipse") {
            this.useSelectArea = true;
        }
        else {
            this.useSelectArea = false;
        }
    }
    deletePoint(pathPoint) {
        if (this._pathPointList != undefined) {
            for (let n = 0; n < this.__points.length; n++) {
                if (this.__points.get(n).pathPoint == pathPoint) {
                    this.__points.get(n).point.remove();
                    let cp1 = this.__points.get(n).cpoint1;
                    if (cp1 != undefined)
                        cp1.remove();
                    let cp2 = this.__points.get(n).cpoint2;
                    if (cp2 != undefined)
                        cp2.remove();
                    this.__points.delete(n);
                    break;
                }
            }
            for (let n = 0; n < this._pathPointList.length; n++) {
                if (this._pathPointList.get(n) == pathPoint) {
                    this._pathPointList.delete(n);
                    break;
                }
            }
        }
    }
    clearPoints() {
        for (let n = 0; n < this.__points.length; n++) {
            this.__points.get(n).point.remove();
            let cp1 = this.__points.get(n).cpoint1;
            if (cp1 != undefined)
                cp1.remove();
            let cp2 = this.__points.get(n).cpoint2;
            if (cp2 != undefined)
                cp2.remove();
        }
        this.__points.clear();
    }
    reCreatePoints() {
        if (this.pathPointList != undefined) {
            this.clearPoints();
            for (let n = 0; n < this.pathPointList.length; n++) {
                if (this.pathPointList.get(n).pointKind == EPathPointKind.MOVETO) {
                    let selector = new CPathPointSelectorModel(this.pointResource, this.cpoint1Resource, this.cpoint2Resource);
                    selector.parent = this;
                    selector.pathPoint = this.pathPointList.get(n);
                    this.__points.add(selector);
                }
                if (this.pathPointList.get(n).pointKind == EPathPointKind.LINETO) {
                    let selector = new CPathPointSelectorModel(this.pointResource, this.cpoint1Resource, this.cpoint2Resource);
                    selector.parent = this;
                    selector.pathPoint = this.pathPointList.get(n);
                    this.__points.add(selector);
                }
                if (this.pathPointList.get(n).pointKind == EPathPointKind.CURVETO2) {
                    let selector = new CPathPointSelectorModel(this.pointResource, this.cpoint1Resource, this.cpoint2Resource);
                    selector.parent = this;
                    selector.pathPoint = this.pathPointList.get(n);
                    this.__points.add(selector);
                }
                if (this.pathPointList.get(n).pointKind == EPathPointKind.CURVETO3) {
                    let selector = new CPathPointSelectorModel(this.pointResource, this.cpoint1Resource, this.cpoint2Resource);
                    selector.parent = this;
                    selector.pathPoint = this.pathPointList.get(n);
                    this.__points.add(selector);
                }
            }
        }
    }
    refreshPoints() {
        for (let n = 0; n < this.__points.length; n++) {
            let pt = this.__points.get(n).pathPoint;
            if (pt != undefined) {
                this.__points.get(n).isUpdate = false;
                this.__points.get(n).point.position.left = pt.point.x - 5;
                this.__points.get(n).point.position.top = pt.point.y - 5;
                let cp1 = this.__points.get(n).cpoint1;
                if (cp1 != undefined) {
                    cp1.position.left = pt.cPoint1.x - 3;
                    cp1.position.top = pt.cPoint1.y - 3;
                }
                let cp2 = this.__points.get(n).cpoint2;
                if (cp2 != undefined) {
                    cp2.position.left = pt.cPoint2.x - 3;
                    cp2.position.top = pt.cPoint2.y - 3;
                }
                this.__points.get(n).isUpdate = true;
            }
        }
    }
    setAlignPixel() {
    }
    clear() {
        if (this.pathPointList != undefined) {
            this.pathPointList.clear();
            this.clearPoints();
        }
    }
    refresh() {
        if (this.pathPointList != undefined) {
            this.reCreatePoints();
            for (let n = 0; n < this.pathPointList.length; n++) {
                let s = "";
                if (this.pathPointList.get(n).pointKind == EPathPointKind.BEGIN) {
                    s = "B";
                }
                else if (this.pathPointList.get(n).pointKind == EPathPointKind.MOVETO) {
                    s = "M";
                }
                else if (this.pathPointList.get(n).pointKind == EPathPointKind.LINETO) {
                    s = "L";
                }
                else if (this.pathPointList.get(n).pointKind == EPathPointKind.CURVETO2 || this.pathPointList.get(n).pointKind == EPathPointKind.CURVETO3) {
                    s = "C";
                }
                else if (this.pathPointList.get(n).pointKind == EPathPointKind.CLOSE) {
                    s = "CL";
                }
            }
        }
    }
}
