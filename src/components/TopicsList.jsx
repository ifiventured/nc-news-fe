export default function TopicsList({ topics }) {
    return (
        <ul>
            {topics.map((topic) => (
                <li key={topic.slug}>
                    <strong>{topic.slug}</strong> — {topic.description}
                </li>
            ))}
        </ul>
    );
}
