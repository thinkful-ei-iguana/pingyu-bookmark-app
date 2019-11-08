import api from './api';
import bookmark from './bookmark';
import store from './store';
import './index.css';
import $ from 'jquery';

const main = function() {
    api.getBookmarks()
        .then(response => {
            store.list = response;
            bookmark.render();
        })
        .catch(error => {
            bookmark.renderError(error.message);
        });

    bookmark.bindEventListeners();
};

$(main);