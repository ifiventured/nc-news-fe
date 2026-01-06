import { useEffect, useState } from "react";
import { fetchTopics } from "./api/api";
import Header from "./components/Header";
import TopicsList from "./components/TopicsList";

export default function App() {
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    setErr(null);

    fetchTopics()
      .then((data) => {
        setTopics(data);
      })
      .catch((e) => {
        setErr(e.message || "Failed to load topics");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div>
      <Header />

      <main style={{ padding: "16px" }}>
        <h2>Topics</h2>

        {isLoading && <p>Loading...</p>}
        {err && <p style={{ color: "crimson" }}>{err}</p>}

        {!isLoading && !err && <TopicsList topics={topics} />}
      </main>
    </div>
  );
}
