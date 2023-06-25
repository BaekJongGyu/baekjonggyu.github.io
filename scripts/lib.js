"use strict";
async function fetchBody(url) {
    let f = await fetch(url);
    return await f.text();
}
async function postData(url, data = {}) {
    let body = new URLSearchParams(data);
    const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            //'Content-Type': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: body,
    });
    return response.json();
}
class CTimeChecker {
    constructor() {
        this._startTime = new Date().getTime();
        this._stopTime = new Date().getTime();
    }
    startChecker() {
        this._startTime = new Date().getTime();
    }
    stopChecker() {
        this._stopTime = new Date().getTime();
        let tm = (this._stopTime - this._startTime) / 1000;
        return tm;
    }
    static startChecker() {
        CTimeChecker.sc = new Date().getTime();
    }
    static stopChecker() {
        CTimeChecker.ed = new Date().getTime();
        let tm = (CTimeChecker.ed - CTimeChecker.sc) / 1000;
        return tm;
    }
}
var ELanguageStringKind;
(function (ELanguageStringKind) {
    ELanguageStringKind[ELanguageStringKind["WORD"] = 0] = "WORD";
    ELanguageStringKind[ELanguageStringKind["SENTENCE"] = 1] = "SENTENCE";
})(ELanguageStringKind || (ELanguageStringKind = {}));
class CLanguage {
    static get localCode() {
        return CLanguage._localCode;
    }
    static set localCode(value) {
        if (this._localCode != value) {
            this._localCode = value;
            this.doChangeCountry();
        }
    }
    static doChangeCountry() {
        console.log("change country", this._localCode);
        for (let n = 0; n < CSystem.controls.length; n++) {
            let con = CSystem.controls.getRow(0).get(0).asObject;
            con.doChangeCountry(CLanguage._localCode);
        }
    }
    static count() {
        return 104;
    }
    static getLanguage(index) {
        return { code: this._codes[index], name: this._names[index], localName: this._localNames[index] };
    }
    static getLanguageFromCode(code) {
        let idx = -1;
        for (let n = 0; n < this._codes.length; n++) {
            if (code == this._codes[n]) {
                idx = n;
                break;
            }
        }
        if (idx == -1) {
            return undefined;
        }
        else {
            return { code: this._codes[idx], name: this._names[idx], localName: this._localNames[idx] };
        }
    }
    static getLanguageFromCountry(country) {
        let idx = -1;
        for (let n = 0; n < this._names.length; n++) {
            if (country == this._names[n]) {
                idx = n;
                break;
            }
        }
        if (idx == -1) {
            return undefined;
        }
        else {
            return { code: this._codes[idx], name: this._names[idx], localName: this._localNames[idx] };
        }
    }
    static loadDictionary(values) {
        this._dictionary.clear();
        for (let n = 0; n < values.length; n++) {
            this._dictionary.set(values[n].key, values[n].value);
        }
    }
    static getText(key) {
        let t = this._dictionary.get(key);
        return t;
    }
}
CLanguage._localCode = "en";
CLanguage._dictionary = new Map();
CLanguage._codes = ["ko", "en", "gl", "gu", "el", "nl", "ne", "no", "da", "de", "lo", "lv", "la", "ru", "ro", "lb", "lt", "mr", "mi", "mk", "mg", "ml", "ms", "mt", "mn", "hmn", "my", "eu", "vi", "be", "bn", "bs", "bg", "sm", "sr", "ceb", "st", "so", "sn", "su", "sw", "sv", "gd", "es", "sk", "sl", "sd", "si", "ar", "hy", "is", "ht", "ga", "az", "af", "sq", "am", "et", "eo", "yo", "ur", "uz", "uk", "cy", "ig", "yi", "it", "id", "ja", "jw", "ka", "zu", "zh_ch", "zh_tw", "ny", "cs", "kk", "ca", "kn", "co", "xh", "ku", "hr", "km", "ky", "tl", "ta", "tg", "th", "tr", "te", "ps", "pa", "fa", "pt", "pl", "fr", "fy", "fi", "haw", "ha", "hu", "iw", "hi"];
CLanguage._names = ["Korean", "English", "Galician", "Gujarati", "Greek", "Dutch", "Nepali", "Norwegian", "Danish", "German", "Lao", "Latvian", "Latin", "Russian", "Romanian", "Luxembourgish", "Lithuanian", "Marathi", "Maori", "Macedonian", "Malagasy", "Malayalam", "Malay", "Maltese", "Mongolian", "Mongolian", "Myanmar(Burmese)", "Basque", "Vietnamese", "Belarusian", "Bengali", "Bosnian", "Bulgarian", "Samoan", "Serbian", "CebuAno", "Sesotho", "Somali", "Shona", "Sundar", "Swahili", "Swedish", "ScottishGaelic", "Spanish", "Slovak", "Slovenian", "Sindhi", "Sinhalese", "Arabic", "Armenian", "Icelandic", "Haitian", "Irish", "Azerbaijani", "Afrikaans", "Albanian", "Amharic", "Estonian", "Esperanto", "Yoruba", "Urdu", "Uzbek", "Ukrainian", "Welsh", "Igbo", "Yiddish", "Italian", "Indonesian", "Japanese", "Javanese", "Georgian", "Zulu", "Chinese(Simplified)", "Chinese(Traditional)", "Chewara", "Czech", "Kazakh", "Catalan", "Kannada", "Corsican", "Cosa", "Kurdish", "Croatian", "Khmer", "Kyrgyz", "Tagalog", "Tamil", "Tajik", "Thai", "Turkish", "Telugu", "Pashto", "Punjabi", "Persian", "Portuguese", "Polish", "French", "Frisian", "Finnish", "HAWEI", "Hausa", "Hungarian", "Hebrew", "Hindi"];
CLanguage._localNames = ["한국어", "English", "Galego", "ગુજરાતી", "Ελληνικά", "Nederlands", "नेपाली", "norsk", "dansk", "Deutsch", "ລາວ", "Latviešu valoda", "Latine", "русский", "românesc", "Lëtzebuergesch", "Lietuvių", "मराठी", "Maori", "Македонски", "Malagasy", "മലയാളം", "Melayu", "Malti", "Монгол хэл дээр", "Mongolian", "မြန်မာ (ဗမာ)", "Euskal", "Tiếng việt", "Беларуская", "বাঙালি", "Bosanski", "български", "Samoa", "Сербиан", "Cebu Ano", "Sesotho", "Somali", "Shona", "Sundar", "Kiswahili", "Svenska", "Gàidhlig na h-Alba", "Español", "slovenský", "Slovenščina", "سنڌي", "සිංහල", "العربية", "Հայերեն", "Íslensku", "Ayisyen", "Gaeilge", "Azərbaycan", "Afrikaans", "shqiptar", "አማርኛ", "Eesti keel", "Esperanto", "Yorùbá", "اردو", "O'zbek", "Українська", "Cymraeg", "Igbo", "Yiddish", "italiano", "Orang indonesia", "日本", "Jawa", "ქართული", "Zulu", "中文（简体）", "中文（繁體）", "Chiwara", "Česky", "Қазақша", "Català", "ಕನ್ನಡ", "Corsa", "Cosa", "Kurdî", "hrvatski", "ភាសាខ្មែរ", "Kirghiz", "Tagalog", "தமிழ்", "Тоҷикӣ", "ไทย", "Türk", "తెలుగు", "پښتو", "ਪੰਜਾਬੀ", "فارسی", "Português", "Polski", "Le français", "Frysk", "suomalainen", "HAWEI", "Hausa", "magyar", "עברית", "हिन्दी"];
class CStringUtil {
    static lpad(str, char, length) {
        if (str.length >= length) {
            return str;
        }
        let max = (length - str.length) / char.length;
        for (let n = 0; n < max; n++) {
            str = char + str;
        }
        return str;
    }
    static rpad(str, char, length) {
        if (str.length >= length) {
            return str;
        }
        let max = (length - str.length) / char.length;
        for (let n = 0; n < max; n++) {
            str += char;
        }
        return str;
    }
    static strToBase64(text) {
        return btoa(unescape(encodeURIComponent(text)));
    }
    static strToUriBase64(text) {
        let s = this.strToBase64(text);
        s = this.replaceAll(s, "/", "@");
        s = this.replaceAll(s, "+", "^");
        s = this.replaceAll(s, "=", "*");
        return s;
    }
    static strToUriBase64Prefix(head, text) {
        let s = this.strToBase64(text);
        s = this.replaceAll(s, "/", "@");
        s = this.replaceAll(s, "+", "^");
        s = this.replaceAll(s, "=", "*");
        s = head + ";" + s;
        return s;
    }
    static base64ToUriBase64(base64) {
        let s = this.replaceAll(base64, "/", "@");
        s = this.replaceAll(s, "+", "^");
        s = this.replaceAll(s, "=", "*");
        return s;
    }
    static base64ToUriBase64Prefix(head, base64) {
        let s = this.replaceAll(base64, "/", "@");
        s = this.replaceAll(s, "+", "^");
        s = this.replaceAll(s, "=", "*");
        s = head + ";" + s;
        return s;
    }
    static uriBase64ToBase64(uribase) {
        let s = this.replaceAll(uribase, "*", "=");
        s = this.replaceAll(s, "^", "+");
        s = this.replaceAll(s, "@", "/");
        return s;
    }
    static base64ToStr(text) {
        return decodeURIComponent(escape(atob(text)));
    }
    static UriBase64ToStr(text) {
        let s = this.replaceAll(text, "*", "=");
        s = this.replaceAll(s, "^", "+");
        s = this.replaceAll(s, "@", "/");
        return this.base64ToStr(s);
    }
    static setStringToText(s, delimiter) {
        let re = "";
        for (let v of s) {
            if (re != "") {
                re += delimiter;
            }
            re += v;
        }
        return re;
    }
    static setStringFromText(set, s, delimiter) {
        set.clear();
        let arr = s.split(delimiter);
        for (let n = 0; n < arr.length; n++) {
            set.add(arr[n]);
        }
    }
    static replaceAll(str, org, chg) {
        let arr = str.split(org);
        let re = "";
        for (let n = 0; n < arr.length; n++) {
            if (n != 0)
                re += chg;
            re += arr[n];
        }
        return re;
    }
    static getTextWidth(font, text) {
        if (CSystem.bufferingContext != undefined) {
            font.setFont(CSystem.bufferingContext);
            let arr = text.split("\n");
            let re = 0;
            for (let n = 0; n < arr.length; n++) {
                re = CCalc.max(CSystem.bufferingContext.measureText(arr[n]).width, re);
            }
            return re;
        }
        else {
            return -1;
        }
    }
    static getTextHeight(font, text) {
        let re = -1;
        let arr = text.split("\n");
        return font.fontSize * arr.length;
    }
    static getTextPathData(text, fontName) {
        return new Promise(function (rs) {
            /*if(CGlobal.userInfo != undefined) {
                //text: string, size: string, bold: string, italic: string, underline: string, strikeout: string, fontname: string
                let strm = new CStream()
                strm.putString(text)
                strm.putString("100")
                strm.putString(fontName)
                CGlobal.userInfo.sendSocketData("getTextData", strm, function(data) {
                    console.log(data)
                    data.getString()
                    data.getString()
                    let result = data.getString()
                    if(result == "success") {
                        data.getString()
                        let rt = data.getString()
                        rs(rt)
                    }
                })
            }*/
            rs("");
        });
    }
    static getTextPathDataEach(text, fontName) {
        return new Promise(function (rs) {
            /*if(CGlobal.userInfo != undefined) {
                //text: string, size: string, bold: string, italic: string, underline: string, strikeout: string, fontname: string
                let strm = new CStream()
                strm.putString(text)
                strm.putString("100")
                strm.putString(fontName)
                CGlobal.userInfo.sendSocketData("getTextDataEach", strm, function(data) {
                    console.log(data)
                    data.getString()
                    data.getString()
                    let result = data.getString()
                    if(result == "success") {
                        data.getString()
                        let rt = data.getString()
                        rs(JSON.parse(rt))
                    }
                })
            }*/
            //rs("")
        });
    }
    static sheetDataToMap(value) {
        let data = new Map();
        let area = { openidx: -1, closeidx: -1, isSearch: false };
        let col = 0;
        let row = 0;
        let ms = "";
        for (let n = 0; n < value.length; n++) {
            ms += value[n];
            if (!area.isSearch && value[n] == `"` && ms == `"`) {
                area.isSearch = true;
                area.openidx = n;
                if (n == value.length - 1) {
                    if (ms.charAt(ms.length - 1) == "\r")
                        ms = CStringUtil.replaceAll(ms, "\r", "");
                    data.set(col + "," + row, ms);
                }
                continue;
            }
            if (area.isSearch && value[n] == `"` && !(n + 1 < value.length && value[n + 1] == `"`) && !(n - 1 >= 0 && value[n - 1] == `"`)) {
                area.isSearch = false;
                area.closeidx = n;
                ms = ms.substr(1, ms.length - 2);
                ms = CStringUtil.replaceAll(ms, `""`, `"`);
                if (n == value.length - 1) {
                    if (ms.charAt(ms.length - 1) == "\r")
                        ms = CStringUtil.replaceAll(ms, "\r", "");
                    data.set(col + "," + row, ms);
                }
                continue;
            }
            if (!area.isSearch && value[n] == "\n") {
                ms = ms.substr(0, ms.length - 1);
                if (ms.charAt(ms.length - 1) == "\r")
                    ms = CStringUtil.replaceAll(ms, "\r", "");
                data.set(col + "," + row, ms);
                row++;
                col = 0;
                ms = "";
                continue;
            }
            if (!area.isSearch && value[n] == "\t") {
                ms = ms.substr(0, ms.length - 1);
                if (ms.charAt(ms.length - 1) == "\r")
                    ms = CStringUtil.replaceAll(ms, "\r", "");
                data.set(col + "," + row, ms);
                col++;
                ms = "";
                continue;
            }
            if (n == value.length - 1) {
                if (ms.charAt(ms.length - 1) == "\r")
                    ms = CStringUtil.replaceAll(ms, "\r", "");
                data.set(col + "," + row, ms);
            }
        }
        return data;
    }
    static sha256(text) {
        return new Promise(function (rs) {
            const encoder = new TextEncoder();
            const dataBuffer = encoder.encode(text);
            crypto.subtle.digest('SHA-256', dataBuffer).then(hashBuffer => {
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
                rs(hashHex);
            });
        });
    }
}
class CDatetime extends Date {
    get year() {
        return this.getFullYear();
    }
    get month() {
        return this.getMonth() + 1;
    }
    get day() {
        return this.getDate();
    }
    get dayOfWeek() {
        return this.getDay();
    }
    get yearS() {
        return this.getFullYear() + "";
    }
    get monthS() {
        let mm = (this.getMonth() + 1) + "";
        if (mm.length == 1)
            mm = "0" + mm;
        return mm;
    }
    get dayS() {
        let d = this.getDate() + "";
        if (d.length == 1)
            d = "0" + d;
        return d;
    }
    toString(isSimpleFormat = false) {
        return CDatetime.toTimeString(this, isSimpleFormat);
    }
    getFirstDayDate(date) {
        if (date != undefined) {
            return new CDatetime(date.year, date.month - 1);
        }
        else {
            return new CDatetime(this.year, this.month - 1);
        }
    }
    getLastDayDate(date) {
        if (date != undefined) {
            return new CDatetime(date.year, date.month - 1, CDatetime.getLastDay(date.year, date.month));
        }
        else {
            return new CDatetime(this.year, this.month - 1, CDatetime.getLastDay(this.year, this.month));
        }
    }
    getLastDay() {
        return CDatetime.getLastDay(this.getFullYear(), this.getMonth() + 1);
    }
    addSecond(sec) {
        this.setSeconds(this.getSeconds() + sec);
    }
    addMinute(min) {
        this.setMinutes(this.getMinutes() + min);
    }
    addHour(hour) {
        this.setHours(this.getHours() + hour);
    }
    addDay(day) {
        this.setDate(this.getDate() + day);
    }
    addMonth(mon) {
        this.setMonth(this.getMonth() + mon);
    }
    addYear(year) {
        this.setFullYear(this.getFullYear() + year);
    }
    static isLeapYear(yyyy) {
        return (yyyy % 4 == 0 && yyyy % 100 != 0) || yyyy % 400 == 0;
    }
    static isValidMonth(mm) {
        return mm >= 1 && mm <= 12;
    }
    static isValidDay(yyyy, mm, dd) {
        if (!this.isValidMonth(mm))
            return false;
        let end = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
        if ((yyyy % 4 == 0 && yyyy % 100 != 0) || yyyy % 400 == 0) {
            end[1] = 29;
        }
        return dd >= 1 && dd <= end[mm - 1];
    }
    static getLastDay(yyyy, mm) {
        let end = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
        if ((yyyy % 4 == 0 && yyyy % 100 != 0) || yyyy % 400 == 0) {
            end[1] = 29;
        }
        return end[mm - 1];
    }
    static toTimeString(date, isSimpleFormat = false, isDelMillisec = false) {
        let year = date.getFullYear() + "";
        let month = date.getMonth() + 1 + "";
        let day = date.getDate() + "";
        let hour = date.getHours() + "";
        let min = date.getMinutes() + "";
        let sec = date.getSeconds() + "";
        let msec = date.getMilliseconds() + "";
        if (("" + month).length == 1) {
            month = "0" + month;
        }
        if (("" + day).length == 1) {
            day = "0" + day;
        }
        if (("" + hour).length == 1) {
            hour = "0" + hour;
        }
        if (("" + min).length == 1) {
            min = "0" + min;
        }
        if (("" + sec).length == 1) {
            sec = "0" + sec;
        }
        if (("" + msec).length == 1) {
            msec = "00" + msec;
        }
        if (("" + msec).length == 2) {
            msec = "0" + msec;
        }
        if (isSimpleFormat) {
            return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec + "." + msec;
        }
        else {
            return year + "" + month + "" + day + "" + hour + "" + min + "" + sec + "" + msec;
        }
    }
    static getCurrentTime() {
        return this.toTimeString(new Date());
    }
    static getNowYear() {
        return this.getCurrentTime().substr(0, 4);
    }
    static getNowMonth() {
        return this.getCurrentTime().substr(4, 2);
    }
    static getNowDay() {
        return this.getCurrentTime().substr(6, 2);
    }
    static getNowHour() {
        return this.getCurrentTime().substr(8, 2);
    }
    static getNowMinute() {
        return this.getCurrentTime().substr(10, 2);
    }
    static getNowSecond() {
        return this.getCurrentTime().substr(12, 2);
    }
    static getDayOfWeek(date) {
        return date.getDay();
    }
    static dateToYYYYMMDD(date, isSimpleFormat = false) {
        let year = date.getFullYear() + "";
        let month = date.getMonth() + 1 + "";
        let day = date.getDate() + "";
        if (("" + month).length == 1) {
            month = "0" + month;
        }
        if (("" + day).length == 1) {
            day = "0" + day;
        }
        if (isSimpleFormat) {
            return year + "-" + month + "-" + day;
        }
        else {
            return year + "" + month + "" + day;
        }
    }
    static getYYYYMMDD(isSimpleFormat = false) {
        let dt = new Date();
        let year = dt.getFullYear() + "";
        let month = dt.getMonth() + 1 + "";
        let day = dt.getDate() + "";
        if (("" + month).length == 1) {
            month = "0" + month;
        }
        if (("" + day).length == 1) {
            day = "0" + day;
        }
        if (isSimpleFormat) {
            return year + "-" + month + "-" + day;
        }
        else {
            return year + "" + month + "" + day;
        }
    }
    static getYYYYMMDDHHMMSS(isSimpleFormat = false) {
        let dt = new Date();
        let year = dt.getFullYear() + "";
        let month = dt.getMonth() + 1 + "";
        let day = dt.getDate() + "";
        let hour = dt.getHours() + "";
        let min = dt.getMinutes() + "";
        let sec = dt.getSeconds() + "";
        if (("" + month).length == 1) {
            month = "0" + month;
        }
        if (("" + day).length == 1) {
            day = "0" + day;
        }
        if (("" + hour).length == 1) {
            hour = "0" + hour;
        }
        if (("" + min).length == 1) {
            min = "0" + min;
        }
        if (("" + sec).length == 1) {
            sec = "0" + sec;
        }
        if (isSimpleFormat) {
            return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;
        }
        else {
            return year + "" + month + "" + day + "" + hour + "" + min + "" + sec;
        }
    }
}
class CHSLA {
    constructor(h, s, l, a = 1) {
        this.h = h;
        this.s = s;
        this.l = l;
        this.a = a;
    }
    toColor() {
        return "hsla(" + this.h + "," + CCalc.cr(100, 0, 1, this.s, 2) + "%," + CCalc.cr(100, 0, 1, this.l, 2) + "%," + this.a + ")";
    }
}
class CRGBA {
    constructor(r, g, b, a = 1) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    toColor() {
        return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
    }
    static getColor(r, g, b, a = 1) {
        let aa = new CRGBA(r, g, b, a);
        return aa.toColor();
    }
}
class CColor {
    constructor(color) {
        this.r = 0;
        this.g = 0;
        this.b = 0;
        this.a = 0;
        //#칼라
        if (color.indexOf("#") != -1) {
            color = color.replace(/^\s*#|\s*$/g, '');
            if (color.length == 3) {
                color = color.replace(/(.)/g, '$1$1');
            }
            this.r = parseInt(color.substr(0, 2), 16),
                this.g = parseInt(color.substr(2, 2), 16),
                this.b = parseInt(color.substr(4, 2), 16),
                this.a = 1;
            //#rgba
        }
        else if (color.indexOf("rgb") != -1) {
            if (color.indexOf("a") != -1) {
                color = color.replace(" ", "").replace("rgba(", "").replace(")", "");
                let arr = color.split(",");
                this.r = parseInt(arr[0]);
                this.g = parseInt(arr[1]);
                this.b = parseInt(arr[2]);
                this.a = parseFloat(arr[3]);
            }
            else {
                color = color.replace(" ", "").replace("rgb(", "").replace(")", "");
                let arr = color.split(",");
                this.r = parseInt(arr[0]);
                this.g = parseInt(arr[1]);
                this.b = parseInt(arr[2]);
                this.a = 1;
            }
        }
        else if (color.indexOf("hsl") != -1) {
            if (color.indexOf("a") != -1) {
                color = color.replace(" ", "").replace("hsla(", "").replace(")", "");
                let arr = color.split(",");
                let hsla = new CHSLA(parseFloat(arr[0]), CCalc.cr(1, 0, 100, parseFloat(arr[1].replace("%", "")), 2), CCalc.cr(1, 0, 100, parseFloat(arr[2].replace("%", "")), 2), parseFloat(arr[3]));
                let rgba = CColor.hslToRGB(hsla);
                this.r = rgba.r;
                this.g = rgba.g;
                this.b = rgba.b;
                this.a = rgba.a;
            }
            else {
                color = color.replace(" ", "").replace("hsl(", "").replace(")", "");
                let arr = color.split(",");
                let hsla = new CHSLA(parseFloat(arr[0]), CCalc.cr(1, 0, 100, parseFloat(arr[1].replace("%", "")), 2), CCalc.cr(1, 0, 100, parseFloat(arr[2].replace("%", "")), 2));
                let rgba = CColor.hslToRGB(hsla);
                this.r = rgba.r;
                this.g = rgba.g;
                this.b = rgba.b;
                this.a = 1;
            }
        }
        else {
            this.r = 255;
            this.g = 255;
            this.b = 255;
            this.a = 1;
        }
    }
    toColor() {
        return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
    }
    toHSLAColor() {
        return CColor.rgbToHSL(new CRGBA(this.r, this.g, this.b, this.a)).toColor();
    }
    toHSLA() {
        return CColor.rgbToHSL(new CRGBA(this.r, this.g, this.b, this.a));
    }
    toRGBA() {
        return new CRGBA(this.r, this.g, this.b, this.a);
    }
    toUint8Array() {
        let re = new Uint8Array(4);
        re[0] = this.r;
        re[1] = this.g;
        re[2] = this.b;
        re[3] = Math.round(CCalc.cr(1, this.a, 255, 0, 4));
        return re;
    }
    fromUint8Array(buffer) {
        this.r = buffer[0];
        this.g = buffer[1];
        this.b = buffer[2];
        this.a = CCalc.cr(1, 0, 255, buffer[3], 2);
    }
    static changeHue(rgb, degree) {
        let col = new CColor(rgb);
        let hsl = this.rgbToHSL(new CRGBA(col.r, col.g, col.b, col.a));
        hsl.h += degree;
        if (hsl.h > 360) {
            hsl.h -= 360;
        }
        else if (hsl.h < 0) {
            hsl.h += 360;
        }
        return this.hslToRGB(hsl).toColor();
    }
    static rgbToHSL(rgb) {
        let r = rgb.r / 255, g = rgb.g / 255, b = rgb.b / 255, a = rgb.a, cMax = Math.max(r, g, b), cMin = Math.min(r, g, b), delta = cMax - cMin, l = (cMax + cMin) / 2, h = 0, s = 0;
        if (delta == 0) {
            h = 0;
        }
        else if (cMax == r) {
            h = 60 * (((g - b) / delta) % 6);
        }
        else if (cMax == g) {
            h = 60 * (((b - r) / delta) + 2);
        }
        else {
            h = 60 * (((r - g) / delta) + 4);
        }
        if (h < 0)
            h = 360 + h;
        if (delta == 0) {
            s = 0;
        }
        else {
            s = (delta / (1 - Math.abs(2 * l - 1)));
        }
        return new CHSLA(h, s, l, a);
    }
    static hslToRGB(hsl) {
        var h = hsl.h, s = hsl.s, l = hsl.l, a = hsl.a, c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = l - c / 2, r, g, b;
        if (h < 60) {
            r = c;
            g = x;
            b = 0;
        }
        else if (h < 120) {
            r = x;
            g = c;
            b = 0;
        }
        else if (h < 180) {
            r = 0;
            g = c;
            b = x;
        }
        else if (h < 240) {
            r = 0;
            g = x;
            b = c;
        }
        else if (h < 300) {
            r = x;
            g = 0;
            b = c;
        }
        else {
            r = c;
            g = 0;
            b = x;
        }
        r = this.normalize_rgb_value(r, m);
        g = this.normalize_rgb_value(g, m);
        b = this.normalize_rgb_value(b, m);
        return new CRGBA(r, g, b, a);
    }
    static normalize_rgb_value(color, m) {
        color = Math.floor((color + m) * 255);
        if (color < 0) {
            color = 0;
        }
        return color;
    }
    static rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    static randomColor(min = 0, max = 255) {
        return "rgba(" + CCalc.getRandom(min, max) + "," + CCalc.getRandom(min, max) + "," + CCalc.getRandom(min, max) + ",1)";
    }
}
class CSequence {
    static getSequence(prefix = "") {
        let rt = "";
        let n = CSequence._map.get(prefix);
        if (n == undefined) {
            CSequence._map.set(prefix, 1);
            rt = prefix + "1";
        }
        else {
            n++;
            CSequence._map.set(prefix, n);
            rt = prefix + n;
        }
        return rt;
    }
}
CSequence._map = new Map();
class CCalc {
    static cr(i1, i2, i3, i4, iVar) {
        let re = 0;
        switch (iVar) {
            case 1:
                if (i4 == 0)
                    throw new Error("zero devide");
                re = i2 * i3 / i4;
                break;
            case 2:
                if (i3 == 0)
                    throw new Error("zero devide");
                re = i1 * i4 / i3;
                break;
            case 3:
                if (i2 == 0)
                    throw new Error("zero devide");
                re = i1 * i4 / i2;
                break;
            case 4:
                if (i1 == 0)
                    throw new Error("zero devide");
                re = i2 * i3 / i1;
                break;
        }
        return re;
    }
    static min(i1, i2) {
        if (i1 < i2) {
            return i1;
        }
        else {
            return i2;
        }
    }
    static max(i1, i2) {
        if (i1 > i2) {
            return i1;
        }
        else {
            return i2;
        }
    }
    static minMax(i1, i2) {
        if (i1 < i2) {
            return { min: i1, max: i2 };
        }
        else {
            return { min: i2, max: i1 };
        }
    }
    static minMaxPoint(point1, point2) {
        let x = CCalc.minMax(point1.x, point2.x);
        let y = CCalc.minMax(point1.y, point2.y);
        return { min: new CPoint(x.min, y.min), max: new CPoint(x.max, y.max) };
    }
    static crRange2Value(range1Start, range1End, range1Value, range2Start, range2End) {
        let ratio = (range1Value - range1Start) / (range1End - range1Start);
        return ((range2End - range2Start) * ratio) + range2Start;
    }
    static getNowValue(startValue, stopValue, t) {
        return ((stopValue - startValue) * t) + startValue;
    }
    static getRandom(min, max) {
        return ((max - min) * Math.random()) + min;
    }
    static sind(angle) {
        let r = angle * (Math.PI / 180);
        return Math.sin(r);
    }
    static sindy(angle, radius) {
        return this.sind(angle) * radius;
    }
    static cosd(angle) {
        let r = angle * (Math.PI / 180);
        return Math.cos(r);
    }
    static cosdx(angle, radius) {
        return this.cosd(angle) * radius;
    }
    static isIn(value, values) {
        let b = false;
        for (let n = 0; n < values.length; n++) {
            if (value == values[n]) {
                b = true;
                break;
            }
        }
        return b;
    }
}
class CByte {
    static numberToUint8Array(value) {
        let bf = new Uint8Array(8);
        let view = new DataView(bf.buffer, 0);
        view.setFloat64(0, value);
        return bf;
    }
    static Uint8ArrayToNumber(buffer) {
        let view = new DataView(buffer.buffer, 0);
        return view.getFloat64(0);
    }
    static stringToUint8ArrayWithLength(value) {
        let bfStr = new TextEncoder().encode(value);
        let bf = new Uint8Array(8);
        let buffer = new Uint8Array(bfStr.length + bf.length);
        let view = new DataView(buffer.buffer, 0);
        view.setFloat64(0, bfStr.length);
        for (let n = 0; n < bfStr.length; n++) {
            buffer[n + 8] = bfStr[n];
        }
        return buffer;
    }
    static Uint8ArrayToStringWithLength(buffer) {
        let view = new DataView(buffer.buffer);
        let cnt = view.getFloat64(0);
        let bf = new Uint8Array(cnt);
        for (let n = 0; n < cnt; n++) {
            bf[n] = buffer[n + 8];
        }
        return new TextDecoder("utf-8").decode(bf);
    }
    static stringToUint8Array(value) {
        return new TextEncoder().encode(value);
    }
    static Uint8ArrayToString(buffer) {
        return new TextDecoder("utf-8").decode(buffer);
    }
    static booleanToUint8Array(value) {
        let bf = new Uint8Array(1);
        if (value) {
            bf[0] = 1;
        }
        else {
            bf[0] = 0;
        }
        return bf;
    }
    static Uint8ArrayToBoolean(buffer) {
        if (buffer[0] == 1) {
            return true;
        }
        else {
            return false;
        }
    }
    static colorToUint8Array(value) {
        let c = new CColor(value);
        let bf = c.toUint8Array();
        return bf;
    }
    static Uint8ArrayToColor(buffer) {
        let c = new CColor("#000000");
        c.fromUint8Array(buffer);
        return c.toColor();
    }
    static UintToUint8Array(value) {
        let s = value.toString(16);
        if (s.length % 2 == 1)
            s = CStringUtil.lpad(s, "0", s.length + 1);
        let bf = new Uint8Array(s.length / 2);
        let idx = 0;
        for (let n = 0; n < s.length; n++) {
            if (n % 2 == 0) {
                bf[idx] = parseInt(s.substr(n, 2), 16);
                idx++;
            }
        }
        return bf;
    }
    static Uint8ArrayToUint(buffer) {
        let s = "";
        for (let n = 0; n < buffer.length; n++) {
            s += CStringUtil.lpad(buffer[n].toString(16), "0", 2);
        }
        return parseInt(s, 16);
    }
    static bufferCopy(src, start, count) {
        let bf = new Uint8Array(count);
        for (let n = 0; n < count; n++) {
            bf[n] = src[n + start];
        }
        return bf;
    }
    static booleansToNumber(values) {
        let re = 0;
        let str = "";
        for (let n = 0; n < values.length; n++) {
            if (values[n]) {
                str += "1";
            }
            else {
                str += "0";
            }
        }
        str = "1" + str;
        re = parseInt(str, 2);
        return re;
    }
    static numberToBooleans(value) {
        let str = value.toString(2);
        let re = [];
        for (let n = 1; n < str.length; n++) {
            if (str[n] == "1") {
                re[n - 1] = true;
            }
            else {
                re[n - 1] = false;
            }
        }
        return re;
    }
    static number4bitToNumber(values) {
        let re = 0;
        let str = "";
        for (let n = 0; n < values.length; n++) {
            let v = values[n];
            if (v > 15)
                v = v % 16;
            str += v.toString(16);
        }
        str = "1" + str;
        re = parseInt(str, 16);
        return re;
    }
    static numberTo4bitNumbers(value) {
        let str = value.toString(16);
        let re = [];
        for (let n = 1; n < str.length; n++) {
            re[n - 1] = parseInt(str[n], 16);
        }
        return re;
    }
    static number1byteToNumber(values) {
        let bf = new Uint8Array(8);
        for (let n = 0; n < 8; n++) {
            let v = values[n];
            if (v > 255)
                v = v % 256;
            bf[n] = v;
        }
        return this.Uint8ArrayToNumber(bf);
    }
    static numberTo1byteNumbers(value) {
        let bf = this.numberToUint8Array(value);
        let re = [];
        for (let n = 0; n < bf.length; n++) {
            re[n] = bf[n];
        }
        return re;
    }
    static bufferToHexString(buffer) {
        let s = "";
        for (let n = 0; n < buffer.length; n++) {
            s += CStringUtil.lpad(buffer[n].toString(16), "0", 2);
        }
        return s;
    }
    static hexStringToBuffer(hex) {
        let bf = new Uint8Array(hex.length / 2);
        let idx = 0;
        for (let n = 0; n < hex.length; n++) {
            if (n % 2 == 0) {
                bf[idx] = parseInt(hex.substr(n, 2), 16);
                idx++;
            }
        }
        return bf;
    }
    static bufferToBase64(buffer) {
        var len = buffer.byteLength;
        let s = "";
        for (var i = 0; i < len; i++) {
            s += String.fromCharCode(buffer[i]);
        }
        return btoa(s);
    }
    static base64ToBuffer(str) {
        let byteString = atob(str);
        let ab = new ArrayBuffer(byteString.length);
        let bf = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            bf[i] = byteString.charCodeAt(i);
        }
        return bf;
    }
}
class CStream {
    constructor() {
        this._data = new Array();
        this._position = 0;
    }
    get data() {
        return this._data;
    }
    set data(value) {
        this._data = value;
    }
    get position() {
        return this._position;
    }
    set position(value) {
        this._position = value;
    }
    get size() {
        let re = 0;
        for (let n = 0; n < this._data.length; n++) {
            re += this._data[n].length;
        }
        return re;
    }
    get buffer() {
        if (this._buffer == undefined || this._buffer.length != this.size) {
            this._buffer = new Uint8Array(this.size);
            let ps = 0;
            for (let n = 0; n < this._data.length; n++) {
                for (let i = 0; i < this._data[n].length; i++) {
                    this._buffer[ps] = this._data[n][i];
                    ps++;
                }
            }
        }
        return this._buffer;
    }
    putNumber(value) {
        let bf = new Uint8Array(8);
        let view = new DataView(bf.buffer, 0);
        view.setFloat64(0, value);
        this._data.push(bf);
    }
    putDate(value) {
        this.putNumber(value.getTime());
    }
    putString(value) {
        let bfStr = new TextEncoder().encode(value);
        this.putNumber(bfStr.length);
        this._data.push(bfStr);
    }
    putBoolean(value) {
        let bf = new Uint8Array(1);
        if (value) {
            bf[0] = 0x01;
        }
        else {
            bf[0] = 0x00;
        }
        this._data.push(bf);
    }
    putStream(value) {
        this.putNumber(value.size);
        let bfStream = new Uint8Array(value.size);
        let orgPs = value.position;
        value.first();
        for (let n = 0; n < value.size; n++) {
            bfStream[n] = value.buffer[n];
        }
        value.position = orgPs;
        this._data.push(bfStream);
    }
    first() {
        this._position = 0;
    }
    getNumber() {
        let re = 0;
        let view = new DataView(this.buffer.buffer);
        re = view.getFloat64(this._position);
        this._position += 8;
        return re;
    }
    getDate() {
        return new Date(this.getNumber());
    }
    getString() {
        let cnt = this.getNumber();
        let bf = new Uint8Array(cnt);
        for (let n = 0; n < cnt; n++) {
            bf[n] = this.buffer[this._position];
            this._position++;
        }
        return new TextDecoder("utf-8").decode(bf);
    }
    getBoolean() {
        let b = this.buffer[this._position] == 1;
        this._position++;
        return b;
    }
    getStream() {
        let cnt = this.getNumber();
        let bf = new Uint8Array(cnt);
        for (let n = 0; n < cnt; n++) {
            bf[n] = this.buffer[this._position];
            this._position++;
        }
        let re = new CStream();
        re.fromBuffer(bf);
        return re;
    }
    fromBuffer(buffer) {
        this.data = [];
        let bf = new Uint8Array(buffer.length);
        for (let n = 0; n < buffer.length; n++) {
            bf[n] = buffer[n];
        }
        this.data.push(bf);
    }
    fromArrayBuffer(buffer) {
        this.data = [];
        let bf = new Uint8Array(buffer.byteLength);
        for (let n = 0; n < buffer.byteLength; n++) {
            let view = new DataView(buffer);
            bf[n] = view.getUint8(n);
        }
        this.data.push(bf);
    }
    toBlob() {
        return new Blob([this.buffer]);
    }
    async fromBlob(data) {
        this.fromArrayBuffer(await data.arrayBuffer());
    }
    copyFrom(stream) {
        this.fromBuffer(stream.buffer);
    }
    toBase64() {
        return CByte.bufferToBase64(this.buffer);
    }
    toHexString() {
        return CByte.bufferToHexString(this.buffer);
    }
    fromBase64(base64) {
        this._data = [];
        this._position = 0;
        let bf = CByte.base64ToBuffer(base64);
        this._data.push(bf);
    }
    saveAsLocalFile(filename) {
        CSystem.saveBlobAsFile(this.toBlob(), filename);
    }
    loadFromLocalFile(fn) {
        let self = this;
        CSystem.loadFromFile(function (f) {
            f.arrayBuffer().then(function (v) {
                self.fromArrayBuffer(v);
                fn(self);
            });
        });
    }
}
class CQueue {
    constructor(limitConut = -1) {
        this._idx = -1;
        this._position = -1;
        this._data = new Map();
        this._limitCount = -1;
        this._limitCount = limitConut;
    }
    get limitCount() {
        return this._limitCount;
    }
    set limitCount(value) {
        this._limitCount = value;
        if (value != -1) {
            let cnt = value - this._data.size;
            for (let n = 0; n < cnt; n++) {
                this.pop();
            }
        }
    }
    get count() {
        return this._data.size;
    }
    doToData(data) {
        data = [];
    }
    push(value) {
        this._idx++;
        this._data.set(this._idx, value);
        if (this._limitCount != -1 && this._data.size > this._limitCount)
            this.pop();
        return this._idx;
    }
    pop() {
        if (this._data.size == 0)
            throw new Error("empry data");
        this._position++;
        let rt = this._data.get(this._position);
        this._data.delete(this._position);
        if (rt != undefined) {
            return rt;
        }
        else {
            throw new Error("pop is undefined");
        }
    }
    view(index) {
        let rt = this._data.get(this._position + index + 1);
        if (rt != undefined) {
            return rt;
        }
        else {
            throw new Error("pop is undefined");
        }
    }
    loopView(proc) {
        for (let n = 0; n < this.count; n++) {
            proc(this.view(n));
        }
    }
    clear() {
        this._data.clear();
        this._idx = -1;
        this._position = -1;
    }
}
class CEnum {
    static toArray(e) {
        let arr = Object.keys(e);
        let rt = new Array();
        for (let n = 0; n < arr.length; n++) {
            let v = parseInt(arr[n]);
            if (isNaN(v)) {
                rt.push(arr[n]);
            }
        }
        return rt;
    }
}
class CClass {
    get className() {
        return this.constructor.name;
    }
    is(compare) {
        return this instanceof compare;
    }
    as() {
        return this;
    }
    getProperty(propertyName) {
        let f = new Function("obj", "return obj." + propertyName);
        return f(this);
    }
    setProperty(propertyName, value) {
        if (typeof this.getProperty(propertyName) == "string") {
            let fn = new Function("obj", "obj." + propertyName + " = `" + value + "`");
            fn(this, value);
        }
        else {
            let fn = new Function("obj", "obj." + propertyName + " = " + value);
            fn(this, value);
        }
    }
    instanceOf(className) {
        let f = new Function("obj", "return obj instanceof " + className);
        return f(this);
    }
    addProperties() {
        let arr = new Array();
        arr.push({ instance: this.className, propertyName: "className", readOnly: true, enum: [] });
        return arr;
    }
    static hasFunction(dst, functionName) {
        return dst[functionName] != undefined && dst[functionName] instanceof Function;
    }
    static objectUndefined(obj, propertyName) {
        obj[propertyName] = undefined;
    }
    static createClass(className, constructArgs, fnProc) {
        let s = "";
        for (let n = 0; n < constructArgs.length; n++) {
            if (n == 0) {
                s += constructArgs[n];
            }
            else {
                s += "," + constructArgs[n];
            }
        }
        let fn = new Function(...constructArgs, "return new " + className + "(" + s + ");");
        return fnProc(fn);
    }
    static instanceOf(instance, className) {
        let f = new Function("obj", "return obj instanceof " + className);
        return f(instance);
    }
    static async getClassHash(className) {
        return await CStringUtil.sha256(new Function("return " + className + ".toString()")());
    }
}
class CDataClass extends CClass {
    doToData(data) { }
    doFromData(data) { }
    doRemove() {
        if (this.onRemove != undefined) {
            this.onRemove(this);
        }
    }
    toData() {
        let o = {};
        this.doToData(o);
        return o;
    }
    fromData(data) {
        this.doFromData(data);
    }
    equal(src) {
        return JSON.stringify(this.toData()) == JSON.stringify(src.toData());
    }
    copyFrom(src) {
        this.fromData(src.toData());
    }
    remove() {
        this.doRemove();
    }
    static putData(obj, propertyName, value, defaultValue = undefined, checkJsonValue = false) {
        if (checkJsonValue) {
            if (JSON.stringify(value) != JSON.stringify(defaultValue)) {
                obj[propertyName] = value;
            }
        }
        else {
            if (value != defaultValue) {
                obj[propertyName] = value;
            }
        }
    }
    static getData(obj, propertyName, defaultValue = undefined, checkJsonValue = false) {
        if (obj[propertyName] != undefined) {
            if (checkJsonValue) {
                if (JSON.stringify(obj[propertyName]) != JSON.stringify(defaultValue)) {
                    return obj[propertyName];
                }
                else {
                    return defaultValue;
                }
            }
            else {
                if (obj[propertyName] != defaultValue) {
                    return obj[propertyName];
                }
                else {
                    return defaultValue;
                }
            }
        }
        else {
            return defaultValue;
        }
    }
}
class CResourceClass extends CDataClass {
    constructor() {
        super(...arguments);
        this.__resource = "";
        this._resource = "";
    }
    get resource() {
        return this._resource;
    }
    set resource(value) {
        //if(value != "") console.log(value)
        if (this._resource != value) {
            this._resource = value;
            if (value != "") {
                this.__resource = value;
                if (CSystem.resourcesLoad) {
                    this.doResource();
                }
                else {
                    CSystem.requestResources.push(this);
                }
            }
        }
    }
    get lastResourceName() {
        return this.__resource;
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "resource", this._resource, "");
    }
    doFromData(data) {
        super.doFromData(data);
        this.resource = CDataClass.getData(data, "resource", "");
    }
    doResource() {
        let data = CSystem.resources.get(this._resource);
        if (data != undefined) {
            this.fromData(data);
            if (this.onResource != undefined) {
                this.onResource(this);
            }
        }
    }
}
class CNotifyChangeObject extends CResourceClass {
    constructor() {
        super(...arguments);
        this._useChangeEvent = true;
    }
    get useChangeEvent() {
        return this._useChangeEvent;
    }
    set useChangeEvent(value) {
        this._useChangeEvent = value;
    }
}
class CNotifyChangeNotifyObject extends CNotifyChangeObject {
    doChange() {
        if (this.onChange != undefined && this.useChangeEvent)
            this.onChange(this);
    }
}
class CNotifyChangeKindObject extends CNotifyChangeObject {
    doChange(kind) {
        if (this.onChange != undefined && this.useChangeEvent)
            this.onChange(this, kind);
    }
}
class ArrayString extends Array {
}
class ArrayNumber extends Array {
}
class CList extends CNotifyChangeKindObject {
    constructor() {
        super(...arguments);
        this.__data = new Array();
    }
    static get CON_CHANGE_ADD() { return "a"; }
    static get CON_CHANGE_INSERT() { return "i"; }
    static get CON_CHANGE_DELETE() { return "d"; }
    static get CON_CHANGE_SET() { return "s"; }
    get length() {
        return this.__data.length;
    }
    set length(value) {
        this.__data.length = value;
    }
    get array() {
        let arr = new Array();
        for (let n = 0; n < this.__data.length; n++) {
            arr.push(this.get(n));
        }
        return arr;
    }
    doRemove() {
        this.__data = [];
        super.doRemove();
    }
    add(item) {
        this.__data.push(item);
        this.doChange(CList.CON_CHANGE_ADD);
    }
    insert(index, item) {
        this.__data.splice(index, 0, item);
        this.doChange(CList.CON_CHANGE_INSERT);
    }
    delete(index, count = 1) {
        let rt = this.__data.length > index && index >= 0;
        this.__data.splice(index, count);
        this.doChange(CList.CON_CHANGE_DELETE);
        return rt;
    }
    get(index) {
        return this.__data[index];
    }
    set(index, item) {
        this.__data[index] = item;
        this.doChange(CList.CON_CHANGE_SET);
    }
    deleteAll() {
        for (let n = this.__data.length - 1; n >= 0; n--) {
            this.delete(n);
        }
    }
    clear() {
        this.__data = [];
        this.doChange(CList.CON_CHANGE_DELETE);
    }
    sort(compareFn) {
        return this.__data.sort(compareFn);
    }
    swap(index1, index2) {
        if (index1 < 0 || index1 > this.length - 1)
            throw new Error("invalid index1");
        if (index2 < 0 || index2 > this.length - 1)
            throw new Error("invalid index2");
        let tmp = this.get(index2);
        this.set(index2, this.get(index1));
        this.set(index1, tmp);
    }
    toData() {
        let o = [];
        this.doToData(o);
        return o;
    }
    addProperties() {
        let arr = super.addProperties();
        for (let n = 0; n < this.length; n++) {
            arr.push({ instance: this.get(n), propertyName: "__data[" + n + "]", readOnly: false, enum: [] });
        }
        return arr;
    }
}
class CStringList extends CList {
    doToData(data) {
        super.doToData(data);
        for (let n = 0; n < this.length; n++) {
            data.push(this.get(n));
        }
    }
    doFromData(data) {
        super.doFromData(data);
        this.clear();
        for (let n = 0; n < data.length; n++) {
            this.add(data[n]);
        }
    }
}
class CNumberList extends CList {
    doToData(data) {
        super.doToData(data);
        for (let n = 0; n < this.length; n++) {
            data.push(this.get(n));
        }
    }
    doFromData(data) {
        super.doFromData(data);
        this.clear();
        for (let n = 0; n < data.length; n++) {
            this.add(data[n]);
        }
    }
}
class CMap extends CNotifyChangeObject {
    constructor() {
        super(...arguments);
        this.__data = new Map();
    }
    static get CON_CHANGE_SET() { return "s"; }
    static get CON_CHANGE_DELETE() { return "d"; }
    static get CON_CHANGE_CLEAR() { return "c"; }
    get size() {
        return this.__data.size;
    }
    doRemove() {
        this.__data.clear();
        super.doRemove();
    }
    doChange(kind, key, value) {
        if (this.onChange != undefined) {
            this.onChange(this, kind, key, value);
        }
    }
    set(key, value) {
        let rt = this.__data.set(key, value);
        this.doChange(CMap.CON_CHANGE_SET, key, value);
        return rt;
    }
    get(key) {
        return this.__data.get(key);
    }
    delete(key) {
        let b = this.__data.delete(key);
        this.doChange(CMap.CON_CHANGE_DELETE, key);
        return b;
    }
    clear() {
        this.__data.clear();
        this.doChange(CMap.CON_CHANGE_CLEAR);
    }
    keys() {
        let rt = this.__data.keys();
        return rt;
    }
    values() {
        let rt = this.__data.values();
        return rt;
    }
    forEach(callbackfn) {
        this.__data.forEach(callbackfn);
    }
    has(key) {
        return this.__data.has(key);
    }
    toArray() {
        let rt = new Array();
        this.__data.forEach(function (value, key) {
            let item = { key: key, value: value };
            rt.push(item);
        });
        return rt;
    }
    toData() {
        let o = [];
        this.doToData(o);
        return o;
    }
}
class CNNMap extends CMap {
    doToData(data) {
        super.doToData(data);
        this.forEach(function (v, k) {
            data.push({ key: k, value: v });
        });
    }
    doFromData(data) {
        super.doFromData(data);
        this.clear();
        for (let n = 0; n < data.length; n++) {
            this.set(data[n].key, data[n].value);
        }
    }
}
class CSSMap extends CMap {
    doToData(data) {
        super.doToData(data);
        this.forEach(function (v, k) {
            data.push({ key: k, value: v });
        });
    }
    doFromData(data) {
        super.doFromData(data);
        this.clear();
        for (let n = 0; n < data.length; n++) {
            this.set(data[n].key, data[n].value);
        }
    }
}
class CSet extends CNotifyChangeKindObject {
    constructor() {
        super(...arguments);
        this.__data = new Set();
    }
    static get CON_CHANGE_ADD() { return "a"; }
    static get CON_CHANGE_DELETE() { return "d"; }
    static get CON_CHANGE_CLEAR() { return "c"; }
    get size() {
        return this.__data.size;
    }
    doRemove() {
        this.__data.clear();
        super.doRemove();
    }
    add(value) {
        let rt = this.__data.add(value);
        this.doChange(CSet.CON_CHANGE_ADD);
        return rt;
    }
    delete(value) {
        let rt = this.__data.delete(value);
        this.doChange(CSet.CON_CHANGE_DELETE);
        return rt;
    }
    clear() {
        this.__data.clear();
        this.doChange(CSet.CON_CHANGE_CLEAR);
    }
    has(value) {
        return this.__data.has(value);
    }
    forEach(callbackfn) {
        this.__data.forEach(callbackfn);
    }
    toArray() {
        let rt = new Array();
        this.__data.forEach(function (v) {
            rt.push(v);
        });
        return rt;
    }
    toData() {
        let o = [];
        this.doToData(o);
        return o;
    }
}
class CNotifyQueue extends CNotifyChangeKindObject {
    static get CON_CHANGE_PUSH() { return "p"; }
    static get CON_CHANGE_POP() { return "po"; }
    static get CON_CHANGE_CLEAR() { return "c"; }
    static get CON_CHANGE_LIMIT_COUNT() { return "l"; }
    get limitCount() {
        return this._queue.limitCount;
    }
    set limitCount(value) {
        if (value != this._queue.limitCount) {
            this._queue.limitCount = value;
            this.doChange(CNotifyQueue.CON_CHANGE_LIMIT_COUNT);
        }
    }
    get count() {
        return this._queue.count;
    }
    constructor(limitConut = -1) {
        super();
        this._queue = new CQueue(limitConut);
    }
    doRemove() {
        this._queue.clear();
        super.doRemove();
    }
    push(value) {
        let rt = this._queue.push(value);
        this.doChange(CNotifyQueue.CON_CHANGE_PUSH);
        return rt;
    }
    pop() {
        let rt = this._queue.pop();
        this.doChange(CNotifyQueue.CON_CHANGE_POP);
        return rt;
    }
    view(index) {
        let rt = this._queue.view(index);
        return rt;
    }
    loopView(proc) {
        for (let n = 0; n < this.count; n++) {
            proc(this.view(n));
        }
    }
    clear() {
        this._queue.clear();
        this.doChange(CNotifyQueue.CON_CHANGE_CLEAR);
    }
    toData() {
        let o = [];
        this.doToData(o);
        return o;
    }
}
class CStringSet extends CSet {
    doToData(data) {
        super.doToData(data);
        this.forEach(function (value) {
            data.push(value);
        });
    }
    doFromData(data) {
        super.doFromData(data);
        this.clear();
        for (let n = 0; n < data.length; n++) {
            this.add(data[n]);
        }
    }
}
class CVariable extends CNotifyChangeNotifyObject {
    get type() {
        return typeof this._data;
    }
    get asString() {
        return this._data + "";
    }
    set asString(value) {
        if (value != this._data) {
            this._data = value;
            this.doChange();
        }
    }
    get asNumber() {
        return this._data;
    }
    set asNumber(value) {
        if (value != this._data) {
            this._data = value;
            this.doChange();
        }
    }
    get asBoolean() {
        return this._data;
    }
    set asBoolean(value) {
        if (value != this._data) {
            this._data = value;
            this.doChange();
        }
    }
    get asObject() {
        return this._data;
    }
    set asObject(value) {
        if (value != this._data) {
            this._data = value;
            this.doChange();
        }
    }
    get value() {
        return this._data;
    }
    constructor(value) {
        super();
        if (value != undefined) {
            this._data = value;
        }
    }
    doRemove() {
        this._data = undefined;
        super.doRemove();
    }
    asType() {
        return this._data;
    }
    setType(value) {
        if (value != this._data) {
            this._data = value;
            this.doChange();
        }
    }
}
class CRowData extends CNotifyChangeObject {
    get length() {
        return this._data.length;
    }
    constructor(columnValues) {
        super();
        this._data = new Array();
        let self = this;
        if (columnValues != undefined) {
            for (let n = 0; n < columnValues.length; n++) {
                let v = new CVariable(columnValues[n]);
                v["index"] = n;
                v.onChange = function () {
                    self.doChange(v["index"], v);
                };
                this._data.push(v);
            }
        }
    }
    doToData(data) {
        for (let n = 0; n < this._data.length; n++) {
            if (typeof this._data[n].value == "object") {
                if (this._data[n].value instanceof CDataClass) {
                    data.push(this._data[n].value.toData());
                }
            }
            else {
                data.push(this._data[n].value);
            }
        }
        console.log(data);
    }
    doFromData(data) {
        this._data = [];
        for (let n = 0; n < data.length; n++) {
            let v = new CVariable(data[n]);
            this._data.push(v);
        }
    }
    doRemove() {
        this._data = [];
        super.doRemove();
    }
    doChange(index, column) {
        if (this.useChangeEvent && this.onChange != undefined)
            this.onChange(this, index, column);
    }
    get(index) {
        return this._data[index];
    }
    getValues() {
        let rt = [];
        for (let n = 0; n < this._data.length; n++) {
            rt.push(this._data[n].value);
        }
        return rt;
    }
    toData() {
        let o = [];
        this.doToData(o);
        return o;
    }
}
class CGridData extends CNotifyChangeObject {
    static get CON_CHANGE_ADD() { return "a"; }
    static get CON_CHANGE_INSERT() { return "i"; }
    static get CON_CHANGE_DELETE() { return "d"; }
    static get CON_CHANGE_CLEAR() { return "c"; }
    static get CON_CHANGE_SET() { return "s"; }
    static get CON_CHANGE_DATA() { return "da"; }
    get columnCount() {
        return this._columnCount;
    }
    get data() {
        return this._data;
    }
    get indexes() {
        return this._indexes;
    }
    get length() {
        return this._data.length;
    }
    constructor(columnCount, indexColumnIndexes, uniqueColumnIndexes) {
        super();
        this.__useIndex = false;
        this._data = new CList();
        this._indexes = new CMap();
        let self = this;
        this._columnCount = columnCount;
        this._indexColumns = indexColumnIndexes;
        this._uniqueColumns = uniqueColumnIndexes;
        if (this._uniqueColumns != undefined) {
            for (let n = 0; n < this._uniqueColumns.length; n++) {
                let map = new CMap();
                this._indexes.set(this._uniqueColumns[n], map);
            }
            if (this._uniqueColumns.length > 0)
                this.__useIndex = true;
        }
        if (indexColumnIndexes != undefined) {
            for (let n = 0; n < indexColumnIndexes.length; n++) {
                let map = new CMap();
                this._indexes.set(indexColumnIndexes[n], map);
            }
            if (indexColumnIndexes.length > 0)
                this.__useIndex = true;
        }
        this._data.onChange = function (sender, kind) {
            if (CList.CON_CHANGE_ADD == kind) {
                self.doChange(CGridData.CON_CHANGE_ADD);
            }
            if (CList.CON_CHANGE_INSERT == kind) {
                self.doChange(CGridData.CON_CHANGE_INSERT);
            }
            if (CList.CON_CHANGE_DELETE == kind) {
                self.doChange(CGridData.CON_CHANGE_DELETE);
            }
            if (CList.CON_CHANGE_SET == kind) {
                self.doChange(CGridData.CON_CHANGE_SET);
            }
        };
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "columnCount", this._columnCount);
        let dt = new Array();
        for (let n = 0; n < this._data.length; n++) {
            dt.push(this._data.get(n).toData());
        }
        CDataClass.putData(data, "data", dt, [], true);
        CDataClass.putData(data, "indexColumns", this._indexColumns, undefined);
        CDataClass.putData(data, "uniqueColumns", this._uniqueColumns, undefined);
    }
    doFromData(data) {
        super.doFromData(data);
        this.clear();
        this.indexes.clear();
        this._columnCount = CDataClass.getData(data, "columnCount", 0);
        this._indexColumns = CDataClass.getData(data, "indexColumns", undefined);
        this._uniqueColumns = CDataClass.getData(data, "uniqueColumns", undefined);
        if (this._uniqueColumns != undefined) {
            for (let n = 0; n < this._uniqueColumns.length; n++) {
                let map = new CMap();
                this._indexes.set(this._uniqueColumns[n], map);
            }
            if (this._uniqueColumns.length > 0)
                this.__useIndex = true;
        }
        if (this._indexColumns != undefined) {
            for (let n = 0; n < this._indexColumns.length; n++) {
                let map = new CMap();
                this._indexes.set(this._indexColumns[n], map);
            }
            if (this._indexColumns.length > 0)
                this.__useIndex = true;
        }
        let dt = CDataClass.getData(data, "data", [], true);
        for (let n = 0; n < dt.length; n++) {
            this.add(dt[n]);
        }
    }
    doRemove() {
        this._data.remove();
        this._indexes.remove();
        this._indexColumns = undefined;
        this._uniqueColumns = undefined;
        super.doRemove();
    }
    doChange(kind, column, row) {
        if (this.useChangeEvent && this.onChange != undefined) {
            this.onChange(this, kind, column, row);
        }
    }
    doAdd(value) {
        let self = this;
        if (this._uniqueColumns != undefined && this._uniqueColumns.length > 0) {
            for (let n = 0; n < this._uniqueColumns.length; n++) {
                let arr = this.findIndexRow(this._uniqueColumns[n], value[this._uniqueColumns[n]]);
                if (arr.length > 0)
                    throw new Error("column " + this._uniqueColumns[n] + " is duplicated");
            }
        }
        let row = new CRowData(value);
        row.onChange = function (sender, index, column) {
            self.doChange(CGridData.CON_CHANGE_DATA, column, row);
        };
        if (this.__useIndex)
            this.addIndex(this._data.length, row);
        this._data.add(row);
        if (this.useChangeEvent && this.onAdd != undefined) {
            this.onAdd(this, row);
        }
        return row;
    }
    doInsert(index, value) {
        let self = this;
        if (this._uniqueColumns != undefined && this._uniqueColumns.length > 0) {
            for (let n = 0; n < this._uniqueColumns.length; n++) {
                let arr = this.findIndexRow(this._uniqueColumns[n], value[this._uniqueColumns[n]]);
                if (arr.length > 0)
                    throw new Error("column " + this._uniqueColumns[n] + " is duplicated");
            }
        }
        let row = new CRowData(value);
        row.onChange = function (sender, index, column) {
            self.doChange(CGridData.CON_CHANGE_DATA, column, row);
        };
        if (this.__useIndex)
            this.addIndex(index, row);
        this._data.insert(index, row);
        if (this.useChangeEvent && this.onInsert != undefined) {
            this.onInsert(this, index, row);
        }
        return row;
    }
    doDelete(index) {
        let b = this._data.delete(index);
        if (this.__useIndex && b)
            this.deleteIndex(index);
        if (this.useChangeEvent && this.onDelete != undefined) {
            this.onDelete(this);
        }
    }
    doSet(index, value) {
        let self = this;
        if (this._uniqueColumns != undefined && this._uniqueColumns.length > 0) {
            for (let n = 0; n < this._uniqueColumns.length; n++) {
                let arr = this.findIndexRow(this._uniqueColumns[n], value[this._uniqueColumns[n]]);
                if (arr.length > 0)
                    throw new Error("column " + this._uniqueColumns[n] + " is duplicated");
            }
        }
        let row = new CRowData(value);
        row.onChange = function (sender, index, column) {
            self.doChange(CGridData.CON_CHANGE_DATA, column, row);
        };
        if (this.__useIndex)
            this.setIndex(index, row);
        this._data.set(index, row);
        if (this.useChangeEvent && this.onSet != undefined) {
            this.onSet(this, index, row);
        }
        return row;
    }
    doClear() {
        this._data.clear();
        this._indexes.clear();
        if (this.useChangeEvent && this.onClear != undefined) {
            this.onClear(this);
        }
    }
    addIndex(index, value) {
        this._indexes.forEach(function (map, key) {
            let v = value.get(key);
            let set = map.get(v.value);
            if (set == undefined) {
                set = new Set();
                map.set(v.value, set);
            }
            set.add({ index: index });
        });
    }
    setIndex(index, value) {
        this._indexes.forEach(function (map, key) {
            map.forEach(function (set, key) {
                set.delete({ index: index });
            });
        });
        this.addIndex(index, value);
    }
    deleteIndex(index) {
        this._indexes.forEach(function (map, key) {
            let arr = new Array();
            map.forEach(function (set, key) {
                let v;
                set.forEach(function (value) {
                    if (value.index == index) {
                        v = value;
                    }
                    if (value.index > index) {
                        value.index--;
                    }
                });
                set.delete(v);
                if (set.size == 0) {
                    arr.push(key);
                }
            });
            for (let n = 0; n < arr.length; n++) {
                map.delete(arr[n]);
            }
        });
    }
    add(value) {
        return this.doAdd(value);
    }
    insert(index, value) {
        return this.doInsert(index, value);
    }
    delete(index) {
        if (typeof index == "number") {
            this.doDelete(index);
        }
        else {
            for (let n = 0; n < index.length; n++) {
                this.doDelete(index[n]);
            }
        }
    }
    set(index, value) {
        return this.doSet(index, value);
    }
    deleteAll() {
        for (let n = this.length - 1; n >= 0; n--) {
            this.delete(n);
        }
    }
    clear() {
        this.doClear();
    }
    getRow(index) {
        return this._data.get(index);
    }
    getRowValues(index) {
        let row = this._data.get(index);
        return row.getValues();
    }
    getRowIndex(row) {
        let rt = -1;
        for (let n = 0; this._data.length; n++) {
            if (this._data[n] == row) {
                rt = n;
                break;
            }
        }
        return rt;
    }
    cell(column, row) {
        if (row < this._data.length && column < this._data.get(row).length) {
            return this._data.get(row).get(column);
        }
    }
    setCell(column, row, value) {
        if (row < this._data.length && column < this._data.get(row).length) {
            if (typeof value == "boolean") {
                this._data.get(row).get(column).asBoolean = value;
            }
            if (typeof value == "number") {
                this._data.get(row).get(column).asNumber = value;
            }
            if (typeof value == "string") {
                this._data.get(row).get(column).asString = value;
            }
            if (typeof value == "object") {
                this._data.get(row).get(column).asObject = value;
            }
        }
        else {
            throw new Error("invalid column or row : " + column + "," + row);
        }
    }
    findIndexRow(columnIndex, value) {
        let rt = new Array();
        let map = this._indexes.get(columnIndex);
        if (map != undefined) {
            let set = map.get(value);
            if (set != undefined) {
                set.forEach(function (value) {
                    rt.push(value.index);
                });
            }
        }
        return rt;
    }
    findIndex(columnIndex, value) {
        let arr = new Array();
        let arridx = this.findIndexRow(columnIndex, value);
        for (let n = 0; n < arridx.length; n++) {
            arr.push(this._data.get(arridx[n]));
        }
        return arr;
    }
    sort(compareFn) {
        return this._data.sort(compareFn);
    }
    sortColumn(columnIndex, isAsc = true) {
        if (isAsc) {
            return this.sort(function (a, b) {
                let rt = 0;
                if (a.get(columnIndex).value > b.get(columnIndex).value)
                    rt = 1;
                if (a.get(columnIndex).value < b.get(columnIndex).value)
                    rt = -1;
                return rt;
            });
        }
        else {
            return this.sort(function (a, b) {
                let rt = 0;
                if (a.get(columnIndex).value > b.get(columnIndex).value)
                    rt = -1;
                if (a.get(columnIndex).value < b.get(columnIndex).value)
                    rt = 1;
                return rt;
            });
        }
    }
    loopColumn(columnIndex, callback) {
        for (let n = 0; n < this.length; n++) {
            callback(this.getRow(n).get(columnIndex));
        }
    }
}
class CTableData extends CGridData {
    get columnNames() {
        return this._columnNames;
    }
    get indexColumnNames() {
        return this._indexColumnNames;
    }
    get uniqueColumnNames() {
        return this._uniqueColumnNames;
    }
    constructor(columnNames, indexColumnNames, uniqueColumnNames) {
        function getColumnIndex(name) {
            let rt = -1;
            for (let n = 0; n < columnNames.length; n++) {
                if (columnNames[n] == name) {
                    rt = n;
                    break;
                }
            }
            return rt;
        }
        let index;
        if (indexColumnNames != undefined) {
            index = new Array();
            for (let n = 0; n < indexColumnNames.length; n++) {
                let id = getColumnIndex(indexColumnNames[n]);
                if (id != -1) {
                    index.push(id);
                }
            }
        }
        let unique;
        if (uniqueColumnNames != undefined) {
            unique = new Array();
            for (let n = 0; n < uniqueColumnNames.length; n++) {
                let id = getColumnIndex(uniqueColumnNames[n]);
                if (id != -1) {
                    unique.push(id);
                }
            }
        }
        super(columnNames.length, index, unique);
        this._columnNames = new Map();
        for (let n = 0; n < columnNames.length; n++) {
            this._columnNames.set(columnNames[n], n);
        }
        this._indexColumnNames = indexColumnNames;
        this._uniqueColumnNames = uniqueColumnNames;
    }
    doToData(data) {
        super.doToData(data);
        let arr = new Array();
        this._columnNames.forEach(function (v, k) {
            let item = { name: k, columnIndex: v };
            arr.push(item);
        });
        CDataClass.putData(data, "columnNames", arr, [], true);
        CDataClass.putData(data, "indexColumnNames", this._indexColumnNames, undefined);
        CDataClass.putData(data, "uniqueColumnNames", this._uniqueColumnNames, undefined);
    }
    doFromData(data) {
        super.doFromData(data);
        let arr = CDataClass.getData(data, "columnNames", []);
        this._columnNames.clear();
        for (let n = 0; n < arr.length; n++) {
            this._columnNames.set(arr[n].name, arr[n].columnIndex);
        }
        this._indexColumnNames = CDataClass.getData(data, "indexColumnNames", undefined);
        this._uniqueColumnNames = CDataClass.getData(data, "uniqueColumnNames", undefined);
    }
    doRemove() {
        this._columnNames.clear();
        this._indexColumnNames = undefined;
        this._uniqueColumnNames = undefined;
        super.doRemove();
    }
    cell(columnNameOrIndex, row) {
        if (typeof columnNameOrIndex == "string") {
            let idx = this._columnNames.get(columnNameOrIndex);
            if (idx != undefined) {
                return this._data.get(row).get(idx);
            }
        }
        else {
            return this._data.get(row).get(columnNameOrIndex);
        }
    }
    findIndexRow(columnNameOrIndex, value) {
        let rt = new Array();
        let columnIndex;
        if (typeof columnNameOrIndex == "string") {
            columnIndex = this._columnNames.get(columnNameOrIndex);
        }
        else {
            columnIndex = columnNameOrIndex;
        }
        let map = this._indexes.get(columnIndex);
        if (map != undefined) {
            let set = map.get(value);
            if (set != undefined) {
                set.forEach(function (value) {
                    rt.push(value.index);
                });
            }
        }
        return rt;
    }
    findIndex(columnNameOrIndex, value) {
        let arr = new Array();
        let columnIndex;
        if (typeof columnNameOrIndex == "string") {
            columnIndex = this._columnNames.get(columnNameOrIndex);
        }
        else {
            columnIndex = columnNameOrIndex;
        }
        let arridx = this.findIndexRow(columnIndex, value);
        for (let n = 0; n < arridx.length; n++) {
            arr.push(this._data.get(arridx[n]));
        }
        return arr;
    }
    find(values) {
        let arr;
        for (let n = 0; n < values.length; n++) {
            if (n > 0) {
                if (arr.length == 0) {
                    break;
                }
            }
            let columnIndex = this._columnNames.get(values[n].columnName);
            if (columnIndex != undefined) {
                if (n == 0) {
                    arr = this.findIndex(columnIndex, values[n].value);
                }
                else {
                    for (let i = arr.length - 1; i >= 0; i--) {
                        let rd = arr[i];
                        if (rd.get(columnIndex).value != values[n].value) {
                            arr.splice(i, 1);
                        }
                    }
                }
            }
        }
        return arr;
    }
}
class CFlowItem extends CDataClass {
    constructor(parent) {
        super();
        this._id = "";
        this._object = undefined;
        this._isFinish = false;
        this._parent = parent;
    }
    get parent() {
        return this._parent;
    }
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
    }
    get isFinish() {
        return this._isFinish;
    }
    get object() {
        return this._object;
    }
    set object(value) {
        this._object = value;
    }
    doExecute() {
        this._isFinish = false;
        if (this.onExecute != undefined) {
            this.onExecute(this);
        }
    }
    doFinish() {
        this._isFinish = true;
        this.parent.doItemFinish(this);
        if (this.onFinish != undefined) {
            this.onFinish(this);
        }
    }
    finish() {
        this.doFinish();
    }
}
class CFlowModel extends CDataClass {
    constructor() {
        super(...arguments);
        this._items = new CSet();
        this._idMap = new CMap();
        this._previousItems = new CMap();
        this._nextItems = new CMap();
    }
    get items() {
        return this._items;
    }
    get previousItems() {
        return this._previousItems;
    }
    get nextItems() {
        return this._nextItems;
    }
    doCheckPrevious(item) {
        if (this._previousItems.has(item)) {
            let set = this._previousItems.get(item);
            if (set != undefined) {
                let re = true;
                set.forEach(function (v) {
                    if (v.isFinish == false) {
                        re = false;
                    }
                });
                if (re) {
                    item.doExecute();
                }
            }
        }
    }
    doItemFinish(item) {
        if (this._nextItems.has(item)) {
            let set = this._nextItems.get(item);
            if (set != undefined) {
                let self = this;
                set.forEach(function (v) {
                    self.doCheckPrevious(v);
                });
            }
        }
    }
    doBeforeItemDelete(item) {
        if (this.onBeforeItemDelete != undefined) {
            this.onBeforeItemDelete(this, item);
        }
    }
    getItem(id) {
        return this._idMap.get(id);
    }
    addItem(id, exec = undefined) {
        if (this._idMap.has(id)) {
            return undefined;
        }
        else {
            let fi = new CFlowItem(this);
            fi.id = id;
            if (exec != undefined) {
                fi.onExecute = exec;
            }
            this._items.add(fi);
            this._idMap.set(id, fi);
            return fi;
        }
    }
    deleteItem(id) {
        let fi = this._idMap.get(id);
        if (fi != undefined) {
            this.doBeforeItemDelete(fi);
            if (this._previousItems.has(fi)) {
                this._previousItems.delete(fi);
            }
            if (this._nextItems.has(fi)) {
                this._nextItems.delete(fi);
            }
            for (let v of this._previousItems.values()) {
                if (v.has(fi)) {
                    v.delete(fi);
                }
            }
            for (let v of this._nextItems.values()) {
                if (v.has(fi)) {
                    v.delete(fi);
                }
            }
            this._items.delete(fi);
            this._idMap.delete(id);
        }
    }
    addLink(preItem, nextItem) {
        if (this._nextItems.get(preItem) == undefined) {
            let set = new CSet();
            set.add(nextItem);
            this._nextItems.set(preItem, set);
        }
        else {
            let set = this._nextItems.get(preItem);
            if (set != undefined) {
                set.add(nextItem);
            }
        }
        if (this._previousItems.get(nextItem) == undefined) {
            let set = new CSet();
            set.add(preItem);
            this._previousItems.set(nextItem, set);
        }
        else {
            let set = this._previousItems.get(nextItem);
            if (set != undefined) {
                set.add(preItem);
            }
        }
    }
    deleteLink(preItem, nextItem) {
        if (this._previousItems.has(nextItem)) {
            let set = this._previousItems.get(nextItem);
            if (set != undefined) {
                if (set.has(preItem)) {
                    set.delete(preItem);
                }
            }
            this._previousItems.delete(nextItem);
        }
        if (this._nextItems.has(preItem)) {
            let set = this._nextItems.get(preItem);
            if (set != undefined) {
                if (set.has(nextItem)) {
                    set.delete(nextItem);
                }
            }
            this._nextItems.delete(preItem);
        }
    }
    startItems() {
        let lst = new CList();
        let self = this;
        this._items.forEach(function (v) {
            if (self._previousItems.has(v)) {
                let set = self._previousItems.get(v);
                if (set?.size == 0) {
                    lst.add(v);
                }
            }
            else {
                lst.add(v);
            }
        });
        return lst;
    }
    stopItems() {
        let lst = new CList();
        let self = this;
        this._items.forEach(function (v) {
            if (self._nextItems.has(v)) {
                let set = self._nextItems.get(v);
                if (set?.size == 0) {
                    lst.add(v);
                }
            }
            else {
                lst.add(v);
            }
        });
        return lst;
    }
    getFlowCount(item) {
        let count = 0;
        let self = this;
        function path(it) {
            if (self._nextItems.has(it)) {
                let set = self._nextItems.get(it);
                if (set != undefined) {
                    set.forEach(function (v) {
                        path(v);
                    });
                }
            }
            else {
                count++;
            }
        }
        path(item);
        return count;
    }
    getFlow(item) {
        let lst = new CList();
        let self = this;
        function path(it, str) {
            if (self._nextItems.has(it)) {
                let set = self._nextItems.get(it);
                if (set != undefined) {
                    set.forEach(function (v) {
                        path(v, str + "," + v.id);
                    });
                }
            }
            else {
                lst.add(str);
            }
        }
        path(item, item.id);
        return lst;
    }
    getAllFlow() {
        let re = new CList();
        let lst = this.startItems();
        for (let n = 0; n < lst.length; n++) {
            let l = this.getFlow(lst[n]);
            for (let i = 0; i < l.length; i++) {
                re.add(l.get(i));
            }
        }
        return re;
    }
    getAllFlowCount() {
        let count = 0;
        let lst = this.startItems();
        for (let n = 0; n < lst.length; n++) {
            count += this.getFlowCount(lst[n]);
        }
        return count;
    }
}
var ETreeItemState;
(function (ETreeItemState) {
    ETreeItemState[ETreeItemState["COLLAPSE"] = 0] = "COLLAPSE";
    ETreeItemState[ETreeItemState["EXPAND"] = 1] = "EXPAND";
})(ETreeItemState || (ETreeItemState = {}));
class CTreeItem extends CNotifyChangeObject {
    static get CON_CHANGE_STATE() { return "changeState"; }
    static get CON_CHANGE_VALUE() { return "changeValue"; }
    static get CON_CHANGE_ITEMS() { return "changeItems"; }
    get value() {
        return this._value;
    }
    get items() {
        return this._items;
    }
    get state() {
        return this._state;
    }
    set state(value) {
        if (this._state != value) {
            this._state = value;
            this.doChange(CTreeItem.CON_CHANGE_STATE, undefined);
        }
    }
    constructor(value) {
        super();
        this._value = new CVariable();
        this._items = new CTreeData();
        this._state = ETreeItemState.COLLAPSE;
        let self = this;
        this._value = new CVariable(value);
        this._value.onChange = function () {
            self.doChange(CTreeItem.CON_CHANGE_VALUE, undefined);
        };
        this._items.onChange = function (data, kind, item) {
            self.doChange(CTreeItem.CON_CHANGE_ITEMS, self.items);
        };
    }
    doRemove() {
        this._value.remove();
        this._items.remove();
        super.doRemove();
    }
    doChange(kind, data) {
        if (this.onChange != undefined)
            this.onChange(this, kind, data);
    }
    doCollapse() {
        this.state = ETreeItemState.COLLAPSE;
    }
    doExpand() {
        this.state = ETreeItemState.EXPAND;
    }
    collapse() {
        this.doCollapse();
    }
    expand() {
        this.doExpand();
    }
    getState() {
        if (this.items.length == 0) {
            return "empty";
        }
        else {
            return this.state;
        }
    }
}
class CTreeData extends CNotifyChangeObject {
    constructor() {
        super(...arguments);
        this._items = new CList();
    }
    get items() {
        return this._items;
    }
    get length() {
        return this._items.length;
    }
    idx(item) {
        let rt;
        for (let n = 0; n < this._items.length; n++) {
            if (item == this._items.get(n)) {
                rt = n;
                break;
            }
        }
        return rt;
    }
    doToData(data) {
        super.doToData(data);
        function loop(dt, td) {
            for (let n = 0; n < td.length; n++) {
                let item = td.getItem(n);
                if (item != undefined) {
                    let arr = new Array();
                    dt.push({ value: item.value.value, state: item.state, items: arr });
                    loop(arr, item.items);
                }
            }
        }
        loop(data, this);
    }
    doFromData(data) {
        super.doFromData(data);
        this.clear();
        function a(arr, dt) {
            for (let n = 0; n < arr.length; n++) {
                let d = arr[n];
                let item = dt.addItem(d.value);
                item.state = d.state;
                a(d.items, item.items);
            }
        }
        a(data, this);
    }
    doRemove() {
        this._items.remove();
        super.doRemove();
    }
    doChange(kind, data, value) {
        if (this.onChange != undefined)
            this.onChange(this, kind, data, value);
    }
    addItem(value) {
        let item = new CTreeItem(value);
        let self = this;
        item.onChange = function (item, kind, data) {
            self.doChange("update", data, item);
        };
        this._items.add(item);
        this.doChange("add", this, item);
        return item;
    }
    insertItem(index, value) {
        let item = new CTreeItem(value);
        let self = this;
        item.onChange = function (item, kind, data) {
            self.doChange("update", data, item);
        };
        this._items.insert(index, value);
        this.doChange("insert", this, item);
        return item;
    }
    deleteItem(indexOrItem) {
        let idx;
        if (typeof indexOrItem == "number") {
            idx = indexOrItem;
        }
        else {
            idx = this.idx(indexOrItem);
        }
        if (idx != undefined) {
            this._items.delete(idx);
            this.doChange("delete", this, undefined);
        }
    }
    getItem(index) {
        if (typeof index == "number") {
            return this._items.get(index);
        }
        else {
            let table = this.getIndexes();
            let arr = table.findIndex("index", index);
            if (arr.length > 0) {
                return arr[0].get(2).asObject;
            }
        }
    }
    get(index) {
        return this.items.get(index);
    }
    setItem(index, item) {
        let self = this;
        item.onChange = function (item, kind, data) {
            self.doChange("update", data, item);
        };
        this._items.set(index, item);
        this.doChange("update", this, item);
    }
    clear() {
        this._items.clear();
        this.doChange("clear", this, undefined);
    }
    getIndex(item) {
        let table = this.getIndexes();
        let arr = table.findIndex("treeitem", item);
        if (arr.length > 0) {
            return arr[0].get(0).asString;
        }
    }
    getIndexes() {
        let rt = new CTableData(["index", "treedata", "treeitem"], ["index", "treedata", "treeitem"]);
        function setidx(idx, data) {
            for (let n = 0; n < data.length; n++) {
                let id = "";
                if (idx == "") {
                    id = n + "";
                }
                else {
                    id = idx + "," + n;
                }
                let item = data.getItem(n);
                rt.add([id, data, item]);
                if (item != undefined) {
                    setidx(id, item.items);
                }
            }
        }
        setidx("", this);
        return rt;
    }
    toData() {
        let o = [];
        this.doToData(o);
        return o;
    }
    getExpandedItems() {
        let rt = new Array();
        function set(level, parentIndex, arr, item) {
            arr.push({ level: level, index: parentIndex, item: item });
            if (item.state == ETreeItemState.EXPAND) {
                for (let n = 0; n < item.items.length; n++) {
                    set(level + 1, parentIndex + "," + n, arr, item.items.get(n));
                }
            }
        }
        for (let n = 0; n < this.items.length; n++) {
            set(0, n + "", rt, this.items.get(n));
        }
        return rt;
    }
    expandAll() {
        let data = this.getIndexes();
        for (let n = 0; n < data.length; n++) {
            let item = data.getRow(n).get(2).value;
            item.expand();
        }
    }
    collapseAll() {
        let data = this.getIndexes();
        for (let n = 0; n < data.length; n++) {
            let item = data.getRow(n).get(2).value;
            item.collapse();
        }
    }
}
