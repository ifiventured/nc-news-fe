import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    fetchArticleById,
    fetchCommentsByArticleId,
    patchArticleVotes,
    postCommentByArticleId,
} from "../api/api";
import CommentsList from "../components/CommentsList";
import CommentForm from "../components/CommentForm";

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

    const [postPending, setPostPending] = useState(false);
    const [postErr, setPostErr] = useState(null);

    //temporary
    const username = "tickle122";

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

        setVotes((curr) => curr + inc);

        patchArticleVotes(article_id, inc)
            .then((updated) => setVotes(updated.votes))
            .catch((e) => {
                setVotes((curr) => curr - inc);
                setVoteErr(e.message || "Vote failed");
            })
            .finally(() => setVotePending(false));
    };

    const handlePostComment = (body) => {
        setPostPending(true);
        setPostErr(null);

        // optimistic insrt (temporary comment at top)
        const tempComment = {
            comment_id: `temp-${Date.now()}`,
            author: username,
            body,
            votes: 0,
            created_at: new Date().toISOString(),
        };

        setComments((curr) => [tempComment, ...curr]);

        return postCommentByArticleId(article_id, username, body)
            .then((newComment) => {
                // replace temp comment with real one from API
                setComments((curr) => {
                    const withoutTemp = curr.filter((c) => c.comment_id !== tempComment.comment_id);
                    return [newComment, ...withoutTemp];
                });
            })
            .catch((e) => {
                // rollback
                setComments((curr) => curr.filter((c) => c.comment_id !== tempComment.comment_id));
                setPostErr(e.message || "Failed to post comment");
                throw e;
            })
            .finally(() => setPostPending(false));
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

            <section style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                <strong>Votes: {votes}</strong>

                <button type="button" onClick={() => handleVote(1)} disabled={votePending}>
                    +1
                </button>

                <button type="button" onClick={() => handleVote(-1)} disabled={votePending}>
                    -1
                </button>

                {votePending ? <span>Saving vote…</span> : null}
                {voteErr ? <span style={{ color: "crimson" }}>{voteErr}</span> : null}
            </section>

            {article.article_img_url ? (
                <img
                    src={article.article_img_url}
                    alt=""
                    style={{ width: "100%", maxHeight: 320, objectFit: "cover", borderRadius: 8 }}
                />
            ) : null}

            <p style={{ margin: 0 }}>{article.body}</p>

            <section style={{ marginTop: "16px", display: "grid", gap: "12px" }}>
                <h3 style={{ margin: 0 }}>Comments</h3>

                <CommentForm onSubmit={handlePostComment} isSubmitting={postPending} />
                {postErr ? <p style={{ color: "crimson", margin: 0 }}>{postErr}</p> : null}

                {commentsLoading && <p>Loading comments...</p>}
                {commentsErr && <p style={{ color: "crimson" }}>{commentsErr}</p>}
                {!commentsLoading && !commentsErr && <CommentsList comments={comments} />}
            </section>
        </main>
    );
}
