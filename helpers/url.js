export function parseUrl(url) {
    let pattern = RegExp("^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?");
    let matches = url.match(pattern);
    return {
        scheme: matches[2],
        authority: matches[4],
        path: matches[5],
        query: matches[7],
        fragment: matches[9]
    };
}

export function createUrl(message) {
    let protocolRegex = /(https?:\/\/)/g;
    let urlRegex = /(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/g;
    let url = message.match(urlRegex);
    if (!url) return null
    return (url[0] && !url[0].match(protocolRegex) ? `http://${url[0]}` : url[0])
}
