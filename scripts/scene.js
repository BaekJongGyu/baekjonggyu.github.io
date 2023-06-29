"use strict";
class CSceneAnimation extends CResourceClass {
    constructor() {
        super(...arguments);
        this.__startTime = 0;
        this._timeSections = new CList();
        this.time = new CTime();
        this.duration = 1000;
        this.startTimeSpeed = 1;
        this.stopTimeSpeed = 1;
    }
    get timeSections() {
        return this._timeSections;
    }
    doRemove() {
        this._timeSections.clear();
        this.time.remove();
        super.doRemove();
    }
    doTick(sectionName, preTime, time, value, graphValue) {
        if (this.onTick != undefined) {
            this.onTick(this, sectionName, preTime, time, value, graphValue);
        }
    }
    doBeforeStart() {
        if (this.onBeforeStart != undefined) {
            this.onBeforeStart(this);
        }
    }
    doFinish() {
        if (this.onFinish != undefined) {
            this.onFinish(this);
        }
    }
    doStart() {
        let self = this;
        let nw = CTime.now;
        this.time.time = nw;
        this.time.clearTimeSection();
        for (let n = 0; n < this._timeSections.length; n++) {
            let ts = new CTimeSection(this.time);
            let v = this._timeSections.get(n).graphNameOrData;
            if (typeof v == "string") {
                let arr = CSystem.resources.get(v);
                ts["values"] = arr;
            }
            else {
                ts["values"] = v;
            }
            ts.startTime = nw + this._timeSections.get(n).startTime;
            ts.stopTime = nw + this._timeSections.get(n).startTime + this._timeSections.get(n).duration;
            ts.isLoop = this._timeSections.get(n).isLoop;
            let name = this._timeSections.get(n).sectionName;
            ts.onTick = function (s, pre, t, v) {
                if (t != undefined) {
                    let gv = ts["values"][Math.round(CCalc.cr(ts["values"].length - 1, 0, 1, v, 2))];
                    self.doTick(name, pre, t, v, gv);
                }
            };
        }
        let isFinish = false;
        this.time.onChangeTime = function () {
            if (this.time > self.__startTime + self.duration) {
                if (isFinish) {
                    CTime.times.delete(self.time);
                    self.doFinish();
                }
                else {
                    isFinish = true;
                }
            }
            if (self.timeSpeedGraphData != undefined) {
                let t = CCalc.crRange2Value(self.__startTime, self.__startTime + self.duration, self.time.time, 0, self.timeSpeedGraphData.length - 1);
                let rt = Math.round(t);
                if (rt > self.timeSpeedGraphData.length - 1) {
                    t = self.timeSpeedGraphData.length - 1;
                }
                else {
                    t = rt;
                }
                self.time.speed = self.startTimeSpeed + ((self.stopTimeSpeed - self.startTimeSpeed) * self.timeSpeedGraphData[t]);
            }
        };
        this.__startTime = nw;
        CTime.times.add(CSequence.getSequence("tempAnimation"), this.time);
    }
    start() {
        this.doBeforeStart();
        this.doStart();
    }
    addSection(sectionName, graphNameOrData, startTime, duration, isLoop = false) {
        this._timeSections.add({ sectionName: sectionName, graphNameOrData: graphNameOrData, startTime: startTime, duration: duration, isLoop: isLoop });
    }
    moveTime(duration) {
        let self = this;
        let nw = CTime.now;
        this.time.time = nw;
        this.time.clearTimeSection();
        for (let n = 0; n < this._timeSections.length; n++) {
            let ts = new CTimeSection(this.time);
            let v = this._timeSections.get(n).graphNameOrData;
            if (typeof v == "string") {
                let arr = CSystem.resources.get(v);
                ts["values"] = arr;
            }
            else {
                ts["values"] = v;
            }
            ts.startTime = nw + this._timeSections.get(n).startTime;
            ts.stopTime = nw + this._timeSections.get(n).startTime + this._timeSections.get(n).duration;
            let name = this._timeSections.get(n).sectionName;
            ts.onTick = function (s, pre, t, v) {
                if (t != undefined) {
                    self.doTick(name, pre, t, v, ts["values"][Math.round(CCalc.cr(ts["values"].length - 1, 0, 1, v, 2))]);
                }
            };
        }
        for (let n = 0; n < this.time.timeSections.length; n++) {
            let ts = this.time.timeSections[n];
            let now = nw + duration;
            if (ts.startTime <= now && ts.stopTime > now) {
                ts.doTick(now - 1, now, CCalc.crRange2Value(ts.startTime, ts.stopTime, now, 0, 1));
            }
            else if (ts.startTime > now) {
                ts.doTick(now - 1, now, 0);
            }
            else {
                ts.doTick(now - 1, now, 1);
            }
        }
    }
}
class CSceneAnimator extends CSceneAnimation {
    constructor() {
        super(...arguments);
        this.__sections = new Map();
    }
    doRemove() {
        this.__sections.clear();
        this.animationControl = undefined;
        super.doRemove();
    }
    doBeforeStart() {
        if (this.animationControl != undefined) {
            this.timeSections.clear();
            this.__sections.clear();
            let sd = this.animationControl.sceneData;
            for (let n = 0; n < sd.sections.length; n++) {
                sd.sections.get(n).control = this.animationControl.getObject(sd.sections.get(n).controlName);
                delete sd.sections.get(n)["__lastSet"];
                this.addSection(sd.sections.get(n).controlName + "." + sd.sections.get(n).property + n, sd.sections.get(n).graphData, sd.sections.get(n).startTime, sd.sections.get(n).duration, sd.sections.get(n).isLoop);
                this.__sections.set(sd.sections.get(n).controlName + "." + sd.sections.get(n).property + n, sd.sections.get(n));
            }
        }
        super.doBeforeStart();
    }
    doTick(sectionName, preTime, time, value, graphValue) {
        if (this.animationControl != undefined) {
            let info = this.__sections.get(sectionName);
            if (info != undefined) {
                this.setObjects(sectionName, time - this.__startTime, graphValue, info);
            }
        }
        super.doTick(sectionName, preTime, time, value, graphValue);
    }
    setObjects(sectionName, wt, graphValue, info) {
        if (info.control != undefined) {
            if (info.property.indexOf("script") >= 0) {
                let fn = new Function("animator", "animationControl", "sectionName", "workingTime", "graphValue", "info", "control", info.script);
                fn(this, this.animationControl, sectionName, wt, graphValue, info, info.control);
            }
            else {
                if (typeof info.startValue == "number" && typeof info.stopValue == "number") {
                    if (info.property.indexOf("position.left") >= 0 ||
                        info.property.indexOf("position.width") >= 0 ||
                        info.property.indexOf("transform.translateX") >= 0) {
                        (new Function("c", "c." + info.property + " = " + this.getValue("x", CCalc.crRange2Value(0, 1, graphValue, info.startValue, info.stopValue))))(info.control);
                    }
                    else if (info.property.indexOf("position.top") >= 0 ||
                        info.property.indexOf("position.height") >= 0 ||
                        info.property.indexOf("transform.translateY") >= 0) {
                        (new Function("c", "c." + info.property + " = " + this.getValue("y", CCalc.crRange2Value(0, 1, graphValue, info.startValue, info.stopValue))))(info.control);
                    }
                    else {
                        (new Function("c", "c." + info.property + " = " + CCalc.crRange2Value(0, 1, graphValue, info.startValue, info.stopValue)))(info.control);
                    }
                }
                else if (info.startValue instanceof CPoint && info.stopValue instanceof CPoint) {
                    (new Function("c", `c.` + info.property + `.x = ` + CCalc.crRange2Value(0, 1, graphValue, info.startValue.x, info.stopValue.x) + `;` +
                        `c.` + info.property + `.y = ` + CCalc.crRange2Value(0, 1, graphValue, info.startValue.y, info.stopValue.y) + `;`))(info.control);
                }
                else if (info.startValue instanceof CRect && info.stopValue instanceof CRect) {
                    (new Function("c", `c.` + info.property + `.left = ` + CCalc.crRange2Value(0, 1, graphValue, info.startValue.left, info.stopValue.left) + `;` +
                        `c.` + info.property + `.top = ` + CCalc.crRange2Value(0, 1, graphValue, info.startValue.top, info.stopValue.top) + `;` +
                        `c.` + info.property + `.right = ` + CCalc.crRange2Value(0, 1, graphValue, info.startValue.right, info.stopValue.right) + `;` +
                        `c.` + info.property + `.bottom = ` + CCalc.crRange2Value(0, 1, graphValue, info.startValue.bottom, info.stopValue.bottom) + `;`))(info.control);
                }
                else if (info.startValue instanceof CNotifyPoint && info.stopValue instanceof CNotifyPoint) {
                    (new Function("c", `c.` + info.property + `.x = ` + CCalc.crRange2Value(0, 1, graphValue, info.startValue.x, info.stopValue.x) + `;` +
                        `c.` + info.property + `.y = ` + CCalc.crRange2Value(0, 1, graphValue, info.startValue.y, info.stopValue.y) + `;`))(info.control);
                }
                else if (info.startValue instanceof CNotifyRect && info.stopValue instanceof CNotifyRect) {
                    (new Function("c", `c.` + info.property + `.left = ` + CCalc.crRange2Value(0, 1, graphValue, info.startValue.left, info.stopValue.left) + `;` +
                        `c.` + info.property + `.top = ` + CCalc.crRange2Value(0, 1, graphValue, info.startValue.top, info.stopValue.top) + `;` +
                        `c.` + info.property + `.right = ` + CCalc.crRange2Value(0, 1, graphValue, info.startValue.right, info.stopValue.right) + `;` +
                        `c.` + info.property + `.bottom = ` + CCalc.crRange2Value(0, 1, graphValue, info.startValue.bottom, info.stopValue.bottom) + `;`))(info.control);
                }
                else if (info.startValue instanceof CColorInfo && info.stopValue instanceof CColorInfo) {
                    let col = "rgba(" + CCalc.crRange2Value(0, 1, graphValue, info.startValue.r, info.stopValue.r) + "," +
                        CCalc.crRange2Value(0, 1, graphValue, info.startValue.g, info.stopValue.g) + "," +
                        CCalc.crRange2Value(0, 1, graphValue, info.startValue.b, info.stopValue.b) + "," +
                        CCalc.crRange2Value(0, 1, graphValue, info.startValue.a, info.stopValue.a) + ")";
                    (new Function("c", `c.` + info.property + ` = "` + col + `";`))(info.control);
                }
                if (info.objectData.length > 0) {
                    if (info.objectData.get(info.objectData.length - 1).sectionT < graphValue && info["__lastSet"] == undefined) {
                        info.control.opacity = info.objectData.get(info.objectData.length - 1).info.opacity;
                        if (info.positionPoints.length == 0) {
                            info.control.position.left = this.getValue("x", info.objectData.get(info.objectData.length - 1).info.position.left);
                            info.control.position.top = this.getValue("y", info.objectData.get(info.objectData.length - 1).info.position.top);
                        }
                        info.control.position.width = this.getValue("x", info.objectData.get(info.objectData.length - 1).info.position.width);
                        info.control.position.height = this.getValue("y", info.objectData.get(info.objectData.length - 1).info.position.height);
                        info.control.transform.rotateX = info.objectData.get(info.objectData.length - 1).info.transform.rotateX;
                        info.control.transform.rotateY = info.objectData.get(info.objectData.length - 1).info.transform.rotateY;
                        info.control.transform.rotateZ = info.objectData.get(info.objectData.length - 1).info.transform.rotateZ;
                        info.control.transform.translateX = this.getValue("x", info.objectData.get(info.objectData.length - 1).info.transform.translateX);
                        info.control.transform.translateY = this.getValue("y", info.objectData.get(info.objectData.length - 1).info.transform.translateY);
                        info.control.transform.translateZ = info.objectData.get(info.objectData.length - 1).info.transform.translateZ;
                        info.control.transform.scaleX = info.objectData.get(info.objectData.length - 1).info.transform.scaleX;
                        info.control.transform.scaleY = info.objectData.get(info.objectData.length - 1).info.transform.scaleY;
                        info.control.transform.scaleZ = info.objectData.get(info.objectData.length - 1).info.transform.scaleZ;
                        info.control.transform.rotationPointX = info.objectData.get(info.objectData.length - 1).info.transform.rotationPointX;
                        info.control.transform.rotationPointY = info.objectData.get(info.objectData.length - 1).info.transform.rotationPointY;
                        info.control.transform.rotationPointZ = info.objectData.get(info.objectData.length - 1).info.transform.rotationPointZ;
                        info.control.filter.blurValue = info.objectData.get(info.objectData.length - 1).info.filter.blurValue;
                        info.control.filter.brightnessValue = info.objectData.get(info.objectData.length - 1).info.filter.brightnessValue;
                        info.control.filter.constrastValue = info.objectData.get(info.objectData.length - 1).info.filter.constrastValue;
                        info.control.filter.grayscaleValue = info.objectData.get(info.objectData.length - 1).info.filter.grayscaleValue;
                        info.control.filter.hueRotateValue = info.objectData.get(info.objectData.length - 1).info.filter.hueRotateValue;
                        info.control.filter.invertValue = info.objectData.get(info.objectData.length - 1).info.filter.invertValue;
                        info.control.filter.opacityValue = info.objectData.get(info.objectData.length - 1).info.filter.opacityValue;
                        info.control.filter.shadowBlur = info.objectData.get(info.objectData.length - 1).info.filter.shadowBlur;
                        if (info.control.filter.filterSet.shadow) {
                            info.control.filter.shadowColor = info.objectData.get(info.objectData.length - 1).info.filter.shadowColor;
                        }
                        info.control.filter.shadowX = this.getValue("x", info.objectData.get(info.objectData.length - 1).info.filter.shadowX);
                        info.control.filter.shadowY = this.getValue("y", info.objectData.get(info.objectData.length - 1).info.filter.shadowY);
                        CCanvasLayers.setLayersMiddlePathData(info.objectData.get(info.objectData.length - 1).info.layers, info.objectData.get(info.objectData.length - 1).info.layers, info.control.layers, 1);
                        info["__lastSet"] = true;
                    }
                    else {
                        let s = 0;
                        let objectIdx = -1;
                        if (graphValue > 0) {
                            for (let n = 0; n < info.objectData.length; n++) {
                                if (s < graphValue && graphValue <= info.objectData.get(n).sectionT) {
                                    objectIdx = n;
                                    break;
                                }
                                s = info.objectData.get(n).sectionT;
                            }
                        }
                        let objst;
                        let objed;
                        if (objectIdx != -1) {
                            objed = info.objectData.get(objectIdx);
                            if (objectIdx > 0) {
                                objst = info.objectData.get(objectIdx - 1);
                            }
                        }
                        if (objst == undefined) {
                            objst = info.objectData.get(0);
                            objst.sectionT = 0;
                        }
                        if (objed != undefined) {
                            info.control.opacity = CCalc.crRange2Value(objst.sectionT, objed.sectionT, graphValue, objst.info.opacity, objed.info.opacity);
                            if (info.positionPoints.length == 0) {
                                info.control.position.left = this.getValue("x", CCalc.crRange2Value(objst.sectionT, objed.sectionT, graphValue, objst.info.position.left, objed.info.position.left));
                                info.control.position.top = this.getValue("y", CCalc.crRange2Value(objst.sectionT, objed.sectionT, graphValue, objst.info.position.top, objed.info.position.top));
                            }
                            info.control.position.width = this.getValue("x", CCalc.crRange2Value(objst.sectionT, objed.sectionT, graphValue, objst.info.position.width, objed.info.position.width));
                            info.control.position.height = this.getValue("y", CCalc.crRange2Value(objst.sectionT, objed.sectionT, graphValue, objst.info.position.height, objed.info.position.height));
                            info.control.transform.rotateX = CCalc.crRange2Value(objst.sectionT, objed.sectionT, graphValue, objst.info.transform.rotateX, objed.info.transform.rotateX);
                            info.control.transform.rotateY = CCalc.crRange2Value(objst.sectionT, objed.sectionT, graphValue, objst.info.transform.rotateY, objed.info.transform.rotateY);
                            info.control.transform.rotateZ = CCalc.crRange2Value(objst.sectionT, objed.sectionT, graphValue, objst.info.transform.rotateZ, objed.info.transform.rotateZ);
                            info.control.transform.translateX = this.getValue("x", CCalc.crRange2Value(objst.sectionT, objed.sectionT, graphValue, objst.info.transform.translateX, objed.info.transform.translateX));
                            info.control.transform.translateY = this.getValue("y", CCalc.crRange2Value(objst.sectionT, objed.sectionT, graphValue, objst.info.transform.translateY, objed.info.transform.translateY));
                            info.control.transform.translateZ = CCalc.crRange2Value(objst.sectionT, objed.sectionT, graphValue, objst.info.transform.translateZ, objed.info.transform.translateZ);
                            info.control.transform.scaleX = CCalc.crRange2Value(objst.sectionT, objed.sectionT, graphValue, objst.info.transform.scaleX, objed.info.transform.scaleX);
                            info.control.transform.scaleY = CCalc.crRange2Value(objst.sectionT, objed.sectionT, graphValue, objst.info.transform.scaleY, objed.info.transform.scaleY);
                            info.control.transform.scaleZ = CCalc.crRange2Value(objst.sectionT, objed.sectionT, graphValue, objst.info.transform.scaleZ, objed.info.transform.scaleZ);
                            info.control.transform.rotationPointX = CCalc.crRange2Value(objst.sectionT, objed.sectionT, graphValue, objst.info.transform.rotationPointX, objed.info.transform.rotationPointX);
                            info.control.transform.rotationPointY = CCalc.crRange2Value(objst.sectionT, objed.sectionT, graphValue, objst.info.transform.rotationPointY, objed.info.transform.rotationPointY);
                            info.control.transform.rotationPointZ = CCalc.crRange2Value(objst.sectionT, objed.sectionT, graphValue, objst.info.transform.rotationPointZ, objed.info.transform.rotationPointZ);
                            info.control.filter.blurValue = CCalc.crRange2Value(objst.sectionT, objed.sectionT, graphValue, objst.info.filter.blurValue, objed.info.filter.blurValue);
                            info.control.filter.brightnessValue = CCalc.crRange2Value(objst.sectionT, objed.sectionT, graphValue, objst.info.filter.brightnessValue, objed.info.filter.brightnessValue);
                            info.control.filter.constrastValue = CCalc.crRange2Value(objst.sectionT, objed.sectionT, graphValue, objst.info.filter.constrastValue, objed.info.filter.constrastValue);
                            info.control.filter.grayscaleValue = CCalc.crRange2Value(objst.sectionT, objed.sectionT, graphValue, objst.info.filter.grayscaleValue, objed.info.filter.grayscaleValue);
                            info.control.filter.hueRotateValue = CCalc.crRange2Value(objst.sectionT, objed.sectionT, graphValue, objst.info.filter.hueRotateValue, objed.info.filter.hueRotateValue);
                            info.control.filter.invertValue = CCalc.crRange2Value(objst.sectionT, objed.sectionT, graphValue, objst.info.filter.invertValue, objed.info.filter.invertValue);
                            info.control.filter.opacityValue = CCalc.crRange2Value(objst.sectionT, objed.sectionT, graphValue, objst.info.filter.opacityValue, objed.info.filter.opacityValue);
                            info.control.filter.shadowBlur = CCalc.crRange2Value(objst.sectionT, objed.sectionT, graphValue, objst.info.filter.shadowBlur, objed.info.filter.shadowBlur);
                            if (info.control.filter.filterSet.shadow) {
                                let col1 = new CColor(objst.info.filter.shadowColor);
                                let col2 = new CColor(objed.info.filter.shadowColor);
                                let r = CCalc.crRange2Value(objst.sectionT, objed.sectionT, graphValue, col1.r, col2.r);
                                let g = CCalc.crRange2Value(objst.sectionT, objed.sectionT, graphValue, col1.g, col2.g);
                                let b = CCalc.crRange2Value(objst.sectionT, objed.sectionT, graphValue, col1.b, col2.b);
                                let a = CCalc.crRange2Value(objst.sectionT, objed.sectionT, graphValue, col1.a, col2.a);
                                info.control.filter.shadowColor = "rgba(" + r + "," + g + "," + b + "," + a + ")";
                            }
                            info.control.filter.shadowX = this.getValue("x", CCalc.crRange2Value(objst.sectionT, objed.sectionT, graphValue, objst.info.filter.shadowX, objed.info.filter.shadowX));
                            info.control.filter.shadowY = this.getValue("y", CCalc.crRange2Value(objst.sectionT, objed.sectionT, graphValue, objst.info.filter.shadowY, objed.info.filter.shadowY));
                            CCanvasLayers.setLayersMiddlePathData(objst.info.layers, objed.info.layers, info.control.layers, CCalc.crRange2Value(objst.sectionT, objed.sectionT, graphValue, 0, 1));
                        }
                    }
                }
                if (info.positionPoints.length > 0) {
                    let idx = Math.round(CCalc.crRange2Value(0, 1, graphValue, 0, info.positionPoints.length - 1));
                    let pt = info.positionPoints[idx];
                    info.control.position.left = this.getValue("x", pt.x) - (info.control.transform.rotationPointX * info.control.position.width);
                    info.control.position.top = this.getValue("y", pt.y) - (info.control.transform.rotationPointY * info.control.position.height);
                }
            }
        }
    }
    getValue(kind, v) {
        if (this.animationControl != undefined) {
            if (kind == "x") {
                return v * (this.animationControl.position.width / this.animationControl.orgPosition.width);
            }
            else {
                return v * (this.animationControl.position.height / this.animationControl.orgPosition.height);
            }
        }
        else {
            return v;
        }
    }
}
class CTimeSpeedGraphEditorFrameModel extends CGraphEditorModel {
    constructor() {
        super(...arguments);
        this.lRBottom = new CPanel(this.lRight);
        this.lblStartSpeed = new CPanel(this.lRBottom);
        this.edtStartSpeed = new CTextBox(this.lRBottom);
        this.lblStopSpeed = new CPanel(this.lRBottom);
        this.edtStopSpeed = new CTextBox(this.lRBottom);
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "lRBottom", this.lRBottom.toData(), {}, true);
        CDataClass.putData(data, "lblStartSpeed", this.lblStartSpeed.toData(), {}, true);
        CDataClass.putData(data, "edtStartSpeed", this.edtStartSpeed.toData(), {}, true);
        CDataClass.putData(data, "lblStopSpeed", this.lblStopSpeed.toData(), {}, true);
        CDataClass.putData(data, "edtStopSpeed", this.edtStopSpeed.toData(), {}, true);
    }
    doFromData(data) {
        super.doFromData(data);
        this.lRBottom.fromData(CDataClass.getData(data, "lRBottom", {}, true));
        this.lblStartSpeed.fromData(CDataClass.getData(data, "lblStartSpeed", {}, true));
        this.edtStartSpeed.fromData(CDataClass.getData(data, "edtStartSpeed", {}, true));
        this.lblStopSpeed.fromData(CDataClass.getData(data, "lblStopSpeed", {}, true));
        this.edtStopSpeed.fromData(CDataClass.getData(data, "edtStopSpeed", {}, true));
    }
}
class CTimeSpeedGraphEditor extends CWindowTool {
    constructor(parent, name) {
        super(parent, name);
        this.editor = new CTimeSpeedGraphEditorFrameModel(this.body);
        this.editor.resource = "timeSpeedGraphEditor.frame";
        this.editor.position.align = EPositionAlign.CLIENT;
    }
}
class CObjectPanel extends CPanel {
    constructor(parent, name) {
        super(parent, name);
        this.btnApply = new CButton(this);
        this.btnClose = new CButton(this);
        let self = this;
        this.btnApply.resource = "button_orange_gra.control";
        this.btnApply.position.align = EPositionAlign.RIGHTBOTTOM;
        this.btnApply.position.height = 25;
        this.btnApply.position.margins.bottom = 21;
        this.btnApply.text = "Objects\nApply";
        this.btnClose.resource = "button_gray_gra.control";
        this.btnClose.position.align = EPositionAlign.RIGHTBOTTOM;
        this.btnClose.position.height = 20;
        this.btnClose.text = "Close";
        this.btnClose.onClick = function () {
            self.remove();
            if (self.editor != undefined) {
                self.editor.objectPanel = undefined;
                self.editor = undefined;
                self.section = undefined;
            }
        };
        this.position.align = EPositionAlign.CLIENT;
        this.onDoubleClick = function () {
            let ar = CSystem.getChildControls(this);
            for (let n = 0; n < ar.length; n++) {
                if (ar[n] instanceof CAnimationControl) {
                    ar[n].remove();
                }
            }
            self.setSection();
        };
        this.onClick = function () {
            self.setSection();
        };
    }
    setObjects(section) {
        if (section.control != undefined && this.editor != undefined) {
            this.section = section;
            for (let n = 0; n < section.objectData.length; n++) {
                let con = section.control.copyTo();
                con.parent = this;
                CGraphicInfo.setControlGraphicInfo(section.objectData.get(n).info, con);
                con["sectionT"] = section.objectData.get(n).sectionT;
                con["centerX"] = section.objectData.get(n).centerX;
                con["centerY"] = section.objectData.get(n).centerY;
                if (section.positionPoints.length == 0) {
                    con.position.left += (this.editor.controlResizer.position.left + 10);
                    con.position.top += (this.editor.controlResizer.position.top + 20);
                }
                let ed = this.editor;
                let self = this;
                if (section.positionPoints.length > 0) {
                    con.onClick = function () {
                        ed.properties.clear();
                        ed.properties.addInstance(con);
                        let cx = con["centerX"] + ed.controlResizer.position.left + 10;
                        let cy = con["centerY"] + ed.controlResizer.position.top + 20;
                        con.position.left = cx - (con.transform.rotationPointX * con.position.width);
                        con.position.top = cy - (con.transform.rotationPointY * con.position.height);
                    };
                    con.click();
                }
                else {
                    con.onClick = function () {
                        ed.properties.clear();
                        ed.properties.addInstance(con);
                    };
                    con.useMove = true;
                    con.useMoveClick = true;
                }
            }
        }
    }
    setSection() {
        if (this.editor != undefined) {
            let arr = new Array();
            let ar = CSystem.getChildControls(this);
            for (let n = 0; n < ar.length; n++) {
                if (ar[n] instanceof CAnimationControl) {
                    arr.push(ar[n]);
                }
            }
            arr.sort(function (a, b) {
                let rt = 0;
                if (a["sectionT"] < b["sectionT"])
                    rt = -1;
                if (a["sectionT"] > b["sectionT"])
                    rt = 1;
                return rt;
            });
            let sec = this.editor.getSelectedSection();
            if (sec != undefined) {
                sec.objectData.clear();
                for (let n = 0; n < arr.length; n++) {
                    let dt = arr[n].position.toData();
                    dt.left -= (this.editor.controlResizer.position.left + 10);
                    dt.top -= (this.editor.controlResizer.position.top + 20);
                    sec.objectData.add({ sectionT: arr[n]["sectionT"], centerX: arr[n]["centerX"], centerY: arr[n]["centerY"], info: CGraphicInfo.controlGraphicInfo(arr[n], dt) });
                }
            }
            this.editor.refreshGrid();
        }
    }
}
class CAnimationControlSceneEditorModel extends CPanel {
    constructor(parent, name) {
        super(parent, name);
        this.toolbar = new CPanel(this);
        this.btnShowPositionEditor = new CSelectBox(this.toolbar);
        this.btnShowObjectEditor = new CSelectBox(this.toolbar);
        this.btnSave = new CButton(this.toolbar);
        this.btnOpen = new CButton(this.toolbar);
        this.lblWidth = new CPanel(this.toolbar);
        this.edtWidth = new CTextBox(this.toolbar);
        this.lblHeight = new CPanel(this.toolbar);
        this.edtHeight = new CTextBox(this.toolbar);
        this.btnSize = new CButton(this.toolbar);
        this.btnExport = new CButton(this.toolbar);
        this.lClient = new CPanel(this);
        this.lCBottom = new CPanel(this.lClient);
        this.objectsTool = new CWindowChildTool(this);
        this.lLTop = new CPanel(this.objectsTool.body);
        this.btnAddObject = new CButton(this.lLTop);
        this.btnDeleteObject = new CButton(this.lLTop);
        this.btnAddProperty = new CButton(this.lLTop);
        this.list = new CObjectTreeListBox(this.objectsTool.body);
        this.controlResizer = new CPanel(this.lClient);
        this.con = new CAnimationControl(this.controlResizer);
        this.transformer = new CCanvasControlTransfomer(this.controlResizer);
        this.pathEditor = new CPathEditorControl(this.lClient);
        this.pathEditorToolbar = new CPanel(this.pathEditor);
        this.btnNone = new CButton(this.pathEditorToolbar);
        this.btnMoveTo = new CButton(this.pathEditorToolbar);
        this.btnLineTo = new CButton(this.pathEditorToolbar);
        this.btnCurveTo = new CButton(this.pathEditorToolbar);
        this.btnApplyPosition = new CButton(this.pathEditorToolbar);
        this.btnToolbarClose = new CButton(this.pathEditorToolbar);
        this.timeAnimationTool = new CWindowChildTool(this);
        this.lBTopTime = new CPanel(this.timeAnimationTool.body);
        this.edtTimeFrom = new CTextBox(this.lBTopTime);
        this.edtTimeTo = new CTextBox(this.lBTopTime);
        this.edtTime = new CTextBox(this.lBTopTime);
        this.btnTimeApply = new CButton(this.lBTopTime);
        this.btnTimeLeft = new CButton(this.lBTopTime);
        this.btnTimeRight = new CButton(this.lBTopTime);
        this.scrollTime = new CScrollbar(this.lBTopTime);
        this.lBTop = new CPanel(this.timeAnimationTool.body);
        this.btnPropertyUp = new CButton(this.lBTop);
        this.btnPropertyDown = new CButton(this.lBTop);
        this.btnDeleteProperty = new CButton(this.lBTop);
        this.btnGraphEdit = new CButton(this.lBTop);
        this.btnPositionEdit = new CButton(this.lBTop);
        this.btnObjectsEdit = new CButton(this.lBTop);
        this.btnApply = new CButton(this.lBTop);
        this.btnAnimationSpeedGraph = new CButton(this.lBTop);
        this.btnStart = new CButton(this.lBTop);
        this.edtDuration = new CTextBox(this.lBTop);
        this.lblDuration = new CPanel(this.lBTop);
        this.lBTop2 = new CPanel(this.timeAnimationTool.body);
        this.lblTag = new CPanel(this.lBTop2);
        this.btnTagAdd = new CButton(this.lBTop2);
        this.btnTagDelete = new CButton(this.lBTop2);
        this.lblObject = new CPanel(this.lBTop2);
        this.btnObjectDataAdd = new CButton(this.lBTop2);
        this.btnObjectDataDelete = new CButton(this.lBTop2);
        this.btnObjectCopy = new CButton(this.lBTop2);
        this.btnObjectPaste = new CButton(this.lBTop2);
        this.btnObjectTransformer = new CButton(this.lBTop2);
        this.timeline = new CDataGrid(this.timeAnimationTool.body);
        this.timelineScriptTool = new CWindowChildTool(this);
        this.lTimelineScriptTop = new CPanel(this.timelineScriptTool.body);
        this.btnTimelineScriptApply = new CButton(this.lTimelineScriptTop);
        this.txtTimelineScript = new CTextArea(this.timelineScriptTool.body);
        this.propertyTool = new CWindowChildTool(this);
        this.properties = new CTabPropertyEditor(this.propertyTool.body);
        //public sectionTagsTool = new CWindowChildTool(this)
        //사용폼
        this.frmGraph = new CWindowTool(CSystem.desktopList.get(0).applicationLayer);
        this.fraGraph = new CGraphEditorFrame(this.frmGraph.body);
        //Data
        //public graphData
        this.timeSpeedStart = 1;
        this.timeSpeedStop = 1;
        //public animations = new CList<CControlSceneSection>()
        //public tags = new CList<CPanel>()
        this.startData = new CAnimationControl();
        let self = this;
        this.frmGraph.close();
        this.con.position.align = EPositionAlign.CLIENT;
        this.resource = "sceneEditor.frame";
        this.pathEditor.position.align = EPositionAlign.CLIENT;
        this.pathEditor.pathPointList = this.pathEditor.layers.get(0).items.get(1).pathData;
        this.fraGraph.resource = "graphEditor.frame";
        this.fraGraph.position.align = EPositionAlign.CLIENT;
        this.fraGraph.btnApply.onClick = async function () {
            let data = self.fraGraph.getGraphData();
            if (typeof data == "string") {
                CSystem.showMessage("에러", data);
            }
            else {
                let sec = self.getSelectedSection();
                if (sec != undefined) {
                    sec.graphData = data;
                    sec.graphPath.fromData(self.fraGraph.item.pathData.toData());
                }
            }
        };
        this.properties.onlyShowProperty.push("overflow");
        this.properties.onlyShowProperty.push("filter");
        this.properties.onlyShowProperty.push("position");
        this.properties.onlyShowProperty.push("transform");
        //this.properties.onlyShowProperty.push("layers")
        this.properties.onlyShowProperty.push("opacity");
        this.properties.onlyShowProperty.push("useMove");
        this.properties.onlyShowProperty.push("visible");
        this.properties.onlyShowProperty.push("propertyName");
        this.btnShowPositionEditor.onChangeSelected = function () {
        };
        this.btnShowObjectEditor.onChangeSelected = function () {
            if (self.btnShowObjectEditor.selected) {
                self.showObjectPanel();
            }
            else {
                if (self.objectPanel != undefined) {
                    self.objectPanel.remove();
                    self.objectPanel = undefined;
                }
            }
        };
        this.btnOpen.onClick = function () {
            CSystem.loadFromFile(function (f) {
                f.text().then(function (fs) {
                    let o = JSON.parse(fs);
                    if (o.className == "CAnimationControl") {
                        self.con.fromData(o);
                    }
                    else if (o.control != undefined) {
                        self.con.fromData(o.control);
                        if (o.position1 != undefined) {
                            self.objectsTool.position.fromData(o.position1);
                        }
                        if (o.position2 != undefined) {
                            self.propertyTool.position.fromData(o.position2);
                        }
                        if (o.position3 != undefined) {
                            self.timeAnimationTool.position.fromData(o.position3);
                        }
                        if (o.position4 != undefined) {
                            self.controlResizer.position.fromData(o.position4);
                        }
                        if (o.position5 != undefined) {
                            if (self.parent != undefined && self.parent.parent != undefined) {
                                self.parent.parent.position.width = o.position5.width;
                                self.parent.parent.position.height = o.position5.height;
                            }
                        }
                        if (o.position6 != undefined) {
                            self.timelineScriptTool.position.fromData(o.position6);
                        }
                        if (o.duration != undefined) {
                            self.edtDuration.text = o.duration;
                            self.edtTimeFrom.text = "0";
                            self.edtTimeTo.text = o.duration;
                            self.btnTimeApply.click();
                        }
                    }
                    self.con.position.align = EPositionAlign.CLIENT;
                    self.startData.fromData(self.con.toData());
                    self.refresh();
                    self.refreshGrid();
                });
            });
        };
        this.btnSave.onClick = function () {
            CSystem.prompt("Data save", ["File name"], CSystem.browserCovers.get("cover"), function (arr) {
                let wp;
                if (self.parent != undefined && self.parent.parent != undefined) {
                    wp = self.parent.parent.position.toData();
                }
                let o = {
                    control: self.con.toData(),
                    position1: self.objectsTool.position.toData(),
                    position2: self.propertyTool.position.toData(),
                    position3: self.timeAnimationTool.position.toData(),
                    position4: self.controlResizer.position.toData(),
                    position5: wp,
                    position6: self.timelineScriptTool.position.toData(),
                    duration: self.edtDuration.text
                };
                CSystem.saveAsFile(JSON.stringify(o), arr[0] + ".scene");
            });
        };
        this.btnSize.onClick = function () {
            let w = parseInt(self.edtWidth.text) + 20;
            let h = parseInt(self.edtHeight.text) + 30;
            self.controlResizer.position.width = w;
            self.controlResizer.position.height = h;
        };
        this.btnExport.onClick = function () {
            fetchBody("https://baekjonggyu.github.io/scripts/scene.min.js").then(function (s) {
                CSystem.saveAsFile(s, "scene.min.js");
            });
            let o = {
                control: self.con.toData(),
                duration: self.edtDuration.text
            };
            let script = "CSystem.resources.set('scene1', JSON.parse(`" + JSON.stringify(o) + "`))";
            CSystem.saveAsFile(script, "sceneData.js");
            script = `
const element = document.getElementById('your_element');
const rect = element.getBoundingClientRect();
let con = new CAnimationControl(element)
let rc = CSystem.resources.get("scene1")
con.fromData(rc.control)
con.sceneData.duration = rc.duration
con.position.left = rect.left
con.position.top = rect.top
con.position.width = rect.width
con.position.height = rect.height
con.scene()`;
            CSystem.saveAsFile(script, "example.txt");
            let txt = "1. Add scene.min.js, sceneData.js script to header area";
            txt += "\n2. Run the script in the example.txt file";
            CSystem.saveAsFile(txt, "Read me.txt");
        };
        this.controlResizer.onChangeSize = function () {
            self.edtWidth.text = self.controlResizer.position.width - 20 + "";
            self.edtHeight.text = self.controlResizer.position.height - 30 + "";
            self.startData.position.width = self.controlResizer.position.width - 20;
            self.startData.position.height = self.controlResizer.position.height - 30;
        };
        this.btnAddProperty.onClick = function () {
            self.doAddSection();
        };
        this.btnAddObject.onClick = function () {
            CSystem.prompt("Add object", ["Object name"], CSystem.browserCovers.get("cover"), function (arr) {
                CSystem.loadFromFile(function (f) {
                    f.text().then(function (fs) {
                        let data = JSON.parse(fs);
                        self.con.objectsCount++;
                        self.con.objects.get(self.con.objectsCount - 1).fromData(data);
                        self.con.objects.get(self.con.objectsCount - 1).propertyName = arr[0];
                        self.con.setObjectIndex();
                        self.refresh();
                    });
                });
            });
        };
        this.btnDeleteObject.onClick = function () {
            if (self.list.selectItems.length > 0) {
                let sel = self.list.selectItems[0];
                self.con.deleteObject(sel.value.asObject["control"]);
                self.con.setObjectIndex();
                self.refresh();
            }
        };
        this.btnPropertyUp.onClick = function () {
            self.doPropertyUp();
        };
        this.btnPropertyDown.onClick = function () {
            self.doPropertyDown();
        };
        this.btnDeleteProperty.onClick = function () {
            self.doDeleteSection();
        };
        let preProperty = "";
        this.timeline.onShowEditor = function (s, c, r, editor) {
            preProperty = self.timeline.cell(1, r);
        };
        this.timeline.onEditorApply = function (s, col, row, text) {
            self.doTimeLineEdit(col, row, preProperty, text);
        };
        this.timeline.onSelectItem = function (s, c, r) {
            self.doChangeTimeLineItem(c, r);
        };
        this.timeline.onKeyDown = function (s, e) {
            self.doTimeLineKeyDown(e);
        };
        this.btnGraphEdit.onClick = function () {
            self.doGraphEditorShow(true);
        };
        this.btnPositionEdit.onClick = function () {
            self.doPositionEdit();
        };
        this.btnObjectsEdit.onClick = function () {
            self.doObjectsEdit();
        };
        this.btnTagAdd.onClick = function () {
            self.doAddTag();
        };
        this.btnTagDelete.onClick = function () {
            self.doTagDelete();
        };
        this.btnObjectDataAdd.onClick = function () {
            self.doObjectAdd();
        };
        this.btnObjectDataDelete.onClick = function () {
            self.doObjectDelete();
        };
        this.btnObjectTransformer.onClick = function () {
            self.doShowTransformer();
        };
        this.btnObjectCopy.onClick = function () {
            self.doObjectCopy();
        };
        this.btnObjectPaste.onClick = function () {
            self.doObjectPaste();
        };
        this.btnTimeApply.onClick = function () {
            self.scrollTime.min = parseInt(self.edtTimeFrom.text);
            self.scrollTime.max = parseInt(self.edtTimeTo.text);
            self.scrollTime.value = parseInt(self.edtTimeFrom.text);
            self.edtTime.text = self.edtTimeFrom.text;
        };
        this.scrollTime.onChangeValue = function () {
            self.edtTime.text = Math.round(self.scrollTime.value) + "";
            self.doSetTime(Math.round(self.scrollTime.value));
        };
        this.edtTime.onKeyDown = function (s, e) {
            if (e.key == "Enter") {
                self.scrollTime.value = parseInt(self.edtTime.text);
            }
        };
        this.btnTimeLeft.onClick = function () {
            self.scrollTime.value--;
        };
        this.btnTimeRight.onClick = function () {
            self.scrollTime.value++;
        };
        this.list.onSelectItem = function () {
            self.doSelectItem();
        };
        this.btnApply.onClick = function () {
            if (self.objectPanel != undefined)
                self.objectPanel.remove();
            self.pathEditor.visible = false;
            self.doScene();
        };
        this.btnStart.onClick = function () {
            self.doSetStart();
        };
        this.btnAnimationSpeedGraph.onClick = function () {
            self.doAnimationSpeedGraphEdit();
        };
        this.transformer.resource = "path_controller.control";
        this.transformer.position.align = EPositionAlign.CLIENT;
        this.transformer.visible = false;
        this.transformer.onFreeTransformHandleTrack = function () {
            self.doTransform();
        };
        this.objectsTool.showCenter(200, 400, "Object info", "hide");
        this.propertyTool.showCenter(300, 300, "Properties", "hide");
        this.timeAnimationTool.showCenter(850, 300, "Section animation info", "hide");
        this.timelineScriptTool.showCenter(850, 300, "Section animation script", "hide");
        this.properties.tabButtons.visible = false;
        this.btnNone.onClick = function () {
            self.pathEditor.mode = "None";
        };
        this.btnMoveTo.onClick = function () {
            self.pathEditor.mode = "MoveTo";
        };
        this.btnLineTo.onClick = function () {
            self.pathEditor.mode = "LineTo";
        };
        this.btnCurveTo.onClick = function () {
            self.pathEditor.mode = "CurveTo";
        };
        this.btnApplyPosition.onClick = function () {
            self.doSetSectionPosition();
        };
        this.btnToolbarClose.onClick = function () {
            self.pathEditor.visible = false;
        };
        this.btnTimelineScriptApply.onClick = function () {
            let sec = self.getSelectedSection();
            if (sec != undefined) {
                sec.script = self.txtTimelineScript.text;
            }
        };
        this.properties.editorCover = CSystem.browserCovers.get("cover");
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "toolbar", this.toolbar.toData(), {}, true);
        CDataClass.putData(data, "btnSave", this.btnSave.toData(), {}, true);
        CDataClass.putData(data, "btnOpen", this.btnOpen.toData(), {}, true);
        CDataClass.putData(data, "lblWidth", this.lblWidth.toData(), {}, true);
        CDataClass.putData(data, "edtWidth", this.edtWidth.toData(), {}, true);
        CDataClass.putData(data, "lblHeight", this.lblHeight.toData(), {}, true);
        CDataClass.putData(data, "edtHeight", this.edtHeight.toData(), {}, true);
        CDataClass.putData(data, "btnSize", this.btnSize.toData(), {}, true);
        CDataClass.putData(data, "btnExport", this.btnExport.toData(), {}, true);
        CDataClass.putData(data, "lLTop", this.lLTop.toData(), {}, true);
        CDataClass.putData(data, "lClient", this.lClient.toData(), {}, true);
        CDataClass.putData(data, "lBTop", this.lBTop.toData(), {}, true);
        CDataClass.putData(data, "btnAddObject", this.btnAddObject.toData(), {}, true);
        CDataClass.putData(data, "btnDeleteObject", this.btnDeleteObject.toData(), {}, true);
        CDataClass.putData(data, "btnAddProperty", this.btnAddProperty.toData(), {}, true);
        CDataClass.putData(data, "list", this.list.toData(), {}, true);
        CDataClass.putData(data, "controlResizer", this.controlResizer.toData(), {}, true);
        CDataClass.putData(data, "lBTopTime", this.lBTopTime.toData(), {}, true);
        CDataClass.putData(data, "edtTimeFrom", this.edtTimeFrom.toData(), {}, true);
        CDataClass.putData(data, "edtTimeTo", this.edtTimeTo.toData(), {}, true);
        CDataClass.putData(data, "edtTime", this.edtTime.toData(), {}, true);
        CDataClass.putData(data, "btnTimeApply", this.btnTimeApply.toData(), {}, true);
        CDataClass.putData(data, "btnTimeLeft", this.btnTimeLeft.toData(), {}, true);
        CDataClass.putData(data, "btnTimeRight", this.btnTimeRight.toData(), {}, true);
        CDataClass.putData(data, "scrollTime", this.scrollTime.toData(), {}, true);
        CDataClass.putData(data, "timeline", this.timeline.toData(), {}, true);
        CDataClass.putData(data, "btnPropertyUp", this.btnPropertyUp.toData(), {}, true);
        CDataClass.putData(data, "btnPropertyDown", this.btnPropertyDown.toData(), {}, true);
        CDataClass.putData(data, "btnDeleteProperty", this.btnDeleteProperty.toData(), {}, true);
        CDataClass.putData(data, "btnApply", this.btnApply.toData(), {}, true);
        CDataClass.putData(data, "btnAnimationSpeedGraph", this.btnAnimationSpeedGraph.toData(), {}, true);
        CDataClass.putData(data, "btnStart", this.btnStart.toData(), {}, true);
        CDataClass.putData(data, "edtDuration", this.edtDuration.toData(), {}, true);
        CDataClass.putData(data, "lblDuration", this.lblDuration.toData(), {}, true);
        CDataClass.putData(data, "lCBottom", this.lCBottom.toData(), {}, true);
        CDataClass.putData(data, "btnGraphEdit", this.btnGraphEdit.toData(), {}, true);
        CDataClass.putData(data, "btnPositionEdit", this.btnPositionEdit.toData(), {}, true);
        CDataClass.putData(data, "btnObjectsEdit", this.btnObjectsEdit.toData(), {}, true);
        CDataClass.putData(data, "lBTop2", this.lBTop2.toData(), {}, true);
        CDataClass.putData(data, "lblTag", this.lblTag.toData(), {}, true);
        CDataClass.putData(data, "btnTagAdd", this.btnTagAdd.toData(), {}, true);
        CDataClass.putData(data, "btnTagDelete", this.btnTagDelete.toData(), {}, true);
        CDataClass.putData(data, "lblObject", this.lblObject.toData(), {}, true);
        CDataClass.putData(data, "btnObjectDataAdd", this.btnObjectDataAdd.toData(), {}, true);
        CDataClass.putData(data, "btnObjectDataDelete", this.btnObjectDataDelete.toData(), {}, true);
        CDataClass.putData(data, "btnObjectCopy", this.btnObjectCopy.toData(), {}, true);
        CDataClass.putData(data, "btnObjectPaste", this.btnObjectPaste.toData(), {}, true);
        CDataClass.putData(data, "btnObjectTransformer", this.btnObjectTransformer.toData(), {}, true);
        CDataClass.putData(data, "pathEditor", this.pathEditor.toData(), {}, true);
        CDataClass.putData(data, "pathEditorToolbar", this.pathEditorToolbar.toData(), {}, true);
        CDataClass.putData(data, "btnNone", this.btnNone.toData(), {}, true);
        CDataClass.putData(data, "btnMoveTo", this.btnMoveTo.toData(), {}, true);
        CDataClass.putData(data, "btnLineTo", this.btnLineTo.toData(), {}, true);
        CDataClass.putData(data, "btnCurveTo", this.btnCurveTo.toData(), {}, true);
        CDataClass.putData(data, "btnApplyPosition", this.btnApplyPosition.toData(), {}, true);
        CDataClass.putData(data, "btnToolbarClose", this.btnToolbarClose.toData(), {}, true);
        CDataClass.putData(data, "properties", this.properties.toData(), {}, true);
        CDataClass.putData(data, "lTimelineScriptTop", this.lTimelineScriptTop.toData(), {}, true);
        CDataClass.putData(data, "btnTimelineScriptApply", this.btnTimelineScriptApply.toData(), {}, true);
        CDataClass.putData(data, "txtTimelineScript", this.txtTimelineScript.toData(), {}, true);
        CDataClass.putData(data, "objectsToolPosition", this.objectsTool.position.toData(), {}, true);
        CDataClass.putData(data, "propertyToolPosition", this.propertyTool.position.toData(), {}, true);
        CDataClass.putData(data, "timeAnimationToolPosition", this.timeAnimationTool.position.toData(), {}, true);
        CDataClass.putData(data, "timelineScriptToolPosition", this.timelineScriptTool.position.toData(), {}, true);
    }
    doFromData(data) {
        super.doFromData(data);
        this.toolbar.fromData(CDataClass.getData(data, "toolbar", {}, true));
        this.btnSave.fromData(CDataClass.getData(data, "btnSave", {}, true));
        this.btnOpen.fromData(CDataClass.getData(data, "btnOpen", {}, true));
        this.lblWidth.fromData(CDataClass.getData(data, "lblWidth", {}, true));
        this.edtWidth.fromData(CDataClass.getData(data, "edtWidth", {}, true));
        this.lblHeight.fromData(CDataClass.getData(data, "lblHeight", {}, true));
        this.edtHeight.fromData(CDataClass.getData(data, "edtHeight", {}, true));
        this.btnSize.fromData(CDataClass.getData(data, "btnSize", {}, true));
        this.btnExport.fromData(CDataClass.getData(data, "btnExport", {}, true));
        this.lLTop.fromData(CDataClass.getData(data, "lLTop", {}, true));
        this.lClient.fromData(CDataClass.getData(data, "lClient", {}, true));
        this.lBTop.fromData(CDataClass.getData(data, "lBTop", {}, true));
        this.list.fromData(CDataClass.getData(data, "list", {}, true));
        this.btnAddObject.fromData(CDataClass.getData(data, "btnAddObject", {}, true));
        this.btnDeleteObject.fromData(CDataClass.getData(data, "btnDeleteObject", {}, true));
        this.btnAddProperty.fromData(CDataClass.getData(data, "btnAddProperty", {}, true));
        this.controlResizer.fromData(CDataClass.getData(data, "controlResizer", {}, true));
        this.lBTopTime.fromData(CDataClass.getData(data, "lBTopTime", {}, true));
        this.edtTimeFrom.fromData(CDataClass.getData(data, "edtTimeFrom", {}, true));
        this.edtTimeTo.fromData(CDataClass.getData(data, "edtTimeTo", {}, true));
        this.btnTimeApply.fromData(CDataClass.getData(data, "btnTimeApply", {}, true));
        this.btnTimeLeft.fromData(CDataClass.getData(data, "btnTimeLeft", {}, true));
        this.btnTimeRight.fromData(CDataClass.getData(data, "btnTimeRight", {}, true));
        this.edtTime.fromData(CDataClass.getData(data, "edtTime", {}, true));
        this.scrollTime.fromData(CDataClass.getData(data, "scrollTime", {}, true));
        this.timeline.fromData(CDataClass.getData(data, "timeline", {}, true));
        this.btnPropertyUp.fromData(CDataClass.getData(data, "btnPropertyUp", {}, true));
        this.btnPropertyDown.fromData(CDataClass.getData(data, "btnPropertyDown", {}, true));
        this.btnDeleteProperty.fromData(CDataClass.getData(data, "btnDeleteProperty", {}, true));
        this.btnApply.fromData(CDataClass.getData(data, "btnApply", {}, true));
        this.btnStart.fromData(CDataClass.getData(data, "btnStart", {}, true));
        this.btnAnimationSpeedGraph.fromData(CDataClass.getData(data, "btnAnimationSpeedGraph", {}, true));
        this.edtDuration.fromData(CDataClass.getData(data, "edtDuration", {}, true));
        this.lblDuration.fromData(CDataClass.getData(data, "lblDuration", {}, true));
        this.lCBottom.fromData(CDataClass.getData(data, "lCBottom", {}, true));
        this.btnGraphEdit.fromData(CDataClass.getData(data, "btnGraphEdit", {}, true));
        this.btnPositionEdit.fromData(CDataClass.getData(data, "btnPositionEdit", {}, true));
        this.btnObjectsEdit.fromData(CDataClass.getData(data, "btnObjectsEdit", {}, true));
        this.lBTop2.fromData(CDataClass.getData(data, "lBTop2", {}, true));
        this.lblTag.fromData(CDataClass.getData(data, "lblTag", {}, true));
        this.btnTagAdd.fromData(CDataClass.getData(data, "btnTagAdd", {}, true));
        this.btnTagDelete.fromData(CDataClass.getData(data, "btnTagDelete", {}, true));
        this.lblObject.fromData(CDataClass.getData(data, "lblObject", {}, true));
        this.btnObjectDataAdd.fromData(CDataClass.getData(data, "btnObjectDataAdd", {}, true));
        this.btnObjectDataDelete.fromData(CDataClass.getData(data, "btnObjectDataDelete", {}, true));
        this.btnObjectCopy.fromData(CDataClass.getData(data, "btnObjectCopy", {}, true));
        this.btnObjectPaste.fromData(CDataClass.getData(data, "btnObjectPaste", {}, true));
        this.btnObjectTransformer.fromData(CDataClass.getData(data, "btnObjectTransformer", {}, true));
        this.pathEditor.fromData(CDataClass.getData(data, "pathEditor", {}, true));
        this.pathEditorToolbar.fromData(CDataClass.getData(data, "pathEditorToolbar", {}, true));
        this.btnNone.fromData(CDataClass.getData(data, "btnNone", {}, true));
        this.btnMoveTo.fromData(CDataClass.getData(data, "btnMoveTo", {}, true));
        this.btnLineTo.fromData(CDataClass.getData(data, "btnLineTo", {}, true));
        this.btnCurveTo.fromData(CDataClass.getData(data, "btnCurveTo", {}, true));
        this.btnApplyPosition.fromData(CDataClass.getData(data, "btnApplyPosition", {}, true));
        this.btnToolbarClose.fromData(CDataClass.getData(data, "btnToolbarClose", {}, true));
        this.properties.fromData(CDataClass.getData(data, "properties", {}, true));
        this.lTimelineScriptTop.fromData(CDataClass.getData(data, "lTimelineScriptTop", {}, true));
        this.btnTimelineScriptApply.fromData(CDataClass.getData(data, "btnTimelineScriptApply", {}, true));
        this.txtTimelineScript.fromData(CDataClass.getData(data, "txtTimelineScript", {}, true));
        this.objectsTool.position.fromData(CDataClass.getData(data, "objectsToolPosition", {}, true));
        this.propertyTool.position.fromData(CDataClass.getData(data, "propertyToolPosition", {}, true));
        this.timeAnimationTool.position.fromData(CDataClass.getData(data, "timeAnimationToolPosition", {}, true));
        this.timelineScriptTool.position.fromData(CDataClass.getData(data, "timelineScriptToolPosition", {}, true));
        this.properties.tabButtons.visible = false;
    }
    doRemove() {
        this.frmGraph.remove();
        this.objectsTool.remove();
        this.propertyTool.remove();
        this.timeAnimationTool.remove();
        this.timelineScriptTool.remove();
        this.startData.remove();
        super.doRemove();
    }
    doSetAnimation() {
    }
    doAnimationSpeedGraphEdit() {
        let self = this;
        let frm = new CTimeSpeedGraphEditor(CSystem.desktopList.get(0).applicationLayer);
        frm.showCenter(860, 550, "Time speed editor", "remove");
        frm.editor.btnApply.onClick = async function () {
            let data = await frm.editor.getGraphData();
            if (typeof data == "string") {
                CSystem.showMessage("Error", data);
            }
            else {
                self.con.sceneData.speedGraphData = data;
                self.con.sceneData.speedStartValue = parseFloat(frm.editor.edtStartSpeed.text);
                self.con.sceneData.speedStopValue = parseFloat(frm.editor.edtStopSpeed.text);
            }
        };
    }
    doSetStart() {
        this.doSetTime(0);
    }
    doSetTime(duration) {
        let ani = this.getSceneAnimation();
        ani.doBeforeStart();
        ani.moveTime(duration);
        ani.remove();
    }
    async doSetSectionPosition() {
        if (this.pathEditor.pathPointList != undefined) {
            let rt = CAssembly.getBezierPoints(this.pathEditor.pathPointList, 10);
            if (typeof rt == "string") {
                CSystem.showMessage("Error", rt);
            }
            else {
                let sec = this.getSelectedSection();
                if (sec == undefined) {
                    CSystem.showMessage("Warning", "Select section");
                }
                else {
                    sec.positionPath.fromData(this.pathEditor.pathPointList?.toData());
                    sec.positionPath.movePoint(-(this.controlResizer.position.left + 10), -(this.controlResizer.position.top + 20));
                    for (let n = 0; n < rt.length; n++) {
                        rt[n].x -= this.controlResizer.position.left + 10;
                        rt[n].y -= this.controlResizer.position.top + 20;
                        rt[n].x *= this.con.orgPosition.width / this.con.position.width;
                        rt[n].y *= this.con.orgPosition.height / this.con.position.height;
                    }
                    sec.positionPoints = rt;
                    this.refreshGrid();
                }
            }
        }
    }
    doAddSection() {
        if (this.list.selectItems.length > 0) {
            let self = this;
            CSystem.prompt("Add section animation", ["Property name", "StartTime(ms)", "Duration", "Graph", "StartValue", "StopValue", "Loop"], CSystem.browserCovers.get("cover"), function (arr) {
                let as = new CAnimationControlSceneSection();
                as.control = self.list.selectItems[0].value.asObject["control"];
                as.controlName = self.list.selectItems[0].value.asObject["text"];
                if (arr[0] == "") {
                    as.property = "Unknown";
                }
                else {
                    as.property = arr[0];
                }
                as.startTime = parseInt(arr[1]);
                as.duration = parseInt(arr[2]);
                as.graphData = arr[3];
                as.startValue = parseFloat(arr[4]);
                as.stopValue = parseFloat(arr[5]);
                as.isLoop = arr[6].toUpperCase() == "Y";
                self.con.sceneData.sections.add(as);
                self.refreshGrid();
            }, ["", "0", "200", "line_10000.graph", "0", "0", "N"], 400);
        }
    }
    doDeleteSection() {
        if (this.timeline.row != -1) {
            for (let n = 0; n < this.con.sceneData.sections.length; n++) {
                if (this.con.sceneData.sections.get(n).control == this.timeline.cell(9, this.timeline.row) &&
                    this.con.sceneData.sections.get(n).property == this.timeline.cell(1, this.timeline.row)) {
                    this.con.sceneData.sections.delete(n);
                    break;
                }
            }
            this.refreshGrid();
        }
    }
    doTimeLineKeyDown(e) {
        if (e.ctrlKey && e.key.toUpperCase() == "C") {
            if (this.timeline.column == 5) {
                let o = {
                    positionPoints: JSON.stringify(this.con.sceneData.sections.get(this.timeline.row).positionPoints),
                    positionPath: this.con.sceneData.sections.get(this.timeline.row).positionPath.toData(),
                    graphData: this.con.sceneData.sections.get(this.timeline.row).graphDataCopy(),
                    graphPath: this.con.sceneData.sections.get(this.timeline.row).graphPath.toData(),
                    tags: this.con.sceneData.sections.get(this.timeline.row).timeTagCopy()
                };
                CSystem.copyData = o;
            }
        }
        if (e.ctrlKey && e.key.toUpperCase() == "V") {
            if (this.timeline.column == 5) {
                this.con.sceneData.sections.get(this.timeline.row).positionPoints = JSON.parse(CSystem.copyData.positionPoints);
                this.con.sceneData.sections.get(this.timeline.row).positionPath.fromData(CSystem.copyData.positionPath);
                this.con.sceneData.sections.get(this.timeline.row).graphDataFromData(CSystem.copyData.graphData);
                this.con.sceneData.sections.get(this.timeline.row).graphPath.fromData(CSystem.copyData.graphPath);
                this.con.sceneData.sections.get(this.timeline.row).timeTagFromData(CSystem.copyData.tags);
                this.refreshGrid();
            }
        }
    }
    async doGraphEditorShow(isTag = false) {
        this.frmGraph.showCenter(860, 550, "Graph editor", "hide");
        this.fraGraph.tagItem.pathData.clear();
        let sec = this.getSelectedSection();
        if (sec != undefined) {
            this.fraGraph.item.pathData.fromData(sec.graphPath.toData());
            this.fraGraph.refresh();
            if (isTag) {
                for (let n = 0; n < sec.timeTag.length; n++) {
                    let x = CCalc.crRange2Value(sec.startTime, sec.startTime + sec.duration, sec.timeTag[n].duration, 0, this.fraGraph.pathGraphic.position.width);
                    let y = CCalc.crRange2Value(sec.startTime, sec.startTime + sec.duration, sec.timeTag[n].duration, 0, this.fraGraph.pathGraphic.position.height);
                    this.fraGraph.tagItem.pathData.addPointMoveTo(new CPoint(x, 0));
                    this.fraGraph.tagItem.pathData.addPointLineTo(new CPoint(x, this.fraGraph.pathGraphic.position.height));
                    this.fraGraph.tagItem.pathData.addPointMoveTo(new CPoint(0, this.fraGraph.pathGraphic.position.height - y));
                    this.fraGraph.tagItem.pathData.addPointLineTo(new CPoint(this.fraGraph.pathGraphic.position.width, this.fraGraph.pathGraphic.position.height - y));
                }
                this.fraGraph.pathGraphic.draw();
            }
        }
    }
    doPositionEdit() {
        if (this.pathEditor.visible) {
            this.pathEditor.visible = false;
        }
        else {
            this.pathEditor.visible = true;
            this.pathEditor.bringToFront();
            this.pathEditor.pathPointList = this.pathEditor.layers.get(0).items.get(1).pathData;
            this.pathEditor.pathPointList.clear();
            let sec = this.getSelectedSection();
            if (sec != undefined) {
                if (sec.positionPoints.length > 0 && this.pathEditor.pathPointList != undefined) {
                    this.pathEditor.pathPointList.fromData(sec.positionPath.toData());
                    this.pathEditor.pathPointList.movePoint(this.controlResizer.position.left + 10, this.controlResizer.position.top + 20);
                }
            }
            this.pathEditor.refresh();
        }
    }
    doObjectsEdit() {
        if (this.objectPanel != undefined) {
            this.objectPanel.remove();
            this.objectPanel = undefined;
        }
        else {
            this.showObjectPanel();
        }
    }
    doChangeTimeLineItem(col, row) {
        let sec = this.getSelectedSection();
        if (sec != undefined) {
            if (sec.positionPoints.length > 0) {
                this.pathEditor.visible = true;
                this.pathEditor.bringToFront();
                this.pathEditor.pathPointList = this.pathEditor.layers.get(0).items.get(1).pathData;
                this.pathEditor.pathPointList.clear();
                this.pathEditor.pathPointList.fromData(sec.positionPath.toData());
                this.pathEditor.pathPointList.movePoint(this.controlResizer.position.left + 10, this.controlResizer.position.top + 20);
                this.pathEditor.refresh();
            }
            else {
                this.pathEditor.visible = false;
            }
            if (sec.objectData.length > 0) {
                this.showObjectPanel();
            }
            else {
                if (this.objectPanel != undefined) {
                    this.objectPanel.remove();
                }
                this.objectPanel = undefined;
            }
            this.txtTimelineScript.text = sec.script;
        }
    }
    doSelectItem() {
        if (this.list.selectItems.length > 0) {
            this.properties.clear();
            this.properties.addInstance(this.list.selectItems[0].value.asObject["control"]);
        }
    }
    doShowTransformer() {
        if (this.objectPanel != undefined) {
            let con = this.properties.propertyEditors.get(0).classInstance;
            this.transformer.parent = this.lClient;
            this.transformer.visible = true;
            this.transformer.toolbar.position.align = EPositionAlign.BOTTOM;
            this.transformer.toolbar.position.margins.all = 0;
            this.transformer.bringToFront();
            this.transformer.setControl(con);
        }
    }
    doTransform() {
        if (this.list.selectItems.length > 0) {
            let con = this.list.selectItems[0].value.asObject["control"];
            con.orgPathdataSet();
            con.orgPosition.fromData(con.position.toData());
        }
    }
    doTimeLineEdit(col, row, property, text) {
        for (let n = 0; n < this.con.sceneData.sections.length; n++) {
            if (this.con.sceneData.sections.get(n).control == this.timeline.cell(9, this.timeline.row) && this.con.sceneData.sections.get(n).property == property) {
                if (col == 1) {
                    this.con.sceneData.sections.get(n).property = text;
                }
                if (col == 2) {
                    this.con.sceneData.sections.get(n).startTime = parseInt(text);
                }
                if (col == 3) {
                    this.con.sceneData.sections.get(n).duration = parseInt(text);
                }
                if (col == 4) {
                    this.con.sceneData.sections.get(n).graphData = text;
                }
                if (col == 6) {
                    this.con.sceneData.sections.get(n).startValue = parseFloat(text);
                }
                if (col == 7) {
                    this.con.sceneData.sections.get(n).stopValue = parseFloat(text);
                }
                if (col == 8) {
                    this.con.sceneData.sections.get(n).isLoop = text.toUpperCase() == "Y";
                }
                break;
            }
        }
        this.refreshGrid();
    }
    doScene() {
        this.doSetStart();
        let ani = this.getSceneAnimation();
        ani.onFinish = function () {
            ani.remove();
        };
        ani.start();
    }
    doAddTag() {
        let sec = this.getSelectedSection();
        if (sec != undefined) {
            let s = sec;
            let self = this;
            CSystem.prompt("Add tag", ["Tab name", "Color", "duration"], CSystem.browserCovers.get("cover"), function (arr) {
                s.timeTag.push({ tagName: arr[0], tagColor: arr[1], duration: parseInt(arr[2]) });
            }, ["tag", "rgba(255,255,0,1)", self.edtTime.text]);
        }
    }
    doTagDelete() {
        let sec = this.getSelectedSection();
        if (sec != undefined) {
            sec.timeTag = [];
        }
    }
    doObjectAdd() {
        let d = parseInt(this.edtTime.text);
        let sec = this.getSelectedSection();
        if (sec != undefined && d >= sec.startTime && d <= sec.startTime + sec.duration && sec.control != undefined) {
            if (this.objectPanel == undefined)
                this.showObjectPanel();
            let rt = CCalc.crRange2Value(sec.startTime, sec.startTime + sec.duration, d, 0, 1);
            let con = this.startData.getObject(sec.control.propertyName)?.copyTo();
            if (con != undefined) {
                con.parent = this.objectPanel;
                con.position.left += this.controlResizer.position.left + 10;
                con.position.top += this.controlResizer.position.top + 20;
                con["sectionT"] = rt;
                con["centerX"] = sec.control.position.left + (sec.control.transform.rotationPointX * sec.control.position.width);
                con["centerY"] = sec.control.position.top + (sec.control.transform.rotationPointY * sec.control.position.height);
                let self = this;
                self.properties.clear();
                self.properties.addInstance(con);
                if (sec.positionPoints.length > 0) {
                    con.onClick = function () {
                        self.properties.clear();
                        self.properties.addInstance(con);
                        if (con != undefined) {
                            let cx = con["centerX"] + self.controlResizer.position.left + 10;
                            let cy = con["centerY"] + self.controlResizer.position.top + 20;
                            con.position.left = cx - (con.transform.rotationPointX * con.position.width);
                            con.position.top = cy - (con.transform.rotationPointY * con.position.height);
                        }
                    };
                    con.click();
                }
                else {
                    con.onClick = function () {
                        self.properties.clear();
                        self.properties.addInstance(con);
                    };
                    con.useMove = true;
                    con.useMoveClick = true;
                }
            }
        }
        else {
            alert("Invalid duration");
        }
    }
    doObjectCopy() {
        if (this.properties.propertyEditors.get(0).classInstance instanceof CAnimationControl) {
            let sel = this.properties.propertyEditors.get(0).classInstance;
            if (this.copyObject != undefined)
                this.copyObject.remove();
            this.copyObject = sel.copyTo();
        }
    }
    doObjectPaste() {
        if (this.copyObject != undefined) {
            let d = parseInt(this.edtTime.text);
            let sec = this.getSelectedSection();
            if (sec != undefined && d >= sec.startTime && d <= sec.startTime + sec.duration && sec.control != undefined) {
                if (this.objectPanel == undefined)
                    this.showObjectPanel();
                let rt = CCalc.crRange2Value(sec.startTime, sec.startTime + sec.duration, d, 0, 1);
                let con = this.copyObject.copyTo();
                if (con != undefined) {
                    con.parent = this.objectPanel;
                    con.position.left += this.controlResizer.position.left + 10;
                    con.position.top += this.controlResizer.position.top + 20;
                    con["sectionT"] = rt;
                    con["centerX"] = sec.control.position.left + (sec.control.transform.rotationPointX * sec.control.position.width);
                    con["centerY"] = sec.control.position.top + (sec.control.transform.rotationPointY * sec.control.position.height);
                    let self = this;
                    self.properties.clear();
                    self.properties.addInstance(con);
                    con.onClick = function () {
                        self.properties.clear();
                        self.properties.addInstance(con);
                        if (con != undefined) {
                            let cx = con["centerX"] + self.controlResizer.position.left + 10;
                            let cy = con["centerY"] + self.controlResizer.position.top + 20;
                            con.position.left = cx - (con.transform.rotationPointX * con.position.width);
                            con.position.top = cy - (con.transform.rotationPointY * con.position.height);
                        }
                    };
                    con.onDoubleClick = function () {
                        if (self.objectPanel != undefined) {
                            self.objectPanel.setSection();
                        }
                    };
                }
            }
            else {
                alert("에러");
            }
        }
    }
    doObjectDelete() {
        let sel = this.properties.propertyEditors.get(0).classInstance;
        if (sel != undefined && this.objectPanel != undefined) {
            let cons = CSystem.getChildControls(this.objectPanel);
            for (let n = 0; n < cons.length; n++) {
                if (cons[n] instanceof CAnimationControl) {
                    if (cons[n] == sel) {
                        cons[n].remove();
                        this.properties.clear();
                    }
                }
            }
        }
    }
    doPropertyUp() {
        if (this.timeline.row > 0) {
            let r = this.timeline.row;
            this.con.sceneData.sections.swap(this.timeline.row, this.timeline.row - 1);
            this.refreshGrid();
            this.timeline.row = r - 1;
        }
    }
    doPropertyDown() {
        if (this.timeline.row != -1 && this.timeline.row < this.timeline.length - 1) {
            let r = this.timeline.row;
            this.con.sceneData.sections.swap(this.timeline.row, this.timeline.row + 1);
            this.refreshGrid();
            this.timeline.row = r + 1;
        }
    }
    refresh() {
        this.list.clear();
        function a(c, items) {
            let itl = items.addItem({ text: c.propertyName, control: c });
            for (let n = 0; n < c.objects.length; n++) {
                a(c.objects.get(n), itl.items);
            }
        }
        a(this.con, this.list.items);
        this.list.items.expandAll();
    }
    refreshGrid() {
        this.timeline.clear();
        for (let n = 0; n < this.con.sceneData.sections.length; n++) {
            let sd = this.con.sceneData.sections.get(n);
            let sda = "N";
            let gd = this.con.sceneData.sections.get(n).graphData;
            let gt = "";
            if (typeof gd == "string") {
                gt = gd;
            }
            else {
                gt = "Y";
            }
            let lp = "N";
            if (this.con.sceneData.sections.get(n).isLoop)
                lp = "Y";
            if (sd.positionPoints.length > 0)
                sda = "Y";
            this.timeline.add([
                this.con.sceneData.sections.get(n).controlName + "(" + this.con.sceneData.sections.get(n).objectData.length + ")",
                this.con.sceneData.sections.get(n).property,
                this.con.sceneData.sections.get(n).startTime,
                this.con.sceneData.sections.get(n).duration,
                gt,
                sda,
                this.con.sceneData.sections.get(n).startValue,
                this.con.sceneData.sections.get(n).stopValue,
                lp,
                this.con.sceneData.sections.get(n).control
            ]);
        }
    }
    getSceneAnimation() {
        let ani = new CSceneAnimator();
        ani.duration = parseInt(this.edtDuration.text);
        ani.animationControl = this.con;
        ani.timeSpeedGraphData = this.con.sceneData.speedGraphData;
        ani.startTimeSpeed = this.con.sceneData.speedStartValue;
        ani.stopTimeSpeed = this.con.sceneData.speedStopValue;
        return ani;
    }
    scene() {
        this.doScene();
    }
    getSelectedSection() {
        for (let n = 0; n < this.con.sceneData.sections.length; n++) {
            if (this.con.sceneData.sections.get(n).control == this.timeline.cell(9, this.timeline.row) && this.con.sceneData.sections.get(n).property == this.timeline.cell(1, this.timeline.row)) {
                return this.con.sceneData.sections.get(n);
            }
        }
    }
    loopObjects(proc) {
        if (this.list.selectItems.length > 0) {
            let con = this.list.selectItems[0].value.asObject["control"];
            function l(obj) {
                proc(obj);
                for (let n = 0; n < obj.objects.length; n++) {
                    l(obj.objects.get(n));
                }
            }
            l(con);
        }
    }
    showObjectPanel() {
        let sec = this.getSelectedSection();
        if (sec != undefined) {
            if (this.objectPanel != undefined) {
                this.objectPanel.remove();
            }
            let pan = new CObjectPanel(this.lClient);
            pan.editor = this;
            pan.setObjects(sec);
            pan.bringToFront();
            this.objectPanel = pan;
        }
    }
}
class CAnimationControlSceneEditor extends CAnimationControlSceneEditorModel {
    constructor(parent, name) {
        super(parent, name);
        this.resource = "sceneEditor.frame";
    }
}
class CVideoFrame extends CAnimationControlSceneEditor {
    get videoSrc() {
        return this._videoSrc;
    }
    set videoSrc(value) {
        if (this._videoSrc != value) {
            this._videoSrc = value;
            this.doChangeVideoSrc();
        }
    }
    constructor(parent, name) {
        super(parent, name);
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d");
        this._videoSrc = "";
        let self = this;
        let tool = new CPanel(this);
        tool.position.align = EPositionAlign.TOP;
        tool.position.height = 25;
        let item = tool.layers.addLayer().items.addItem();
        item.fill.styleKind = EStyleKind.SOLID;
        item.fill.solidColor = "#101010";
        let txt = new CTextBox(tool);
        txt.resource = "textbox24.control";
        txt.position.align = EPositionAlign.LEFT;
        txt.onKeyDown = function (s, e) {
            if (e.key == "Enter") {
                self.videoSrc = txt.text;
            }
        };
        txt.text = "/scripts/exvideo.mp4";
        let button = new CButton(tool);
        button.resource = "button_gray_gra.control";
        button.position.align = EPositionAlign.RIGHT;
        button.useAutoSize = true;
        button.text = "Record";
        button.onClick = async function () {
        };
        this.video = new CVideoControl(this.controlResizer);
        this.video.position.align = EPositionAlign.CLIENT;
        this.video.hasPointerEvent = false;
        this.video.sendToBack();
        this.video.onTimeUpdate = function (s, t) {
            self.video.jumpTime(3, 0);
        };
    }
    doSetTime(duration) {
        super.doSetTime(duration);
        this.video.currentTime = duration / 1000;
    }
    doScene() {
        super.doScene();
        this.video.play();
    }
    doChangeVideoSrc() {
        let self = this;
        this.video.onLoadedMetaData = function () {
            self.edtTimeTo.text = Math.floor(self.video.duration * 1000) + "";
            self.btnTimeApply.click();
        };
        this.video.src = this._videoSrc;
    }
}
class CEmptyCanvasForm extends CWindowApplication {
    constructor() {
        super();
        this.defaultWidth = 600;
        this.defaultHeight = 400;
        this.appName = "Canvas";
        this.canvasControl = new CEmptyCanvasControl(this.mainWindow.body);
        this.canvasControl.position.align = EPositionAlign.CLIENT;
    }
}
class CAppLayersSceneEditor extends CWindowApplication {
    constructor() {
        super();
        this.defaultWidth = 616;
        this.defaultHeight = 539;
        this.appName = "Animation control scene editor";
        this.editor = new CAnimationControlSceneEditor(this.mainWindow.body);
        this.editor.position.align = EPositionAlign.CLIENT;
    }
}
class CSubtitleEditor extends CWindowApplication {
    constructor() {
        super();
        this.defaultWidth = 616;
        this.defaultHeight = 539;
        this.appName = "Animation control scene editor";
        this.editor = new CVideoFrame(this.mainWindow.body);
        this.editor.position.align = EPositionAlign.CLIENT;
    }
}
class CSceneExampleFrame extends CPanel {
    constructor(parent, name) {
        super(parent, name);
        this.lTop = new CPanel(this);
        this.btnPlay = new CButton(this.lTop);
        this.lClient = new CPanel(this);
        this.con = new CAnimationControl(this.lClient);
        let self = this;
        this.btnPlay.onClick = function () {
            self.doPlay();
        };
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "lTop", this.lTop.toData(), {}, true);
        CDataClass.putData(data, "btnPlay", this.btnPlay.toData(), {}, true);
        CDataClass.putData(data, "lClient", this.lClient.toData(), {}, true);
    }
    doFromData(data) {
        super.doFromData(data);
        this.lTop.fromData(CDataClass.getData(data, "lTop", {}, true));
        this.btnPlay.fromData(CDataClass.getData(data, "btnPlay", {}, true));
        this.lClient.fromData(CDataClass.getData(data, "lClient", {}, true));
    }
    doPlay() {
        this.btnPlay.enabled = false;
        this.startPosition();
        let ani = this.con.getSceneAnimation();
        let self = this;
        ani.onFinish = function () {
            self.btnPlay.enabled = true;
            ani.remove();
        };
        ani.start();
    }
    startPosition() {
        let an = this.con.getSceneAnimation();
        an.doBeforeStart();
        an.moveTime(0);
        an.remove();
    }
}
class CSceneExample extends CWindowApplication {
    constructor() {
        super();
        this.defaultWidth = 516;
        this.defaultHeight = 566;
        this.appName = "Animation control example";
        this.editor = new CSceneExampleFrame(this.mainWindow.body);
        this.editor.resource = "sceneExample.frame";
        this.editor.position.align = EPositionAlign.CLIENT;
    }
}
CSystem.onResourceLoad.push(function () {
    fetchBody("https://baekjonggyu.github.io/resource/night2.scene")
        .then(function (json) {
        CSystem.resources.set("night2.scene", JSON.parse(json));
        let tm = new CTimeChecker();
        tm.startChecker();
        let ex = new CSceneExample();
        ex.desktop = CSystem.desktopList.get(0);
        ex.execute();
        let rc = CSystem.resources.get("night2.scene");
        ex.editor.con.fromData(rc.control);
        ex.editor.con.position.align = EPositionAlign.CLIENT;
        ex.editor.startPosition();
        ex.mainWindow.position.left = 1062;
        ex.mainWindow.position.top = 30;
    });
    setTimeout(() => {
        fetchBody("https://baekjonggyu.github.io/resource/night.scene")
            .then(function (json) {
            CSystem.resources.set("night.scene", JSON.parse(json));
            let tm = new CTimeChecker();
            tm.startChecker();
            let ex = new CSceneExample();
            ex.desktop = CSystem.desktopList.get(0);
            ex.execute();
            let rc = CSystem.resources.get("night.scene");
            ex.editor.con.fromData(rc.control);
            ex.editor.con.sceneData.duration = 30000;
            ex.mainWindow.position.left = 25;
            ex.mainWindow.position.top = 211;
            ex.mainWindow.position.width = 1016;
            ex.mainWindow.position.height = 628;
        });
    }, 100);
});
