const BASE_URL = "http://localhost:9090/api";

export const fetchTopics = () => {
    return fetch(`${BASE_URL}/topics`).then((res) => {
        if (!res.ok) throw new Error("Failed to fetch topics");
        return res.json();
    }).then((data) => data.topics);
};

export const patchArticleVotes = (article_id, inc_votes) => {
    return fetch(`${BASE_URL}/articles/${article_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inc_votes }),
    }).then(async (res) => {
        if (!res.ok) {
            let body = {};
            try {
                body = await res.json();
            } catch {
                body = {};
            }
            const msg = body.msg || `Request failed (${res.status})`;
            throw new Error(msg);
        }
        return res.json().then((data) => data.article);
    });
};

export const fetchArticles = () => {
    return fetch(`${BASE_URL}/articles`).then((res) => {
        if (!res.ok) throw new Error("Failed to fetch articles");
        return res.json();
    }).then((data) => data.articles);
};

export const fetchArticleById = (article_id) => {
    return fetch(`${BASE_URL}/articles/${article_id}`).then((res) => {
        if (!res.ok) throw new Error("Failed to fetch article");
        return res.json();
    }).then((data) => data.article);
};

export const fetchCommentsByArticleId = (article_id) => {
    return fetch(`${BASE_URL}/articles/${article_id}/comments`).then((res) => {
        if (!res.ok) throw new Error("Failed to fetch comments");
        return res.json();
    }).then((data) => data.comments);
};


