import { useEffect, useState } from "react";
import { fetchTopics } from "../api";

export default function Topics() {
    const [topics, setTopics] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [err, setErr] = useState(null);

    useEffect(() => {
        setIsLoading(true);
        fetchTopics()
            .then((data) => {
                setTopics(data);
                setErr(null);
            })
            .catch(() => {
                setErr("Failed to load topics");
            })
            .finally(() => setIsLoading(false));
    }, []);

    if (isLoading) return <p>Loading topics…</p>;
    if (err) return <p>{err}</p>;

    return (
        <ul>
            {topics.map((topic) => (
                <li key={topic.slug}>
                    <strong>{topic.slug}</strong>: {topic.description}
                </li>
            ))}
        </ul>
    );



}

