"use strict";
class CControl extends CNotifyChangeKindObject {
    constructor(parent, name) {
        super();
        this._hasPointerEvent = true;
        this._stopPropagation = new CStopPropagationInfo();
        this._tabIndex = "";
        this._overflow = "";
        this._opacity = 1;
        this._enabled = true;
        this._visible = true;
        this._focused = false;
        this._selected = false;
        this._checked = false;
        this._cursor = "auto";
        this._initResource = "";
        this._propertyName = "";
        this._propertyDataKind = "";
        this._focusedAnimatorResource = "";
        this._enabledAnimatorResource = "";
        this._visibleAnimatorResource = "";
        this._resourceAnimatorResource = "";
        this._selectAnimatorResource = "";
        this._checkAnimatorResource = "";
        this._removeAnimatorResource = "";
        let self = this;
        this._id = CSequence.getSequence("control");
        if (name != undefined) {
            this._name = name;
        }
        else {
            this._name = CSequence.getSequence("unnamed");
        }
        let arr = CSystem.getControlsFromName(this.getNamPath());
        let isDup = false;
        if (arr.length != 0) {
            isDup = true;
        }
        this._controlElement = document.createElement("control");
        this._controlElement.setAttribute("className", this.className);
        this._controlElement.setAttribute("control-id", this.id);
        this._controlElement.setAttribute("control-name", this.name);
        this._controlElement.style.outline = "none";
        this._controlElement.style.position = "absolute";
        this._controlElement.style.margin = "0px 0px 0px 0px";
        this._controlElement.style.padding = "0px 0px 0px 0px";
        this._controlElement.style.border = "none";
        this._controlElement.style.zIndex = CSystem.getZPlus() + "";
        this._controlElement.setAttribute("ondragstart", "return false");
        this._controlElement.setAttribute("onselectstart", "return false");
        this._controlElement.setAttribute("oncontextmenu", "return false");
        this._controlElement.setAttribute("class", "scrollno");
        this._controlElement.style.touchAction = "auto";
        this._controlElement.style.userSelect = "text";
        this._controlElement.style.pointerEvents = "auto";
        this._controlElement.style.opacity = this._opacity + "";
        this._position = new CPosition();
        this._position.onChange = function (ps, kind) {
            self.doChangePosition(kind);
        };
        this._transform = new CTransform();
        this._transform.onChange = function (sender, kind) {
            self.doChangeTrasform(kind);
        };
        this._stopPropagation.onChange = function () {
            self.doChange(CControl.CON_CHANGE_STOP_PROPAGATION);
        };
        this._controlElement.addEventListener("focus", function (ev) {
            if (self.enabled)
                self.focused = true;
        });
        this._controlElement.addEventListener("blur", function (ev) {
            if (self.enabled)
                self.focused = false;
        });
        if (parent instanceof CControl) {
            this._parent = parent;
            this._parent.controlElement.appendChild(this._controlElement);
        }
        if (parent instanceof HTMLElement) {
            this.parentElement(parent);
        }
        this._filter = new CFilter(this._controlElement);
        if (isDup) {
            this.remove();
            throw new Error("invalid name : " + name);
        }
        else {
            CSystem.controls.addControl(this);
        }
        this.transform.setTransform(this._controlElement);
    }
    static get CON_CHANGE_NAME() { return "name"; }
    static get CON_CHANGE_STOP_PROPAGATION() { return "changeStopPropagation"; }
    static get CON_CHANGE_POSITION_PARENT() { return "changePositionParent"; }
    static get CON_CHANGE_POSITION() { return "changePosition"; }
    static get CON_CHANGE_HAS_POINTER() { return "changeHasPointer"; }
    static get CON_CHANGE_TAB_INDEX() { return "changeTabIndex"; }
    static get CON_CHANGE_OVER_FLOW() { return "changeOverFlow"; }
    static get CON_CHANGE_OPACITY() { return "changeOpacity"; }
    static get CON_CHANGE_ENABLED() { return "changeEnabled"; }
    static get CON_CHANGE_VISIBLE() { return "changeVisible"; }
    static get CON_CHANGE_FOCUS() { return "changeFocus"; }
    static get CON_CHANGE_SELECTED() { return "changeSelect"; }
    static get CON_CHANGE_CHECKED() { return "changeCheck"; }
    static get CON_CHANGE_USE_DRAG() { return "changeUseDrag"; }
    get focusedAnimatorResource() {
        return this._focusedAnimatorResource;
    }
    set focusedAnimatorResource(value) {
        this._focusedAnimatorResource = value;
        if (value != "")
            this.focusedAnimationTrigger = CAnimator.animatorFromResource(this, value);
    }
    get enabledAnimatorResource() {
        return this._enabledAnimatorResource;
    }
    set enabledAnimatorResource(value) {
        this._enabledAnimatorResource = value;
        if (value != "")
            this.enabledAnimationTrigger = CAnimator.animatorFromResource(this, value);
    }
    get visibleAnimatorResource() {
        return this._visibleAnimatorResource;
    }
    set visibleAnimatorResource(value) {
        this._visibleAnimatorResource = value;
        if (value != "")
            this.visibleAnimationTrigger = CAnimator.animatorFromResource(this, value);
    }
    get resourceAnimatorResource() {
        return this._resourceAnimatorResource;
    }
    set resourceAnimatorResource(value) {
        this._resourceAnimatorResource = value;
        if (value != "")
            this.resourceAnimationTrigger = CAnimator.animatorFromResource(this, value);
    }
    get selectAnimatorResource() {
        return this._selectAnimatorResource;
    }
    set selectAnimatorResource(value) {
        this._selectAnimatorResource = value;
        if (value != "")
            this.selectAnimationTrigger = CAnimator.animatorFromResource(this, value);
    }
    get checkAnimatorResource() {
        return this._checkAnimatorResource;
    }
    set checkAnimatorResource(value) {
        this._checkAnimatorResource = value;
        if (value != "")
            this.checkAnimationTrigger = CAnimator.animatorFromResource(this, value);
    }
    get removeAnimatorResource() {
        return this._removeAnimatorResource;
    }
    set removeAnimatorResource(value) {
        this._removeAnimatorResource = value;
        if (value != "")
            this.removeAnimationTrigger = CAnimator.animatorFromResource(this, value);
    }
    get initResource() {
        return this._initResource;
    }
    set initResource(value) {
        this._initResource = value;
        let data = CSystem.resources.get(value);
        if (data.init != undefined) {
            let fn = new Function("control", data.init);
            fn(this);
        }
    }
    get propertyName() {
        return this._propertyName;
    }
    set propertyName(value) {
        if (this._propertyName != value) {
            this._propertyName = value;
            this.doChangePropertyName();
        }
    }
    get propertyDataKind() {
        return this._propertyDataKind;
    }
    set propertyDataKind(value) {
        if (this._propertyDataKind != value) {
            this._propertyDataKind = value;
            this.doChangePropertyDataKind();
        }
    }
    get parent() {
        return this._parent;
    }
    set parent(value) {
        if (value == undefined) {
            this._parent = value;
            if (this.controlElement.parentElement != null) {
                this.controlElement.parentElement.removeChild(this.controlElement);
            }
        }
        else {
            if (value instanceof HTMLElement) {
                value.appendChild(this.controlElement);
            }
            else {
                this._parent = value;
                if (this.controlElement.parentElement != null) {
                    this.controlElement.parentElement.removeChild(this.controlElement);
                }
                value.controlElement.appendChild(this.controlElement);
            }
            this.doSetPosition();
        }
    }
    get id() {
        return this._id;
    }
    get name() {
        return this._name;
    }
    /*set name(value: string) {
        if(value.indexOf(".") != -1) throw new Error("invalid name : " + value)
        if(this._name != value) {
            this._name = value
            this.doChange(CControl.CON_CHANGE_NAME)
        }
    }*/
    get childs() {
        return CSystem.getChildControls(this);
    }
    get parents() {
        let arr = new Array();
        let p = this._parent;
        while (p != undefined) {
            arr.unshift(p);
            p = p.parent;
        }
        return arr;
    }
    get parentPositions() {
        let arr = new Array();
        let p = this._parent;
        while (p != undefined) {
            arr.unshift(p._position);
            p = p.parent;
        }
        return arr;
    }
    get brotherPositions() {
        let arr = new Array();
        let bros = CSystem.getBroControls(this);
        for (let n = 0; n < bros.length; n++) {
            if (bros[n].visible)
                arr.push(bros[n]._position);
        }
        return arr;
    }
    get controlElement() {
        return this._controlElement;
    }
    get elementBounds() {
        let r = new CRect();
        let rt = this._controlElement.getBoundingClientRect();
        r.left = rt.x;
        r.top = rt.y;
        r.width = rt.width;
        r.height = rt.height;
        return r;
    }
    get position() {
        return this._position;
    }
    set position(value) {
        this._position = value;
        let self = this;
        this._position.onChange = function (ps, kind) {
            self.doChangePosition(kind);
        };
    }
    get transform() {
        return this._transform;
    }
    get hasPointerEvent() {
        return this._hasPointerEvent;
    }
    set hasPointerEvent(value) {
        if (this._hasPointerEvent != value) {
            this._hasPointerEvent = value;
            this.doChange(CControl.CON_CHANGE_HAS_POINTER);
        }
    }
    get cursor() {
        return this._cursor;
    }
    set cursor(value) {
        if (this._cursor != value) {
            this._cursor = value;
            this.controlElement.style.cursor = value;
        }
    }
    get stopPropagation() {
        return this._stopPropagation;
    }
    get tabIndex() {
        return this._tabIndex;
    }
    set tabIndex(value) {
        if (this._tabIndex != value) {
            this._tabIndex = value;
            this.doChange(CControl.CON_CHANGE_TAB_INDEX);
        }
    }
    get overflow() {
        return this._overflow;
    }
    set overflow(value) {
        if (this._overflow != value) {
            this._overflow = value;
            this.doChange(CControl.CON_CHANGE_OVER_FLOW);
        }
    }
    get opacity() {
        return this._opacity;
    }
    set opacity(value) {
        if (this._opacity != value) {
            this._opacity = value;
            this.doChange(CControl.CON_CHANGE_OPACITY);
        }
    }
    get enabled() {
        return this._enabled;
    }
    set enabled(value) {
        if (this._enabled != value) {
            this._enabled = value;
            this.doChange(CControl.CON_CHANGE_ENABLED);
        }
    }
    get visible() {
        return this._visible;
    }
    set visible(value) {
        if (this._visible != value) {
            this._visible = value;
            this.doChange(CControl.CON_CHANGE_VISIBLE, value);
        }
    }
    get focused() {
        return this._focused;
    }
    set focused(value) {
        if (this._focused != value) {
            this._focused = value;
            if (value) {
                this.controlElement.focus();
            }
            else {
                this.controlElement.blur();
            }
            this.doChange(CControl.CON_CHANGE_FOCUS);
        }
    }
    get hasFocus() {
        return this.tabIndex != "";
    }
    set hasFocus(value) {
        if (value) {
            if (!this.hasFocus) {
                this.tabIndex = CSequence.getSequence("tabindex_").split("_")[1];
            }
        }
        else {
            this.tabIndex = "";
        }
    }
    get selected() {
        return this._selected;
    }
    set selected(value) {
        if (this._selected != value) {
            this._selected = value;
            this.doChange(CControl.CON_CHANGE_SELECTED);
        }
    }
    get checked() {
        return this._checked;
    }
    set checked(value) {
        if (this._checked != value) {
            this._checked = value;
            this.doChange(CControl.CON_CHANGE_CHECKED);
        }
    }
    get filter() {
        return this._filter;
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "className", this.className);
        CDataClass.putData(data, "position", this.position.toData(), {}, true);
        CDataClass.putData(data, "transform", this.transform.toData(), {}, true);
        CDataClass.putData(data, "hasPointerEvent", this.hasPointerEvent, true);
        CDataClass.putData(data, "stopPropagation", this.stopPropagation.toData(), {}, true);
        CDataClass.putData(data, "tabIndex", this.tabIndex, "");
        CDataClass.putData(data, "overflow", this.overflow, "");
        CDataClass.putData(data, "opacity", this.opacity, 1);
        CDataClass.putData(data, "filter", this.filter.toData(), {}, true);
        CDataClass.putData(data, "enabled", this.enabled, true);
        CDataClass.putData(data, "visible", this.visible, true);
        CDataClass.putData(data, "selected", this.selected, false);
        CDataClass.putData(data, "checked", this.checked, false);
        CDataClass.putData(data, "focusedAnimatorResource", this.focusedAnimatorResource, "");
        CDataClass.putData(data, "enabledAnimatorResource", this.enabledAnimatorResource, "");
        CDataClass.putData(data, "visibleAnimatorResource", this.visibleAnimatorResource, "");
        CDataClass.putData(data, "resourceAnimatorResource", this.resourceAnimatorResource, "");
        CDataClass.putData(data, "selectAnimatorResource", this.selectAnimatorResource, "");
        CDataClass.putData(data, "checkAnimatorResource", this.checkAnimatorResource, "");
        CDataClass.putData(data, "removeAnimatorResource", this.removeAnimatorResource, "");
        CDataClass.putData(data, "propertyName", this.propertyName, "");
        CDataClass.putData(data, "propertyDataKind", this.propertyDataKind, "");
        if (this.focusedAnimationTrigger != undefined)
            CDataClass.putData(data, "focusedAnimationTrigger", this.focusedAnimationTrigger.toData(), {}, true);
        if (this.enabledAnimationTrigger != undefined)
            CDataClass.putData(data, "enabledAnimationTrigger", this.enabledAnimationTrigger.toData(), {}, true);
        if (this.visibleAnimationTrigger != undefined)
            CDataClass.putData(data, "visibleAnimationTrigger", this.visibleAnimationTrigger.toData(), {}, true);
        if (this.resourceAnimationTrigger != undefined)
            CDataClass.putData(data, "resourceAnimationTrigger", this.resourceAnimationTrigger.toData(), {}, true);
        if (this.selectAnimationTrigger != undefined)
            CDataClass.putData(data, "selectAnimationTrigger", this.selectAnimationTrigger.toData(), {}, true);
        if (this.checkAnimationTrigger != undefined)
            CDataClass.putData(data, "checkAnimationTrigger", this.checkAnimationTrigger.toData(), {}, true);
    }
    doFromData(data) {
        super.doFromData(data);
        let b = this.propertyName != "";
        let pn = this.propertyName;
        let pdk = this.propertyDataKind;
        this.position.fromData(CDataClass.getData(data, "position", {}, true));
        this.transform.fromData(CDataClass.getData(data, "transform", {}, true));
        this.hasPointerEvent = CDataClass.getData(data, "hasPointerEvent", true);
        this.stopPropagation.fromData(CDataClass.getData(data, "stopPropagation", {}, true));
        this.tabIndex = CDataClass.getData(data, "tabIndex", "");
        this.overflow = CDataClass.getData(data, "overflow", "");
        this.opacity = CDataClass.getData(data, "opacity", 1);
        this.filter.fromData(CDataClass.getData(data, "filter", {}, true));
        this.enabled = CDataClass.getData(data, "enabled", true);
        this.visible = CDataClass.getData(data, "visible", true);
        this.selected = CDataClass.getData(data, "selected", false);
        this.checked = CDataClass.getData(data, "checked", false);
        CAnimator.fromAnimatorData(data, this, "focusedAnimationTrigger");
        CAnimator.fromAnimatorData(data, this, "enabledAnimationTrigger");
        CAnimator.fromAnimatorData(data, this, "visibleAnimationTrigger");
        CAnimator.fromAnimatorData(data, this, "resourceAnimationTrigger");
        CAnimator.fromAnimatorData(data, this, "selectAnimationTrigger");
        CAnimator.fromAnimatorData(data, this, "checkAnimationTrigger");
        this.focusedAnimatorResource = CDataClass.getData(data, "focusedAnimatorResource", "");
        this.enabledAnimatorResource = CDataClass.getData(data, "enabledAnimatorResource", "");
        this.visibleAnimatorResource = CDataClass.getData(data, "visibleAnimatorResource", "");
        this.resourceAnimatorResource = CDataClass.getData(data, "resourceAnimatorResource", "");
        this.selectAnimatorResource = CDataClass.getData(data, "selectAnimatorResource", "");
        this.checkAnimatorResource = CDataClass.getData(data, "checkAnimatorResource", "");
        this.removeAnimatorResource = CDataClass.getData(data, "removeAnimatorResource", "");
        this.propertyName = CDataClass.getData(data, "propertyName", "");
        this.propertyDataKind = CDataClass.getData(data, "propertyDataKind", "");
        if (b) {
            this.propertyName = pn;
            this.propertyDataKind = pdk;
        }
    }
    doResource() {
        let data = CSystem.resources.get(this._resource);
        if (data != undefined) {
            this.fromData(data);
            if (data.init != undefined) {
                let fn = new Function("control", data.init);
                fn(this);
            }
            if (this.resourceAnimationTrigger != undefined) {
                let self = this;
                this.resourceAnimationTrigger.onAfterAnimation = function () {
                    if (self.onResource != undefined) {
                        self.onResource(this);
                    }
                };
                this.resourceAnimationTrigger.start();
            }
            else {
                if (this.onResource != undefined) {
                    this.onResource(this);
                }
            }
        }
    }
    doSetPosition() {
        if (this.parent != undefined) {
            let bros = CSystem.getBroVisiblePositions(this);
            let ps = CPosition.getAlignPixelBounds(this.parent.position, bros, this.position);
            if (ps.left != this.position.left || ps.top != this.position.top) {
                if (ps.left != this.position.left) {
                    this.position.leftNotNofity = ps.left;
                }
                if (ps.top != this.position.top) {
                    this.position.topNotNofity = ps.top;
                }
                this.doChangeOffset();
            }
            if (ps.width != this.position.width || ps.height != this.position.height) {
                if (ps.width != this.position.width) {
                    this.position.widthNotNofity = ps.width;
                }
                if (ps.height != this.position.height) {
                    this.position.heightNotNofity = ps.height;
                }
                this.doChangeSize();
            }
        }
        else {
            this.doSetElementOffset();
            this.doSetElementSize();
        }
        if (this.onSetPosition != undefined) {
            this.onSetPosition(this);
        }
    }
    doSetElementOffset() {
        this.controlElement.style.left = this.position.left + "px";
        this.controlElement.style.top = this.position.top + "px";
        if (this.onSetElementOffset != undefined) {
            this.onSetElementOffset(this);
        }
    }
    doSetElementSize() {
        this.controlElement.style.width = this.position.width + "px";
        this.controlElement.style.height = this.position.height + "px";
        if (this.onSetElementSize != undefined) {
            this.onSetElementSize(this);
        }
    }
    doSetElementRotationCenter() {
        if (this.onSetElementRotationCenter != undefined) {
            this.onSetElementRotationCenter(this);
        }
    }
    doSetElementScale() {
        if (this.onSetElementScale != undefined) {
            this.onSetElementScale(this);
        }
    }
    doRemove() {
        if (this.onBeforeRemove != undefined) {
            this.onBeforeRemove(this);
        }
        this.controlElement.blur();
        let arr = CSystem.getChildControls(this);
        for (let n = 0; n < arr.length; n++) {
            arr[n].remove();
        }
        CSystem.controls.deleteControl(this);
        this.controlElement.remove();
        if (this.focusedAnimationTrigger != undefined)
            this.focusedAnimationTrigger.remove();
        this.focusedAnimationTrigger = undefined;
        if (this.enabledAnimationTrigger != undefined)
            this.enabledAnimationTrigger.remove();
        this.enabledAnimationTrigger = undefined;
        if (this.visibleAnimationTrigger != undefined)
            this.visibleAnimationTrigger.remove();
        this.visibleAnimationTrigger = undefined;
        if (this.resourceAnimationTrigger != undefined)
            this.resourceAnimationTrigger.remove();
        this.resourceAnimationTrigger = undefined;
        if (this.selectAnimationTrigger != undefined)
            this.selectAnimationTrigger.remove();
        this.selectAnimationTrigger = undefined;
        if (this.checkAnimationTrigger != undefined)
            this.checkAnimationTrigger.remove();
        this.checkAnimationTrigger = undefined;
        if (this.removeAnimationTrigger != undefined)
            this.removeAnimationTrigger.remove();
        this.removeAnimationTrigger = undefined;
        super.doRemove();
    }
    doChange(kind, data) {
        if (kind == CControl.CON_CHANGE_POSITION) {
            this.doChangePosition(data);
        }
        if (kind == CControl.CON_CHANGE_HAS_POINTER) {
            this.doChangeHasPointer();
        }
        if (kind == CControl.CON_CHANGE_TAB_INDEX) {
            this.controlElement.setAttribute("tabindex", this._tabIndex);
        }
        if (kind == CControl.CON_CHANGE_OVER_FLOW) {
            this.controlElement.style.overflow = this._overflow;
        }
        if (kind == CControl.CON_CHANGE_OPACITY) {
            this.doChangeOpacity();
        }
        if (kind == CControl.CON_CHANGE_ENABLED) {
            this.doChangeEnabled();
        }
        if (kind == CControl.CON_CHANGE_VISIBLE) {
            this.doChangeVisible(data);
        }
        if (kind == CControl.CON_CHANGE_FOCUS) {
            this.doChangeFocus();
        }
        if (kind == CControl.CON_CHANGE_CHECKED) {
            this.doChangeChecked();
        }
        if (kind == CControl.CON_CHANGE_SELECTED) {
            this.doChangeSelected();
        }
        /*let arrBro = CMainThread.getBroControls(this)
        for(let n = 0; n < arrBro.length; n++) {
            if(arrBro[n] != this) arrBro[n].doNotifyChangeBrother(this, kind)
        }
        let arrChild = CMainThread.getChildControls(this)
        for(let n = 0; n < arrChild.length; n++) {
            arrChild[n].doNotifyChangeParent(this, kind)
        }
        if(this.parent != undefined) {
            this.parent.doNotifyChangeChild(this, kind)
        }*/
        super.doChange(kind);
    }
    doChangePosition(kind, data) {
        this.doChange(kind, data);
        let boff = false;
        let bsize = false;
        if (this.parent != undefined && this.position.align != EPositionAlign.NONE) {
            let bros = CSystem.getBroVisiblePositions(this);
            let ps = CPosition.getAlignPixelBounds(this.parent.position, bros, this.position);
            if (ps.left != this.position.left || ps.top != this.position.top) {
                if (ps.left != this.position.left) {
                    this.position.leftNotNofity = ps.left;
                    boff = true;
                }
                if (ps.top != this.position.top) {
                    this.position.topNotNofity = ps.top;
                    boff = true;
                }
                this.doChangeOffset();
            }
            //if(b) this.doSetElementOffset()
            //b = false
            if (ps.width != this.position.width || ps.height != this.position.height) {
                if (ps.width != this.position.width) {
                    this.position.widthNotNofity = ps.width;
                    bsize = true;
                }
                if (ps.height != this.position.height) {
                    this.position.heightNotNofity = ps.height;
                    bsize = true;
                }
                this.doChangeSize();
            }
            //if(b) this.doSetElementSize()
        }
        if ((kind == CPosition.CON_CHANGE_LEFT || kind == CPosition.CON_CHANGE_TOP) && !boff) {
            this.doChangeOffset();
        }
        if ((kind == CPosition.CON_CHANGE_WIDTH || kind == CPosition.CON_CHANGE_HEIGHT) && !bsize) {
            this.doChangeSize();
        }
        if (kind == CPosition.CON_CHANGE_ALIGN) {
            this.doChangeAilgn();
        }
        if (kind == CPosition.CON_CHANGE_ALIGN_INFO) {
            this.doChangeAlignInfo(kind);
        }
        if (kind == CPosition.CON_CHANGE_PARENT_ALIGN_INFO) {
            this.doChangeParentAlignInfo(kind);
        }
        if (kind == CPosition.CON_CHANGE_MARGINS) {
            this.doChangeMargins();
        }
        if (kind == CPosition.CON_CHANGE_PADDING) {
            this.doChangePadding();
        }
    }
    doChangeTrasform(kind) {
        this._transform.setTransform(this.controlElement);
        if (kind == CTransform.CON_CHANGE_PERSPECTIVE || kind == CTransform.CON_CHANGE_PERSPECTIVE_Y || kind == CTransform.CON_CHANGE_PERSPECTIVE_X) {
            this.doChangePerspective();
        }
        if (kind == CTransform.CON_CHANGE_ROTATION_POINT_X || kind == CTransform.CON_CHANGE_ROTATION_POINT_Y || kind == CTransform.CON_CHANGE_ROTATION_POINT_Z) {
            this.doChangeRotationCenter();
        }
        if (kind == CTransform.CON_CHANGE_SCALE_X || kind == CTransform.CON_CHANGE_SCALE_Y || kind == CTransform.CON_CHANGE_SCALE_Z) {
            this.doChangeScale();
        }
        if (kind == CTransform.CON_CHANGE_ROTATE_X || kind == CTransform.CON_CHANGE_ROTATE_Y || kind == CTransform.CON_CHANGE_ROTATE_Z) {
            this.doChangeRotate();
        }
        if (kind == CTransform.CON_CHANGE_TRANSLATE_X || kind == CTransform.CON_CHANGE_TRANSLATE_Y || kind == CTransform.CON_CHANGE_TRANSLATE_Z) {
            this.doChangeTraslate();
        }
        if (this.onChangeTrasform != undefined) {
            this.onChangeTrasform(this);
        }
    }
    doChangeAilgn() {
        this.doSetElementOffset();
        this.doSetElementSize();
        this.childsPositionSet();
        this.brothersPositionSet();
        if (this.onChangeAlign != undefined) {
            this.onChangeAlign(this);
        }
    }
    doChangeAlignInfo(kind, data) {
        this.doSetElementOffset();
        this.doSetElementSize();
        this.childsPositionSet();
        this.brothersPositionSet();
        if (this.onChangeAlignInfo != undefined) {
            this.onChangeAlignInfo(this);
        }
    }
    doChangeParentAlignInfo(kind) {
        this.childsPositionSet();
        if (this.onChangeParentAlignInfo != undefined) {
            this.onChangeParentAlignInfo(this);
        }
    }
    doChangeOpacity() {
        this._controlElement.style.opacity = this._opacity + "";
        if (this.onChangeOpacity != undefined) {
            this.onChangeOpacity(this);
        }
    }
    doChangeVisible(value) {
        if (this.visibleAnimationTrigger != undefined) {
            if (value) {
                let self = this;
                this.visibleAnimationTrigger.onAfterAnimation = function () {
                    if (!self.visible)
                        self._controlElement.style.display = "none";
                    self.doShow();
                    self.brothersPositionSet();
                };
                this._controlElement.style.display = "inline-block";
                this.triggerTrue(this.visibleAnimationTrigger);
            }
            else {
                let self = this;
                this.visibleAnimationTrigger.onAfterAnimation = function () {
                    if (!self.visible)
                        self._controlElement.style.display = "none";
                    self.doHide();
                    self.brothersPositionSet();
                };
                this.triggerFalse(this.visibleAnimationTrigger);
            }
        }
        else {
            if (value) {
                this._controlElement.style.display = "inline-block";
                this.doShow();
                this.brothersPositionSet();
            }
            else {
                this._controlElement.style.display = "none";
                this.doHide();
                this.brothersPositionSet();
            }
            //this._visible = value
        }
        if (this.onChangeVisible != undefined) {
            this.onChangeVisible(this);
        }
    }
    doChangeEnabled() {
        if (!this.enabled) {
            if (this.focused) {
                this.controlElement.blur();
                this.focused = false;
            }
        }
        if (this.enabledAnimationTrigger != undefined) {
            if (this.enabled) {
                this.triggerTrue(this.enabledAnimationTrigger);
            }
            else {
                this.triggerFalse(this.enabledAnimationTrigger);
            }
        }
        if (this.onChangeEnabled != undefined) {
            this.onChangeEnabled(this);
        }
    }
    doChangeFocus() {
        if (this.focusedAnimationTrigger != undefined) {
            if (this.focused) {
                this.triggerTrue(this.focusedAnimationTrigger);
            }
            else {
                this.triggerFalse(this.focusedAnimationTrigger);
            }
        }
        if (this.onChangeFocus != undefined) {
            this.onChangeFocus(this);
        }
    }
    doChangeSelected() {
        if (this.selectAnimationTrigger != undefined) {
            if (this.selected) {
                this.triggerTrue(this.selectAnimationTrigger);
            }
            else {
                this.triggerFalse(this.selectAnimationTrigger);
            }
        }
        if (this.onChangeSelected != undefined) {
            this.onChangeSelected(this);
        }
    }
    doChangeChecked() {
        if (this.checkAnimationTrigger != undefined) {
            if (this.checked) {
                this.triggerTrue(this.checkAnimationTrigger);
            }
            else {
                this.triggerFalse(this.checkAnimationTrigger);
            }
        }
        if (this.onChangeChecked != undefined) {
            this.onChangeChecked(this);
        }
    }
    doChangeOffset() {
        this.doSetElementOffset();
        if (this.onChangeOffset != undefined) {
            this.onChangeOffset(this);
        }
    }
    doChangeSize() {
        this.doSetElementSize();
        this.childsPositionSet();
        this.brothersPositionSet();
        if (this.position.align == EPositionAlign.RIGHT || this.position.align == EPositionAlign.BOTTOM) {
            if (this.parent != undefined) {
                let bros = CSystem.getBroVisiblePositions(this);
                let ps = CPosition.getAlignPixelBounds(this.parent.position, bros, this.position);
                if (ps.left != this.position.left || ps.top != this.position.top) {
                    if (ps.left != this.position.left) {
                        this.position.leftNotNofity = ps.left;
                    }
                    if (ps.top != this.position.top) {
                        this.position.topNotNofity = ps.top;
                    }
                }
                if (ps.width != this.position.width || ps.height != this.position.height) {
                    if (ps.width != this.position.width) {
                        this.position.widthNotNofity = ps.width;
                    }
                    if (ps.height != this.position.height) {
                        this.position.heightNotNofity = ps.height;
                    }
                }
            }
            this.doSetElementOffset();
            this.doSetElementSize();
        }
        if (this.onChangeSize != undefined) {
            this.onChangeSize(this);
        }
    }
    doChangeRotationCenter() {
        this.doSetElementRotationCenter();
        if (this.onChangeRotationCenter != undefined) {
            this.onChangeRotationCenter(this);
        }
    }
    doChangeRotate() {
        if (this.onChangeRotate != undefined) {
            this.onChangeRotate(this);
        }
    }
    doChangeScale() {
        if (this.onChangeScale != undefined) {
            this.onChangeScale(this);
        }
    }
    doChangeTraslate() {
        if (this.onChangeTranslate != undefined) {
            this.onChangeTranslate(this);
        }
    }
    doChangePerspective() {
        if (this.onChangePerspective != undefined) {
            this.onChangePerspective(this);
        }
    }
    doChangeMargins() {
        this.doSetElementOffset();
        this.doSetElementSize();
        this.brothersPositionSet();
        this.childsPositionSet();
        if (this.onChangeMargins != undefined) {
            this.onChangeMargins(this);
        }
    }
    doChangePadding() {
        this.childsPositionSet();
        if (this.onChangePadding != undefined) {
            this.onChangePadding(this);
        }
    }
    doChangeHasPointer() {
        if (this._hasPointerEvent) {
            this._controlElement.style.pointerEvents = "auto";
        }
        else {
            this._controlElement.style.pointerEvents = "none";
        }
        if (this.onChangeHasPointer != undefined) {
            this.onChangeHasPointer(this);
        }
    }
    doChangeCountry(code) {
        if (this.onChangeCountry != undefined) {
            this.onChangeCountry(this, code);
        }
    }
    doChangePropertyName() {
        if (this.onChangePropertyName != undefined) {
            this.onChangePropertyName(this);
        }
    }
    doChangePropertyDataKind() {
        if (this.onChangePropertyDataKind != undefined) {
            this.onChangePropertyDataKind(this);
        }
    }
    /*doNotifyChangeChild(child: CControl, kind: string, data?:any) {
        if(this.onNotifyChildChange != undefined) {
            this.onNotifyChildChange(this, child, kind, data)
        }
    }
    doNotifyChangeBrother(brother: CControl, kind: string, data?:any) {
        this.doSetElementSize()
        if(this.bounds.isRelativeAlign() &&
            brother.bounds.isRelativeAlign() && (
                kind == CControl.CON_CHANGE_WIDTH || kind == CControl.CON_CHANGE_HEIGHT || kind == CControl.CON_CHANGE_VISIBLE
            )) {
            this.doSetElementSize()
        }
        if(kind == CArea.CON_CHANGE_ALIGN) {
            this.doSetElementSize()
        }
        if(this.onNotifyBrotherChange != undefined) {
            this.onNotifyBrotherChange(this, brother, kind, data)
        }
    }
    doNotifyChangeParent(parent: CControl, kind: string, data?:any) {
        this.doSetElementSize()
        if(kind == CControl.CON_CHANGE_SCALE_X || kind == CControl.CON_CHANGE_SCALE_Y) {
            this.setAlignBounds()
        }
        if(kind == CArea.CON_CHANGE_ALIGN_CHILDS_FLOW_MARGIN) {
            if(this.position.align != EAreaAlign.NONE) {
                this.setAlignBounds()
            }
        }
        if(kind == CControl.CON_CHANGE_WIDTH || kind == CControl.CON_CHANGE_HEIGHT) {
            if(this.position.align != EAreaAlign.NONE) {
                this.setAlignBounds()
            }
        }
        if(this.onNotifyParentChange != undefined) {
            this.onNotifyParentChange(this, parent, kind, data)
        }
    }*/
    doHide() {
        if (this.onHide != undefined) {
            this.onHide(this);
        }
    }
    doShow() {
        if (this.onShow != undefined) {
            this.onShow(this);
        }
    }
    triggerTrue(trigger) {
        if (trigger.isAnimate()) {
            trigger.reverse();
        }
        else {
            trigger.start();
        }
    }
    triggerFalse(trigger) {
        if (trigger.isAnimate()) {
            if (trigger.isLoop) {
                trigger.cancel();
            }
            else {
                trigger.reverse();
            }
        }
        else {
            trigger.invert();
        }
    }
    childsPositionSet() {
        let arr = CSystem.getChildControls(this);
        for (let n = 0; n < arr.length; n++) {
            if (arr[n].position.align != EPositionAlign.NONE)
                arr[n].doSetPosition();
        }
    }
    brothersPositionSet() {
        let arr = CSystem.getBroControls(this);
        for (let n = 0; n < arr.length; n++) {
            if (arr[n].position.align != EPositionAlign.NONE)
                arr[n].doSetPosition();
        }
    }
    remove() {
        if (this.removeAnimationTrigger != undefined) {
            let self = this;
            this.removeAnimationTrigger.onAfterAnimation = function () {
                self.doRemove();
            };
            this.removeAnimationTrigger.start();
        }
        else {
            this.doRemove();
        }
    }
    parentElement(element) {
        element.appendChild(this._controlElement);
    }
    getParents() {
        let rt = new Array();
        let pr = this.parent;
        while (pr != undefined) {
            rt.unshift(pr);
            pr = pr.parent;
        }
        return rt;
    }
    getNamPath() {
        let arr = this.getParents();
        let rt = "";
        for (let n = 0; n < arr.length; n++) {
            if (n == 0) {
                rt += arr[n].name;
            }
            else {
                rt += "." + arr[n].name;
            }
        }
        if (rt == "") {
            rt += this.name;
        }
        else {
            rt += "." + this.name;
        }
        return this.name;
    }
    getElementBounds() {
        return this._controlElement.getBoundingClientRect();
    }
    bringToFront() {
        /*if(this.controlElement.parentElement != null) {
            let e = this.controlElement.parentElement
            this.controlElement.parentElement.removeChild(this.controlElement)
            e.appendChild(this.controlElement)
        }*/
        this.controlElement.style.zIndex = CSystem.getZPlus() + "";
    }
    sendToBack() {
        /*if(this.controlElement.parentElement != null) {
            let e = this.controlElement.parentElement
            this.controlElement.parentElement.removeChild(this.controlElement)
            e.appendChild(this.controlElement)
            e.prepend(this.controlElement)
        }*/
        this.controlElement.style.zIndex = CSystem.getZMinus() + "";
    }
    addProperties() {
        let arr = super.addProperties();
        arr.push({ instance: this.focusedAnimationTrigger, propertyName: "focusedAnimationTrigger", readOnly: false, enum: [] });
        arr.push({ instance: this.enabledAnimationTrigger, propertyName: "enabledAnimationTrigger", readOnly: false, enum: [] });
        arr.push({ instance: this.visibleAnimationTrigger, propertyName: "visibleAnimationTrigger", readOnly: false, enum: [] });
        arr.push({ instance: this.resourceAnimationTrigger, propertyName: "resourceAnimationTrigger", readOnly: false, enum: [] });
        arr.push({ instance: this.selectAnimationTrigger, propertyName: "selectAnimationTrigger", readOnly: false, enum: [] });
        arr.push({ instance: this.checkAnimationTrigger, propertyName: "checkAnimationTrigger", readOnly: false, enum: [] });
        arr.push({ instance: this.removeAnimationTrigger, propertyName: "removeAnimationTrigger", readOnly: false, enum: [] });
        return arr;
    }
    static createControl(parent, name = "", left = 0, top = 0, width = 50, height = 50) {
        let c = new CControl(parent, name);
        c.position.left = left;
        c.position.top = top;
        c.position.width = width;
        c.position.height = height;
        return c;
    }
    static getControl(name, className = "") {
        let rt = new Array();
        let arr;
        if (className == "") {
            arr = CSystem.controls.findControls([{ columnName: "name", value: name }]);
        }
        else {
            arr = CSystem.controls.findControls([{ columnName: "name", value: name }, { columnName: "className", value: className }]);
        }
        for (let n = 0; n < arr.length; n++) {
            rt.push(arr[n].control);
        }
        return rt;
    }
    static controlFromResource(resource, parent) {
        let rc = CSystem.resources.get(resource);
        if (rc != undefined) {
            if (rc.className != undefined) {
                let fn = new Function("return new " + rc.className + "()");
                let con = fn();
                //con.fromData(rc)
                con.resource = resource;
                con.parent = parent;
                return con;
            }
        }
        else {
            return undefined;
        }
    }
    static controlFromData(data, parent) {
        if (data.className != undefined) {
            let fn = new Function("return new " + data.className + "()");
            let con = fn();
            //con.fromData(rc)
            con.fromData(data);
            con.parent = parent;
            return con;
        }
    }
}
class CLayout extends CControl {
    constructor(parent, name) {
        super(parent, name);
        this.hasPointerEvent = false;
    }
    doResource() {
        super.doResource();
        this.hasPointerEvent = false;
    }
}
var EControlMoveKind;
(function (EControlMoveKind) {
    EControlMoveKind[EControlMoveKind["NONE"] = 0] = "NONE";
    EControlMoveKind[EControlMoveKind["MOVE"] = 1] = "MOVE";
    EControlMoveKind[EControlMoveKind["RESIZE_LT"] = 2] = "RESIZE_LT";
    EControlMoveKind[EControlMoveKind["RESIZE_T"] = 3] = "RESIZE_T";
    EControlMoveKind[EControlMoveKind["RESIZE_RT"] = 4] = "RESIZE_RT";
    EControlMoveKind[EControlMoveKind["RESIZE_L"] = 5] = "RESIZE_L";
    EControlMoveKind[EControlMoveKind["RESIZE_R"] = 6] = "RESIZE_R";
    EControlMoveKind[EControlMoveKind["RESIZE_LB"] = 7] = "RESIZE_LB";
    EControlMoveKind[EControlMoveKind["RESIZE_B"] = 8] = "RESIZE_B";
    EControlMoveKind[EControlMoveKind["RESIZE_RB"] = 9] = "RESIZE_RB";
})(EControlMoveKind || (EControlMoveKind = {}));
class CPointerEventControl extends CControl {
    constructor(parent, name) {
        super(parent, name);
        this.__pressedThisPoints = new CList();
        this.__pressedBubblePoints = new CList();
        this.__thisDownPoint = new CPoint(0, 0);
        this.__preMovePoint = new CPoint(0, 0);
        this.__downMovePoint = new CPoint(0, 0);
        this.__pressedThisDown = false;
        this.__preClick = { time: CTime.now, count: 0 };
        this.__maxCount = 0;
        this.__moveKind = EControlMoveKind.NONE;
        this.__moveResizeDown = {
            offsetx: 0,
            offsety: 0,
            pagex: 0,
            pagey: 0,
            left: 0,
            top: 0,
            width: 0,
            height: 0
        };
        this._isEnter = false;
        this._isOver = false;
        this._repeatClickTime = 300;
        this._usePointerCapture = false;
        this._useDragAndDrop = false;
        this._useDragAndDropCancel = false;
        this._dragCatchControlNames = new CStringSet();
        this._dragCatchControlPropertyNames = new CStringSet();
        this._dragIconResource = "";
        this._hintResource = "";
        this._hint = "";
        this._useHint = false;
        this._hintPosition = "auto";
        this._hintFixOffset = new CPoint(0, 0);
        this._useMove = false;
        this.lockMoveX = false;
        this.lockMoveY = false;
        this.magneticPoints = new Array();
        this._magneticLength = 0;
        this._useResize = false;
        this._moveAreaLength = -1;
        this._resizeAreaLength = 5;
        this._ignoreResizeKind = new Set();
        this.resizeMinWidth = 50;
        this.resizeMinHeight = 50;
        this._useFingerCursor = false;
        this._fingerCursorLength = 30;
        this._fingerCursors = new Array();
        this._fingerCursorResource = "";
        this._thisPointerDownAnimatorResource = "";
        this._thisPointerUpAnimatorResource = "";
        this._overAnimatorResource = "";
        this._enterAnimatorResource = "";
        this._clickAnimatorResource = "";
        this._doubleClickAnimatorResource = "";
        this._dragStartAnimatorResource = "";
        this._dragCancelAnimatorResource = "";
        this._dragCatchAnimatorResource = "";
        this._keyDownAnimatorResource = "";
        this.useMoveClick = false;
        let self = this;
        this._stopPropagation.onChange = function () {
            self.doChange(CControl.CON_CHANGE_STOP_PROPAGATION);
        };
        this._controlElement.addEventListener("keydown", function (e) {
            if (self.enabled)
                self.doKeyDown(e);
            if (self._stopPropagation.keyboard)
                e.stopPropagation();
        });
        this._controlElement.addEventListener("keypress", function (e) {
            if (self.enabled)
                self.doKeyPress(e);
            if (self._stopPropagation.keyboard)
                e.stopPropagation();
        });
        this._controlElement.addEventListener("keyup", function (e) {
            if (self.enabled)
                self.doKeyUp(e);
            if (self._stopPropagation.keyboard)
                e.stopPropagation();
        });
        this._controlElement.addEventListener("pointerdown", function (e) {
            if (self.enabled) {
                self.doPointerDown(e);
                if (self._stopPropagation.down)
                    e.stopPropagation();
            }
        });
        this._controlElement.addEventListener("pointermove", function (e) {
            if (self.enabled) {
                self.doPointerMove(e);
                if (self._stopPropagation.move)
                    e.stopPropagation();
            }
        });
        this._controlElement.addEventListener("pointerup", function (e) {
            if (self.enabled) {
                self.doPointerUp(e);
                if (self._stopPropagation.up)
                    e.stopPropagation();
            }
        });
        this._controlElement.addEventListener("pointercancel", function (e) {
            if (self.enabled) {
                self.doPointerCancel(e);
                if (self._stopPropagation.cancel)
                    e.stopPropagation();
            }
        });
        this._controlElement.addEventListener("pointerover", function (e) {
            if (self.enabled) {
                self._isOver = true;
                self.doPointerOver(e);
                if (self._stopPropagation.over)
                    e.stopPropagation();
            }
        });
        this._controlElement.addEventListener("pointerout", function (e) {
            if (self.enabled) {
                self._isOver = false;
                self.doPointerOut(e);
                if (self._stopPropagation.out)
                    e.stopPropagation();
            }
        });
        this._controlElement.addEventListener("pointerenter", function (e) {
            if (self.enabled) {
                self._isEnter = true;
                self.doPointerEnter(e);
                if (self._stopPropagation.enter)
                    e.stopPropagation();
            }
        });
        this._controlElement.addEventListener("pointerleave", function (e) {
            if (self.enabled) {
                self._isEnter = false;
                self.doPointerLeave(e);
                if (self._stopPropagation.leave)
                    e.stopPropagation();
            }
        });
        this._controlElement.addEventListener("wheel", function (e) {
            if (self.enabled)
                self.doWheel(e);
            if (self._stopPropagation.wheel)
                e.stopPropagation();
        });
        this.__pressedThisPoints.onChange = function () {
            if (self.enabled)
                self.doChangeThisPressedPoints();
        };
        this.__pressedBubblePoints.onChange = function () {
            if (self.enabled)
                self.doChangeBubblePressedPoints();
        };
    }
    static get CON_CHANGE_THIS_PRESSED_POINTS() { return "changeThisPressedPoints"; }
    static get CON_CHANGE_BUBBLE_PRESSED_POINTS() { return "changeButtlePressedPoints"; }
    static get CON_STOP_PROPAGATION_POINTER_DOWN() { return "stopPropagationPointerDown"; }
    static get CON_STOP_PROPAGATION_POINTER_MOVE() { return "stopPropagationPointerMove"; }
    static get CON_STOP_PROPAGATION_POINTER_UP() { return "stopPropagationPointerUp"; }
    static get CON_STOP_PROPAGATION_POINTER_CANCEL() { return "stopPropagationPointerCancel"; }
    static get CON_CHANGE_DRAG_ICON() { return "changeDragIcon"; }
    static get CON_CHANGE_DRAG_CATCH_ICON() { return "changeDragCatchIcon"; }
    static get CON_CHANGE_USE_HINT() { return "changeUseHint"; }
    static get CON_CHANGE_HINT() { return "changeHint"; }
    static get CON_CHANGE_HINT_RESOURCE() { return "changeHint"; }
    static get CON_CHANGE_USE_MOVE() { return "changeUseMove"; }
    static get CON_CHANGE_USE_RESIZE() { return "changeUseResize"; }
    static get CON_CHANGE_MOVE_AREA_LENGTH() { return "changeMoveAreaLength"; }
    static get CON_CHANGE_RESIZE_AREA_LENGTH() { return "changeResizeAreaLength"; }
    static get CON_CHANGE_USE_POINTER_CAPTURE() { return "changeUsePointerCapture"; }
    get magneticLength() {
        return this._magneticLength;
    }
    set magneticLength(value) {
        this._magneticLength = value;
    }
    get moveKind() {
        return this.__moveKind;
    }
    get thisPointerDownAnimatorResource() {
        return this._thisPointerDownAnimatorResource;
    }
    set thisPointerDownAnimatorResource(value) {
        this._thisPointerDownAnimatorResource = value;
        if (value != "")
            this.thisPointerDownAnimationTrigger = CAnimator.animatorFromResource(this, value);
    }
    get thisPointerUpAnimatorResource() {
        return this._thisPointerUpAnimatorResource;
    }
    set thisPointerUpAnimatorResource(value) {
        this._thisPointerUpAnimatorResource = value;
        if (value != "")
            this.thisPointerUpAnimationTrigger = CAnimator.animatorFromResource(this, value);
    }
    get overAnimatorResource() {
        return this._overAnimatorResource;
    }
    set overAnimatorResource(value) {
        this._overAnimatorResource = value;
        if (value != "")
            this.overAnimationTrigger = CAnimator.animatorFromResource(this, value);
    }
    get enterAnimatorResource() {
        return this._enterAnimatorResource;
    }
    set enterAnimatorResource(value) {
        this._enterAnimatorResource = value;
        if (value != "")
            this.enterAnimationTrigger = CAnimator.animatorFromResource(this, value);
    }
    get clickAnimatorResource() {
        return this._clickAnimatorResource;
    }
    set clickAnimatorResource(value) {
        this._clickAnimatorResource = value;
        if (value != "")
            this.clickAnimationTrigger = CAnimator.animatorFromResource(this, value);
    }
    get doubleClickAnimatorResource() {
        return this._doubleClickAnimatorResource;
    }
    set doubleClickAnimatorResource(value) {
        this._doubleClickAnimatorResource = value;
        if (value != "")
            this.doubleClickAnimationTrigger = CAnimator.animatorFromResource(this, value);
    }
    get dragStartAnimatorResource() {
        return this._dragStartAnimatorResource;
    }
    set dragStartAnimatorResource(value) {
        this._dragStartAnimatorResource = value;
        if (value != "")
            this.dragStartAnimationTrigger = CAnimator.animatorFromResource(this, value);
    }
    get dragCancelAnimatorResource() {
        return this._dragCancelAnimatorResource;
    }
    set dragCancelAnimatorResource(value) {
        this._dragCancelAnimatorResource = value;
        if (value != "")
            this.dragCancelAnimationTrigger = CAnimator.animatorFromResource(this, value);
    }
    get dragCatchAnimatorResource() {
        return this._dragCatchAnimatorResource;
    }
    set dragCatchAnimatorResource(value) {
        this._dragCatchAnimatorResource = value;
        if (value != "")
            this.dragCatchAnimationTrigger = CAnimator.animatorFromResource(this, value);
    }
    get keyDownAnimatorResource() {
        return this._keyDownAnimatorResource;
    }
    set keyDownAnimatorResource(value) {
        this._keyDownAnimatorResource = value;
        if (value != "")
            this.keyDownAnimationTrigger = CAnimator.animatorFromResource(this, value);
    }
    get pressedThisPoints() {
        return this.__pressedThisPoints;
    }
    get pressedBubblePoints() {
        return this.__pressedBubblePoints;
    }
    get repeatClickTime() {
        return this._repeatClickTime;
    }
    set repeatClickTime(value) {
        this._repeatClickTime = value;
    }
    get isEnter() {
        return this._isEnter;
    }
    get isOver() {
        return this._isOver;
    }
    get isDrag() {
        return CSystem.dragControls.has(this);
    }
    get isPress() {
        return this.__pressedThisPoints.length > 0;
    }
    get dragCatchControlNames() {
        return this._dragCatchControlNames;
    }
    get dragCatchControlPropertyNames() {
        return this._dragCatchControlPropertyNames;
    }
    get useDragAndDrop() {
        return this._useDragAndDrop;
    }
    set useDragAndDrop(value) {
        if (this._useDragAndDrop != value) {
            this._useDragAndDrop = value;
            this.doChange(CControl.CON_CHANGE_USE_DRAG);
        }
    }
    get useDragAndDropCancel() {
        return this._useDragAndDropCancel;
    }
    set useDragAndDropCancel(value) {
        if (this._useDragAndDropCancel != value) {
            this._useDragAndDropCancel = value;
            this.doChange("useDragAndDropCancel");
        }
    }
    get dragIconResource() {
        return this._dragIconResource;
    }
    set dragIconResource(value) {
        if (this._dragIconResource != value) {
            this._dragIconResource = value;
            this.doChange(CPointerEventControl.CON_CHANGE_DRAG_ICON);
        }
    }
    get hintResource() {
        return this._hintResource;
    }
    set hintResource(value) {
        if (this._hintResource != value) {
            this._hintResource = value;
            this.doChange(CPointerEventControl.CON_CHANGE_HINT_RESOURCE);
        }
    }
    get hint() {
        return this._hint;
    }
    set hint(value) {
        if (this._hint != value) {
            this._hint = value;
            this.doChange(CPointerEventControl.CON_CHANGE_HINT);
        }
    }
    get useHint() {
        return this._useHint;
    }
    set useHint(value) {
        if (this._useHint != value) {
            this._useHint = value;
            this.doChange(CPointerEventControl.CON_CHANGE_USE_HINT);
        }
    }
    get hintPosition() {
        return this._hintPosition;
    }
    set hintPosition(value) {
        this._hintPosition = value;
    }
    get hintFixOffset() {
        return this._hintFixOffset;
    }
    get useMove() {
        return this._useMove;
    }
    set useMove(value) {
        if (this._useMove != value) {
            this._useMove = value;
            this.doChange(CPointerEventControl.CON_CHANGE_USE_MOVE);
        }
    }
    get useResize() {
        return this._useResize;
    }
    set useResize(value) {
        if (this._useResize != value) {
            this._useResize = value;
            this.doChange(CPointerEventControl.CON_CHANGE_USE_RESIZE);
        }
    }
    get moveAreaLength() {
        return this._moveAreaLength;
    }
    set moveAreaLength(value) {
        if (this._moveAreaLength != value) {
            this._moveAreaLength = value;
            this.doChange(CPointerEventControl.CON_CHANGE_MOVE_AREA_LENGTH);
        }
    }
    get resizeAreaLength() {
        return this._resizeAreaLength;
    }
    set resizeAreaLength(value) {
        if (this._resizeAreaLength != value) {
            this._resizeAreaLength = value;
            this.doChange(CPointerEventControl.CON_CHANGE_RESIZE_AREA_LENGTH);
        }
    }
    get ignoreResizeKind() {
        return this._ignoreResizeKind;
    }
    get usePointerCapture() {
        return this._usePointerCapture;
    }
    set usePointerCapture(value) {
        if (this._usePointerCapture != value) {
            this._usePointerCapture = value;
            this.doChange(CPointerEventControl.CON_CHANGE_USE_POINTER_CAPTURE);
        }
    }
    get useFingerCursor() {
        return this._useFingerCursor;
    }
    set useFingerCursor(value) {
        if (this._useFingerCursor != value) {
            this._useFingerCursor = value;
        }
    }
    get fingerCursorLength() {
        return this._fingerCursorLength;
    }
    set fingerCursorLength(value) {
        if (this._fingerCursorLength != value) {
            this._fingerCursorLength = value;
        }
    }
    get fingerCursorResource() {
        return this._fingerCursorResource;
    }
    set fingerCursorResource(value) {
        if (this._fingerCursorResource != value) {
            this._fingerCursorResource = value;
        }
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "repeatClickTime", this.repeatClickTime, 300);
        CDataClass.putData(data, "useDragAndDrop", this.useDragAndDrop, false);
        CDataClass.putData(data, "useDragAndDropCancel", this.useDragAndDropCancel, false);
        CDataClass.putData(data, "dragCatchControlNames", this.dragCatchControlNames.toData(), [], true);
        CDataClass.putData(data, "dragCatchControlPropertyNames", this.dragCatchControlPropertyNames.toData(), [], true);
        CDataClass.putData(data, "dragIconResource", this.dragIconResource, "");
        CDataClass.putData(data, "hintResource", this.hintResource, "");
        CDataClass.putData(data, "hint", this.hint, "");
        CDataClass.putData(data, "useHint", this.useHint, false);
        CDataClass.putData(data, "hintPosition", this.hintPosition, "auto");
        CDataClass.putData(data, "hintFixOffset", this.hintFixOffset.toData(), {}, true);
        CDataClass.putData(data, "usePointerCapture", this.usePointerCapture, false);
        CDataClass.putData(data, "useMove", this.useMove, false);
        CDataClass.putData(data, "useResize", this.useResize, false);
        CDataClass.putData(data, "moveAreaLength", this.moveAreaLength, -1);
        CDataClass.putData(data, "resizeAreaLength", this.resizeAreaLength, 5);
        CDataClass.putData(data, "resizeMinWidth", this.resizeMinWidth, 50);
        CDataClass.putData(data, "resizeMinHeight", this.resizeMinHeight, 50);
        CDataClass.putData(data, "lockMoveX", this.lockMoveX, false);
        CDataClass.putData(data, "lockMoveY", this.lockMoveY, false);
        CDataClass.putData(data, "lockMaxX", this.lockMaxX, undefined);
        CDataClass.putData(data, "lockMinX", this.lockMinX, undefined);
        CDataClass.putData(data, "lockMaxY", this.lockMaxY, undefined);
        CDataClass.putData(data, "lockMinY", this.lockMinY, undefined);
        CDataClass.putData(data, "thisPointerDownAnimatorResource", this.thisPointerDownAnimatorResource, "");
        CDataClass.putData(data, "thisPointerUpAnimatorResource", this.thisPointerUpAnimatorResource, "");
        CDataClass.putData(data, "overAnimatorResource", this.overAnimatorResource, "");
        CDataClass.putData(data, "enterAnimatorResource", this.enterAnimatorResource, "");
        CDataClass.putData(data, "clickAnimatorResource", this.clickAnimatorResource, "");
        CDataClass.putData(data, "doubleClickAnimatorResource", this.doubleClickAnimatorResource, "");
        CDataClass.putData(data, "dragStartAnimatorResource", this.dragStartAnimatorResource, "");
        CDataClass.putData(data, "dragCancelAnimatorResource", this.dragCancelAnimatorResource, "");
        CDataClass.putData(data, "dragCatchAnimatorResource", this.dragCatchAnimatorResource, "");
        CDataClass.putData(data, "keyDownAnimatorResource", this.keyDownAnimatorResource, "");
        CDataClass.putData(data, "useMoveClick", this.useMoveClick, false);
        if (this.thisPointerDownAnimationTrigger != undefined)
            CDataClass.putData(data, "thisPointerDownAnimationTrigger", this.thisPointerDownAnimationTrigger.toData(), {}, true);
        if (this.thisPointerUpAnimationTrigger != undefined)
            CDataClass.putData(data, "thisPointerUpAnimationTrigger", this.thisPointerUpAnimationTrigger.toData(), {}, true);
        if (this.overAnimationTrigger != undefined)
            CDataClass.putData(data, "overAnimationTrigger", this.overAnimationTrigger.toData(), {}, true);
        if (this.enterAnimationTrigger != undefined)
            CDataClass.putData(data, "enterAnimationTrigger", this.enterAnimationTrigger.toData(), {}, true);
        if (this.clickAnimationTrigger != undefined)
            CDataClass.putData(data, "clickAnimationTrigger", this.clickAnimationTrigger.toData(), {}, true);
        if (this.doubleClickAnimationTrigger != undefined)
            CDataClass.putData(data, "doubleClickAnimationTrigger", this.doubleClickAnimationTrigger.toData(), {}, true);
        if (this.dragStartAnimationTrigger != undefined)
            CDataClass.putData(data, "dragStartAnimationTrigger", this.dragStartAnimationTrigger.toData(), {}, true);
        if (this.dragCancelAnimationTrigger != undefined)
            CDataClass.putData(data, "dragCancelAnimationTrigger", this.dragCancelAnimationTrigger.toData(), {}, true);
        if (this.dragCatchAnimationTrigger != undefined)
            CDataClass.putData(data, "dragCatchAnimationTrigger", this.dragCatchAnimationTrigger.toData(), {}, true);
        if (this.keyDownAnimationTrigger != undefined)
            CDataClass.putData(data, "keyDownAnimationTrigger", this.keyDownAnimationTrigger.toData(), {}, true);
    }
    doFromData(data) {
        super.doFromData(data);
        this.repeatClickTime = CDataClass.getData(data, "repeatClickTime", 300);
        this.useDragAndDrop = CDataClass.getData(data, "useDragAndDrop", false);
        this.useDragAndDropCancel = CDataClass.getData(data, "useDragAndDropCancel", false);
        this.dragCatchControlNames.fromData(CDataClass.getData(data, "dragCatchControlNames", [], true));
        this.dragCatchControlPropertyNames.fromData(CDataClass.getData(data, "dragCatchControlPropertyNames", [], true));
        this.dragIconResource = CDataClass.getData(data, "dragIconResource", "");
        this.hintResource = CDataClass.getData(data, "hintResource", "");
        this.hint = CDataClass.getData(data, "hint", "");
        this.useHint = CDataClass.getData(data, "useHint", false);
        this.hintPosition = CDataClass.getData(data, "hintPosition", "auto");
        this.hintFixOffset.fromData(CDataClass.getData(data, "hintFixOffset", {}, true));
        this.usePointerCapture = CDataClass.getData(data, "usePointerCapture", false);
        this.useMove = CDataClass.getData(data, "useMove", false);
        this.useResize = CDataClass.getData(data, "useResize", false);
        this.moveAreaLength = CDataClass.getData(data, "moveAreaLength", -1);
        this.resizeAreaLength = CDataClass.getData(data, "resizeAreaLength", 5);
        this.resizeMinWidth = CDataClass.getData(data, "resizeMinWidth", 50);
        this.resizeMinHeight = CDataClass.getData(data, "resizeMinHeight", 50);
        this.lockMoveX = CDataClass.getData(data, "lockMoveX", false);
        this.lockMoveY = CDataClass.getData(data, "lockMoveY", false);
        this.lockMaxX = CDataClass.getData(data, "lockMaxX", undefined);
        this.lockMinX = CDataClass.getData(data, "lockMinX", undefined);
        this.lockMaxY = CDataClass.getData(data, "lockMaxY", undefined);
        this.lockMinY = CDataClass.getData(data, "lockMinY", undefined);
        this.useMoveClick = CDataClass.getData(data, "useMoveClick", false);
        CAnimator.fromAnimatorData(data, this, "thisPointerDownAnimationTrigger");
        CAnimator.fromAnimatorData(data, this, "thisPointerUpAnimationTrigger");
        CAnimator.fromAnimatorData(data, this, "overAnimationTrigger");
        CAnimator.fromAnimatorData(data, this, "enterAnimationTrigger");
        CAnimator.fromAnimatorData(data, this, "clickAnimationTrigger");
        CAnimator.fromAnimatorData(data, this, "doubleClickAnimationTrigger");
        CAnimator.fromAnimatorData(data, this, "dragStartAnimationTrigger");
        CAnimator.fromAnimatorData(data, this, "dragCancelAnimationTrigger");
        CAnimator.fromAnimatorData(data, this, "dragCatchAnimationTrigger");
        CAnimator.fromAnimatorData(data, this, "keyDownAnimationTrigger");
        this.thisPointerDownAnimatorResource = CDataClass.getData(data, "thisPointerDownAnimatorResource", "");
        this.thisPointerUpAnimatorResource = CDataClass.getData(data, "thisPointerUpAnimatorResource", "");
        this.overAnimatorResource = CDataClass.getData(data, "overAnimatorResource", "");
        this.enterAnimatorResource = CDataClass.getData(data, "enterAnimatorResource", "");
        this.clickAnimatorResource = CDataClass.getData(data, "clickAnimatorResource", "");
        this.doubleClickAnimatorResource = CDataClass.getData(data, "doubleClickAnimatorResource", "");
        this.dragStartAnimatorResource = CDataClass.getData(data, "dragStartAnimatorResource", "");
        this.dragCancelAnimatorResource = CDataClass.getData(data, "dragCancelAnimatorResource", "");
        this.dragCatchAnimatorResource = CDataClass.getData(data, "dragCatchAnimatorResource", "");
        this.keyDownAnimatorResource = CDataClass.getData(data, "keyDownAnimatorResource", "");
    }
    doRemove() {
        if (this.thisPointerDownAnimationTrigger != undefined)
            this.thisPointerDownAnimationTrigger.remove();
        this.thisPointerDownAnimationTrigger = undefined;
        if (this.thisPointerUpAnimationTrigger != undefined)
            this.thisPointerUpAnimationTrigger.remove();
        this.thisPointerUpAnimationTrigger = undefined;
        if (this.overAnimationTrigger != undefined)
            this.overAnimationTrigger.remove();
        this.overAnimationTrigger = undefined;
        if (this.enterAnimationTrigger != undefined)
            this.enterAnimationTrigger.remove();
        this.enterAnimationTrigger = undefined;
        if (this.clickAnimationTrigger != undefined)
            this.clickAnimationTrigger.remove();
        this.clickAnimationTrigger = undefined;
        if (this.doubleClickAnimationTrigger != undefined)
            this.doubleClickAnimationTrigger.remove();
        this.doubleClickAnimationTrigger = undefined;
        if (this.dragStartAnimationTrigger != undefined)
            this.dragStartAnimationTrigger.remove();
        this.dragStartAnimationTrigger = undefined;
        if (this.dragCatchAnimationTrigger != undefined)
            this.dragCatchAnimationTrigger.remove();
        this.dragCatchAnimationTrigger = undefined;
        if (this.keyDownAnimationTrigger != undefined)
            this.keyDownAnimationTrigger.remove();
        this.keyDownAnimationTrigger = undefined;
        super.doRemove();
    }
    doChange(kind, data) {
        super.doChange(kind, data);
        if (kind == CPointerEventControl.CON_CHANGE_THIS_PRESSED_POINTS) {
            this.doChangeThisPressedPoints();
        }
        if (kind == CPointerEventControl.CON_CHANGE_BUBBLE_PRESSED_POINTS) {
            this.doChangeBubblePressedPoints();
        }
        if (kind == CPointerEventControl.CON_CHANGE_USE_POINTER_CAPTURE) {
            this.doSetTouchAction();
        }
        if (kind == CPointerEventControl.CON_CHANGE_USE_MOVE) {
            this.doSetTouchAction();
        }
        if (kind == CPointerEventControl.CON_CHANGE_USE_RESIZE) {
            this.doSetTouchAction();
        }
        if (kind == CPointerEventControl.CON_CHANGE_USE_DRAG) {
            this.doSetTouchAction();
        }
    }
    doSetTouchAction() {
        if (this._usePointerCapture || this._useDragAndDrop || this._useMove || this._useResize) {
            this.controlElement.style.touchAction = "none";
        }
        else {
            this.controlElement.style.touchAction = "auto";
        }
    }
    doChangeThisPressedPoints() {
        if (this.onThisPressedPointsChange != undefined) {
            this.onThisPressedPointsChange(this, this.pressedThisPoints);
        }
    }
    doChangeBubblePressedPoints() {
        if (this.onBubblePressedPointsChange != undefined) {
            this.onBubblePressedPointsChange(this, this.pressedBubblePoints);
        }
    }
    doKeyDown(e) {
        if (this.keyDownAnimationTrigger instanceof CAnimator) {
            this.keyDownAnimationTrigger.start();
        }
        if (this.keyDownAnimationTrigger instanceof CGraphAnimationInfo) {
            this.keyDownAnimationTrigger.startAnimation();
        }
        if (this.onKeyDown != undefined) {
            this.onKeyDown(this, e);
        }
    }
    doKeyPress(e) {
        if (this.onKeyPress != undefined) {
            this.onKeyPress(this, e);
        }
    }
    doKeyUp(e) {
        if (this.onKeyUp != undefined) {
            this.onKeyUp(this, e);
        }
    }
    doPointerDown(e) {
        if (e.target == this.controlElement) {
            this.__pressedThisPoints.add({ downTime: new Date().getTime(), point: e });
            if (this.isMove(e))
                this.bringToFront();
            if (this.controlElement.style.touchAction == "none")
                this.controlElement.setPointerCapture(e.pointerId);
            this.doThisPointerDown(e, this.__pressedThisPoints);
        }
        else {
            let con = CSystem.getControl(e.target);
            if (con != undefined) {
                this.__pressedBubblePoints.add({ downTime: new Date().getTime(), target: con, point: e });
                this.doBubblePointerDown(con, e, this.__pressedBubblePoints);
            }
        }
        if (this.onPointerDown != undefined) {
            this.onPointerDown(this, e);
        }
    }
    doPointerMove(e) {
        if (e.target == this._controlElement) {
            this.doThisPointerMove(e, this.__pressedThisPoints);
        }
        else {
            let con = CSystem.getControl(e.target);
            if (con != undefined) {
                this.doBubblePointerMove(con, e, this.__pressedBubblePoints);
            }
        }
        if (this.onPointerMove != undefined) {
            this.onPointerMove(this, e);
        }
    }
    doPointerUp(e) {
        if (e.target == this.controlElement) {
            for (let n = this.__pressedThisPoints.length - 1; n >= 0; n--) {
                if (this.__pressedThisPoints.get(n).point.pointerId == e.pointerId) {
                    this.__pressedThisPoints.delete(n);
                }
            }
            if (this.controlElement.style.touchAction == "none")
                this._controlElement.releasePointerCapture(e.pointerId);
            this.doThisPointerUp(e, this.__pressedThisPoints);
        }
        else {
            for (let n = this.__pressedBubblePoints.length - 1; n >= 0; n--) {
                if (this.__pressedBubblePoints.get(n).point.pointerId == e.pointerId) {
                    this.__pressedBubblePoints.delete(n);
                }
            }
            let con = CSystem.getControl(e.target);
            if (con != undefined) {
                this.doBubblePointerUp(con, e, this.__pressedBubblePoints);
            }
        }
        this.__moveKind = EControlMoveKind.NONE;
        if (this.onPointerUp != undefined) {
            this.onPointerUp(this, e);
        }
    }
    doPointerCancel(e) {
        if (e.target == this._controlElement) {
            for (let n = this.__pressedThisPoints.length - 1; n >= 0; n--) {
                if (this.__pressedThisPoints.get(n).point.pointerId == e.pointerId) {
                    this.__pressedThisPoints.delete(n);
                }
            }
            this.doThisPointerCancel(e, this.__pressedThisPoints);
        }
        else {
            for (let n = this.__pressedBubblePoints.length - 1; n >= 0; n--) {
                if (this.__pressedBubblePoints.get(n).point.pointerId == e.pointerId) {
                    this.__pressedBubblePoints.delete(n);
                }
            }
            let con = CSystem.getControl(e.target);
            if (con != undefined) {
                this.doBubblePointerCancel(con, e, this.__pressedBubblePoints);
            }
        }
        this.__moveKind = EControlMoveKind.NONE;
        if (this.onPointerCancel != undefined) {
            this.onPointerCancel(this, e);
        }
    }
    doPointerEnter(e) {
        this._isEnter = true;
        if (this.enterAnimationTrigger != undefined)
            this.triggerTrue(this.enterAnimationTrigger);
        if (e.target == this.controlElement) {
            this.doThisPointerEnter(e, this.__pressedThisPoints);
        }
        else {
            let con = CSystem.getControl(e.target);
            if (con != undefined) {
                this.doBubblePointerEnter(con, e, this.__pressedBubblePoints);
            }
        }
        if (this.onPointerEnter != undefined) {
            this.onPointerEnter(this, e);
        }
    }
    doPointerLeave(e) {
        this._isEnter = false;
        if (this.enterAnimationTrigger != undefined)
            this.triggerFalse(this.enterAnimationTrigger);
        if (e.target == this.controlElement) {
            if (!this.usePointerCapture) {
                for (let n = this.__pressedThisPoints.length - 1; n >= 0; n--) {
                    if (this.__pressedThisPoints.get(n).point.pointerId == e.pointerId) {
                        this.__pressedThisPoints.delete(n);
                    }
                }
            }
            this.doThisPointerLeave(e, this.__pressedThisPoints);
        }
        else {
            if (!this.usePointerCapture) {
                for (let n = this.__pressedBubblePoints.length - 1; n >= 0; n--) {
                    if (this.__pressedBubblePoints.get(n).point.pointerId == e.pointerId) {
                        this.__pressedBubblePoints.delete(n);
                    }
                }
            }
            let con = CSystem.getControl(e.target);
            if (con != undefined) {
                this.doBubblePointerLeave(con, e, this.__pressedBubblePoints);
            }
        }
        if (this.onPointerLeave != undefined) {
            this.onPointerLeave(this, e);
        }
    }
    doPointerOver(e) {
        this._isOver = true;
        if (this.overAnimationTrigger != undefined)
            this.triggerTrue(this.overAnimationTrigger);
        if (e.target == this.controlElement) {
            this.doThisPointerOver(e, this.__pressedThisPoints);
        }
        else {
            let con = CSystem.getControl(e.target);
            if (con != undefined) {
                this.doBubblePointerOver(con, e, this.__pressedBubblePoints);
            }
        }
        if (this.onPointerOver != undefined) {
            this.onPointerOver(this, e);
        }
    }
    doPointerOut(e) {
        this._isOver = false;
        if (this.overAnimationTrigger != undefined)
            this.triggerFalse(this.overAnimationTrigger);
        if (e.target == this.controlElement) {
            if (!this.usePointerCapture) {
                for (let n = this.__pressedThisPoints.length - 1; n >= 0; n--) {
                    if (this.__pressedThisPoints.get(n).point.pointerId == e.pointerId) {
                        this.__pressedThisPoints.delete(n);
                    }
                }
            }
            this.doThisPointerOut(e, this.__pressedThisPoints);
        }
        else {
            if (!this.usePointerCapture) {
                for (let n = this.__pressedBubblePoints.length - 1; n >= 0; n--) {
                    if (this.__pressedBubblePoints.get(n).point.pointerId == e.pointerId) {
                        this.__pressedBubblePoints.delete(n);
                    }
                }
            }
            let con = CSystem.getControl(e.target);
            if (con != undefined) {
                this.doBubblePointerOut(con, e, this.__pressedBubblePoints);
            }
        }
        if (this.onPointerOut != undefined) {
            this.onPointerOut(this, e);
        }
    }
    doWheel(e) {
        if (e.target == this.controlElement) {
            this.doThisWheel(e);
        }
        else {
            let con = CSystem.getControl(e.target);
            if (con != undefined) {
                this.doBubbleWheel(con, e);
            }
        }
        if (this.onWheel != undefined) {
            this.onWheel(this, e);
        }
    }
    isResize(e) {
        if (this.useResize) {
            if (e.offsetX <= this.resizeAreaLength &&
                e.offsetY <= this.resizeAreaLength &&
                !this._ignoreResizeKind.has(EControlMoveKind.RESIZE_LT)) {
                return { result: true, kind: EControlMoveKind.RESIZE_LT };
            }
            else if (e.offsetX > this.position.width - this.resizeAreaLength &&
                e.offsetY <= this.resizeAreaLength &&
                !this._ignoreResizeKind.has(EControlMoveKind.RESIZE_RT)) {
                return { result: true, kind: EControlMoveKind.RESIZE_RT };
            }
            else if (e.offsetX <= this.resizeAreaLength &&
                e.offsetY > this.position.height - this.resizeAreaLength &&
                !this._ignoreResizeKind.has(EControlMoveKind.RESIZE_LB)) {
                return { result: true, kind: EControlMoveKind.RESIZE_LB };
            }
            else if (e.offsetX > this.position.width - this.resizeAreaLength &&
                e.offsetY > this.position.height - this.resizeAreaLength &&
                !this._ignoreResizeKind.has(EControlMoveKind.RESIZE_RB)) {
                return { result: true, kind: EControlMoveKind.RESIZE_RB };
            }
            else if (e.offsetX <= this.resizeAreaLength &&
                !this._ignoreResizeKind.has(EControlMoveKind.RESIZE_L)) {
                return { result: true, kind: EControlMoveKind.RESIZE_L };
            }
            else if (e.offsetY <= this.resizeAreaLength &&
                !this._ignoreResizeKind.has(EControlMoveKind.RESIZE_T)) {
                return { result: true, kind: EControlMoveKind.RESIZE_T };
            }
            else if (e.offsetX > this.position.width - this.resizeAreaLength &&
                !this._ignoreResizeKind.has(EControlMoveKind.RESIZE_R)) {
                return { result: true, kind: EControlMoveKind.RESIZE_R };
            }
            else if (e.offsetY > this.position.height - this.resizeAreaLength &&
                !this._ignoreResizeKind.has(EControlMoveKind.RESIZE_B)) {
                return { result: true, kind: EControlMoveKind.RESIZE_B };
            }
            else {
                return { result: false, kind: EControlMoveKind.NONE };
            }
        }
        else {
            return { result: false, kind: EControlMoveKind.NONE };
        }
    }
    isMove(e) {
        if (this.useMove) {
            if (this.useResize) {
                if (this.moveAreaLength >= 0) {
                    if (e.offsetX > this.resizeAreaLength &&
                        e.offsetX <= this.position.width - this.resizeAreaLength &&
                        e.offsetY > this.resizeAreaLength &&
                        e.offsetY <= this.resizeAreaLength + this.moveAreaLength) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    if (e.offsetX > this.resizeAreaLength &&
                        e.offsetX <= this.position.width - this.resizeAreaLength &&
                        e.offsetY > this.resizeAreaLength &&
                        e.offsetY <= this.position.height - this.resizeAreaLength) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            }
            else {
                if (this.moveAreaLength >= 0) {
                    if (this.moveAreaLength >= e.offsetY && this.position.align == EPositionAlign.NONE) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    return true;
                }
            }
        }
        else {
            return false;
        }
    }
    setDown(e) {
        this.__moveResizeDown.offsetx = e.offsetX;
        this.__moveResizeDown.offsety = e.offsetY;
        this.__moveResizeDown.pagex = e.pageX;
        this.__moveResizeDown.pagey = e.pageY;
        this.__moveResizeDown.left = this.position.left;
        this.__moveResizeDown.top = this.position.top;
        this.__moveResizeDown.width = this.position.width;
        this.__moveResizeDown.height = this.position.height;
    }
    doThisPointerDown(e, points) {
        if (this.thisPointerDownAnimationTrigger != undefined)
            this.thisPointerDownAnimationTrigger.start();
        if (this.pressedThisPoints.length > this.__maxCount)
            this.__maxCount = this.pressedThisPoints.length;
        this.__pressedThisDown = true;
        this.__thisDownPoint = new CPoint(e.offsetX, e.offsetY);
        /*if(e.pointerType == "mouse" && e.altKey && e.ctrlKey && this._useFingerCursor) {
            if(this._fingerCursors.length == 0) {
                this.doShowFingerCursor()
            } else {
                this.doHideFingerCursor()
            }
        }*/
        let re = this.isResize(e);
        if (re.result) {
            this.__moveKind = re.kind;
            this.setDown(e);
        }
        else if (this.isMove(e)) {
            this.__moveKind = EControlMoveKind.MOVE;
            this.setDown(e);
            this.__preMovePoint = new CPoint(this.position.left, this.position.top);
            this.__downMovePoint = new CPoint(this.position.left, this.position.top);
        }
        else {
            this.__moveKind = EControlMoveKind.NONE;
            this.setDown(e);
        }
        //drag
        /*if(this.useDragAndDrop && !CSystem.dragControls.has(this)) {
            this.__
            CSystem.dragControls.add(this)
            this.doDragStart(e)
        }*/
        if (this.onThisPointerDown != undefined) {
            this.onThisPointerDown(this, e, points);
        }
    }
    doThisPointerMove(e, points) {
        if (this.thisPointerUpAnimationTrigger != undefined)
            this.thisPointerUpAnimationTrigger.start();
        if (this.__moveKind == EControlMoveKind.MOVE) {
            this.doMove(e);
            this.__preMovePoint = new CPoint(this.position.left, this.position.top);
        }
        if (this.__moveKind == EControlMoveKind.RESIZE_L ||
            this.__moveKind == EControlMoveKind.RESIZE_T ||
            this.__moveKind == EControlMoveKind.RESIZE_R ||
            this.__moveKind == EControlMoveKind.RESIZE_B ||
            this.__moveKind == EControlMoveKind.RESIZE_LT ||
            this.__moveKind == EControlMoveKind.RESIZE_LB ||
            this.__moveKind == EControlMoveKind.RESIZE_RT ||
            this.__moveKind == EControlMoveKind.RESIZE_RB) {
            this.doResize(e, e.pageX, e.pageY, this.__moveKind);
        }
        //drag start
        if (this.useDragAndDrop && !CSystem.dragControls.has(this) && this.__pressedThisDown) {
            if (CPoint.getDistancePoints(this.__thisDownPoint, new CPoint(e.offsetX, e.offsetY)) > 5) {
                CSystem.dragControls.add(this);
                this.__dragId = e.pointerId;
                this.doDragStart(e);
            }
        }
        //drag
        if (CSystem.dragControls.has(this) && this.__dragId == e.pointerId && this.__pressedThisDown) {
            let ar = CSystem.getOverControls(e, points);
            let arr = new Array();
            for (let n = 0; n < ar.length; n++) {
                if (this != ar[n].control && ar[n].control instanceof CPointerEventControl) {
                    let con = ar[n].control;
                    if (this.dragCatchControlNames.has(con.name) || this.dragCatchControlPropertyNames.has(con.propertyName)) {
                        arr.push(con);
                    }
                }
            }
            this.doDragging(arr, e);
        }
        //hint
        if (this.useHint && this.__hint != undefined) {
            this.doMoveHint(e);
        }
        if (this.onThisPointerMove != undefined) {
            this.onThisPointerMove(this, e, points);
        }
    }
    doThisPointerUp(e, points) {
        //drop
        if (this.useDragAndDrop && points.length == 0 && CSystem.dragControls.has(this)) {
            CSystem.dragControls.delete(this);
            let ar = CSystem.getOverControls(e, points);
            let arr = new Array();
            for (let n = 0; n < ar.length; n++) {
                if (this != ar[n].control && ar[n].control instanceof CPointerEventControl) {
                    let con = ar[n].control;
                    if (this.dragCatchControlNames.has(con.name) || this.dragCatchControlPropertyNames.has(con.propertyName)) {
                        arr.push(con);
                        con.doDropCatch(this, ar[n].x, ar[n].y, this.dragData);
                    }
                }
            }
            if (this.useDragAndDropCancel && arr.length == 0) {
                this.doDragCancel();
            }
            else {
                this.doDrop(arr, e);
            }
            this.__dragId = undefined;
        }
        let isClick = this.useMoveClick &&
            this.__moveKind == EControlMoveKind.MOVE &&
            Math.abs(this.__downMovePoint.x - this.position.left) < 5 &&
            Math.abs(this.__downMovePoint.y - this.position.top) < 5;
        //click
        if (this.__moveKind == EControlMoveKind.NONE || isClick) {
            if (e.offsetX <= this.position.width && e.offsetX >= 0 && e.offsetY <= this.position.height && e.offsetY >= 0 && this.__pressedThisDown) {
                if (e.pointerType == "mouse") {
                    if (e.button == 0) {
                        this.doClick(e);
                    }
                }
                else {
                    this.doClick(e);
                }
            }
            //multiTouchClick
            if (this.__pressedThisPoints.length == 0 && this.__maxCount > 1) {
                this.doMultiTouchClick(this.__maxCount);
                this.__maxCount = 0;
            }
            if (this.onThisPointerUp != undefined) {
                this.onThisPointerUp(this, e, points);
            }
        }
        this.__pressedThisDown = false;
    }
    doThisPointerCancel(e, points) {
        //multiTouchClick
        if (this.__pressedThisPoints.length == 0 && this.__maxCount > 1) {
            this.doMultiTouchClick(this.__maxCount);
            this.__maxCount = 0;
        }
        if (this.onThisPointerCancel != undefined) {
            this.onThisPointerCancel(this, e, points);
        }
    }
    doThisPointerEnter(e, points) {
        if (this.onThisPointerEnter != undefined) {
            this.onThisPointerEnter(this, e, points);
        }
    }
    doThisPointerLeave(e, points) {
        if (this.onThisPointerLeave != undefined) {
            this.onThisPointerLeave(this, e, points);
        }
    }
    doThisPointerOver(e, points) {
        if (this.useHint && e.pointerType == "mouse") {
            this.doShowHint();
        }
        if (this.onThisPointerOver != undefined) {
            this.onThisPointerOver(this, e, points);
        }
    }
    doThisPointerOut(e, points) {
        if (this.useHint && e.pointerType == "mouse") {
            this.doHideHint();
        }
        if (this.onThisPointerOut != undefined) {
            this.onThisPointerOut(this, e, points);
        }
    }
    doThisWheel(e) {
        if (this.onThisWheel != undefined) {
            this.onThisWheel(this, e);
        }
    }
    doBubblePointerDown(target, e, points) {
        if (this.onBubblePointerDown != undefined) {
            this.onBubblePointerDown(this, target, e, points);
        }
    }
    doBubblePointerMove(target, e, points) {
        if (this.onBubblePointerMove != undefined) {
            this.onBubblePointerMove(this, target, e, points);
        }
    }
    doBubblePointerUp(target, e, points) {
        if (e.offsetX <= target.position.width && e.offsetY <= target.position.height && e.offsetX >= 0 && e.offsetY >= 0) {
            this.doBubbleClick(e);
        }
        if (this.onBubblePointerUp != undefined) {
            this.onBubblePointerUp(this, target, e, points);
        }
    }
    doBubblePointerCancel(target, e, points) {
        if (this.onBubblePointerCancel != undefined) {
            this.onBubblePointerCancel(this, target, e, points);
        }
    }
    doBubblePointerEnter(target, e, points) {
        if (this.onBubblePointerEnter != undefined) {
            this.onBubblePointerEnter(this, target, e, points);
        }
    }
    doBubblePointerLeave(target, e, points) {
        if (this.onBubblePointerLeave != undefined) {
            this.onBubblePointerLeave(this, target, e, points);
        }
    }
    doBubblePointerOver(target, e, points) {
        if (this.onBubblePointerOver != undefined) {
            this.onBubblePointerOver(this, target, e, points);
        }
    }
    doBubblePointerOut(target, e, points) {
        if (this.onBubblePointerOut != undefined) {
            this.onBubblePointerOut(this, target, e, points);
        }
    }
    doBubbleWheel(target, e) {
        if (this.onBubbleWheel != undefined) {
            this.onBubbleWheel(this, target, e);
        }
    }
    doClick(e) {
        if (this.clickAnimationTrigger != undefined) {
            this.clickAnimationTrigger.start();
        }
        let now = CTime.now;
        if (now - this.__preClick.time < this._repeatClickTime) {
            this.__preClick.count++;
        }
        else {
            this.__preClick.count = 1;
        }
        this.__preClick.time = now;
        if (this.onClick != undefined) {
            this.onClick(this, e);
        }
        if (this.__preClick.count > 1) {
            this.doRepeatClick(this.__preClick.count, e);
        }
    }
    doBubbleClick(e) {
        if (this.onBubbleClick != undefined) {
            this.onBubbleClick(this, e);
        }
    }
    doDoubleClick(e) {
        if (this.doubleClickAnimationTrigger != undefined)
            this.doubleClickAnimationTrigger.start();
        if (this.onDoubleClick != undefined) {
            this.onDoubleClick(this, e);
        }
    }
    doPenDraw(e) {
    }
    doRepeatClick(clickCount, e) {
        if (this.onRepeatClick != undefined) {
            this.onRepeatClick(this, clickCount, e);
        }
        if (clickCount == 2) {
            this.doDoubleClick(e);
        }
    }
    doMultiTouchClick(touchCount) {
        if (touchCount == 3 && this._useFingerCursor) {
            if (this._fingerCursors.length == 0) {
                this.doShowFingerCursor();
            }
            else {
                this.doHideFingerCursor();
            }
        }
        if (this.onMultiTouchClick != undefined) {
            this.onMultiTouchClick(this, touchCount);
        }
    }
    doDragStart(e) {
        if (this.dragIconResource != "") {
            this.__dragIcon = CControl.controlFromResource(this.dragIconResource, document.body);
            this.__dragIcon.hasPointerEvent = false;
            this.__dragIcon.position.left = e.pageX - (this.__dragIcon.position.width / 2);
            this.__dragIcon.position.top = e.pageY - (this.__dragIcon.position.height / 2);
            this.__dragIcon.dragStartPosition.x = this.__dragIcon.position.left;
            this.__dragIcon.dragStartPosition.y = this.__dragIcon.position.top;
        }
        if (this.dragStartAnimationTrigger != undefined)
            this.dragStartAnimationTrigger.start();
        if (this.onDragStart != undefined)
            this.onDragStart(this, e);
    }
    doDragging(catchControls, e) {
        if (this.__dragIcon != undefined) {
            this.__dragIcon.isOverCatchControl = catchControls.length > 0;
            this.__dragIcon.position.left = e.pageX - (this.__dragIcon.position.width / 2);
            this.__dragIcon.position.top = e.pageY - (this.__dragIcon.position.height / 2);
        }
        if (this.onDragging != undefined)
            this.onDragging(this, e);
    }
    doDrop(catchControls, e) {
        this.dragData = undefined;
        if (this.__dragIcon != undefined) {
            this.__dragIcon.doDrop();
        }
        if (this.onDrop != undefined)
            this.onDrop(this, catchControls, e);
    }
    doDragCancel() {
        if (this.dragCancelAnimationTrigger != undefined)
            this.dragCancelAnimationTrigger.start();
        this.dragData = undefined;
        if (this.__dragIcon != undefined) {
            this.__dragIcon.doCancel();
        }
        if (this.onDragCancel != undefined) {
            this.onDragCancel(this);
        }
    }
    doDropCatch(dragControl, x, y, data) {
        if (this.dragCatchAnimationTrigger != undefined)
            this.dragCatchAnimationTrigger.start();
        if (this.onDropCatch != undefined)
            this.onDropCatch(this, dragControl, x, y, data);
    }
    doShowHint() {
        this.__hint = CControl.controlFromResource(this.hintResource, document.body);
        this.__hint.showHint(this.hint);
    }
    doHideHint() {
        if (this.__hint != undefined) {
            this.__hint.hideHint();
            this.__hint = undefined;
        }
    }
    doMoveHint(e) {
        if (this.__hint != undefined) {
            if (this.hintPosition == "auto") {
                this.__hint.position.left = e.pageX;
                this.__hint.position.top = e.pageY + 20;
            }
            else {
                this.__hint.position.left = this.hintFixOffset.x;
                this.__hint.position.top = this.hintFixOffset.y;
            }
        }
    }
    doBeforeMove(e, x, y) {
        let rt = new CPoint(x, y);
        if (this.magneticLength != 0) {
            rt.x = Math.floor(rt.x / this.magneticLength) * this.magneticLength;
            rt.y = Math.floor(rt.y / this.magneticLength) * this.magneticLength;
        }
        else if (e.shiftKey) {
            rt.x = Math.floor(rt.x / 5) * 5;
            rt.y = Math.floor(rt.y / 5) * 5;
        }
        return rt;
    }
    doMove(e) {
        let x = this.position.left;
        let y = this.position.top;
        if (!this.lockMoveX) {
            x = this.__moveResizeDown.left + (e.pageX - this.__moveResizeDown.pagex);
            if (this.lockMinX != undefined && this.lockMinX > x)
                x = this.lockMinX;
            if (this.lockMaxX != undefined && this.lockMaxX < x)
                x = this.lockMaxX;
        }
        if (!this.lockMoveY) {
            y = this.__moveResizeDown.top + (e.pageY - this.__moveResizeDown.pagey);
            if (this.lockMinY != undefined && this.lockMinY > y)
                y = this.lockMinY;
            if (this.lockMaxY != undefined && this.lockMaxY < y)
                y = this.lockMaxY;
        }
        let pt = this.doBeforeMove(e, x, y);
        this.position.left = pt.x;
        this.position.top = pt.y;
        if (this.onMove != undefined) {
            this.onMove(this, e);
        }
    }
    doResize(e, pageX, pageY, moveKind) {
        if (moveKind == EControlMoveKind.RESIZE_L) {
            let w = this.__moveResizeDown.width - (pageX - this.__moveResizeDown.pagex);
            if (w >= this.resizeMinWidth) {
                this.position.left = this.__moveResizeDown.left + (pageX - this.__moveResizeDown.pagex);
                this.position.width = this.__moveResizeDown.width - (pageX - this.__moveResizeDown.pagex);
            }
            else {
                this.position.left = this.__moveResizeDown.left + (this.__moveResizeDown.width - this.resizeMinWidth);
                this.position.width = this.resizeMinWidth;
            }
        }
        if (moveKind == EControlMoveKind.RESIZE_T) {
            let h = this.__moveResizeDown.height - (pageY - this.__moveResizeDown.pagey);
            if (h >= this.resizeMinHeight) {
                this.position.top = this.__moveResizeDown.top + (pageY - this.__moveResizeDown.pagey);
                this.position.height = this.__moveResizeDown.height - (pageY - this.__moveResizeDown.pagey);
            }
            else {
                this.position.top = this.__moveResizeDown.top + (this.__moveResizeDown.height - this.resizeMinHeight);
                this.position.height = this.resizeMinHeight;
            }
        }
        if (moveKind == EControlMoveKind.RESIZE_R) {
            if (this.__moveResizeDown.width + (pageX - this.__moveResizeDown.pagex) >= this.resizeMinWidth) {
                this.position.width = this.__moveResizeDown.width + (pageX - this.__moveResizeDown.pagex);
            }
            else {
                this.position.width = this.resizeMinWidth;
            }
        }
        if (moveKind == EControlMoveKind.RESIZE_B) {
            if (this.__moveResizeDown.height + (pageY - this.__moveResizeDown.pagey) >= this.resizeMinHeight) {
                this.position.height = this.__moveResizeDown.height + (pageY - this.__moveResizeDown.pagey);
            }
            else {
                this.position.height = this.resizeMinHeight;
            }
        }
        if (moveKind == EControlMoveKind.RESIZE_LT) {
            let w = this.__moveResizeDown.width - (pageX - this.__moveResizeDown.pagex);
            if (w >= this.resizeMinWidth) {
                this.position.left = this.__moveResizeDown.left + (pageX - this.__moveResizeDown.pagex);
                this.position.width = this.__moveResizeDown.width - (pageX - this.__moveResizeDown.pagex);
            }
            else {
                this.position.left = this.__moveResizeDown.left + (this.__moveResizeDown.width - this.resizeMinWidth);
                this.position.width = this.resizeMinWidth;
            }
            let h = this.__moveResizeDown.height - (pageY - this.__moveResizeDown.pagey);
            if (h >= this.resizeMinHeight) {
                this.position.top = this.__moveResizeDown.top + (pageY - this.__moveResizeDown.pagey);
                this.position.height = this.__moveResizeDown.height - (pageY - this.__moveResizeDown.pagey);
            }
            else {
                this.position.top = this.__moveResizeDown.top + (this.__moveResizeDown.height - this.resizeMinHeight);
                this.position.height = this.resizeMinHeight;
            }
        }
        if (moveKind == EControlMoveKind.RESIZE_RT) {
            if (this.__moveResizeDown.width + (pageX - this.__moveResizeDown.pagex) >= this.resizeMinWidth) {
                this.position.width = this.__moveResizeDown.width + (pageX - this.__moveResizeDown.pagex);
            }
            else {
                this.position.width = this.resizeMinWidth;
            }
            let h = this.__moveResizeDown.height - (pageY - this.__moveResizeDown.pagey);
            if (h >= this.resizeMinHeight) {
                this.position.top = this.__moveResizeDown.top + (pageY - this.__moveResizeDown.pagey);
                this.position.height = this.__moveResizeDown.height - (pageY - this.__moveResizeDown.pagey);
            }
            else {
                this.position.top = this.__moveResizeDown.top + (this.__moveResizeDown.height - this.resizeMinHeight);
                this.position.height = this.resizeMinHeight;
            }
        }
        if (moveKind == EControlMoveKind.RESIZE_LB) {
            let w = this.__moveResizeDown.width - (pageX - this.__moveResizeDown.pagex);
            if (w >= this.resizeMinWidth) {
                this.position.left = this.__moveResizeDown.left + (pageX - this.__moveResizeDown.pagex);
                this.position.width = this.__moveResizeDown.width - (pageX - this.__moveResizeDown.pagex);
            }
            else {
                this.position.left = this.__moveResizeDown.left + (this.__moveResizeDown.width - this.resizeMinWidth);
                this.position.width = this.resizeMinWidth;
            }
            if (this.__moveResizeDown.height + (pageY - this.__moveResizeDown.pagey) >= this.resizeMinHeight) {
                this.position.height = this.__moveResizeDown.height + (pageY - this.__moveResizeDown.pagey);
            }
            else {
                this.position.height = this.resizeMinHeight;
            }
        }
        if (moveKind == EControlMoveKind.RESIZE_RB) {
            if (this.__moveResizeDown.width + (pageX - this.__moveResizeDown.pagex) >= this.resizeMinWidth) {
                this.position.width = this.__moveResizeDown.width + (pageX - this.__moveResizeDown.pagex);
            }
            else {
                this.position.width = this.resizeMinWidth;
            }
            if (this.__moveResizeDown.height + (pageY - this.__moveResizeDown.pagey) >= this.resizeMinHeight) {
                this.position.height = this.__moveResizeDown.height + (pageY - this.__moveResizeDown.pagey);
            }
            else {
                this.position.height = this.resizeMinHeight;
            }
        }
        if (this.magneticLength != 0) {
            this.position.left = Math.floor(this.position.left / this.magneticLength) * this.magneticLength;
            this.position.top = Math.floor(this.position.top / this.magneticLength) * this.magneticLength;
            this.position.width = Math.floor(this.position.width / this.magneticLength) * this.magneticLength;
            this.position.height = Math.floor(this.position.height / this.magneticLength) * this.magneticLength;
        }
        else if (e.shiftKey) {
            this.position.left = Math.floor(this.position.left / 5) * 5;
            this.position.top = Math.floor(this.position.top / 5) * 5;
            this.position.width = Math.floor(this.position.width / 5) * 5;
            this.position.height = Math.floor(this.position.height / 5) * 5;
        }
    }
    doShowFingerCursor() {
        if (!this.useFingerCursor)
            return;
        let self = this;
        let lt = new CMoveControl(this);
        lt.resource = this._fingerCursorResource;
        function setlt() {
            lt.position.width = self._fingerCursorLength;
            lt.position.height = self._fingerCursorLength;
            lt.position.left = -(self._fingerCursorLength / 2);
            lt.position.top = -(self._fingerCursorLength / 2);
        }
        this._fingerCursors.push(lt);
        lt.text = "LT";
        let t = new CMoveControl(this);
        t.resource = this._fingerCursorResource;
        function sett() {
            t.position.width = self._fingerCursorLength;
            t.position.height = self._fingerCursorLength;
            t.position.left = (self.position.width - self._fingerCursorLength) / 2;
            t.position.top = -(self._fingerCursorLength / 2);
        }
        this._fingerCursors.push(t);
        t.text = "T";
        let rt = new CMoveControl(this);
        rt.resource = this._fingerCursorResource;
        function setrt() {
            rt.position.width = self._fingerCursorLength;
            rt.position.height = self._fingerCursorLength;
            rt.position.left = self.position.width - (self._fingerCursorLength / 2);
            rt.position.top = -(self._fingerCursorLength / 2);
        }
        this._fingerCursors.push(rt);
        rt.text = "RT";
        let l = new CMoveControl(this);
        l.resource = this._fingerCursorResource;
        function setl() {
            l.position.width = self._fingerCursorLength;
            l.position.height = self._fingerCursorLength;
            l.position.left = -(self._fingerCursorLength / 2);
            l.position.top = (self.position.height - self._fingerCursorLength) / 2;
        }
        this._fingerCursors.push(l);
        l.text = "L";
        let r = new CMoveControl(this);
        r.resource = this._fingerCursorResource;
        function setr() {
            r.position.width = self._fingerCursorLength;
            r.position.height = self._fingerCursorLength;
            r.position.left = self.position.width - (self._fingerCursorLength / 2);
            r.position.top = (self.position.height - self._fingerCursorLength) / 2;
        }
        this._fingerCursors.push(r);
        r.text = "R";
        let lb = new CMoveControl(this);
        lb.resource = this._fingerCursorResource;
        function setlb() {
            lb.position.width = self._fingerCursorLength;
            lb.position.height = self._fingerCursorLength;
            lb.position.left = -(self._fingerCursorLength / 2);
            lb.position.top = self.position.height - (self._fingerCursorLength / 2);
        }
        this._fingerCursors.push(lb);
        lb.text = "LB";
        let b = new CMoveControl(this);
        b.resource = this._fingerCursorResource;
        function setb() {
            b.position.width = self._fingerCursorLength;
            b.position.height = self._fingerCursorLength;
            b.position.left = (self.position.width - self._fingerCursorLength) / 2;
            b.position.top = self.position.height - (self._fingerCursorLength / 2);
        }
        this._fingerCursors.push(b);
        b.text = "B";
        let rb = new CMoveControl(this);
        rb.resource = this._fingerCursorResource;
        function setrb() {
            rb.position.width = self._fingerCursorLength;
            rb.position.height = self._fingerCursorLength;
            rb.position.left = self.position.width - (self._fingerCursorLength / 2);
            rb.position.top = self.position.height - (self._fingerCursorLength / 2);
        }
        this._fingerCursors.push(rb);
        rb.text = "RB";
        let mv = new CMoveControl(this);
        mv.resource = this._fingerCursorResource;
        function setmv() {
            //mv.position.width = self._fingerCursorLength
            //mv.position.height = self._fingerCursorLength
            mv.position.width = self.position.width - self._fingerCursorLength;
            mv.position.height = self.position.height - self._fingerCursorLength;
            mv.position.left = (self._fingerCursorLength / 2);
            mv.position.top = (self._fingerCursorLength / 2);
        }
        this._fingerCursors.push(mv);
        //mv.text = "MV"
        let rx = new CMoveControl(this);
        rx.resource = this._fingerCursorResource;
        function setrx() {
            rx.position.width = self._fingerCursorLength;
            rx.position.height = self._fingerCursorLength;
            rx.position.left = (self.position.width - self._fingerCursorLength) / 2 - self._fingerCursorLength - 5;
            rx.position.top = (self.position.height - self._fingerCursorLength) / 2;
        }
        this._fingerCursors.push(rx);
        rx.text = "RX";
        let ry = new CMoveControl(this);
        ry.resource = this._fingerCursorResource;
        function setry() {
            ry.position.width = self._fingerCursorLength;
            ry.position.height = self._fingerCursorLength;
            ry.position.left = (self.position.width - self._fingerCursorLength) / 2;
            ry.position.top = (self.position.height - self._fingerCursorLength) / 2;
        }
        this._fingerCursors.push(ry);
        ry.text = "RY";
        let rz = new CMoveControl(this);
        rz.resource = this._fingerCursorResource;
        function setrz() {
            rz.position.width = self._fingerCursorLength;
            rz.position.height = self._fingerCursorLength;
            rz.position.left = (self.position.width - self._fingerCursorLength) / 2 + self._fingerCursorLength + 5;
            rz.position.top = (self.position.height - self._fingerCursorLength) / 2;
        }
        this._fingerCursors.push(rz);
        rz.text = "RZ";
        function setall() {
            setlt();
            sett();
            setrt();
            setl();
            setr();
            setlb();
            setb();
            setrb();
            setrz();
            setrx();
            setry();
            setmv();
        }
        setall();
        lt.onPointerDown = function (sender, e) {
            self.setDown(e);
        };
        lt.onMove = function (sender, e) {
            self.doResize(e, e.pageX, e.pageY, EControlMoveKind.RESIZE_LT);
            setall();
        };
        t.onPointerDown = function (sender, e) {
            self.setDown(e);
        };
        t.onMove = function (sender, e) {
            self.doResize(e, e.pageX, e.pageY, EControlMoveKind.RESIZE_T);
            setall();
        };
        rt.onPointerDown = function (sender, e) {
            self.setDown(e);
        };
        rt.onMove = function (sender, e) {
            self.doResize(e, e.pageX, e.pageY, EControlMoveKind.RESIZE_RT);
            setall();
        };
        l.onPointerDown = function (sender, e) {
            self.setDown(e);
        };
        l.onMove = function (sender, e) {
            self.doResize(e, e.pageX, e.pageY, EControlMoveKind.RESIZE_L);
            setall();
        };
        r.onPointerDown = function (sender, e) {
            self.setDown(e);
        };
        r.onMove = function (sender, e) {
            self.doResize(e, e.pageX, e.pageY, EControlMoveKind.RESIZE_R);
            setall();
        };
        lb.onPointerDown = function (sender, e) {
            self.setDown(e);
        };
        lb.onMove = function (sender, e) {
            self.doResize(e, e.pageX, e.pageY, EControlMoveKind.RESIZE_LB);
            setall();
        };
        b.onPointerDown = function (sender, e) {
            self.setDown(e);
        };
        b.onMove = function (sender, e) {
            self.doResize(e, e.pageX, e.pageY, EControlMoveKind.RESIZE_B);
            setall();
        };
        rb.onPointerDown = function (sender, e) {
            self.setDown(e);
        };
        rb.onMove = function (sender, e) {
            self.doResize(e, e.pageX, e.pageY, EControlMoveKind.RESIZE_RB);
            setall();
        };
        let px = 0;
        let py = 0;
        rx.onPointerDown = function (sender, e) {
            px = e.pageX;
            py = e.pageY;
        };
        rx.onMove = function (sender, e) {
            self.transform.rotateX = CPoint.getAngleFromTwoPoint(new CPoint(px, py), new CPoint(e.pageX, e.pageY));
            setall();
        };
        ry.onPointerDown = function (sender, e) {
            px = e.pageX;
            py = e.pageY;
        };
        ry.onMove = function (sender, e) {
            self.transform.rotateY = CPoint.getAngleFromTwoPoint(new CPoint(px, py), new CPoint(e.pageX, e.pageY));
            setall();
        };
        rz.onPointerDown = function (sender, e) {
            px = e.pageX;
            py = e.pageY;
        };
        rz.onMove = function (sender, e) {
            self.transform.rotateZ = CPoint.getAngleFromTwoPoint(new CPoint(px, py), new CPoint(e.pageX, e.pageY));
            setall();
        };
        mv.onPointerDown = function (sender, e) {
            self.setDown(e);
        };
        mv.onMove = function (sender, e) {
            self.position.left = self.__moveResizeDown.left + (e.pageX - self.__moveResizeDown.pagex);
            self.position.top = self.__moveResizeDown.top + (e.pageY - self.__moveResizeDown.pagey);
            setall();
        };
    }
    doHideFingerCursor() {
        for (let n = 0; n < this._fingerCursors.length; n++) {
            this._fingerCursors[n].remove();
        }
        this._fingerCursors = [];
    }
    click() {
        this.doClick(new PointerEvent(""));
    }
    deleteProperties() {
        return new Set().add("isOver").add("isEnter");
    }
    readOnlyProperties() {
        return new Set().add("id").add("name");
    }
    addProperties() {
        let arr = super.addProperties();
        arr.push({ instance: this.overAnimationTrigger, propertyName: "overAnimationTrigger", readOnly: false, enum: [] });
        arr.push({ instance: this.thisPointerDownAnimationTrigger, propertyName: "thisPointerDownAnimationTrigger", readOnly: false, enum: [] });
        arr.push({ instance: this.thisPointerUpAnimationTrigger, propertyName: "thisPointerUpAnimationTrigger", readOnly: false, enum: [] });
        arr.push({ instance: this.enterAnimationTrigger, propertyName: "enterAnimationTrigger", readOnly: false, enum: [] });
        arr.push({ instance: this.clickAnimationTrigger, propertyName: "clickAnimationTrigger", readOnly: false, enum: [] });
        arr.push({ instance: this.doubleClickAnimationTrigger, propertyName: "doubleClickAnimationTrigger", readOnly: false, enum: [] });
        arr.push({ instance: this.dragStartAnimationTrigger, propertyName: "dragStartAnimationTrigger", readOnly: false, enum: [] });
        arr.push({ instance: this.dragStartAnimationTrigger, propertyName: "dragCancelAnimationTrigger", readOnly: false, enum: [] });
        arr.push({ instance: this.dragCatchAnimationTrigger, propertyName: "dragCatchAnimationTrigger", readOnly: false, enum: [] });
        arr.push({ instance: this.keyDownAnimationTrigger, propertyName: "keyDownAnimationTrigger", readOnly: false, enum: [] });
        /*arr.push({instance:this.lockMinX, propertyName: "lockMinX", readOnly:false, enum:[]})
        arr.push({instance:this.lockMaxX, propertyName: "lockMaxX", readOnly:false, enum:[]})
        arr.push({instance:this.lockMinY, propertyName: "lockMinY", readOnly:false, enum:[]})
        arr.push({instance:this.lockMaxY, propertyName: "lockMaxY", readOnly:false, enum:[]})*/
        return arr;
    }
}
class CCanvasLayerControl extends CPointerEventControl {
    constructor(parent, name) {
        super(parent, name);
        this._expandedLayers = new CNotifyRect(0, 0, 0, 0);
        this._layersResource = "";
        this._pathItemsResource = "";
        let self = this;
        this._layers = new CCanvasLayers(this);
        this._layers.onChangeLayer = function (sender, kind, layer) {
            if (kind == CCanvasLayers.CON_CHANGE_ADD_LAYER) {
                layer.setCanvasElementPosition(-self.expandedLayers.left, -self.expandedLayers.top, self.position.width + self.expandedLayers.left + self.expandedLayers.right, self.position.height + self.expandedLayers.top + self.expandedLayers.bottom);
            }
        };
        this.layers.onChange = function () {
            let arr = CSystem.getChildControls(self);
            for (let n = 0; n < arr.length; n++) {
                arr[n].bringToFront();
            }
            self.doChangeLayerCount();
        };
        this._expandedLayers.onChange = function () {
            self.setLayers();
        };
    }
    get layers() {
        return this._layers;
    }
    get expandedLayers() {
        return this._expandedLayers;
    }
    get layersResource() {
        return this._layersResource;
    }
    set layersResource(value) {
        if (this.layersResource != value) {
            this._layersResource = value;
            this.layers.resource = value;
        }
    }
    get pathItemsResource() {
        return this._pathItemsResource;
    }
    set pathItemsResource(value) {
        if (this._pathItemsResource != value) {
            this._pathItemsResource = value;
            let pd = CSystem.resources.get(value);
            if (pd != undefined) {
                let pt = new CPathItems();
                pt.fromData(pd);
                let w = 0;
                let h = 0;
                w = parseFloat(pd.width);
                h = parseFloat(pd.height);
                this.layers.clear();
                for (let n = 0; n < pt.length; n++) {
                    let l = this.layers.addLayer();
                    l.items.fromData(pt.get(n).toCanvasItems(w, h).toData());
                }
            }
        }
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "layers", this.layers.toData(), [], true);
        CDataClass.putData(data, "expandedLayers", this.expandedLayers.toData(), {}, true);
        CDataClass.putData(data, "layersResource", this.layersResource, "");
    }
    doFromData(data) {
        super.doFromData(data);
        this.layers.fromData(CDataClass.getData(data, "layers", [], true));
        this.expandedLayers.fromData(CDataClass.getData(data, "expandedLayers", {}, true));
        this.layersResource = CDataClass.getData(data, "layersResource", "");
    }
    doRemove() {
        this._layers.remove();
        super.doRemove();
    }
    doSetElementSize() {
        super.doSetElementSize();
        this.doSetLayers();
    }
    doSetLayers() {
        this._layers.setLayersPosition(-this.expandedLayers.left, -this.expandedLayers.top, this.position.width + this.expandedLayers.left + this.expandedLayers.right, this.position.height + this.expandedLayers.top + this.expandedLayers.bottom);
        if (this.onSetLayers != undefined) {
            this.onSetLayers(this);
        }
    }
    doChangeLayerCount() {
        if (this.onChangeLayerCount != undefined) {
            this.onChangeLayerCount(this);
        }
    }
    doDraw() {
        this._layers.draw();
    }
    doLayerDraw(layerIndex, layer, context) {
        if (this.onLayerDraw != undefined) {
            this.onLayerDraw(this, layerIndex, layer, context);
        }
    }
    setLayers() {
        this.doSetLayers();
    }
    addLayer() {
        return this._layers.addLayer();
    }
    draw() {
        this.doDraw();
    }
    getCanvasItems(canvasItemName) {
        return this.layers.getCanvasItems(canvasItemName);
    }
    static createControl(parent, name = "", left = 0, top = 0, width = 50, height = 50) {
        let c = new CCanvasLayerControl(parent, name);
        c.position.left = left;
        c.position.top = top;
        c.position.width = width;
        c.position.height = height;
        return c;
    }
}
class CPanel extends CCanvasLayerControl {
    constructor(parent, name) {
        super(parent, name);
        this._textSet = new CTextSet();
        this._text = "";
        this._useAutoSize = false;
        let self = this;
        this.textSet.onChange = function () {
            self.doChange(CPanel.CON_CHANGE_TEXTSET);
        };
    }
    static get CON_CHANGE_USE_AUTO_SIZE() { return "changeUseAutoSize"; }
    static get CON_CHANGE_TEXT() { return "changeText"; }
    static get CON_CHANGE_TEXTSET() { return "changeTextSet"; }
    get textSet() {
        return this._textSet;
    }
    get text() {
        if (this.textSet.languageKey != "") {
            let t = CLanguage.getText(this.textSet.languageKey);
            if (t != undefined) {
                return t;
            }
            else {
                return this._text;
            }
        }
        else {
            return this._text;
        }
    }
    set text(value) {
        if (this._text != value) {
            this._text = value;
            this.doChange(CPanel.CON_CHANGE_TEXT);
        }
    }
    get useAutoSize() {
        return this._useAutoSize;
    }
    set useAutoSize(value) {
        if (this._useAutoSize != value) {
            this._useAutoSize = value;
            this.doChange(CPanel.CON_CHANGE_USE_AUTO_SIZE);
        }
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "textSet", this.textSet.toData(), {}, true);
        CDataClass.putData(data, "text", this.text, "");
        CDataClass.putData(data, "useAutoSize", this.useAutoSize, false);
    }
    doFromData(data) {
        super.doFromData(data);
        this.textSet.fromData(CDataClass.getData(data, "textSet", {}, true));
        this.text = CDataClass.getData(data, "text", "");
        this.useAutoSize = CDataClass.getData(data, "useAutoSize", false);
    }
    doChange(kind, data) {
        super.doChange(kind, data);
        if (kind == CPanel.CON_CHANGE_TEXT) {
            this.doChangeText();
            this.doSetAutoSize();
        }
        if (kind == CPanel.CON_CHANGE_TEXTSET) {
            this.doChangeTextSet();
            this.doSetAutoSize();
        }
        if (kind == CPanel.CON_CHANGE_USE_AUTO_SIZE) {
            this.doSetAutoSize();
        }
    }
    doSetAutoSize() {
        if (this._useAutoSize) {
            this.position.width = Math.round(CStringUtil.getTextWidth(this.textSet, this.text)) + 20;
        }
    }
    doChangeTextSet() {
        for (let n = 0; n < this.layers.length; n++) {
            let arr = this.layers.get(n).items.getItem("text");
            for (let i = 0; i < arr.length; i++) {
                arr[i].textSet.fromData(this.textSet.toData());
            }
        }
        this.draw();
        if (this.onChangeTextSet != undefined) {
            this.onChangeTextSet(this);
        }
    }
    doChangeText() {
        for (let n = 0; n < this.layers.length; n++) {
            let arr = this.layers.get(n).items.getItem("text");
            for (let i = 0; i < arr.length; i++) {
                arr[i].text = this.text;
            }
        }
        this.draw();
        if (this.onChangeText != undefined) {
            this.onChangeText(this);
        }
    }
    doThisPointerUp(e, points) {
        super.doThisPointerUp(e, points);
        if (e.pointerType == "mouse" && e.button == 2 && this.popup != undefined) {
            this.popup.resource = this.popup.popupResource;
            if (e.pageX + this.popup.popupWidth <= window.innerWidth) {
                this.popup.position.left = e.pageX;
            }
            else {
                this.popup.position.left = e.pageX - this.popup.popupWidth;
            }
            let h = (this.popup.items.length * 30) + 10;
            if (e.pageY + h <= window.innerHeight) {
                this.popup.position.top = e.pageY;
            }
            else {
                this.popup.position.top = e.pageY - h;
            }
            this.popup.position.width = this.popup.popupWidth;
            this.popup.popupCaller = this;
            this.popup.show();
        }
    }
    canvasItemText(itemName, text) {
        for (let n = 0; n < this.layers.length; n++) {
            let items = this.layers.get(n).items.getItem(itemName);
            for (let i = 0; i < items.length; i++) {
                items[i].text = text;
            }
        }
    }
}
class CCover extends CPanel {
    constructor(parent, name) {
        super(parent, name);
        this.isClickHide = true;
        this.isHideClear = false;
        this._showAnimatorResource = "";
        this._hideAnimatorResource = "";
        this.visible = false;
    }
    get showAnimatorResource() {
        return this._showAnimatorResource;
    }
    set showAnimatorResource(value) {
        this._showAnimatorResource = value;
        if (value != "")
            this.showAnimationTrigger = CAnimator.animatorFromResource(this, value);
    }
    get hideAnimatorResource() {
        return this._hideAnimatorResource;
    }
    set hideAnimatorResource(value) {
        this._hideAnimatorResource = value;
        if (value != "")
            this.hideAnimationTrigger = CAnimator.animatorFromResource(this, value);
    }
    doClick(e) {
        super.doClick(e);
        if (this.isClickHide) {
            this.hideCover();
        }
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "showAnimatorResource", this.showAnimatorResource, "");
        CDataClass.putData(data, "hideAnimatorResource", this.hideAnimatorResource, "");
        if (this.showAnimationTrigger != undefined)
            CDataClass.putData(data, "showAnimationTrigger", this.showAnimationTrigger.toData(), {}, true);
        if (this.hideAnimationTrigger != undefined)
            CDataClass.putData(data, "hideAnimationTrigger", this.hideAnimationTrigger.toData(), {}, true);
    }
    doFromData(data) {
        super.doFromData(data);
        CAnimator.fromAnimatorData(data, this, "showAnimationTrigger");
        CAnimator.fromAnimatorData(data, this, "hideAnimationTrigger");
        this.showAnimatorResource = CDataClass.getData(data, "showAnimatorResource", "");
        this.hideAnimatorResource = CDataClass.getData(data, "hideAnimatorResource", "");
    }
    doShowCover() {
        this.bringToFront();
        if (this.parent != undefined) {
            this.position.left = 0;
            this.position.top = 0;
            this.position.width = this.parent.position.width;
            this.position.height = this.parent.position.height;
        }
        if (this.onBeforeShow != undefined) {
            this.onBeforeShow(this);
        }
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
    doHideCover() {
        if (this.onBeforeHide != undefined) {
            this.onBeforeHide(this);
        }
        let self = this;
        function clear() {
            if (self.isHideClear) {
                let arr = CSystem.getChildControls(self);
                for (let n = arr.length - 1; n >= 0; n--) {
                    arr[n].remove();
                }
            }
        }
        if (this.hideAnimationTrigger != undefined) {
            this.hideAnimationTrigger.onAfterAnimation = function () {
                self.visible = false;
                clear();
                if (self.onHide != undefined) {
                    self.onHide(self);
                }
            };
            this.hideAnimationTrigger.start();
        }
        else {
            this.visible = false;
            clear();
            if (this.onHide != undefined) {
                this.onHide(this);
            }
        }
    }
    showCover(isClickHide = true) {
        this.isClickHide = isClickHide;
        this.doShowCover();
    }
    hideCover() {
        this.doHideCover();
    }
    addProperties() {
        let arr = super.addProperties();
        arr.push({ instance: this.showAnimationTrigger, propertyName: "showAnimationTrigger", readOnly: false, enum: [] });
        arr.push({ instance: this.hideAnimationTrigger, propertyName: "hideAnimationTrigger", readOnly: false, enum: [] });
        return arr;
    }
}
class CDragIcon extends CPanel {
    constructor() {
        super(...arguments);
        this._isOverCatchControl = false;
        this.dragStartPosition = new CPoint();
        this._dropAnimatorResource = "";
        this._cancelAnimatorResource = "";
        this._changeOverCatchControlAnimatorResource = "";
    }
    get dropAnimatorResource() {
        return this._dropAnimatorResource;
    }
    set dropAnimatorResource(value) {
        this._dropAnimatorResource = value;
        if (value != "")
            this.dropAnimationTrigger = CAnimator.animatorFromResource(this, value);
    }
    get cancelAnimatorResource() {
        return this._cancelAnimatorResource;
    }
    set cancelAnimatorResource(value) {
        this._cancelAnimatorResource = value;
        if (value != "")
            this.cancelAnimationTrigger = CAnimator.animatorFromResource(this, value);
    }
    get changeOverCatchControlAnimatorResource() {
        return this._changeOverCatchControlAnimatorResource;
    }
    set changeOverCatchControlAnimatorResource(value) {
        this._changeOverCatchControlAnimatorResource = value;
        if (value != "")
            this.changeOverCatchControlAnimationTrigger = CAnimator.animatorFromResource(this, value);
    }
    get isOverCatchControl() {
        return this._isOverCatchControl;
    }
    set isOverCatchControl(value) {
        if (this._isOverCatchControl != value) {
            this._isOverCatchControl = value;
            this.doChangeOverCatchControl();
        }
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "dropAnimatorResource", this.dropAnimatorResource, "");
        CDataClass.putData(data, "cancelAnimatorResource", this.cancelAnimatorResource, "");
        CDataClass.putData(data, "changeOverCatchControlAnimatorResource", this.changeOverCatchControlAnimatorResource, "");
        if (this.dropAnimationTrigger != undefined)
            CDataClass.putData(data, "dropAnimationTrigger", this.dropAnimationTrigger.toData(), {}, true);
        if (this.cancelAnimationTrigger != undefined)
            CDataClass.putData(data, "cancelAnimationTrigger", this.cancelAnimationTrigger.toData(), {}, true);
        if (this.changeOverCatchControlAnimationTrigger != undefined)
            CDataClass.putData(data, "changeOverCatchControlAnimationTrigger", this.changeOverCatchControlAnimationTrigger.toData(), {}, true);
    }
    doFromData(data) {
        super.doFromData(data);
        CAnimator.fromAnimatorData(data, this, "dropAnimationTrigger");
        CAnimator.fromAnimatorData(data, this, "cancelAnimationTrigger");
        CAnimator.fromAnimatorData(data, this, "changeOverCatchControlAnimationTrigger");
        this.dropAnimatorResource = CDataClass.getData(data, "dropAnimatorResource", "");
        this.cancelAnimatorResource = CDataClass.getData(data, "cancelAnimatorResource", "");
        this.changeOverCatchControlAnimatorResource = CDataClass.getData(data, "changeOverCatchControlAnimatorResource", "");
    }
    doChangeOverCatchControl() {
        if (this.changeOverCatchControlAnimationTrigger != undefined) {
            if (this.isOverCatchControl) {
                this.triggerTrue(this.changeOverCatchControlAnimationTrigger);
            }
            else {
                this.triggerFalse(this.changeOverCatchControlAnimationTrigger);
            }
        }
    }
    doDrop() {
        if (this.dropAnimationTrigger != undefined) {
            let self = this;
            this.dropAnimationTrigger.onAfterAnimation = function () {
                self.remove();
            };
            this.dropAnimationTrigger.start();
        }
        else {
            this.remove();
        }
    }
    doCancel() {
        console.log("do cancel", this.cancelAnimationTrigger);
        if (this.cancelAnimationTrigger != undefined) {
            let self = this;
            this.cancelAnimationTrigger.onAfterAnimation = function () {
                self.remove();
            };
            this.cancelAnimationTrigger.start();
        }
        else {
            this.remove();
        }
    }
    addProperties() {
        let arr = super.addProperties();
        arr.push({ instance: this.dropAnimationTrigger, propertyName: "dropAnimationTrigger", readOnly: false, enum: [] });
        arr.push({ instance: this.cancelAnimationTrigger, propertyName: "cancelAnimationTrigger", readOnly: false, enum: [] });
        return arr;
    }
}
class CHint extends CPanel {
    constructor() {
        super(...arguments);
        this._hintAnimatorResource = "";
    }
    get hintAnimatorResource() {
        return this._hintAnimatorResource;
    }
    set hintAnimatorResource(value) {
        this._hintAnimatorResource = value;
        if (value != "")
            this.hideAnimationTrigger = CAnimator.animatorFromResource(this, value);
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "hintAnimatorResource", this.hintAnimatorResource, "");
        if (this.hideAnimationTrigger != undefined)
            CDataClass.putData(data, "hideAnimationTrigger", this.hideAnimationTrigger.toData(), {}, true);
    }
    doFromData(data) {
        super.doFromData(data);
        CAnimator.fromAnimatorData(data, this, "hideAnimationTrigger");
        this.hintAnimatorResource = CDataClass.getData(data, "hintAnimatorResource", "");
    }
    doShowh(hint) {
        this.hasPointerEvent = false;
        this.text = hint;
    }
    doHideh() {
        this.visible = false;
    }
    doHide() {
        super.doHide();
        this.remove();
    }
    showHint(hint) {
        this.doShowh(hint);
    }
    hideHint() {
        this.doHideh();
    }
    addProperties() {
        let arr = super.addProperties();
        arr.push({ instance: this.hideAnimationTrigger, propertyName: "hideAnimationTrigger", readOnly: false, enum: [] });
        return arr;
    }
}
class CGraphicInfo extends CResourceClass {
    constructor() {
        super(...arguments);
        this.opacity = 1;
        this.position = new CPosition();
        this.transform = new CTransform();
        this.filter = new CFilter();
        this.layers = new CCanvasLayers(undefined);
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "opacity", this.opacity, 1);
        CDataClass.putData(data, "position", this.position.toData(), {}, true);
        CDataClass.putData(data, "transform", this.transform.toData(), {}, true);
        CDataClass.putData(data, "filter", this.filter.toData(), {}, true);
        CDataClass.putData(data, "layers", this.layers.toData(), {}, true);
    }
    doFromData(data) {
        super.doFromData(data);
        this.opacity = CDataClass.getData(data, "opacity", 1);
        this.position.fromData(CDataClass.getData(data, "position", {}, true));
        this.transform.fromData(CDataClass.getData(data, "transform", {}, true));
        this.filter.fromData(CDataClass.getData(data, "filter", {}, true));
        this.layers.fromData(CDataClass.getData(data, "layers", {}, true));
    }
    doRemove() {
        this.layers.remove();
        super.doRemove();
    }
    static controlGraphicInfo(control, positionData) {
        let rt = new CGraphicInfo();
        rt.opacity = control.opacity;
        if (positionData == undefined) {
            rt.position.fromData(control.position.toData());
        }
        else {
            rt.position.fromData(positionData);
        }
        rt.transform.fromData(control.transform.toData());
        rt.filter.fromData(control.filter.toData());
        rt.layers.fromData(control.layers.toData());
        return rt;
    }
    static setControlGraphicInfo(graphicInfo, control) {
        control.opacity = graphicInfo.opacity;
        control.position.fromData(graphicInfo.position.toData());
        control.transform.fromData(graphicInfo.transform.toData());
        control.filter.fromData(graphicInfo.filter.toData());
        control.layers.fromData(graphicInfo.layers.toData());
    }
}
class CAnimationControlSceneSection extends CResourceClass {
    constructor() {
        super(...arguments);
        this.controlName = "";
        this.property = "";
        this.script = "";
        this._graphData = "";
        this.graphPath = new CPathPointList();
        this.positionPoints = new Array();
        this.positionPath = new CPathPointList();
        this.timeTag = new Array();
        this.objectData = new CList();
        this.startTime = 0;
        this.duration = 100;
        this.startValue = 0;
        this.stopValue = 0;
        this.isLoop = false;
    }
    get graphData() {
        return this._graphData;
    }
    set graphData(value) {
        if (typeof value == "string") {
            let rc = CSystem.resources.get(value);
            if (rc != undefined) {
                this._graphData = rc;
            }
        }
        else {
            this._graphData = value;
        }
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "controlName", this.controlName, "");
        CDataClass.putData(data, "property", this.property, "");
        CDataClass.putData(data, "script", this.script, "");
        if (typeof this.graphData == "string") {
            CDataClass.putData(data, "graphData", this.graphData, "");
        }
        else {
            CDataClass.putData(data, "graphData", this.graphData, [], true);
        }
        CDataClass.putData(data, "graphPath", this.graphPath.toData(), {}, true);
        let arr = new Array();
        for (let n = 0; n < this.objectData.length; n++) {
            arr.push({ duration: this.objectData.get(n).sectionT, centerX: this.objectData.get(n).centerX, centerY: this.objectData.get(n).centerY, info: this.objectData.get(n).info.toData() });
        }
        CDataClass.putData(data, "objectData", arr, [], true);
        let arr2 = new Array();
        for (let n = 0; n < this.positionPoints.length; n++) {
            arr2.push({ x: this.positionPoints[n].x, y: this.positionPoints[n].y });
        }
        CDataClass.putData(data, "positionPoints", arr2, [], true);
        CDataClass.putData(data, "positionPath", this.positionPath.toData(), {}, true);
        CDataClass.putData(data, "timeTag", this.timeTag, [], true);
        CDataClass.putData(data, "startTime", this.startTime, 0);
        CDataClass.putData(data, "duration", this.duration, 100);
        CDataClass.putData(data, "startValue", CGraphAnimationValue.graphValueToData(this.startValue));
        CDataClass.putData(data, "stopValue", CGraphAnimationValue.graphValueToData(this.stopValue));
        CDataClass.putData(data, "isLoop", this.isLoop, false);
    }
    doFromData(data) {
        super.doFromData(data);
        this.controlName = CDataClass.getData(data, "controlName", "");
        this.property = CDataClass.getData(data, "property", "");
        this.script = CDataClass.getData(data, "script", "");
        this.graphData = CDataClass.getData(data, "graphData");
        this.graphPath.fromData(CDataClass.getData(data, "graphPath", {}, true));
        this.clearObjectData();
        let arr = CDataClass.getData(data, "objectData", [], true);
        for (let n = 0; n < arr.length; n++) {
            let info = new CGraphicInfo();
            info.fromData(arr[n].info);
            let item = { sectionT: arr[n].duration, centerX: arr[n].centerX, centerY: arr[n].centerY, info: info };
            this.objectData.add(item);
        }
        let arr2 = CDataClass.getData(data, "positionPoints", [], true);
        this.positionPoints = [];
        for (let n = 0; n < arr2.length; n++) {
            let pt = new CPoint(arr2[n].x, arr2[n].y);
            this.positionPoints.push(pt);
        }
        this.positionPath.fromData(CDataClass.getData(data, "positionPath", {}, true));
        this.timeTag = CDataClass.getData(data, "timeTag", [], true);
        this.startTime = CDataClass.getData(data, "startTime", 0);
        this.duration = CDataClass.getData(data, "duration", 100);
        this.startValue = CGraphAnimationValue.graphValueFromData(CDataClass.getData(data, "startValue"));
        this.stopValue = CGraphAnimationValue.graphValueFromData(CDataClass.getData(data, "stopValue"));
        this.isLoop = CDataClass.getData(data, "isLoop", false);
    }
    doRemove() {
        this.clearObjectData();
        super.doRemove();
    }
    clearObjectData() {
        for (let n = 0; n < this.objectData.length; n++) {
            this.objectData.get(n).info.remove();
        }
        this.objectData.clear();
    }
    graphDataCopy() {
        let arr = new Array();
        if (typeof this.graphData != "string") {
            for (let n = 0; n < this.graphData.length; n++) {
                arr.push(this.graphData[n]);
            }
        }
        return arr;
    }
    graphDataFromData(data) {
        this.graphData = [];
        for (let n = 0; n < data.length; n++) {
            this.graphData.push(data[n]);
        }
    }
    timeTagCopy() {
        let arr = new Array();
        for (let n = 0; n < this.timeTag.length; n++) {
            arr.push({ tagName: this.timeTag[n].tagName, tagColor: this.timeTag[n].tagColor, duration: this.timeTag[n].duration });
        }
        return arr;
    }
    timeTagFromData(data) {
        this.timeTag = [];
        for (let n = 0; n < data.length; n++) {
            this.timeTag.push({ tagName: data[n].tagName, tagColor: data[n].tagColor, duration: data[n].duration });
        }
    }
}
class CAnimationControlScene extends CResourceClass {
    constructor() {
        super(...arguments);
        this.sections = new CList();
        this.startTime = 0;
        this.duration = 1000;
        this.speedStartValue = 1;
        this.speedStopValue = 1;
    }
    doToData(data) {
        super.doToData(data);
        let arr = new Array();
        for (let n = 0; n < this.sections.length; n++) {
            arr.push(this.sections.get(n).toData());
        }
        CDataClass.putData(data, "sections", arr, [], true);
        CDataClass.putData(data, "startTime", this.startTime, 0);
        CDataClass.putData(data, "duration", this.duration, 1000);
        CDataClass.putData(data, "speedStopValue", this.speedStopValue, 0);
        CDataClass.putData(data, "speedStartValue", this.speedStartValue, 0);
        CDataClass.putData(data, "speedGraphData", this.speedGraphData, undefined);
    }
    doFromData(data) {
        super.doFromData(data);
        this.clearSections();
        let arr = CDataClass.getData(data, "sections", [], true);
        for (let n = 0; n < arr.length; n++) {
            let ss = new CAnimationControlSceneSection();
            ss.fromData(arr[n]);
            this.sections.add(ss);
        }
        this.startTime = CDataClass.getData(data, "startTime", 0);
        this.duration = CDataClass.getData(data, "duration", 1000);
        this.speedStartValue = CDataClass.getData(data, "speedStartValue", 0);
        this.speedStopValue = CDataClass.getData(data, "speedStopValue", 0);
        this.speedGraphData = CDataClass.getData(data, "speedGraphData", undefined);
    }
    doRemove() {
        this.clearSections();
        super.doRemove();
    }
    clearSections() {
        for (let n = 0; n < this.sections.length; n++) {
            this.sections.get(n).remove();
        }
        this.sections.clear();
    }
}
class CAnimationControl extends CPanel {
    constructor(parent, name) {
        super(parent, name);
        this.__isScene = false;
        this.__objectsIndex = new Map();
        this.__orgBounds = new CRect();
        this._objectsCount = 0;
        this._transformerPoints = new CTransformerPoints();
        this._sceneData = new CAnimationControlScene();
        this.orgTransfrom = new CTransform();
        this.orgPosition = new CPosition();
        this.objects = new CList();
        let self = this;
        this.objects.onChange = function () {
            self.setObjectIndex();
        };
    }
    get transformerPoints() {
        return this._transformerPoints;
    }
    get sceneData() {
        return this._sceneData;
    }
    get isScene() {
        return this.__isScene;
    }
    get objectsCount() {
        return this._objectsCount;
    }
    set objectsCount(value) {
        this._objectsCount = value;
        if (this.objects.length < value) {
            let cnt = value - this.objects.length;
            for (let n = 0; n < cnt; n++) {
                let p = new CAnimationControl(this);
                this.objects.add(p);
            }
        }
        else if (this.objects.length > value) {
            let cnt = this.objects.length - value;
            for (let n = 0; n < cnt; n++) {
                this.objects.get(this.objects.length - 1).remove();
                this.objects.delete(this.objects.length - 1);
            }
        }
    }
    doToData(data) {
        super.doToData(data);
        let arr = new Array();
        for (let n = 0; n < this.objects.length; n++) {
            arr.push(this.objects.get(n).toData());
        }
        CDataClass.putData(data, "objects", arr, [], true);
        CDataClass.putData(data, "objectsCount", this.objectsCount, 0);
        CDataClass.putData(data, "orgPosition", this.position.toData(), {}, true);
        CDataClass.putData(data, "orgTransfrom", this.transform.toData(), {}, true);
        CDataClass.putData(data, "sceneData", this.sceneData.toData(), {}, true);
    }
    doFromData(data) {
        super.doFromData(data);
        this.clear();
        this.objectsCount = CDataClass.getData(data, "objectsCount", 0);
        let arr = CDataClass.getData(data, "objects", [], true);
        for (let n = 0; n < arr.length; n++) {
            this.objects.get(n).fromData(arr[n]);
        }
        this.orgPosition.fromData(CDataClass.getData(data, "orgPosition", {}, true));
        this.orgTransfrom.fromData(CDataClass.getData(data, "orgTransfrom", {}, true));
        this.sceneData.fromData(CDataClass.getData(data, "sceneData", {}, true));
        this.setObjectIndex();
        for (let n = 0; n < this.sceneData.sections.length; n++) {
            this.sceneData.sections.get(n).control = this.getObject(this.sceneData.sections.get(n).controlName);
        }
        this.orgData = data;
    }
    doRemove() {
        if (this.orgPathData != undefined) {
            this.orgPathData.remove();
        }
        this.clear();
        super.doRemove();
    }
    doChangeSize() {
        super.doChangeSize();
        let sx = this.position.width / this.orgPosition.width;
        let sy = this.position.height / this.orgPosition.height;
        this.objectsScale(sx, sy);
    }
    doScene() {
        let self = this;
        if (!this.__isScene) {
            //this.fromData(this.orgData)
            let ani = new CSceneAnimator();
            ani.animationControl = this;
            ani.duration = this.sceneData.duration;
            ani.onFinish = function () {
                self.__isScene = false;
                ani.remove();
            };
            this.__isScene = true;
            ani.start();
            if (this.onScene != undefined) {
                this.onScene(this);
            }
        }
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
    addAnimationObject() {
        let con = new CAnimationControl(this);
        this.objects.add(con);
        return con;
    }
    clear() {
        for (let n = 0; n < this.objects.length; n++) {
            this.objects.get(n).remove();
        }
        this.objects.clear();
    }
    objectsScale(scaleX, scaleY) {
        for (let n = 0; n < this.objects.length; n++) {
            this.objects.get(n).position.left = this.objects.get(n).orgPosition.left * scaleX;
            this.objects.get(n).position.top = this.objects.get(n).orgPosition.top * scaleY;
            this.objects.get(n).position.width = this.objects.get(n).orgPosition.width * scaleX;
            this.objects.get(n).position.height = this.objects.get(n).orgPosition.height * scaleY;
        }
    }
    orgPathdataSet() {
        if (this.orgPathData != undefined)
            this.orgPathData.remove();
        let ls = new CCanvasLayers(undefined);
        ls.fromData(this.layers.toData());
        this.orgPathData = ls;
        this.__orgBounds = new CRect(0, 0, this.position.width, this.position.height);
    }
    scene() {
        this.doScene();
    }
    getObject(name) {
        return this.__objectsIndex.get(name);
    }
    setObjectIndex() {
        this.__objectsIndex.clear();
        for (let n = 0; n < this.objects.length; n++) {
            this.__objectsIndex.set(this.objects.get(n).propertyName, this.objects.get(n));
        }
    }
    copyTo() {
        let con = new CAnimationControl();
        con.fromData(this.toData());
        return con;
    }
    getSceneAnimation() {
        let ani = new CSceneAnimator();
        let d = 0;
        for (let n = 0; n < this.sceneData.sections.length; n++) {
            d = CCalc.max(d, this.sceneData.sections.get(n).startTime + this.sceneData.sections.get(n).duration);
        }
        ani.duration = d;
        ani.animationControl = this;
        //ani.timeSpeedGraphData = this.graphData
        //ani.startTimeSpeed = this.timeSpeedStart
        //ani.stopTimeSpeed = this.timeSpeedStop
        return ani;
    }
    setOriginalData() {
        if (this.orgData != undefined)
            this.fromData(this.orgData);
    }
}
