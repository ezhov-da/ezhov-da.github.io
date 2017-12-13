//аМаАббаИаВ аВбаЕб бббаЛаОаК, аКаОбаОббаЕ аЗаАаГббаЗаИаЛаИбб
var consoleLog = false;

var originalMass;
var lastSelectedId;
var lastNoteSelected;
var nowNoteSelected;

function logger(data) {
    if (consoleLog) {
        console.log(data);
    }
}

function firstNoteSelect() {
    var el = $(".go").first();
    //  logger(el);
    el.click();
}

//аЗаАаГббаЖаАаЕаМ баПаИбаОаК
function loadList() {

            // logger(data);
            var menu = "";
            var lastSelectedFinder;

            source.forEach(function (item, i, arr) {
                if (typeof lastNoteSelected !== "undefined") {
                    // logger(item.id);
                    // logger(lastNoteSelected.attr("id"));
                    var idFinder = lastNoteSelected.attr("id");
                    //logger(item.id + " : " + idFinder);
                    if (item.id == idFinder) {
                        lastSelectedFinder = lastNoteSelected;
                    }
                }
                menu = menu + item.html;
            });
            //   logger(menu);
            $("#menu").html(menu);
            //аПаОаЛббаАаЕаМ баПаИбаОаК
            originalMass = $("li>.go");
            //  logger(originalMass);

            //баИаЛббббаЕаМ баПаИбаОаК, аЕбаЛаИ аПаОаЛаЕ аЗаАаПаОаЛаНаЕаНаО
            var valFromFindeField = $("#find")[0].value;
            if (valFromFindeField !== "") {
                filterList(valFromFindeField);
            }

            if (typeof lastSelectedFinder === "undefined") {
                firstNoteSelect();
            } else {
                lastNoteSelected = $("a[id$='" + lastNoteSelected.attr("id"));
                $(lastNoteSelected).parent().addClass("active");
                logger(lastSelectedFinder);
            }
   

}

//аЗаАаГббаЖаАаЕаМ аВбаБбаАаНаНбб бббаЛаКб
function loadSelectedLink(id) {
    var url = 'responseToMyPage?id=' + id;
    $.ajax({
        url: url,
        dataType: 'json',
        type: 'GET',
        success: function (data) {
            //   logger(data);
            nowNoteSelected = data;
            $("#info").html(nowNoteSelected.html);
            $('pre code').each(function (i, block) {
                hljs.highlightBlock(block);
            });
        }
    });
}

/**
 * аЄбаНаКбаИб аДаЛб аОбаПбаАаВаКаИ баОбаМб ббаЕаДббаВаАаМаИ Ajax
 * @author ааИаЗаАаЙаН бббаДаИб ox2.ru
 **/
function ajaxFormRequest(form_id, url, functionExecute) {
    jQuery.ajax({
        url: url, //ааДбаЕб аПаОаДаГббаЖаАаЕаМаОаЙ бббаАаНаИбб
        type: "POST", //аЂаИаП аЗаАаПбаОбаА
        dataType: "html", //аЂаИаП аДаАаНаНбб
        data: jQuery("#" + form_id).serialize(),
        success: function (response) { //абаЛаИ аВбаЕ аНаОбаМаАаЛбаНаО
            functionExecute();
        }
    });
}


function filterList(textFilter) {
    var textHtml = "";
    for (var i = 0; i < originalMass.size(); i++) {
        var textOnPage = originalMass[i].innerHTML;
        var textToPage = originalMass[i].outerHTML;
        var booleanContains = textOnPage.indexOf(textFilter) !== -1;
        if (booleanContains) {
            textHtml = textHtml + '<li>' + textToPage + '</li>';
        }
    }
    $('#menu').html(textHtml);
}

//аПаОаЛббаАаЕаМ аДаАбб аИ аВбаЕаМб аДаЛб аВаНаЕбаЕаНаИб аВ аа
function getDateTimeNowStr() {
    var dateNow = new Date();
    var year = dateNow.getFullYear();
    var month = '0' + (dateNow.getMonth() + 1);
    month = month.substring(month.length - 2, month.length);
    var day = '0' + dateNow.getDate();
    day = day.substring(day.length - 2, day.length);
    var hour = '0' + dateNow.getHours();
    hour = hour.substring(hour.length - 2, hour.length);
    var minutes = '0' + dateNow.getMinutes();
    minutes = minutes.substring(minutes.length - 2, minutes.length);
    var seconds = '0' + dateNow.getSeconds();
    seconds = seconds.substring(seconds.length - 2, seconds.length);

    var text = year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds;
    return text;
}


$(document).ready(function () {
    loadList();

    //баЛббаАбаЕаЛб аДаЛб аПаОаИбаКаА
    $('#find').keyup(function () {
        var textForFind = $(this)[0].value;
        filterList(textForFind);
    });
    //баЛббаАбаЕаЛб аНаА бббаЛаКаЕ
    $(document).on('click', 'li>.go', function () {
        var id = $(this).attr("id");

        //  logger(lastNoteSelected);
        if (typeof lastNoteSelected !== "undefined") {
            lastNoteSelected.parent().removeClass("active");
        }

        // logger($(this).parent());
        $(this).parent().addClass("active");

        lastSelectedId = id;
        lastNoteSelected = $(this);
        //  logger(lastSelectedId);
        loadSelectedLink(id);
    });

    //баЛббаАбаЕаЛб аНаА баЕаДаАаКбаИбаОаВаАаНаИаЕ
    $(document).on('click', '#buttonEdit', function () {
        // logger(nowNoteSelected);
        $('#nameEdit').val(nowNoteSelected.name);
        //$('#texEdit').summernote('code', nowNoteSelected.rawText);
        $('#texEdit').val(nowNoteSelected.rawText);
        $('#linkEdit').val(nowNoteSelected.link);
        $('#idForEdit').val(nowNoteSelected.id);
    });

    $(document).on('click', '#buttonDeleteNote', function () {
        result = confirm("Are you sure you want to delete a note?");
        if (result) {
            $.ajax({
                url: 'hideNote?id=' + nowNoteSelected.id,
                type: 'GET',
                success: function () {
                    loadList();
                    firstNoteSelect();
                }
            });
        }
    });




    $.fn.extend({
        insertAtCaret: function (myValue) {
            return this.each(function (i) {
                if (document.selection) {
                    //For browsers like Internet Explorer
                    this.focus();
                    var sel = document.selection.createRange();
                    sel.text = myValue;
                } else if (this.selectionStart || this.selectionStart === '0') {
                    //For browsers like Firefox and Webkit based
                    var startPos = this.selectionStart;
                    var endPos = this.selectionEnd;
                    var scrollTop = this.scrollTop;
                    this.value = this.value.substring(0, startPos) + myValue + this.value.substring(endPos, this.value.length);
                    this.focus();
                    this.selectionStart = startPos + myValue.length;
                    this.selectionEnd = startPos + myValue.length;
                    this.scrollTop = scrollTop;
                } else {
                    this.value += myValue;
                }
            });
        }
    });


    $(document).on('click', '#insertCodeToTextAdd',
            function () {
                $('#textInsert').insertAtCaret('[code:]LANG[:code]\n\n[/code]');
            });
    $(document).on('click', '#insertCodeToTextEdit',
            function () {
                $('#texEdit').insertAtCaret('[code:]LANG[:code]\n\n[/code]');
            });




});










