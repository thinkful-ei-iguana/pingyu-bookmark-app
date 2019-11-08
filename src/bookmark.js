import $ from 'jquery';
import store from './store';
import api from './api';
import displayPage from './displayPage';



$.prototype.extend({
    serializeJson: function() {
        const formData = new FormData(this[0]);
        const obj = {};
        formData.forEach((val, name) => obj[name] = val);
        return JSON.stringify(obj);
    }
});

const buildBookmarkHtml = function(bookmark) {
    if (bookmark.isEditing) {
        return displayPage.editForm(bookmark);
    } else if (bookmark.isExpanded) {
        return displayPage.expandedView(bookmark);
    } else {
        return displayPage.listView(bookmark);
    }
};

const render = function(filteredList = null) {
    if (store.isAdding) {
        $('#js-form').html(displayPage.form());
        $('#js-form').show();
    } else {
        $('#js-form').html('');
        $('#js-form').hide();
    }
    if (!store.list.length) {
        $('.js-list-header').html('');
        $('.js-bookmark-list').html('');
        return $('.js-no-bookmarks-intro').html(displayPage.noBookmarks());
    }

    const bookmarks = filteredList ? filteredList : store.list;
    const bookmarkTemplate = bookmarks.map(bookmark => buildBookmarkHtml(bookmark));
    console.log(bookmarks);
    $('.js-no-bookmarks-intro').html('');
    $('.js-list-header').html(displayPage.listHeader());
    $('.js-bookmark-list').html(bookmarkTemplate);
};

const renderError = function(message) {
    $('.js-error-message').html(displayPage.error(message));
    $('.js-error-message').show();
};


const formSubmit = function() {
    $('.container').on('submit', 'form#js-form', function(e) {
        e.preventDefault();
        const data = $(e.target).serializeJson();
        api.addBookmark(data)
            .then(bookmark => {
                store.addBookmark(bookmark);
                render();
            })
            .catch(error => {
                renderError(error.message);
            });
    });
};

const filterByRating = function() {
    $('.container').on('change', 'select', function() {
        const rating = $(this).val();
        const filteredList = store.filterByRating(rating);
        render(filteredList);
    });
};

const displayForm = function() {
    $('.container').on('click', '#new-bookmark', function() {
        store.isAdding = true;
        render();
    });
};

const formClose = function() {
    $('.container').on('click', '#close-form', function() {
        store.isAdding = false;
        render();
    });
};

const toggleBookmarkView = function() {
    $('.js-bookmark-list').on('click', '.header', function() {
        const id = $(this).closest('li').data('id');
        store.expandedView(id);
        render();
    });
};

const bookmarkDelete = function() {
    $('.js-bookmark-list').on('click', '.remove-bookmark', function() {
        const id = $(this).closest('li').data('id');
        api.deleteBookmark(id)
            .then(() => {
                store.deleteBookmark(id);
                render();
            })
            .catch(error => {
                renderError(error.message);
            });
    });
};

const closeError = function() {
    $('.container').on('click', '#close-error-msg', function() {
        $(this).closest('div').hide();
    });
};

const toggleEditForm = function() {
    $('.js-bookmark-list').on('click', '.edit-bookmark', function() {
        const id = $(this).closest('li').data('id');
        store.toggleEditing(id);
        render();
    });
};

const editFormSubmit = function() {
    $('.js-bookmark-list').on('submit', 'form#js-edit-form', function(e) {
        e.preventDefault();
        const id = $(this).closest('li').data('id');
        const data = $(e.target).serializeJson();
        api.updateBookmark(id, data)
            .then(() => {
                store.updateBookmark(id, data);
                render();
            })
            .catch(error => {
                renderError(error.message);
            });
    });
};




const bindEventListeners = function() {
    displayForm();
    formClose();
    formSubmit();
    toggleBookmarkView();
    bookmarkDelete();
    filterByRating();
    closeError();
    toggleEditForm();
    editFormSubmit();
};

// This object contains the only exposed methods from this module:
export default {
    bindEventListeners,
    render,
    renderError
};