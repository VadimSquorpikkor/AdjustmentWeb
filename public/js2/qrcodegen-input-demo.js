/*
 * QR Code generator input demo (TypeScript)
 *
 * Copyright (c) Project Nayuki. (MIT License)
 * https://www.nayuki.io/page/qr-code-generator-library
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * - The above copyright notice and this permission notice shall be included in
 *   all copies or substantial portions of the Software.
 * - The Software is provided "as is", without warranty of any kind, express or
 *   implied, including but not limited to the warranties of merchantability,
 *   fitness for a particular purpose and noninfringement. In no event shall the
 *   authors or copyright holders be liable for any claim, damages or other
 *   liability, whether in an action of contract, tort or otherwise, arising from,
 *   out of or in connection with the Software or the use or other dealings in the
 *   Software.
 */
"use strict";
var app;
(function (app) {
    function initialize() {
        getElem("loading").style.display = "none";
        getElem("loaded").style.removeProperty("display");
        var elems = document.querySelectorAll("input[type=number], textarea, input[type=text], select");
        for (var _i = 0, elems_1 = elems; _i < elems_1.length; _i++) {
            var el = elems_1[_i];
            if (el.id.indexOf("version-") != 0)
                el.oninput = redrawQrCode;
        }
        elems = document.querySelectorAll("input[type=radio], input[type=checkbox]");
        for (var _a = 0, elems_2 = elems; _a < elems_2.length; _a++) {
            var el = elems_2[_a];
            el.onchange = redrawQrCode;
        }
        redrawQrCode();
    }
    function redrawQrCode() {
        // Show/hide rows based on bitmap/vector image output
        var bitmapOutput = getInput("output-format-bitmap").checked;
        var scaleRow = getElem("scale-row");
        var svgXmlRow = getElem("svg-xml-row");
        if (bitmapOutput) {
            scaleRow.style.removeProperty("display");
            svgXmlRow.style.display = "none";
        }
        else {
            scaleRow.style.display = "none";
            svgXmlRow.style.removeProperty("display");
        }
        var svgXml = getElem("svg-xml-output");
        svgXml.value = "";
        // Reset output images in case of early termination
        var canvas = getElem("qrcode-canvas");
        var svg = document.getElementById("qrcode-svg");
        canvas.style.display = "none";
        svg.style.display = "none";
        // Returns a QrCode.Ecc object based on the radio buttons in the HTML form.
        function getInputErrorCorrectionLevel() {
            if (getInput("errcorlvl-medium").checked)
                return qrcodegen.QrCode.Ecc.MEDIUM;
            else if (getInput("errcorlvl-quartile").checked)
                return qrcodegen.QrCode.Ecc.QUARTILE;
            else if (getInput("errcorlvl-high").checked)
                return qrcodegen.QrCode.Ecc.HIGH;
            else //In case no radio button is depressed
                return qrcodegen.QrCode.Ecc.LOW;
        }
        // Get form inputs and compute QR Code
        var ecl = getInputErrorCorrectionLevel();





        ////// let str = getElem('security_key').value;
        let str = secureKey;
        console.log('secureKey - '+str);
        setSecurityKey(str);

        // var sel = getElem("selected_type_for_generator");
        // var s = sel.options[sel.selectedIndex].text;
        var s = devicesForGeneratorAdapter.getSelectedId();//берем name_id выбранного элемента спиннера ("BDKG-02")
        let ru_name = devicesForGeneratorAdapter.getSelectedName();//берем name выбранного элемента спиннера ("БДКГ-02")
        let input_ru = ru_name+" "+getElem("text-input").value;//получаем строку с именем и номером на русском (для отображении над картинкой с QR-кодом, не участвует в создании QR-кода) ("БДКГ-02 123")

        // let input = getElem("selected_type").options(getElem("selected_type").selectedIndex).value + " " + getElem("text-input").value;
        let input = s + " " + getElem("text-input").value;//получаем строку с id имени и номером для генерации QR-кода ("BDKG-02 123")
        // var text = getElem("text-input").value;
        var text = byteArrayToString(convertData(stringToByteArray(input)));






        var segs = qrcodegen.QrSegment.makeSegments(text);
        var minVer = parseInt(getInput("version-min-input").value, 10);
        var maxVer = parseInt(getInput("version-max-input").value, 10);
        var mask = parseInt(getInput("mask-input").value, 10);
        var boostEcc = getInput("boost-ecc-input").checked;
        var qr = qrcodegen.QrCode.encodeSegments(segs, ecl, minVer, maxVer, mask, boostEcc);
        // Draw image output
        var border = parseInt(getInput("border-input").value, 10);
        if (border < 0 || border > 100)
            return;
        if (secureKey==="")return;
        if (bitmapOutput) {
            var scale = parseInt(getInput("scale-input").value, 10);
            if (scale <= 0 || scale > 30)
                return;
            // qr.drawCanvas(scale, border, canvas, input);
            qr.drawCanvas(scale, border, canvas, input_ru);
            canvas.style.removeProperty("display");
        }
        else {
            var code = qr.toSvgString(border);
            var viewBox = / viewBox="([^"]*)"/.exec(code)[1];
            var pathD = / d="([^"]*)"/.exec(code)[1];
            svg.setAttribute("viewBox", viewBox);
            svg.querySelector("path").setAttribute("d", pathD);
            svg.style.removeProperty("display");
            svgXml.value = qr.toSvgString(border);
        }
        // Returns a string to describe the given list of segments.
        function describeSegments(segs) {
            if (segs.length == 0)
                return "none";
            else if (segs.length == 1) {
                var mode = segs[0].mode;
                var Mode = qrcodegen.QrSegment.Mode;
                if (mode == Mode.NUMERIC)
                    return "numeric";
                if (mode == Mode.ALPHANUMERIC)
                    return "alphanumeric";
                if (mode == Mode.BYTE)
                    return "byte";
                if (mode == Mode.KANJI)
                    return "kanji";
                return "unknown";
            }
            else
                return "multiple";
        }
        // Returns the number of Unicode code points in the given UTF-16 string.
        function countUnicodeChars(str) {
            var result = 0;
            for (var i = 0; i < str.length; i++, result++) {
                var c = str.charCodeAt(i);
                if (c < 0xD800 || c >= 0xE000)
                    continue;
                else if (0xD800 <= c && c < 0xDC00 && i + 1 < str.length) { // High surrogate
                    i++;
                    var d = str.charCodeAt(i);
                    if (0xDC00 <= d && d < 0xE000) // Low surrogate
                        continue;
                }
                throw "Invalid UTF-16 string";
            }
            return result;
        }
        // Show the QR Code symbol's statistics as a string
        getElem("statistics-output").textContent = "QR Code version = " + qr.version + ", " +
            ("mask pattern = " + qr.mask + ", ") +
            ("character count = " + countUnicodeChars(text) + ",\n") +
            ("encoding mode = " + describeSegments(segs) + ", ") +
            ("error correction = level " + "LMQH".charAt(qr.errorCorrectionLevel.ordinal) + ", ") +
            ("data bits = " + qrcodegen.QrSegment.getTotalBits(segs, qr.version) + ".");
    }
    function handleVersionMinMax(which) {
        var minElem = getInput("version-min-input");
        var maxElem = getInput("version-max-input");
        var minVal = parseInt(minElem.value, 10);
        var maxVal = parseInt(maxElem.value, 10);
        minVal = Math.max(Math.min(minVal, qrcodegen.QrCode.MAX_VERSION), qrcodegen.QrCode.MIN_VERSION);
        maxVal = Math.max(Math.min(maxVal, qrcodegen.QrCode.MAX_VERSION), qrcodegen.QrCode.MIN_VERSION);
        if (which == "min" && minVal > maxVal)
            maxVal = minVal;
        else if (which == "max" && maxVal < minVal)
            minVal = maxVal;
        minElem.value = minVal.toString();
        maxElem.value = maxVal.toString();
        redrawQrCode();
    }
    app.handleVersionMinMax = handleVersionMinMax;
    function getElem(id) {
        var result = document.getElementById(id);
        if (result instanceof HTMLElement)
            return result;
        throw "Assertion error";
    }
    function getInput(id) {
        var result = getElem(id);
        if (result instanceof HTMLInputElement)
            return result;
        throw "Assertion error";
    }
    initialize();
})(app || (app = {}));
