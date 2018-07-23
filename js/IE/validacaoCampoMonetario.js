/*
 *  jquery-maskmoney - v3.1.1
 *  jQuery plugin to mask data entry in the input text in the form of money (currency)
 *  https://github.com/plentz/jquery-maskmoney
 *
 *  Made by Diego Plentz
 *  Under MIT License
 */

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*    @author João Francisco - https://github.com/joaofxp                  *
*    @updated 23/07/2018                                                  *
*    Pacote: Desafio Front-End                                            *
*                                                                         *
*    Copyright (C) 2018 UNIVALI - Universidade do Vale do Itajaí          *
*                  https://univali.br                                     *
*                  0800 723 1300                                          *
*                                                                         *
*    Este  programa  é  software livre, você pode redistribuí-lo e/ou     *
*    modificá-lo sob os termos da Licença Pública Geral GNU, conforme     *
*    publicada pela Free  Software  Foundation,  tanto  a versão 2 da     *
*    Licença   como  (a  seu  critério)  qualquer  versão  mais  nova.    *
*                                                                         *
*    Este programa  é distribuído na expectativa de ser útil, mas SEM     *
*    QUALQUER GARANTIA. Sem mesmo a garantia implícita de COMERCIALI-     *
*    ZAÇÃO  ou  de ADEQUAÇÃO A QUALQUER PROPÓSITO EM PARTICULAR. Con-     *
*    sulte  a  Licença  Pública  Geral  GNU para obter mais detalhes.     *
*                                                                         *
*    Você  deve  ter  recebido uma cópia da Licença Pública Geral GNU     *
*    junto  com  este  programa. Se não, escreva para a Free Software     *
*    Foundation,  Inc.,  59  Temple  Place,  Suite  330,  Boston,  MA     *
*    02111-1307, USA.                                                     *
*                                                                         *
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/

(function ($) {
    "use strict";
    //Verifica o browser

    if (!$.browser) {
        $.browser = {};
        $.browser.mozilla = /mozilla/.test(navigator.userAgent.toLowerCase()) && !/webkit/.test(navigator.userAgent.toLowerCase());
        $.browser.webkit = /webkit/.test(navigator.userAgent.toLowerCase());
        $.browser.opera = /opera/.test(navigator.userAgent.toLowerCase());
        $.browser.msie = /msie/.test(navigator.userAgent.toLowerCase());
        $.browser.device = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase());
    }

    //Define as configurações iniciais
    var defaultOptions = {
        prefix: "",
        suffix: "",
        affixesStay: true,
        thousands: ",",
        decimal: ".",
        precision: 2,
        allowZero: false,
        allowNegative: false,
        doubleClickSelection: true,
        allowEmpty: false,
        bringCaretAtEndOnFocus: true
    },

    //Define os métodos
    methods = {
        //Destruir
        destroy: function destroy() {
            $(this).unbind(".maskMoney");

            if ($.browser.msie) {
                this.onpaste = null;
            }
            return this;
        },
        //Aplicar máscara
        applyMask: function applyMask(value) {
            var $input = $(this);
            // data-* api
            var settings = $input.data("settings");
            return maskValue(value, settings);
        },
        //Mascarar
        mask: function mask(value) {
            return this.each(function () {
                var $this = $(this);
                if (typeof value === "number") {
                    $this.val(value);
                }
                return $this.trigger("mask");
            });
        },
        //Desmascarar
        unmasked: function unmasked() {
            return this.map(function () {
                var value = $(this).val() || "0",
                    isNegative = value.indexOf("-") !== -1,
                    decimalPart;
                // get the last position of the array that is a number(coercion makes "" to be evaluated as false)
                $(value.split(/\D/).reverse()).each(function (index, element) {
                    if (element) {
                        decimalPart = element;
                        return false;
                    }
                });
                value = value.replace(/\D/g, "");
                value = value.replace(new RegExp(decimalPart + "$"), "." + decimalPart);
                if (isNegative) {
                    value = "-" + value;
                }
                return parseFloat(value);
            });
        },
        //Desmascarar com opções
        unmaskedWithOptions: function unmaskedWithOptions() {
            return this.map(function () {
                var value = $(this).val() || "0",
                    settings = $(this).data("settings") || defaultOptions,
                    regExp = new RegExp(settings.thousandsForUnmasked || settings.thousands, "g");
                value = value.replace(regExp, "");
                return parseFloat(value);
            });
        },

        init: function init(parameters) {
            // a opção padrão é de não compartilhar com os uotros
            parameters = $.extend($.extend({}, defaultOptions), parameters);

            return this.each(function () {
                var $input = $(this),
                    settings,
                    onFocusValue;

                // data-* api
                settings = $.extend({}, parameters);
                settings = $.extend(settings, $input.data());

                // Guarda as configurações para usar com a função applyMask
                $input.data("settings", settings);

                function getInputSelection() {
                    var el = $input.get(0),
                        start = 0,
                        end = 0,
                        normalizedValue,
                        range,
                        textInputRange,
                        len,
                        endRange;

                    if (typeof el.selectionStart === "number" && typeof el.selectionEnd === "number") {
                        start = el.selectionStart;
                        end = el.selectionEnd;
                    } else {
                        range = document.selection.createRange();

                        if (range && range.parentElement() === el) {
                            len = el.value.length;
                            normalizedValue = el.value.replace(/\r\n/g, "\n");

                            //Cria um TextRange
                            textInputRange = el.createTextRange();
                            textInputRange.moveToBookmark(range.getBookmark());

                            //Verifica se o início e o final da seleção estão no fim do input
                            //Pois o moveStart/moveEnd não retorna o que é necessário neste caso
                            endRange = el.createTextRange();
                            endRange.collapse(false);

                            if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
                                start = end = len;
                            } else {
                                start = -textInputRange.moveStart("character", -len);
                                start += normalizedValue.slice(0, start).split("\n").length - 1;

                                if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
                                    end = len;
                                } else {
                                    end = -textInputRange.moveEnd("character", -len);
                                    end += normalizedValue.slice(0, end).split("\n").length - 1;
                                }
                            }
                        }
                    }

                    return {
                        start: start,
                        end: end
                    };
                } // getInputSelection

                function canInputMoreNumbers() {
                    var haventReachedMaxLength = !($input.val().length >= $input.attr("maxlength") && $input.attr("maxlength") >= 0),
                        selection = getInputSelection(),
                        start = selection.start,
                        end = selection.end,
                        haveNumberSelected = selection.start !== selection.end && $input.val().substring(start, end).match(/\d/) ? true : false,
                        startWithZero = $input.val().substring(0, 1) === "0";
                    return haventReachedMaxLength || haveNumberSelected || startWithZero;
                }

                function setCursorPosition(pos) {
                    // Não configurar a posição se
                    // Estiver formatando no blur
                    // Isso acontece porque não queremos
                    // refocar no controle após o blur

                    if (!!settings.formatOnBlur) {
                        return;
                    }

                    $input.each(function (index, elem) {
                        if (elem.setSelectionRange) {
                            elem.focus();
                            elem.setSelectionRange(pos, pos);
                        } else if (elem.createTextRange) {
                            var range = elem.createTextRange();
                            range.collapse(true);
                            range.moveEnd("character", pos);
                            range.moveStart("character", pos);
                            range.select();
                        }
                    });
                }

                function maskAndPosition(startPos) {
                    var originalLen = $input.val().length,
                        newLen;
                    $input.val(maskValue($input.val(), settings));
                    newLen = $input.val().length;
                    // Se estivermos usando a opção invertida
                    // não colocar o cursor no final do input
                    // A opção inversa permite 
                    // o usuário para entrada de texto da esquerda para a direita
                    if (!settings.reverse) {
                        startPos = startPos - (originalLen - newLen);
                    }
                    setCursorPosition(startPos);
                }

                function mask() {
                    var value = $input.val();
                    if (settings.allowEmpty && value === "") {
                        return;
                    }
                    var isNumber = !isNaN(value);
                    var decimalPointIndex = isNumber ? value.indexOf(".") : value.indexOf(settings.decimal);
                    if (settings.precision > 0) {
                        if (decimalPointIndex < 0) {
                            value += settings.decimal + new Array(settings.precision + 1).join(0);
                        } else {
                            //Se o decimal seguinet não tiver comprimento suficiente contra a precisão, ele precisa ser preenchido com zeros
                            var integerPart = value.slice(0, decimalPointIndex),
                                decimalPart = value.slice(decimalPointIndex + 1);
                            value = integerPart + settings.decimal + decimalPart + new Array(settings.precision + 1 - decimalPart.length).join(0);
                        }
                    } else if (decimalPointIndex > 0) {
                        //Se  a precisão for 0, descartamos a parte decimal
                        // if the precision is 0, discard the decimal part
                        value = value.slice(0, decimalPointIndex);
                    }
                    $input.val(maskValue(value, settings));
                }

                function changeSign() {
                    var inputValue = $input.val();
                    if (settings.allowNegative) {
                        if (inputValue !== "" && inputValue.charAt(0) === "-") {
                            return inputValue.replace("-", "");
                        } else {
                            return "-" + inputValue;
                        }
                    } else {
                        return inputValue;
                    }
                }

                function preventDefault(e) {
                    //navegadores padrões
                    if (e.preventDefault) {
                        e.preventDefault();
                        // o velho internet explorer
                    } else {
                        e.returnValue = false;
                    }
                }

                function fixMobile() {
                    if ($.browser.device) {
                        $input.attr("type", "tel");
                    }
                }

                function keypressEvent(e) {
                    e = e || window.event;
                    var key = e.which || e.charCode || e.keyCode,
                        decimalKeyCode = settings.decimal.charCodeAt(0);
                    //adicionado para lidar com um evento especial do IE
                    if (key === undefined) {
                        return false;
                    }

                    //Qualquer tecla exceto os numeros 0-9. Se estivermos usando settings.reverse
                    // Autoriza o usuário a colocar valores decimais
                    if ((key < 48 || key > 57) && (key !== decimalKeyCode || !settings.reverse)) {
                        return handleAllKeysExceptNumericalDigits(key, e);
                    } else if (!canInputMoreNumbers()) {
                        return false;
                    } else {
                        if (key === decimalKeyCode && shouldPreventDecimalKey()) {
                            return false;
                        }
                        if (settings.formatOnBlur) {
                            return true;
                        }
                        preventDefault(e);
                        applyMask(e);
                        return false;
                    }
                }

                function shouldPreventDecimalKey() {
                    //Se todo o texto está selecionado, aceitamos decimal
                    // tecla porque vai substituir tudo
                    if (isAllTextSelected()) {
                        return false;
                    }

                    return alreadyContainsDecimal();
                }

                function isAllTextSelected() {
                    var length = $input.val().length;
                    var selection = getInputSelection();
                    //Isso deve acontecer se todo o texto estiver selecionado ou o input está vazio
                    return selection.start === 0 && selection.end === length;
                }

                function alreadyContainsDecimal() {
                    return $input.val().indexOf(settings.decimal) > -1;
                }

                function applyMask(e) {
                    e = e || window.event;
                    var key = e.which || e.charCode || e.keyCode,
                        keyPressedChar = "",
                        selection,
                        startPos,
                        endPos,
                        value;
                    if (key >= 48 && key <= 57) {
                        keyPressedChar = String.fromCharCode(key);
                    }
                    selection = getInputSelection();
                    startPos = selection.start;
                    endPos = selection.end;
                    value = $input.val();
                    $input.val(value.substring(0, startPos) + keyPressedChar + value.substring(endPos, value.length));
                    maskAndPosition(startPos + 1);
                }

                function handleAllKeysExceptNumericalDigits(key, e) {
                    // -(menos) tecla
                    if (key === 45) {
                        $input.val(changeSign());
                        return false;
                        // +(mais) tecla
                    } else if (key === 43) {
                        $input.val($input.val().replace("-", ""));
                        return false;
                        // enter tecla ou tecla tab
                    } else if (key === 13 || key === 9) {
                        return true;
                    } else if ($.browser.mozilla && (key === 37 || key === 39) && e.charCode === 0) {
                        // necessário para a tecla "seta esquerda" ou "seta direita" no firefox
                        // O charCode part é para evitar a permissão de "%" (e.charCode 0, e.keyCode 37)
                        return true;
                    } else {
                        // Qualquer outra tecla com um código chave menor que 48 ou maior que 57
                        preventDefault(e);
                        return true;
                    }
                }

                function keydownEvent(e) {
                    e = e || window.event;
                    var key = e.which || e.charCode || e.keyCode,
                        selection,
                        startPos,
                        endPos,
                        value,
                        lastNumber;
                    // adicionado para lidar com um evento especial do IE
                    if (key === undefined) {
                        return false;
                    }

                    selection = getInputSelection();
                    startPos = selection.start;
                    endPos = selection.end;

                    //Backspace ou tecla de deletar (com caso especial para o safari)
                    if (key === 8 || key === 46 || key === 63272) {
                        preventDefault(e);

                        value = $input.val();

                        // Não é uma seleção
                        if (startPos === endPos) {
                            // backspace
                            if (key === 8) {
                                if (settings.suffix === "") {
                                    startPos -= 1;
                                } else {
                                    // Necessário para encontrar a posição do último número a ser apagado
                                    lastNumber = value.split("").reverse().join("").search(/\d/);
                                    startPos = value.length - lastNumber - 1;
                                    endPos = startPos + 1;
                                }
                                //Deletar
                            } else {
                                endPos += 1;
                            }
                        }

                        $input.val(value.substring(0, startPos) + value.substring(endPos, value.length));

                        maskAndPosition(startPos);
                        return false;
                    } else if (key === 9) {
                        // tecla tab
                        return true;
                    } else {
                        // qualquer outra tecla
                        return true;
                    }
                }

                function focusEvent() {
                    onFocusValue = $input.val();
                    mask();
                    var input = $input.get(0),
                        textRange;

                    if (!!settings.selectAllOnFocus) {
                        input.select();
                    } else if (input.createTextRange && settings.bringCaretAtEndOnFocus) {
                        textRange = input.createTextRange();
                        textRange.collapse(false); // coloca o cursos no fim do input
                        textRange.select();
                    }
                }

                function cutPasteEvent() {
                    setTimeout(function () {
                        mask();
                    }, 0);
                }

                function getDefaultMask() {
                    var n = parseFloat("0") / Math.pow(10, settings.precision);
                    return n.toFixed(settings.precision).replace(new RegExp("\\.", "g"), settings.decimal);
                }

                function blurEvent(e) {
                    if ($.browser.msie) {
                        keypressEvent(e);
                    }

                    if (!!settings.formatOnBlur && $input.val() !== onFocusValue) {
                        applyMask(e);
                    }

                    if ($input.val() === "" && settings.allowEmpty) {
                        $input.val("");
                    } else if ($input.val() === "" || $input.val() === setSymbol(getDefaultMask(), settings)) {
                        if (!settings.allowZero) {
                            $input.val("");
                        } else if (!settings.affixesStay) {
                            $input.val(getDefaultMask());
                        } else {
                            $input.val(setSymbol(getDefaultMask(), settings));
                        }
                    } else {
                        if (!settings.affixesStay) {
                            var newValue = $input.val().replace(settings.prefix, "").replace(settings.suffix, "");
                            $input.val(newValue);
                        }
                    }
                    if ($input.val() !== onFocusValue) {
                        $input.change();
                    }
                }

                function clickEvent() {
                    var input = $input.get(0),
                        length;
                    if (!!settings.selectAllOnFocus) {
                        // selectAllOnFocus será lidado pelo evento "foco"
                        // O evento foco também é chamado ao clicar no input
                        return;
                    } else if (input.setSelectionRange && settings.bringCaretAtEndOnFocus) {
                        length = $input.val().length;
                        input.setSelectionRange(length, length);
                    } else {
                        $input.val($input.val());
                    }
                }

                function doubleClickEvent() {
                    var input = $input.get(0),
                        start,
                        length;
                    if (input.setSelectionRange && settings.bringCaretAtEndOnFocus) {
                        length = $input.val().length;
                        start = settings.doubleClickSelection ? 0 : length;
                        input.setSelectionRange(start, length);
                    } else {
                        $input.val($input.val());
                    }
                }

                fixMobile();
                $input.unbind(".maskMoney");
                $input.bind("keypress.maskMoney", keypressEvent);
                $input.bind("keydown.maskMoney", keydownEvent);
                $input.bind("blur.maskMoney", blurEvent);
                $input.bind("focus.maskMoney", focusEvent);
                $input.bind("click.maskMoney", clickEvent);
                $input.bind("dblclick.maskMoney", doubleClickEvent);
                $input.bind("cut.maskMoney", cutPasteEvent);
                $input.bind("paste.maskMoney", cutPasteEvent);
                $input.bind("mask.maskMoney", mask);
            });
        }
    };

    function setSymbol(value, settings) {
        var operator = "";
        if (value.indexOf("-") > -1) {
            value = value.replace("-", "");
            operator = "-";
        }
        if (value.indexOf(settings.prefix) > -1) {
            value = value.replace(settings.prefix, "");
        }
        if (value.indexOf(settings.suffix) > -1) {
            value = value.replace(settings.suffix, "");
        }
        return operator + settings.prefix + value + settings.suffix;
    }

    function maskValue(value, settings) {
        if (settings.allowEmpty && value === "") {
            return "";
        }
        if (!!settings.reverse) {
            return maskValueReverse(value, settings);
        }
        return maskValueStandard(value, settings);
    }

    function maskValueStandard(value, settings) {
        var negative = value.indexOf("-") > -1 && settings.allowNegative ? "-" : "",
            onlyNumbers = value.replace(/[^0-9]/g, ""),
            integerPart = onlyNumbers.slice(0, onlyNumbers.length - settings.precision),
            newValue,
            decimalPart,
            leadingZeros;

        newValue = buildIntegerPart(integerPart, negative, settings);

        if (settings.precision > 0) {
            if (!isNaN(value) && value.indexOf(".")) {
                var precision = value.substr(value.indexOf(".") + 1);
                onlyNumbers += new Array(settings.precision + 1 - precision.length).join(0);
                integerPart = onlyNumbers.slice(0, onlyNumbers.length - settings.precision);
                newValue = buildIntegerPart(integerPart, negative, settings);
            }

            decimalPart = onlyNumbers.slice(onlyNumbers.length - settings.precision);
            leadingZeros = new Array(settings.precision + 1 - decimalPart.length).join(0);
            newValue += settings.decimal + leadingZeros + decimalPart;
        }
        return setSymbol(newValue, settings);
    }

    function maskValueReverse(value, settings) {
        var negative = value.indexOf("-") > -1 && settings.allowNegative ? "-" : "",
            valueWithoutSymbol = value.replace(settings.prefix, "").replace(settings.suffix, ""),
            integerPart = valueWithoutSymbol.split(settings.decimal)[0],
            newValue,
            decimalPart = "";

        if (integerPart === "") {
            integerPart = "0";
        }
        newValue = buildIntegerPart(integerPart, negative, settings);

        if (settings.precision > 0) {
            var arr = valueWithoutSymbol.split(settings.decimal);
            if (arr.length > 1) {
                decimalPart = arr[1];
            }
            newValue += settings.decimal + decimalPart;
            var rounded = Number.parseFloat(integerPart + "." + decimalPart).toFixed(settings.precision);
            var roundedDecimalPart = rounded.toString().split(settings.decimal)[1];
            newValue = newValue.split(settings.decimal)[0] + "." + roundedDecimalPart;
        }

        return setSymbol(newValue, settings);
    }

    function buildIntegerPart(integerPart, negative, settings) {
        // removemos 0 iniciais
        integerPart = integerPart.replace(/^0*/g, "");

        // colocamos settings.thousands a cada 3 chars
        integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, settings.thousands);
        if (integerPart === "") {
            integerPart = "0";
        }
        return negative + integerPart;
    }

    $.fn.maskMoney = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if ((typeof method === "undefined" ? "undefined" : _typeof(method)) === "object" || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error("Method " + method + " does not exist on jQuery.maskMoney");
        }
    };
})(window.jQuery || window.Zepto);