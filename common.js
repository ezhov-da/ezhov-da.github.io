function getUrl(localUrl, remoteUrl) {
    var href = window.location.href;
    if (href.startsWith("file:")) {
        return localUrl;
    } else {
        return remoteUrl;
    }
}