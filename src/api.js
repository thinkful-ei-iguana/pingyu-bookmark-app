const BASE_URL = 'https://thinkful-list-api.herokuapp.com/pingyu';


const apiFetch = function(...args) {
    let error;
    return fetch(...args)
        .then(res => {
            if (!res.ok) {
                error = { code: res.status };
                if (!res.headers.get('content-type').includes('json')) {
                    return Promise.reject(error);
                }
            }
            return res.json();
        })
        .then(data => {
            if (error) {
                error.message = data.message;
                return Promise.reject(error);
            }
            return data;
        });
};

const getBookmarks = function() {
    return apiFetch(`${BASE_URL}/bookmarks`);
};

const addBookmark = function(data) {
    return apiFetch(`${BASE_URL}/bookmarks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: data
    });
};

const deleteBookmark = function(id) {
    return apiFetch(`${BASE_URL}/bookmarks/${id}`, {
        method: 'DELETE'
    });
};

const updateBookmark = function(id, data) {
    return apiFetch(`${BASE_URL}/bookmarks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: data
    });
};

export default {
    getBookmarks,
    addBookmark,
    deleteBookmark,
    updateBookmark
};