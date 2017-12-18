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
    logger(el);
    el.click();
}

function loadList() {
    $.ajax({
        //change to https
        url: 'https://www.prog-tools.ru:64646/git',
        // url: 'source.json',
        dataType: 'json',
        type: 'GET',
        success: function (data) {
            logger(data);
            var menu = "";
            var lastSelectedFinder;

            data.knowledges.forEach(function (item, i, arr) {
//                if (typeof lastNoteSelected !== "undefined") {
//                    logger(item.id);
//                    logger(lastNoteSelected.attr("id"));
//                    var idFinder = lastNoteSelected.attr("id");
//                    logger(item.id + " : " + idFinder);
//                    if (item.id == idFinder) {
//                        lastSelectedFinder = lastNoteSelected;
//                    }
//                }
//                menu = menu +  "<li><a class=\"go\" id = \"495\">-app-circle-app-zip<\/a><\/li>";
                menu = menu + generateLink(item);
            });

            $("#lastUpdate").html("<p>Last update: " + data.lastUpdate + "</p>");

            logger(menu);
            $("#menu").html(menu);
            originalMass = data.knowledges;
            logger(originalMass);

            // var valFromFindeField = $("#find")[0].value;
            // if (valFromFindeField !== "") {
            //     filterList(valFromFindeField);
            // }
            //
            // if (typeof lastSelectedFinder === "undefined") {
            //     firstNoteSelect();
            // } else {
            //     lastNoteSelected = $("a[id$='" + lastNoteSelected.attr("id"));
            //     $(lastNoteSelected).parent().addClass("active");
            //     logger(lastSelectedFinder);
            // }
        }
    });
}

function generateLink(item) {
    var text = "";
    if (item.public) {
        text =
            '<li class="block go">' +
            '   <div class="name-link"><a href="' + item.url + '">' + item.name + '</a></div>' +
            '   <div class="raw-url"><a href="' + item.rawUrl + '">[raw url]</a></div>' +
            '   <div class="descr">' + item.description + '</div>' +
            '</li>';
    } else {
        text =
            '<li class="block go">' +
            '   <div class="private-img"></div>' +
            '   <div class="name-link"><a href="' + item.url + '">' + item.name + '</a></div>' +
            '   <div class="raw-url"><a href="' + item.rawUrl + '">[raw url]</a></div>' +
            '   <div class="descr">' + item.description + '</div>' +
            '</li>';

    }

    return text;
}


function loadSelectedLink(id) {
    var url = 'responseToMyPage?id=' + id;
    $.ajax({
        url: url,
        dataType: 'json',
        type: 'GET',
        success: function (data) {
            logger(data);
            nowNoteSelected = data;
            $("#info").html(nowNoteSelected.html);
            $('pre code').each(function (i, block) {
                hljs.highlightBlock(block);
            });
        }
    });
}

function filterList(textFilter) {
    var textHtml = "";
    for (var i = 0; i < originalMass.length; i++) {
        var textOnPage = originalMass[i];
        logger("textOnPage: " + textOnPage);
        var booleanContains =
            textOnPage
                .name
                .toLowerCase()
                .indexOf(textFilter.toLowerCase()) !== -1;
        if (booleanContains) {
            var val = originalMass[i];
            textHtml = textHtml + generateLink(val);
        }
    }

    logger(textHtml);
    $('#menu').html(textHtml);
}

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

    $('#find').keyup(function () {
        var textForFind = $(this)[0].value;
        logger(textForFind);
        filterList(textForFind);
    });

    $(document).on('click', 'li>.go', function () {
        var id = $(this).attr("id");

        logger(lastNoteSelected);
        if (typeof lastNoteSelected !== "undefined") {
            lastNoteSelected.parent().removeClass("active");
        }

        logger($(this).parent());
        $(this).parent().addClass("active");

        lastSelectedId = id;
        lastNoteSelected = $(this);
        logger(lastSelectedId);
        loadSelectedLink(id);
    });

    $(document).on('click', '#buttonEdit', function () {
        logger(nowNoteSelected);
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










