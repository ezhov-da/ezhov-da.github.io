var hotKeys = null;
var keysColor = {
    'ctrl': 'blue',
    'shift': 'orange',
    'alt ': 'green',
    'space': 'red',
    'insert': 'gray',
    'enter': 'brown'
};

function createDocument() {
    var contentsCommonHtml = '';
    var counterContent = 0;
    var commonPanels = '';
    for (title in hotKeys) {
        contentsCommonHtml =
            contentsCommonHtml +
            '<li> <a href="#' + counterContent + '">' + title + '</a></li>';
        var panelStart =
            '<div class="panel panel-default">' +
            '    <div class="panel-heading">' +
            '        <h3 class="panel-title"><a id="' + counterContent + '"></a>' + title + ' (' + Object.keys(hotKeys[title]).length + ')</h3>' +
            '    </div>' +
            '<table class="table">' +
            '<tbody>';
        for (key in hotKeys[title]) {
            var keyColor = setColorToKey(key);
            var keyDescription = hotKeys[title][key];
            var hotKeyHtml =
                '  <tr>' +
                '    <td width="30%">' + keyColor + '</td>' +
                '    <td width="70%">' + keyDescription + '</td>' +
                '  </tr>';
            panelStart = panelStart + hotKeyHtml;
        }
        counterContent++;
        var panelEnd =
            '</tbody>' +
            '</table>' +
            '</div>';
        commonPanels = commonPanels + panelStart + panelEnd;
    }
    var hotKeysElement = document.getElementById('hotKeys');
    hotKeysElement.innerHTML = commonPanels;
    var contentsElement = document.getElementById('contents');
    contentsElement.innerHTML = contentsCommonHtml;
}

function setColorToKey(key) {
    var lowerCaseKey = key.toLowerCase();
    var keyColor = lowerCaseKey;
    for (c in keysColor) {
        keyColor = keyColor.replace(c, '<font color="' + keysColor[c] + '">' + c + '</font>');
    }
    return keyColor;
}

document.addEventListener('DOMContentLoaded', function () {
    var url = 'https://raw.githubusercontent.com/ezhov-da/hot-keys/master/hot-keys.json';
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE & xhr.status == 200) {
            var respnseText = xhr.responseText;
            hotKeys = JSON.parse(respnseText);
            createDocument();
        }
    }
    xhr.send();
});
