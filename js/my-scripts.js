var b_CONSOLE_LOG = false;
//var s_URL_GET = 'https://www.prog-tools.ru:64646/git';
// var s_URL_GET = 'http://localhost:64646/git';
var s_URL_GET = 'source.json';

// var s_URL_POST_RAW = 'http://localhost:64646/git/raw';
var s_URL_POST_RAW = 'https://www.prog-tools.ru:64646/git/raw';

var RADIO_ALL = 'ALL';
var RADIO_PUBLIC = 'PUBLIC';
var RADIO_PRIVATE = 'PRIVATE';

var originalMass;

function logger(data) {
    if (b_CONSOLE_LOG) {
        console.log(data);
    }
}

function loadList() {
    logger("execute");
    changeInfo('<img src="../img/wait.gif"/> <label>Retrieve data...</label>');

    $.ajax({
        url: s_URL_GET,
        dataType: 'json',
        type: 'GET',
        success: function (data) {
            logger(data);
            var menu = "";
            var lastSelectedFinder;

            data.knowledges.forEach(function (item, i, arr) {
                menu = menu + generateLink(item, i);
            });
            changeInfo("<p>Last update: " + new Date(data.lastUpdate).toDateString() + "</p>");

            logger(menu);
            $("#menu").html(menu);
            originalMass = data.knowledges;
            logger(originalMass);

            filterList();
        }
    });
}

function changeInfo(msgInfo) {
    $("#lastUpdate").html(msgInfo);
}

function generateLink(item, id) {
    var text = "";
    if (item.public) {
        text =
            '<li class="block go">' +
            '   <div class="name-link"><a href="' + item.url + '">' + item.name + '</a></div>' +
            '   <div class="raw-url"><a href="' + item.rawUrl + '">[raw url]</a></div>' +
            '   <div class="descr">' + item.description + '</div>' +
            '<div class="show-raw" id="show_raw'+ id +'" onclick="loadRaw(\'' + item.rawUrl + '\', \'#collapse' + id + '\',\'#show_raw'+id+'\');">' +
            'show raw' +
            '</div>' +
            '<div id="collapse' + id + '" class="show-raw-collapse" style="display: none">' +
            '</div>' +
            '</li>';
    } else {
        text =
            '<li class="block go">' +
            '   <div class="private-img" onclick="dgKeyboard.showOrHide(this);"></div>' +
            '   <div class="name-link"><a href="' + item.url + '">' + item.name + '</a></div>' +
            '   <div class="raw-url"><a href="' + item.rawUrl + '">[raw url]</a></div>' +
            '   <div class="descr">' + item.description + '</div>' +
            '</li>';

    }


    return text;
}

function loadRaw(hashData, idComponentToRender, idButtonShow) {
    var idCol = document.querySelector(idComponentToRender);
    var idButton = document.querySelector(idButtonShow);
    if(idCol.style.display == "none"){
        idCol.style.display = "block";
        idButton.innerHTML = "hide raw";
        idButton.style.backgroundImage = "url(./img/if_arrow_up2_1814087.png)";
    }else {
        idCol.style.display = "none";
        idButton.innerHTML = "show raw";
        idButton.style.backgroundImage = "url(./img/if_arrow_down_1814087.png)";
        clearRaw(idComponentToRender);
    }
    idCol.innerHTML = '<img src="../img/wait.gif"/> <label>Retrieve data...</label>';

    $.ajax({
        url: s_URL_POST_RAW,
        dataType: 'json',
        data: {'hash': hashData},
        type: 'POST',
        success: function (data) {
            idCol.innerHTML = '<pre>' + data.text + '</pre>';
        }
    });
}

function clearRaw(idComponentToRender) {
    var idCol = document.querySelector(idComponentToRender);
    idCol.innerHTML = '';
}

function filterList() {
    var textHtml = "";
    var filterObject = createFilterObject();
    for (var i = 0; i < originalMass.length; i++) {
        var objectValue = originalMass[i];
        logger(objectValue);

        var bNameContains = isNameContains(objectValue, filterObject);
        var bScopeRepo = isShowAsRepoState(objectValue, filterObject);

        if (bNameContains && bScopeRepo) {
            textHtml = textHtml + generateLink(objectValue, i);
        }
    }

    logger(textHtml);
    $('#menu').html(textHtml);
}

function isNameContains(objectValue, filterObject) {
    var booleanContains =
        objectValue
            .name
            .toLowerCase()
            .indexOf(filterObject.text.toLowerCase()) !== -1 || filterObject.text == '';

    return booleanContains;
}

function isShowAsRepoState(objectValue, filterObject) {
    var bFlag = false;
    if (filterObject.radio == RADIO_ALL) {
        bFlag = true;
    } else if (filterObject.radio == RADIO_PUBLIC && objectValue.public) {
        bFlag = true;
    } else if (filterObject.radio == RADIO_PRIVATE && !objectValue.public) {
        bFlag = true;
    }

    return bFlag;
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
        filterList();
    });
});

function createFilterObject() {
    logger($('#find')[0].value);
    logger($('#radioAll').is(':checked'));
    logger($('#radioPublic').is(':checked'));
    logger($('#radioPrivate').is(':checked'));

    var filterData = new Object();
    filterData.radio =
        $('#radioAll').is(':checked') ?
            RADIO_ALL :
            $('#radioPublic').is(':checked') ?
                RADIO_PUBLIC : RADIO_PRIVATE;
    filterData.text = $('#find')[0].value;

    logger(filterData);

    return filterData;
}
