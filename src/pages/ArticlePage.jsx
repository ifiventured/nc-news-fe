import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    fetchArticleById,
    fetchCommentsByArticleId,
    patchArticleVotes,
} from "../api/api";
import CommentsList from "../components/CommentsList";

export default function ArticlePage() {
    const { article_id } = useParams();

    const [article, setArticle] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [err, setErr] = useState(null);

    const [votes, setVotes] = useState(0);
    const [votePending, setVotePending] = useState(false);
    const [voteErr, setVoteErr] = useState(null);

    const [comments, setComments] = useState([]);
    const [commentsLoading, setCommentsLoading] = useState(true);
    const [commentsErr, setCommentsErr] = useState(null);

    // fetch article
    useEffect(() => {
        setIsLoading(true);
        setErr(null);

        fetchArticleById(article_id)
            .then((data) => {
                setArticle(data);
                setVotes(data.votes);
            })
            .catch((e) => setErr(e.message || "Failed to load article"))
            .finally(() => setIsLoading(false));
    }, [article_id]);

    // fetch comments
    useEffect(() => {
        setCommentsLoading(true);
        setCommentsErr(null);

        fetchCommentsByArticleId(article_id)
            .then((data) => setComments(data))
            .catch((e) => setCommentsErr(e.message || "Failed to load comments"))
            .finally(() => setCommentsLoading(false));
    }, [article_id]);

    const handleVote = (inc) => {
        if (votePending) return;

        setVoteErr(null);
        setVotePending(true);

        // optimistic update
        setVotes((curr) => curr + inc);

        patchArticleVotes(article_id, inc)
            .then((updatedArticle) => {
                // sync to server value (source of truth)
                setVotes(updatedArticle.votes);
            })
            .catch((e) => {
                // rollback optimistic update
                setVotes((curr) => curr - inc);
                setVoteErr(e.message || "Vote failed");
            })
            .finally(() => setVotePending(false));
    };

    if (isLoading) return <p>Loading article...</p>;
    if (err) return <p style={{ color: "crimson" }}>{err}</p>;
    if (!article) return <p>Article not found</p>;

    return (
        <main style={{ padding: "16px", display: "grid", gap: "16px" }}>
            <h2 style={{ margin: 0 }}>{article.title}</h2>

            <p style={{ margin: 0 }}>
                {article.topic} • by {article.author} •{" "}
                {new Date(article.created_at).toLocaleString()}
            </p>

            {/* VOTING */}
            <section
                style={{
                    display: "flex",
                    gap: "12px",
                    alignItems: "center",
                    flexWrap: "wrap",
                }}
            >
                <strong>Votes: {votes}</strong>

                <button
                    type="button"
                    onClick={() => handleVote(1)}
                    disabled={votePending}
                    aria-label="Upvote article"
                >
                    +1
                </button>

                <button
                    type="button"
                    onClick={() => handleVote(-1)}
                    disabled={votePending}
                    aria-label="Downvote article"
                >
                    -1
                </button>

                {votePending ? <span>Saving vote…</span> : null}
                {voteErr ? (
                    <span style={{ color: "crimson" }}>{voteErr}</span>
                ) : null}
            </section>

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

            {/* COMMENTS SECTION */}
            <section style={{ marginTop: "16px" }}>
                <h3>Comments</h3>

                {commentsLoading && <p>Loading comments...</p>}
                {commentsErr && <p style={{ color: "crimson" }}>{commentsErr}</p>}
                {!commentsLoading && !commentsErr && (
                    <CommentsList comments={comments} />
                )}
            </section>
        </main>
    );
}
