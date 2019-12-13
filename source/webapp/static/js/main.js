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
        formModal.modal('hide');
        enterLink.addClass('d-none');
        exitLink.removeClass('d-none');
    }).fail(function(response, status, message) {
        console.log('Could not get token');
        console.log(response.responseText);
    });
}

function logOut() {
    let request = makeRequest('logout', 'post', true);
    request.done(function(data, status, response) {
        console.log('Cleaned token');
        removeToken();
        enterLink.removeClass('d-none');
        exitLink.addClass('d-none');
    }).fail(function(response, status, message) {
        console.log('Could not clean token');
        console.log(response.responseText);
    });
}

let logInForm, homeLink,  enterLink, exitLink, quoteForm, createLink, quoteEditForm,
    formSubmit, formTitle, content, formModal, usernameInput, passwordInput,
    authorInput, textInput, emailInput,textEditInput,statusVal,ratingInput;

function setUpGlobalVars() {
    logInForm = $('#log_in_form');
    homeLink = $('#home_link');
    enterLink = $('#enter_link');
    exitLink = $('#exit_link');
    formSubmit = $('#form_submit');
    formTitle = $('#form_title');
    content = $('#content');
    formModal = $('#form_modal');
    usernameInput = $('#username_input');
    passwordInput = $('#password_input');
    quoteForm = $('#quote_form');
    createLink = $('#create_link');
    authorInput = $('#author_input');
    textInput = $('#text_input');
    emailInput = $('#email_input');
    quoteEditForm = $('#quote_edit_form');
    textEditInput = $('#text_edit_input');
    statusVal = $('#status');
    ratingInput = $('#rating_input');
}

function setUpAuth() {
    logInForm.on('submit', function(event) {
        event.preventDefault();
        logIn(usernameInput.val(), passwordInput.val());
    });

    enterLink.on('click', function(event) {
        event.preventDefault();
        logInForm.removeClass('d-none');
        quoteForm.addClass('d-none');
        quoteEditForm.addClass('d-none');
        formTitle.text('Login');
        formSubmit.text('Login');
        formSubmit.off('click');
        formSubmit.on('click', function(event) {
            logInForm.submit();
        });
    });

    exitLink.on('click', function(event) {
        event.preventDefault();
        logOut();
    });
}

function checkAuth() {
    let token = getToken();
    if(token) {
        enterLink.addClass('d-none');
        exitLink.removeClass('d-none');
    } else {
        enterLink.removeClass('d-none');
        exitLink.addClass('d-none');
    }
}

function rateUp(id) {
    let request = makeRequest('quote/' + id + '/rate_up', 'post', false);
    request.done(function(data, status, response) {
        console.log('Rated up quote with id ' + id + '.');
        $('#rating_' + id).text("Rating: " + data.rating);
    }).fail(function(response, status, message) {
        console.log('Could not rate up quote with id ' + id + '.');
        console.log(response.responseText);
    });
}

function rateDown(id) {
    let request = makeRequest('quote/' + id + '/rate_down', 'post', false);
    request.done(function(data, status, response) {
        console.log('Rated up quote with id ' + id + '.');
        $('#rating_' + id).text("Rating: " + data.rating);
    }).fail(function(response, status, message) {
        console.log('Could not rate down quote with id ' + id + '.');
        console.log(response.responseText);
    });
}

function createQuote(text, author, email) {
    let token = getToken();
    const credentials = {text, author, email};
    if (token) {request = makeRequest('quote', 'post', true, credentials);}
    else{request = makeRequest('quote', 'post', false, credentials);}
    request.done(function (data) {
        formModal.modal('hide');
        content.empty();
        getQuotes();
    }).fail(function (response, status, message) {
        console.log('Quote not added!');
        console.log(response.responseText);
    });
}

function setUpCreateQuote(){
    quoteForm.on('submit', function(event) {
        event.preventDefault();
        createQuote(textInput.val(), authorInput.val(), emailInput.val());
    });

    createLink.on('click', function(event) {
        event.preventDefault();
        logInForm.addClass('d-none');
        quoteForm.removeClass('d-none');
        quoteEditForm.addClass('d-none');
        formTitle.text('Add');
        formSubmit.text('Save');
        formSubmit.off('click');
        formSubmit.on('click', function(event) {
            quoteForm.submit()
        });
    });
}

function editQuote(id, text, status, rating) {
    const credentials = {text, status, rating};
    let request = makeRequest('quote/' + id, 'patch', true, credentials);
    request.done(function (data) {
        formModal.modal('hide');
        content.empty();
        getQuotes();
    }).fail(function (response, status, message) {
        console.log('Quote not changed!');
        console.log(response.responseText);
    });
}

function setUpEditQuote(item){
    textEditInput.val(item.text);
    ratingInput.val(item.rating);
    statusVal.val(item.status);
    let updateLink = $('#edit_' + item.id);
    quoteEditForm.on('submit', function(event) {
        event.preventDefault();
        editQuote(item.id, textEditInput.val(), statusVal.val(), ratingInput.val());
    });

    event.preventDefault();
    logInForm.addClass('d-none');
    quoteForm.addClass('d-none');
    quoteEditForm.removeClass('d-none');
    formTitle.text('Edit');
    formSubmit.text('Update');
    formSubmit.off('click');
    formSubmit.on('click', function(event) {
        quoteEditForm.submit()
    });

}

function deleteQuote(id){
    let request =  makeRequest('quote/' + id, 'delete', true);
    request.done(function(item) {
        content.empty();
        getQuotes()
    }).fail(function(response, status, message){
        console.log('Quote can not be deleted!');
        console.log(response.responseText);
    });
}

function getQuotes() {
    let request = makeRequest('quote', 'get', false);
    let token = getToken();
    if (token) {
        request = makeRequest('quote', 'get', true);
        request.done(function (data, status, response) {
            content.empty();
            console.log(data);
            data.forEach(function (item, index, array) {
                content.append($(`<div class="card" style="margin-top: 20px; padding: 10px" id="quote_${item.id}">
                    <p>${item.text}</p>
                    <a href="#" id="detail_${item.id}">More...</a>
                    <p id="rating_${item.id}">Rating: ${item.rating}</p>
                    <p><a href="#" class="btn btn-secondary" style="width: 35px" id="rate_up_${item.id}">+</a>
                    <a href="#" class="btn btn-secondary" style="width: 35px" id="rate_down_${item.id}">-</a>
                    <a class="btn btn-secondary" style="width: 105px" href="#" id="edit_${item.id}" data-toggle="modal" data-target="#form_modal">Edit</a>
                    <a class="btn btn-secondary" style="width: 105px" href="#" id="delete_${item.id}">Delete</a></p>
                </div>`));
                $('#detail_' + item.id).on('click', function (event) {
                    console.log('click');
                    event.preventDefault();
                    getOneQuote(item.id);
                });
                $('#rate_up_' + item.id).on('click', function (event) {
                    console.log('click');
                    event.preventDefault();
                    rateUp(item.id);
                });
                $('#rate_down_' + item.id).on('click', function (event) {
                    console.log('click');
                    event.preventDefault();
                    rateDown(item.id);
                });
                $('#edit_' + item.id).on('click', function (event) {
                    console.log('click');
                    event.preventDefault();
                    setUpEditQuote(item);
                });
                $('#delete_' + item.id).on('click', function (event) {
                    console.log('click');
                    event.preventDefault();
                    deleteQuote(item.id);
                });
            });
        }).fail(function (response, status, message) {
                console.log('Could not get quotes.');
                console.log(response.responseText);
            });
    }
}

function getOneQuote(id) {
    let request = makeRequest('quote/' + id, 'get', true);
    request.done(function (item) {
        content.empty();
        content.append($(`<div class="card" style="margin-top: 20px; padding: 10px" id="quote_${item.id}">
                <p>${item.text}</p>
                <p>Author: ${item.author}</p>
                <p>Status: ${item.status}</p>
                <p id="rating_${item.id}">Rating: ${item.rating}</p>
                <p><a href="#" class="btn btn-secondary" style="width: 35px" id="rate_up_${item.id}">+</a>
                <a href="#" class="btn btn-secondary" style="width: 35px" id="rate_down_${item.id}">-</a>
                <a href="#" class="btn btn-secondary" style="width: 105px" id ="edit_${item.id}" data-toggle="modal" data-target="#form_modal">Edit</a>
                <a href="#" class="btn btn-secondary" style="width: 105px" id ="delete_${item.id}">Delete</a>
                <a href="#" class="btn btn-secondary" style="width: 105px" id ="back_${item.id}">Back</a></p>
            </div>`));
        $('#rate_up_' + item.id).on('click', function (event) {
            console.log('click');
            event.preventDefault();
            rateUp(item.id);
        });
        $('#rate_down_' + item.id).on('click', function (event) {
            console.log('click');
            event.preventDefault();
            rateDown(item.id);
        });
        $('#edit_' + item.id).on('click', function(event) {
            console.log('click');
            event.preventDefault();
            setUpEditQuote(item);
        });
        $('#delete_' + item.id).on('click', function(event) {
            console.log('click');
            event.preventDefault();
            deleteQuote(item.id);
        });
        $('#back_' + item.id).on('click', function (event) {
            console.log('click');
            event.preventDefault();
            content.empty();
            getQuotes();
        });
    }).fail(function (response, status, message) {
        console.log('Quote is unavailable!');
        console.log(response.responseText);
    });
}

$(document).ready(function() {
    setUpGlobalVars();
    setUpAuth();
    checkAuth();
    getQuotes();
    getOneQuote();
    setUpCreateQuote();
    setUpEditQuote();
});