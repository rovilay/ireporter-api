const urlValidator = (url=[], checkEmpty=false) => {
    const invalidUrls = [];
    let err;

    const urls = typeof url === 'string' ? [url] : url;
    if (url && url.length) {
        urls.forEach(uri => {
            const valid = checkUrl(uri);
            if (!valid) {
                invalidUrls.push(uri);
                err = {
                    msg: 'invalid url(s)',
                    invalidUrls
                };
            }
        });
    } else if (!url || (!url.length && checkEmpty)){
        err = 'url is required!';
    }

    return err;
}

const checkUrl = (url, checkEmpty=false) => {
    let valid = true;
        
    if (url) {
        const regex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
        valid = regex.test(url);
    } else if (!url && checkEmpty) {
        valid = false;
    }

    return valid;
}

module.exports = {
    urlValidator,
    checkUrl
};
