"use strict";
class CPropertyEditor extends CDataGrid {
    constructor(parent, name) {
        super(parent, name);
        this.__expandProperty = new Set();
        this._expandPropertyCellCanvasItemsResource1 = "";
        this._expandPropertyCellCanvasItemsResource2 = "";
        this.editorButtonCanvasItemsResource = "";
        this.enumListBoxResource = "";
        this.enumListItemResource = [];
        this.propertyData = new Array();
        this.onlyShowProperty = new Array();
        this.gridInfo.useResizeColumn = true;
        this.gridInfo.useIndicator = false;
        this.headers.add("name");
        this.headers.add("value");
        this.headerText.set("0,0", "프로퍼티명");
        this.headerText.set("1,0", "값");
        this.editable = true;
        this.editorShowSet.add(EEditorShowKind.CLICK);
        this.editorShowSet.add(EEditorShowKind.F2_KEY);
        this.gridInfo.useFitWidth = true;
        this.readOnlyColumn.add(0);
        this.addCellControl(EPointerAreaKind.HEADER_CLIENT, 1, 0, ECellControlAlign.RIGHT, 15, [1, 1, 1, 1], this.editorButtonCanvasItemsResource, "-");
    }
    get classInstance() {
        return this._classInstrance;
    }
    set classInstance(value) {
        if (this._classInstrance != value) {
            this._classInstrance = value;
            this.doSetProperties();
        }
    }
    get expandPropertyCellCanvasItemsResource1() {
        return this._expandPropertyCellCanvasItemsResource1;
    }
    set expandPropertyCellCanvasItemsResource1(value) {
        if (this._expandPropertyCellCanvasItemsResource1 != value) {
            this._expandPropertyCellCanvasItemsResource1 = value;
            this.addSpecificCellCanvasItemsResource(value);
        }
    }
    get expandPropertyCellCanvasItemsResource2() {
        return this._expandPropertyCellCanvasItemsResource2;
    }
    set expandPropertyCellCanvasItemsResource2(value) {
        if (this._expandPropertyCellCanvasItemsResource2 != value) {
            this._expandPropertyCellCanvasItemsResource2 = value;
            this.addSpecificCellCanvasItemsResource(value);
        }
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "expandPropertyCellCanvasItemsResource1", this.expandPropertyCellCanvasItemsResource1, "");
        CDataClass.putData(data, "expandPropertyCellCanvasItemsResource2", this.expandPropertyCellCanvasItemsResource2, "");
        CDataClass.putData(data, "editorButtonCanvasItemsResource", this.editorButtonCanvasItemsResource, "");
        CDataClass.putData(data, "enumListBoxResource", this.enumListBoxResource, "");
    }
    doFromData(data) {
        super.doFromData(data);
        this.expandPropertyCellCanvasItemsResource1 = CDataClass.getData(data, "expandPropertyCellCanvasItemsResource1", "");
        this.expandPropertyCellCanvasItemsResource2 = CDataClass.getData(data, "expandPropertyCellCanvasItemsResource2", "");
        this.editorButtonCanvasItemsResource = CDataClass.getData(data, "editorButtonCanvasItemsResource", "");
        this.enumListBoxResource = CDataClass.getData(data, "enumListBoxResource", "");
        this.gridInfo.useResizeColumn = true;
        this.gridInfo.useIndicator = false;
        this.headerText.clear();
        this.headers.clear();
        this.headers.add("name");
        this.headers.add("value");
        this.headerText.set("0,0", "프로퍼티명");
        this.headerText.set("1,0", "값");
        this.editable = true;
        this.editorShowSet.add(EEditorShowKind.CLICK);
        this.editorShowSet.add(EEditorShowKind.F2_KEY);
        this.gridInfo.useFitWidth = true;
        this.readOnlyColumn.add(0);
    }
    doCellControlClick(kind, column, row, cellControlIndex, cellControl, x, y, width, height, e, points) {
        super.doCellControlClick(kind, column, row, cellControlIndex, cellControl, x, y, width, height, e, points);
        let self = this;
        function execPropertyEditor() {
            let cls = self.cell(1, row);
            let f = new Function("parent", "return new " + cls + "(parent)");
            let obj = f();
            if (obj instanceof CWindowModel) {
                obj.parent = CSystem.clientBody;
                let frm = obj;
                frm.showCenter(frm.defalutWidth, frm.defalutHeight, cls.substring(1), "remove");
                let arr = self.propertyData[row].propertyName.split(".");
                frm.property = arr[arr.length - 1];
                frm.instance = self.propertyData[row].classInstance;
            }
            else {
                if (self.editorCover != undefined) {
                    obj.parent = self.editorCover;
                    let editor = obj;
                    editor.position.align = EPositionAlign.CENTER;
                    editor.position.width = editor.defalutWidth;
                    editor.position.height = editor.defalutHeight;
                    let arr = self.propertyData[row].propertyName.split(".");
                    editor.property = arr[arr.length - 1];
                    editor.instance = self.propertyData[row].classInstance;
                    self.editorCover.isHideClear = true;
                    self.editorCover.showCover();
                }
            }
        }
        if (kind == EPointerAreaKind.CLIENT) {
            let rc = CPropertyEditor.classEditor.get(this.propertyData[row].className);
            if (rc == undefined) {
                if (cellControlIndex == 0) {
                    if (cellControl.data == "object") {
                        this.doObjectEditorButtonClick(kind, column, row, cellControlIndex, cellControl, x, y, width, height, e, points);
                    }
                    if (cellControl.data == "boolean") {
                        if (this.classInstance != undefined) {
                            let v = !this.classInstance.getProperty(this.propertyData[row].propertyName) + "";
                            this.classInstance.setProperty(this.propertyData[row].propertyName, v);
                            cellControl.text = this.classInstance.getProperty(this.propertyData[row].propertyName) + "";
                        }
                    }
                    if (cellControl.data == "exception") {
                        execPropertyEditor();
                    }
                    if (cellControl.data == "enum") {
                        let bounds = this.getCellBounds(column, row);
                        let cb = this.getBackgroundClientBounds();
                        bounds.offset(cb.left, cb.top);
                        let lst = new CListBox();
                        lst.resource = this.enumListBoxResource;
                        lst.listItemResource = this.enumListItemResource;
                        lst.scrollBox.useVScrollbar = false;
                        lst.filter.filterSet.shadow = true;
                        lst.filter.shadowX = 0;
                        lst.filter.shadowY = 0;
                        lst.onChangeItemIndex = function () {
                            if (self.classInstance != undefined)
                                self.classInstance.setProperty(self.propertyData[row].propertyName, lst.itemIndex + "");
                            cellControl.text = self.propertyData[row].enum[lst.itemIndex];
                            pick.hide();
                        };
                        for (let n = 0; n < this.propertyData[row].enum.length; n++) {
                            lst.items.add(this.propertyData[row].enum[n]);
                        }
                        let h = (lst.items.length * lst.rowHeight) + ((lst.items.length - 1) * lst.itemMargin);
                        if (h > 200)
                            h = 200;
                        let yy = e.pageY - y + cellControl.margins.top + self.gridInfo.cellMargin + height;
                        if (yy + h > window.innerHeight)
                            yy = yy - height - h - 5;
                        let pick = CPickupControl.showPickup("", CSystem.clientBody, e.pageX - x + cellControl.margins.left + self.gridInfo.cellMargin, yy, width, h, function (pickup) {
                            lst.parent = pickup;
                            lst.position.align = EPositionAlign.CLIENT;
                        }, undefined, function (pickup) {
                            lst.remove();
                        });
                    }
                }
                else {
                    if (cellControl.text == "+") {
                        let arr = CClassProperty.getProperties(this.propertyData[row].instance);
                        let pn = this.propertyData[row].propertyName;
                        if (this.propertyData.length - 1 > row + 1) {
                            for (let n = arr.length - 1; n >= 0; n--) {
                                this.propertyData.splice(row + 1, 0, {
                                    instance: arr[n].instance,
                                    classInstance: arr[n].classInstance,
                                    propertyName: pn + "." + arr[n].propertyName,
                                    className: arr[n].className,
                                    expandName: pn,
                                    readOnly: arr[n].readOnly,
                                    enum: arr[n].enum
                                });
                            }
                        }
                        else {
                            for (let n = 0; n < arr.length; n++) {
                                this.propertyData.push({
                                    instance: arr[n].instance,
                                    classInstance: arr[n].classInstance,
                                    propertyName: pn + arr[n].propertyName,
                                    className: arr[n].className,
                                    expandName: pn,
                                    readOnly: arr[n].readOnly,
                                    enum: arr[n].enum
                                });
                            }
                        }
                        this.__expandProperty.add(pn);
                        this.refreshData();
                    }
                    else {
                        let pn = this.propertyData[row].propertyName;
                        for (let n = this.propertyData.length - 1; n >= 0; n--) {
                            if (this.propertyData[n].expandName.indexOf(pn) == 0) {
                                this.propertyData.splice(n, 1);
                            }
                        }
                        let delArr = [];
                        this.__expandProperty.forEach(function (v) {
                            if (v.indexOf(pn) == 0) {
                                delArr.push(v);
                            }
                        });
                        for (let n = 0; n < delArr.length; n++) {
                            this.__expandProperty.delete(delArr[n]);
                        }
                        this.refreshData();
                    }
                }
            }
            else {
                execPropertyEditor();
            }
        }
        else {
            for (let n = this.propertyData.length - 1; n >= 0; n--) {
                if (this.propertyData[n].expandName != "") {
                    this.propertyData.splice(n, 1);
                }
            }
            this.__expandProperty.clear();
            this.refreshData();
            this.scrollY = 0;
        }
    }
    doSetProperties() {
        if (this._classInstrance != undefined) {
            let arr = CClassProperty.getProperties(this._classInstrance);
            this.clear();
            this.clearCellControl();
            this.propertyData = [];
            for (let n = 0; n < arr.length; n++) {
                if (this.onlyShowProperty.length > 0) {
                    let b = false;
                    for (let i = 0; i < this.onlyShowProperty.length; i++) {
                        if (arr[n].propertyName.indexOf(this.onlyShowProperty[i]) >= 0) {
                            b = true;
                        }
                    }
                    if (!b)
                        continue;
                }
                this.propertyData.push({
                    instance: arr[n].instance,
                    classInstance: arr[n].classInstance,
                    propertyName: arr[n].propertyName,
                    className: arr[n].className,
                    expandName: "",
                    readOnly: arr[n].readOnly,
                    enum: arr[n].enum
                });
            }
            this.refreshData();
        }
    }
    doEditorApply(column, row, text) {
        super.doEditorApply(column, row, text);
        if (this.classInstance != undefined) {
            this.classInstance.setProperty(this.propertyData[row].propertyName, text);
        }
    }
    doObjectEditorButtonClick(kind, column, row, cellControlIndex, cellControl, x, y, width, height, e, points) {
        if (this.onObjectEditorButtonClick != undefined) {
            this.onObjectEditorButtonClick(this, kind, column, row, cellControlIndex, cellControl, x, y, width, height, e, points);
        }
    }
    refreshData() {
        this.clear();
        this.readOnlyCell.clear();
        this.clearCellControl();
        this.addCellControl(EPointerAreaKind.HEADER_CLIENT, 1, 0, ECellControlAlign.RIGHT, 15, [1, 1, 1, 1], this.editorButtonCanvasItemsResource, "-");
        this.specificRow.clear();
        for (let n = 0; n < this.propertyData.length; n++) {
            let isExceptionEditor = false;
            let exceptionEditorClassName = "";
            for (let i = 0; i < CPropertyEditor.exceptionPropertyEditor.length; i++) {
                let f = new Function("obj", "return obj instanceof " + CPropertyEditor.exceptionPropertyEditor[i].className);
                let b = f(this.propertyData[n].classInstance);
                let arr = this.propertyData[n].propertyName.split(".");
                //if(b && CPropertyEditor.exceptionPropertyEditor[i].propertyName == this.propertyData[n].propertyName) {
                if (b && CPropertyEditor.exceptionPropertyEditor[i].propertyName == arr[arr.length - 1]) {
                    isExceptionEditor = true;
                    exceptionEditorClassName = CPropertyEditor.exceptionPropertyEditor[i].editorClassName;
                    break;
                }
            }
            if (!isExceptionEditor && typeof this.propertyData[n].instance == "object") {
                let o = CPropertyEditor.classEditor.get(this.propertyData[n].instance.constructor.name);
                if (o != undefined) {
                    isExceptionEditor = true;
                    exceptionEditorClassName = o;
                }
            }
            if (isExceptionEditor) {
                this.readOnlyCell.add("1," + n);
                this.add([this.propertyData[n].propertyName, exceptionEditorClassName]);
                let con = this.addCellControl(EPointerAreaKind.CLIENT, 1, n, ECellControlAlign.RIGHT, 15, [1, 1, 1, 1], this.editorButtonCanvasItemsResource, "..");
                con.data = "exception";
            }
            else {
                if (typeof this.propertyData[n].instance == "object") {
                    this.readOnlyCell.add("1," + n);
                    this.add([this.propertyData[n].propertyName, this.propertyData[n].className]);
                    let con = this.addCellControl(EPointerAreaKind.CLIENT, 1, n, ECellControlAlign.RIGHT, 15, [1, 1, 17, 1], this.editorButtonCanvasItemsResource, "..");
                    con.data = "object";
                    if (this.__expandProperty.has(this.propertyData[n].propertyName)) {
                        con = this.addCellControl(EPointerAreaKind.CLIENT, 1, n, ECellControlAlign.RIGHT, 15, [1, 1, 1, 1], this.editorButtonCanvasItemsResource, "-");
                        con.data = "object";
                    }
                    else {
                        con = this.addCellControl(EPointerAreaKind.CLIENT, 1, n, ECellControlAlign.RIGHT, 15, [1, 1, 1, 1], this.editorButtonCanvasItemsResource, "+");
                        con.data = "object";
                    }
                }
                else if (typeof this.propertyData[n].instance == "boolean") {
                    this.readOnlyCell.add("1," + n);
                    this.add([this.propertyData[n].propertyName, this.propertyData[n].instance]);
                    let con = this.addCellControl(EPointerAreaKind.CLIENT, 1, n, ECellControlAlign.CLIENT, 15, [1, 1, 1, 1], this.editorButtonCanvasItemsResource, this.propertyData[n].instance + "");
                    con.data = "boolean";
                }
                else if (this.propertyData[n].enum.length > 0) {
                    this.readOnlyCell.add("1," + n);
                    this.add([this.propertyData[n].propertyName, this.propertyData[n].instance]);
                    let con = this.addCellControl(EPointerAreaKind.CLIENT, 1, n, ECellControlAlign.CLIENT, 15, [1, 1, 1, 1], this.editorButtonCanvasItemsResource, this.propertyData[n].enum[this.propertyData[n].instance]);
                    con.data = "enum";
                }
                else {
                    if (this.propertyData[n].readOnly)
                        this.readOnlyCell.add("1," + n);
                    this.add([this.propertyData[n].propertyName, this.propertyData[n].instance]);
                }
            }
            if (this.propertyData[n].expandName != "") {
                let arr = this.propertyData[n].expandName.split(".");
                if (arr.length % 2 == 1) {
                    this.addSpecificRow(this.expandPropertyCellCanvasItemsResource1, EPointerAreaKind.CLIENT, n);
                }
                else {
                    this.addSpecificRow(this.expandPropertyCellCanvasItemsResource2, EPointerAreaKind.CLIENT, n);
                }
            }
        }
    }
}
CPropertyEditor.classEditor = new Map();
CPropertyEditor.ignoreProperty = new Set();
CPropertyEditor.exceptionPropertyEditor = new Array();
class CTabPropertyEditor extends CTab {
    constructor(parent, name) {
        super(parent, name);
        this._propertyEditors = new CList();
        this._scrollbarLength = 10;
        this._scrollbarResource = "";
        this._headerResource = [];
        this._cellResource = [];
        this._expandPropertyCellCanvasItemsResource1 = "";
        this._expandPropertyCellCanvasItemsResource2 = "";
        this._editorButtonCanvasItemsResource = "";
        this._enumListBoxResource = "";
        this._enumListItemResource = [];
        this._propertyEditorResource = "";
        this.onlyShowProperty = new Array();
        this.useAddButton = false;
        this.useArrowButton = true;
        this.useDeleteButton = true;
    }
    get propertyEditors() {
        return this._propertyEditors;
    }
    get scrollbarLength() {
        return this._scrollbarLength;
    }
    set scrollbarLength(value) {
        if (this._scrollbarLength != value) {
            this._scrollbarLength = value;
            for (let n = 0; n < this.propertyEditors.length; n++) {
                this.propertyEditors.get(n).scrollBox.scrollbarLength = value;
            }
        }
    }
    get scrollbarResource() {
        return this._scrollbarResource;
    }
    set scrollbarResource(value) {
        if (this._scrollbarResource != value) {
            this._scrollbarResource = value;
            for (let n = 0; n < this.propertyEditors.length; n++) {
                this.propertyEditors.get(n).scrollBox.scrollbarResource = value;
            }
        }
    }
    get headerResource() {
        return this._headerResource;
    }
    set headerResource(value) {
        if (this._headerResource != value) {
            this._headerResource = value;
            for (let n = 0; n < this.propertyEditors.length; n++) {
                this.propertyEditors.get(n).headerResource = value;
            }
        }
    }
    get propertyEditorResource() {
        return this._propertyEditorResource;
    }
    set propertyEditorResource(value) {
        if (this._propertyEditorResource != value) {
            this._propertyEditorResource = value;
            if (value != "") {
                for (let n = 0; n < this.propertyEditors.length; n++) {
                    this.propertyEditors.get(n).resource = value;
                }
            }
        }
    }
    get cellResource() {
        return this._cellResource;
    }
    set cellResource(value) {
        if (this._cellResource != value) {
            this._cellResource = value;
            for (let n = 0; n < this.propertyEditors.length; n++) {
                this.propertyEditors.get(n).cellResource = value;
            }
        }
    }
    get expandPropertyCellCanvasItemsResource1() {
        return this._expandPropertyCellCanvasItemsResource1;
    }
    set expandPropertyCellCanvasItemsResource1(value) {
        if (this._expandPropertyCellCanvasItemsResource1 != value) {
            this._expandPropertyCellCanvasItemsResource1 = value;
            for (let n = 0; n < this.propertyEditors.length; n++) {
                this.propertyEditors.get(n).expandPropertyCellCanvasItemsResource1 = value;
            }
        }
    }
    get expandPropertyCellCanvasItemsResource2() {
        return this._expandPropertyCellCanvasItemsResource2;
    }
    set expandPropertyCellCanvasItemsResource2(value) {
        if (this._expandPropertyCellCanvasItemsResource2 != value) {
            this._expandPropertyCellCanvasItemsResource2 = value;
            for (let n = 0; n < this.propertyEditors.length; n++) {
                this.propertyEditors.get(n).expandPropertyCellCanvasItemsResource2 = value;
            }
        }
    }
    get editorButtonCanvasItemsResource() {
        return this._editorButtonCanvasItemsResource;
    }
    set editorButtonCanvasItemsResource(value) {
        if (this._editorButtonCanvasItemsResource != value) {
            this._editorButtonCanvasItemsResource = value;
            for (let n = 0; n < this.propertyEditors.length; n++) {
                this.propertyEditors.get(n).editorButtonCanvasItemsResource = value;
            }
        }
    }
    get enumListBoxResource() {
        return this._enumListBoxResource;
    }
    set enumListBoxResource(value) {
        if (this._enumListBoxResource != value) {
            this._enumListBoxResource = value;
            for (let n = 0; n < this.propertyEditors.length; n++) {
                this.propertyEditors.get(n).enumListBoxResource = value;
            }
        }
    }
    get enumListItemResource() {
        return this._enumListItemResource;
    }
    set enumListItemResource(value) {
        if (this._enumListItemResource != value) {
            this._enumListItemResource = value;
            for (let n = 0; n < this.propertyEditors.length; n++) {
                this.propertyEditors.get(n).enumListItemResource = value;
            }
        }
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "scrollbarLength", this.scrollbarLength, 10);
        CDataClass.putData(data, "scrollbarResource", this.scrollbarResource, "");
        CDataClass.putData(data, "headerResource", this.headerResource, [], true);
        CDataClass.putData(data, "cellResource", this.cellResource, [], true);
        CDataClass.putData(data, "expandPropertyCellCanvasItemsResource1", this.expandPropertyCellCanvasItemsResource1, "");
        CDataClass.putData(data, "expandPropertyCellCanvasItemsResource2", this.expandPropertyCellCanvasItemsResource2, "");
        CDataClass.putData(data, "editorButtonCanvasItemsResource", this.editorButtonCanvasItemsResource, "");
        CDataClass.putData(data, "enumListBoxResource", this.enumListBoxResource, "");
        CDataClass.putData(data, "enumListItemResource", this.enumListItemResource, [], true);
        CDataClass.putData(data, "propertyEditorResource", this.propertyEditorResource, "");
    }
    doFromData(data) {
        super.doFromData(data);
        this.scrollbarLength = CDataClass.getData(data, "scrollbarLength", 10);
        this.scrollbarResource = CDataClass.getData(data, "scrollbarResource", "");
        this.headerResource = CDataClass.getData(data, "headerResource", [], true);
        this.cellResource = CDataClass.getData(data, "cellResource", [], true);
        this.expandPropertyCellCanvasItemsResource1 = CDataClass.getData(data, "expandPropertyCellCanvasItemsResource1", "");
        this.expandPropertyCellCanvasItemsResource2 = CDataClass.getData(data, "expandPropertyCellCanvasItemsResource2", "");
        this.editorButtonCanvasItemsResource = CDataClass.getData(data, "editorButtonCanvasItemsResource", "");
        this.enumListBoxResource = CDataClass.getData(data, "enumListBoxResource", "");
        this.enumListItemResource = CDataClass.getData(data, "enumListItemResource", [], true);
        this.propertyEditorResource = CDataClass.getData(data, "propertyEditorResource", "");
    }
    doResource() {
        super.doResource();
        this.useAddButton = false;
        this.useArrowButton = true;
        this.useDeleteButton = true;
    }
    doDeleteTab() {
        super.doDeleteTab();
        this.setPropertyEditors();
    }
    doCreateSheet(index, tabSheet) {
        super.doCreateSheet(index, tabSheet);
        //if(this._propertyEditors.length <= index) this._propertyEditors.length = index + 1
        let pe = new CPropertyEditor(tabSheet);
        pe.editorCover = this.editorCover;
        pe.onlyShowProperty = this.onlyShowProperty;
        pe.resource = this.propertyEditorResource;
        pe.position.align = EPositionAlign.CLIENT;
        pe.scrollBox.scrollbarLength = this.scrollbarLength;
        pe.scrollBox.scrollbarResource = this.scrollbarResource;
        pe.headerResource = this.headerResource;
        pe.cellResource = this.cellResource;
        pe.expandPropertyCellCanvasItemsResource1 = this.expandPropertyCellCanvasItemsResource1;
        pe.expandPropertyCellCanvasItemsResource2 = this.expandPropertyCellCanvasItemsResource2;
        pe.editorButtonCanvasItemsResource = this.editorButtonCanvasItemsResource;
        pe.enumListBoxResource = this.enumListBoxResource;
        pe.enumListItemResource = this.enumListItemResource;
        pe.onBeforeCellDraw = function (s, k, col, row, data, bounds) {
            if (pe.cell(col, row) == "layers" ||
                pe.cell(col, row) == "position" ||
                pe.cell(col, row) == "transform" ||
                pe.cell(col, row) == "filter" ||
                pe.cell(col, row) == "fill" ||
                pe.cell(col, row) == "stroke" ||
                pe.cell(col, row) == "resource") {
                let items = new CCanvasItems();
                items.fromData(data.toData());
                let txt = items.getItem("text");
                for (let n = 0; n < txt.length; n++) {
                    txt[n].textSet.fill.solidColor = "#ffffFF";
                }
                return items;
            }
        };
        this.managementButtonLength = 25;
        //this._propertyEditors.set(index, pe)
        this.setPropertyEditors();
        let self = this;
        pe.onObjectEditorButtonClick = function (s, kind, col, row, cellcontrolidx, cellcontrol, x, y, width, height, e, points) {
            self.addInstance(pe.propertyData[row].instance);
        };
    }
    setPropertyEditors() {
        this._propertyEditors.clear();
        for (let n = 0; n < this.tabSheets.length; n++) {
            let arr = CSystem.getChildControls(this.tabSheets.get(n));
            this._propertyEditors.add(arr[0]);
        }
    }
    addInstance(instance, name) {
        if (name != undefined) {
            this.addTab(name);
        }
        else {
            this.addTab(instance.constructor.name);
        }
        this.propertyEditors.get(this.index).classInstance = instance;
    }
    deleteInstance(instance) {
        for (let n = 0; n < this.propertyEditors.length; n++) {
            if (this.propertyEditors.get(n).classInstance == instance) {
                this.deleteTab(n);
                break;
            }
        }
    }
}
class CClassProperty {
    static getProperties(classInstance) {
        let arr = Object.keys(classInstance);
        let rt = new Array();
        for (let n = 0; n < arr.length; n++) {
            let setRead;
            if (classInstance["readOnlyProperties"] != undefined && typeof classInstance["readOnlyProperties"] == "function") {
                setRead = classInstance["readOnlyProperties"]();
            }
            let setDel;
            if (classInstance["deleteProperties"] != undefined && typeof classInstance["deleteProperties"] == "function") {
                setDel = classInstance["deleteProperties"]();
            }
            let mapEnum;
            if (classInstance["enumProperties"] != undefined && typeof classInstance["enumProperties"] == "function") {
                mapEnum = classInstance["enumProperties"]();
            }
            if (!(arr[n].indexOf("__") == 0)) {
                let pn = arr[n];
                if (arr[n].indexOf("_") == 0) {
                    pn = arr[n].substring(1);
                }
                let f = new Function("obj", "return obj." + pn);
                let obj = f(classInstance);
                if (!CPropertyEditor.ignoreProperty.has(classInstance.constructor.name + "." + pn) &&
                    !CPropertyEditor.ignoreProperty.has("all." + pn) &&
                    !(setDel != undefined && setDel.has(pn))) {
                    let e = [];
                    if (mapEnum != undefined) {
                        let ee = mapEnum.get(pn);
                        if (ee != undefined) {
                            e = ee;
                        }
                    }
                    if (typeof obj == "object") {
                        rt.push({ instance: obj, classInstance: classInstance, className: obj.constructor.name, propertyName: pn, readOnly: setRead != undefined && setRead.has(pn), enum: e });
                    }
                    else if (typeof obj == "function") { }
                    else {
                        rt.push({ instance: obj, classInstance: classInstance, className: "", propertyName: pn, readOnly: setRead != undefined && setRead.has(pn), enum: e });
                    }
                }
            }
        }
        if (classInstance["addProperties"] != undefined && typeof classInstance["addProperties"] == "function") {
            let arr = classInstance["addProperties"]();
            for (let n = 0; n < arr.length; n++) {
                if (classInstance[arr[n].propertyName] == undefined) {
                    if (typeof arr[n] == "object") {
                        if (arr[n].instance == undefined) {
                            rt.push({ instance: undefined, classInstance: classInstance, className: "", propertyName: arr[n].propertyName, readOnly: arr[n].readOnly, enum: arr[n].enum });
                        }
                        else {
                            rt.push({ instance: arr[n].instance, classInstance: classInstance, className: arr[n].instance.constructor.name, propertyName: arr[n].propertyName, readOnly: arr[n].readOnly, enum: arr[n].enum });
                        }
                    }
                    else if (typeof arr[n] == "function") { }
                    else {
                        rt.push({ instance: arr[n].instance, classInstance: classInstance, className: "", propertyName: arr[n].propertyName, readOnly: arr[n].readOnly, enum: arr[n].enum });
                    }
                }
                else {
                    rt.push({ instance: arr[n].instance, classInstance: classInstance, className: arr[n].instance.constructor.name, propertyName: arr[n].propertyName, readOnly: arr[n].readOnly, enum: arr[n].enum });
                }
            }
        }
        rt.sort(function (a, b) {
            let rt = 0;
            if (a.propertyName > b.propertyName)
                rt = 1;
            if (a.propertyName < b.propertyName)
                rt = -1;
            return rt;
        });
        return rt;
    }
}
class CCustomPropertyEditor extends CWindowBlue {
    constructor() {
        super(...arguments);
        this.contentInitResource = "";
        this.property = "";
        this.defalutWidth = 800;
        this.defalutHeight = 400;
    }
    get instance() {
        return this._instance;
    }
    set instance(value) {
        if (this._instance != value) {
            this._instance = value;
            this.doChangeInstance();
        }
    }
    doChangeInstance() {
        if (this.onChangeInstance != undefined) {
            this.onChangeInstance(this);
        }
    }
    doApply(value) {
        this._instance[this.property] = value;
    }
}
class CCustomPropertyEditorControl extends CPanel {
    constructor(parent, name) {
        super(parent, name);
        this.contentInitResource = "";
        this.property = "";
        this.defalutWidth = 400;
        this.defalutHeight = 400;
        this.filter.filterSet.shadow = true;
        this.filter.shadowX = 0;
        this.filter.shadowY = 0;
        this.filter.shadowBlur = 20;
        this.useResize = true;
        this.resizeAreaLength = 10;
        this.position.padding.all = 10;
        let i = this.layers.addLayer().items.addItem();
        i.fill.styleKind = EStyleKind.SOLID;
        i.fill.solidColor = "#202020";
        i.radiusX = 5;
        i.radiusY = 5;
    }
    get instance() {
        return this._instance;
    }
    set instance(value) {
        if (this._instance != value) {
            this._instance = value;
            this.doChangeInstance();
        }
    }
    doChangeInstance() {
        if (this.onChangeInstance != undefined) {
            this.onChangeInstance(this);
        }
    }
    doApply(value) {
        this._instance[this.property] = value;
    }
}
class CBasePropertyEditor extends CCustomPropertyEditor {
    constructor(parent, name) {
        super(parent, name);
        this.frame = new CTabPropertyEditor(this.body);
        this.frame.resource = "tab_property_editor.control";
        this.frame.position.align = EPositionAlign.CLIENT;
        this.frame.tabButtons.position.height = 0;
        this.frame.editorCover = CSystem.browserCovers.get("cover");
    }
    doChangeInstance() {
        this.frame.addInstance(this.instance);
        super.doChangeInstance();
    }
}
class CFillPropertyEditor extends CCustomPropertyEditor {
    constructor(parent, name) {
        super(parent, name);
        this.frame = new CFillEditorFrame(this.body);
        this.defalutWidth = 481;
        this.defalutHeight = 500;
        this.frame.position.align = EPositionAlign.CLIENT;
    }
    doChangeInstance() {
        this.frame.fill = this.instance[this.property];
        super.doChangeInstance();
    }
}
class CFillPropertyEditorCover extends CCustomPropertyEditorControl {
    constructor(parent, name) {
        super(parent, name);
        this.frame = new CFillEditorFrame(this);
        this.defalutWidth = 481;
        this.defalutHeight = 500;
        this.frame.position.align = EPositionAlign.CLIENT;
    }
    doChangeInstance() {
        this.frame.fill = this.instance[this.property];
        super.doChangeInstance();
    }
}
class CStrokePropertyEditor extends CCustomPropertyEditor {
    constructor(parent, name) {
        super(parent, name);
        this.frame = new CStrokeEditorFrame(this.body);
        this.defalutWidth = 481;
        this.defalutHeight = 500;
        this.frame.position.align = EPositionAlign.CLIENT;
    }
    doChangeInstance() {
        this.frame.stroke = this.instance[this.property];
        super.doChangeInstance();
    }
}
class CStrokePropertyEditorCover extends CCustomPropertyEditorControl {
    constructor(parent, name) {
        super(parent, name);
        this.frame = new CStrokeEditorFrame(this);
        this.defalutWidth = 481;
        this.defalutHeight = 500;
        this.frame.position.align = EPositionAlign.CLIENT;
    }
    doChangeInstance() {
        this.frame.stroke = this.instance[this.property];
        super.doChangeInstance();
    }
}
class CPathPropertyEditor extends CCustomPropertyEditor {
    constructor(parent, name) {
        super(parent, name);
        this.frame = new CPathEditorFrame(this.body);
        this.defalutWidth = 800;
        this.defalutHeight = 550;
        this.frame.position.align = EPositionAlign.CLIENT;
    }
    doChangeInstance() {
        this.frame.pathData = this.instance[this.property];
        if (this.frame.pathData != undefined)
            this.frame.item.pathData.copyFrom(this.frame.pathData);
        this.frame.lblWidth.value = this.frame.item.pathData.width + "";
        this.frame.lblheight.value = this.frame.item.pathData.height + "";
        this.frame.btnSize.click();
        this.frame.refresh();
        super.doChangeInstance();
    }
}
class CPathPropertyEditorCover extends CCustomPropertyEditorControl {
    constructor(parent, name) {
        super(parent, name);
        this.frame = new CPathEditorFrame(this);
        this.defalutWidth = 800;
        this.defalutHeight = 550;
        this.frame.position.align = EPositionAlign.CLIENT;
    }
    doChangeInstance() {
        this.frame.pathData = this.instance[this.property];
        if (this.frame.pathData != undefined)
            this.frame.item.pathData.copyFrom(this.frame.pathData);
        this.frame.lblWidth.value = this.frame.item.pathData.width + "";
        this.frame.lblheight.value = this.frame.item.pathData.height + "";
        this.frame.btnSize.click();
        //this.frame.item.pathData.fit(new CRect(0, 0, 400, 400))
        this.frame.refresh();
        super.doChangeInstance();
    }
}
class CStringListPropertyEditor extends CCustomPropertyEditor {
    constructor(parent, name) {
        super(parent, name);
        this.editor = new CTextAreaFrame(this.body);
        let self = this;
        this.editor.position.align = EPositionAlign.CLIENT;
        this.editor.btnOk.onClick = function () {
            self.doApply("");
        };
    }
    doChangeInstance() {
        if (typeof this.instance[this.property] == "string") {
            this.editor.textArea.text = this.instance[this.property];
        }
        if (typeof this.instance[this.property] == "object") {
            if (this.instance[this.property] instanceof CList) {
                let lst = this.instance[this.property];
                let s = "";
                for (let n = 0; n < lst.length; n++) {
                    if (n == 0) {
                        s += lst.get(n);
                    }
                    else {
                        s += "\n" + lst.get(n);
                    }
                }
                this.editor.textArea.text = s;
            }
            if (this.instance[this.property] instanceof Array) {
                this.editor.textArea.text = JSON.stringify(this.instance[this.property]);
            }
            if (this.instance[this.property] instanceof CStringSet) {
                let lst = this.instance[this.property];
                let s = "";
                lst.forEach(function (v) {
                    if (s == "") {
                        s += v;
                    }
                    else {
                        s += "\n" + v;
                    }
                });
                this.editor.textArea.text = s;
            }
            if (this.instance[this.property] instanceof CNNMap || this.instance[this.property] instanceof CSSMap) {
                let map = this.instance[this.property];
                this.editor.textArea.text = JSON.stringify(map.toData(), undefined, 2);
            }
            if (this.instance[this.property] instanceof Set) {
                let arr = [];
                this.instance[this.property].forEach(function (v) {
                    arr.push(v);
                });
                this.editor.textArea.text = JSON.stringify(arr);
            }
            if (this.instance[this.property] instanceof Map) {
                let arr = [];
                this.instance[this.property].forEach(function (v, k) {
                    arr.push({ key: k, value: v });
                });
                this.editor.textArea.text = JSON.stringify(arr);
            }
        }
        super.doChangeInstance();
    }
    doApply(value) {
        if (typeof this.instance[this.property] == "string") {
            this.instance[this.property] = this.editor.textArea.text;
        }
        if (typeof this.instance[this.property] == "object") {
            if (this.instance[this.property] instanceof CList) {
                let lst = this.instance[this.property];
                lst.clear();
                let arr = this.editor.textArea.text.split("\n");
                for (let n = 0; n < arr.length; n++) {
                    lst.add(arr[n]);
                }
            }
            if (this.instance[this.property] instanceof Array) {
                this.instance[this.property] = JSON.parse(this.editor.textArea.text);
            }
            if (this.instance[this.property] instanceof CStringSet) {
                let lst = this.instance[this.property];
                lst.clear();
                let arr = this.editor.textArea.text.split("\n");
                for (let n = 0; n < arr.length; n++) {
                    lst.add(arr[n]);
                }
            }
            if (this.instance[this.property] instanceof CNNMap || this.instance[this.property] instanceof CSSMap) {
                this.instance[this.property].fromData(JSON.parse(this.editor.textArea.text));
            }
            if (this.instance[this.property] instanceof Set) {
                let arr = JSON.parse(this.editor.textArea.text);
                let set = new Set();
                for (let n = 0; n < arr.length; n++) {
                    set.add(arr[n]);
                }
                this.instance[this.property] = set;
            }
            if (this.instance[this.property] instanceof Map) {
                let arr = JSON.parse(this.editor.textArea.text);
                let map = new Map();
                for (let n = 0; n < arr.length; n++) {
                    map.set(arr[n].key, arr[n].value);
                }
                this.instance[this.property] = map;
            }
        }
    }
}
class CStringListPropertyEditorCover extends CCustomPropertyEditorControl {
    constructor(parent, name) {
        super(parent, name);
        this.editor = new CTextAreaFrame(this);
        let self = this;
        this.editor.position.align = EPositionAlign.CLIENT;
        this.editor.btnOk.onClick = function () {
            self.doApply("");
        };
    }
    doChangeInstance() {
        if (typeof this.instance[this.property] == "string") {
            this.editor.textArea.text = this.instance[this.property];
        }
        if (typeof this.instance[this.property] == "object") {
            if (this.instance[this.property] instanceof CList) {
                let lst = this.instance[this.property];
                let s = "";
                for (let n = 0; n < lst.length; n++) {
                    if (n == 0) {
                        s += lst.get(n);
                    }
                    else {
                        s += "\n" + lst.get(n);
                    }
                }
                this.editor.textArea.text = s;
            }
            if (this.instance[this.property] instanceof Array) {
                this.editor.textArea.text = JSON.stringify(this.instance[this.property]);
            }
            if (this.instance[this.property] instanceof CStringSet) {
                let lst = this.instance[this.property];
                let s = "";
                lst.forEach(function (v) {
                    if (s == "") {
                        s += v;
                    }
                    else {
                        s += "\n" + v;
                    }
                });
                this.editor.textArea.text = s;
            }
            if (this.instance[this.property] instanceof CNNMap || this.instance[this.property] instanceof CSSMap) {
                let map = this.instance[this.property];
                this.editor.textArea.text = JSON.stringify(map.toData(), undefined, 2);
            }
            if (this.instance[this.property] instanceof Set) {
                let arr = [];
                this.instance[this.property].forEach(function (v) {
                    arr.push(v);
                });
                this.editor.textArea.text = JSON.stringify(arr);
            }
            if (this.instance[this.property] instanceof Map) {
                let arr = [];
                this.instance[this.property].forEach(function (v, k) {
                    arr.push({ key: k, value: v });
                });
                this.editor.textArea.text = JSON.stringify(arr);
            }
        }
        super.doChangeInstance();
    }
    doApply(value) {
        if (typeof this.instance[this.property] == "string") {
            this.instance[this.property] = this.editor.textArea.text;
        }
        if (typeof this.instance[this.property] == "object") {
            if (this.instance[this.property] instanceof CList) {
                let lst = this.instance[this.property];
                lst.clear();
                let arr = this.editor.textArea.text.split("\n");
                for (let n = 0; n < arr.length; n++) {
                    lst.add(arr[n]);
                }
            }
            if (this.instance[this.property] instanceof Array) {
                this.instance[this.property] = JSON.parse(this.editor.textArea.text);
            }
            if (this.instance[this.property] instanceof CStringSet) {
                let lst = this.instance[this.property];
                lst.clear();
                let arr = this.editor.textArea.text.split("\n");
                for (let n = 0; n < arr.length; n++) {
                    lst.add(arr[n]);
                }
            }
            if (this.instance[this.property] instanceof CNNMap || this.instance[this.property] instanceof CSSMap) {
                this.instance[this.property].fromData(JSON.parse(this.editor.textArea.text));
            }
            if (this.instance[this.property] instanceof Set) {
                let arr = JSON.parse(this.editor.textArea.text);
                let set = new Set();
                for (let n = 0; n < arr.length; n++) {
                    set.add(arr[n]);
                }
                this.instance[this.property] = set;
            }
            if (this.instance[this.property] instanceof Map) {
                let arr = JSON.parse(this.editor.textArea.text);
                let map = new Map();
                for (let n = 0; n < arr.length; n++) {
                    map.set(arr[n].key, arr[n].value);
                }
                this.instance[this.property] = map;
            }
        }
    }
}
//CPropertyEditor.classEditor.set("CFillSet", "CFillPropertyEditor")
CPropertyEditor.classEditor.set("CFillSet", "CFillPropertyEditorCover");
CPropertyEditor.classEditor.set("CStrokeSet", "CStrokePropertyEditorCover");
CPropertyEditor.classEditor.set("CCanvasLayers", "CCanvasLayersPropertyEditorCover");
CPropertyEditor.classEditor.set("CNNMap", "CStringListPropertyEditorCover");
CPropertyEditor.classEditor.set("CSSMap", "CStringListPropertyEditorCover");
CPropertyEditor.classEditor.set("CNumberList", "CStringListPropertyEditorCover");
CPropertyEditor.classEditor.set("CStringList", "CStringListPropertyEditorCover");
CPropertyEditor.classEditor.set("Array", "CStringListPropertyEditorCover");
CPropertyEditor.classEditor.set("ArrayString", "CStringListPropertyEditorCover");
CPropertyEditor.classEditor.set("Set", "CStringListPropertyEditorCover");
CPropertyEditor.classEditor.set("Map", "CStringListPropertyEditorCover");
CPropertyEditor.classEditor.set("CPathPointList", "CPathPropertyEditorCover");
CPropertyEditor.classEditor.set("CStringSet", "CStringListPropertyEditorCover");
CPropertyEditor.exceptionPropertyEditor.push({ className: "CPanel", propertyName: "text", editorClassName: "CStringListPropertyEditorCover" });
CPropertyEditor.exceptionPropertyEditor.push({ className: "CCanvasItem", propertyName: "text", editorClassName: "CStringListPropertyEditorCover" });
CPropertyEditor.exceptionPropertyEditor.push({ className: "CTab", propertyName: "tabs", editorClassName: "CStringListPropertyEditorCover" });
CPropertyEditor.exceptionPropertyEditor.push({ className: "CCanvasItem", propertyName: "disableRoundSet", editorClassName: "CStringListPropertyEditorCover" });
CPropertyEditor.exceptionPropertyEditor.push({ className: "CCanvasItem", propertyName: "disableLineSet", editorClassName: "CStringListPropertyEditorCover" });
CPropertyEditor.exceptionPropertyEditor.push({ className: "CListBox", propertyName: "items", editorClassName: "CStringListPropertyEditorCover" });
CPropertyEditor.exceptionPropertyEditor.push({ className: "CListBox", propertyName: "listItemResource", editorClassName: "CStringListPropertyEditorCover" });
CPropertyEditor.exceptionPropertyEditor.push({ className: "CControl", propertyName: "focusedAnimationTrigger", editorClassName: "CAnimatorPropertyEditorCover" });
CPropertyEditor.exceptionPropertyEditor.push({ className: "CControl", propertyName: "enabledAnimationTrigger", editorClassName: "CAnimatorPropertyEditorCover" });
CPropertyEditor.exceptionPropertyEditor.push({ className: "CControl", propertyName: "visibleAnimationTrigger", editorClassName: "CAnimatorPropertyEditorCover" });
CPropertyEditor.exceptionPropertyEditor.push({ className: "CControl", propertyName: "resourceAnimationTrigger", editorClassName: "CAnimatorPropertyEditorCover" });
CPropertyEditor.exceptionPropertyEditor.push({ className: "CControl", propertyName: "selectAnimationTrigger", editorClassName: "CAnimatorPropertyEditorCover" });
CPropertyEditor.exceptionPropertyEditor.push({ className: "CControl", propertyName: "checkAnimationTrigger", editorClassName: "CAnimatorPropertyEditorCover" });
CPropertyEditor.exceptionPropertyEditor.push({ className: "CControl", propertyName: "removeAnimationTrigger", editorClassName: "CAnimatorPropertyEditorCover" });
CPropertyEditor.exceptionPropertyEditor.push({ className: "CPointerEventControl", propertyName: "overAnimationTrigger", editorClassName: "CAnimatorPropertyEditorCover" });
CPropertyEditor.exceptionPropertyEditor.push({ className: "CPointerEventControl", propertyName: "thisPointerDownAnimationTrigger", editorClassName: "CAnimatorPropertyEditorCover" });
CPropertyEditor.exceptionPropertyEditor.push({ className: "CPointerEventControl", propertyName: "thisPointerUpAnimationTrigger", editorClassName: "CAnimatorPropertyEditorCover" });
CPropertyEditor.exceptionPropertyEditor.push({ className: "CPointerEventControl", propertyName: "enterAnimationTrigger", editorClassName: "CAnimatorPropertyEditorCover" });
CPropertyEditor.exceptionPropertyEditor.push({ className: "CPointerEventControl", propertyName: "clickAnimationTrigger", editorClassName: "CAnimatorPropertyEditorCover" });
CPropertyEditor.exceptionPropertyEditor.push({ className: "CPointerEventControl", propertyName: "doubleClickAnimationTrigger", editorClassName: "CAnimatorPropertyEditorCover" });
CPropertyEditor.exceptionPropertyEditor.push({ className: "CPointerEventControl", propertyName: "dragStartAnimationTrigger", editorClassName: "CAnimatorPropertyEditorCover" });
CPropertyEditor.exceptionPropertyEditor.push({ className: "CPointerEventControl", propertyName: "dragCancelAnimationTrigger", editorClassName: "CAnimatorPropertyEditorCover" });
CPropertyEditor.exceptionPropertyEditor.push({ className: "CPointerEventControl", propertyName: "dragCatchAnimationTrigger", editorClassName: "CAnimatorPropertyEditorCover" });
CPropertyEditor.exceptionPropertyEditor.push({ className: "CPointerEventControl", propertyName: "keyDownAnimationTrigger", editorClassName: "CAnimatorPropertyEditorCover" });
CPropertyEditor.exceptionPropertyEditor.push({ className: "CCover", propertyName: "showAnimationTrigger", editorClassName: "CAnimatorPropertyEditorCover" });
CPropertyEditor.exceptionPropertyEditor.push({ className: "CCover", propertyName: "hideAnimationTrigger", editorClassName: "CAnimatorPropertyEditorCover" });
CPropertyEditor.exceptionPropertyEditor.push({ className: "CDragIcon", propertyName: "dropAnimationTrigger", editorClassName: "CAnimatorPropertyEditorCover" });
CPropertyEditor.exceptionPropertyEditor.push({ className: "CDragIcon", propertyName: "cancelAnimationTrigger", editorClassName: "CAnimatorPropertyEditorCover" });
CPropertyEditor.exceptionPropertyEditor.push({ className: "CHint", propertyName: "hideAnimationTrigger", editorClassName: "CAnimatorPropertyEditorCover" });
CPropertyEditor.exceptionPropertyEditor.push({ className: "CWindowModel", propertyName: "showAnimationTrigger", editorClassName: "CAnimatorPropertyEditorCover" });
CPropertyEditor.exceptionPropertyEditor.push({ className: "CWindowModel", propertyName: "hideAnimationTrigger", editorClassName: "CAnimatorPropertyEditorCover" });
CPropertyEditor.exceptionPropertyEditor.push({ className: "CWindowModel", propertyName: "activateAnimationTrigger", editorClassName: "CAnimatorPropertyEditorCover" });
CPropertyEditor.exceptionPropertyEditor.push({ className: "CWindowModel", propertyName: "maximizeAnimationTrigger", editorClassName: "CAnimatorPropertyEditorCover" });
CPropertyEditor.exceptionPropertyEditor.push({ className: "CWindowModel", propertyName: "minimizeAnimationTrigger", editorClassName: "CAnimatorPropertyEditorCover" });
CPropertyEditor.exceptionPropertyEditor.push({ className: "CWindowModel", propertyName: "customAlignAnimationTrigger", editorClassName: "CAnimatorPropertyEditorCover" });
CPropertyEditor.exceptionPropertyEditor.push({ className: "CFold", propertyName: "foldAnimationTrigger", editorClassName: "CAnimatorPropertyEditorCover" });
CPropertyEditor.ignoreProperty.add("all.useChangeEvent");
CPropertyEditor.ignoreProperty.add("all.element");
CPropertyEditor.ignoreProperty.add("all.controlElement");
CPropertyEditor.ignoreProperty.add("CNotifyRect.resource");
CPropertyEditor.ignoreProperty.add("CClock.hourAngle");
CPropertyEditor.ignoreProperty.add("CClock.minuteAngle");
CPropertyEditor.ignoreProperty.add("CClock.secondAngle");
CPropertyEditor.ignoreProperty.add("CDataGrid.cellPressed");
