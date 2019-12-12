const baseUrl = 'http://localhost:8000/api/v1/';

function getFullPath(path) {

    path = path.replace(/^\/+|\/+$/g, '');
    path = path.replace(/\/{2,}/g, '/');
    return baseUrl + path + '/';

}

function makeRequest(path, method, auth=true, data=null) {
    let settings = {
        url: getFullPath(path),
        method: method,
        dataType: 'json'
    };
    if (data) {
        settings['data'] = JSON.stringify(data);
        settings['contentType'] = 'application/json';
    }
    if (auth) {
        settings.headers = {'Authorization': 'Token ' + getToken()};
    }
    return $.ajax(settings);
}

function saveToken(token) {
    localStorage.setItem('authToken', token);
}

function getToken() {
    return localStorage.getItem('authToken');
}

function removeToken() {
    localStorage.removeItem('authToken');
}

function logIn(username, password) {
    const credentials = {username, password};
    let request = makeRequest('login', 'post', false, credentials);
    request.done(function(data, status, response) {
        console.log('Received token');
        saveToken(data.token);
    }).fail(function(response, status, message) {
        console.log('Could not get token');
        console.log(response);
    });
}

$(document).ready(function() {
    let token = getToken();
    if (!token) logIn('admin', 'admin');
});