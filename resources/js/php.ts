let makeRequest = (request) => {
    return fetch(request);
}

export function setPhpCallback(newHandler) {
    makeRequest = newHandler;
}

export function getPhpCallback() {
    return makeRequest;
}

export function php(strings, ...params) {
    const options = {};
    options.url = options.url || '/handler';
    options.body = options.body || {};
    options.body._hash = strings[0];
    options.body._params = params;
    
    return getPhpCallback()(options);
}

export function phpEventHandler(strings, ...params) {
    return (options={}) => {
        if (options instanceof FormData) {
            options = {body: Object.fromEntries(options.entries())};
        }
        
        if (options instanceof SubmitEvent) {
            options = {body: Object.fromEntries(options.formData.entries())};
        }
        
        options.url = options.url || '/handler';
        options.body = options.body || {};
        options.body._hash = strings[0];
        options.body._params = params;
        
        return getPhpCallback()(options);
    }
}

export function compose(...codes) {

}
