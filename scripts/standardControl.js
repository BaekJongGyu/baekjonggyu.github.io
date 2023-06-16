"use strict";
var EPickupAlignKind;
(function (EPickupAlignKind) {
    EPickupAlignKind[EPickupAlignKind["LEFT"] = 0] = "LEFT";
    EPickupAlignKind[EPickupAlignKind["RIGHT"] = 1] = "RIGHT";
})(EPickupAlignKind || (EPickupAlignKind = {}));
var EPickupShowKind;
(function (EPickupShowKind) {
    EPickupShowKind[EPickupShowKind["TOP"] = 0] = "TOP";
    EPickupShowKind[EPickupShowKind["BOTTOM"] = 1] = "BOTTOM";
})(EPickupShowKind || (EPickupShowKind = {}));
class CButton extends CPanel {
    constructor(parent, name) {
        super(parent, name);
        this.pickupResource = "";
        this.pickupHeight = 200;
        this.pickupAlignKind = EPickupAlignKind.LEFT;
        this.pickupShowKind = EPickupShowKind.BOTTOM;
        this.usePickupParentBody = false;
        this.hasFocus = true;
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "pickupResource", this.pickupResource, "");
        CDataClass.putData(data, "pickupWidth", this.pickupWidth, undefined);
        CDataClass.putData(data, "pickupHeight", this.pickupHeight, 200);
        CDataClass.putData(data, "pickupAlignKind", this.pickupAlignKind, EPickupAlignKind.LEFT);
        CDataClass.putData(data, "pickupShowKind", this.pickupShowKind, EPickupShowKind.BOTTOM);
        CDataClass.putData(data, "usePickupParentBody", this.usePickupParentBody, false);
    }
    doFromData(data) {
        super.doFromData(data);
        this.pickupResource = CDataClass.getData(data, "pickupResource", "");
        this.pickupWidth = CDataClass.getData(data, "pickupWidth", undefined);
        this.pickupHeight = CDataClass.getData(data, "pickupHeight", 200);
        this.pickupAlignKind = CDataClass.getData(data, "pickupAlignKind", EPickupAlignKind.LEFT);
        this.pickupShowKind = CDataClass.getData(data, "pickupShowKind", EPickupShowKind.BOTTOM);
        this.usePickupParentBody = CDataClass.getData(data, "usePickupParentBody", false);
    }
    doKeyDown(e) {
        super.doKeyDown(e);
        if (e.key == " " || e.key == "Enter") {
            this.click();
        }
    }
    getPickupWidth() {
        if (this.pickupWidth == undefined) {
            return this.position.width;
        }
        else {
            return this.pickupWidth;
        }
    }
    doClick(e) {
        super.doClick(e);
        let self = this;
        if (this.pickupResource != "") {
            if (!this.usePickupParentBody) {
                this.bringToFront();
                let l = 0;
                if (this.pickupAlignKind == EPickupAlignKind.RIGHT) {
                    l = this.position.width - this.getPickupWidth();
                }
                if (this._pickup == undefined) {
                    let t = 0;
                    if (this.pickupShowKind == EPickupShowKind.BOTTOM) {
                        t = this.position.height + 1;
                    }
                    else {
                        t = this.position.top - this.pickupHeight - 1;
                    }
                    CPickupControl.showPickup(this.pickupResource, this, l, t, this.getPickupWidth(), this.pickupHeight, function (pick) {
                        self.doBeforePickupShow(pick);
                    }, function (pick) {
                        self.doAfterPickupShow(pick);
                    }, function (pick) {
                        self.doBeforePickupRemove(pick);
                    });
                }
                else {
                    this._pickup.hide();
                    this._pickup = undefined;
                }
            }
            else {
                let rt = this.controlElement.getBoundingClientRect();
                let l = rt.left;
                if (this.pickupAlignKind == EPickupAlignKind.RIGHT) {
                    l = rt.left - rt.width - this.getPickupWidth();
                }
                if (this._pickup == undefined) {
                    let t = rt.top;
                    if (this.pickupShowKind == EPickupShowKind.BOTTOM) {
                        t = rt.top + rt.height + 1;
                    }
                    else {
                        t = rt.top - this.pickupHeight - 1;
                    }
                    CPickupControl.showPickup(this.pickupResource, document.body, l, t, this.getPickupWidth(), this.pickupHeight, function (pick) {
                        self.doBeforePickupShow(pick);
                    }, function (pick) {
                        self.doAfterPickupShow(pick);
                    }, function (pick) {
                        self.doBeforePickupRemove(pick);
                    });
                }
                else {
                    this._pickup.hide();
                    this._pickup = undefined;
                }
            }
        }
    }
    doBeforePickupShow(pickup) {
        this._pickup = pickup;
        this._pickup.ignoreControls.add(this);
        let self = this;
        this._pickup.onRemove = function () {
            self._pickup = undefined;
        };
        if (this.onBeforePickupShow != undefined) {
            this.onBeforePickupShow(this, pickup);
        }
    }
    doAfterPickupShow(pickup) {
        if (this.onAfterPickupShow != undefined) {
            this.onAfterPickupShow(this, pickup);
        }
    }
    doBeforePickupRemove(pickup) {
        this._pickup = undefined;
        if (this.onBeforePickupRemove != undefined) {
            this.onBeforePickupRemove(this, pickup);
        }
    }
}
class CLabel extends CPanel {
    constructor(parent, name) {
        super(parent, name);
        let l = this.layers.addLayer();
        let i = l.addItem();
        i.name = "backgroundCanvasItem";
        this.backgroundCanvasItem = i;
        i = l.addItem();
        i.kind = ECanvasItemKind.TEXT;
        i.name = "text";
    }
}
class CLabelTextBox extends CLabel {
    get label() {
        return this.text;
    }
    set label(value) {
        this.text = value;
    }
    get value() {
        return this.textBox.text;
    }
    set value(value) {
        this.textBox.text = value;
    }
    constructor(parent, name) {
        super(parent, name);
        this.textBox = new CTextBox(this);
        let self = this;
        this.textBox.position.align = EPositionAlign.RIGHT;
        this.textBox.onResource = function () {
            self.textBox.position.align = EPositionAlign.RIGHT;
            self.textSet.hAlign = ETextAlign.HEAD;
            self.textSet.margins.left = 5;
        };
        this.textBox.position.width = 100;
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "label", this.label, "");
        CDataClass.putData(data, "value", this.value, "");
        CDataClass.putData(data, "textBox", this.textBox.toData(), {}, true);
    }
    doFromData(data) {
        super.doFromData(data);
        this.label = CDataClass.getData(data, "label", "");
        this.value = CDataClass.getData(data, "value", "");
        this.textBox.fromData(CDataClass.getData(data, "textBox", {}, true));
    }
    doResource() {
        super.doResource();
        this.textBox.position.align = EPositionAlign.RIGHT;
        this.textSet.hAlign = ETextAlign.HEAD;
        this.textSet.margins.left = 5;
    }
    addProperties() {
        let arr = new Array();
        arr.push({ instance: this.label, propertyName: "label", readOnly: false, enum: [] });
        arr.push({ instance: this.value, propertyName: "value", readOnly: false, enum: [] });
        return arr;
    }
}
class CCheckBox extends CButton {
    doClick(e) {
        super.doClick(e);
        this.checked = !this.checked;
    }
}
class CSelectBox extends CButton {
    doClick(e) {
        super.doClick(e);
        this.selected = !this.selected;
    }
}
class CMoveControl extends CPanel {
    constructor(parent, name) {
        super(parent, name);
        this.useMove = true;
        this.moveAreaLength = this.position.height;
    }
    doResource() {
        super.doResource();
        this.useMove = true;
        this.moveAreaLength = this.position.height;
    }
    doChangeSize() {
        super.doChangeSize();
        this.moveAreaLength = this.position.height;
    }
}
class CSelectGroupBox extends CButton {
    constructor() {
        super(...arguments);
        this._groupName = "";
    }
    get groupName() {
        return this._groupName;
    }
    set groupName(value) {
        this._groupName = value;
    }
    doClick(e) {
        super.doClick(e);
        this.selected = true;
    }
    doChangeSelected() {
        if (this.selected) {
            let arr = this.getGroupOtherItems();
            for (let n = 0; n < arr.length; n++) {
                arr[n].selected = false;
            }
        }
        super.doChangeSelected();
    }
    getGroupOtherItems() {
        let rt = new Array();
        let arr = CSystem.controls.findControls([{ columnName: "className", value: this.className }]);
        for (let n = 0; n < arr.length; n++) {
            if (arr[n].control != this && arr[n].control.as().groupName == this.groupName) {
                rt.push(arr[n].control);
            }
        }
        return rt;
    }
}
class CPickupControl extends CPanel {
    constructor(parent, name) {
        super(parent, name);
        this.autoRemove = false;
        this.ignoreControls = new Set();
        this.hasFocus = true;
        this._visible = false;
        this.controlElement.style.display = "none";
    }
    doResource() {
        super.doResource();
        this.hasFocus = true;
        this._visible = false;
        this.controlElement.style.display = "none";
    }
    doShowPickup() {
        this.visible = true;
        if (this.onShow != undefined) {
            this.onShow(this);
        }
    }
    doHidePickup() {
        if (this.onBeforeHide != undefined) {
            this.onBeforeHide(this);
        }
        this.visible = false;
    }
    doHide() {
        if (this.autoRemove)
            this.remove();
        super.doHide();
    }
    show() {
        this.doShowPickup();
    }
    hide() {
        this.doHidePickup();
    }
    static showPickup(resource, parent, left, top, width, height, beforeShow, afterShow, beforeRemove) {
        let pick = new CPickupControl(parent);
        pick.resource = resource;
        pick.position.left = left;
        pick.position.top = top;
        pick.position.width = width;
        pick.position.height = height;
        pick.autoRemove = true;
        if (beforeShow != undefined) {
            beforeShow(pick);
        }
        pick.onBeforeRemove = function (pick) {
            if (beforeRemove != undefined) {
                beforeRemove(pick);
            }
        };
        pick.show();
        if (afterShow != undefined) {
            afterShow(pick);
        }
        return pick;
    }
}
class CPopupItem {
    constructor(name, text, shortcut = "") {
        this.name = "";
        this.text = "";
        this.shortcut = "";
        this.name = name;
        this.text = text;
        this.shortcut = shortcut;
    }
}
class CPopupItemControl extends CPanel {
    constructor() {
        super(...arguments);
        this.idx = -1;
        this.popName = "";
    }
}
class CPopup extends CPickupControl {
    get items() {
        return this._items;
    }
    constructor() {
        super(document.body);
        this._items = new CTreeData();
        this.popupResource = "";
        this.popupItemResource = "";
        this.popupWidth = 200;
        this.position.padding.all = 5;
    }
    itemControlClear() {
        let arr = CSystem.getChildControls(this);
        for (let n = 0; n < arr.length; n++) {
            arr[n].remove();
        }
    }
    itemRefresh() {
        let self = this;
        this.itemControlClear();
        for (let n = 0; n < this._items.length; n++) {
            let pan = new CPopupItemControl(this);
            pan.idx = n;
            let item = this._items.getItem(n);
            pan.resource = this.popupItemResource;
            pan.position.left = 5;
            pan.position.top = (n * 30) + 5;
            pan.position.width = this.popupWidth - 10;
            pan.position.height = 30;
            if (item != undefined && item.value.asObject != undefined) {
                pan.text = item.value.asObject.text;
                pan.popName = item.value.asObject.name;
                pan.canvasItemText("righttext", item.value.asObject.shortcut);
                let h = (item.items.length * 30) + 10;
                if (item.items.length > 0) {
                    pan.canvasItemText("rightarrow", "▶");
                    function showChildPopup() {
                        self.__cPop = new CPopup();
                        self.__cPop.__pPop = self;
                        let p = self;
                        while (true) {
                            if (p.__pPop == undefined) {
                                break;
                            }
                            else {
                                p = p.__pPop;
                            }
                        }
                        self.__cPop.__apPop = p;
                        self.__cPop["idx"] = pan.idx;
                        self.__cPop.popupResource = self.popupResource;
                        self.__cPop.resource = self.popupResource;
                        self.__cPop.autoRemove = true;
                        if (item != undefined) {
                            self.__cPop.items.fromData(item.items.toData());
                        }
                        if (pan.getElementBounds().right + self.popupWidth <= window.innerWidth) {
                            self.__cPop.position.left = pan.getElementBounds().right;
                        }
                        else {
                            self.__cPop.position.left = pan.getElementBounds().left - self.popupWidth;
                        }
                        if (pan.getElementBounds().top + h <= window.innerHeight) {
                            self.__cPop.position.top = pan.getElementBounds().top;
                        }
                        else {
                            self.__cPop.position.top = pan.getElementBounds().top - h + pan.position.height;
                        }
                        self.__cPop.position.width = self.popupWidth;
                        self.__cPop.show();
                    }
                    pan.onThisPointerOver = function () {
                        if (self.__cPop != undefined) {
                            if (pan.idx != self.__cPop["idx"]) {
                                function chide(pop) {
                                    if (pop.__cPop != undefined)
                                        chide(pop.__cPop);
                                    pop.hide();
                                }
                                chide(self.__cPop);
                                showChildPopup();
                            }
                        }
                        else {
                            showChildPopup();
                        }
                    };
                }
                else {
                    pan.onThisPointerOver = function () {
                        if (self.__cPop != undefined) {
                            function chide(pop) {
                                if (pop.__cPop != undefined)
                                    chide(pop.__cPop);
                                pop.hide();
                            }
                            chide(self.__cPop);
                            self.__cPop = undefined;
                        }
                    };
                }
                pan.onClick = function () {
                    if (self.__apPop != undefined) {
                        self.__apPop.doPopupClick(pan.popName, pan.text);
                    }
                    else {
                        self.doPopupClick(pan.popName, pan.text);
                    }
                    self.hide();
                };
            }
        }
        this.position.height = (this._items.length * 30) + 10;
    }
    /*doToData(data: any): void {
        super.doToData(data)
        CDataClass.putData(data, "popupResource", this.popupResource, "")
        CDataClass.putData(data, "popupItemResource", this.popupItemResource, "")
        CDataClass.putData(data, "popupWidth", this.popupWidth, 200)
        CDataClass.putData(data, "items", this.items.toData(), [], true)
    }
    doFromData(data: any): void {
        super.doFromData(data)
        console.log("popup from")
        this.popupResource = CDataClass.getData(data, "popupResource", "")
        this.popupItemResource = CDataClass.getData(data, "popupItemResource", "")
        this.popupWidth = CDataClass.getData(data, "popupWidth", 200)
        this.items.fromData(CDataClass.getData(data, "items", [], true))
    }*/
    doResource() {
        super.doResource();
        this.position.padding.all = 5;
    }
    doPopupClick(name, text) {
        if (this.onPopupClick != undefined) {
            this.onPopupClick(this, name, text);
        }
    }
    doHidePickup() {
        this.__cPop = undefined;
        this.__pPop = undefined;
        this.__apPop = undefined;
        super.doHidePickup();
    }
    addItem(id, text, shortcut, treeItems) {
        if (treeItems != undefined) {
            let i = treeItems.addItem();
            i.value.asObject = new CPopupItem(id, text, shortcut);
            return i;
        }
        else {
            let i = this.items.addItem();
            i.value.asObject = new CPopupItem(id, text, shortcut);
            return i;
        }
    }
    show() {
        this.itemRefresh();
        super.show();
    }
}
class CElementControl extends CPanel {
    get element() {
        return this._element;
    }
    get elementMargins() {
        return this._elementMargins;
    }
    constructor(tagName, parent, name) {
        super(parent, name);
        this._elementMargins = new CNotifyRect();
        let self = this;
        this._element = document.createElement(tagName);
        this._controlElement.appendChild(this._element);
        this._element.style.position = "absolute";
        this.doInitInnerElement();
        this._elementMargins.onChange = function () {
            self.doSetInnerElementSize();
        };
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "elementMargins", this._elementMargins.toData(), {}, true);
    }
    doFromData(data) {
        super.doFromData(data);
        this.elementMargins.fromData(CDataClass.getData(data, "elementMargins", {}, true));
    }
    doResource() {
        super.doResource();
        this.elementBringToFront();
    }
    doRemove() {
        this.element.remove();
        super.doRemove();
    }
    doSetElementSize() {
        super.doSetElementSize();
        this.doSetInnerElementSize();
    }
    doChangeLayerCount() {
        this.elementBringToFront();
        super.doChangeLayerCount();
    }
    doInitInnerElement() {
        let self = this;
        this._element.addEventListener("pointerdown", function (e) {
            if (self.enabled) {
                self.doElementPointerDown(e);
            }
        });
        this._element.addEventListener("pointermove", function (e) {
            if (self.enabled) {
                self.doElementPointerMove(e);
            }
        });
        this._element.addEventListener("pointerup", function (e) {
            if (self.enabled) {
                self.doElementPointerUp(e);
            }
        });
        this._element.addEventListener("pointercancel", function (e) {
            if (self.enabled) {
                self.doElementPointerCancel(e);
            }
        });
        this._element.addEventListener("pointerover", function (e) {
            if (self.enabled) {
                self.doElementPointerOver(e);
            }
        });
        this._element.addEventListener("pointerout", function (e) {
            if (self.enabled) {
                self.doElementPointerOut(e);
            }
        });
        this._element.addEventListener("pointerenter", function (e) {
            if (self.enabled) {
                self.doElementPointerEnter(e);
            }
        });
        this._element.addEventListener("pointerleave", function (e) {
            if (self.enabled) {
                self.doElementPointerLeave(e);
            }
        });
        if (this.onInitInnerElement != undefined) {
            this.onInitInnerElement(this);
        }
    }
    doSetInnerElementSize() {
        this._element.style.left = this.elementMargins.left + "px";
        this._element.style.top = this.elementMargins.left + "px";
        this._element.style.width = this.position.width - this.elementMargins.left - this.elementMargins.right + "px";
        this._element.style.height = this.position.height - this.elementMargins.top - this.elementMargins.bottom + "px";
        if (this.onSetInnerElementSize != undefined) {
            this.onSetInnerElementSize(this);
        }
    }
    doElementPointerDown(e) {
        if (this.onElementPointerDown != undefined) {
            this.onElementPointerDown(this, e);
        }
    }
    doElementPointerMove(e) {
        if (this.onElementPointerMove != undefined) {
            this.onElementPointerMove(this, e);
        }
    }
    doElementPointerUp(e) {
        if (this.onElementPointerUp != undefined) {
            this.onElementPointerUp(this, e);
        }
    }
    doElementPointerCancel(e) {
        if (this.onElementPointerCancel != undefined) {
            this.onElementPointerCancel(this, e);
        }
    }
    doElementPointerOver(e) {
        if (this.onElementPointerOver != undefined) {
            this.onElementPointerOver(this, e);
        }
    }
    doElementPointerEnter(e) {
        if (this.onElementPointerEnter != undefined) {
            this.onElementPointerEnter(this, e);
        }
    }
    doElementPointerOut(e) {
        if (this.onElementPointerOut != undefined) {
            this.onElementPointerOut(this, e);
        }
    }
    doElementPointerLeave(e) {
        if (this.onElementPointerLeave != undefined) {
            this.onElementPointerLeave(this, e);
        }
    }
    elementBringToFront() {
        if (this.element.parentNode == this.controlElement) {
            this.controlElement.removeChild(this.element);
            this.controlElement.appendChild(this.element);
        }
    }
}
class CImage extends CElementControl {
    get src() {
        return this._src;
    }
    set src(value) {
        if (this._src != value) {
            this._src = value;
            this._element.src = value;
        }
    }
    constructor(parent, name) {
        super("img", parent, name);
        this._src = "";
        this._element.style.pointerEvents = "none";
        let self = this;
        this._element.onload = function () {
            self.doImageLoad();
        };
    }
    doImageLoad() {
        if (this.onImageLoad != undefined) {
            this.onImageLoad(this);
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
        let self = this;
        this._element.style.border = "none";
        this._element.style.outline = "none";
        this._element.style.objectFit = "contain";
        this._element.style.objectPosition = "center";
        super.doInitInnerElement();
    }
}
class CTextBox extends CElementControl {
    get input() {
        return this._element;
    }
    get textColor() {
        return this._textColor;
    }
    set textColor(value) {
        if (this._textColor != value) {
            this._textColor = value;
            this.input.style.color = value;
        }
    }
    get text() {
        return this.input.value;
    }
    set text(value) {
        if (value != this.input.value) {
            this.input.value = value;
            this.doChange("text");
            this.doChangeText();
        }
    }
    get focused() {
        return this._focused;
    }
    set focused(value) {
        if (this._focused != value) {
            this._focused = value;
            if (value) {
                this.input.focus();
            }
            else {
                this.input.blur();
            }
            this.doChange(CControl.CON_CHANGE_FOCUS);
        }
    }
    constructor(parent, name) {
        super("input", parent, name);
        this._textColor = "rgba(0,0,0,1)";
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "textColor", this._textColor, "rgba(0,0,0,1)");
    }
    doFromData(data) {
        super.doFromData(data);
        this.textColor = CDataClass.getData(data, "textColor", "rgba(0,0,0,1)");
    }
    doSetInnerElementSize() {
        this._element.style.left = this.elementMargins.left + "px";
        this._element.style.top = this.elementMargins.top + "px";
        this._element.style.width = this.position.width - this.elementMargins.left - this.elementMargins.right - 4 + "px";
        this._element.style.height = this.position.height - this.elementMargins.top - this.elementMargins.bottom - 2 + "px";
        if (this.onSetInnerElementSize != undefined) {
            this.onSetInnerElementSize(this);
        }
    }
    doInitInnerElement() {
        let self = this;
        this._element.setAttribute("type", "text");
        this._element.setAttribute("spellcheck", "false");
        this._element.style.border = "none";
        this._element.style.outline = "none";
        this._element.style.background = "transparent";
        this._element.addEventListener("focus", function () {
            self.focused = true;
        });
        this._element.addEventListener("blur", function () {
            self.focused = false;
        });
        this._element.addEventListener("input", function (e) {
            self.doChange("text");
            self.doChangeText();
        });
        super.doInitInnerElement();
    }
}
class CTextArea extends CElementControl {
    get textArea() {
        return this._element;
    }
    get textColor() {
        return this._textColor;
    }
    set textColor(value) {
        if (this._textColor != value) {
            this._textColor = value;
            this.textArea.style.color = value;
        }
    }
    get text() {
        return this.textArea.value;
    }
    set text(value) {
        if (value != this.textArea.value) {
            this.textArea.value = value;
            this.doChange("text");
            this.doChangeText();
        }
    }
    get wrap() {
        return this._wrap;
    }
    set wrap(value) {
        if (this._wrap != value) {
            this._wrap = value;
            if (value) {
                this.textArea.setAttribute("wrap", "on");
            }
            else {
                this.textArea.setAttribute("wrap", "off");
            }
        }
    }
    get focused() {
        return this._focused;
    }
    set focused(value) {
        if (this._focused != value) {
            this._focused = value;
            if (value) {
                this.textArea.focus();
            }
            else {
                this.textArea.blur();
            }
            this.doChange(CControl.CON_CHANGE_FOCUS);
        }
    }
    get scrollbarResource() {
        return this._scrollbarResource;
    }
    set scrollbarResource(value) {
        if (this._scrollbarResource != value) {
            this._scrollbarResource = value;
            this.doChangeScrollbarResource();
        }
    }
    get scrollbarLength() {
        return this._scrollbarLength;
    }
    set scrollbarLength(value) {
        if (this._scrollbarLength != value) {
            this._scrollbarLength = value;
            this.doChangeScrollbarInfo();
        }
    }
    get hScrollbar() {
        return this._hScrollbar;
    }
    get vScrollbar() {
        return this._vScrollbar;
    }
    get useHScrollbar() {
        return this._useHScrollbar;
    }
    set useHScrollbar(value) {
        if (this._useHScrollbar != value) {
            this._useHScrollbar = value;
            this.doChangeScrollbarInfo();
        }
    }
    get useVScrollbar() {
        return this._useVScrollbar;
    }
    set useVScrollbar(value) {
        if (this._useVScrollbar != value) {
            this._useVScrollbar = value;
            this.doChangeScrollbarInfo();
        }
    }
    constructor(parent, name) {
        super("textarea", parent, name);
        this.__useScrollbar = false;
        this._wrap = false;
        this._textColor = "rgba(0,0,0,1)";
        this._scrollbarResource = "";
        this._hScrollbar = new CScrollbar(this);
        this._vScrollbar = new CScrollbar(this);
        this._scrollbarLength = 15;
        this._useHScrollbar = true;
        this._useVScrollbar = true;
        this.useTab = true;
        this.useEnter = true;
        this.useCtrlA = true;
        let self = this;
        this._vScrollbar.scrollbarKind = EScrollBarKind.V;
        this._hScrollbar.onResource = function () {
            self.doSetInnerElementSize();
        };
        this._vScrollbar.onResource = function () {
            self.doSetInnerElementSize();
        };
        this._hScrollbar.onScroll = function (s, vr) {
            let len = self.textArea.scrollWidth - parseFloat(CStringUtil.replaceAll(self.textArea.style.width, "px", ""));
            self.textArea.scrollLeft = len * vr;
        };
        this._vScrollbar.onScroll = function (s, vr) {
            let len = self.textArea.scrollHeight - parseFloat(CStringUtil.replaceAll(self.textArea.style.height, "px", ""));
            self.textArea.scrollTop = len * vr;
        };
        this._hScrollbar.onThisPointerDown = function () {
            self.__useScrollbar = true;
        };
        this._hScrollbar.onThisPointerUp = function () {
            self.__useScrollbar = false;
        };
        this._vScrollbar.onThisPointerDown = function () {
            self.__useScrollbar = true;
        };
        this._vScrollbar.onThisPointerUp = function () {
            self.__useScrollbar = false;
        };
        this.textArea.addEventListener("scroll", function (ev) {
            if (!self.__useScrollbar) {
                let len = self.textArea.scrollWidth - parseFloat(CStringUtil.replaceAll(self.textArea.style.width, "px", ""));
                self.hScrollbar.valueRatio = CCalc.crRange2Value(0, len, self.textArea.scrollLeft, 0, 1);
                len = self.textArea.scrollHeight - parseFloat(CStringUtil.replaceAll(self.textArea.style.height, "px", ""));
                self.vScrollbar.valueRatio = CCalc.crRange2Value(0, len, self.textArea.scrollTop, 0, 1);
            }
        });
        this.textArea.addEventListener("keydown", function (ev) {
            if (ev.key.toUpperCase() == "A" && ev.ctrlKey && self.useCtrlA) {
                self.textArea.select();
            }
            if (ev.code == "Tab" && self.useTab) {
                var v = self.textArea.value, s = self.textArea.selectionStart, e = self.textArea.selectionEnd;
                self.textArea.value = v.substring(0, s) + '\t' + v.substring(e);
                self.textArea.selectionStart = self.textArea.selectionEnd = s + 1;
                //return false;
                ev.preventDefault();
            }
            if (ev.code == "Enter" && !ev.ctrlKey && self.useEnter) {
                if (ev.isComposing)
                    return;
                var v = self.textArea.value, s = self.textArea.selectionStart, e = self.textArea.selectionEnd;
                let sss = v.substring(0, s);
                let ss = "";
                for (let n = sss.length - 1; n >= 0; n--) {
                    if (sss[n] == "\n") {
                        break;
                    }
                    else {
                        ss = sss[n] + ss;
                    }
                }
                let arr = ss.split("\t");
                let tCnt = arr.length - 1;
                self.textArea.value = v.substring(0, s) + '\n';
                for (let n = 0; n < tCnt; n++) {
                    self.textArea.value = self.textArea.value + "\t";
                }
                self.textArea.value = self.textArea.value + v.substring(e);
                self.textArea.selectionStart = self.textArea.selectionEnd = s + 1 + tCnt;
                //return false;
                ev.preventDefault();
            }
        });
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "wrap", this.wrap, false);
        CDataClass.putData(data, "textColor", this._textColor, "rgba(0,0,0,1)");
        CDataClass.putData(data, "scrollbarResource", this.scrollbarResource, "");
        CDataClass.putData(data, "scrollbarLength", this.scrollbarLength, 15);
        CDataClass.putData(data, "useHScrollbar", this.useHScrollbar, true);
        CDataClass.putData(data, "useVScrollbar", this.useVScrollbar, true);
        CDataClass.putData(data, "useTab", this.useTab, true);
        CDataClass.putData(data, "useCtrlA", this.useCtrlA, true);
        CDataClass.putData(data, "useEnter", this.useEnter, true);
    }
    doFromData(data) {
        super.doFromData(data);
        this.wrap = CDataClass.getData(data, "wrap", false);
        this.textColor = CDataClass.getData(data, "textColor", "rgba(0,0,0,1)");
        this.scrollbarResource = CDataClass.getData(data, "scrollbarResource", "");
        this.scrollbarLength = CDataClass.getData(data, "scrollbarLength", 15);
        this.useHScrollbar = CDataClass.getData(data, "useHScrollbar", true);
        this.useVScrollbar = CDataClass.getData(data, "useVScrollbar", true);
        this.useTab = CDataClass.getData(data, "useTab", true);
        this.useCtrlA = CDataClass.getData(data, "useCtrlA", true);
        this.useEnter = CDataClass.getData(data, "useEnter", true);
    }
    doSetInnerElementSize() {
        this._element.style.left = this.elementMargins.left + "px";
        this._element.style.top = this.elementMargins.top + "px";
        let w = 0;
        let h = 0;
        if (this.useHScrollbar) {
            h = this.position.height - this.elementMargins.top - this.elementMargins.bottom - this.scrollbarLength;
        }
        else {
            h = this.position.height - this.elementMargins.top - this.elementMargins.bottom;
        }
        if (this.useVScrollbar) {
            w = this.position.width - this.elementMargins.left - this.elementMargins.right - this.scrollbarLength;
        }
        else {
            w = this.position.width - this.elementMargins.left - this.elementMargins.right;
        }
        this._element.style.width = w - 4 + "px";
        this._element.style.height = h - 4 + "px";
        if (this.useHScrollbar) {
            this._hScrollbar.position.left = this.elementMargins.left;
            this._hScrollbar.position.top = this.position.height - this.elementMargins.bottom - this._scrollbarLength;
            this._hScrollbar.position.width = w;
            this._hScrollbar.position.height = this._scrollbarLength;
            this._hScrollbar.scrollbarKind = EScrollBarKind.H;
            this._hScrollbar.bringToFront();
        }
        if (this.useVScrollbar) {
            this._vScrollbar.position.left = this.position.width - this._scrollbarLength - this.elementMargins.right;
            this._vScrollbar.position.top = this.elementMargins.top;
            this._vScrollbar.position.width = this._scrollbarLength;
            this._vScrollbar.position.height = h;
            this._vScrollbar.scrollbarKind = EScrollBarKind.V;
            this._vScrollbar.bringToFront();
        }
        this._hScrollbar.visible = this.useHScrollbar;
        this._vScrollbar.visible = this.useVScrollbar;
        if (this.onSetInnerElementSize != undefined) {
            this.onSetInnerElementSize(this);
        }
    }
    doInitInnerElement() {
        let self = this;
        this._element.setAttribute("spellcheck", "false");
        this._element.style.border = "none";
        this._element.style.outline = "none";
        this._element.style.background = "transparent";
        this._element.style.resize = "none";
        this._element.style.tabSize = "2";
        this.textArea.setAttribute("wrap", "off");
        this.textArea.setAttribute("class", "scrollno");
        this._element.addEventListener("focus", function () {
            self.focused = true;
        });
        this._element.addEventListener("blur", function () {
            self.focused = false;
        });
        this._element.addEventListener("input", function (e) {
            self.doChange("text");
            self.doChangeText();
        });
        super.doInitInnerElement();
    }
    doChangeScrollbarResource() {
        this._hScrollbar.resource = this._scrollbarResource;
        this._vScrollbar.resource = this._scrollbarResource;
    }
    doChangeScrollbarInfo() {
        this.doSetInnerElementSize();
    }
    scrollBottom() {
        this.textArea.scrollTop = this.textArea.scrollHeight;
    }
}
var EScrollBarKind;
(function (EScrollBarKind) {
    EScrollBarKind[EScrollBarKind["H"] = 0] = "H";
    EScrollBarKind[EScrollBarKind["V"] = 1] = "V";
})(EScrollBarKind || (EScrollBarKind = {}));
var EScrollPressKind;
(function (EScrollPressKind) {
    EScrollPressKind[EScrollPressKind["BUTTON1"] = 0] = "BUTTON1";
    EScrollPressKind[EScrollPressKind["BUTTON2"] = 1] = "BUTTON2";
    EScrollPressKind[EScrollPressKind["BODY"] = 2] = "BODY";
})(EScrollPressKind || (EScrollPressKind = {}));
class CCustomScrollBar extends CPanel {
    get scrollbarKind() {
        return this._scrollbarKind;
    }
    set scrollbarKind(value) {
        if (this._scrollbarKind != value) {
            this._scrollbarKind = value;
            this.doChangeScrollBarKind();
        }
    }
    get useScrollButton() {
        return this._useScrollButton;
    }
    set useScrollButton(value) {
        if (this._useScrollButton != value) {
            this._useScrollButton = value;
            this.doChangeUseScrollButton();
        }
    }
    get min() {
        return this._min;
    }
    set min(value) {
        if (this._min != value) {
            this._min = value;
            this.doChangeMin();
        }
    }
    get max() {
        return this._max;
    }
    set max(value) {
        if (this._max != value) {
            this._max = value;
            this.doChangeMax();
        }
    }
    get value() {
        return this._value;
    }
    set value(value) {
        let v = value;
        if (v < this.min)
            v = this.min;
        if (v > this.max)
            v = this.max;
        if (this._value != v) {
            this._value = v;
            this.doChangeValue();
        }
    }
    get valueRatio() {
        return CCalc.crRange2Value(this.min, this.max, this.value, 0, 1);
    }
    set valueRatio(value) {
        let v = value;
        if (v < 0)
            v = 0;
        if (v > 1)
            v = 1;
        this.value = CCalc.crRange2Value(0, 1, value, this.min, this.max);
    }
    constructor(parent, name) {
        super(parent, name);
        this._scrollbarKind = EScrollBarKind.H;
        this._useScrollButton = false;
        this._min = 0;
        this._max = 100;
        this._value = 0;
        this.usePointerCapture = true;
    }
    getButtonLength() {
        switch (this._scrollbarKind) {
            case EScrollBarKind.H:
                if (this._useScrollButton) {
                    return this.position.height;
                }
                else {
                    return 0;
                }
            case EScrollBarKind.V:
                if (this._useScrollButton) {
                    return this.position.width;
                }
                else {
                    return 0;
                }
        }
    }
    getCursorLength() {
        switch (this._scrollbarKind) {
            case EScrollBarKind.H:
                return this.position.height;
            case EScrollBarKind.V:
                return this.position.width;
        }
    }
    getValuePosition() {
        let p = 0;
        if (this.scrollbarKind == EScrollBarKind.H) {
            let len = this.position.width - (this.getButtonLength() * 2) - this.getCursorLength();
            p = len * this.valueRatio;
        }
        else {
            let len = this.position.height - (this.getButtonLength() * 2) - this.getCursorLength();
            p = len * this.valueRatio;
        }
        if (this.useScrollButton) {
            p += this.getButtonLength();
        }
        return p;
    }
    doResource() {
        super.doResource();
        this.usePointerCapture = true;
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "scrollbarKind", this.scrollbarKind, EScrollBarKind.H);
        CDataClass.putData(data, "useScrollButton", this.useScrollButton, false);
        CDataClass.putData(data, "min", this.min, 0);
        CDataClass.putData(data, "max", this.max, 100);
        CDataClass.putData(data, "value", this.value, 0);
    }
    doFromData(data) {
        super.doFromData(data);
        this.scrollbarKind = CDataClass.getData(data, "scrollbarKind", EScrollBarKind.H);
        this.useScrollButton = CDataClass.getData(data, "useScrollButton", false);
        this.min = CDataClass.getData(data, "min", 0);
        this.max = CDataClass.getData(data, "max", 100);
        this.value = CDataClass.getData(data, "value", 0);
    }
    doThisPointerDown(e, points) {
        super.doThisPointerDown(e, points);
        if (this.__scrollPressKind != undefined)
            return;
        if (this.scrollbarKind == EScrollBarKind.H) {
            if (e.offsetX < this.getButtonLength()) {
                this.__scrollPressKind = EScrollPressKind.BUTTON1;
                this.doScrollButton1Down();
            }
            else if (e.offsetX > this.position.width - this.getButtonLength()) {
                this.__scrollPressKind = EScrollPressKind.BUTTON2;
                this.doScrollButton2Down();
            }
            else {
                this.__scrollPressKind = EScrollPressKind.BODY;
                this.doScrollBody(e);
            }
        }
        else {
            if (e.offsetY < this.getButtonLength()) {
                this.__scrollPressKind = EScrollPressKind.BUTTON1;
                this.doScrollButton1Down();
            }
            else if (e.offsetY > this.position.height - this.getButtonLength()) {
                this.__scrollPressKind = EScrollPressKind.BUTTON2;
                this.doScrollButton2Down();
            }
            else {
                this.__scrollPressKind = EScrollPressKind.BODY;
                this.doScrollBody(e);
            }
        }
    }
    doThisPointerMove(e, points) {
        super.doThisPointerMove(e, points);
        if (this.__scrollPressKind == EScrollPressKind.BODY) {
            this.doScrollBody(e);
        }
    }
    doThisPointerUp(e, points) {
        super.doThisPointerUp(e, points);
        switch (this.__scrollPressKind) {
            case EScrollPressKind.BUTTON1:
                this.doScrollButton1up();
                break;
            case EScrollPressKind.BUTTON2:
                this.doScrollButton2up();
                break;
        }
        this.__scrollPressKind = undefined;
    }
    doChangeScrollBarKind() {
        if (this.onChangeScrollbarKind != undefined) {
            this.onChangeScrollbarKind(this);
        }
    }
    doChangeUseScrollButton() {
        if (this.onChangeUseScrollButton != undefined) {
            this.onChangeUseScrollButton(this);
        }
    }
    doChangeMin() {
        this.doScroll();
        if (this.onChangeMin != undefined) {
            this.onChangeMin(this);
        }
    }
    doChangeMax() {
        this.doScroll();
        if (this.onChangeMax != undefined) {
            this.onChangeMax(this);
        }
    }
    doChangeValue() {
        this.doScroll();
        if (this.onChangeValue != undefined) {
            this.onChangeValue(this);
        }
    }
    doScroll() {
        if (this.onScroll != undefined) {
            this.onScroll(this, this.valueRatio, this.getValuePosition());
        }
    }
    doScrollButton1Down() {
        let self = this;
        this.__interval = setInterval(function () {
            self.value--;
        }, 16);
        if (this.onScrollButton1Down != undefined) {
            this.onScrollButton1Down(this);
        }
    }
    doScrollButton1up() {
        clearInterval(this.__interval);
        if (this.onScrollButton1Up != undefined) {
            this.onScrollButton1Up(this);
        }
    }
    doScrollButton2Down() {
        let self = this;
        this.__interval = setInterval(function () {
            self.value++;
        }, 16);
        if (this.onScrollButton2Down != undefined) {
            this.onScrollButton2Down(this);
        }
    }
    doScrollButton2up() {
        clearInterval(this.__interval);
        if (this.onScrollButton2Up != undefined) {
            this.onScrollButton2Up(this);
        }
    }
    doScrollBody(e) {
        if (this.scrollbarKind == EScrollBarKind.H) {
            let len = this.position.width - (this.getButtonLength() * 2) - this.getCursorLength();
            let x = e.offsetX - this.getButtonLength() - (this.getCursorLength() / 2);
            this.valueRatio = CCalc.crRange2Value(0, len, x, 0, 1);
        }
        else {
            let len = this.position.height - (this.getButtonLength() * 2) - this.getCursorLength();
            let x = e.offsetY - this.getButtonLength() - (this.getCursorLength() / 2);
            this.valueRatio = CCalc.crRange2Value(0, len, x, 0, 1);
        }
        if (this.onScrollBody != undefined) {
            this.onScrollBody(this, e);
        }
    }
}
class CScrollbar extends CCustomScrollBar {
    doResource() {
        super.doResource();
        this.value = 0;
        this.doSetScrollItems();
    }
    doChangeUseScrollButton() {
        super.doChangeUseScrollButton();
        this.doSetScrollItems();
    }
    doChangeSize() {
        super.doChangeSize();
        this.doSetScrollItems();
    }
    doScrollBody(e) {
        super.doScrollBody(e);
        this.doSetScrollItems();
    }
    doScroll() {
        super.doScroll();
        this.doSetScrollItems();
    }
    doSetScrollItems() {
        let arrButton1 = this.layers.getCanvasItems("scrollbutton1");
        let arrButton2 = this.layers.getCanvasItems("scrollbutton2");
        let arrCursor = this.layers.getCanvasItems("scrollcursor");
        for (let n = 0; n < arrButton1.length; n++) {
            arrButton1[n].visible = this.useScrollButton;
            arrButton1[n].position.height = this.getButtonLength();
            arrButton1[n].position.width = this.getButtonLength();
            if (this.scrollbarKind == EScrollBarKind.H) {
                arrButton1[n].align = ECanvasItemAlign.LEFT;
            }
            if (this.scrollbarKind == EScrollBarKind.V) {
                arrButton1[n].align = ECanvasItemAlign.TOP;
            }
        }
        for (let n = 0; n < arrButton2.length; n++) {
            arrButton2[n].visible = this.useScrollButton;
            arrButton2[n].position.height = this.getButtonLength();
            arrButton2[n].position.width = this.getButtonLength();
            if (this.scrollbarKind == EScrollBarKind.H) {
                arrButton2[n].align = ECanvasItemAlign.RIGHT;
            }
            if (this.scrollbarKind == EScrollBarKind.V) {
                arrButton2[n].align = ECanvasItemAlign.BOTTOM;
            }
        }
        for (let n = 0; n < arrCursor.length; n++) {
            arrCursor[n].align = ECanvasItemAlign.NONE;
            if (this.scrollbarKind == EScrollBarKind.H) {
                arrCursor[n].position.left = this.getValuePosition();
                arrCursor[n].position.top = 0;
                arrCursor[n].position.height = this.getCursorLength();
                arrCursor[n].position.width = this.getCursorLength();
            }
            if (this.scrollbarKind == EScrollBarKind.V) {
                arrCursor[n].position.left = 0;
                arrCursor[n].position.top = this.getValuePosition();
                arrCursor[n].position.height = this.getCursorLength();
                arrCursor[n].position.width = this.getCursorLength();
            }
        }
    }
}
class CScrollBox extends CPanel {
    get scrollAnimatorResource() {
        return this._scrollAnimatorResource;
    }
    set scrollAnimatorResource(value) {
        this._scrollAnimatorResource = value;
        if (value != "")
            this.scrollAnimationTrigger = CAnimator.animatorFromResource(this, value);
    }
    get isAutoScroll() {
        return this.__autoScroll != 0;
    }
    get background() {
        return this._background;
    }
    get content() {
        return this._content;
    }
    get contentWidth() {
        return this._content.position.width;
    }
    set contentWidth(value) {
        this._content.position.width = value;
        this.doChangeContentSize();
    }
    get contentHeight() {
        return this._content.position.height;
    }
    set contentHeight(value) {
        this._content.position.height = value;
        this.doChangeContentSize();
    }
    get scrollLeft() {
        return this._background.controlElement.scrollLeft;
    }
    set scrollLeft(value) {
        this._background.controlElement.scrollLeft = value;
    }
    get scrollTop() {
        return this._background.controlElement.scrollTop;
    }
    set scrollTop(value) {
        this._background.controlElement.scrollTop = value;
    }
    get scrollbarResource() {
        return this._scrollbarResource;
    }
    get scrollWidth() {
        return this._background.controlElement.scrollWidth;
    }
    get scrollHeight() {
        return this._background.controlElement.scrollHeight;
    }
    set scrollbarResource(value) {
        if (this._scrollbarResource != value) {
            this._scrollbarResource = value;
            this.doChangeScrollbarResource();
        }
    }
    get scrollbarLength() {
        return this._scrollbarLength;
    }
    set scrollbarLength(value) {
        if (this._scrollbarLength != value) {
            this._scrollbarLength = value;
            this.doChangeScrollbarInfo();
        }
    }
    get useHScrollbar() {
        return this._useHScrollbar;
    }
    set useHScrollbar(value) {
        if (this._useHScrollbar != value) {
            this._useHScrollbar = value;
            this.doChangeScrollbarInfo();
        }
    }
    get useVScrollbar() {
        return this._useVScrollbar;
    }
    set useVScrollbar(value) {
        if (this._useVScrollbar != value) {
            this._useVScrollbar = value;
            this.doChangeScrollbarInfo();
        }
    }
    get hScrollbar() {
        return this._hScrollbar;
    }
    get vScrollbar() {
        return this._vScrollbar;
    }
    get contentViewWidth() {
        return this._background.position.width - this.position.padding.left - this.position.padding.right;
    }
    get contentViewHeight() {
        return this._background.position.height - this.position.padding.top - this.position.padding.bottom;
    }
    constructor(parent, name) {
        super(parent, name);
        this.__useScrollbar = false;
        this.__autoScroll = 0;
        this._background = new CPanel(this);
        //protected _content: CPanel
        this._scrollbarResource = "";
        this._hScrollbar = new CScrollbar(this);
        this._vScrollbar = new CScrollbar(this);
        this._scrollbarLength = 15;
        this._useHScrollbar = true;
        this._useVScrollbar = true;
        this._scrollAnimatorResource = "";
        let self = this;
        this._background.overflow = "scroll";
        /*this.stopPropagation.down = true
        this.stopPropagation.move = true
        this.stopPropagation.up = true
        this.stopPropagation.wheel = true*/
        //this._background.overflow = "auto"
        this._content = new CLayout(this._background);
        //this._content = new CPanel(this._background)
        //this._content.overflow = "auto"
        this.overflow = "hidden";
        this._vScrollbar.scrollbarKind = EScrollBarKind.V;
        this._hScrollbar.onResource = function () {
            self.doSetInnerSize();
        };
        this._vScrollbar.onResource = function () {
            self.doSetInnerSize();
        };
        this._hScrollbar.onScroll = function (s, vr) {
            let len = self.scrollWidth - self._background.position.width;
            self.scrollLeft = len * vr;
        };
        this._vScrollbar.onScroll = function (s, vr) {
            let len = self.scrollHeight - self._background.position.height;
            self.scrollTop = len * vr;
        };
        this._hScrollbar.onThisPointerDown = function () {
            self.__useScrollbar = true;
        };
        this._hScrollbar.onThisPointerUp = function () {
            self.__useScrollbar = false;
        };
        this._vScrollbar.onThisPointerDown = function () {
            self.__useScrollbar = true;
        };
        this._vScrollbar.onThisPointerUp = function () {
            self.__useScrollbar = false;
        };
        this._background.controlElement.onscroll = function () {
            self.doScroll();
        };
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "scrollbarResource", this.scrollbarResource, "");
        CDataClass.putData(data, "scrollbarLength", this.scrollbarLength, 15);
        CDataClass.putData(data, "useHScrollbar", this.useHScrollbar, true);
        CDataClass.putData(data, "useVScrollbar", this.useVScrollbar, true);
        CDataClass.putData(data, "contentWidth", this.contentWidth, 0);
        CDataClass.putData(data, "contentHeight", this.contentHeight, 0);
        CDataClass.putData(data, "scrollAnimatorResource", this.scrollAnimatorResource, "");
        if (this.scrollAnimationTrigger != undefined)
            CDataClass.putData(data, "scrollAnimationTrigger", this.scrollAnimationTrigger.toData(), {}, true);
    }
    doFromData(data) {
        super.doFromData(data);
        this.scrollbarResource = CDataClass.getData(data, "scrollbarResource", "");
        this.scrollbarLength = CDataClass.getData(data, "scrollbarLength", 15);
        this.useHScrollbar = CDataClass.getData(data, "useHScrollbar", true);
        this.useVScrollbar = CDataClass.getData(data, "useVScrollbar", true);
        this.contentWidth = CDataClass.getData(data, "contentWidth", 0);
        this.contentHeight = CDataClass.getData(data, "contentHeight", 0);
        CAnimator.fromAnimatorData(data, this, "scrollAnimationTrigger");
        this.scrollAnimatorResource = CDataClass.getData(data, "scrollAnimatorResource", "");
        this.overflow = "hidden";
        /*this.stopPropagation.down = true
        this.stopPropagation.move = true
        this.stopPropagation.up = true
        this.stopPropagation.wheel = true*/
    }
    doResource() {
        super.doResource();
        this.overflow = "hidden";
        /*this.stopPropagation.down = true
        this.stopPropagation.move = true
        this.stopPropagation.up = true
        this.stopPropagation.wheel = true*/
    }
    doRemove() {
        this.content.remove();
        super.doRemove();
    }
    doChangeSize() {
        super.doChangeSize();
        this.doSetInnerSize();
    }
    doSetInnerSize() {
        this.background.position.left = this.position.padding.left;
        this.background.position.top = this.position.padding.top;
        let w = 0;
        let h = 0;
        if (this.useHScrollbar) {
            h = this.position.height - this.position.padding.top - this.position.padding.bottom - this.scrollbarLength;
        }
        else {
            h = this.position.height - this.position.padding.top - this.position.padding.bottom;
        }
        if (this.useVScrollbar) {
            w = this.position.width - this.position.padding.left - this.position.padding.right - this.scrollbarLength;
        }
        else {
            w = this.position.width - this.position.padding.left - this.position.padding.right;
        }
        this.background.position.width = w;
        this.background.position.height = h;
        this._hScrollbar.visible = this.useHScrollbar;
        this._vScrollbar.visible = this.useVScrollbar;
        if (this.useHScrollbar) {
            this._hScrollbar.position.left = this.position.padding.left;
            this._hScrollbar.position.top = this.position.height - this.position.padding.bottom - this._scrollbarLength;
            this._hScrollbar.position.width = w;
            this._hScrollbar.position.height = this._scrollbarLength;
            this._hScrollbar.scrollbarKind = EScrollBarKind.H;
            this._hScrollbar.bringToFront();
            this._hScrollbar.enabled = w < this.contentWidth;
        }
        if (this.useVScrollbar) {
            this._vScrollbar.position.left = this.position.width - this._scrollbarLength - this.position.padding.right;
            this._vScrollbar.position.top = this.position.padding.top;
            this._vScrollbar.position.width = this._scrollbarLength;
            this._vScrollbar.position.height = h;
            this._vScrollbar.scrollbarKind = EScrollBarKind.V;
            this._vScrollbar.bringToFront();
            this._vScrollbar.enabled = h < this.contentHeight;
        }
        if (this.onSetInnerSize != undefined) {
            this.onSetInnerSize(this);
        }
    }
    doChangeScrollbarResource() {
        this._hScrollbar.resource = this._scrollbarResource;
        this._vScrollbar.resource = this._scrollbarResource;
        if (this.onChangeScrollbarResource != undefined) {
            this.onChangeScrollbarResource(this);
        }
    }
    doChangeScrollbarInfo() {
        this.doSetInnerSize();
        if (this.onChangeScrollbarInfo != undefined) {
            this.onChangeScrollbarInfo(this);
        }
    }
    doChangeContentSize() {
        this.doSetInnerSize();
        if (this.onChangeContentSize != undefined) {
            this.onChangeContentSize(this);
        }
    }
    doScroll() {
        if (this.scrollAnimationTrigger != undefined)
            this.scrollAnimationTrigger.start();
        if (!this.__useScrollbar) {
            let len = this.scrollWidth - this._background.position.width;
            this.hScrollbar.valueRatio = CCalc.crRange2Value(0, len, this.scrollLeft, 0, 1);
            len = this.scrollHeight - this._background.position.height;
            this.vScrollbar.valueRatio = CCalc.crRange2Value(0, len, this.scrollTop, 0, 1);
        }
        if (this.onScroll != undefined) {
            this.onScroll(this);
        }
    }
    scrollToLeft() {
        let self = this;
        let st = this.scrollTop;
        CAnimation.animate(100, function (t, v, ct) {
            self.scrollLeft = st + (-st * v);
        });
    }
    scrollToRight() {
        let self = this;
        let st = this.scrollLeft;
        let ed = this.scrollWidth - st;
        CAnimation.animate(100, function (t, v, ct) {
            self.scrollLeft = st + (ed * v);
        });
    }
    scrollToTop() {
        let self = this;
        let st = this.scrollTop;
        CAnimation.animate(100, function (t, v, ct) {
            self.scrollTop = st + (-st * v);
        });
    }
    scrollToBottom() {
        let self = this;
        let st = this.scrollTop;
        let ed = this.scrollHeight - st;
        CAnimation.animate(100, function (t, v, ct) {
            self.scrollTop = st + (ed * v);
        });
    }
    scrollTo(x, y) {
        let xx = x;
        if (xx > this.scrollWidth)
            xx = this.scrollWidth;
        if (xx < 0)
            xx = 0;
        let yy = y;
        if (yy > this.scrollHeight)
            yy = this.scrollHeight;
        if (yy < 0)
            yy = 0;
        let stx = this.scrollLeft;
        let edx = xx - stx;
        let sty = this.scrollTop;
        let edy = yy - sty;
        let self = this;
        CAnimation.animate(100, function (t, v, ct) {
            self.scrollLeft = stx + (edx * v);
            self.scrollTop = sty + (edy * v);
        });
    }
    startAutoScroll(direction, scrollValue, interval = 10, scrollfn) {
        let self = this;
        let preValue = 0;
        if (direction == "x") {
            preValue = this.scrollLeft;
        }
        else {
            preValue = this.scrollTop;
        }
        if (this.__autoScroll == 0) {
            this.__autoScroll = setInterval(function () {
                if (direction == "x") {
                    self.hScrollbar.value += scrollValue;
                    if (scrollfn != undefined) {
                        scrollfn(self.scrollLeft - preValue);
                    }
                    preValue = self.scrollLeft;
                    if (self.hScrollbar.value == self.hScrollbar.max) {
                        self.stopAutoScroll();
                    }
                }
                if (direction == "y") {
                    self.vScrollbar.value += scrollValue;
                    if (scrollfn != undefined) {
                        scrollfn(self.scrollTop - preValue);
                    }
                    preValue = self.scrollTop;
                    if (self.vScrollbar.value == self.vScrollbar.max) {
                        self.stopAutoScroll();
                    }
                }
            }, interval);
        }
    }
    stopAutoScroll() {
        clearInterval(this.__autoScroll);
        this.__autoScroll = 0;
    }
    addProperties() {
        let arr = super.addProperties();
        arr.push({ instance: this.scrollAnimationTrigger, propertyName: "scrollAnimationTrigger", readOnly: false, enum: [] });
        arr.push({ instance: this.contentWidth, propertyName: "contentWidth", readOnly: false, enum: [] });
        arr.push({ instance: this.contentHeight, propertyName: "contentHeight", readOnly: false, enum: [] });
        return arr;
    }
}
class CUnlimitedScrollBox extends CPanel {
    get scrollAnimatorResource() {
        return this._scrollAnimatorResource;
    }
    set scrollAnimatorResource(value) {
        this._scrollAnimatorResource = value;
        if (value != "")
            this.scrollAnimationTrigger = CAnimator.animatorFromResource(this, value);
    }
    get isAutoScroll() {
        return this.__autoScroll != 0;
    }
    get background() {
        return this._background;
    }
    get content() {
        return this._content;
    }
    get scrollMinX() {
        return this._scrollMinX;
    }
    set scrollMinX(value) {
        let v = value;
        if (v > this.scrollMaxX)
            v = this.scrollMaxX;
        //if(v < this.scrollX) this.scrollX = v
        if (this._scrollMinX != v) {
            this._scrollMinX = v;
            this.doChangeScrollArea();
        }
    }
    get scrollMaxX() {
        return this._scrollMaxX;
    }
    set scrollMaxX(value) {
        let v = value;
        if (v < this.scrollMinX)
            v = this.scrollMinX;
        //if(v < this.scrollX) this.scrollX = v
        if (this._scrollMaxX != v) {
            this._scrollMaxX = v;
            this.doChangeScrollArea();
        }
    }
    get scrollMinY() {
        return this._scrollMinY;
    }
    set scrollMinY(value) {
        let v = value;
        if (v > this.scrollMaxY)
            v = this.scrollMaxY;
        //if(v > this.scrollY) this.scrollY = v
        if (this._scrollMinY != v) {
            this._scrollMinY = v;
            this.doChangeScrollArea();
        }
    }
    get scrollMaxY() {
        return this._scrollMaxY;
    }
    set scrollMaxY(value) {
        let v = value;
        if (v < this.scrollMinY)
            v = this.scrollMinY;
        //if(v < this.scrollY) this.scrollY = v
        if (this._scrollMaxY != v) {
            this._scrollMaxY = v;
            this.doChangeScrollArea();
        }
    }
    get scrollX() {
        return this._scrollX;
    }
    set scrollX(value) {
        let v = value;
        if (this.isCirculationX) {
            if (v < this._scrollMinX) {
                v = this._scrollMaxX - (this._scrollMinX - v);
            }
            if (v > this._scrollMaxX) {
                v = this._scrollMinX + (v - this._scrollMaxX);
            }
        }
        else {
            if (v < this._scrollMinX) {
                v = this._scrollMinX;
            }
            if (v > this._scrollMaxX) {
                v = this._scrollMaxX;
            }
        }
        if (this._scrollX != v && !isNaN(v)) {
            this._scrollX = v;
            this.doChangeScrollValue();
        }
    }
    get scrollY() {
        return this._scrollY;
    }
    set scrollY(value) {
        let v = value;
        if (this.isCirculationY) {
            if (v < this._scrollMinY) {
                v = this._scrollMaxY - (this._scrollMinY - v);
            }
            if (v > this._scrollMaxY) {
                v = this._scrollMinY + (v - this._scrollMaxY);
            }
        }
        else {
            if (v < this._scrollMinY) {
                v = this._scrollMinY;
            }
            if (v > this._scrollMaxY) {
                v = this._scrollMaxY;
            }
        }
        if (this._scrollY != v && !isNaN(v)) {
            this._scrollY = v;
            this.doChangeScrollValue();
        }
    }
    get scrollbarResource() {
        return this._scrollbarResource;
    }
    set scrollbarResource(value) {
        if (this._scrollbarResource != value) {
            this._scrollbarResource = value;
            this.doChangeScrollbarResource();
        }
    }
    get scrollbarLength() {
        return this._scrollbarLength;
    }
    set scrollbarLength(value) {
        if (this._scrollbarLength != value) {
            this._scrollbarLength = value;
            this.doChangeScrollbarInfo();
        }
    }
    get useHScrollbar() {
        return this._useHScrollbar;
    }
    set useHScrollbar(value) {
        if (this._useHScrollbar != value) {
            this._useHScrollbar = value;
            this.doChangeScrollbarInfo();
        }
    }
    get useVScrollbar() {
        return this._useVScrollbar;
    }
    set useVScrollbar(value) {
        if (this._useVScrollbar != value) {
            this._useVScrollbar = value;
            this.doChangeScrollbarInfo();
        }
    }
    get hScrollbar() {
        return this._hScrollbar;
    }
    get vScrollbar() {
        return this._vScrollbar;
    }
    get contentViewWidth() {
        return this._background.position.width - this.position.padding.left - this.position.padding.right;
    }
    get contentViewHeight() {
        return this._background.position.height - this.position.padding.top - this.position.padding.bottom;
    }
    constructor(parent, name) {
        super(parent, name);
        this.__ignoreScroll = false;
        this.__scrollChecker = 0;
        this.__useScrollbar = false;
        this.__autoScroll = 0;
        this.__preScrollLeft = 0;
        this.__preScrollTop = 0;
        this._background = new CPanel(this);
        this._scrollbarResource = "";
        this._hScrollbar = new CScrollbar(this);
        this._vScrollbar = new CScrollbar(this);
        this._scrollbarLength = 15;
        this._useHScrollbar = true;
        this._useVScrollbar = true;
        this._scrollMinX = -9000000000000000;
        this._scrollMaxX = 9000000000000000;
        this._scrollMinY = -9000000000000000;
        this._scrollMaxY = 9000000000000000;
        this._scrollX = 0;
        this._scrollY = 0;
        this.scrollStopCheckInterval = 100;
        this.isCirculationX = false;
        this.isCirculationY = false;
        this._scrollAnimatorResource = "";
        let self = this;
        this._background.overflow = "scroll";
        /*this._background.stopPropagation.down = true
        this._background.stopPropagation.move = true
        this._background.stopPropagation.up = true
        this._background.stopPropagation.wheel = true*/
        this.stopPropagation.down = true;
        this.stopPropagation.move = true;
        this.stopPropagation.up = true;
        this.stopPropagation.wheel = true;
        this._content = new CLayout(this._background);
        this._content.position.width = 33554400;
        this._content.position.height = 33554400;
        this.contentToCenter();
        this._vScrollbar.scrollbarKind = EScrollBarKind.V;
        this._hScrollbar.onResource = function () {
            self.doSetInnerSize();
        };
        this._vScrollbar.onResource = function () {
            self.doSetInnerSize();
        };
        this._hScrollbar.onScroll = function (s, vr) {
            self.scrollX = CCalc.crRange2Value(0, 1, vr, self._scrollMinX, self._scrollMaxX);
        };
        this._vScrollbar.onScroll = function (s, vr) {
            self.scrollY = CCalc.crRange2Value(0, 1, vr, self._scrollMinY, self._scrollMaxY);
        };
        this._hScrollbar.onThisPointerDown = function () {
            self.__useScrollbar = true;
        };
        this._hScrollbar.onThisPointerUp = function () {
            self.__useScrollbar = false;
        };
        this._vScrollbar.onThisPointerDown = function () {
            self.__useScrollbar = true;
        };
        this._vScrollbar.onThisPointerUp = function () {
            self.__useScrollbar = false;
        };
        this._background.controlElement.onscroll = function () {
            if (!self.__ignoreScroll)
                self.doScroll();
        };
    }
    contentToCenter() {
        this.__ignoreScroll = true;
        this._content.position.left = 0;
        this._content.position.top = 0;
        this.background.controlElement.scrollLeft = 33554400 / 2;
        this.background.controlElement.scrollTop = 33554400 / 2;
        this.__preScrollLeft = this.background.controlElement.scrollLeft;
        this.__preScrollTop = this.background.controlElement.scrollTop;
        this.__ignoreScroll = false;
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "scrollbarResource", this.scrollbarResource, "");
        CDataClass.putData(data, "scrollbarLength", this.scrollbarLength, 15);
        CDataClass.putData(data, "useHScrollbar", this.useHScrollbar, true);
        CDataClass.putData(data, "useVScrollbar", this.useVScrollbar, true);
        CDataClass.putData(data, "scrollAnimatorResource", this.scrollAnimatorResource, "");
        if (this.scrollAnimationTrigger != undefined)
            CDataClass.putData(data, "scrollAnimationTrigger", this.scrollAnimationTrigger.toData(), {}, true);
    }
    doFromData(data) {
        super.doFromData(data);
        this.scrollbarResource = CDataClass.getData(data, "scrollbarResource", "");
        this.scrollbarLength = CDataClass.getData(data, "scrollbarLength", 15);
        this.useHScrollbar = CDataClass.getData(data, "useHScrollbar", true);
        this.useVScrollbar = CDataClass.getData(data, "useVScrollbar", true);
        CAnimator.fromAnimatorData(data, this, "scrollAnimationTrigger");
        this.scrollAnimatorResource = CDataClass.getData(data, "scrollAnimatorResource", "");
    }
    doRemove() {
        this.content.remove();
        super.doRemove();
    }
    doChangeSize() {
        super.doChangeSize();
        this.doSetInnerSize();
    }
    doSetInnerSize() {
        this.background.position.left = this.position.padding.left;
        this.background.position.top = this.position.padding.top;
        let w = 0;
        let h = 0;
        if (this.useHScrollbar) {
            h = this.position.height - this.position.padding.top - this.position.padding.bottom - this.scrollbarLength;
        }
        else {
            h = this.position.height - this.position.padding.top - this.position.padding.bottom;
        }
        if (this.useVScrollbar) {
            w = this.position.width - this.position.padding.left - this.position.padding.right - this.scrollbarLength;
        }
        else {
            w = this.position.width - this.position.padding.left - this.position.padding.right;
        }
        this.background.position.width = w;
        this.background.position.height = h;
        this._hScrollbar.visible = this.useHScrollbar;
        this._vScrollbar.visible = this.useVScrollbar;
        if (this.useHScrollbar) {
            this._hScrollbar.position.left = this.position.padding.left;
            this._hScrollbar.position.top = this.position.height - this.position.padding.bottom - this._scrollbarLength;
            this._hScrollbar.position.width = w;
            this._hScrollbar.position.height = this._scrollbarLength;
            this._hScrollbar.scrollbarKind = EScrollBarKind.H;
            this._hScrollbar.bringToFront();
        }
        if (this.useVScrollbar) {
            this._vScrollbar.position.left = this.position.width - this._scrollbarLength - this.position.padding.right;
            this._vScrollbar.position.top = this.position.padding.top;
            this._vScrollbar.position.width = this._scrollbarLength;
            this._vScrollbar.position.height = h;
            this._vScrollbar.scrollbarKind = EScrollBarKind.V;
            this._vScrollbar.bringToFront();
        }
        if (this.onSetInnerSize != undefined) {
            this.onSetInnerSize(this);
        }
    }
    doChangeScrollbarResource() {
        this._hScrollbar.resource = this._scrollbarResource;
        this._vScrollbar.resource = this._scrollbarResource;
        if (this.onChangeScrollbarResource != undefined) {
            this.onChangeScrollbarResource(this);
        }
    }
    doChangeScrollbarInfo() {
        this.doSetInnerSize();
        if (this.onChangeScrollbarInfo != undefined) {
            this.onChangeScrollbarInfo(this);
        }
    }
    doChangeScrollArea() {
        this.doSetInnerSize();
    }
    doScroll() {
        if (this.scrollAnimationTrigger != undefined)
            this.scrollAnimationTrigger.start();
        this.__preScrollTime = CTime.now;
        this.scrollX += this.background.controlElement.scrollLeft - this.__preScrollLeft;
        this.scrollY += this.background.controlElement.scrollTop - this.__preScrollTop;
        this.__preScrollLeft = this.background.controlElement.scrollLeft;
        this.__preScrollTop = this.background.controlElement.scrollTop;
        if (this.__scrollChecker == 0) {
            let self = this;
            this.__scrollChecker = setInterval(function () {
                if (self.__preScrollTime != undefined &&
                    CTime.now - self.__preScrollTime > self.scrollStopCheckInterval &&
                    self.__pressedThisPoints.length == 0 &&
                    self.__pressedBubblePoints.length == 0) {
                    clearInterval(self.__scrollChecker);
                    self.__scrollChecker = 0;
                    if (self.background.controlElement.scrollLeft > 30000000 ||
                        self.background.controlElement.scrollLeft < 1000000 ||
                        self.background.controlElement.scrollTop > 30000000 ||
                        self.background.controlElement.scrollTop < 1000000) {
                        self.contentToCenter();
                    }
                    self.doScrollStop();
                }
            }, self.scrollStopCheckInterval);
        }
        if (!this.__useScrollbar) {
            this.hScrollbar.valueRatio = CCalc.crRange2Value(this._scrollMinX, this._scrollMaxX, this.scrollX, 0, 1);
            this.vScrollbar.valueRatio = CCalc.crRange2Value(this._scrollMinY, this._scrollMaxY, this.scrollY, 0, 1);
        }
        if (this.onScroll != undefined) {
            this.onScroll(this);
        }
    }
    doScrollStop() {
        if (this.onScrollStop != undefined) {
            this.onScrollStop(this);
        }
    }
    doChangeScrollValue() {
        if (this.onChangeScrollValue != undefined) {
            this.onChangeScrollValue(this);
        }
    }
    startAutoScroll(direction, scrollValue, interval = 10, scrollfn) {
        let self = this;
        let preValue = 0;
        if (direction == "x") {
            preValue = this.scrollX;
        }
        else {
            preValue = this.scrollY;
        }
        if (this.__autoScroll == 0) {
            this.__autoScroll = setInterval(function () {
                if (direction == "x") {
                    self.scrollX += scrollValue;
                    if (scrollfn != undefined) {
                        scrollfn(self.scrollX - preValue);
                    }
                    preValue = self.scrollX;
                    if (!self.isCirculationX) {
                        if (self.scrollX == self.scrollMaxX || self.scrollX == self.scrollMinX) {
                            self.stopAutoScroll();
                        }
                    }
                }
                if (direction == "y") {
                    self.scrollY += scrollValue;
                    if (scrollfn != undefined) {
                        scrollfn(self.scrollY - preValue);
                    }
                    preValue = self.scrollY;
                    if (!self.isCirculationY) {
                        if (self.scrollY == self.scrollMaxY || self.scrollY == self.scrollMinY) {
                            self.stopAutoScroll();
                        }
                    }
                }
            }, interval);
        }
    }
    stopAutoScroll() {
        clearInterval(this.__autoScroll);
        this.__autoScroll = 0;
    }
    addProperties() {
        let arr = super.addProperties();
        arr.push({ instance: this.scrollAnimationTrigger, propertyName: "scrollAnimationTrigger", readOnly: false, enum: [] });
        return arr;
    }
}
class CCustomListControl extends CPanel {
    get scrollBox() {
        return this._scroll;
    }
    get itemIndex() {
        return this._itemIndex;
    }
    set itemIndex(value) {
        let v = value;
        if (v < -1)
            v = -1;
        if (this._itemIndex != v) {
            this._itemIndex = v;
            this.doChangeItemIndex();
        }
    }
    get rowHeight() {
        return this._rowHeight;
    }
    set rowHeight(value) {
        let v = value;
        if (v < 0)
            v = 0;
        if (this._rowHeight != v) {
            this._rowHeight = v;
            this.doChangeItemInfo();
        }
    }
    get itemMargin() {
        return this._itemMargin;
    }
    set itemMargin(value) {
        if (this._itemMargin != value) {
            this._itemMargin = value;
            this.doChangeItemInfo();
        }
    }
    get multiSelect() {
        return this._multiSelect;
    }
    set multiSelect(value) {
        if (this._multiSelect != value) {
            this._multiSelect = value;
            this.doChangeMultiSelect();
        }
    }
    get scrollbarResource() {
        return this.scrollBox.scrollbarResource;
    }
    set scrollbarResource(value) {
        if (this.scrollBox.scrollbarResource != value) {
            this.scrollBox.scrollbarResource = value;
        }
    }
    get scrollbarLength() {
        return this.scrollBox.scrollbarLength;
    }
    set scrollbarLength(value) {
        this.scrollBox.scrollbarLength = value;
    }
    get length() {
        return this.getLength();
    }
    get scrollTop() {
        return this.scrollBox.scrollTop;
    }
    set scrollTop(value) {
        this.scrollBox.scrollTop = value;
    }
    get scrollHeight() {
        return this.scrollBox.scrollHeight;
    }
    constructor(parent, name) {
        super(parent, name);
        this._scroll = new CScrollBox(this);
        this._itemIndex = -1;
        this._rowHeight = 30;
        this._itemMargin = 0;
        this._multiSelect = false;
        this.useKeyDown = true;
        let self = this;
        this._scroll.position.align = EPositionAlign.CLIENT;
        this._scroll.useHScrollbar = false;
        this._scroll.onScroll = function () {
            self.doScroll();
        };
        this._scroll.onChangeSize = function () {
            self.doChangeScrollBoxSize();
        };
        this._scroll.position.onChangeSize = function () {
            self.doChangeScrollBoxSize();
        };
        this._scroll.onChangeScrollbarInfo = function () {
            self.doSetScrollContent();
        };
        this.scrollBox.background.onThisPointerDown = function (s, e, pts) {
            self.doBackgroundPointerDown(e, pts);
        };
        this.scrollBox.background.onThisPointerMove = function (s, e, pts) {
            self.doBackgroundPointerMove(e, pts);
        };
        this.scrollBox.background.onThisPointerUp = function (s, e, pts) {
            self.doBackgroundPointerUp(e, pts);
        };
        this.scrollBox.background.onThisPointerCancel = function (s, e, pts) {
            self.doBackgroundPointerCancel(e, pts);
        };
        this.scrollBox.background.onThisPointerOver = function (s, e, pts) {
            self.doBackgroundPointerOver(e, pts);
        };
        this.scrollBox.background.onThisPointerOut = function (s, e, pts) {
            self.doBackgroundPointerOut(e, pts);
        };
        this.scrollBox.background.onThisPointerEnter = function (s, e, pts) {
            self.doBackgroundPointerEnter(e, pts);
        };
        this.scrollBox.background.onThisPointerLeave = function (s, e, pts) {
            self.doBackgroundPointerLeave(e, pts);
        };
    }
    getLength() {
        return 0;
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "rowHeight", this.rowHeight, 30);
        CDataClass.putData(data, "itemMargin", this.itemMargin, 0);
        CDataClass.putData(data, "multiSelect", this.multiSelect, false);
        CDataClass.putData(data, "useKeyDown", this.useKeyDown, true);
        CDataClass.putData(data, "scrollbarResource", this.scrollbarResource, "");
        CDataClass.putData(data, "scrollbarLength", this.scrollbarLength, 15);
    }
    doFromData(data) {
        super.doFromData(data);
        this.rowHeight = CDataClass.getData(data, "rowHeight", 30);
        this.itemMargin = CDataClass.getData(data, "itemMargin", 0);
        this.multiSelect = CDataClass.getData(data, "multiSelect", false);
        this.useKeyDown = CDataClass.getData(data, "useKeyDown", true);
        this.scrollbarResource = CDataClass.getData(data, "scrollbarResource", "");
        this.scrollbarLength = CDataClass.getData(data, "scrollbarLength", 15);
    }
    doChangeSize() {
        super.doChangeSize();
        this.doSetScrollContent();
    }
    doChangeItemIndex() {
        if (this.onChangeItemIndex != undefined) {
            this.onChangeItemIndex(this);
        }
    }
    doChangeItemInfo() {
        this.doSetScrollContent();
        if (this.onChangeItemInfo != undefined) {
            this.onChangeItemInfo(this);
        }
    }
    doSetScrollContent() {
        this._scroll.contentWidth = this._scroll.contentViewWidth;
        this._scroll.contentHeight = ((this.rowHeight + this.itemMargin) * this.length) + this.itemMargin;
        if (this.onSetScrollContent != undefined) {
            this.onSetScrollContent(this);
        }
    }
    doScroll() {
        if (this.onScroll != undefined) {
            this.onScroll(this);
        }
    }
    doChangeScrollBoxSize() {
        this.doSetScrollContent();
        if (this.onChangeScrollBoxSize != undefined) {
            this.onChangeScrollBoxSize(this);
        }
    }
    doChangeMultiSelect() {
        if (this.onChangeMultiSelect != undefined) {
            this.onChangeMultiSelect(this);
        }
    }
    doBackgroundPointerDown(e, points) {
        if (this.onBackgroundPointerDown != undefined) {
            this.onBackgroundPointerDown(this, e, points);
        }
    }
    doBackgroundPointerMove(e, points) {
        if (this.onBackgroundPointerMove != undefined) {
            this.onBackgroundPointerMove(this, e, points);
        }
    }
    doBackgroundPointerUp(e, points) {
        if (this.onBackgroundPointerUp != undefined) {
            this.onBackgroundPointerUp(this, e, points);
        }
    }
    doBackgroundPointerCancel(e, points) {
        if (this.onBackgroundPointerCancel != undefined) {
            this.onBackgroundPointerCancel(this, e, points);
        }
    }
    doBackgroundPointerOver(e, points) {
        if (this.onBackgroundPointerOver != undefined) {
            this.onBackgroundPointerOver(this, e, points);
        }
    }
    doBackgroundPointerOut(e, points) {
        if (this.onBackgroundPointerOut != undefined) {
            this.onBackgroundPointerOut(this, e, points);
        }
    }
    doBackgroundPointerEnter(e, points) {
        if (this.onBackgroundPointerEnter != undefined) {
            this.onBackgroundPointerEnter(this, e, points);
        }
    }
    doBackgroundPointerLeave(e, points) {
        if (this.onBackgroundPointerLeave != undefined) {
            this.onBackgroundPointerLeave(this, e, points);
        }
    }
    doKeyDown(e) {
        super.doKeyDown(e);
        if (this.useKeyDown) {
            if (e.key == "ArrowUp") {
                if (this.itemIndex > 0) {
                    this.itemIndex--;
                    if (this.getItemPosition(this.itemIndex).top < this.scrollTop) {
                        this.scrollToIndex(this.itemIndex);
                    }
                }
            }
            if (e.key == "ArrowDown") {
                if (this.itemIndex < this.getLength() - 1) {
                    this.itemIndex++;
                    if (this.getItemPosition(this.itemIndex).top > this.scrollTop + this.scrollBox.contentViewHeight - 1) {
                        this.scrollToIndexBottom(this.itemIndex);
                    }
                }
            }
            if (e.key == "PageUp") {
                this.scrollTop -= this.scrollBox.contentViewHeight;
            }
            if (e.key == "PageDown") {
                this.scrollTop += this.scrollBox.contentViewHeight;
            }
            if (e.key == "End") {
                this.scrollToBottom();
            }
            if (e.key == "Home") {
                this.scrollToTop();
            }
        }
    }
    getItemPosition(index) {
        let t = this.itemMargin + ((this.rowHeight + this.itemMargin) * index);
        return new CRect(this.itemMargin, t, this._scroll.contentViewWidth - this.itemMargin, t + this.rowHeight);
    }
    yToIndex(y) {
        if (this.rowHeight <= 0)
            throw new Error("invalid row height : " + this.rowHeight);
        let h = this.rowHeight + this.itemMargin;
        return { index: Math.floor(y / h), isMargin: y % h <= this.itemMargin };
    }
    getScrollShowPositions() {
        if (this.rowHeight <= 0)
            throw new Error("invalid row height : " + this.rowHeight);
        let rt = new Array();
        let idx = this.yToIndex(this._scroll.scrollTop).index;
        while ((idx * (this.rowHeight + this.itemMargin)) + this.itemMargin < this._scroll.scrollTop + this.scrollBox.position.height && idx < this.length) {
            let rti = { index: idx, position: this.getItemPosition(idx) };
            rt.push(rti);
            idx++;
        }
        return rt;
    }
    scrollToBottom() {
        if (this.getLength() > 0) {
            this.scrollToIndex(this.getLength() - 1);
        }
    }
    scrollToTop() {
        if (this.getLength() > 0) {
            this.scrollToIndex(0);
        }
    }
    scrollToIndex(index) {
        let self = this;
        let st = self.scrollBox.scrollTop;
        let ed = self.getItemPosition(index).top - st;
        CAnimation.animate(100, function (t, v, ct) {
            self.scrollBox.scrollTop = st + (ed * v);
        });
    }
    scrollToIndexBottom(index) {
        let self = this;
        let st = self.scrollBox.scrollTop;
        let ed = (self.getItemPosition(index).top - (self.scrollBox.contentViewHeight - self.rowHeight - self.itemMargin)) - st;
        CAnimation.animate(100, function (t, v, ct) {
            self.scrollBox.scrollTop = st + (ed * v);
        });
    }
    addProperties() {
        let arr = new Array();
        arr.push({ instance: this.scrollBox.scrollbarResource, propertyName: "scrollbarResource", readOnly: false, enum: [] });
        arr.push({ instance: this.scrollBox.scrollTop, propertyName: "scrollTop", readOnly: false, enum: [] });
        arr.push({ instance: this.scrollBox.scrollHeight, propertyName: "scrollHeight", readOnly: false, enum: [] });
        arr.push({ instance: this.scrollBox.scrollbarLength, propertyName: "scrollbarLength", readOnly: false, enum: [] });
        return arr;
    }
}
class CCustomCanvasListBox extends CCustomListControl {
    get checkItems() {
        return this._checkItems;
    }
    get checkBoxArea() {
        return this._checkBoxArea;
    }
    get itemsContext() {
        return this._itemsContext;
    }
    get listItemResource() {
        return this._listItemResource;
    }
    set listItemResource(value) {
        if (this._listItemResource != value) {
            this._listItemResource = value;
            if (value.length > 0) {
                this.doChangeListItemResource();
            }
        }
    }
    get itemsLayer() {
        return this.__itemsLayer;
    }
    get isDraw() {
        return this._isDraw;
    }
    set isDraw(value) {
        this._isDraw = value;
        if (value) {
            this.doItemsDraw();
        }
    }
    get itemIndex() {
        return this._itemIndex;
    }
    set itemIndex(value) {
        let v = value;
        if (v < -1)
            v = -1;
        if (this._itemIndex != v) {
            this._itemIndex = v;
            this.doChangeItemIndex();
        }
    }
    get useCheckBox() {
        return this._useCheckBox;
    }
    set useCheckBox(value) {
        if (this._useCheckBox != value) {
            this._useCheckBox = value;
            if (this.isDraw)
                this.__itemsLayer.draw();
        }
    }
    constructor(parent, name) {
        super(parent, name);
        this.__preItemClick = { time: 0, index: -1 };
        this.__downIdx = -1;
        this.__overIdx = -1;
        this.__offset = new CNotifyPoint(0, 0);
        this.__listItemData = new Array();
        this._listItemResource = new Array();
        this._isDraw = true;
        this._selecteItems = new Set();
        this._checkItems = new Set();
        this._useCheckBox = false;
        this._checkBoxArea = new CRect(0, 0, 20, 20);
        let self = this;
        this.__itemsLayer = this.scrollBox.layers.addLayer();
        CSystem.elementBrintToFront(this.__itemsLayer.canvas);
        let ctx = this.__itemsLayer.canvas.getContext("2d");
        if (ctx != null) {
            this._itemsContext = ctx;
        }
        this.__itemsLayer.onDraw = function () {
            self.doItemsDraw();
        };
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "listItemResource", this.listItemResource, [], true);
        CDataClass.putData(data, "useCheckBox", this.useCheckBox, false);
        CDataClass.putData(data, "checkBoxArea", this.checkBoxArea.toData(), {}, true);
    }
    doFromData(data) {
        super.doFromData(data);
        this.listItemResource = CDataClass.getData(data, "listItemResource", [], true);
        this.useCheckBox = CDataClass.getData(data, "useCheckBox", false);
        this.checkBoxArea.fromData(CDataClass.getData(data, "checkBoxArea", {}, true));
    }
    doBackgroundPointerDown(e, points) {
        let yi = this.yToIndex(this.scrollBox.scrollTop + e.offsetY);
        if (yi.isMargin || yi.index >= this.length) {
            this.__downIdx = -1;
        }
        else {
            this.__downIdx = yi.index;
        }
        super.doBackgroundPointerDown(e, points);
    }
    doBackgroundPointerMove(e, points) {
        let yi = this.yToIndex(this.scrollBox.scrollTop + e.offsetY);
        if (yi.isMargin) {
            this.__overIdx = -1;
        }
        else {
            this.__overIdx = yi.index;
        }
        if (this.isDraw)
            this.__itemsLayer.draw();
        super.doBackgroundPointerMove(e, points);
    }
    doBackgroundPointerUp(e, points) {
        let yi = this.yToIndex(this.scrollBox.scrollTop + e.offsetY);
        let idx = -1;
        if (yi.isMargin || yi.index >= this.length) {
            idx = -1;
        }
        else {
            idx = yi.index;
        }
        if (this.__downIdx == idx) {
            this.itemIndex = idx;
            if (idx != -1) {
                if (this.useCheckBox) {
                    let ps = this.getItemPosition(yi.index);
                    ps.offset(0, -this.scrollBox.scrollTop);
                    let chk = this.doCheckItem(yi.index, e);
                    if (chk.result) {
                        if (this.checkItems.has(chk.value)) {
                            this.checkItems.delete(chk.value);
                        }
                        else {
                            this.checkItems.add(chk.value);
                        }
                    }
                }
                this.doSelectItem(yi.index, e);
                this.doItemClick(idx);
            }
        }
        super.doBackgroundPointerUp(e, points);
    }
    doBackgroundPointerOut(e, points) {
        this.__overIdx = -1;
        if (this.isDraw)
            this.__itemsLayer.draw();
        super.doBackgroundPointerOut(e, points);
    }
    doAddSelectItems(value) {
        this._selecteItems.add(value);
        this.doChangeSelectItems();
    }
    doDeleteSelectItems(value) {
        if (this._selecteItems.has(value)) {
            this._selecteItems.delete(value);
            this.doChangeSelectItems();
        }
    }
    doCheckItem(rowIndex, e) {
        return { result: false, value: undefined };
    }
    doSelectItem(rowIndex, e) { }
    doSelectAll() {
        for (let n = 0; n < this.length; n++) {
            this._selecteItems.add(n);
        }
        this.doChangeSelectItems();
    }
    doChangeSelectItems() {
        if (this.isDraw)
            this.__itemsLayer.draw();
    }
    doItemClick(index) {
        if (this.onItemClick != undefined) {
            this.onItemClick(this, index);
        }
        if (CTime.now - this.__preItemClick.time < this.repeatClickTime && index == this.__preItemClick.index) {
            this.doItemDblClick(index);
        }
        this.__preItemClick = { time: new Date().getTime(), index: index };
    }
    doItemDblClick(index) {
        if (this.onItemDblClick != undefined) {
            this.onItemDblClick(this, index);
        }
    }
    doResource() {
        super.doResource();
        let self = this;
        this.__itemsLayer = this.scrollBox.layers.addLayer();
        CSystem.elementBrintToFront(this.__itemsLayer.canvas);
        let ctx = this.__itemsLayer.canvas.getContext("2d");
        if (ctx != null) {
            this._itemsContext = ctx;
        }
        this.__itemsLayer.onDraw = function () {
            self.doItemsDraw();
        };
    }
    doChangeItemIndex() {
        super.doChangeItemIndex();
        this.__itemsLayer.draw();
    }
    doChangeItemInfo() {
        super.doChangeItemInfo();
        this.__itemsLayer.draw();
    }
    doScroll() {
        super.doScroll();
        this.__itemsLayer.draw();
    }
    doChangeListItemResource() {
        this.__listItemData = [];
        for (let n = 0; n < this._listItemResource.length; n++) {
            let data = CSystem.resources.get(this._listItemResource[n]);
            if (data != undefined) {
                let items = new CCanvasItems();
                items.fromData(data);
                this.__listItemData.push(items);
            }
        }
        if (this.isDraw)
            this.__itemsLayer.draw();
    }
    doItemsDraw() {
        if (this._itemsContext != undefined && this._isDraw) {
            let arr = this.getScrollShowPositions();
            this._itemsContext.clearRect(0, 0, this.__itemsLayer.canvas.width, this.__itemsLayer.canvas.height);
            for (let n = 0; n < arr.length; n++) {
                arr[n].position.offset(0, -this.scrollBox.scrollTop);
                let i = arr[n].index % this.__listItemData.length;
                let drawItems = this.__listItemData[i];
                if (this.onBeforeItemDraw != undefined) {
                    let nw = { resourceOrItems: "" };
                    this.onBeforeItemDraw(this, this._itemsContext, arr[n].index, arr[n].position, drawItems, nw);
                    if (nw.resourceOrItems != "") {
                        if (typeof nw.resourceOrItems == "string") {
                            let dt = CSystem.resources.get(nw.resourceOrItems);
                            let is = new CCanvasItems();
                            is.fromData(dt);
                            drawItems = is;
                        }
                        else {
                            drawItems = nw.resourceOrItems;
                        }
                    }
                }
                this.doItemDraw(this._itemsContext, arr[n].index, arr[n].position, drawItems);
            }
        }
    }
    doItemDraw(ctx, index, position, items) {
        if (this.onItemDraw != undefined) {
            this.onItemDraw(this, ctx, index, position, items);
        }
    }
    doKeyDown(e) {
        if (this.useKeyDown) {
            if (e.key == "ArrowUp") {
                if (this.itemIndex > 0) {
                    this.itemIndex--;
                    if (!e.shiftKey || !this.multiSelect)
                        this._selecteItems.clear();
                    this.doAddSelectItems(this.itemIndex);
                    if (this.getItemPosition(this.itemIndex).top < this.scrollTop) {
                        this.scrollToIndex(this.itemIndex);
                    }
                }
            }
            if (e.key == "ArrowDown") {
                if (this.itemIndex < this.getLength() - 1) {
                    this.itemIndex++;
                    if (!e.shiftKey || !this.multiSelect)
                        this._selecteItems.clear();
                    this.doAddSelectItems(this.itemIndex);
                    if (this.getItemPosition(this.itemIndex).top > this.scrollTop + this.scrollBox.contentViewHeight - 1) {
                        this.scrollToIndexBottom(this.itemIndex);
                    }
                }
            }
            if (e.key == "PageUp") {
                this.scrollTop -= this.scrollBox.contentViewHeight;
            }
            if (e.key == "PageDown") {
                this.scrollTop += this.scrollBox.contentViewHeight;
            }
            if (e.key == "End") {
                this.scrollToBottom();
            }
            if (e.key == "Home") {
                this.scrollToTop();
            }
            if (e.ctrlKey && e.key.toUpperCase() == "A") {
                this.selectAll();
            }
            if (!e.ctrlKey && (e.key == "Enter" || e.key == " ")) {
                if (this.itemIndex != -1)
                    this.doItemClick(this.itemIndex);
            }
        }
        if (this.onKeyDown != undefined) {
            this.onKeyDown(this, e);
        }
    }
    selectAll() {
        this.doSelectAll();
    }
    itemsDraw() {
        if (this.isDraw)
            this.__itemsLayer.draw();
    }
}
class CCustomListBox extends CCustomCanvasListBox {
    get items() {
        return this._items;
    }
    get selectItems() {
        let rt = new Array();
        let self = this;
        this._selecteItems.forEach(function (v) {
            rt.push(self._items.get(v));
        });
        return rt;
    }
    constructor(parent, name) {
        super(parent, name);
        this._items = new CList();
        this.objects = new Array();
        let self = this;
        this.items.onChange = function () {
            self.doSetScrollContent();
            if (self.isDraw)
                self.__itemsLayer.draw();
        };
    }
    getLength() {
        return this._items.length;
    }
    doRemove() {
        this.objects = [];
        super.doRemove();
    }
    doCheckItem(rowIndex, e) {
        if (this.useCheckBox) {
            let ps = this.getItemPosition(rowIndex);
            ps.offset(0, -this.scrollBox.scrollTop);
            if (e.offsetX >= ps.left + this.checkBoxArea.left &&
                e.offsetX <= ps.left + this.checkBoxArea.right &&
                e.offsetY >= ps.top + this.checkBoxArea.top &&
                e.offsetY <= ps.top + this.checkBoxArea.top + this.checkBoxArea.height) {
                return { result: true, value: rowIndex };
            }
        }
        return { result: false, value: undefined };
    }
    doSelectItem(rowIndex, e) {
        if (this.multiSelect) {
            if (e.ctrlKey) {
                if (this._selecteItems.has(rowIndex)) {
                    this.doDeleteSelectItems(rowIndex);
                }
                else {
                    this.doAddSelectItems(rowIndex);
                }
            }
            else {
                this._selecteItems.clear();
                this.doAddSelectItems(rowIndex);
            }
        }
        else {
            this._selecteItems.clear();
            this.doAddSelectItems(rowIndex);
        }
    }
    doItemDraw(ctx, index, position, items) {
        if (CSystem.bufferingContext != undefined) {
            let arr = items.getItem("over");
            for (let n = 0; n < arr.length; n++) {
                arr[n].visible = index == this.__overIdx;
            }
            arr = items.getItem("select");
            for (let n = 0; n < arr.length; n++) {
                arr[n].visible = this._selecteItems.has(index);
            }
            arr = items.getItem("itemindex");
            for (let n = 0; n < arr.length; n++) {
                arr[n].visible = index == this.itemIndex;
            }
            arr = items.getItem("checkBox");
            for (let n = 0; n < arr.length; n++) {
                arr[n].visible = this.useCheckBox;
            }
            arr = items.getItem("check");
            for (let n = 0; n < arr.length; n++) {
                arr[n].visible = this.checkItems.has(index) && this.useCheckBox;
            }
            items.draw(ctx, position, this.__offset, CSystem.bufferingContext, 1, 1);
            super.doItemDraw(ctx, index, position, items);
        }
    }
    checkAll() {
        if (this.useCheckBox) {
            for (let n = 0; n < this.length; n++) {
                this.checkItems.add(n);
            }
            if (this.isDraw)
                this.__itemsLayer.draw();
        }
    }
}
class CListBox extends CCustomListBox {
    doItemDraw(ctx, index, position, items) {
        let txt = items.getItem("text");
        for (let n = 0; n < txt.length; n++) {
            txt[n].text = this._items.get(index);
        }
        super.doItemDraw(ctx, index, position, items);
    }
    doKeyDown(e) {
        if (this.useKeyDown) {
            if (e.ctrlKey && e.key.toUpperCase() == "C") {
                let rt = "";
                for (let n = 0; n < this.items.length; n++) {
                    if (n != 0)
                        rt += "\n";
                    rt += this.items.get(n);
                }
                CSystem.setClipborad(rt);
            }
        }
        super.doKeyDown(e);
    }
}
class CObjectListBox extends CCustomListBox {
    doItemDraw(ctx, index, position, items) {
        let o = this._items.get(index);
        let keys = Object.keys(o);
        for (let x = 0; x < keys.length; x++) {
            let txt = items.getItem(keys[x]);
            for (let n = 0; n < txt.length; n++) {
                if (typeof o[keys[x]] == "string") {
                    txt[n].text = o[keys[x]];
                }
                else {
                    txt[n].text = o[keys[x]] + "";
                }
            }
        }
        super.doItemDraw(ctx, index, position, items);
    }
}
class CCustomTreeListBox extends CCustomCanvasListBox {
    get items() {
        return this._items;
    }
    get selectItems() {
        let rt = new Array();
        this._selecteItems.forEach(function (v) {
            rt.push(v);
        });
        return rt;
    }
    get stateArea() {
        return this._stateArea;
    }
    get levelLength() {
        return this._levelLength;
    }
    set levelLength(value) {
        this._levelLength = value;
        if (value) {
            this.itemsDraw();
        }
    }
    constructor(parent, name) {
        super(parent, name);
        this.__items = new Array();
        this._items = new CTreeData();
        this._stateArea = new CRect(0, 0, 20, 20);
        this._levelLength = 20;
        let self = this;
        this._items.onChange = function () {
            self.__items = self.items.getExpandedItems();
            self.doSetScrollContent();
            self.itemsDraw();
        };
    }
    getLength() {
        return this.__items.length;
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "stateArea", this.stateArea.toData(), {}, true);
        CDataClass.putData(data, "levelLength", this.levelLength, 20);
    }
    doFromData(data) {
        super.doFromData(data);
        this.stateArea.fromData(CDataClass.getData(data, "stateArea", {}, true));
        this.levelLength = CDataClass.getData(data, "levelLength", 20);
    }
    doBackgroundPointerUp(e, points) {
        let yi = this.yToIndex(this.scrollBox.scrollTop + e.offsetY);
        let idx = -1;
        if (yi.isMargin || yi.index >= this.length) {
            idx = -1;
        }
        else {
            idx = yi.index;
        }
        if (this.__downIdx == idx) {
            this.itemIndex = idx;
            if (idx != -1) {
                this.doStateItem(yi.index, e);
                if (this.useCheckBox) {
                    let ps = this.getItemPosition(yi.index);
                    ps.offset(0, -this.scrollBox.scrollTop);
                    let chk = this.doCheckItem(yi.index, e);
                    if (chk.result) {
                        if (this.checkItems.has(chk.value)) {
                            this.checkItems.delete(chk.value);
                        }
                        else {
                            this.checkItems.add(chk.value);
                        }
                    }
                }
                this.doSelectItem(yi.index, e);
                this.doItemClick(idx);
            }
        }
        if (this.onBackgroundPointerUp != undefined) {
            this.onBackgroundPointerUp(this, e, points);
        }
    }
    doStateItem(rowIndex, e) {
        let ps = this.getItemPosition(rowIndex);
        ps.offset(this.__items[rowIndex].level * this._levelLength, -this.scrollBox.scrollTop);
        if (e.offsetX >= ps.left + this.stateArea.left &&
            e.offsetX <= ps.left + this.stateArea.right &&
            e.offsetY >= ps.top + this.stateArea.top &&
            e.offsetY <= ps.top + this.stateArea.bottom) {
            if (this.__items[rowIndex].item.state == ETreeItemState.COLLAPSE) {
                this.__items[rowIndex].item.state = ETreeItemState.EXPAND;
            }
            else {
                this.__items[rowIndex].item.state = ETreeItemState.COLLAPSE;
            }
        }
    }
    doCheckItem(rowIndex, e) {
        let ps = this.getItemPosition(rowIndex);
        ps.offset(this.__items[rowIndex].level * this._levelLength, -this.scrollBox.scrollTop);
        if (this.useCheckBox) {
            if (e.offsetX >= ps.left + this.checkBoxArea.left &&
                e.offsetX <= ps.left + this.checkBoxArea.right &&
                e.offsetY >= ps.top + this.checkBoxArea.top &&
                e.offsetY <= ps.top + this.checkBoxArea.top + this.checkBoxArea.height) {
                if (this.onCheckItem != undefined) {
                    this.onCheckItem(this, this.__items[rowIndex].item);
                }
                return { result: true, value: this.__items[rowIndex].item };
            }
        }
        return { result: false, value: undefined };
    }
    doSelectItem(rowIndex, e) {
        if (this.multiSelect) {
            if (e.ctrlKey) {
                if (this._selecteItems.has(this.__items[rowIndex].item)) {
                    this.doDeleteSelectItems(this.__items[rowIndex].item);
                }
                else {
                    this.doAddSelectItems(this.__items[rowIndex].item);
                }
            }
            else {
                this._selecteItems.clear();
                this.doAddSelectItems(this.__items[rowIndex].item);
            }
        }
        else {
            this._selecteItems.clear();
            this.doAddSelectItems(this.__items[rowIndex].item);
        }
        if (this.onSelectItem != undefined) {
            this.onSelectItem(this);
        }
    }
    doItemDraw(ctx, index, position, items) {
        if (CSystem.bufferingContext != undefined) {
            let arr = items.getItem("over");
            for (let n = 0; n < arr.length; n++) {
                arr[n].visible = index == this.__overIdx;
            }
            arr = items.getItem("select");
            for (let n = 0; n < arr.length; n++) {
                arr[n].visible = this._selecteItems.has(this.__items[index].item);
            }
            arr = items.getItem("itemindex");
            for (let n = 0; n < arr.length; n++) {
                arr[n].visible = index == this.itemIndex;
            }
            arr = items.getItem("checkBox");
            for (let n = 0; n < arr.length; n++) {
                arr[n].visible = this.useCheckBox;
            }
            arr = items.getItem("empty");
            for (let n = 0; n < arr.length; n++) {
                arr[n].visible = this.__items[index].item.getState() == "empty";
            }
            arr = items.getItem("collapse");
            for (let n = 0; n < arr.length; n++) {
                arr[n].visible = this.__items[index].item.getState() != "empty" && this.__items[index].item.state == ETreeItemState.COLLAPSE;
            }
            arr = items.getItem("expand");
            for (let n = 0; n < arr.length; n++) {
                arr[n].visible = this.__items[index].item.getState() != "empty" && this.__items[index].item.state == ETreeItemState.EXPAND;
            }
            arr = items.getItem("check");
            for (let n = 0; n < arr.length; n++) {
                arr[n].visible = this.checkItems.has(this.__items[index].item) && this.useCheckBox;
            }
            position.left += this.__items[index].level * this._levelLength;
            items.draw(ctx, position, this.__offset, CSystem.bufferingContext, 1, 1);
            super.doItemDraw(ctx, index, position, items);
        }
    }
    selectItem(item) {
        if (this.multiSelect) {
            this.doAddSelectItems(item);
        }
        else {
            this._selecteItems.clear();
            this.doAddSelectItems(item);
        }
        if (this.onSelectItem != undefined) {
            this.onSelectItem(this);
        }
    }
    clear() {
        this.itemIndex = -1;
        this._selecteItems.clear();
        this.checkItems.clear();
        this.items.clear();
    }
}
class CTreeListBox extends CCustomTreeListBox {
    doItemDraw(ctx, index, position, items) {
        let txt = items.getItem("text");
        for (let n = 0; n < txt.length; n++) {
            txt[n].text = this.__items[index].item.value.asString;
        }
        super.doItemDraw(ctx, index, position, items);
    }
}
class CObjectTreeListBox extends CCustomTreeListBox {
    doItemDraw(ctx, index, position, items) {
        let o = this.__items[index].item.value.asObject;
        let keys = Object.keys(o);
        for (let x = 0; x < keys.length; x++) {
            let txt = items.getItem(keys[x]);
            for (let n = 0; n < txt.length; n++) {
                if (typeof o[keys[x]] == "string") {
                    txt[n].text = o[keys[x]];
                }
                else {
                    txt[n].text = o[keys[x]] + "";
                }
            }
        }
        super.doItemDraw(ctx, index, position, items);
    }
}
class CListViewItem extends CButton {
    get index() {
        let idx = this.listView.yToIndex(this.position.top).index;
        if (idx < 0)
            idx = 0;
        if (idx > this.listView.listItems.length - 1)
            idx = this.listView.listItems.length - 1;
        return idx;
    }
    constructor(parent, name) {
        super(parent, name);
        this.orderControl = new CPanel(this);
        let self = this;
        self.orderControl.visible = false;
        self.orderControl.position.align = EPositionAlign.PARENT_SIZE;
        self.orderControl.usePointerCapture = true;
        self.orderControl.onResource = function () {
            self.orderControl.visible = false;
            self.orderControl.position.align = EPositionAlign.PARENT_SIZE;
            self.orderControl.usePointerCapture = true;
        };
        let ee;
        let y = this.position.top;
        let idx = -1;
        this.orderControl.onThisPointerDown = function (sender, e) {
            ee = e;
            y = self.position.top;
            self.bringToFront();
            idx = self.index;
            self.opacity = 0.5;
        };
        this.orderControl.onThisPointerMove = function (sender, e) {
            if (ee != undefined) {
                let top = y + (e.pageY - ee.pageY);
                /*if(
                    //top > (self.listView.scrollBox as CScrollBox).scrollTop + self.listView.position.height - 30 &&
                    //top <= (self.listView.scrollBox as CScrollBox).scrollTop + self.listView.position.height
                    top > (self.listView.scrollBox as CScrollBox).scrollTop + self.listView.position.height
                ) {
                    if(!(self.listView.scrollBox as CScrollBox).isAutoScroll) {
                        (self.listView.scrollBox as CScrollBox).startAutoScroll("y", 0.1, 10, function(v) {
                            y += v
                        })
                    }
                } else {
                    if((self.listView.scrollBox as CScrollBox).isAutoScroll) (self.listView.scrollBox as CScrollBox).stopAutoScroll()
                }*/
                //if((self.listView.scrollBox as CScrollBox).isAutoScroll) {
                //top += (self.listView.scrollBox as CScrollBox).scrollTop
                //}
                self.position.top = top;
                if (idx != self.index) {
                    let arr = self.listView.getItemFromIndex(self.index);
                    let item;
                    for (let n = 0; n < arr.length; n++) {
                        if (arr[n] != self) {
                            item = arr[n];
                        }
                    }
                    if (item != undefined) {
                        //self.listView.setItemPosition(idx, item)
                        let rt = self.listView.getItemPosition(idx);
                        let top = item.position.top;
                        let topdiff = rt.top - top;
                        CAnimation.graphAnimate(100, ["acc_head_10000.graph"], function (t, v, ct, gn, gv) {
                            item.position.top = top + (topdiff * gv);
                        });
                    }
                    idx = self.index;
                }
            }
        };
        this.orderControl.onThisPointerUp = function (sender, e) {
            ee = undefined;
            //self.listView.setItemPosition(self.index, self)
            let rt = self.listView.getItemPosition(self.index);
            let top = self.position.top;
            let topdiff = rt.top - top;
            CAnimation.graphAnimate(100, ["acc_head_10000.graph"], function (t, v, ct, gn, gv) {
                self.position.top = top + (topdiff * gv);
            });
            self.listView.resetOrder(self);
            self.opacity = 1;
        };
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "orderControl", this.orderControl.toData(), {}, true);
    }
    doFromData(data) {
        super.doFromData(data);
        this.orderControl.fromData(CDataClass.getData(data, "orderControl", {}, true));
    }
}
class CCustomListView extends CCustomListControl {
    get selectedItems() {
        let arr = new Array();
        this._selectItems.forEach(function (v) {
            arr.push(v);
        });
        return arr;
    }
    get selectedItem() {
        let arr = this.selectedItems;
        if (arr.length > 0) {
            return arr[0];
        }
    }
    get listItems() {
        return this._listItems;
    }
    constructor(parent, name) {
        super(parent, name);
        this._listItems = new CList();
        this._selectItems = new Set();
        this.listItemResource = "";
        let self = this;
        this.scrollBox.content.onChangeSize = function () {
            for (let n = 0; n < self.listItems.length; n++) {
                self.setItemPosition(n, self.listItems.get(n));
            }
        };
    }
    getLength() {
        return this._listItems.length;
    }
    setAllItemPosition() {
        for (let n = 0; n < this.listItems.length; n++) {
            this.setItemPosition(n, this.listItems.get(n));
        }
    }
    doSetListItem(listItem) {
        if (this.onSetListItem != undefined) {
            this.onSetListItem(this, listItem);
        }
    }
    doItemClick(listItem) {
        if (this.multiSelect) {
            listItem.selected = !listItem.selected;
        }
        else {
            listItem.selected = true;
        }
        this.doChangeItemSelect(listItem);
        if (this.onListItemClick != undefined) {
            this.onListItemClick(this, listItem);
        }
    }
    doAddItem() {
        let rt = CControl.controlFromResource(this.listItemResource);
        rt.listView = this;
        this._listItems.add(rt);
        this.doSetScrollContent();
        this.setItemPosition(this._listItems.length - 1, rt);
        rt.parent = this.scrollBox.content;
        let self = this;
        /*rt.onChangeSelected = function() {
            self.doChangeItemSelect(rt)
        }*/
        rt.onClick = function () {
            self.doItemClick(rt);
        };
        return rt;
    }
    doInsertItem(index) {
        let rt = CControl.controlFromResource(this.listItemResource);
        this.doSetScrollContent();
        for (let n = index; n < this._listItems.length; n++) {
            this.setItemPosition(n + 1, this._listItems.get(n));
        }
        rt.listView = this;
        this._listItems.insert(index, rt);
        this.setItemPosition(index, rt);
        rt.parent = this.scrollBox.content;
        let self = this;
        /*rt.onChangeSelected = function() {
            self.doChangeItemSelect(rt)
        }*/
        rt.onClick = function () {
            self.doItemClick(rt);
        };
        return rt;
    }
    doDeleteItem(index) {
        if (index < 0 || index >= this.length)
            return;
        this._selectItems.delete(this._listItems.get(index));
        this._listItems.get(index).remove();
        this._listItems.delete(index);
        for (let n = index; n < this._listItems.length; n++) {
            this.setItemPosition(n, this._listItems.get(n));
        }
        this.doSetScrollContent();
    }
    doClear() {
        for (let n = 0; n < this._listItems.length; n++) {
            this._listItems.get(n).remove();
        }
        this._listItems.clear();
        this._selectItems.clear();
        this.doSetScrollContent();
    }
    doChangeMultiSelect() {
        super.doChangeMultiSelect();
    }
    doChangeItemSelect(item) {
        if (item.selected) {
            if (!this.multiSelect) {
                this._selectItems.forEach(function (v) {
                    if (v != item) {
                        v.selected = false;
                    }
                });
                this._selectItems.clear();
            }
            this._selectItems.add(item);
        }
        else {
            if (!this.multiSelect) {
                this._selectItems.forEach(function (v) {
                    if (v != item) {
                        v.selected = false;
                    }
                });
                this._selectItems.clear();
            }
            else {
                this._selectItems.delete(item);
            }
        }
        if (this.onChangeItemSelect != undefined) {
            this.onChangeItemSelect(this, item);
        }
    }
    doResetOrder(moveItem) {
        this.listItems.sort(function (a, b) {
            let rt = 0;
            if (a.index < b.index) {
                rt = -1;
            }
            if (a.index > b.index) {
                rt = 1;
            }
            return rt;
        });
        if (this.onResetOrder != undefined) {
            this.onResetOrder(this, moveItem);
        }
    }
    setItemPosition(positionIndex, item) {
        let pos = this.getItemPosition(positionIndex);
        item.position.left = pos.left;
        item.position.top = pos.top;
        item.position.width = pos.width;
        item.position.height = pos.height;
    }
    addItem() {
        return this.doAddItem();
    }
    insertItem(index) {
        return this.doInsertItem(index);
    }
    deleteItem(index) {
        this.doDeleteItem(index);
    }
    clear() {
        this.doClear();
    }
    getShowItems() {
        let rt = new Array();
        let arr = this.getScrollShowPositions();
        for (let n = 0; n < arr.length; n++) {
            rt.push(this.listItems.get(arr[n].index));
        }
        return rt;
    }
    getItemFromIndex(index) {
        let rt = new Array();
        for (let n = 0; n < this.listItems.length; n++) {
            if (this.listItems.get(n).index == index) {
                rt.push(this.listItems.get(n));
            }
        }
        return rt;
    }
    resetOrder(moveItem) {
        this.doResetOrder(moveItem);
    }
    showOrderControl() {
        for (let n = 0; n < this.listItems.length; n++) {
            this.listItems.get(n).orderControl.bringToFront();
            this.listItems.get(n).orderControl.visible = true;
        }
    }
    hideOrderControl() {
        for (let n = 0; n < this.listItems.length; n++) {
            this.listItems.get(n).orderControl.visible = false;
        }
    }
}
class CListView extends CCustomListView {
    constructor(parent, name) {
        super(parent, name);
        let self = this;
    }
}
class CCustomPickupButton extends CButton {
    get pickupClientControl() {
        return this._pickupClientControl;
    }
    set pickupClientControl(value) {
        this._pickupClientControl = value;
    }
    doBeforePickupShow(pickup) {
        super.doBeforePickupShow(pickup);
        if (this._pickupClientControl != undefined) {
            this._pickupClientControl.parent = pickup;
            this._pickupClientControl.position.align = EPositionAlign.CLIENT;
        }
    }
    doBeforePickupRemove(pickup) {
        if (this._pickupClientControl != undefined)
            this._pickupClientControl.parent = undefined;
        super.doBeforePickupRemove(pickup);
    }
}
class CComboBox extends CButton {
    get itemIndex() {
        return this._itemIndex;
    }
    set itemIndex(value) {
        let v = value;
        if (v < -1)
            v = -1;
        if (v > this._list.length - 1)
            v = this._list.length - 1;
        if (this._itemIndex != v) {
            this._itemIndex = v;
            this.doChangeItem();
        }
    }
    get comboText() {
        return this.items.get(this.itemIndex);
    }
    get selectText() {
        return this._selectText;
    }
    set selectText(value) {
        this._selectText = value;
        if (this.itemIndex == -1) {
            this.text = value;
        }
    }
    get listBox() {
        return this._list;
    }
    get listBoxResource() {
        return this._listBoxResource;
    }
    set listBoxResource(value) {
        this._listBoxResource = value;
        this._list.resource = value;
    }
    get listItemResource() {
        return this._listItemResource;
    }
    set listItemResource(value) {
        this._listItemResource = value;
        this._list.listItemResource = value;
    }
    get listScrollbarResource() {
        return this._listScrollbarResource;
    }
    set listScrollbarResource(value) {
        this._listScrollbarResource = value;
        this._list.scrollbarResource = value;
    }
    get items() {
        return this._list.items;
    }
    constructor(parent, name) {
        super(parent, name);
        this._itemIndex = -1;
        this._list = new CListBox();
        this._selectText = "";
        this._listBoxResource = "";
        this._listItemResource = [];
        this._listScrollbarResource = "";
        let self = this;
        this.listBox.onItemClick = function () {
            self.doPointerOut(new PointerEvent(""));
            self.itemIndex = self.listBox.itemIndex;
            self.listBox.parent.hide();
        };
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "selectText", this.selectText, "");
        CDataClass.putData(data, "listBoxResource", this.listBoxResource, "");
        CDataClass.putData(data, "listItemResource", this.listItemResource, [], true);
        CDataClass.putData(data, "listScrollbarResource", this.listScrollbarResource, "");
        CDataClass.putData(data, "listBox", this.listBox.toData(), {}, true);
    }
    doFromData(data) {
        super.doFromData(data);
        this.selectText = CDataClass.getData(data, "selectText", "");
        this.listBoxResource = CDataClass.getData(data, "listBoxResource", "");
        this.listItemResource = CDataClass.getData(data, "listItemResource", [], true);
        this.listScrollbarResource = CDataClass.getData(data, "listScrollbarResource", "");
        this.listBox.fromData(CDataClass.getData(data, "listBox", {}, true));
    }
    doBeforePickupShow(pickup) {
        super.doBeforePickupShow(pickup);
        this._list.parent = pickup;
        this._list.hasFocus = true;
        this._list.position.align = EPositionAlign.CLIENT;
        this._list.scrollTop = 0;
        this._list.scrollBox.doScroll();
        let h = pickup.position.padding.top + pickup.position.padding.bottom +
            this._list.position.margins.top + this._list.position.margins.bottom +
            (this._list.rowHeight * this.items.length) + (this._list.itemMargin * (this.items.length - 1));
        if (pickup.position.height > h) {
            pickup.position.height = h;
        }
    }
    doBeforePickupRemove(pickup) {
        this._list.parent = undefined;
        super.doBeforePickupRemove(pickup);
    }
    doChangeItem() {
        if (this.itemIndex == -1) {
            this.text = this.selectText;
        }
        else {
            this.text = this._list.items.get(this._itemIndex);
        }
        if (this.onChangeItem != undefined) {
            this.onChangeItem(this);
        }
    }
    addProperties() {
        let rt = super.addProperties();
        rt.push({ instance: this.items, propertyName: "items", readOnly: false, enum: [] });
        return rt;
    }
}
class CLanguageComboBox extends CComboBox {
    get languageCodes() {
        let arr = new Array();
        for (let n = 0; n < this.__languageCodes.length; n++) {
            arr.push(this.__languageCodes[n]);
        }
        return arr;
    }
    get languageLocalNames() {
        let arr = new Array();
        for (let n = 0; n < this.__languageLocalNames.length; n++) {
            arr.push(this.__languageLocalNames[n]);
        }
        return arr;
    }
    get languageNames() {
        return this._languageNames;
    }
    get languageCode() {
        if (this.itemIndex == -1) {
            return undefined;
        }
        else {
            return this.__languageCodes[this.itemIndex];
        }
    }
    set languageCode(value) {
        let idx = -1;
        for (let n = 0; n < this.__languageCodes.length; n++) {
            if (this.__languageCodes[n] == value) {
                idx = n;
                break;
            }
        }
        this.itemIndex = idx;
    }
    constructor(parent, name) {
        super(parent, name);
        this.__languageCodes = [];
        this.__languageLocalNames = [];
        this._languageNames = new CList();
        let self = this;
        this._languageNames.onChange = function () {
            self.doChangeLanguageNames();
        };
    }
    doChangeLanguageNames() {
        this.__languageCodes = [];
        this.__languageLocalNames = [];
        for (let n = 0; n < this._languageNames.length; n++) {
            let l = CLanguage.getLanguageFromCountry(this._languageNames.get(n));
            if (l != undefined) {
                this.__languageCodes.push(l.code);
                this.__languageLocalNames.push(l.localName);
            }
        }
        this.items.clear();
        for (let n = 0; n < this.__languageLocalNames.length; n++) {
            this.items.add(this.__languageLocalNames[n]);
        }
        this.languageCode = CLanguage.localCode;
    }
}
class CSplitter extends CPanel {
    constructor(parent, name) {
        super(parent, name);
        this.__downValue = 0;
        this.usePointerCapture = true;
    }
    doThisPointerDown(e, points) {
        super.doThisPointerDown(e, points);
        if (this.pressedThisPoints.length == 1) {
            this.__down = e;
            this.__hcon = this.getHandlingControl();
            if (this.__hcon != undefined) {
                if (this.position.align == EPositionAlign.LEFT || this.position.align == EPositionAlign.RIGHT) {
                    this.__downValue = this.__hcon.position.width;
                }
                if (this.position.align == EPositionAlign.TOP || this.position.align == EPositionAlign.BOTTOM) {
                    this.__downValue = this.__hcon.position.height;
                }
            }
        }
    }
    doThisPointerMove(e, points) {
        super.doThisPointerMove(e, points);
        if (this.isPress && this.__down != undefined && this.__hcon && this.pressedThisPoints.length > 0) {
            if (this.position.align == EPositionAlign.LEFT) {
                this.__hcon.position.width = this.__downValue + (e.pageX - this.__down.pageX);
            }
            if (this.position.align == EPositionAlign.RIGHT) {
                this.__hcon.position.width = this.__downValue - (e.pageX - this.__down.pageX);
            }
            if (this.position.align == EPositionAlign.TOP) {
                this.__hcon.position.height = this.__downValue + (e.pageY - this.__down.pageY);
            }
            if (this.position.align == EPositionAlign.BOTTOM) {
                this.__hcon.position.height = this.__downValue - (e.pageY - this.__down.pageY);
            }
        }
    }
    getHandlingControl() {
        let rt;
        let arr = CSystem.getBroControls(this);
        let thisidx = -1;
        for (let n = arr.length - 1; n >= 0; n--) {
            if (this == arr[n]) {
                thisidx = n;
                continue;
            }
            if (thisidx != -1) {
                if (this.position.align == arr[n].position.align &&
                    arr[n].visible) {
                    rt = arr[n];
                    break;
                }
            }
        }
        return rt;
    }
}
class CCustomUnlimitedScrollBoxControl extends CPanel {
    get scrollMinX() {
        return this.scrollBox.scrollMinX;
    }
    set scrollMinX(value) {
        this.scrollBox.scrollMinX = value;
    }
    get scrollMaxX() {
        return this.scrollBox.scrollMaxX;
    }
    set scrollMaxX(value) {
        this.scrollBox.scrollMaxX = value;
    }
    get scrollMinY() {
        return this.scrollBox.scrollMinY;
    }
    set scrollMinY(value) {
        this.scrollBox.scrollMinY = value;
    }
    get scrollMaxY() {
        return this.scrollBox.scrollMaxY;
    }
    set scrollMaxY(value) {
        this.scrollBox.scrollMaxY = value;
    }
    get scrollX() {
        return this.scrollBox.scrollX;
    }
    set scrollX(value) {
        this.scrollBox.scrollX = value;
    }
    get scrollY() {
        return this.scrollBox.scrollY;
    }
    set scrollY(value) {
        this.scrollBox.scrollY = value;
    }
    get backgroundArea() {
        return new CRect(this.scrollBox.background.position.left, this.scrollBox.background.position.top, this.scrollBox.background.position.right, this.scrollBox.background.position.bottom);
    }
    constructor(parent, name) {
        super(parent, name);
        this.scrollBox = new CUnlimitedScrollBox(this);
        let self = this;
        this.scrollBox.position.align = EPositionAlign.CLIENT;
        this.scrollBox.onSetInnerSize = function () {
            self.doSetInnerSize();
        };
        this.scrollBox.onChangeScrollValue = function () {
            self.doScrollBoxUpdate();
            self.doScroll(self.scrollBox.scrollX, self.scrollBox.scrollY);
        };
        this.scrollBox.background.onThisPointerDown = function (s, e, pts) {
            self.doBackgoundPointerDown(e, pts);
        };
        this.scrollBox.background.onThisPointerMove = function (s, e, pts) {
            self.doBackgoundPointerMove(e, pts);
        };
        this.scrollBox.background.onThisPointerUp = function (s, e, pts) {
            self.doBackgoundPointerUp(e, pts);
        };
        this.scrollBox.background.onThisPointerCancel = function (s, e, pts) {
            self.doBackgoundPointerCancel(e, pts);
        };
        this.scrollBox.background.onThisPointerOver = function (s, e, pts) {
            self.doBackgoundPointerOver(e, pts);
        };
        this.scrollBox.background.onThisPointerOut = function (s, e, pts) {
            self.doBackgoundPointerOut(e, pts);
        };
        this.scrollBox.background.onThisPointerEnter = function (s, e, pts) {
            self.doBackgoundPointerEnter(e, pts);
        };
        this.scrollBox.background.onThisPointerLeave = function (s, e, pts) {
            self.doBackgoundPointerLeave(e, pts);
        };
    }
    doSetInnerSize() {
        this.doScrollBoxUpdate();
        if (this.onSetInnerSize != undefined) {
            this.onSetInnerSize(this);
        }
    }
    doScrollBoxUpdate() {
        if (this.onScrollBoxUpdate != undefined) {
            this.onScrollBoxUpdate(this);
        }
    }
    doBackgoundPointerDown(e, points) {
        if (this.onBackgoundPointerDown != undefined) {
            this.onBackgoundPointerDown(this, e, points);
        }
    }
    doBackgoundPointerMove(e, points) {
        if (this.onBackgoundPointerMove != undefined) {
            this.onBackgoundPointerMove(this, e, points);
        }
    }
    doBackgoundPointerUp(e, points) {
        if (this.onBackgoundPointerUp != undefined) {
            this.onBackgoundPointerUp(this, e, points);
        }
    }
    doBackgoundPointerCancel(e, points) {
        if (this.onBackgoundPointerCancel != undefined) {
            this.onBackgoundPointerCancel(this, e, points);
        }
    }
    doBackgoundPointerOver(e, points) {
        if (this.onBackgoundPointerOver != undefined) {
            this.onBackgoundPointerOver(this, e, points);
        }
    }
    doBackgoundPointerOut(e, points) {
        if (this.onBackgoundPointerOut != undefined) {
            this.onBackgoundPointerOut(this, e, points);
        }
    }
    doBackgoundPointerEnter(e, points) {
        if (this.onBackgoundPointerEnter != undefined) {
            this.onBackgoundPointerEnter(this, e, points);
        }
    }
    doBackgoundPointerLeave(e, points) {
        if (this.onBackgoundPointerLeave != undefined) {
            this.onBackgoundPointerLeave(this, e, points);
        }
    }
    doScroll(x, y) {
        if (this.onScroll != undefined) {
            this.onScroll(this, x, y);
        }
    }
}
class CCellSelectInfo extends CNotifyChangeKindObject {
    constructor() {
        super(...arguments);
        this._startCell = new CNotifyPoint(0, 0);
        this._stopCell = new CNotifyPoint(0, 0);
    }
    get startCell() {
        return this._startCell;
    }
    get stopCell() {
        return this._stopCell;
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "startCell", this.startCell.toData(), {}, true);
        CDataClass.putData(data, "stopCell", this.stopCell.toData(), {}, true);
    }
    doFromData(data) {
        super.doFromData(data);
        this.startCell.fromData(CDataClass.getData(data, "startCell", {}, true));
        this.stopCell.fromData(CDataClass.getData(data, "stopCell", {}, true));
    }
    isIn(point) {
        let pt = CCalc.minMaxPoint(this._startCell.toPoint(), this._stopCell.toPoint());
        return point.x >= pt.min.x && point.x <= pt.max.x && point.y >= pt.min.y && point.y <= pt.max.y;
    }
}
class CCellSelectInfoList extends CList {
    doToData(data) {
        super.doToData(data);
        for (let n = 0; n < this.length; n++) {
            data.push(this.get(n).toData());
        }
    }
    doFromData(data) {
        super.doFromData(data);
        this.clear();
        for (let n = 0; n < data.length; n++) {
            let item = new CCellSelectInfo();
            item.fromData(data[n]);
            this.add(item);
        }
    }
    addSelectInfo(startX, startY, stopX, stopY) {
        let csi = new CCellSelectInfo();
        csi.startCell.x = startX;
        csi.startCell.y = startY;
        csi.stopCell.x = stopX;
        csi.stopCell.y = stopY;
        this.add(csi);
        return csi;
    }
}
class CGridInfo extends CNotifyChangeKindObject {
    static get CON_CHANGE_USE_HEADER() { return "useHeader"; }
    static get CON_CHANGE_HEADER_COUNT() { return "headerCount"; }
    static get CON_CHANGE_HEADER_ROW_HEIGHT() { return "headerRowHeight"; }
    static get CON_CHANGE_MERGE_HEADER_CELL() { return "mergeHeaderCell"; }
    static get CON_CHANGE_USE_INDICATOR() { return "useIndicator"; }
    static get CON_CHANGE_INDICATOR_WIDTH() { return "indicatorWidth"; }
    static get CON_CHANGE_DEFAULT_COLUMN_WIDTH() { return "defaultColumnWidth"; }
    static get CON_CHANGE_DEFAULT_ROW_HEIGHT() { return "defaultRowHeight"; }
    static get CON_CHANGE_CELL_MARGIN() { return "cellMargin"; }
    static get CON_CHANGE_FIX_COUNT() { return "fixCount"; }
    static get CON_CHANGE_DIFF_COLUMN_SIZE() { return "diffColumnSize"; }
    static get CON_CHANGE_DIFF_ROW_SIZE() { return "diffRowSize"; }
    static get CON_CHANGE_MERGE_CELL() { return "mergeCell"; }
    static get CON_CHANGE_USE_FIT_WIDTH() { return "useFitWidth"; }
    static get CON_CHANGE_COLUMN_COUNT() { return "columnCount"; }
    static get CON_CHANGE_ROW_COUNT() { return "rowCount"; }
    get useHeader() {
        return this._useHeader;
    }
    set useHeader(value) {
        if (this._useHeader != value) {
            this._useHeader = value;
            this.doChange(CGridInfo.CON_CHANGE_USE_HEADER);
        }
    }
    get headerCount() {
        return this._headerCount;
    }
    set headerCount(value) {
        if (this._headerCount != value) {
            this._headerCount = value;
            this.doChange(CGridInfo.CON_CHANGE_HEADER_COUNT);
        }
    }
    get headerRowHeight() {
        return this._headerRowHeight;
    }
    set headerRowHeight(value) {
        if (this._headerRowHeight != value) {
            this._headerRowHeight = value;
            this.doChange(CGridInfo.CON_CHANGE_HEADER_ROW_HEIGHT);
        }
    }
    get useIndicator() {
        return this._useIndicator;
    }
    set useIndicator(value) {
        if (this._useIndicator != value) {
            this._useIndicator = value;
            this.doChange(CGridInfo.CON_CHANGE_USE_INDICATOR);
        }
    }
    get indicatorWidth() {
        return this._indicatorWidth;
    }
    set indicatorWidth(value) {
        if (this._indicatorWidth != value) {
            this._indicatorWidth = value;
            this.doChange(CGridInfo.CON_CHANGE_INDICATOR_WIDTH);
        }
    }
    get defaultColumnWidth() {
        return this._defaultColumnWidth;
    }
    set defaultColumnWidth(value) {
        if (this._defaultColumnWidth != value) {
            this._defaultColumnWidth = value;
            this.doChange(CGridInfo.CON_CHANGE_DEFAULT_COLUMN_WIDTH);
        }
    }
    get defaultRowHeight() {
        return this._defaultRowHeight;
    }
    set defaultRowHeight(value) {
        if (this._defaultRowHeight != value) {
            this._defaultRowHeight = value;
            this.doChange(CGridInfo.CON_CHANGE_DEFAULT_ROW_HEIGHT);
        }
    }
    get cellMargin() {
        return this._cellMargin;
    }
    set cellMargin(value) {
        if (this._cellMargin != value) {
            this._cellMargin = value;
            this.doChange(CGridInfo.CON_CHANGE_CELL_MARGIN);
        }
    }
    get useFitWidth() {
        return this._useFitWidth;
    }
    set useFitWidth(value) {
        if (this._useFitWidth != value) {
            this._useFitWidth = value;
            this.doChange(CGridInfo.CON_CHANGE_USE_FIT_WIDTH);
        }
    }
    get columnCount() {
        return this._columnCount;
    }
    set columnCount(value) {
        if (this._columnCount != value) {
            this._columnCount = value;
            this.doChange(CGridInfo.CON_CHANGE_COLUMN_COUNT);
        }
    }
    get rowCount() {
        return this._rowCount;
    }
    set rowCount(value) {
        if (this._rowCount != value) {
            this._rowCount = value;
            this.doChange(CGridInfo.CON_CHANGE_COLUMN_COUNT);
        }
    }
    constructor() {
        super();
        //header
        this._useHeader = true;
        this._headerCount = 1;
        this._headerRowHeight = 20;
        this.mergeHeaderCell = new CCellSelectInfoList();
        //indicator
        this._useIndicator = true;
        this._indicatorWidth = 50;
        //fix
        this.fixLeft = new CNumberList();
        this.fixTop = new CNumberList();
        this.fixRight = new CNumberList();
        this.fixBottom = new CNumberList();
        //body
        this._defaultColumnWidth = 100;
        this._defaultRowHeight = 20;
        this._cellMargin = 0;
        this.diffColumnSize = new CNNMap();
        this.diffRowSize = new CNNMap();
        this.mergeCell = new CCellSelectInfoList();
        this._useFitWidth = false;
        this._columnCount = 10;
        this._rowCount = 0;
        this.useResizeColumn = false;
        this.useResizeRow = false;
        this.resizeGripLength = 5;
        let self = this;
        this.mergeHeaderCell.onChange = function () {
            self.doChange(CGridInfo.CON_CHANGE_MERGE_HEADER_CELL);
        };
        this.fixLeft.onChange = function () {
            self.doChange(CGridInfo.CON_CHANGE_FIX_COUNT);
        };
        this.fixTop.onChange = function () {
            self.doChange(CGridInfo.CON_CHANGE_FIX_COUNT);
        };
        this.fixRight.onChange = function () {
            self.doChange(CGridInfo.CON_CHANGE_FIX_COUNT);
        };
        this.fixBottom.onChange = function () {
            self.doChange(CGridInfo.CON_CHANGE_FIX_COUNT);
        };
        this.diffColumnSize.onChange = function () {
            self.doChange(CGridInfo.CON_CHANGE_DIFF_COLUMN_SIZE);
        };
        this.diffRowSize.onChange = function () {
            self.doChange(CGridInfo.CON_CHANGE_DIFF_ROW_SIZE);
        };
        this.mergeCell.onChange = function () {
            self.doChange(CGridInfo.CON_CHANGE_MERGE_CELL);
        };
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "useHeader", this.useHeader, true);
        CDataClass.putData(data, "headerCount", this.headerCount, 1);
        CDataClass.putData(data, "headerRowHeight", this.headerRowHeight, 20);
        CDataClass.putData(data, "mergeHeaderCell", this.mergeHeaderCell.toData(), [], true);
        CDataClass.putData(data, "fixLeft", this.fixLeft.toData(), [], true);
        CDataClass.putData(data, "fixTop", this.fixTop.toData(), [], true);
        CDataClass.putData(data, "fixRight", this.fixRight.toData(), [], true);
        CDataClass.putData(data, "fixBottom", this.fixBottom.toData(), [], true);
        CDataClass.putData(data, "defaultColumnWidth", this.defaultColumnWidth, 100);
        CDataClass.putData(data, "defaultRowHeight", this.defaultRowHeight, 20);
        CDataClass.putData(data, "cellMargin", this.cellMargin, 0);
        CDataClass.putData(data, "diffColumnSize", this.diffColumnSize.toData(), [], true);
        CDataClass.putData(data, "diffRowSize", this.diffRowSize.toData(), [], true);
        CDataClass.putData(data, "mergeCell", this.mergeCell.toData(), [], true);
        CDataClass.putData(data, "useFitWidth", this.useFitWidth, false);
        CDataClass.putData(data, "columnCount", this.columnCount, 10);
        CDataClass.putData(data, "rowCount", this.rowCount, 0);
        CDataClass.putData(data, "useResizeColumn", this.useResizeColumn, false);
        CDataClass.putData(data, "useResizeRow", this.useResizeRow, false);
        CDataClass.putData(data, "resizeGripLength", this.resizeGripLength, 5);
    }
    doFromData(data) {
        super.doFromData(data);
        this.useHeader = CDataClass.getData(data, "useHeader", true);
        this.headerCount = CDataClass.getData(data, "headerCount", 1);
        this.headerRowHeight = CDataClass.getData(data, "headerRowHeight", 20);
        this.mergeHeaderCell.fromData(CDataClass.getData(data, "mergeHeaderCell", [], true));
        this.fixLeft.fromData(CDataClass.getData(data, "fixLeft", [], true));
        this.fixTop.fromData(CDataClass.getData(data, "fixTop", [], true));
        this.fixRight.fromData(CDataClass.getData(data, "fixRight", [], true));
        this.fixBottom.fromData(CDataClass.getData(data, "fixBottom", [], true));
        this.defaultColumnWidth = CDataClass.getData(data, "defaultColumnWidth", 100);
        this.defaultRowHeight = CDataClass.getData(data, "defaultRowHeight", 20);
        this.cellMargin = CDataClass.getData(data, "cellMargin", 0);
        this.diffColumnSize.fromData(CDataClass.getData(data, "diffColumnSize", [], true));
        this.diffRowSize.fromData(CDataClass.getData(data, "diffRowSize", [], true));
        this.mergeCell.fromData(CDataClass.getData(data, "mergeCell", [], true));
        this.useFitWidth = CDataClass.getData(data, "useFitWidth", false);
        this.columnCount = CDataClass.getData(data, "columnCount", 10);
        this.rowCount = CDataClass.getData(data, "rowCount", 0);
        this.useResizeColumn = CDataClass.getData(data, "useResizeColumn", false);
        this.useResizeRow = CDataClass.getData(data, "useResizeRow", false);
        this.resizeGripLength = CDataClass.getData(data, "resizeGripLength", 5);
    }
}
var EPointerAreaKind;
(function (EPointerAreaKind) {
    EPointerAreaKind[EPointerAreaKind["NONE"] = 0] = "NONE";
    EPointerAreaKind[EPointerAreaKind["HEADER_BUTTON"] = 1] = "HEADER_BUTTON";
    EPointerAreaKind[EPointerAreaKind["HEADER_LEFT_FIX"] = 2] = "HEADER_LEFT_FIX";
    EPointerAreaKind[EPointerAreaKind["HEADER_CLIENT"] = 3] = "HEADER_CLIENT";
    EPointerAreaKind[EPointerAreaKind["HEADER_RIGHT_FIX"] = 4] = "HEADER_RIGHT_FIX";
    EPointerAreaKind[EPointerAreaKind["INDICATOR_TOP_FIX"] = 5] = "INDICATOR_TOP_FIX";
    EPointerAreaKind[EPointerAreaKind["INDICATOR_CLIENT"] = 6] = "INDICATOR_CLIENT";
    EPointerAreaKind[EPointerAreaKind["INDICATOR_BOTTOM_FIX"] = 7] = "INDICATOR_BOTTOM_FIX";
    EPointerAreaKind[EPointerAreaKind["TOP_LEFT_FIX"] = 8] = "TOP_LEFT_FIX";
    EPointerAreaKind[EPointerAreaKind["TOP_CLIENT_FIX"] = 9] = "TOP_CLIENT_FIX";
    EPointerAreaKind[EPointerAreaKind["TOP_RIGHT_FIX"] = 10] = "TOP_RIGHT_FIX";
    EPointerAreaKind[EPointerAreaKind["BOTTOM_LEFT_FIX"] = 11] = "BOTTOM_LEFT_FIX";
    EPointerAreaKind[EPointerAreaKind["BOTTOM_CLIENT_FIX"] = 12] = "BOTTOM_CLIENT_FIX";
    EPointerAreaKind[EPointerAreaKind["BOTTOM_RIGHT_FIX"] = 13] = "BOTTOM_RIGHT_FIX";
    EPointerAreaKind[EPointerAreaKind["LEFT_FIX"] = 14] = "LEFT_FIX";
    EPointerAreaKind[EPointerAreaKind["RIGHT_FIX"] = 15] = "RIGHT_FIX";
    EPointerAreaKind[EPointerAreaKind["CLIENT"] = 16] = "CLIENT";
})(EPointerAreaKind || (EPointerAreaKind = {}));
class CCustomGrid extends CCustomUnlimitedScrollBoxControl {
    get scrollbarResource() {
        return this.scrollBox.scrollbarResource;
    }
    set scrollbarResource(value) {
        this.scrollBox.scrollbarResource = value;
    }
    get scrollbarLength() {
        return this.scrollBox.scrollbarLength;
    }
    set scrollbarLength(value) {
        this.scrollBox.scrollbarLength = value;
    }
    constructor(parent, name) {
        super(parent, name);
        this.__cellInfo = { kind: EPointerAreaKind.NONE, col: -1, row: -1, x: -1, y: -1 };
        this.__downCellInfo = { kind: EPointerAreaKind.NONE, col: -1, row: -1, width: -1, height: -1, resizeCol: false, resizeRow: false, offsetx: -1, offsety: -1 };
        this.__preClickTime = -1;
        this.__area = EPointerAreaKind.NONE;
        this.cellPressed = false;
        this.gridInfo = new CGridInfo();
        this.editable = false;
        let self = this;
        this.gridInfo.onChange = function (sender, kind) {
            self.doChangeGridInfo(kind);
        };
        this.doScrollBoxUpdate();
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "gridInfo", this.gridInfo.toData(), {}, true);
        CDataClass.putData(data, "editable", this.editable, false);
        CDataClass.putData(data, "scrollbarResource", this.scrollbarResource, "");
        CDataClass.putData(data, "scrollbarLength", this.scrollbarLength, 15);
    }
    doFromData(data) {
        super.doFromData(data);
        this.gridInfo.fromData(CDataClass.getData(data, "gridInfo", {}, true));
        this.editable = CDataClass.getData(data, "editable", false);
        this.scrollbarResource = CDataClass.getData(data, "scrollbarResource", "");
        this.scrollbarLength = CDataClass.getData(data, "scrollbarLength", 15);
    }
    doBackgoundPointerDown(e, points) {
        super.doBackgoundPointerDown(e, points);
        this.setBackgroundArea("down", e, points);
    }
    doBackgoundPointerMove(e, points) {
        super.doBackgoundPointerMove(e, points);
        this.setBackgroundArea("move", e, points);
    }
    doBackgoundPointerUp(e, points) {
        super.doBackgoundPointerUp(e, points);
        this.setBackgroundArea("up", e, points);
        this.cellPressed = false;
    }
    doBackgoundPointerOut(e, points) {
        super.doBackgoundPointerOut(e, points);
        this.doGridPointerOut(this.__area, e, points);
        this.__area = EPointerAreaKind.NONE;
    }
    out(e, points) {
        if (this.__area == EPointerAreaKind.HEADER_BUTTON)
            this.doGridPointerOut(EPointerAreaKind.HEADER_BUTTON, e, points);
        if (this.__area == EPointerAreaKind.HEADER_LEFT_FIX)
            this.doGridPointerOut(EPointerAreaKind.HEADER_LEFT_FIX, e, points);
        if (this.__area == EPointerAreaKind.HEADER_CLIENT)
            this.doGridPointerOut(EPointerAreaKind.HEADER_CLIENT, e, points);
        if (this.__area == EPointerAreaKind.HEADER_RIGHT_FIX)
            this.doGridPointerOut(EPointerAreaKind.HEADER_RIGHT_FIX, e, points);
        if (this.__area == EPointerAreaKind.INDICATOR_TOP_FIX)
            this.doGridPointerOut(EPointerAreaKind.INDICATOR_TOP_FIX, e, points);
        if (this.__area == EPointerAreaKind.INDICATOR_CLIENT)
            this.doGridPointerOut(EPointerAreaKind.INDICATOR_CLIENT, e, points);
        if (this.__area == EPointerAreaKind.INDICATOR_BOTTOM_FIX)
            this.doGridPointerOut(EPointerAreaKind.INDICATOR_BOTTOM_FIX, e, points);
        if (this.__area == EPointerAreaKind.LEFT_FIX)
            this.doGridPointerOut(EPointerAreaKind.LEFT_FIX, e, points);
        if (this.__area == EPointerAreaKind.TOP_LEFT_FIX)
            this.doGridPointerOut(EPointerAreaKind.TOP_LEFT_FIX, e, points);
        if (this.__area == EPointerAreaKind.TOP_CLIENT_FIX)
            this.doGridPointerOut(EPointerAreaKind.TOP_CLIENT_FIX, e, points);
        if (this.__area == EPointerAreaKind.TOP_RIGHT_FIX)
            this.doGridPointerOut(EPointerAreaKind.TOP_RIGHT_FIX, e, points);
        if (this.__area == EPointerAreaKind.RIGHT_FIX)
            this.doGridPointerOut(EPointerAreaKind.RIGHT_FIX, e, points);
        if (this.__area == EPointerAreaKind.BOTTOM_LEFT_FIX)
            this.doGridPointerOut(EPointerAreaKind.BOTTOM_LEFT_FIX, e, points);
        if (this.__area == EPointerAreaKind.BOTTOM_CLIENT_FIX)
            this.doGridPointerOut(EPointerAreaKind.BOTTOM_CLIENT_FIX, e, points);
        if (this.__area == EPointerAreaKind.BOTTOM_RIGHT_FIX)
            this.doGridPointerOut(EPointerAreaKind.BOTTOM_RIGHT_FIX, e, points);
        if (this.__area == EPointerAreaKind.CLIENT)
            this.doGridPointerOut(EPointerAreaKind.CLIENT, e, points);
        this.__area = EPointerAreaKind.NONE;
    }
    over(e, points) {
        if (this.__area == EPointerAreaKind.HEADER_BUTTON)
            this.doGridPointerOver(EPointerAreaKind.HEADER_BUTTON, e, points);
        if (this.__area == EPointerAreaKind.HEADER_LEFT_FIX)
            this.doGridPointerOver(EPointerAreaKind.HEADER_LEFT_FIX, e, points);
        if (this.__area == EPointerAreaKind.HEADER_CLIENT)
            this.doGridPointerOver(EPointerAreaKind.HEADER_CLIENT, e, points);
        if (this.__area == EPointerAreaKind.HEADER_RIGHT_FIX)
            this.doGridPointerOver(EPointerAreaKind.HEADER_RIGHT_FIX, e, points);
        if (this.__area == EPointerAreaKind.INDICATOR_TOP_FIX)
            this.doGridPointerOver(EPointerAreaKind.INDICATOR_TOP_FIX, e, points);
        if (this.__area == EPointerAreaKind.INDICATOR_CLIENT)
            this.doGridPointerOver(EPointerAreaKind.INDICATOR_CLIENT, e, points);
        if (this.__area == EPointerAreaKind.INDICATOR_BOTTOM_FIX)
            this.doGridPointerOver(EPointerAreaKind.INDICATOR_BOTTOM_FIX, e, points);
        if (this.__area == EPointerAreaKind.LEFT_FIX)
            this.doGridPointerOver(EPointerAreaKind.LEFT_FIX, e, points);
        if (this.__area == EPointerAreaKind.TOP_LEFT_FIX)
            this.doGridPointerOver(EPointerAreaKind.TOP_LEFT_FIX, e, points);
        if (this.__area == EPointerAreaKind.TOP_CLIENT_FIX)
            this.doGridPointerOver(EPointerAreaKind.TOP_CLIENT_FIX, e, points);
        if (this.__area == EPointerAreaKind.TOP_RIGHT_FIX)
            this.doGridPointerOver(EPointerAreaKind.TOP_RIGHT_FIX, e, points);
        if (this.__area == EPointerAreaKind.RIGHT_FIX)
            this.doGridPointerOver(EPointerAreaKind.RIGHT_FIX, e, points);
        if (this.__area == EPointerAreaKind.BOTTOM_LEFT_FIX)
            this.doGridPointerOver(EPointerAreaKind.BOTTOM_LEFT_FIX, e, points);
        if (this.__area == EPointerAreaKind.BOTTOM_CLIENT_FIX)
            this.doGridPointerOver(EPointerAreaKind.BOTTOM_CLIENT_FIX, e, points);
        if (this.__area == EPointerAreaKind.BOTTOM_RIGHT_FIX)
            this.doGridPointerOver(EPointerAreaKind.BOTTOM_RIGHT_FIX, e, points);
        if (this.__area == EPointerAreaKind.CLIENT)
            this.doGridPointerOver(EPointerAreaKind.CLIENT, e, points);
    }
    setBackgroundArea(kind, e, points) {
        let header = this.getBackgroundHeaderBounds();
        let headerButton = this.getBackgroundHeaderButtonBounds();
        let indicator = this.getBackgroundIndicatorBounds();
        let l = this.getBackgroundLeftFixBounds();
        let t = this.getBackgroundTopFixBounds();
        let r = this.getBackgroundRightFixBounds();
        let b = this.getBackgroundBottomFixBounds();
        let client = this.getBackgroundClientBounds();
        if (header.isIn(e.offsetX, e.offsetY)) {
            if (e.offsetX >= l.left && e.offsetX < l.right) {
                if (this.__area != EPointerAreaKind.HEADER_LEFT_FIX) {
                    this.out(e, points);
                    this.__area = EPointerAreaKind.HEADER_LEFT_FIX;
                    this.over(e, points);
                }
            }
            else if (e.offsetX >= r.left && e.offsetX < r.right) {
                if (this.__area != EPointerAreaKind.HEADER_RIGHT_FIX) {
                    this.out(e, points);
                    this.__area = EPointerAreaKind.HEADER_RIGHT_FIX;
                    this.over(e, points);
                }
            }
            else {
                if (this.__area != EPointerAreaKind.HEADER_CLIENT) {
                    this.out(e, points);
                    this.__area = EPointerAreaKind.HEADER_CLIENT;
                    this.over(e, points);
                }
            }
            if (this.__area == EPointerAreaKind.HEADER_LEFT_FIX) {
                this.eventExec(kind, this.__area, e.offsetX - headerButton.width, e.offsetY, e, points);
            }
            if (this.__area == EPointerAreaKind.HEADER_CLIENT) {
                this.eventExec(kind, this.__area, e.offsetX - l.right, e.offsetY, e, points);
            }
            if (this.__area == EPointerAreaKind.HEADER_RIGHT_FIX) {
                this.eventExec(kind, this.__area, e.offsetX - client.right, e.offsetY, e, points);
            }
        }
        if (headerButton.isIn(e.offsetX, e.offsetY)) {
            if (this.__area != EPointerAreaKind.HEADER_BUTTON) {
                this.out(e, points);
                this.__area = EPointerAreaKind.HEADER_BUTTON;
                this.over(e, points);
            }
            this.eventExec(kind, this.__area, e.offsetX, e.offsetY, e, points);
        }
        if (indicator.isIn(e.offsetX, e.offsetY)) {
            if (e.offsetY >= t.top && e.offsetY < t.bottom) {
                if (this.__area != EPointerAreaKind.INDICATOR_TOP_FIX) {
                    this.out(e, points);
                    this.__area = EPointerAreaKind.INDICATOR_TOP_FIX;
                    this.over(e, points);
                }
            }
            else if (e.offsetY >= b.top && e.offsetY < b.bottom) {
                if (this.__area != EPointerAreaKind.INDICATOR_BOTTOM_FIX) {
                    this.out(e, points);
                    this.__area = EPointerAreaKind.INDICATOR_BOTTOM_FIX;
                    this.over(e, points);
                }
            }
            else {
                if (this.__area != EPointerAreaKind.INDICATOR_CLIENT) {
                    this.out(e, points);
                    this.__area = EPointerAreaKind.INDICATOR_CLIENT;
                    this.over(e, points);
                }
            }
            if (this.__area == EPointerAreaKind.INDICATOR_TOP_FIX) {
                this.eventExec(kind, this.__area, e.offsetX, e.offsetY - headerButton.height, e, points);
            }
            if (this.__area == EPointerAreaKind.INDICATOR_CLIENT) {
                this.eventExec(kind, this.__area, e.offsetX, e.offsetY - t.bottom, e, points);
            }
            if (this.__area == EPointerAreaKind.INDICATOR_BOTTOM_FIX) {
                this.eventExec(kind, this.__area, e.offsetX, e.offsetY - client.bottom, e, points);
            }
        }
        if (l.isIn(e.offsetX, e.offsetY)) {
            if (this.__area != EPointerAreaKind.LEFT_FIX) {
                this.out(e, points);
                this.__area = EPointerAreaKind.LEFT_FIX;
                this.over(e, points);
            }
            this.eventExec(kind, this.__area, e.offsetX - headerButton.width, e.offsetY - t.bottom, e, points);
        }
        if (t.isIn(e.offsetX, e.offsetY)) {
            if (e.offsetX >= l.left && e.offsetX < l.right) {
                if (this.__area != EPointerAreaKind.TOP_LEFT_FIX) {
                    this.out(e, points);
                    this.__area = EPointerAreaKind.TOP_LEFT_FIX;
                    this.over(e, points);
                }
            }
            else if (e.offsetX >= r.left && e.offsetX < r.right) {
                if (this.__area != EPointerAreaKind.TOP_RIGHT_FIX) {
                    this.out(e, points);
                    this.__area = EPointerAreaKind.TOP_RIGHT_FIX;
                    this.over(e, points);
                }
            }
            else {
                if (this.__area != EPointerAreaKind.TOP_CLIENT_FIX) {
                    this.out(e, points);
                    this.__area = EPointerAreaKind.TOP_CLIENT_FIX;
                    this.over(e, points);
                }
            }
            if (this.__area == EPointerAreaKind.TOP_LEFT_FIX) {
                this.eventExec(kind, this.__area, e.offsetX - headerButton.width, e.offsetY - header.bottom, e, points);
            }
            if (this.__area == EPointerAreaKind.TOP_CLIENT_FIX) {
                this.eventExec(kind, this.__area, e.offsetX - l.right, e.offsetY - header.bottom, e, points);
            }
            if (this.__area == EPointerAreaKind.TOP_RIGHT_FIX) {
                this.eventExec(kind, this.__area, e.offsetX - client.right, e.offsetY - header.bottom, e, points);
            }
        }
        if (r.isIn(e.offsetX, e.offsetY)) {
            if (this.__area != EPointerAreaKind.RIGHT_FIX) {
                this.out(e, points);
                this.__area = EPointerAreaKind.RIGHT_FIX;
                this.over(e, points);
            }
            this.eventExec(kind, this.__area, e.offsetX - client.right, e.offsetY - t.bottom, e, points);
        }
        if (b.isIn(e.offsetX, e.offsetY)) {
            if (e.offsetX >= l.left && e.offsetX < l.right) {
                if (this.__area != EPointerAreaKind.BOTTOM_LEFT_FIX) {
                    this.out(e, points);
                    this.__area = EPointerAreaKind.BOTTOM_LEFT_FIX;
                    this.over(e, points);
                }
            }
            else if (e.offsetX >= r.left && e.offsetX < r.right) {
                if (this.__area != EPointerAreaKind.BOTTOM_RIGHT_FIX) {
                    this.out(e, points);
                    this.__area = EPointerAreaKind.BOTTOM_RIGHT_FIX;
                    this.over(e, points);
                }
            }
            else {
                if (this.__area != EPointerAreaKind.BOTTOM_CLIENT_FIX) {
                    this.out(e, points);
                    this.__area = EPointerAreaKind.BOTTOM_CLIENT_FIX;
                    this.over(e, points);
                }
            }
            if (this.__area == EPointerAreaKind.BOTTOM_LEFT_FIX) {
                this.eventExec(kind, this.__area, e.offsetX - headerButton.width, e.offsetY - client.bottom, e, points);
            }
            if (this.__area == EPointerAreaKind.BOTTOM_CLIENT_FIX) {
                this.eventExec(kind, this.__area, e.offsetX - l.right, e.offsetY - client.bottom, e, points);
            }
            if (this.__area == EPointerAreaKind.BOTTOM_RIGHT_FIX) {
                this.eventExec(kind, this.__area, e.offsetX - client.right, e.offsetY - client.bottom, e, points);
            }
        }
        if (client.isIn(e.offsetX, e.offsetY)) {
            if (this.__area != EPointerAreaKind.CLIENT) {
                this.out(e, points);
                this.__area = EPointerAreaKind.CLIENT;
                this.over(e, points);
            }
            this.eventExec(kind, this.__area, e.offsetX - l.right, e.offsetY - t.bottom, e, points);
        }
    }
    eventExec(eventKind, kind, x, y, e, points) {
        if (eventKind == "down") {
            this.doGridPointerDown(kind, x, y, e, points);
        }
        if (eventKind == "move") {
            this.doGridPointerMove(kind, x, y, e, points);
        }
        if (eventKind == "up") {
            this.doGridPointerUp(kind, x, y, e, points);
        }
    }
    //////////////////////////////////////////////////////////////
    //Grid 이벤트
    //////////////////////////////////////////////////////////////
    doGridPointerDown(kind, x, y, e, points) {
        this.cellEventExec("down", kind, x, y, e, points);
        if (this.onGridPointerDown != undefined) {
            this.onGridPointerDown(this, kind, x, y, e, points);
        }
    }
    doGridPointerMove(kind, x, y, e, points) {
        this.cellEventExec("move", kind, x, y, e, points);
        if (this.onGridPointerMove != undefined) {
            this.onGridPointerMove(this, kind, x, y, e, points);
        }
    }
    doGridPointerUp(kind, x, y, e, points) {
        this.cellEventExec("up", kind, x, y, e, points);
        if (this.onGridPointerUp != undefined) {
            this.onGridPointerUp(this, kind, x, y, e, points);
        }
    }
    doGridPointerOver(kind, e, points) {
        if (this.onGridPointerOver != undefined) {
            this.onGridPointerOver(this, kind, e, points);
        }
    }
    doGridPointerOut(kind, e, points) {
        if (this.__cellInfo.kind != EPointerAreaKind.NONE || this.__cellInfo.col != -1 || this.__cellInfo.row != -1) {
            this.doChangePointerCell(e, points, this.__cellInfo, { kind: EPointerAreaKind.NONE, col: -1, row: -1, x: -1, y: -1 });
        }
        this.__cellInfo = { kind: EPointerAreaKind.NONE, col: -1, row: -1, x: -1, y: -1 };
        if (this.onGridPointerOut != undefined) {
            this.onGridPointerOut(this, kind, e, points);
        }
    }
    cellEventExec(eventKind, kind, x, y, e, points) {
        let col = -1;
        let row = -1;
        let cx = -1;
        let cy = -1;
        let cm = false;
        let rm = false;
        let w = 0;
        let h = 0;
        function setColClient(self) {
            let c = self.xToColumn(self.scrollX + x);
            col = c.index;
            let cb = self.getCellBounds(col, 0);
            cx = self.scrollX + x - cb.left;
            cm = c.isMargin;
            w = cb.width - self.gridInfo.cellMargin;
        }
        function setColLeftFix(self) {
            let l = 0;
            for (let n = 0; n < self.gridInfo.fixLeft.length; n++) {
                if (l <= x && x < l + self.gridInfo.fixLeft.get(n)) {
                    cx = x - l;
                    col = n;
                    w = self.gridInfo.fixLeft.get(n);
                    break;
                }
                l += self.gridInfo.fixLeft.get(n) + self.gridInfo.cellMargin;
            }
        }
        function setColRightFix(self) {
            let l = self.gridInfo.cellMargin;
            for (let n = 0; n < self.gridInfo.fixRight.length; n++) {
                if (l <= x && x < l + self.gridInfo.fixRight.get(n)) {
                    cx = x - l;
                    col = n;
                    w = self.gridInfo.fixRight.get(n);
                    break;
                }
                l += self.gridInfo.fixRight.get(n) + self.gridInfo.cellMargin;
            }
        }
        function setRowClient(self) {
            let r = self.yToRow(self.scrollY + y);
            row = r.index;
            let rb = self.getCellBounds(0, row);
            cy = self.scrollY + y - rb.top;
            rm = r.isMargin;
            h = rb.height - self.gridInfo.cellMargin;
        }
        if (kind == EPointerAreaKind.HEADER_BUTTON) {
            let rt = this.getBackgroundHeaderButtonBounds();
            if (x < rt.width - this.gridInfo.cellMargin && y < rt.height - this.gridInfo.cellMargin) {
                col = 0;
                row = 0;
                w = rt.width - this.gridInfo.cellMargin;
                h = rt.height - this.gridInfo.cellMargin;
                cx = x;
                cy = y;
            }
        }
        if (kind == EPointerAreaKind.HEADER_LEFT_FIX || kind == EPointerAreaKind.HEADER_CLIENT || kind == EPointerAreaKind.HEADER_RIGHT_FIX) {
            let l = 0;
            for (let n = 0; n < this.gridInfo.headerCount; n++) {
                if (l <= y && y < l + this.gridInfo.headerRowHeight) {
                    cy = y - l;
                    row = n;
                    break;
                }
                l += this.gridInfo.headerRowHeight + this.gridInfo.cellMargin;
            }
            h = this.gridInfo.headerRowHeight;
            if (kind == EPointerAreaKind.HEADER_LEFT_FIX) {
                setColLeftFix(this);
            }
            if (kind == EPointerAreaKind.HEADER_CLIENT) {
                setColClient(this);
            }
            if (kind == EPointerAreaKind.HEADER_RIGHT_FIX) {
                setColRightFix(this);
            }
        }
        if (kind == EPointerAreaKind.INDICATOR_TOP_FIX || kind == EPointerAreaKind.INDICATOR_CLIENT || kind == EPointerAreaKind.INDICATOR_BOTTOM_FIX) {
            let rt = this.getBackgroundIndicatorBounds();
            if (x < rt.width - this.gridInfo.cellMargin) {
                col = 0;
                w = rt.width - this.gridInfo.cellMargin;
                cx = x;
            }
            if (kind == EPointerAreaKind.INDICATOR_TOP_FIX) {
                let l = 0;
                for (let n = 0; n < this.gridInfo.fixTop.length; n++) {
                    if (l <= y && y < l + this.gridInfo.fixTop.get(n)) {
                        cy = y - l;
                        row = n;
                        h = this.gridInfo.fixTop.get(n);
                        break;
                    }
                    l += this.gridInfo.fixTop.get(n) + this.gridInfo.cellMargin;
                }
            }
            if (kind == EPointerAreaKind.INDICATOR_CLIENT) {
                setRowClient(this);
            }
            if (kind == EPointerAreaKind.INDICATOR_BOTTOM_FIX) {
                let l = this.gridInfo.cellMargin;
                for (let n = 0; n < this.gridInfo.fixBottom.length; n++) {
                    if (l <= y && y < l + this.gridInfo.fixBottom.get(n)) {
                        cy = y - l;
                        row = n;
                        h = this.gridInfo.fixBottom.get(n);
                        break;
                    }
                    l += this.gridInfo.fixBottom.get(n) + this.gridInfo.cellMargin;
                }
            }
        }
        if (kind == EPointerAreaKind.TOP_LEFT_FIX || kind == EPointerAreaKind.TOP_CLIENT_FIX || kind == EPointerAreaKind.TOP_RIGHT_FIX) {
            let l = 0;
            for (let n = 0; n < this.gridInfo.fixTop.length; n++) {
                if (l <= y && y < l + this.gridInfo.fixTop.get(n)) {
                    cy = y - l;
                    row = n;
                    h = this.gridInfo.fixTop.get(n);
                    break;
                }
                l += this.gridInfo.fixTop.get(n) + this.gridInfo.cellMargin;
            }
            if (kind == EPointerAreaKind.TOP_LEFT_FIX) {
                setColLeftFix(this);
            }
            if (kind == EPointerAreaKind.TOP_CLIENT_FIX) {
                setColClient(this);
            }
            if (kind == EPointerAreaKind.TOP_RIGHT_FIX) {
                setColRightFix(this);
            }
        }
        if (kind == EPointerAreaKind.BOTTOM_LEFT_FIX || kind == EPointerAreaKind.BOTTOM_CLIENT_FIX || kind == EPointerAreaKind.BOTTOM_RIGHT_FIX) {
            let l = this.gridInfo.cellMargin;
            for (let n = 0; n < this.gridInfo.fixBottom.length; n++) {
                if (l <= y && y < l + this.gridInfo.fixBottom.get(n)) {
                    cy = y - l;
                    row = n;
                    h = this.gridInfo.fixBottom.get(n);
                    break;
                }
                l += this.gridInfo.fixBottom.get(n) + this.gridInfo.cellMargin;
            }
            if (kind == EPointerAreaKind.BOTTOM_LEFT_FIX) {
                setColLeftFix(this);
            }
            if (kind == EPointerAreaKind.BOTTOM_CLIENT_FIX) {
                setColClient(this);
            }
            if (kind == EPointerAreaKind.BOTTOM_RIGHT_FIX) {
                setColRightFix(this);
            }
        }
        if (kind == EPointerAreaKind.LEFT_FIX) {
            setColLeftFix(this);
            setRowClient(this);
        }
        if (kind == EPointerAreaKind.RIGHT_FIX) {
            setColRightFix(this);
            setRowClient(this);
        }
        if (kind == EPointerAreaKind.CLIENT) {
            setColClient(this);
            setRowClient(this);
        }
        let bChk = true;
        if (kind == EPointerAreaKind.CLIENT && (col >= this.gridInfo.columnCount || row >= this.gridInfo.rowCount)) {
            bChk = false;
        }
        if (kind == EPointerAreaKind.HEADER_CLIENT && col >= this.gridInfo.columnCount) {
            bChk = false;
        }
        if ((kind == EPointerAreaKind.BOTTOM_LEFT_FIX ||
            kind == EPointerAreaKind.TOP_LEFT_FIX ||
            kind == EPointerAreaKind.HEADER_LEFT_FIX ||
            kind == EPointerAreaKind.LEFT_FIX) &&
            col >= this.gridInfo.fixLeft.length) {
            bChk = false;
        }
        if ((kind == EPointerAreaKind.BOTTOM_RIGHT_FIX ||
            kind == EPointerAreaKind.TOP_RIGHT_FIX ||
            kind == EPointerAreaKind.HEADER_RIGHT_FIX ||
            kind == EPointerAreaKind.RIGHT_FIX) &&
            col >= this.gridInfo.fixRight.length) {
            bChk = false;
        }
        if (kind == EPointerAreaKind.INDICATOR_CLIENT &&
            row >= this.gridInfo.rowCount) {
            bChk = false;
        }
        if (col != -1 &&
            row != -1 &&
            !cm &&
            !rm &&
            bChk) {
            if (this.__cellInfo.kind != kind || this.__cellInfo.col != col || this.__cellInfo.row != row) {
                this.doChangePointerCell(e, points, this.__cellInfo, { kind: kind, col: col, row: row, x: cx, y: cy });
            }
            this.__cellInfo = { kind: kind, col: col, row: row, x: cx, y: cy };
            if (eventKind == "down")
                this.doCellPointerDown(kind, col, row, cx, cy, w, h, e, points);
            if (eventKind == "move")
                this.doCellPointerMove(kind, col, row, cx, cy, w, h, e, points);
            if (eventKind == "up")
                this.doCellPointerUp(kind, col, row, cx, cy, w, h, e, points);
        }
        else {
            if (this.__cellInfo.kind != EPointerAreaKind.NONE || this.__cellInfo.col != -1 || this.__cellInfo.row != -1) {
                this.doChangePointerCell(e, points, this.__cellInfo, { kind: EPointerAreaKind.NONE, col: -1, row: -1, x: -1, y: -1 });
            }
            this.__cellInfo = { kind: EPointerAreaKind.NONE, col: -1, row: -1, x: -1, y: -1 };
        }
    }
    //////////////////////////////////////////////////////////////
    //Cell 이벤트
    //////////////////////////////////////////////////////////////
    doChangePointerCell(e, points, before, after) {
        if (before.col != -1 && before.row != -1) {
            this.doCellPointerOut(before.kind, before.col, before.row, e, points);
        }
        if (after.col != -1 && after.row != -1) {
            this.doCellPointerOver(after.kind, after.col, after.row, e, points);
        }
    }
    doCellPointerDown(kind, column, row, x, y, width, height, e, points) {
        let rc = false;
        let rr = false;
        rc = this.scrollBox.background.cursor == "col-resize";
        rr = this.scrollBox.background.cursor == "row-resize";
        if (this.scrollBox.background.cursor == "nwse-resize") {
            rc = true;
            rr = true;
        }
        this.__downCellInfo = { kind: kind, col: column, row: row, width: width, height: height, resizeCol: rc, resizeRow: rr, offsetx: e.offsetX, offsety: e.offsetY };
        this.cellPressed = true;
        if (this.onCellPointerDown != undefined) {
            this.onCellPointerDown(this, kind, column, row, x, y, width, height, e, points);
        }
    }
    doCellPointerMove(kind, column, row, x, y, width, height, e, points) {
        if ((kind == EPointerAreaKind.HEADER_CLIENT || kind == EPointerAreaKind.HEADER_LEFT_FIX) &&
            this.gridInfo.useResizeColumn) {
            if (x >= width - this.gridInfo.resizeGripLength && x < width) {
                this.scrollBox.background.cursor = "col-resize";
            }
            else {
                this.scrollBox.background.cursor = "auto";
            }
        }
        if (kind == EPointerAreaKind.HEADER_RIGHT_FIX &&
            this.gridInfo.useResizeColumn) {
            if (x >= 0 && x < this.gridInfo.resizeGripLength) {
                this.scrollBox.background.cursor = "col-resize";
            }
            else {
                this.scrollBox.background.cursor = "auto";
            }
        }
        if (kind == EPointerAreaKind.INDICATOR_CLIENT) {
            if (this.gridInfo.useResizeRow && this.gridInfo.useResizeColumn && y >= height - this.gridInfo.resizeGripLength && y < height && x >= width - this.gridInfo.resizeGripLength && x < width) {
                this.scrollBox.background.cursor = "nwse-resize";
            }
            else if (this.gridInfo.useResizeColumn && x >= width - this.gridInfo.resizeGripLength && x < width) {
                this.scrollBox.background.cursor = "col-resize";
            }
            else if (this.gridInfo.useResizeRow && y >= height - this.gridInfo.resizeGripLength && y < height) {
                this.scrollBox.background.cursor = "row-resize";
            }
            else {
                this.scrollBox.background.cursor = "auto";
            }
        }
        if (kind == EPointerAreaKind.INDICATOR_TOP_FIX &&
            this.gridInfo.useResizeRow) {
            if (y >= height - this.gridInfo.resizeGripLength && y < height) {
                this.scrollBox.background.cursor = "row-resize";
            }
            else {
                this.scrollBox.background.cursor = "auto";
            }
        }
        if (kind == EPointerAreaKind.INDICATOR_BOTTOM_FIX &&
            this.gridInfo.useResizeRow) {
            if (y >= 0 && y < this.gridInfo.resizeGripLength) {
                this.scrollBox.background.cursor = "row-resize";
            }
            else {
                this.scrollBox.background.cursor = "auto";
            }
        }
        if (kind == EPointerAreaKind.CLIENT && this.gridInfo.useResizeRow && this.gridInfo.useResizeColumn) {
            if (y >= height - this.gridInfo.resizeGripLength && y < height && x >= width - this.gridInfo.resizeGripLength && x < width) {
                this.scrollBox.background.cursor = "nwse-resize";
            }
            else {
                this.scrollBox.background.cursor = "auto";
            }
        }
        if (this.cellPressed && this.__downCellInfo.resizeCol) {
            if (this.__downCellInfo.kind == EPointerAreaKind.HEADER_CLIENT ||
                this.__downCellInfo.kind == EPointerAreaKind.CLIENT) {
                this.gridInfo.diffColumnSize.set(this.__downCellInfo.col, this.__downCellInfo.width + (e.offsetX - this.__downCellInfo.offsetx));
            }
            if (this.__downCellInfo.kind == EPointerAreaKind.INDICATOR_CLIENT) {
                this.gridInfo.indicatorWidth = this.__downCellInfo.width + (e.offsetX - this.__downCellInfo.offsetx);
            }
            if (this.__downCellInfo.kind == EPointerAreaKind.HEADER_LEFT_FIX) {
                this.gridInfo.fixLeft.set(this.__downCellInfo.col, this.__downCellInfo.width + (e.offsetX - this.__downCellInfo.offsetx));
            }
            if (this.__downCellInfo.kind == EPointerAreaKind.HEADER_RIGHT_FIX) {
                this.gridInfo.fixRight.set(this.__downCellInfo.col, this.__downCellInfo.width - (e.offsetX - this.__downCellInfo.offsetx));
            }
        }
        if (this.cellPressed && this.__downCellInfo.resizeRow) {
            if (this.__downCellInfo.kind == EPointerAreaKind.INDICATOR_CLIENT || this.__downCellInfo.kind == EPointerAreaKind.CLIENT) {
                this.gridInfo.diffRowSize.set(this.__downCellInfo.row, this.__downCellInfo.height + (e.offsetY - this.__downCellInfo.offsety));
            }
            if (this.__downCellInfo.kind == EPointerAreaKind.INDICATOR_TOP_FIX) {
                this.gridInfo.fixTop.set(this.__downCellInfo.row, this.__downCellInfo.height + (e.offsetY - this.__downCellInfo.offsety));
            }
            if (this.__downCellInfo.kind == EPointerAreaKind.INDICATOR_BOTTOM_FIX) {
                this.gridInfo.fixBottom.set(this.__downCellInfo.row, this.__downCellInfo.height - (e.offsetY - this.__downCellInfo.offsety));
            }
        }
        if (kind == EPointerAreaKind.CLIENT && this.cellPressed && this.__downCellInfo.kind == EPointerAreaKind.CLIENT && this.__downCellInfo.col >= 0 && this.__downCellInfo.row >= 0) {
            let info = new CCellSelectInfo();
            info.startCell.x = this.__downCellInfo.col;
            info.startCell.y = this.__downCellInfo.row;
            info.stopCell.x = column;
            info.stopCell.y = row;
            let alignInfo = new CCellSelectInfo();
            alignInfo.startCell.x = CCalc.min(info.startCell.x, info.stopCell.x);
            alignInfo.startCell.y = CCalc.min(info.startCell.y, info.stopCell.y);
            alignInfo.stopCell.x = CCalc.max(info.startCell.x, info.stopCell.x);
            alignInfo.stopCell.y = CCalc.max(info.startCell.y, info.stopCell.y);
            this.doCellDrag(info, alignInfo, e, points);
        }
        if (this.onCellPointerMove != undefined) {
            this.onCellPointerMove(this, kind, column, row, x, y, width, height, e, points);
        }
    }
    doCellPointerUp(kind, column, row, x, y, width, height, e, points) {
        if (this.__downCellInfo.kind == kind && this.__downCellInfo.col == column && this.__downCellInfo.row == row) {
            this.doCellClick(kind, column, row, x, y, width, height, e, points);
        }
        if (this.onCellPointerUp != undefined) {
            this.onCellPointerUp(this, kind, column, row, x, y, width, height, e, points);
        }
    }
    doCellPointerOver(kind, column, row, e, points) {
        if (this.onCellPointerOver != undefined) {
            this.onCellPointerOver(this, kind, column, row, e, points);
        }
    }
    doCellPointerOut(kind, column, row, e, points) {
        if (this.gridInfo.useResizeColumn) {
            this.scrollBox.background.cursor = "auto";
        }
        if (this.gridInfo.useResizeRow) {
            this.scrollBox.background.cursor = "auto";
        }
        if (this.onCellPointerOut != undefined) {
            this.onCellPointerOut(this, kind, column, row, e, points);
        }
    }
    doCellClick(kind, column, row, x, y, width, height, e, points) {
        if (CTime.now - this.__preClickTime < this.repeatClickTime) {
            this.doCellDblClick(kind, column, row, e, points);
        }
        this.__preClickTime = CTime.now;
        if (this.onCellClick != undefined) {
            this.onCellClick(this, kind, column, row, x, y, width, height, e, points);
        }
    }
    doCellDblClick(kind, column, row, e, points) {
        if (this.onCellDblClick != undefined) {
            this.onCellDblClick(this, kind, column, row, e, points);
        }
    }
    doCellDrag(cellInfo, alignInfo, e, points) { }
    doSetContentSize() {
        this.scrollMinX = 0;
        this.scrollMaxX = this.getContentWidth() - this.getBackgroundClientBounds().width;
        this.scrollBox.hScrollbar.enabled = this.getContentWidth() > this.getBackgroundClientBounds().width;
        this.scrollMinY = 0;
        this.scrollMaxY = this.getContentHeight() - this.getBackgroundClientBounds().height;
        this.scrollBox.vScrollbar.enabled = this.getContentHeight() > this.getBackgroundClientBounds().height;
        this.scrollBox.useHScrollbar = !this.gridInfo.useFitWidth;
        if (this.onSetContentSize != undefined) {
            this.onSetContentSize(this);
        }
    }
    doSetInnerSize() {
        this.doSetContentSize();
        super.doSetInnerSize();
    }
    doScrollBoxUpdate() {
        this.doSetBounds();
        super.doScrollBoxUpdate();
    }
    doChangeGridInfo(kind) {
        this.doSetBounds();
        this.doSetContentSize();
    }
    doSetBounds() {
        this.doSetHeaderBounds(this.getBackgroundHeaderBounds());
        this.doSetIndicatorBounds(this.getBackgroundIndicatorBounds());
        this.doSetTopFixBounds(this.getBackgroundTopFixBounds());
        this.doSetBottomFixBounds(this.getBackgroundBottomFixBounds());
        this.doSetLeftFixBounds(this.getBackgroundLeftFixBounds());
        this.doSetRightFixBounds(this.getBackgroundRightFixBounds());
        this.doSetClientFixBounds(this.getBackgroundClientBounds());
    }
    doSetHeaderBounds(bounds) {
        if (this.onSetHeaderBounds != undefined) {
            this.onSetHeaderBounds(this, bounds);
        }
    }
    doSetIndicatorBounds(bounds) {
        if (this.onSetIndicatorBounds != undefined) {
            this.onSetIndicatorBounds(this, bounds);
        }
    }
    doSetTopFixBounds(bounds) {
        if (this.onSetTopBounds != undefined) {
            this.onSetTopBounds(this, bounds);
        }
    }
    doSetBottomFixBounds(bounds) {
        if (this.onSetBottomBounds != undefined) {
            this.onSetBottomBounds(this, bounds);
        }
    }
    doSetLeftFixBounds(bounds) {
        if (this.onSetLeftBounds != undefined) {
            this.onSetLeftBounds(this, bounds);
        }
    }
    doSetRightFixBounds(bounds) {
        if (this.onSetRightBounds != undefined) {
            this.onSetRightBounds(this, bounds);
        }
    }
    doSetClientFixBounds(bounds) {
        if (this.onSetClientBounds != undefined) {
            this.onSetClientBounds(this, bounds);
        }
    }
    doCellsBounds() {
        if (this.gridInfo.columnCount > 0 || this.gridInfo.rowCount > 0) {
            let columnInfo = this.getBackgroundColumns();
            let rowInfo = this.getBackgroundRows();
            if (this.gridInfo.rowCount > 0)
                this.doClientCellsBounds(columnInfo, rowInfo);
            if (this.gridInfo.rowCount > 0)
                this.doLeftCellsBounds(rowInfo);
            if (this.gridInfo.rowCount > 0)
                this.doRightCellsBounds(rowInfo);
            this.doTopCellsBounds(columnInfo);
            this.doBottomCellsBounds(columnInfo);
            if (this.gridInfo.useHeader && this.gridInfo.columnCount > 0)
                this.doHeaderCellsBounds(columnInfo);
            if (this.gridInfo.useIndicator && this.gridInfo.rowCount > 0)
                this.doIndicatorCellsBounds(rowInfo);
            this.doBeforeHeaderButtomCellBounds(this.getBackgroundHeaderButtonBounds());
            let rt = this.getBackgroundHeaderButtonBounds();
            rt.right -= this.gridInfo.cellMargin;
            rt.bottom -= this.gridInfo.cellMargin;
            this.doHeaderButtonCellBounds(rt);
        }
    }
    doBeforeHeaderButtomCellBounds(bounds) { }
    doHeaderButtonCellBounds(bounds) { }
    doBeforeHeaderLeftFixCellBounds(leftFixBounds) { }
    doBeforeHeaderCellBounds(headerClientBounds) { }
    doBeforeHeaderRightFixCellBounds(rightFixBounds) { }
    doHeaderLeftFixCellBounds(col, row, bounds) { }
    doHeaderCellBounds(col, row, bounds, isMerge) { }
    doHeaderRightFixCellBounds(col, row, bounds) { }
    doHeaderCellsBounds(columnInfo) {
        let self = this;
        let headerRect = this.getBackgroundHeaderBounds();
        let headerLeft = CRect.copyFrom(headerRect);
        headerLeft.right = this.getBackgroundLeftFixBounds().right;
        let headerRight = CRect.copyFrom(headerRect);
        headerRight.left = this.getBackgroundRightFixBounds().left;
        let headerClient = CRect.copyFrom(headerRect);
        headerClient.left = headerLeft.right;
        headerClient.right = headerRight.left;
        //client
        this.doBeforeHeaderCellBounds(headerClient);
        for (let n = 0; n < columnInfo.area.length; n++) {
            for (let i = 0; i < this.gridInfo.headerCount; i++) {
                let pt = new CPoint(columnInfo.startIndex + n, i);
                let isMerge = "none";
                for (let x = 0; x < this.gridInfo.mergeHeaderCell.length; x++) {
                    let isDrawMerge = false;
                    function drawHeaderMerge(idx) {
                        let st = self.gridInfo.mergeHeaderCell.get(idx).startCell;
                        let ed = self.gridInfo.mergeHeaderCell.get(idx).stopCell;
                        let strt = self.getHeaderCellBounds(st.x, st.y);
                        let edrt = self.getHeaderCellBounds(ed.x, ed.y);
                        strt.offset(-self.scrollX, 0);
                        edrt.offset(-self.scrollX, 0);
                        self.doHeaderCellBounds(self.gridInfo.mergeHeaderCell.get(idx).startCell.x, self.gridInfo.mergeHeaderCell.get(idx).startCell.y, new CRect(headerClient.left + strt.left, headerClient.top + strt.top, headerClient.left + edrt.right - self.gridInfo.cellMargin, headerClient.top + edrt.bottom - self.gridInfo.cellMargin), true);
                        isDrawMerge = true;
                    }
                    if (this.gridInfo.mergeHeaderCell.get(x).startCell.equal(pt)) {
                        isMerge = "first";
                        drawHeaderMerge(x);
                    }
                    else if (this.gridInfo.mergeHeaderCell.get(x).stopCell.equal(pt)) {
                        isMerge = "last";
                        if (!isDrawMerge) {
                            drawHeaderMerge(x);
                        }
                    }
                    else if (this.gridInfo.mergeHeaderCell.get(x).isIn(pt)) {
                        isMerge = "merge";
                    }
                }
                if (isMerge == "merge" || isMerge == "first" || isMerge == "last") {
                    continue;
                }
                else {
                    let l = headerClient.left - columnInfo.left + columnInfo.area[n].left;
                    let t = headerClient.top + ((this.gridInfo.headerRowHeight + this.gridInfo.cellMargin) * i);
                    let r = headerClient.left - columnInfo.left + columnInfo.area[n].right - this.gridInfo.cellMargin;
                    let b = t + this.gridInfo.headerRowHeight;
                    this.doHeaderCellBounds(columnInfo.startIndex + n, i, new CRect(l, t, r, b), false);
                }
            }
        }
        //left
        let w = 0;
        this.doBeforeHeaderLeftFixCellBounds(headerLeft);
        for (let n = 0; n < this.gridInfo.fixLeft.length; n++) {
            /*머지전 for(let i = 0; i < this.gridInfo.headerCount; i++) {
                let l = headerLeft.left + w
                let t = headerLeft.top + ((this.gridInfo.headerRowHeight + this.gridInfo.cellMargin) * i)
                let r = headerLeft.left + this.gridInfo.fixLeft.get(n) + w
                let b = t + this.gridInfo.headerRowHeight
                this.doHeaderLeftFixCellBounds(n, i, new CRect(l, t, r, b))
            }*/
            let l = headerLeft.left + w;
            let t = 0;
            let r = headerLeft.left + this.gridInfo.fixLeft.get(n) + w;
            let b = t + ((this.gridInfo.headerRowHeight + this.gridInfo.cellMargin) * this.gridInfo.headerCount) - this.gridInfo.cellMargin;
            this.doHeaderLeftFixCellBounds(n, 0, new CRect(l, t, r, b));
            w += this.gridInfo.fixLeft.get(n) + this.gridInfo.cellMargin;
        }
        //right
        w = 0;
        this.doBeforeHeaderRightFixCellBounds(headerRight);
        for (let n = 0; n < this.gridInfo.fixRight.length; n++) {
            /*머지전 for(let i = 0; i < this.gridInfo.headerCount; i++) {
                let l = headerRight.left + w + this.gridInfo.cellMargin
                let t = headerRight.top + ((this.gridInfo.headerRowHeight + this.gridInfo.cellMargin) * i)
                let r = headerRight.left + this.gridInfo.fixRight.get(n) + w + this.gridInfo.cellMargin
                let b = t + this.gridInfo.headerRowHeight
                this.doHeaderRightFixCellBounds(n, i, new CRect(l, t, r, b))
            }*/
            let l = headerRight.left + w + this.gridInfo.cellMargin;
            let t = 0;
            let r = headerRight.left + this.gridInfo.fixRight.get(n) + w + this.gridInfo.cellMargin;
            let b = t + ((this.gridInfo.headerRowHeight + this.gridInfo.cellMargin) * this.gridInfo.headerCount) - this.gridInfo.cellMargin;
            this.doHeaderRightFixCellBounds(n, 0, new CRect(l, t, r, b));
            w += this.gridInfo.fixRight.get(n) + this.gridInfo.cellMargin;
        }
    }
    doBeforeIndicatorTopFixCellBounds(topFixBounds) { }
    doBeforeIndicatorCellBounds(indicatorClientBounds) { }
    doBeforeIndicatorBottomFixCellBounds(bottomFixBounds) { }
    doIndicatorTopFixCellBounds(row, bounds) { }
    doIndicatorCellBounds(row, bounds) { }
    doIndicatorBottomFixCellBounds(row, bounds) { }
    doIndicatorCellsBounds(rowInfo) {
        let ind = this.getBackgroundIndicatorBounds();
        let top = CRect.copyFrom(ind);
        top.bottom = this.getBackgroundTopFixBounds().bottom;
        let bottom = CRect.copyFrom(ind);
        bottom.top = this.getBackgroundBottomFixBounds().top;
        let client = CRect.copyFrom(ind);
        client.top = top.bottom;
        client.bottom = bottom.top;
        //client
        this.doBeforeIndicatorCellBounds(client);
        for (let n = 0; n < rowInfo.area.length; n++) {
            let l = client.left;
            let t = client.top - rowInfo.top + rowInfo.area[n].top;
            let r = client.right - this.gridInfo.cellMargin;
            let b = client.top - rowInfo.top + rowInfo.area[n].bottom - this.gridInfo.cellMargin;
            this.doIndicatorCellBounds(rowInfo.startIndex + n, new CRect(l, t, r, b));
        }
        //top
        let tt = 0;
        this.doBeforeIndicatorTopFixCellBounds(top);
        for (let n = 0; n < this.gridInfo.fixTop.length; n++) {
            let l = top.left;
            let t = top.top + tt;
            let r = top.right - this.gridInfo.cellMargin;
            let b = top.top + tt + this.gridInfo.fixTop.get(n);
            this.doIndicatorTopFixCellBounds(n, new CRect(l, t, r, b));
            tt += this.gridInfo.fixTop.get(n) + this.gridInfo.cellMargin;
        }
        //bottom
        tt = 0;
        this.doBeforeIndicatorBottomFixCellBounds(bottom);
        for (let n = 0; n < this.gridInfo.fixBottom.length; n++) {
            let l = bottom.left;
            let t = bottom.top + tt + this.gridInfo.cellMargin;
            let r = bottom.right - this.gridInfo.cellMargin;
            let b = bottom.top + tt + this.gridInfo.fixBottom.get(n) + this.gridInfo.cellMargin;
            this.doIndicatorBottomFixCellBounds(n, new CRect(l, t, r, b));
            tt += this.gridInfo.fixBottom.get(n) + this.gridInfo.cellMargin;
        }
    }
    doBeforeTopLeftFixCellBounds(leftFixBounds) { }
    doBeforeTopCellBounds(clientBounds) { }
    doBeforeTopRightFixCellBounds(rightFixBounds) { }
    doTopLeftFixCellBounds(col, row, bounds) { }
    doTopCellBounds(col, row, bounds, isMerge) { }
    doTopRightFixCellBounds(col, row, bounds) { }
    doTopCellsBounds(columnInfo) {
        let top = this.getBackgroundTopFixBounds();
        let left = CRect.copyFrom(top);
        left.right = this.getBackgroundLeftFixBounds().right;
        let right = CRect.copyFrom(top);
        right.left = this.getBackgroundRightFixBounds().left;
        let client = CRect.copyFrom(top);
        client.left = left.right;
        client.right = right.left;
        //client
        this.doBeforeTopCellBounds(client);
        for (let n = 0; n < columnInfo.area.length; n++) {
            let h = 0;
            for (let i = 0; i < this.gridInfo.fixTop.length; i++) {
                let l = client.left - columnInfo.left + columnInfo.area[n].left;
                let t = client.top + h;
                let r = client.left - columnInfo.left + columnInfo.area[n].right - this.gridInfo.cellMargin;
                let b = client.top + h + this.gridInfo.fixTop.get(i);
                this.doTopCellBounds(columnInfo.startIndex + n, i, new CRect(l, t, r, b), false);
                h += this.gridInfo.fixTop.get(i) + this.gridInfo.cellMargin;
            }
        }
        //left
        let w = 0;
        this.doBeforeTopLeftFixCellBounds(left);
        for (let n = 0; n < this.gridInfo.fixLeft.length; n++) {
            let h = 0;
            for (let i = 0; i < this.gridInfo.fixTop.length; i++) {
                let l = left.left + w;
                let t = left.top + h;
                let r = left.left + this.gridInfo.fixLeft.get(n) + w;
                let b = left.top + h + this.gridInfo.fixTop.get(i);
                this.doTopLeftFixCellBounds(n, i, new CRect(l, t, r, b));
                h += this.gridInfo.fixTop.get(i) + this.gridInfo.cellMargin;
            }
            w += this.gridInfo.fixLeft.get(n) + this.gridInfo.cellMargin;
        }
        //right
        w = 0;
        this.doBeforeTopRightFixCellBounds(right);
        for (let n = 0; n < this.gridInfo.fixRight.length; n++) {
            let h = 0;
            for (let i = 0; i < this.gridInfo.fixTop.length; i++) {
                let l = right.left + w + this.gridInfo.cellMargin;
                let t = right.top + h;
                let r = right.left + this.gridInfo.fixRight.get(n) + w + this.gridInfo.cellMargin;
                let b = right.top + this.gridInfo.fixTop.get(i) + h;
                this.doTopRightFixCellBounds(n, i, new CRect(l, t, r, b));
                h += this.gridInfo.fixTop.get(i) + this.gridInfo.cellMargin;
            }
            w += this.gridInfo.fixRight.get(n) + this.gridInfo.cellMargin;
        }
    }
    doBeforeBottomLeftFixCellBounds(leftFixBounds) { }
    doBeforeBottomCellBounds(clientBounds) { }
    doBeforeBottomRightFixCellBounds(rightFixBounds) { }
    doBottomLeftFixCellBounds(col, row, bounds) { }
    doBottomCellBounds(col, row, bounds, isMerge) { }
    doBottomRightFixCellBounds(col, row, bounds) { }
    doBottomCellsBounds(columnInfo) {
        let bottom = this.getBackgroundBottomFixBounds();
        let left = CRect.copyFrom(bottom);
        left.right = this.getBackgroundLeftFixBounds().right;
        let right = CRect.copyFrom(bottom);
        right.left = this.getBackgroundRightFixBounds().left;
        let client = CRect.copyFrom(bottom);
        client.left = left.right;
        client.right = right.left;
        //client
        this.doBeforeBottomCellBounds(client);
        for (let n = 0; n < columnInfo.area.length; n++) {
            let h = 0;
            for (let i = 0; i < this.gridInfo.fixBottom.length; i++) {
                let l = client.left - columnInfo.left + columnInfo.area[n].left;
                let t = client.top + h + this.gridInfo.cellMargin;
                let r = client.left - columnInfo.left + columnInfo.area[n].right - this.gridInfo.cellMargin;
                let b = client.top + h + this.gridInfo.fixBottom.get(i) + this.gridInfo.cellMargin;
                this.doBottomCellBounds(columnInfo.startIndex + n, i, new CRect(l, t, r, b), false);
                h += this.gridInfo.fixBottom.get(i) + this.gridInfo.cellMargin;
            }
        }
        //left
        let w = 0;
        this.doBeforeBottomLeftFixCellBounds(left);
        for (let n = 0; n < this.gridInfo.fixLeft.length; n++) {
            let h = 0;
            for (let i = 0; i < this.gridInfo.fixBottom.length; i++) {
                let l = left.left + w;
                let t = left.top + h + this.gridInfo.cellMargin;
                let r = left.left + this.gridInfo.fixLeft.get(n) + w;
                let b = left.top + h + this.gridInfo.fixBottom.get(i) + this.gridInfo.cellMargin;
                this.doBottomLeftFixCellBounds(n, i, new CRect(l, t, r, b));
                h += this.gridInfo.fixBottom.get(i) + this.gridInfo.cellMargin;
            }
            w += this.gridInfo.fixLeft.get(n) + this.gridInfo.cellMargin;
        }
        //right
        w = 0;
        this.doBeforeBottomRightFixCellBounds(right);
        for (let n = 0; n < this.gridInfo.fixRight.length; n++) {
            let h = 0;
            for (let i = 0; i < this.gridInfo.fixBottom.length; i++) {
                let l = right.left + w + this.gridInfo.cellMargin;
                let t = right.top + h + this.gridInfo.cellMargin;
                let r = right.left + this.gridInfo.fixRight.get(n) + w + this.gridInfo.cellMargin;
                let b = right.top + this.gridInfo.fixBottom.get(i) + h + this.gridInfo.cellMargin;
                this.doBottomRightFixCellBounds(n, i, new CRect(l, t, r, b));
                h += this.gridInfo.fixBottom.get(i) + this.gridInfo.cellMargin;
            }
            w += this.gridInfo.fixRight.get(n) + this.gridInfo.cellMargin;
        }
    }
    doBeforeLeftCellBounds(clientBounds) { }
    doLeftCellBounds(col, row, bounds) { }
    doLeftCellsBounds(rowInfo) {
        let left = this.getBackgroundLeftFixBounds();
        this.doBeforeLeftCellBounds(left);
        for (let n = 0; n < rowInfo.area.length; n++) {
            let w = 0;
            for (let i = 0; i < this.gridInfo.fixLeft.length; i++) {
                let l = left.left + w;
                let t = left.top - rowInfo.top + rowInfo.area[n].top;
                let r = left.left + w + this.gridInfo.fixLeft.get(i);
                let b = left.top - rowInfo.top + rowInfo.area[n].bottom - this.gridInfo.cellMargin;
                this.doLeftCellBounds(i, rowInfo.startIndex + n, new CRect(l, t, r, b));
                w += this.gridInfo.fixLeft.get(i) + this.gridInfo.cellMargin;
            }
        }
    }
    doBeforeRightCellBounds(clientBounds) { }
    doRightCellBounds(col, row, bounds) { }
    doRightCellsBounds(rowInfo) {
        let right = this.getBackgroundRightFixBounds();
        this.doBeforeRightCellBounds(right);
        for (let n = 0; n < rowInfo.area.length; n++) {
            let w = 0;
            for (let i = 0; i < this.gridInfo.fixRight.length; i++) {
                let l = right.left + w + this.gridInfo.cellMargin;
                let t = right.top - rowInfo.top + rowInfo.area[n].top;
                let r = right.left + w + this.gridInfo.fixRight.get(i) + this.gridInfo.cellMargin;
                let b = right.top - rowInfo.top + rowInfo.area[n].bottom - this.gridInfo.cellMargin;
                this.doRightCellBounds(i, rowInfo.startIndex + n, new CRect(l, t, r, b));
                w += this.gridInfo.fixRight.get(i) + this.gridInfo.cellMargin;
            }
        }
    }
    doBeforeClientCellBounds(clientBounds) { }
    doClientCellBounds(col, row, bounds, isMerge) { }
    doClientCellsBounds(columnInfo, rowInfo) {
        let client = this.getBackgroundClientBounds();
        let self = this;
        //client
        this.doBeforeClientCellBounds(client);
        for (let n = 0; n < columnInfo.area.length; n++) {
            for (let i = 0; i < rowInfo.area.length; i++) {
                let pt = new CPoint(columnInfo.startIndex + n, rowInfo.startIndex + i);
                let isMerge = "none";
                for (let x = 0; x < this.gridInfo.mergeCell.length; x++) {
                    let isBounds = false;
                    function boundsMerge(idx) {
                        let st = self.gridInfo.mergeCell.get(idx).startCell;
                        let ed = self.gridInfo.mergeCell.get(idx).stopCell;
                        let strt = self.getCellBounds(st.x, st.y);
                        let edrt = self.getCellBounds(ed.x, ed.y);
                        strt.offset(-self.scrollX, -self.scrollY);
                        edrt.offset(-self.scrollX, -self.scrollY);
                        self.doClientCellBounds(self.gridInfo.mergeCell.get(idx).startCell.x, self.gridInfo.mergeCell.get(idx).startCell.y, new CRect(client.left + strt.left, client.top + strt.top, client.left + edrt.right - self.gridInfo.cellMargin, client.top + edrt.bottom - self.gridInfo.cellMargin), true);
                        isBounds = true;
                    }
                    if (this.gridInfo.mergeCell.get(x).startCell.equal(pt)) {
                        isMerge = "first";
                        boundsMerge(x);
                    }
                    else if (this.gridInfo.mergeCell.get(x).stopCell.equal(pt)) {
                        isMerge = "last";
                        if (!isBounds) {
                            boundsMerge(x);
                        }
                    }
                    else if (this.gridInfo.mergeCell.get(x).isIn(pt)) {
                        isMerge = "merge";
                        if (!isBounds) {
                            boundsMerge(x);
                        }
                    }
                }
                if (isMerge == "merge" || isMerge == "first" || isMerge == "last") {
                    continue;
                }
                else {
                    let l = client.left - columnInfo.left + columnInfo.area[n].left;
                    let t = client.top - rowInfo.top + rowInfo.area[i].top;
                    let r = client.left - columnInfo.left + columnInfo.area[n].right - this.gridInfo.cellMargin;
                    let b = client.top - rowInfo.top + rowInfo.area[i].bottom - this.gridInfo.cellMargin;
                    this.doClientCellBounds(columnInfo.startIndex + n, rowInfo.startIndex + i, new CRect(l, t, r, b), false);
                }
            }
        }
    }
    doKeyDown(e) {
        super.doKeyDown(e);
        if (e.key == "End") {
            this.scrollY = this.scrollMaxY;
        }
        if (e.key == "Home") {
            this.scrollY = this.scrollMinY;
        }
        if (e.key == "PageDown") {
            this.scrollY += this.getBackgroundClientBounds().height;
        }
        if (e.key == "PageUp") {
            this.scrollY -= this.getBackgroundClientBounds().height;
        }
    }
    getColumnArea(idx) {
        if (this.gridInfo.diffColumnSize.size == 0) {
            return {
                left: idx * (this.gridInfo.defaultColumnWidth + this.gridInfo.cellMargin),
                right: (idx + 1) * (this.gridInfo.defaultColumnWidth + this.gridInfo.cellMargin)
            };
        }
        else {
            let pc = this.getPreviousDiffColumns(idx);
            let r = (this.gridInfo.defaultColumnWidth * (idx + 1 - pc.columns.length)) + pc.totalWidth + (this.gridInfo.cellMargin * (idx + 1));
            let dc = this.gridInfo.diffColumnSize.get(idx);
            if (dc != undefined) {
                return {
                    left: r - this.gridInfo.cellMargin - dc,
                    right: r
                };
            }
            else {
                return {
                    left: r - this.gridInfo.cellMargin - this.gridInfo.defaultColumnWidth,
                    right: r
                };
            }
        }
    }
    getRowArea(idx) {
        if (this.gridInfo.diffRowSize.size == 0) {
            return {
                top: idx * (this.gridInfo.defaultRowHeight + this.gridInfo.cellMargin),
                bottom: (idx + 1) * (this.gridInfo.defaultRowHeight + this.gridInfo.cellMargin)
            };
        }
        else {
            let pr = this.getPreviousDiffRows(idx);
            let b = (this.gridInfo.defaultRowHeight * (idx + 1 - pr.rows.length)) + pr.totalHeight + (this.gridInfo.cellMargin * (idx + 1));
            let dr = this.gridInfo.diffRowSize.get(idx);
            if (dr != undefined) {
                return {
                    top: b - this.gridInfo.cellMargin - dr,
                    bottom: b
                };
            }
            else {
                return {
                    top: b - this.gridInfo.cellMargin - this.gridInfo.defaultRowHeight,
                    bottom: b
                };
            }
        }
    }
    xToColumn(x) {
        if (x >= 0) {
            if (this.gridInfo.useFitWidth) {
                let ci = this.getBackgroundColumns();
                let rt = { index: -1, left: 0, isMargin: false };
                for (let n = 0; n < ci.area.length; n++) {
                    if (x >= ci.area[n].left && x < ci.area[n].right - this.gridInfo.cellMargin) {
                        rt.index = n;
                        rt.left = 0;
                        rt.isMargin = false;
                        break;
                    }
                    else if (x >= ci.area[n].right - this.gridInfo.cellMargin && x < ci.area[n].right) {
                        rt.index = n;
                        rt.left = 0;
                        rt.isMargin = true;
                        break;
                    }
                }
                return rt;
            }
            else {
                let stidx = Math.floor(x / (this.gridInfo.defaultColumnWidth + this.gridInfo.cellMargin));
                let ca = this.getColumnArea(stidx);
                if (this.gridInfo.diffColumnSize.size == 0) {
                    return { index: stidx, left: x - ca.left, isMargin: x >= ca.right - this.gridInfo.cellMargin && x < ca.right };
                }
                else {
                    if (x < ca.left) {
                        let i = stidx - 1;
                        let left = 0;
                        let isMargin = false;
                        while (true) {
                            let caa = this.getColumnArea(i);
                            if (x >= caa.left && x < caa.right) {
                                left = x - caa.left;
                                isMargin = x >= caa.right - this.gridInfo.cellMargin && x < caa.right;
                                break;
                            }
                            i--;
                        }
                        return { index: i, left: left, isMargin: isMargin };
                    }
                    else if (x >= ca.right) {
                        let i = stidx + 1;
                        let left = 0;
                        let isMargin = false;
                        while (true) {
                            let caa = this.getColumnArea(i);
                            if (x >= caa.left && x < caa.right) {
                                left = x - caa.left;
                                isMargin = x >= caa.right - this.gridInfo.cellMargin && x < caa.right;
                                break;
                            }
                            i++;
                        }
                        return { index: i, left: left, isMargin: isMargin };
                    }
                    else {
                        return { index: stidx, left: x - ca.left, isMargin: x >= ca.right - this.gridInfo.cellMargin && x < ca.right };
                    }
                }
            }
        }
        else {
            return { index: -1, left: 0, isMargin: false };
        }
    }
    yToRow(y) {
        if (y >= 0) {
            let stidx = Math.floor(y / (this.gridInfo.defaultRowHeight + this.gridInfo.cellMargin));
            let ra = this.getRowArea(stidx);
            if (this.gridInfo.diffRowSize.size == 0) {
                return { index: stidx, top: y - ra.top, isMargin: y >= ra.bottom - this.gridInfo.cellMargin && y < ra.bottom };
            }
            else {
                if (y < ra.top) {
                    let i = stidx - 1;
                    let top = 0;
                    let isMargin = false;
                    while (true) {
                        let raa = this.getRowArea(i);
                        if (y >= raa.top && y < raa.bottom) {
                            top = y - raa.top;
                            isMargin = y >= raa.bottom - this.gridInfo.cellMargin && y < raa.bottom;
                            break;
                        }
                        i--;
                    }
                    return { index: i, top: top, isMargin: isMargin };
                }
                else if (y >= ra.bottom) {
                    let i = stidx + 1;
                    let top = 0;
                    let isMargin = false;
                    while (true) {
                        let raa = this.getRowArea(i);
                        if (y >= raa.top && y < raa.bottom) {
                            top = y - raa.top;
                            isMargin = y >= raa.bottom - this.gridInfo.cellMargin && y < raa.bottom;
                            break;
                        }
                        i++;
                    }
                    return { index: i, top: top, isMargin: isMargin };
                }
                else {
                    return { index: stidx, top: y - ra.top, isMargin: y >= ra.bottom - this.gridInfo.cellMargin && y < ra.bottom };
                }
            }
        }
        else {
            return { index: -1, top: 0, isMargin: false };
        }
    }
    yToHeaderRow(y) {
        let stidx = Math.floor(y / (this.gridInfo.headerRowHeight + this.gridInfo.cellMargin));
        let ra = {
            top: stidx * (this.gridInfo.headerRowHeight + this.gridInfo.cellMargin),
            bottom: (stidx + 1) * (this.gridInfo.headerRowHeight + this.gridInfo.cellMargin)
        };
        return { index: stidx, top: y - ra.top, isMargin: y >= ra.bottom - this.gridInfo.cellMargin && y < ra.bottom };
    }
    getPreviousDiffColumns(index) {
        let rt = { totalWidth: 0, columns: new Array() };
        this.gridInfo.diffColumnSize.forEach(function (width, idx) {
            if (idx <= index) {
                rt.totalWidth += width;
                rt.columns.push({ index: idx, width: width });
            }
        });
        return rt;
    }
    getPreviousDiffRows(index) {
        let rt = { totalHeight: 0, rows: new Array() };
        this.gridInfo.diffRowSize.forEach(function (height, idx) {
            if (idx <= index) {
                rt.totalHeight += height;
                rt.rows.push({ index: idx, height: height });
            }
        });
        return rt;
    }
    getBackgroundHeaderButtonBounds() {
        if (this.gridInfo.useHeader) {
            if (this.gridInfo.useIndicator) {
                return new CRect(0, 0, this.gridInfo.indicatorWidth + this.gridInfo.cellMargin, (this.gridInfo.headerRowHeight * this.gridInfo.headerCount) + (this.gridInfo.cellMargin * this.gridInfo.headerCount));
            }
            else {
                return new CRect(0, 0, this.gridInfo.cellMargin, (this.gridInfo.headerRowHeight * this.gridInfo.headerCount) + (this.gridInfo.cellMargin * this.gridInfo.headerCount));
            }
        }
        else {
            return new CRect(0, 0, this.gridInfo.cellMargin, this.gridInfo.cellMargin);
        }
    }
    getBackgroundHeaderBounds() {
        let l = 0;
        if (this.gridInfo.useIndicator) {
            l = this.gridInfo.indicatorWidth + this.gridInfo.cellMargin;
        }
        if (this.gridInfo.useHeader) {
            return new CRect(l, 0, this.scrollBox.background.position.width, (this.gridInfo.headerRowHeight * this.gridInfo.headerCount) + (this.gridInfo.cellMargin * this.gridInfo.headerCount));
        }
        else {
            return new CRect(l, 0, this.scrollBox.background.position.width, this.gridInfo.cellMargin);
        }
    }
    getBackgroundIndicatorBounds() {
        if (this.gridInfo.useIndicator) {
            return new CRect(0, this.getBackgroundHeaderBounds().height, this.gridInfo.indicatorWidth + this.gridInfo.cellMargin, this.scrollBox.background.position.height);
        }
        else {
            return new CRect(0, this.getBackgroundHeaderBounds().height, this.gridInfo.cellMargin, this.scrollBox.background.position.height);
        }
    }
    getBackgroundTopFixBounds() {
        let rt = CRect.newEmpty();
        if (this.gridInfo.fixTop.length == 0) {
            rt.left = this.getBackgroundIndicatorBounds().width;
            rt.top = this.getBackgroundHeaderBounds().height;
            rt.right = this.scrollBox.background.position.width;
            rt.bottom = this.getBackgroundHeaderBounds().height;
        }
        else {
            let h = 0;
            for (let n = 0; n < this.gridInfo.fixTop.length; n++) {
                h += this.gridInfo.fixTop.get(n);
            }
            rt.left = this.getBackgroundIndicatorBounds().width;
            rt.top = this.getBackgroundHeaderBounds().height;
            rt.right = this.scrollBox.background.position.width;
            rt.bottom = this.getBackgroundHeaderBounds().height + h + (this.gridInfo.cellMargin * this.gridInfo.fixTop.length);
        }
        return rt;
    }
    getBackgroundLeftFixBounds() {
        let rt = CRect.newEmpty();
        if (this.gridInfo.fixLeft.length == 0) {
            rt.left = this.getBackgroundIndicatorBounds().width;
            rt.top = this.getBackgroundHeaderBounds().height + this.getBackgroundTopFixBounds().height;
            rt.right = this.getBackgroundIndicatorBounds().width;
            rt.bottom = this.scrollBox.background.position.height - this.getBackgroundBottomFixBounds().height;
        }
        else {
            let w = 0;
            for (let n = 0; n < this.gridInfo.fixLeft.length; n++) {
                w += this.gridInfo.fixLeft.get(n);
            }
            rt.left = this.getBackgroundIndicatorBounds().width;
            rt.top = this.getBackgroundHeaderBounds().height + this.getBackgroundTopFixBounds().height;
            rt.right = this.getBackgroundIndicatorBounds().width + w + (this.gridInfo.cellMargin * this.gridInfo.fixLeft.length);
            rt.bottom = this.scrollBox.background.position.height - this.getBackgroundBottomFixBounds().height;
        }
        return rt;
    }
    getBackgroundRightFixBounds() {
        let rt = CRect.newEmpty();
        if (this.gridInfo.fixRight.length == 0) {
            rt.left = this.scrollBox.background.position.width;
            rt.top = this.getBackgroundHeaderBounds().height + this.getBackgroundTopFixBounds().height;
            rt.right = this.scrollBox.background.position.width;
            rt.bottom = this.scrollBox.background.position.height - this.getBackgroundBottomFixBounds().height;
        }
        else {
            let w = 0;
            for (let n = 0; n < this.gridInfo.fixRight.length; n++) {
                w += this.gridInfo.fixRight.get(n);
            }
            rt.left = this.scrollBox.background.position.width - w - (this.gridInfo.cellMargin * this.gridInfo.fixRight.length);
            rt.top = this.getBackgroundHeaderBounds().height + this.getBackgroundTopFixBounds().height;
            rt.right = this.scrollBox.background.position.width;
            rt.bottom = this.scrollBox.background.position.height - this.getBackgroundBottomFixBounds().height;
        }
        return rt;
    }
    getBackgroundBottomFixBounds() {
        let rt = CRect.newEmpty();
        if (this.gridInfo.fixBottom.length == 0) {
            rt.left = this.getBackgroundIndicatorBounds().width;
            rt.top = this.scrollBox.background.position.height;
            rt.right = this.scrollBox.background.position.width;
            rt.bottom = this.scrollBox.background.position.height;
        }
        else {
            let h = 0;
            for (let n = 0; n < this.gridInfo.fixBottom.length; n++) {
                h += this.gridInfo.fixBottom.get(n);
            }
            rt.left = this.getBackgroundIndicatorBounds().width;
            rt.top = this.scrollBox.background.position.height - h - (this.gridInfo.cellMargin * this.gridInfo.fixBottom.length);
            rt.right = this.scrollBox.background.position.width;
            rt.bottom = this.scrollBox.background.position.height;
        }
        return rt;
    }
    getBackgroundClientBounds() {
        return new CRect(this.getBackgroundLeftFixBounds().right, this.getBackgroundTopFixBounds().bottom, this.scrollBox.background.position.width - this.getBackgroundRightFixBounds().width, this.scrollBox.background.position.height - this.getBackgroundBottomFixBounds().height);
    }
    getBackgroundAllClientBounds() {
        let l = this.getBackgroundLeftFixBounds();
        let t = this.getBackgroundTopFixBounds();
        let r = this.getBackgroundRightFixBounds();
        let b = this.getBackgroundBottomFixBounds();
        return new CRect(l.left, t.top, r.right, b.bottom);
    }
    getContentWidth() {
        let pc = this.getPreviousDiffColumns(this.gridInfo.columnCount - 1);
        return (this.gridInfo.defaultColumnWidth * (this.gridInfo.columnCount - pc.columns.length)) +
            pc.totalWidth +
            (this.gridInfo.cellMargin * this.gridInfo.columnCount) -
            this.gridInfo.cellMargin;
    }
    getContentHeight() {
        let pr = this.getPreviousDiffRows(this.gridInfo.rowCount - 1);
        return (this.gridInfo.defaultRowHeight * (this.gridInfo.rowCount - pr.rows.length)) +
            pr.totalHeight +
            (this.gridInfo.cellMargin * this.gridInfo.rowCount) -
            this.gridInfo.cellMargin;
    }
    getCellBounds(columnIndex, rowIndex) {
        let rt = new CRect();
        if (columnIndex >= 0 && rowIndex >= 0) {
            let pc = this.getPreviousDiffColumns(columnIndex);
            if (this.gridInfo.useFitWidth) {
                let ci = this.getBackgroundColumns();
                rt.left = ci.area[columnIndex].left;
                rt.right = ci.area[columnIndex].right;
            }
            else {
                rt.right = (this.gridInfo.defaultColumnWidth * (columnIndex + 1 - pc.columns.length)) + pc.totalWidth + (this.gridInfo.cellMargin * (columnIndex + 1));
                let df = this.gridInfo.diffColumnSize.get(columnIndex);
                if (df == undefined) {
                    rt.left = rt.right - this.gridInfo.defaultColumnWidth - this.gridInfo.cellMargin;
                }
                else {
                    rt.left = rt.right - df - this.gridInfo.cellMargin;
                }
            }
            let pr = this.getPreviousDiffRows(rowIndex);
            rt.bottom = (this.gridInfo.defaultRowHeight * (rowIndex + 1 - pr.rows.length)) + pr.totalHeight + (this.gridInfo.cellMargin * (rowIndex + 1));
            let df = this.gridInfo.diffRowSize.get(rowIndex);
            if (df == undefined) {
                rt.top = rt.bottom - this.gridInfo.defaultRowHeight - this.gridInfo.cellMargin;
            }
            else {
                rt.top = rt.bottom - df - this.gridInfo.cellMargin;
            }
        }
        return rt;
    }
    getHeaderCellBounds(columnIndex, rowIndex) {
        let rt = new CRect();
        let pc = this.getPreviousDiffColumns(columnIndex);
        if (this.gridInfo.useFitWidth) {
            let ci = this.getBackgroundColumns();
            rt.left = ci.area[columnIndex].left;
            rt.right = ci.area[columnIndex].right;
        }
        else {
            rt.right = (this.gridInfo.defaultColumnWidth * (columnIndex + 1 - pc.columns.length)) + pc.totalWidth + (this.gridInfo.cellMargin * (columnIndex + 1));
            let df = this.gridInfo.diffColumnSize.get(columnIndex);
            if (df == undefined) {
                rt.left = rt.right - this.gridInfo.defaultColumnWidth - this.gridInfo.cellMargin;
            }
            else {
                rt.left = rt.right - df - this.gridInfo.cellMargin;
            }
        }
        rt.bottom = (this.gridInfo.headerRowHeight * (rowIndex + 1)) + (this.gridInfo.cellMargin * (rowIndex + 1));
        rt.top = rt.bottom - this.gridInfo.headerRowHeight - this.gridInfo.cellMargin;
        return rt;
    }
    getBackgroundColumns() {
        if (this.gridInfo.useFitWidth) {
            let pc = this.getPreviousDiffColumns(this.gridInfo.columnCount - 1);
            let w = this.getBackgroundClientBounds().width - pc.totalWidth - (this.gridInfo.cellMargin * (this.gridInfo.columnCount - 1));
            w /= this.gridInfo.columnCount - pc.columns.length;
            let arr = new Array();
            let ww = 0;
            for (let n = 0; n < this.gridInfo.columnCount; n++) {
                let diff = this.gridInfo.diffColumnSize.get(n);
                if (diff == undefined) {
                    arr.push({ left: ww, right: ww + w + this.gridInfo.cellMargin });
                    ww += w + this.gridInfo.cellMargin;
                }
                else {
                    arr.push({ left: ww, right: ww + diff + this.gridInfo.cellMargin });
                    ww += diff + this.gridInfo.cellMargin;
                }
            }
            return { startIndex: 0, left: 0, area: arr };
        }
        else {
            let pc = this.xToColumn(this.scrollX);
            let idx = pc.index;
            let w = 0;
            let tw = 0;
            let arr = new Array();
            while (true) {
                let df = this.gridInfo.diffColumnSize.get(idx);
                if (df == undefined) {
                    w = this.gridInfo.defaultColumnWidth + this.gridInfo.cellMargin;
                }
                else {
                    w = df + this.gridInfo.cellMargin;
                }
                arr.push({ left: tw, right: tw + w });
                tw += w;
                if (this.getBackgroundClientBounds().width < tw - pc.left || this.gridInfo.columnCount - 1 <= idx) {
                    break;
                }
                idx++;
            }
            return { startIndex: pc.index, left: pc.left, area: arr };
        }
    }
    getBackgroundRows() {
        let pr = this.yToRow(this.scrollY);
        let idx = pr.index;
        let h = 0;
        let th = 0;
        let arr = new Array();
        while (true) {
            let df = this.gridInfo.diffRowSize.get(idx);
            if (df == undefined) {
                h = this.gridInfo.defaultRowHeight + this.gridInfo.cellMargin;
            }
            else {
                h = df + this.gridInfo.cellMargin;
            }
            arr.push({ top: th, bottom: th + h });
            th += h;
            if (this.getBackgroundClientBounds().height < th - pr.top || this.gridInfo.rowCount - 1 <= idx) {
                break;
            }
            idx++;
        }
        return { startIndex: pr.index, top: pr.top, area: arr };
    }
    clearDiffColumns() {
        this.gridInfo.diffColumnSize.clear();
    }
    clearDiffRows() {
        this.gridInfo.diffRowSize.clear();
    }
    clearDiff() {
        this.clearDiffColumns();
        this.clearDiffRows();
    }
    getMergeCell(column, row) {
        let x = column;
        let y = row;
        for (let n = 0; n < this.gridInfo.mergeCell.length; n++) {
            if (this.gridInfo.mergeCell.get(n).isIn(new CPoint(column, row))) {
                x = this.gridInfo.mergeCell.get(n).startCell.x;
                y = this.gridInfo.mergeCell.get(n).startCell.y;
                break;
            }
        }
        return { column: x, row: y };
    }
    getHeaderMergeCell(column, row) {
        let x = column;
        let y = row;
        for (let n = 0; n < this.gridInfo.mergeHeaderCell.length; n++) {
            if (this.gridInfo.mergeHeaderCell.get(n).isIn(new CPoint(column, row))) {
                x = this.gridInfo.mergeHeaderCell.get(n).startCell.x;
                y = this.gridInfo.mergeHeaderCell.get(n).startCell.y;
                break;
            }
        }
        return { column: x, row: y };
    }
    addProperties() {
        let arr = super.addProperties();
        arr.push({ instance: this.scrollbarResource, propertyName: "scrollbarResource", readOnly: false, enum: [] });
        arr.push({ instance: this.scrollbarLength, propertyName: "scrollbarLength", readOnly: false, enum: [] });
        return arr;
    }
}
var ECellControlAlign;
(function (ECellControlAlign) {
    ECellControlAlign[ECellControlAlign["LEFT"] = 0] = "LEFT";
    ECellControlAlign[ECellControlAlign["CLIENT"] = 1] = "CLIENT";
    ECellControlAlign[ECellControlAlign["RIGHT"] = 2] = "RIGHT";
})(ECellControlAlign || (ECellControlAlign = {}));
class CCellControl extends CNotifyChangeKindObject {
    get canvasItemsData() {
        return this._canvasItemsData;
    }
    get align() {
        return this._align;
    }
    set align(value) {
        if (this._align != value) {
            this._align = value;
            this.doChange("align");
        }
    }
    get margins() {
        return this._margins;
    }
    get width() {
        return this._width;
    }
    set width(value) {
        if (this._width != value) {
            this._width = value;
            this.doChange("width");
        }
    }
    get controlCanvasItemsResource() {
        return this._controlCanvasItemsResource;
    }
    set controlCanvasItemsResource(value) {
        if (this._controlCanvasItemsResource != value) {
            this._controlCanvasItemsResource = value;
            let rc = CSystem.resources.get(this._controlCanvasItemsResource);
            if (rc != undefined) {
                this.canvasItemsData.fromData(rc);
            }
            this.doChange("controlCanvasItemsResource");
        }
    }
    get text() {
        return this._text;
    }
    set text(value) {
        if (this._text != value) {
            this._text = value;
            this.doChange("text");
        }
    }
    get isOver() {
        return this._isOver;
    }
    set isOver(value) {
        if (this._isOver != value) {
            this._isOver = value;
            this.doChange("isOver");
        }
    }
    constructor() {
        super();
        this._canvasItemsData = new CCanvasItems();
        this._align = ECellControlAlign.RIGHT;
        //protected _checked = false
        this._width = 30;
        this._margins = new CNotifyRect();
        this._controlCanvasItemsResource = "";
        this._name = "";
        this._text = "";
        this._isOver = false;
        this.col = -1;
        this.row = -1;
        this.bounds = new CRect();
        let self = this;
        this.margins.onChange = function () {
            self.doChange("margins");
        };
    }
}
class CCustumCanvasGrid extends CCustomGrid {
    get cellTopLeftFixResource() {
        return this._cellTopLeftFixResource;
    }
    set cellTopLeftFixResource(value) {
        this._cellTopLeftFixResource = value;
        this.__cellTopLeftFixData = [];
        for (let n = 0; n < value.length; n++) {
            let data = CSystem.resources.get(value[n]);
            if (data != undefined) {
                let i = new CCanvasItems();
                i.fromData(data);
                this.__cellTopLeftFixData.push(i);
            }
        }
        this.itemLayerDraw();
    }
    get cellTopResource() {
        return this._cellTopResource;
    }
    set cellTopResource(value) {
        this._cellTopResource = value;
        this.__cellTopData = [];
        for (let n = 0; n < value.length; n++) {
            let data = CSystem.resources.get(value[n]);
            if (data != undefined) {
                let i = new CCanvasItems();
                i.fromData(data);
                this.__cellTopData.push(i);
            }
        }
        this.itemLayerDraw();
    }
    get cellTopRightFixResource() {
        return this._cellTopRightFixResource;
    }
    set cellTopRightFixResource(value) {
        this._cellTopRightFixResource = value;
        this.__cellTopRightFixData = [];
        for (let n = 0; n < value.length; n++) {
            let data = CSystem.resources.get(value[n]);
            if (data != undefined) {
                let i = new CCanvasItems();
                i.fromData(data);
                this.__cellTopRightFixData.push(i);
            }
        }
        this.itemLayerDraw();
    }
    get cellBottomLeftFixResource() {
        return this._cellBottomLeftFixResource;
    }
    set cellBottomLeftFixResource(value) {
        this._cellBottomLeftFixResource = value;
        this.__cellBottomLeftFixData = [];
        for (let n = 0; n < value.length; n++) {
            let data = CSystem.resources.get(value[n]);
            if (data != undefined) {
                let i = new CCanvasItems();
                i.fromData(data);
                this.__cellBottomLeftFixData.push(i);
            }
        }
        this.itemLayerDraw();
    }
    get cellBottomResource() {
        return this._cellBottomResource;
    }
    set cellBottomResource(value) {
        this._cellBottomResource = value;
        this.__cellBottomData = [];
        for (let n = 0; n < value.length; n++) {
            let data = CSystem.resources.get(value[n]);
            if (data != undefined) {
                let i = new CCanvasItems();
                i.fromData(data);
                this.__cellBottomData.push(i);
            }
        }
        this.itemLayerDraw();
    }
    get cellBottomRightFixResource() {
        return this._cellBottomRightFixResource;
    }
    set cellBottomRightFixResource(value) {
        this._cellBottomRightFixResource = value;
        this.__cellBottomRightFixData = [];
        for (let n = 0; n < value.length; n++) {
            let data = CSystem.resources.get(value[n]);
            if (data != undefined) {
                let i = new CCanvasItems();
                i.fromData(data);
                this.__cellBottomRightFixData.push(i);
            }
        }
        this.itemLayerDraw();
    }
    get cellLeftFixResource() {
        return this._cellLeftFixResource;
    }
    set cellLeftFixResource(value) {
        this._cellLeftFixResource = value;
        this.__cellLeftFixData = [];
        for (let n = 0; n < value.length; n++) {
            let data = CSystem.resources.get(value[n]);
            if (data != undefined) {
                let i = new CCanvasItems();
                i.fromData(data);
                this.__cellLeftFixData.push(i);
            }
        }
        this.itemLayerDraw();
    }
    get cellRightFixResource() {
        return this._cellRightFixResource;
    }
    set cellRightFixResource(value) {
        this._cellRightFixResource = value;
        this.__cellRightFixData = [];
        for (let n = 0; n < value.length; n++) {
            let data = CSystem.resources.get(value[n]);
            if (data != undefined) {
                let i = new CCanvasItems();
                i.fromData(data);
                this.__cellRightFixData.push(i);
            }
        }
        this.itemLayerDraw();
    }
    get cellResource() {
        return this._cellResource;
    }
    set cellResource(value) {
        this._cellResource = value;
        this.__cellData = [];
        for (let n = 0; n < value.length; n++) {
            let data = CSystem.resources.get(value[n]);
            if (data != undefined) {
                let i = new CCanvasItems();
                i.fromData(data);
                this.__cellData.push(i);
            }
        }
        this.itemLayerDraw();
    }
    get headerLeftFixResource() {
        return this._headerLeftFixResource;
    }
    set headerLeftFixResource(value) {
        this._headerLeftFixResource = value;
        this.__headerLeftFixData = [];
        for (let n = 0; n < value.length; n++) {
            let data = CSystem.resources.get(value[n]);
            if (data != undefined) {
                let i = new CCanvasItems();
                i.fromData(data);
                this.__headerLeftFixData.push(i);
            }
        }
        this.itemLayerDraw();
    }
    get headerResource() {
        return this._headerResource;
    }
    set headerResource(value) {
        this._headerResource = value;
        this.__headerData = [];
        for (let n = 0; n < value.length; n++) {
            let data = CSystem.resources.get(value[n]);
            if (data != undefined) {
                let i = new CCanvasItems();
                i.fromData(data);
                this.__headerData.push(i);
            }
        }
        this.itemLayerDraw();
    }
    get headerRightFixResource() {
        return this._headerRightFixResource;
    }
    set headerRightFixResource(value) {
        this._headerRightFixResource = value;
        this.__headerRightFixData = [];
        for (let n = 0; n < value.length; n++) {
            let data = CSystem.resources.get(value[n]);
            if (data != undefined) {
                let i = new CCanvasItems();
                i.fromData(data);
                this.__headerRightFixData.push(i);
            }
        }
        this.itemLayerDraw();
    }
    get indicatorTopFixResource() {
        return this._indicatorTopFixResource;
    }
    set indicatorTopFixResource(value) {
        this._indicatorTopFixResource = value;
        this.__indicatorTopFixData = [];
        for (let n = 0; n < value.length; n++) {
            let data = CSystem.resources.get(value[n]);
            if (data != undefined) {
                let i = new CCanvasItems();
                i.fromData(data);
                this.__indicatorTopFixData.push(i);
            }
        }
        this.itemLayerDraw();
    }
    get indicatorResource() {
        return this._indicatorResource;
    }
    set indicatorResource(value) {
        this._indicatorResource = value;
        this.__indicatorData = [];
        for (let n = 0; n < value.length; n++) {
            let data = CSystem.resources.get(value[n]);
            if (data != undefined) {
                let i = new CCanvasItems();
                i.fromData(data);
                this.__indicatorData.push(i);
            }
        }
        this.itemLayerDraw();
    }
    get indicatorBottomFixResource() {
        return this._indicatorBottomFixResource;
    }
    set indicatorBottomFixResource(value) {
        this._indicatorBottomFixResource = value;
        this.__indicatorBottomFixData = [];
        for (let n = 0; n < value.length; n++) {
            let data = CSystem.resources.get(value[n]);
            if (data != undefined) {
                let i = new CCanvasItems();
                i.fromData(data);
                this.__indicatorBottomFixData.push(i);
            }
        }
        this.itemLayerDraw();
    }
    get headerButtonResource() {
        return this._headerButtonResource;
    }
    set headerButtonResource(value) {
        if (this._headerButtonResource != value) {
            this._headerButtonResource = value;
            let data = CSystem.resources.get(value);
            if (data != undefined) {
                this.__headerButtonData.fromData(data);
            }
            this.itemLayerDraw();
        }
    }
    get selectItems() {
        return this._selectItems;
    }
    constructor(parent, name) {
        super(parent, name);
        this.isDraw = true;
        this.__cellTopLeftFixData = new Array();
        this.__cellTopData = new Array();
        this.__cellTopRightFixData = new Array();
        this.__cellBottomLeftFixData = new Array();
        this.__cellBottomData = new Array();
        this.__cellBottomRightFixData = new Array();
        this.__cellLeftFixData = new Array();
        this.__cellRightFixData = new Array();
        this.__cellData = new Array();
        this.__headerLeftFixData = new Array();
        this.__headerData = new Array();
        this.__headerRightFixData = new Array();
        this.__indicatorTopFixData = new Array();
        this.__indicatorData = new Array();
        this.__indicatorBottomFixData = new Array();
        this.__headerButtonData = new CCanvasItems();
        this._cellTopLeftFixResource = new ArrayString();
        this._cellTopResource = new ArrayString();
        this._cellTopRightFixResource = new ArrayString();
        this._cellBottomLeftFixResource = new ArrayString();
        this._cellBottomResource = new ArrayString();
        this._cellBottomRightFixResource = new ArrayString();
        this._cellLeftFixResource = new ArrayString();
        this._cellRightFixResource = new ArrayString();
        this._cellResource = new ArrayString();
        this._headerLeftFixResource = new ArrayString();
        this._headerResource = new ArrayString();
        this._headerRightFixResource = new ArrayString();
        this._headerButtonResource = "";
        this._indicatorTopFixResource = new ArrayString();
        this._indicatorResource = new ArrayString();
        this._indicatorBottomFixResource = new ArrayString();
        this._selectItems = new CStringSet();
        this._multiSelect = false;
        this._rowSelect = true;
        this.specificCellCanvasItemsResources = new CMap();
        this.specificCell = new CMap();
        this.specificColumn = new CMap();
        this.specificRow = new CMap();
        this.cellControls = new CMap();
        this.columnControl = new CMap();
        let self = this;
        this.__itemsLayer = this.scrollBox.layers.addLayer();
        CSystem.elementBrintToFront(this.__itemsLayer.canvas);
        this.__itemsLayer.onDraw = function (sender, ctx) {
            self.doItemLayerDraw(ctx);
            self.scrollBox.doScroll();
        };
        this._selectItems.onChange = function () {
            self.itemLayerDraw();
        };
        this.cellControls.onChange = function (s, k, key, value) {
            if (value != undefined) {
                let cr = k.split(",");
                value.onChange = function () {
                    for (let n = 0; n < value.length; n++) {
                        value.get(n).onChange = function () {
                            self.doChangeCellControl(parseInt(cr[0]), parseInt(cr[1]), parseInt(cr[2]), value.get(n));
                            self.itemLayerDraw();
                        };
                    }
                    self.itemLayerDraw();
                };
                for (let n = 0; n < value.length; n++) {
                    value.get(n).onChange = function () {
                        self.doChangeCellControl(parseInt(cr[0]), parseInt(cr[1]), parseInt(cr[2]), value.get(n));
                        self.itemLayerDraw();
                    };
                }
            }
            self.itemLayerDraw();
        };
        this.columnControl.onChange = function (s, k, key, value) {
            if (value != undefined) {
                let cr = k.split(",");
                value.onChange = function () {
                    for (let n = 0; n < value.length; n++) {
                        value.get(n).onChange = function () {
                            self.doChangeCellControl(parseInt(cr[0]), parseInt(cr[1]), parseInt(cr[2]), value.get(n));
                            self.itemLayerDraw();
                        };
                    }
                    self.itemLayerDraw();
                };
                for (let n = 0; n < value.length; n++) {
                    value.get(n).onChange = function () {
                        self.doChangeCellControl(parseInt(cr[0]), parseInt(cr[1]), parseInt(cr[2]), value.get(n));
                        self.itemLayerDraw();
                    };
                }
            }
            self.itemLayerDraw();
        };
        this.specificCellCanvasItemsResources.onChange = function (s, k, key, value) {
            self.itemLayerDraw();
        };
        this.specificCell.onChange = function () {
            self.itemLayerDraw();
        };
        this.specificColumn.onChange = function () {
            self.itemLayerDraw();
        };
        this.specificRow.onChange = function () {
            self.itemLayerDraw();
        };
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "cellTopLeftFixResource", this.cellTopLeftFixResource, [], true);
        CDataClass.putData(data, "cellTopResource", this.cellTopResource, [], true);
        CDataClass.putData(data, "cellTopRightFixResource", this.cellTopRightFixResource, [], true);
        CDataClass.putData(data, "cellBottomLeftFixResource", this.cellBottomLeftFixResource, [], true);
        CDataClass.putData(data, "cellBottomResource", this.cellBottomResource, [], true);
        CDataClass.putData(data, "cellBottomRightFixResource", this.cellBottomRightFixResource, [], true);
        CDataClass.putData(data, "cellLeftFixResource", this.cellLeftFixResource, [], true);
        CDataClass.putData(data, "cellRightFixResource", this.cellRightFixResource, [], true);
        CDataClass.putData(data, "cellResource", this.cellResource, [], true);
        CDataClass.putData(data, "headerLeftFixResource", this.headerLeftFixResource, [], true);
        CDataClass.putData(data, "headerResource", this.headerResource, [], true);
        CDataClass.putData(data, "headerRightFixResource", this.headerRightFixResource, [], true);
        CDataClass.putData(data, "headerButtonResource", this.headerButtonResource, "");
        CDataClass.putData(data, "indicatorTopFixResource", this.indicatorTopFixResource, [], true);
        CDataClass.putData(data, "indicatorResource", this.indicatorResource, [], true);
        CDataClass.putData(data, "indicatorBottomFixResource", this.indicatorBottomFixResource, [], true);
    }
    doFromData(data) {
        super.doFromData(data);
        this.cellTopLeftFixResource = CDataClass.getData(data, "cellTopLeftFixResource", [], true);
        this.cellTopResource = CDataClass.getData(data, "cellTopResource", [], true);
        this.cellTopRightFixResource = CDataClass.getData(data, "cellTopRightFixResource", [], true);
        this.cellBottomLeftFixResource = CDataClass.getData(data, "cellBottomLeftFixResource", [], true);
        this.cellBottomResource = CDataClass.getData(data, "cellBottomResource", [], true);
        this.cellBottomRightFixResource = CDataClass.getData(data, "cellBottomRightFixResource", [], true);
        this.cellLeftFixResource = CDataClass.getData(data, "cellLeftFixResource", [], true);
        this.cellRightFixResource = CDataClass.getData(data, "cellRightFixResource", [], true);
        this.cellResource = CDataClass.getData(data, "cellResource", [], true);
        this.headerLeftFixResource = CDataClass.getData(data, "headerLeftFixResource", [], true);
        this.headerResource = CDataClass.getData(data, "headerResource", [], true);
        this.headerRightFixResource = CDataClass.getData(data, "headerRightFixResource", [], true);
        this.headerButtonResource = CDataClass.getData(data, "headerButtonResource", "");
        this.indicatorTopFixResource = CDataClass.getData(data, "indicatorTopFixResource", [], true);
        this.indicatorResource = CDataClass.getData(data, "indicatorResource", [], true);
        this.indicatorBottomFixResource = CDataClass.getData(data, "indicatorBottomFixResource", [], true);
    }
    clearBounds(bounds) {
        let ctx = this.__itemsLayer.context;
        if (ctx != undefined) {
            ctx.clearRect(bounds.left, bounds.top, bounds.width, bounds.height);
        }
    }
    drawBounds(kind, col, row, data, bounds) {
        let ctx = this.__itemsLayer.context;
        if (ctx != undefined) {
            let its = data;
            if (this.specificRow.has(kind + "," + row)) {
                let rc = this.specificRow.get(kind + "," + row);
                if (rc != undefined) {
                    let dt = this.specificCellCanvasItemsResources.get(rc);
                    if (dt != undefined) {
                        let iits = new CCanvasItems();
                        iits.fromData(dt);
                        its = iits;
                    }
                }
            }
            if (this.specificColumn.has(kind + "," + col)) {
                let rc = this.specificColumn.get(kind + "," + col);
                if (rc != undefined) {
                    let dt = this.specificCellCanvasItemsResources.get(rc);
                    if (dt != undefined) {
                        let iits = new CCanvasItems();
                        iits.fromData(dt);
                        its = iits;
                    }
                }
            }
            if (this.specificCell.has(kind + "," + col + "," + row)) {
                let rc = this.specificColumn.get(kind + "," + col + "," + row);
                if (rc != undefined) {
                    let dt = this.specificCellCanvasItemsResources.get(rc);
                    if (dt != undefined) {
                        let iits = new CCanvasItems();
                        iits.fromData(dt);
                        its = iits;
                    }
                }
            }
            let items = this.doBeforeCellDraw(kind, col, row, its, bounds);
            if (items != undefined) {
                its = items;
            }
            let over = its.getItem("over");
            for (let n = 0; n < over.length; n++) {
                if (kind == EPointerAreaKind.HEADER_CLIENT) {
                    let mg = this.getHeaderMergeCell(this.__cellInfo.col, this.__cellInfo.row);
                    over[n].visible = this.__cellInfo.kind == kind && col == mg.column && row == mg.row;
                }
                else if (kind == EPointerAreaKind.CLIENT) {
                    let mg = this.getMergeCell(this.__cellInfo.col, this.__cellInfo.row);
                    over[n].visible = this.__cellInfo.kind == kind && col == mg.column && row == mg.row;
                }
                else {
                    over[n].visible = this.__cellInfo.kind == kind && this.__cellInfo.col == col && this.__cellInfo.row == row;
                }
            }
            let select = its.getItem("select");
            for (let n = 0; n < select.length; n++) {
                if (this._rowSelect) {
                    select[n].visible = this._selectItems.has(row + "");
                }
                else {
                    select[n].visible = this._selectItems.has(col + "," + row);
                }
            }
            this.doCellDraw(ctx, kind, col, row, its, bounds);
        }
    }
    cellControlBounds(kind, col, row, bounds) {
        let lst;
        lst = this.cellControls.get(kind + "," + col + "," + row);
        if (lst == undefined)
            lst = this.columnControl.get(kind + "," + col);
        if (lst != undefined) {
            let arr = new Array();
            for (let n = 0; n < lst.length; n++) {
                let cc = lst.get(n);
                let rt = new CRect();
                switch (cc.align) {
                    case ECellControlAlign.LEFT:
                        rt.left = bounds.left + cc.margins.left;
                        rt.top = bounds.top + cc.margins.top;
                        rt.width = cc.width;
                        rt.height = bounds.height - (cc.margins.bottom + cc.margins.top);
                        break;
                    case ECellControlAlign.CLIENT:
                        rt.left = bounds.left + cc.margins.left;
                        rt.top = bounds.top + cc.margins.top;
                        rt.width = bounds.width - (cc.margins.right + cc.margins.left);
                        rt.height = bounds.height - (cc.margins.bottom + cc.margins.top);
                        break;
                    case ECellControlAlign.RIGHT:
                        rt.left = bounds.right - cc.width - cc.margins.right;
                        rt.top = bounds.top + cc.margins.top;
                        rt.width = cc.width;
                        rt.height = bounds.height - (cc.margins.bottom + cc.margins.top);
                        break;
                }
                cc.bounds = rt;
                arr.push(cc);
            }
            return arr;
        }
    }
    getCellControls(kind, col, row) {
        let lst;
        lst = this.cellControls.get(kind + "," + col + "," + row);
        if (lst == undefined)
            lst = this.columnControl.get(kind + "," + col);
        if (lst != undefined) {
            let arr = new Array();
            for (let n = 0; n < lst.length; n++) {
                let cc = lst.get(n);
                arr.push(cc);
            }
            return arr;
        }
    }
    doBeforeCellDraw(kind, col, row, data, bounds) {
        if (this.onBeforeCellDraw != undefined) {
            return this.onBeforeCellDraw(this, kind, col, row, data, bounds);
        }
    }
    doCellDraw(ctx, kind, col, row, data, bounds) {
        data.draw(ctx, bounds, this.__itemsLayer.offset, CSystem.bufferingContext, 1, 1);
        let arr = this.cellControlBounds(kind, col, row, bounds);
        if (arr != undefined) {
            for (let n = 0; n < arr.length; n++) {
                let cc = arr[n];
                let over = cc.canvasItemsData.getItem("over");
                for (let n = 0; n < over.length; n++) {
                    over[n].visible = cc.isOver && cc.col == col && cc.row == row;
                }
                let txt = cc.canvasItemsData.getItem("text");
                for (let n = 0; n < txt.length; n++) {
                    txt[n].text = cc.text;
                }
                cc.canvasItemsData.draw(ctx, cc.bounds, this.__itemsLayer.offset, CSystem.bufferingContext, 1, 1);
            }
        }
        if (this.onCellDraw != undefined) {
            this.onCellDraw(this, ctx, kind, col, row, data, bounds);
        }
    }
    doCellPointerMove(kind, column, row, x, y, width, height, e, points) {
        super.doCellPointerMove(kind, column, row, x, y, width, height, e, points);
        let arr = this.getCellControls(kind, column, row);
        if (arr != undefined) {
            for (let n = 0; n < arr.length; n++) {
                let b = false;
                switch (arr[n].align) {
                    case ECellControlAlign.LEFT:
                        b = x >= arr[n].margins.left && x < arr[n].margins.left + arr[n].width && y >= arr[n].margins.top && y < height - arr[n].margins.bottom;
                        break;
                    case ECellControlAlign.CLIENT:
                        b = x >= arr[n].margins.left && x < width - arr[n].margins.right && y >= arr[n].margins.top && y < height - arr[n].margins.bottom;
                        break;
                    case ECellControlAlign.RIGHT:
                        b = x >= width - (arr[n].width + arr[n].margins.right) && x < width - arr[n].margins.right && y >= arr[n].margins.top && y < height - arr[n].margins.bottom;
                        break;
                }
                if (arr[n].isOver != b) {
                    arr[n].isOver = b;
                    arr[n].col = column;
                    arr[n].row = row;
                    this.itemLayerDraw();
                }
            }
        }
    }
    doCellPointerOver(kind, column, row, e, points) {
        super.doCellPointerOver(kind, column, row, e, points);
        this.itemLayerDraw();
    }
    doCellPointerOut(kind, column, row, e, points) {
        super.doCellPointerOut(kind, column, row, e, points);
        let arr = this.getCellControls(kind, column, row);
        if (arr != undefined) {
            for (let n = 0; n < arr.length; n++) {
                if (arr[n].isOver != false) {
                    arr[n].isOver = false;
                    this.itemLayerDraw();
                }
            }
        }
        this.itemLayerDraw();
    }
    doCellClick(kind, column, row, x, y, width, height, e, points) {
        super.doCellClick(kind, column, row, x, y, width, height, e, points);
        let arr = this.getCellControls(kind, column, row);
        if (arr != undefined) {
            for (let n = 0; n < arr.length; n++) {
                let b = false;
                switch (arr[n].align) {
                    case ECellControlAlign.LEFT:
                        b = x >= arr[n].margins.left && x < arr[n].margins.left + arr[n].width && y >= arr[n].margins.top && y < height - arr[n].margins.bottom;
                        break;
                    case ECellControlAlign.CLIENT:
                        b = x >= arr[n].margins.left && x < width - arr[n].margins.right && y >= arr[n].margins.top && y < height - arr[n].margins.bottom;
                        break;
                    case ECellControlAlign.RIGHT:
                        b = x >= width - (arr[n].width + arr[n].margins.right) && x < width - arr[n].margins.right && y >= arr[n].margins.top && y < height - arr[n].margins.bottom;
                        break;
                }
                if (b) {
                    this.doCellControlClick(kind, column, row, n, arr[n], x, y, width, height, e, points);
                }
            }
        }
    }
    doCellControlClick(kind, column, row, cellControlIndex, cellControl, x, y, width, height, e, points) {
        if (this.onCellControlClick != undefined) {
            this.onCellControlClick(this, kind, column, row, cellControlIndex, cellControl, x, y, width, height, e, points);
        }
    }
    doSetBounds() {
        this.itemLayerDraw();
        super.doSetBounds();
    }
    doItemLayerDraw(ctx) {
        if (this.isDraw) {
            ctx.clearRect(0, 0, this.__itemsLayer.canvas.width, this.__itemsLayer.canvas.height);
            this.doCellsBounds();
        }
    }
    doBeforeHeaderButtomCellBounds(bounds) {
        this.clearBounds(bounds);
    }
    doHeaderButtonCellBounds(bounds) {
        if (this.__headerButtonData.length > 0) {
            this.drawBounds(EPointerAreaKind.HEADER_BUTTON, 0, 0, this.__headerButtonData, bounds);
        }
        else {
            if (this.__headerData.length > 0) {
                this.drawBounds(EPointerAreaKind.HEADER_BUTTON, 0, 0, this.__headerData[0], bounds);
            }
            else {
                if (this.__cellData.length > 0)
                    this.drawBounds(EPointerAreaKind.HEADER_BUTTON, 0, 0, this.__cellData[0], bounds);
            }
        }
    }
    doBeforeHeaderLeftFixCellBounds(leftFixBounds) {
        this.clearBounds(leftFixBounds);
    }
    doBeforeHeaderCellBounds(headerClientBounds) {
        this.clearBounds(headerClientBounds);
    }
    doBeforeHeaderRightFixCellBounds(rightFixBounds) {
        this.clearBounds(rightFixBounds);
    }
    doHeaderLeftFixCellBounds(col, row, bounds) {
        if (this.__headerLeftFixData.length > 0) {
            this.drawBounds(EPointerAreaKind.HEADER_LEFT_FIX, col, row, this.__headerLeftFixData[row % this.__headerLeftFixData.length], bounds);
        }
        else if (this.__headerRightFixData.length > 0) {
            this.drawBounds(EPointerAreaKind.HEADER_LEFT_FIX, col, row, this.__headerRightFixData[row % this.__headerRightFixData.length], bounds);
        }
        else {
            if (this.__headerData.length > 0) {
                this.drawBounds(EPointerAreaKind.HEADER_LEFT_FIX, col, row, this.__headerData[row % this.__headerData.length], bounds);
            }
            else {
                if (this.__cellData.length > 0)
                    this.drawBounds(EPointerAreaKind.HEADER_LEFT_FIX, col, row, this.__cellData[row % this.__cellData.length], bounds);
            }
        }
    }
    doHeaderCellBounds(col, row, bounds, isMerge) {
        if (this.__headerData.length > 0) {
            this.drawBounds(EPointerAreaKind.HEADER_CLIENT, col, row, this.__headerData[row % this.__headerData.length], bounds);
        }
        else {
            if (this.__cellData.length > 0)
                this.drawBounds(EPointerAreaKind.HEADER_CLIENT, col, row, this.__cellData[row % this.__cellData.length], bounds);
        }
    }
    doHeaderRightFixCellBounds(col, row, bounds) {
        if (this.__headerRightFixData.length > 0) {
            this.drawBounds(EPointerAreaKind.HEADER_RIGHT_FIX, col, row, this.__headerRightFixData[row % this.__headerRightFixData.length], bounds);
        }
        else if (this.__headerLeftFixData.length > 0) {
            this.drawBounds(EPointerAreaKind.HEADER_RIGHT_FIX, col, row, this.__headerLeftFixData[row % this.__headerLeftFixData.length], bounds);
        }
        else {
            if (this.__headerData.length > 0) {
                this.drawBounds(EPointerAreaKind.HEADER_RIGHT_FIX, col, row, this.__headerData[row % this.__headerData.length], bounds);
            }
            else {
                if (this.__cellData.length > 0)
                    this.drawBounds(EPointerAreaKind.HEADER_RIGHT_FIX, col, row, this.__cellData[row % this.__cellData.length], bounds);
            }
        }
    }
    doBeforeIndicatorTopFixCellBounds(topFixBounds) {
        this.clearBounds(topFixBounds);
    }
    doBeforeIndicatorCellBounds(indicatorClientBounds) {
        this.clearBounds(indicatorClientBounds);
    }
    doBeforeIndicatorBottomFixCellBounds(bottomFixBounds) {
        this.clearBounds(bottomFixBounds);
    }
    doIndicatorTopFixCellBounds(row, bounds) {
        if (this.__indicatorTopFixData.length > 0) {
            this.drawBounds(EPointerAreaKind.INDICATOR_TOP_FIX, 0, row, this.__indicatorTopFixData[row % this.__indicatorTopFixData.length], bounds);
        }
        else if (this.__indicatorBottomFixData.length > 0) {
            this.drawBounds(EPointerAreaKind.INDICATOR_TOP_FIX, 0, row, this.__indicatorBottomFixData[row % this.__indicatorBottomFixData.length], bounds);
        }
        else {
            if (this.__indicatorData.length > 0) {
                this.drawBounds(EPointerAreaKind.INDICATOR_TOP_FIX, 0, row, this.__indicatorData[row % this.__indicatorData.length], bounds);
            }
            else {
                if (this.__cellData.length > 0)
                    this.drawBounds(EPointerAreaKind.INDICATOR_TOP_FIX, 0, row, this.__cellData[row % this.__cellData.length], bounds);
            }
        }
    }
    doIndicatorCellBounds(row, bounds) {
        if (this.__indicatorData.length > 0) {
            this.drawBounds(EPointerAreaKind.INDICATOR_CLIENT, 0, row, this.__indicatorData[row % this.__indicatorData.length], bounds);
        }
        else {
            if (this.__cellData.length > 0)
                this.drawBounds(EPointerAreaKind.INDICATOR_CLIENT, 0, row, this.__cellData[row % this.__cellData.length], bounds);
        }
    }
    doIndicatorBottomFixCellBounds(row, bounds) {
        if (this.__indicatorBottomFixData.length > 0) {
            this.drawBounds(EPointerAreaKind.INDICATOR_BOTTOM_FIX, 0, row, this.__indicatorBottomFixData[row % this.__indicatorBottomFixData.length], bounds);
        }
        else if (this.__indicatorTopFixData.length > 0) {
            this.drawBounds(EPointerAreaKind.INDICATOR_BOTTOM_FIX, 0, row, this.__indicatorTopFixData[row % this.__indicatorTopFixData.length], bounds);
        }
        else {
            if (this.__indicatorData.length > 0) {
                this.drawBounds(EPointerAreaKind.INDICATOR_BOTTOM_FIX, 0, row, this.__indicatorData[row % this.__indicatorData.length], bounds);
            }
            else {
                if (this.__cellData.length > 0)
                    this.drawBounds(EPointerAreaKind.INDICATOR_BOTTOM_FIX, 0, 0, this.__cellData[row % this.__cellData.length], bounds);
            }
        }
    }
    doBeforeTopLeftFixCellBounds(leftFixBounds) {
        this.clearBounds(leftFixBounds);
    }
    doBeforeTopCellBounds(clientBounds) {
        this.clearBounds(clientBounds);
    }
    doBeforeTopRightFixCellBounds(rightFixBounds) {
        this.clearBounds(rightFixBounds);
    }
    doTopLeftFixCellBounds(col, row, bounds) {
        if (this.__cellTopLeftFixData.length > 0) {
            this.drawBounds(EPointerAreaKind.TOP_LEFT_FIX, col, row, this.__cellTopLeftFixData[row % this.__cellTopLeftFixData.length], bounds);
        }
        else if (this.__cellTopRightFixData.length > 0) {
            this.drawBounds(EPointerAreaKind.TOP_LEFT_FIX, col, row, this.__cellTopRightFixData[row % this.__cellTopRightFixData.length], bounds);
        }
        else {
            if (this.__cellTopData.length > 0) {
                this.drawBounds(EPointerAreaKind.TOP_LEFT_FIX, col, row, this.__cellTopData[row % this.__cellTopData.length], bounds);
            }
            else {
                if (this.__cellData.length > 0)
                    this.drawBounds(EPointerAreaKind.TOP_LEFT_FIX, col, row, this.__cellData[row % this.__cellData.length], bounds);
            }
        }
    }
    doTopCellBounds(col, row, bounds, isMerge) {
        if (this.__cellTopData.length > 0) {
            this.drawBounds(EPointerAreaKind.TOP_CLIENT_FIX, col, row, this.__cellTopData[row % this.__cellTopData.length], bounds);
        }
        else {
            if (this.__cellData.length > 0)
                this.drawBounds(EPointerAreaKind.TOP_CLIENT_FIX, col, row, this.__cellData[row % this.__cellData.length], bounds);
        }
    }
    doTopRightFixCellBounds(col, row, bounds) {
        if (this.__cellTopRightFixData.length > 0) {
            this.drawBounds(EPointerAreaKind.TOP_RIGHT_FIX, col, row, this.__cellTopRightFixData[row % this.__cellTopRightFixData.length], bounds);
        }
        else if (this.__cellTopLeftFixData.length > 0) {
            this.drawBounds(EPointerAreaKind.TOP_RIGHT_FIX, col, row, this.__cellTopLeftFixData[row % this.__cellTopLeftFixData.length], bounds);
        }
        else {
            if (this.__cellTopData.length > 0) {
                this.drawBounds(EPointerAreaKind.TOP_RIGHT_FIX, col, row, this.__cellTopData[row % this.__cellTopData.length], bounds);
            }
            else {
                if (this.__cellData.length > 0)
                    this.drawBounds(EPointerAreaKind.TOP_RIGHT_FIX, col, row, this.__cellData[row % this.__cellData.length], bounds);
            }
        }
    }
    doBeforeBottomLeftFixCellBounds(leftFixBounds) {
        this.clearBounds(leftFixBounds);
    }
    doBeforeBottomCellBounds(clientBounds) {
        this.clearBounds(clientBounds);
    }
    doBeforeBottomRightFixCellBounds(rightFixBounds) {
        this.clearBounds(rightFixBounds);
    }
    doBottomLeftFixCellBounds(col, row, bounds) {
        if (this.__cellBottomLeftFixData.length > 0) {
            this.drawBounds(EPointerAreaKind.BOTTOM_LEFT_FIX, col, row, this.__cellBottomLeftFixData[row % this.__cellBottomLeftFixData.length], bounds);
        }
        else if (this.__cellBottomRightFixData.length > 0) {
            this.drawBounds(EPointerAreaKind.BOTTOM_LEFT_FIX, col, row, this.__cellBottomRightFixData[row % this.__cellBottomRightFixData.length], bounds);
        }
        else {
            if (this.__cellBottomData.length > 0) {
                this.drawBounds(EPointerAreaKind.BOTTOM_LEFT_FIX, col, row, this.__cellBottomData[row % this.__cellBottomData.length], bounds);
            }
            else {
                if (this.__cellData.length > 0)
                    this.drawBounds(EPointerAreaKind.BOTTOM_LEFT_FIX, col, row, this.__cellData[row % this.__cellData.length], bounds);
            }
        }
    }
    doBottomCellBounds(col, row, bounds, isMerge) {
        if (this.__cellBottomData.length > 0) {
            this.drawBounds(EPointerAreaKind.BOTTOM_CLIENT_FIX, col, row, this.__cellBottomData[row % this.__cellBottomData.length], bounds);
        }
        else {
            if (this.__cellData.length > 0)
                this.drawBounds(EPointerAreaKind.BOTTOM_CLIENT_FIX, col, row, this.__cellData[row % this.__cellData.length], bounds);
        }
    }
    doBottomRightFixCellBounds(col, row, bounds) {
        if (this.__cellBottomRightFixData.length > 0) {
            this.drawBounds(EPointerAreaKind.BOTTOM_RIGHT_FIX, col, row, this.__cellBottomRightFixData[row % this.__cellBottomRightFixData.length], bounds);
        }
        else if (this.__cellBottomLeftFixData.length > 0) {
            this.drawBounds(EPointerAreaKind.BOTTOM_RIGHT_FIX, col, row, this.__cellBottomLeftFixData[row % this.__cellBottomLeftFixData.length], bounds);
        }
        else {
            if (this.__cellBottomData.length > 0) {
                this.drawBounds(EPointerAreaKind.BOTTOM_RIGHT_FIX, col, row, this.__cellBottomData[row % this.__cellBottomData.length], bounds);
            }
            else {
                if (this.__cellData.length > 0)
                    this.drawBounds(EPointerAreaKind.BOTTOM_RIGHT_FIX, col, row, this.__cellData[row % this.__cellData.length], bounds);
            }
        }
    }
    doBeforeLeftCellBounds(clientBounds) {
        this.clearBounds(clientBounds);
    }
    doLeftCellBounds(col, row, bounds) {
        if (this.__cellLeftFixData.length > 0) {
            this.drawBounds(EPointerAreaKind.LEFT_FIX, col, row, this.__cellLeftFixData[row % this.__cellLeftFixData.length], bounds);
        }
        else if (this.__cellRightFixData.length > 0) {
            this.drawBounds(EPointerAreaKind.LEFT_FIX, col, row, this.__cellRightFixData[row % this.__cellRightFixData.length], bounds);
        }
        else {
            if (this.__cellData.length > 0)
                this.drawBounds(EPointerAreaKind.LEFT_FIX, col, row, this.__cellData[row % this.__cellData.length], bounds);
        }
    }
    doBeforeRightCellBounds(clientBounds) {
        this.clearBounds(clientBounds);
    }
    doRightCellBounds(col, row, bounds) {
        if (this.__cellRightFixData.length > 0) {
            this.drawBounds(EPointerAreaKind.RIGHT_FIX, col, row, this.__cellRightFixData[row % this.__cellRightFixData.length], bounds);
        }
        else if (this.__cellLeftFixData.length > 0) {
            this.drawBounds(EPointerAreaKind.RIGHT_FIX, col, row, this.__cellLeftFixData[row % this.__cellLeftFixData.length], bounds);
        }
        else {
            if (this.__cellData.length > 0)
                this.drawBounds(EPointerAreaKind.RIGHT_FIX, col, row, this.__cellData[row % this.__cellData.length], bounds);
        }
    }
    doClientCellBounds(col, row, bounds, isMerge) {
        if (this.__cellData.length > 0)
            this.drawBounds(EPointerAreaKind.CLIENT, col, row, this.__cellData[row % this.__cellData.length], bounds);
    }
    doChangeCellControl(kind, column, row, cellControl) {
        this.itemLayerDraw();
    }
    itemLayerDraw() {
        if (this.isDraw)
            this.__itemsLayer.draw();
    }
    addSelectItem(col, row) {
        if (!this._multiSelect)
            this._selectItems.clear();
        if (this._rowSelect) {
            this._selectItems.add(row + "");
        }
        else {
            this._selectItems.add(col + "," + row);
        }
    }
    deleteSelectItem(col, row) {
        if (this._rowSelect) {
            this._selectItems.delete(row + "");
        }
        else {
            this._selectItems.delete(col + "," + row);
        }
    }
    clearSelectItem() {
        this._selectItems.clear();
    }
    clearCellControl() {
        this.cellControls.clear();
        this.columnControl.clear();
    }
    getSelectItems() {
        let rt = new Array();
        let self = this;
        this._selectItems.forEach(function (v) {
            if (self._rowSelect) {
                rt.push({ column: -1, row: parseInt(v) });
            }
            else {
                let arr = v.split(",");
                rt.push({ column: parseInt(arr[0]), row: parseInt(arr[1]) });
            }
        });
        return rt;
    }
    columnToScrollX(columnIndex, fit) {
        let rt = this.getCellBounds(columnIndex, 0);
        if (fit == "left") {
            return rt.left;
        }
        else {
            return rt.left - this.getBackgroundClientBounds().width + rt.width - this.gridInfo.cellMargin;
        }
    }
    scrollXToColumn(columnIndex, fit) {
        this.scrollX = this.columnToScrollX(columnIndex, fit);
    }
    rowToScrollY(rowIndex, fit) {
        let rt = this.getCellBounds(0, rowIndex);
        if (fit == "top") {
            return rt.top;
        }
        else {
            return rt.top - this.getBackgroundClientBounds().height + rt.height - this.gridInfo.cellMargin;
        }
    }
    scrollYToRow(rowIndex, fit) {
        this.scrollY = this.rowToScrollY(rowIndex, fit);
    }
    addCellControl(kind, column, row, align, width, margins, resource, text) {
        let con = new CCellControl();
        con.align = align;
        con.width = width;
        if (margins.length > 0)
            con.margins.left = margins[0];
        if (margins.length > 1)
            con.margins.top = margins[1];
        if (margins.length > 2)
            con.margins.right = margins[2];
        if (margins.length > 3)
            con.margins.bottom = margins[3];
        con.controlCanvasItemsResource = resource;
        con.text = text;
        let lst = this.cellControls.get(kind + "," + column + "," + row);
        if (lst == undefined) {
            lst = new CList();
            lst.add(con);
            this.cellControls.set(kind + "," + column + "," + row, lst);
        }
        else {
            lst.add(con);
        }
        return con;
    }
    addSpecificCellCanvasItemsResource(specificCellCanvasItemsResource) {
        let dt = CSystem.resources.get(specificCellCanvasItemsResource);
        if (dt != undefined) {
            this.specificCellCanvasItemsResources.set(specificCellCanvasItemsResource, dt);
            return true;
        }
        return false;
    }
    addSpecificCell(specificCellCanvasItemsResource, kind, column, row) {
        if (this.specificCellCanvasItemsResources.has(specificCellCanvasItemsResource)) {
            this.specificCell.set(kind + "," + column + "," + row, specificCellCanvasItemsResource);
        }
        else {
            let b = this.addSpecificCellCanvasItemsResource(specificCellCanvasItemsResource);
            if (b) {
                this.specificCell.set(kind + "," + column + "," + row, specificCellCanvasItemsResource);
            }
        }
    }
    addSpecificColumn(specificCellCanvasItemsResource, kind, column) {
        if (this.specificCellCanvasItemsResources.has(specificCellCanvasItemsResource)) {
            this.specificColumn.set(kind + "," + column, specificCellCanvasItemsResource);
        }
        else {
            let b = this.addSpecificCellCanvasItemsResource(specificCellCanvasItemsResource);
            if (b) {
                this.specificColumn.set(kind + "," + column, specificCellCanvasItemsResource);
            }
        }
    }
    addSpecificRow(specificCellCanvasItemsResource, kind, row) {
        if (this.specificCellCanvasItemsResources.has(specificCellCanvasItemsResource)) {
            this.specificRow.set(kind + "," + row, specificCellCanvasItemsResource);
        }
        else {
            let b = this.addSpecificCellCanvasItemsResource(specificCellCanvasItemsResource);
            if (b) {
                this.specificRow.set(kind + "," + row, specificCellCanvasItemsResource);
            }
        }
    }
}
var EEditorShowKind;
(function (EEditorShowKind) {
    EEditorShowKind[EEditorShowKind["CLICK"] = 0] = "CLICK";
    EEditorShowKind[EEditorShowKind["DOUBLE_CLICK"] = 1] = "DOUBLE_CLICK";
    EEditorShowKind[EEditorShowKind["F2_KEY"] = 2] = "F2_KEY";
})(EEditorShowKind || (EEditorShowKind = {}));
class CCustomDataGrid extends CCustumCanvasGrid {
    get headerText() {
        return this._headerText;
    }
    get topFixHeaders() {
        return this._topFixHeaders;
    }
    get topFixData() {
        return this.__topFixData;
    }
    get topFixHeight() {
        return this._topFixHeight;
    }
    set topFixHeight(value) {
        this._topFixHeight = value;
        this.isDraw = false;
        for (let n = 0; n < this.gridInfo.fixTop.length; n++) {
            this.gridInfo.fixTop.set(n, value);
        }
        this.isDraw = true;
        this.itemLayerDraw();
    }
    get bottomFixHeaders() {
        return this._bottomFixHeaders;
    }
    get bottomFixData() {
        return this.__bottomFixData;
    }
    get bottomFixHeight() {
        return this._bottomFixHeight;
    }
    set bottomFixHeight(value) {
        this._bottomFixHeight = value;
        this.isDraw = false;
        for (let n = 0; n < this.gridInfo.fixBottom.length; n++) {
            this.gridInfo.fixBottom.set(n, value);
        }
        this.isDraw = true;
        this.itemLayerDraw();
    }
    get leftFixHeaders() {
        return this._leftFixHeaders;
    }
    get leftFixData() {
        return this.__leftFixData;
    }
    get leftFixWidth() {
        return this._leftFixWidth;
    }
    set leftFixWidth(value) {
        this._leftFixWidth = value;
        this.isDraw = false;
        for (let n = 0; n < this.gridInfo.fixLeft.length; n++) {
            this.gridInfo.fixLeft.set(n, value);
        }
        this.isDraw = true;
        this.itemLayerDraw();
    }
    get rightFixHeaders() {
        return this._rightFixHeaders;
    }
    get rightFixData() {
        return this.__rightFixData;
    }
    get rightFixWidth() {
        return this._rightFixWidth;
    }
    set rightFixWidth(value) {
        this._rightFixWidth = value;
        this.isDraw = false;
        for (let n = 0; n < this.gridInfo.fixRight.length; n++) {
            this.gridInfo.fixRight.set(n, value);
        }
        this.isDraw = true;
        this.itemLayerDraw();
    }
    get topIndicatorText() {
        return this._topIndicatorText;
    }
    get indicatorText() {
        return this._indicatorText;
    }
    get bottomIndicatorText() {
        return this._bottomIndicatorText;
    }
    get leftHeaderText() {
        return this._leftHeaderText;
    }
    get rightHeaderText() {
        return this._rightHeaderText;
    }
    get column() {
        return this._column;
    }
    set column(value) {
        if (this._column != value) {
            this._column = value;
        }
    }
    get row() {
        return this._row;
    }
    set row(value) {
        if (this._row != value) {
            this._row = value;
        }
    }
    constructor(parent, name) {
        super(parent, name);
        this._topFixHeaders = new CStringList();
        this._topFixHeight = 20;
        this._bottomFixHeaders = new CStringList();
        this._bottomFixHeight = 20;
        this._leftFixHeaders = new CStringList();
        this._leftFixWidth = 100;
        this._rightFixHeaders = new CStringList();
        this._rightFixWidth = 100;
        this._headerText = new CSSMap();
        this._topIndicatorText = new CStringList();
        this._indicatorText = new CStringList();
        this._bottomIndicatorText = new CStringList();
        this._leftHeaderText = new CStringList();
        this._rightHeaderText = new CStringList();
        this._column = -1;
        this._row = -1;
        this.readOnlyCell = new Set();
        this.readOnlyColumn = new Set();
        this.readOnlyRow = new Set();
        this.useEditorEnter = false;
        this.editorShowSet = new Set();
        let self = this;
        this.gridInfo.cellMargin = 1;
        this.gridInfo.columnCount = 0;
        this.gridInfo.rowCount = 0;
        this.gridInfo.headerRowHeight = 25;
        this._topFixHeaders.onChange = function () {
            self.doTopFixCreateData();
        };
        this._bottomFixHeaders.onChange = function () {
            self.doBottomFixCreateData();
        };
        this._leftFixHeaders.onChange = function () {
            self.doLeftFixCreateData();
        };
        this._rightFixHeaders.onChange = function () {
            self.doRightFixCreateData();
        };
    }
    isEditableCell(col, row) {
        if (!this.editable)
            return false;
        let ce = this.readOnlyCell.has(col + "," + row);
        let c = this.readOnlyColumn.has(col);
        let r = this.readOnlyRow.has(row);
        return !ce && !c && !r;
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "topFixHeaders", this.topFixHeaders.toData(), [], true);
        CDataClass.putData(data, "topFixHeight", this.topFixHeight, 20);
        CDataClass.putData(data, "bottomFixHeaders", this.bottomFixHeaders.toData(), [], true);
        CDataClass.putData(data, "bottomFixHeight", this.bottomFixHeight, 20);
        CDataClass.putData(data, "leftFixHeaders", this.leftFixHeaders.toData(), [], true);
        CDataClass.putData(data, "leftFixWidth", this.leftFixWidth, 100);
        CDataClass.putData(data, "rightFixHeaders", this.rightFixHeaders.toData(), [], true);
        CDataClass.putData(data, "rightFixWidth", this.rightFixWidth, 100);
        CDataClass.putData(data, "topIndicatorText", this.topIndicatorText.toData(), [], true);
        CDataClass.putData(data, "indicatorText", this.indicatorText.toData(), [], true);
        CDataClass.putData(data, "bottomIndicatorText", this.bottomIndicatorText.toData(), [], true);
        CDataClass.putData(data, "leftHeaderText", this.leftHeaderText.toData(), [], true);
        CDataClass.putData(data, "rightHeaderText", this.rightHeaderText.toData(), [], true);
        CDataClass.putData(data, "headerText", this.headerText.toData(), [], true);
        CDataClass.putData(data, "editorShowSet", CSystem.setToArray(this.editorShowSet), [], true);
        CDataClass.putData(data, "readOnlyCell", CSystem.setToArray(this.readOnlyCell), [], true);
        CDataClass.putData(data, "readOnlyColumn", CSystem.setToArray(this.readOnlyColumn), [], true);
        CDataClass.putData(data, "readOnlyRow", CSystem.setToArray(this.readOnlyRow), [], true);
    }
    doFromData(data) {
        super.doFromData(data);
        this.topFixHeaders.fromData(CDataClass.getData(data, "topFixHeaders", [], true));
        this.topFixHeight = CDataClass.getData(data, "topFixHeight", 20);
        this.bottomFixHeaders.fromData(CDataClass.getData(data, "bottomFixHeaders", [], true));
        this.bottomFixHeight = CDataClass.getData(data, "bottomFixHeight", 20);
        this.leftFixHeaders.fromData(CDataClass.getData(data, "leftFixHeaders", [], true));
        this.leftFixWidth = CDataClass.getData(data, "leftFixWidth", 100);
        this.rightFixHeaders.fromData(CDataClass.getData(data, "rightFixHeaders", [], true));
        this.rightFixWidth = CDataClass.getData(data, "rightFixWidth", 100);
        this.topIndicatorText.fromData(CDataClass.getData(data, "topIndicatorText", [], true));
        this.indicatorText.fromData(CDataClass.getData(data, "indicatorText", [], true));
        this.bottomIndicatorText.fromData(CDataClass.getData(data, "bottomIndicatorText", [], true));
        this.leftHeaderText.fromData(CDataClass.getData(data, "leftHeaderText", [], true));
        this.rightHeaderText.fromData(CDataClass.getData(data, "rightHeaderText", [], true));
        this.headerText.fromData(CDataClass.getData(data, "headerText", [], true));
        CSystem.setFromArray(this.editorShowSet, CDataClass.getData(data, "editorShowSet", [], true));
        CSystem.setFromArray(this.readOnlyCell, CDataClass.getData(data, "readOnlyCell", [], true));
        CSystem.setFromArray(this.readOnlyColumn, CDataClass.getData(data, "readOnlyColumn", [], true));
        CSystem.setFromArray(this.readOnlyRow, CDataClass.getData(data, "readOnlyRow", [], true));
    }
    doRemove() {
        if (this.__editor != undefined)
            this.__editor.remove();
        if (this.__topFixData != undefined)
            this.__topFixData.remove();
        if (this.__bottomFixData != undefined)
            this.__bottomFixData.remove();
        if (this.__leftFixData != undefined)
            this.__leftFixData.remove();
        if (this.__rightFixData != undefined)
            this.__rightFixData.remove();
        this._topFixHeaders.remove();
        this._bottomFixHeaders.remove();
        this._leftFixHeaders.remove();
        this._rightFixHeaders.remove();
        this._headerText.remove();
        this._topIndicatorText.remove();
        this._indicatorText.remove();
        this._bottomIndicatorText.remove();
        this._leftHeaderText.remove();
        this._rightHeaderText.remove();
        this.readOnlyCell.clear();
        this.readOnlyColumn.clear();
        this.readOnlyRow.clear();
        this.editorShowSet.clear();
        super.doRemove();
    }
    doCellDraw(ctx, kind, col, row, data, bounds) {
        if (kind == EPointerAreaKind.CLIENT) {
            let cell = data.getItem("cell");
            for (let n = 0; n < cell.length; n++) {
                let mg = this.getMergeCell(this.column, this.row);
                cell[n].visible = mg.column == col && mg.row == row;
            }
        }
        super.doCellDraw(ctx, kind, col, row, data, bounds);
    }
    doShowEditor() {
        let self = this;
        let rt = this.getCellBounds(this.column, this.row);
        let client = this.getBackgroundClientBounds();
        rt.offset(client.left - this.scrollX, client.top - this.scrollY);
        if (rt.left < client.left)
            rt.left = client.left;
        if (rt.right > client.right)
            rt.right = client.right;
        if (rt.top < client.top)
            rt.top = client.top;
        if (rt.bottom > client.bottom)
            rt.bottom = client.bottom;
        this.__editor = new CTextArea();
        this.__editor.onResource = function () {
            if (self.__editor != undefined) {
                self.__editor.hasFocus = true;
            }
        };
        this.__editor.parent = this.scrollBox;
        this.__editor.resource = "textboxDarkEditor.control";
        this.__editor.stopPropagation.down = true;
        this.__editor.stopPropagation.move = true;
        this.__editor.stopPropagation.up = true;
        this.__editor.stopPropagation.cancel = true;
        this.__editor.stopPropagation.over = true;
        this.__editor.stopPropagation.out = true;
        this.__editor.stopPropagation.enter = true;
        this.__editor.stopPropagation.leave = true;
        this.__editor.stopPropagation.keyboard = true;
        this.__editor.position.left = rt.left;
        this.__editor.position.top = rt.top;
        this.__editor.position.width = rt.width;
        this.__editor.position.height = rt.height;
        this.__editor.scrollbarLength = 10;
        this.__editor.useEnter = false;
        this.__editor.useHScrollbar = false;
        this.__editor.useVScrollbar = false;
        this.__editor.elementMargins.top = 0;
        this.__editor.elementMargins.bottom = 0;
        this.__editor.bringToFront();
        this.__editor.visible = true;
        this.__editor.text = this.cell(this.column, this.row);
        this.__editor.element.focus();
        this.__editor.element.select();
        this.__editor["flag"] = true;
        this.__editor.element.addEventListener("blur", function (e) {
            if (self.__editor != undefined && self.__editor.element != null && self.__editor["flag"]) {
                self.doEditorApply(self.column, self.row, self.__editor.text);
            }
        });
        this.__editor.onShow = function () {
            if (self.__editor != undefined)
                self.__editor.element.select();
        };
        this.__editor.element.addEventListener("keydown", function (e) {
            if (self.__editor != undefined) {
                if (e.key == "ArrowRight" && e.ctrlKey) {
                    self.doEditorApply(self.column, self.row, self.__editor.text);
                    self.column++;
                    let x = self.columnToScrollX(self.column, "right");
                    if (x > self.scrollX)
                        self.scrollX = x;
                    if (self.isEditableCell(self.column, self.row))
                        self.doShowEditor();
                }
                if (e.key == "ArrowLeft" && e.ctrlKey) {
                    self.doEditorApply(self.column, self.row, self.__editor.text);
                    self.column--;
                    let x = self.columnToScrollX(self.column, "left");
                    if (x < self.scrollX)
                        self.scrollX = x;
                    if (self.isEditableCell(self.column, self.row))
                        self.doShowEditor();
                }
                if (e.key == "ArrowDown" && e.ctrlKey) {
                    self.doEditorApply(self.column, self.row, self.__editor.text);
                    self.row++;
                    let y = self.rowToScrollY(self.row, "bottom");
                    if (y > self.scrollY)
                        self.scrollY = y;
                    if (self.isEditableCell(self.column, self.row))
                        self.doShowEditor();
                }
                if (e.key == "ArrowUp" && e.ctrlKey) {
                    self.doEditorApply(self.column, self.row, self.__editor.text);
                    self.row--;
                    let y = self.rowToScrollY(self.row, "top");
                    if (y < self.scrollY)
                        self.scrollY = y;
                    if (self.isEditableCell(self.column, self.row))
                        self.doShowEditor();
                }
                if (e.key == "Escape") {
                    self.doEditorCancel();
                }
                if (!self.useEditorEnter && e.key == "Enter") {
                    self.doEditorApply(self.column, self.row, self.__editor.text);
                    e.preventDefault();
                }
                if (e.ctrlKey && e.key == "Enter") {
                    self.doEditorApply(self.column, self.row, self.__editor.text);
                    e.preventDefault();
                }
            }
        });
        if (this.onShowEditor != undefined) {
            this.onShowEditor(this, this.column, this.row, this.__editor);
        }
    }
    doBeforeEditorApply(column, row, text) {
        if (this.onBeforeEditorApply != undefined) {
            this.onBeforeEditorApply(this, column, row, this.cell(column, row), text);
        }
    }
    doEditorApply(column, row, text) {
        if (this.__editor != undefined) {
            this.doBeforeEditorApply(column, row, text);
            this.setCell(this.column, this.row, this.__editor.text);
            if (this.onEditorApply != undefined) {
                this.onEditorApply(this, this.column, this.row, this.__editor.text);
            }
            this.__editor["flag"] = false;
            let edt = this.__editor;
            this.__editor = undefined;
            if (edt.visibleAnimationTrigger != undefined) {
                let self = this;
                edt.onHide = function () {
                    edt.remove();
                    if (self.__editor == undefined)
                        self.focused = true;
                };
                edt.visible = false;
            }
            else {
                edt.remove();
                this.focused = true;
            }
        }
    }
    doEditorCancel() {
        if (this.__editor != undefined) {
            this.__editor["flag"] = false;
            let edt = this.__editor;
            this.__editor = undefined;
            if (edt.visibleAnimationTrigger != undefined) {
                let self = this;
                edt.onHide = function () {
                    edt.remove();
                    if (self.__editor == undefined)
                        self.focused = true;
                };
                edt.visible = false;
            }
            else {
                edt.remove();
                this.focused = true;
            }
            if (this.onEditorCancel != undefined) {
                this.onEditorCancel(this);
            }
        }
    }
    doWheel(e) {
        super.doWheel(e);
        this.doEditorCancel();
    }
    doCellClick(kind, column, row, x, y, width, height, e, points) {
        super.doCellClick(kind, column, row, x, y, width, height, e, points);
        if (this.isEditableCell(column, row) && this.editorShowSet.has(EEditorShowKind.CLICK) && kind == EPointerAreaKind.CLIENT) {
            this.doShowEditor();
        }
    }
    doCellDblClick(kind, column, row, e, points) {
        super.doCellDblClick(kind, column, row, e, points);
        if (this.isEditableCell(column, row) && this.editorShowSet.has(EEditorShowKind.DOUBLE_CLICK) && kind == EPointerAreaKind.CLIENT) {
            this.doShowEditor();
        }
    }
    doKeyDown(e) {
        super.doKeyDown(e);
        if (this.isEditableCell(this.column, this.row) && e.key == "F2" && this.editorShowSet.has(EEditorShowKind.F2_KEY)) {
            this.doShowEditor();
        }
    }
    doTopFixCreateData() {
        this.__topFixData = new CTableData(this._topFixHeaders.array, []);
        let self = this;
        this.__topFixData.onChange = function (sender, kind, col, row) {
            self.doTopFixDataChange(kind, col, row);
        };
    }
    doBottomFixCreateData() {
        this.__bottomFixData = new CTableData(this._topFixHeaders.array, []);
        let self = this;
        this.__bottomFixData.onChange = function (sender, kind, col, row) {
            self.doBottomFixDataChange(kind, col, row);
        };
    }
    doLeftFixCreateData() {
        this.__leftFixData = new CTableData(this._leftFixHeaders.array, []);
        let self = this;
        this.__leftFixData.onChange = function (sender, kind, col, row) {
            self.doLeftFixDataChange(kind, col, row);
        };
    }
    doRightFixCreateData() {
        this.__rightFixData = new CTableData(this._rightFixHeaders.array, []);
        let self = this;
        this.__rightFixData.onChange = function (sender, kind, col, row) {
            self.doRightFixDataChange(kind, col, row);
        };
    }
    doTopFixDataChange(kind, column, row) {
        if (this.__topFixData != undefined) {
            this.isDraw = false;
            this.gridInfo.fixTop.clear();
            for (let n = 0; n < this.__topFixData.length; n++) {
                this.gridInfo.fixTop.add(this._topFixHeight);
            }
            this.isDraw = true;
        }
    }
    doBottomFixDataChange(kind, column, row) {
        if (this.__bottomFixData != undefined) {
            this.isDraw = false;
            this.gridInfo.fixBottom.clear();
            for (let n = 0; n < this.__bottomFixData.length; n++) {
                this.gridInfo.fixBottom.add(this._bottomFixHeight);
            }
            this.isDraw = true;
        }
    }
    doLeftFixDataChange(kind, column, row) {
        if (this.__leftFixData != undefined) {
            this.isDraw = false;
            this.gridInfo.fixLeft.clear();
            for (let n = 0; n < this.__leftFixData.columnCount; n++) {
                this.gridInfo.fixLeft.add(this._leftFixWidth);
            }
            this.isDraw = true;
        }
    }
    doRightFixDataChange(kind, column, row) {
        if (this.__rightFixData != undefined) {
            this.isDraw = false;
            this.gridInfo.fixRight.clear();
            for (let n = 0; n < this.__rightFixData.columnCount; n++) {
                this.gridInfo.fixRight.add(this._rightFixWidth);
            }
            this.isDraw = true;
        }
    }
    doBeforeCellDraw(kind, col, row, data, bounds) {
        if (kind == EPointerAreaKind.TOP_LEFT_FIX ||
            kind == EPointerAreaKind.TOP_RIGHT_FIX ||
            kind == EPointerAreaKind.BOTTOM_LEFT_FIX ||
            kind == EPointerAreaKind.BOTTOM_RIGHT_FIX) {
            data.setText("text", "");
        }
        if (kind == EPointerAreaKind.LEFT_FIX) {
            if (this.__leftFixData != undefined) {
                if (this.__leftFixData.length > row && this.__leftFixData.columnCount > col) {
                    data.setText("text", this.__leftFixData.getRow(row).get(col).asString);
                }
                else {
                    data.setText("text", "");
                }
            }
        }
        if (kind == EPointerAreaKind.RIGHT_FIX) {
            if (this.__rightFixData != undefined) {
                if (this.__rightFixData.length > row && this.__rightFixData.columnCount > col) {
                    data.setText("text", this.__rightFixData.getRow(row).get(col).asString);
                }
                else {
                    data.setText("text", "");
                }
            }
        }
        if (kind == EPointerAreaKind.TOP_CLIENT_FIX) {
            if (this.__topFixData != undefined) {
                if (this.__topFixData.length > row && this.__topFixData.columnCount > col) {
                    data.setText("text", this.__topFixData.getRow(row).get(col).asString);
                }
                else {
                    data.setText("text", "");
                }
            }
        }
        if (kind == EPointerAreaKind.BOTTOM_CLIENT_FIX) {
            if (this.__bottomFixData != undefined) {
                if (this.__bottomFixData.length > row && this.__bottomFixData.columnCount > col) {
                    data.setText("text", this.__bottomFixData.getRow(row).get(col).asString);
                }
                else {
                    data.setText("text", "");
                }
            }
        }
        if (kind == EPointerAreaKind.INDICATOR_TOP_FIX) {
            if (row < this._topIndicatorText.length) {
                data.setText("text", this._topIndicatorText.get(row));
            }
            else {
                data.setText("text", "T" + (row + 1));
            }
        }
        if (kind == EPointerAreaKind.INDICATOR_CLIENT) {
            if (row < this._indicatorText.length) {
                data.setText("text", this._indicatorText.get(row));
            }
            else {
                data.setText("text", (row + 1) + "");
            }
        }
        if (kind == EPointerAreaKind.INDICATOR_BOTTOM_FIX) {
            if (row < this._bottomIndicatorText.length) {
                data.setText("text", this._bottomIndicatorText.get(row));
            }
            else {
                data.setText("text", "B" + (row + 1));
            }
        }
        if (kind == EPointerAreaKind.HEADER_LEFT_FIX) {
            if (col < this._leftHeaderText.length) {
                data.setText("text", this._leftHeaderText.get(col));
            }
            else {
                data.setText("text", "");
            }
        }
        if (kind == EPointerAreaKind.HEADER_CLIENT) {
            let str = this._headerText.get(col + "," + row);
            if (str != undefined)
                data.setText("text", str);
        }
        if (kind == EPointerAreaKind.HEADER_RIGHT_FIX) {
            if (col < this._rightHeaderText.length) {
                data.setText("text", this._rightHeaderText.get(col));
            }
            else {
                data.setText("text", "");
            }
        }
        return super.doBeforeCellDraw(kind, col, row, data, bounds);
    }
    cell(column, row) { }
    setCell(column, row, value) { }
}
class CDataGrid extends CCustomDataGrid {
    get datas() {
        let arr = new Array();
        if (this.__data != undefined) {
            for (let n = 0; n < this.__data.length; n++) {
                let ar = new Array();
                for (let i = 0; i < this.__data.getRow(n).length; i++) {
                    ar.push(this.__data.getRow(n).get(i).asString);
                }
                arr.push(ar);
            }
        }
        return arr;
    }
    set datas(value) {
        if (this.__data != undefined) {
            this.__data.clear();
            for (let n = 0; n < value.length; n++) {
                this.__data.add(value[n]);
            }
        }
    }
    get multiSelect() {
        return this._multiSelect;
    }
    set multiSelect(value) {
        if (this._multiSelect != value) {
            this._multiSelect = value;
            if (!value) {
                this._selectItems.clear();
            }
        }
    }
    get rowSelect() {
        return this._rowSelect;
    }
    set rowSelect(value) {
        if (this._rowSelect != value) {
            this._selectItems.clear();
            this._rowSelect = value;
        }
    }
    get headers() {
        return this._headers;
    }
    get indexColumns() {
        return this._indexColumns;
    }
    get column() {
        return this._column;
    }
    set column(value) {
        let v = value;
        if (this.__data != undefined && this.__data.columnCount <= v)
            v = this.__data.columnCount - 1;
        if (v < 0)
            v = 0;
        if (this._column != v) {
            this._column = v;
            this.itemLayerDraw();
        }
    }
    get row() {
        return this._row;
    }
    set row(value) {
        let v = value;
        if (this.__data != undefined && this.__data.length <= v)
            v = this.__data.length - 1;
        if (v < 0)
            v = 0;
        if (this._row != v) {
            this._row = v;
            this.itemLayerDraw();
        }
    }
    get length() {
        if (this.__data != undefined) {
            return this.__data.length;
        }
        else {
            return 0;
        }
    }
    constructor(parent, name) {
        super(parent, name);
        this._headers = new CStringList();
        this._indexColumns = new CStringList();
        let self = this;
        this.hasFocus = true;
        this._headers.onChange = function () {
            self.doCreateData();
        };
        this._indexColumns.onChange = function () {
            self.doCreateData();
        };
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "headers", this.headers.toData(), [], true);
        CDataClass.putData(data, "indexColumns", this.indexColumns.toData(), [], true);
        CDataClass.putData(data, "multiSelect", this.multiSelect, false);
        CDataClass.putData(data, "rowSelect", this.rowSelect, true);
    }
    doFromData(data) {
        super.doFromData(data);
        this.headers.fromData(CDataClass.getData(data, "headers", [], true));
        this.indexColumns.fromData(CDataClass.getData(data, "indexColumns", [], true));
        this.multiSelect = CDataClass.getData(data, "multiSelect", false);
        this.rowSelect = CDataClass.getData(data, "rowSelect", true);
    }
    doRemove() {
        this._indexColumns.remove();
        this._headers.remove();
        if (this.__data != undefined) {
            this.__data.remove();
        }
        super.doRemove();
    }
    doKeyDown(e) {
        super.doKeyDown(e);
        if (e.key == "ArrowLeft") {
            this.column--;
            let lx = this.columnToScrollX(this.column, "left");
            let rx = this.columnToScrollX(this.column, "right");
            if (lx < this.scrollX) {
                this.scrollX = lx;
            }
            else if (rx > this.scrollX) {
                this.scrollX = rx;
            }
            if (this.multiSelect) {
                if (!e.ctrlKey)
                    this.doSelectItem(this.column, this.row, false);
            }
            else {
                this.doSelectItem(this.column, this.row, false);
            }
        }
        if (e.key == "ArrowUp") {
            this.row--;
            let ty = this.rowToScrollY(this.row, "top");
            let by = this.rowToScrollY(this.row, "bottom");
            if (ty < this.scrollY) {
                this.scrollY = ty;
            }
            else if (by > this.scrollY) {
                this.scrollY = by;
            }
            if (this.multiSelect) {
                if (!e.ctrlKey)
                    this.doSelectItem(this.column, this.row, false);
            }
            else {
                this.doSelectItem(this.column, this.row, false);
            }
        }
        if (e.key == "ArrowRight") {
            this.column++;
            let lx = this.columnToScrollX(this.column, "left");
            let rx = this.columnToScrollX(this.column, "right");
            if (rx > this.scrollX) {
                this.scrollX = rx;
            }
            else if (lx < this.scrollX) {
                this.scrollX = lx;
            }
            if (this.multiSelect) {
                if (!e.ctrlKey)
                    this.doSelectItem(this.column, this.row, false);
            }
            else {
                this.doSelectItem(this.column, this.row, false);
            }
        }
        if (e.key == "ArrowDown") {
            this.row++;
            let ty = this.rowToScrollY(this.row, "top");
            let by = this.rowToScrollY(this.row, "bottom");
            if (by > this.scrollY) {
                this.scrollY = by;
            }
            else if (ty < this.scrollY) {
                this.scrollY = ty;
            }
            if (this.multiSelect) {
                if (!e.ctrlKey)
                    this.doSelectItem(this.column, this.row, false);
            }
            else {
                this.doSelectItem(this.column, this.row, false);
            }
        }
        if (e.key == "Enter" || e.key == " ") {
            if (this.multiSelect && e.ctrlKey) {
                this.doSelectItem(this.column, this.row, true);
            }
            else {
                this.doCellClick(EPointerAreaKind.CLIENT, this.column, this.row, 0, 0, 0, 0, new PointerEvent(""), this.__pressedThisPoints);
            }
        }
        if (e.ctrlKey && e.key.toUpperCase() == "A") {
            if (this.__data != undefined) {
                if (this.multiSelect) {
                    this.clearSelectItem();
                    if (this.rowSelect) {
                        for (let n = 0; n < this.__data.length; n++) {
                            this.addSelectItem(-1, n);
                        }
                    }
                    else {
                        for (let n = 0; n < this.__data.length; n++) {
                            for (let i = 0; i < this.__data.columnCount; i++) {
                                this.addSelectItem(i, n);
                            }
                        }
                    }
                }
            }
        }
    }
    doCreateData() {
        this.__data = new CTableData(this._headers.array, this._indexColumns.array);
        this.gridInfo.columnCount = this._headers.length;
        let self = this;
        this.__data.onChange = function (sender, kind, col, row) {
            self.doDataChange(kind, col, row);
            self.itemLayerDraw();
        };
    }
    doDataChange(kind, column, row) {
        if (this.__data != undefined) {
            this.gridInfo.rowCount = this.__data.length;
        }
    }
    doBeforeCellDraw(kind, col, row, data, bounds) {
        if (kind == EPointerAreaKind.CLIENT) {
            if (this.__data != undefined) {
                if (this.__data.length > row && this.__data.columnCount > col) {
                    if (this.__data.getRow(row).get(col).type == "object") {
                        data.setObject(this.__data.getRow(row).get(col).asObject);
                    }
                    else {
                        data.setText("text", this.__data.getRow(row).get(col).asString);
                    }
                }
                else {
                    data.setText("text", "");
                }
            }
        }
        return super.doBeforeCellDraw(kind, col, row, data, bounds);
    }
    doSelectItem(column, row, multiSelect) {
        if (multiSelect) {
            if (this.rowSelect) {
                if (this._selectItems.has(row + "")) {
                    this.deleteSelectItem(column, row);
                }
                else {
                    this.addSelectItem(column, row);
                }
            }
            else {
                if (this._selectItems.has(column + "," + row)) {
                    this.deleteSelectItem(column, row);
                }
                else {
                    this.addSelectItem(column, row);
                }
            }
        }
        else {
            this.clearSelectItem();
            this.addSelectItem(column, row);
        }
        if (this.onSelectItem != undefined) {
            this.onSelectItem(this, column, row);
        }
    }
    doCellClick(kind, column, row, x, y, width, height, e, points) {
        if (kind == EPointerAreaKind.CLIENT) {
            this.column = column;
            this.row = row;
            this.doSelectItem(column, row, e.ctrlKey);
        }
        super.doCellClick(kind, column, row, x, y, width, height, e, points);
    }
    doCellDrag(cellInfo, alignInfo, e, points) {
        super.doCellDrag(cellInfo, alignInfo, e, points);
        this.clearSelectItem();
        if (this.multiSelect && e.pointerType == "mouse") {
            if (this.rowSelect) {
                for (let y = alignInfo.startCell.y; y <= alignInfo.stopCell.y; y++) {
                    this.addSelectItem(-1, y);
                }
            }
            else {
                for (let x = alignInfo.startCell.x; x <= alignInfo.stopCell.x; x++) {
                    for (let y = alignInfo.startCell.y; y <= alignInfo.stopCell.y; y++) {
                        this.addSelectItem(x, y);
                    }
                }
            }
        }
    }
    doAddData(values) {
        if (this.__data != undefined) {
            return this.__data.add(values);
        }
    }
    doInsertData(index, values) {
        if (this.__data != undefined) {
            return this.__data.insert(index, values);
        }
    }
    doDeleteData(index) {
        if (this.__data != undefined) {
            this.__data.delete(index);
        }
    }
    doClear() {
        if (this.__data != undefined) {
            this.__data.clear();
        }
    }
    add(values) {
        return this.doAddData(values);
    }
    insert(index, values) {
        return this.doInsertData(index, values);
    }
    delete(index) {
        this.doDeleteData(index);
    }
    clear() {
        this.doClear();
    }
    cell(column, row) {
        if (this.__data != undefined) {
            if (this.__data.length > row && this.__data.getRow(row).length > column) {
                return this.__data.getRow(row).get(column).value;
            }
        }
    }
    setCell(column, row, value) {
        if (this.__data != undefined) {
            this.__data.getRow(row).get(column).asString = value;
        }
    }
    autoFitColumnWidth(columnIndex) {
        if (this.__data != undefined) {
            let w = 0;
            w = CStringUtil.getTextWidth(this.__headerData[0].get(0).textSet, this._headers.get(columnIndex)) + 10;
            for (let n = 0; n < this.__data.length; n++) {
                w = CCalc.max(w, CStringUtil.getTextWidth(this.__cellData[0].get(0).textSet, this.cell(columnIndex, n)) + 10);
            }
            this.gridInfo.diffColumnSize.set(columnIndex, w);
        }
    }
    autoFitColumnWidthAll() {
        for (let n = 0; n < this._headers.length; n++) {
            this.autoFitColumnWidth(n);
        }
    }
    autoFitRowHeight(rowIndex) {
        if (this.__data != undefined) {
            let h = 0;
            for (let n = 0; n < this.__data.columnCount; n++) {
                h = CCalc.max(h, CStringUtil.getTextHeight(this.__cellData[0].get(0).textSet, this.cell(n, rowIndex)) + 10);
            }
            this.gridInfo.diffRowSize.set(rowIndex, h);
        }
    }
    autoFitRowHeightAll() {
        if (this.__data != undefined) {
            for (let n = 0; n < this.__data.length; n++) {
                this.autoFitRowHeight(n);
            }
        }
    }
    autoFitAll() {
        this.autoFitColumnWidthAll();
        this.autoFitRowHeightAll();
    }
    addProperties() {
        let arr = super.addProperties();
        arr.push({ instance: this.datas, propertyName: "datas", readOnly: false, enum: [] });
        return arr;
    }
}
class CSpreadSheetSelector extends CPanel {
}
class CSpreadSheet extends CCustomDataGrid {
}
var ETabButtonKind;
(function (ETabButtonKind) {
    ETabButtonKind[ETabButtonKind["ALIGN"] = 0] = "ALIGN";
    ETabButtonKind[ETabButtonKind["AUTO_SIZE"] = 1] = "AUTO_SIZE";
})(ETabButtonKind || (ETabButtonKind = {}));
class CTabButton extends CPanel {
    get tabs() {
        return this._tabs;
    }
    get buttons() {
        return this.__buttons;
    }
    get scrollBox() {
        return this._scrollBox;
    }
    get leftButton() {
        return this._leftButton;
    }
    get rightButton() {
        return this._rightButton;
    }
    get addButton() {
        return this._addButton;
    }
    get deleteButton() {
        return this._deleteButton;
    }
    get index() {
        return this._index;
    }
    set index(value) {
        if (value != this._index) {
            this._index = value;
            this.doChangeIndex();
        }
    }
    get tabButtonResource() {
        return this._tabButtonResource;
    }
    set tabButtonResource(value) {
        if (value != this._tabButtonResource) {
            this._tabButtonResource = value;
            for (let n = 0; n < this.__buttons.length; n++) {
                this.__buttons[n].resource = value;
            }
        }
    }
    get leftButtonResource() {
        return this._leftButtonResource;
    }
    set leftButtonResource(value) {
        if (value != this._leftButtonResource) {
            this._leftButtonResource = value;
            this._leftButton.resource = value;
        }
    }
    get rightButtonResource() {
        return this._rightButtonResource;
    }
    set rightButtonResource(value) {
        if (value != this._rightButtonResource) {
            this._rightButtonResource = value;
            this._rightButton.resource = value;
        }
    }
    get addButtonResource() {
        return this._addButtonResource;
    }
    set addButtonResource(value) {
        if (value != this._addButtonResource) {
            this._addButtonResource = value;
            this._addButton.resource = value;
        }
    }
    get deleteButtonResource() {
        return this._deleteButtonResource;
    }
    set deleteButtonResource(value) {
        if (value != this._deleteButtonResource) {
            this._deleteButtonResource = value;
            this._deleteButton.resource = value;
        }
    }
    get kind() {
        return this._kind;
    }
    set kind(value) {
        if (value != this._kind) {
            this._kind = value;
            this.doSetButtions();
        }
    }
    get managementButtonLength() {
        return this._managementButtonLength;
    }
    set managementButtonLength(value) {
        if (value != this._managementButtonLength) {
            this._managementButtonLength = value;
            this.doSetButtions();
        }
    }
    get tabButtonMargin() {
        return this._tabButtonMargin;
    }
    set tabButtonMargin(value) {
        if (value != this._tabButtonMargin) {
            this._tabButtonMargin = value;
            this.doSetButtions();
        }
    }
    get useAddButton() {
        return this._useAddButton;
    }
    set useAddButton(value) {
        if (value != this._useAddButton) {
            this._useAddButton = value;
            this.doSetButtions();
        }
    }
    get useDeleteButton() {
        return this._useDeleteButton;
    }
    set useDeleteButton(value) {
        if (value != this._useDeleteButton) {
            this._useDeleteButton = value;
            this.doSetButtions();
        }
    }
    get useArrowButton() {
        return this._useArrowButton;
    }
    set useArrowButton(value) {
        if (value != this._useArrowButton) {
            this._useArrowButton = value;
            this.doSetButtions();
        }
    }
    get leftButtonText() {
        return this._leftButtonText;
    }
    set leftButtonText(value) {
        if (value != this._leftButtonText) {
            this._leftButtonText = value;
            this._leftButton.text = value;
        }
    }
    get rightButtonText() {
        return this._rightButtonText;
    }
    set rightButtonText(value) {
        if (value != this._rightButtonText) {
            this._rightButtonText = value;
            this._rightButton.text = value;
        }
    }
    get addButtonText() {
        return this._addButtonText;
    }
    set addButtonText(value) {
        if (value != this._addButtonText) {
            this._addButtonText = value;
            this._addButton.text = value;
        }
    }
    get deleteButtonText() {
        return this._deleteButtonText;
    }
    set deleteButtonText(value) {
        if (value != this._deleteButtonText) {
            this._deleteButtonText = value;
            this._deleteButton.text = value;
        }
    }
    constructor(parent, name) {
        super(parent, name);
        this.__scrollInterval = 0;
        this.__buttons = new Array();
        this._scrollBox = new CScrollBox(this);
        this._leftButton = new CButton(this);
        this._deleteButton = new CButton(this);
        this._addButton = new CButton(this);
        this._rightButton = new CButton(this);
        this._tabs = new CStringList();
        this._index = -1;
        this._tabButtonResource = "";
        this._leftButtonResource = "";
        this._rightButtonResource = "";
        this._addButtonResource = "";
        this._deleteButtonResource = "";
        this._kind = ETabButtonKind.ALIGN;
        this._managementButtonLength = 30;
        this._tabButtonMargin = 0;
        this._useArrowButton = false;
        this._useAddButton = false;
        this._useDeleteButton = false;
        this._leftButtonText = "";
        this._rightButtonText = "";
        this._addButtonText = "";
        this._deleteButtonText = "";
        this.defaultTabName = "Tab";
        let self = this;
        this._scrollBox.position.align = EPositionAlign.CLIENT;
        this._scrollBox.onChangeSize = function () {
            self.doSetButtions();
        };
        this._scrollBox.useHScrollbar = false;
        this._scrollBox.useVScrollbar = false;
        this._rightButton.position.align = EPositionAlign.RIGHT;
        this._rightButton.onResource = function () {
            self._rightButton.position.align = EPositionAlign.RIGHT;
            self._rightButton.usePointerCapture = true;
            self._rightButton.text = self._rightButtonText;
        };
        this._rightButton.onThisPointerDown = function () {
            if (self.__scrollInterval == 0) {
                self.__scrollInterval = setInterval(function () {
                    self.doTabButtonContentScroll(10);
                }, 16);
            }
        };
        this._rightButton.onThisPointerUp = function () {
            clearInterval(self.__scrollInterval);
            self.__scrollInterval = 0;
        };
        this._addButton.position.align = EPositionAlign.RIGHT;
        this._addButton.onClick = function () {
            self.doAddTab(CSequence.getSequence(self.defaultTabName));
        };
        this._addButton.onResource = function () {
            self._addButton.position.align = EPositionAlign.RIGHT;
            self._addButton.text = self._addButtonText;
        };
        this._deleteButton.position.align = EPositionAlign.RIGHT;
        this._deleteButton.onClick = function () {
            self.doDeleteTab();
        };
        this._deleteButton.onResource = function () {
            self._deleteButton.position.align = EPositionAlign.RIGHT;
            self._deleteButton.text = self._deleteButtonText;
        };
        this._leftButton.position.align = EPositionAlign.LEFT;
        this._leftButton.onResource = function () {
            self._leftButton.position.align = EPositionAlign.LEFT;
            self._leftButton.usePointerCapture = true;
            self._leftButton.text = self._leftButtonText;
        };
        this._leftButton.onThisPointerDown = function () {
            if (self.__scrollInterval == 0) {
                self.__scrollInterval = setInterval(function () {
                    self.doTabButtonContentScroll(-10);
                }, 16);
            }
        };
        this._leftButton.onThisPointerUp = function () {
            clearInterval(self.__scrollInterval);
            self.__scrollInterval = 0;
        };
        this._tabs.onChange = function () {
            self.doChangeTabs();
        };
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "tabs", this.tabs.toData(), [], true);
        CDataClass.putData(data, "tabButtonResource", this.tabButtonResource, "");
        CDataClass.putData(data, "leftButtonResource", this.leftButtonResource, "");
        CDataClass.putData(data, "rightButtonResource", this.rightButtonResource, "");
        CDataClass.putData(data, "addButtonResource", this.addButtonResource, "");
        CDataClass.putData(data, "deleteButtonResource", this.deleteButtonResource, "");
        CDataClass.putData(data, "kind", this.kind, ETabButtonKind.ALIGN);
        CDataClass.putData(data, "useArrowButton", this.useArrowButton, false);
        CDataClass.putData(data, "useAddButton", this.useAddButton, false);
        CDataClass.putData(data, "useDeleteButton", this.useDeleteButton, false);
        CDataClass.putData(data, "managementButtonLength", this.managementButtonLength, 30);
        CDataClass.putData(data, "tabButtonMargin", this.tabButtonMargin, 0);
        CDataClass.putData(data, "defaultTabName", this.defaultTabName, "Tab");
        CDataClass.putData(data, "leftButtonText", this.leftButtonText, "");
        CDataClass.putData(data, "rightButtonText", this.rightButtonText, "");
        CDataClass.putData(data, "addButtonText", this.addButtonText, "");
        CDataClass.putData(data, "deleteButtonText", this.deleteButtonText, "");
    }
    doFromData(data) {
        super.doFromData(data);
        this.tabs.fromData(CDataClass.getData(data, "tabs", [], true));
        this.tabButtonResource = CDataClass.getData(data, "tabButtonResource", "");
        this.leftButtonResource = CDataClass.getData(data, "leftButtonResource", "");
        this.rightButtonResource = CDataClass.getData(data, "rightButtonResource", "");
        this.addButtonResource = CDataClass.getData(data, "addButtonResource", "");
        this.deleteButtonResource = CDataClass.getData(data, "deleteButtonResource", "");
        this.kind = CDataClass.getData(data, "kind", ETabButtonKind.ALIGN);
        this.useArrowButton = CDataClass.getData(data, "useArrowButton", false);
        this.useAddButton = CDataClass.getData(data, "useAddButton", false);
        this.useDeleteButton = CDataClass.getData(data, "useDeleteButton", false);
        this.managementButtonLength = CDataClass.getData(data, "managementButtonLength", 30);
        this.tabButtonMargin = CDataClass.getData(data, "tabButtonMargin", 0);
        this.defaultTabName = CDataClass.getData(data, "defaultTabName", "Tab");
        this.leftButtonText = CDataClass.getData(data, "leftButtonText", "");
        this.rightButtonText = CDataClass.getData(data, "rightButtonText", "");
        this.addButtonText = CDataClass.getData(data, "addButtonText", "");
        this.deleteButtonText = CDataClass.getData(data, "deleteButtonText", "");
    }
    doRemove() {
        this.tabs.clear();
        super.doRemove();
    }
    doChangeIndex() {
        for (let n = 0; n < this.__buttons.length; n++) {
            this.__buttons[n].selected = this.index == n;
        }
        if (this.onChangeIndex != undefined) {
            this.onChangeIndex(this);
        }
    }
    doAddTab(tabName) {
        //this.tabs.add(CSequence.getSequence(this.defaultTabName))
        this.tabs.add(tabName);
        if (this.onAddTab != undefined) {
            this.onAddTab(this, this.tabs.length - 1);
        }
    }
    doBeforeDeleteTab(index) {
        if (this.onBeforeDeleteTab != undefined) {
            this.onBeforeDeleteTab(this, index);
        }
    }
    doDeleteTab(index) {
        if (index != undefined) {
            this.doBeforeDeleteTab(index);
            this.tabs.delete(index);
            if (this.tabs.length <= index) {
                this.index = this.tabs.length - 1;
            }
            else {
                this.doChangeIndex();
            }
        }
        else {
            if (this.index != -1) {
                let idx = this.index;
                this.doBeforeDeleteTab(idx);
                this.tabs.delete(this.index);
                if (this.tabs.length <= idx) {
                    this.index = this.tabs.length - 1;
                }
                else {
                    this.doChangeIndex();
                }
            }
        }
        if (this.onDeleteTab != undefined) {
            this.onDeleteTab(this);
        }
    }
    doTabButtonContentScroll(value) {
        this.scrollBox.scrollLeft += value;
    }
    doTabButtonClick(index) {
        this.index = index;
        if (this.onTabButtonClick != undefined) {
            this.onTabButtonClick(this, index);
        }
    }
    doChangeTabs() {
        this.doSetButtions();
        if (this.onChangeTabs != undefined) {
            this.onChangeTabs(this);
        }
    }
    doSetButtions() {
        let self = this;
        if (this.__buttons.length > this._tabs.length) {
            for (let n = 0; n < (this.__buttons.length - this._tabs.length); n++) {
                this.__buttons[this.__buttons.length - 1].remove();
                this.__buttons.splice(this.__buttons.length - 1, 1);
            }
        }
        if (this.__buttons.length < this._tabs.length) {
            for (let n = 0; n < (this._tabs.length - this.__buttons.length); n++) {
                let btn = new CButton(this.scrollBox.content);
                btn.onResource = function () {
                    btn.useAutoSize = true;
                };
                btn.resource = this._tabButtonResource;
                let idx = this.__buttons.length;
                btn.onClick = function () {
                    self.doTabButtonClick(idx);
                };
                this.__buttons.push(btn);
                this.doCreateTabButton(btn);
            }
        }
        for (let n = 0; n < this._tabs.length; n++) {
            this.__buttons[n].text = this._tabs.get(n);
        }
        if (this.kind == ETabButtonKind.ALIGN) {
            this.scrollBox.contentHeight = this.scrollBox.position.height;
            this.scrollBox.contentWidth = this.scrollBox.position.width;
            let w = (this.scrollBox.position.width - (this.tabButtonMargin * (this.__buttons.length - 1))) / this.__buttons.length;
            let l = 0;
            for (let n = 0; n < this.__buttons.length; n++) {
                this.__buttons[n].useAutoSize = false;
                this.__buttons[n].position.top = 0;
                this.__buttons[n].position.left = l;
                this.__buttons[n].position.height = this.scrollBox.position.height;
                this.__buttons[n].position.width = w;
                l += this.__buttons[n].position.width + this._tabButtonMargin;
            }
        }
        else {
            let l = 0;
            for (let n = 0; n < this.__buttons.length; n++) {
                this.__buttons[n].useAutoSize = true;
                this.__buttons[n].position.top = 0;
                this.__buttons[n].position.left = l;
                this.__buttons[n].position.height = this.scrollBox.position.height;
                l += this.__buttons[n].position.width + this._tabButtonMargin;
            }
            this.scrollBox.contentHeight = this.scrollBox.position.height;
            this.scrollBox.contentWidth = l;
        }
        this._leftButton.visible = this.useArrowButton && this.kind == ETabButtonKind.AUTO_SIZE;
        this._rightButton.visible = this.useArrowButton && this.kind == ETabButtonKind.AUTO_SIZE;
        this._addButton.visible = this.useAddButton && this.kind == ETabButtonKind.AUTO_SIZE;
        this._deleteButton.visible = this.useDeleteButton && this.kind == ETabButtonKind.AUTO_SIZE;
        this._leftButton.position.width = this._managementButtonLength;
        this._rightButton.position.width = this._managementButtonLength;
        this._addButton.position.width = this._managementButtonLength;
        this._deleteButton.position.width = this._managementButtonLength;
        if (this.onSetButtons != undefined) {
            this.onSetButtons(this);
        }
    }
    doCreateTabButton(button) {
        if (this.onCreateTabButton != undefined) {
            this.onCreateTabButton(this, button);
        }
    }
    addTab(tabName) {
        this.doAddTab(tabName);
    }
    deleteTab(index) {
        this.doDeleteTab(index);
    }
    clear() {
        this.tabs.clear();
    }
    scrollToLeft() {
        this._scrollBox.scrollToLeft();
    }
    scrollToRight() {
        this._scrollBox.scrollToRight();
    }
    addProperties() {
        let arr = new Array();
        for (let n = 0; n < this.__buttons.length; n++) {
            arr.push({ instance: this.__buttons[n], propertyName: "buttons[" + n + "]", readOnly: false, enum: [] });
        }
        return arr;
    }
}
class CTab extends CPanel {
    get body() {
        return this._body;
    }
    get tabs() {
        return this._tab.tabs;
    }
    get tabButtons() {
        return this._tab;
    }
    get tabSheets() {
        return this._tabSheets;
    }
    get index() {
        return this._tab.index;
    }
    set index(value) {
        this._tab.index = value;
    }
    get tabButtonResource() {
        return this._tabButtonResource;
    }
    set tabButtonResource(value) {
        if (this._tabButtonResource != value) {
            this._tabButtonResource = value;
            this._tab.tabButtonResource = value;
            this._tab.doSetButtions();
        }
    }
    get leftButtonResource() {
        return this._tab.leftButtonResource;
    }
    set leftButtonResource(value) {
        this._tab.leftButtonResource = value;
    }
    get rightButtonResource() {
        return this._tab.rightButtonResource;
    }
    set rightButtonResource(value) {
        this._tab.rightButtonResource = value;
    }
    get addButtonResource() {
        return this._tab.addButtonResource;
    }
    set addButtonResource(value) {
        this._tab.addButtonResource = value;
    }
    get deleteButtonResource() {
        return this._tab.deleteButtonResource;
    }
    set deleteButtonResource(value) {
        this._tab.deleteButtonResource = value;
    }
    get kind() {
        return this._tab.kind;
    }
    set kind(value) {
        this._tab.kind = value;
    }
    get useAddButton() {
        return this._tab.useAddButton;
    }
    set useAddButton(value) {
        this._tab.useAddButton = value;
    }
    get useDeleteButton() {
        return this._tab.useDeleteButton;
    }
    set useDeleteButton(value) {
        this._tab.useDeleteButton = value;
    }
    get useArrowButton() {
        return this._tab.useArrowButton;
    }
    set useArrowButton(value) {
        this._tab.useArrowButton = value;
    }
    get managementButtonLength() {
        return this._tab.managementButtonLength;
    }
    set managementButtonLength(value) {
        this._tab.managementButtonLength = value;
    }
    get tabButtonMargin() {
        return this._tab.tabButtonMargin;
    }
    set tabButtonMargin(value) {
        this._tab.tabButtonMargin = value;
    }
    get tabResource() {
        return this._tab.resource;
    }
    set tabResource(value) {
        this._tab.resource = value;
    }
    get tabHeight() {
        return this._tabHeight;
    }
    set tabHeight(value) {
        if (this._tabHeight != value) {
            this._tabHeight = value;
            this._tab.position.height = value;
        }
    }
    get tabSheetResource() {
        return this._tabSheetResource;
    }
    set tabSheetResource(value) {
        if (this._tabSheetResource != value) {
            this._tabSheetResource = value;
            for (let n = 0; n < this.tabSheets.length; n++) {
                this.tabSheets.get(n).resource = value;
            }
        }
    }
    get tabBodyResource() {
        return this._body.resource;
    }
    set tabBodyResource(value) {
        this._body.resource = value;
    }
    get defaultTabName() {
        return this._tab.defaultTabName;
    }
    set defaultTabName(value) {
        this._tab.defaultTabName = value;
    }
    get leftButtonText() {
        return this.tabButtons.leftButtonText;
    }
    set leftButtonText(value) {
        this.tabButtons.leftButtonText = value;
    }
    get rightButtonText() {
        return this.tabButtons.rightButtonText;
    }
    set rightButtonText(value) {
        this.tabButtons.rightButtonText = value;
    }
    get addButtonText() {
        return this.tabButtons.addButtonText;
    }
    set addButtonText(value) {
        this.tabButtons.addButtonText = value;
    }
    get deleteButtonText() {
        return this.tabButtons.deleteButtonText;
    }
    set deleteButtonText(value) {
        this.tabButtons.deleteButtonText = value;
    }
    constructor(parent, name) {
        super(parent, name);
        this._tab = new CTabButton(this);
        this._tabSheets = new CList();
        this._tabButtonResource = "";
        this._tabSheetResource = "";
        this._body = new CPanel(this);
        this._tabHeight = 30;
        let self = this;
        this._tab.position.align = EPositionAlign.TOP;
        this._tab.position.height = this._tabHeight;
        this._tab.onResource = function () {
            self._tab.position.align = EPositionAlign.TOP;
            self._tab.position.height = self._tabHeight;
        };
        this._tab.onChangeIndex = function () {
            self.doChangeIndex();
        };
        this._tab.onAddTab = function (s, idx) {
            self.doAddTab(idx);
        };
        this._tab.onBeforeDeleteTab = function (s, idx) {
            self.doBeforeDeleteTab(idx);
        };
        this._tab.onDeleteTab = function () {
            self.doDeleteTab();
        };
        this._tab.onTabButtonClick = function (s, i) {
            self.doTabButtonClick(i);
        };
        this._tab.onChangeTabs = function () {
            self.doChangeTabs();
        };
        this._body.position.align = EPositionAlign.CLIENT;
        this._body.onResource = function () {
            self._body.position.align = EPositionAlign.CLIENT;
        };
        this._body.propertyName = "body";
        this._body.propertyDataKind = "reserveControl,_body";
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "tabs", this.tabs.toData(), [], true);
        CDataClass.putData(data, "tabButtonResource", this.tabButtonResource, "");
        CDataClass.putData(data, "leftButtonResource", this.leftButtonResource, "");
        CDataClass.putData(data, "rightButtonResource", this.rightButtonResource, "");
        CDataClass.putData(data, "addButtonResource", this.addButtonResource, "");
        CDataClass.putData(data, "deleteButtonResource", this.deleteButtonResource, "");
        CDataClass.putData(data, "kind", this.kind, ETabButtonKind.ALIGN);
        CDataClass.putData(data, "useArrowButton", this.useArrowButton, false);
        CDataClass.putData(data, "useAddButton", this.useAddButton, false);
        CDataClass.putData(data, "useDeleteButton", this.useDeleteButton, false);
        CDataClass.putData(data, "managementButtonLength", this.managementButtonLength, 30);
        CDataClass.putData(data, "tabButtonMargin", this.tabButtonMargin, 0);
        CDataClass.putData(data, "defaultTabName", this.defaultTabName, "Tab");
        CDataClass.putData(data, "tabResource", this.tabResource, "");
        CDataClass.putData(data, "tabBodyResource", this.tabBodyResource, "");
        CDataClass.putData(data, "tabSheetResource", this.tabSheetResource, "");
        CDataClass.putData(data, "leftButtonText", this.leftButtonText, "");
        CDataClass.putData(data, "rightButtonText", this.rightButtonText, "");
        CDataClass.putData(data, "addButtonText", this.addButtonText, "");
        CDataClass.putData(data, "deleteButtonText", this.deleteButtonText, "");
        CDataClass.putData(data, "tabHeight", this.tabHeight, 30);
        let arr = new Array();
        for (let n = 0; n < this.tabs.length; n++) {
            arr.push({ button: this.tabButtons.buttons[n].toData(), sheet: this.tabSheets.get(n).toData() });
        }
        CDataClass.putData(data, "buttonSheet", arr, [], true);
    }
    doFromData(data) {
        super.doFromData(data);
        this.tabButtonResource = CDataClass.getData(data, "tabButtonResource", "");
        this.leftButtonResource = CDataClass.getData(data, "leftButtonResource", "");
        this.rightButtonResource = CDataClass.getData(data, "rightButtonResource", "");
        this.addButtonResource = CDataClass.getData(data, "addButtonResource", "");
        this.deleteButtonResource = CDataClass.getData(data, "deleteButtonResource", "");
        this.kind = CDataClass.getData(data, "kind", ETabButtonKind.ALIGN);
        this.useArrowButton = CDataClass.getData(data, "useArrowButton", false);
        this.useAddButton = CDataClass.getData(data, "useAddButton", false);
        this.useDeleteButton = CDataClass.getData(data, "useDeleteButton", false);
        this.managementButtonLength = CDataClass.getData(data, "managementButtonLength", 30);
        this.tabButtonMargin = CDataClass.getData(data, "tabButtonMargin", 0);
        this.defaultTabName = CDataClass.getData(data, "defaultTabName", "Tab");
        this.tabResource = CDataClass.getData(data, "tabResource", "");
        this.tabBodyResource = CDataClass.getData(data, "tabBodyResource", "");
        this.tabSheetResource = CDataClass.getData(data, "tabSheetResource", "");
        this.leftButtonText = CDataClass.getData(data, "leftButtonText", "");
        this.rightButtonText = CDataClass.getData(data, "rightButtonText", "");
        this.addButtonText = CDataClass.getData(data, "addButtonText", "");
        this.deleteButtonText = CDataClass.getData(data, "deleteButtonText", "");
        this.tabHeight = CDataClass.getData(data, "tabHeight", 30);
        this.clear();
        this.tabs.fromData(CDataClass.getData(data, "tabs", [], true));
        let arr = CDataClass.getData(data, "buttonSheet", [], true);
        for (let n = 0; n < arr.length; n++) {
            this.tabButtons.buttons[n].fromData(arr[n].button);
            this.tabSheets.get(n).fromData(arr[n].sheet);
        }
    }
    doChangeIndex() {
        for (let n = 0; n < this.tabSheets.length; n++) {
            let b = n == this.index;
            if (this.tabSheets.get(n).visible != b) {
                this.tabSheets.get(n).visible = b;
            }
        }
        if (this.onChangeIndex != undefined) {
            this.onChangeIndex(this);
        }
    }
    doAddTab(index) {
        if (this.onAddTab != undefined) {
            this.onAddTab(this);
        }
    }
    doBeforeDeleteTab(index) {
        this.tabSheets.get(index).remove();
        this.tabSheets.delete(index);
        if (this.onBeforeDeleteTab != undefined) {
            this.onBeforeDeleteTab(this, index);
        }
    }
    doDeleteTab() {
        if (this.onDeleteTab != undefined) {
            this.onDeleteTab(this);
        }
    }
    doTabButtonClick(index) {
        if (this.onTabButtonClick != undefined) {
            this.onTabButtonClick(this, index);
        }
    }
    doChangeTabs() {
        this.tabSheets.length = this.tabs.length;
        for (let n = 0; n < this.tabSheets.length; n++) {
            if (this.tabSheets.get(n) == undefined) {
                let sheet = new CPanel(this._body);
                sheet.position.align = EPositionAlign.CLIENT;
                sheet.visible = false;
                sheet.onResource = function () {
                    sheet.position.align = EPositionAlign.CLIENT;
                    sheet.visible = false;
                };
                sheet.resource = this.tabSheetResource;
                this.tabSheets.set(n, sheet);
                sheet.propertyName = "sheet" + n;
                sheet.propertyDataKind = "reserveControl,parent.tabSheets.get(" + n + ")";
                this.doCreateSheet(n, sheet);
            }
        }
        if (this.onChangeTabs != undefined) {
            this.onChangeTabs(this);
        }
    }
    doCreateSheet(index, tabSheet) {
        if (this.onCreateTabSheet != undefined) {
            this.onCreateTabSheet(this, index, tabSheet);
        }
    }
    addTab(tabName) {
        this.tabButtons.addTab(tabName);
        this.index = this.tabs.length - 1;
        this.tabButtons.scrollToRight();
    }
    deleteTab(tabNameOrIndex) {
        if (typeof tabNameOrIndex == "string") {
            for (let n = this.tabs.length - 1; n >= 0; n--) {
                if (this.tabs.get(n) == tabNameOrIndex) {
                    this.tabButtons.deleteTab(n);
                }
            }
        }
        else {
            this.tabButtons.deleteTab(tabNameOrIndex);
        }
    }
    clear() {
        for (let n = this.tabs.length - 1; n >= 0; n--) {
            this.tabButtons.deleteTab(n);
        }
    }
    addProperties() {
        let arr = new Array();
        arr.push({ instance: this.tabs, propertyName: "tabs", readOnly: false, enum: [] });
        arr.push({ instance: this.leftButtonResource, propertyName: "leftButtonResource", readOnly: false, enum: [] });
        arr.push({ instance: this.rightButtonResource, propertyName: "rightButtonResource", readOnly: false, enum: [] });
        arr.push({ instance: this.addButtonResource, propertyName: "addButtonResource", readOnly: false, enum: [] });
        arr.push({ instance: this.deleteButtonResource, propertyName: "deleteButtonResource", readOnly: false, enum: [] });
        arr.push({ instance: this.tabButtons, propertyName: "tabButtons", readOnly: false, enum: [] });
        arr.push({ instance: this.kind, propertyName: "kind", readOnly: false, enum: ["ALIGN", "AUTO_SIZE"] });
        arr.push({ instance: this.useArrowButton, propertyName: "useArrowButton", readOnly: false, enum: [] });
        arr.push({ instance: this.useAddButton, propertyName: "useAddButton", readOnly: false, enum: [] });
        arr.push({ instance: this.useDeleteButton, propertyName: "useDeleteButton", readOnly: false, enum: [] });
        arr.push({ instance: this.leftButtonText, propertyName: "leftButtonText", readOnly: false, enum: [] });
        arr.push({ instance: this.rightButtonText, propertyName: "rightButtonText", readOnly: false, enum: [] });
        arr.push({ instance: this.addButtonText, propertyName: "addButtonText", readOnly: false, enum: [] });
        arr.push({ instance: this.deleteButtonText, propertyName: "deleteButtonText", readOnly: false, enum: [] });
        arr.push({ instance: this.index, propertyName: "index", readOnly: false, enum: [] });
        return arr;
    }
}
var ECalendarDateKind;
(function (ECalendarDateKind) {
    ECalendarDateKind[ECalendarDateKind["PREVIOUS_MONTH"] = 0] = "PREVIOUS_MONTH";
    ECalendarDateKind[ECalendarDateKind["NOW_MONTH"] = 1] = "NOW_MONTH";
    ECalendarDateKind[ECalendarDateKind["NEXT_MONTH"] = 2] = "NEXT_MONTH";
})(ECalendarDateKind || (ECalendarDateKind = {}));
class CCalendarDaySheet extends CPanel {
    constructor() {
        super(...arguments);
        this.date = new Date();
        this.dateKind = ECalendarDateKind.NOW_MONTH;
    }
}
class CCalendarPickup extends CPanel {
    get listYear() {
        return this._listYear;
    }
    get listMonth() {
        return this._listMonth;
    }
    get listYearResource() {
        return this._listYear.resource;
    }
    set listYearResource(value) {
        this._listYear.resource = value;
    }
    get listYearListItemResource() {
        return this._listYear.listItemResource;
    }
    set listYearListItemResource(value) {
        this._listYear.listItemResource = value;
    }
    get listMonthResource() {
        return this._listMonth.resource;
    }
    set listMonthResource(value) {
        this._listMonth.resource = value;
    }
    get listMonthListItemResource() {
        return this._listMonth.listItemResource;
    }
    set listMonthListItemResource(value) {
        this._listMonth.listItemResource = value;
    }
    get labelYearResource() {
        return this._labelYear.resource;
    }
    set labelYearResource(value) {
        this._labelYear.resource = value;
    }
    get labelMonthResource() {
        return this._labelMonth.resource;
    }
    set labelMonthResource(value) {
        this._labelMonth.resource = value;
    }
    constructor(parent, name) {
        super(parent, name);
        this.pickupYearFrom = 1900;
        this.pickupYearTo = 2100;
        let l = new CPanel(this);
        let r = new CPanel(this);
        let self = this;
        this.onResource = function () {
            self.position.padding.all = 5;
        };
        l.position.width = 100;
        l.position.align = EPositionAlign.LEFT;
        r.position.align = EPositionAlign.CLIENT;
        r.position.margins.left = 5;
        this._labelYear = new CPanel(l);
        this._labelYear.position.align = EPositionAlign.TOP;
        this._labelYear.position.height = 20;
        this._labelYear.text = "Year";
        this._labelYear.onResource = function () {
            self._labelYear.position.align = EPositionAlign.TOP;
            self._labelYear.position.height = 20;
            self._labelYear.text = "Year";
        };
        this._labelMonth = new CPanel(r);
        this._labelMonth.position.align = EPositionAlign.TOP;
        this._labelMonth.position.height = 20;
        this._labelMonth.text = "Month";
        this._labelMonth.onResource = function () {
            self._labelMonth.position.align = EPositionAlign.TOP;
            self._labelMonth.position.height = 20;
            self._labelMonth.text = "Month";
        };
        this._listYear = new CListBox(l);
        this._listYear.position.align = EPositionAlign.CLIENT;
        this._listYear.scrollBox.useVScrollbar = false;
        this._listYear.hasFocus = true;
        this._listYear.onResource = function () {
            self._listYear.position.align = EPositionAlign.CLIENT;
            self._listYear.scrollBox.useVScrollbar = false;
            self._listYear.hasFocus = true;
        };
        this._listMonth = new CListBox(r);
        this._listMonth.position.align = EPositionAlign.CLIENT;
        this._listMonth.scrollBox.useVScrollbar = false;
        this._listMonth.hasFocus = true;
        this._listMonth.onResource = function () {
            self._listMonth.position.align = EPositionAlign.CLIENT;
            self._listMonth.scrollBox.useVScrollbar = false;
            self._listMonth.hasFocus = true;
        };
        for (let n = this.pickupYearFrom; n <= this.pickupYearTo; n++) {
            this._listYear.items.add(n + "");
        }
        for (let n = 1; n <= 12; n++) {
            this._listMonth.items.add(n + "");
        }
    }
    setList(year, month) {
        for (let n = 0; n < this._listYear.length; n++) {
            if (parseInt(this._listYear.items.get(n)) == year) {
                this._listYear.itemIndex = n;
                this._listYear.scrollToIndex(n);
                break;
            }
        }
        for (let n = 0; n < this._listMonth.length; n++) {
            if (parseInt(this._listMonth.items.get(n)) == month) {
                this._listMonth.itemIndex = n;
                this._listMonth.scrollToIndex(n);
                break;
            }
        }
    }
}
class CCalendar extends CPanel {
    get calendarHeader() {
        return this._calendarHeader;
    }
    get calendarDayOfWeek() {
        return this._calendarDayOfWeek;
    }
    get calendarBody() {
        return this._calendarBody;
    }
    get buttonPrevious() {
        return this._buttonPrevious;
    }
    get buttonNext() {
        return this._buttonNext;
    }
    get buttonNow() {
        return this._buttonNow;
    }
    get buttonPick() {
        return this._buttonPick;
    }
    get dayOfWeekSheets() {
        return this._dayOfWeekSheets;
    }
    get daySheets() {
        return this._daySheets;
    }
    get calendarHeaderResource() {
        return this._calendarHeader.resource;
    }
    set calendarHeaderResource(value) {
        this._calendarHeader.resource = value;
    }
    get calendarDayOfWeekResource() {
        return this._calendarDayOfWeek.resource;
    }
    set calendarDayOfWeekResource(value) {
        this._calendarDayOfWeek.resource = value;
    }
    get calendarBodyResource() {
        return this._calendarBody.resource;
    }
    set calendarBodyResource(value) {
        this._calendarBody.resource = value;
    }
    get buttonPreviousResource() {
        return this._buttonPrevious.resource;
    }
    set buttonPreviousResource(value) {
        this._buttonPrevious.resource = value;
    }
    get buttonNextResource() {
        return this._buttonNext.resource;
    }
    set buttonNextResource(value) {
        this._buttonNext.resource = value;
    }
    get buttonNowResource() {
        return this._buttonNow.resource;
    }
    set buttonNowResource(value) {
        this._buttonNow.resource = value;
    }
    get buttonPickResource() {
        return this._buttonPick.resource;
    }
    set buttonPickResource(value) {
        this._buttonPick.resource = value;
    }
    get dayOfWeekSheetResource() {
        return this._dayOfWeekSheetResource;
    }
    set dayOfWeekSheetResource(value) {
        if (this._dayOfWeekSheetResource != value) {
            this._dayOfWeekSheetResource = value;
            for (let n = 0; n < this._dayOfWeekSheets.length; n++) {
                this._dayOfWeekSheets[n].resource = value;
            }
            this.doSetDayOfWeek();
        }
    }
    get daySheetResource() {
        return this._daySheetResource;
    }
    set daySheetResource(value) {
        if (this._daySheetResource != value) {
            this._daySheetResource = value;
            for (let n = 0; n < this._daySheets.length; n++) {
                for (let i = 0; i < this._daySheets[n].length; i++) {
                    this._daySheets[n][i].resource = value;
                }
            }
            this.doSetDate();
        }
    }
    get date() {
        return this._date;
    }
    set date(value) {
        if (value.getTime() != this._date.getTime()) {
            this._date = value;
            this.doChangeDate();
        }
    }
    get dayOfWeekText() {
        return this._dayOfWeekText;
    }
    set dayOfWeekText(value) {
        if (this._dayOfWeekText != value) {
            this._dayOfWeekText = value;
            this.doSetDayOfWeek();
        }
    }
    get year() {
        return this._date.getFullYear();
    }
    get month() {
        return this._date.getMonth() + 1;
    }
    get day() {
        return this._date.getDate();
    }
    get dayOfWeek() {
        return this._date.getDay();
    }
    get yearString() {
        return this.year + "";
    }
    get monthString() {
        return CStringUtil.lpad(this.month + "", "0", 2);
    }
    get dayString() {
        return CStringUtil.lpad(this.day + "", "0", 2);
    }
    get dayOfWeekString() {
        if (this._dayOfWeekText.length > this.dayOfWeek) {
            return this._dayOfWeekText[this.dayOfWeek];
        }
        else {
            let arr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            return arr[this.dayOfWeek];
        }
    }
    constructor(parent, name) {
        super(parent, name);
        this._calendarHeader = new CPanel(this);
        this._calendarDayOfWeek = new CPanel(this);
        this._calendarBody = new CPanel(this);
        this._buttonPrevious = new CButton(this._calendarHeader);
        this._buttonNext = new CButton(this._calendarHeader);
        this._buttonNow = new CButton(this._calendarHeader);
        this._buttonPick = new CButton(this._calendarHeader);
        this._dayOfWeekSheets = new Array(7);
        this._daySheets = new Array();
        this._daySheetResource = "";
        this._dayOfWeekSheetResource = "";
        this._dayOfWeekText = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        this.pickupResource = "";
        this.pickupListYearResource = "";
        this.pickupListMonthResource = "";
        this.pickupListYearListItemResource = [];
        this.pickupListMonthListItemResource = [];
        this.pickupLabelMonthResource = "";
        this.pickupLabelYearResource = "";
        this.pickupYearFrom = 1900;
        this.pickupYearTo = 2100;
        let self = this;
        this._calendarHeader.position.align = EPositionAlign.TOP;
        this._calendarHeader.position.height = 30;
        this._calendarHeader.position.parentAlignInfo.gridColumnCount = 7;
        this._calendarHeader.position.parentAlignInfo.gridRowCount = 1;
        this._calendarHeader.propertyName = "header";
        this._calendarHeader.propertyDataKind = "reserveControl,_calendarHeader";
        this._calendarHeader.onResource = function () {
            self._calendarHeader.position.align = EPositionAlign.TOP;
            self._calendarHeader.position.height = 30;
            self._calendarHeader.position.parentAlignInfo.gridColumnCount = 7;
            self._calendarHeader.position.parentAlignInfo.gridRowCount = 1;
            self._calendarHeader.text = self.date.getFullYear() + "-" + CStringUtil.lpad((self.date.getMonth() + 1) + "", "0", 2) + "-" + CStringUtil.lpad(self.date.getDate() + "", "0", 2);
            self._calendarHeader.propertyName = "header";
            self._calendarHeader.propertyDataKind = "reserveControl,_calendarHeader";
        };
        this._calendarDayOfWeek.position.align = EPositionAlign.TOP;
        this._calendarDayOfWeek.position.height = 30;
        this._calendarDayOfWeek.position.parentAlignInfo.gridColumnCount = 7;
        this._calendarDayOfWeek.position.parentAlignInfo.gridRowCount = 1;
        this._calendarDayOfWeek.propertyName = "dayOfWeek";
        this._calendarDayOfWeek.propertyDataKind = "reserveControl,_calendarDayOfWeek";
        this._calendarDayOfWeek.onResource = function () {
            self._calendarDayOfWeek.position.align = EPositionAlign.TOP;
            self._calendarDayOfWeek.position.height = 30;
            self._calendarDayOfWeek.position.parentAlignInfo.gridColumnCount = 7;
            self._calendarDayOfWeek.position.parentAlignInfo.gridRowCount = 1;
            self._calendarDayOfWeek.propertyName = "dayOfWeek";
            self._calendarDayOfWeek.propertyDataKind = "reserveControl,_calendarDayOfWeek";
        };
        this._calendarBody.position.align = EPositionAlign.CLIENT;
        this._calendarBody.position.parentAlignInfo.gridColumnCount = 7;
        this._calendarBody.position.parentAlignInfo.gridRowCount = 6;
        this._calendarBody.propertyName = "body";
        this._calendarBody.propertyDataKind = "reserveControl,_calendarBody";
        this._calendarBody.onResource = function () {
            self._calendarBody.position.align = EPositionAlign.CLIENT;
            self._calendarBody.position.parentAlignInfo.gridColumnCount = 7;
            self._calendarBody.position.parentAlignInfo.gridRowCount = 6;
            self._calendarBody.propertyName = "body";
            self._calendarBody.propertyDataKind = "reserveControl,_calendarBody";
        };
        this._buttonPrevious.position.align = EPositionAlign.LEFT;
        this._buttonPrevious.onResource = function () {
            self._buttonPrevious.position.align = EPositionAlign.LEFT;
        };
        this._buttonPrevious.onClick = function () {
            self.date = new Date(self.date.getFullYear(), self.date.getMonth() - 1, 1);
        };
        this._buttonNext.position.align = EPositionAlign.RIGHT;
        this._buttonNext.onResource = function () {
            self._buttonNext.position.align = EPositionAlign.RIGHT;
        };
        this._buttonNext.onClick = function () {
            self.date = new Date(self.date.getFullYear(), self.date.getMonth() + 1, 1);
        };
        this._buttonNow.position.align = EPositionAlign.LEFT;
        this._buttonNow.onResource = function () {
            self._buttonNow.position.align = EPositionAlign.LEFT;
        };
        this._buttonNow.onClick = function () {
            self.date = new Date();
        };
        self.calendarHeader.bringToFront();
        this._buttonPick.position.align = EPositionAlign.RIGHT;
        this._buttonPick.pickupResource = "controlbutton";
        this._buttonPick.onResource = function () {
            self._buttonPick.position.align = EPositionAlign.RIGHT;
        };
        this._buttonPick.onBeforePickupShow = function (s, p) {
            let pi = new CCalendarPickup(p, "pick");
            pi.resource = self.pickupResource;
            pi.listYearResource = self.pickupListYearResource;
            pi.listYearListItemResource = self.pickupListYearListItemResource;
            pi.listMonthResource = self.pickupListMonthResource;
            pi.listMonthListItemResource = self.pickupListMonthListItemResource;
            pi.labelMonthResource = self.pickupLabelMonthResource;
            pi.labelYearResource = self.pickupLabelYearResource;
            pi.listYear.rowHeight = 20;
            pi.listMonth.rowHeight = 20;
            pi.position.align = EPositionAlign.CLIENT;
            pi.setList(self.date.getFullYear(), self.date.getMonth() + 1);
            pi.listYear.onChangeItemIndex = function () {
                if (pi.listYear.itemIndex != -1) {
                    self.date = new Date(parseInt(pi.listYear.items.get(pi.listYear.itemIndex)), pi.listMonth.itemIndex, 1);
                }
            };
            pi.listMonth.onChangeItemIndex = function () {
                if (pi.listMonth.itemIndex != -1) {
                    self.date = new Date(parseInt(pi.listYear.items.get(pi.listYear.itemIndex)), pi.listMonth.itemIndex, 1);
                }
            };
            pi.filter.filterSet.shadow = true;
            pi.filter.shadowX = 0;
            pi.filter.shadowY = 0;
        };
        for (let n = 0; n < 7; n++) {
            let pan = new CPanel(this._calendarDayOfWeek);
            pan.onResource = function () {
                pan.position.alignInfo.gridColumn = n;
                pan.position.alignInfo.gridRow = 0;
                pan.position.align = EPositionAlign.GRID;
                pan.propertyName = "dayOfWeek" + n;
                pan.propertyDataKind = "reserveControl,parent._dayOfWeekSheets[" + n + "]";
            };
            pan.position.alignInfo.gridColumn = n;
            pan.position.alignInfo.gridRow = 0;
            pan.position.align = EPositionAlign.GRID;
            pan.propertyName = "dayOfWeek" + n;
            pan.propertyDataKind = "reserveControl,parent._dayOfWeekSheets[" + n + "]";
            this._dayOfWeekSheets[n] = pan;
        }
        this._daySheets.length = 7;
        for (let n = 0; n < 7; n++) {
            let arr = new Array(6);
            this._daySheets[n] = arr;
            for (let i = 0; i < 6; i++) {
                let pan = new CCalendarDaySheet(this._calendarBody);
                pan.onResource = function () {
                    pan.position.alignInfo.gridColumn = n;
                    pan.position.alignInfo.gridRow = i;
                    pan.position.align = EPositionAlign.GRID;
                    pan.propertyName = "dayOfWeek_" + i + "_" + n;
                    pan.propertyDataKind = "reserveControl,parent._daySheets[" + n + "][" + i + "]";
                };
                pan.position.alignInfo.gridColumn = n;
                pan.position.alignInfo.gridRow = i;
                pan.position.align = EPositionAlign.GRID;
                pan.onClick = function () {
                    self.doSelectDate(pan);
                };
                pan.propertyName = "dayOfWeek_" + i + "_" + n;
                pan.propertyDataKind = "reserveControl,parent._daySheets[" + n + "][" + i + "]";
                this._daySheets[n][i] = pan;
            }
        }
        this._date = new Date();
        this.doChangeDate();
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "daySheetResource", this.daySheetResource, "");
        CDataClass.putData(data, "dayOfWeekSheetResource", this.dayOfWeekSheetResource, "");
        CDataClass.putData(data, "date", this.date.getTime());
        CDataClass.putData(data, "dayOfWeekText", this.dayOfWeekText, [], true);
        CDataClass.putData(data, "pickupResource", this.pickupResource, "");
        CDataClass.putData(data, "pickupListYearResource", this.pickupListYearResource, "");
        CDataClass.putData(data, "pickupListMonthResource", this.pickupListMonthResource, "");
        CDataClass.putData(data, "pickupListYearListItemResource", this.pickupListYearListItemResource, [], true);
        CDataClass.putData(data, "pickupListMonthListItemResource", this.pickupListMonthListItemResource, [], true);
        CDataClass.putData(data, "pickupLabelMonthResource", this.pickupLabelMonthResource, "");
        CDataClass.putData(data, "pickupLabelYearResource", this.pickupLabelYearResource, "");
        CDataClass.putData(data, "pickupYearFrom", this.pickupYearFrom, 1900);
        CDataClass.putData(data, "pickupYearTo", this.pickupYearTo, 2100);
        CDataClass.putData(data, "calendarHeaderResource", this.calendarHeaderResource, "");
        CDataClass.putData(data, "calendarDayOfWeekResource", this.calendarDayOfWeekResource, "");
        CDataClass.putData(data, "calendarBodyResource", this.calendarBodyResource, "");
        CDataClass.putData(data, "buttonPreviousResource", this.buttonPreviousResource, "");
        CDataClass.putData(data, "buttonNextResource", this.buttonNextResource, "");
        CDataClass.putData(data, "buttonNowResource", this.buttonNowResource, "");
        CDataClass.putData(data, "buttonPickResource", this.buttonPickResource, "");
        CDataClass.putData(data, "dayOfWeekSheetResource", this.dayOfWeekSheetResource, "");
        CDataClass.putData(data, "daySheetResource", this.daySheetResource, "");
    }
    doFromData(data) {
        super.doFromData(data);
        this.daySheetResource = CDataClass.getData(data, "daySheetResource", "");
        this.dayOfWeekSheetResource = CDataClass.getData(data, "dayOfWeekSheetResource", "");
        this.date = new Date(CDataClass.getData(data, "date"));
        this.dayOfWeekText = CDataClass.getData(data, "dayOfWeekText", [], true);
        this.pickupResource = CDataClass.getData(data, "pickupResource", "");
        this.pickupListYearResource = CDataClass.getData(data, "pickupListYearResource", "");
        this.pickupListMonthResource = CDataClass.getData(data, "pickupListMonthResource", "");
        this.pickupListYearListItemResource = CDataClass.getData(data, "pickupListYearListItemResource", [], true);
        this.pickupListMonthListItemResource = CDataClass.getData(data, "pickupListMonthListItemResource", [], true);
        this.pickupLabelMonthResource = CDataClass.getData(data, "pickupLabelMonthResource", "");
        this.pickupLabelYearResource = CDataClass.getData(data, "pickupLabelYearResource", "");
        this.pickupYearFrom = CDataClass.getData(data, "pickupYearFrom", 1900);
        this.pickupYearTo = CDataClass.getData(data, "pickupYearTo", 2100);
        this.calendarHeaderResource = CDataClass.getData(data, "calendarHeaderResource", "");
        this.calendarDayOfWeekResource = CDataClass.getData(data, "calendarDayOfWeekResource", "");
        this.calendarBodyResource = CDataClass.getData(data, "calendarBodyResource", "");
        this.buttonPreviousResource = CDataClass.getData(data, "buttonPreviousResource", "");
        this.buttonNextResource = CDataClass.getData(data, "buttonNextResource", "");
        this.buttonNowResource = CDataClass.getData(data, "buttonNowResource", "");
        this.buttonPickResource = CDataClass.getData(data, "buttonPickResource", "");
        this.dayOfWeekSheetResource = CDataClass.getData(data, "dayOfWeekSheetResource", "");
        this.daySheetResource = CDataClass.getData(data, "daySheetResource", "");
    }
    doSelectDate(sheet) {
        this.date = sheet.date;
        if (this.onSelectDate != undefined) {
            this.onSelectDate(this);
        }
    }
    doChangeDate() {
        this.doSetDate();
        this._calendarHeader.text = this.date.getFullYear() + "-" + CStringUtil.lpad((this.date.getMonth() + 1) + "", "0", 2) + "-" + CStringUtil.lpad(this.date.getDate() + "", "0", 2);
        if (this.onChangeDate != undefined) {
            this.onChangeDate(this);
        }
    }
    doSetDate() {
        let dt = new CDatetime(this._date.getTime());
        let f = dt.getFirstDayDate();
        let start = f.getDay();
        let last = dt.getLastDay();
        for (let n = 0; n < this._daySheets.length; n++) {
            for (let i = 0; i < this._daySheets[n].length; i++) {
                let idx = n + (i * 7);
                this._daySheets[n][i].date = new Date(dt.year, dt.month - 1, (idx - start + 1));
                this._daySheets[n][i].text = this._daySheets[n][i].date.getDate() + "";
                this._daySheets[n][i].selected = false;
                if (CDatetime.dateToYYYYMMDD(this._daySheets[n][i].date) == CDatetime.dateToYYYYMMDD(this.date)) {
                    this._daySheets[n][i].selected = true;
                    this._daySheets[n][i].focused = true;
                }
                if (idx < start) {
                    this._daySheets[n][i].opacity = 0.5;
                    this._daySheets[n][i].dateKind = ECalendarDateKind.PREVIOUS_MONTH;
                }
                else if (idx >= start && idx < start + last) {
                    this._daySheets[n][i].opacity = 1;
                    this._daySheets[n][i].dateKind = ECalendarDateKind.NOW_MONTH;
                }
                else {
                    this._daySheets[n][i].opacity = 0.5;
                    this._daySheets[n][i].dateKind = ECalendarDateKind.NEXT_MONTH;
                }
                this.doSetDaySheet(n, i, this._daySheets[n][i]);
            }
        }
        if (this.onSetDate != undefined) {
            this.onSetDate(this);
        }
    }
    doSetDaySheet(column, row, daySheet) {
        if (this.onSetDaySheet != undefined) {
            this.onSetDaySheet(this, column, row, daySheet);
        }
    }
    doSetDayOfWeek() {
        for (let n = 0; n < this._dayOfWeekSheets.length; n++) {
            if (this._dayOfWeekText.length > n) {
                this._dayOfWeekSheets[n].text = this._dayOfWeekText[n];
            }
        }
        if (this.onSetDayOfWeek != undefined) {
            this.onSetDayOfWeek(this);
        }
    }
}
class CClock extends CPanel {
    get hourAngle() {
        return this._hourAngle;
    }
    get minuteAngle() {
        return this._minuteAngle;
    }
    get secondAngle() {
        return this._secondAngle;
    }
    get date() {
        return this._date;
    }
    set date(value) {
        if (this._date.getTime() != value.getTime()) {
            this._date = value;
            this.doChangeDate();
        }
    }
    get hourHandle() {
        return this._hourHandle;
    }
    get minuteHandle() {
        return this._minuteHandle;
    }
    get secondHandle() {
        return this._secondHandle;
    }
    get useEdit() {
        return this._useEdit;
    }
    set useEdit(value) {
        if (this._useEdit != value) {
            this._useEdit = value;
            this.doChangeEdit(value);
        }
    }
    get amPmText() {
        return this._amPmText;
    }
    set amPmText(value) {
        this._amPmText = value;
        this.doSetTime();
    }
    get addHour() {
        return this._addHour;
    }
    set addHour(value) {
        this._addHour = value;
        this.doSetTime();
    }
    get addMinute() {
        return this._addMinute;
    }
    set addMinute(value) {
        this._addMinute = value;
        this.doSetTime();
    }
    get addSecond() {
        return this._addSecond;
    }
    set addSecond(value) {
        this._addSecond = value;
        this.doSetTime();
    }
    get hourCanvasItemName() {
        return this._hourCanvasItemName;
    }
    set hourCanvasItemName(value) {
        this._hourCanvasItemName = value;
        this.doSetTime();
    }
    get minuteCanvasItemName() {
        return this._minuteCanvasItemName;
    }
    set minuteCanvasItemName(value) {
        this._minuteCanvasItemName = value;
        this.doSetTime();
    }
    get secondCanvasItemName() {
        return this._secondCanvasItemName;
    }
    set secondCanvasItemName(value) {
        this._secondCanvasItemName = value;
        this.doSetTime();
    }
    get labelCanvasItemName() {
        return this._labelCanvasItemName;
    }
    set labelCanvasItemName(value) {
        this._labelCanvasItemName = value;
        this.doSetTime();
    }
    get amPmCanvasItemName() {
        return this._amPmCanvasItemName;
    }
    set amPmCanvasItemName(value) {
        this._amPmCanvasItemName = value;
        this.doSetTime();
    }
    get handleResource() {
        return this._handleResource;
    }
    set handleResource(value) {
        this._handleResource = value;
        this._hourHandle.resource = value;
        this._minuteHandle.resource = value;
        this._secondHandle.resource = value;
    }
    constructor(parent, name) {
        super(parent, name);
        this.__editIsAm = false;
        this.__tick = 0;
        this.__hourDown = new CPoint(0, 0);
        this.__minDown = new CPoint(0, 0);
        this.__secDown = new CPoint(0, 0);
        this._hourAngle = 0;
        this._minuteAngle = 0;
        this._secondAngle = 0;
        this._date = new Date();
        this._hourHandle = new CPanel(this);
        this._minuteHandle = new CPanel(this);
        this._secondHandle = new CPanel(this);
        this._useEdit = false;
        this._amPmText = ["AM", "PM"];
        this._addHour = 0;
        this._addMinute = 0;
        this._addSecond = 0;
        this._hourCanvasItemName = "hour";
        this._minuteCanvasItemName = "minute";
        this._secondCanvasItemName = "second";
        this._labelCanvasItemName = "label";
        this._amPmCanvasItemName = "ampm";
        this._handleResource = "";
        this.interval = 100;
        let self = this;
        this._hourHandle.visible = false;
        this._hourHandle.usePointerCapture = true;
        this._hourHandle.onResource = function () {
            self._hourHandle.visible = false;
            self._hourHandle.usePointerCapture = true;
            self._hourHandle.text = "H";
            self._hourHandle.useMove = true;
            self._hourHandle.resizeAreaLength = 0;
            self._hourHandle.moveAreaLength = 100;
        };
        this._hourHandle.onThisPointerDown = function (s, e, pts) {
            self.__secDown = new CPoint(self._hourHandle.position.left + (self._hourHandle.position.width / 2), self._hourHandle.position.top + (self._hourHandle.position.height / 2));
        };
        this._hourHandle.onPointerUp = function () {
            self.setHandle();
        };
        this._hourHandle.onThisPointerMove = function (s, e, pts) {
            if (self._hourHandle.isPress) {
                let ang = CPoint.getAngleFromTwoPoint(new CPoint(self.position.width / 2, self.position.height / 2), new CPoint(self._hourHandle.position.left + (self._hourHandle.position.width / 2), self._hourHandle.position.top + (self._hourHandle.position.height / 2)));
                if (self.__editIsAm) {
                    let h = CCalc.crRange2Value(0, 360, ang, 3, 15);
                    if (h > 12)
                        h -= 12;
                    self.date = new Date(self.date.getFullYear(), self.date.getMonth() - 1, self.date.getDate(), h, self.date.getMinutes(), self.date.getSeconds());
                }
                else {
                    let h = CCalc.crRange2Value(0, 360, ang, 15, 27);
                    if (h > 24)
                        h -= 12;
                    self.date = new Date(self.date.getFullYear(), self.date.getMonth() - 1, self.date.getDate(), h, self.date.getMinutes(), self.date.getSeconds());
                }
            }
        };
        this._minuteHandle.visible = false;
        this._minuteHandle.usePointerCapture = true;
        this._minuteHandle.onResource = function () {
            self._minuteHandle.visible = false;
            self._minuteHandle.usePointerCapture = true;
            self._minuteHandle.text = "M";
            self._minuteHandle.useMove = true;
            self._minuteHandle.resizeAreaLength = 0;
            self._minuteHandle.moveAreaLength = 100;
        };
        this._minuteHandle.onThisPointerDown = function (s, e, pts) {
            self.__secDown = new CPoint(self._minuteHandle.position.left + (self._minuteHandle.position.width / 2), self._minuteHandle.position.top + (self._minuteHandle.position.height / 2));
        };
        this._minuteHandle.onThisPointerMove = function (s, e, pts) {
            if (self._minuteHandle.isPress) {
                let ang = CPoint.getAngleFromTwoPoint(new CPoint(self.position.width / 2, self.position.height / 2), new CPoint(self._minuteHandle.position.left + (self._minuteHandle.position.width / 2), self._minuteHandle.position.top + (self._minuteHandle.position.height / 2)));
                let m = CCalc.crRange2Value(0, 360, ang, 15, 75);
                if (m > 60)
                    m -= 60;
                self.date = new Date(self.date.getFullYear(), self.date.getMonth() - 1, self.date.getDate(), self.date.getHours(), m, self.date.getSeconds());
            }
        };
        this._minuteHandle.onPointerUp = function () {
            self.setHandle();
        };
        this._secondHandle.visible = false;
        this._secondHandle.usePointerCapture = true;
        this._secondHandle.text = "S";
        this._secondHandle.onResource = function () {
            self._secondHandle.visible = false;
            self._secondHandle.usePointerCapture = true;
            self._secondHandle.text = "S";
            self._secondHandle.useMove = true;
            self._secondHandle.resizeAreaLength = 0;
            self._secondHandle.moveAreaLength = 100;
        };
        this._secondHandle.onThisPointerDown = function (s, e, pts) {
            self.__secDown = new CPoint(self._secondHandle.position.left + (self._secondHandle.position.width / 2), self._secondHandle.position.top + (self._secondHandle.position.height / 2));
        };
        this._secondHandle.onThisPointerMove = function (s, e, pts) {
            if (self._secondHandle.isPress) {
                let ang = CPoint.getAngleFromTwoPoint(new CPoint(self.position.width / 2, self.position.height / 2), new CPoint(self._secondHandle.position.left + (self._secondHandle.position.width / 2), self._secondHandle.position.top + (self._secondHandle.position.height / 2)));
                let sec = CCalc.crRange2Value(0, 360, ang, 15, 75);
                if (sec > 60)
                    sec -= 60;
                self.date = new Date(self.date.getFullYear(), self.date.getMonth() - 1, self.date.getDate(), self.date.getHours(), self.date.getMinutes(), sec);
            }
        };
        this._secondHandle.onPointerUp = function () {
            self.setHandle();
        };
    }
    setHandle() {
        let hs = this.position.width / 10;
        let sr = (hs * 4) - (hs / 2);
        let mr = (hs * 3) - (hs / 2);
        let hr = (hs * 2) - (hs / 2);
        if (!this._hourHandle.isPress) {
            let pt = CPoint.getAngleToPoint(new CPoint(this.position.width / 2, this.position.height / 2), hr, hr, this._hourAngle - 90);
            this._hourHandle.position.left = pt.x - (hs / 2);
            this._hourHandle.position.top = pt.y - (hs / 2);
            this._hourHandle.position.width = hs;
            this._hourHandle.position.height = hs;
        }
        if (!this._minuteHandle.isPress) {
            let pt = CPoint.getAngleToPoint(new CPoint(this.position.width / 2, this.position.height / 2), mr, mr, this._minuteAngle - 90);
            this._minuteHandle.position.left = pt.x - (hs / 2);
            this._minuteHandle.position.top = pt.y - (hs / 2);
            this._minuteHandle.position.width = hs;
            this._minuteHandle.position.height = hs;
        }
        if (!this._secondHandle.isPress) {
            let pt = CPoint.getAngleToPoint(new CPoint(this.position.width / 2, this.position.height / 2), sr, sr, this._secondAngle - 90);
            this._secondHandle.position.left = pt.x - (hs / 2);
            this._secondHandle.position.top = pt.y - (hs / 2);
            this._secondHandle.position.width = hs;
            this._secondHandle.position.height = hs;
        }
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "date", this._date.getTime());
        CDataClass.putData(data, "amPmText", this.amPmText, ["AM", "PM"], true);
        CDataClass.putData(data, "addHour", this.addHour, 0);
        CDataClass.putData(data, "addMinute", this.addMinute, 0);
        CDataClass.putData(data, "addSecond", this.addSecond, 0);
        CDataClass.putData(data, "hourCanvasItemName", this.hourCanvasItemName, "hour");
        CDataClass.putData(data, "minuteCanvasItemName", this.minuteCanvasItemName, "minute");
        CDataClass.putData(data, "secondCanvasItemName", this.secondCanvasItemName, "second");
        CDataClass.putData(data, "labelCanvasItemName", this.labelCanvasItemName, "label");
        CDataClass.putData(data, "amPmCanvasItemName", this.amPmCanvasItemName, "ampm");
        CDataClass.putData(data, "handleResource", this.handleResource, "");
    }
    doFromData(data) {
        super.doFromData(data);
        this.date = new Date(CDataClass.getData(data, "date"));
        this.amPmText = CDataClass.getData(data, "amPmText", ["AM", "PM"], true);
        this.addHour = CDataClass.getData(data, "addHour", 0);
        this.addMinute = CDataClass.getData(data, "addMinute", 0);
        this.addSecond = CDataClass.getData(data, "addSecond", 0);
        this.hourCanvasItemName = CDataClass.getData(data, "hourCanvasItemName", "hour");
        this.minuteCanvasItemName = CDataClass.getData(data, "minuteCanvasItemName", "minute");
        this.secondCanvasItemName = CDataClass.getData(data, "secondCanvasItemName", "second");
        this.labelCanvasItemName = CDataClass.getData(data, "labelCanvasItemName", "label");
        this.amPmCanvasItemName = CDataClass.getData(data, "amPmCanvasItemName", "ampm");
        this.handleResource = CDataClass.getData(data, "handleResource", "");
    }
    doClick(e) {
        super.doClick(e);
        if (this.useEdit) {
            this.__editIsAm = !this.__editIsAm;
            this.doSetTime();
            this.draw();
        }
    }
    doChangeEdit(value) {
        this._hourHandle.visible = value;
        this._minuteHandle.visible = value;
        this._secondHandle.visible = value;
        this.__editIsAm = !(this.date.getHours() > 12);
        this.setHandle();
    }
    doChangeDate() {
        this.doSetTime();
    }
    doSetTime() {
        let dt = this.date;
        dt = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), dt.getHours() + this._addHour, dt.getMinutes() + this._addMinute, dt.getSeconds() + this._addSecond, dt.getMilliseconds());
        let hMax = 24 * 60 * 60 * 1000;
        let hNow = (dt.getHours() * 60 * 60 * 1000) + (dt.getMinutes() * 60 * 1000) + (dt.getSeconds() * 1000) + dt.getMilliseconds();
        this._hourAngle = CCalc.cr(hMax, hNow, 720, 0, 4);
        let mMax = 60 * 60 * 1000;
        let mNow = (dt.getMinutes() * 60 * 1000) + (dt.getSeconds() * 1000) + dt.getMilliseconds();
        this._minuteAngle = CCalc.cr(mMax, mNow, 360, 0, 4);
        let sMax = 60 * 1000;
        let sNow = (dt.getSeconds() * 1000) + dt.getMilliseconds();
        this._secondAngle = CCalc.cr(sMax, sNow, 360, 0, 4);
        let hour = this.layers.getCanvasItems(this._hourCanvasItemName);
        for (let n = 0; n < hour.length; n++) {
            hour[n].rotationAngle = this._hourAngle - 90;
        }
        let min = this.layers.getCanvasItems(this._minuteCanvasItemName);
        for (let n = 0; n < min.length; n++) {
            min[n].rotationAngle = this._minuteAngle - 90;
        }
        let sec = this.layers.getCanvasItems(this._secondCanvasItemName);
        for (let n = 0; n < sec.length; n++) {
            sec[n].rotationAngle = this._secondAngle - 90;
        }
        let lbl = this.layers.getCanvasItems(this._labelCanvasItemName);
        for (let n = 0; n < lbl.length; n++) {
            lbl[n].text = CStringUtil.lpad(dt.getHours() + "", "0", 2) + " : " +
                CStringUtil.lpad(dt.getMinutes() + "", "0", 2) + " : " +
                CStringUtil.lpad(dt.getSeconds() + "", "0", 2);
        }
        if (!this.useEdit) {
            let ampm = this.layers.getCanvasItems(this._amPmCanvasItemName);
            for (let n = 0; n < ampm.length; n++) {
                if (dt.getHours() > 12) {
                    if (this.amPmText.length >= 2)
                        ampm[n].text = this.amPmText[1];
                }
                else {
                    if (this.amPmText.length >= 2)
                        ampm[n].text = this.amPmText[0];
                }
            }
        }
        else {
            let ampm = this.layers.getCanvasItems(this._amPmCanvasItemName);
            for (let n = 0; n < ampm.length; n++) {
                if (!this.__editIsAm) {
                    if (this.amPmText.length >= 2)
                        ampm[n].text = this.amPmText[1];
                }
                else {
                    if (this.amPmText.length >= 2)
                        ampm[n].text = this.amPmText[0];
                }
            }
        }
        if (this.useEdit) {
            this.setHandle();
        }
    }
    on() {
        if (this.__tick == 0) {
            this.useEdit = false;
            let self = this;
            this.__tick = setInterval(function () {
                self.date = new Date();
            }, this.interval);
        }
    }
    off() {
        if (this.__tick != 0) {
            clearInterval(this.__tick);
            this.__tick = 0;
        }
    }
}
class CFrameModel extends CPanel {
}
class CWindowModel extends CFrameModel {
    get title() {
        return this.caption.text;
    }
    set title(value) {
        this.caption.text = value;
    }
    get state() {
        return this.__state;
    }
    constructor(parent, name) {
        super(parent, name);
        this.__orgPadding = new CRect();
        this.__orgPosition = new CPosition();
        this.__state = "none";
        this.caption = new CPanel(this);
        this.icon = new CPanel(this.caption);
        this.btnClose = new CButton(this.caption);
        this.btnMaximize = new CButton(this.caption);
        this.btnCustomAlign = new CButton(this.caption);
        this.btnMinimize = new CButton(this.caption);
        this.btnSendToBack = new CButton(this.caption);
        this.body = new CPanel(this);
        this.alignCover = new CCover(this.body);
        this.customAlign = new CPanel(this.alignCover);
        this.btnAlignLeftTop = new CButton(this.customAlign);
        this.btnAlignMiddleTop = new CButton(this.customAlign);
        this.btnAlignRightTop = new CButton(this.customAlign);
        this.btnAlignLeftMiddle = new CButton(this.customAlign);
        this.btnAlignRightMiddle = new CButton(this.customAlign);
        this.btnAlignLeftBottom = new CButton(this.customAlign);
        this.btnAlignMiddleBottom = new CButton(this.customAlign);
        this.btnAlignRightBottom = new CButton(this.customAlign);
        this.btnAlignCenter = new CButton(this.customAlign);
        this.cover = new CCover(this.body);
        this.closeAction = "remove";
        let self = this;
        this.propertyName = "CWindowModel";
        this.caption.propertyName = "caption";
        this.caption.propertyDataKind = "reserveControl,caption";
        this.btnClose.propertyName = "btnClose";
        this.btnClose.propertyDataKind = "reserveControl,parent.btnClose";
        this.btnMaximize.propertyName = "btnMaximize";
        this.btnMaximize.propertyDataKind = "reserveControl,parent.btnMaximize";
        this.btnCustomAlign.propertyName = "btnCustomAlign";
        this.btnCustomAlign.propertyDataKind = "reserveControl,parent.btnCustomAlign";
        this.btnMinimize.propertyName = "btnMinimize";
        this.btnMinimize.propertyDataKind = "reserveControl,parent.btnMinimize";
        this.body.propertyName = "body";
        this.body.propertyDataKind = "reserveControl,body";
        this.alignCover.propertyName = "alignCover";
        this.alignCover.propertyDataKind = "reserveControl,parent.alignCover";
        this.customAlign.propertyName = "customAlign";
        this.customAlign.propertyDataKind = "reserveControl,parent.parent.customAlign";
        this.btnAlignLeftTop.propertyName = "btnAlignLeftTop";
        this.btnAlignLeftTop.propertyDataKind = "reserveControl,parent.parent.parent.btnAlignLeftTop";
        this.btnAlignMiddleTop.propertyName = "btnAlignMiddleTop";
        this.btnAlignMiddleTop.propertyDataKind = "reserveControl,parent.parent.parent.btnAlignMiddleTop";
        this.btnAlignRightTop.propertyName = "btnAlignRightTop";
        this.btnAlignRightTop.propertyDataKind = "reserveControl,parent.parent.parent.btnAlignRightTop";
        this.btnAlignLeftMiddle.propertyName = "btnAlignLeftMiddle";
        this.btnAlignLeftMiddle.propertyDataKind = "reserveControl,parent.parent.parent.btnAlignLeftMiddle";
        this.btnAlignRightMiddle.propertyName = "btnAlignRightMiddle";
        this.btnAlignRightMiddle.propertyDataKind = "reserveControl,parent.parent.parent.btnAlignRightMiddle";
        this.btnAlignLeftBottom.propertyName = "btnAlignLeftBottom";
        this.btnAlignLeftBottom.propertyDataKind = "reserveControl,parent.parent.parent.btnAlignLeftBottom";
        this.btnAlignMiddleBottom.propertyName = "btnAlignMiddleBottom";
        this.btnAlignMiddleBottom.propertyDataKind = "reserveControl,parent.parent.parent.btnAlignMiddleBottom";
        this.btnAlignRightBottom.propertyName = "btnAlignRightBottom";
        this.btnAlignRightBottom.propertyDataKind = "reserveControl,parent.parent.parent.btnAlignRightBottom";
        this.btnAlignCenter.propertyName = "btnAlignCenter";
        this.btnAlignCenter.propertyDataKind = "reserveControl,parent.parent.parent.btnAlignCenter";
        this.body.onChangeSize = function () {
            self.cover.position.width = self.body.position.width;
            self.cover.position.height = self.body.position.height;
            self.alignCover.position.width = self.body.position.width;
            self.alignCover.position.height = self.body.position.height;
        };
        this.btnCustomAlign.onClick = function () {
            if (self.alignCover.visible) {
                self.alignCover.hideCover();
            }
            else {
                self.alignCover.showCover();
            }
        };
        this.btnClose.onClick = function () {
            self.close();
        };
        this.btnMinimize.onClick = function () {
            self.minimize();
        };
        this.btnMaximize.onClick = function () {
            self.maximize();
        };
        this.btnSendToBack.onClick = function () {
            self.doSendToBack();
        };
        function setOrg() {
            self.__orgPosition.left = self.position.left;
            self.__orgPosition.top = self.position.top;
            self.__orgPosition.width = self.position.width;
            self.__orgPosition.height = self.position.height;
        }
        this.btnAlignLeftTop.onClick = function () {
            if (self.parent != undefined) {
                setOrg();
                self.position.left = 0;
                self.position.top = 0;
                self.position.width = self.parent.position.width / 2;
                self.position.height = self.parent.position.height / 2;
                self.alignCover.hideCover();
            }
        };
        this.btnAlignMiddleTop.onClick = function () {
            if (self.parent != undefined) {
                setOrg();
                self.position.left = 0;
                self.position.top = 0;
                self.position.width = self.parent.position.width;
                self.position.height = self.parent.position.height / 2;
                self.alignCover.hideCover();
            }
        };
        this.btnAlignRightTop.onClick = function () {
            if (self.parent != undefined) {
                setOrg();
                self.position.left = self.parent.position.width / 2;
                self.position.top = 0;
                self.position.width = self.parent.position.width / 2;
                self.position.height = self.parent.position.height / 2;
                self.alignCover.hideCover();
            }
        };
        this.btnAlignLeftMiddle.onClick = function () {
            if (self.parent != undefined) {
                setOrg();
                self.position.left = 0;
                self.position.top = 0;
                self.position.width = self.parent.position.width / 2;
                self.position.height = self.parent.position.height;
                self.alignCover.hideCover();
            }
        };
        this.btnAlignCenter.onClick = function () {
            self.position.left = self.__orgPosition.left;
            self.position.top = self.__orgPosition.top;
            self.position.width = self.__orgPosition.width;
            self.position.height = self.__orgPosition.height;
            self.alignCover.hideCover();
        };
        this.btnAlignRightMiddle.onClick = function () {
            if (self.parent != undefined) {
                setOrg();
                self.position.left = self.parent.position.width / 2;
                self.position.top = 0;
                self.position.width = self.parent.position.width / 2;
                self.position.height = self.parent.position.height;
                self.alignCover.hideCover();
            }
        };
        this.btnAlignLeftBottom.onClick = function () {
            if (self.parent != undefined) {
                setOrg();
                self.position.left = 0;
                self.position.top = self.parent.position.height / 2;
                self.position.width = self.parent.position.width / 2;
                self.position.height = self.parent.position.height / 2;
                self.alignCover.hideCover();
            }
        };
        this.btnAlignMiddleBottom.onClick = function () {
            if (self.parent != undefined) {
                setOrg();
                self.position.left = 0;
                self.position.top = self.parent.position.height / 2;
                self.position.width = self.parent.position.width;
                self.position.height = self.parent.position.height / 2;
                self.alignCover.hideCover();
            }
        };
        this.btnAlignRightBottom.onClick = function () {
            if (self.parent != undefined) {
                setOrg();
                self.position.left = self.parent.position.width / 2;
                self.position.top = self.parent.position.height / 2;
                self.position.width = self.parent.position.width / 2;
                self.position.height = self.parent.position.height / 2;
                self.alignCover.hideCover();
            }
        };
    }
    setActivate() {
        if (CWindowModel.activateWindow != undefined) {
            if (CWindowModel.activateWindow != this) {
                CWindowModel.activateWindow.doDeactivate();
                CWindowModel.activateWindow = this;
                this.doActivate();
            }
        }
        else {
            CWindowModel.activateWindow = this;
            this.doActivate();
        }
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "caption", this.caption.toData(), {}, true);
        CDataClass.putData(data, "icon", this.icon.toData(), {}, true);
        CDataClass.putData(data, "btnClose", this.btnClose.toData(), {}, true);
        CDataClass.putData(data, "btnMaximize", this.btnMaximize.toData(), {}, true);
        CDataClass.putData(data, "btnCustomAlign", this.btnCustomAlign.toData(), {}, true);
        CDataClass.putData(data, "btnMinimize", this.btnMinimize.toData(), {}, true);
        CDataClass.putData(data, "btnSendToBack", this.btnSendToBack.toData(), {}, true);
        CDataClass.putData(data, "body", this.body.toData(), {}, true);
        CDataClass.putData(data, "alignCover", this.alignCover.toData(), {}, true);
        CDataClass.putData(data, "customAlign", this.customAlign.toData(), {}, true);
        CDataClass.putData(data, "btnAlignLeftTop", this.btnAlignLeftTop.toData(), {}, true);
        CDataClass.putData(data, "btnAlignMiddleTop", this.btnAlignMiddleTop.toData(), {}, true);
        CDataClass.putData(data, "btnAlignRightTop", this.btnAlignRightTop.toData(), {}, true);
        CDataClass.putData(data, "btnAlignLeftMiddle", this.btnAlignLeftMiddle.toData(), {}, true);
        CDataClass.putData(data, "btnAlignRightMiddle", this.btnAlignRightMiddle.toData(), {}, true);
        CDataClass.putData(data, "btnAlignLeftBottom", this.btnAlignLeftBottom.toData(), {}, true);
        CDataClass.putData(data, "btnAlignMiddleBottom", this.btnAlignMiddleBottom.toData(), {}, true);
        CDataClass.putData(data, "btnAlignRightBottom", this.btnAlignRightBottom.toData(), {}, true);
        CDataClass.putData(data, "btnAlignCenter", this.btnAlignCenter.toData(), {}, true);
        CDataClass.putData(data, "closeAction", this.closeAction, "remove");
        CDataClass.putData(data, "cover", this.cover.toData(), {}, true);
        if (this.showAnimationTrigger != undefined)
            CDataClass.putData(data, "showAnimationTrigger", this.showAnimationTrigger.toData(), {}, true);
        if (this.hideAnimationTrigger != undefined)
            CDataClass.putData(data, "hideAnimationTrigger", this.hideAnimationTrigger.toData(), {}, true);
        if (this.activateAnimationTrigger != undefined)
            CDataClass.putData(data, "activateAnimationTrigger", this.activateAnimationTrigger.toData(), {}, true);
        if (this.maximizeAnimationTrigger != undefined)
            CDataClass.putData(data, "maximizeAnimationTrigger", this.maximizeAnimationTrigger.toData(), {}, true);
        if (this.minimizeAnimationTrigger != undefined)
            CDataClass.putData(data, "minimizeAnimationTrigger", this.minimizeAnimationTrigger.toData(), {}, true);
        if (this.customAlignAnimationTrigger != undefined)
            CDataClass.putData(data, "customAlignAnimationTrigger", this.customAlignAnimationTrigger.toData(), {}, true);
    }
    doFromData(data) {
        super.doFromData(data);
        this.caption.fromData(CDataClass.getData(data, "caption", {}, true));
        this.icon.fromData(CDataClass.getData(data, "icon", {}, true));
        this.btnClose.fromData(CDataClass.getData(data, "btnClose", {}, true));
        this.btnMaximize.fromData(CDataClass.getData(data, "btnMaximize", {}, true));
        this.btnCustomAlign.fromData(CDataClass.getData(data, "btnCustomAlign", {}, true));
        this.btnMinimize.fromData(CDataClass.getData(data, "btnMinimize", {}, true));
        this.btnSendToBack.fromData(CDataClass.getData(data, "btnSendToBack", {}, true));
        this.body.fromData(CDataClass.getData(data, "body", {}, true));
        this.alignCover.fromData(CDataClass.getData(data, "alignCover", {}, true));
        this.customAlign.fromData(CDataClass.getData(data, "customAlign", {}, true));
        this.btnAlignLeftTop.fromData(CDataClass.getData(data, "btnAlignLeftTop", {}, true));
        this.btnAlignMiddleTop.fromData(CDataClass.getData(data, "btnAlignMiddleTop", {}, true));
        this.btnAlignRightTop.fromData(CDataClass.getData(data, "btnAlignRightTop", {}, true));
        this.btnAlignLeftMiddle.fromData(CDataClass.getData(data, "btnAlignLeftMiddle", {}, true));
        this.btnAlignRightMiddle.fromData(CDataClass.getData(data, "btnAlignRightMiddle", {}, true));
        this.btnAlignLeftBottom.fromData(CDataClass.getData(data, "btnAlignLeftBottom", {}, true));
        this.btnAlignMiddleBottom.fromData(CDataClass.getData(data, "btnAlignMiddleBottom", {}, true));
        this.btnAlignRightBottom.fromData(CDataClass.getData(data, "btnAlignRightBottom", {}, true));
        this.btnAlignCenter.fromData(CDataClass.getData(data, "btnAlignCenter", {}, true));
        this.closeAction = CDataClass.getData(data, "closeAction", "");
        this.cover.fromData(CDataClass.getData(data, "cover", {}, true));
        CAnimator.fromAnimatorData(data, this, "showAnimationTrigger");
        CAnimator.fromAnimatorData(data, this, "hideAnimationTrigger");
        CAnimator.fromAnimatorData(data, this, "activateAnimationTrigger");
        CAnimator.fromAnimatorData(data, this, "maximizeAnimationTrigger");
        CAnimator.fromAnimatorData(data, this, "minimizeAnimationTrigger");
        CAnimator.fromAnimatorData(data, this, "customAlignAnimationTrigger");
    }
    doPointerDown(e) {
        this.setActivate();
        super.doPointerDown(e);
    }
    doClose() {
        if (this.closeAction == "remove") {
            if (this.hideAnimationTrigger != undefined) {
                let self = this;
                this.hideAnimationTrigger.onAfterAnimation = function () {
                    self.remove();
                };
                this.hideAnimationTrigger.start();
            }
            else {
                this.remove();
            }
        }
        else {
            this.hide();
        }
    }
    doActivate() {
        this.bringToFront();
        let self = this;
        if (this.transform.translateZ != 0) {
            let z = this.transform.translateZ;
            let y = this.transform.rotateY;
            let b = this.filter.blurValue;
            CAnimation.graphAnimate(200, ["acc_head_10000.graph"], function (t, v, ct, gn, gv) {
                self.transform.translateZ = z - (z * gv);
                self.transform.rotateY = y - (y * gv);
                self.filter.blurValue = b - (b * gv);
            });
        }
        if (this.activateAnimationTrigger != undefined)
            this.triggerTrue(this.activateAnimationTrigger);
        if (this.onActivate != undefined) {
            this.onActivate(this);
        }
    }
    doDeactivate() {
        if (this.activateAnimationTrigger != undefined)
            this.triggerFalse(this.activateAnimationTrigger);
        if (this.onDectivate != undefined) {
            this.onDectivate(this);
        }
    }
    doMinimize() {
        if (this.__state == "none") {
            this.__orgPosition.fromData(this.position.toData());
            this.doHidePadding();
            this.body.visible = false;
            this.position.height = this.caption.position.height;
            this.btnMaximize.visible = false;
            this.__state = "minimize";
        }
        else {
            this.doShowPadding();
            this.body.visible = true;
            this.btnMaximize.visible = true;
            this.position.height = this.__orgPosition.height;
            this.__state = "none";
        }
    }
    doMaximize() {
        if (this.__state == "none") {
            this.__orgPosition.fromData(this.position.toData());
            this.doHidePadding();
            this.position.align = EPositionAlign.CLIENT;
            this.btnMinimize.visible = false;
            this.__state = "maximize";
        }
        else {
            this.position.align = EPositionAlign.NONE;
            this.position.fromData(this.__orgPosition.toData());
            this.btnMinimize.visible = true;
            this.__state = "none";
        }
    }
    doSendToBack() {
        let self = this;
        if (this.transform.translateZ == 0) {
            if (!this.filter.filterSet.blur)
                this.filter.filterSet.blur = true;
            CAnimation.graphAnimate(200, ["acc_head_10000.graph"], function (t, v, ct, gn, gv) {
                self.transform.translateZ = -10000 * gv;
                self.transform.rotateY = 45 * gv;
                self.filter.blurValue = 10 * gv;
            }, undefined, undefined, undefined, undefined, undefined, undefined, function () {
                self.sendToBack();
            });
        }
    }
    doShowPadding() {
        this.position.padding.left = this.__orgPadding.left;
        this.position.padding.top = this.__orgPadding.top;
        this.position.padding.right = this.__orgPadding.right;
        this.position.padding.bottom = this.__orgPadding.bottom;
    }
    doHidePadding() {
        this.__orgPadding.left = this.position.padding.left;
        this.__orgPadding.top = this.position.padding.top;
        this.__orgPadding.right = this.position.padding.right;
        this.__orgPadding.bottom = this.position.padding.bottom;
        this.position.padding.all = 0;
    }
    doShowWindow() {
        if (this.onBeforeShow != undefined) {
            this.onBeforeShow(this);
        }
        this.setActivate();
        this.visible = true;
        if (this.showAnimationTrigger != undefined) {
            let self = this;
            this.showAnimationTrigger.onAfterAnimation = function () {
                if (self.onShow != undefined) {
                    self.onShow(self);
                }
            };
            this.showAnimationTrigger.start();
        }
        else {
            if (this.onShow != undefined) {
                this.onShow(this);
            }
        }
    }
    doHideWindow() {
        if (this.onBeforeHide != undefined) {
            this.onBeforeHide(this);
        }
        if (this.hideAnimationTrigger != undefined) {
            let self = this;
            this.hideAnimationTrigger.onAfterAnimation = function () {
                self.visible = false;
                if (self.onHide != undefined) {
                    self.onHide(self);
                }
            };
            this.hideAnimationTrigger.start();
        }
        else {
            this.visible = false;
            if (this.onHide != undefined) {
                this.onHide(this);
            }
        }
    }
    close() {
        this.doClose();
    }
    minimize() {
        this.doMinimize();
    }
    maximize() {
        this.doMaximize();
    }
    show(left, top, width, height, title, closeAction) {
        if (left != undefined)
            this.position.left = left;
        if (top != undefined)
            this.position.top = top;
        if (width != undefined)
            this.position.width = width;
        if (height != undefined)
            this.position.height = height;
        if (title != undefined)
            this.title = title;
        if (closeAction != undefined)
            this.closeAction = closeAction;
        this.doShowWindow();
    }
    showCenter(width, height, title, closeAction) {
        if (this.parent != undefined) {
            this.position.width = width;
            this.position.height = height;
            this.position.left = Math.round((this.parent.position.width - this.position.width) / 2);
            this.position.top = Math.round((this.parent.position.height - this.position.height) / 2);
        }
        if (title != undefined)
            this.title = title;
        if (closeAction != undefined)
            this.closeAction = closeAction;
        this.doShowWindow();
    }
    hide() {
        this.doHideWindow();
    }
    addProperties() {
        let arr = super.addProperties();
        arr.push({ instance: this.title, propertyName: "title", readOnly: false, enum: [] });
        arr.push({ instance: this.showAnimationTrigger, propertyName: "showAnimationTrigger", readOnly: false, enum: [] });
        arr.push({ instance: this.hideAnimationTrigger, propertyName: "hideAnimationTrigger", readOnly: false, enum: [] });
        arr.push({ instance: this.activateAnimationTrigger, propertyName: "activateAnimationTrigger", readOnly: false, enum: [] });
        arr.push({ instance: this.maximizeAnimationTrigger, propertyName: "maximizeAnimationTrigger", readOnly: false, enum: [] });
        arr.push({ instance: this.minimizeAnimationTrigger, propertyName: "minimizeAnimationTrigger", readOnly: false, enum: [] });
        arr.push({ instance: this.customAlignAnimationTrigger, propertyName: "customAlignAnimationTrigger", readOnly: false, enum: [] });
        return arr;
    }
}
class CWindowBlue extends CWindowModel {
    constructor(parent, name) {
        super(parent, name);
        this.resource = "windowBlue.frame";
    }
}
class CWindowTool extends CWindowModel {
    constructor(parent, name) {
        super(parent, name);
        this.resource = "window_sky_dialog.frame";
    }
}
class CWindowChildTool extends CWindowModel {
    constructor(parent, name) {
        super(parent, name);
        this.resource = "chiled_window_20_dialog.frame";
    }
}
class CAlarm extends CPanel {
    constructor(parent, name) {
        super(parent, name);
        this.alarmAnimationTrigger = new CSceneAnimation();
        this.opacity = 0;
    }
    showAlarm(isAutoRemove = true) {
        if (isAutoRemove) {
            let self = this;
            this.alarmAnimationTrigger.onFinish = function () {
                self.remove();
            };
        }
        this.alarmAnimationTrigger.start();
    }
}
class CWorkSpace extends CPanel {
    constructor() {
        super(...arguments);
        this._workSpaceTranslateX = 0;
        this._workSpaceTranslateY = 0;
        this._workSpaceTranslateZ = 0;
    }
    get workSpaceTranslateX() {
        return this._workSpaceTranslateX;
    }
    set workSpaceTranslateX(value) {
        if (this._workSpaceTranslateX != value) {
            this._workSpaceTranslateX = value;
            this.doChangeWorkSpaceTranslateValue();
        }
    }
    get workSpaceTranslateY() {
        return this._workSpaceTranslateY;
    }
    set workSpaceTranslateY(value) {
        if (this._workSpaceTranslateY != value) {
            this._workSpaceTranslateY = value;
            this.doChangeWorkSpaceTranslateValue();
        }
    }
    get workSpaceTranslateZ() {
        return this._workSpaceTranslateZ;
    }
    set workSpaceTranslateZ(value) {
        if (this._workSpaceTranslateZ != value) {
            this._workSpaceTranslateZ = value;
            this.doChangeWorkSpaceTranslateValue();
        }
    }
    doRemove() {
        if (this.__board != undefined) {
            for (let n = 0; n < this.__board.workSpaceList.length; n++) {
                if (this.__board.workSpaceList.get(n) == this) {
                    this.__board.workSpaceList.delete(n);
                    break;
                }
            }
            this.__board = undefined;
        }
        super.doRemove();
    }
    doChangeWorkSpaceTranslateValue() {
        this.transform.translateX = this._workSpaceTranslateX;
        this.transform.translateY = this._workSpaceTranslateY;
        this.transform.translateZ = this._workSpaceTranslateZ;
        if (this.onChangeWorkSpaceTranslateValue != undefined) {
            this.onChangeWorkSpaceTranslateValue(this);
        }
    }
}
class CCamera extends CNotifyChangeNotifyObject {
    constructor() {
        super(...arguments);
        this._x = 0;
        this._y = 0;
        this._z = 0;
        this._angleX = 0;
        this._angleY = 0;
    }
    get x() {
        return this._x;
    }
    set x(value) {
        if (this._x != undefined) {
            this._x = value;
            this.doChangeCameraPosition();
        }
    }
    get y() {
        return this._y;
    }
    set y(value) {
        if (this._y != undefined) {
            this._y = value;
            this.doChangeCameraPosition();
        }
    }
    get z() {
        return this._z;
    }
    set z(value) {
        if (this._z != undefined) {
            this._z = value;
            this.doChangeCameraPosition();
        }
    }
    get angleX() {
        return this._angleX;
    }
    set angleX(value) {
        if (this._angleX != undefined) {
            this._angleX = value;
            this.doChangeCameraPosition();
        }
    }
    get angleY() {
        return this._angleY;
    }
    set angleY(value) {
        if (this._angleY != undefined) {
            this._angleY = value;
            this.doChangeCameraPosition();
        }
    }
    doChangeCameraPosition() {
        if (this.onChangeCameraPosition != undefined) {
            this.onChangeCameraPosition(this);
        }
    }
}
class CWorkSpaceBoard extends CPanel {
    get camera() {
        return this._camera;
    }
    get workSpaceList() {
        return this._workSpaceList;
    }
    get selectedWorkSpace() {
        return this._selectedWorkSpace;
    }
    set selectedWorkSpace(value) {
        if (this._selectedWorkSpace != value) {
            this._selectedWorkSpace = value;
            this.doChangeSelectedWorkSpace();
        }
    }
    constructor(parent, name) {
        super(parent, name);
        this._camera = new CCamera();
        this._workSpaceList = new CList();
        this.animationDuration = 0;
        this.animationGraphName = "";
        let self = this;
        this.transform.translateZ = 0.25;
        this._workSpaceList.onChange = function () {
            self.doChangeWorkSpaceList();
        };
        this._camera.onChangeCameraPosition = function () {
            self.doChangeCamera();
        };
    }
    setWorkSpaceSize() {
        for (let n = 0; n < this._workSpaceList.length; n++) {
            this._workSpaceList.get(n).position.left = 0;
            this._workSpaceList.get(n).position.top = 0;
            this._workSpaceList.get(n).position.width = this.position.width;
            this._workSpaceList.get(n).position.height = this.position.height;
        }
    }
    doChangeSize() {
        super.doChangeSize();
        this.setWorkSpaceSize();
    }
    doChangeWorkSpaceList() {
        this.setWorkSpaceSize();
        if (this.onChangeWorkSpaceList != undefined) {
            this.onChangeWorkSpaceList(this);
        }
    }
    doChangeCamera() {
        for (let n = 0; n < this._workSpaceList.length; n++) {
            let x = this._workSpaceList.get(n).workSpaceTranslateX - this.camera.x;
            let y = this._workSpaceList.get(n).workSpaceTranslateY - this.camera.y;
            let z = this._workSpaceList.get(n).workSpaceTranslateZ - this.camera.z;
            let pt = CPoint3D.getAngleToPoint3D(new CPoint3D(x, y, z), 0, 180 + this.camera.angleX, Math.abs(this.camera.z - this._workSpaceList.get(n).transform.translateZ));
            let pty = CPoint3D.getAngleToPoint3D(new CPoint3D(x, y, z), 90, 180 + this.camera.angleY, Math.abs(this.camera.z - this._workSpaceList.get(n).transform.translateZ));
            this._workSpaceList.get(n).transform.translateX = pt.x;
            this._workSpaceList.get(n).transform.translateY = pty.y;
            this._workSpaceList.get(n).transform.translateZ = z;
            this._workSpaceList.get(n).transform.rotateY = this.camera.angleX;
            this._workSpaceList.get(n).transform.rotateX = this.camera.angleY;
        }
        if (this.onChangeCamera != undefined) {
            this.onChangeCamera(this);
        }
    }
    doChangeSelectedWorkSpace() {
        let self = this;
        if (this.selectedWorkSpace != undefined) {
            let x = this.camera.x;
            let y = this.camera.y;
            let z = this.camera.z;
            let dx = this.selectedWorkSpace.workSpaceTranslateX;
            let dy = this.selectedWorkSpace.workSpaceTranslateY;
            let dz = this.selectedWorkSpace.workSpaceTranslateZ;
            if (this.animationDuration != 0 && this.animationGraphName != "") {
                CAnimation.graphAnimate(this.animationDuration, [this.animationGraphName], function (t, v, ct, gn, gv) {
                    self.camera.x = CCalc.crRange2Value(0, 1, gv, x, dx);
                    self.camera.y = CCalc.crRange2Value(0, 1, gv, y, dy);
                    self.camera.z = CCalc.crRange2Value(0, 1, gv, z, dz);
                });
            }
            else {
                self.camera.x = dx;
                self.camera.y = dy;
                self.camera.z = dz;
            }
        }
        else {
            let x = this.camera.x;
            let y = this.camera.y;
            let z = this.camera.z;
            if (this.animationDuration != 0 && this.animationGraphName != "") {
                CAnimation.graphAnimate(this.animationDuration, [this.animationGraphName], function (t, v, ct, gn, gv) {
                    self.camera.x = x - (x * gv);
                    self.camera.y = y - (y * gv);
                    self.camera.z = z - (z * gv);
                });
            }
            else {
                self.camera.x = 0;
                self.camera.y = 0;
                self.camera.z = 0;
            }
        }
        if (this.onChangeSelectedWorkSpace != undefined) {
            this.onChangeSelectedWorkSpace(this);
        }
    }
    addWorkSpace(name, resource) {
        let w = new CWorkSpace(this, name);
        if (resource != undefined)
            w.resource = resource;
        w.position.left = 0;
        w.position.top = 0;
        w.position.width = this.position.width;
        w.position.height = this.position.height;
        this.workSpaceList.add(w);
        return w;
    }
    cameraMove(x, y, z, angleX, angleY) {
        let xx = this.camera.x;
        let yy = this.camera.y;
        let zz = this.camera.z;
        let ax = this.camera.angleX;
        let ay = this.camera.angleY;
        if (this.animationDuration != 0 && this.animationGraphName != "") {
            let self = this;
            CAnimation.graphAnimate(this.animationDuration, [this.animationGraphName], function (t, v, ct, gn, gv) {
                self.camera.x = CCalc.crRange2Value(0, 1, gv, xx, x);
                self.camera.y = CCalc.crRange2Value(0, 1, gv, yy, y);
                self.camera.z = CCalc.crRange2Value(0, 1, gv, zz, z);
                self.camera.angleX = CCalc.crRange2Value(0, 1, gv, ax, angleX);
                self.camera.angleY = CCalc.crRange2Value(0, 1, gv, ay, angleY);
            });
        }
        else {
            this.camera.x = x;
            this.camera.y = y;
            this.camera.z = z;
            this.camera.angleX = angleX;
            this.camera.angleY = angleY;
        }
    }
}
