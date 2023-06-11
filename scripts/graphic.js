"use strict";
const CON_ELLIPSE_CURVE_LENGTH = 0.552284749831;
class CPoint extends CDataClass {
    constructor(x, y) {
        super();
        this.x = 0;
        this.y = 0;
        if (x != undefined)
            this.x = x;
        if (y != undefined)
            this.y = y;
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "x", this.x, 0);
        CDataClass.putData(data, "y", this.y, 0);
    }
    doFromData(data) {
        super.doFromData(data);
        this.x = CDataClass.getData(data, "x", 0);
        this.y = CDataClass.getData(data, "y", 0);
    }
    toNotifyPoint() {
        let rt = new CNotifyPoint(this.x, this.y);
        return rt;
    }
    toString() {
        return this.x + "," + this.y;
    }
    copyFrom(pt) {
        this.x = pt.x;
        this.y = pt.y;
    }
    static getAngleToPoint(StartPoint, XRadius, YRadius, angle, startAngle = 0) {
        function dtor(i) {
            return i / 180 * Math.PI;
        }
        return new CPoint((XRadius * Math.cos(dtor(angle + startAngle))) + StartPoint.x, (YRadius * Math.sin(dtor(angle + startAngle))) + StartPoint.y);
    }
    static getAngleDistance(pt1, pt2) {
        let ang = CPoint.getAngleFromTwoPoint(pt1, pt2);
        let dis = CPoint.getDistancePoints(pt1, pt2);
        return { angle: ang, distance: dis };
    }
    static getAngleFromTwoPoint(pt1, pt2) {
        function dtor(i) {
            return i * 180 / Math.PI;
        }
        if (pt1.x == pt2.x && pt1.y == pt2.y)
            return 0;
        if (pt1.x == pt2.x) {
            if (pt1.y < pt2.y) {
                return 90;
            }
            else {
                return 270;
            }
        }
        if (pt1.y == pt2.y) {
            if (pt1.x < pt2.x) {
                return 0;
            }
            else {
                return 180;
            }
        }
        let tmps = dtor(Math.atan((pt2.y - pt1.y) / (pt2.x - pt1.x)));
        if (pt2.x < pt1.x && pt2.y < pt1.y) {
            tmps = 90 + (90 + tmps);
        }
        else if (pt2.x < pt1.x && pt2.y >= pt1.y) {
            tmps = 90 + (90 + tmps);
        }
        else if (pt2.x >= pt1.x && pt2.y < pt1.y) {
            tmps = 270 + (90 + tmps);
        }
        return tmps;
    }
    static getTransAnglePoint(orgPoint, rotationCenterPoint, angle) {
        let xr = rotationCenterPoint.x - orgPoint.x;
        let yr = rotationCenterPoint.y - orgPoint.y;
        if (xr == 0 && yr == 0) {
            return orgPoint;
        }
        else {
            let sq = Math.sqrt((xr * xr) + (yr * yr));
            return this.getAngleToPoint(rotationCenterPoint, sq, sq, this.getAngleFromTwoPoint(rotationCenterPoint, orgPoint) + angle);
        }
    }
    static getDistancePoints(pt1, pt2) {
        let lg1 = CCalc.max(pt1.x, pt2.x) - CCalc.min(pt1.x, pt2.x);
        let lg2 = CCalc.max(pt1.y, pt2.y) - CCalc.min(pt1.y, pt2.y);
        return Math.abs(Math.sqrt((lg1 * lg1) + (lg2 * lg2)));
    }
    static getLineMiddlePoint(pt1, pt2, middle) {
        return new CPoint(pt1.x + ((pt2.x - pt1.x) * middle), pt1.y + ((pt2.y - pt1.y) * middle));
    }
    static getPointer(e, kind) {
        let r = new CPoint(0, 0);
        if (kind == undefined || kind == "offset") {
            r.x = e.offsetX;
            r.y = e.offsetY;
        }
        else if (kind == "page") {
            r.x = e.pageX;
            r.y = e.pageY;
        }
        else if (kind == "screen") {
            r.x = e.screenX;
            r.y = e.screenY;
        }
        return r;
    }
    static getCrossPoint(p1, p2, p3, p4) {
        let r;
        let d = (p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x);
        if (d != 0) {
            let pre = (p1.x * p2.y - p1.y * p2.x);
            let post = (p3.x * p4.y - p3.y * p4.x);
            let x = (pre * (p3.x - p4.x) - (p1.x - p2.x) * post) / d;
            let y = (pre * (p3.y - p4.y) - (p1.y - p2.y) * post) / d;
            r = new CPoint(x, y);
        }
        return r;
    }
    static isInLine(lineStart, lineStop, point) {
        return CPoint.getAngleFromTwoPoint(lineStart, point) == CPoint.getAngleFromTwoPoint(lineStart, lineStop);
    }
    static isInCross(p1, p2, p3, p4) {
        let pt = CPoint.getCrossPoint(p1, p2, p3, p4);
        if (pt == undefined) {
            return false;
        }
        else {
            return CPoint.isInLine(p1, p2, pt) && CPoint.isInLine(p3, p4, pt);
        }
    }
    static isCrossLineAndPoligon(poli, lineStart, lineStop) {
        let b = false;
        for (let n = 0; n < poli.length - 1; n++) {
            if (CPoint.isInCross(poli[n], poli[n + 1], lineStart, lineStop)) {
                b = true;
                break;
            }
        }
        return b;
    }
    static isCrossPoligon(poli1, poli2) {
        let b = false;
        for (let n = 0; n < poli1.length - 1; n++) {
            for (let i = 0; i < poli2.length - 1; i++) {
                if (CPoint.isInCross(poli1[n], poli1[n + 1], poli2[i], poli2[i + 1])) {
                    b = true;
                    break;
                }
            }
        }
        return b;
    }
    static getArrowPoint(ptPre, ptTail, angle, radius) {
        let ang = this.getAngleFromTwoPoint(ptPre, ptTail) - 180;
        let re = { arrow1: this.getAngleToPoint(ptTail, radius, radius, angle, ang), arrow2: this.getAngleToPoint(ptTail, radius, radius, -angle, ang) };
        return re;
    }
    static getBezierMiddlePoint(ptStart, ptCurve1, ptCurve2, ptStop, middle) {
        let ptt1 = this.getLineMiddlePoint(ptStart, ptCurve1, middle);
        let ptt2 = this.getLineMiddlePoint(ptCurve1, ptCurve2, middle);
        let ptt3 = this.getLineMiddlePoint(ptCurve2, ptStop, middle);
        let pttt1 = this.getLineMiddlePoint(ptt1, ptt2, middle);
        let pttt2 = this.getLineMiddlePoint(ptt2, ptt3, middle);
        return this.getLineMiddlePoint(pttt1, pttt2, middle);
    }
    static getBezier2MiddlePoint(ptStart, ptCurve, ptStop, middle) {
        let ptt1 = this.getLineMiddlePoint(ptStart, ptCurve, middle);
        let ptt2 = this.getLineMiddlePoint(ptCurve, ptStop, middle);
        return this.getLineMiddlePoint(ptt1, ptt2, middle);
    }
    static getBezierMiddlePointFromPoints(pts, middle) {
        function arrCopy(src) {
            let arr = new Array();
            for (let n = 0; n < src.length; n++) {
                arr.push(new CPoint(src[n].x, src[n].y));
            }
            return arr;
        }
        let arrTmp;
        let arrTmp2;
        arrTmp = arrCopy(pts);
        while (true) {
            arrTmp2 = [];
            for (let n = 0; n < arrTmp.length - 1; n++) {
                arrTmp2.push(this.getLineMiddlePoint(arrTmp[n], arrTmp[n + 1], middle));
            }
            if (arrTmp2.length <= 2) {
                break;
            }
            arrTmp = arrCopy(arrTmp2);
        }
        return this.getLineMiddlePoint(arrTmp2[0], arrTmp2[1], middle);
    }
    static getLineCenterAngleToPoint(ptLineStart, ptLineStop, radiusX, radiusY, angle) {
        function dtor(d) {
            return d * 180 / Math.PI;
        }
        let tmps = dtor(Math.atan((ptLineStop.y - ptLineStart.y) / (ptLineStop.x - ptLineStart.x)));
        if (ptLineStop.x < ptLineStart.x && ptLineStop.y < ptLineStart.y) {
            tmps = 90 + (90 + tmps);
        }
        else if (ptLineStop.x < ptLineStart.x && ptLineStop.y >= ptLineStart.y) {
            tmps = 90 + (90 + tmps);
        }
        else if (ptLineStop.x >= ptLineStart.x && ptLineStop.y < ptLineStart.y) {
            tmps = 270 + (90 + tmps);
        }
        let x = ((CCalc.max(ptLineStart.x, ptLineStop.x) - CCalc.min(ptLineStart.x, ptLineStop.x)) / 2) + CCalc.min(ptLineStart.x, ptLineStop.x);
        let y = ((CCalc.max(ptLineStart.y, ptLineStop.y) - CCalc.min(ptLineStart.y, ptLineStop.y)) / 2) + CCalc.min(ptLineStart.y, ptLineStop.y);
        let pt = this.getAngleToPoint(new CPoint(x, y), radiusX, radiusY, angle + tmps);
        return pt;
    }
    static getLineMiddleAngleToPoint(ptLineStart, ptLineStop, radiusX, radiusY, angle, middle) {
        function dtor(d) {
            return d * 180 / Math.PI;
        }
        let tmps = dtor(Math.atan((ptLineStop.y - ptLineStart.y) / (ptLineStop.x - ptLineStart.x)));
        if (ptLineStop.x < ptLineStart.x && ptLineStop.y < ptLineStart.y) {
            tmps = 90 + (90 + tmps);
        }
        else if (ptLineStop.x < ptLineStart.x && ptLineStop.y >= ptLineStart.y) {
            tmps = 90 + (90 + tmps);
        }
        else if (ptLineStop.x >= ptLineStart.x && ptLineStop.y < ptLineStart.y) {
            tmps = 270 + (90 + tmps);
        }
        let x = ((CCalc.max(ptLineStart.x, ptLineStop.x) - CCalc.min(ptLineStart.x, ptLineStop.x)) * (1 - middle)) + CCalc.min(ptLineStart.x, ptLineStop.x);
        let y = ((CCalc.max(ptLineStart.y, ptLineStop.y) - CCalc.min(ptLineStart.y, ptLineStop.y)) * (1 - middle)) + CCalc.min(ptLineStart.y, ptLineStop.y);
        let pt = this.getAngleToPoint(new CPoint(x, y), radiusX, radiusY, angle + tmps);
        return pt;
    }
    static getPoligonPoints(count, isGetLast = false, startAngle) {
        let re = new CList();
        let ang = 360 / count;
        for (let n = 0; n < count; n++) {
            re.add(CPoint.getAngleToPoint(new CPoint(0.5, 0.5), 0.5, 0.5, n * ang, startAngle));
        }
        if (isGetLast) {
            re.add(CPoint.getAngleToPoint(new CPoint(0.5, 0.5), 0.5, 0.5, 0, startAngle));
        }
        return re;
    }
    static getHornPoints(count, innerDistance, isGetLast = false, startAngle) {
        let re = new CList();
        let ang = 360 / (count * 2);
        for (let n = 0; n < count * 2; n++) {
            if (n % 2 == 0) {
                re.add(CPoint.getAngleToPoint(new CPoint(0.5, 0.5), 0.5, 0.5, n * ang, startAngle));
            }
            else {
                re.add(CPoint.getAngleToPoint(new CPoint(0.5, 0.5), 0.5 * innerDistance, 0.5 * innerDistance, n * ang, startAngle));
            }
        }
        if (isGetLast) {
            re.add(CPoint.getAngleToPoint(new CPoint(0.5, 0.5), 0.5, 0.5, 0, startAngle));
        }
        return re;
    }
    static create(x = 0, y = 0) {
        let rt = new CPoint(x, y);
        return rt;
    }
    static getDefaultData() {
        return { x: 0, y: 0 };
    }
    static getTransformPoint(orgBounds, orgPoint, lt, rt, lb, rb) {
        let result = new CPoint();
        let mx = (orgPoint.x - orgBounds.left) / orgBounds.width;
        let my = (orgPoint.y - orgBounds.top) / orgBounds.height;
        let sx = CPoint.getLineMiddlePoint(lt, lb, my).x;
        let ex = CPoint.getLineMiddlePoint(rt, rb, my).x;
        let sy = CPoint.getLineMiddlePoint(lt, rt, mx).y;
        let ey = CPoint.getLineMiddlePoint(lb, rb, mx).y;
        result.x = CCalc.crRange2Value(orgBounds.left, orgBounds.right, orgPoint.x, sx, ex);
        result.y = CCalc.crRange2Value(orgBounds.top, orgBounds.bottom, orgPoint.y, sy, ey);
        return result;
    }
    static getTransformCurvePoint(orgBounds, orgPoint, lt, rt, lb, rb, leftC1, leftC2, topC1, topC2, rightC1, rightC2, bottomC1, bottomC2) {
        let result = new CPoint();
        let mx = (orgPoint.x - orgBounds.left) / orgBounds.width;
        let my = (orgPoint.y - orgBounds.top) / orgBounds.height;
        let linex = CPoint.xTransformLine(lt, rt, lb, rb, leftC1, leftC2, topC1, topC2, rightC1, rightC2, bottomC1, bottomC2, mx);
        let liney = CPoint.yTransformLine(lt, rt, lb, rb, leftC1, leftC2, topC1, topC2, rightC1, rightC2, bottomC1, bottomC2, my);
        result.x = CPoint.getBezierMiddlePoint(linex.startPoint, linex.curve1, linex.curve2, linex.stopPoint, my).x;
        result.y = CPoint.getBezierMiddlePoint(liney.startPoint, liney.curve1, liney.curve2, liney.stopPoint, mx).y;
        return result;
    }
    static getMiddleCurveLineFromTwoLine(startPoint1, curve1_1, curve2_1, stopPoint1, startPoint2, curve1_2, curve2_2, stopPoint2, middleValue) {
        let st = CPoint.getLineMiddlePoint(startPoint1, startPoint2, middleValue);
        let ed = CPoint.getLineMiddlePoint(stopPoint1, stopPoint2, middleValue);
        let c1 = CPoint.getLineMiddlePoint(curve1_1, curve1_2, middleValue);
        let c2 = CPoint.getLineMiddlePoint(curve2_1, curve2_2, middleValue);
        return { startPoint: st, curve1: c1, curve2: c2, stopPoint: ed };
    }
    static xTransformLine(lt, rt, lb, rb, lc1, lc2, tc1, tc2, rc1, rc2, bc1, bc2, middleValue) {
        let ptlorg1 = CPoint.getLineMiddlePoint(lt, rt, middleValue);
        let ptlorg2 = CPoint.getLineMiddlePoint(lb, rb, middleValue);
        let disOrg = CPoint.getDistancePoints(ptlorg1, ptlorg2);
        let st = CPoint.getBezierMiddlePoint(lt, tc1, tc2, rt, middleValue);
        let ed = CPoint.getBezierMiddlePoint(lb, bc1, bc2, rb, middleValue);
        let dis = CPoint.getDistancePoints(st, ed);
        let sc = dis / disOrg;
        let pts = CPoint.getMiddleCurveLineFromTwoLine(lt, lc1, lc2, lb, rt, rc1, rc2, rb, middleValue);
        pts.startPoint.x *= sc;
        pts.stopPoint.x *= sc;
        pts.curve1.x *= sc;
        pts.curve2.x *= sc;
        pts.startPoint.y *= sc;
        pts.stopPoint.y *= sc;
        pts.curve1.y *= sc;
        pts.curve2.y *= sc;
        let diffX = st.x - pts.startPoint.x;
        pts.startPoint.x += diffX;
        pts.stopPoint.x += diffX;
        pts.curve1.x += diffX;
        pts.curve2.x += diffX;
        let diffY = st.y - pts.startPoint.y;
        pts.startPoint.y += diffY;
        pts.stopPoint.y += diffY;
        pts.curve1.y += diffY;
        pts.curve2.y += diffY;
        let angOrg = CPoint.getAngleFromTwoPoint(ptlorg1, ptlorg2);
        let ang = CPoint.getAngleFromTwoPoint(st, ed);
        pts.curve1 = CPoint.getTransAnglePoint(pts.curve1, pts.startPoint, ang - angOrg);
        pts.curve2 = CPoint.getTransAnglePoint(pts.curve2, pts.startPoint, ang - angOrg);
        pts.stopPoint = CPoint.getTransAnglePoint(pts.stopPoint, pts.startPoint, ang - angOrg);
        return { startPoint: pts.startPoint, curve1: pts.curve1, curve2: pts.curve2, stopPoint: pts.stopPoint };
    }
    static yTransformLine(lt, rt, lb, rb, lc1, lc2, tc1, tc2, rc1, rc2, bc1, bc2, middleValue) {
        let ptlorg1 = CPoint.getLineMiddlePoint(lt, lb, middleValue);
        let ptlorg2 = CPoint.getLineMiddlePoint(rt, rb, middleValue);
        let disOrg = CPoint.getDistancePoints(ptlorg1, ptlorg2);
        let st = CPoint.getBezierMiddlePoint(lt, lc1, lc2, lb, middleValue);
        let ed = CPoint.getBezierMiddlePoint(rt, rc1, rc2, rb, middleValue);
        let dis = CPoint.getDistancePoints(st, ed);
        let sc = dis / disOrg;
        let pts = CPoint.getMiddleCurveLineFromTwoLine(lt, tc1, tc2, rt, lb, bc1, bc2, rb, middleValue);
        pts.startPoint.x *= sc;
        pts.stopPoint.x *= sc;
        pts.curve1.x *= sc;
        pts.curve2.x *= sc;
        pts.startPoint.y *= sc;
        pts.stopPoint.y *= sc;
        pts.curve1.y *= sc;
        pts.curve2.y *= sc;
        let diffX = st.x - pts.startPoint.x;
        pts.startPoint.x += diffX;
        pts.stopPoint.x += diffX;
        pts.curve1.x += diffX;
        pts.curve2.x += diffX;
        let diffY = st.y - pts.startPoint.y;
        pts.startPoint.y += diffY;
        pts.stopPoint.y += diffY;
        pts.curve1.y += diffY;
        pts.curve2.y += diffY;
        let angOrg = CPoint.getAngleFromTwoPoint(ptlorg1, ptlorg2);
        let ang = CPoint.getAngleFromTwoPoint(st, ed);
        pts.curve1 = CPoint.getTransAnglePoint(pts.curve1, pts.startPoint, ang - angOrg);
        pts.curve2 = CPoint.getTransAnglePoint(pts.curve2, pts.startPoint, ang - angOrg);
        pts.stopPoint = CPoint.getTransAnglePoint(pts.stopPoint, pts.startPoint, ang - angOrg);
        return { startPoint: pts.startPoint, curve1: pts.curve1, curve2: pts.curve2, stopPoint: pts.stopPoint };
    }
    static splitLinePoints(startPoint, stopPoint, splitCount) {
        let rt = new Array();
        for (let n = 1; n <= splitCount; n++) {
            let v = (1 / splitCount) * n;
            rt.push(CPoint.getLineMiddlePoint(startPoint, stopPoint, v));
        }
        return rt;
    }
    static splitCurveLinePoints(startPoint, c1, c2, stopPoint, splitCount) {
        let rt = new Array();
        for (let n = 1; n <= splitCount; n++) {
            let v = (1 / splitCount) * n;
            rt.push(CPoint.getBezierMiddlePoint(startPoint, c1, c2, stopPoint, v));
        }
        return rt;
    }
    static splitCurve2LinePoints(startPoint, curve, stopPoint, splitCount) {
        let rt = new Array();
        for (let n = 1; n <= splitCount; n++) {
            let v = (1 / splitCount) * n;
            rt.push(CPoint.getBezier2MiddlePoint(startPoint, curve, stopPoint, v));
        }
        return rt;
    }
}
class CPoint3D extends CDataClass {
    constructor(x = 0, y = 0, z = 0) {
        super();
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.x = x;
        this.y = y;
        this.z = z;
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "x", this.x, 0);
        CDataClass.putData(data, "y", this.y, 0);
        CDataClass.putData(data, "z", this.z, 0);
    }
    doFromData(data) {
        super.doFromData(data);
        this.x = CDataClass.getData(data, "x", 0);
        this.y = CDataClass.getData(data, "y", 0);
        this.z = CDataClass.getData(data, "z", 0);
    }
    position3DTo2D(viewCenterX, viewCenterY, viewWidth, objectWidth = 0, objectHeight = 0) {
        let FIELD_OF_VIEW = viewWidth * 0.8;
        let sizeProjection = FIELD_OF_VIEW / (FIELD_OF_VIEW - this.z);
        let rt = {
            x: this.x * sizeProjection + viewCenterX,
            y: this.y * sizeProjection + viewCenterY,
            objectWidth: objectWidth * sizeProjection,
            objectHeight: objectHeight * sizeProjection
        };
        return rt;
    }
    static getAngleToPoint3D(startPoint, angle, zAngle, radius) {
        let pi = zAngle * (Math.PI / 180);
        let pix2 = angle * (Math.PI / 180);
        const x = (radius * Math.sin(pi) * Math.cos(pix2)) + startPoint.x;
        const y = (radius * Math.sin(pi) * Math.sin(pix2)) + startPoint.y;
        const z = radius * Math.cos(pi) + startPoint.z;
        let rt = new CPoint3D(x, y, z);
        return rt;
    }
    static getAngleToPoint3DEllipse(startPoint, angle, zAngle, radiusX, radiusY, radiusZ) {
        let pi = zAngle * (Math.PI / 180);
        let pix2 = angle * (Math.PI / 180);
        const x = (radiusX * Math.sin(pi) * Math.cos(pix2)) + startPoint.x;
        const y = (radiusY * Math.sin(pi) * Math.sin(pix2)) + startPoint.y;
        const z = radiusZ * Math.cos(pi) + startPoint.z;
        let rt = new CPoint3D(x, y, z);
        return rt;
    }
    static getAngleToPoint3DXY(startPoint, angleX, angleY, radius) {
        //const x = (radius * CCalc.cosd(angleX) * CCalc.sind(angleY)) + startPoint.x
        //const y = (radius * CCalc.sind(angleX) * CCalc.sind(angleY)) + startPoint.y
        //const z = (radius * CCalc.cosd(angleX) * CCalc.cosd(angleY)) + startPoint.z
        //let x = (radius * 0) + startPoint.x
        //let y = (radius * CCalc.sind(angleX) * -1) + startPoint.y
        //let xx = CCalc.
        let yy = CCalc.sind(angleX) * -1;
        //let z = (radius * CCalc.cosd(angleX)) + startPoint.z
        //let pt1 = new CPoint3D(x, y, z)
        let x = (radius * CCalc.sind(angleY) * CCalc.sind(angleX)) + startPoint.x;
        let y = (radius * CCalc.cosd(angleY) * yy) + startPoint.y;
        let z = (radius * CCalc.cosd(angleX) * CCalc.cosd(angleY)) + startPoint.z;
        let rt = new CPoint3D(x, y, z);
        //console.log(rt)
        return rt;
    }
    static a(a1, a2) {
        let aa1 = a1 % 360;
        let aa2 = a2 % 360;
    }
}
class CRect extends CDataClass {
    constructor(left = 0, top = 0, right = 0, bottom = 0) {
        super();
        this.left = left;
        this.top = top;
        this.right = right;
        this.bottom = bottom;
    }
    get width() {
        return this.right - this.left;
    }
    set width(value) {
        this.right = this.left + value;
    }
    get height() {
        return this.bottom - this.top;
    }
    set height(value) {
        this.bottom = this.top + value;
    }
    set all(value) {
        this.left = value;
        this.top = value;
        this.right = value;
        this.bottom = value;
    }
    get leftTop() {
        return new CPoint(this.left, this.top);
    }
    get leftBottom() {
        return new CPoint(this.left, this.bottom);
    }
    get rightTop() {
        return new CPoint(this.right, this.top);
    }
    get rightBottom() {
        return new CPoint(this.right, this.bottom);
    }
    get center() {
        return new CPoint(this.left + (this.width / 2), this.top + (this.height / 2));
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "left", this.left, 0);
        CDataClass.putData(data, "top", this.top, 0);
        CDataClass.putData(data, "right", this.right, 0);
        CDataClass.putData(data, "bottom", this.bottom, 0);
    }
    doFromData(data) {
        super.doFromData(data);
        this.left = CDataClass.getData(data, "left", 0);
        this.top = CDataClass.getData(data, "top", 0);
        this.right = CDataClass.getData(data, "right", 0);
        this.bottom = CDataClass.getData(data, "bottom", 0);
    }
    isIn(x, y) {
        return (this.left <= x && this.right >= x && this.top <= y && this.bottom >= y);
    }
    isInPoint(point) {
        return this.isIn(point.x, point.y);
    }
    isInRect(rect) {
        let re = false;
        if (this.isInPoint(rect.leftTop) && this.isInPoint(rect.leftBottom) && this.isInPoint(rect.rightTop) && this.isInPoint(rect.rightBottom)) {
            re = true;
        }
        return re;
    }
    isIntersection(rect) {
        let re = false;
        if (this.isInPoint(rect.leftTop) || this.isInPoint(rect.leftBottom) || this.isInPoint(rect.rightTop) || this.isInPoint(rect.rightBottom)) {
            re = true;
        }
        if (rect.isInPoint(this.leftTop) || rect.isInPoint(this.leftBottom) || rect.isInPoint(this.rightTop) || rect.isInPoint(this.rightBottom)) {
            re = true;
        }
        if (this.isInRect(rect)) {
            re = true;
        }
        if (rect.isInRect(this)) {
            re = true;
        }
        if (rect.left < this.left && rect.right > this.right && rect.top > this.top && rect.bottom < this.bottom) {
            re = true;
        }
        if (rect.left > this.left && rect.right < this.right && rect.top < this.top && rect.bottom > this.bottom) {
            re = true;
        }
        if (this.left < rect.left && this.right > rect.right && this.top > rect.top && this.bottom < rect.bottom) {
            re = true;
        }
        if (this.left > rect.left && this.right < rect.right && this.top < rect.top && this.bottom > rect.bottom) {
            re = true;
        }
        return re;
    }
    isMinusSize() {
        return this.right < this.left || this.top > this.bottom;
    }
    getIntersection(rect) {
        return new CRect(CCalc.max(this.left, rect.left), CCalc.max(this.top, rect.top), CCalc.min(this.right, rect.right), CCalc.min(this.bottom, rect.bottom));
    }
    copyFrom(rect) {
        this.left = rect.left;
        this.top = rect.top;
        this.right = rect.right;
        this.bottom = rect.bottom;
    }
    inflate(x, y) {
        this.left = this.left - x;
        this.top = this.top - y;
        this.right = this.right + x;
        this.bottom = this.bottom + y;
    }
    inflateTo(x, y) {
        let re = CRect.create(this.left, this.top, this.right, this.bottom);
        re.inflate(x, y);
        return re;
    }
    offset(x, y) {
        this.left = this.left + x;
        this.top = this.top + y;
        this.right = this.right + x;
        this.bottom = this.bottom + y;
    }
    set(left, top, right, bottom) {
        this.left = left;
        this.top = top;
        this.right = right;
        this.bottom = bottom;
    }
    getFitRect(destRect, isCenter) {
        let w = 0;
        let h = 0;
        let orgW = 0;
        let prtW = 0;
        let orgH = 0;
        let prtH = 0;
        orgW = destRect.right - destRect.left;
        prtW = this.right - this.left;
        orgH = destRect.bottom - destRect.top;
        prtH = this.bottom - this.top;
        if (CCalc.cr(orgW, orgH, 100, 0, 4) > CCalc.cr(prtW, prtH, 100, 0, 4)) {
            h = prtH;
            w = CCalc.cr(orgW, orgH, 0, h, 3);
            if (isCenter == true) {
                return new CRect((prtW - w) / 2, 0, w + ((prtW - w) / 2), h);
            }
            else {
                return new CRect(0, 0, w, h);
            }
        }
        else {
            w = prtW;
            h = CCalc.cr(orgW, orgH, w, 0, 4);
            if (isCenter == true) {
                return new CRect(0, (prtH - h) / 2, w, h + ((prtH - h) / 2));
            }
            else {
                return new CRect(0, 0, w, h);
            }
        }
    }
    isEmpty() {
        return this.left == 0 && this.top == 0 && this.right == 0 && this.bottom == 0;
    }
    equal(rt) {
        return this.left == rt.left && this.top == rt.top && this.right == rt.right && this.bottom == rt.bottom;
    }
    toString() {
        return this.left + "," + this.top + "," + this.right + "," + this.bottom;
    }
    fromString(value) {
        let arr = value.split(",");
        if (arr.length = 4) {
            this.left = parseInt(arr[0]);
            this.top = parseInt(arr[1]);
            this.right = parseInt(arr[2]);
            this.bottom = parseInt(arr[3]);
        }
    }
    static create(left, top, right, bottom) {
        let rt = new CRect(left, top, right, bottom);
        return rt;
    }
    static getDefaultData() {
        return { left: 0, top: 0, right: 0, bottom: 0 };
    }
    static newEmpty() {
        return CRect.create(0, 0, 0, 0);
    }
    static copyFrom(rect) {
        let rt = new CRect(rect.left, rect.top, rect.right, rect.bottom);
        return rt;
    }
}
class CNotifyPoint extends CNotifyChangeKindObject {
    constructor(x = 0, y = 0) {
        super();
        this._x = x;
        this._y = y;
    }
    static get CON_CHANGE_X() { return "x"; }
    static get CON_CHANGE_Y() { return "y"; }
    get x() {
        return this._x;
    }
    set x(value) {
        if (this._x != value) {
            this._x = value;
            this.doChange(CNotifyPoint.CON_CHANGE_X);
        }
    }
    get y() {
        return this._y;
    }
    set y(value) {
        if (this._y != value) {
            this._y = value;
            this.doChange(CNotifyPoint.CON_CHANGE_Y);
        }
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "x", this.x, 0);
        CDataClass.putData(data, "y", this.y, 0);
    }
    doFromData(data) {
        super.doFromData(data);
        this.x = CDataClass.getData(data, "x", 0);
        this.y = CDataClass.getData(data, "y", 0);
    }
    toPoint() {
        return new CPoint(this.x, this.y);
    }
    toString() {
        return this.x + "," + this.y;
    }
    copyTo() {
        let pt = new CNotifyPoint(this.x, this.y);
        return pt;
    }
    isZero() {
        return this.x == 0 && this.y == 0;
    }
    static create(x, y) {
        let pt = new CNotifyPoint(x, y);
        return pt;
    }
}
class CNotifyRect extends CNotifyChangeKindObject {
    constructor(left = 0, top = 0, right = 0, bottom = 0) {
        super();
        this._left = left;
        this._top = top;
        this._right = right;
        this._bottom = bottom;
    }
    static get CON_CHANGE_LEFT() { return "l"; }
    static get CON_CHANGE_TOP() { return "t"; }
    static get CON_CHANGE_RIGHT() { return "r"; }
    static get CON_CHANGE_BOTTOM() { return "b"; }
    static get CON_CHANGE_ALL() { return "a"; }
    get left() {
        return this._left;
    }
    set left(left) {
        if (this._left != left) {
            this._left = left;
            this.doChange(CNotifyRect.CON_CHANGE_LEFT);
        }
    }
    get top() {
        return this._top;
    }
    set top(top) {
        if (this._top != top) {
            this._top = top;
            this.doChange(CNotifyRect.CON_CHANGE_TOP);
        }
    }
    get right() {
        return this._right;
    }
    set right(right) {
        if (this._right != right) {
            this._right = right;
            this.doChange(CNotifyRect.CON_CHANGE_RIGHT);
        }
    }
    get bottom() {
        return this._bottom;
    }
    set bottom(bottom) {
        if (this._bottom != bottom) {
            this._bottom = bottom;
            this.doChange(CNotifyRect.CON_CHANGE_BOTTOM);
        }
    }
    get width() {
        return this._right - this._left;
    }
    set width(value) {
        if (this.width != value) {
            this._right = this._left + value;
            this.doChange(CNotifyRect.CON_CHANGE_RIGHT);
        }
    }
    get height() {
        return this._bottom - this._top;
    }
    set height(value) {
        if (this.height != value) {
            this._bottom = this._top + value;
            this.doChange(CNotifyRect.CON_CHANGE_BOTTOM);
        }
    }
    set all(value) {
        this._left = value;
        this._top = value;
        this._right = value;
        this._bottom = value;
        this.doChange(CNotifyRect.CON_CHANGE_ALL);
    }
    get leftTop() {
        return new CPoint(this.left, this.top);
    }
    get leftBottom() {
        return new CPoint(this.left, this.bottom);
    }
    get rightTop() {
        return new CPoint(this.right, this.top);
    }
    get rightBottom() {
        return new CPoint(this.right, this.bottom);
    }
    get rect() {
        let rt = new CRect(this._left, this._top, this._right, this._bottom);
        return rt;
    }
    equalRect(src) {
        return src.left == this.left && src.top == this.top && src.right == this.right && src.bottom == this.bottom;
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "left", this.left, 0);
        CDataClass.putData(data, "top", this.top, 0);
        CDataClass.putData(data, "right", this.right, 0);
        CDataClass.putData(data, "bottom", this.bottom, 0);
    }
    doFromData(data) {
        super.doFromData(data);
        this.left = CDataClass.getData(data, "left", 0);
        this.top = CDataClass.getData(data, "top", 0);
        this.right = CDataClass.getData(data, "right", 0);
        this.bottom = CDataClass.getData(data, "bottom", 0);
    }
}
var EPathPointKind;
(function (EPathPointKind) {
    EPathPointKind[EPathPointKind["BEGIN"] = 0] = "BEGIN";
    EPathPointKind[EPathPointKind["MOVETO"] = 1] = "MOVETO";
    EPathPointKind[EPathPointKind["LINETO"] = 2] = "LINETO";
    EPathPointKind[EPathPointKind["CURVETO2"] = 3] = "CURVETO2";
    EPathPointKind[EPathPointKind["CURVETO3"] = 4] = "CURVETO3";
    EPathPointKind[EPathPointKind["CLOSE"] = 5] = "CLOSE";
})(EPathPointKind || (EPathPointKind = {}));
class CPathPoint extends CNotifyChangeNotifyObject {
    constructor(kind, x, y) {
        super();
        this.pointKind = EPathPointKind.BEGIN;
        let self = this;
        this.pointKind = kind;
        this.point = new CNotifyPoint(x, y);
        this.point.onChange = function () {
            self.doChange();
        };
        this.cPoint1 = new CNotifyPoint(0, 0);
        this.cPoint1.onChange = function () {
            self.doChange();
        };
        this.cPoint2 = new CNotifyPoint(0, 0);
        this.cPoint2.onChange = function () {
            self.doChange();
        };
    }
    copyTo() {
        let rt = new CPathPoint(this.pointKind, this.point.x, this.point.y);
        rt.cPoint1.x = this.cPoint1.x;
        rt.cPoint1.y = this.cPoint1.y;
        rt.cPoint2.x = this.cPoint2.x;
        rt.cPoint2.y = this.cPoint2.y;
        return rt;
    }
    copyFrom(point) {
        this.pointKind = point.pointKind;
        this.point.copyFrom(point.point);
        this.cPoint1.copyFrom(point.cPoint1);
        this.cPoint2.copyFrom(point.cPoint2);
    }
    toData() {
        let rt = {};
        CDataClass.putData(rt, "pointKind", this.pointKind, EPathPointKind.LINETO);
        CDataClass.putData(rt, "point", this.point.toData(), {}, true);
        CDataClass.putData(rt, "cPoint1", this.cPoint1.toData(), {}, true);
        CDataClass.putData(rt, "cPoint2", this.cPoint2.toData(), {}, true);
        return rt;
    }
    fromData(data) {
        this.pointKind = CDataClass.getData(data, "pointKind", EPathPointKind.LINETO);
        this.point.fromData(CDataClass.getData(data, "point", {}, true));
        this.cPoint1.fromData(CDataClass.getData(data, "cPoint1", {}, true));
        this.cPoint2.fromData(CDataClass.getData(data, "cPoint2", {}, true));
    }
    static create(kind, point, cPoint1, cPoint2) {
        let pp = new CPathPoint(kind, point.x, point.y);
        pp.cPoint1 = cPoint1.toNotifyPoint();
        pp.cPoint2 = cPoint2.toNotifyPoint();
        return pp;
    }
    static lineTocurve(x1, y1, x2, y2) {
        let rt = new CPathPoint(EPathPointKind.CURVETO3, x2, y2);
        let pt1 = new CPoint(x1, y1);
        let pt2 = new CPoint(x2, y2);
        let c1 = CPoint.getLineMiddlePoint(pt1, pt2, 1 / 3);
        rt.cPoint1.x = c1.x;
        rt.cPoint1.y = c1.y;
        let c2 = CPoint.getLineMiddlePoint(pt1, pt2, (1 / 3) * 2);
        rt.cPoint2.x = c2.x;
        rt.cPoint2.y = c2.y;
        return rt;
    }
}
class CPathTransformer extends CNotifyChangeNotifyObject {
    constructor() {
        super();
        this._leftTop = new CNotifyPoint();
        this._rightTop = new CNotifyPoint();
        this._leftBottom = new CNotifyPoint();
        this._rightBottom = new CNotifyPoint();
        this._leftCurve1 = new CNotifyPoint();
        this._leftCurve2 = new CNotifyPoint();
        this._topCurve1 = new CNotifyPoint();
        this._topCurve2 = new CNotifyPoint();
        this._rightCurve1 = new CNotifyPoint();
        this._rightCurve2 = new CNotifyPoint();
        this._bottomCurve1 = new CNotifyPoint();
        this._bottomCurve2 = new CNotifyPoint();
        let self = this;
        this.leftTop.onChange = function () {
            self.doChange();
        };
        this.rightTop.onChange = function () {
            self.doChange();
        };
        this.leftBottom.onChange = function () {
            self.doChange();
        };
        this.rightBottom.onChange = function () {
            self.doChange();
        };
        this.leftCurve1.onChange = function () {
            self.doChange();
        };
        this.leftCurve2.onChange = function () {
            self.doChange();
        };
        this.topCurve1.onChange = function () {
            self.doChange();
        };
        this.topCurve2.onChange = function () {
            self.doChange();
        };
        this.rightCurve1.onChange = function () {
            self.doChange();
        };
        this.rightCurve2.onChange = function () {
            self.doChange();
        };
        this.bottomCurve1.onChange = function () {
            self.doChange();
        };
        this.bottomCurve2.onChange = function () {
            self.doChange();
        };
    }
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
    get leftCurve1() {
        return this._leftCurve1;
    }
    get leftCurve2() {
        return this._leftCurve2;
    }
    get rightCurve1() {
        return this._rightCurve1;
    }
    get rightCurve2() {
        return this._rightCurve2;
    }
    get topCurve1() {
        return this._topCurve1;
    }
    get topCurve2() {
        return this._topCurve2;
    }
    get bottomCurve1() {
        return this._bottomCurve1;
    }
    get bottomCurve2() {
        return this._bottomCurve2;
    }
    getTransformData(orgBounds, pathData) {
        let rt = pathData.copyTo();
        for (let n = 0; n < pathData.length; n++) {
            if (pathData.get(n).pointKind == EPathPointKind.MOVETO ||
                pathData.get(n).pointKind == EPathPointKind.LINETO ||
                pathData.get(n).pointKind == EPathPointKind.CURVETO2 ||
                pathData.get(n).pointKind == EPathPointKind.CURVETO3) {
                let pt = pathData.get(n).point;
                let tpt = CPoint.getTransformCurvePoint(orgBounds, pt.toPoint(), this.leftTop.toPoint(), this.rightTop.toPoint(), this.leftBottom.toPoint(), this.rightBottom.toPoint(), this.leftCurve1.toPoint(), this.leftCurve2.toPoint(), this.topCurve1.toPoint(), this.topCurve2.toPoint(), this.rightCurve1.toPoint(), this.rightCurve2.toPoint(), this.bottomCurve1.toPoint(), this.bottomCurve2.toPoint());
                rt.get(n).point.x = tpt.x;
                rt.get(n).point.y = tpt.y;
                pt = pathData.get(n).cPoint1;
                tpt = CPoint.getTransformCurvePoint(orgBounds, pt.toPoint(), this.leftTop.toPoint(), this.rightTop.toPoint(), this.leftBottom.toPoint(), this.rightBottom.toPoint(), this.leftCurve1.toPoint(), this.leftCurve2.toPoint(), this.topCurve1.toPoint(), this.topCurve2.toPoint(), this.rightCurve1.toPoint(), this.rightCurve2.toPoint(), this.bottomCurve1.toPoint(), this.bottomCurve2.toPoint());
                rt.get(n).cPoint1.x = tpt.x;
                rt.get(n).cPoint1.y = tpt.y;
                pt = pathData.get(n).cPoint2;
                tpt = CPoint.getTransformCurvePoint(orgBounds, pt.toPoint(), this.leftTop.toPoint(), this.rightTop.toPoint(), this.leftBottom.toPoint(), this.rightBottom.toPoint(), this.leftCurve1.toPoint(), this.leftCurve2.toPoint(), this.topCurve1.toPoint(), this.topCurve2.toPoint(), this.rightCurve1.toPoint(), this.rightCurve2.toPoint(), this.bottomCurve1.toPoint(), this.bottomCurve2.toPoint());
                rt.get(n).cPoint2.x = tpt.x;
                rt.get(n).cPoint2.y = tpt.y;
            }
        }
        return rt;
    }
    isEmpty() {
        return this.leftTop.x == 0 && this.leftTop.y == 0 &&
            this.rightTop.x == 0 && this.rightTop.y == 0 &&
            this.leftBottom.x == 0 && this.leftBottom.y == 0 &&
            this.rightBottom.x == 0 && this.rightBottom.y == 0 &&
            this.leftCurve1.x == 0 && this.leftCurve1.y == 0 &&
            this.leftCurve2.x == 0 && this.leftCurve2.y == 0 &&
            this.topCurve1.x == 0 && this.topCurve1.y == 0 &&
            this.topCurve2.x == 0 && this.topCurve2.y == 0 &&
            this.rightCurve1.x == 0 && this.rightCurve1.y == 0 &&
            this.rightCurve2.x == 0 && this.rightCurve2.y == 0 &&
            this.bottomCurve1.x == 0 && this.bottomCurve1.y == 0 &&
            this.bottomCurve2.x == 0 && this.bottomCurve2.y == 0;
    }
}
class CPathPointList extends CList {
    constructor() {
        super(...arguments);
        this._width = 0;
        this._height = 0;
        this._transformer = new CPathTransformer();
    }
    get width() {
        return this._width;
    }
    set width(value) {
        if (this._width != value) {
            this._width = value;
        }
    }
    get height() {
        return this._height;
    }
    set height(value) {
        if (this._height != value) {
            this._height = value;
        }
    }
    get transformer() {
        return this._transformer;
    }
    set transformer(value) {
        if (this._transformer != value) {
            this._transformer = value;
            this.doChange("transformer");
            if (value != undefined) {
                let self = this;
                value.onChange = function () {
                    self.doChange("transformer");
                };
            }
        }
    }
    doToData(data) {
        super.doToData(data);
        let arr = [];
        for (let n = 0; n < this.length; n++) {
            let item = this.get(n).toData();
            arr.push(item);
        }
        CDataClass.putData(data, "width", this.width, 0);
        CDataClass.putData(data, "height", this.height, 0);
        CDataClass.putData(data, "data", arr, [], true);
        //data["width"] = this.width
        //data["height"] = this.height
    }
    doFromData(data) {
        super.doFromData(data);
        this.clear();
        this.width = CDataClass.getData(data, "width", 0);
        this.height = CDataClass.getData(data, "height", 0);
        let arr = CDataClass.getData(data, "data", [], true);
        for (let n = 0; n < arr.length; n++) {
            let item = new CPathPoint(EPathPointKind.BEGIN, 0, 0);
            item.fromData(arr[n]);
            this.add(item);
        }
        /*if(data["width"] != undefined) {
            this.width = data["width"]
        } else {
            this.width = 0
        }
        if(data["height"] != undefined) {
            this.height = data["height"]
        } else {
            this.height = 0
        }*/
    }
    toData() {
        let data = {};
        this.doToData(data);
        return data;
    }
    add(item) {
        super.add(item);
        let self = this;
        item.onChange = function () {
            self.doChange("point");
        };
    }
    insert(index, item) {
        super.insert(index, item);
        let self = this;
        item.onChange = function () {
            self.doChange("point");
        };
    }
    addPoint(kind, point, cPoint1, cPoint2) {
        this.add(CPathPoint.create(kind, point, cPoint1, cPoint2));
    }
    addPointBegin() {
        this.add(CPathPoint.create(EPathPointKind.BEGIN, CPoint.create(0, 0), CPoint.create(0, 0), CPoint.create(0, 0)));
    }
    addPointMoveTo(point) {
        let pt = CPathPoint.create(EPathPointKind.MOVETO, point, CPoint.create(0, 0), CPoint.create(0, 0));
        this.add(pt);
        return pt;
    }
    addPointLineTo(point) {
        let pt = CPathPoint.create(EPathPointKind.LINETO, point, CPoint.create(0, 0), CPoint.create(0, 0));
        this.add(pt);
        return pt;
    }
    addPointCurveTo2(point, cPoint1) {
        let pt = CPathPoint.create(EPathPointKind.CURVETO2, point, cPoint1, CPoint.create(0, 0));
        this.add(pt);
        return pt;
    }
    addPointCurveTo3(point, cPoint1, cPoint2) {
        let pt = CPathPoint.create(EPathPointKind.CURVETO3, point, cPoint1, cPoint2);
        this.add(pt);
        return pt;
    }
    addArc(center, rotationAngle, radiusX, radiusY) {
        let sang = CPoint.getAngleFromTwoPoint(center, this.get(this.length - 1).point.toPoint());
        let lang = rotationAngle;
        let bpt = CPoint.getAngleToPoint(center, radiusX, radiusY, sang);
        if (rotationAngle > 0) {
            while (lang > 90) {
                let rpt = CPoint.getAngleToPoint(center, radiusX, radiusY, sang + 90);
                let cl = CON_ELLIPSE_CURVE_LENGTH;
                let cpt1 = CPoint.getAngleToPoint(bpt, radiusX * cl, radiusY * cl, 90, CPoint.getAngleFromTwoPoint(center, bpt));
                let cpt2 = CPoint.getAngleToPoint(rpt, radiusX * cl, radiusY * cl, -90, CPoint.getAngleFromTwoPoint(center, rpt));
                this.addPointCurveTo3(rpt, cpt1, cpt2);
                bpt.copyFrom(rpt);
                sang += 90;
                lang -= 90;
            }
            let rpt = CPoint.getAngleToPoint(center, radiusX, radiusY, sang + lang);
            let cl = CCalc.cr(CON_ELLIPSE_CURVE_LENGTH, 0, 90, lang, 2);
            let cpt1 = CPoint.getAngleToPoint(bpt, radiusX * cl, radiusY * cl, 90, CPoint.getAngleFromTwoPoint(center, bpt));
            let cpt2 = CPoint.getAngleToPoint(rpt, radiusX * cl, radiusY * cl, -90, CPoint.getAngleFromTwoPoint(center, rpt));
            this.addPointCurveTo3(rpt, cpt1, cpt2);
        }
        else {
            while (lang < -90) {
                let rpt = CPoint.getAngleToPoint(center, radiusX, radiusY, sang - 90);
                let cl = CON_ELLIPSE_CURVE_LENGTH;
                let cpt1 = CPoint.getAngleToPoint(bpt, radiusX * cl, radiusY * cl, -90, CPoint.getAngleFromTwoPoint(center, bpt));
                let cpt2 = CPoint.getAngleToPoint(rpt, radiusX * cl, radiusY * cl, 90, CPoint.getAngleFromTwoPoint(center, rpt));
                this.addPointCurveTo3(rpt, cpt1, cpt2);
                bpt.copyFrom(rpt);
                sang -= 90;
                lang += 90;
            }
            let rpt = CPoint.getAngleToPoint(center, radiusX, radiusY, sang + lang);
            let cl = CCalc.cr(CON_ELLIPSE_CURVE_LENGTH, 0, 90, Math.abs(lang), 2);
            let cpt1 = CPoint.getAngleToPoint(bpt, radiusX * cl, radiusY * cl, -90, CPoint.getAngleFromTwoPoint(center, bpt));
            let cpt2 = CPoint.getAngleToPoint(rpt, radiusX * cl, radiusY * cl, 90, CPoint.getAngleFromTwoPoint(center, rpt));
            this.addPointCurveTo3(rpt, cpt1, cpt2);
        }
    }
    addDecalcomanieXReverse(invertX, useLastPointLineTo = true, useClose = false) {
        function invertPoint(pt) {
            let x = invertX - pt.x;
            return new CPoint(invertX + x, pt.y);
        }
        let lst = new CPathPointList();
        lst.copyFrom(this);
        for (let n = lst.length - 1; n >= 0; n--) {
            if (n == lst.length - 1) {
                let p = new CPoint(lst.get(n).point.x, lst.get(n).point.y);
                let pt = invertPoint(p);
                if (useLastPointLineTo) {
                    this.addPointLineTo(pt);
                }
                else {
                    this.addPointMoveTo(pt);
                }
            }
            if (n - 1 >= 0) {
                let pt = new CPoint(lst.get(n - 1).point.x, lst.get(n - 1).point.y);
                let cpt1 = new CPoint(lst.get(n).cPoint1.x, lst.get(n).cPoint1.y);
                let cpt2 = new CPoint(lst.get(n).cPoint2.x, lst.get(n).cPoint2.y);
                switch (lst.get(n).pointKind) {
                    case EPathPointKind.MOVETO:
                        this.addPointMoveTo(invertPoint(pt));
                        break;
                    case EPathPointKind.LINETO:
                        this.addPointLineTo(invertPoint(pt));
                        break;
                    case EPathPointKind.CURVETO2:
                        this.addPointCurveTo2(invertPoint(pt), invertPoint(cpt1));
                        break;
                    case EPathPointKind.CURVETO3:
                        this.addPointCurveTo3(invertPoint(pt), invertPoint(cpt2), invertPoint(cpt1));
                        break;
                    case EPathPointKind.CLOSE:
                        return;
                }
            }
        }
        if (useClose)
            this.addPointClose();
    }
    addDecalcomanieX(invertX) {
        function invertPoint(pt) {
            let x = invertX - pt.x;
            return new CPoint(invertX + x, pt.y);
        }
        let lst = new CPathPointList();
        lst.copyFrom(this);
        for (let n = 0; n < lst.length; n++) {
            switch (lst.get(n).pointKind) {
                case EPathPointKind.MOVETO:
                    this.addPointMoveTo(invertPoint(lst.get(n).point.toPoint()));
                    break;
                case EPathPointKind.LINETO:
                    this.addPointLineTo(invertPoint(lst.get(n).point.toPoint()));
                    break;
                case EPathPointKind.CURVETO2:
                    this.addPointCurveTo2(invertPoint(lst.get(n).point.toPoint()), invertPoint(lst.get(n).cPoint1.toPoint()));
                    break;
                case EPathPointKind.CURVETO3:
                    this.addPointCurveTo3(invertPoint(lst.get(n).point.toPoint()), invertPoint(lst.get(n).cPoint1.toPoint()), invertPoint(lst.get(n).cPoint2.toPoint()));
                    break;
                case EPathPointKind.CLOSE:
                    this.addPointClose();
                    break;
            }
        }
    }
    addDecalcomanieYReverse(invertY, useLastPointLineTo = true, useClose = false) {
        function invertPoint(pt) {
            let y = invertY - pt.y;
            return new CPoint(pt.x, invertY + y);
        }
        let lst = new CPathPointList();
        lst.copyFrom(this);
        for (let n = lst.length - 1; n >= 0; n--) {
            if (n == lst.length - 1) {
                let pt = invertPoint(lst.get(n).point.toPoint());
                if (useLastPointLineTo) {
                    this.addPointLineTo(pt);
                }
                else {
                    this.addPointMoveTo(pt);
                }
            }
            if (n - 1 >= 0) {
                switch (lst.get(n).pointKind) {
                    case EPathPointKind.MOVETO:
                        this.addPointMoveTo(invertPoint(lst.get(n - 1).point.toPoint()));
                        break;
                    case EPathPointKind.LINETO:
                        this.addPointLineTo(invertPoint(lst.get(n - 1).point.toPoint()));
                        break;
                    case EPathPointKind.CURVETO2:
                        this.addPointCurveTo2(invertPoint(lst.get(n - 1).point.toPoint()), invertPoint(lst.get(n).cPoint1.toPoint()));
                        break;
                    case EPathPointKind.CURVETO3:
                        this.addPointCurveTo3(invertPoint(lst.get(n - 1).point.toPoint()), invertPoint(lst.get(n).cPoint2.toPoint()), invertPoint(lst.get(n).cPoint1.toPoint()));
                        break;
                    case EPathPointKind.CLOSE:
                        return;
                }
            }
        }
        if (useClose)
            this.addPointClose();
    }
    addDecalcomanieY(invertY) {
        function invertPoint(pt) {
            let y = invertY - pt.y;
            return new CPoint(pt.x, invertY + y);
        }
        let lst = new CPathPointList();
        lst.copyFrom(this);
        for (let n = 0; n < lst.length; n++) {
            switch (lst.get(n).pointKind) {
                case EPathPointKind.MOVETO:
                    this.addPointMoveTo(invertPoint(lst.get(n).point.toPoint()));
                    break;
                case EPathPointKind.LINETO:
                    this.addPointLineTo(invertPoint(lst.get(n).point.toPoint()));
                    break;
                case EPathPointKind.CURVETO2:
                    this.addPointCurveTo2(invertPoint(lst.get(n).point.toPoint()), invertPoint(lst.get(n).cPoint1.toPoint()));
                    break;
                case EPathPointKind.CURVETO3:
                    this.addPointCurveTo3(invertPoint(lst.get(n).point.toPoint()), invertPoint(lst.get(n).cPoint1.toPoint()), invertPoint(lst.get(n).cPoint2.toPoint()));
                    break;
                case EPathPointKind.CLOSE:
                    this.addPointClose();
                    break;
            }
        }
    }
    addPointClose() {
        if (this.length > 0 && this.get(this.length - 1).pointKind == EPathPointKind.CLOSE)
            return;
        let pt = CPathPoint.create(EPathPointKind.CLOSE, CPoint.create(0, 0), CPoint.create(0, 0), CPoint.create(0, 0));
        this.add(pt);
        return pt;
    }
    deletePoint(indexOrPathitem) {
        if (typeof indexOrPathitem == "number") {
            if (this.length - 1 > indexOrPathitem) {
                if (this.get(indexOrPathitem + 1).pointKind == EPathPointKind.CLOSE) {
                    this.delete(indexOrPathitem + 1);
                }
                this.delete(indexOrPathitem);
            }
            else if (this.length - 1 == indexOrPathitem) {
                this.delete(indexOrPathitem);
            }
        }
        else {
            let idx = -1;
            for (let n = 0; n < this.length; n++) {
                if (this.get(n) == indexOrPathitem) {
                    idx = n;
                    break;
                }
            }
            if (idx != -1) {
                if (this.length - 1 > idx) {
                    if (this.get(idx + 1).pointKind == EPathPointKind.CLOSE) {
                        this.delete(idx + 1);
                    }
                    this.delete(idx);
                }
                else if (this.length - 1 == idx) {
                    this.delete(idx);
                }
            }
        }
    }
    setPathData(ctx) {
        let pd = this;
        if (!this._transformer.isEmpty()) {
            pd = this._transformer.getTransformData(this.getBounds(), this);
        }
        for (let n = 0; n < pd.length; n++) {
            switch (pd.get(n).pointKind) {
                case EPathPointKind.BEGIN:
                    ctx.beginPath();
                    break;
                case EPathPointKind.MOVETO:
                    ctx.moveTo(pd.get(n).point.x, pd.get(n).point.y);
                    break;
                case EPathPointKind.LINETO:
                    ctx.lineTo(pd.get(n).point.x, pd.get(n).point.y);
                    break;
                case EPathPointKind.CURVETO2:
                    ctx.quadraticCurveTo(pd.get(n).cPoint1.x, pd.get(n).cPoint1.y, pd.get(n).point.x, pd.get(n).point.y);
                    break;
                case EPathPointKind.CURVETO3:
                    ctx.bezierCurveTo(pd.get(n).cPoint1.x, pd.get(n).cPoint1.y, pd.get(n).cPoint2.x, pd.get(n).cPoint2.y, pd.get(n).point.x, pd.get(n).point.y);
                    break;
                case EPathPointKind.CLOSE:
                    ctx.closePath();
                    break;
            }
        }
    }
    movePoint(x, y) {
        for (var n = 0; n < this.length; n++) {
            if (this.get(n).pointKind == EPathPointKind.BEGIN || this.get(n).pointKind == EPathPointKind.CLOSE) {
                continue;
            }
            this.get(n).point.x = this.get(n).point.x + x;
            this.get(n).point.y = this.get(n).point.y + y;
            this.get(n).cPoint1.x = this.get(n).cPoint1.x + x;
            this.get(n).cPoint1.y = this.get(n).cPoint1.y + y;
            this.get(n).cPoint2.x = this.get(n).cPoint2.x + x;
            this.get(n).cPoint2.y = this.get(n).cPoint2.y + y;
        }
    }
    scale(scaleX, scaleY) {
        for (var n = 0; n < this.length; n++) {
            if (this.get(n).pointKind == EPathPointKind.BEGIN || this.get(n).pointKind == EPathPointKind.CLOSE) {
                continue;
            }
            this.get(n).point.x = this.get(n).point.x * scaleX;
            this.get(n).point.y = this.get(n).point.y * scaleY;
            this.get(n).cPoint1.x = this.get(n).cPoint1.x * scaleX;
            this.get(n).cPoint1.y = this.get(n).cPoint1.y * scaleY;
            this.get(n).cPoint2.x = this.get(n).cPoint2.x * scaleX;
            this.get(n).cPoint2.y = this.get(n).cPoint2.y * scaleY;
        }
    }
    getBounds() {
        if (this.length == 0) {
            return new CRect();
        }
        else {
            let l = Number.MAX_VALUE;
            let t = Number.MAX_VALUE;
            let r = Number.MIN_VALUE;
            let b = Number.MIN_VALUE;
            for (var n = 0; n < this.length; n++) {
                if (this.get(n).pointKind == EPathPointKind.BEGIN || this.get(n).pointKind == EPathPointKind.CLOSE) {
                    continue;
                }
                if (n == 0) {
                    l = this.get(n).point.x;
                    t = this.get(n).point.y;
                    r = this.get(n).point.x;
                    b = this.get(n).point.y;
                }
                else {
                    if (this.get(n).point.x < l) {
                        l = this.get(n).point.x;
                    }
                    if (this.get(n).point.y < t) {
                        t = this.get(n).point.y;
                    }
                    if (this.get(n).point.x > r) {
                        r = this.get(n).point.x;
                    }
                    if (this.get(n).point.y > b) {
                        b = this.get(n).point.y;
                    }
                }
                if (this.get(n).pointKind == EPathPointKind.CURVETO2 || this.get(n).pointKind == EPathPointKind.CURVETO3) {
                    if (this.get(n).cPoint1.x < l) {
                        l = this.get(n).cPoint1.x;
                    }
                    if (this.get(n).cPoint1.y < t) {
                        t = this.get(n).cPoint1.y;
                    }
                    if (this.get(n).cPoint1.x > r) {
                        r = this.get(n).cPoint1.x;
                    }
                    if (this.get(n).cPoint1.y > b) {
                        b = this.get(n).cPoint1.y;
                    }
                }
                if (this.get(n).pointKind == EPathPointKind.CURVETO3) {
                    if (this.get(n).cPoint2.x < l) {
                        l = this.get(n).cPoint2.x;
                    }
                    if (this.get(n).cPoint2.y < t) {
                        t = this.get(n).cPoint2.y;
                    }
                    if (this.get(n).cPoint2.x > r) {
                        r = this.get(n).cPoint2.x;
                    }
                    if (this.get(n).cPoint2.y > b) {
                        b = this.get(n).cPoint2.y;
                    }
                }
            }
            let rt = new CRect(l, t, r, b);
            return rt;
        }
    }
    stretch(bounds) {
        let r;
        if (this.width > 0 && this.height > 0) {
            r = new CRect(0, 0, this.width, this.height);
        }
        else {
            r = this.getBounds();
        }
        let sx = bounds.width / r.width;
        let sy = bounds.height / r.height;
        if (!(this.width > 0 && this.height > 0))
            this.movePoint(-r.left, -r.top);
        this.scale(sx, sy);
        this.movePoint(bounds.left, bounds.top);
        this.doChange("set");
    }
    stretchIgnoreSize(bounds) {
        let r = this.getBounds();
        let sx = bounds.width / r.width;
        let sy = bounds.height / r.height;
        this.movePoint(-r.left, -r.top);
        this.scale(sx, sy);
        this.movePoint(bounds.left, bounds.top);
        this.doChange("set");
    }
    fit(bounds) {
        let r;
        if (this.width > 0 && this.height > 0) {
            r = new CRect(0, 0, this.width, this.height);
        }
        else {
            r = this.getBounds();
        }
        //let rc = r.getFitRect(CRect.create(x, y, x + width, y + height), true);
        let rc = bounds.getFitRect(r, true);
        rc.left = rc.left + bounds.left;
        rc.right = rc.right + bounds.left;
        rc.top = rc.top + bounds.top;
        rc.bottom = rc.bottom + bounds.top;
        this.stretch(rc);
        this.doChange("set");
    }
    fitIgnoreSize(bounds) {
        let r = this.getBounds();
        let rc = bounds.getFitRect(r, true);
        rc.left = rc.left + bounds.left;
        rc.right = rc.right + bounds.left;
        rc.top = rc.top + bounds.top;
        rc.bottom = rc.bottom + bounds.top;
        this.stretchIgnoreSize(rc);
        this.doChange("set");
    }
    copyTo() {
        let re = new CPathPointList();
        for (var n = 0; n < this.length; n++) {
            re.add(this.get(n).copyTo());
        }
        re.width = this.width;
        re.height = this.height;
        return re;
    }
    referenceCopyTo() {
        let re = new CPathPointList();
        for (var n = 0; n < this.length; n++) {
            re.add(this.get(n));
        }
        re.width = this.width;
        re.height = this.height;
        return re;
    }
    stretchTo(bounds) {
        let re = this.copyTo();
        re.stretch(bounds);
        return re;
    }
    fitTo(bounds) {
        let re = this.copyTo();
        re.fit(bounds);
        return re;
    }
    copyFrom(list) {
        this.clear();
        for (var n = 0; n < list.length; n++) {
            let pt = new CPathPoint(EPathPointKind.BEGIN, 0, 0);
            pt.copyFrom(list.get(n));
            this.set(n, pt);
            let self = this;
            pt.onChange = function () {
                self.doChange("point");
            };
        }
        this.width = list.width;
        this.height = list.height;
    }
    rotate(center, angle) {
        for (let n = 0; n < this.length; n++) {
            let pt = this.get(n);
            let dis = CPoint.getDistancePoints(center, pt.point.toPoint());
            let ang = CPoint.getAngleFromTwoPoint(center, pt.point.toPoint());
            let p = CPoint.getAngleToPoint(center, dis, dis, ang + angle);
            pt.point.x = p.x;
            pt.point.y = p.y;
            dis = CPoint.getDistancePoints(center, pt.cPoint1.toPoint());
            ang = CPoint.getAngleFromTwoPoint(center, pt.cPoint1.toPoint());
            p = CPoint.getAngleToPoint(center, dis, dis, ang + angle);
            pt.cPoint1.x = p.x;
            pt.cPoint1.y = p.y;
            dis = CPoint.getDistancePoints(center, pt.cPoint2.toPoint());
            ang = CPoint.getAngleFromTwoPoint(center, pt.cPoint2.toPoint());
            p = CPoint.getAngleToPoint(center, dis, dis, ang + angle);
            pt.cPoint2.x = p.x;
            pt.cPoint2.y = p.y;
        }
    }
    toString() {
        let re = "";
        for (let n = 0; n < this.length; n++) {
            let pt = this.get(n);
            if (n != 0) {
                re += "\n";
            }
            switch (pt.pointKind) {
                case EPathPointKind.BEGIN:
                    re += "b";
                    break;
                case EPathPointKind.CLOSE:
                    re += "z";
                    break;
                case EPathPointKind.CURVETO2:
                    re += "c";
                    break;
                case EPathPointKind.CURVETO3:
                    re += "c";
                    break;
                case EPathPointKind.LINETO:
                    re += "l";
                    break;
                case EPathPointKind.MOVETO:
                    re += "m";
                    break;
            }
            re += pt.cPoint1.x + "," + pt.cPoint1.y;
            re += " " + pt.cPoint2.x + "," + pt.cPoint2.y;
            re += " " + pt.point.x + "," + pt.point.y;
        }
        return re;
    }
    fromFontPathData(text) {
        this.clear();
        /*let arr = text.split(" ")
        for(let n = 0; n < arr.length; n++) {
            let pre = arr[n].substring(0, 1)
            if(pre == "M") {
                let ar = arr[n].substring(1).split(",")
                let pt = new CPathPoint(EPathPointKind.MOVETO, parseFloat(ar[0]), parseFloat(ar[1]))
                this.add(pt)
            } else if(pre == "L") {
                let ar = arr[n].substring(1).split(",")
                let pt = new CPathPoint(EPathPointKind.LINETO, parseFloat(ar[0]), parseFloat(ar[1]))
                this.add(pt)
            } else if(pre == "C") {
                let ar1 = arr[n].substring(1).split(",")
                let ar2 = arr[n + 1].split(",")
                let ar3 = arr[n + 2].split(",")
                let pt = new CPathPoint(EPathPointKind.CURVETO3, parseFloat(ar3[0]), parseFloat(ar3[1]))
                pt.cPoint1.x = parseFloat(ar1[0])
                pt.cPoint1.y = parseFloat(ar1[1])
                pt.cPoint2.x = parseFloat(ar2[0])
                pt.cPoint2.y = parseFloat(ar2[1])
                this.add(pt)
            } else if(pre == "Z") {
                this.addPointClose()
            }
        }*/
        let arr = text.split("\n");
        for (let n = 0; n < arr.length; n++) {
            if (arr[n] != "") {
                let pre = arr[n].substring(0, 1);
                if (pre == "M") {
                    let ar = arr[n].substring(1).split(",");
                    let pt = new CPathPoint(EPathPointKind.MOVETO, parseFloat(ar[0]), parseFloat(ar[1]));
                    this.add(pt);
                }
                else if (pre == "L") {
                    let ar = arr[n].substring(1).split(",");
                    let pt = new CPathPoint(EPathPointKind.LINETO, parseFloat(ar[0]), parseFloat(ar[1]));
                    this.add(pt);
                }
                else if (pre == "C") {
                    let ar = arr[n].split(" ");
                    let ar1 = ar[0].substring(1).split(",");
                    let ar2 = ar[1].split(",");
                    let ar3 = ar[2].split(",");
                    let pt = new CPathPoint(EPathPointKind.CURVETO3, parseFloat(ar3[0]), parseFloat(ar3[1]));
                    pt.cPoint1.x = parseFloat(ar1[0]);
                    pt.cPoint1.y = parseFloat(ar1[1]);
                    pt.cPoint2.x = parseFloat(ar2[0]);
                    pt.cPoint2.y = parseFloat(ar2[1]);
                    this.add(pt);
                }
                else if (pre == "Q") {
                    let ar = arr[n].split(" ");
                    let ar1 = ar[0].substring(1).split(",");
                    let ar2 = ar[1].split(",");
                    let pt = new CPathPoint(EPathPointKind.CURVETO2, parseFloat(ar2[0]), parseFloat(ar2[1]));
                    pt.cPoint1.x = parseFloat(ar1[0]);
                    pt.cPoint1.y = parseFloat(ar1[1]);
                    this.add(pt);
                }
                else if (pre == "Z") {
                    this.addPointClose();
                }
            }
        }
    }
    makeRectData(hasClose = false) {
        this.clear();
        this.addPointMoveTo(CPoint.create(0, 0));
        this.addPointLineTo(CPoint.create(1, 0));
        this.addPointLineTo(CPoint.create(1, 1));
        this.addPointLineTo(CPoint.create(0, 1));
        this.addPointLineTo(CPoint.create(0, 0));
        if (hasClose)
            this.addPointClose;
        return this;
    }
    makeRoundRectData(left, top, width, height, radiusX, radiusY, disableRoundSet, disableLineSet, isClear) {
        let rds;
        if (disableRoundSet == undefined) {
            rds = new CStringSet();
        }
        else {
            rds = disableRoundSet;
        }
        if (isClear) {
            this.clear();
            this.add(CPathPoint.create(EPathPointKind.BEGIN, CPoint.create(left, top), CPoint.create(left, top), CPoint.create(left, top)));
        }
        if (rds.has("leftTop") || radiusX == 0 || radiusY == 0) {
            this.add(CPathPoint.create(EPathPointKind.MOVETO, CPoint.create(left, top), CPoint.create(left, top), CPoint.create(left, top)));
        }
        else {
            this.add(CPathPoint.create(EPathPointKind.MOVETO, CPoint.create(left, top + radiusY), CPoint.create(left, top), CPoint.create(left, top)));
            this.add(CPathPoint.create(EPathPointKind.CURVETO3, CPoint.create(left + radiusX, top), CPoint.create(left, top + ((1 - CON_ELLIPSE_CURVE_LENGTH) * radiusY)), CPoint.create(left + ((1 - CON_ELLIPSE_CURVE_LENGTH) * radiusX), top)));
        }
        if (rds.has("rightTop") || radiusX == 0 || radiusY == 0) {
            if (disableLineSet.has("top")) {
                this.add(CPathPoint.create(EPathPointKind.MOVETO, CPoint.create(left + width, top), CPoint.create(left, top), CPoint.create(left, top)));
            }
            else {
                this.add(CPathPoint.create(EPathPointKind.LINETO, CPoint.create(left + width, top), CPoint.create(left, top), CPoint.create(left, top)));
            }
        }
        else {
            if (disableLineSet.has("top")) {
                this.add(CPathPoint.create(EPathPointKind.MOVETO, CPoint.create(left + width - radiusX, top), CPoint.create(left, top), CPoint.create(left, top)));
                this.add(CPathPoint.create(EPathPointKind.CURVETO3, CPoint.create(left + width, top + radiusY), CPoint.create(left + width - ((1 - CON_ELLIPSE_CURVE_LENGTH) * radiusX), top), CPoint.create(left + width, top + ((1 - CON_ELLIPSE_CURVE_LENGTH) * radiusY))));
            }
            else {
                this.add(CPathPoint.create(EPathPointKind.LINETO, CPoint.create(left + width - radiusX, top), CPoint.create(left, top), CPoint.create(left, top)));
                this.add(CPathPoint.create(EPathPointKind.CURVETO3, CPoint.create(left + width, top + radiusY), CPoint.create(left + width - ((1 - CON_ELLIPSE_CURVE_LENGTH) * radiusX), top), CPoint.create(left + width, top + ((1 - CON_ELLIPSE_CURVE_LENGTH) * radiusY))));
            }
        }
        if (rds.has("rightBottom") || radiusX == 0 || radiusY == 0) {
            if (disableLineSet.has("right")) {
                this.add(CPathPoint.create(EPathPointKind.MOVETO, CPoint.create(left + width, top + height), CPoint.create(left, top), CPoint.create(left, top)));
            }
            else {
                this.add(CPathPoint.create(EPathPointKind.LINETO, CPoint.create(left + width, top + height), CPoint.create(left, top), CPoint.create(left, top)));
            }
        }
        else {
            if (disableLineSet.has("right")) {
                this.add(CPathPoint.create(EPathPointKind.MOVETO, CPoint.create(left + width, top + height - radiusY), CPoint.create(left, top), CPoint.create(left, top)));
                this.add(CPathPoint.create(EPathPointKind.CURVETO3, CPoint.create(left + width - radiusX, top + height), CPoint.create(left + width, top + height - ((1 - CON_ELLIPSE_CURVE_LENGTH) * radiusY)), CPoint.create(left + width - ((1 - CON_ELLIPSE_CURVE_LENGTH) * radiusX), top + height)));
            }
            else {
                this.add(CPathPoint.create(EPathPointKind.LINETO, CPoint.create(left + width, top + height - radiusY), CPoint.create(left, top), CPoint.create(left, top)));
                this.add(CPathPoint.create(EPathPointKind.CURVETO3, CPoint.create(left + width - radiusX, top + height), CPoint.create(left + width, top + height - ((1 - CON_ELLIPSE_CURVE_LENGTH) * radiusY)), CPoint.create(left + width - ((1 - CON_ELLIPSE_CURVE_LENGTH) * radiusX), top + height)));
            }
        }
        if (rds.has("leftBottom") || radiusX == 0 || radiusY == 0) {
            if (disableLineSet.has("bottom")) {
                this.add(CPathPoint.create(EPathPointKind.MOVETO, CPoint.create(left, top + height), CPoint.create(left, top), CPoint.create(left, top)));
            }
            else {
                this.add(CPathPoint.create(EPathPointKind.LINETO, CPoint.create(left, top + height), CPoint.create(left, top), CPoint.create(left, top)));
            }
        }
        else {
            if (disableLineSet.has("bottom")) {
                this.add(CPathPoint.create(EPathPointKind.MOVETO, CPoint.create(left + radiusX, top + height), CPoint.create(left, top), CPoint.create(left, top)));
                this.add(CPathPoint.create(EPathPointKind.CURVETO3, CPoint.create(left, top + height - radiusY), CPoint.create(left + ((1 - CON_ELLIPSE_CURVE_LENGTH) * radiusX), top + height), CPoint.create(left, top + height - ((1 - CON_ELLIPSE_CURVE_LENGTH) * radiusY))));
            }
            else {
                this.add(CPathPoint.create(EPathPointKind.LINETO, CPoint.create(left + radiusX, top + height), CPoint.create(left, top), CPoint.create(left, top)));
                this.add(CPathPoint.create(EPathPointKind.CURVETO3, CPoint.create(left, top + height - radiusY), CPoint.create(left + ((1 - CON_ELLIPSE_CURVE_LENGTH) * radiusX), top + height), CPoint.create(left, top + height - ((1 - CON_ELLIPSE_CURVE_LENGTH) * radiusY))));
            }
        }
        if (!disableLineSet.has("left")) {
            if (rds.has("leftTop") || radiusX == 0 || radiusY == 0) {
                this.add(CPathPoint.create(EPathPointKind.LINETO, CPoint.create(left, top), CPoint.create(left, top), CPoint.create(left, top)));
            }
            else {
                this.add(CPathPoint.create(EPathPointKind.LINETO, CPoint.create(left, top + radiusY), CPoint.create(left, top), CPoint.create(left, top)));
            }
            this.add(CPathPoint.create(EPathPointKind.CLOSE, CPoint.create(left, top), CPoint.create(left, top), CPoint.create(left, top)));
        }
    }
    makeEllipseData(left, top, width, height, isClear = true) {
        function point(x, y) {
            return CPoint.create(x, y);
        }
        if (isClear) {
            this.clear();
            this.add(CPathPoint.create(EPathPointKind.BEGIN, point(left, top), point(left, top), point(left, top)));
        }
        this.add(CPathPoint.create(EPathPointKind.MOVETO, point(left, top + (height / 2)), point(left, top), point(left, top)));
        this.add(CPathPoint.create(EPathPointKind.CURVETO3, point(left + (width / 2), top), point(left, top + ((height / 2) * (1 - CON_ELLIPSE_CURVE_LENGTH))), point(left + ((width / 2) * (1 - CON_ELLIPSE_CURVE_LENGTH)), top)));
        this.add(CPathPoint.create(EPathPointKind.CURVETO3, point(left + width, top + (height / 2)), point(left + (width / 2) + ((width / 2) * CON_ELLIPSE_CURVE_LENGTH), top), point(left + width, top + ((height / 2) * (1 - CON_ELLIPSE_CURVE_LENGTH)))));
        this.add(CPathPoint.create(EPathPointKind.CURVETO3, point(left + (width / 2), top + height), point(left + width, top + (height / 2) + ((height / 2) * CON_ELLIPSE_CURVE_LENGTH)), point(left + (width / 2) + ((width / 2) * CON_ELLIPSE_CURVE_LENGTH), top + height)));
        this.add(CPathPoint.create(EPathPointKind.CURVETO3, point(left, top + (height / 2)), point(left + ((width / 2) * (1 - CON_ELLIPSE_CURVE_LENGTH)), top + height), point(left, top + (height / 2) + ((height / 2) * CON_ELLIPSE_CURVE_LENGTH))));
        this.add(CPathPoint.create(EPathPointKind.CLOSE, point(left, top), point(left, top), point(left, top)));
    }
    makePoligonData(count, hasClose = false, startAngle) {
        this.clear();
        let lst = CPoint.getPoligonPoints(count, true, startAngle);
        for (let n = 0; n < lst.length; n++) {
            if (n == 0) {
                this.addPointMoveTo(lst.get(n));
            }
            else {
                this.addPointLineTo(lst.get(n));
            }
        }
        if (hasClose) {
            this.addPointClose();
        }
        return this;
    }
    makePoligonRoundData(count, roundValue, hasClose = false, startAngle) {
        this.clear();
        let lst = CPoint.getPoligonPoints(count, true, startAngle);
        for (let n = 0; n < lst.length; n++) {
            if (n == 0) {
                let pt = CPoint.getLineMiddlePoint(lst.get(lst.length - 2), lst.get(lst.length - 1), roundValue);
                this.addPointMoveTo(pt);
                let ptNext = new CPoint(0, 0);
                if (n + 1 < lst.length) {
                    ptNext = CPoint.getLineMiddlePoint(lst.get(0), lst.get(1), 1 - roundValue);
                    let pts = this.getCurvePoint(pt, lst.get(0), ptNext);
                    this.addPointCurveTo3(ptNext, pts.ptCurve1, pts.ptCurve2);
                }
            }
            else {
                let pt = lst[n];
                let ptNext = new CPoint(0, 0);
                let ptPre = CPoint.getLineMiddlePoint(lst.get(n - 1), pt, roundValue);
                this.addPointLineTo(ptPre);
                if (n + 1 < lst.length) {
                    ptNext = CPoint.getLineMiddlePoint(pt, lst.get(n + 1), 1 - roundValue);
                    let pts = this.getCurvePoint(ptPre, pt, ptNext);
                    this.addPointCurveTo3(ptNext, pts.ptCurve1, pts.ptCurve2);
                }
            }
        }
        if (hasClose) {
            this.addPointClose();
        }
        return this;
    }
    makeHornData(count, innerDistance, hasClose = false, startAngle) {
        this.clear();
        let lst = CPoint.getHornPoints(count, innerDistance, true, startAngle);
        for (let n = 0; n < lst.length; n++) {
            if (n == 0) {
                this.addPointMoveTo(lst.get(n));
            }
            else {
                this.addPointLineTo(lst.get(n));
            }
        }
        if (hasClose) {
            this.addPointClose();
        }
        return this;
    }
    makeHornRoundData(count, innerDistance, roundValue, isRoundHornOnly = true, hasClose = false, startAngle) {
        this.clear();
        let lst = CPoint.getHornPoints(count, innerDistance, true, startAngle);
        for (let n = 0; n < lst.length; n++) {
            if (n == 0) {
                let pt = CPoint.getLineMiddlePoint(lst[lst.length - 2], lst[lst.length - 1], roundValue);
                this.addPointMoveTo(pt);
                let ptNext = new CPoint(0, 0);
                if (n + 1 < lst.length) {
                    ptNext = CPoint.getLineMiddlePoint(lst[0], lst[1], 1 - roundValue);
                    let pts = this.getCurvePoint(pt, lst[0], ptNext);
                    this.addPointCurveTo3(ptNext, pts.ptCurve1, pts.ptCurve2);
                }
            }
            else {
                if (isRoundHornOnly) {
                    if (n % 2 == 0) {
                        let pt = lst[n];
                        let ptNext = new CPoint(0, 0);
                        let ptPre = CPoint.getLineMiddlePoint(lst[n - 1], pt, roundValue);
                        this.addPointLineTo(ptPre);
                        if (n + 1 < lst.length) {
                            ptNext = CPoint.getLineMiddlePoint(pt, lst[n + 1], 1 - roundValue);
                            let pts = this.getCurvePoint(ptPre, pt, ptNext);
                            this.addPointCurveTo3(ptNext, pts.ptCurve1, pts.ptCurve2);
                        }
                    }
                    else {
                        this.addPointLineTo(lst[n]);
                    }
                }
                else {
                    let pt = lst[n];
                    let ptNext = new CPoint(0, 0);
                    let ptPre = CPoint.getLineMiddlePoint(lst[n - 1], pt, roundValue);
                    this.addPointLineTo(ptPre);
                    if (n + 1 < lst.length) {
                        ptNext = CPoint.getLineMiddlePoint(pt, lst[n + 1], 1 - roundValue);
                        let pts = this.getCurvePoint(ptPre, pt, ptNext);
                        this.addPointCurveTo3(ptNext, pts.ptCurve1, pts.ptCurve2);
                    }
                }
            }
        }
        if (hasClose) {
            this.addPointClose();
        }
        return this;
    }
    makeArcData(center, startAngle, rotationAngle) {
        this.clear();
        let sang = startAngle;
        let lang = rotationAngle;
        let bpt = CPoint.getAngleToPoint(center, 0.5, 0.5, sang);
        this.addPointMoveTo(bpt);
        if (rotationAngle > 0) {
            while (lang > 90) {
                let rpt = CPoint.getAngleToPoint(center, 0.5, 0.5, sang + 90);
                let cl = CON_ELLIPSE_CURVE_LENGTH;
                let cpt1 = CPoint.getAngleToPoint(bpt, 0.5 * cl, 0.5 * cl, 90, CPoint.getAngleFromTwoPoint(center, bpt));
                let cpt2 = CPoint.getAngleToPoint(rpt, 0.5 * cl, 0.5 * cl, -90, CPoint.getAngleFromTwoPoint(center, rpt));
                this.addPointCurveTo3(rpt, cpt1, cpt2);
                bpt.copyFrom(rpt);
                sang += 90;
                lang -= 90;
            }
            let rpt = CPoint.getAngleToPoint(center, 0.5, 0.5, sang + lang);
            let cl = CCalc.cr(CON_ELLIPSE_CURVE_LENGTH, 0, 90, lang, 2);
            let cpt1 = CPoint.getAngleToPoint(bpt, 0.5 * cl, 0.5 * cl, 90, CPoint.getAngleFromTwoPoint(center, bpt));
            let cpt2 = CPoint.getAngleToPoint(rpt, 0.5 * cl, 0.5 * cl, -90, CPoint.getAngleFromTwoPoint(center, rpt));
            this.addPointCurveTo3(rpt, cpt1, cpt2);
        }
        else {
            while (lang < -90) {
                let rpt = CPoint.getAngleToPoint(center, 0.5, 0.5, sang - 90);
                let cl = CON_ELLIPSE_CURVE_LENGTH;
                let cpt1 = CPoint.getAngleToPoint(bpt, 0.5 * cl, 0.5 * cl, -90, CPoint.getAngleFromTwoPoint(center, bpt));
                let cpt2 = CPoint.getAngleToPoint(rpt, 0.5 * cl, 0.5 * cl, 90, CPoint.getAngleFromTwoPoint(center, rpt));
                this.addPointCurveTo3(rpt, cpt1, cpt2);
                bpt.copyFrom(rpt);
                sang -= 90;
                lang += 90;
            }
            let rpt = CPoint.getAngleToPoint(center, 0.5, 0.5, sang + lang);
            let cl = CCalc.cr(CON_ELLIPSE_CURVE_LENGTH, 0, 90, Math.abs(lang), 2);
            let cpt1 = CPoint.getAngleToPoint(bpt, 0.5 * cl, 0.5 * cl, -90, CPoint.getAngleFromTwoPoint(center, bpt));
            let cpt2 = CPoint.getAngleToPoint(rpt, 0.5 * cl, 0.5 * cl, 90, CPoint.getAngleFromTwoPoint(center, rpt));
            this.addPointCurveTo3(rpt, cpt1, cpt2);
        }
        return this;
    }
    twoLineToCurve(index, roundValue) {
        if (index - 1 < 0 || index + 1 > this.length - 1 || this[index].pointKind != EPathPointKind.LINETO || this[index + 1].pointKind != EPathPointKind.LINETO)
            return;
        let pts = this.getTwoLineCurvePoint(this[index - 1].point, this[index].point, this[index + 1].point, roundValue);
        this[index].point.copyFrom(pts.pt1Stop);
        this.insert(index + 1, CPathPoint.create(EPathPointKind.CURVETO3, CPoint.create(pts.pt2Start.x, pts.pt2Start.y), CPoint.create(pts.ptCurve1.x, pts.ptCurve1.y), CPoint.create(pts.ptCurve2.x, pts.ptCurve2.y)));
    }
    getTwoLineCurvePoint(pt1, pt2, pt3, roundValue) {
        let pt1st = CPoint.getLineMiddlePoint(pt1, pt2, roundValue);
        let pt2st = CPoint.getLineMiddlePoint(pt2, pt3, 1 - roundValue);
        let re = {
            pt1Start: pt1,
            pt1Stop: pt1st,
            ptCurve1: CPoint.getLineMiddlePoint(pt1st, pt2, CON_ELLIPSE_CURVE_LENGTH),
            ptCurve2: CPoint.getLineMiddlePoint(pt2, pt2st, 1 - CON_ELLIPSE_CURVE_LENGTH),
            pt2Start: pt2st,
            pt2Stop: pt3
        };
        return re;
    }
    getCurvePoint(pt1, pt2, pt3) {
        let re = {
            ptStart: pt1,
            ptCurve1: CPoint.getLineMiddlePoint(pt1, pt2, CON_ELLIPSE_CURVE_LENGTH),
            ptCurve2: CPoint.getLineMiddlePoint(pt2, pt3, 1 - CON_ELLIPSE_CURVE_LENGTH),
            ptStop: pt3
        };
        return re;
    }
    addPointList(list) {
        for (let n = 0; n < list.length; n++) {
            let pt = list.get(n).copyTo();
            this.add(pt);
        }
    }
    invertX() {
        let rt = this.getBounds();
        let axis = rt.left + (rt.width / 2);
        for (let n = 0; n < this.length; n++) {
            this.get(n).point.x += (axis - this.get(n).point.x) * 2;
            this.get(n).cPoint1.x += (axis - this.get(n).cPoint1.x) * 2;
            this.get(n).cPoint2.x += (axis - this.get(n).cPoint2.x) * 2;
        }
    }
    invertY() {
        let rt = this.getBounds();
        let axis = rt.top + (rt.height / 2);
        for (let n = 0; n < this.length; n++) {
            this.get(n).point.y += (axis - this.get(n).point.y) * 2;
            this.get(n).cPoint1.y += (axis - this.get(n).cPoint1.y) * 2;
            this.get(n).cPoint2.y += (axis - this.get(n).cPoint2.y) * 2;
        }
    }
    invert() {
        this.invertX();
        this.invertY();
    }
    lineToCurve() {
        for (let n = 0; n < this.length; n++) {
            if (this.get(n).pointKind == EPathPointKind.LINETO && n > 0) {
                if (this.get(n - 1).pointKind == EPathPointKind.MOVETO ||
                    this.get(n - 1).pointKind == EPathPointKind.LINETO ||
                    this.get(n - 1).pointKind == EPathPointKind.CURVETO2 ||
                    this.get(n - 1).pointKind == EPathPointKind.CURVETO3) {
                    let pre = this.get(n - 1).point;
                    this.get(n).pointKind = EPathPointKind.CURVETO3;
                    let pt = CPoint.getLineMiddlePoint(pre.toPoint(), this.get(n).point.toPoint(), 1 / 3);
                    this.get(n).cPoint1.x = pt.x;
                    this.get(n).cPoint1.y = pt.y;
                    pt = CPoint.getLineMiddlePoint(pre.toPoint(), this.get(n).point.toPoint(), 1 / 3 * 2);
                    this.get(n).cPoint2.x = pt.x;
                    this.get(n).cPoint2.y = pt.y;
                }
            }
        }
    }
    getSplitLine(count) {
        let tmp = new CPathPointList();
        for (let n = 0; n < this.length; n++) {
            if (this.get(n).pointKind == EPathPointKind.LINETO || this.get(n).pointKind == EPathPointKind.CURVETO2 || this.get(n).pointKind == EPathPointKind.CURVETO3 && n > 0) {
                if (this.get(n - 1).pointKind == EPathPointKind.MOVETO ||
                    this.get(n - 1).pointKind == EPathPointKind.LINETO ||
                    this.get(n - 1).pointKind == EPathPointKind.CURVETO2 ||
                    this.get(n - 1).pointKind == EPathPointKind.CURVETO3) {
                    if (this.get(n).pointKind == EPathPointKind.LINETO) {
                        let arr = CPoint.splitLinePoints(this.get(n - 1).point.toPoint(), this.get(n).point.toPoint(), count);
                        for (let n = 0; n < arr.length; n++) {
                            tmp.addPointLineTo(arr[n]);
                        }
                    }
                    if (this.get(n).pointKind == EPathPointKind.CURVETO2) {
                        let arr = CPoint.splitCurve2LinePoints(this.get(n - 1).point.toPoint(), this.get(n).cPoint1.toPoint(), this.get(n).point.toPoint(), count);
                        for (let n = 0; n < arr.length; n++) {
                            tmp.addPointLineTo(arr[n]);
                        }
                    }
                    if (this.get(n).pointKind == EPathPointKind.CURVETO3) {
                        let arr = CPoint.splitCurveLinePoints(this.get(n - 1).point.toPoint(), this.get(n).cPoint1.toPoint(), this.get(n).cPoint2.toPoint(), this.get(n).point.toPoint(), count);
                        for (let n = 0; n < arr.length; n++) {
                            tmp.addPointLineTo(arr[n]);
                        }
                    }
                }
            }
            else {
                tmp.add(this.get(n).copyTo());
            }
        }
        return tmp;
    }
    splitLine(count) {
        let pd = this.getSplitLine(count);
        this.copyFrom(pd);
    }
}
class CFont extends CNotifyChangeKindObject {
    constructor() {
        super(...arguments);
        this._fontStyle = "normal";
        this._fontVariant = "normal";
        this._fontWeight = "normal";
        this._fontSize = 12;
        this._fontFamily = "Arial";
    }
    static get CON_CHANGE_STYLE() { return "s"; }
    static get CON_CHANGE_VARIANT() { return "v"; }
    static get CON_CHANGE_WEIGHT() { return "w"; }
    static get CON_CHANGE_SIZE() { return "si"; }
    static get CON_CHANGE_FAMILY() { return "f"; }
    get fontStyle() {
        return this._fontStyle;
    }
    set fontStyle(value) {
        if (this._fontStyle != value) {
            this._fontStyle = value;
            this.doChange(CFont.CON_CHANGE_STYLE);
        }
    }
    get fontVariant() {
        return this._fontVariant;
    }
    set fontVariant(value) {
        if (this._fontVariant != value) {
            this._fontVariant = value;
            this.doChange(CFont.CON_CHANGE_VARIANT);
        }
    }
    get fontWeight() {
        return this._fontWeight;
    }
    set fontWeight(value) {
        if (this._fontWeight != value) {
            this._fontWeight = value;
            this.doChange(CFont.CON_CHANGE_WEIGHT);
        }
    }
    get fontSize() {
        return this._fontSize;
    }
    set fontSize(value) {
        if (this._fontSize != value) {
            this._fontSize = value;
            this.doChange(CFont.CON_CHANGE_SIZE);
        }
    }
    get fontFamily() {
        return this._fontFamily;
    }
    set fontFamily(value) {
        if (this._fontFamily != value) {
            this._fontFamily = value;
            this.doChange(CFont.CON_CHANGE_FAMILY);
        }
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "fontStyle", this.fontStyle, "normal");
        CDataClass.putData(data, "fontVariant", this.fontVariant, "normal");
        CDataClass.putData(data, "fontWeight", this.fontWeight, "normal");
        CDataClass.putData(data, "fontSize", this.fontSize, 12);
        CDataClass.putData(data, "fontFamily", this.fontFamily, "Arial");
    }
    doFromData(data) {
        super.doFromData(data);
        this.fontStyle = CDataClass.getData(data, "fontStyle", "normal");
        this.fontVariant = CDataClass.getData(data, "fontVariant", "normal");
        this.fontWeight = CDataClass.getData(data, "fontWeight", "normal");
        this.fontSize = CDataClass.getData(data, "fontSize", 12);
        this.fontFamily = CDataClass.getData(data, "fontFamily", "Arial");
    }
    setFont(ctx) {
        ctx.font = this.fontStyle + " " + this.fontVariant + " " + this.fontWeight + " " + this.fontSize + "px " + this.fontFamily;
    }
}
var ETextAlign;
(function (ETextAlign) {
    ETextAlign[ETextAlign["HEAD"] = 0] = "HEAD";
    ETextAlign[ETextAlign["CENTER"] = 1] = "CENTER";
    ETextAlign[ETextAlign["TAIL"] = 2] = "TAIL";
})(ETextAlign || (ETextAlign = {}));
class CCustomTextSet extends CFont {
    constructor() {
        super();
        this._hAlign = ETextAlign.CENTER;
        this._vAlign = ETextAlign.CENTER;
        this._margins = new CNotifyRect(0, 0, 0, 0);
        let self = this;
        this._margins.onChange = function () {
            self.doChange(CCustomTextSet.CON_CHANGE_MARGINS);
        };
    }
    static get CON_CHANGE_H_ALIGN() { return "h"; }
    static get CON_CHANGE_V_ALIGN() { return "v"; }
    static get CON_CHANGE_MARGINS() { return "m"; }
    get margins() {
        return this._margins;
    }
    get hAlign() {
        return this._hAlign;
    }
    set hAlign(value) {
        if (this._hAlign != value) {
            this._hAlign = value;
            this.doChange(CCustomTextSet.CON_CHANGE_H_ALIGN);
        }
    }
    get vAlign() {
        return this._vAlign;
    }
    set vAlign(value) {
        if (this._vAlign != value) {
            this._vAlign = value;
            this.doChange(CCustomTextSet.CON_CHANGE_V_ALIGN);
        }
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "hAlign", this.hAlign, ETextAlign.CENTER);
        CDataClass.putData(data, "vAlign", this.vAlign, ETextAlign.CENTER);
        CDataClass.putData(data, "margins", this.margins.toData(), {}, true);
    }
    doFromData(data) {
        super.doFromData(data);
        this.hAlign = CDataClass.getData(data, "hAlign", ETextAlign.CENTER);
        this.vAlign = CDataClass.getData(data, "vAlign", ETextAlign.CENTER);
        this.margins.fromData(CDataClass.getData(data, "margins", {}, true));
    }
    getTextPoint(ctx, bounds) {
        let l = 0;
        let t = 0;
        switch (this.hAlign) {
            case ETextAlign.HEAD:
                ctx.textAlign = "left";
                l = bounds.left + this._margins.left;
                break;
            case ETextAlign.CENTER:
                ctx.textAlign = "center";
                l = bounds.left + (bounds.width / 2);
                break;
            case ETextAlign.TAIL:
                ctx.textAlign = "right";
                l = bounds.right - this._margins.right;
                break;
        }
        switch (this.vAlign) {
            case ETextAlign.HEAD:
                t = bounds.top + this._margins.top + this._fontSize;
                break;
            case ETextAlign.CENTER:
                t = bounds.top + (bounds.height / 2) + (this._fontSize / 3);
                break;
            case ETextAlign.TAIL:
                t = bounds.bottom - this._margins.bottom;
                break;
        }
        return new CPoint(l, t);
    }
}
class CTextSet extends CCustomTextSet {
    constructor() {
        super();
        this._enabled = true;
        this._fill = new CFillSet();
        this._stroke = new CStrokeSet();
        this._languageKey = "";
        let self = this;
        this._fill.styleKind = EStyleKind.SOLID;
        this._fill.solidColor = "#000000";
        this._fill.onChange = function () {
            self.doChange(CTextSet.CON_CHANGE_FILL);
        };
        this._stroke.onChange = function () {
            self.doChange(CTextSet.CON_CHANGE_STROKE);
        };
    }
    static get CON_CHANGE_ENABLED() { return "e"; }
    static get CON_CHANGE_FILL() { return "fill"; }
    static get CON_CHANGE_STROKE() { return "stroke"; }
    static get CON_CHANGE_LANGUAGE_KEY() { return "lk"; }
    get fill() {
        return this._fill;
    }
    get stroke() {
        return this._stroke;
    }
    get enabled() {
        return this._enabled;
    }
    set enabled(value) {
        this._enabled = value;
    }
    get languageKey() {
        return this._languageKey;
    }
    set languageKey(value) {
        if (this._languageKey != value) {
            this._languageKey = value;
            this.doChange(CTextSet.CON_CHANGE_LANGUAGE_KEY);
        }
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "enabled", this.enabled, true);
        CDataClass.putData(data, "fill", this.fill.toData(), { styleKind: 1, solidColor: "#000000" }, true);
        CDataClass.putData(data, "stroke", this.stroke.toData(), {}, true);
    }
    doFromData(data) {
        super.doFromData(data);
        this.enabled = CDataClass.getData(data, "enabled", true);
        this.fill.fromData(CDataClass.getData(data, "fill", { styleKind: 1, solidColor: "#000000" }, true));
        this.stroke.fromData(CDataClass.getData(data, "stroke", {}, true));
    }
    drawText(ctx, bounds, text, bufferContext) {
        if (!this._enabled || bounds.width == 0 || bounds.height == 0) {
            return;
        }
        let bctx = bufferContext;
        if (bctx != undefined) {
            //bctx.save()			
            bctx.canvas.width = bounds.width;
            bctx.canvas.height = bounds.height;
            bctx.font = this.fontStyle + " " + this.fontVariant + " " + this.fontWeight + " " + this.fontSize + "px " + this.fontFamily;
            this.fill.setContext(bctx, bounds);
            this.stroke.setContext(bctx, bounds);
            /*bctx.scale(2, 1) - 비율조정
            let pt = this.getTextPoint(bctx, new CRect(0, 0, bounds.width / 2, bounds.height))*/
            let pt = this.getTextPoint(bctx, new CRect(0, 0, bounds.width, bounds.height));
            if (text.indexOf("\n") >= 0) {
                let arr = text.split("\n");
                let y = pt.y - ((arr.length * this.fontSize) / 2) + (this.fontSize * 0.5);
                for (let n = 0; n < arr.length; n++) {
                    if (this.fill.styleKind != EStyleKind.EMPTY)
                        bctx.fillText(arr[n], pt.x, y);
                    if (this.stroke.styleKind != EStyleKind.EMPTY)
                        bctx.strokeText(arr[n], pt.x, y);
                    y += this.fontSize;
                }
            }
            else {
                if (this.fill.styleKind != EStyleKind.EMPTY)
                    bctx.fillText(text, pt.x, pt.y);
                if (this.stroke.styleKind != EStyleKind.EMPTY)
                    bctx.strokeText(text, pt.x, pt.y);
            }
            ctx.drawImage(bctx.canvas, bounds.left, bounds.top, bounds.width, bounds.height);
            //bctx.restore()
        }
        else {
            ctx.font = this.fontStyle + " " + this.fontVariant + " " + this.fontWeight + " " + this.fontSize + "px " + this.fontFamily;
            this.fill.setContext(ctx, bounds);
            this.stroke.setContext(ctx, bounds);
            let pt = this.getTextPoint(ctx, bounds);
            if (text.indexOf("\n") >= 0) {
                let arr = text.split("\n");
                let y = pt.y - ((arr.length * this.fontSize) / 2) + (this.fontSize * 0.5);
                for (let n = 0; n < arr.length; n++) {
                    if (this.fill.styleKind != EStyleKind.EMPTY)
                        ctx.fillText(arr[n], pt.x, y);
                    if (this.stroke.styleKind != EStyleKind.EMPTY)
                        ctx.strokeText(arr[n], pt.x, y);
                    y += this.fontSize;
                }
            }
            else {
                if (this.fill.styleKind != EStyleKind.EMPTY)
                    ctx.fillText(text, pt.x, pt.y);
                if (this.stroke.styleKind != EStyleKind.EMPTY)
                    ctx.strokeText(text, pt.x, pt.y);
            }
        }
    }
    static create(color, hAlign = ETextAlign.CENTER, vAlign = ETextAlign.CENTER, size = 12) {
        let re = new CTextSet();
        re.fill.solidColor = color;
        re.hAlign = hAlign;
        re.vAlign = vAlign;
        re.fontSize = size;
        re.margins.all = 5;
        return re;
    }
}
class CGradientPoint extends CNotifyChangeKindObject {
    constructor(offset, color) {
        super();
        this._offset = 0;
        this._color = "rgba(255,255,255,1)";
        this._offset = offset;
        this._color = color;
    }
    static get CON_CHANGE_OFFSET() { return "o"; }
    static get CON_CHANGE_COLOR() { return "c"; }
    get offset() {
        return this._offset;
    }
    set offset(value) {
        if (this._offset != value) {
            this._offset = value;
            this.doChange(CGradientPoint.CON_CHANGE_OFFSET);
        }
    }
    get color() {
        return this._color;
    }
    set color(value) {
        if (this._color != value) {
            this._color = value;
            this.doChange(CGradientPoint.CON_CHANGE_COLOR);
        }
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "offset", this.offset, 0);
        CDataClass.putData(data, "color", this.color, "rgba(255,255,255,1)");
    }
    doFromData(data) {
        super.doFromData(data);
        this.offset = CDataClass.getData(data, "offset", 0);
        this.color = CDataClass.getData(data, "color", "rgba(255,255,255,1)");
    }
    static create(offset, color) {
        let re = new CGradientPoint(offset, color);
        return re;
    }
}
class CGradientPointList extends CList {
    addPoint(offset, color) {
        let pt = CGradientPoint.create(offset, color);
        let self = this;
        pt.onChange = function () {
            self.doChange("point");
        };
        this.add(pt);
    }
    insertPoint(index, offset, color) {
        let pt = CGradientPoint.create(offset, color);
        let self = this;
        pt.onChange = function () {
            self.doChange("point");
        };
        this.insert(index, pt);
    }
    doToData(data) {
        super.doToData(data);
        for (let n = 0; n < this.length; n++) {
            data.push(this.get(n).toData());
        }
    }
    doFromData(data) {
        this.clear();
        let self = this;
        for (let n = 0; n < data.length; n++) {
            let item = new CGradientPoint(0, "");
            item.fromData(data[n]);
            item.onChange = function () {
                self.doChange("point");
            };
            this.add(item);
        }
    }
}
var EGradientKind;
(function (EGradientKind) {
    EGradientKind[EGradientKind["LINEAR"] = 0] = "LINEAR";
    EGradientKind[EGradientKind["RADIAL"] = 1] = "RADIAL";
})(EGradientKind || (EGradientKind = {}));
class CGradient extends CNotifyChangeKindObject {
    constructor() {
        super();
        this._gradientKind = EGradientKind.LINEAR;
        this._startPoint = new CNotifyPoint(0, 0);
        this._stopPoint = new CNotifyPoint(0, 1);
        this._pointList = new CGradientPointList();
        this._startRadius = 0;
        this._stopRadius = 360;
        let self = this;
        this._pointList.onChange = function (e, fn) {
            self.doChange(CGradient.CON_CHANGE_POINT_LIST);
        };
        this._startPoint.onChange = function (e, fn) {
            self.doChange(CGradient.CON_CHANGE_START_POINT);
        };
        this._stopPoint.onChange = function (e, fn) {
            self.doChange(CGradient.CON_CHANGE_STOP_POINT);
        };
    }
    static get CON_CHANGE_GRADIENT_KIND() { return "g"; }
    static get CON_CHANGE_START_POINT() { return "sp"; }
    static get CON_CHANGE_STOP_POINT() { return "stp"; }
    static get CON_CHANGE_POINT_LIST() { return "pl"; }
    static get CON_CHANGE_START_RADIUS() { return "sr"; }
    static get CON_CHANGE_STOP_RADIUS() { return "str"; }
    get pointList() {
        return this._pointList;
    }
    get gradientKind() {
        return this._gradientKind;
    }
    set gradientKind(value) {
        if (this._gradientKind != value) {
            this._gradientKind = value;
            this.doChange(CGradient.CON_CHANGE_GRADIENT_KIND);
        }
    }
    get startPoint() {
        return this._startPoint;
    }
    set startPoint(value) {
        if (this._startPoint != value) {
            let self = this;
            this._startPoint = value;
            this._startPoint.onChange = function (e, fn) {
                self.doChange(CGradient.CON_CHANGE_START_POINT);
            };
            this.doChange(CGradient.CON_CHANGE_START_POINT);
        }
    }
    get stopPoint() {
        return this._stopPoint;
    }
    set stopPoint(value) {
        if (this._stopPoint != value) {
            let self = this;
            this._stopPoint = value;
            this._stopPoint.onChange = function (e, fn) {
                self.doChange(CGradient.CON_CHANGE_STOP_POINT);
            };
            this.doChange(CGradient.CON_CHANGE_STOP_POINT);
        }
    }
    get startRadius() {
        return this._startRadius;
    }
    set startRadius(value) {
        if (this._startRadius != value) {
            this._startRadius = value;
            this.doChange(CGradient.CON_CHANGE_START_RADIUS);
        }
    }
    get stopRadius() {
        return this._stopRadius;
    }
    set stopRadius(value) {
        if (this._stopRadius != value) {
            this._stopRadius = value;
            this.doChange(CGradient.CON_CHANGE_STOP_RADIUS);
        }
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "gradientKind", this.gradientKind, EGradientKind.LINEAR);
        CDataClass.putData(data, "startPoint", this.startPoint.toData(), {}, true);
        CDataClass.putData(data, "stopPoint", this.stopPoint.toData(), { y: 1 }, true);
        CDataClass.putData(data, "pointList", this.pointList.toData(), [], true);
        CDataClass.putData(data, "startRadius", this.startRadius, 0);
        CDataClass.putData(data, "stopRadius", this.stopRadius, 360);
    }
    doFromData(data) {
        super.doFromData(data);
        this.gradientKind = CDataClass.getData(data, "gradientKind", EGradientKind.LINEAR);
        this.startPoint.fromData(CDataClass.getData(data, "startPoint", {}, true));
        this.stopPoint.fromData(CDataClass.getData(data, "stopPoint", { y: 1 }, true));
        this.pointList.fromData(CDataClass.getData(data, "pointList", [], true));
        this.startRadius = CDataClass.getData(data, "startRadius", 0);
        this.stopRadius = CDataClass.getData(data, "stopRadius", 360);
    }
    getGradient(ctx, bounds) {
        let grd;
        let x1 = bounds.left + (this._startPoint.x * bounds.width);
        let y1 = bounds.top + (this._startPoint.y * bounds.height);
        let x2 = bounds.left + (this._stopPoint.x * bounds.width);
        let y2 = bounds.top + (this._stopPoint.y * bounds.height);
        if (!isNaN(x1) && !isNaN(y1) && !isNaN(x2) && !isNaN(y2)) {
            if (this._gradientKind == EGradientKind.LINEAR) {
                grd = ctx.createLinearGradient(bounds.left + (this._startPoint.x * bounds.width), bounds.top + (this._startPoint.y * bounds.height), bounds.left + (this._stopPoint.x * bounds.width), bounds.top + (this._stopPoint.y * bounds.height));
            }
            else {
                grd = ctx.createRadialGradient(bounds.left + (this._startPoint.x * bounds.width), bounds.top + (this._startPoint.y * bounds.height), this._startRadius, bounds.left + (this._stopPoint.x * bounds.width), bounds.top + (this._stopPoint.y * bounds.height), this._stopRadius);
            }
            for (var n = 0; n < this._pointList.length; n++) {
                grd.addColorStop(this._pointList.get(n).offset, this._pointList.get(n).color);
            }
            return grd;
        }
        else {
            return undefined;
        }
    }
}
var EStyleKind;
(function (EStyleKind) {
    EStyleKind[EStyleKind["EMPTY"] = 0] = "EMPTY";
    EStyleKind[EStyleKind["SOLID"] = 1] = "SOLID";
    EStyleKind[EStyleKind["GRADIENT"] = 2] = "GRADIENT";
})(EStyleKind || (EStyleKind = {}));
class CFillSet extends CGradient {
    constructor() {
        super(...arguments);
        this._styleKind = EStyleKind.EMPTY;
        this._solidColor = "rgba(255,255,255,1)";
    }
    static get CON_CHANGE_STYLE_KIND() { return "styleKind"; }
    static get CON_CHANGE_SOLID_COLOR() { return "solidColor"; }
    get styleKind() {
        return this._styleKind;
    }
    set styleKind(value) {
        if (value != this._styleKind) {
            this._styleKind = value;
            this.doChange(CFillSet.CON_CHANGE_STYLE_KIND);
        }
    }
    get solidColor() {
        return this._solidColor;
    }
    set solidColor(value) {
        if (value != this._solidColor) {
            this._solidColor = value;
            this.doChange(CFillSet.CON_CHANGE_SOLID_COLOR);
        }
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "styleKind", this.styleKind, EStyleKind.EMPTY);
        CDataClass.putData(data, "solidColor", this.solidColor, "rgba(255,255,255,1)");
    }
    doFromData(data) {
        super.doFromData(data);
        this.styleKind = CDataClass.getData(data, "styleKind", EStyleKind.EMPTY);
        this.solidColor = CDataClass.getData(data, "solidColor", "rgba(255,255,255,1)");
    }
    setContext(ctx, bounds) {
        switch (this.styleKind) {
            case EStyleKind.SOLID:
                ctx.fillStyle = this.solidColor;
                break;
            case EStyleKind.GRADIENT:
                let grd = this.getGradient(ctx, bounds);
                if (grd != undefined)
                    ctx.fillStyle = grd;
                break;
        }
    }
}
var EStrokeLineCap;
(function (EStrokeLineCap) {
    EStrokeLineCap[EStrokeLineCap["BUTT"] = 0] = "BUTT";
    EStrokeLineCap[EStrokeLineCap["ROUND"] = 1] = "ROUND";
    EStrokeLineCap[EStrokeLineCap["SQUARE"] = 2] = "SQUARE";
})(EStrokeLineCap || (EStrokeLineCap = {}));
var EStrokeLineJoin;
(function (EStrokeLineJoin) {
    EStrokeLineJoin[EStrokeLineJoin["BEVEL"] = 0] = "BEVEL";
    EStrokeLineJoin[EStrokeLineJoin["ROUND"] = 1] = "ROUND";
    EStrokeLineJoin[EStrokeLineJoin["MITER"] = 2] = "MITER";
})(EStrokeLineJoin || (EStrokeLineJoin = {}));
class CStrokeSet extends CFillSet {
    constructor() {
        super(...arguments);
        this.__lineDash = [];
        this._lineWidth = 0;
        this._lineCap = EStrokeLineCap.ROUND;
        this._lineJoin = EStrokeLineJoin.ROUND;
        this._lineDash = "";
    }
    static get CON_CHANGE_LINE_WIDTH() { return "lineWidth"; }
    static get CON_CHANGE_LINE_CAP() { return "lineCap"; }
    static get CON_CHANGE_LINE_JOIN() { return "lineJoin"; }
    static get CON_CHANGE_LINE_DASH() { return "lineDash"; }
    get lineWidth() {
        return this._lineWidth;
    }
    set lineWidth(value) {
        if (value != this._lineWidth) {
            this._lineWidth = value;
            this.doChange(CStrokeSet.CON_CHANGE_LINE_WIDTH);
        }
    }
    get lineCap() {
        return this._lineCap;
    }
    set lineCap(value) {
        if (value != this._lineCap) {
            this._lineCap = value;
            this.doChange(CStrokeSet.CON_CHANGE_LINE_CAP);
        }
    }
    get lineJoin() {
        return this._lineJoin;
    }
    set lineJoin(value) {
        if (value != this._lineJoin) {
            this._lineJoin = value;
            this.doChange(CStrokeSet.CON_CHANGE_LINE_JOIN);
        }
    }
    get lineDash() {
        return this._lineDash;
    }
    set lineDash(value) {
        if (value != this._lineDash) {
            this._lineDash = value;
            if (value != "") {
                let arr = this._lineDash.split(",");
                this.__lineDash = [];
                for (let n = 0; n < arr.length; n++) {
                    this.__lineDash.push(parseFloat(arr[n]));
                }
            }
            this.doChange(CStrokeSet.CON_CHANGE_LINE_DASH);
        }
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "lineWidth", this.lineWidth, 0);
        CDataClass.putData(data, "lineCap", this.lineCap, EStrokeLineCap.ROUND);
        CDataClass.putData(data, "lineJoin", this.lineJoin, EStrokeLineJoin.ROUND);
        CDataClass.putData(data, "lineDash", this.lineDash, "");
    }
    doFromData(data) {
        super.doFromData(data);
        this.lineWidth = CDataClass.getData(data, "lineWidth", 0);
        this.lineCap = CDataClass.getData(data, "lineCap", EStrokeLineCap.ROUND);
        this.lineJoin = CDataClass.getData(data, "lineJoin", EStrokeLineJoin.ROUND);
        this.lineDash = CDataClass.getData(data, "lineDash", "");
    }
    setContext(ctx, bounds) {
        switch (this.styleKind) {
            case EStyleKind.SOLID:
                ctx.strokeStyle = this.solidColor;
                break;
            case EStyleKind.GRADIENT:
                let grd = this.getGradient(ctx, bounds);
                if (grd != undefined)
                    ctx.strokeStyle = grd;
                break;
        }
        ctx.lineWidth = this.lineWidth;
        switch (this.lineCap) {
            case EStrokeLineCap.BUTT:
                ctx.lineCap = "butt";
                break;
            case EStrokeLineCap.ROUND:
                ctx.lineCap = "round";
                break;
            case EStrokeLineCap.SQUARE:
                ctx.lineCap = "square";
                break;
        }
        switch (this.lineJoin) {
            case EStrokeLineJoin.BEVEL:
                ctx.lineJoin = "bevel";
                break;
            case EStrokeLineJoin.MITER:
                ctx.lineJoin = "miter";
                break;
            case EStrokeLineJoin.ROUND:
                ctx.lineJoin = "round";
                break;
        }
        ctx.setLineDash(this.__lineDash);
    }
}
var ECanvasItemAlign;
(function (ECanvasItemAlign) {
    ECanvasItemAlign[ECanvasItemAlign["NONE"] = 0] = "NONE";
    ECanvasItemAlign[ECanvasItemAlign["LEFT"] = 1] = "LEFT";
    ECanvasItemAlign[ECanvasItemAlign["TOP"] = 2] = "TOP";
    ECanvasItemAlign[ECanvasItemAlign["RIGHT"] = 3] = "RIGHT";
    ECanvasItemAlign[ECanvasItemAlign["BOTTOM"] = 4] = "BOTTOM";
    ECanvasItemAlign[ECanvasItemAlign["CLIENT"] = 5] = "CLIENT";
    ECanvasItemAlign[ECanvasItemAlign["CENTER"] = 6] = "CENTER";
    ECanvasItemAlign[ECanvasItemAlign["LEFTTOP"] = 7] = "LEFTTOP";
    ECanvasItemAlign[ECanvasItemAlign["RIGHTTOP"] = 8] = "RIGHTTOP";
    ECanvasItemAlign[ECanvasItemAlign["LEFTBOTTOM"] = 9] = "LEFTBOTTOM";
    ECanvasItemAlign[ECanvasItemAlign["RIGHTBOTTOM"] = 10] = "RIGHTBOTTOM";
    ECanvasItemAlign[ECanvasItemAlign["MIDDLELEFT"] = 11] = "MIDDLELEFT";
    ECanvasItemAlign[ECanvasItemAlign["MIDDLETOP"] = 12] = "MIDDLETOP";
    ECanvasItemAlign[ECanvasItemAlign["MIDDLERIGHT"] = 13] = "MIDDLERIGHT";
    ECanvasItemAlign[ECanvasItemAlign["MIDDLEBOTTOM"] = 14] = "MIDDLEBOTTOM";
    ECanvasItemAlign[ECanvasItemAlign["HCENTER"] = 15] = "HCENTER";
    ECanvasItemAlign[ECanvasItemAlign["VCENTER"] = 16] = "VCENTER";
})(ECanvasItemAlign || (ECanvasItemAlign = {}));
var ECanvasItemKind;
(function (ECanvasItemKind) {
    ECanvasItemKind[ECanvasItemKind["RECTANGLE"] = 0] = "RECTANGLE";
    ECanvasItemKind[ECanvasItemKind["ROUNDRECTANGLE"] = 1] = "ROUNDRECTANGLE";
    ECanvasItemKind[ECanvasItemKind["ELLIPSE"] = 2] = "ELLIPSE";
    ECanvasItemKind[ECanvasItemKind["ARC"] = 3] = "ARC";
    ECanvasItemKind[ECanvasItemKind["PATH"] = 4] = "PATH";
    ECanvasItemKind[ECanvasItemKind["TEXT"] = 5] = "TEXT";
    ECanvasItemKind[ECanvasItemKind["IMAGE"] = 6] = "IMAGE";
})(ECanvasItemKind || (ECanvasItemKind = {}));
var EPatternKind;
(function (EPatternKind) {
    EPatternKind[EPatternKind["ALL"] = 0] = "ALL";
    EPatternKind[EPatternKind["CHECK_HEAD"] = 1] = "CHECK_HEAD";
    EPatternKind[EPatternKind["CHECK_TAIL"] = 2] = "CHECK_TAIL";
    EPatternKind[EPatternKind["COLUMN"] = 3] = "COLUMN";
    EPatternKind[EPatternKind["ROW"] = 4] = "ROW";
})(EPatternKind || (EPatternKind = {}));
var EPaintKind;
(function (EPaintKind) {
    EPaintKind[EPaintKind["NORMAL"] = 0] = "NORMAL";
    EPaintKind[EPaintKind["PATTERN"] = 1] = "PATTERN";
    EPaintKind[EPaintKind["ROTATE"] = 2] = "ROTATE";
    EPaintKind[EPaintKind["RANDOM"] = 3] = "RANDOM";
})(EPaintKind || (EPaintKind = {}));
class CCanvasItem extends CNotifyChangeKindObject {
    constructor() {
        super();
        this._align = ECanvasItemAlign.NONE;
        this._kind = ECanvasItemKind.RECTANGLE;
        this._name = "";
        this._position = new CNotifyRect(0, 0, 0, 0);
        this._positionUnit = EPositionUnit.PIXEL;
        this._rotationAngle = 0;
        this._rotationCenterX = 0.5;
        this._rotationCenterY = 0.5;
        this._margins = new CNotifyRect(0, 0, 0, 0);
        this._fill = new CFillSet();
        this._stroke = new CStrokeSet();
        this._opacity = 1;
        this._composite = "source-over";
        this._visible = true;
        //path
        this._pathData = new CPathPointList();
        this._pathFitMode = EFitMode.STRETCH;
        //rect
        this._radiusX = 0;
        this._radiusY = 0;
        this._disableRoundSet = new CStringSet();
        this._disableLineSet = new CStringSet();
        //text
        this._textSet = new CTextSet();
        this._text = "";
        //image
        this._imageSrc = "";
        this._imageFitMode = EFitMode.FIT;
        //paint
        this._paintKind = EPaintKind.NORMAL;
        this._paintWidth = 50;
        this._paintHeight = 50;
        //pattern	
        this._patternIgnoreCount = 0;
        this._patternMargin = 0;
        this._patternKind = EPatternKind.ALL;
        //rotate
        this._paintRotateCount = 5;
        this._paintRotateStartAngle = -90;
        this._paintRotateStopAngle = 270;
        this._paintRotateRadiusX = 0.5;
        this._paintRotateRadiusY = 0.5;
        this._paintRotateApplyAngle = true;
        //random
        this._randomCount = 10;
        this._randomWidthMin = 10;
        this._randomWidthMax = 100;
        this._randomHeightMin = 10;
        this._randomHeightMax = 100;
        //effect
        this._filter = "";
        this._shadowColor = "";
        this._shadowBlur = 0;
        this._shadowOffsetX = 0;
        this._shadowOffsetY = 0;
        let self = this;
        this._position.onChange = function () {
            self.doChange(CCanvasItem.CON_CHANGE_POSITION);
        };
        this._pathData.onChange = function () {
            self.doChange(CCanvasItem.CON_CHANGE_PATH_DATA);
        };
        this._fill.onChange = function () {
            self.doChange(CCanvasItem.CON_CHANGE_FILL);
        };
        this._stroke.onChange = function () {
            self.doChange(CCanvasItem.CON_CHANGE_STROKE);
        };
        this._disableRoundSet.onChange = function () {
            self.doChange(CCanvasItem.CON_CHANGE_DISABLE_ROUND_SET);
        };
        this._disableLineSet.onChange = function () {
            self.doChange(CCanvasItem.CON_CHANGE_DISABLE_LINE_SET);
        };
        this._textSet.onChange = function () {
            self.doChange(CCanvasItem.CON_CHANGE_TEXTSET);
        };
        this._margins.onChange = function () {
            self.doChange(CCanvasItem.CON_CHANGE_MARGINS);
        };
    }
    static get CON_CHANGE_ALIGN() { return "a"; }
    static get CON_CHANGE_KIND() { return "k"; }
    static get CON_CHANGE_NAME() { return "i"; }
    static get CON_CHANGE_POSITION() { return "p"; }
    static get CON_CHANGE_POSITION_UNIT() { return "pu"; }
    static get CON_CHANGE_ROTATION_ANGLE() { return "ra"; }
    static get CON_CHANGE_ROTATION_CENTER_X() { return "rx"; }
    static get CON_CHANGE_ROTATION_CENTER_Y() { return "ry"; }
    static get CON_CHANGE_MARGINS() { return "m"; }
    static get CON_CHANGE_FILL() { return "f"; }
    static get CON_CHANGE_STROKE() { return "s"; }
    static get CON_CHANGE_OPACITY() { return "o"; }
    static get CON_CHANGE_VISIBLE() { return "v"; }
    static get CON_CHANGE_PATH_DATA() { return "pd"; }
    static get CON_CHANGE_RADIUS_X() { return "rax"; }
    static get CON_CHANGE_RADIUS_Y() { return "ray"; }
    static get CON_CHANGE_DISABLE_ROUND_SET() { return "dr"; }
    static get CON_CHANGE_DISABLE_LINE_SET() { return "dl"; }
    static get CON_CHANGE_TEXTSET() { return "tx"; }
    static get CON_CHANGE_TEXT() { return "t"; }
    static get CON_CHANGE_FILTER() { return "fi"; }
    static get CON_CHANGE_SHADOW_COLOR() { return "sc"; }
    static get CON_CHANGE_SHADOW_BLUR() { return "sb"; }
    static get CON_CHANGE_SHADOW_OFFSET_X() { return "sx"; }
    static get CON_CHANGE_SHADOW_OFFSET_Y() { return "sy"; }
    get align() {
        return this._align;
    }
    set align(value) {
        if (this._align != value) {
            this._align = value;
            this.doChange(CCanvasItem.CON_CHANGE_ALIGN);
        }
    }
    get rotationAngle() {
        return this._rotationAngle;
    }
    set rotationAngle(value) {
        if (this._rotationAngle != value) {
            this._rotationAngle = value;
            this.doChange(CCanvasItem.CON_CHANGE_ROTATION_ANGLE);
        }
    }
    get rotationCenterX() {
        return this._rotationCenterX;
    }
    set rotationCenterX(value) {
        if (this._rotationCenterX != value) {
            this._rotationCenterX = value;
            this.doChange(CCanvasItem.CON_CHANGE_ROTATION_CENTER_X);
        }
    }
    get rotationCenterY() {
        return this._rotationCenterY;
    }
    set rotationCenterY(value) {
        if (this._rotationCenterY != value) {
            this._rotationCenterY = value;
            this.doChange(CCanvasItem.CON_CHANGE_ROTATION_CENTER_Y);
        }
    }
    get positionUnit() {
        return this._positionUnit;
    }
    set positionUnit(value) {
        if (this._positionUnit != value) {
            this._positionUnit = value;
            this.doChange(CCanvasItem.CON_CHANGE_POSITION_UNIT);
        }
    }
    get kind() {
        return this._kind;
    }
    set kind(value) {
        if (this._kind != value) {
            this._kind = value;
            this.doChange(CCanvasItem.CON_CHANGE_KIND);
        }
    }
    get name() {
        return this._name;
    }
    set name(value) {
        if (this._name != value) {
            this._name = value;
            this.doChange(CCanvasItem.CON_CHANGE_NAME);
        }
    }
    get position() {
        return this._position;
    }
    set position(value) {
        if (this._position != value) {
            this._position = value;
            let self = this;
            this._position.onChange = function () {
                self.doChange(CCanvasItem.CON_CHANGE_POSITION);
            };
            this.doChange(CCanvasItem.CON_CHANGE_POSITION);
        }
    }
    get margins() {
        return this._margins;
    }
    get fill() {
        return this._fill;
    }
    get stroke() {
        return this._stroke;
    }
    get pathData() {
        return this._pathData;
    }
    get textSet() {
        return this._textSet;
    }
    get opacity() {
        return this._opacity;
    }
    set opacity(value) {
        if (this._opacity != value) {
            this._opacity = value;
            this.doChange(CCanvasItem.CON_CHANGE_OPACITY);
        }
    }
    get visible() {
        return this._visible;
    }
    set visible(value) {
        if (this._visible != value) {
            this._visible = value;
            this.doChange(CCanvasItem.CON_CHANGE_VISIBLE);
        }
    }
    get radiusX() {
        return this._radiusX;
    }
    set radiusX(value) {
        if (this._radiusX != value) {
            this._radiusX = value;
            this.doChange(CCanvasItem.CON_CHANGE_RADIUS_X);
        }
    }
    get radiusY() {
        return this._radiusY;
    }
    set radiusY(value) {
        if (this._radiusY != value) {
            this._radiusY = value;
            this.doChange(CCanvasItem.CON_CHANGE_RADIUS_Y);
        }
    }
    get disableRoundSet() {
        return this._disableRoundSet;
    }
    get disableLineSet() {
        return this._disableLineSet;
    }
    get text() {
        return this._text;
    }
    set text(value) {
        if (this._text != value) {
            this._text = value;
            this.doChange(CCanvasItem.CON_CHANGE_TEXT);
        }
    }
    get imageSrc() {
        return this._imageSrc;
    }
    set imageSrc(value) {
        if (this._imageSrc != value) {
            this._imageSrc = value;
            this._image = new Image();
            let self = this;
            this._image.onload = function () {
                self.doChange("imageSrc");
            };
            this._image.src = this._imageSrc;
        }
    }
    get imageFitMode() {
        return this._imageFitMode;
    }
    set imageFitMode(value) {
        if (this._imageFitMode != value) {
            this._imageFitMode = value;
            this.doChange("imageFitMode");
        }
    }
    get pathFitMode() {
        return this._pathFitMode;
    }
    set pathFitMode(value) {
        if (this._pathFitMode != value) {
            this._pathFitMode = value;
            this.doChange("fitmode");
        }
    }
    get paintKind() {
        return this._paintKind;
    }
    set paintKind(value) {
        if (this._paintKind != value) {
            this._paintKind = value;
            this.doChange("paintkind");
        }
    }
    get paintWidth() {
        return this._paintWidth;
    }
    set paintWidth(value) {
        if (this._paintWidth != value) {
            this._paintWidth = value;
            this.doChange("paintw");
        }
    }
    get paintHeight() {
        return this._paintHeight;
    }
    set paintHeight(value) {
        if (this._paintHeight != value) {
            this._paintHeight = value;
            this.doChange("painth");
        }
    }
    get patternIgnoreCount() {
        return this._patternIgnoreCount;
    }
    set patternIgnoreCount(value) {
        if (this._patternIgnoreCount != value) {
            this._patternIgnoreCount = value;
            this.doChange("patterni");
        }
    }
    get patternMargin() {
        return this._patternMargin;
    }
    set patternMargin(value) {
        if (this._patternMargin != value) {
            this._patternMargin = value;
            this.doChange("patternm");
        }
    }
    get patternKind() {
        return this._patternKind;
    }
    set patternKind(value) {
        if (this._patternKind != value) {
            this._patternKind = value;
            this.doChange("patternk");
        }
    }
    get paintRotateCount() {
        return this._paintRotateCount;
    }
    set paintRotateCount(value) {
        if (this._paintRotateCount != value) {
            this._paintRotateCount = value;
            this.doChange("paintRotateCount");
        }
    }
    get paintRotateStartAngle() {
        return this._paintRotateStartAngle;
    }
    set paintRotateStartAngle(value) {
        if (this._paintRotateStartAngle != value) {
            this._paintRotateStartAngle = value;
            this.doChange("paintRotateStartAngle");
        }
    }
    get paintRotateStopAngle() {
        return this._paintRotateStopAngle;
    }
    set paintRotateStopAngle(value) {
        if (this._paintRotateStopAngle != value) {
            this._paintRotateStopAngle = value;
            this.doChange("paintRotateStopAngle");
        }
    }
    get paintRotateRadiusX() {
        return this._paintRotateRadiusX;
    }
    set paintRotateRadiusX(value) {
        if (this._paintRotateRadiusX != value) {
            this._paintRotateRadiusX = value;
            this.doChange("paintRotateRadiusX");
        }
    }
    get paintRotateRadiusY() {
        return this._paintRotateRadiusY;
    }
    set paintRotateRadiusY(value) {
        if (this._paintRotateRadiusY != value) {
            this._paintRotateRadiusY = value;
            this.doChange("paintRotateRadiusY");
        }
    }
    get paintRotateApplyAngle() {
        return this._paintRotateApplyAngle;
    }
    set paintRotateApplyAngle(value) {
        if (this._paintRotateApplyAngle != value) {
            this._paintRotateApplyAngle = value;
            this.doChange("paintRotateApplyAngle");
        }
    }
    get randomCount() {
        return this._randomCount;
    }
    set randomCount(value) {
        if (this._randomCount != value) {
            this._randomCount = value;
            this.doChange("randomCount");
        }
    }
    get randomWidthMin() {
        return this._randomWidthMin;
    }
    set randomWidthMin(value) {
        if (this._randomWidthMin != value) {
            this._randomWidthMin = value;
            this.doChange("randomWidthMin");
        }
    }
    get randomWidthMax() {
        return this._randomWidthMax;
    }
    set randomWidthMax(value) {
        if (this._randomWidthMax != value) {
            this._randomWidthMax = value;
            this.doChange("randomWidthMax");
        }
    }
    get randomHeightMin() {
        return this._randomHeightMin;
    }
    set randomHeightMin(value) {
        if (this._randomHeightMin != value) {
            this._randomHeightMin = value;
            this.doChange("_randomHeightMin");
        }
    }
    get randomHeightMax() {
        return this._randomHeightMax;
    }
    set randomHeightMax(value) {
        if (this._randomHeightMax != value) {
            this._randomHeightMax = value;
            this.doChange("randomHeightMax");
        }
    }
    get filter() {
        return this._filter;
    }
    set filter(value) {
        if (this._filter != value) {
            this._filter = value;
            this.doChange(CCanvasItem.CON_CHANGE_FILTER);
        }
    }
    get shadowColor() {
        return this._shadowColor;
    }
    set shadowColor(value) {
        if (this._shadowColor != value) {
            this._shadowColor = value;
            this.doChange(CCanvasItem.CON_CHANGE_SHADOW_COLOR);
        }
    }
    get shadowBlur() {
        return this._shadowBlur;
    }
    set shadowBlur(value) {
        if (this._shadowBlur != value) {
            this._shadowBlur = value;
            this.doChange(CCanvasItem.CON_CHANGE_SHADOW_BLUR);
        }
    }
    get shadowOffsetX() {
        return this._shadowOffsetX;
    }
    set shadowOffsetX(value) {
        if (this._shadowOffsetX != value) {
            this._shadowOffsetX = value;
            this.doChange(CCanvasItem.CON_CHANGE_SHADOW_OFFSET_X);
        }
    }
    get shadowOffsetY() {
        return this._shadowOffsetY;
    }
    set shadowOffsetY(value) {
        if (this._shadowOffsetY != value) {
            this._shadowOffsetY = value;
            this.doChange(CCanvasItem.CON_CHANGE_SHADOW_OFFSET_Y);
        }
    }
    get composite() {
        return this._composite;
    }
    set composite(value) {
        if (this._composite != value) {
            this._composite = value;
            this.doChange("composite");
        }
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "align", this.align, ECanvasItemAlign.NONE);
        CDataClass.putData(data, "kind", this.kind, ECanvasItemKind.RECTANGLE);
        CDataClass.putData(data, "name", this.name, "");
        CDataClass.putData(data, "position", this.position.toData(), {}, true);
        CDataClass.putData(data, "positionUnit", this.positionUnit, EPositionUnit.PIXEL);
        CDataClass.putData(data, "rotationAngle", this.rotationAngle, 0);
        CDataClass.putData(data, "rotationCenterX", this.rotationCenterX, 0.5);
        CDataClass.putData(data, "rotationCenterY", this.rotationCenterY, 0.5);
        CDataClass.putData(data, "margins", this.margins.toData(), {}, true);
        CDataClass.putData(data, "fill", this.fill.toData(), {}, true);
        CDataClass.putData(data, "stroke", this.stroke.toData(), {}, true);
        CDataClass.putData(data, "opacity", this.opacity, 1);
        CDataClass.putData(data, "visible", this.visible, true);
        CDataClass.putData(data, "pathData", this.pathData.toData(), {}, true);
        CDataClass.putData(data, "radiusX", this.radiusX, 0);
        CDataClass.putData(data, "radiusY", this.radiusY, 0);
        CDataClass.putData(data, "disableRoundSet", this.disableRoundSet.toData(), [], true);
        CDataClass.putData(data, "disableLineSet", this.disableLineSet.toData(), [], true);
        CDataClass.putData(data, "textSet", this.textSet.toData(), {}, true);
        CDataClass.putData(data, "text", this.text, "");
        CDataClass.putData(data, "paintKind", this.paintKind, EPaintKind.NORMAL);
        CDataClass.putData(data, "paintWidth", this.paintWidth, 50);
        CDataClass.putData(data, "paintHeight", this.paintHeight, 50);
        CDataClass.putData(data, "patternIgnoreCount", this.patternIgnoreCount, 0);
        CDataClass.putData(data, "patternMargin", this.patternMargin, 0);
        CDataClass.putData(data, "patternKind", this.patternKind, EPatternKind.ALL);
        CDataClass.putData(data, "paintRotateCount", this.paintRotateCount, 5);
        CDataClass.putData(data, "paintRotateStartAngle", this.paintRotateStartAngle, -90);
        CDataClass.putData(data, "paintRotateStopAngle", this.paintRotateStopAngle, 270);
        CDataClass.putData(data, "paintRotateRadiusX", this.paintRotateRadiusX, 0.5);
        CDataClass.putData(data, "paintRotateRadiusY", this.paintRotateRadiusY, 0.5);
        CDataClass.putData(data, "paintRotateApplyAngle", this.paintRotateApplyAngle, true);
        CDataClass.putData(data, "randomCount", this.randomCount, 10);
        CDataClass.putData(data, "randomWidthMin", this.randomWidthMin, 10);
        CDataClass.putData(data, "randomWidthMax", this.randomWidthMax, 100);
        CDataClass.putData(data, "randomHeightMin", this.randomHeightMin, 10);
        CDataClass.putData(data, "randomHeightMax", this.randomHeightMax, 100);
        CDataClass.putData(data, "filter", this.filter, "");
        CDataClass.putData(data, "shadowColor", this.shadowColor, "");
        CDataClass.putData(data, "shadowBlur", this.shadowBlur, 0);
        CDataClass.putData(data, "shadowOffsetX", this.shadowOffsetX, 0);
        CDataClass.putData(data, "shadowOffsetY", this.shadowOffsetY, 0);
        CDataClass.putData(data, "pathFitMode", this.pathFitMode, EFitMode.STRETCH);
        CDataClass.putData(data, "imageSrc", this.imageSrc, "");
        CDataClass.putData(data, "imageFitMode", this.imageFitMode, EFitMode.FIT);
        CDataClass.putData(data, "composite", this.composite, "source-over");
    }
    doFromData(data) {
        super.doFromData(data);
        this.align = CDataClass.getData(data, "align", ECanvasItemAlign.NONE);
        this.kind = CDataClass.getData(data, "kind", ECanvasItemKind.RECTANGLE);
        this.name = CDataClass.getData(data, "name", "");
        this.position.fromData(CDataClass.getData(data, "position", {}, true));
        this.positionUnit = CDataClass.getData(data, "positionUnit", EPositionUnit.PIXEL);
        this.rotationAngle = CDataClass.getData(data, "rotationAngle", 0);
        this.rotationCenterX = CDataClass.getData(data, "rotationCenterX", 0.5);
        this.rotationCenterY = CDataClass.getData(data, "rotationCenterY", 0.5);
        this.margins.fromData(CDataClass.getData(data, "margins", {}, true));
        this.fill.fromData(CDataClass.getData(data, "fill", {}, true));
        this.stroke.fromData(CDataClass.getData(data, "stroke", {}, true));
        this.opacity = CDataClass.getData(data, "opacity", 1);
        this.visible = CDataClass.getData(data, "visible", true);
        this.pathData.fromData(CDataClass.getData(data, "pathData", {}, true));
        this.radiusX = CDataClass.getData(data, "radiusX", 0);
        this.radiusY = CDataClass.getData(data, "radiusY", 0);
        this.disableRoundSet.fromData(CDataClass.getData(data, "disableRoundSet", [], true));
        this.disableLineSet.fromData(CDataClass.getData(data, "disableLineSet", [], true));
        this.textSet.fromData(CDataClass.getData(data, "textSet", {}, true));
        this.text = CDataClass.getData(data, "text", "");
        this.paintKind = CDataClass.getData(data, "paintKind", EPaintKind.NORMAL);
        this.paintWidth = CDataClass.getData(data, "paintWidth", 50);
        this.paintHeight = CDataClass.getData(data, "paintHeight", 50);
        this.patternIgnoreCount = CDataClass.getData(data, "patternIgnoreCount", 0);
        this.patternMargin = CDataClass.getData(data, "patternMargin", 0);
        this.patternKind = CDataClass.getData(data, "patternKind", EPatternKind.ALL);
        this.paintRotateCount = CDataClass.getData(data, "paintRotateCount", 5);
        this.paintRotateStartAngle = CDataClass.getData(data, "paintRotateStartAngle", -90);
        this.paintRotateStopAngle = CDataClass.getData(data, "paintRotateStopAngle", 270);
        this.paintRotateRadiusX = CDataClass.getData(data, "paintRotateRadiusX", 0.5);
        this.paintRotateRadiusY = CDataClass.getData(data, "paintRotateRadiusY", 0.5);
        this.paintRotateApplyAngle = CDataClass.getData(data, "paintRotateApplyAngle", true);
        this.randomCount = CDataClass.getData(data, "randomCount", 10);
        this.randomWidthMin = CDataClass.getData(data, "randomWidthMin", 10);
        this.randomWidthMax = CDataClass.getData(data, "randomWidthMax", 100);
        this.randomHeightMin = CDataClass.getData(data, "randomHeightMin", 10);
        this.randomHeightMax = CDataClass.getData(data, "randomHeightMax", 100);
        this.filter = CDataClass.getData(data, "filter", "");
        this.shadowColor = CDataClass.getData(data, "shadowColor", "");
        this.shadowBlur = CDataClass.getData(data, "shadowBlur", 0);
        this.shadowOffsetX = CDataClass.getData(data, "shadowOffsetX", 0);
        this.shadowOffsetY = CDataClass.getData(data, "shadowOffsetY", 0);
        this.pathFitMode = CDataClass.getData(data, "pathFitMode", EFitMode.STRETCH);
        this.imageSrc = CDataClass.getData(data, "imageSrc", "");
        this.imageFitMode = CDataClass.getData(data, "imageFitMode", EFitMode.FIT);
        this.composite = CDataClass.getData(data, "composite", "source-over");
    }
    setAlign(rt, bounds) {
        let rb = this.position;
        let l = 0;
        let t = 0;
        switch (this._align) {
            case ECanvasItemAlign.NONE:
                rt.copyFrom(rb.rect);
                rt.offset(bounds.left, bounds.top);
                break;
            case ECanvasItemAlign.LEFT:
                rt.set(bounds.left + this.margins.left, bounds.top + this.margins.top, bounds.left + this.margins.left + rb.width, bounds.bottom - this.margins.bottom);
                break;
            case ECanvasItemAlign.TOP:
                rt.set(bounds.left + this.margins.left, bounds.top + this.margins.top, bounds.right - this.margins.right, bounds.top + this.margins.top + rb.height);
                break;
            case ECanvasItemAlign.RIGHT:
                rt.set(bounds.right - this.margins.right - rb.width, bounds.top + this.margins.top, bounds.right - this.margins.right, bounds.bottom - this.margins.bottom);
                break;
            case ECanvasItemAlign.BOTTOM:
                rt.set(bounds.left + this.margins.left, bounds.bottom - this.margins.bottom - rb.height, bounds.right - this.margins.right, bounds.bottom - this.margins.bottom);
                break;
            case ECanvasItemAlign.CENTER:
                l = ((bounds.width - rb.width) / 2) + bounds.left;
                t = ((bounds.height - rb.height) / 2) + bounds.top;
                rt.set(l, t, l + rb.width, t + rb.height);
                break;
            case ECanvasItemAlign.LEFTTOP:
                rt.set(bounds.left + this.margins.left, bounds.top + this.margins.top, bounds.left + this.margins.left + rb.width, bounds.top + this.margins.top + rb.height);
                break;
            case ECanvasItemAlign.LEFTBOTTOM:
                rt.set(bounds.left + this.margins.left, bounds.bottom - this.margins.bottom - rb.height, bounds.left + this.margins.left + rb.width, bounds.bottom - this.margins.bottom);
                break;
            case ECanvasItemAlign.RIGHTTOP:
                rt.set(bounds.right - this.margins.right - rb.width, bounds.top + this.margins.top, bounds.right - this.margins.right, bounds.top + this.margins.top + rb.height);
                break;
            case ECanvasItemAlign.RIGHTBOTTOM:
                rt.set(bounds.right - this.margins.right - rb.width, bounds.bottom - this.margins.bottom - rb.height, bounds.right - this.margins.right, bounds.bottom - this.margins.bottom);
                break;
            case ECanvasItemAlign.MIDDLELEFT:
                t = ((bounds.height - rb.height) / 2) + bounds.top;
                rt.set(bounds.left + this.margins.left, t, bounds.left + this.margins.left + rb.width, t + rb.height);
                break;
            case ECanvasItemAlign.MIDDLETOP:
                l = ((bounds.width - rb.width) / 2) + bounds.left;
                rt.set(l, bounds.top + this.margins.top, l + rb.width, bounds.top + this.margins.top + rb.height);
                break;
            case ECanvasItemAlign.MIDDLERIGHT:
                t = ((bounds.height - rb.height) / 2) + bounds.top;
                rt.set(bounds.right - this.margins.right - rb.width, t, bounds.right - this.margins.right, t + rb.height);
                break;
            case ECanvasItemAlign.MIDDLEBOTTOM:
                l = ((bounds.width - rb.width) / 2) + bounds.left;
                rt.set(l, bounds.bottom - this.margins.bottom - rb.height, l + rb.width, bounds.bottom - this.margins.bottom);
                break;
            case ECanvasItemAlign.HCENTER:
                l = ((bounds.width - rb.width) / 2) + bounds.left;
                rt.set(l, bounds.top + this.margins.top, l + rb.width, bounds.bottom - this.margins.bottom);
                break;
            case ECanvasItemAlign.VCENTER:
                t = ((bounds.height - rb.height) / 2) + bounds.top;
                rt.set(bounds.left + this.margins.left, t, bounds.right - this.margins.right, t + rb.height);
                break;
        }
    }
    draw(ctx, bounds, bufferContext, scaleX = 1, scaleY = 1) {
        if (!this._visible || this._opacity == 0) {
            return;
        }
        let rt = new CRect(0, 0, 0, 0);
        if (this.position.rect.isEmpty()) {
            rt = new CRect(bounds.left + this._margins.left, bounds.top + this._margins.top, bounds.right - this._margins.right, bounds.bottom - this._margins.bottom);
        }
        else {
            if (this._positionUnit == EPositionUnit.PERCENT) {
                rt.left = CCalc.cr(bounds.width, 0, 100, this.position.left, 2);
                rt.top = CCalc.cr(bounds.height, 0, 100, this.position.top, 2);
                rt.right = CCalc.cr(bounds.width, 0, 100, this.position.right, 2);
                rt.bottom = CCalc.cr(bounds.height, 0, 100, this.position.bottom, 2);
                rt.offset(bounds.left, bounds.top);
            }
            else {
                this.setAlign(rt, bounds);
            }
        }
        ctx.save();
        ctx.scale(scaleX, scaleY);
        ctx.globalAlpha = this.opacity;
        if (this._filter != "")
            ctx.filter = this.filter;
        if (this._shadowColor != "") {
            ctx.shadowColor = this.shadowColor;
            ctx.shadowBlur = this.shadowBlur;
            ctx.shadowOffsetX = this.shadowOffsetX;
            ctx.shadowOffsetY = this.shadowOffsetY;
        }
        ctx.globalCompositeOperation = this.composite;
        let tx = rt.left + (rt.width * this.rotationCenterX);
        let ty = rt.top + (rt.height * this.rotationCenterY);
        ctx.translate(tx, ty);
        ctx.rotate(CCalc.cr(Math.PI, 0, 180, this.rotationAngle, 2));
        ctx.translate(-tx, -ty);
        let self = this;
        function ctxFill(bounds) {
            if (self._fill.styleKind != EStyleKind.EMPTY) {
                //self._fill.setContext(ctx, rt)
                //self._fill.setContext(ctx, self.pathData.getBounds())
                self._fill.setContext(ctx, bounds);
                ctx.fill();
            }
        }
        function ctxStroke(bounds) {
            if (self._stroke.styleKind != EStyleKind.EMPTY && self._stroke.lineWidth > 0) {
                //self._stroke.setContext(ctx, rt)
                //self._stroke.setContext(ctx, self.pathData.getBounds())
                self._stroke.setContext(ctx, bounds);
                ctx.stroke();
            }
        }
        function ctxTextDraw(rect) {
            let str = self._text;
            if (typeof str != "string")
                str = str + "";
            if (str != undefined && str.trim() != "") {
                self._textSet.drawText(ctx, rect, str, bufferContext);
            }
        }
        function patternLoop(callback) {
            let ir = 0;
            let ic = 0;
            let l = 0;
            let t = 0;
            switch (self.patternKind) {
                case EPatternKind.ALL:
                    while (true) {
                        ic = 0;
                        l = 0;
                        if (self._patternIgnoreCount == 0 || ir % (self._patternIgnoreCount + 1) == 0) {
                            while (true) {
                                if (self._patternIgnoreCount == 0 || ic % (self._patternIgnoreCount + 1) == 0) {
                                    callback(rt.left + (ic * self._paintWidth) + (ic * self._patternMargin), rt.top + (ir * self._paintHeight) + (ir * self._patternMargin), self._paintWidth, self._paintHeight);
                                }
                                ic++;
                                l += self._paintWidth + self._patternMargin;
                                if (l > rt.width) {
                                    break;
                                }
                            }
                        }
                        ir++;
                        t += self._paintHeight + self._patternMargin;
                        if (t > rt.height) {
                            break;
                        }
                    }
                    break;
                case EPatternKind.CHECK_HEAD:
                    while (true) {
                        ic = 0;
                        l = 0;
                        while (true) {
                            if ((ir % 2 == 0 && ic % 2 == 0) || (ir % 2 == 1 && ic % 2 == 1)) {
                                callback(rt.left + (ic * self._paintWidth) + (ic * self._patternMargin), rt.top + (ir * self._paintHeight) + (ir * self._patternMargin), self._paintWidth, self._paintHeight);
                            }
                            ic++;
                            l += self._paintWidth + self._patternMargin;
                            if (l > rt.width) {
                                break;
                            }
                        }
                        ir++;
                        t += self._paintHeight + self._patternMargin;
                        if (t > rt.height) {
                            break;
                        }
                    }
                    break;
                case EPatternKind.CHECK_TAIL:
                    while (true) {
                        ic = 0;
                        l = 0;
                        while (true) {
                            if ((ir % 2 == 0 && ic % 2 == 1) || (ir % 2 == 1 && ic % 2 == 0)) {
                                callback(rt.left + (ic * self._paintWidth) + (ic * self._patternMargin), rt.top + (ir * self._paintHeight) + (ir * self._patternMargin), self._paintWidth, self._paintHeight);
                            }
                            ic++;
                            l += self._paintWidth + self._patternMargin;
                            if (l > rt.width) {
                                break;
                            }
                        }
                        ir++;
                        t += self._paintHeight + self._patternMargin;
                        if (t > rt.height) {
                            break;
                        }
                    }
                    break;
                case EPatternKind.COLUMN:
                    while (true) {
                        if (self._patternIgnoreCount == 0 || ic % (self._patternIgnoreCount + 1) == 0) {
                            callback(rt.left + (ic * self._paintWidth) + (ic * self._patternMargin), rt.top + (ir * self._paintHeight) + (ir * self._patternMargin), self._paintWidth, rt.height);
                        }
                        ic++;
                        l += self._paintWidth + self._patternMargin;
                        if (l > rt.width) {
                            break;
                        }
                    }
                    break;
                case EPatternKind.ROW:
                    while (true) {
                        if (self._patternIgnoreCount == 0 || ir % (self._patternIgnoreCount + 1) == 0) {
                            callback(rt.left + (ic * self._paintWidth) + (ic * self._patternMargin), rt.top + (ir * self._paintHeight) + (ir * self._patternMargin), rt.width, self._paintHeight);
                        }
                        ir++;
                        t += self._paintHeight + self._patternMargin;
                        if (t > rt.height) {
                            break;
                        }
                    }
                    break;
            }
        }
        function rotateLoop(callback) {
            let ang = (self._paintRotateStopAngle - self._paintRotateStartAngle) / self._paintRotateCount;
            let tx = rt.left + (rt.width * self.rotationCenterX);
            let ty = rt.top + (rt.height * self.rotationCenterY);
            let tw = rt.width * self._paintRotateRadiusX;
            let th = rt.height * self._paintRotateRadiusY;
            let ptc = new CPoint(tx, ty);
            for (let n = 0; n < self._paintRotateCount; n++) {
                let a = (n * ang) + self._paintRotateStartAngle;
                let pt = CPoint.getAngleToPoint(ptc, tw, th, a);
                callback(pt.x, pt.y, a, pt.x - (self._paintWidth / 2), pt.y - (self._paintHeight / 2), self._paintWidth, self._paintHeight);
            }
        }
        function randomLoop(callback) {
            for (let n = 0; n < self._randomCount; n++) {
                let ang = Math.random() * 360;
                let tw = rt.width * self._paintRotateRadiusX;
                let th = rt.height * self._paintRotateRadiusY;
                if (self.randomWidthMin != -1) {
                    tw = ((self.randomWidthMax - self.randomWidthMin) * Math.random()) + self.randomWidthMin;
                }
                if (self.randomHeightMin != -1) {
                    th = ((self.randomHeightMax - self.randomHeightMin) * Math.random()) + self.randomHeightMin;
                }
                let tx = rt.left + (Math.random() * (rt.width - tw));
                let ty = rt.top + (Math.random() * (rt.height - th));
                callback(ang, tx, ty, tw, th);
                CCalc.crRange2Value;
            }
        }
        if (this._kind == ECanvasItemKind.RECTANGLE ||
            this._kind == ECanvasItemKind.ROUNDRECTANGLE ||
            this._kind == ECanvasItemKind.ELLIPSE ||
            this._kind == ECanvasItemKind.ARC ||
            this._kind == ECanvasItemKind.PATH) {
            if (this._stroke.lineWidth > 0 && this._stroke.styleKind != EStyleKind.EMPTY) {
                rt.inflate(-(this._stroke.lineWidth / 2), -(this._stroke.lineWidth / 2));
            }
            ctx.beginPath();
            switch (this._kind) {
                case ECanvasItemKind.RECTANGLE:
                    if (this.paintKind == EPaintKind.PATTERN) {
                        patternLoop(function (l, t, w, h) {
                            self._pathData.clear();
                            self._pathData.makeRoundRectData(l, t, w, h, self._radiusX, self._radiusY, self._disableRoundSet, self._disableLineSet, false);
                            self._pathData.setPathData(ctx);
                            //ctxTextDraw(new CRect(l, t, l + w, t + h))
                        });
                        ctxFill(rt);
                        ctxStroke(rt);
                    }
                    else if (this.paintKind == EPaintKind.ROTATE) {
                        rotateLoop(function (x, y, ang, l, t, w, h) {
                            self._pathData.clear();
                            self._pathData.makeRoundRectData(l, t, w, h, self._radiusX, self._radiusY, self._disableRoundSet, self._disableLineSet, false);
                            if (self._paintRotateApplyAngle)
                                self._pathData.rotate(new CPoint(x, y), ang);
                            self._pathData.setPathData(ctx);
                            //ctxTextDraw(new CRect(l, t, l + w, t + h))	
                        });
                        ctxFill(rt);
                        ctxStroke(rt);
                    }
                    else if (this.paintKind == EPaintKind.RANDOM) {
                        randomLoop(function (a, l, t, w, h) {
                            self._pathData.clear();
                            self._pathData.makeRoundRectData(l, t, w, h, self._radiusX, self._radiusY, self._disableRoundSet, self._disableLineSet, false);
                            self._pathData.setPathData(ctx);
                        });
                        ctxFill(rt);
                        ctxStroke(rt);
                        //ctxTextDraw(new CRect(l, t, l + w, t + h))	
                    }
                    else {
                        this._pathData.makeRoundRectData(rt.left, rt.top, rt.width, rt.height, this._radiusX, this._radiusY, this._disableRoundSet, this._disableLineSet, true);
                        this._pathData.setPathData(ctx);
                        ctxFill(rt);
                        ctxStroke(rt);
                    }
                    break;
                case ECanvasItemKind.ROUNDRECTANGLE:
                    if (this.paintKind == EPaintKind.PATTERN) {
                        let i = 0;
                        if (self.paintWidth > self.paintHeight) {
                            i = self.paintWidth / 2;
                        }
                        else {
                            i = self.paintWidth / 2;
                        }
                        patternLoop(function (l, t, w, h) {
                            self._pathData.clear();
                            self._pathData.makeRoundRectData(l, t, w, h, i, i, new CStringSet(), new CStringSet(), false);
                            self._pathData.setPathData(ctx);
                            //ctxTextDraw(new CRect(l, t, l + w, t + h))
                        });
                        ctxFill(rt);
                        ctxStroke(rt);
                    }
                    else if (this.paintKind == EPaintKind.ROTATE) {
                        let i = 0;
                        if (self.paintWidth > self.paintHeight) {
                            i = self.paintWidth / 2;
                        }
                        else {
                            i = self.paintWidth / 2;
                        }
                        rotateLoop(function (x, y, ang, l, t, w, h) {
                            self._pathData.clear();
                            self._pathData.makeRoundRectData(l, t, w, h, i, i, new CStringSet(), new CStringSet(), false);
                            if (self._paintRotateApplyAngle)
                                self._pathData.rotate(new CPoint(x, y), ang);
                            self._pathData.setPathData(ctx);
                            //ctxTextDraw(new CRect(l, t, l + w, t + h))
                        });
                        ctxFill(rt);
                        ctxStroke(rt);
                    }
                    else if (this.paintKind == EPaintKind.RANDOM) {
                        let i = 0;
                        if (self.paintWidth > self.paintHeight) {
                            i = self.paintWidth / 2;
                        }
                        else {
                            i = self.paintWidth / 2;
                        }
                        randomLoop(function (a, l, t, w, h) {
                            self._pathData.clear();
                            self._pathData.makeRoundRectData(l, t, w, h, i, i, new CStringSet(), new CStringSet(), false);
                            self._pathData.setPathData(ctx);
                        });
                        ctxFill(rt);
                        ctxStroke(rt);
                        //ctxTextDraw(new CRect(l, t, l + w, t + h))	
                    }
                    else {
                        let i = 0;
                        if (rt.width > rt.height) {
                            i = rt.height / 2;
                        }
                        else {
                            i = rt.width / 2;
                        }
                        this._pathData.makeRoundRectData(rt.left, rt.top, rt.width, rt.height, i, i, new CStringSet(), new CStringSet(), true);
                        this._pathData.setPathData(ctx);
                        ctxFill(rt);
                        ctxStroke(rt);
                    }
                    break;
                case ECanvasItemKind.ELLIPSE:
                    if (this.paintKind == EPaintKind.PATTERN) {
                        patternLoop(function (l, t, w, h) {
                            self._pathData.clear();
                            self._pathData.makeEllipseData(l, t, w, h, false);
                            self._pathData.setPathData(ctx);
                            //ctxTextDraw(new CRect(l, t, l + w, t + h))
                        });
                        ctxFill(rt);
                        ctxStroke(rt);
                    }
                    else if (this.paintKind == EPaintKind.ROTATE) {
                        let i = 0;
                        if (self.paintWidth > self.paintHeight) {
                            i = self.paintWidth / 2;
                        }
                        else {
                            i = self.paintWidth / 2;
                        }
                        rotateLoop(function (x, y, ang, l, t, w, h) {
                            self._pathData.clear();
                            self._pathData.makeEllipseData(l, t, w, h, false);
                            if (self._paintRotateApplyAngle)
                                self._pathData.rotate(new CPoint(x, y), ang);
                            self._pathData.setPathData(ctx);
                            //ctxTextDraw(new CRect(l, t, l + w, t + h))
                        });
                        ctxFill(rt);
                        ctxStroke(rt);
                    }
                    else if (this.paintKind == EPaintKind.RANDOM) {
                        randomLoop(function (a, l, t, w, h) {
                            self._pathData.clear();
                            self._pathData.makeEllipseData(l, t, w, h, false);
                            self._pathData.setPathData(ctx);
                        });
                        ctxFill(rt);
                        ctxStroke(rt);
                        //ctxTextDraw(new CRect(l, t, l + w, t + h))	
                    }
                    else {
                        this._pathData.makeEllipseData(rt.left, rt.top, rt.width, rt.height);
                        this._pathData.setPathData(ctx);
                        ctxFill(rt);
                        ctxStroke(rt);
                    }
                    break;
                case ECanvasItemKind.PATH:
                    function newPathData(left, top, width, height) {
                        let ptTmp;
                        if (self._pathFitMode == EFitMode.ORIGINAL) {
                            ptTmp = self._pathData.copyTo();
                            //ptTmp = self._pathData.stretchTo(new CRect(l, t, l + w, t + h))
                        }
                        else if (self._pathFitMode == EFitMode.FIT) {
                            ptTmp = self._pathData.fitTo(new CRect(left, top, left + width, top + height));
                        }
                        else {
                            ptTmp = self._pathData.stretchTo(new CRect(left, top, left + width, top + height));
                        }
                        return ptTmp;
                    }
                    if (this.paintKind == EPaintKind.PATTERN) {
                        patternLoop(function (l, t, w, h) {
                            let ptTmp;
                            if (self._pathFitMode == EFitMode.ORIGINAL) {
                                ptTmp = self._pathData.copyTo();
                            }
                            else if (self._pathFitMode == EFitMode.FIT) {
                                ptTmp = self._pathData.fitTo(new CRect(l, t, l + w, t + h));
                            }
                            else {
                                ptTmp = self._pathData.stretchTo(new CRect(l, t, l + w, t + h));
                            }
                            ptTmp.setPathData(ctx);
                            //ctxTextDraw(new CRect(l, t, l + w, t + h))
                        });
                        ctxFill(rt);
                        ctxStroke(rt);
                    }
                    else if (this.paintKind == EPaintKind.ROTATE) {
                        rotateLoop(function (x, y, ang, l, t, w, h) {
                            let ptTmp;
                            if (self._pathFitMode == EFitMode.ORIGINAL) {
                                ptTmp = self._pathData.copyTo();
                            }
                            else if (self._pathFitMode == EFitMode.FIT) {
                                ptTmp = self._pathData.fitTo(new CRect(l, t, l + w, t + h));
                            }
                            else {
                                ptTmp = self._pathData.stretchTo(new CRect(l, t, l + w, t + h));
                            }
                            if (self._paintRotateApplyAngle)
                                ptTmp.rotate(new CPoint(x, y), ang + 90);
                            ptTmp.setPathData(ctx);
                            //ctxTextDraw(new CRect(l, t, l + w, t + h))	
                        });
                        ctxFill(rt);
                        ctxStroke(rt);
                    }
                    else if (this.paintKind == EPaintKind.RANDOM) {
                        randomLoop(function (a, l, t, w, h) {
                            let ptTmp;
                            if (self._pathFitMode == EFitMode.ORIGINAL) {
                                ptTmp = self._pathData.copyTo();
                            }
                            else if (self._pathFitMode == EFitMode.FIT) {
                                ptTmp = self._pathData.fitTo(new CRect(l, t, l + w, t + h));
                            }
                            else {
                                ptTmp = self._pathData.stretchTo(new CRect(l, t, l + w, t + h));
                            }
                            ptTmp.rotate(new CPoint(l + (w / 2), t + (h / 2)), a);
                            ptTmp.setPathData(ctx);
                        });
                        ctxFill(rt);
                        ctxStroke(rt);
                        //ctxTextDraw(new CRect(l, t, l + w, t + h))	
                    }
                    else {
                        let ptTmp = newPathData(rt.left, rt.top, rt.width, rt.height);
                        /*if(self._pathFitMode == EFitMode.ORIGINAL) {
                            ptTmp = this._pathData.copyTo()
                            ptTmp.inflate(-self.stroke.lineWidth / 2, -self.stroke.lineWidth / 2)
                        } else if(self._pathFitMode == EFitMode.FIT) {
                            ptTmp = this._pathData.fitTo(new CRect(rt.left, rt.top, rt.right, rt.bottom))
                        } else {
                            ptTmp = this._pathData.stretchTo(new CRect(rt.left, rt.top, rt.right, rt.bottom))
                        }*/
                        //ptTmp.movePoint(rt.left, rt.top)
                        ptTmp.setPathData(ctx);
                        ctxFill(ptTmp.getBounds());
                        ctxStroke(ptTmp.getBounds());
                    }
                    break;
            }
            /*if(this.paintKind == EPaintKind.NORMAL) {
                
                ctxFill()
                ctxStroke()
            }*/
        }
        else if (this._kind == ECanvasItemKind.IMAGE) {
            if (this._image != undefined) {
                let self = this;
                //this._image.style.opacity = self.opacity + ""
                ctx.globalAlpha = self.opacity;
                if (self.paintKind == EPaintKind.PATTERN) {
                    patternLoop(function (l, t, w, h) {
                        let rtt = new CRect(l, t, l + w, t + h);
                        let imgrt = new CRect(0, 0, self._image.width, self._image.height);
                        rtt = rtt.getFitRect(imgrt, true);
                        ctx.drawImage(self._image, rtt.left + l, rtt.top + t, rtt.width, rtt.height);
                    });
                }
                else {
                    if (self.imageFitMode == EFitMode.ORIGINAL) {
                        ctx.drawImage(self._image, rt.left, rt.top);
                    }
                    else if (self.imageFitMode == EFitMode.FIT) {
                        let imgrt = new CRect(0, 0, self._image.width, self._image.height);
                        let rtt = rt.getFitRect(imgrt, true);
                        ctx.drawImage(self._image, rt.left + rtt.left, rt.top + rtt.top, rtt.width, rtt.height);
                    }
                    else {
                        ctx.drawImage(self._image, rt.left, rt.top, rt.width, rt.height);
                    }
                }
            }
        }
        if (this.paintKind == EPaintKind.NORMAL) {
            ctxTextDraw(rt);
        }
        ctx.restore();
    }
    enumProperties() {
        let rt = new Map();
        rt.set("align", CEnum.toArray(ECanvasItemAlign));
        rt.set("kind", CEnum.toArray(ECanvasItemKind));
        rt.set("patternKind", CEnum.toArray(EPatternKind));
        rt.set("positionUnit", CEnum.toArray(EPositionUnit));
        rt.set("pathFitMode", CEnum.toArray(EFitMode));
        rt.set("paintKind", CEnum.toArray(EPaintKind));
        rt.set("imageFitMode", CEnum.toArray(EFitMode));
        return rt;
    }
    addProperties() {
        let arr = super.addProperties();
        arr.push({ instance: this.pathData.transformer, propertyName: "pathDataTransfomer", readOnly: false, enum: [] });
        return arr;
    }
}
class CCanvasItems extends CList {
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
            let item = this.addItem();
            item.fromData(data[n]);
        }
    }
    addItem() {
        let rt = new CCanvasItem();
        let self = this;
        rt.onChange = function (sender, kind) {
            self.doChange(kind);
        };
        this.add(rt);
        return rt;
    }
    deleteItem(itemOrName) {
        if (itemOrName instanceof CCanvasItem) {
            for (let n = 0; n < this.length; n++) {
                if (this.get(n) == itemOrName) {
                    this.delete(n, 1);
                    break;
                }
            }
        }
        else {
            for (let n = 0; n < this.length; n++) {
                if (this.get(n).name == itemOrName) {
                    this.delete(n, 1);
                    break;
                }
            }
        }
    }
    getItem(name) {
        let rt = new Array();
        for (let n = 0; n < this.length; n++) {
            if (this.get(n).name == name) {
                rt.push(this.get(n));
            }
        }
        return rt;
    }
    setText(canvasName, text) {
        for (let n = 0; n < this.length; n++) {
            if (this.get(n).name == canvasName) {
                this.get(n).text = text;
            }
        }
    }
    setObject(obj) {
        let keys = Object.keys(obj);
        for (let n = 0; n < keys.length; n++) {
            this.setText(keys[n], obj[keys[n]]);
        }
    }
    draw(ctx, bounds, offset, bufferContext, scaleX = 1, scaleY = 1) {
        if (bufferContext != undefined) {
            bounds.offset(offset.x, offset.y);
            for (let n = 0; n < this.length; n++) {
                if (this.get(n).visible) {
                    this.get(n).draw(ctx, bounds, bufferContext, scaleX, scaleY);
                }
            }
        }
    }
}
class CCanvasLayer extends CNotifyChangeKindObject {
    constructor(parent = undefined) {
        super();
        this._name = "";
        this._items = new CCanvasItems();
        this._scaleX = 1;
        this._scaleY = 1;
        this._transform = new CTransform();
        this._visible = true;
        this._offset = new CNotifyPoint(0, 0);
        this._canvas = document.createElement("canvas");
        this.isDraw = true;
        this._parent = parent;
        this._id = CSequence.getSequence("layer");
        let self = this;
        this._offset.onChange = function () {
            self.doChange(CCanvasLayer.CON_CHANGE_OFFSET);
        };
        this._items.onChange = function () {
            self.doChange(CCanvasLayer.CON_CHANGE_ITEMS);
        };
        this._canvas = document.createElement("canvas");
        this._canvas.style.outline = "none";
        this._canvas.style.position = "absolute";
        this._canvas.style.margin = "0px 0px 0px 0px";
        this._canvas.style.padding = "0px 0px 0px 0px";
        this._canvas.style.pointerEvents = "none";
        this._canvas.setAttribute("ondragstart", "return false");
        this._canvas.setAttribute("onselectstart", "return false");
        this._canvas.setAttribute("oncontextmenu", "return false");
        let ctx = this._canvas.getContext("2d");
        if (ctx != null) {
            this._context = ctx;
        }
        if (this._parent != undefined) {
            if (this._parent instanceof HTMLElement) {
                this._parent.appendChild(this._canvas);
            }
            else {
                if (this._parent.parent != undefined) {
                    this._parent.parent.controlElement.appendChild(this._canvas);
                }
            }
        }
        this._transform.onChange = function (sender, kind) {
            self.transform.setTransform(self.canvas);
        };
        this.transform.setTransform(this.canvas);
    }
    static get CON_CHANGE_ITEMS() { return "i"; }
    static get CON_CHANGE_OFFSET() { return "o"; }
    static get CON_CHANGE_VISIBLE() { return "v"; }
    static get CON_CHANGE_SCALE_X() { return "sx"; }
    static get CON_CHANGE_SCALE_Y() { return "sy"; }
    get id() {
        return this._id;
    }
    get items() {
        return this._items;
    }
    get name() {
        return this._name;
    }
    set name(value) {
        if (this._name != value) {
            this._name = value;
            this.doChange("name");
        }
    }
    get scaleX() {
        return this._scaleX;
    }
    set scaleX(value) {
        if (this._scaleX != value) {
            this._scaleX = value;
            this.doChange(CCanvasLayer.CON_CHANGE_SCALE_X);
        }
    }
    get scaleY() {
        return this._scaleY;
    }
    set scaleY(value) {
        if (this._scaleY != value) {
            this._scaleY = value;
            this.doChange(CCanvasLayer.CON_CHANGE_SCALE_Y);
        }
    }
    set scale(value) {
        this.scaleX = value;
        this.scaleY = value;
    }
    get transform() {
        return this._transform;
    }
    get canvas() {
        return this._canvas;
    }
    get context() {
        return this._context;
    }
    get offset() {
        return this._offset;
    }
    get visible() {
        return this._visible;
    }
    set visible(value) {
        if (this._visible != value) {
            this._visible = value;
            this.doChange(CCanvasLayer.CON_CHANGE_VISIBLE);
        }
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "name", this.name, "");
        CDataClass.putData(data, "items", this.items.toData(), [], true);
        CDataClass.putData(data, "transform", this.transform.toData(), {}, true);
        CDataClass.putData(data, "visible", this.visible, true);
        CDataClass.putData(data, "offset", this.offset.toData(), {}, true);
        CDataClass.putData(data, "width", this.canvas.width, 0);
        CDataClass.putData(data, "height", this.canvas.height, 0);
    }
    doFromData(data) {
        super.doFromData(data);
        this.name = CDataClass.getData(data, "name", "");
        this.items.fromData(CDataClass.getData(data, "items", [], true));
        this.transform.fromData(CDataClass.getData(data, "transform", {}, true));
        this.visible = CDataClass.getData(data, "visible", true);
        this.offset.fromData(CDataClass.getData(data, "offset", {}, true));
        this.canvas.width = CDataClass.getData(data, "width", 0);
        this.canvas.height = CDataClass.getData(data, "height", 0);
    }
    doChange(kind) {
        super.doChange(kind);
        if (kind == CCanvasLayer.CON_CHANGE_VISIBLE) {
            if (this.visible) {
                if (this.canvas != undefined)
                    this.canvas.style.visibility = "visible";
                this.draw();
            }
            else {
                if (this.canvas != undefined)
                    this.canvas.style.visibility = "hidden";
                CSystem.requestDraw.delete(this);
            }
        }
        if (kind == CCanvasLayer.CON_CHANGE_OFFSET || kind == CCanvasLayer.CON_CHANGE_ITEMS) {
            this.draw();
        }
        if (kind == CCanvasLayer.CON_CHANGE_SCALE_X || kind == CCanvasLayer.CON_CHANGE_SCALE_Y) {
            this.doChangeScale();
        }
    }
    doRemove() {
        this.canvas.remove();
        super.doRemove();
    }
    doChangeScale() {
        if (this._parent instanceof CCanvasLayers) {
            if (this._parent.parent != undefined) {
                this.doSetCanvasElementPosition(0, 0, this._parent.parent.position.width, this._parent.parent.position.height);
            }
        }
        this.draw();
    }
    doSetCanvasElementPosition(left, top, width, height) {
        this._canvas.width = width * this.scaleX;
        this._canvas.height = height * this.scaleY;
        //this._canvas.style.left =  left + "px"
        this._canvas.style.left = ((width - this._canvas.width) / 2) + "px";
        this._canvas.style.top = ((height - this._canvas.height) / 2) + "px";
        this.draw();
    }
    setCanvasElementPosition(left, top, width, height) {
        this.doSetCanvasElementPosition(left, top, width, height);
    }
    addItem() {
        let rt = this._items.addItem();
        return rt;
    }
    doDraw() {
        if (this._context != undefined && this.canvas.width > 0 && this.canvas.height > 0 && this.visible) {
            //메인스레드
            this._context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            if (CSystem.bufferingContext != undefined) {
                let rt = new CRect(0, 0, this.canvas.width / this.scaleX, this.canvas.height / this.scaleY);
                this.items.draw(this._context, rt, this.offset, CSystem.bufferingContext, this.scaleX, this.scaleY);
            }
            if (this.onDraw != undefined) {
                this.onDraw(this, this._context);
            }
            //워커
            /*let o = {}
            o["data"] = this.items.toData()
            let rt = new CRect(0, 0, this.canvas.width / this.scaleX, this.canvas.height / this.scaleY)
            o["bounds"] = rt.toData()
            layerWorker.postMessage(JSON.stringify(o))*/
        }
    }
    draw() {
        if (this.visible && this.isDraw) {
            CSystem.requestDraw.add(this);
        }
    }
    getCanvasItems(canvasItemName) {
        let rt = new Array();
        let arr = this.items.getItem(canvasItemName);
        for (let i = 0; i < arr.length; i++) {
            rt.push(arr[i]);
        }
        return rt;
    }
}
class CCanvasLayers extends CList {
    constructor(parent) {
        super();
        this._parent = parent;
    }
    static get CON_CHANGE_ADD_LAYER() { return "addlayer"; }
    static get CON_CHANGE_LAYER() { return "layer"; }
    get parent() {
        return this._parent;
    }
    set scaleX(value) {
        for (let n = 0; n < this.length; n++) {
            this.get(n).scaleX = value;
        }
    }
    set scaleY(value) {
        for (let n = 0; n < this.length; n++) {
            this.get(n).scaleY = value;
        }
    }
    set scale(value) {
        for (let n = 0; n < this.length; n++) {
            this.get(n).scale = value;
        }
    }
    doChangeLayer(kind, layer) {
        if (this.useChangeEvent && this.onChangeLayer != undefined) {
            this.onChangeLayer(this, kind, layer);
        }
    }
    doResource() {
        super.doResource();
        if (this._parent != undefined) {
            this._parent.setLayers();
        }
    }
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
            let layer = this.addLayer();
            layer.fromData(data[n]);
        }
        if (this.parent != undefined) {
            this.parent.doSetLayers();
        }
    }
    doRemove() {
        for (let n = this.length - 1; n >= 0; n--) {
            this.get(n).remove();
        }
        this.clear();
        super.doRemove();
    }
    addLayer() {
        let rt = new CCanvasLayer(this);
        let self = this;
        rt.onChange = function (sender) {
            self.doChangeLayer(CCanvasLayers.CON_CHANGE_LAYER, rt);
        };
        rt.onDraw = function (layer, ctx) {
            if (self.parent != undefined) {
                let idx = -1;
                for (let n = 0; n < self.length; n++) {
                    if (layer == self.get(n)) {
                        idx = n;
                        break;
                    }
                }
                self.parent.doLayerDraw(idx, layer, ctx);
            }
        };
        self.doChangeLayer(CCanvasLayers.CON_CHANGE_ADD_LAYER, rt);
        this.add(rt);
        return rt;
    }
    deleteLayer(layer) {
        if (layer instanceof CCanvasLayer) {
            for (let n = 0; n < this.length; n++) {
                if (this.get(n) == layer) {
                    this.get(n).remove();
                    this.delete(n, 1);
                    break;
                }
            }
        }
        else {
            for (let n = 0; n < this.length; n++) {
                if (this.get(n).id == layer) {
                    this.get(n).remove();
                    this.delete(n, 1);
                    break;
                }
            }
        }
    }
    clear() {
        for (let n = 0; n < this.length; n++) {
            this.get(n).remove();
        }
        super.clear();
    }
    getLayer(id) {
        let rt;
        for (let n = 0; n < this.length; n++) {
            if (this.get(n).id == id) {
                rt = this.get(n);
                break;
            }
        }
        return rt;
    }
    getLayerFromName(name) {
        let rt;
        for (let n = 0; n < this.length; n++) {
            if (this.get(n).name == name) {
                rt = this.get(n);
                break;
            }
        }
        return rt;
    }
    setLayersPosition(left, top, width, height) {
        for (let n = 0; n < this.length; n++) {
            this.get(n).setCanvasElementPosition(left, top, width, height);
        }
    }
    draw() {
        for (let n = 0; n < this.length; n++) {
            this.get(n).draw();
        }
    }
    getCanvasItems(canvasItemName) {
        let rt = new Array();
        for (let n = 0; n < this.length; n++) {
            let arr = this.get(n).getCanvasItems(canvasItemName);
            for (let i = 0; i < arr.length; i++) {
                rt.push(arr[i]);
            }
        }
        return rt;
    }
    getPathDataOrgSize() {
        let rt = { width: 0, height: 0 };
        for (let n = 0; n < this.length; n++) {
            if (this.get(n).items.length > 0) {
                rt.width = this.get(n).items.get(0).pathData.width;
                rt.height = this.get(n).items.get(0).pathData.height;
            }
        }
        return rt;
    }
    static setLayersMiddlePathData(startLayers, stopLayers, dstLayers, middleValue) {
        for (let x = 0; x < dstLayers.length; x++) {
            for (let n = 0; n < dstLayers.get(x).items.length; n++) {
                if (startLayers.get(x).items.length > n && stopLayers.get(x).items.length > n) {
                    let pd1 = startLayers.get(x).items.get(n).pathData;
                    let pd2 = stopLayers.get(x).items.get(n).pathData;
                    let pdnw = dstLayers.get(x).items.get(n).pathData;
                    for (let i = 0; i < pdnw.length; i++) {
                        pdnw.get(i).point.x = CCalc.crRange2Value(0, 1, middleValue, pd1.get(i).point.x, pd2.get(i).point.x);
                        pdnw.get(i).point.y = CCalc.crRange2Value(0, 1, middleValue, pd1.get(i).point.y, pd2.get(i).point.y);
                        pdnw.get(i).cPoint1.x = CCalc.crRange2Value(0, 1, middleValue, pd1.get(i).cPoint1.x, pd2.get(i).cPoint1.x);
                        pdnw.get(i).cPoint1.y = CCalc.crRange2Value(0, 1, middleValue, pd1.get(i).cPoint1.y, pd2.get(i).cPoint1.y);
                        pdnw.get(i).cPoint2.x = CCalc.crRange2Value(0, 1, middleValue, pd1.get(i).cPoint2.x, pd2.get(i).cPoint2.x);
                        pdnw.get(i).cPoint2.y = CCalc.crRange2Value(0, 1, middleValue, pd1.get(i).cPoint2.y, pd2.get(i).cPoint2.y);
                    }
                    pdnw.width = CCalc.crRange2Value(0, 1, middleValue, pd1.width, pd2.width);
                    pdnw.height = CCalc.crRange2Value(0, 1, middleValue, pd1.height, pd2.height);
                }
            }
        }
    }
}
