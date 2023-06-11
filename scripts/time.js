"use strict";
class CTimes extends CDataClass {
    constructor() {
        super(...arguments);
        this._times = new CTableData(["name", "object"], ["name", "object"]);
    }
    get times() {
        return this._times;
    }
    get length() {
        return this.times.length;
    }
    /*doToData(data: any): void {
        super.doToData(data)
    }*/
    add(timeName, time) {
        this._times.add([timeName, time]);
    }
    delete(timeNameOrTime) {
        if (typeof timeNameOrTime == "string") {
            let arr = this._times.findIndexRow("name", timeNameOrTime);
            this._times.delete(arr);
        }
        else {
            let arr = this._times.findIndexRow("object", timeNameOrTime);
            this._times.delete(arr);
        }
    }
    clear() {
        this._times.clear();
    }
    loopTime(callback) {
        for (let n = 0; n < this._times.length; n++) {
            callback(this._times.getRow(n).get(1).asObject);
        }
    }
}
class CTime extends CDataClass {
    constructor(time, speed = 1) {
        super();
        this._time = 0;
        this._speed = 1;
        this._isPause = false;
        this._isReverse = false;
        this._childs = new CTimes();
        this._timePoints = new Array();
        this._timeSections = new Array();
        if (time == undefined) {
            this._time = new Date().getTime();
        }
        else {
            this._time = time;
        }
        this.speed = speed;
    }
    get preTime() {
        return this._preTime;
    }
    get changeTime() {
        return this._changeTime;
    }
    get time() {
        return this._time;
    }
    set time(value) {
        if (value != this._time) {
            this._time = value;
            this.doChangeTime();
        }
    }
    get timeString() {
        let dt = new Date(this._time);
        return CDatetime.toTimeString(dt, true, true);
    }
    get speed() {
        return this._speed;
    }
    set speed(value) {
        this._speed = value;
    }
    get isPause() {
        return this._isPause;
    }
    set isPause(value) {
        if (this._isPause != value) {
            this._isPause = value;
            this.doChangePause();
        }
    }
    get isReverse() {
        return this._isReverse;
    }
    set isReverse(value) {
        if (this._isReverse != value) {
            this._isReverse = value;
            this.doChangeReverse();
        }
    }
    get childs() {
        return this._childs;
    }
    get timePoints() {
        return this._timePoints;
    }
    get timeSections() {
        return this._timeSections;
    }
    set timeSections(value) {
        this._timeSections = value;
    }
    /*doToData(data: any): void {
        super.doToData(data)
        CDataClass.putData(data, "preTime", this._preTime, undefined)
        CDataClass.putData(data, "time", this.time, 0)
        CDataClass.putData(data, "changeTime", this._changeTime, undefined)
        CDataClass.putData(data, "speed", this.speed, 1)
        CDataClass.putData(data, "isPause", this.isPause, false)
        CDataClass.putData(data, "isReverse", this.isReverse, false)
        CDataClass.putData(data, "childs", this.childs.toData(), [], true)
        let arr = new Array<any>()
        for(let n = 0; n < this.timePoints.length; n++) {
            arr.push(this.timePoints[n].toData())
        }
        CDataClass.putData(data, "timePoints", arr, [], true)
    }
    doFromData(data: any): void {
        super.doFromData(data)
        this._preTime = CDataClass.getData(data, "preTime", undefined)
        this.time = CDataClass.getData(data, "time", 0)
        this._changeTime = CDataClass.getData(data, "changeTime", undefined)
        this.speed = CDataClass.getData(data, "speed", 1)
        this.isPause = CDataClass.getData(data, "isPause", false)
        this.isReverse = CDataClass.getData(data, "isReverse", false)
        this.childs.fromData(CDataClass.getData(data, "childs", [], true))
        let arr = CDataClass.getData(data, "childs", [], true)
        for(let n = 0; n < arr.length; n++) {

        }
    }*/
    doChangeTime() {
        if (this.onChangeTime != undefined) {
            this.onChangeTime(this);
        }
    }
    doChangePause() {
        if (this.onChangePause != undefined) {
            this.onChangePause(this);
        }
    }
    doChangeReverse() {
        if (this.onChangeReverse != undefined) {
            this.onChangeReverse(this);
        }
    }
    doRemove() {
        CTime.times.delete(this);
        this._childs.loopTime(function (t) {
            t.doRemove();
        });
        this._childs.clear();
        super.doRemove();
    }
    setTime(preTime, now) {
        let ct = (now - preTime) * this.speed;
        if (!this.isPause) {
            this._preTime = this.time;
            this._changeTime = ct;
            if (this.isReverse) {
                this.time -= ct;
            }
            else {
                this.time += ct;
            }
            let self = this;
            this.childs.loopTime(function (t) {
                if (self.preTime != undefined) {
                    t.setTime(self.preTime, self.time);
                }
            });
            if (this.preTime != undefined) {
                for (let n = 0; n < this._timePoints.length; n++) {
                    this._timePoints[n].checkTime(this.preTime, this.time);
                }
                for (let n = 0; n < this._timeSections.length; n++) {
                    if (this._timeSections[n].isLoop) {
                        if (this.time >= this._timeSections[n].startTime) {
                            let d = this._timeSections[n].stopTime - this._timeSections[n].startTime;
                            let st = this._timeSections[n].startTime + (d * Math.floor((this.time - this._timeSections[n].startTime) / d));
                            let ed = st + d;
                            this._timeSections[n].doTick(this.preTime, this.time, CCalc.crRange2Value(st, ed, this.time, 0, 1));
                        }
                    }
                    else {
                        if (this.isReverse) {
                            if (this.preTime >= this._timeSections[n].startTime && this.time <= this._timeSections[n].startTime) {
                                this._timeSections[n].doTick(this.preTime, this.time, 0);
                            }
                            else if (this.time <= this._timeSections[n].stopTime && this.preTime >= this._timeSections[n].stopTime) {
                                this._timeSections[n].doTick(this.preTime, this.time, 1);
                            }
                            else if (this.time > this._timeSections[n].startTime && this.time < this._timeSections[n].stopTime) {
                                this._timeSections[n].doTick(this.preTime, this.time, CCalc.crRange2Value(this._timeSections[n].startTime, this._timeSections[n].stopTime, this.time, 0, 1));
                            }
                        }
                        else {
                            if (this.preTime <= this._timeSections[n].startTime && this.time >= this._timeSections[n].startTime) {
                                this._timeSections[n].doTick(this.preTime, this.time, 0);
                            }
                            else if (this.time >= this._timeSections[n].stopTime && this.preTime <= this._timeSections[n].stopTime) {
                                this._timeSections[n].doTick(this.preTime, this.time, 1);
                            }
                            else if (this.time > this._timeSections[n].startTime && this.time < this._timeSections[n].stopTime) {
                                this._timeSections[n].doTick(this.preTime, this.time, CCalc.crRange2Value(this._timeSections[n].startTime, this._timeSections[n].stopTime, this.time, 0, 1));
                            }
                        }
                    }
                }
            }
        }
    }
    hasTimePoint(point) {
        let rt = false;
        for (let n = 0; n < this.timePoints.length; n++) {
            if (this.timePoints[n] == point) {
                rt = true;
                break;
            }
        }
        return rt;
    }
    deleteTimePoint(point) {
        for (let n = 0; n < this._timePoints.length; n++) {
            if (this._timePoints[n] == point) {
                this._timePoints.splice(n, 1);
                break;
            }
        }
    }
    clearTimePoint() {
        for (let n = this._timePoints.length - 1; n >= 0; n--) {
            this._timePoints[n].remove();
            this._timePoints.splice(n, 1);
        }
    }
    clearTimeSection() {
        for (let n = this._timeSections.length - 1; n >= 0; n--) {
            this._timeSections[n].remove();
            this._timeSections.splice(n, 1);
        }
    }
    timeMove(time) {
        if (time != this.time) {
            let ct = time - this.time;
            this._preTime = undefined;
            this._changeTime = undefined;
            this.time = time;
            this.childs.loopTime(function (t) {
                t.timeMove(t.time + (ct * t.speed));
            });
        }
    }
    pause() {
        this.isPause = !this.isPause;
    }
    reverse() {
        this.isReverse = !this.isReverse;
    }
    static get now() {
        let n = new Date().getTime();
        return n;
    }
    static doAnimationFrame(preTime, now) {
        this.systemTime = now;
        if (!this.isPause) {
            CTime.times.loopTime(function (t) {
                t.setTime(preTime, now);
            });
        }
    }
    static pause() {
        CTime.isPause = !CTime.isPause;
    }
}
CTime.isPause = false;
CTime.times = new CTimes();
CTime.systemTime = 0;
class CTimePoint extends CDataClass {
    constructor(parent, time, afterRemove) {
        super();
        this._afterRemove = false;
        this._timePointCount = 0;
        this._notifyDirection = "both";
        this._parent = parent;
        if (time == undefined) {
            this._time = new Date().getTime();
        }
        else {
            this._time = time;
        }
        if (afterRemove != undefined) {
            this._afterRemove = afterRemove;
        }
    }
    get parent() {
        return this._parent;
    }
    get afterRemove() {
        return this._afterRemove;
    }
    set afterRemove(value) {
        this._afterRemove = value;
    }
    get time() {
        return this._time;
    }
    set time(value) {
        this._time = value;
    }
    get timePointCount() {
        return this._timePointCount;
    }
    set timePointCount(value) {
        this._timePointCount = value;
    }
    get notifyDirection() {
        return this._notifyDirection;
    }
    set notifyDirection(value) {
        this._notifyDirection = value;
    }
    doRemove() {
        if (this._parent != undefined) {
            this._parent.deleteTimePoint(this);
            this._parent = undefined;
        }
        super.doRemove();
    }
    doBeforeTime() {
        if (this.onBeforeTime != undefined) {
            this.onBeforeTime(this, this.parent, this.timePointCount);
        }
    }
    doTime(diffTime) {
        this._timePointCount++;
        if (this.onTime != undefined) {
            this.onTime(this, this.parent, this.timePointCount);
        }
        if (this._afterRemove) {
            this.doRemove();
        }
    }
    checkTime(preTime, time) {
        let min = CCalc.min(preTime, time);
        let max = CCalc.max(preTime, time);
        if (this.notifyDirection == "both" && min < this.time && max >= this.time) {
            let diff = 0;
            if (preTime < time) {
                diff = this.time - preTime;
            }
            else {
                diff = preTime - this.time;
            }
            this.doBeforeTime();
            this.doTime(diff);
        }
        else if (this.notifyDirection == "go" && preTime < this.time && time >= this.time) {
            let diff = this.time - preTime;
            this.doBeforeTime();
            this.doTime(diff);
        }
        else if (this.notifyDirection == "back" && time < this.time && preTime >= this.time) {
            let diff = preTime - this.time;
            this.doBeforeTime();
            this.doTime(diff);
        }
    }
}
class CTimeSection extends CDataClass {
    constructor(parent) {
        super();
        this.startTime = 0;
        this.stopTime = 0;
        this.isLoop = false;
        if (parent != undefined) {
            parent.timeSections.push(this);
        }
    }
    get parent() {
        return this._parent;
    }
    doRemove() {
        this._parent = undefined;
        super.doRemove();
    }
    doTick(preTime, time, value) {
        if (this.onTick != undefined) {
            this.onTick(this, preTime, time, value);
        }
    }
}
class CTimePointReserve extends CTimePoint {
    doTime(diffTime) {
        if (this.timePointCount == 0) {
            if (this._parent != undefined) {
                if (this._parent.isReverse) {
                    this._parent.timeMove(this._parent.time + diffTime);
                }
                else {
                    this._parent.timeMove(this._parent.time - diffTime);
                }
                this._parent.reverse();
            }
        }
        super.doTime(diffTime);
    }
}
class CTimePointPause extends CTimePoint {
    doTime(diffTime) {
        if (this.timePointCount == 0) {
            if (this._parent != undefined)
                this._parent.pause();
        }
        super.doTime(diffTime);
    }
}
class CTimePointMoveTime extends CTimePoint {
    constructor(parent, moveTime, time, afterRemove) {
        super(parent, time, afterRemove);
        this._moveTime = moveTime;
    }
    get moveTime() {
        return this._moveTime;
    }
    set moveTime(value) {
        this._moveTime = value;
    }
    doTime(diffTime) {
        if (this.timePointCount == 0) {
            if (this._parent != undefined)
                this._parent.timeMove(this._moveTime + diffTime);
        }
        super.doTime(diffTime);
    }
}
class CTimePointRemoveTimeFromTimes extends CTimePoint {
    doTime(diffTime) {
        if (this._parent != undefined)
            CTime.times.delete(this._parent);
        super.doTime(diffTime);
    }
}
{
    let preTime;
    function _t(t) {
        let now = new Date().getTime();
        if (preTime != undefined) {
            try {
                CTime.doAnimationFrame(preTime, now);
            }
            catch (e) {
                console.log(e);
            }
        }
        preTime = now;
        window.requestAnimationFrame(_t);
    }
    window.requestAnimationFrame(_t);
}
class CAnimation extends CResourceClass {
    constructor(duration, delay, isLoop) {
        super();
        this._animate = false;
        this._value = 0;
        this._invertValue = false;
        this.duration = 200;
        this.cancelDuration = 100;
        this.delay = 0;
        this.isLoop = false;
        if (duration != undefined)
            this.duration = duration;
        if (delay != undefined)
            this.delay = delay;
        if (isLoop != undefined)
            this.isLoop = isLoop;
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "duration", this.duration, 200);
        CDataClass.putData(data, "cancelDuration", this.cancelDuration, 100);
        CDataClass.putData(data, "delay", this.delay, 0);
        CDataClass.putData(data, "isLoop", this.isLoop, false);
    }
    doFromData(data) {
        super.doFromData(data);
        this.duration = CDataClass.getData(data, "duration", 200);
        this.cancelDuration = CDataClass.getData(data, "cancelDuration", 100);
        this.delay = CDataClass.getData(data, "delay", 0);
        this.isLoop = CDataClass.getData(data, "isLoop", false);
    }
    doAnimate(time, value, changeTime) {
        if (this.onAnimate != undefined) {
            this.onAnimate(this, time, value, changeTime);
        }
    }
    doBeforeAnimation() {
        if (this.onBeforeAnimation != undefined) {
            this.onBeforeAnimation(this);
        }
    }
    doAfterAnimation() {
        this._animate = false;
        if (this._time != undefined) {
            this._time.doRemove();
        }
        this._time = undefined;
        if (this.onAfterAnimation != undefined) {
            this.onAfterAnimation(this);
        }
    }
    doStart(invert) {
        let self = this;
        this._time = new CTime();
        this._invertValue = invert;
        this._animate = true;
        if (this.onStart != undefined) {
            this.onStart(this, this._time);
        }
        CAnimation.animate(this.duration, function (time, value, changeTime) {
            if (self != undefined) {
                if (self._animate) {
                    self._value = value;
                    self.doAnimate(time, value, changeTime);
                }
            }
        }, this.delay, this._invertValue, this.isLoop, function () {
            if (self != undefined)
                self.doBeforeAnimation();
        }, function () {
            if (self != undefined)
                self.doAfterAnimation();
            self = undefined;
        }, this._time);
    }
    doCancel() {
        if (this._time != undefined) {
            if (this.onCancel != undefined) {
                this.onCancel(this, this._time);
            }
            this._time.doRemove();
            this._time = undefined;
            this._animate = false;
            let self = this;
            CAnimation.animate(this.cancelDuration, function (time, value, changeTime) {
                self.doAnimate(time, self._value - CCalc.crRange2Value(0, 1, value, 0, self._value), changeTime);
            }, 0, this._invertValue, false, undefined, function () {
                self.doAfterAnimation();
            }, this._time);
        }
    }
    doPause() {
        if (this._time != undefined) {
            this._time.pause();
            if (this.onPause != undefined) {
                this.onPause(this, this._time);
            }
        }
    }
    start() {
        this.doStart(false);
    }
    invert() {
        this.doStart(true);
    }
    startOnce(fnAnimate, fnBefore, fnAfter) {
        CAnimation.animate(this.duration, fnAnimate, this.delay, false, this.isLoop, fnBefore, fnAfter, this._time);
    }
    reverse() {
        if (this._time != undefined) {
            this._time.reverse();
        }
    }
    cancel() {
        this.doCancel();
    }
    pause() {
        this.doPause();
    }
    isAnimate() {
        return this._animate;
    }
    static animateResource(resource, graphProc, pointsProc, beforeAnimation, afterAnimation) {
        let rc = CSystem.resources.get(resource);
        CAnimation.graphAnimate(rc.duration, rc.graphNames, graphProc, rc.pointsNames, pointsProc, rc.delay, false, rc.isLoop, beforeAnimation, afterAnimation);
    }
    static animate(duration, aniProc, delay, invertValue, isLoop, beforeAnimation, afterAnimation, time) {
        function getDelay() {
            if (delay == undefined) {
                return 0;
            }
            else {
                if (typeof delay == "number") {
                    return delay;
                }
                else {
                    return (Math.random() * (delay.randomRangeStop - delay.randomRangeStart)) + delay.randomRangeStart;
                }
            }
        }
        function getDuration() {
            if (duration == undefined) {
                return 0;
            }
            else {
                if (typeof duration == "number") {
                    return duration;
                }
                else {
                    return (Math.random() * (duration.randomRangeStop - duration.randomRangeStart)) + duration.randomRangeStart;
                }
            }
        }
        let d = getDelay();
        let du = getDuration();
        let startTime = (new Date()).getTime() + d;
        let stopTime = startTime + du;
        function addAnimationTime(time) {
            if (beforeAnimation != undefined)
                beforeAnimation();
            if (invertValue) {
                aniProc(time, 1, 0);
            }
            else {
                aniProc(time, 0, 0);
            }
            if (isLoop) {
                let tpm = new CTimePointMoveTime(time, startTime, stopTime);
                tpm.notifyDirection = "go";
                let tpmb = new CTimePointMoveTime(time, stopTime, startTime);
                tpmb.notifyDirection = "back";
                tpm.onTime = function (tp, t) {
                    tp.timePointCount = 0;
                };
                tpmb.onTime = function (tp, t) {
                    tp.timePointCount = 0;
                };
                time.timePoints.push(tpm);
                time.timePoints.push(tpmb);
            }
            else {
                let tpend = new CTimePointRemoveTimeFromTimes(time, stopTime);
                tpend.notifyDirection = "go";
                let tpend2 = new CTimePointRemoveTimeFromTimes(time, startTime);
                tpend2.notifyDirection = "back";
                tpend.onTime = function () {
                    tpend.remove();
                    tpend2.remove();
                    if (afterAnimation != undefined)
                        afterAnimation();
                };
                tpend2.onTime = function () {
                    tpend.remove();
                    tpend2.remove();
                    if (afterAnimation != undefined)
                        afterAnimation();
                };
                time.timePoints.push(tpend);
                time.timePoints.push(tpend2);
            }
            time.onChangeTime = function (sender) {
                if (time.changeTime != undefined) {
                    let v = CCalc.crRange2Value(startTime, stopTime, time.time, 0, 1);
                    if (v < 0)
                        v = 0;
                    if (v > 1)
                        v = 1;
                    if (invertValue) {
                        v = 1 - v;
                    }
                    aniProc(time, v, time.changeTime);
                }
            };
        }
        if (d == 0) {
            if (time != undefined) {
                CTime.times.add(CSequence.getSequence("tempAnimation"), time);
                addAnimationTime(time);
            }
            else {
                let t = new CTime();
                CTime.times.add(CSequence.getSequence("tempAnimation"), t);
                addAnimationTime(t);
            }
        }
        else {
            if (time != undefined) {
                CTime.times.add(CSequence.getSequence("tempAnimation"), time);
            }
            setTimeout(() => {
                if (time != undefined) {
                    addAnimationTime(time);
                }
                else {
                    let t = new CTime();
                    CTime.times.add(CSequence.getSequence("tempAnimation"), t);
                    addAnimationTime(t);
                }
            }, d);
        }
        return { duration: du, delay: d, startTime: startTime, stopTime: stopTime };
    }
    static graphAnimate(duration, graphNames, graphProc, pointsNames, pointsProc, delay, invertValue, isLoop, beforeAnimation, afterAnimation, time) {
        let arr = new Array();
        let arrPoints = new Array();
        for (let n = 0; n < graphNames.length; n++) {
            let values = CSystem.resources.get(graphNames[n]);
            if (values != undefined) {
                arr.push({ name: graphNames[n], values: values });
            }
        }
        if (pointsNames != undefined) {
            for (let n = 0; n < pointsNames.length; n++) {
                let pts = CSystem.resources.get("pathpoints" + pointsNames[n]);
                if (pts != undefined) {
                    let values = CSystem.resources.get(pts.graphName);
                    if (values != undefined) {
                        arrPoints.push({ graphName: pts.graphName, graphValues: values, pointsName: pointsNames[n], points: pts.points });
                    }
                }
            }
        }
        CAnimation.animate(duration, function (time, value, changeTime) {
            for (let n = 0; n < arr.length; n++) {
                graphProc(time, value, changeTime, arr[n].name, arr[n].values[Math.round(CCalc.cr(arr[n].values.length - 1, 0, 1, value, 2))]);
            }
            if (pointsNames != undefined && pointsProc != undefined) {
                for (let n = 0; n < arrPoints.length; n++) {
                    let gv = arrPoints[n].graphValues[Math.round(CCalc.cr(arrPoints[n].graphValues.length - 1, 0, 1, value, 2))];
                    if (gv < 0)
                        gv = 0;
                    if (gv > 1)
                        gv = 1;
                    pointsProc(time, value, changeTime, arrPoints[n].pointsName, arrPoints[n].points[Math.round(CCalc.cr(arrPoints[n].points.length - 1, 0, 1, gv, 2))]);
                }
            }
        }, delay, invertValue, isLoop, beforeAnimation, afterAnimation, time);
    }
}
class CGraphAnimationInfo extends CResourceClass {
    constructor(duration, graphNames, graphProc, pointsNames, pointsProc, delay, invertValue, isLoop, beforeAnimation, afterAnimation) {
        super();
        this.duration = 200;
        this.graphNames = new Array();
        this.duration = duration;
        this.graphNames = graphNames;
        this.graphProc = graphProc;
        this.pointsNames = pointsNames;
        this.pointsProc = pointsProc;
        this.delay = delay;
        this.invertValue = invertValue;
        this.isLoop = isLoop;
        this.beforeAnimation = beforeAnimation;
        this.afterAnimation = afterAnimation;
    }
    doStartAnimation() {
        let rt = this.getAnimation();
        if (this.onStartAnimation != undefined)
            this.onStartAnimation(this, rt);
        if (this.invertValue != undefined && this.invertValue) {
            rt.invert();
        }
        else {
            rt.start();
        }
        return rt;
    }
    getAnimation() {
        let rt = new CGraphAnimation(this.graphNames, this.pointsNames, this.duration, this.delay, this.isLoop);
        if (this.graphProc != undefined)
            rt.onGraphAnimate = this.graphProc;
        if (this.pointsProc != undefined)
            rt.onPointsAnimate = this.pointsProc;
        if (this.beforeAnimation != undefined)
            rt.onBeforeAnimation = this.beforeAnimation;
        if (this.afterAnimation != undefined)
            rt.onAfterAnimation = this.afterAnimation;
        return rt;
    }
    startAnimation() {
        return this.doStartAnimation();
    }
}
class CGraphAnimation extends CAnimation {
    constructor(graphNames, pointsNames, duration, delay, isLoop) {
        super(duration, delay, isLoop);
        this._arr = new Array();
        this._arrPoints = new Array();
        this.graphNames = graphNames;
        this.pointsNames = pointsNames;
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "graphNames", this.graphNames, [], true);
        CDataClass.putData(data, "pointsNames", this.pointsNames, undefined);
    }
    doFromData(data) {
        super.doFromData(data);
        this.graphNames = CDataClass.getData(data, "graphNames", [], true);
        this.pointsNames = CDataClass.getData(data, "pointsNames", undefined);
    }
    doStart(invert) {
        this._arr = [];
        this._arrPoints = [];
        for (let n = 0; n < this.graphNames.length; n++) {
            let values = CSystem.resources.get(this.graphNames[n]);
            if (values != undefined) {
                this._arr.push({ name: this.graphNames[n], values: values });
            }
        }
        if (this.pointsNames != undefined) {
            for (let n = 0; n < this.pointsNames.length; n++) {
                let pts = CSystem.resources.get(this.pointsNames[n]);
                if (pts != undefined) {
                    let values = CSystem.resources.get(pts.graphName);
                    if (values != undefined) {
                        this._arrPoints.push({ graphName: pts.graphName, graphValues: values, pointsName: this.pointsNames[n], points: pts.points });
                    }
                }
            }
        }
        super.doStart(invert);
    }
    doAnimate(time, value, changeTime) {
        super.doAnimate(time, value, changeTime);
        for (let n = 0; n < this._arr.length; n++) {
            this.doGraphAnimate(time, value, changeTime, this._arr[n].name, this._arr[n].values[Math.round(CCalc.cr(this._arr[n].values.length - 1, 0, 1, value, 2))]);
        }
        if (this.pointsNames != undefined) {
            for (let n = 0; n < this._arrPoints.length; n++) {
                let gv = this._arrPoints[n].graphValues[Math.round(CCalc.cr(this._arrPoints[n].graphValues.length - 1, 0, 1, value, 2))];
                if (gv < 0)
                    gv = 0;
                if (gv > 1)
                    gv = 1;
                this.doPointsAnimate(time, value, changeTime, this._arrPoints[n].pointsName, this._arrPoints[n].points[Math.round(CCalc.cr(this._arrPoints[n].points.length - 1, 0, 1, gv, 2))]);
            }
        }
    }
    doGraphAnimate(time, value, changeTime, graphName, graphValue) {
        if (this.onGraphAnimate != undefined) {
            this.onGraphAnimate(this, time, value, changeTime, graphName, graphValue);
        }
    }
    doPointsAnimate(time, value, changeTime, pointsName, pointsValue) {
        if (this.onPointsAnimate != undefined) {
            this.onPointsAnimate(this, time, value, changeTime, pointsName, pointsValue);
        }
    }
}
class CColorInfo extends CDataClass {
    constructor(r, g, b, a) {
        super();
        this.r = 255;
        this.g = 255;
        this.b = 255;
        this.a = 1;
        if (r != undefined)
            this.r = r;
        if (g != undefined)
            this.g = g;
        if (b != undefined)
            this.b = b;
        if (a != undefined)
            this.a = a;
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "r", this.r, 255);
        CDataClass.putData(data, "g", this.g, 255);
        CDataClass.putData(data, "b", this.b, 255);
        CDataClass.putData(data, "a", this.a, 1);
    }
    doFromData(data) {
        super.doFromData(data);
        this.r = CDataClass.getData(data, "r", 255);
        this.g = CDataClass.getData(data, "g", 255);
        this.b = CDataClass.getData(data, "b", 255);
        this.a = CDataClass.getData(data, "a", 1);
    }
    toColor() {
        return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
    }
}
var EGraphAnimationValueKind;
(function (EGraphAnimationValueKind) {
    EGraphAnimationValueKind[EGraphAnimationValueKind["GRAPH"] = 0] = "GRAPH";
    EGraphAnimationValueKind[EGraphAnimationValueKind["POINTS"] = 1] = "POINTS";
})(EGraphAnimationValueKind || (EGraphAnimationValueKind = {}));
var EPointsValueKind;
(function (EPointsValueKind) {
    EPointsValueKind[EPointsValueKind["POINT"] = 0] = "POINT";
    EPointsValueKind[EPointsValueKind["RECT"] = 1] = "RECT";
    EPointsValueKind[EPointsValueKind["NOTIFYRECT"] = 2] = "NOTIFYRECT";
})(EPointsValueKind || (EPointsValueKind = {}));
class CGraphAnimationValue extends CDataClass {
    constructor(name, startValue, stopValue) {
        super();
        this.name = name;
        this.startValue = startValue;
        this.stopValue = stopValue;
    }
    get startValueString() {
        let v = "";
        if (typeof this.startValue == "number") {
            v = this.startValue + "";
        }
        else if (this.startValue instanceof CColorInfo) {
            v = "new CColorInfo(" + this.startValue.r + "," + this.startValue.g + "," + this.startValue.b + "," + this.startValue.a + ")";
        }
        else if (this.startValue instanceof CPoint) {
            v = "new CPoint(" + this.startValue.x + "," + this.startValue.y + ")";
        }
        return v;
    }
    get stopValueString() {
        let v = "";
        if (typeof this.stopValue == "number") {
            v = this.stopValue + "";
        }
        else if (this.stopValue instanceof CColorInfo) {
            v = "new CColorInfo(" + this.stopValue.r + "," + this.stopValue.g + "," + this.stopValue.b + "," + this.stopValue.a + ")";
        }
        else if (this.startValue instanceof CPoint) {
            v = "new CPoint(" + this.startValue.x + "," + this.startValue.y + ")";
        }
        return v;
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "name", this.name, "");
        if (typeof this.startValue == "number") {
            CDataClass.putData(data, "startKind", "number");
            CDataClass.putData(data, "startValue", this.startValue, 0);
        }
        else if (this.startValue instanceof CPoint) {
            CDataClass.putData(data, "startKind", "CPoint");
            CDataClass.putData(data, "startValue", this.startValue.toData(), { x: 0, y: 0 }, true);
        }
        else if (this.startValue instanceof CRect) {
            CDataClass.putData(data, "startKind", "CRect");
            CDataClass.putData(data, "startValue", this.startValue.toData(), { left: 0, top: 0, right: 0, bottom: 0 }, true);
        }
        else if (this.startValue instanceof CNotifyPoint) {
            CDataClass.putData(data, "startKind", "CNotifyPoint");
            CDataClass.putData(data, "startValue", this.startValue.toData(), { x: 0, y: 0 }, true);
        }
        else if (this.startValue instanceof CNotifyRect) {
            CDataClass.putData(data, "startKind", "CNotifyRect");
            CDataClass.putData(data, "startValue", this.startValue.toData(), { left: 0, top: 0, right: 0, bottom: 0 }, true);
        }
        else if (this.startValue instanceof CColorInfo) {
            CDataClass.putData(data, "startKind", "CColorInfo");
            CDataClass.putData(data, "startValue", this.startValue.toData(), { r: 255, g: 255, b: 255, a: 1 }, true);
        }
        if (typeof this.stopValue == "number") {
            CDataClass.putData(data, "stopKind", "number");
            CDataClass.putData(data, "stopValue", this.stopValue, 0);
        }
        else if (this.stopValue instanceof CPoint) {
            CDataClass.putData(data, "stopKind", "CPoint");
            CDataClass.putData(data, "stopValue", this.stopValue.toData(), { x: 0, y: 0 }, true);
        }
        else if (this.stopValue instanceof CRect) {
            CDataClass.putData(data, "stopKind", "CRect");
            CDataClass.putData(data, "stopValue", this.stopValue.toData(), { left: 0, top: 0, right: 0, bottom: 0 }, true);
        }
        else if (this.stopValue instanceof CNotifyPoint) {
            CDataClass.putData(data, "stopKind", "CNotifyPoint");
            CDataClass.putData(data, "stopValue", this.stopValue.toData(), { x: 0, y: 0 }, true);
        }
        else if (this.stopValue instanceof CNotifyRect) {
            CDataClass.putData(data, "stopKind", "CNotifyRect");
            CDataClass.putData(data, "stopValue", this.stopValue.toData(), { left: 0, top: 0, right: 0, bottom: 0 }, true);
        }
        else if (this.stopValue instanceof CColorInfo) {
            CDataClass.putData(data, "stopKind", "CColorInfo");
            CDataClass.putData(data, "stopValue", this.stopValue.toData(), { r: 255, g: 255, b: 255, a: 1 }, true);
        }
    }
    doFromData(data) {
        super.doFromData(data);
        this.name = CDataClass.getData(data, "name", "");
        let startKind = CDataClass.getData(data, "startKind");
        let stopKind = CDataClass.getData(data, "stopKind");
        if (startKind == "number") {
            this.startValue = CDataClass.getData(data, "startValue", 0);
        }
        if (startKind == "CPoint") {
            this.startValue = new CPoint();
            this.startValue.fromData(CDataClass.getData(data, "startValue", { x: 0, y: 0 }, true));
        }
        if (startKind == "CRect") {
            this.startValue = new CRect();
            this.startValue.fromData(CDataClass.getData(data, "startValue", { left: 0, top: 0, right: 0, bottom: 0 }, true));
        }
        if (startKind == "CNotifyPoint") {
            this.startValue = new CNotifyPoint();
            this.startValue.fromData(CDataClass.getData(data, "startValue", { x: 0, y: 0 }, true));
        }
        if (startKind == "CNotifyRect") {
            this.startValue = new CNotifyRect();
            this.startValue.fromData(CDataClass.getData(data, "startValue", { left: 0, top: 0, right: 0, bottom: 0 }, true));
        }
        if (startKind == "CColorInfo") {
            this.startValue = new CColorInfo();
            this.startValue.fromData(CDataClass.getData(data, "startValue", { r: 255, g: 255, b: 255, a: 1 }, true));
        }
        if (stopKind == "number") {
            this.stopValue = CDataClass.getData(data, "stopValue", 0);
        }
        if (stopKind == "CPoint") {
            this.stopValue = new CPoint();
            this.stopValue.fromData(CDataClass.getData(data, "stopValue", { x: 0, y: 0 }, true));
        }
        if (stopKind == "CRect") {
            this.stopValue = new CRect();
            this.stopValue.fromData(CDataClass.getData(data, "stopValue", { left: 0, top: 0, right: 0, bottom: 0 }, true));
        }
        if (stopKind == "CNotifyPoint") {
            this.stopValue = new CNotifyPoint();
            this.stopValue.fromData(CDataClass.getData(data, "stopValue", { x: 0, y: 0 }, true));
        }
        if (stopKind == "CNotifyRect") {
            this.stopValue = new CNotifyRect();
            this.stopValue.fromData(CDataClass.getData(data, "stopValue", { left: 0, top: 0, right: 0, bottom: 0 }, true));
        }
        if (stopKind == "CColorInfo") {
            this.stopValue = new CColorInfo();
            this.stopValue.fromData(CDataClass.getData(data, "stopValue", { r: 255, g: 255, b: 255, a: 1 }, true));
        }
    }
    getValue(timeValue) {
        if (typeof this.startValue == "number" && typeof this.stopValue == "number") {
            return CCalc.crRange2Value(0, 1, timeValue, this.startValue, this.stopValue);
        }
        if (this.startValue instanceof CPoint && this.stopValue instanceof CPoint) {
            let x = CCalc.crRange2Value(0, 1, timeValue, this.startValue.x, this.stopValue.x);
            let y = CCalc.crRange2Value(0, 1, timeValue, this.startValue.y, this.stopValue.y);
            return CPoint.create(x, y);
        }
        if (this.startValue instanceof CNotifyPoint && this.stopValue instanceof CNotifyPoint) {
            let x = CCalc.crRange2Value(0, 1, timeValue, this.startValue.x, this.stopValue.x);
            let y = CCalc.crRange2Value(0, 1, timeValue, this.startValue.y, this.stopValue.y);
            return CNotifyPoint.create(x, y);
        }
        if (this.startValue instanceof CRect && this.stopValue instanceof CRect) {
            let l = CCalc.crRange2Value(0, 1, timeValue, this.startValue.left, this.stopValue.left);
            let t = CCalc.crRange2Value(0, 1, timeValue, this.startValue.top, this.stopValue.top);
            let r = CCalc.crRange2Value(0, 1, timeValue, this.startValue.right, this.stopValue.right);
            let b = CCalc.crRange2Value(0, 1, timeValue, this.startValue.bottom, this.stopValue.bottom);
            return CRect.create(l, t, r, b);
        }
        if (this.startValue instanceof CNotifyRect && this.stopValue instanceof CNotifyRect) {
            let l = CCalc.crRange2Value(0, 1, timeValue, this.startValue.left, this.stopValue.left);
            let t = CCalc.crRange2Value(0, 1, timeValue, this.startValue.top, this.stopValue.top);
            let r = CCalc.crRange2Value(0, 1, timeValue, this.startValue.right, this.stopValue.right);
            let b = CCalc.crRange2Value(0, 1, timeValue, this.startValue.bottom, this.stopValue.bottom);
            let rt = new CNotifyRect(l, t, r, b);
            return rt;
        }
        if (this.startValue instanceof CColorInfo && this.stopValue instanceof CColorInfo) {
            let r = CCalc.crRange2Value(0, 1, timeValue, this.startValue.r, this.stopValue.r);
            let g = CCalc.crRange2Value(0, 1, timeValue, this.startValue.g, this.stopValue.g);
            let b = CCalc.crRange2Value(0, 1, timeValue, this.startValue.b, this.stopValue.b);
            let a = CCalc.crRange2Value(0, 1, timeValue, this.startValue.a, this.stopValue.a);
            let rt = new CColorInfo(r, g, b, a);
            return rt;
        }
    }
    static graphValueToData(value) {
        if (typeof value == "number") {
            return { kind: "number", value: value };
        }
        else if (value instanceof CPoint) {
            return { kind: "CPoint", value: value.toData() };
        }
        else if (value instanceof CRect) {
            return { kind: "CRect", value: value.toData() };
        }
        else if (value instanceof CNotifyPoint) {
            return { kind: "CNotifyPoint", value: value.toData() };
        }
        else if (value instanceof CNotifyRect) {
            return { kind: "CNotifyRect", value: value.toData() };
        }
        else if (value instanceof CColorInfo) {
            return { kind: "CColorInfo", value: value.toData() };
        }
    }
    static graphValueFromData(data) {
        if (data.kind == "number") {
            return data.value;
        }
        else if (data.kind == "CPoint") {
            let v = new CPoint();
            v.fromData(data.value);
            return v;
        }
        else if (data.kind == "CRect") {
            let v = new CRect();
            v.fromData(data.value);
            return v;
        }
        else if (data.kind == "CNotifyPoint") {
            let v = new CNotifyPoint();
            v.fromData(data.value);
            return v;
        }
        else if (data.kind == "CNotifyRect") {
            let v = new CNotifyRect();
            v.fromData(data.value);
            return v;
        }
        else {
            let v = new CColorInfo();
            v.fromData(data.valeu);
            return v;
        }
    }
}
class CPointsAnimationValue extends CDataClass {
    constructor(name, pointsArea, rectWidth, rectHeight) {
        super();
        this.name = name;
        this.pointsArea = pointsArea;
        this.rectWidth = rectWidth;
        this.rectHeight = rectHeight;
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "name", this.name, "");
        CDataClass.putData(data, "pointsArea", this.pointsArea.toData(), { left: 0, top: 0, right: 0, bottom: 0 }, true);
        CDataClass.putData(data, "rectWidth", this.rectWidth, undefined);
        CDataClass.putData(data, "rectHeight", this.rectHeight, undefined);
    }
    doFromData(data) {
        super.doFromData(data);
        this.name = CDataClass.getData(data, "name", "");
        this.pointsArea.fromData(CDataClass.getData(data, "pointsArea", { left: 0, top: 0, right: 0, bottom: 0 }, true));
        this.rectWidth = CDataClass.getData(data, "rectWidth", undefined);
        this.rectHeight = CDataClass.getData(data, "rectHeight", undefined);
    }
    getPointValue(pointValue, kind) {
        if (kind == EPointsValueKind.POINT) {
            let x = CCalc.crRange2Value(0, 1, pointValue.x, this.pointsArea.left, this.pointsArea.right);
            let y = CCalc.crRange2Value(0, 1, pointValue.y, this.pointsArea.top, this.pointsArea.bottom);
            return CPoint.create(x, y);
        }
        if (kind == EPointsValueKind.RECT && this.rectWidth != undefined && this.rectHeight != undefined) {
            let rt = new CRect();
            rt.left = CCalc.crRange2Value(0, 1, pointValue.x, this.pointsArea.left, this.pointsArea.right);
            rt.top = CCalc.crRange2Value(0, 1, pointValue.y, this.pointsArea.top, this.pointsArea.bottom);
            rt.width = this.rectWidth;
            rt.height = this.rectHeight;
            return rt;
        }
        if (kind == EPointsValueKind.NOTIFYRECT && this.rectWidth != undefined && this.rectHeight != undefined) {
            let rt = new CNotifyRect();
            rt.left = CCalc.crRange2Value(0, 1, pointValue.x, this.pointsArea.left, this.pointsArea.right);
            rt.top = CCalc.crRange2Value(0, 1, pointValue.y, this.pointsArea.top, this.pointsArea.bottom);
            rt.width = this.rectWidth;
            rt.height = this.rectHeight;
            return rt;
        }
    }
}
class CProperty extends CDataClass {
    constructor(object, properties) {
        super();
        this.properties = "";
        this.obj = object;
        this.properties = properties;
    }
    get property() {
        let fn = new Function("obj", "return obj." + this.properties);
        return fn(this.obj);
    }
    set property(value) {
        let arr = this.properties.split(".");
        let s = "";
        for (let n = 0; n < arr.length; n++) {
            s += "." + arr[n];
            let fn = new Function("obj", "return obj" + s + " == undefined");
            if (fn(this.obj)) {
                return;
            }
        }
        let fn = new Function("obj", "v", "if(obj." + this.properties + " != undefined) obj." + this.properties + " = v");
        fn(this.obj, value);
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "properties", this.properties, "");
    }
    doFromData(data) {
        super.doFromData(data);
        this.properties = CDataClass.getData(data, "properties", "");
    }
    static getProperty(object, properties) {
        let fn = new Function("obj", "return obj." + properties);
        return fn(object);
    }
    static setProperty(object, properties, value) {
        let fn = new Function("obj", "v", "obj." + properties + " = v");
        fn(object, value);
    }
}
class CAnimatorSetProperty extends CProperty {
    constructor(object, properties, value) {
        super(object, properties);
        this.value = value;
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "value", this.value);
    }
    doFromData(data) {
        super.doFromData(data);
        this.value = CDataClass.getData(data, "changeValue");
    }
}
class CAnimatorGraphProperty extends CProperty {
    constructor(object, properties, name, startValue, stopValue) {
        super(object, properties);
        this.changeValue = new CGraphAnimationValue(name, startValue, stopValue);
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "changeValue", this.changeValue.toData());
    }
    doFromData(data) {
        super.doFromData(data);
        this.changeValue.fromData(CDataClass.getData(data, "changeValue"));
    }
}
class CAnimatorPointsProperty extends CProperty {
    constructor(object, properties, name, pointsArea, rectWidth, rectHeight) {
        super(object, properties);
        this.changeValue = new CPointsAnimationValue(name, pointsArea, rectWidth, rectHeight);
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "changeValue", this.changeValue);
    }
    doFromData(data) {
        super.doFromData(data);
        this.changeValue.fromData(CDataClass.getData(data, "changeValue"));
    }
}
class CAnimator extends CGraphAnimation {
    constructor(parent, graphNames = [], pointsNames, duration, delay, isLoop) {
        super(graphNames, pointsNames, duration, delay, isLoop);
        this._beforeProperties = new Array();
        this._graphProperties = new Array();
        this._pointsProperties = new Array();
        this._afterProperties = new Array();
        this.beforeScript = "//parameter : animator, params";
        this.animationScript = "//parameter : animator, params, graphName, graphValue";
        this.afterScript = "//parameter : animator, params";
        this._parent = parent;
    }
    get parent() {
        return this._parent;
    }
    set parent(value) {
        this._parent = value;
        for (let n = 0; n < this._graphProperties.length; n++) {
            this._graphProperties[n].obj = value;
        }
        for (let n = 0; n < this._pointsProperties.length; n++) {
            this._pointsProperties[n].obj = value;
        }
    }
    get beforeProperties() {
        return this._beforeProperties;
    }
    set beforeProperties(value) {
        this._beforeProperties = value;
    }
    get graphProperties() {
        return this._graphProperties;
    }
    get pointsProperties() {
        return this._pointsProperties;
    }
    get afterProperties() {
        return this._afterProperties;
    }
    set afterProperties(value) {
        this._afterProperties = value;
    }
    doToData(data) {
        super.doToData(data);
        let arr = new Array();
        for (let n = 0; n < this._graphProperties.length; n++) {
            arr.push(this._graphProperties[n].toData());
        }
        let arr2 = new Array();
        for (let n = 0; n < this._pointsProperties.length; n++) {
            arr2.push(this._pointsProperties[n].toData());
        }
        CDataClass.putData(data, "className", this.className);
        CDataClass.putData(data, "beforeProperties", this.beforeProperties, [], true);
        CDataClass.putData(data, "graphProperties", arr, [], true);
        CDataClass.putData(data, "pointsProperties", arr2, [], true);
        CDataClass.putData(data, "afterProperties", this.afterProperties, [], true);
        CDataClass.putData(data, "beforeScript", this.beforeScript, "//parameter : animator, params");
        CDataClass.putData(data, "animationScript", this.animationScript, "//parameter : animator, params, graphName, graphValue");
        CDataClass.putData(data, "afterScript", this.afterScript, "//parameter : animator, params");
    }
    doFromData(data) {
        super.doFromData(data);
        this.beforeProperties = CDataClass.getData(data, "beforeProperties", [], true);
        this._graphProperties = [];
        let arr = CDataClass.getData(data, "graphProperties", [], true);
        for (let n = 0; n < arr.length; n++) {
            let item = new CAnimatorGraphProperty(this._parent, "", "", 0, 0);
            item.fromData(arr[n]);
            this._graphProperties.push(item);
        }
        this._pointsProperties = [];
        arr = CDataClass.getData(data, "pointsProperties", [], true);
        for (let n = 0; n < arr.length; n++) {
            let item = new CAnimatorPointsProperty(this._parent, "", "", new CRect());
            item.fromData(arr[n]);
            this._pointsProperties.push(item);
        }
        this.afterProperties = CDataClass.getData(data, "afterProperties", [], true);
        this.beforeScript = CDataClass.getData(data, "beforeScript", "//parameter : animator, params");
        this.animationScript = CDataClass.getData(data, "animationScript", "//parameter : animator, params, graphName, graphValue");
        this.afterScript = CDataClass.getData(data, "afterScript", "//parameter : animator, params");
    }
    doRemove() {
        this.parent = undefined;
        this._beforeProperties = [];
        this._afterProperties = [];
        this._pointsProperties = [];
        this._graphProperties = [];
        this.__obj = {};
        super.doRemove();
    }
    doBeforeAnimation() {
        super.doBeforeAnimation();
        for (let n = 0; n < this._beforeProperties.length; n++) {
            this._beforeProperties[n].property = this._beforeProperties[n].value;
        }
        if (this.animationScript != "//parameter : animator, params") {
            this.__obj = {};
            let f = new Function("animator", "params", this.beforeScript);
            f(this, this.__obj);
        }
    }
    doAfterAnimation() {
        super.doAfterAnimation();
        for (let n = 0; n < this._afterProperties.length; n++) {
            this._afterProperties[n].property = this._afterProperties[n].value;
        }
        if (this.animationScript != "//parameter : animator, params") {
            let f = new Function("animator", "params", this.afterScript);
            f(this, this.__obj);
        }
        this.__obj = {};
    }
    doGraphAnimate(time, value, changeTime, graphName, graphValue) {
        super.doGraphAnimate(time, value, changeTime, graphName, graphValue);
        for (let n = 0; n < this._graphProperties.length; n++) {
            let cv = this._graphProperties[n].changeValue;
            if (cv.name == graphName) {
                let v = cv.getValue(graphValue);
                if (v != undefined) {
                    if (v instanceof CColorInfo) {
                        this._graphProperties[n].property = v.toColor();
                    }
                    else {
                        this._graphProperties[n].property = v;
                    }
                }
            }
        }
        if (this.animationScript != "//parameter : animator, params, graphName, graphValue") {
            let f = new Function("animator", "params", "graphName", "graphValue", this.animationScript);
            f(this, this.__obj, graphName, graphValue);
        }
    }
    doPointsAnimate(time, value, changeTime, pointsName, pointsValue) {
        super.doPointsAnimate(time, value, changeTime, pointsName, pointsValue);
        for (let n = 0; n < this._pointsProperties.length; n++) {
            let cv = this._pointsProperties[n].changeValue;
            if (cv.name == pointsName) {
                if (this._pointsProperties[n].property instanceof CRect) {
                    let v = cv.getPointValue(pointsValue, EPointsValueKind.RECT);
                    if (v != undefined) {
                        this._pointsProperties[n].property = v;
                    }
                }
                if (this._pointsProperties[n].property instanceof CPoint) {
                    let v = cv.getPointValue(pointsValue, EPointsValueKind.POINT);
                    if (v != undefined) {
                        this._pointsProperties[n].property = v;
                    }
                }
                if (this._pointsProperties[n].property instanceof CNotifyRect) {
                    let v = cv.getPointValue(pointsValue, EPointsValueKind.NOTIFYRECT);
                    if (v != undefined) {
                        this._pointsProperties[n].property = v;
                    }
                }
            }
        }
    }
    addBeforeSetProperty(properties, value) {
        let bs = new CAnimatorSetProperty(this._parent, properties, value);
        this._beforeProperties.push(bs);
    }
    addAnimationGraphProperty(properties, name, startValue, stopValue) {
        let pp = new CAnimatorGraphProperty(this._parent, properties, name, startValue, stopValue);
        this._graphProperties.push(pp);
    }
    addAnimationPointsProperty(properties, name, pointsArea, rectWidth, rectHeight) {
        let pp = new CAnimatorPointsProperty(this._parent, properties, name, pointsArea, rectWidth, rectHeight);
        this._pointsProperties.push(pp);
    }
    addAfterSetProperty(properties, value) {
        let as = new CAnimatorSetProperty(this._parent, properties, value);
        this._afterProperties.push(as);
    }
    static fromAnimatorData(data, parent, propertyName) {
        let ft = CDataClass.getData(data, propertyName, undefined);
        if (ft != undefined) {
            if (parent[propertyName] == undefined) {
                if (ft["className"] == undefined || ft["className"] == "CAnimator") {
                    parent[propertyName] = new CAnimator(parent);
                }
                else if (ft["className"] == "CResourceAnimator") {
                    parent[propertyName] = new CResourceAnimator(parent);
                }
                else if (ft["className"] == "CCopyCanvasAnimator") {
                    parent[propertyName] = new CCopyCanvasAnimator(parent);
                }
            }
            parent[propertyName].fromData(ft);
        }
    }
    static animatorFromResource(parent, resource) {
        let rc = CSystem.resources.get(resource);
        if (rc != undefined) {
            if (rc.className != undefined) {
                let fn = new Function("return new " + rc.className + "()");
                let con = fn();
                con.resource = resource;
                con.parent = parent;
                return con;
            }
        }
        else {
            return undefined;
        }
    }
}
class CResourceAnimator extends CAnimator {
    constructor(controlResource, parentControlName, graphNames, pointsNames, duration, delay, isLoop) {
        super(undefined, graphNames, pointsNames, duration, delay, isLoop);
        this.controlResource = controlResource;
        this.parentControlName = parentControlName;
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "controlResource", this.controlResource, "");
        CDataClass.putData(data, "parentControlName", this.parentControlName, undefined);
    }
    doFromData(data) {
        super.doFromData(data);
        this.controlResource = CDataClass.getData(data, "controlResource", "");
        this.parentControlName = CDataClass.getData(data, "parentControlName", undefined);
    }
    doAfterAnimation() {
        super.doAfterAnimation();
        this.parent.remove();
        this.parent = undefined;
    }
    start() {
        let con = CControl.controlFromResource(this.controlResource);
        con.hasPointerEvent = false;
        if (this.parentControlName == undefined) {
            con.parent = document.body;
        }
        else {
            let pr = CControl.getControl(this.parentControlName);
            if (pr.length > 0) {
                con.parent = pr[0];
            }
        }
        con.position.left = 0;
        con.position.top = 0;
        con.position.width = con.parent.position.width;
        con.position.height = con.parent.position.height;
        let ani = new CAnimator(undefined);
        ani.fromData(this.toData());
        ani.parent = con;
        ani.onAfterAnimation = function () {
            con.remove();
            ani.remove();
        };
        ani.start();
    }
}
class CCopyCanvasAnimator extends CAnimator {
    start() {
        let con = new CCanvasLayerControl(this.parent);
        con.hasPointerEvent = false;
        con.layers.fromData(this.parent.layers.toData());
        con.position.left = 0;
        con.position.top = 0;
        con.position.width = this.parent.position.width;
        con.position.height = this.parent.position.height;
        let ani = new CAnimator(undefined);
        ani.fromData(this.toData());
        ani.parent = con;
        let self = this;
        ani.onAfterAnimation = function () {
            con.remove();
            ani.remove();
            if (self.onAfterAnimation != undefined) {
                self.onAfterAnimation(self);
            }
        };
        ani.start();
    }
}
