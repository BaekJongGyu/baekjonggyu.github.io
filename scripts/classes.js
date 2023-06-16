"use strict";
var EPositionAlign;
(function (EPositionAlign) {
    EPositionAlign[EPositionAlign["NONE"] = 0] = "NONE";
    EPositionAlign[EPositionAlign["LEFT"] = 1] = "LEFT";
    EPositionAlign[EPositionAlign["TOP"] = 2] = "TOP";
    EPositionAlign[EPositionAlign["RIGHT"] = 3] = "RIGHT";
    EPositionAlign[EPositionAlign["BOTTOM"] = 4] = "BOTTOM";
    EPositionAlign[EPositionAlign["CLIENT"] = 5] = "CLIENT";
    EPositionAlign[EPositionAlign["FLOW"] = 6] = "FLOW";
    EPositionAlign[EPositionAlign["CENTER"] = 7] = "CENTER";
    EPositionAlign[EPositionAlign["LEFTTOP"] = 8] = "LEFTTOP";
    EPositionAlign[EPositionAlign["RIGHTTOP"] = 9] = "RIGHTTOP";
    EPositionAlign[EPositionAlign["LEFTBOTTOM"] = 10] = "LEFTBOTTOM";
    EPositionAlign[EPositionAlign["RIGHTBOTTOM"] = 11] = "RIGHTBOTTOM";
    EPositionAlign[EPositionAlign["MIDDLELEFT"] = 12] = "MIDDLELEFT";
    EPositionAlign[EPositionAlign["MIDDLETOP"] = 13] = "MIDDLETOP";
    EPositionAlign[EPositionAlign["MIDDLERIGHT"] = 14] = "MIDDLERIGHT";
    EPositionAlign[EPositionAlign["MIDDLEBOTTOM"] = 15] = "MIDDLEBOTTOM";
    EPositionAlign[EPositionAlign["HCENTER"] = 16] = "HCENTER";
    EPositionAlign[EPositionAlign["VCENTER"] = 17] = "VCENTER";
    EPositionAlign[EPositionAlign["TURN"] = 18] = "TURN";
    EPositionAlign[EPositionAlign["PATHDATA"] = 19] = "PATHDATA";
    EPositionAlign[EPositionAlign["GRID"] = 20] = "GRID";
    EPositionAlign[EPositionAlign["PARENT_SIZE"] = 21] = "PARENT_SIZE";
})(EPositionAlign || (EPositionAlign = {}));
var EPositionUnit;
(function (EPositionUnit) {
    EPositionUnit[EPositionUnit["PIXEL"] = 0] = "PIXEL";
    EPositionUnit[EPositionUnit["PERCENT"] = 1] = "PERCENT";
})(EPositionUnit || (EPositionUnit = {}));
var EFitMode;
(function (EFitMode) {
    EFitMode[EFitMode["ORIGINAL"] = 0] = "ORIGINAL";
    EFitMode[EFitMode["FIT"] = 1] = "FIT";
    EFitMode[EFitMode["STRETCH"] = 2] = "STRETCH";
})(EFitMode || (EFitMode = {}));
class CPositionAlignInfo extends CNotifyChangeKindObject {
    constructor() {
        super(...arguments);
        this._turnAngle = 0;
        this._turnRadiusX = 0;
        this._turnRadiusY = 0;
        this._pathMiddleValue = 0;
        this._gridColumn = 0;
        this._gridRow = 0;
        this._gridRowHeight = 0;
    }
    static get CON_CHANGE_TURN_ANGLE() { return "changeTurnAngle"; }
    static get CON_CHANGE_TURN_RADIUS_X() { return "changeTurnRadiusX"; }
    static get CON_CHANGE_TURN_RADIUS_Y() { return "changeTurnRadiusY"; }
    static get CON_CHANGE_PATH_MIDDLE_VALUE() { return "changePathMiddleValue"; }
    static get CON_CHANGE_GRID_COLUMN() { return "changeGridColumn"; }
    static get CON_CHANGE_GRID_ROW() { return "changeGridRow"; }
    static get CON_CHANGE_GRID_ROW_HEIGHT() { return "changeGridRowHeight"; }
    static get CON_CHANGE_UNIT() { return "changeUnit"; }
    get turnAngle() {
        return this._turnAngle;
    }
    set turnAngle(value) {
        if (value != this.turnAngle) {
            this._turnAngle = value;
            this.doChange(CPositionAlignInfo.CON_CHANGE_TURN_ANGLE);
        }
    }
    get turnRadiusX() {
        return this._turnRadiusX;
    }
    set turnRadiusX(value) {
        if (value != this._turnRadiusX) {
            this._turnRadiusX = value;
            this.doChange(CPositionAlignInfo.CON_CHANGE_TURN_RADIUS_X);
        }
    }
    get turnRadiusY() {
        return this._turnRadiusY;
    }
    set turnRadiusY(value) {
        if (value != this._turnRadiusY) {
            this._turnRadiusY = value;
            this.doChange(CPositionAlignInfo.CON_CHANGE_TURN_RADIUS_Y);
        }
    }
    get pathMiddleValue() {
        return this._pathMiddleValue;
    }
    set pathMiddleValue(value) {
        if (value != this._pathMiddleValue) {
            this._pathMiddleValue = value;
            this.doChange(CPositionAlignInfo.CON_CHANGE_PATH_MIDDLE_VALUE);
        }
    }
    get gridColumn() {
        return this._gridColumn;
    }
    set gridColumn(value) {
        if (value != this._gridColumn) {
            this._gridColumn = value;
            this.doChange(CPositionAlignInfo.CON_CHANGE_GRID_COLUMN);
        }
    }
    get gridRow() {
        return this._gridRow;
    }
    set gridRow(value) {
        if (value != this._gridRow) {
            this._gridRow = value;
            this.doChange(CPositionAlignInfo.CON_CHANGE_GRID_ROW);
        }
    }
    get gridRowHeight() {
        return this._gridRowHeight;
    }
    set gridRowHeight(value) {
        if (value != this._gridRowHeight) {
            this._gridRowHeight = value;
            this.doChange(CPositionAlignInfo.CON_CHANGE_GRID_ROW_HEIGHT);
        }
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "turnAngle", this.turnAngle, 0);
        CDataClass.putData(data, "turnRadiusX", this.turnRadiusX, 0);
        CDataClass.putData(data, "turnRadiusY", this.turnRadiusY, 0);
        CDataClass.putData(data, "pathMiddleValue", this.pathMiddleValue, 0);
        CDataClass.putData(data, "gridColumn", this.gridColumn, 0);
        CDataClass.putData(data, "gridRow", this.gridRow, 0);
        CDataClass.putData(data, "gridRowHeight", this.gridRowHeight, 0);
    }
    doFromData(data) {
        super.doFromData(data);
        this.turnAngle = CDataClass.getData(data, "turnAngle", 0);
        this.turnRadiusX = CDataClass.getData(data, "turnRadiusX", 0);
        this.turnRadiusY = CDataClass.getData(data, "turnRadiusY", 0);
        this.pathMiddleValue = CDataClass.getData(data, "pathMiddleValue", 0);
        this.gridColumn = CDataClass.getData(data, "gridColumn", 0);
        this.gridRow = CDataClass.getData(data, "gridRow", 0);
        this.gridRowHeight = CDataClass.getData(data, "gridRowHeight", 0);
    }
    copyFrom(src) {
        this.turnAngle = src.turnAngle;
        this.turnRadiusX = src.turnRadiusX;
        this.turnRadiusY = src.turnRadiusY;
        this.pathMiddleValue = src.pathMiddleValue;
        this.gridColumn = src.gridColumn;
        this.gridRow = src.gridRow;
        this.gridRowHeight = src.gridRowHeight;
    }
}
class CPositionParentAlignInfo extends CNotifyChangeKindObject {
    static get CON_CHANGE_MARGIN_X() { return "changeMarginX"; }
    static get CON_CHANGE_MARGIN_Y() { return "changeMarginY"; }
    static get CON_CHANGE_GRID_COLUMN_COUNT() { return "changeGridColumnCount"; }
    static get CON_CHANGE_GRID_ROW_COUNT() { return "changeGridRowCount"; }
    static get CON_CHANGE_TURN_CENTER() { return "changeTurnCenter"; }
    static get CON_CHANGE_TURN_AUTO_SET() { return "changeTurnAutoSet"; }
    static get CON_CHANGE_TURN_AUTO_SET_START_ANGLE() { return "changeTurnAutoSetStartAngle"; }
    static get CON_CHANGE_TURN_AUTO_SET_STOP_ANGLE() { return "changeTurnAutoSetStopAngle"; }
    static get CON_CHANGE_TURN_AUTO_SET_RADIUS_X() { return "changeTurnAutoSetRadiusX"; }
    static get CON_CHANGE_TURN_AUTO_SET_RADIUS_Y() { return "changeTurnAutoSetRadiusY"; }
    static get CON_CHANGE_PATH_DATA() { return "changePathData"; }
    static get CON_CHANGE_PATH_DATA_AUTO_SET() { return "changePathDataAutoSet"; }
    static get CON_CHANGE_PATH_DATA_FIT_MODE() { return "changePathDataFitMode"; }
    static get CON_CHANGE_PATH_DATA_START_MIDDLE_VALUE() { return "changePathDataStartMiddleValue"; }
    static get CON_CHANGE_PATH_DATA_STOP_MIDDLE_VALUE() { return "changePathDataStopMiddleValue"; }
    get marginX() {
        return this._marginX;
    }
    set marginX(value) {
        if (value != this._marginX) {
            this._marginX = value;
            this.doChange(CPositionParentAlignInfo.CON_CHANGE_MARGIN_X);
        }
    }
    get marginY() {
        return this._marginY;
    }
    set marginY(value) {
        if (value != this._marginY) {
            this._marginY = value;
            this.doChange(CPositionParentAlignInfo.CON_CHANGE_MARGIN_Y);
        }
    }
    get gridColumnCount() {
        return this._gridColumnCount;
    }
    set gridColumnCount(value) {
        if (value != this._gridColumnCount) {
            this._gridColumnCount = value;
            this.doChange(CPositionParentAlignInfo.CON_CHANGE_GRID_COLUMN_COUNT);
        }
    }
    get gridRowCount() {
        return this._gridRowCount;
    }
    set gridRowCount(value) {
        if (value != this._gridRowCount) {
            this._gridRowCount = value;
            this.doChange(CPositionParentAlignInfo.CON_CHANGE_GRID_ROW_COUNT);
        }
    }
    get turnCenter() {
        return this._turnCenter;
    }
    get turnAutoSet() {
        return this._turnAutoSet;
    }
    set turnAutoSet(value) {
        if (value != this._turnAutoSet) {
            this._turnAutoSet = value;
            this.doChange(CPositionParentAlignInfo.CON_CHANGE_TURN_AUTO_SET);
        }
    }
    get turnAutoSetStartAngle() {
        return this._turnAutoSetStartAngle;
    }
    set turnAutoSetStartAngle(value) {
        if (value != this._turnAutoSetStartAngle) {
            this._turnAutoSetStartAngle = value;
            this.doChange(CPositionParentAlignInfo.CON_CHANGE_TURN_AUTO_SET_START_ANGLE);
        }
    }
    get turnAutoSetStopAngle() {
        return this._turnAutoSetStopAngle;
    }
    set turnAutoSetStopAngle(value) {
        if (value != this._turnAutoSetStopAngle) {
            this._turnAutoSetStopAngle = value;
            this.doChange(CPositionParentAlignInfo.CON_CHANGE_TURN_AUTO_SET_STOP_ANGLE);
        }
    }
    get turnAutoSetRadiusX() {
        return this._turnAutoSetRadiusX;
    }
    set turnAutoSetRadiusX(value) {
        if (value != this._turnAutoSetRadiusX) {
            this._turnAutoSetRadiusX = value;
            this.doChange(CPositionParentAlignInfo.CON_CHANGE_TURN_AUTO_SET_RADIUS_X);
        }
    }
    get turnAutoSetRadiusY() {
        return this._turnAutoSetRadiusY;
    }
    set turnAutoSetRadiusY(value) {
        if (value != this._turnAutoSetRadiusY) {
            this._turnAutoSetRadiusY = value;
            this.doChange(CPositionParentAlignInfo.CON_CHANGE_TURN_AUTO_SET_RADIUS_Y);
        }
    }
    set turnAutoSetRadius(value) {
        this.turnAutoSetRadiusX = value;
        this.turnAutoSetRadiusY = value;
    }
    get pathData() {
        return this._pathData;
    }
    set pathData(value) {
        if (value != this._pathData) {
            this._pathData = value;
            this.doChange(CPositionParentAlignInfo.CON_CHANGE_PATH_DATA);
        }
    }
    get pathDataAutoSet() {
        return this._pathDataAutoSet;
    }
    set pathDataAutoSet(value) {
        if (value != this._pathDataAutoSet) {
            this._pathDataAutoSet = value;
            this.doChange(CPositionParentAlignInfo.CON_CHANGE_PATH_DATA_AUTO_SET);
        }
    }
    get pathDataFitMode() {
        return this._pathDataFitMode;
    }
    set pathDataFitMode(value) {
        if (value != this._pathDataFitMode) {
            this._pathDataFitMode = value;
            this.doChange(CPositionParentAlignInfo.CON_CHANGE_PATH_DATA_FIT_MODE);
        }
    }
    get pathDataStartMiddleValue() {
        return this._pathDataStartMiddleValue;
    }
    set pathDataStartMiddleValue(value) {
        if (value != this._pathDataStartMiddleValue) {
            this._pathDataStartMiddleValue = value;
            this.doChange(CPositionParentAlignInfo.CON_CHANGE_PATH_DATA_START_MIDDLE_VALUE);
        }
    }
    get pathDataStopMiddleValue() {
        return this._pathDataStopMiddleValue;
    }
    set pathDataStopMiddleValue(value) {
        if (value != this._pathDataStopMiddleValue) {
            this._pathDataStopMiddleValue = value;
            this.doChange(CPositionParentAlignInfo.CON_CHANGE_PATH_DATA_STOP_MIDDLE_VALUE);
        }
    }
    constructor() {
        super();
        this._marginX = 0;
        this._marginY = 0;
        this._gridColumnCount = 5;
        this._gridRowCount = -1;
        this._turnCenter = new CNotifyPoint(0.5, 0.5);
        this._turnAutoSet = false;
        this._turnAutoSetStartAngle = 0;
        this._turnAutoSetStopAngle = 360;
        this._turnAutoSetRadiusX = 100;
        this._turnAutoSetRadiusY = 100;
        this._pathData = "";
        this._pathDataAutoSet = false;
        this._pathDataFitMode = EFitMode.STRETCH;
        this._pathDataStartMiddleValue = 0;
        this._pathDataStopMiddleValue = 1;
        let self = this;
        this._turnCenter.onChange = function (sender, kind) {
            self.doChange(CPositionParentAlignInfo.CON_CHANGE_TURN_CENTER);
        };
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "marginX", this.marginX, 0);
        CDataClass.putData(data, "marginY", this.marginY, 0);
        CDataClass.putData(data, "gridColumnCount", this.gridColumnCount, 5);
        CDataClass.putData(data, "gridRowCount", this.gridRowCount, -1);
        CDataClass.putData(data, "turnCenter", this.turnCenter.toData(), { x: 0.5, y: 0.5 }, true);
        CDataClass.putData(data, "turnAutoSet", this.turnAutoSet, false);
        CDataClass.putData(data, "turnAutoSetStartAngle", this.turnAutoSetStartAngle, 0);
        CDataClass.putData(data, "turnAutoSetStopAngle", this.turnAutoSetStopAngle, 360);
        CDataClass.putData(data, "turnAutoSetRadiusX", this.turnAutoSetRadiusX, 100);
        CDataClass.putData(data, "turnAutoSetRadiusY", this.turnAutoSetRadiusY, 100);
        CDataClass.putData(data, "pathData", this.pathData, "");
        CDataClass.putData(data, "pathDataAutoSet", this.pathDataAutoSet, false);
        CDataClass.putData(data, "pathDataFitMode", this.pathDataFitMode, EFitMode.STRETCH);
        CDataClass.putData(data, "pathDataStartMiddleValue", this.pathDataStartMiddleValue, 0);
        CDataClass.putData(data, "pathDataStopMiddleValue", this.pathDataStopMiddleValue, 1);
    }
    doFromData(data) {
        super.doFromData(data);
        this.marginX = CDataClass.getData(data, "marginX", 0);
        this.marginY = CDataClass.getData(data, "marginY", 0);
        this.gridColumnCount = CDataClass.getData(data, "gridColumnCount", 5);
        this.gridRowCount = CDataClass.getData(data, "gridRowCount", -1);
        this.turnCenter.fromData(CDataClass.getData(data, "turnCenter", { x: 0.5, y: 0.5 }, true));
        this.turnAutoSet = CDataClass.getData(data, "turnAutoSet", false);
        this.turnAutoSetStartAngle = CDataClass.getData(data, "turnAutoSetStartAngle", 0);
        this.turnAutoSetStopAngle = CDataClass.getData(data, "turnAutoSetStopAngle", 360);
        this.turnAutoSetRadiusX = CDataClass.getData(data, "turnAutoSetRadiusX", 100);
        this.turnAutoSetRadiusY = CDataClass.getData(data, "turnAutoSetRadiusY", 100);
        this.pathData = CDataClass.getData(data, "pathData", "");
        this.pathDataAutoSet = CDataClass.getData(data, "pathDataAutoSet", false);
        this.pathDataFitMode = CDataClass.getData(data, "pathDataFitMode", EFitMode.STRETCH);
        this.pathDataStartMiddleValue = CDataClass.getData(data, "pathDataStartMiddleValue", 0);
        this.pathDataStopMiddleValue = CDataClass.getData(data, "pathDataStopMiddleValue", 1);
    }
    copyFrom(src) {
        this.marginX = src.marginX;
        this.marginY = src.marginY;
        this.gridColumnCount = src.gridColumnCount;
        this.gridRowCount = src.gridRowCount;
        this.turnCenter.x = src.turnCenter.x;
        this.turnCenter.y = src.turnCenter.y;
        this.turnAutoSet = src.turnAutoSet;
        this.turnAutoSetStartAngle = src.turnAutoSetStartAngle;
        this.turnAutoSetStopAngle = src.turnAutoSetStopAngle;
        this.turnAutoSetRadiusX = src.turnAutoSetRadiusX;
        this.turnAutoSetRadiusY = src.turnAutoSetRadiusY;
        this.pathData = src.pathData;
        this.pathDataAutoSet = src.pathDataAutoSet;
        this.pathDataFitMode = src.pathDataFitMode;
        this.pathDataStartMiddleValue = src.pathDataStartMiddleValue;
        this.pathDataStopMiddleValue = src.pathDataStopMiddleValue;
    }
}
class CTransform extends CNotifyChangeKindObject {
    constructor() {
        super(...arguments);
        this._translateX = 0;
        this._translateY = 0;
        this._translateZ = 0;
        this._scaleX = 1;
        this._scaleY = 1;
        this._scaleZ = 1;
        this._rotationPointX = 0.5;
        this._rotationPointY = 0.5;
        this._rotationPointZ = 0;
        this._rotateX = 0;
        this._rotateY = 0;
        this._rotateZ = 0;
        this._perspective = 1000;
        this._perspectiveX = 0.5;
        this._perspectiveY = 0.5;
    }
    static get CON_CHANGE_SCALE_X() { return "changeScaleX"; }
    static get CON_CHANGE_SCALE_Y() { return "changeScaleY"; }
    static get CON_CHANGE_SCALE_Z() { return "changeScaleZ"; }
    static get CON_CHANGE_ROTATION_POINT_X() { return "changeRotaionPointX"; }
    static get CON_CHANGE_ROTATION_POINT_Y() { return "changeRotaionPointY"; }
    static get CON_CHANGE_ROTATION_POINT_Z() { return "changeRotaionPointZ"; }
    static get CON_CHANGE_TRANSLATE_X() { return "changeTranslateX"; }
    static get CON_CHANGE_TRANSLATE_Y() { return "changeTranslateY"; }
    static get CON_CHANGE_TRANSLATE_Z() { return "changeTranslateZ"; }
    static get CON_CHANGE_ROTATE_X() { return "changeRotateX"; }
    static get CON_CHANGE_ROTATE_Y() { return "changeRotateY"; }
    static get CON_CHANGE_ROTATE_Z() { return "changeRotateZ"; }
    static get CON_CHANGE_PERSPECTIVE() { return "changePerspective"; }
    static get CON_CHANGE_PERSPECTIVE_X() { return "changePerspectiveX"; }
    static get CON_CHANGE_PERSPECTIVE_Y() { return "changePerspectiveY"; }
    get translateX() {
        return this._translateX;
    }
    set translateX(value) {
        if (this._translateX != value) {
            this._translateX = value;
            this.doChange(CTransform.CON_CHANGE_TRANSLATE_X);
        }
    }
    get translateY() {
        return this._translateY;
    }
    set translateY(value) {
        if (this._translateY != value) {
            this._translateY = value;
            this.doChange(CTransform.CON_CHANGE_TRANSLATE_Y);
        }
    }
    get translateZ() {
        return this._translateZ;
    }
    set translateZ(value) {
        if (this._translateZ != value) {
            this._translateZ = value;
            this.doChange(CTransform.CON_CHANGE_TRANSLATE_Z);
        }
    }
    get scaleX() {
        return this._scaleX;
    }
    set scaleX(value) {
        if (this._scaleX != value) {
            this._scaleX = value;
            this.doChange(CTransform.CON_CHANGE_SCALE_X);
        }
    }
    get scaleY() {
        return this._scaleY;
    }
    set scaleY(value) {
        if (this._scaleY != value) {
            this._scaleY = value;
            this.doChange(CTransform.CON_CHANGE_SCALE_Y);
        }
    }
    get scaleZ() {
        return this._scaleZ;
    }
    set scaleZ(value) {
        if (this._scaleZ != value) {
            this._scaleZ = value;
            this.doChange(CTransform.CON_CHANGE_SCALE_Z);
        }
    }
    get scale() {
        return (this._scaleX + this._scaleY + this._scaleZ) / 3;
    }
    set scale(value) {
        this.scaleX = value;
        this.scaleY = value;
        this.scaleZ = value;
    }
    get rotationPointX() {
        return this._rotationPointX;
    }
    set rotationPointX(value) {
        if (this._rotationPointX != value) {
            this._rotationPointX = value;
            this.doChange(CTransform.CON_CHANGE_ROTATION_POINT_X);
        }
    }
    get rotationPointY() {
        return this._rotationPointY;
    }
    set rotationPointY(value) {
        if (this._rotationPointY != value) {
            this._rotationPointY = value;
            this.doChange(CTransform.CON_CHANGE_ROTATION_POINT_Y);
        }
    }
    get rotationPointZ() {
        return this._rotationPointZ;
    }
    set rotationPointZ(value) {
        if (this._rotationPointZ != value) {
            this._rotationPointZ = value;
            this.doChange(CTransform.CON_CHANGE_ROTATION_POINT_Z);
        }
    }
    get rotateX() {
        return this._rotateX;
    }
    set rotateX(value) {
        if (this._rotateX != value) {
            this._rotateX = value;
            this.doChange(CTransform.CON_CHANGE_ROTATE_X);
        }
    }
    get rotateY() {
        return this._rotateY;
    }
    set rotateY(value) {
        if (this._rotateY != value) {
            this._rotateY = value;
            this.doChange(CTransform.CON_CHANGE_ROTATE_Y);
        }
    }
    get rotateZ() {
        return this._rotateZ;
    }
    set rotateZ(value) {
        if (this._rotateZ != value) {
            this._rotateZ = value;
            this.doChange(CTransform.CON_CHANGE_ROTATE_Z);
        }
    }
    get perspective() {
        return this._perspective;
    }
    set perspective(value) {
        if (this._perspective != value) {
            this._perspective = value;
            this.doChange(CTransform.CON_CHANGE_PERSPECTIVE);
        }
    }
    get perspectiveX() {
        return this._perspectiveX;
    }
    set perspectiveX(value) {
        if (this._perspectiveX != value) {
            this._perspectiveX = value;
            this.doChange(CTransform.CON_CHANGE_PERSPECTIVE_X);
        }
    }
    get perspectiveY() {
        return this._perspectiveY;
    }
    set perspectiveY(value) {
        if (this._perspectiveY != value) {
            this._perspectiveY = value;
            this.doChange(CTransform.CON_CHANGE_PERSPECTIVE_Y);
        }
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "translateX", this.translateX, 0);
        CDataClass.putData(data, "translateY", this.translateY, 0);
        CDataClass.putData(data, "translateZ", this.translateZ, 0);
        CDataClass.putData(data, "scaleX", this.scaleX, 1);
        CDataClass.putData(data, "scaleY", this.scaleY, 1);
        CDataClass.putData(data, "scaleZ", this.scaleZ, 1);
        CDataClass.putData(data, "rotateX", this.rotateX, 0);
        CDataClass.putData(data, "rotateY", this.rotateY, 0);
        CDataClass.putData(data, "rotateZ", this.rotateZ, 0);
        CDataClass.putData(data, "perspective", this.perspective, 1000);
        CDataClass.putData(data, "perspectiveX", this.perspectiveX, 0.5);
        CDataClass.putData(data, "perspectiveY", this.perspectiveY, 0.5);
        CDataClass.putData(data, "rotationPointX", this.rotationPointX, 0.5);
        CDataClass.putData(data, "rotationPointY", this.rotationPointY, 0.5);
        CDataClass.putData(data, "rotationPointZ", this.rotationPointZ, 0);
    }
    doFromData(data) {
        super.doFromData(data);
        this.translateX = CDataClass.getData(data, "translateX", 0);
        this.translateY = CDataClass.getData(data, "translateY", 0);
        this.translateZ = CDataClass.getData(data, "translateZ", 0);
        this.scaleX = CDataClass.getData(data, "scaleX", 1);
        this.scaleY = CDataClass.getData(data, "scaleY", 1);
        this.scaleZ = CDataClass.getData(data, "scaleZ", 1);
        this.rotateX = CDataClass.getData(data, "rotateX", 0);
        this.rotateY = CDataClass.getData(data, "rotateY", 0);
        this.rotateZ = CDataClass.getData(data, "rotateZ", 0);
        this.perspective = CDataClass.getData(data, "perspective", 1000);
        this.perspectiveX = CDataClass.getData(data, "perspectiveX", 0.5);
        this.perspectiveY = CDataClass.getData(data, "perspectiveY", 0.5);
        this.rotationPointX = CDataClass.getData(data, "rotationPointX", 0.5);
        this.rotationPointY = CDataClass.getData(data, "rotationPointY", 0.5);
        this.rotationPointZ = CDataClass.getData(data, "rotationPointZ", 0);
    }
    doChange(kind) {
        super.doChange(kind);
        if (CCalc.isIn(kind, [
            CTransform.CON_CHANGE_TRANSLATE_X,
            CTransform.CON_CHANGE_TRANSLATE_Y,
            CTransform.CON_CHANGE_TRANSLATE_Z
        ])) {
            this.doChangeTranslate();
        }
        if (CCalc.isIn(kind, [
            CTransform.CON_CHANGE_ROTATE_X,
            CTransform.CON_CHANGE_ROTATE_Y,
            CTransform.CON_CHANGE_ROTATE_Z
        ])) {
            this.doChangeRotation();
        }
        if (CCalc.isIn(kind, [
            CTransform.CON_CHANGE_SCALE_X,
            CTransform.CON_CHANGE_SCALE_Y,
            CTransform.CON_CHANGE_SCALE_Z
        ])) {
            this.doChangeScale();
        }
        if (CCalc.isIn(kind, [
            CTransform.CON_CHANGE_PERSPECTIVE,
            CTransform.CON_CHANGE_PERSPECTIVE_X,
            CTransform.CON_CHANGE_PERSPECTIVE_Y
        ])) {
            this.doChangePerspectiveInfo();
        }
    }
    doChangeRotationPoint() {
        if (this.useChangeEvent && this.onChangeRotationPoint) {
            this.onChangeRotationPoint(this);
        }
    }
    doChangeTranslate() {
        if (this.useChangeEvent && this.onChangeTranslate != undefined) {
            this.onChangeTranslate(this);
        }
    }
    doChangeRotation() {
        if (this.useChangeEvent && this.onChangeRotation != undefined) {
            this.onChangeRotation(this);
        }
    }
    doChangeScale() {
        if (this.useChangeEvent && this.onChangeScale != undefined) {
            this.onChangeScale(this);
        }
    }
    doChangePerspectiveInfo() {
        if (this.useChangeEvent && this.onChangePerspectiveInfo != undefined) {
            this.onChangePerspectiveInfo(this);
        }
    }
    setTransform(element) {
        if (this.rotationPointZ == 0) {
            element.style.transformOrigin = this.rotationPointX * 100 + "% " + this.rotationPointY * 100 + "%";
        }
        else {
            element.style.transformOrigin = this.rotationPointX * 100 + "% " + this.rotationPointY * 100 + "% " + this.rotationPointZ * 100 + "px";
        }
        element.style.transform = "translateX(" + this._translateX + "px) translateY(" + this._translateY + "px) translateZ(" + this._translateZ + "px) scaleX(" + this._scaleX + ") scaleY(" + this._scaleY + ") scaleZ(" + this._scaleZ + ") rotateX(" + this._rotateX + "deg) rotateY(" + this._rotateY + "deg) rotateZ(" + this._rotateZ + "deg)";
        element.style.perspective = this._perspective + "px";
        element.style.perspectiveOrigin = this._perspectiveX * 100 + "% " + this._perspectiveY * 100 + "%";
    }
    translatePoint(angle, zAngle, radius) {
        let pt = new CPoint3D(this.translateX, this.translateY, this.translateZ);
        let ptbb = CPoint3D.getAngleToPoint3D(pt, angle, zAngle, radius);
        this.translateX = ptbb.x;
        this.translateY = ptbb.y;
        this.translateZ = ptbb.z;
    }
}
class CPosition extends CNotifyChangeKindObject {
    static get CON_CHANGE_ALIGN() { return "changeAlign"; }
    static get CON_CHANGE_LEFT() { return "changeLeft"; }
    static get CON_CHANGE_TOP() { return "changeTop"; }
    static get CON_CHANGE_WIDTH() { return "changeWidth"; }
    static get CON_CHANGE_HEIGHT() { return "changeHeight"; }
    static get CON_CHANGE_MARGINS() { return "changeMargins"; }
    static get CON_CHANGE_PADDING() { return "changePadding"; }
    static get CON_CHANGE_ALIGN_INFO() { return "changeAlignInfo"; }
    static get CON_CHANGE_PARENT_ALIGN_INFO() { return "changeParentAlignInfo"; }
    constructor() {
        super();
        this._align = EPositionAlign.NONE;
        this._left = 0;
        this._top = 0;
        this._width = 0;
        this._height = 0;
        this._margins = new CNotifyRect();
        this._padding = new CNotifyRect();
        this._alignInfo = new CPositionAlignInfo();
        this._parentAlignInfo = new CPositionParentAlignInfo();
        let self = this;
        this._margins.onChange = function () {
            self.doChange(CPosition.CON_CHANGE_MARGINS);
        };
        this._padding.onChange = function () {
            self.doChange(CPosition.CON_CHANGE_PADDING);
        };
        this._alignInfo.onChange = function () {
            self.doChange(CPosition.CON_CHANGE_ALIGN_INFO);
        };
        this._parentAlignInfo.onChange = function () {
            self.doChange(CPosition.CON_CHANGE_PARENT_ALIGN_INFO);
        };
    }
    get align() {
        return this._align;
    }
    set align(value) {
        if (this._align != value) {
            this._align = value;
            this.doChange(CPosition.CON_CHANGE_ALIGN);
        }
    }
    get left() {
        return this._left;
    }
    set left(value) {
        if (this._left != value) {
            this._left = value;
            this.doChange(CPosition.CON_CHANGE_LEFT);
        }
    }
    set leftNotNofity(value) {
        this._left = value;
    }
    get top() {
        return this._top;
    }
    set top(value) {
        if (this._top != value) {
            this._top = value;
            this.doChange(CPosition.CON_CHANGE_TOP);
        }
    }
    set topNotNofity(value) {
        this._top = value;
    }
    get width() {
        return this._width;
    }
    set width(value) {
        if (this._width != value) {
            this._width = value;
            this.doChange(CPosition.CON_CHANGE_WIDTH);
        }
    }
    set widthNotNofity(value) {
        this._width = value;
    }
    get height() {
        return this._height;
    }
    set height(value) {
        if (this._height != value) {
            this._height = value;
            this.doChange(CPosition.CON_CHANGE_HEIGHT);
        }
    }
    set heightNotNofity(value) {
        this._height = value;
    }
    get right() {
        return this.left + this.width;
    }
    get alignInfo() {
        return this._alignInfo;
    }
    get parentAlignInfo() {
        return this._parentAlignInfo;
    }
    get bottom() {
        return this.top + this.height;
    }
    get leftTop() {
        return new CPoint(this.left, this.top);
    }
    get rightTop() {
        return new CPoint(this.right, this.top);
    }
    get leftBottom() {
        return new CPoint(this.left, this.bottom);
    }
    get rightBottom() {
        return new CPoint(this.right, this.bottom);
    }
    get margins() {
        return this._margins;
    }
    get padding() {
        return this._padding;
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "align", this.align, EPositionAlign.NONE);
        CDataClass.putData(data, "left", this.left, 0);
        CDataClass.putData(data, "top", this.top, 0);
        CDataClass.putData(data, "width", this.width, 0);
        CDataClass.putData(data, "height", this.height, 0);
        CDataClass.putData(data, "margins", this.margins.toData(), {}, true);
        CDataClass.putData(data, "padding", this.padding.toData(), {}, true);
        CDataClass.putData(data, "alignInfo", this.alignInfo.toData(), {}, true);
        CDataClass.putData(data, "parentAlignInfo", this.parentAlignInfo.toData(), {}, true);
    }
    doFromData(data) {
        super.doFromData(data);
        this.align = CDataClass.getData(data, "align", EPositionAlign.NONE);
        this.left = CDataClass.getData(data, "left", 0);
        this.top = CDataClass.getData(data, "top", 0);
        this.width = CDataClass.getData(data, "width", 0);
        this.height = CDataClass.getData(data, "height", 0);
        this.margins.fromData(CDataClass.getData(data, "margins", {}, true));
        this.padding.fromData(CDataClass.getData(data, "padding", {}, true));
        this.alignInfo.fromData(CDataClass.getData(data, "alignInfo", {}, true));
        this.parentAlignInfo.fromData(CDataClass.getData(data, "parentAlignInfo", {}, true));
    }
    doChange(kind) {
        if (kind == CPosition.CON_CHANGE_ALIGN) {
            this.doChangeAlign();
        }
        if (kind == CPosition.CON_CHANGE_ALIGN_INFO) {
            this.doChangeAlignInfo();
        }
        if (kind == CPosition.CON_CHANGE_PARENT_ALIGN_INFO) {
            this.doChangeParentAlignInfo();
        }
        if (CCalc.isIn(kind, [
            CPosition.CON_CHANGE_LEFT,
            CPosition.CON_CHANGE_TOP
        ])) {
            this.doChangePosition();
        }
        if (CCalc.isIn(kind, [
            CPosition.CON_CHANGE_WIDTH,
            CPosition.CON_CHANGE_HEIGHT
        ])) {
            this.doChangeSize();
        }
        if (kind == CPosition.CON_CHANGE_MARGINS) {
            this.doChangeMargins();
        }
        if (kind == CPosition.CON_CHANGE_PADDING) {
            this.doChangePadding();
        }
        super.doChange(kind);
    }
    doChangeAlign() {
        if (this.useChangeEvent && this.onChangeAlign != undefined) {
            this.onChangeAlign(this);
        }
    }
    doChangeAlignInfo() {
        if (this.useChangeEvent && this.onChangeAlignInfo != undefined) {
            this.onChangeAlignInfo(this);
        }
    }
    doChangeParentAlignInfo() {
        if (this.useChangeEvent && this.onChangeParentAlignInfo != undefined) {
            this.onChangeParentAlignInfo(this);
        }
    }
    doChangePosition() {
        if (this.useChangeEvent && this.onChangePosition != undefined) {
            this.onChangePosition(this);
        }
    }
    doChangeSize() {
        if (this.useChangeEvent && this.onChangeSize != undefined) {
            this.onChangeSize(this);
        }
    }
    doChangeMargins() {
        if (this.useChangeEvent && this.onChangeMargins != undefined) {
            this.onChangeMargins(this);
        }
    }
    doChangePadding() {
        if (this.useChangeEvent && this.onChangePadding != undefined) {
            this.onChangePadding(this);
        }
    }
    isRelativeAlign() {
        return CCalc.isIn(this._align, [
            EPositionAlign.LEFT,
            EPositionAlign.TOP,
            EPositionAlign.RIGHT,
            EPositionAlign.BOTTOM,
            EPositionAlign.CLIENT,
            EPositionAlign.FLOW
        ]);
    }
    toRect() {
        return new CRect(this.left, this.top, this.left + this.width, this.top + this.height);
    }
    enumProperties() {
        let rt = new Map();
        rt.set("align", CEnum.toArray(EPositionAlign));
        return rt;
    }
    equalRect(rect) {
        return this.left == rect.left && this.top == rect.top && this.width == rect.width && this.height == rect.height;
    }
    static getAlignPixelBounds(parent, brothers, position) {
        let r = new CPosition();
        let p = position;
        if (position.align == EPositionAlign.NONE) {
            r.left = position.left;
            r.top = position.top;
            r.width = position.width;
            r.height = position.height;
            return r;
        }
        if (position.align == EPositionAlign.CENTER) {
            r.left = (parent.width - position.width) / 2;
            r.top = (parent.height - position.height) / 2;
            r.width = position.width;
            r.height = position.height;
            return r;
        }
        if (position.align == EPositionAlign.PARENT_SIZE) {
            r.left = 0;
            r.top = 0;
            r.width = parent.width;
            r.height = parent.height;
            return r;
        }
        if (position.align == EPositionAlign.LEFTTOP) {
            r.left = parent.padding.left + p.margins.left;
            r.top = parent.padding.top + p.margins.top;
            r.width = p.width;
            r.height = p.height;
            return r;
        }
        if (position.align == EPositionAlign.RIGHTTOP) {
            r.left = parent.width - p.width - p.margins.right - parent.padding.right;
            r.top = parent.padding.top + p.margins.top;
            r.width = p.width;
            r.height = p.height;
            return r;
        }
        if (position.align == EPositionAlign.LEFTBOTTOM) {
            r.left = p.margins.left + parent.padding.left;
            r.top = parent.height - p.height - p.margins.bottom - parent.padding.bottom;
            r.width = p.width;
            r.height = p.height;
            return r;
        }
        if (position.align == EPositionAlign.RIGHTBOTTOM) {
            r.left = parent.width - p.width - p.margins.right - parent.padding.right;
            r.top = parent.height - p.height - p.margins.bottom - parent.padding.bottom;
            r.width = p.width;
            r.height = p.height;
            return r;
        }
        if (position.align == EPositionAlign.MIDDLELEFT) {
            r.left = p.margins.left + parent.padding.left;
            r.top = (parent.height - p.height) / 2;
            r.width = p.width;
            r.height = p.height;
            return r;
        }
        if (position.align == EPositionAlign.MIDDLETOP) {
            r.left = (parent.width - p.width) / 2;
            r.top = p.margins.top + parent.padding.top;
            r.width = p.width;
            r.height = p.height;
            return r;
        }
        if (position.align == EPositionAlign.MIDDLERIGHT) {
            r.left = parent.width - p.width - p.margins.right - parent.padding.right;
            r.top = (parent.height - p.height) / 2;
            r.width = p.width;
            r.height = p.height;
            return r;
        }
        if (position.align == EPositionAlign.MIDDLEBOTTOM) {
            r.left = (parent.width - p.width) / 2;
            r.top = parent.height - p.height - p.margins.bottom - parent.padding.bottom;
            r.width = p.width;
            r.height = p.height;
            return r;
        }
        if (position.align == EPositionAlign.HCENTER) {
            r.left = (parent.width - p.width) / 2;
            r.top = p.margins.top + parent.padding.top;
            r.height = parent.height - p.margins.top - p.margins.bottom - parent.padding.bottom;
            r.width = p.width;
            return r;
        }
        if (position.align == EPositionAlign.VCENTER) {
            r.left = p.margins.left + parent.padding.left;
            r.top = (parent.height - p.height) / 2;
            r.width = parent.width - p.margins.left - p.margins.right - parent.padding.right;
            r.height = p.height;
            return r;
        }
        if (position.align == EPositionAlign.TURN) {
            let px = parent.width * parent.parentAlignInfo.turnCenter.x;
            let py = parent.height * parent.parentAlignInfo.turnCenter.y;
            if (parent.parentAlignInfo.turnAutoSet) {
                let idx = -1;
                let arr = new Array();
                for (let n = 0; n < brothers.length; n++) {
                    if (brothers[n].align == EPositionAlign.TURN) {
                        arr.push(brothers[n]);
                    }
                }
                for (let n = 0; n < arr.length; n++) {
                    if (arr[n] == position) {
                        idx = n;
                        break;
                    }
                }
                if (idx != -1) {
                    let ang = CCalc.crRange2Value(0, arr.length - 1, idx, parent.parentAlignInfo.turnAutoSetStartAngle, parent.parentAlignInfo.turnAutoSetStopAngle);
                    let ppp = CPoint.getAngleToPoint(new CPoint(px, py), parent.parentAlignInfo.turnAutoSetRadiusX, parent.parentAlignInfo.turnAutoSetRadiusY, ang);
                    r.left = ppp.x - (p.width / 2);
                    r.top = ppp.y - (p.height / 2);
                }
            }
            else {
                let ppp = CPoint.getAngleToPoint(new CPoint(px, py), p.alignInfo.turnRadiusX, p.alignInfo.turnRadiusY, p.alignInfo.turnAngle);
                r.left = ppp.x - (p.width / 2);
                r.top = ppp.y - (p.height / 2);
            }
            r.width = p.width;
            r.height = p.height;
            return r;
        }
        if (position.align == EPositionAlign.PATHDATA) {
            if (parent.parentAlignInfo.pathDataAutoSet) {
                let pointsdata = CSystem.resources.get(parent.parentAlignInfo.pathData);
                if (pointsdata != undefined) {
                    let poidx = -1;
                    let arr = new Array();
                    for (let n = 0; n < brothers.length; n++) {
                        if (brothers[n].align == EPositionAlign.PATHDATA) {
                            arr.push(brothers[n]);
                        }
                    }
                    for (let n = 0; n < arr.length; n++) {
                        if (arr[n] == position) {
                            poidx = n;
                            break;
                        }
                    }
                    let mv = CCalc.crRange2Value(0, arr.length - 1, poidx, parent.parentAlignInfo.pathDataStartMiddleValue, parent.parentAlignInfo.pathDataStopMiddleValue);
                    if (!isNaN(mv)) {
                        let idx = Math.floor(CCalc.cr(pointsdata.points.length - 1, 0, 1, mv, 2));
                        if (parent.parentAlignInfo.pathDataFitMode == EFitMode.FIT) {
                            let rt = new CRect(0, 0, parent.width, parent.height);
                            let rt2 = new CRect(0, 0, 50, 50);
                            rt2 = rt.getFitRect(rt2, true);
                            r.left = ((pointsdata.points[idx].x * rt2.width) + rt2.left) - (p.width / 2);
                            r.top = ((pointsdata.points[idx].y * rt2.height) + rt2.top) - (p.height / 2);
                        }
                        else {
                            r.left = pointsdata.points[idx].x * parent.width - (p.width / 2);
                            r.top = pointsdata.points[idx].y * parent.height - (p.height / 2);
                        }
                        r.width = p.width;
                        r.height = p.height;
                        return r;
                    }
                }
            }
            else {
                let pointsdata = CSystem.resources.get(parent.parentAlignInfo.pathData);
                if (pointsdata != undefined) {
                    let mv = p.alignInfo.pathMiddleValue;
                    if (mv > 1) {
                        mv = 1;
                    }
                    let idx = Math.floor(CCalc.cr(pointsdata.points.length - 1, 0, 1, mv, 2));
                    if (parent.parentAlignInfo.pathDataFitMode == EFitMode.FIT) {
                        let rt = new CRect(0, 0, parent.width, parent.height);
                        let rt2 = new CRect(0, 0, 50, 50);
                        rt2 = rt.getFitRect(rt2, true);
                        r.left = (pointsdata.points[idx].points.x * rt2.width) + rt2.left;
                        r.top = (pointsdata.points[idx].y * rt2.height) + rt2.top;
                    }
                    else {
                        r.left = pointsdata.points[idx].x * parent.width;
                        r.top = pointsdata.points[idx].y * parent.height;
                    }
                    r.width = p.width;
                    r.height = p.height;
                    return r;
                }
            }
        }
        if (position.align == EPositionAlign.GRID) {
            let cols = parent.parentAlignInfo.gridColumnCount;
            let rows = parent.parentAlignInfo.gridRowCount;
            if (cols <= 0) {
                return r;
            }
            else {
                let cw = (parent.width - ((cols - 1) * parent.parentAlignInfo.marginX) - parent.padding.left - parent.padding.right) / cols;
                let rh = 0;
                if (rows <= 0) {
                    rh = p.alignInfo.gridRowHeight;
                }
                else {
                    rh = (parent.height - ((rows - 1) * parent.parentAlignInfo.marginY) - parent.padding.top - parent.padding.bottom) / rows;
                }
                r.left = (p.alignInfo.gridColumn * cw) + (p.alignInfo.gridColumn * parent.parentAlignInfo.marginX) + parent.padding.left;
                r.top = (p.alignInfo.gridRow * rh) + (p.alignInfo.gridRow * parent.parentAlignInfo.marginY) + parent.padding.top;
                r.width = cw;
                r.height = rh;
                return r;
            }
        }
        let left = new Array();
        let top = new Array();
        let right = new Array();
        let bottom = new Array();
        let flow = new Array();
        let leftsum = parent.padding.left;
        let topsum = parent.padding.top;
        let rightsum = parent.padding.right;
        let bottomsum = parent.padding.bottom;
        let bL = true;
        let bT = true;
        let bR = true;
        let bB = true;
        let bF = true;
        for (let n = 0; n < brothers.length; n++) {
            if (brothers[n].align == EPositionAlign.LEFT && bL) {
                if (brothers[n] == p) {
                    bL = false;
                    continue;
                }
                left.push(brothers[n]);
                leftsum += brothers[n].margins.left + brothers[n].width + brothers[n].margins.right;
            }
            if (brothers[n].align == EPositionAlign.TOP && bT) {
                if (brothers[n] == p) {
                    bT = false;
                    continue;
                }
                top.push(brothers[n]);
                topsum += brothers[n].margins.top + brothers[n].height + brothers[n].margins.bottom;
            }
            if (brothers[n].align == EPositionAlign.RIGHT && bR) {
                if (brothers[n] == p) {
                    bR = false;
                    continue;
                }
                right.push(brothers[n]);
                rightsum += brothers[n].margins.left + brothers[n].width + brothers[n].margins.right;
            }
            if (brothers[n].align == EPositionAlign.BOTTOM && bB) {
                if (brothers[n] == p) {
                    bB = false;
                    continue;
                }
                bottom.push(brothers[n]);
                bottomsum += brothers[n].margins.top + brothers[n].height + brothers[n].margins.bottom;
            }
            if (brothers[n].align == EPositionAlign.FLOW && bF) {
                if (brothers[n] == p) {
                    bF = false;
                    continue;
                }
                flow.push(brothers[n]);
            }
        }
        if (position.align == EPositionAlign.LEFT) {
            r.left = leftsum + p.margins.left;
            r.width = p.width;
            r.top = topsum + p.margins.top;
            r.height = parent.height - bottomsum - topsum - p.margins.top - p.margins.bottom;
        }
        if (position.align == EPositionAlign.TOP) {
            r.left = parent.padding.left + p.margins.left;
            r.top = topsum + p.margins.top;
            r.width = parent.width - p.margins.left - p.margins.right - parent.padding.left - parent.padding.right;
            r.height = p.height;
        }
        if (position.align == EPositionAlign.RIGHT) {
            r.left = parent.width - p.width - rightsum - p.margins.right;
            r.top = topsum + p.margins.top;
            r.height = parent.height - bottomsum - topsum - p.margins.top - p.margins.bottom;
            r.width = p.width;
        }
        if (position.align == EPositionAlign.BOTTOM) {
            r.left = parent.padding.left + p.margins.left;
            r.top = parent.height - p.height - bottomsum - p.margins.bottom;
            r.width = parent.width - p.margins.left - p.margins.right - parent.padding.left - parent.padding.right;
            r.height = p.height;
        }
        if (position.align == EPositionAlign.CLIENT) {
            r.left = leftsum + p.margins.left;
            r.top = topsum + p.margins.top;
            r.width = parent.width - rightsum - leftsum - p.margins.left - p.margins.right;
            r.height = parent.height - bottomsum - topsum - p.margins.top - p.margins.bottom;
        }
        if (position.align == EPositionAlign.FLOW) {
            let fx = parent.parentAlignInfo.marginX;
            let fy = parent.parentAlignInfo.marginY;
            let xf = parent.padding.left + fx;
            let x = xf;
            let y = parent.padding.top + fy;
            let pw = parent.width;
            let maxH = 0;
            for (let n = 0; n < flow.length; n++) {
                if (x + flow[n].width >= pw) {
                    x = xf;
                    y += fy + maxH;
                    maxH = 0;
                }
                if (maxH < flow[n].height) {
                    maxH = flow[n].height;
                }
                x += flow[n].width + fx;
            }
            if (x + p.width >= pw) {
                x = xf;
                y += fy + maxH;
            }
            r.left = x;
            r.top = y;
            r.width = p.width;
            r.height = p.height;
        }
        return r;
    }
    static getElementBounds(element) {
        let r = new CPosition();
        r.left = element.offsetLeft;
        r.top = element.offsetTop;
        r.width = element.offsetWidth;
        r.height = element.offsetHeight;
        return r;
    }
}
class CStopPropagationInfo extends CNotifyChangeKindObject {
    constructor() {
        super(...arguments);
        this._down = false;
        this._move = false;
        this._up = false;
        this._cancel = false;
        this._over = false;
        this._out = false;
        this._enter = false;
        this._leave = false;
        this._keyboard = false;
        this._wheel = false;
    }
    static get CON_CHANGE_DOWN() { return "d"; }
    static get CON_CHANGE_MOVE() { return "m"; }
    static get CON_CHANGE_UP() { return "u"; }
    static get CON_CHANGE_CANCEL() { return "c"; }
    static get CON_CHANGE_OVER() { return "ov"; }
    static get CON_CHANGE_OUT() { return "ou"; }
    static get CON_CHANGE_ENTER() { return "e"; }
    static get CON_CHANGE_LEAVE() { return "l"; }
    static get CON_CHANGE_KEYBOARD() { return "k"; }
    get down() {
        return this._down;
    }
    set down(value) {
        if (this._down != value) {
            this._down = value;
            this.doChange(CStopPropagationInfo.CON_CHANGE_DOWN);
        }
    }
    get move() {
        return this._move;
    }
    set move(value) {
        if (this._move != value) {
            this._move = value;
            this.doChange(CStopPropagationInfo.CON_CHANGE_MOVE);
        }
    }
    get up() {
        return this._up;
    }
    set up(value) {
        if (this._up != value) {
            this._up = value;
            this.doChange(CStopPropagationInfo.CON_CHANGE_UP);
        }
    }
    get cancel() {
        return this._cancel;
    }
    set cancel(value) {
        if (this._cancel != value) {
            this._cancel = value;
            this.doChange(CStopPropagationInfo.CON_CHANGE_CANCEL);
        }
    }
    get over() {
        return this._over;
    }
    set over(value) {
        if (this._over != value) {
            this._over = value;
            this.doChange(CStopPropagationInfo.CON_CHANGE_OVER);
        }
    }
    get out() {
        return this._out;
    }
    set out(value) {
        if (this._out != value) {
            this._out = value;
            this.doChange(CStopPropagationInfo.CON_CHANGE_OUT);
        }
    }
    get enter() {
        return this._enter;
    }
    set enter(value) {
        if (this._enter != value) {
            this._enter = value;
            this.doChange(CStopPropagationInfo.CON_CHANGE_ENTER);
        }
    }
    get leave() {
        return this._leave;
    }
    set leave(value) {
        if (this._leave != value) {
            this._leave = value;
            this.doChange(CStopPropagationInfo.CON_CHANGE_LEAVE);
        }
    }
    get keyboard() {
        return this._keyboard;
    }
    set keyboard(value) {
        if (this._keyboard != value) {
            this._keyboard = value;
            this.doChange(CStopPropagationInfo.CON_CHANGE_KEYBOARD);
        }
    }
    get wheel() {
        return this._wheel;
    }
    set wheel(value) {
        if (this._wheel != value) {
            this._wheel = value;
            this.doChange("wheel");
        }
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "down", this.down, false);
        CDataClass.putData(data, "move", this.move, false);
        CDataClass.putData(data, "up", this.up, false);
        CDataClass.putData(data, "cancel", this.cancel, false);
        CDataClass.putData(data, "over", this.over, false);
        CDataClass.putData(data, "out", this.out, false);
        CDataClass.putData(data, "enter", this.enter, false);
        CDataClass.putData(data, "leave", this.leave, false);
        CDataClass.putData(data, "keyboard", this.keyboard, false);
        CDataClass.putData(data, "wheel", this.wheel, false);
    }
    doFromData(data) {
        super.doFromData(data);
        this.down = CDataClass.getData(data, "down", false);
        this.move = CDataClass.getData(data, "move", false);
        this.up = CDataClass.getData(data, "up", false);
        this.cancel = CDataClass.getData(data, "cancel", false);
        this.over = CDataClass.getData(data, "over", false);
        this.out = CDataClass.getData(data, "out", false);
        this.enter = CDataClass.getData(data, "enter", false);
        this.leave = CDataClass.getData(data, "leave", false);
        this.keyboard = CDataClass.getData(data, "keyboard", false);
        this.wheel = CDataClass.getData(data, "wheel", false);
    }
}
class CFilterSet extends CNotifyChangeKindObject {
    constructor() {
        super(...arguments);
        this._blur = false;
        this._brightness = false;
        this._contrast = false;
        this._shadow = false;
        this._grayscale = false;
        this._hueRotate = false;
        this._invert = false;
        this._opacity = false;
    }
    static get CON_CHANGE_BLUR() { return "changeBlur"; }
    static get CON_CHANGE_BRIGHTNESS() { return "changeBrightness"; }
    static get CON_CHANGE_CONTRAST() { return "changeContrast"; }
    static get CON_CHANGE_SHADOW() { return "changeShadow"; }
    static get CON_CHANGE_GRAYSCALE() { return "changeGrayscale"; }
    static get CON_CHANGE_HUE_ROTATION() { return "changeHueRotaion"; }
    static get CON_CHANGE_INVERT() { return "changeInvert"; }
    static get CON_CHANGE_OPACITY() { return "changeOpacity"; }
    get blur() {
        return this._blur;
    }
    set blur(value) {
        if (this._blur != value) {
            this._blur = value;
            this.doChange(CFilterSet.CON_CHANGE_BLUR);
        }
    }
    get brightness() {
        return this._brightness;
    }
    set brightness(value) {
        if (this._brightness != value) {
            this._brightness = value;
            this.doChange(CFilterSet.CON_CHANGE_BRIGHTNESS);
        }
    }
    get contrast() {
        return this._contrast;
    }
    set contrast(value) {
        if (this._contrast != value) {
            this._contrast = value;
            this.doChange(CFilterSet.CON_CHANGE_CONTRAST);
        }
    }
    get shadow() {
        return this._shadow;
    }
    set shadow(value) {
        if (this._shadow != value) {
            this._shadow = value;
            this.doChange(CFilterSet.CON_CHANGE_SHADOW);
        }
    }
    get grayscale() {
        return this._grayscale;
    }
    set grayscale(value) {
        if (this._grayscale != value) {
            this._grayscale = value;
            this.doChange(CFilterSet.CON_CHANGE_GRAYSCALE);
        }
    }
    get hueRotate() {
        return this._hueRotate;
    }
    set hueRotate(value) {
        if (this._hueRotate != value) {
            this._hueRotate = value;
            this.doChange(CFilterSet.CON_CHANGE_HUE_ROTATION);
        }
    }
    get invert() {
        return this._invert;
    }
    set invert(value) {
        if (this._invert != value) {
            this._invert = value;
            this.doChange(CFilterSet.CON_CHANGE_INVERT);
        }
    }
    get opacity() {
        return this._opacity;
    }
    set opacity(value) {
        if (this._opacity != value) {
            this._opacity = value;
            this.doChange(CFilterSet.CON_CHANGE_OPACITY);
        }
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "blur", this.blur, false);
        CDataClass.putData(data, "brightness", this.brightness, false);
        CDataClass.putData(data, "contrast", this.contrast, false);
        CDataClass.putData(data, "shadow", this.shadow, false);
        CDataClass.putData(data, "grayscale", this.grayscale, false);
        CDataClass.putData(data, "hueRotate", this.hueRotate, false);
        CDataClass.putData(data, "invert", this.invert, false);
        CDataClass.putData(data, "opacity", this.opacity, false);
    }
    doFromData(data) {
        super.doFromData(data);
        this.blur = CDataClass.getData(data, "blur", false);
        this.brightness = CDataClass.getData(data, "brightness", false);
        this.contrast = CDataClass.getData(data, "contrast", false);
        this.shadow = CDataClass.getData(data, "shadow", false);
        this.grayscale = CDataClass.getData(data, "grayscale", false);
        this.hueRotate = CDataClass.getData(data, "hueRotate", false);
        this.invert = CDataClass.getData(data, "invert", false);
        this.opacity = CDataClass.getData(data, "opacity", false);
    }
}
class CFilter extends CNotifyChangeKindObject {
    static get CON_CHANGE_FILTER_SET() { return "changeFilterSet"; }
    static get CON_CHANGE_BLUR_VALUE() { return "changeBlurValue"; }
    static get CON_CHANGE_BRIGHTNESS_VALUE() { return "changeBrightnessValue"; }
    static get CON_CHANGE_CONSTRAST_VALUE() { return "changeConstrastValue"; }
    static get CON_CHANGE_SHADOW_X() { return "changeShadowX"; }
    static get CON_CHANGE_SHADOW_Y() { return "changeShadowY"; }
    static get CON_CHANGE_SHADOW_BLUR() { return "changeShadowBlur"; }
    static get CON_CHANGE_SHADOW_COLOR() { return "changeShadowColor"; }
    static get CON_CHANGE_GRAYSCALE_VALUE() { return "changeGrayscaleValue"; }
    static get CON_CHANGE_HUE_ROTATE_VALUE() { return "changeHueRotateValue"; }
    static get CON_CHANGE_INVERT_VALUE() { return "changeInvertValue"; }
    static get CON_CHANGE_OPACITY_VALUE() { return "changeOpacityValue"; }
    static get CON_CHANGE_CUSTOM() { return "changeCustom"; }
    constructor(element) {
        super();
        this._filterSet = new CFilterSet();
        this._blurValue = 5;
        this._brightnessValue = 1;
        this._constrastValue = 1;
        this._shadowX = 5;
        this._shadowY = 5;
        this._shadowBlur = 5;
        this._shadowColor = "rgba(0,0,0,1)";
        this._grayscaleValue = 1;
        this._hueRotateValue = 90;
        this._invertValue = 1;
        this._opacityValue = 1;
        this._customFilter = "";
        this._element = element;
        let self = this;
        this._filterSet.onChange = function () {
            self.doChange(CFilter.CON_CHANGE_FILTER_SET);
        };
    }
    get element() {
        return this._element;
    }
    get filterSet() {
        return this._filterSet;
    }
    get blurValue() {
        return this._blurValue;
    }
    set blurValue(value) {
        if (this._blurValue != value) {
            this._blurValue = value;
            this.doChange(CFilter.CON_CHANGE_BLUR_VALUE);
        }
    }
    get brightnessValue() {
        return this._brightnessValue;
    }
    set brightnessValue(value) {
        if (this._brightnessValue != value) {
            this._brightnessValue = value;
            this.doChange(CFilter.CON_CHANGE_BRIGHTNESS_VALUE);
        }
    }
    get constrastValue() {
        return this._constrastValue;
    }
    set constrastValue(value) {
        if (this._constrastValue != value) {
            this._constrastValue = value;
            this.doChange(CFilter.CON_CHANGE_CONSTRAST_VALUE);
        }
    }
    get shadowX() {
        return this._shadowX;
    }
    set shadowX(value) {
        if (this._shadowX != value) {
            this._shadowX = value;
            this.doChange(CFilter.CON_CHANGE_SHADOW_X);
        }
    }
    get shadowY() {
        return this._shadowY;
    }
    set shadowY(value) {
        if (this._shadowY != value) {
            this._shadowY = value;
            this.doChange(CFilter.CON_CHANGE_SHADOW_Y);
        }
    }
    get shadowBlur() {
        return this._shadowBlur;
    }
    set shadowBlur(value) {
        if (this._shadowBlur != value) {
            this._shadowBlur = value;
            this.doChange(CFilter.CON_CHANGE_SHADOW_BLUR);
        }
    }
    get shadowColor() {
        return this._shadowColor;
    }
    set shadowColor(value) {
        if (this._shadowColor != value) {
            this._shadowColor = value;
            this.doChange(CFilter.CON_CHANGE_SHADOW_COLOR);
        }
    }
    get grayscaleValue() {
        return this._grayscaleValue;
    }
    set grayscaleValue(value) {
        if (this._grayscaleValue != value) {
            this._grayscaleValue = value;
            this.doChange(CFilter.CON_CHANGE_GRAYSCALE_VALUE);
        }
    }
    get hueRotateValue() {
        return this._hueRotateValue;
    }
    set hueRotateValue(value) {
        if (this._hueRotateValue != value) {
            this._hueRotateValue = value;
            this.doChange(CFilter.CON_CHANGE_HUE_ROTATE_VALUE);
        }
    }
    get invertValue() {
        return this._invertValue;
    }
    set invertValue(value) {
        if (this._invertValue != value) {
            this._invertValue = value;
            this.doChange(CFilter.CON_CHANGE_INVERT_VALUE);
        }
    }
    get opacityValue() {
        return this._opacityValue;
    }
    set opacityValue(value) {
        if (this._opacityValue != value) {
            this._opacityValue = value;
            this.doChange(CFilter.CON_CHANGE_OPACITY_VALUE);
        }
    }
    get customFilter() {
        return this._customFilter;
    }
    set customFilter(value) {
        if (this._customFilter != value) {
            this._customFilter = value;
            this.doChange(CFilter.CON_CHANGE_CUSTOM);
        }
    }
    getFilter() {
        let s = "";
        if (this._filterSet.blur) {
            s += " blur(" + this._blurValue + "px)";
        }
        if (this._filterSet.brightness) {
            s += " brightness(" + this._brightnessValue + ")";
        }
        if (this._filterSet.contrast) {
            s += " contrast(" + (this._constrastValue * 100) + "%)";
        }
        if (this._filterSet.shadow) {
            s += " drop-shadow(" + this._shadowX + "px " + this._shadowY + "px " + this._shadowBlur + "px " + this._shadowColor + ")";
        }
        if (this._filterSet.grayscale) {
            s += " grayscale(" + (this._grayscaleValue * 100) + "%)";
        }
        if (this._filterSet.hueRotate) {
            s += " hue-rotate(" + this._hueRotateValue + "deg)";
        }
        if (this._filterSet.invert) {
            s += " invert(" + (this._invertValue * 100) + "%)";
        }
        if (this._filterSet.opacity) {
            s += " invert(" + (this._opacityValue * 100) + "%)";
        }
        if (this._customFilter != "") {
            s += " " + this.customFilter;
        }
        return s;
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "filterSet", this.filterSet.toData(), {}, true);
        CDataClass.putData(data, "blurValue", this.blurValue, 5);
        CDataClass.putData(data, "brightnessValue", this.brightnessValue, 1);
        CDataClass.putData(data, "constrastValue", this.constrastValue, 1);
        CDataClass.putData(data, "shadowX", this.shadowX, 5);
        CDataClass.putData(data, "shadowY", this.shadowY, 5);
        CDataClass.putData(data, "shadowBlur", this.shadowBlur, 5);
        CDataClass.putData(data, "shadowColor", this.shadowColor, "rgba(0,0,0,1)");
        CDataClass.putData(data, "grayscaleValue", this.grayscaleValue, 1);
        CDataClass.putData(data, "hueRotateValue", this.hueRotateValue, 90);
        CDataClass.putData(data, "invertValue", this.invertValue, 1);
        CDataClass.putData(data, "opacityValue", this.opacityValue, 1);
        CDataClass.putData(data, "customFilter", this.customFilter, "");
    }
    doFromData(data) {
        super.doFromData(data);
        this.filterSet.fromData(CDataClass.getData(data, "filterSet", {}, true));
        this.blurValue = CDataClass.getData(data, "blurValue", 5);
        this.brightnessValue = CDataClass.getData(data, "brightnessValue", 1);
        this.constrastValue = CDataClass.getData(data, "constrastValue", 1);
        this.shadowX = CDataClass.getData(data, "shadowX", 5);
        this.shadowY = CDataClass.getData(data, "shadowY", 5);
        this.shadowBlur = CDataClass.getData(data, "shadowBlur", 5);
        this.shadowColor = CDataClass.getData(data, "shadowColor", "rgba(0,0,0,1)");
        this.grayscaleValue = CDataClass.getData(data, "grayscaleValue", 1);
        this.hueRotateValue = CDataClass.getData(data, "hueRotateValue", 90);
        this.invertValue = CDataClass.getData(data, "invertValue", 1);
        this.opacityValue = CDataClass.getData(data, "opacityValue", 1);
        this.customFilter = CDataClass.getData(data, "customFilter", "");
    }
    doChange(kind) {
        super.doChange(kind);
        this.doApplyFilter();
    }
    doApplyFilter() {
        if (this._element != undefined) {
            this._element.style.filter = this.getFilter();
            if (this.onApplyFilter != undefined) {
                this.onApplyFilter(this);
            }
        }
    }
    allOff() {
        this.filterSet.blur = false;
        this.filterSet.brightness = false;
        this.filterSet.contrast = false;
        this.filterSet.shadow = false;
        this.filterSet.grayscale = false;
        this.filterSet.hueRotate = false;
        this.filterSet.invert = false;
        this.filterSet.opacity = false;
    }
}
class CTransformerPoints extends CNotifyChangeNotifyObject {
    get leftTop() {
        return this._leftTop;
    }
    get rightTop() {
        return this._rightTop;
    }
    get leftBottom() {
        return this._leftBottom;
    }
    get rightBottom() {
        return this._rightBottom;
    }
    get leftC1() {
        return this._leftC1;
    }
    get leftC2() {
        return this._leftC2;
    }
    get topC1() {
        return this._topC1;
    }
    get topC2() {
        return this._topC2;
    }
    get rightC1() {
        return this._rightC1;
    }
    get rightC2() {
        return this._rightC2;
    }
    get bottomC1() {
        return this._bottomC1;
    }
    get bottomC2() {
        return this._bottomC2;
    }
    constructor() {
        super();
        this._leftTop = new CNotifyPoint();
        this._rightTop = new CNotifyPoint();
        this._leftBottom = new CNotifyPoint();
        this._rightBottom = new CNotifyPoint();
        this._leftC1 = new CNotifyPoint();
        this._leftC2 = new CNotifyPoint();
        this._topC1 = new CNotifyPoint();
        this._topC2 = new CNotifyPoint();
        this._rightC1 = new CNotifyPoint();
        this._rightC2 = new CNotifyPoint();
        this._bottomC1 = new CNotifyPoint();
        this._bottomC2 = new CNotifyPoint();
        let self = this;
        this._leftTop.onChange = function () {
            self.doChange();
        };
        this._leftBottom.onChange = function () {
            self.doChange();
        };
        this._rightTop.onChange = function () {
            self.doChange();
        };
        this._rightBottom.onChange = function () {
            self.doChange();
        };
        this._leftC1.onChange = function () {
            self.doChange();
        };
        this._leftC2.onChange = function () {
            self.doChange();
        };
        this._topC1.onChange = function () {
            self.doChange();
        };
        this._topC2.onChange = function () {
            self.doChange();
        };
        this._rightC1.onChange = function () {
            self.doChange();
        };
        this._rightC2.onChange = function () {
            self.doChange();
        };
        this._bottomC1.onChange = function () {
            self.doChange();
        };
        this._bottomC2.onChange = function () {
            self.doChange();
        };
    }
    isEmpty() {
        return this._leftTop.isZero() &&
            this._leftBottom.isZero() &&
            this._rightBottom.isZero() &&
            this._rightTop.isZero() &&
            this._leftC1.isZero() &&
            this._leftC2.isZero() &&
            this._topC1.isZero() &&
            this._topC2.isZero() &&
            this._rightC1.isZero() &&
            this._rightC2.isZero() &&
            this._bottomC1.isZero() &&
            this._bottomC2.isZero();
    }
    getBounds() {
        let l = Number.MAX_VALUE;
        let t = Number.MAX_VALUE;
        let r = Number.MIN_VALUE;
        let b = Number.MIN_VALUE;
        console.log(this);
        if (this._leftTop.x < l)
            l = this._leftTop.x;
        if (this._leftBottom.x < l)
            l = this._leftBottom.x;
        if (this._rightTop.x < l)
            l = this._rightTop.x;
        if (this._rightBottom.x < l)
            l = this._rightBottom.x;
        if (this._leftC1.x < l)
            l = this._leftC1.x;
        if (this._leftC2.x < l)
            l = this._leftC2.x;
        if (this._topC1.x < l)
            l = this._topC1.x;
        if (this._topC2.x < l)
            l = this._topC2.x;
        if (this._rightC1.x < l)
            l = this._rightC1.x;
        if (this._rightC2.x < l)
            l = this._rightC2.x;
        if (this._bottomC1.x < l)
            l = this._bottomC1.x;
        if (this._bottomC2.x < l)
            l = this._bottomC2.x;
        if (this._leftTop.y < t)
            t = this._leftTop.y;
        if (this._leftBottom.y < t)
            t = this._leftBottom.y;
        if (this._rightTop.y < t)
            t = this._rightTop.y;
        if (this._rightBottom.y < t)
            t = this._rightBottom.y;
        if (this._leftC1.y < t)
            t = this._leftC1.y;
        if (this._leftC2.y < t)
            t = this._leftC2.y;
        if (this._topC1.y < t)
            t = this._topC1.y;
        if (this._topC2.y < t)
            t = this._topC2.y;
        if (this._rightC1.y < t)
            t = this._rightC1.y;
        if (this._rightC2.y < t)
            t = this._rightC2.y;
        if (this._bottomC1.y < t)
            t = this._rightC1.y;
        if (this._bottomC2.y < t)
            t = this._rightC2.y;
        if (this._leftTop.x > r)
            r = this._leftTop.x;
        if (this._leftBottom.x > r)
            r = this._leftBottom.x;
        if (this._rightTop.x > r)
            r = this._rightTop.x;
        if (this._rightBottom.x > r)
            r = this._rightBottom.x;
        if (this._leftC1.x > r)
            r = this._leftC1.x;
        if (this._leftC2.x > r)
            r = this._leftC2.x;
        if (this._topC1.x > r)
            r = this._topC1.x;
        if (this._topC2.x > r)
            r = this._topC2.x;
        if (this._rightC1.x > r)
            r = this._rightC1.x;
        if (this._rightC2.x > r)
            r = this._rightC2.x;
        if (this._bottomC1.x > r)
            r = this._rightC1.x;
        if (this._bottomC2.x > r)
            r = this._rightC2.x;
        if (this._leftTop.y > b)
            b = this._leftTop.y;
        if (this._leftBottom.y > b)
            b = this._leftBottom.y;
        if (this._rightTop.y > b)
            b = this._rightTop.y;
        if (this._rightBottom.y > b)
            b = this._rightBottom.y;
        if (this._leftC1.y > b)
            b = this._leftC1.y;
        if (this._leftC2.y > b)
            b = this._leftC2.y;
        if (this._topC1.y > b)
            b = this._topC1.y;
        if (this._topC2.y > b)
            b = this._topC2.y;
        if (this._rightC1.y > b)
            b = this._rightC1.y;
        if (this._rightC2.y > b)
            b = this._rightC2.y;
        if (this._bottomC1.y > b)
            b = this._rightC1.y;
        if (this._bottomC2.y > b)
            b = this._rightC2.y;
        if (l == Number.MAX_VALUE && t == Number.MAX_VALUE && r == Number.MIN_VALUE && b == Number.MIN_VALUE) {
            return new CRect();
        }
        else {
            return new CRect(l, t, r, b);
        }
    }
}
