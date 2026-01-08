export default function CommentsList({ comments }) {
    if (comments.length === 0) return <p>No comments yet.</p>;

    return (
        <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: "12px" }}>
            {comments.map((c) => (
                <li
                    key={c.comment_id}
                    style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}
                >
                    <p style={{ margin: "0 0 8px" }}>
                        <strong>{c.author}</strong> •{" "}
                        {new Date(c.created_at).toLocaleString()} • votes: {c.votes}
                    </p>
                    <p style={{ margin: 0 }}>{c.body}</p>
                </li>
            ))}
        </ul>
    );
}
