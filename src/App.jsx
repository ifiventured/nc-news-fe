// FRONTEND: src/App.jsx

import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import TopicsList from "./components/TopicsList";
import Articles from "./components/Articles";
import ArticlePage from "./pages/ArticlePage";

import { fetchTopics } from "./api/api";

export default function App() {
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    setErr(null);

    fetchTopics()
      .then((data) => setTopics(data))
      .catch((e) => setErr(e.message || "Failed to load topics"))
      .finally(() => setIsLoading(false));
  }, []);

  const HomePage = (
    <main style={{ padding: "16px" }}>
      <h2>Topics</h2>

      {isLoading && <p>Loading...</p>}
      {err && <p style={{ color: "crimson" }}>{err}</p>}

      {!isLoading && !err && <TopicsList topics={topics} />}

      <h2>Articles</h2>
      <Articles />
    </main>
  );

  return (
    <div>
      <Header />

      <Routes>
        <Route path="/" element={HomePage} />
        <Route path="/articles" element={HomePage} />
        <Route path="/articles/:article_id" element={<ArticlePage />} />
      </Routes>
    </div>
  );
}
