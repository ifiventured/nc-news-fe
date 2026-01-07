// FRONTEND: src/pages/ArticlePage.jsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchArticleById } from "../api/api";

export default function ArticlePage() {
    const { article_id } = useParams();

    const [article, setArticle] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [err, setErr] = useState(null);

    useEffect(() => {
        setIsLoading(true);
        setErr(null);

        fetchArticleById(article_id)
            .then((data) => setArticle(data))
            .catch((e) => setErr(e.message || "Failed to load article"))
            .finally(() => setIsLoading(false));
    }, [article_id]);

    if (isLoading) return <p>Loading article...</p>;
    if (err) return <p style={{ color: "crimson" }}>{err}</p>;
    if (!article) return <p>Article not found</p>;

    return (
        <main style={{ padding: "16px", display: "grid", gap: "12px" }}>
            <h2 style={{ margin: 0 }}>{article.title}</h2>

            <p style={{ margin: 0 }}>
                {article.topic} • by {article.author} •{" "}
                {new Date(article.created_at).toLocaleString()}
            </p>

            <p style={{ margin: 0 }}>votes: {article.votes}</p>

            {article.article_img_url ? (
                <img
                    src={article.article_img_url}
                    alt=""
                    style={{
                        width: "100%",
                        maxHeight: 320,
                        objectFit: "cover",
                        borderRadius: 8,
                    }}
                />
            ) : null}

            <p style={{ margin: 0 }}>{article.body}</p>
        </main>
    );
}
