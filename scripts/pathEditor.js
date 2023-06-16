"use strict";
class CPathEditorModel extends CPanel {
    get item() {
        return this.__item;
    }
    get pointResource() {
        return this._pointResource;
    }
    set pointResource(value) {
        if (this._pointResource != value) {
            this._pointResource = value;
            for (let n = 0; n < this.__points.length; n++) {
                this.__points.get(n).point.resource = value;
            }
        }
    }
    get cpoint1Resource() {
        return this._cpoint1Resource;
    }
    set cpoint1Resource(value) {
        if (this._cpoint1Resource != value) {
            this._cpoint1Resource = value;
            for (let n = 0; n < this.__points.length; n++) {
                let h = this.__points.get(n).cpoint1;
                if (h != undefined)
                    h.resource = value;
            }
        }
    }
    get cpoint2Resource() {
        return this._cpoint2Resource;
    }
    set cpoint2Resource(value) {
        if (this._cpoint2Resource != value) {
            this._cpoint2Resource = value;
            for (let n = 0; n < this.__points.length; n++) {
                let h = this.__points.get(n).cpoint2;
                if (h != undefined)
                    h.resource = value;
            }
        }
    }
    constructor(parent, name) {
        super(parent, name);
        this.__points = new CList();
        this._pointResource = "";
        this._cpoint1Resource = "";
        this._cpoint2Resource = "";
        this.toolbar = new CPanel(this);
        this.lblKind = new CPanel(this.toolbar);
        this.btnNone = new CButton(this.toolbar);
        this.btnMoveTo = new CButton(this.toolbar);
        this.btnLineTo = new CButton(this.toolbar);
        this.btnCurveTo = new CButton(this.toolbar);
        this.btnClose = new CButton(this.toolbar);
        this.btnSave = new CButton(this.toolbar);
        this.btnOpen = new CButton(this.toolbar);
        this.btnGetTextData = new CButton(this.toolbar);
        this.toolbarBottom = new CPanel(this);
        this.lblWidth = new CLabelTextBox(this.toolbarBottom);
        this.lblheight = new CLabelTextBox(this.toolbarBottom);
        this.btnSize = new CButton(this.toolbarBottom);
        this.chkAlignPixel = new CCheckBox(this.toolbarBottom);
        this.edtAlignPixel = new CTextBox(this.toolbarBottom);
        this.btnApply = new CButton(this.toolbarBottom);
        this.lRight = new CPanel(this);
        this.spr = new CSplitter(this);
        this.lRTop = new CPanel(this.lRight);
        this.btnDelete = new CButton(this.lRTop);
        this.btnClear = new CButton(this.lRTop);
        this.grid = new CDataGrid(this.lRight);
        this.lClient = new CPanel(this);
        this.lCTop = new CPanel(this.lClient);
        this.lCClient = new CPanel(this.lClient);
        this.path = new CPanel(this.lCClient);
        this.pathGraphic = new CSelectArea(this.path);
        let self = this;
        this.pathGraphic.position.align = EPositionAlign.CLIENT;
        let l = this.pathGraphic.layers.addLayer();
        this.__backItem = l.addItem();
        this.__backItem.kind = ECanvasItemKind.PATH;
        this.__backItem.stroke.styleKind = EStyleKind.SOLID;
        this.__backItem.stroke.solidColor = "#404040";
        this.__backItem.stroke.lineWidth = 1;
        this.__backItem.pathFitMode = EFitMode.ORIGINAL;
        this.__item = l.addItem();
        this.__item.kind = ECanvasItemKind.PATH;
        this.__item.fill.styleKind = EStyleKind.SOLID;
        this.__item.fill.solidColor = "rgba(255,255,255,0.05)";
        this.__item.stroke.styleKind = EStyleKind.SOLID;
        this.__item.stroke.solidColor = "#ffffff";
        this.__item.stroke.lineWidth = 1;
        this.__item.pathFitMode = EFitMode.ORIGINAL;
        this.btnSave.onClick = function () {
        };
        this.btnOpen.onClick = function () {
        };
        this.btnSize.onClick = function () {
            self.path.position.width = parseInt(self.lblWidth.value);
            self.path.position.height = parseInt(self.lblheight.value);
            self.__item.pathData.width = parseInt(self.lblWidth.value);
            self.__item.pathData.height = parseInt(self.lblheight.value);
        };
        this.btnNone.onClick = function () {
            self.lblKind.text = "None";
        };
        this.btnMoveTo.onClick = function () {
            self.lblKind.text = "MoveTo";
        };
        this.btnLineTo.onClick = function () {
            self.lblKind.text = "LineTo";
        };
        this.btnCurveTo.onClick = function () {
            self.lblKind.text = "CurveTo";
        };
        this.btnClose.onClick = function () {
            self.lblKind.text = "Close";
            let pt = self.__item.pathData.addPointClose();
            self.grid.add(["CL", CPoint.create(0, 0).toString(), CPoint.create(0, 0).toString(), CPoint.create(0, 0).toString(), pt]);
        };
        this.lblWidth.textBox.onKeyDown = function (s, e) {
            if (e.key == "Enter") {
                self.btnSize.click();
            }
        };
        this.lblheight.textBox.onKeyDown = function (s, e) {
            if (e.key == "Enter") {
                self.btnSize.click();
            }
        };
        let prePoint;
        this.pathGraphic.selectAreaResource = "selectAreaCursor.control";
        this.pathGraphic.usePointerCapture = true;
        this.pathGraphic.onThisPointerDown = function (s, e, poinst) {
            if (self.lblKind.text == "MoveTo") {
                let pt = CPoint.create(e.offsetX, e.offsetY);
                let ppt = self.__item.pathData.addPointMoveTo(pt);
                prePoint = pt;
                let row = self.grid.add(["M", pt.toString(), CPoint.create(0, 0).toString(), CPoint.create(0, 0).toString(), ppt]);
                ppt.onChange = function () {
                    if (row != undefined) {
                        row.get(1).asString = ppt.point.toString();
                    }
                };
                let selector = new CPathPointSelectorModel(self.pointResource, self.cpoint1Resource, self.cpoint2Resource);
                selector.parent = self.pathGraphic;
                selector.pathPoint = ppt;
                self.__points.add(selector);
            }
            if (self.lblKind.text == "LineTo") {
                let pt = CPoint.create(e.offsetX, e.offsetY);
                let ppt = self.__item.pathData.addPointLineTo(CPoint.create(e.offsetX, e.offsetY));
                prePoint = pt;
                let row = self.grid.add(["L", pt.toString(), CPoint.create(0, 0).toString(), CPoint.create(0, 0).toString(), ppt]);
                ppt.onChange = function () {
                    if (row != undefined) {
                        row.get(1).asString = ppt.point.toString();
                    }
                };
                let selector = new CPathPointSelectorModel(self.pointResource, self.cpoint1Resource, self.cpoint2Resource);
                selector.parent = self.pathGraphic;
                selector.pathPoint = ppt;
                self.__points.add(selector);
            }
            if (self.lblKind.text == "CurveTo") {
                let pt = CPoint.create(e.offsetX, e.offsetY);
                if (prePoint != undefined) {
                    let ds = CPoint.getDistancePoints(pt, prePoint);
                    let cpt1 = CPoint.getLineMiddlePoint(prePoint, pt, CCalc.crRange2Value(0, ds, ds / 3, 0, 1));
                    let cpt2 = CPoint.getLineMiddlePoint(prePoint, pt, CCalc.crRange2Value(0, ds, (ds / 3) * 2, 0, 1));
                    let ppt = self.__item.pathData.addPointCurveTo3(pt, cpt1, cpt2);
                    let row = self.grid.add(["C", pt.toString(), cpt1.toString(), cpt2.toString(), ppt]);
                    prePoint = pt;
                    let selector = new CPathPointSelectorModel(self.pointResource, self.cpoint1Resource, self.cpoint2Resource);
                    selector.parent = self.pathGraphic;
                    selector.pathPoint = ppt;
                    self.__points.add(selector);
                    ppt.onChange = function () {
                        if (row != undefined) {
                            row.get(1).asString = ppt.point.toString();
                            row.get(2).asString = ppt.cPoint1.toString();
                            row.get(3).asString = ppt.cPoint2.toString();
                        }
                    };
                }
            }
        };
        this.grid.onEditorApply = function (s, col, row, text) {
            let pt = self.grid.cell(4, row);
            if (pt != undefined) {
                let arr = text.split(",");
                if (col == 1) {
                    pt.point.x = parseFloat(arr[0]);
                    pt.point.y = parseFloat(arr[1]);
                    self.pathGraphic.draw();
                }
                if (col == 2) {
                    pt.cPoint1.x = parseFloat(arr[0]);
                    pt.cPoint1.y = parseFloat(arr[1]);
                    self.pathGraphic.draw();
                }
                if (col == 3) {
                    pt.cPoint2.x = parseFloat(arr[0]);
                    pt.cPoint2.y = parseFloat(arr[1]);
                    self.pathGraphic.draw();
                }
            }
            self.refreshPoints();
        };
        this.btnClear.onClick = function () {
            self.clear();
        };
        this.btnDelete.onClick = function () {
            if (self.grid.row != -1) {
                self.deletePoint(self.grid.cell(4, self.grid.row));
            }
        };
        this.chkAlignPixel.onChangeChecked = function () {
            self.setAlignPixel();
        };
        this.edtAlignPixel.onKeyDown = function (s, e) {
            if (e.key == "Enter") {
                self.setAlignPixel();
            }
        };
        this.btnApply.onClick = function () {
            if (self.pathData != undefined) {
                self.pathData.copyFrom(self.__item.pathData);
            }
        };
        this.btnGetTextData.onClick = async function () {
            let s = await fetchBody("http://localhost/resource/api/v1/textpath?text=BJK&size=50&bold=y");
            self.item.pathData.fromFontPathData(s);
            self.item.pathData.fit(new CRect(0, 0, 400, 400));
            self.refresh();
        };
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "toolbar", this.toolbar.toData(), {}, true);
        CDataClass.putData(data, "lblKind", this.lblKind.toData(), {}, true);
        CDataClass.putData(data, "btnNone", this.btnNone.toData(), {}, true);
        CDataClass.putData(data, "btnMoveTo", this.btnMoveTo.toData(), {}, true);
        CDataClass.putData(data, "btnLineTo", this.btnLineTo.toData(), {}, true);
        CDataClass.putData(data, "btnCurveTo", this.btnCurveTo.toData(), {}, true);
        CDataClass.putData(data, "btnClose", this.btnClose.toData(), {}, true);
        CDataClass.putData(data, "btnSave", this.btnSave.toData(), {}, true);
        CDataClass.putData(data, "btnOpen", this.btnOpen.toData(), {}, true);
        CDataClass.putData(data, "btnGetTextData", this.btnGetTextData.toData(), {}, true);
        CDataClass.putData(data, "toolbarBottom", this.toolbarBottom.toData(), {}, true);
        CDataClass.putData(data, "lblWidth", this.lblWidth.toData(), {}, true);
        CDataClass.putData(data, "lblheight", this.lblheight.toData(), {}, true);
        CDataClass.putData(data, "btnSize", this.btnSize.toData(), {}, true);
        CDataClass.putData(data, "chkAlignPixel", this.chkAlignPixel.toData(), {}, true);
        CDataClass.putData(data, "edtAlignPixel", this.edtAlignPixel.toData(), {}, true);
        CDataClass.putData(data, "btnApply", this.btnApply.toData(), {}, true);
        CDataClass.putData(data, "lRight", this.lRight.toData(), {}, true);
        CDataClass.putData(data, "spr", this.spr.toData(), {}, true);
        CDataClass.putData(data, "lRTop", this.lRTop.toData(), {}, true);
        CDataClass.putData(data, "btnDelete", this.btnDelete.toData(), {}, true);
        CDataClass.putData(data, "btnClear", this.btnClear.toData(), {}, true);
        CDataClass.putData(data, "grid", this.grid.toData(), {}, true);
        CDataClass.putData(data, "lClient", this.lClient.toData(), {}, true);
        CDataClass.putData(data, "lCTop", this.lCTop.toData(), {}, true);
        CDataClass.putData(data, "lCClient", this.lCClient.toData(), {}, true);
        CDataClass.putData(data, "path", this.path.toData(), {}, true);
        CDataClass.putData(data, "pointResource", this.pointResource, "");
        CDataClass.putData(data, "cpoint1Resource", this.cpoint1Resource, "");
        CDataClass.putData(data, "cpoint2Resource", this.cpoint2Resource, "");
    }
    doFromData(data) {
        super.doFromData(data);
        this.toolbar.fromData(CDataClass.getData(data, "toolbar", {}, true));
        this.lblKind.fromData(CDataClass.getData(data, "lblKind", {}, true));
        this.btnNone.fromData(CDataClass.getData(data, "btnNone", {}, true));
        this.btnMoveTo.fromData(CDataClass.getData(data, "btnMoveTo", {}, true));
        this.btnLineTo.fromData(CDataClass.getData(data, "btnLineTo", {}, true));
        this.btnCurveTo.fromData(CDataClass.getData(data, "btnCurveTo", {}, true));
        this.btnClose.fromData(CDataClass.getData(data, "btnClose", {}, true));
        this.btnSave.fromData(CDataClass.getData(data, "btnSave", {}, true));
        this.btnOpen.fromData(CDataClass.getData(data, "btnOpen", {}, true));
        this.btnGetTextData.fromData(CDataClass.getData(data, "btnGetTextData", {}, true));
        this.toolbarBottom.fromData(CDataClass.getData(data, "toolbarBottom", {}, true));
        this.lblWidth.fromData(CDataClass.getData(data, "lblWidth", {}, true));
        this.lblheight.fromData(CDataClass.getData(data, "lblheight", {}, true));
        this.btnSize.fromData(CDataClass.getData(data, "btnSize", {}, true));
        this.chkAlignPixel.fromData(CDataClass.getData(data, "chkAlignPixel", {}, true));
        this.edtAlignPixel.fromData(CDataClass.getData(data, "edtAlignPixel", {}, true));
        this.btnApply.fromData(CDataClass.getData(data, "btnApply", {}, true));
        this.lRight.fromData(CDataClass.getData(data, "lRight", {}, true));
        this.spr.fromData(CDataClass.getData(data, "spr", {}, true));
        this.lRTop.fromData(CDataClass.getData(data, "lRTop", {}, true));
        this.btnDelete.fromData(CDataClass.getData(data, "btnDelete", {}, true));
        this.btnClear.fromData(CDataClass.getData(data, "btnClear", {}, true));
        this.grid.fromData(CDataClass.getData(data, "grid", {}, true));
        this.lClient.fromData(CDataClass.getData(data, "lClient", {}, true));
        this.lCTop.fromData(CDataClass.getData(data, "lCTop", {}, true));
        this.lCClient.fromData(CDataClass.getData(data, "lCClient", {}, true));
        this.path.fromData(CDataClass.getData(data, "path", {}, true));
        this.pointResource = CDataClass.getData(data, "pointResource", "");
        this.cpoint1Resource = CDataClass.getData(data, "cpoint1Resource", "");
        this.cpoint2Resource = CDataClass.getData(data, "cpoint2Resource", "");
    }
    deletePoint(pathPoint) {
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
        for (let n = 0; n < this.grid.length; n++) {
            if (this.grid.cell(4, n) == pathPoint) {
                this.grid.delete(n);
                break;
            }
        }
        for (let n = 0; n < this.__item.pathData.length; n++) {
            if (this.__item.pathData.get(n) == pathPoint) {
                this.__item.pathData.delete(n);
                break;
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
        this.clearPoints();
        for (let n = 0; n < this.item.pathData.length; n++) {
            if (this.item.pathData.get(n).pointKind == EPathPointKind.MOVETO) {
                let selector = new CPathPointSelectorModel(this.pointResource, this.cpoint1Resource, this.cpoint2Resource);
                selector.parent = this.pathGraphic;
                selector.pathPoint = this.item.pathData.get(n);
                this.__points.add(selector);
            }
            if (this.item.pathData.get(n).pointKind == EPathPointKind.LINETO) {
                let selector = new CPathPointSelectorModel(this.pointResource, this.cpoint1Resource, this.cpoint2Resource);
                selector.parent = this.pathGraphic;
                selector.pathPoint = this.item.pathData.get(n);
                this.__points.add(selector);
            }
            if (this.item.pathData.get(n).pointKind == EPathPointKind.CURVETO3) {
                let selector = new CPathPointSelectorModel(this.pointResource, this.cpoint1Resource, this.cpoint2Resource);
                selector.parent = this.pathGraphic;
                selector.pathPoint = this.item.pathData.get(n);
                this.__points.add(selector);
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
        for (let n = 0; n < this.__points.length; n++) {
            if (this.chkAlignPixel.checked) {
                this.__points.get(n).alignPixel = parseInt(this.edtAlignPixel.text);
            }
            else {
                this.__points.get(n).alignPixel = 0;
            }
        }
    }
    clear() {
        this.__item.pathData.clear();
        this.clearPoints();
        this.grid.clear();
    }
    refresh() {
        this.grid.clear();
        this.reCreatePoints();
        for (let n = 0; n < this.__item.pathData.length; n++) {
            let s = "";
            if (this.__item.pathData.get(n).pointKind == EPathPointKind.BEGIN) {
                s = "B";
            }
            else if (this.__item.pathData.get(n).pointKind == EPathPointKind.MOVETO) {
                s = "M";
            }
            else if (this.__item.pathData.get(n).pointKind == EPathPointKind.LINETO) {
                s = "L";
            }
            else if (this.__item.pathData.get(n).pointKind == EPathPointKind.CURVETO3) {
                s = "C";
            }
            else if (this.__item.pathData.get(n).pointKind == EPathPointKind.CLOSE) {
                s = "CL";
            }
            let row = this.grid.add([
                s,
                this.__item.pathData.get(n).point.toString(),
                this.__item.pathData.get(n).cPoint1.toString(),
                this.__item.pathData.get(n).cPoint2.toString(),
                this.__item.pathData.get(n)
            ]);
            let self = this;
            this.item.pathData.get(n).onChange = function () {
                if (row != undefined) {
                    row.get(1).asString = self.item.pathData.get(n).point.toString();
                    row.get(2).asString = self.item.pathData.get(n).cPoint1.toString();
                    row.get(3).asString = self.item.pathData.get(n).cPoint2.toString();
                }
            };
        }
    }
    async loadFile(filename) {
        /*let o = await this.openFinder.fetchBodyApi(CON_HOST + "/api/file/v1/fileload?filename=" + filename)
        if(o.result == "success") {
            if(o.data != undefined) {
                let oo = JSON.parse(o.data)
                if(this.pathData != undefined) this.pathData.fromData(oo.path)
                this.item.pathData.fromData(oo.path)
                this.lblWidth.value = oo.width + ""
                this.lblheight.value = oo.height + ""
                this.btnSize.click()
                this.refresh()
            }
        }
        return o*/
    }
    async saveFile(filename) {
        /*let oo = {width:parseInt(this.lblWidth.value), height:parseInt(this.lblheight.value)}
        oo["path"] = this.item.pathData.toData()
        if(CGlobal.userInfo != undefined) {
            let strm = new CStream()
            strm.putString(filename)
            strm.putString(JSON.stringify(oo))
            let self = this
            CGlobal.userInfo.sendSocketData("savetextfile", strm, function(data) {
                self.saveCover.hideCover()
            })
        }*/
    }
}
class CGraphEditorModel extends CPathEditorModel {
    constructor(parent, name) {
        super(parent, name);
        this.cover = new CCover(this);
        this.startValueHandle = new CPanel(this.pathGraphic);
        this.stopValueHandle = new CPanel(this.pathGraphic);
        this.lblScaleY = new CPanel(this.lCTop);
        this.edtScaleY = new CTextBox(this.lCTop);
        this.lblPrecision = new CPanel(this.lCTop);
        this.edtPrecision = new CTextBox(this.lCTop);
        this.lblDuration = new CPanel(this.lCTop);
        this.edtDuration = new CTextBox(this.lCTop);
        this.lblFrame = new CPanel(this.lCTop);
        this.edtFrame = new CTextBox(this.lCTop);
        this.btnReg = new CButton(this.lCTop);
        this.lblStart = new CPanel(this.toolbarBottom);
        this.edtStart = new CTextBox(this.toolbarBottom);
        this.lblStop = new CPanel(this.toolbarBottom);
        this.edtStop = new CTextBox(this.toolbarBottom);
        let self = this;
        this.item.fill.styleKind = EStyleKind.EMPTY;
        this.tagItem = this.pathGraphic.layers.get(0).items.addItem();
        this.tagItem.stroke.lineWidth = 1;
        this.tagItem.stroke.styleKind = EStyleKind.SOLID;
        this.tagItem.kind = ECanvasItemKind.PATH;
        this.tagItem.pathFitMode = EFitMode.ORIGINAL;
        this.tagItem.stroke.solidColor = "#808080";
        this.tagItem.pathData.clear();
        this.onChangeSize = function () {
            self.cover.position.width = self.position.width;
            self.cover.position.height = self.position.height;
        };
        this.startValueHandle.onChangeOffset = function () {
            self.edtStart.text = (self.pathGraphic.position.height - (self.startValueHandle.position.top + 15)) + "";
            self.setStartStopValue();
        };
        this.stopValueHandle.onChangeOffset = function () {
            self.edtStop.text = (self.pathGraphic.position.height - (self.stopValueHandle.position.top + 15)) + "";
            self.setStartStopValue();
        };
        this.edtStart.onKeyDown = function (s, e) {
            if (e.key == "Enter") {
                self.startValueHandle.position.top = self.pathGraphic.position.height - (parseInt(self.edtStart.text) + 15);
                self.setStartStopValue();
            }
        };
        this.edtStop.onKeyDown = function (s, e) {
            if (e.key == "Enter") {
                self.stopValueHandle.position.top = self.pathGraphic.position.height - (parseInt(self.edtStop.text) + 15);
                self.setStartStopValue();
            }
        };
        this.btnReg.onClick = function () {
            /*let arrpd = new Array<{pointKind: number, point:{x:number, y:number}, cPoint1:{x:number, y:number}, cPoint2:{x:number, y:number}}>()
            for(let n = 0; n < self.item.pathData.length; n++) {
                let pt = self.item.pathData.get(n)
                arrpd.push({
                    pointKind: pt.pointKind,
                    point:{x:pt.point.x, y:pt.point.y},
                    cPoint1:{x:pt.cPoint1.x, y:pt.cPoint1.y},
                    cPoint2:{x:pt.cPoint2.x, y:pt.cPoint2.y}
                })
            }

            if(CGlobal.userInfo != undefined) {
                let strm = new CStream()
                strm.putString(self.edtDuration.text)
                strm.putString(self.lblWidth.value)
                strm.putString(self.lblheight.value)
                strm.putString(self.edtStart.text)
                strm.putString(self.edtStop.text)
                strm.putString(self.edtScaleY.text)
                strm.putString(self.edtPrecision.text)
                strm.putString(self.edtFrame.text)
                strm.putString(CStringUtil.strToUriBase64(JSON.stringify(arrpd)))
                CGlobal.userInfo.sendSocketData("getGraphData", strm, function(data) {
                    data.getString()
                    data.getString()
                    let result = data.getString()
                    if(result == "success") {
                        data.getString()
                        let frm = new CTextEditor(CSystem.desktopList.get(0).applicationLayer)
                        frm.show(100, 100, 600, 400, "Graph data", "remove")
                        frm.editor.textArea.text = data.getString()
                    }
                })
            }*/
            /*
            CSystem.prompt("Add Graph", ["Resource name"], self.cover, async function(arr) {
                let o = await postData(CON_HOST + "/resource/api/v1/graphdataadd", {
                    duration:self.edtDuration.text,
                    width:self.lblWidth.value,
                    scaley:self.edtScaleY.text,
                    start:self.edtStart.text,
                    stop:self.edtStop.text,
                    height:self.lblheight.value,
                    precision:self.edtPrecision.text,
                    frame:self.edtFrame.text,
                    resourcename:arr[0],
                    pathdata:CStringUtil.strToUriBase64(JSON.stringify(arrpd))
                })
                if(o.result == "success") {
                    alert("Success")
                } else {
                    alert(o.message)
                }
            }, undefined, 350)*/
        };
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "startValueHandle", this.startValueHandle.toData(), {}, true);
        CDataClass.putData(data, "stopValueHandle", this.stopValueHandle.toData(), {}, true);
        CDataClass.putData(data, "lblScaleY", this.lblScaleY.toData(), {}, true);
        CDataClass.putData(data, "edtScaleY", this.edtScaleY.toData(), {}, true);
        CDataClass.putData(data, "lblPrecision", this.lblPrecision.toData(), {}, true);
        CDataClass.putData(data, "edtPrecision", this.edtPrecision.toData(), {}, true);
        CDataClass.putData(data, "lblDuration", this.lblDuration.toData(), {}, true);
        CDataClass.putData(data, "edtDuration", this.edtDuration.toData(), {}, true);
        CDataClass.putData(data, "lblFrame", this.lblFrame.toData(), {}, true);
        CDataClass.putData(data, "edtFrame", this.edtFrame.toData(), {}, true);
        CDataClass.putData(data, "btnReg", this.btnReg.toData(), {}, true);
        CDataClass.putData(data, "lblStart", this.lblStart.toData(), {}, true);
        CDataClass.putData(data, "edtStart", this.edtStart.toData(), {}, true);
        CDataClass.putData(data, "lblStop", this.lblStop.toData(), {}, true);
        CDataClass.putData(data, "edtStop", this.edtStop.toData(), {}, true);
        CDataClass.putData(data, "cover", this.cover.toData(), {}, true);
    }
    doFromData(data) {
        super.doFromData(data);
        this.startValueHandle.fromData(CDataClass.getData(data, "startValueHandle", {}, true));
        this.stopValueHandle.fromData(CDataClass.getData(data, "stopValueHandle", {}, true));
        this.lblScaleY.fromData(CDataClass.getData(data, "lblScaleY", {}, true));
        this.edtScaleY.fromData(CDataClass.getData(data, "edtScaleY", {}, true));
        this.lblPrecision.fromData(CDataClass.getData(data, "lblPrecision", {}, true));
        this.edtPrecision.fromData(CDataClass.getData(data, "edtPrecision", {}, true));
        this.lblDuration.fromData(CDataClass.getData(data, "lblDuration", {}, true));
        this.edtDuration.fromData(CDataClass.getData(data, "edtDuration", {}, true));
        this.lblFrame.fromData(CDataClass.getData(data, "lblFrame", {}, true));
        this.edtFrame.fromData(CDataClass.getData(data, "edtFrame", {}, true));
        this.btnReg.fromData(CDataClass.getData(data, "btnReg", {}, true));
        this.lblStart.fromData(CDataClass.getData(data, "lblStart", {}, true));
        this.edtStart.fromData(CDataClass.getData(data, "edtStart", {}, true));
        this.lblStop.fromData(CDataClass.getData(data, "lblStop", {}, true));
        this.edtStop.fromData(CDataClass.getData(data, "edtStop", {}, true));
        this.cover.fromData(CDataClass.getData(data, "cover", {}, true));
    }
    setStartStopValue() {
        let sty = this.startValueHandle.position.top + 15;
        let edy = this.stopValueHandle.position.top + 15;
        this.__backItem.pathData.clear();
        this.__backItem.pathData.addPointMoveTo(new CPoint(0, sty));
        this.__backItem.pathData.addPointLineTo(new CPoint(this.pathGraphic.position.width, sty));
        this.__backItem.pathData.addPointMoveTo(new CPoint(0, edy));
        this.__backItem.pathData.addPointLineTo(new CPoint(this.pathGraphic.position.width, edy));
        this.pathGraphic.draw();
    }
    setHandle() {
        this.startValueHandle.position.top = this.pathGraphic.position.height - (parseInt(this.edtStart.text) + 15);
        this.stopValueHandle.position.top = this.pathGraphic.position.height - (parseInt(this.edtStop.text) + 15);
        this.setStartStopValue();
    }
    async loadFile(filename) {
        /*let o = await this.openFinder.fetchBodyApi(CON_HOST + "/api/file/v1/fileload?filename=" + filename)
        if(o.result == "success") {
            if(o.data != undefined) {
                let oo = JSON.parse(o.data)
                if(this.pathData != undefined) this.pathData.fromData(oo.path)
                this.item.pathData.fromData(oo.path)
                this.lblWidth.value = oo.width + ""
                this.lblheight.value = oo.height + ""
                this.btnSize.click()
                this.edtScaleY.text = oo.scaleY
                this.edtPrecision.text = oo.precision
                this.edtDuration.text = oo.duration
                this.edtFrame.text = oo.frame
                this.edtStart.text = oo.startY
                this.edtStop.text = oo.stopY
                this.setHandle()
                this.refresh()
            }
        }
        return o*/
    }
    async saveFile(filename) {
        /*let oo = {
            width:parseInt(this.lblWidth.value),
            height:parseInt(this.lblheight.value),
            scaleY:this.edtScaleY.text,
            precision:this.edtPrecision.text,
            duration:this.edtDuration.text,
            frame:this.edtFrame.text,
            startY:this.edtStart.text,
            stopY:this.edtStop.text
        }
        oo["path"] = this.item.pathData.toData()
        if(CGlobal.userInfo != undefined) {
            let strm = new CStream()
            strm.putString(filename)
            strm.putString(JSON.stringify(oo))
            let self = this
            CGlobal.userInfo.sendSocketData("savetextfile", strm, function(data) {
                self.saveCover.hideCover()
            })
        }*/
    }
    getGraphData() {
        let height = parseFloat(this.lblheight.value);
        let start = parseFloat(this.edtStart.text);
        let stop = parseFloat(this.edtStop.text);
        let scaleY = parseFloat(this.edtScaleY.text);
        let precision = parseFloat(this.edtPrecision.text);
        return CAssembly.getBezierGraphValue(this.item.pathData, 1, scaleY, start, stop, height, precision);
    }
}
class CPathEditorFrame extends CPathEditorModel {
    constructor(parent, name) {
        super(parent, name);
        this.resource = "pathEditor.frame";
    }
}
class CGraphEditorFrame extends CGraphEditorModel {
    constructor(parent, name) {
        super(parent, name);
        this.resource = "graphEditor.frame";
    }
}
class CPathEditor extends CWindowBlue {
    constructor(parent, name) {
        super(parent, name);
        this.editor = new CPathEditorFrame(this.body);
        this.editor.position.align = EPositionAlign.CLIENT;
    }
}
class CGraphEditor extends CWindowBlue {
    constructor(parent, name) {
        super(parent, name);
        this.editor = new CGraphEditorFrame(this.body);
        this.editor.position.align = EPositionAlign.CLIENT;
    }
}
class CAppGraphEditor extends CWindowApplication {
    constructor() {
        super();
        this.defaultWidth = 1200;
        this.defaultHeight = 600;
        this.appName = "Graph Editor";
        this.editor = new CGraphEditorFrame(this.mainWindow.body);
        this.editor.position.align = EPositionAlign.CLIENT;
    }
}
class CPathController extends CPanel {
    constructor(parent, name) {
        super(parent, name);
        this.__isTransForm = true;
        this.__isTransForm2 = true;
        this.xLineCount = 9;
        this.yLineCount = 9;
        this.toolbar = new CPanel(this);
        this.lblXline = new CPanel(this.toolbar);
        this.edtXLine = new CTextBox(this.toolbar);
        this.lblYline = new CPanel(this.toolbar);
        this.edtYLine = new CTextBox(this.toolbar);
        this.btnLine = new CButton(this.toolbar);
        this.btnGridPathSet = new CButton(this.toolbar);
        this.lblSplite = new CPanel(this.toolbar);
        this.edtSplite = new CTextBox(this.toolbar);
        this.btnSplit = new CButton(this.toolbar);
        this.btnSplitAll = new CButton(this.toolbar);
        this.btnClose = new CButton(this.toolbar);
        this.freeTransformHandleLT = new CPanel(this);
        this.freeTransformHandleRT = new CPanel(this);
        this.freeTransformHandleLB = new CPanel(this);
        this.freeTransformHandleRB = new CPanel(this);
        this.freeTransformHandleLeftC1 = new CPanel(this);
        this.freeTransformHandleLeftC2 = new CPanel(this);
        this.freeTransformHandleTopC1 = new CPanel(this);
        this.freeTransformHandleTopC2 = new CPanel(this);
        this.freeTransformHandleRightC1 = new CPanel(this);
        this.freeTransformHandleRightC2 = new CPanel(this);
        this.freeTransformHandleBottomC1 = new CPanel(this);
        this.freeTransformHandleBottomC2 = new CPanel(this);
        let self = this;
        this.freeTransformHandleLT.onChangeOffset = function () {
            self.__isTransForm = false;
            self.setLTCurve();
            self.__isTransForm = true;
            if (self.__isTransForm)
                self.doFreeTransformHandleTrack();
        };
        this.freeTransformHandleRT.onChangeOffset = function () {
            self.__isTransForm = false;
            self.setRTCurve();
            self.__isTransForm = true;
            if (self.__isTransForm)
                self.doFreeTransformHandleTrack();
        };
        this.freeTransformHandleLB.onChangeOffset = function () {
            self.__isTransForm = false;
            self.setLBCurve();
            self.__isTransForm = true;
            if (self.__isTransForm)
                self.doFreeTransformHandleTrack();
        };
        this.freeTransformHandleRB.onChangeOffset = function () {
            self.__isTransForm = false;
            self.setRBCurve();
            self.__isTransForm = true;
            if (self.__isTransForm)
                self.doFreeTransformHandleTrack();
        };
        this.freeTransformHandleLeftC1.onChangeOffset = function () {
            if (self.__isTransForm)
                self.doFreeTransformHandleTrack();
        };
        this.freeTransformHandleLeftC2.onChangeOffset = function () {
            if (self.__isTransForm)
                self.doFreeTransformHandleTrack();
        };
        this.freeTransformHandleTopC1.onChangeOffset = function () {
            if (self.__isTransForm)
                self.doFreeTransformHandleTrack();
        };
        this.freeTransformHandleTopC2.onChangeOffset = function () {
            if (self.__isTransForm)
                self.doFreeTransformHandleTrack();
        };
        this.freeTransformHandleRightC1.onChangeOffset = function () {
            if (self.__isTransForm)
                self.doFreeTransformHandleTrack();
        };
        this.freeTransformHandleRightC2.onChangeOffset = function () {
            if (self.__isTransForm)
                self.doFreeTransformHandleTrack();
        };
        this.freeTransformHandleBottomC1.onChangeOffset = function () {
            if (self.__isTransForm)
                self.doFreeTransformHandleTrack();
        };
        this.freeTransformHandleBottomC2.onChangeOffset = function () {
            if (self.__isTransForm)
                self.doFreeTransformHandleTrack();
        };
        this.btnClose.onClick = function () {
            self.visible = false;
        };
        this.btnLine.onClick = function () {
            self.xLineCount = parseInt(self.edtXLine.text);
            self.yLineCount = parseInt(self.edtYLine.text);
        };
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "toolbar", this.toolbar.toData(), {}, true);
        CDataClass.putData(data, "lblXline", this.lblXline.toData(), {}, true);
        CDataClass.putData(data, "edtXLine", this.edtXLine.toData(), {}, true);
        CDataClass.putData(data, "lblYline", this.lblYline.toData(), {}, true);
        CDataClass.putData(data, "edtYLine", this.edtYLine.toData(), {}, true);
        CDataClass.putData(data, "btnLine", this.btnLine.toData(), {}, true);
        CDataClass.putData(data, "btnGridPathSet", this.btnGridPathSet.toData(), {}, true);
        CDataClass.putData(data, "lblSplite", this.lblSplite.toData(), {}, true);
        CDataClass.putData(data, "edtSplite", this.edtSplite.toData(), {}, true);
        CDataClass.putData(data, "btnSplit", this.btnSplit.toData(), {}, true);
        CDataClass.putData(data, "btnSplitAll", this.btnSplitAll.toData(), {}, true);
        CDataClass.putData(data, "btnClose", this.btnClose.toData(), {}, true);
        CDataClass.putData(data, "freeTransformHandleLT", this.freeTransformHandleLT.toData(), {}, true);
        CDataClass.putData(data, "freeTransformHandleRT", this.freeTransformHandleRT.toData(), {}, true);
        CDataClass.putData(data, "freeTransformHandleLB", this.freeTransformHandleLB.toData(), {}, true);
        CDataClass.putData(data, "freeTransformHandleRB", this.freeTransformHandleRB.toData(), {}, true);
        CDataClass.putData(data, "freeTransformHandleLeftC1", this.freeTransformHandleLeftC1.toData(), {}, true);
        CDataClass.putData(data, "freeTransformHandleLeftC2", this.freeTransformHandleLeftC2.toData(), {}, true);
        CDataClass.putData(data, "freeTransformHandleTopC1", this.freeTransformHandleTopC1.toData(), {}, true);
        CDataClass.putData(data, "freeTransformHandleTopC2", this.freeTransformHandleTopC2.toData(), {}, true);
        CDataClass.putData(data, "freeTransformHandleRightC1", this.freeTransformHandleRightC1.toData(), {}, true);
        CDataClass.putData(data, "freeTransformHandleRightC2", this.freeTransformHandleRightC2.toData(), {}, true);
        CDataClass.putData(data, "freeTransformHandleBottomC1", this.freeTransformHandleBottomC1.toData(), {}, true);
        CDataClass.putData(data, "freeTransformHandleBottomC2", this.freeTransformHandleBottomC2.toData(), {}, true);
    }
    doFromData(data) {
        super.doFromData(data);
        this.toolbar.fromData(CDataClass.getData(data, "toolbar", {}, true));
        this.lblXline.fromData(CDataClass.getData(data, "lblXline", {}, true));
        this.edtXLine.fromData(CDataClass.getData(data, "edtXLine", {}, true));
        this.lblYline.fromData(CDataClass.getData(data, "lblYline", {}, true));
        this.edtYLine.fromData(CDataClass.getData(data, "edtYLine", {}, true));
        this.btnLine.fromData(CDataClass.getData(data, "btnLine", {}, true));
        this.btnGridPathSet.fromData(CDataClass.getData(data, "btnGridPathSet", {}, true));
        this.lblSplite.fromData(CDataClass.getData(data, "lblSplite", {}, true));
        this.edtSplite.fromData(CDataClass.getData(data, "edtSplite", {}, true));
        this.btnSplit.fromData(CDataClass.getData(data, "btnSplit", {}, true));
        this.btnSplitAll.fromData(CDataClass.getData(data, "btnSplitAll", {}, true));
        this.btnClose.fromData(CDataClass.getData(data, "btnClose", {}, true));
        this.freeTransformHandleLT.fromData(CDataClass.getData(data, "freeTransformHandleLT", {}, true));
        this.freeTransformHandleRT.fromData(CDataClass.getData(data, "freeTransformHandleRT", {}, true));
        this.freeTransformHandleLB.fromData(CDataClass.getData(data, "freeTransformHandleLB", {}, true));
        this.freeTransformHandleRB.fromData(CDataClass.getData(data, "freeTransformHandleRB", {}, true));
        this.freeTransformHandleLeftC1.fromData(CDataClass.getData(data, "freeTransformHandleLeftC1", {}, true));
        this.freeTransformHandleLeftC2.fromData(CDataClass.getData(data, "freeTransformHandleLeftC2", {}, true));
        this.freeTransformHandleTopC1.fromData(CDataClass.getData(data, "freeTransformHandleTopC1", {}, true));
        this.freeTransformHandleTopC2.fromData(CDataClass.getData(data, "freeTransformHandleTopC2", {}, true));
        this.freeTransformHandleRightC1.fromData(CDataClass.getData(data, "freeTransformHandleRightC1", {}, true));
        this.freeTransformHandleRightC2.fromData(CDataClass.getData(data, "freeTransformHandleRightC2", {}, true));
        this.freeTransformHandleBottomC1.fromData(CDataClass.getData(data, "freeTransformHandleBottomC1", {}, true));
        this.freeTransformHandleBottomC2.fromData(CDataClass.getData(data, "freeTransformHandleBottomC2", {}, true));
    }
    doFreeTransformHandleTrack() {
        if (this.__isTransForm && this.__isTransForm2) {
            this.doPathDataTransform();
            if (this.onFreeTransformHandleTrack != undefined) {
                this.onFreeTransformHandleTrack(this);
            }
        }
    }
    doPathDataTransform() {
        let pds = this.layers.getCanvasItems("line");
        let ptLT = this.getLTPoint();
        let ptRT = this.getRTPoint();
        let ptLB = this.getLBPoint();
        let ptRB = this.getRBPoint();
        let ptLeftC1 = new CPoint(this.freeTransformHandleLeftC1.position.left, this.freeTransformHandleLeftC1.position.top);
        let ptLeftC2 = new CPoint(this.freeTransformHandleLeftC2.position.left, this.freeTransformHandleLeftC2.position.top);
        let ptTopC1 = new CPoint(this.freeTransformHandleTopC1.position.left, this.freeTransformHandleTopC1.position.top);
        let ptTopC2 = new CPoint(this.freeTransformHandleTopC2.position.left, this.freeTransformHandleTopC2.position.top);
        let ptRightC1 = new CPoint(this.freeTransformHandleRightC1.position.left, this.freeTransformHandleRightC1.position.top);
        let ptRightC2 = new CPoint(this.freeTransformHandleRightC2.position.left, this.freeTransformHandleRightC2.position.top);
        let ptBottomC1 = new CPoint(this.freeTransformHandleBottomC1.position.left, this.freeTransformHandleBottomC1.position.top);
        let ptBottomC2 = new CPoint(this.freeTransformHandleBottomC2.position.left, this.freeTransformHandleBottomC2.position.top);
        for (let n = 0; n < pds.length; n++) {
            pds[n].pathData.clear();
            /*pds[n].pathData.addPointMoveTo(ptLT)
            pds[n].pathData.addPointLineTo(ptRT)
            pds[n].pathData.addPointLineTo(ptRB)
            pds[n].pathData.addPointLineTo(ptLB)
            pds[n].pathData.addPointClose()*/
            pds[n].pathData.addPointMoveTo(ptLT);
            pds[n].pathData.addPointCurveTo3(ptRT, ptTopC1, ptTopC2);
            pds[n].pathData.addPointCurveTo3(ptRB, ptRightC1, ptRightC2);
            pds[n].pathData.addPointMoveTo(ptLB);
            pds[n].pathData.addPointCurveTo3(ptRB, ptBottomC1, ptBottomC2);
            pds[n].pathData.addPointMoveTo(ptLT);
            pds[n].pathData.addPointCurveTo3(ptLB, ptLeftC1, ptLeftC2);
            //y축
            for (let x = 0; x < this.yLineCount; x++) {
                let m = (1 / (this.yLineCount + 1)) * (x + 1);
                let pts = CPoint.yTransformLine(ptLT, ptRT, ptLB, ptRB, ptLeftC1, ptLeftC2, ptTopC1, ptTopC2, ptRightC1, ptRightC2, ptBottomC1, ptBottomC2, m);
                pds[n].pathData.addPointMoveTo(pts.startPoint);
                pds[n].pathData.addPointCurveTo3(pts.stopPoint, pts.curve1, pts.curve2);
            }
            //x축
            for (let x = 0; x < this.xLineCount; x++) {
                let m = (1 / (this.xLineCount + 1)) * (x + 1);
                let pts = CPoint.xTransformLine(ptLT, ptRT, ptLB, ptRB, ptLeftC1, ptLeftC2, ptTopC1, ptTopC2, ptRightC1, ptRightC2, ptBottomC1, ptBottomC2, m);
                pds[n].pathData.addPointMoveTo(pts.startPoint);
                pds[n].pathData.addPointCurveTo3(pts.stopPoint, pts.curve1, pts.curve2);
            }
        }
        if (this.onPathDataTransform != undefined) {
            this.onPathDataTransform(this);
        }
    }
    getLTPoint() {
        return new CPoint(this.freeTransformHandleLT.position.left + this.freeTransformHandleLT.position.width, this.freeTransformHandleLT.position.top + this.freeTransformHandleLT.position.height);
    }
    getRTPoint() {
        return new CPoint(this.freeTransformHandleRT.position.left, this.freeTransformHandleRT.position.top + this.freeTransformHandleRT.position.height);
    }
    getLBPoint() {
        return new CPoint(this.freeTransformHandleLB.position.left + this.freeTransformHandleLB.position.width, this.freeTransformHandleLB.position.top);
    }
    getRBPoint() {
        return new CPoint(this.freeTransformHandleRB.position.left, this.freeTransformHandleRB.position.top);
    }
    getC1(p1, p2) {
        return CPoint.getLineMiddlePoint(p1, p2, 1 / 3);
    }
    getC2(p1, p2) {
        return CPoint.getLineMiddlePoint(p1, p2, 1 / 3 * 2);
    }
    setLTCurve() {
        let lt = this.getLTPoint();
        let rt = this.getRTPoint();
        let lb = this.getLBPoint();
        let pt = this.getC1(lt, rt);
        this.freeTransformHandleTopC1.position.left = pt.x;
        this.freeTransformHandleTopC1.position.top = pt.y;
        pt = this.getC2(lt, rt);
        this.freeTransformHandleTopC2.position.left = pt.x;
        this.freeTransformHandleTopC2.position.top = pt.y;
        pt = this.getC1(lt, lb);
        this.freeTransformHandleLeftC1.position.left = pt.x;
        this.freeTransformHandleLeftC1.position.top = pt.y;
        pt = this.getC2(lt, lb);
        this.freeTransformHandleLeftC2.position.left = pt.x;
        this.freeTransformHandleLeftC2.position.top = pt.y;
    }
    setRTCurve() {
        let lt = this.getLTPoint();
        let rt = this.getRTPoint();
        let rb = this.getRBPoint();
        let pt = this.getC1(lt, rt);
        this.freeTransformHandleTopC1.position.left = pt.x;
        this.freeTransformHandleTopC1.position.top = pt.y;
        pt = this.getC2(lt, rt);
        this.freeTransformHandleTopC2.position.left = pt.x;
        this.freeTransformHandleTopC2.position.top = pt.y;
        pt = this.getC1(rt, rb);
        this.freeTransformHandleRightC1.position.left = pt.x;
        this.freeTransformHandleRightC1.position.top = pt.y;
        pt = this.getC2(rt, rb);
        this.freeTransformHandleRightC2.position.left = pt.x;
        this.freeTransformHandleRightC2.position.top = pt.y;
    }
    setLBCurve() {
        let lt = this.getLTPoint();
        let lb = this.getLBPoint();
        let rb = this.getRBPoint();
        let pt = this.getC1(lb, rb);
        this.freeTransformHandleBottomC1.position.left = pt.x;
        this.freeTransformHandleBottomC1.position.top = pt.y;
        pt = this.getC2(lb, rb);
        this.freeTransformHandleBottomC2.position.left = pt.x;
        this.freeTransformHandleBottomC2.position.top = pt.y;
        pt = this.getC1(lt, lb);
        this.freeTransformHandleLeftC1.position.left = pt.x;
        this.freeTransformHandleLeftC1.position.top = pt.y;
        pt = this.getC2(lt, lb);
        this.freeTransformHandleLeftC2.position.left = pt.x;
        this.freeTransformHandleLeftC2.position.top = pt.y;
    }
    setRBCurve() {
        let rt = this.getRTPoint();
        let rb = this.getRBPoint();
        let lb = this.getLBPoint();
        let pt = this.getC1(rt, rb);
        this.freeTransformHandleRightC1.position.left = pt.x;
        this.freeTransformHandleRightC1.position.top = pt.y;
        pt = this.getC2(rt, rb);
        this.freeTransformHandleRightC2.position.left = pt.x;
        this.freeTransformHandleRightC2.position.top = pt.y;
        pt = this.getC1(lb, rb);
        this.freeTransformHandleBottomC1.position.left = pt.x;
        this.freeTransformHandleBottomC1.position.top = pt.y;
        pt = this.getC2(lb, rb);
        this.freeTransformHandleBottomC2.position.left = pt.x;
        this.freeTransformHandleBottomC2.position.top = pt.y;
    }
    gridToPathData() {
        let ptLT = this.getLTPoint();
        let ptRT = this.getRTPoint();
        let ptLB = this.getLBPoint();
        let ptRB = this.getRBPoint();
        let ptLeftC1 = new CPoint(this.freeTransformHandleLeftC1.position.left, this.freeTransformHandleLeftC1.position.top);
        let ptLeftC2 = new CPoint(this.freeTransformHandleLeftC2.position.left, this.freeTransformHandleLeftC2.position.top);
        let ptTopC1 = new CPoint(this.freeTransformHandleTopC1.position.left, this.freeTransformHandleTopC1.position.top);
        let ptTopC2 = new CPoint(this.freeTransformHandleTopC2.position.left, this.freeTransformHandleTopC2.position.top);
        let ptRightC1 = new CPoint(this.freeTransformHandleRightC1.position.left, this.freeTransformHandleRightC1.position.top);
        let ptRightC2 = new CPoint(this.freeTransformHandleRightC2.position.left, this.freeTransformHandleRightC2.position.top);
        let ptBottomC1 = new CPoint(this.freeTransformHandleBottomC1.position.left, this.freeTransformHandleBottomC1.position.top);
        let ptBottomC2 = new CPoint(this.freeTransformHandleBottomC2.position.left, this.freeTransformHandleBottomC2.position.top);
        let pd = new CPathPointList();
        pd.clear();
        pd.addPointMoveTo(ptLT);
        pd.addPointCurveTo3(ptRT, ptTopC1, ptTopC2);
        pd.addPointCurveTo3(ptRB, ptRightC1, ptRightC2);
        //pd.addPointMoveTo(ptLB)
        //pd.addPointCurveTo3(ptRB, ptBottomC1, ptBottomC2)
        pd.addPointCurveTo3(ptLB, ptBottomC2, ptBottomC1);
        //pd.addPointMoveTo(ptLT)
        //pd.addPointCurveTo3(ptLB, ptLeftC1, ptLeftC2)
        pd.addPointCurveTo3(ptLT, ptLeftC2, ptLeftC1);
        pd.addPointClose();
        let pd2 = new CPathPointList();
        //y축
        for (let x = 0; x < this.yLineCount; x++) {
            let m = (1 / (this.yLineCount + 1)) * (x + 1);
            let pts = CPoint.yTransformLine(ptLT, ptRT, ptLB, ptRB, ptLeftC1, ptLeftC2, ptTopC1, ptTopC2, ptRightC1, ptRightC2, ptBottomC1, ptBottomC2, m);
            pd2.addPointMoveTo(pts.startPoint);
            pd2.addPointCurveTo3(pts.stopPoint, pts.curve1, pts.curve2);
        }
        //x축
        for (let x = 0; x < this.xLineCount; x++) {
            let m = (1 / (this.xLineCount + 1)) * (x + 1);
            let pts = CPoint.xTransformLine(ptLT, ptRT, ptLB, ptRB, ptLeftC1, ptLeftC2, ptTopC1, ptTopC2, ptRightC1, ptRightC2, ptBottomC1, ptBottomC2, m);
            pd2.addPointMoveTo(pts.startPoint);
            pd2.addPointCurveTo3(pts.stopPoint, pts.curve1, pts.curve2);
        }
        return { background: pd, grid: pd2 };
    }
    getTransformBounds() {
        let ptLT = this.getLTPoint();
        let ptRT = this.getRTPoint();
        let ptLB = this.getLBPoint();
        let ptRB = this.getRBPoint();
        let ptLeftC1 = new CPoint(this.freeTransformHandleLeftC1.position.left, this.freeTransformHandleLeftC1.position.top);
        let ptLeftC2 = new CPoint(this.freeTransformHandleLeftC2.position.left, this.freeTransformHandleLeftC2.position.top);
        let ptTopC1 = new CPoint(this.freeTransformHandleTopC1.position.left, this.freeTransformHandleTopC1.position.top);
        let ptTopC2 = new CPoint(this.freeTransformHandleTopC2.position.left, this.freeTransformHandleTopC2.position.top);
        let ptRightC1 = new CPoint(this.freeTransformHandleRightC1.position.left, this.freeTransformHandleRightC1.position.top);
        let ptRightC2 = new CPoint(this.freeTransformHandleRightC2.position.left, this.freeTransformHandleRightC2.position.top);
        let ptBottomC1 = new CPoint(this.freeTransformHandleBottomC1.position.left, this.freeTransformHandleBottomC1.position.top);
        let ptBottomC2 = new CPoint(this.freeTransformHandleBottomC2.position.left, this.freeTransformHandleBottomC2.position.top);
        let l = Math.min(ptLT.x, ptRT.x, ptLB.x, ptRB.x, ptLeftC1.x, ptLeftC2.x, ptTopC1.x, ptTopC2.x, ptRightC1.x, ptRightC2.x, ptBottomC1.x, ptBottomC2.x);
        let t = Math.min(ptLT.y, ptRT.y, ptLB.y, ptRB.y, ptLeftC1.y, ptLeftC2.y, ptTopC1.y, ptTopC2.y, ptRightC1.y, ptRightC2.y, ptBottomC1.y, ptBottomC2.y);
        let r = Math.max(ptLT.x, ptRT.x, ptLB.x, ptRB.x, ptLeftC1.x, ptLeftC2.x, ptTopC1.x, ptTopC2.x, ptRightC1.x, ptRightC2.x, ptBottomC1.x, ptBottomC2.x);
        let b = Math.max(ptLT.y, ptRT.y, ptLB.y, ptRB.y, ptLeftC1.y, ptLeftC2.y, ptTopC1.y, ptTopC2.y, ptRightC1.y, ptRightC2.y, ptBottomC1.y, ptBottomC2.y);
        return new CRect(l, t, r, b);
    }
    offTransform() {
        this.__isTransForm2 = false;
    }
    onTransform() {
        this.__isTransForm2 = true;
        this.doFreeTransformHandleTrack();
    }
}
class CPathItemTransformer extends CPathController {
    get pathItem() {
        return this._pathItem;
    }
    set pathItem(value) {
        if (this._pathItem != value) {
            this._pathItem = value;
            if (value != undefined) {
                this.doSetPathData(value);
            }
        }
    }
    constructor(parent, name) {
        super(parent, name);
        this.__orgPathData = new Map();
        this.__orgBounds = new CRect();
        let self = this;
        this.btnSplit.onClick = function () {
            if (self.pathItem != undefined) {
                self.pathItem.pathData.splitLine(parseInt(self.edtSplite.text));
            }
        };
        this.btnSplitAll.onClick = function () {
            if (self.pathItem != undefined) {
                self.pathItem.loopPathItem(function (item) {
                    item.pathData.splitLine(parseInt(self.edtSplite.text));
                });
            }
        };
        this.btnClose.onClick = function () {
            self.visible = false;
            self.pathItem = undefined;
        };
    }
    doSetPathData(pathItem) {
        let rt = pathItem.pathData.getBounds();
        if (pathItem.pathData.length == 0) {
            rt = new CRect(0, 0, 0, 0);
        }
        let self = this;
        this.__orgPathData.clear();
        function setItem(item) {
            let pd = item.pathData.copyTo();
            item.pathData.lineToCurve();
            pd.lineToCurve();
            self.__orgPathData.set(item, pd);
            for (let n = 0; n < item.childs.length; n++) {
                setItem(item.childs.get(n));
            }
        }
        this.__orgBounds = pathItem.pathData.getBounds();
        setItem(pathItem);
        this.freeTransformHandleLT.position.left = rt.left - this.freeTransformHandleLT.position.width;
        this.freeTransformHandleLT.position.top = rt.top - this.freeTransformHandleLT.position.height;
        this.freeTransformHandleRT.position.left = rt.right;
        this.freeTransformHandleRT.position.top = rt.top - this.freeTransformHandleLT.position.height;
        this.freeTransformHandleLB.position.left = rt.left - this.freeTransformHandleLT.position.width;
        this.freeTransformHandleLB.position.top = rt.bottom;
        this.freeTransformHandleRB.position.left = rt.right;
        this.freeTransformHandleRB.position.top = rt.bottom;
    }
    doGridToItem() {
        if (this.pathItem != undefined) {
            let pd = this.gridToPathData();
            this.pathItem.pathData.copyFrom(pd.background);
            let item = this.pathItem.childs.addItem();
            item.pathData.copyFrom(pd.grid);
        }
    }
    doPathDataTransform() {
        if (this.pathItem != undefined) {
            let self = this;
            let pds = this.layers.getCanvasItems("line");
            let ptLT = this.getLTPoint();
            let ptRT = this.getRTPoint();
            let ptLB = this.getLBPoint();
            let ptRB = this.getRBPoint();
            let ptLeftC1 = new CPoint(this.freeTransformHandleLeftC1.position.left, this.freeTransformHandleLeftC1.position.top);
            let ptLeftC2 = new CPoint(this.freeTransformHandleLeftC2.position.left, this.freeTransformHandleLeftC2.position.top);
            let ptTopC1 = new CPoint(this.freeTransformHandleTopC1.position.left, this.freeTransformHandleTopC1.position.top);
            let ptTopC2 = new CPoint(this.freeTransformHandleTopC2.position.left, this.freeTransformHandleTopC2.position.top);
            let ptRightC1 = new CPoint(this.freeTransformHandleRightC1.position.left, this.freeTransformHandleRightC1.position.top);
            let ptRightC2 = new CPoint(this.freeTransformHandleRightC2.position.left, this.freeTransformHandleRightC2.position.top);
            let ptBottomC1 = new CPoint(this.freeTransformHandleBottomC1.position.left, this.freeTransformHandleBottomC1.position.top);
            let ptBottomC2 = new CPoint(this.freeTransformHandleBottomC2.position.left, this.freeTransformHandleBottomC2.position.top);
            function setPath(item) {
                let opd = self.__orgPathData.get(item);
                if (opd != undefined && self.__orgBounds != undefined) {
                    for (let n = 0; n < opd.length; n++) {
                        if (opd.get(n).pointKind == EPathPointKind.MOVETO ||
                            opd.get(n).pointKind == EPathPointKind.LINETO ||
                            opd.get(n).pointKind == EPathPointKind.CURVETO2 ||
                            opd.get(n).pointKind == EPathPointKind.CURVETO3) {
                            let pt = opd.get(n).point;
                            //let tpt = CPoint.getTransformPoint(self.__orgBounds, pt.toPoint(), ptLT, ptRT, ptLB, ptRB)
                            let tpt = CPoint.getTransformCurvePoint(self.__orgBounds, pt.toPoint(), ptLT, ptRT, ptLB, ptRB, ptLeftC1, ptLeftC2, ptTopC1, ptTopC2, ptRightC1, ptRightC2, ptBottomC1, ptBottomC2);
                            item.pathData.get(n).point.x = tpt.x;
                            item.pathData.get(n).point.y = tpt.y;
                            pt = opd.get(n).cPoint1;
                            //tpt = CPoint.getTransformPoint(self.__orgBounds, pt.toPoint(), ptLT, ptRT, ptLB, ptRB)
                            tpt = CPoint.getTransformCurvePoint(self.__orgBounds, pt.toPoint(), ptLT, ptRT, ptLB, ptRB, ptLeftC1, ptLeftC2, ptTopC1, ptTopC2, ptRightC1, ptRightC2, ptBottomC1, ptBottomC2);
                            item.pathData.get(n).cPoint1.x = tpt.x;
                            item.pathData.get(n).cPoint1.y = tpt.y;
                            pt = opd.get(n).cPoint2;
                            //tpt = CPoint.getTransformPoint(self.__orgBounds, pt.toPoint(), ptLT, ptRT, ptLB, ptRB)
                            tpt = CPoint.getTransformCurvePoint(self.__orgBounds, pt.toPoint(), ptLT, ptRT, ptLB, ptRB, ptLeftC1, ptLeftC2, ptTopC1, ptTopC2, ptRightC1, ptRightC2, ptBottomC1, ptBottomC2);
                            item.pathData.get(n).cPoint2.x = tpt.x;
                            item.pathData.get(n).cPoint2.y = tpt.y;
                        }
                    }
                }
                for (let n = 0; n < item.childs.length; n++) {
                    setPath(item.childs.get(n));
                }
            }
            setPath(this.pathItem);
        }
        super.doPathDataTransform();
    }
}
class CCanvasControlTransfomer extends CPathController {
    constructor(parent, name) {
        super(parent, name);
        this.__orgHasPoint = false;
        this.__orgPathData = new Map();
        this.__orgBounds = new CRect();
        let self = this;
        this.btnSplit.onClick = function () {
            if (self.control != undefined) {
                for (let n = 0; n < self.control.layers.length; n++) {
                    for (let i = 0; i < self.control.layers.get(n).items.length; i++) {
                        self.control.layers.get(n).items.get(i).pathData.splitLine(parseInt(self.edtSplite.text));
                    }
                }
            }
        };
        this.btnSplitAll.visible = false;
        this.btnClose.onClick = function () {
            self.visible = false;
            if (self.control != undefined)
                self.control.hasPointerEvent = self.__orgHasPoint;
            self.control = undefined;
        };
    }
    doPathDataTransform() {
        if (this.control != undefined) {
            let ptLT = this.getLTPoint();
            let ptRT = this.getRTPoint();
            let ptLB = this.getLBPoint();
            let ptRB = this.getRBPoint();
            let ptLeftC1 = new CPoint(this.freeTransformHandleLeftC1.position.left, this.freeTransformHandleLeftC1.position.top);
            let ptLeftC2 = new CPoint(this.freeTransformHandleLeftC2.position.left, this.freeTransformHandleLeftC2.position.top);
            let ptTopC1 = new CPoint(this.freeTransformHandleTopC1.position.left, this.freeTransformHandleTopC1.position.top);
            let ptTopC2 = new CPoint(this.freeTransformHandleTopC2.position.left, this.freeTransformHandleTopC2.position.top);
            let ptRightC1 = new CPoint(this.freeTransformHandleRightC1.position.left, this.freeTransformHandleRightC1.position.top);
            let ptRightC2 = new CPoint(this.freeTransformHandleRightC2.position.left, this.freeTransformHandleRightC2.position.top);
            let ptBottomC1 = new CPoint(this.freeTransformHandleBottomC1.position.left, this.freeTransformHandleBottomC1.position.top);
            let ptBottomC2 = new CPoint(this.freeTransformHandleBottomC2.position.left, this.freeTransformHandleBottomC2.position.top);
            let rt = this.getTransformBounds();
            this.control.position.left = rt.left;
            this.control.position.top = rt.top;
            this.control.position.width = rt.width;
            this.control.position.height = rt.height;
            for (let n = 0; n < this.control.layers.length; n++) {
                for (let i = 0; i < this.control.layers.get(n).items.length; i++) {
                    let opd = this.__orgPathData.get(this.control.layers.get(n).items.get(i));
                    if (opd != undefined && this.__orgBounds != undefined) {
                        for (let x = 0; x < opd.length; x++) {
                            if (opd.get(x).pointKind == EPathPointKind.MOVETO ||
                                opd.get(x).pointKind == EPathPointKind.LINETO ||
                                opd.get(x).pointKind == EPathPointKind.CURVETO2 ||
                                opd.get(x).pointKind == EPathPointKind.CURVETO3) {
                                let pt = opd.get(x).point;
                                let tpt = CPoint.getTransformCurvePoint(this.__orgBounds, pt.toPoint(), ptLT, ptRT, ptLB, ptRB, ptLeftC1, ptLeftC2, ptTopC1, ptTopC2, ptRightC1, ptRightC2, ptBottomC1, ptBottomC2);
                                tpt.x -= this.control.position.left;
                                tpt.y -= this.control.position.top;
                                this.control.layers.get(n).items.get(i).pathData.get(x).point.x = tpt.x;
                                this.control.layers.get(n).items.get(i).pathData.get(x).point.y = tpt.y;
                                pt = opd.get(x).cPoint1;
                                tpt = CPoint.getTransformCurvePoint(this.__orgBounds, pt.toPoint(), ptLT, ptRT, ptLB, ptRB, ptLeftC1, ptLeftC2, ptTopC1, ptTopC2, ptRightC1, ptRightC2, ptBottomC1, ptBottomC2);
                                tpt.x -= this.control.position.left;
                                tpt.y -= this.control.position.top;
                                this.control.layers.get(n).items.get(i).pathData.get(x).cPoint1.x = tpt.x;
                                this.control.layers.get(n).items.get(i).pathData.get(x).cPoint1.y = tpt.y;
                                pt = opd.get(x).cPoint2;
                                tpt = CPoint.getTransformCurvePoint(this.__orgBounds, pt.toPoint(), ptLT, ptRT, ptLB, ptRB, ptLeftC1, ptLeftC2, ptTopC1, ptTopC2, ptRightC1, ptRightC2, ptBottomC1, ptBottomC2);
                                tpt.x -= this.control.position.left;
                                tpt.y -= this.control.position.top;
                                this.control.layers.get(n).items.get(i).pathData.get(x).cPoint2.x = tpt.x;
                                this.control.layers.get(n).items.get(i).pathData.get(x).cPoint2.y = tpt.y;
                            }
                        }
                    }
                    this.control.layers.get(n).items.get(i).pathData.width = this.control.position.width;
                    this.control.layers.get(n).items.get(i).pathData.height = this.control.position.height;
                }
            }
        }
        super.doPathDataTransform();
    }
    setControl(control) {
        if (control.layers.length > 0 && control.layers.get(0).items.length > 0) {
            let ci = control.layers.get(0).items.get(0);
            let w = ci.pathData.width;
            let h = ci.pathData.height;
            //this.control.position.width = w
            //this.control.position.height = h
            //this.control.position.left = (this.position.width - this.control.position.width) / 2            
            //this.control.position.top = (this.position.height - this.control.position.height) / 2
            this.control = control;
            this.__orgBounds = ci.pathData.getBounds();
            this.offTransform();
            this.freeTransformHandleLT.position.left = this.control.position.left; // - 20
            this.freeTransformHandleLT.position.top = this.control.position.top; // - 20
            this.freeTransformHandleRT.position.left = this.control.position.left + this.control.position.width;
            this.freeTransformHandleRT.position.top = this.control.position.top; // - 20
            this.freeTransformHandleLB.position.left = this.control.position.left; // - 20
            this.freeTransformHandleLB.position.top = this.control.position.top + this.control.position.height;
            this.freeTransformHandleRB.position.left = this.control.position.left + this.control.position.width;
            this.freeTransformHandleRB.position.top = this.control.position.top + this.control.position.height;
            this.onTransform();
            this.control.layers.fromData(control.layers.toData());
            this.__orgPathData.clear();
            for (let n = 0; n < this.control.layers.length; n++) {
                for (let i = 0; i < this.control.layers.get(n).items.length; i++) {
                    let ci = this.control.layers.get(n).items.get(i);
                    //ci.pathFitMode = EFitMode.ORIGINAL
                    ci.pathData.width = this.control.position.width;
                    ci.pathData.height = this.control.position.height;
                    ci.pathData.stretch(new CRect(0, 0, this.control.position.width, this.control.position.height));
                    let pd = new CPathPointList();
                    pd.fromData(ci.pathData.toData());
                    this.__orgPathData.set(ci, pd);
                }
            }
            this.draw();
            this.__orgHasPoint = control.hasPointerEvent;
            control.hasPointerEvent = false;
        }
    }
}
class CAnimationTransfomer extends CPathController {
    constructor(parent, name) {
        super(parent, name);
        this.__orgPathData = new Map();
        this.__orgBounds = new CRect();
        let self = this;
        this.btnSplit.onClick = function () {
            if (self.control != undefined) {
                for (let n = 0; n < self.control.layers.length; n++) {
                    for (let i = 0; i < self.control.layers.get(n).items.length; i++) {
                        self.control.layers.get(n).items.get(i).pathData.splitLine(parseInt(self.edtSplite.text));
                    }
                }
            }
        };
        this.btnSplitAll.visible = false;
        this.btnClose.onClick = function () {
            self.visible = false;
            self.control = undefined;
        };
    }
    doPathDataTransform() {
        if (this.control != undefined) {
            let ptLT = this.getLTPoint();
            let ptRT = this.getRTPoint();
            let ptLB = this.getLBPoint();
            let ptRB = this.getRBPoint();
            let ptLeftC1 = new CPoint(this.freeTransformHandleLeftC1.position.left, this.freeTransformHandleLeftC1.position.top);
            let ptLeftC2 = new CPoint(this.freeTransformHandleLeftC2.position.left, this.freeTransformHandleLeftC2.position.top);
            let ptTopC1 = new CPoint(this.freeTransformHandleTopC1.position.left, this.freeTransformHandleTopC1.position.top);
            let ptTopC2 = new CPoint(this.freeTransformHandleTopC2.position.left, this.freeTransformHandleTopC2.position.top);
            let ptRightC1 = new CPoint(this.freeTransformHandleRightC1.position.left, this.freeTransformHandleRightC1.position.top);
            let ptRightC2 = new CPoint(this.freeTransformHandleRightC2.position.left, this.freeTransformHandleRightC2.position.top);
            let ptBottomC1 = new CPoint(this.freeTransformHandleBottomC1.position.left, this.freeTransformHandleBottomC1.position.top);
            let ptBottomC2 = new CPoint(this.freeTransformHandleBottomC2.position.left, this.freeTransformHandleBottomC2.position.top);
            let rt = this.getTransformBounds();
            this.control.transformerPoints.leftTop.x = ptLT.x;
            this.control.transformerPoints.leftTop.y = ptLT.y;
            this.control.transformerPoints.leftBottom.x = ptLB.x;
            this.control.transformerPoints.leftBottom.y = ptLB.y;
            this.control.transformerPoints.rightTop.x = ptRT.x;
            this.control.transformerPoints.rightTop.y = ptRT.y;
            this.control.transformerPoints.rightBottom.x = ptRB.x;
            this.control.transformerPoints.rightBottom.y = ptRB.y;
            this.control.transformerPoints.leftC1.x = ptLeftC1.x;
            this.control.transformerPoints.leftC1.y = ptLeftC1.y;
            this.control.transformerPoints.leftC2.x = ptLeftC2.x;
            this.control.transformerPoints.leftC2.y = ptLeftC2.y;
            this.control.transformerPoints.topC1.x = ptTopC1.x;
            this.control.transformerPoints.topC1.y = ptTopC1.y;
            this.control.transformerPoints.topC2.x = ptTopC2.x;
            this.control.transformerPoints.topC2.y = ptTopC2.y;
            this.control.transformerPoints.rightC1.x = ptRightC1.x;
            this.control.transformerPoints.rightC1.y = ptRightC1.y;
            this.control.transformerPoints.rightC2.x = ptRightC2.x;
            this.control.transformerPoints.rightC2.y = ptRightC2.y;
            this.control.transformerPoints.bottomC1.x = ptBottomC1.x;
            this.control.transformerPoints.bottomC1.y = ptBottomC1.y;
            this.control.transformerPoints.bottomC2.x = ptBottomC2.x;
            this.control.transformerPoints.bottomC2.y = ptBottomC2.y;
            //this.control.position.left = rt.left
            //this.control.position.top = rt.top
            //this.control.position.width = rt.width
            //this.control.position.height = rt.height
        }
        super.doPathDataTransform();
    }
    setControl(control) {
        if (control.layers.length > 0 && control.layers.get(0).items.length > 0) {
            let ci = control.layers.get(0).items.get(0);
            let w = ci.pathData.width;
            let h = ci.pathData.height;
            //this.control.position.width = w
            //this.control.position.height = h
            //this.control.position.left = (this.position.width - this.control.position.width) / 2            
            //this.control.position.top = (this.position.height - this.control.position.height) / 2
            this.control = control;
            this.__orgBounds = ci.pathData.getBounds();
            this.offTransform();
            this.freeTransformHandleLT.position.left = this.control.position.left - 20;
            this.freeTransformHandleLT.position.top = this.control.position.top - 20;
            this.freeTransformHandleRT.position.left = this.control.position.left + this.control.position.width;
            this.freeTransformHandleRT.position.top = this.control.position.top - 20;
            this.freeTransformHandleLB.position.left = this.control.position.left - 20;
            this.freeTransformHandleLB.position.top = this.control.position.top + this.control.position.height;
            this.freeTransformHandleRB.position.left = this.control.position.left + this.control.position.width;
            this.freeTransformHandleRB.position.top = this.control.position.top + this.control.position.height;
            this.onTransform();
            this.draw();
            this.control.layers.fromData(control.layers.toData());
            this.__orgPathData.clear();
            for (let n = 0; n < this.control.layers.length; n++) {
                for (let i = 0; i < this.control.layers.get(n).items.length; i++) {
                    let ci = this.control.layers.get(n).items.get(i);
                    ci.pathFitMode = EFitMode.ORIGINAL;
                    let pd = new CPathPointList();
                    pd.fromData(ci.pathData.toData());
                    this.__orgPathData.set(ci, pd);
                }
            }
        }
    }
}
class CTransformerFrame extends CPanel {
    constructor(parent, name) {
        super(parent, name);
        this.__orgPathData = new Map();
        this.__orgBounds = new CRect();
        this.control = new CCanvasLayerControl(this);
        this.transformer = new CPathController(this);
        let self = this;
        //this.control.position.align = EPositionAlign.CENTER
        this.transformer.resource = "path_controller.control";
        this.transformer.position.align = EPositionAlign.CLIENT;
        this.transformer.onFreeTransformHandleTrack = function () {
            self.doTransform();
        };
        this.transformer.btnSplit.onClick = function () {
        };
        this.transformer.btnSplitAll.onClick = function () {
        };
        this.transformer.btnClose.onClick = function () {
        };
    }
    doTransform() {
        let ptLT = this.transformer.getLTPoint();
        let ptRT = this.transformer.getRTPoint();
        let ptLB = this.transformer.getLBPoint();
        let ptRB = this.transformer.getRBPoint();
        let ptLeftC1 = new CPoint(this.transformer.freeTransformHandleLeftC1.position.left, this.transformer.freeTransformHandleLeftC1.position.top);
        let ptLeftC2 = new CPoint(this.transformer.freeTransformHandleLeftC2.position.left, this.transformer.freeTransformHandleLeftC2.position.top);
        let ptTopC1 = new CPoint(this.transformer.freeTransformHandleTopC1.position.left, this.transformer.freeTransformHandleTopC1.position.top);
        let ptTopC2 = new CPoint(this.transformer.freeTransformHandleTopC2.position.left, this.transformer.freeTransformHandleTopC2.position.top);
        let ptRightC1 = new CPoint(this.transformer.freeTransformHandleRightC1.position.left, this.transformer.freeTransformHandleRightC1.position.top);
        let ptRightC2 = new CPoint(this.transformer.freeTransformHandleRightC2.position.left, this.transformer.freeTransformHandleRightC2.position.top);
        let ptBottomC1 = new CPoint(this.transformer.freeTransformHandleBottomC1.position.left, this.transformer.freeTransformHandleBottomC1.position.top);
        let ptBottomC2 = new CPoint(this.transformer.freeTransformHandleBottomC2.position.left, this.transformer.freeTransformHandleBottomC2.position.top);
        let rt = this.transformer.getTransformBounds();
        for (let n = 0; n < this.control.layers.length; n++) {
            for (let i = 0; i < this.control.layers.get(n).items.length; i++) {
                let opd = this.__orgPathData.get(this.control.layers.get(n).items.get(i));
                if (opd != undefined && this.__orgBounds != undefined) {
                    for (let x = 0; x < opd.length; x++) {
                        if (opd.get(x).pointKind == EPathPointKind.MOVETO ||
                            opd.get(x).pointKind == EPathPointKind.LINETO ||
                            opd.get(x).pointKind == EPathPointKind.CURVETO2 ||
                            opd.get(x).pointKind == EPathPointKind.CURVETO3) {
                            let pt = opd.get(x).point;
                            let tpt = CPoint.getTransformCurvePoint(this.__orgBounds, pt.toPoint(), ptLT, ptRT, ptLB, ptRB, ptLeftC1, ptLeftC2, ptTopC1, ptTopC2, ptRightC1, ptRightC2, ptBottomC1, ptBottomC2);
                            tpt.x -= this.control.position.left;
                            tpt.y -= this.control.position.top;
                            this.control.layers.get(n).items.get(i).pathData.get(x).point.x = tpt.x;
                            this.control.layers.get(n).items.get(i).pathData.get(x).point.y = tpt.y;
                            pt = opd.get(x).cPoint1;
                            tpt = CPoint.getTransformCurvePoint(this.__orgBounds, pt.toPoint(), ptLT, ptRT, ptLB, ptRB, ptLeftC1, ptLeftC2, ptTopC1, ptTopC2, ptRightC1, ptRightC2, ptBottomC1, ptBottomC2);
                            tpt.x -= this.control.position.left;
                            tpt.y -= this.control.position.top;
                            this.control.layers.get(n).items.get(i).pathData.get(x).cPoint1.x = tpt.x;
                            this.control.layers.get(n).items.get(i).pathData.get(x).cPoint1.y = tpt.y;
                            pt = opd.get(x).cPoint2;
                            tpt = CPoint.getTransformCurvePoint(this.__orgBounds, pt.toPoint(), ptLT, ptRT, ptLB, ptRB, ptLeftC1, ptLeftC2, ptTopC1, ptTopC2, ptRightC1, ptRightC2, ptBottomC1, ptBottomC2);
                            tpt.x -= this.control.position.left;
                            tpt.y -= this.control.position.top;
                            this.control.layers.get(n).items.get(i).pathData.get(x).cPoint2.x = tpt.x;
                            this.control.layers.get(n).items.get(i).pathData.get(x).cPoint2.y = tpt.y;
                        }
                    }
                }
            }
        }
        this.control.position.left = rt.left;
        this.control.position.top = rt.top;
        this.control.position.width = rt.width;
        this.control.position.height = rt.height;
    }
    setControl(control) {
        if (control.layers.length > 0 && control.layers.get(0).items.length > 0) {
            let ci = control.layers.get(0).items.get(0);
            let w = ci.pathData.width;
            let h = ci.pathData.height;
            this.control.position.width = w;
            this.control.position.height = h;
            this.control.position.left = (this.position.width - this.control.position.width) / 2;
            this.control.position.top = (this.position.height - this.control.position.height) / 2;
            this.control = control;
            this.__orgBounds = ci.pathData.getBounds();
            this.transformer.offTransform();
            this.transformer.freeTransformHandleLT.position.left = this.control.position.left - 20;
            this.transformer.freeTransformHandleLT.position.top = this.control.position.top - 20;
            this.transformer.freeTransformHandleRT.position.left = this.control.position.left + this.control.position.width;
            this.transformer.freeTransformHandleRT.position.top = this.control.position.top - 20;
            this.transformer.freeTransformHandleLB.position.left = this.control.position.left - 20;
            this.transformer.freeTransformHandleLB.position.top = this.control.position.top + this.control.position.height;
            this.transformer.freeTransformHandleRB.position.left = this.control.position.left + this.control.position.width;
            this.transformer.freeTransformHandleRB.position.top = this.control.position.top + this.control.position.height;
            this.transformer.onTransform();
            this.transformer.draw();
            this.control.layers.fromData(control.layers.toData());
            this.__orgPathData.clear();
            for (let n = 0; n < this.control.layers.length; n++) {
                for (let i = 0; i < this.control.layers.get(n).items.length; i++) {
                    let ci = this.control.layers.get(n).items.get(i);
                    ci.pathFitMode = EFitMode.ORIGINAL;
                    let pd = new CPathPointList();
                    pd.fromData(ci.pathData.toData());
                    this.__orgPathData.set(ci, pd);
                }
            }
        }
    }
}
var EPathItemAddKind;
(function (EPathItemAddKind) {
    EPathItemAddKind[EPathItemAddKind["NORMAL"] = 0] = "NORMAL";
    EPathItemAddKind[EPathItemAddKind["PATTERN"] = 1] = "PATTERN";
    EPathItemAddKind[EPathItemAddKind["ROTATION"] = 2] = "ROTATION";
    EPathItemAddKind[EPathItemAddKind["RANDOM"] = 3] = "RANDOM";
})(EPathItemAddKind || (EPathItemAddKind = {}));
var EPathItemItemKind;
(function (EPathItemItemKind) {
    EPathItemItemKind[EPathItemItemKind["EMPTY"] = 0] = "EMPTY";
    EPathItemItemKind[EPathItemItemKind["ELLIPSE"] = 1] = "ELLIPSE";
    EPathItemItemKind[EPathItemItemKind["RECTANGLE"] = 2] = "RECTANGLE";
    EPathItemItemKind[EPathItemItemKind["POLIGON"] = 3] = "POLIGON";
    EPathItemItemKind[EPathItemItemKind["HORN"] = 4] = "HORN";
    EPathItemItemKind[EPathItemItemKind["TEXT"] = 5] = "TEXT";
    EPathItemItemKind[EPathItemItemKind["ETC"] = 6] = "ETC";
})(EPathItemItemKind || (EPathItemItemKind = {}));
class CPathItem extends CNotifyChangeNotifyObject {
    get name() {
        return this._name;
    }
    set name(value) {
        if (this._name != value) {
            this._name = value;
            this.doChange();
        }
    }
    get kind() {
        return this._kind;
    }
    set kind(value) {
        if (this._kind != value) {
            this._kind = value;
            this.doChange();
        }
    }
    get visible() {
        return this._visible;
    }
    set visible(value) {
        if (this._visible != value) {
            this._visible = value;
            this.doChange();
        }
    }
    get group() {
        return this._group;
    }
    set group(value) {
        if (this._group != value) {
            this._group = value;
            this.doChange();
        }
    }
    constructor() {
        super();
        this._name = CSequence.getSequence("item");
        this._kind = "";
        this._visible = true;
        this._group = false;
        //public bounds = new CNotifyRect()
        this.pathData = new CPathPointList();
        this.childs = new CPathItems();
        this.fill = new CFillSet();
        this.stroke = new CStrokeSet();
        this.opacity = 1;
        this.shadowBlur = 0;
        this.shadowColor = "";
        this.shadowOffsetX = 0;
        this.shadowOffsetY = 0;
        this.composite = "source-over";
        this.text = "";
        this.textSet = new CTextSet();
        let self = this;
        /*this.bounds.onChange = function() {
            self.doChange()
        }*/
        this.childs.parent = this;
        this.childs.onChange = function () {
            self.doChange();
        };
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "name", this.name, "");
        CDataClass.putData(data, "kind", this.kind, "");
        CDataClass.putData(data, "pathData", this.pathData.toData(), {}, true);
        CDataClass.putData(data, "childs", this.childs.toData(), {}, true);
        CDataClass.putData(data, "fill", this.fill.toData(), {}, true);
        CDataClass.putData(data, "stroke", this.stroke.toData(), {}, true);
        CDataClass.putData(data, "opacity", this.opacity, 1);
        CDataClass.putData(data, "shadowBlur", this.shadowBlur, 0);
        CDataClass.putData(data, "shadowColor", this.shadowColor, "");
        CDataClass.putData(data, "shadowOffsetX", this.shadowOffsetX, 0);
        CDataClass.putData(data, "shadowOffsetY", this.shadowOffsetY, 0);
        CDataClass.putData(data, "composite", this.composite, "source-over");
        CDataClass.putData(data, "visible", this.visible, true);
        CDataClass.putData(data, "group", this.group, false);
    }
    doFromData(data) {
        super.doFromData(data);
        this.name = CDataClass.getData(data, "name", "");
        this.kind = CDataClass.getData(data, "kind", "");
        this.pathData.fromData(CDataClass.getData(data, "pathData", {}, true));
        this.childs.fromData(CDataClass.getData(data, "childs", {}, true));
        this.fill.fromData(CDataClass.getData(data, "fill", {}, true));
        this.stroke.fromData(CDataClass.getData(data, "stroke", {}, true));
        this.opacity = CDataClass.getData(data, "opacity", 1);
        this.shadowBlur = CDataClass.getData(data, "shadowBlur", 0);
        this.shadowColor = CDataClass.getData(data, "shadowColor", "");
        this.shadowOffsetX = CDataClass.getData(data, "shadowOffsetX", 0);
        this.shadowOffsetY = CDataClass.getData(data, "shadowOffsetY", 0);
        this.composite = CDataClass.getData(data, "composite", "source-over");
        this.visible = CDataClass.getData(data, "visible", true);
        this.group = CDataClass.getData(data, "group", false);
    }
    getData() {
        let rt = new CPathPointList();
        function fn(item) {
            rt.addPointList(item.pathData);
            for (let n = 0; n < item.childs.length; n++) {
                fn(item.childs.get(n));
            }
        }
        fn(this);
        return rt;
    }
    rotate(center, angle, isKeepAngle = false) {
        function r(item, center, angle) {
            item.pathData.rotate(center, angle);
            if (isKeepAngle) {
                let rt = item.pathData.getBounds();
                item.pathData.rotate(new CPoint(rt.left + (rt.width / 2), rt.top + (rt.height / 2)), -angle);
            }
            for (let n = 0; n < item.childs.length; n++) {
                r(item.childs.get(n), center, angle);
            }
        }
        r(this, center, angle);
    }
    loopPathItem(fn) {
        function loop(item) {
            fn(item);
            for (let n = 0; n < item.childs.length; n++) {
                loop(item.childs.get(n));
            }
        }
        loop(this);
    }
    toCanvasItems(width, height) {
        let items = new CCanvasItems();
        function newCanvasItem() {
            let rt = items.addItem();
            rt.kind = ECanvasItemKind.PATH;
            rt.pathFitMode = EFitMode.STRETCH;
            return rt;
        }
        function copyItem(ci, pi) {
            ci.pathData.addPointList(pi.pathData);
            ci.fill.fromData(pi.fill.toData());
            ci.stroke.fromData(pi.stroke.toData());
            ci.opacity = pi.opacity;
            ci.shadowBlur = pi.shadowBlur;
            ci.shadowColor = pi.shadowColor;
            ci.shadowOffsetX = pi.shadowOffsetX;
            ci.shadowOffsetY = pi.shadowOffsetY;
            (new Function("ci", "pi", "ci.composite = pi.composite"))(ci, pi);
            ci.text = pi.text;
            ci.name = pi.name;
            ci.textSet.fromData(pi.textSet.toData());
        }
        this.loopPathItem(function (item) {
            if (item.visible) {
                let it = newCanvasItem();
                copyItem(it, item);
                it.pathData.width = width;
                it.pathData.height = height;
            }
        });
        return items;
    }
    scale(x, y) {
        this.loopPathItem(function (it) {
            it.pathData.scale(x, y);
        });
    }
    stretch(bounds) {
        let org = this.pathData.getBounds();
        this.pathData.stretchIgnoreSize(bounds);
        let after = this.pathData.getBounds();
        let sx = after.width / org.width;
        let sy = after.height / org.height;
        for (let n = 0; n < this.childs.length; n++) {
            let corg = this.childs.get(n).pathData.getBounds();
            if (corg.isEmpty()) {
                this.childs.get(n).stretch(bounds);
            }
            else {
                if (org.isEmpty()) {
                    let x = ((corg.left - bounds.left) * sx) + after.left;
                    let y = ((corg.top - org.top) * sy) + after.top;
                    let rt = new CRect(x, y, x + (corg.width * sx), y + (corg.height * sy));
                    this.childs.get(n).stretch(rt);
                }
                else {
                    let x = ((corg.left - org.left) * sx) + after.left;
                    let y = ((corg.top - org.top) * sy) + after.top;
                    let rt = new CRect(x, y, x + (corg.width * sx), y + (corg.height * sy));
                    this.childs.get(n).stretch(rt);
                }
            }
        }
        /*let org = this.getBounds()
        let x = bounds.left - org.left
        let y = bounds.top - org.top
        let sx = bounds.width / org.width
        let sy = bounds.height / org.height
        this.loopPathItem(function(it) {
            it.pathData.scale(sx, sy)
            it.pathData.movePoint(x, y)
        })
        let af = this.getBounds()*/
    }
    movePoint(x, y) {
        this.loopPathItem(function (it) {
            it.pathData.movePoint(x, y);
        });
    }
    getBounds() {
        let l = Number.MAX_VALUE;
        let t = Number.MAX_VALUE;
        let r = Number.MIN_VALUE;
        let b = Number.MIN_VALUE;
        this.loopPathItem(function (it) {
            let rt = it.pathData.getBounds();
            if (!rt.isEmpty()) {
                if (rt.left < l)
                    l = rt.left;
                if (rt.top < t)
                    t = rt.top;
                if (rt.right > r)
                    r = rt.right;
                if (rt.bottom > b)
                    b = rt.bottom;
            }
        });
        if (l == Number.MAX_VALUE,
            t == Number.MAX_VALUE,
            r == Number.MIN_VALUE,
            b == Number.MIN_VALUE) {
            return new CRect();
        }
        else {
            return new CRect(l, t, r, b);
        }
    }
}
class CPathItems extends CList {
    doToData(data) {
        super.doToData(data);
        let arr = [];
        for (let n = 0; n < this.length; n++) {
            arr.push(this.get(n).toData());
        }
        CDataClass.putData(data, "items", arr, [], true);
    }
    doFromData(data) {
        super.doFromData(data);
        this.clear();
        let arr = CDataClass.getData(data, "items", [], true);
        for (let n = 0; n < arr.length; n++) {
            let item = this.addItem();
            item.fromData(arr[n]);
        }
    }
    toData() {
        let o = {};
        this.doToData(o);
        return o;
    }
    addItem() {
        let it = new CPathItem();
        this.add(it);
        it.parent = this.parent;
        return it;
    }
}
class CCustomPathItemProperties extends CFold {
    get item() {
        return this._item;
    }
    set item(value) {
        if (this._item != value) {
            this._item = value;
            this.doSetPathItem();
        }
    }
    doSetPathItem() { }
}
class CBasePathItemProperties extends CCustomPathItemProperties {
    constructor(parent, name) {
        super(parent, name);
        this.lblName = new CPanel(this.body);
        this.edtName = new CTextBox(this.lblName);
        this.l = new CPanel(this.body);
        this.btnFill = new CButton(this.l);
        this.btnStroke = new CButton(this.l);
        this.lblOpacity = new CPanel(this.body);
        this.edtOpacity = new CTextBox(this.lblOpacity);
        this.lblShadowBlur = new CPanel(this.body);
        this.edtShadowBlur = new CTextBox(this.lblShadowBlur);
        this.lblShadowColor = new CPanel(this.body);
        this.edtShadowColor = new CTextBox(this.lblShadowColor);
        this.lblShadowOffsetX = new CPanel(this.body);
        this.edtShadowOffsetX = new CTextBox(this.lblShadowOffsetX);
        this.lblShadowOffsetY = new CPanel(this.body);
        this.edtShadowOffsetY = new CTextBox(this.lblShadowOffsetY);
        this.comboComposite = new CComboBox(this.body);
        this.lblText = new CPanel(this.body);
        this.edtText = new CTextBox(this.lblText);
        this.btnTextSet = new CButton(this.body);
        this.btnGroup = new CSelectBox(this.body);
        this.btnVisible = new CSelectBox(this.body);
        this.btnApply = new CButton(this.body);
        let self = this;
        this.lblName.propertyName = "lblName";
        this.edtName.propertyName = "edtName";
        this.btnFill.propertyName = "btnFill";
        this.btnStroke.propertyName = "btnStroke";
        this.lblOpacity.propertyName = "lblOpacity";
        this.edtOpacity.propertyName = "edtOpacity";
        this.lblShadowBlur.propertyName = "lblShadowBlur";
        this.edtShadowBlur.propertyName = "edtShadowBlur";
        this.lblShadowColor.propertyName = "lblShadowColor";
        this.edtShadowColor.propertyName = "edtShadowColor";
        this.lblShadowOffsetX.propertyName = "lblShadowOffsetX";
        this.edtShadowOffsetX.propertyName = "edtShadowOffsetX";
        this.lblShadowOffsetY.propertyName = "lblShadowOffsetY";
        this.edtShadowOffsetY.propertyName = "edtShadowOffsetY";
        this.lblText.propertyName = "lblText";
        this.edtText.propertyName = "edtText";
        this.btnTextSet.propertyName = "btnTextSet";
        this.btnApply.propertyName = "btnApply";
        this.comboComposite.items.add("source-over");
        this.comboComposite.items.add("source-in");
        this.comboComposite.items.add("source-out");
        this.comboComposite.items.add("source-atop");
        this.comboComposite.items.add("destination-over");
        this.comboComposite.items.add("destination-in");
        this.comboComposite.items.add("destination-out");
        this.comboComposite.items.add("destination-atop");
        this.comboComposite.items.add("lighter");
        this.comboComposite.items.add("darker");
        this.comboComposite.items.add("xor");
        this.comboComposite.items.add("copy");
        this.comboComposite.onChangeItem = function () {
            if (self.item != undefined) {
                self.item.composite = self.comboComposite.text;
                self.applyEditor();
            }
        };
        let cover = CSystem.browserCovers.get("cover");
        this.btnFill.onClick = function () {
            if (self.item == undefined) {
                CSystem.showMessage("Warning", "Select item");
            }
            else {
                let ed = new CFillEditorFrame(cover);
                ed.position.align = EPositionAlign.CENTER;
                ed.fill = self.item.fill;
                if (cover != undefined) {
                    cover.isHideClear = true;
                    cover.onHide = function () {
                        self.applyEditor();
                    };
                    cover.showCover();
                }
            }
        };
        this.btnStroke.onClick = function () {
            if (self.item == undefined) {
                CSystem.showMessage("Warning", "Select item");
            }
            else {
                let ed = new CStrokeEditorFrame(cover);
                ed.position.align = EPositionAlign.CENTER;
                ed.stroke = self.item.stroke;
                if (cover != undefined) {
                    cover.isHideClear = true;
                    cover.onHide = function () {
                        self.applyEditor();
                    };
                    cover.showCover();
                }
            }
        };
        function keydown(sender, e) {
            if (e.key == "Enter")
                self.btnApply.click();
        }
        this.edtName.onKeyDown = keydown;
        this.edtOpacity.onKeyDown = keydown;
        this.edtShadowBlur.onKeyDown = keydown;
        this.edtShadowColor.onKeyDown = keydown;
        this.edtShadowOffsetX.onKeyDown = keydown;
        this.edtShadowOffsetY.onKeyDown = keydown;
        this.edtText.onKeyDown = keydown;
        this.btnTextSet.onClick = function () {
            let ed = new CBasePropertyEditor(CSystem.desktopList.get(0).applicationLayer);
            ed.instance = self.item?.textSet;
            ed.showCenter(300, 400, "Text Setting", "remove");
        };
        this.btnApply.onClick = function () {
            let b = false;
            if (self.item != undefined) {
                if (self.item.name != self.edtName.text)
                    b = true;
                self.item.name = self.edtName.text;
                self.item.opacity = parseFloat(self.edtOpacity.text);
                self.item.shadowBlur = parseFloat(self.edtShadowBlur.text);
                self.item.shadowColor = self.edtShadowColor.text;
                self.item.shadowOffsetX = parseFloat(self.edtShadowOffsetX.text);
                self.item.shadowOffsetY = parseFloat(self.edtShadowOffsetY.text);
                self.item.text = self.edtText.text;
                if (self.item.group != self.btnGroup.selected)
                    b = true;
                self.item.group = self.btnGroup.selected;
                self.item.visible = self.btnVisible.selected;
            }
            self.applyEditor(b);
        };
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "lblName", this.lblName.toData(), {}, true);
        CDataClass.putData(data, "edtName", this.edtName.toData(), {}, true);
        CDataClass.putData(data, "l", this.l.toData(), {}, true);
        CDataClass.putData(data, "btnFill", this.btnFill.toData(), {}, true);
        CDataClass.putData(data, "btnStroke", this.btnStroke.toData(), {}, true);
        CDataClass.putData(data, "lblOpacity", this.lblOpacity.toData(), {}, true);
        CDataClass.putData(data, "edtOpacity", this.edtOpacity.toData(), {}, true);
        CDataClass.putData(data, "lblShadowBlur", this.lblShadowBlur.toData(), {}, true);
        CDataClass.putData(data, "edtShadowBlur", this.edtShadowBlur.toData(), {}, true);
        CDataClass.putData(data, "lblShadowColor", this.lblShadowColor.toData(), {}, true);
        CDataClass.putData(data, "edtShadowColor", this.edtShadowColor.toData(), {}, true);
        CDataClass.putData(data, "lblShadowOffsetX", this.lblShadowOffsetX.toData(), {}, true);
        CDataClass.putData(data, "edtShadowOffsetX", this.edtShadowOffsetX.toData(), {}, true);
        CDataClass.putData(data, "lblShadowOffsetY", this.lblShadowOffsetY.toData(), {}, true);
        CDataClass.putData(data, "edtShadowOffsetY", this.edtShadowOffsetY.toData(), {}, true);
        CDataClass.putData(data, "comboComposite", this.comboComposite.toData(), {}, true);
        CDataClass.putData(data, "lblText", this.lblText.toData(), {}, true);
        CDataClass.putData(data, "edtText", this.edtText.toData(), {}, true);
        CDataClass.putData(data, "btnTextSet", this.btnTextSet.toData(), {}, true);
        CDataClass.putData(data, "btnGroup", this.btnGroup.toData(), {}, true);
        CDataClass.putData(data, "btnVisible", this.btnVisible.toData(), {}, true);
        CDataClass.putData(data, "btnApply", this.btnApply.toData(), {}, true);
    }
    doFromData(data) {
        super.doFromData(data);
        this.lblName.fromData(CDataClass.getData(data, "lblName", {}, true));
        this.edtName.fromData(CDataClass.getData(data, "edtName", {}, true));
        this.l.fromData(CDataClass.getData(data, "l", {}, true));
        this.btnFill.fromData(CDataClass.getData(data, "btnFill", {}, true));
        this.btnStroke.fromData(CDataClass.getData(data, "btnStroke", {}, true));
        this.lblOpacity.fromData(CDataClass.getData(data, "lblOpacity", {}, true));
        this.edtOpacity.fromData(CDataClass.getData(data, "edtOpacity", {}, true));
        this.lblShadowBlur.fromData(CDataClass.getData(data, "lblShadowBlur", {}, true));
        this.edtShadowBlur.fromData(CDataClass.getData(data, "edtShadowBlur", {}, true));
        this.lblShadowColor.fromData(CDataClass.getData(data, "lblShadowColor", {}, true));
        this.edtShadowColor.fromData(CDataClass.getData(data, "edtShadowColor", {}, true));
        this.lblShadowOffsetX.fromData(CDataClass.getData(data, "lblShadowOffsetX", {}, true));
        this.edtShadowOffsetX.fromData(CDataClass.getData(data, "edtShadowOffsetX", {}, true));
        this.lblShadowOffsetY.fromData(CDataClass.getData(data, "lblShadowOffsetY", {}, true));
        this.edtShadowOffsetY.fromData(CDataClass.getData(data, "edtShadowOffsetY", {}, true));
        this.comboComposite.fromData(CDataClass.getData(data, "comboComposite", {}, true));
        this.lblText.fromData(CDataClass.getData(data, "lblText", {}, true));
        this.edtText.fromData(CDataClass.getData(data, "edtText", {}, true));
        this.btnTextSet.fromData(CDataClass.getData(data, "btnTextSet", {}, true));
        this.btnGroup.fromData(CDataClass.getData(data, "btnGroup", {}, true));
        this.btnVisible.fromData(CDataClass.getData(data, "btnVisible", {}, true));
        this.btnApply.fromData(CDataClass.getData(data, "btnApply", {}, true));
    }
    doSetPathItem() {
        super.doSetPathItem();
        if (this._item != undefined) {
            this.edtName.text = this._item.name;
            this.edtOpacity.text = this._item.opacity + "";
            this.edtShadowBlur.text = this._item.shadowBlur + "";
            this.edtShadowColor.text = this._item.shadowColor;
            this.edtShadowOffsetX.text = this._item.shadowOffsetX + "";
            this.edtShadowOffsetY.text = this._item.shadowOffsetY + "";
            this.edtText.text = this._item.text;
            if (this._item.composite == "source-over")
                this.comboComposite.itemIndex = 0;
            if (this._item.composite == "source-in")
                this.comboComposite.itemIndex = 1;
            if (this._item.composite == "source-out")
                this.comboComposite.itemIndex = 2;
            if (this._item.composite == "source-atop")
                this.comboComposite.itemIndex = 3;
            if (this._item.composite == "destination-over")
                this.comboComposite.itemIndex = 4;
            if (this._item.composite == "destination-in")
                this.comboComposite.itemIndex = 5;
            if (this._item.composite == "destination-out")
                this.comboComposite.itemIndex = 6;
            if (this._item.composite == "destination-atop")
                this.comboComposite.itemIndex = 7;
            if (this._item.composite == "lighter")
                this.comboComposite.itemIndex = 8;
            if (this._item.composite == "darker")
                this.comboComposite.itemIndex = 9;
            if (this._item.composite == "xor")
                this.comboComposite.itemIndex = 10;
            if (this._item.composite == "copy")
                this.comboComposite.itemIndex = 11;
            this.btnGroup.selected = this._item.group;
            this.btnVisible.selected = this._item.visible;
        }
    }
    applyEditor(isRefresh = false) {
        if (this.editor != undefined) {
            if (isRefresh) {
                this.editor.refresh(true);
            }
            this.editor.doPaint();
        }
    }
}
class CRectanglePathItemProperties extends CCustomPathItemProperties {
    constructor(parent, name) {
        super(parent, name);
        this.lblRadiusX = new CPanel(this.body);
        this.edtRadiusX = new CTextBox(this.lblRadiusX);
        this.lblRadiusY = new CPanel(this.body);
        this.edtRadiusY = new CTextBox(this.lblRadiusY);
        this.lblDisableLine = new CPanel(this.body);
        this.l1 = new CPanel(this.body);
        this.btnLeft = new CSelectBox(this.l1);
        this.btnTop = new CSelectBox(this.l1);
        this.btnRight = new CSelectBox(this.l1);
        this.btnBottom = new CSelectBox(this.l1);
        this.lblDisableRound = new CPanel(this.body);
        this.l2 = new CPanel(this.body);
        this.btnLeftTop = new CSelectBox(this.l2);
        this.btnRightTop = new CSelectBox(this.l2);
        this.btnLeftBottom = new CSelectBox(this.l2);
        this.btnRightBottom = new CSelectBox(this.l2);
        this.btnApply = new CButton(this.body);
        let self = this;
        this.lblRadiusX.propertyName = "lblRadiusX";
        this.edtRadiusX.propertyName = "edtRadiusX";
        this.lblRadiusY.propertyName = "lblRadiusY";
        this.edtRadiusY.propertyName = "edtRadiusY";
        this.lblDisableLine.propertyName = "lblDisableLine";
        this.l1.propertyName = "l1";
        this.btnLeft.propertyName = "btnLeft";
        this.btnTop.propertyName = "btnTop";
        this.btnRight.propertyName = "btnRight";
        this.btnBottom.propertyName = "btnBottom";
        this.lblDisableRound.propertyName = "lblDisableRound";
        this.l2.propertyName = "l2";
        this.btnLeftTop.propertyName = "btnLeftTop";
        this.btnRightTop.propertyName = "btnRightTop";
        this.btnLeftBottom.propertyName = "btnLeftBottom";
        this.btnRightBottom.propertyName = "btnRightBottom";
        this.btnApply.propertyName = "btnApply";
        this.btnApply.onClick = function () {
            if (self.item != undefined) {
                let s1 = new CStringSet();
                if (self.btnLeft.selected)
                    s1.add("left");
                if (self.btnTop.selected)
                    s1.add("top");
                if (self.btnRight.selected)
                    s1.add("right");
                if (self.btnBottom.selected)
                    s1.add("bottom");
                let s2 = new CStringSet();
                if (self.btnLeftTop.selected)
                    s2.add("leftTop");
                if (self.btnLeftBottom.selected)
                    s2.add("leftBottom");
                if (self.btnRightTop.selected)
                    s2.add("rightTop");
                if (self.btnRightBottom.selected)
                    s2.add("rightBottom");
                if (self.editor != undefined) {
                    self.item.pathData.clear();
                    self.item.pathData.makeRoundRectData(self.editor.selector.position.left + 10, self.editor.selector.position.top + 10, self.editor.selector.position.width - 20, self.editor.selector.position.height - 20, parseInt(self.edtRadiusX.text), parseInt(self.edtRadiusY.text), s2, s1, false);
                    self.editor.doPaint();
                }
            }
            else {
                CSystem.showMessage("Warning", "Select item");
            }
        };
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "lblRadiusX", this.lblRadiusX.toData(), {}, true);
        CDataClass.putData(data, "edtRadiusX", this.edtRadiusX.toData(), {}, true);
        CDataClass.putData(data, "lblRadiusY", this.lblRadiusY.toData(), {}, true);
        CDataClass.putData(data, "edtRadiusY", this.edtRadiusY.toData(), {}, true);
        CDataClass.putData(data, "lblDisableLine", this.lblDisableLine.toData(), {}, true);
        CDataClass.putData(data, "l1", this.l1.toData(), {}, true);
        CDataClass.putData(data, "btnLeft", this.btnLeft.toData(), {}, true);
        CDataClass.putData(data, "btnTop", this.btnTop.toData(), {}, true);
        CDataClass.putData(data, "btnRight", this.btnRight.toData(), {}, true);
        CDataClass.putData(data, "btnBottom", this.btnBottom.toData(), {}, true);
        CDataClass.putData(data, "lblDisableRound", this.lblDisableRound.toData(), {}, true);
        CDataClass.putData(data, "l2", this.l2.toData(), {}, true);
        CDataClass.putData(data, "btnLeftTop", this.btnLeftTop.toData(), {}, true);
        CDataClass.putData(data, "btnRightTop", this.btnRightTop.toData(), {}, true);
        CDataClass.putData(data, "btnLeftBottom", this.btnLeftBottom.toData(), {}, true);
        CDataClass.putData(data, "btnRightBottom", this.btnRightBottom.toData(), {}, true);
        CDataClass.putData(data, "btnApply", this.btnApply.toData(), {}, true);
    }
    doFromData(data) {
        super.doFromData(data);
        this.lblRadiusX.fromData(CDataClass.getData(data, "lblRadiusX", {}, true));
        this.edtRadiusX.fromData(CDataClass.getData(data, "edtRadiusX", {}, true));
        this.lblRadiusY.fromData(CDataClass.getData(data, "lblRadiusY", {}, true));
        this.edtRadiusY.fromData(CDataClass.getData(data, "edtRadiusY", {}, true));
        this.lblDisableLine.fromData(CDataClass.getData(data, "lblDisableLine", {}, true));
        this.l1.fromData(CDataClass.getData(data, "l1", {}, true));
        this.btnLeft.fromData(CDataClass.getData(data, "btnLeft", {}, true));
        this.btnTop.fromData(CDataClass.getData(data, "btnTop", {}, true));
        this.btnRight.fromData(CDataClass.getData(data, "btnRight", {}, true));
        this.btnBottom.fromData(CDataClass.getData(data, "btnBottom", {}, true));
        this.lblDisableRound.fromData(CDataClass.getData(data, "lblDisableRound", {}, true));
        this.l2.fromData(CDataClass.getData(data, "l2", {}, true));
        this.btnLeftTop.fromData(CDataClass.getData(data, "btnLeftTop", {}, true));
        this.btnRightTop.fromData(CDataClass.getData(data, "btnRightTop", {}, true));
        this.btnLeftBottom.fromData(CDataClass.getData(data, "btnLeftBottom", {}, true));
        this.btnRightBottom.fromData(CDataClass.getData(data, "btnRightBottom", {}, true));
        this.btnApply.fromData(CDataClass.getData(data, "btnApply", {}, true));
    }
}
class CPoligonPathItemProperties extends CCustomPathItemProperties {
    constructor(parent, name) {
        super(parent, name);
        this.lblCount = new CPanel(this.body);
        this.edtCount = new CTextBox(this.lblCount);
        this.lblStartAngle = new CPanel(this.body);
        this.edtStartAngle = new CTextBox(this.lblStartAngle);
        this.btnApply = new CButton(this.body);
        let self = this;
        this.btnApply.onClick = function () {
            if (self.item != undefined) {
                if (self.editor != undefined) {
                    self.item.pathData.clear();
                    self.item.pathData.makePoligonData(parseInt(self.edtCount.text), true, parseInt(self.edtStartAngle.text));
                    let rt = self.editor.selector.getBounds();
                    rt.left += 10;
                    rt.top += 10;
                    rt.right -= 10;
                    rt.bottom -= 10;
                    self.item.pathData.stretchIgnoreSize(rt);
                    self.editor.doPaint();
                }
            }
            else {
                CSystem.showMessage("Warning", "Select item");
            }
        };
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "lblCount", this.lblCount.toData(), {}, true);
        CDataClass.putData(data, "edtCount", this.edtCount.toData(), {}, true);
        CDataClass.putData(data, "lblStartAngle", this.lblStartAngle.toData(), {}, true);
        CDataClass.putData(data, "edtStartAngle", this.edtStartAngle.toData(), {}, true);
        CDataClass.putData(data, "btnApply", this.btnApply.toData(), {}, true);
    }
    doFromData(data) {
        super.doFromData(data);
        this.lblCount.fromData(CDataClass.getData(data, "lblCount", {}, true));
        this.edtCount.fromData(CDataClass.getData(data, "edtCount", {}, true));
        this.lblStartAngle.fromData(CDataClass.getData(data, "lblStartAngle", {}, true));
        this.edtStartAngle.fromData(CDataClass.getData(data, "edtStartAngle", {}, true));
        this.btnApply.fromData(CDataClass.getData(data, "btnApply", {}, true));
    }
}
class CHornPathItemProperties extends CCustomPathItemProperties {
    constructor(parent, name) {
        super(parent, name);
        this.lblCount = new CPanel(this.body);
        this.edtCount = new CTextBox(this.lblCount);
        this.lblInnerLength = new CPanel(this.body);
        this.edtInnerLength = new CTextBox(this.lblInnerLength);
        this.lblStartAngle = new CPanel(this.body);
        this.edtStartAngle = new CTextBox(this.lblStartAngle);
        this.btnApply = new CButton(this.body);
        let self = this;
        this.btnApply.onClick = function () {
            if (self.item != undefined) {
                if (self.editor != undefined) {
                    self.item.pathData.clear();
                    self.item.pathData.makeHornData(parseInt(self.edtCount.text), parseFloat(self.edtInnerLength.text), true, parseInt(self.edtStartAngle.text));
                    let rt = self.editor.selector.getBounds();
                    rt.left += 10;
                    rt.top += 10;
                    rt.right -= 10;
                    rt.bottom -= 10;
                    self.item.pathData.stretchIgnoreSize(rt);
                    self.editor.doPaint();
                }
            }
            else {
                CSystem.showMessage("Warning", "Select item");
            }
        };
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "lblCount", this.lblCount.toData(), {}, true);
        CDataClass.putData(data, "edtCount", this.edtCount.toData(), {}, true);
        CDataClass.putData(data, "lblInnerLength", this.lblInnerLength.toData(), {}, true);
        CDataClass.putData(data, "edtInnerLength", this.edtInnerLength.toData(), {}, true);
        CDataClass.putData(data, "lblStartAngle", this.lblStartAngle.toData(), {}, true);
        CDataClass.putData(data, "edtStartAngle", this.edtStartAngle.toData(), {}, true);
        CDataClass.putData(data, "btnApply", this.btnApply.toData(), {}, true);
    }
    doFromData(data) {
        super.doFromData(data);
        this.lblCount.fromData(CDataClass.getData(data, "lblCount", {}, true));
        this.edtCount.fromData(CDataClass.getData(data, "edtCount", {}, true));
        this.lblInnerLength.fromData(CDataClass.getData(data, "lblInnerLength", {}, true));
        this.edtInnerLength.fromData(CDataClass.getData(data, "edtInnerLength", {}, true));
        this.lblStartAngle.fromData(CDataClass.getData(data, "lblStartAngle", {}, true));
        this.edtStartAngle.fromData(CDataClass.getData(data, "edtStartAngle", {}, true));
        this.btnApply.fromData(CDataClass.getData(data, "btnApply", {}, true));
    }
}
class CTextPathItemProperties extends CCustomPathItemProperties {
    constructor(parent, name) {
        super(parent, name);
        this.txt = new CTextArea(this.body);
        this.comboFont = new CComboBox(this.body);
        this.btnEachLetter = new CSelectBox(this.body);
        this.btnApply = new CButton(this.body);
        this.btnApplyPath = new CButton(this.body);
        let self = this;
        CSystem.systemFont.forEach(function (k) {
            self.comboFont.items.add(k);
        });
        this.btnApply.onClick = async function () {
            if (self.item != undefined && self.editor != undefined) {
                if (self.btnEachLetter.selected) {
                    let o = await CStringUtil.getTextPathDataEach(self.txt.text, self.comboFont.text);
                    let x = 0;
                    let y = 0;
                    for (let n = 0; n < o.data.length; n++) {
                        let pic = self.item.childs.addItem();
                        pic.fill.styleKind = EStyleKind.SOLID;
                        pic.fill.solidColor = "#ffffff";
                        pic.stroke.styleKind = EStyleKind.SOLID;
                        pic.stroke.lineWidth = 1;
                        pic.stroke.solidColor = "#000000";
                        pic.pathData.width = self.editor.pathArea.position.width;
                        pic.pathData.height = self.editor.pathArea.position.height;
                        if (o.data[n].letter == "\n") {
                            pic.name = "Enter";
                            x = 0;
                            y += 50;
                        }
                        else {
                            pic.name = o.data[n].letter;
                        }
                        pic.kind = "Text";
                        if (o.data[n].letter != "blank" && o.data[n].letter != "\n") {
                            pic.pathData.fromFontPathData(o.data[n].data);
                            pic.pathData.fitIgnoreSize(new CRect(x, y, x + 50, y + 50));
                        }
                        if (o.data[n].letter != "\n")
                            x += 50;
                    }
                    self.editor.refresh();
                    self.editor.doPaint();
                }
                else {
                    self.item.pathData.clear();
                    let s = await CStringUtil.getTextPathData(self.txt.text, self.comboFont.text);
                    self.item.pathData.fromFontPathData(s);
                    let rt = self.editor.selector.getBounds();
                    rt.left += 10;
                    rt.top += 10;
                    rt.right -= 10;
                    rt.bottom -= 10;
                    self.item.pathData.fitIgnoreSize(rt);
                    //self.item.pathData.splitLine(100)
                    self.editor.doPaint();
                }
            }
            else {
                CSystem.showMessage("Warning", "Select item");
            }
        };
        this.btnApplyPath.onClick = function () {
            if (self.item != undefined && self.editor != undefined) {
                self.item.pathData.clear();
                //let s = await CStringUtil.getTextPathData(self.txt.text, self.comboFont.text)
                self.item.pathData.fromFontPathData(self.txt.text);
                let rt = self.editor.selector.getBounds();
                rt.left += 10;
                rt.top += 10;
                rt.right -= 10;
                rt.bottom -= 10;
                self.item.pathData.fitIgnoreSize(rt);
                //self.item.pathData.splitLine(100)
                self.editor.doPaint();
            }
            else {
                CSystem.showMessage("Warning", "Select item");
            }
        };
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "txt", this.txt.toData(), {}, true);
        CDataClass.putData(data, "comboFont", this.comboFont.toData(), {}, true);
        CDataClass.putData(data, "btnEachLetter", this.btnEachLetter.toData(), {}, true);
        CDataClass.putData(data, "btnApply", this.btnApply.toData(), {}, true);
        CDataClass.putData(data, "btnApplyPath", this.btnApplyPath.toData(), {}, true);
    }
    doFromData(data) {
        super.doFromData(data);
        this.txt.fromData(CDataClass.getData(data, "txt", {}, true));
        this.comboFont.fromData(CDataClass.getData(data, "comboFont", {}, true));
        this.btnEachLetter.fromData(CDataClass.getData(data, "btnEachLetter", {}, true));
        this.btnApply.fromData(CDataClass.getData(data, "btnApply", {}, true));
        this.btnApplyPath.fromData(CDataClass.getData(data, "btnApplyPath", {}, true));
    }
}
class CAxisCopyTool extends CCustomPathItemProperties {
    constructor(parent, name) {
        super(parent, name);
        this.lblAxis = new CPanel(this.body);
        this.edtAxis = new CTextBox(this.lblAxis);
        this.btnGuide = new CSelectBox(this.edtAxis);
        this.lblKind = new CPanel(this.body);
        this.btnHorz = new CSelectGroupBox(this.lblKind);
        this.btnVert = new CSelectGroupBox(this.lblKind);
        this.btnUseReverse = new CSelectBox(this.body);
        this.btnUseLastPointLink = new CSelectBox(this.body);
        this.btnUsePathClose = new CSelectBox(this.body);
        this.btnNewItem = new CSelectBox(this.body);
        this.btnApply = new CButton(this.body);
        let self = this;
        this.btnHorz.groupName = this.name + ".kind";
        this.btnVert.groupName = this.name + ".kind";
        this.btnApply.onClick = function () {
            if (self.item != undefined) {
                self.doAxisCopy(self.item);
            }
            else {
                CSystem.showMessage("Warning", "Select item");
            }
        };
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "lblAxis", this.lblAxis.toData(), {}, true);
        CDataClass.putData(data, "edtAxis", this.edtAxis.toData(), {}, true);
        CDataClass.putData(data, "btnGuide", this.btnGuide.toData(), {}, true);
        CDataClass.putData(data, "lblKind", this.lblKind.toData(), {}, true);
        CDataClass.putData(data, "btnHorz", this.btnHorz.toData(), {}, true);
        CDataClass.putData(data, "btnVert", this.btnVert.toData(), {}, true);
        CDataClass.putData(data, "btnUseReverse", this.btnUseReverse.toData(), {}, true);
        CDataClass.putData(data, "btnUseLastPointLink", this.btnUseLastPointLink.toData(), {}, true);
        CDataClass.putData(data, "btnUsePathClose", this.btnUsePathClose.toData(), {}, true);
        CDataClass.putData(data, "btnNewItem", this.btnNewItem.toData(), {}, true);
        CDataClass.putData(data, "btnApply", this.btnApply.toData(), {}, true);
    }
    doFromData(data) {
        super.doFromData(data);
        this.lblAxis.fromData(CDataClass.getData(data, "lblAxis", {}, true));
        this.edtAxis.fromData(CDataClass.getData(data, "edtAxis", {}, true));
        this.btnGuide.fromData(CDataClass.getData(data, "btnGuide", {}, true));
        this.lblKind.fromData(CDataClass.getData(data, "lblKind", {}, true));
        this.btnHorz.fromData(CDataClass.getData(data, "btnHorz", {}, true));
        this.btnVert.fromData(CDataClass.getData(data, "btnVert", {}, true));
        this.btnUseReverse.fromData(CDataClass.getData(data, "btnUseReverse", {}, true));
        this.btnUseLastPointLink.fromData(CDataClass.getData(data, "btnUseLastPointLink", {}, true));
        this.btnUsePathClose.fromData(CDataClass.getData(data, "btnUsePathClose", {}, true));
        this.btnNewItem.fromData(CDataClass.getData(data, "btnNewItem", {}, true));
        this.btnApply.fromData(CDataClass.getData(data, "btnApply", {}, true));
    }
    doAxisCopy(item) {
        let self = this;
        if (this.btnNewItem.selected) {
            if (self.btnUseReverse.selected) {
                CSystem.showMessage("Warning", "Reverse is selected");
            }
            else {
                if (self.editor != undefined) {
                    let ci = self.editor.pathItems.addItem();
                    ci.fromData(item.toData());
                    function setAxis(item, isH) {
                        for (let n = 0; n < item.pathData.length; n++) {
                            if (isH) {
                                item.pathData.get(n).point.x += (parseFloat(self.edtAxis.text) - item.pathData.get(n).point.x) * 2;
                                item.pathData.get(n).cPoint1.x += (parseFloat(self.edtAxis.text) - item.pathData.get(n).cPoint1.x) * 2;
                                item.pathData.get(n).cPoint2.x += (parseFloat(self.edtAxis.text) - item.pathData.get(n).cPoint2.x) * 2;
                            }
                            else {
                                item.pathData.get(n).point.y += (parseFloat(self.edtAxis.text) - item.pathData.get(n).point.y) * 2;
                                item.pathData.get(n).cPoint1.y += (parseFloat(self.edtAxis.text) - item.pathData.get(n).cPoint1.y) * 2;
                                item.pathData.get(n).cPoint2.y += (parseFloat(self.edtAxis.text) - item.pathData.get(n).cPoint2.y) * 2;
                            }
                        }
                        for (let n = 0; n < item.childs.length; n++) {
                            setAxis(item.childs.get(n), self.btnHorz.selected);
                        }
                    }
                    setAxis(ci, self.btnHorz.selected);
                    self.editor.refresh();
                }
            }
        }
        else {
            function setAxis(item) {
                if (self.btnHorz.selected) {
                    if (self.btnUseReverse.selected) {
                        item.pathData.addDecalcomanieXReverse(parseFloat(self.edtAxis.text), self.btnUseLastPointLink.selected, self.btnUsePathClose.selected);
                    }
                    else {
                        item.pathData.addDecalcomanieX(parseFloat(self.edtAxis.text));
                    }
                }
                else {
                    if (self.btnUseReverse.selected) {
                        item.pathData.addDecalcomanieYReverse(parseFloat(self.edtAxis.text), self.btnUseLastPointLink.selected, self.btnUsePathClose.selected);
                    }
                    else {
                        item.pathData.addDecalcomanieY(parseFloat(self.edtAxis.text));
                    }
                }
                for (let n = 0; n < item.childs.length; n++) {
                    setAxis(item.childs.get(n));
                }
            }
            setAxis(item);
        }
        if (this.editor != undefined)
            this.editor.doPaint();
    }
}
class CRotationCopyTool extends CCustomPathItemProperties {
    constructor(parent, name) {
        super(parent, name);
        this.btnGuide = new CSelectBox(this.body);
        this.lblStartAngle = new CPanel(this.body);
        this.edtStartAngle = new CTextBox(this.lblStartAngle);
        this.lblStopAngle = new CPanel(this.body);
        this.edtStopAngle = new CTextBox(this.lblStopAngle);
        this.btnStopAngle = new CButton(this.edtStopAngle);
        this.lblCenterX = new CPanel(this.body);
        this.edtCenterX = new CTextBox(this.lblCenterX);
        this.lblCenterY = new CPanel(this.body);
        this.edtCenterY = new CTextBox(this.lblCenterY);
        this.lblCount = new CPanel(this.body);
        this.edtCount = new CTextBox(this.lblCount);
        this.btnFillStopAngle = new CSelectBox(this.body);
        this.btnKeepItemAngle = new CSelectBox(this.body);
        this.btnNewItem = new CSelectBox(this.body);
        this.btnApply = new CButton(this.body);
        let self = this;
        this.btnApply.onClick = function () {
            if (self.item != undefined) {
                self.doRotationCopy(self.item);
            }
            else {
                CSystem.showMessage("Warning", "Select item");
            }
        };
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "btnGuide", this.btnGuide.toData(), {}, true);
        CDataClass.putData(data, "lblStartAngle", this.lblStartAngle.toData(), {}, true);
        CDataClass.putData(data, "edtStartAngle", this.edtStartAngle.toData(), {}, true);
        CDataClass.putData(data, "lblStopAngle", this.lblStopAngle.toData(), {}, true);
        CDataClass.putData(data, "edtStopAngle", this.edtStopAngle.toData(), {}, true);
        CDataClass.putData(data, "btnStopAngle", this.btnStopAngle.toData(), {}, true);
        CDataClass.putData(data, "lblCenterX", this.lblCenterX.toData(), {}, true);
        CDataClass.putData(data, "edtCenterX", this.edtCenterX.toData(), {}, true);
        CDataClass.putData(data, "lblCenterY", this.lblCenterY.toData(), {}, true);
        CDataClass.putData(data, "edtCenterY", this.edtCenterY.toData(), {}, true);
        CDataClass.putData(data, "lblCount", this.lblCount.toData(), {}, true);
        CDataClass.putData(data, "edtCount", this.edtCount.toData(), {}, true);
        CDataClass.putData(data, "btnFillStopAngle", this.btnFillStopAngle.toData(), {}, true);
        CDataClass.putData(data, "btnKeepItemAngle", this.btnKeepItemAngle.toData(), {}, true);
        CDataClass.putData(data, "btnNewItem", this.btnNewItem.toData(), {}, true);
        CDataClass.putData(data, "btnApply", this.btnApply.toData(), {}, true);
    }
    doFromData(data) {
        super.doFromData(data);
        this.btnGuide.fromData(CDataClass.getData(data, "btnGuide", {}, true));
        this.lblStartAngle.fromData(CDataClass.getData(data, "lblStartAngle", {}, true));
        this.edtStartAngle.fromData(CDataClass.getData(data, "edtStartAngle", {}, true));
        this.lblStopAngle.fromData(CDataClass.getData(data, "lblStopAngle", {}, true));
        this.edtStopAngle.fromData(CDataClass.getData(data, "edtStopAngle", {}, true));
        this.btnStopAngle.fromData(CDataClass.getData(data, "btnStopAngle", {}, true));
        this.lblCenterX.fromData(CDataClass.getData(data, "lblCenterX", {}, true));
        this.edtCenterX.fromData(CDataClass.getData(data, "edtCenterX", {}, true));
        this.lblCenterY.fromData(CDataClass.getData(data, "lblCenterY", {}, true));
        this.edtCenterY.fromData(CDataClass.getData(data, "edtCenterY", {}, true));
        this.lblCount.fromData(CDataClass.getData(data, "lblCount", {}, true));
        this.edtCount.fromData(CDataClass.getData(data, "edtCount", {}, true));
        this.btnFillStopAngle.fromData(CDataClass.getData(data, "btnFillStopAngle", {}, true));
        this.btnKeepItemAngle.fromData(CDataClass.getData(data, "btnKeepItemAngle", {}, true));
        this.btnNewItem.fromData(CDataClass.getData(data, "btnNewItem", {}, true));
        this.btnApply.fromData(CDataClass.getData(data, "btnApply", {}, true));
    }
    doRotationCopy(item) {
        let self = this;
        if (this.btnNewItem.selected) {
            let center = new CPoint(parseFloat(this.edtCenterX.text), parseFloat(this.edtCenterY.text));
            let cnt = parseInt(this.edtCount.text);
            let div = cnt;
            if (this.btnFillStopAngle.selected) {
                div--;
            }
            let ang = (parseFloat(this.edtStopAngle.text) - parseFloat(this.edtStartAngle.text)) / div;
            let newitems = new CPathItems();
            for (let n = 0; n < cnt; n++) {
                let it = newitems.addItem();
                it.fromData(item.toData());
                it.name = item.name + "_copy" + (n + 1);
                it.rotate(center, ang * n, self.btnKeepItemAngle.selected);
            }
            for (let n = 0; n < newitems.length; n++) {
                if (item.parent != undefined) {
                    item.parent.childs.add(newitems.get(n));
                    newitems.get(n).parent = item.parent;
                }
                else {
                    if (self.editor != undefined) {
                        self.editor.pathItems.add(newitems.get(n));
                    }
                }
            }
            if (self.editor != undefined)
                self.editor.refresh();
        }
        else {
            let center = new CPoint(parseFloat(this.edtCenterX.text), parseFloat(this.edtCenterY.text));
            let cnt = parseInt(this.edtCount.text);
            let div = cnt;
            if (this.btnFillStopAngle.selected) {
                div--;
            }
            let ang = (parseFloat(this.edtStopAngle.text) - parseFloat(this.edtStartAngle.text)) / div;
            let org = item.pathData.copyTo();
            function setRotate(item) {
                for (let n = 1; n < cnt; n++) {
                    let pt = org.copyTo();
                    pt.rotate(center, ang * n);
                    if (self.btnKeepItemAngle.selected) {
                        let rt = pt.getBounds();
                        pt.rotate(new CPoint(rt.left + (rt.width / 2), rt.top + (rt.height / 2)), -(ang * n));
                    }
                    item.pathData.addPointList(pt);
                }
                for (let n = 0; n < item.childs.length; n++) {
                    setRotate(item.childs.get(n));
                }
            }
            setRotate(item);
        }
        if (this.editor != undefined)
            this.editor.doPaint();
    }
}
class CRandomCopyTool extends CCustomPathItemProperties {
    constructor(parent, name) {
        super(parent, name);
        this.lblCount = new CPanel(this.body);
        this.edtCount = new CTextBox(this.lblCount);
        this.lblMinSize = new CPanel(this.body);
        this.edtMinSize = new CTextBox(this.lblMinSize);
        this.lblMaxSize = new CPanel(this.body);
        this.edtMaxSize = new CTextBox(this.lblMaxSize);
        this.lblMinAngle = new CPanel(this.body);
        this.edtMinAngle = new CTextBox(this.lblMinAngle);
        this.lblMaxAngle = new CPanel(this.body);
        this.edtMaxAngle = new CTextBox(this.lblMaxAngle);
        this.lblLeft = new CPanel(this.body);
        this.edtLeft = new CTextBox(this.lblLeft);
        this.lblTop = new CPanel(this.body);
        this.edtTop = new CTextBox(this.lblTop);
        this.lblRight = new CPanel(this.body);
        this.edtRight = new CTextBox(this.lblRight);
        this.lblBottom = new CPanel(this.body);
        this.edtBottom = new CTextBox(this.lblBottom);
        this.btnApply = new CButton(this.body);
        let self = this;
        this.btnApply.onClick = function () {
            if (self.item != undefined) {
                self.doRandom(self.item);
            }
            else {
                CSystem.showMessage("Warning", "Select item");
            }
        };
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "lblCount", this.lblCount.toData(), {}, true);
        CDataClass.putData(data, "edtCount", this.edtCount.toData(), {}, true);
        CDataClass.putData(data, "lblMinSize", this.lblMinSize.toData(), {}, true);
        CDataClass.putData(data, "edtMinSize", this.edtMinSize.toData(), {}, true);
        CDataClass.putData(data, "lblMaxSize", this.lblMaxSize.toData(), {}, true);
        CDataClass.putData(data, "edtMaxSize", this.edtMaxSize.toData(), {}, true);
        CDataClass.putData(data, "lblMinAngle", this.lblMinAngle.toData(), {}, true);
        CDataClass.putData(data, "edtMinAngle", this.edtMinAngle.toData(), {}, true);
        CDataClass.putData(data, "lblMaxAngle", this.lblMaxAngle.toData(), {}, true);
        CDataClass.putData(data, "edtMaxAngle", this.edtMaxAngle.toData(), {}, true);
        CDataClass.putData(data, "lblLeft", this.lblLeft.toData(), {}, true);
        CDataClass.putData(data, "edtLeft", this.edtLeft.toData(), {}, true);
        CDataClass.putData(data, "lblTop", this.lblTop.toData(), {}, true);
        CDataClass.putData(data, "edtTop", this.edtTop.toData(), {}, true);
        CDataClass.putData(data, "lblRight", this.lblRight.toData(), {}, true);
        CDataClass.putData(data, "edtRight", this.edtRight.toData(), {}, true);
        CDataClass.putData(data, "lblBottom", this.lblBottom.toData(), {}, true);
        CDataClass.putData(data, "edtBottom", this.edtBottom.toData(), {}, true);
        CDataClass.putData(data, "btnApply", this.btnApply.toData(), {}, true);
    }
    doFromData(data) {
        super.doFromData(data);
        this.lblCount.fromData(CDataClass.getData(data, "lblCount", {}, true));
        this.edtCount.fromData(CDataClass.getData(data, "edtCount", {}, true));
        this.lblMinSize.fromData(CDataClass.getData(data, "lblMinSize", {}, true));
        this.edtMinSize.fromData(CDataClass.getData(data, "edtMinSize", {}, true));
        this.lblMaxSize.fromData(CDataClass.getData(data, "lblMaxSize", {}, true));
        this.edtMaxSize.fromData(CDataClass.getData(data, "edtMaxSize", {}, true));
        this.lblMinAngle.fromData(CDataClass.getData(data, "lblMinAngle", {}, true));
        this.edtMinAngle.fromData(CDataClass.getData(data, "edtMinAngle", {}, true));
        this.lblMaxAngle.fromData(CDataClass.getData(data, "lblMaxAngle", {}, true));
        this.edtMaxAngle.fromData(CDataClass.getData(data, "edtMaxAngle", {}, true));
        this.lblLeft.fromData(CDataClass.getData(data, "lblLeft", {}, true));
        this.edtLeft.fromData(CDataClass.getData(data, "edtLeft", {}, true));
        this.lblTop.fromData(CDataClass.getData(data, "lblTop", {}, true));
        this.edtTop.fromData(CDataClass.getData(data, "edtTop", {}, true));
        this.lblRight.fromData(CDataClass.getData(data, "lblRight", {}, true));
        this.edtRight.fromData(CDataClass.getData(data, "edtRight", {}, true));
        this.lblBottom.fromData(CDataClass.getData(data, "lblBottom", {}, true));
        this.edtBottom.fromData(CDataClass.getData(data, "edtBottom", {}, true));
        this.btnApply.fromData(CDataClass.getData(data, "btnApply", {}, true));
    }
    doRandom(item) {
        let self = this;
        let org = item.pathData.copyTo();
        item.pathData.clear();
        let cnt = parseInt(this.edtCount.text);
        function setRandom(item) {
            for (let n = 0; n < cnt; n++) {
                let pt = org.copyTo();
                let sz = (Math.random() * (parseFloat(self.edtMaxSize.text) - parseFloat(self.edtMinSize.text))) + parseFloat(self.edtMinSize.text);
                let x = (Math.random() * (parseFloat(self.edtRight.text) - parseFloat(self.edtLeft.text) - sz)) + parseFloat(self.edtLeft.text);
                let y = (Math.random() * (parseFloat(self.edtBottom.text) - parseFloat(self.edtTop.text) - sz)) + parseFloat(self.edtTop.text);
                let ang = (Math.random() * (parseFloat(self.edtMaxAngle.text) - parseFloat(self.edtMinAngle.text))) + parseFloat(self.edtMinAngle.text);
                let rt = new CRect(x, y, x + sz, y + sz);
                let center = new CPoint(x + (rt.width / 2), y + (rt.height / 2));
                pt.fitIgnoreSize(rt);
                pt.rotate(center, ang);
                item.pathData.addPointList(pt);
            }
            for (let n = 0; n < item.childs.length; n++) {
                setRandom(item.childs.get(n));
            }
        }
        setRandom(item);
        if (this.editor != undefined)
            this.editor.doPaint();
    }
}
class CLayerPathEditorModel extends CPanel {
    constructor(parent, name) {
        super(parent, name);
        this.__selectorDownChildsPathData = new Map();
        this.__selectorDownChildsBounds = new Map();
        this.__downPathData = new CPathPointList();
        this.__preSize = new CPoint();
        this.toolbar = new CPanel(this);
        this.btnToCanvasItemsData = new CButton(this.toolbar);
        this.btnToLayersData = new CButton(this.toolbar);
        this.btnToAnimateControlData = new CButton(this.toolbar);
        this.btnSave = new CButton(this.toolbar);
        this.btnOpen = new CButton(this.toolbar);
        this.lLeft = new CPanel(this);
        this.lLTop = new CPanel(this.lLeft);
        this.btnItemAdd = new CButton(this.lLTop);
        this.btnItemDelete = new CButton(this.lLTop);
        this.btnItemDown = new CButton(this.lLTop);
        this.btnItemUp = new CButton(this.lLTop);
        this.list = new CObjectTreeListBox(this.lLeft);
        this.spl = new CSplitter(this);
        this.lClient = new CPanel(this);
        this.lCTopShape = new CPanel(this.lClient);
        this.pointKindArrow = new CSelectGroupBox(this.lCTopShape);
        this.pointKindTransfomer = new CSelectGroupBox(this.lCTopShape);
        this.pointKindPathEditor = new CSelectGroupBox(this.lCTopShape);
        this.peNone = new CSelectGroupBox(this.lCTopShape);
        this.peMoveTo = new CSelectGroupBox(this.lCTopShape);
        this.peLineTo = new CSelectGroupBox(this.lCTopShape);
        this.peCurveTo = new CSelectGroupBox(this.lCTopShape);
        this.peClose = new CButton(this.lCTopShape);
        this.lCClient = new CPanel(this.lClient);
        this.img = new CImage(this.lCClient);
        this.pathAreaResizer = new CPanel(this.lCClient);
        this.background = new CPanel(this.pathAreaResizer);
        this.pathArea = new CPanel(this.pathAreaResizer);
        this.selector = new CControlSelectorRotate(this.pathArea);
        this.btnInvertX = new CButton(this.selector);
        this.btnInvertY = new CButton(this.selector);
        this.transfomer = new CPathItemTransformer(this.pathArea);
        this.pathEditor = new CPathEditorControl(this.pathAreaResizer);
        this.axisX = new CPanel(this.pathAreaResizer);
        this.axisY = new CPanel(this.pathAreaResizer);
        this.destCenter = new CPanel(this.pathArea);
        this.rotationCenter = new CPanel(this.pathArea);
        this.shapeTool = new CPanel(this.lCClient);
        this.shpEmpty = new CPanel(this.shapeTool);
        this.shpEllipse = new CPanel(this.shapeTool);
        this.shpRectangle = new CPanel(this.shapeTool);
        this.shpPoligon = new CPanel(this.shapeTool);
        this.shpHorn = new CPanel(this.shapeTool);
        this.shpText = new CPanel(this.shapeTool);
        this.shpEtc = new CPanel(this.shapeTool);
        this.lCBottom = new CPanel(this.lClient);
        this.lblWidth = new CPanel(this.lCBottom);
        this.edtWidth = new CTextBox(this.lCBottom);
        this.lblHeight = new CPanel(this.lCBottom);
        this.edtHeight = new CTextBox(this.lCBottom);
        this.btnSize = new CButton(this.lCBottom);
        this.chkAlignPixcel = new CCheckBox(this.lCBottom);
        this.edtAlignPixcel = new CTextBox(this.lCBottom);
        this.selectBoxGrid = new CSelectBox(this.lCBottom);
        this.lCBottom2 = new CPanel(this.lClient);
        this.lbl = new CPanel(this.lCBottom2);
        this.edtUrl = new CTextBox(this.lCBottom2);
        this.scrollOpacity = new CScrollbar(this.lCBottom2);
        this.btnImage = new CButton(this.lCBottom2);
        this.btnImageFit = new CButton(this.lCBottom2);
        this.btnShowImage = new CSelectBox(this.lCBottom2);
        this.lRight = new CPanel(this);
        this.scrollProperties = new CScrollBox(this.lRight);
        this.baseProperties = new CBasePathItemProperties(this.scrollProperties.content);
        this.lblTool = new CPanel(this.scrollProperties.content);
        this.rectProperties = new CRectanglePathItemProperties(this.scrollProperties.content);
        this.poligonProperties = new CPoligonPathItemProperties(this.scrollProperties.content);
        this.hornProperties = new CHornPathItemProperties(this.scrollProperties.content);
        this.textProperties = new CTextPathItemProperties(this.scrollProperties.content);
        this.axisProperties = new CAxisCopyTool(this.scrollProperties.content);
        this.rotationProperties = new CRotationCopyTool(this.scrollProperties.content);
        this.randomProperties = new CRandomCopyTool(this.scrollProperties.content);
        this.spr = new CSplitter(this);
        this.pathItems = new CPathItems();
        this.layer = this.pathArea.addLayer();
        let self = this;
        this.pointKindArrow.groupName = this.name + ".pointKind";
        this.pointKindPathEditor.groupName = this.name + ".pointKind";
        this.pointKindTransfomer.groupName = this.name + ".pointKind";
        this.peNone.groupName = this.name + ".peKind";
        this.peMoveTo.groupName = this.name + ".peKind";
        this.peLineTo.groupName = this.name + ".peKind";
        this.peCurveTo.groupName = this.name + ".peKind";
        this.btnToCanvasItemsData.onClick = function () {
            let item = self.getSelectedPathItem();
            if (item != undefined) {
                let frm = new CTextEditor(CSystem.desktopList.get(0).applicationLayer);
                frm.showCenter(1200, 600, "Canvas items data", "remove");
                frm.editor.textArea.text = JSON.stringify(item.toCanvasItems(self.pathArea.position.width, self.pathArea.position.height).toData());
            }
        };
        this.btnToLayersData.onClick = function () {
            let item = self.getSelectedPathItem();
            let frm = new CTextEditor(CSystem.desktopList.get(0).applicationLayer);
            frm.showCenter(1200, 600, "Layers data", "remove");
            if (item != undefined) {
                let layers = new CCanvasLayers(undefined);
                let layer = layers.addLayer();
                layer.items.fromData(item.toCanvasItems(self.pathArea.position.width, self.pathArea.position.height).toData());
                let o = layers.toData();
                for (let n = 0; n < o.length; n++) {
                    o[n].width = self.pathArea.position.width;
                    o[n].height = self.pathArea.position.height;
                }
                frm.editor.textArea.text = JSON.stringify(o);
                layers.remove();
            }
            else {
                let layers = new CCanvasLayers(undefined);
                for (let n = 0; n < self.pathItems.length; n++) {
                    let layer = layers.addLayer();
                    layer.items.fromData(self.pathItems.get(n).toCanvasItems(self.pathArea.position.width, self.pathArea.position.height).toData());
                }
                let o = layers.toData();
                for (let n = 0; n < o.length; n++) {
                    o[n].width = self.pathArea.position.width;
                    o[n].height = self.pathArea.position.height;
                }
                frm.editor.textArea.text = JSON.stringify(o);
                layers.remove();
            }
        };
        this.btnToAnimateControlData.onClick = function () {
            self.controlSave();
        };
        this.pointKindArrow.onChangeSelected = function () {
            if (self.pointKindArrow.selected)
                self.doChangePointKind();
        };
        this.pointKindPathEditor.onChangeSelected = function () {
            if (self.pointKindPathEditor.selected)
                self.doChangePointKind();
        };
        this.pointKindTransfomer.onChangeSelected = function () {
            if (self.pointKindTransfomer.selected)
                self.doChangePointKind();
        };
        this.peNone.onChangeSelected = function () {
            if (self.peNone.selected)
                self.doChangePathEditorMode();
        };
        this.peMoveTo.onChangeSelected = function () {
            if (self.peMoveTo.selected)
                self.doChangePathEditorMode();
        };
        this.peLineTo.onChangeSelected = function () {
            if (self.peLineTo.selected)
                self.doChangePathEditorMode();
        };
        this.peCurveTo.onChangeSelected = function () {
            if (self.peCurveTo.selected)
                self.doChangePathEditorMode();
        };
        this.peClose.onClick = function () {
            if (self.pathEditor.pathPointList != undefined)
                self.pathEditor.pathPointList.addPointClose();
        };
        this.baseProperties.editor = this;
        this.lCClient.onClick = function () {
            self.doHideSelector();
            self.refresh();
        };
        this.pathAreaResizer.onClick = function () {
            self.doHideSelector();
            self.refresh();
        };
        this.__preSize.x = 400;
        this.__preSize.y = 400;
        this.pathAreaResizer.onChangeSize = function () {
            self.doChangePathAreaResizer();
            self.__preSize.x = self.pathAreaResizer.position.width;
            self.__preSize.y = self.pathAreaResizer.position.height;
        };
        this.scrollProperties.onChangeSize = function () {
            self.scrollProperties.contentWidth = self.scrollProperties.position.width - 10;
        };
        this.btnSize.onClick = function () {
            let w = parseFloat(self.edtWidth.text);
            let h = parseFloat(self.edtHeight.text);
            self.loopPathItems(function (item) {
                item.pathData.width = w;
                item.pathData.height = h;
            });
            self.pathAreaResizer.position.width = w + 40;
            self.pathAreaResizer.position.height = h + 50;
        };
        this.edtWidth.onKeyDown = function (s, e) {
            if (e.key == "Enter")
                self.btnSize.click();
        };
        this.edtHeight.onKeyDown = function (s, e) {
            if (e.key == "Enter")
                self.btnSize.click();
        };
        this.btnItemAdd.onClick = function () {
            self.doItemAdd();
        };
        this.btnItemDelete.onClick = function () {
            self.doItemDelete();
        };
        this.pathArea.onClick = function (s, e) {
            self.doPathAreaClick(e);
        };
        this.list.onSelectItem = function () {
            self.doListSelect();
        };
        this.list.onKeyDown = function (s, e) {
            self.doListKeyDown(e);
        };
        this.shpEmpty.onClick = function () {
            self.doPathItemAddQuick(EPathItemItemKind.EMPTY);
        };
        this.shpEllipse.onClick = function () {
            self.doPathItemAddQuick(EPathItemItemKind.ELLIPSE);
        };
        this.shpRectangle.onClick = function () {
            self.doPathItemAddQuick(EPathItemItemKind.RECTANGLE);
        };
        this.shpPoligon.onClick = function () {
            self.doPathItemAddQuick(EPathItemItemKind.POLIGON);
        };
        this.shpHorn.onClick = function () {
            self.doPathItemAddQuick(EPathItemItemKind.HORN);
        };
        this.shpText.onClick = function () {
            self.doPathItemAddQuick(EPathItemItemKind.TEXT);
        };
        this.shpEmpty.onDragStart = function () {
            self.shpEmpty.dragData = "empty";
        };
        this.shpEllipse.onDragStart = function () {
            self.shpEllipse.dragData = "ellipse";
        };
        this.shpRectangle.onDragStart = function () {
            self.shpRectangle.dragData = "rectangle";
        };
        this.shpPoligon.onDragStart = function () {
            self.shpPoligon.dragData = "poligon";
        };
        this.shpHorn.onDragStart = function () {
            self.shpHorn.dragData = "horn";
        };
        this.shpText.onDragStart = function () {
            self.shpText.dragData = "text";
        };
        this.btnImage.onClick = function () {
            self.img.src = self.edtUrl.text;
        };
        this.scrollOpacity.onChangeValue = function () {
            self.img.opacity = self.scrollOpacity.valueRatio;
        };
        this.img.onWheel = function (s, e) {
            if (e.deltaY > 0) {
                self.img.transform.scale += 0.1;
            }
            if (e.deltaY < 0) {
                if (self.img.transform.scale > 0.2)
                    self.img.transform.scale -= 0.1;
            }
        };
        this.btnShowImage.onChangeSelected = function () {
            self.img.visible = self.btnShowImage.selected;
        };
        this.btnImageFit.onClick = function () {
            self.pathAreaResizer.position.left = self.img.position.left - 20;
            self.pathAreaResizer.position.top = self.img.position.top - 30;
            self.pathAreaResizer.position.width = self.img.position.width + 40;
            self.pathAreaResizer.position.height = self.img.position.height + 50;
            self.pathAreaResizer.bringToFront();
        };
        this.btnItemUp.onClick = function () {
            self.doItemUp();
        };
        this.btnItemDown.onClick = function () {
            self.doItemDown();
        };
        this.selectBoxGrid.onChangeSelected = function () {
            self.pathAreaResizer.layers.get(0).items.get(4).visible = self.selectBoxGrid.selected;
        };
        this.pathArea.onDropCatch = function (obj, dragCon, x, y, data) {
            self.doPathAreaCatch(x, y, data);
        };
        this.selector.onThisPointerDown = function () {
            self.doSelectorDown();
        };
        this.selector.onThisPointerUp = function () {
            self.doSelectorUp();
        };
        this.selector.onChangeSize = function () {
            self.doChangeSelectorPosition();
        };
        this.selector.onChangeOffset = function () {
            self.doChangeSelectorPosition();
        };
        this.selector.onRotation = function (s, e) {
            self.doSelectorRotation();
        };
        this.selector.onBeforeRotation = function (s, e) {
            self.doSelectorBeforeRotation();
        };
        this.selector.onAfterRotation = function (s, e) {
            self.doSelectorAfterRotation();
        };
        this.btnInvertX.onClick = function () {
            self.doSelectorInvertX();
        };
        this.btnInvertY.onClick = function () {
            self.doSelectorInvertY();
        };
        this.axisX.onChangeOffset = function () {
            self.doChangeAsixXOffset();
        };
        this.axisY.onChangeOffset = function () {
            self.doChangeAsixYOffset();
        };
        this.destCenter.onChangeOffset = function () {
            self.doChangeDestCenterOffset();
        };
        this.rotationCenter.onChangeOffset = function () {
            self.doChangeRotationCenterOffset();
        };
        this.selector.resource = "controlSelector_rotation.control";
        this.selector.visible = false;
        this.transfomer.resource = "path_controller.control";
        this.transfomer.position.align = EPositionAlign.CLIENT;
        this.transfomer.visible = false;
        this.transfomer.onPathDataTransform = function () {
            self.doPaint();
        };
        this.chkAlignPixcel.onChangeChecked = function () {
            self.doSetCheckAlignPixel();
        };
        this.axisProperties.btnGuide.onChangeSelected = function () {
            self.doChangeAsixGuide();
        };
        this.axisProperties.btnHorz.onChangeSelected = function () {
            self.doChangeAsixHorz();
        };
        this.rotationProperties.btnGuide.onChangeSelected = function () {
            self.doChangeRotationGuide();
        };
        this.transfomer.btnGridPathSet.onClick = function () {
            let item = self.getSelectedPathItem();
            if (item != undefined) {
                let pd = self.transfomer.gridToPathData();
                item.pathData.copyFrom(pd.background);
                let n = item.childs.addItem();
                n.stroke.styleKind = EStyleKind.SOLID;
                n.stroke.lineWidth = 1;
                n.pathData.copyFrom(pd.grid);
                self.refresh();
                self.doPaint();
            }
        };
        this.btnSave.onClick = function () {
            self.saveFile();
        };
        this.btnOpen.onClick = function () {
            self.loadFile();
        };
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "toolbar", this.toolbar.toData(), {}, true);
        CDataClass.putData(data, "btnToCanvasItemsData", this.btnToCanvasItemsData.toData(), {}, true);
        CDataClass.putData(data, "btnToLayersData", this.btnToLayersData.toData(), {}, true);
        CDataClass.putData(data, "btnToAnimateControlData", this.btnToAnimateControlData.toData(), {}, true);
        CDataClass.putData(data, "btnSave", this.btnSave.toData(), {}, true);
        CDataClass.putData(data, "btnOpen", this.btnOpen.toData(), {}, true);
        CDataClass.putData(data, "lLeft", this.lLeft.toData(), {}, true);
        CDataClass.putData(data, "lLTop", this.lLTop.toData(), {}, true);
        CDataClass.putData(data, "btnItemAdd", this.btnItemAdd.toData(), {}, true);
        CDataClass.putData(data, "btnItemDelete", this.btnItemDelete.toData(), {}, true);
        CDataClass.putData(data, "btnItemUp", this.btnItemUp.toData(), {}, true);
        CDataClass.putData(data, "btnItemDown", this.btnItemDown.toData(), {}, true);
        CDataClass.putData(data, "list", this.list.toData(), {}, true);
        CDataClass.putData(data, "spl", this.spl.toData(), {}, true);
        CDataClass.putData(data, "lClient", this.lClient.toData(), {}, true);
        CDataClass.putData(data, "lCTopShape", this.lCTopShape.toData(), {}, true);
        CDataClass.putData(data, "pointKindArrow", this.pointKindArrow.toData(), {}, true);
        CDataClass.putData(data, "pointKindPathEditor", this.pointKindPathEditor.toData(), {}, true);
        CDataClass.putData(data, "pointKindTransfomer", this.pointKindTransfomer.toData(), {}, true);
        CDataClass.putData(data, "peNone", this.peNone.toData(), {}, true);
        CDataClass.putData(data, "peMoveTo", this.peMoveTo.toData(), {}, true);
        CDataClass.putData(data, "peLineTo", this.peLineTo.toData(), {}, true);
        CDataClass.putData(data, "peCurveTo", this.peCurveTo.toData(), {}, true);
        CDataClass.putData(data, "peClose", this.peClose.toData(), {}, true);
        CDataClass.putData(data, "shapeTool", this.shapeTool.toData(), {}, true);
        CDataClass.putData(data, "shpEmpty", this.shpEmpty.toData(), {}, true);
        CDataClass.putData(data, "shpEllipse", this.shpEllipse.toData(), {}, true);
        CDataClass.putData(data, "shpRectangle", this.shpRectangle.toData(), {}, true);
        CDataClass.putData(data, "shpPoligon", this.shpPoligon.toData(), {}, true);
        CDataClass.putData(data, "shpHorn", this.shpHorn.toData(), {}, true);
        CDataClass.putData(data, "shpText", this.shpText.toData(), {}, true);
        CDataClass.putData(data, "shpEtc", this.shpEtc.toData(), {}, true);
        CDataClass.putData(data, "lCClient", this.lCClient.toData(), {}, true);
        CDataClass.putData(data, "img", this.img.toData(), {}, true);
        CDataClass.putData(data, "pathAreaResizer", this.pathAreaResizer.toData(), {}, true);
        CDataClass.putData(data, "background", this.background.toData(), {}, true);
        CDataClass.putData(data, "pathArea", this.pathArea.toData(), {}, true);
        CDataClass.putData(data, "pathEditor", this.pathEditor.toData(), {}, true);
        CDataClass.putData(data, "btnInvertX", this.btnInvertX.toData(), {}, true);
        CDataClass.putData(data, "btnInvertY", this.btnInvertY.toData(), {}, true);
        CDataClass.putData(data, "axisX", this.axisX.toData(), {}, true);
        CDataClass.putData(data, "axisY", this.axisY.toData(), {}, true);
        CDataClass.putData(data, "destCenter", this.destCenter.toData(), {}, true);
        CDataClass.putData(data, "rotationCenter", this.rotationCenter.toData(), {}, true);
        CDataClass.putData(data, "lRight", this.lRight.toData(), {}, true);
        CDataClass.putData(data, "scrollProperties", this.scrollProperties.toData(), {}, true);
        CDataClass.putData(data, "baseProperties", this.baseProperties.toData(), {}, true);
        CDataClass.putData(data, "lblTool", this.lblTool.toData(), {}, true);
        CDataClass.putData(data, "rectProperties", this.rectProperties.toData(), {}, true);
        CDataClass.putData(data, "poligonProperties", this.poligonProperties.toData(), {}, true);
        CDataClass.putData(data, "hornProperties", this.hornProperties.toData(), {}, true);
        CDataClass.putData(data, "textProperties", this.textProperties.toData(), {}, true);
        CDataClass.putData(data, "axisProperties", this.axisProperties.toData(), {}, true);
        CDataClass.putData(data, "rotationProperties", this.rotationProperties.toData(), {}, true);
        CDataClass.putData(data, "randomProperties", this.randomProperties.toData(), {}, true);
        CDataClass.putData(data, "spr", this.spr.toData(), {}, true);
        CDataClass.putData(data, "lCBottom", this.lCBottom.toData(), {}, true);
        CDataClass.putData(data, "lblWidth", this.lblWidth.toData(), {}, true);
        CDataClass.putData(data, "edtWidth", this.edtWidth.toData(), {}, true);
        CDataClass.putData(data, "lblHeight", this.lblHeight.toData(), {}, true);
        CDataClass.putData(data, "edtHeight", this.edtHeight.toData(), {}, true);
        CDataClass.putData(data, "btnSize", this.btnSize.toData(), {}, true);
        CDataClass.putData(data, "chkAlignPixcel", this.chkAlignPixcel.toData(), {}, true);
        CDataClass.putData(data, "edtAlignPixcel", this.edtAlignPixcel.toData(), {}, true);
        CDataClass.putData(data, "selectBoxGrid", this.selectBoxGrid.toData(), {}, true);
        CDataClass.putData(data, "lCBottom2", this.lCBottom2.toData(), {}, true);
        CDataClass.putData(data, "lbl", this.lbl.toData(), {}, true);
        CDataClass.putData(data, "edtUrl", this.edtUrl.toData(), {}, true);
        CDataClass.putData(data, "scrollOpacity", this.scrollOpacity.toData(), {}, true);
        CDataClass.putData(data, "btnImage", this.btnImage.toData(), {}, true);
        CDataClass.putData(data, "btnImageFit", this.btnImageFit.toData(), {}, true);
        CDataClass.putData(data, "btnShowImage", this.btnShowImage.toData(), {}, true);
    }
    doFromData(data) {
        super.doFromData(data);
        this.toolbar.fromData(CDataClass.getData(data, "toolbar", {}, true));
        this.btnToCanvasItemsData.fromData(CDataClass.getData(data, "btnToCanvasItemsData", {}, true));
        this.btnToLayersData.fromData(CDataClass.getData(data, "btnToLayersData", {}, true));
        this.btnToAnimateControlData.fromData(CDataClass.getData(data, "btnToAnimateControlData", {}, true));
        this.btnSave.fromData(CDataClass.getData(data, "btnSave", {}, true));
        this.btnOpen.fromData(CDataClass.getData(data, "btnOpen", {}, true));
        this.lLeft.fromData(CDataClass.getData(data, "lLeft", {}, true));
        this.lLTop.fromData(CDataClass.getData(data, "lLTop", {}, true));
        this.btnItemAdd.fromData(CDataClass.getData(data, "btnItemAdd", {}, true));
        this.btnItemDelete.fromData(CDataClass.getData(data, "btnItemDelete", {}, true));
        this.btnItemUp.fromData(CDataClass.getData(data, "btnItemUp", {}, true));
        this.btnItemDown.fromData(CDataClass.getData(data, "btnItemDown", {}, true));
        this.list.fromData(CDataClass.getData(data, "list", {}, true));
        this.spl.fromData(CDataClass.getData(data, "spl", {}, true));
        this.lClient.fromData(CDataClass.getData(data, "lClient", {}, true));
        this.lCTopShape.fromData(CDataClass.getData(data, "lCTopShape", {}, true));
        this.pointKindArrow.fromData(CDataClass.getData(data, "pointKindArrow", {}, true));
        this.pointKindTransfomer.fromData(CDataClass.getData(data, "pointKindTransfomer", {}, true));
        this.pointKindPathEditor.fromData(CDataClass.getData(data, "pointKindPathEditor", {}, true));
        this.peNone.fromData(CDataClass.getData(data, "peNone", {}, true));
        this.peMoveTo.fromData(CDataClass.getData(data, "peMoveTo", {}, true));
        this.peLineTo.fromData(CDataClass.getData(data, "peLineTo", {}, true));
        this.peCurveTo.fromData(CDataClass.getData(data, "peCurveTo", {}, true));
        this.peClose.fromData(CDataClass.getData(data, "peClose", {}, true));
        this.shapeTool.fromData(CDataClass.getData(data, "shapeTool", {}, true));
        this.shpEmpty.fromData(CDataClass.getData(data, "shpEmpty", {}, true));
        this.shpEllipse.fromData(CDataClass.getData(data, "shpEllipse", {}, true));
        this.shpRectangle.fromData(CDataClass.getData(data, "shpRectangle", {}, true));
        this.shpPoligon.fromData(CDataClass.getData(data, "shpPoligon", {}, true));
        this.shpHorn.fromData(CDataClass.getData(data, "shpHorn", {}, true));
        this.shpText.fromData(CDataClass.getData(data, "shpText", {}, true));
        this.shpEtc.fromData(CDataClass.getData(data, "shpEtc", {}, true));
        this.lCClient.fromData(CDataClass.getData(data, "lCClient", {}, true));
        this.img.fromData(CDataClass.getData(data, "img", {}, true));
        this.pathAreaResizer.fromData(CDataClass.getData(data, "pathAreaResizer", {}, true));
        this.background.fromData(CDataClass.getData(data, "background", {}, true));
        this.pathArea.fromData(CDataClass.getData(data, "pathArea", {}, true));
        this.pathEditor.fromData(CDataClass.getData(data, "pathEditor", {}, true));
        this.btnInvertX.fromData(CDataClass.getData(data, "btnInvertX", {}, true));
        this.btnInvertY.fromData(CDataClass.getData(data, "btnInvertY", {}, true));
        this.axisX.fromData(CDataClass.getData(data, "axisX", {}, true));
        this.axisY.fromData(CDataClass.getData(data, "axisY", {}, true));
        this.destCenter.fromData(CDataClass.getData(data, "destCenter", {}, true));
        this.rotationCenter.fromData(CDataClass.getData(data, "rotationCenter", {}, true));
        this.lRight.fromData(CDataClass.getData(data, "lRight", {}, true));
        this.scrollProperties.fromData(CDataClass.getData(data, "scrollProperties", {}, true));
        this.baseProperties.fromData(CDataClass.getData(data, "baseProperties", {}, true));
        this.lblTool.fromData(CDataClass.getData(data, "lblTool", {}, true));
        this.rectProperties.fromData(CDataClass.getData(data, "rectProperties", {}, true));
        this.poligonProperties.fromData(CDataClass.getData(data, "poligonProperties", {}, true));
        this.hornProperties.fromData(CDataClass.getData(data, "hornProperties", {}, true));
        this.textProperties.fromData(CDataClass.getData(data, "textProperties", {}, true));
        this.axisProperties.fromData(CDataClass.getData(data, "axisProperties", {}, true));
        this.rotationProperties.fromData(CDataClass.getData(data, "rotationProperties", {}, true));
        this.randomProperties.fromData(CDataClass.getData(data, "randomProperties", {}, true));
        this.spr.fromData(CDataClass.getData(data, "spr", {}, true));
        this.lCBottom.fromData(CDataClass.getData(data, "lCBottom", {}, true));
        this.lblWidth.fromData(CDataClass.getData(data, "lblWidth", {}, true));
        this.edtWidth.fromData(CDataClass.getData(data, "edtWidth", {}, true));
        this.lblHeight.fromData(CDataClass.getData(data, "lblHeight", {}, true));
        this.edtHeight.fromData(CDataClass.getData(data, "edtHeight", {}, true));
        this.btnSize.fromData(CDataClass.getData(data, "btnSize", {}, true));
        this.chkAlignPixcel.fromData(CDataClass.getData(data, "chkAlignPixcel", {}, true));
        this.edtAlignPixcel.fromData(CDataClass.getData(data, "edtAlignPixcel", {}, true));
        this.selectBoxGrid.fromData(CDataClass.getData(data, "selectBoxGrid", {}, true));
        this.lCBottom2.fromData(CDataClass.getData(data, "lCBottom2", {}, true));
        this.lbl.fromData(CDataClass.getData(data, "lbl", {}, true));
        this.edtUrl.fromData(CDataClass.getData(data, "edtUrl", {}, true));
        this.scrollOpacity.fromData(CDataClass.getData(data, "scrollOpacity", {}, true));
        this.btnImage.fromData(CDataClass.getData(data, "btnImage", {}, true));
        this.btnImageFit.fromData(CDataClass.getData(data, "btnImageFit", {}, true));
        this.btnShowImage.fromData(CDataClass.getData(data, "btnShowImage", {}, true));
    }
    doResource() {
        super.doResource();
        if (this.pathArea.layers.length == 0) {
            this.layer = this.pathArea.layers.addLayer();
        }
    }
    doSetCheckAlignPixel() {
        if (this.chkAlignPixcel.checked) {
            this.selector.magneticLength = parseInt(this.edtAlignPixcel.text);
            for (let n = 0; n < this.pathEditor.points.length; n++) {
                this.pathEditor.points.get(n).alignPixel = parseInt(this.edtAlignPixcel.text);
            }
            this.transfomer.freeTransformHandleLT.magneticLength = parseInt(this.edtAlignPixcel.text);
            this.transfomer.freeTransformHandleRT.magneticLength = parseInt(this.edtAlignPixcel.text);
            this.transfomer.freeTransformHandleLB.magneticLength = parseInt(this.edtAlignPixcel.text);
            this.transfomer.freeTransformHandleRB.magneticLength = parseInt(this.edtAlignPixcel.text);
            this.transfomer.freeTransformHandleLeftC1.magneticLength = parseInt(this.edtAlignPixcel.text);
            this.transfomer.freeTransformHandleLeftC2.magneticLength = parseInt(this.edtAlignPixcel.text);
            this.transfomer.freeTransformHandleTopC1.magneticLength = parseInt(this.edtAlignPixcel.text);
            this.transfomer.freeTransformHandleTopC2.magneticLength = parseInt(this.edtAlignPixcel.text);
            this.transfomer.freeTransformHandleRightC1.magneticLength = parseInt(this.edtAlignPixcel.text);
            this.transfomer.freeTransformHandleRightC2.magneticLength = parseInt(this.edtAlignPixcel.text);
            this.transfomer.freeTransformHandleBottomC1.magneticLength = parseInt(this.edtAlignPixcel.text);
            this.transfomer.freeTransformHandleBottomC2.magneticLength = parseInt(this.edtAlignPixcel.text);
        }
        else {
            this.selector.magneticLength = 0;
            for (let n = 0; n < this.pathEditor.points.length; n++) {
                this.pathEditor.points.get(n).alignPixel = 0;
            }
            this.transfomer.freeTransformHandleLT.magneticLength = 0;
            this.transfomer.freeTransformHandleRT.magneticLength = 0;
            this.transfomer.freeTransformHandleLB.magneticLength = 0;
            this.transfomer.freeTransformHandleRB.magneticLength = 0;
            this.transfomer.freeTransformHandleLeftC1.magneticLength = 0;
            this.transfomer.freeTransformHandleLeftC2.magneticLength = 0;
            this.transfomer.freeTransformHandleTopC1.magneticLength = 0;
            this.transfomer.freeTransformHandleTopC2.magneticLength = 0;
            this.transfomer.freeTransformHandleRightC1.magneticLength = 0;
            this.transfomer.freeTransformHandleRightC2.magneticLength = 0;
            this.transfomer.freeTransformHandleBottomC1.magneticLength = 0;
            this.transfomer.freeTransformHandleBottomC2.magneticLength = 0;
        }
    }
    doListSelect() {
        if (this.list.selectItems.length > 0) {
            let item = this.list.selectItems[0];
            if (this.pointKindPathEditor.selected) {
                this.doShowPathEditor();
            }
            else if (this.pointKindTransfomer.selected) {
                this.doShowTransformer(item.value.asObject["pathItem"]);
            }
            else {
                this.doShowSelector(item.value.asObject["pathItem"].pathData);
            }
            this.doSetBaseProperties(item.value.asObject["pathItem"]);
            this.rectProperties.item = item.value.asObject["pathItem"];
            this.rectProperties.editor = this;
            this.poligonProperties.item = item.value.asObject["pathItem"];
            this.poligonProperties.editor = this;
            this.hornProperties.item = item.value.asObject["pathItem"];
            this.hornProperties.editor = this;
            this.textProperties.item = item.value.asObject["pathItem"];
            this.textProperties.editor = this;
            this.axisProperties.item = item.value.asObject["pathItem"];
            this.axisProperties.editor = this;
            this.rotationProperties.item = item.value.asObject["pathItem"];
            this.rotationProperties.editor = this;
            this.randomProperties.item = item.value.asObject["pathItem"];
            this.randomProperties.editor = this;
        }
    }
    doListKeyDown(e) {
        if (e.ctrlKey && e.key.toUpperCase() == "C") {
            let item = this.getSelectedPathItem();
            if (item != undefined) {
                CSystem.copyData = item.toData();
            }
        }
        if (e.ctrlKey && e.key.toUpperCase() == "V") {
            if (CSystem.copyData != undefined) {
                let item = this.getSelectedPathItem();
                if (item != undefined) {
                    let it = item.childs.addItem();
                    it.fromData(CSystem.copyData);
                    this.refresh();
                }
                else {
                    let it = this.pathItems.addItem();
                    it.fromData(CSystem.copyData);
                    this.refresh();
                }
            }
        }
        if (e.ctrlKey && e.key.toUpperCase() == "X") {
            let item = this.getSelectedPathItem();
            if (item != undefined) {
                CSystem.copyData = item.toData();
                this.doItemDelete();
            }
        }
    }
    doChangePathAreaResizer() {
        let self = this;
        this.loopPathItems(function (item) {
            item.pathData.width = self.pathAreaResizer.position.width - 40;
            item.pathData.height = self.pathAreaResizer.position.height - 50;
        });
        self.edtWidth.text = (self.pathAreaResizer.position.width - 40) + "";
        self.edtHeight.text = (self.pathAreaResizer.position.height - 50) + "";
        self.axisX.lockMaxX = self.pathArea.position.width + 20;
        if (self.axisX.position.left > self.axisX.lockMaxX)
            self.axisX.position.left = self.axisX.lockMaxX;
        self.axisY.lockMaxY = self.pathArea.position.height + 30;
        if (self.axisY.position.top > self.axisY.lockMaxY)
            self.axisY.position.top = self.axisY.lockMaxY;
        let item = this.background.getCanvasItems("asixX");
        for (let n = 0; n < item.length; n++) {
            item[n].position.top = 0;
            item[n].position.bottom = this.pathArea.position.height;
        }
        item = this.background.getCanvasItems("asixY");
        for (let n = 0; n < item.length; n++) {
            item[n].position.left = 0;
            item[n].position.right = this.pathArea.position.width;
        }
        /*let sx = this.pathAreaResizer.position.width / this.__preSize.x
        let sy = this.pathAreaResizer.position.width / this.__preSize.y
        for(let n = 0; n < this.pathItems.length; n++) {
            this.pathItems.get(n).scale(sx, sy)
        }*/
    }
    doChangePointKind() {
        if (this.pointKindArrow.selected) {
            this.doHidePathEditor();
            this.transfomer.visible = false;
            this.transfomer.pathItem = undefined;
        }
        else if (this.pointKindPathEditor.selected) {
            this.transfomer.visible = false;
            this.transfomer.pathItem = undefined;
            this.doHideSelector();
            this.doShowPathEditor();
        }
        else {
            this.doHideSelector();
            this.doHidePathEditor();
            let item = this.getSelectedPathItem();
            if (item != undefined) {
                this.doShowTransformer(item);
                this.doHideSelector();
            }
        }
    }
    doShowPathEditor() {
        if (this.selector.visible)
            this.doHideSelector();
        if (this.transfomer.visible) {
            this.transfomer.visible = false;
            this.transfomer.pathItem = undefined;
        }
        this.pathEditor.visible = true;
        if (this.list.selectItems.length > 0) {
            let pl = this.list.selectItems[0].value.asObject["pathItem"].pathData;
            let self = this;
            pl.onChange = function () {
                if (self.pathEditor.visible)
                    self.doPaint();
            };
            this.pathEditor.pathPointList = pl;
        }
        /*let pl = new CPathPointList()
        this.loopPathItems(function(item) {
            for(let n = 0; n < item.pathData.length; n++) {
                pl.add(item.pathData.get(n))
            }
        })*/
        //this.pathEditor.pathPointList = pl
    }
    doChangeAsixXOffset() {
        this.axisProperties.edtAxis.text = (this.axisX.position.left - 20) + "";
        let item = this.background.getCanvasItems("asixX");
        for (let n = 0; n < item.length; n++) {
            item[n].position.left = this.axisX.position.left - 20;
            item[n].position.right = this.axisX.position.left - 20;
        }
    }
    doChangeAsixYOffset() {
        this.axisProperties.edtAxis.text = (this.axisY.position.top - 30) + "";
        let item = this.background.getCanvasItems("asixY");
        for (let n = 0; n < item.length; n++) {
            item[n].position.top = this.axisY.position.top - 30;
            item[n].position.bottom = this.axisY.position.top - 30;
        }
    }
    doChangeAsixGuide() {
        this.background.layers.get(0).items.get(0).visible = this.axisProperties.btnGuide.selected && this.axisProperties.btnHorz.selected;
        this.background.layers.get(0).items.get(1).visible = this.axisProperties.btnGuide.selected && this.axisProperties.btnVert.selected;
        this.axisX.visible = this.axisProperties.btnGuide.selected && this.axisProperties.btnHorz.selected;
        this.axisY.visible = this.axisProperties.btnGuide.selected && this.axisProperties.btnVert.selected;
        this.axisX.position.left = parseFloat(this.axisProperties.edtAxis.text) + 20;
        this.axisY.position.top = parseFloat(this.axisProperties.edtAxis.text) + 30;
    }
    doChangeAsixHorz() {
        this.background.layers.get(0).items.get(0).visible = this.axisProperties.btnGuide.selected && this.axisProperties.btnHorz.selected;
        this.background.layers.get(0).items.get(1).visible = this.axisProperties.btnGuide.selected && this.axisProperties.btnVert.selected;
        this.axisX.visible = this.axisProperties.btnGuide.selected && this.axisProperties.btnHorz.selected;
        this.axisY.visible = this.axisProperties.btnGuide.selected && this.axisProperties.btnVert.selected;
        this.axisX.position.left = parseFloat(this.axisProperties.edtAxis.text) + 20;
        this.axisY.position.top = parseFloat(this.axisProperties.edtAxis.text) + 30;
    }
    doChangeRotationGuide() {
        this.background.layers.get(0).items.get(2).visible = this.rotationProperties.btnGuide.selected;
        this.destCenter.visible = this.rotationProperties.btnGuide.selected;
        this.rotationCenter.visible = this.rotationProperties.btnGuide.selected;
        this.setRotation();
    }
    setRotation() {
        let item = this.background.getCanvasItems("rotation");
        let dx = this.destCenter.position.left + (this.destCenter.position.width / 2);
        let dy = this.destCenter.position.top + (this.destCenter.position.height / 2);
        let rx = this.rotationCenter.position.left + (this.rotationCenter.position.width / 2);
        let ry = this.rotationCenter.position.top + (this.rotationCenter.position.height / 2);
        for (let n = 0; n < item.length; n++) {
            item[n].pathData.clear();
            item[n].pathData.addPointMoveTo(new CPoint(dx, dy));
            item[n].pathData.addPointLineTo(new CPoint(rx, ry));
        }
        this.rotationProperties.edtStartAngle.text = CPoint.getAngleFromTwoPoint(new CPoint(rx, ry), new CPoint(dx, dy)) + "";
        this.rotationProperties.edtCenterX.text = rx + "";
        this.rotationProperties.edtCenterY.text = ry + "";
    }
    doChangeDestCenterOffset() {
        this.setRotation();
    }
    doChangeRotationCenterOffset() {
        this.setRotation();
    }
    doHidePathEditor() {
        this.pathEditor.pathPointList = undefined;
        this.pathEditor.visible = false;
    }
    doChangePathEditorMode() {
        if (this.peNone.selected)
            this.pathEditor.mode = "None";
        if (this.peMoveTo.selected)
            this.pathEditor.mode = "MoveTo";
        if (this.peLineTo.selected)
            this.pathEditor.mode = "LineTo";
        if (this.peCurveTo.selected)
            this.pathEditor.mode = "CurveTo";
    }
    doSetBaseProperties(item) {
        this.baseProperties.item = item;
    }
    doPathAreaCatch(x, y, data) {
        let itemKind = EPathItemItemKind.EMPTY;
        if (data == "ellipse") {
            itemKind = EPathItemItemKind.ELLIPSE;
        }
        if (data == "rectangle") {
            itemKind = EPathItemItemKind.RECTANGLE;
        }
        if (data == "poligon") {
            itemKind = EPathItemItemKind.POLIGON;
        }
        if (data == "horn") {
            itemKind = EPathItemItemKind.HORN;
        }
        if (data == "text") {
            itemKind = EPathItemItemKind.TEXT;
        }
        this.doPathItemAdd(itemKind, x, y);
    }
    doPathAreaClick(e) {
        let arr = this.list.items.getExpandedItems();
        let b = false;
        for (let n = arr.length - 1; n >= 0; n--) {
            let rt = arr[n].item.value.asObject["pathItem"].pathData.getBounds();
            if (e.offsetX >= rt.left && e.offsetX <= rt.right && e.offsetY >= rt.top && e.offsetY <= rt.bottom) {
                this.selectListItem(arr[n].item.value.asObject["pathItem"]);
                b = true;
                break;
            }
        }
        if (!b)
            this.doHideSelector();
    }
    doItemAdd() {
        let it = this.pathItems.addItem();
        it.kind = "Empty";
        this.refresh();
    }
    doItemDelete() {
        if (this.list.selectItems.length == 0) {
            CSystem.showMessage("Warning", "Item select");
        }
        else {
            if (this.selector.visible)
                this.doHideSelector();
            if (this.pathEditor.visible)
                this.doHidePathEditor();
            let self = this;
            let items;
            this.loopPathItems(function (item) {
                if (self.list.selectItems[0].value.asObject["pathItem"] == item) {
                    let pr = item.parent;
                    if (pr == undefined) {
                        items = self.pathItems;
                    }
                    else {
                        items = pr.childs;
                    }
                }
            });
            for (let n = 0; n < items.length; n++) {
                if (this.list.selectItems[0].value.asObject["pathItem"] == items.get(n)) {
                    items.delete(n);
                    this.refresh();
                    this.doPaint();
                    break;
                }
            }
        }
    }
    doItemUp() {
        if (this.list.selectItems.length > 0) {
            let self = this;
            let items;
            this.loopPathItems(function (item) {
                if (self.list.selectItems[0].value.asObject["pathItem"] == item) {
                    let pr = item.parent;
                    if (pr == undefined) {
                        items = self.pathItems;
                    }
                    else {
                        items = pr.childs;
                    }
                }
            });
            for (let n = 0; n < items.length; n++) {
                if (self.list.selectItems[0].value.asObject["pathItem"] == items.get(n) && n > 0) {
                    items.swap(n, n - 1);
                    self.refresh(true);
                    self.doPaint();
                    break;
                }
            }
        }
    }
    doItemDown() {
        if (this.list.selectItems.length > 0) {
            let self = this;
            let items;
            this.loopPathItems(function (item) {
                if (self.list.selectItems[0].value.asObject["pathItem"] == item) {
                    let pr = item.parent;
                    if (pr == undefined) {
                        items = self.pathItems;
                    }
                    else {
                        items = pr.childs;
                    }
                }
            });
            for (let n = 0; n < items.length; n++) {
                if (self.list.selectItems[0].value.asObject["pathItem"] == items.get(n) && n < items.length - 1) {
                    items.swap(n, n + 1);
                    self.refresh(true);
                    self.doPaint();
                    break;
                }
            }
        }
    }
    doPathItemAddQuick(itemKind) {
        this.doPathItemAdd(itemKind, 25, 25);
    }
    async doPathItemAdd(itemKind, x, y) {
        let self = this;
        function newItem() {
            let picc;
            if (self.list.selectItems.length == 0) {
                picc = self.pathItems.addItem();
            }
            else {
                let treeitem = self.list.selectItems[0];
                let pi = treeitem.value.asObject["pathItem"];
                picc = pi.childs.addItem();
            }
            let pic = picc;
            pic.fill.styleKind = EStyleKind.SOLID;
            pic.fill.solidColor = "#ffffff";
            pic.stroke.styleKind = EStyleKind.SOLID;
            pic.stroke.lineWidth = 1;
            pic.stroke.solidColor = "#000000";
            pic.pathData.width = self.pathArea.position.width;
            pic.pathData.height = self.pathArea.position.height;
            pic.kind = self.itemKindToString(itemKind);
            return pic;
        }
        if (itemKind == EPathItemItemKind.EMPTY) {
            newItem();
            this.refresh(true);
            this.doPaint();
        }
        if (itemKind == EPathItemItemKind.ELLIPSE) {
            let pic = newItem();
            pic.pathData.makeEllipseData(x - 25, y - 25, 50, 50, false);
            this.refresh(true);
            this.doPaint();
        }
        if (itemKind == EPathItemItemKind.RECTANGLE) {
            let pic = newItem();
            pic.pathData.makeRoundRectData(x - 25, y - 25, 50, 50, 0, 0, new CStringSet(), new CStringSet(), false);
            this.refresh(true);
            this.doPaint();
        }
        if (itemKind == EPathItemItemKind.POLIGON) {
            let pic = newItem();
            pic.pathData.makePoligonData(5, true, -90);
            pic.pathData.fitIgnoreSize(new CRect(x - 25, y - 25, x + 25, y + 25));
            this.refresh(true);
            this.doPaint();
        }
        if (itemKind == EPathItemItemKind.HORN) {
            let pic = newItem();
            pic.pathData.makeHornData(5, 0.5, true, -90);
            pic.pathData.fitIgnoreSize(new CRect(x - 25, y - 25, x + 25, y + 25));
            this.refresh(true);
            this.doPaint();
        }
        if (itemKind == EPathItemItemKind.TEXT) {
            CSystem.prompt("Text info", ["Text", "Bold", "Italic", "Font name", "Each letter"], CSystem.browserCovers.get("cover"), async function (arrr) {
                if (arrr[4] == "Y") {
                    let o = await CStringUtil.getTextPathDataEach(arrr[0], arrr[3]);
                    for (let n = 0; n < o.data.length; n++) {
                        if (o.data[n].data != "") {
                            let pic = newItem();
                            pic.pathData.fromFontPathData(o.data[n].data);
                            pic.pathData.fitIgnoreSize(new CRect(x - 25, y - 25, x + 25, y + 25));
                        }
                    }
                    self.refresh(true);
                    self.doPaint();
                }
                else {
                    let pic = newItem();
                    let s = await CStringUtil.getTextPathData(arrr[0], arrr[3]);
                    pic.pathData.fromFontPathData(s);
                    pic.pathData.fitIgnoreSize(new CRect(x - 25, y - 25, x + 25, y + 25));
                    self.refresh(true);
                    self.doPaint();
                }
            }, ["", "N", "N", "Arial", "N"]);
        }
    }
    doShowSelector(data) {
        if (data.length > 0) {
            let rt = data.getBounds();
            this.selector.position.left = rt.left - 10;
            this.selector.position.top = rt.top - 10;
            this.selector.position.width = rt.width + 20;
            this.selector.position.height = rt.height + 20;
            this.selector.visible = true;
        }
        else {
            this.selector.position.left = -10;
            this.selector.position.top = -10;
            this.selector.position.width = this.pathArea.position.width + 20;
            this.selector.position.height = this.pathArea.position.height + 20;
            this.selector.visible = true;
        }
        this.doSetCheckAlignPixel();
    }
    doShowTransformer(data) {
        this.transfomer.pathItem = data;
        this.transfomer.visible = true;
        this.doSetCheckAlignPixel();
    }
    doHideSelector() {
        this.selector.visible = false;
        this.selector.transform.rotateZ = 0;
        this.selector.transform.rotationPointX = 0.5;
        this.selector.transform.rotationPointY = 0.5;
    }
    doSelectorDown() {
        if (this.list.selectItems.length > 0) {
            this.__selectorDownChildsBounds.clear();
            let arr = this.list.selectItems[0].items.getExpandedItems();
            for (let n = 0; n < arr.length; n++) {
                let pii = arr[n].item.value.asObject["pathItem"];
                this.__selectorDownChildsBounds.set(pii, pii.pathData.getBounds());
            }
        }
    }
    doSelectorInvertX() {
        let item = this.getSelectedPathItem();
        if (item != undefined) {
            item.pathData.invertX();
            this.doPaint();
        }
    }
    doSelectorInvertY() {
        let item = this.getSelectedPathItem();
        if (item != undefined) {
            item.pathData.invertY();
            this.doPaint();
        }
    }
    doSelectorBeforeRotation() {
        if (this.list.selectItems.length > 0) {
            this.__selectorDownChildsPathData.clear();
            this.__downPathData = this.list.selectItems[0].value.asObject["pathItem"].pathData.copyTo();
            let arr = this.list.selectItems[0].items.getExpandedItems();
            for (let n = 0; n < arr.length; n++) {
                let pii = arr[n].item.value.asObject["pathItem"];
                this.__selectorDownChildsPathData.set(pii, pii.pathData.copyTo());
            }
        }
    }
    doSelectorUp() {
        this.__selectorDownChildsBounds.clear();
    }
    doChangeSelectorPosition() {
        if (this.list.selectItems.length > 0) {
            let rt = this.selector.getBounds();
            rt.left += 10;
            rt.top += 10;
            rt.right -= 10;
            rt.bottom -= 10;
            let treeitem = this.list.selectItems[0];
            let pi = treeitem.value.asObject["pathItem"];
            pi.stretch(rt);
            if (this.selector.moveKind == EControlMoveKind.MOVE) {
                let arr = treeitem.items.getExpandedItems();
                for (let n = 0; n < arr.length; n++) {
                    let pii = arr[n].item.value.asObject["pathItem"];
                    let bounds = this.__selectorDownChildsBounds.get(pii);
                    if (bounds != undefined) {
                        let nb = pii.pathData.getBounds();
                        pii.pathData.movePoint(-(nb.left - bounds.left), -(nb.top - bounds.top));
                        pii.pathData.movePoint(this.selector.position.left - this.selector.downPoint.x, this.selector.position.top - this.selector.downPoint.y);
                    }
                }
            }
            this.destCenter.position.left = (this.selector.position.left + (this.selector.position.width / 2)) - (this.destCenter.position.width / 2);
            this.destCenter.position.top = (this.selector.position.top + (this.selector.position.height / 2)) - (this.destCenter.position.height / 2);
            this.doPaint();
        }
    }
    doSelectorRotation() {
        if (this.list.selectItems.length > 0) {
            let treeitem = this.list.selectItems[0];
            let pi = treeitem.value.asObject["pathItem"];
            pi.pathData.fromData(this.__downPathData.toData());
            pi.pathData.rotate(new CPoint(this.selector.position.left + (this.selector.position.width * this.selector.transform.rotationPointX), this.selector.position.top + (this.selector.position.height * this.selector.transform.rotationPointY)), this.selector.transform.rotateZ);
            let arr = treeitem.items.getExpandedItems();
            for (let n = 0; n < arr.length; n++) {
                let pii = arr[n].item.value.asObject["pathItem"];
                let pd = this.__selectorDownChildsPathData.get(pii);
                if (pd != undefined) {
                    pii.pathData.fromData(pd.toData());
                    pii.pathData.rotate(new CPoint(this.selector.position.left + (this.selector.position.width * this.selector.transform.rotationPointX), this.selector.position.top + (this.selector.position.height * this.selector.transform.rotationPointY)), this.selector.transform.rotateZ);
                }
            }
            this.doPaint();
        }
    }
    doSelectorAfterRotation() {
        this.doHideSelector();
        if (this.list.selectItems.length > 0) {
            this.doShowSelector(this.list.selectItems[0].value.asObject["pathItem"].pathData);
        }
    }
    doRefresh() {
        this.list.clear();
        function fn(lst, treeData) {
            for (let n = 0; n < lst.length; n++) {
                let pi = lst.get(n);
                let it = treeData.addItem({ text: pi.name, kind: pi.kind, pathItem: pi });
                if (!pi.group)
                    fn(pi.childs, it.items);
            }
        }
        fn(this.pathItems, this.list.items);
        this.list.items.expandAll();
    }
    doPaint() {
        this.pathArea.layers.get(0).items.clear();
        let self = this;
        this.loopPathItems(function (item) {
            let it = self.newCanvasItem();
            self.copyItem(it, item);
        });
        /*for(let n = 0; n < this.pathItems.length; n++) {
            let it = this.newCanvasItem()
            it.pathData.addPointList(this.pathItems.get(n).getData())
        }*/
    }
    getSelectedPathItem() {
        let rt;
        if (this.list.selectItems.length > 0) {
            rt = this.list.selectItems[0].value.asObject["pathItem"];
        }
        return rt;
    }
    copyItem(ci, pi) {
        ci.pathData.addPointList(pi.pathData);
        ci.fill.fromData(pi.fill.toData());
        ci.stroke.fromData(pi.stroke.toData());
        ci.opacity = pi.opacity;
        ci.shadowBlur = pi.shadowBlur;
        ci.shadowColor = pi.shadowColor;
        ci.shadowOffsetX = pi.shadowOffsetX;
        ci.shadowOffsetY = pi.shadowOffsetY;
        (new Function("ci", "pi", "ci.composite = pi.composite"))(ci, pi);
        ci.text = pi.text;
        ci.textSet.fromData(pi.textSet.toData());
    }
    loopPathItems(fn) {
        function loop(list) {
            for (let n = 0; n < list.length; n++) {
                fn(list.get(n));
                loop(list.get(n).childs);
            }
        }
        loop(this.pathItems);
    }
    newCanvasItem() {
        let rt = this.layer.addItem();
        rt.kind = ECanvasItemKind.PATH;
        rt.pathFitMode = EFitMode.ORIGINAL;
        return rt;
    }
    itemKindToString(kind) {
        let rt = "Empty";
        if (kind == EPathItemItemKind.ELLIPSE)
            rt = "Ellipse";
        if (kind == EPathItemItemKind.RECTANGLE)
            rt = "Rectangle";
        if (kind == EPathItemItemKind.POLIGON)
            rt = "Poligon";
        if (kind == EPathItemItemKind.HORN)
            rt = "Horn";
        if (kind == EPathItemItemKind.ETC)
            rt = "ETC";
        return rt;
    }
    addKindToString(kind) {
        let rt = "Normal";
        if (kind == EPathItemAddKind.PATTERN)
            rt = "Pattern";
        if (kind == EPathItemAddKind.ROTATION)
            rt = "Rotaion";
        if (kind == EPathItemAddKind.RANDOM)
            rt = "Random";
        return rt;
    }
    selectListItem(pathitem) {
        let arr = this.list.items.getExpandedItems();
        for (let n = 0; n < arr.length; n++) {
            if (arr[n].item.value.asObject["pathItem"] == pathitem) {
                this.list.selectItem(arr[n].item);
                break;
            }
        }
    }
    refresh(isReSelect = false) {
        if (isReSelect) {
            if (this.list.selectItems.length > 0) {
                let treeitem = this.list.selectItems[0];
                let pi = treeitem.value.asObject["pathItem"];
                this.doRefresh();
                this.selectListItem(pi);
            }
            else {
                this.doRefresh();
            }
        }
        else {
            this.doRefresh();
        }
    }
    async loadFile() {
        let self = this;
        CSystem.loadFromFile(function (f) {
            f.text().then(function (fs) {
                let data = JSON.parse(fs);
                if (data.width != undefined && data.height != undefined) {
                    self.edtWidth.text = data.width;
                    self.edtHeight.text = data.height;
                    self.btnSize.click();
                }
                if (data.img != undefined) {
                    self.img.fromData(data.img);
                    self.edtUrl.text = data.url;
                    self.scrollOpacity.valueRatio = self.img.opacity;
                    self.btnShowImage.selected = self.img.visible;
                }
                if (data.area != undefined) {
                    self.pathAreaResizer.fromData(data.area);
                }
                self.pathItems.fromData(data);
                self.refresh();
                self.doPaint();
            });
        });
    }
    async saveFile() {
        let self = this;
        CSystem.prompt("Data save", ["File name"], CSystem.browserCovers.get("cover"), function (arr) {
            let o = self.pathItems.toData();
            o["width"] = self.edtWidth.text;
            o["height"] = self.edtHeight.text;
            o["url"] = self.edtUrl.text;
            o["img"] = self.img.toData();
            o["area"] = self.pathAreaResizer.toData();
            CSystem.saveAsFile(JSON.stringify(o), arr[0] + ".pathitems");
        });
    }
    async controlSave() {
        let con = new CAnimationControl();
        con.position.width = parseFloat(this.edtWidth.text);
        con.position.height = parseFloat(this.edtHeight.text);
        con.propertyName = "animationControl";
        con.objectsCount = this.pathItems.length;
        let pi = new CPathItems();
        pi.copyFrom(this.pathItems);
        for (let n = 0; n < pi.length; n++) {
            //let rt = pi.get(n).pathData.getBounds()
            let rt = pi.get(n).getBounds();
            pi.get(n).movePoint(-rt.left, -rt.top);
            let items = pi.get(n).toCanvasItems(rt.width, rt.height);
            let l = con.objects.get(n).layers.addLayer();
            l.items.fromData(items.toData());
            con.objects.get(n).position.left = rt.left;
            con.objects.get(n).position.top = rt.top;
            con.objects.get(n).position.width = rt.width;
            con.objects.get(n).position.height = rt.height;
            con.objects.get(n).propertyName = pi.get(n).name;
        }
        let self = this;
        CSystem.prompt("Control save", ["File name"], CSystem.browserCovers.get("cover"), function (arr) {
            CSystem.saveAsFile(JSON.stringify(con.toData()), arr[0] + ".control");
            con.remove();
        });
    }
    getLayersData() {
        let layers = new CCanvasLayers(undefined);
        for (let n = 0; n < this.pathItems.length; n++) {
            let item = this.pathItems.get(n);
            let layer = layers.addLayer();
            layer.items.fromData(item.toCanvasItems(this.pathArea.position.width, this.pathArea.position.height).toData());
        }
        let rt = layers.toData();
        layers.remove();
        return rt;
    }
}
class CLayerPathEditor extends CLayerPathEditorModel {
    constructor(parent, name) {
        super(parent, name);
        this.resource = "layerPathEditor.frame";
    }
}
class CAppPathEditor extends CWindowApplication {
    constructor() {
        super();
        this.defaultWidth = 1200;
        this.defaultHeight = 670;
        this.appName = "Animation control editor";
        this.editor = new CLayerPathEditor(this.mainWindow.body);
        this.editor.position.align = EPositionAlign.CLIENT;
    }
    doExecute() {
        super.doExecute();
        //this.editor.properties.editorCover = this.desktop?.cover
    }
}
