import { useState } from "react";

export default function CommentForm({ onSubmit, isSubmitting }) {
    const [body, setBody] = useState("");
    const [localErr, setLocalErr] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLocalErr(null);

        if (body.trim() === "") {
            setLocalErr("Comment cannot be empty");
            return;
        }

        onSubmit(body.trim())
            .then(() => setBody(""))
            .catch(() => {
                // error handled by parent
            });
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "8px" }}>
            <label>
                <span style={{ display: "block", marginBottom: 6 }}>Add a comment</span>
                <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={4}
                    placeholder="Write your comment..."
                    style={{ width: "100%", padding: 10, borderRadius: 8 }}
                    disabled={isSubmitting}
                />
            </label>

            {localErr ? <p style={{ color: "crimson", margin: 0 }}>{localErr}</p> : null}

            <button type="submit" disabled={isSubmitting || body.trim() === ""}>
                {isSubmitting ? "Posting..." : "Post comment"}
            </button>
        </form>
    );
}
