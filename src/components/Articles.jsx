import { useEffect, useState } from "react";
import { fetchArticles } from "../api";

export default function Articles() {
    const [articles, setArticles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [err, setErr] = useState(null);

    useEffect(() => {
        setIsLoading(true);
        fetchArticles()
            .then(setArticles)
            .catch(() => setErr("Failed to load articles"))
            .finally(() => setIsLoading(false));
    }, []);

    if (isLoading) return <p>Loading articles...</p>;
    if (err) return <p>{err}</p>;

    return (
        <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: "12px" }}>
            {articles.map((a) => (
                <li key={a.article_id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
                    <h3 style={{ margin: "0 0 8px" }}>{a.title}</h3>
                    <p style={{ margin: "0 0 8px" }}>
                        {a.topic} • by {a.author}
                    </p>
                    <p style={{ margin: "0 0 8px" }}>
                        {new Date(a.created_at).toLocaleString()} • votes: {a.votes} • comments: {a.comment_count}
                    </p>
                    {a.article_img_url ? (
                        <img
                            src={a.article_img_url}
                            alt=""
                            style={{ width: "100%", maxHeight: 240, objectFit: "cover", borderRadius: 6 }}
                        />
                    ) : null}
                </li>
            ))}
        </ul>
    );
}
