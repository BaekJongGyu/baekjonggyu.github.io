"use strict";
class CGradientEditorModel extends CPanel {
    constructor(parent, name) {
        super(parent, name);
        this._gradient = new CGradient();
        this._handleLength = 30;
        this.clientLayout = new CPanel(this);
        this.clientTopLayout = new CPanel(this.clientLayout);
        this.buttonAddColor = new CButton(this.clientTopLayout);
        this.buttonDeleteColor = new CButton(this.clientTopLayout);
        this.buttonRadial = new CSelectGroupBox(this.clientTopLayout);
        this.buttonLinear = new CSelectGroupBox(this.clientTopLayout);
        this.gradientAngleBox = new CMultiSlideBox(this.clientLayout);
        this.gradientBar = new CMultiSlideBox(this.clientLayout);
        this.rightLayout = new CPanel(this);
        this.colorSelector = new CColorSelector(this.rightLayout);
        this.scrollStartRadius = new CScrollbar(this.rightLayout);
        this.scrollStopRadius = new CScrollbar(this.rightLayout);
        this.grid = new CDataGrid(this.rightLayout);
        this.splitterR = new CSplitter(this);
        let self = this;
        this.gradientBar.onHandleTrack = function (s, handle, x, y, cx, cy) {
            self.doSetGradientBar();
        };
        this.gradientBar.onCreateHandle = function (s, h) {
            h.onThisPointerDown = function () {
                self.doSetSelectHandle(h);
            };
        };
        this.gradientBar.onChangeSize = function () {
            self.doSetHandle();
            self.doSetGradientBar();
        };
        this.startPointControl = this.gradientAngleBox.addHandle(this.gradientAngleHandleResource, -15, -15);
        this.startPointControl.data = 0;
        this.stopPointControl = this.gradientAngleBox.addHandle(this.gradientAngleHandleResource, -15, -15);
        this.stopPointControl.data = 1;
        this.gradientAngleBox.onHandleTrack = function (s, h, x, y, cx, cy) {
            self.doSetGradientAngle();
        };
        this.gradientAngleBox.onChangeSize = function () {
            self.doSetHandle();
        };
        this.colorSelector.onChangeColor = function () {
            if (self.__selectedHandle != undefined) {
                self.__selectedHandle.data = self.colorSelector.color;
                if (self.__selectedHandle.layers.length > 0 && self.__selectedHandle.layers.get(0).items.length > 0) {
                    self.__selectedHandle.layers.get(0).items.get(0).fill.solidColor = self.colorSelector.color;
                }
                self.doSetGradientBar();
            }
        };
        this.buttonAddColor.onClick = function () {
            let h = self.addGradientPoint(0, "rgba(255,255,255,0.5)");
            self.doSetSelectHandle(h);
        };
        this.buttonDeleteColor.onClick = function () {
            if (self.__selectedHandle != undefined) {
                for (let n = 0; n < self.gradientBar.slideHandles.length; n++) {
                    if (self.__selectedHandle == self.gradientBar.slideHandles.get(n)) {
                        self.gradientBar.deleteHandle(n);
                        break;
                    }
                }
                self.doSetGradientBar();
            }
        };
        this.buttonLinear.onClick = function () {
            self.doChangeGradientKind(EGradientKind.LINEAR);
        };
        this.buttonRadial.onClick = function () {
            self.doChangeGradientKind(EGradientKind.RADIAL);
        };
        this.buttonLinear.groupName = this.name + "gra";
        this.buttonRadial.groupName = this.name + "gra";
        this.scrollStartRadius.onChangeValue = function () {
            self.doSetGradientAngle();
        };
        this.scrollStopRadius.onChangeValue = function () {
            self.doSetGradientAngle();
        };
        this.grid.editable = true;
        this.grid.editorShowSet.add(EEditorShowKind.DOUBLE_CLICK);
        this.grid.editorShowSet.add(EEditorShowKind.F2_KEY);
        this.grid.onEditorApply = function (s, col, row, text) {
            let h = self.gradientBar.slideHandles.get(row);
            if (col == 0) {
                h.position.left = CCalc.crRange2Value(0, 1, parseFloat(text), -(self.handleLength / 2), self.gradientBar.position.width - (self.handleLength / 2));
            }
            else {
                h.data = text;
            }
            self.doSetGradientBar();
        };
        this.doSetHandle();
    }
    get gradient() {
        return this._gradient;
    }
    set gradient(value) {
        this._gradient = value;
        this.doSetGradient();
    }
    get buttonResource() {
        return this.buttonAddColor.resource;
    }
    set buttonResource(value) {
        this.buttonAddColor.resource = value;
        this.buttonDeleteColor.resource = value;
    }
    get selectGroupBoxResource() {
        return this.buttonLinear.resource;
    }
    set selectGroupBoxResource(value) {
        this.buttonLinear.resource = value;
        this.buttonRadial.resource = value;
    }
    get scrollbarResource() {
        return this.scrollStartRadius.resource;
    }
    set scrollbarResource(value) {
        this.scrollStartRadius.resource = value;
        this.scrollStopRadius.resource = value;
    }
    get gradientBarResource() {
        return this.gradientBar.resource;
    }
    set gradientBarResource(value) {
        this.gradientBar.resource = value;
    }
    get gradientAngleBoxResource() {
        return this.gradientAngleBox.resource;
    }
    set gradientAngleBoxResource(value) {
        this.gradientAngleBox.resource = value;
    }
    get gradientAngleHandleResource() {
        return this.gradientAngleBox.handleResource;
    }
    set gradientAngleHandleResource(value) {
        this.gradientAngleBox.handleResource = value;
    }
    get gradientBarHandleResource() {
        return this.gradientBar.handleResource;
    }
    set gradientBarHandleResource(value) {
        this.gradientBar.handleResource = value;
    }
    get handleLength() {
        return this._handleLength;
    }
    set handleLength(value) {
        if (this._handleLength != value) {
            this._handleLength = value;
            this.doSetHandle();
        }
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "clientLayout", this.clientLayout.toData(), {}, true);
        CDataClass.putData(data, "clientTopLayout", this.clientTopLayout.toData(), {}, true);
        CDataClass.putData(data, "buttonAddColor", this.buttonAddColor.toData(), {}, true);
        CDataClass.putData(data, "buttonDeleteColor", this.buttonDeleteColor.toData(), {}, true);
        CDataClass.putData(data, "buttonRadial", this.buttonRadial.toData(), {}, true);
        CDataClass.putData(data, "buttonLinear", this.buttonLinear.toData(), {}, true);
        CDataClass.putData(data, "gradientAngleBox", this.gradientAngleBox.toData(), {}, true);
        CDataClass.putData(data, "gradientBar", this.gradientBar.toData(), {}, true);
        CDataClass.putData(data, "rightLayout", this.rightLayout.toData(), {}, true);
        CDataClass.putData(data, "colorSelector", this.colorSelector.toData(), {}, true);
        CDataClass.putData(data, "scrollStartRadius", this.scrollStartRadius.toData(), {}, true);
        CDataClass.putData(data, "scrollStopRadius", this.scrollStopRadius.toData(), {}, true);
        CDataClass.putData(data, "grid", this.grid.toData(), {}, true);
        CDataClass.putData(data, "startPointControl", this.startPointControl.toData(), {}, true);
        CDataClass.putData(data, "stopPointControl", this.stopPointControl.toData(), {}, true);
        CDataClass.putData(data, "splitterR", this.splitterR.toData(), {}, true);
        CDataClass.putData(data, "gradient", this.gradient.toData(), {}, true);
        CDataClass.putData(data, "handleLength", this.handleLength, 30);
    }
    doFromData(data) {
        super.doFromData(data);
        this.clientLayout.fromData(CDataClass.getData(data, "clientLayout", {}, true));
        this.clientTopLayout.fromData(CDataClass.getData(data, "clientTopLayout", {}, true));
        this.buttonAddColor.fromData(CDataClass.getData(data, "buttonAddColor", {}, true));
        this.buttonDeleteColor.fromData(CDataClass.getData(data, "buttonDeleteColor", {}, true));
        this.buttonRadial.fromData(CDataClass.getData(data, "buttonRadial", {}, true));
        this.buttonLinear.fromData(CDataClass.getData(data, "buttonLinear", {}, true));
        this.gradientBar.fromData(CDataClass.getData(data, "gradientBar", {}, true));
        this.gradientAngleBox.fromData(CDataClass.getData(data, "gradientAngleBox", {}, true));
        this.rightLayout.fromData(CDataClass.getData(data, "rightLayout", {}, true));
        this.colorSelector.fromData(CDataClass.getData(data, "colorSelector", {}, true));
        this.scrollStartRadius.fromData(CDataClass.getData(data, "scrollStartRadius", {}, true));
        this.scrollStopRadius.fromData(CDataClass.getData(data, "scrollStopRadius", {}, true));
        this.grid.fromData(CDataClass.getData(data, "grid", {}, true));
        this.startPointControl.fromData(CDataClass.getData(data, "startPointControl", {}, true));
        this.stopPointControl.fromData(CDataClass.getData(data, "stopPointControl", {}, true));
        this.splitterR.fromData(CDataClass.getData(data, "splitterR", {}, true));
        this.handleLength = CDataClass.getData(data, "handleLength", 30);
        let g = new CGradient();
        g.fromData(CDataClass.getData(data, "gradient", {}, true));
        this.gradient = g;
    }
    doSetSelectHandle(handle) {
        this.__selectedHandle = handle;
        if (typeof handle.data == "string") {
            this.colorSelector.color = handle.data;
        }
        if (this.onSetSelectHandle != undefined) {
            this.onSetSelectHandle(this, handle);
        }
    }
    doChangeGradientKind(kind) {
        if (kind == EGradientKind.LINEAR) {
            this.gradientAngleBox.layers.get(0).items.get(0).fill.gradientKind = EGradientKind.LINEAR;
        }
        else {
            this.gradientAngleBox.layers.get(0).items.get(0).fill.gradientKind = EGradientKind.RADIAL;
        }
        this.doSetGradientAngle();
        if (this.onChangeGradientKind != undefined) {
            this.onChangeGradientKind(this);
        }
    }
    doSetHandle() {
        let hl = this.handleLength / 2;
        this.gradientBar.position.height = this.handleLength * 2;
        this.gradientBar.position.margins.left = hl;
        this.gradientBar.position.margins.right = hl;
        for (let n = 0; n < this.gradientBar.slideHandles.length; n++) {
            let h = this.gradientBar.slideHandles.get(n);
            h.lockMoveY = true;
            h.lockMinX = -hl;
            h.lockMaxX = this.gradientBar.position.width - hl;
            h.position.top = (this.gradientBar.position.height - h.position.height) / 2;
            h.position.width = this.handleLength;
            h.position.height = this.handleLength;
            if (h.position.left > h.lockMaxX)
                h.position.left = h.lockMaxX;
            if (h.position.left < h.lockMinX)
                h.position.left = h.lockMinX;
            h.moveAreaLength = h.position.height;
        }
        this.gradientAngleBox.position.margins.all = hl;
        for (let n = 0; n < this.gradientAngleBox.slideHandles.length; n++) {
            let h = this.gradientAngleBox.slideHandles.get(n);
            h.lockMinX = -hl;
            h.lockMinY = -hl;
            h.lockMaxX = this.gradientAngleBox.position.width - hl;
            h.lockMaxY = this.gradientAngleBox.position.height - hl;
            h.position.width = this.handleLength;
            h.position.height = this.handleLength;
            if (h.position.left > h.lockMaxX)
                h.position.left = h.lockMaxX;
            if (h.position.top > h.lockMaxY)
                h.position.top = h.lockMaxY;
            if (h.position.left < h.lockMinX)
                h.position.left = h.lockMinX;
            if (h.position.top < h.lockMinY)
                h.position.top = h.lockMinY;
            h.moveAreaLength = h.position.height;
        }
        if (this.onSetHandle != undefined) {
            this.onSetHandle(this);
        }
    }
    doSetGradientBar() {
        if (this.gradientBar.layers.getLayerFromName("background") == undefined) {
            let lay = this.gradientBar.layers.addLayer();
            let ib = lay.addItem();
            ib.fill.styleKind = EStyleKind.SOLID;
            let ib2 = lay.addItem();
            ib2.fill.styleKind = EStyleKind.SOLID;
            ib2.fill.solidColor = "#e0e0e0";
            ib2.paintKind = EPaintKind.PATTERN;
            ib2.paintWidth = 10;
            ib2.paintHeight = 10;
            ib2.patternKind = EPatternKind.CHECK_HEAD;
            lay.name = "background";
            this.gradientBar.layers.addLayer();
        }
        if (this.gradientBar.layers.length == 1)
            this.gradientBar.layers.addLayer();
        if (this.gradientBar.layers.get(1).items.length == 0)
            this.gradientBar.layers.get(1).items.addItem();
        let fill = this.gradientBar.layers.get(1).items.get(0).fill;
        fill.styleKind = EStyleKind.GRADIENT;
        fill.stopPoint.x = 1;
        fill.stopPoint.y = 0;
        fill.pointList.clear();
        for (let n = 0; n < this.gradientBar.slideHandles.length; n++) {
            let h = this.gradientBar.slideHandles.get(n);
            let cx = h.position.left + (h.position.width / 2);
            let color = "white";
            if (h.data != undefined && typeof h.data == "string") {
                color = h.data;
                h.layers.get(0).items.get(0).fill.solidColor = h.data;
            }
            let pt = new CGradientPoint(CCalc.crRange2Value(0, this.gradientBar.position.width, cx, 0, 1), color);
            fill.pointList.add(pt);
        }
        this.grid.clear();
        for (let n = 0; n < this.gradientBar.slideHandles.length; n++) {
            let offset = CCalc.crRange2Value(-(this.handleLength / 2), this.gradientBar.position.width - (this.handleLength / 2), this.gradientBar.slideHandles.get(n).position.left, 0, 1);
            this.grid.add([offset, this.gradientBar.slideHandles.get(n).data]);
        }
        this.doSetGradientAngle();
        if (this.onSetGradientBar != undefined) {
            this.onSetGradientBar(this);
        }
    }
    doSetGradientAngle() {
        if (this.gradientBar.layers.length > 0 && this.gradientBar.layers.length >= 2 && this.gradientBar.layers.get(1).items.length > 0) {
            let barFill = this.gradientBar.layers.get(1).items.get(0).fill;
            if (this.gradientAngleBox.layers.getLayerFromName("background") == undefined) {
                let lay = this.gradientAngleBox.layers.addLayer();
                let ib = lay.addItem();
                ib.fill.styleKind = EStyleKind.SOLID;
                let ib2 = lay.addItem();
                ib2.fill.styleKind = EStyleKind.SOLID;
                ib2.fill.solidColor = "#e0e0e0";
                ib2.paintKind = EPaintKind.PATTERN;
                ib2.paintHeight = 10;
                ib2.paintWidth = 10;
                ib2.patternKind = EPatternKind.CHECK_HEAD;
                lay.name = "background";
                this.gradientAngleBox.layers.addLayer();
            }
            if (this.gradientAngleBox.layers.length == 1)
                this.gradientBar.layers.addLayer();
            if (this.gradientAngleBox.layers.get(1).items.length == 0)
                this.gradientAngleBox.layers.get(1).items.addItem();
            let fill = this.gradientAngleBox.layers.get(1).items.get(0).fill;
            fill.fromData(barFill.toData());
            if (this.buttonLinear.selected) {
                fill.gradientKind = EGradientKind.LINEAR;
            }
            else {
                fill.gradientKind = EGradientKind.RADIAL;
            }
            fill.startRadius = this.scrollStartRadius.value;
            fill.stopRadius = this.scrollStopRadius.value;
            fill.startPoint.x = CCalc.crRange2Value(0, this.gradientAngleBox.position.width, this.startPointControl.position.left + (this.startPointControl.position.width / 2), 0, 1);
            fill.startPoint.y = CCalc.crRange2Value(0, this.gradientAngleBox.position.height, this.startPointControl.position.top + (this.startPointControl.position.height / 2), 0, 1);
            fill.stopPoint.x = CCalc.crRange2Value(0, this.gradientAngleBox.position.width, this.stopPointControl.position.left + (this.stopPointControl.position.width / 2), 0, 1);
            fill.stopPoint.y = CCalc.crRange2Value(0, this.gradientAngleBox.position.height, this.stopPointControl.position.top + (this.stopPointControl.position.height / 2), 0, 1);
            let data = fill.toData();
            this.doFillData(data);
            this.gradient.fromData(data);
            if (this.onSetGradientAngle != undefined) {
                this.onSetGradientAngle(this);
            }
        }
    }
    doFillData(data) {
        if (this.onFillData != undefined) {
            this.onFillData(this, data);
        }
    }
    doSetGradient() {
        if (this.gradientAngleBox.layers.length > 1) {
            let gra = new CGradient();
            gra.fromData(this.gradient.toData());
            this.gradientBar.clearHandle();
            for (let n = 0; n < gra.pointList.length; n++) {
                this.addGradientPoint(gra.pointList.get(n).offset, gra.pointList.get(n).color);
            }
            this.gradientAngleBox.layers.get(1).items.get(0).fill.fromData(gra.toData());
            this.buttonLinear.selected = false;
            this.buttonRadial.selected = false;
            if (gra.gradientKind == EGradientKind.LINEAR) {
                this.buttonLinear.selected = true;
            }
            else {
                this.buttonRadial.selected = true;
            }
            this.startPointControl.position.left = CCalc.crRange2Value(0, 1, gra.startPoint.x, -(this.handleLength / 2), this.gradientAngleBox.position.width - (this.handleLength / 2));
            this.startPointControl.position.top = CCalc.crRange2Value(0, 1, gra.startPoint.y, -(this.handleLength / 2), this.gradientAngleBox.position.height - (this.handleLength / 2));
            this.stopPointControl.position.left = CCalc.crRange2Value(0, 1, gra.stopPoint.x, -(this.handleLength / 2), this.gradientAngleBox.position.width - (this.handleLength / 2));
            this.stopPointControl.position.top = CCalc.crRange2Value(0, 1, gra.stopPoint.y, -(this.handleLength / 2), this.gradientAngleBox.position.height - (this.handleLength / 2));
            this.scrollStartRadius.value = gra.startRadius;
            this.scrollStopRadius.value = gra.stopRadius;
            this.doSetGradientBar();
            if (this.gradientBar.slideHandles.length > 0) {
                this.doSetSelectHandle(this.gradientBar.slideHandles.get(0));
            }
            if (this.onSetGradient != undefined) {
                this.onSetGradient(this);
            }
        }
    }
    addGradientPoint(offset, color) {
        let h = this.gradientBar.addHandle(this.gradientBarHandleResource, CCalc.crRange2Value(0, 1, offset, 0, this.gradientBar.position.width) - (this._handleLength / 2), (this.gradientBar.position.height - this._handleLength) / 2, this.handleLength, this.handleLength);
        h.data = color;
        h.layers.get(0).items.get(0).fill.solidColor = color;
        this.doSetHandle();
        this.doSetGradientBar();
        return h;
    }
    addProperties() {
        let rt = super.addProperties();
        rt.push({ instance: this.buttonResource, propertyName: "buttonResource", readOnly: false, enum: [] });
        rt.push({ instance: this.selectGroupBoxResource, propertyName: "selectGroupBoxResource", readOnly: false, enum: [] });
        rt.push({ instance: this.scrollbarResource, propertyName: "scrollbarResource", readOnly: false, enum: [] });
        rt.push({ instance: this.gradientBarResource, propertyName: "gradientBarResource", readOnly: false, enum: [] });
        rt.push({ instance: this.gradientAngleBoxResource, propertyName: "gradientAngleBoxResource", readOnly: false, enum: [] });
        rt.push({ instance: this.gradientAngleHandleResource, propertyName: "gradientAngleHandleResource", readOnly: false, enum: [] });
        rt.push({ instance: this.gradientBarHandleResource, propertyName: "gradientBarHandleResource", readOnly: false, enum: [] });
        return rt;
    }
}
/*class CGradientEditor extends CPanel {
    protected __selectedHandle: CPanel | undefined
    protected _gradient = new CGradient()
    protected _clientLayout = new CPanel(this)
    protected _clientTopLayout = new CPanel(this._clientLayout)
    protected _buttonAddColor = new CButton(this._clientTopLayout)
    protected _buttonDeleteColor = new CButton(this._clientTopLayout)
    protected _buttonRadial = new CSelectGroupBox(this._clientTopLayout)
    protected _buttonLinear = new CSelectGroupBox(this._clientTopLayout)
    protected _gradientAngleBox = new CMultiSlideBox(this._clientLayout)
    protected _gradientBar = new CMultiSlideBox(this._clientLayout)

    protected _rightLayout = new CPanel(this)
    protected _colorSelector = new CColorSelector(this._rightLayout)
    protected _scrollStartRadius = new CScrollbar(this._rightLayout)
    protected _scrollStopRadius = new CScrollbar(this._rightLayout)
    protected _grid = new CDataGrid(this._rightLayout)

    protected _startPointControl: CPanel
    protected _stopPointControl: CPanel
    protected _handleLength = 30

    public onSetSelectHandle: FEvent<(sender: any, handle: CPanel) => void>
    public onFillData: FEvent<(sender: any, data: any) => void>
    public onChangeGradientKind: FNotifyEvent
    public onSetHandle: FNotifyEvent
    public onSetGradientBar: FNotifyEvent
    public onSetGradientAngle: FNotifyEvent
    public onSetGradient: FNotifyEvent
    get gradient(): CGradient {
        return this._gradient
    }
    set gradient(value: CGradient) {
        this._gradient = value
        this.doSetGradient()
    }
    get clientLayout(): CPanel {
        return this._clientLayout
    }
    get clientTopLayout(): CPanel {
        return this._clientTopLayout
    }
    get rightLayout(): CPanel {
        return this._rightLayout
    }
    get colorSelector(): CColorSelector {
        return this._colorSelector
    }
    get buttonAddColor(): CButton {
        return this._buttonAddColor
    }
    get buttonDeleteColor(): CButton {
        return this._buttonDeleteColor
    }
    get buttonRadial(): CSelectGroupBox {
        return this._buttonRadial
    }
    get buttonLinear(): CSelectGroupBox {
        return this._buttonLinear
    }
    get scrollStartRadius(): CScrollbar {
        return this._scrollStartRadius
    }
    get scrollStopRadius(): CScrollbar {
        return this._scrollStopRadius
    }
    get grid(): CDataGrid {
        return this._grid
    }
    get buttonResource(): string {
        return this._buttonAddColor.resource
    }
    set buttonResource(value: string) {
        this._buttonAddColor.resource = value
        this._buttonDeleteColor.resource = value
    }
    get selectGroupBoxResource(): string {
        return this.buttonLinear.resource
    }
    set selectGroupBoxResource(value: string) {
        this.buttonLinear.resource = value
        this.buttonRadial.resource = value
    }
    get scrollbarResource(): string {
        return this.scrollStartRadius.resource
    }
    set scrollbarResource(value: string) {
        this.scrollStartRadius.resource = value
        this.scrollStopRadius.resource = value
    }
    get gradientBar(): CMultiSlideBox {
        return this._gradientBar
    }
    get gradientAngleBox(): CMultiSlideBox {
        return this._gradientAngleBox
    }
    get gradientBarResource(): string {
        return this._gradientBar.resource
    }
    set gradientBarResource(value: string) {
        this._gradientBar.resource = value
    }
    get gradientAngleBoxResource(): string {
        return this._gradientAngleBox.resource
    }
    set gradientAngleBoxResource(value: string) {
        this._gradientAngleBox.resource = value
    }
    get gradientAngleHandleResource(): string {
        return this._gradientAngleBox.handleResource
    }
    set gradientAngleHandleResource(value: string) {
        this._gradientAngleBox.handleResource = value
    }
    get gradientBarHandleResource(): string {
        return this._gradientBar.handleResource
    }
    set gradientBarHandleResource(value: string) {
        this._gradientBar.handleResource = value
    }
    get startPointControl(): CPanel {
        return this._startPointControl
    }
    get stopPointControl(): CPanel {
        return this._stopPointControl
    }
    get handleLength(): number {
        return this._handleLength
    }
    set handleLength(value: number) {
        if(this._handleLength != value) {
            this._handleLength = value
            this.doSetHandle()
        }
    }
    constructor(parent?: CControl | HTMLElement, name?: string) {
        super(parent, name)
        let self = this
        
        let spl = new CSplitter(this)
        spl.position.width = 5
        spl.position.align = EPositionAlign.RIGHT
                
        this._gradientBar.onHandleTrack = function(s, handle, x, y, cx, cy) {
            self.doSetGradientBar()
        }
        this._gradientBar.onCreateHandle = function(s, h) {
            h.onThisPointerDown = function() {
                self.doSetSelectHandle(h)
            }
        }
        this._gradientBar.onChangeSize = function() {
            self.doSetHandle()
            self.doSetGradientBar()
        }

        this._startPointControl = this._gradientAngleBox.addHandle(this.gradientAngleHandleResource, -15, -15)
        this._startPointControl.text = "S"
        this._startPointControl.data = 0
        
        this._stopPointControl = this._gradientAngleBox.addHandle(this.gradientAngleHandleResource, -15, -15)
        this._stopPointControl.text = "E"
        this._stopPointControl.data = 1
        
        this._gradientAngleBox.onHandleTrack = function(s, h, x, y, cx, cy) {
            self.doSetGradientAngle()
        }
        this._gradientAngleBox.onChangeSize = function() {
            self.doSetHandle()
        }
        
        this._colorSelector.onChangeColor = function() {
            if(self.__selectedHandle != undefined) {
                self.__selectedHandle.data = self.colorSelector.color
                self.__selectedHandle.layers.get(0).items.get(0).fill.solidColor = self.colorSelector.color
                self.doSetGradientBar()
            }
        }

        this.buttonAddColor.onClick = function() {
            let h = self.addGradientPoint(0, "white")
            self.doSetSelectHandle(h)
        }
        this.buttonDeleteColor.onClick = function() {
            if(self.__selectedHandle != undefined) {
                for(let n = 0; n < self.gradientBar.slideHandles.length; n++) {
                    if(self.__selectedHandle == self.gradientBar.slideHandles.get(n)) {
                        self.gradientBar.deleteHandle(n)
                        break
                    }
                }
                self.doSetGradientBar()
            }
        }
        this.buttonLinear.onClick = function() {
            self.doChangeGradientKind(EGradientKind.LINEAR)
        }
        this.buttonRadial.onClick = function() {
            self.doChangeGradientKind(EGradientKind.RADIAL)
        }

        this.buttonLinear.groupName = this.name + "gra"
        this.buttonRadial.groupName = this.name + "gra"

        this.scrollStartRadius.onChangeValue = function() {
            self.doSetGradientAngle()
        }
        this.scrollStopRadius.onChangeValue = function() {
            self.doSetGradientAngle()
        }

        this._grid.editable = true
        this._grid.editorShowSet.add(EEditorShowKind.DOUBLE_CLICK)
        this._grid.editorShowSet.add(EEditorShowKind.F2_KEY)
        this._grid.onEditorApply = function(s, col, row, text) {
            let h = self._gradientBar.slideHandles.get(row)
            if(col == 0) {
                h.position.left = CCalc.crRange2Value(0, 1, parseFloat(text),
                    -(self.handleLength/2),
                    self.gradientBar.position.width -(self.handleLength/2)
                )
            } else {
                h.data = text
            }
            self.doSetGradientBar()
        }
        
        this.doSetHandle()
    }
    doSetSelectHandle(handle: CPanel) {
        this.__selectedHandle = handle
        if(typeof handle.data == "string") {
            this.colorSelector.color = handle.data
        }
        if(this.onSetSelectHandle != undefined) {
            this.onSetSelectHandle(this, handle)
        }
    }
    doChangeGradientKind(kind: EGradientKind) {
        if(kind == EGradientKind.LINEAR) {
            this.gradientAngleBox.layers.get(0).items.get(0).fill.gradientKind = EGradientKind.LINEAR
        } else {
            this.gradientAngleBox.layers.get(0).items.get(0).fill.gradientKind = EGradientKind.RADIAL
        }
        this.doSetGradientAngle()
        if(this.onChangeGradientKind != undefined) {
            this.onChangeGradientKind(this)
        }
    }
    doSetHandle() {
        let hl = this.handleLength / 2
        this.gradientBar.position.height = this.handleLength * 2
        this.gradientBar.position.margins.left = hl
        this.gradientBar.position.margins.right = hl
        for(let n = 0; n < this._gradientBar.slideHandles.length; n++) {
            let h = this._gradientBar.slideHandles.get(n)
            h.lockMoveY = true
            h.lockMinX = -hl
            h.lockMaxX = this._gradientBar.position.width - hl
            h.position.top = (this._gradientBar.position.height - h.position.height) / 2
            h.position.width = this.handleLength
            h.position.height = this.handleLength
            if(h.position.left > h.lockMaxX) h.position.left = h.lockMaxX
            if(h.position.left < h.lockMinX) h.position.left = h.lockMinX
            h.moveAreaLength = h.position.height
        }

        this.gradientAngleBox.position.margins.all = hl
        for(let n = 0; n < this._gradientAngleBox.slideHandles.length; n++) {
            let h = this._gradientAngleBox.slideHandles.get(n)
            h.lockMinX = -hl
            h.lockMinY = -hl
            h.lockMaxX = this._gradientAngleBox.position.width - hl
            h.lockMaxY = this._gradientAngleBox.position.height - hl
            h.position.width = this.handleLength
            h.position.height = this.handleLength
            if(h.position.left > h.lockMaxX) h.position.left = h.lockMaxX
            if(h.position.top > h.lockMaxY) h.position.top = h.lockMaxY
            if(h.position.left < h.lockMinX) h.position.left = h.lockMinX
            if(h.position.top < h.lockMinY) h.position.top = h.lockMinY
            h.moveAreaLength = h.position.height
        }
        if(this.onSetHandle != undefined) {
            this.onSetHandle(this)
        }
    }
    doSetGradientBar() {
        if(this.gradientBar.layers.getLayerFromName("background") == undefined) {
            let lay = this.gradientBar.layers.addLayer()
            let ib = lay.addItem()
            ib.fill.styleKind = EStyleKind.SOLID
            let ib2 = lay.addItem()
            ib2.fill.styleKind = EStyleKind.SOLID
            ib2.fill.solidColor = "#e0e0e0"
            ib2.paintKind = EPaintKind.PATTERN
            ib2.paintWidth = 10
            ib2.paintHeight = 10
            ib2.patternKind = EPatternKind.CHECK_HEAD
            lay.name = "background"
            this.gradientBar.layers.addLayer()
        }
        if(this.gradientBar.layers.length == 1) this.gradientBar.layers.addLayer()
        if(this.gradientBar.layers.get(1).items.length == 0) this.gradientBar.layers.get(1).items.addItem()
        let fill = this.gradientBar.layers.get(1).items.get(0).fill
        fill.styleKind = EStyleKind.GRADIENT
        fill.stopPoint.x = 1
        fill.stopPoint.y = 0
        fill.pointList.clear()
        for(let n = 0; n < this._gradientBar.slideHandles.length; n++) {
            let h = this._gradientBar.slideHandles.get(n)
            let cx = h.position.left + (h.position.width / 2)
            let color = "white"
            if(h.data != undefined && typeof h.data == "string"){
                color = h.data
                h.layers.get(0).items.get(0).fill.solidColor = h.data
            }
            let pt = new CGradientPoint(CCalc.crRange2Value(0, this._gradientBar.position.width, cx, 0, 1), color)
            fill.pointList.add(pt)
        }
        this._grid.clear()
        for(let n = 0; n < this._gradientBar.slideHandles.length; n++) {
            let offset = CCalc.crRange2Value(
                -(this.handleLength / 2),
                this._gradientBar.position.width - (this.handleLength / 2),
                this._gradientBar.slideHandles.get(n).position.left,
                0,
                1
            )
            this._grid.add([offset, this._gradientBar.slideHandles.get(n).data])
        }
        this.doSetGradientAngle()
        if(this.onSetGradientBar != undefined) {
            this.onSetGradientBar(this)
        }
    }
    doSetGradientAngle() {
        if(this.gradientBar.layers.length > 0 && this.gradientBar.layers.length >= 2 && this.gradientBar.layers.get(1).items.length > 0) {
            let barFill = this.gradientBar.layers.get(1).items.get(0).fill
            if(this.gradientAngleBox.layers.getLayerFromName("background") == undefined) {
                let lay = this.gradientAngleBox.layers.addLayer()
                let ib = lay.addItem()
                ib.fill.styleKind = EStyleKind.SOLID
                let ib2 = lay.addItem()
                ib2.fill.styleKind = EStyleKind.SOLID
                ib2.fill.solidColor = "#e0e0e0"
                ib2.paintKind = EPaintKind.PATTERN
                ib2.paintHeight = 10
                ib2.paintWidth = 10
                ib2.patternKind = EPatternKind.CHECK_HEAD
                lay.name = "background"
                this.gradientAngleBox.layers.addLayer()
            }
            if(this.gradientAngleBox.layers.length == 1) this.gradientBar.layers.addLayer()
            if(this.gradientAngleBox.layers.get(1).items.length == 0) this.gradientAngleBox.layers.get(1).items.addItem()
            let fill = this.gradientAngleBox.layers.get(1).items.get(0).fill
            fill.fromData(barFill.toData())
            if(this._buttonLinear.selected) {
                fill.gradientKind = EGradientKind.LINEAR
            } else {
                fill.gradientKind = EGradientKind.RADIAL
            }
            fill.startRadius = this.scrollStartRadius.value
            fill.stopRadius = this.scrollStopRadius.value
            fill.startPoint.x = CCalc.crRange2Value(
                0,
                this.gradientAngleBox.position.width,
                this.startPointControl.position.left + (this.startPointControl.position.width / 2),
                0,
                1
            )
            fill.startPoint.y = CCalc.crRange2Value(
                0,
                this.gradientAngleBox.position.height,
                this.startPointControl.position.top + (this.startPointControl.position.height / 2),
                0,
                1
            )
            fill.stopPoint.x = CCalc.crRange2Value(
                0,
                this.gradientAngleBox.position.width,
                this.stopPointControl.position.left + (this.stopPointControl.position.width / 2),
                0,
                1
            )
            fill.stopPoint.y = CCalc.crRange2Value(
                0,
                this.gradientAngleBox.position.height,
                this.stopPointControl.position.top + (this.stopPointControl.position.height / 2),
                0,
                1
            )
            let data = fill.toData()
            this.doFillData(data)
            this.gradient.fromData(data)
            if(this.onSetGradientAngle != undefined) {
                this.onSetGradientAngle(this)
            }
        }
    }
    doFillData(data: any) {
        if(this.onFillData != undefined) {
            this.onFillData(this, data)
        }
    }
    doSetGradient() {
        if(this.gradientAngleBox.layers.length > 1) {
            let gra = new CGradient()
            gra.fromData(this.gradient.toData())
            this.gradientBar.clearHandle()
            for(let n = 0; n < gra.pointList.length; n++) {
                this.addGradientPoint(gra.pointList.get(n).offset, gra.pointList.get(n).color)
            }
            this.gradientAngleBox.layers.get(1).items.get(0).fill.fromData(gra.toData())
            this.buttonLinear.selected = false
            this.buttonRadial.selected = false
            if(gra.gradientKind == EGradientKind.LINEAR) {
                this.buttonLinear.selected = true
            } else {
                this.buttonRadial.selected = true
            }
            this.startPointControl.position.left = CCalc.crRange2Value(0, 1, gra.startPoint.x, -(this.handleLength / 2), this.gradientAngleBox.position.width - (this.handleLength / 2))
            this.startPointControl.position.top = CCalc.crRange2Value(0, 1, gra.startPoint.y, -(this.handleLength / 2), this.gradientAngleBox.position.height - (this.handleLength / 2))
            this.stopPointControl.position.left = CCalc.crRange2Value(0, 1, gra.stopPoint.x, -(this.handleLength / 2), this.gradientAngleBox.position.width - (this.handleLength / 2))
            this.stopPointControl.position.top = CCalc.crRange2Value(0, 1, gra.stopPoint.y, -(this.handleLength / 2), this.gradientAngleBox.position.height - (this.handleLength / 2))
            this.scrollStartRadius.value = gra.startRadius
            this.scrollStopRadius.value = gra.stopRadius
            this.doSetGradientBar()
            if(this.gradientBar.slideHandles.length > 0) {
                this.doSetSelectHandle(this.gradientBar.slideHandles.get(0))
            }
            if(this.onSetGradient != undefined) {
                this.onSetGradient(this)
            }
        }
    }
    addGradientPoint(offset: number, color: string) {
        let h = this._gradientBar.addHandle(
            this.gradientBarHandleResource,
            CCalc.crRange2Value(0, 1, offset, 0, this._gradientBar.position.width) - (this._handleLength / 2),
            (this._gradientBar.position.height - this._handleLength) / 2,
            this.handleLength,
            this.handleLength
        )
        h.data = color
        h.layers.get(0).items.get(0).fill.solidColor = color
        this.doSetHandle()
        this.doSetGradientBar()
        return h
    }
}*/
class CGradientEditor extends CGradientEditorModel {
    constructor(parent, name) {
        super(parent, name);
        this.resource = "gradientEditor.frame";
    }
}
class CFillEditorModel extends CTab {
    constructor(parent, name) {
        super(parent, name);
        this._fill = new CFillSet();
        this._gradientEditorResource = "";
        this.addTab("None");
        this.addTab("Solid Color");
        this.addTab("Gradient");
        this.tabButtons.doSetButtions();
    }
    get gradientEditor() {
        return this._gradientEditor;
    }
    get colorSelector() {
        return this._colorSelector;
    }
    get gradientEditorResource() {
        return this._gradientEditorResource;
    }
    set gradientEditorResource(value) {
        if (this._gradientEditorResource != value) {
            this._gradientEditorResource = value;
            if (this._gradientEditor != undefined) {
                this._gradientEditor.resource = value;
            }
        }
    }
    get fill() {
        return this._fill;
    }
    set fill(value) {
        if (this._fill != value) {
            this._fill = value;
            this.doChangeFill();
        }
    }
    doCreateSheet(index, tabSheet) {
        let self = this;
        if (index == 1) {
            this._colorSelector = new CColorSelector(tabSheet);
            tabSheet.position.padding.all = 5;
            this._colorSelector.position.align = EPositionAlign.CLIENT;
            this._colorSelector.onChangeColor = function () {
                if (self._colorSelector != undefined) {
                    self.fill.solidColor = self._colorSelector.color;
                }
            };
        }
        if (index == 2) {
            this._gradientEditor = new CGradientEditor(tabSheet);
            tabSheet.position.padding.all = 5;
            this._gradientEditor.position.align = EPositionAlign.CLIENT;
            this._gradientEditor.resource = this._gradientEditorResource;
            this._gradientEditor.gradient = this._fill;
            this._gradientEditor.onFillData = function (sender, data) {
                if (self.colorSelector != undefined) {
                    data.solidColor = self.colorSelector.color;
                }
            };
        }
        super.doCreateSheet(index, tabSheet);
    }
    doChangeIndex() {
        super.doChangeIndex();
        switch (this.index) {
            case 0:
                this.fill.styleKind = EStyleKind.EMPTY;
                break;
            case 1:
                this.fill.styleKind = EStyleKind.SOLID;
                break;
            case 2:
                this.fill.styleKind = EStyleKind.GRADIENT;
                break;
        }
    }
    doChangeFill() {
        let kind = this._fill.styleKind;
        if (this.colorSelector != undefined) {
            this.colorSelector.color = this._fill.solidColor;
        }
        if (this._gradientEditor != undefined) {
            this._gradientEditor.gradient = this._fill;
        }
        if (kind == EStyleKind.EMPTY) {
            this.index = 0;
        }
        if (kind == EStyleKind.SOLID) {
            this.index = 1;
        }
        if (kind == EStyleKind.GRADIENT) {
            this.index = 2;
        }
        if (this.onChangeFill != undefined) {
            this.onChangeFill(this);
        }
    }
}
/*class CFillEditor extends CTab {
    protected _fill = new CFillSet()
    protected _gradientEditor: CGradientEditor | undefined
    protected _colorSelector: CColorSelector | undefined
    protected _gradientEditorResource = ""
    public onChangeFill: FNotifyEvent
    get gradientEditor(): CGradientEditor | undefined {
        return this._gradientEditor
    }
    get colorSelector(): CColorSelector | undefined {
        return this._colorSelector
    }
    get gradientEditorResource(): string {
        return this._gradientEditorResource
    }
    set gradientEditorResource(value: string) {
        if(this._gradientEditorResource != value) {
            this._gradientEditorResource = value
            if(this._gradientEditor != undefined) {
                this._gradientEditor.resource = value
            }
        }
    }
    get fill(): CFillSet {
        return this._fill
    }
    set fill(value: CFillSet) {
        if(this._fill != value) {
            this._fill = value
            this.doChangeFill()
        }
    }
    constructor(parent?: CControl | HTMLElement, name?: string) {
        super(parent, name)
        this.addTab("None")
        this.addTab("Solid Color")
        this.addTab("Gradient")
        this.tabButtons.doSetButtions()
    }
    doCreateSheet(index: number, tabSheet: CPanel): void {
        let self = this
        if(index == 1) {
            this._colorSelector = new CColorSelector(tabSheet)
            tabSheet.position.padding.all = 5
            this._colorSelector.position.align = EPositionAlign.CLIENT
            this._colorSelector.onChangeColor = function() {
                if(self._colorSelector != undefined) {
                    self.fill.solidColor = self._colorSelector.color
                }
            }
        }
        if(index == 2) {
            this._gradientEditor = new CGradientEditor(tabSheet)
            tabSheet.position.padding.all = 5
            this._gradientEditor.position.align = EPositionAlign.CLIENT
            this._gradientEditor.resource = this._gradientEditorResource
            this._gradientEditor.gradient = this._fill
            this._gradientEditor.onFillData = function(sender, data) {
                if(self.colorSelector != undefined) {
                    data.solidColor = self.colorSelector.color
                }
            }
        }
        super.doCreateSheet(index, tabSheet)
    }
    doChangeIndex(): void {
        super.doChangeIndex()
        switch(this.index) {
            case 0:
                this.fill.styleKind = EStyleKind.EMPTY
                break
            case 1:
                this.fill.styleKind = EStyleKind.SOLID
                break
            case 2:
                this.fill.styleKind = EStyleKind.GRADIENT
                break
        }
    }
    doChangeFill() {
        let kind = this._fill.styleKind
        if(this.colorSelector != undefined) {
            this.colorSelector.color = this._fill.solidColor
        }
        if(this._gradientEditor != undefined) {
            this._gradientEditor.gradient = this._fill
        }
        if(kind == EStyleKind.EMPTY) {
            this.index = 0
        }
        if(kind == EStyleKind.SOLID) {
            this.index = 1
        }
        if(kind == EStyleKind.GRADIENT) {
            this.index = 2
        }
        if(this.onChangeFill != undefined) {
            this.onChangeFill(this)
        }
    }
}*/
class CFillEditorFrame extends CFillEditorModel {
    constructor(parent, name) {
        super(parent, name);
        this.resource = "fillEditor.frame";
    }
}
class CStrokeEditorModel extends CTab {
    constructor(parent, name) {
        super(parent, name);
        this._stroke = new CStrokeSet();
        this._gradientEditorResource = "";
        this._bottomLayout = new CPanel(this);
        this._labelWidth = new CLabelTextBox(this._bottomLayout);
        this._labelDash = new CLabelTextBox(this._bottomLayout);
        this._buttonApplyWidth = new CButton(this._labelWidth.textBox);
        this._buttonApplyDash = new CButton(this._labelDash.textBox);
        this._comboLineCap = new CComboBox(this._bottomLayout);
        this._comboLineJoin = new CComboBox(this._bottomLayout);
        this.addTab("None");
        this.addTab("Solid Color");
        this.addTab("Gradient");
        this.tabButtons.doSetButtions();
        let self = this;
        this.labelWidth.textBox.onKeyDown = function (s, e) {
            if (e.key == "Enter") {
                self.stroke.lineWidth = parseFloat(self.labelWidth.value);
            }
        };
        this.buttonApplyWidth.onClick = function () {
            self.stroke.lineWidth = parseFloat(self.labelWidth.value);
        };
        this.labelDash.textBox.onKeyDown = function (s, e) {
            if (e.key == "Enter") {
                self.stroke.lineDash = self.labelDash.value;
            }
        };
        this.buttonApplyDash.onClick = function () {
            self.stroke.lineDash = self.labelDash.value;
        };
        this._comboLineCap.items.add("LineCap : BUTT");
        this._comboLineCap.items.add("LineCap : ROUND");
        this._comboLineCap.items.add("LineCap : SQUARE");
        this._comboLineJoin.items.add("LineJoin : BUTT");
        this._comboLineJoin.items.add("LineJoin : ROUND");
        this._comboLineJoin.items.add("LineJoin : SQUARE");
        this._comboLineCap.onChangeItem = function () {
            self.stroke.lineCap = self.comboLineCap.itemIndex;
        };
        this._comboLineJoin.onChangeItem = function () {
            self.stroke.lineJoin = self.comboLineJoin.itemIndex;
        };
    }
    get bottomLayout() {
        return this._bottomLayout;
    }
    get labelWidth() {
        return this._labelWidth;
    }
    get labelDash() {
        return this._labelDash;
    }
    get buttonApplyWidth() {
        return this._buttonApplyWidth;
    }
    get buttonApplyDash() {
        return this._buttonApplyDash;
    }
    get comboLineCap() {
        return this._comboLineCap;
    }
    get comboLineJoin() {
        return this._comboLineJoin;
    }
    get gradientEditor() {
        return this._gradientEditor;
    }
    get colorSelector() {
        return this._colorSelector;
    }
    get gradientEditorResource() {
        return this._gradientEditorResource;
    }
    set gradientEditorResource(value) {
        if (this._gradientEditorResource != value) {
            this._gradientEditorResource = value;
            if (this._gradientEditor != undefined) {
                this._gradientEditor.resource = value;
            }
        }
    }
    get stroke() {
        return this._stroke;
    }
    set stroke(value) {
        if (this._stroke != value) {
            this._stroke = value;
            this.doChangeStroke();
        }
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "bottomLayout", this.bottomLayout.toData(), {}, true);
        CDataClass.putData(data, "labelWidth", this.labelWidth.toData(), {}, true);
        CDataClass.putData(data, "labelDash", this.labelDash.toData(), {}, true);
        CDataClass.putData(data, "buttonApplyWidth", this.buttonApplyWidth.toData(), {}, true);
        CDataClass.putData(data, "buttonApplyDash", this.buttonApplyDash.toData(), {}, true);
        CDataClass.putData(data, "comboLineCap", this.comboLineCap.toData(), {}, true);
        CDataClass.putData(data, "comboLineJoin", this.comboLineJoin.toData(), {}, true);
    }
    doFromData(data) {
        super.doFromData(data);
        this.bottomLayout.fromData(CDataClass.getData(data, "bottomLayout", {}, true));
        this.labelWidth.fromData(CDataClass.getData(data, "labelWidth", {}, true));
        this.labelDash.fromData(CDataClass.getData(data, "labelDash", {}, true));
        this.buttonApplyWidth.fromData(CDataClass.getData(data, "buttonApplyWidth", {}, true));
        this.buttonApplyDash.fromData(CDataClass.getData(data, "buttonApplyDash", {}, true));
        this.comboLineCap.fromData(CDataClass.getData(data, "comboLineCap", {}, true));
        this.comboLineJoin.fromData(CDataClass.getData(data, "comboLineJoin", {}, true));
    }
    doCreateSheet(index, tabSheet) {
        let self = this;
        if (index == 1) {
            this._colorSelector = new CColorSelector(tabSheet);
            tabSheet.position.padding.all = 5;
            this._colorSelector.position.align = EPositionAlign.CLIENT;
            this._colorSelector.onChangeColor = function () {
                if (self._colorSelector != undefined) {
                    self.stroke.solidColor = self._colorSelector.color;
                }
            };
        }
        if (index == 2) {
            this._gradientEditor = new CGradientEditor(tabSheet);
            tabSheet.position.padding.all = 5;
            this._gradientEditor.position.align = EPositionAlign.CLIENT;
            this._gradientEditor.resource = this._gradientEditorResource;
            this._gradientEditor.gradient = this._stroke;
            this._gradientEditor.onFillData = function (sender, data) {
                if (self.colorSelector != undefined) {
                    data.solidColor = self.colorSelector.color;
                    data.lineWidth = parseFloat(self.labelWidth.value);
                    if (self.comboLineCap.itemIndex != -1) {
                        data.lineCap = self.comboLineCap.itemIndex;
                    }
                    if (self.comboLineJoin.itemIndex != -1) {
                        data.lineJoin = self.comboLineJoin.itemIndex;
                    }
                }
            };
        }
        super.doCreateSheet(index, tabSheet);
    }
    doChangeIndex() {
        super.doChangeIndex();
        switch (this.index) {
            case 0:
                this.stroke.styleKind = EStyleKind.EMPTY;
                break;
            case 1:
                this.stroke.styleKind = EStyleKind.SOLID;
                break;
            case 2:
                this.stroke.styleKind = EStyleKind.GRADIENT;
                break;
        }
    }
    doChangeStroke() {
        let kind = this.stroke.styleKind;
        this.labelWidth.value = this.stroke.lineWidth + "";
        this.labelDash.value = this.stroke.lineDash;
        this.comboLineCap.itemIndex = this.stroke.lineCap;
        this.comboLineJoin.itemIndex = this.stroke.lineJoin;
        if (this.colorSelector != undefined) {
            this.colorSelector.color = this.stroke.solidColor;
        }
        if (this._gradientEditor != undefined) {
            this._gradientEditor.gradient = this.stroke;
        }
        if (kind == EStyleKind.EMPTY) {
            this.index = 0;
        }
        if (kind == EStyleKind.SOLID) {
            this.index = 1;
        }
        if (kind == EStyleKind.GRADIENT) {
            this.index = 2;
        }
        if (this.onChangeStroke != undefined) {
            this.onChangeStroke(this);
        }
    }
}
class CStrokeEditorFrame extends CStrokeEditorModel {
    constructor(parent, name) {
        super(parent, name);
        this.resource = "strokeEditor.frame";
    }
}
