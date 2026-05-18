import React, { useState, useEffect, useCallback } from "react";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

const CATEGORY_COLORS = {
  DevOps: "#6366f1",
  Docker: "#0ea5e9",
  Kubernetes: "#8b5cf6",
  AWS: "#f59e0b",
  "GitHub Actions": "#22c55e",
};

const DIFFICULTY_COLORS = {
  easy: "#22c55e",
  medium: "#f59e0b",
  hard: "#ef4444",
};

function Badge({ label, color }) {
  return (
    <span
      style={{
        background: color + "22",
        color: color,
        border: `1px solid ${color}44`,
        borderRadius: 6,
        padding: "2px 10px",
        fontSize: 12,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: 1,
      }}
    >
      {label}
    </span>
  );
}

function ProgressBar({ current, total }) {
  const pct = total > 0 ? (current / total) * 100 : 0;
  return (
    <div style={{ background: "#22263a", borderRadius: 99, height: 6, overflow: "hidden" }}>
      <div
        style={{
          width: `${pct}%`,
          height: "100%",
          background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
          borderRadius: 99,
          transition: "width 0.4s ease",
        }}
      />
    </div>
  );
}

function QuizCard({ question, onAnswer, answered, selectedOption, result }) {
  return (
    <div
      style={{
        background: "#1a1d27",
        border: "1px solid #2d3148",
        borderRadius: 16,
        padding: "2rem",
        maxWidth: 680,
        margin: "0 auto",
      }}
    >
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <Badge label={question.category} color={CATEGORY_COLORS[question.category] || "#6366f1"} />
        <Badge label={question.difficulty} color={DIFFICULTY_COLORS[question.difficulty]} />
      </div>

      <h2 style={{ fontSize: 20, fontWeight: 600, lineHeight: 1.5, marginBottom: 28, color: "#f1f5f9" }}>
        {question.question}
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {question.options.map((opt, i) => {
          let bg = "#22263a";
          let border = "#2d3148";
          let color = "#e2e8f0";

          if (answered) {
            if (i === result?.correctAnswer) {
              bg = "#166534"; border = "#22c55e"; color = "#bbf7d0";
            } else if (i === selectedOption && !result?.correct) {
              bg = "#7f1d1d"; border = "#ef4444"; color = "#fecaca";
            }
          }

          return (
            <button
              key={i}
              onClick={() => !answered && onAnswer(i)}
              style={{
                background: bg,
                border: `1px solid ${border}`,
                borderRadius: 10,
                padding: "14px 18px",
                color,
                fontSize: 15,
                textAlign: "left",
                cursor: answered ? "default" : "pointer",
                transition: "all 0.15s",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
              onMouseEnter={(e) => {
                if (!answered) e.currentTarget.style.borderColor = "#6366f1";
              }}
              onMouseLeave={(e) => {
                if (!answered) e.currentTarget.style.borderColor = "#2d3148";
              }}
            >
              <span
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  background: "#0f1117",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  fontWeight: 700,
                  flexShrink: 0,
                  color: "#8892a4",
                }}
              >
                {["A", "B", "C", "D"][i]}
              </span>
              {opt}
            </button>
          );
        })}
      </div>

      {answered && result && (
        <div
          style={{
            marginTop: 20,
            padding: "14px 18px",
            background: result.correct ? "#14532d33" : "#7f1d1d33",
            border: `1px solid ${result.correct ? "#22c55e44" : "#ef444444"}`,
            borderRadius: 10,
            fontSize: 14,
            color: result.correct ? "#86efac" : "#fca5a5",
            lineHeight: 1.6,
          }}
        >
          <strong>{result.correct ? "✓ Correct! " : "✗ Incorrect. "}</strong>
          {result.explanation}
        </div>
      )}
    </div>
  );
}

function ResultScreen({ score, total, onRestart, onHome }) {
  const pct = Math.round((score / total) * 100);
  const grade = pct >= 80 ? "🏆 Excellent!" : pct >= 60 ? "👍 Good job!" : "📚 Keep learning!";
  return (
    <div style={{ textAlign: "center", maxWidth: 480, margin: "0 auto", padding: "3rem 1rem" }}>
      <div style={{ fontSize: 72, marginBottom: 16 }}>
        {pct >= 80 ? "🏆" : pct >= 60 ? "🎯" : "📚"}
      </div>
      <h2 style={{ fontSize: 28, fontWeight: 700, color: "#f1f5f9", marginBottom: 8 }}>{grade}</h2>
      <p style={{ color: "#8892a4", marginBottom: 32 }}>
        You scored {score} out of {total} questions
      </p>
      <div
        style={{
          background: "#1a1d27",
          border: "1px solid #2d3148",
          borderRadius: 16,
          padding: "2rem",
          marginBottom: 32,
        }}
      >
        <div style={{ fontSize: 56, fontWeight: 800, color: pct >= 80 ? "#22c55e" : pct >= 60 ? "#f59e0b" : "#ef4444" }}>
          {pct}%
        </div>
        <ProgressBar current={score} total={total} />
      </div>
      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <button
          onClick={onRestart}
          style={{
            background: "#6366f1",
            border: "none",
            borderRadius: 10,
            padding: "12px 28px",
            color: "#fff",
            fontSize: 15,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Try Again
        </button>
        <button
          onClick={onHome}
          style={{
            background: "#22263a",
            border: "1px solid #2d3148",
            borderRadius: 10,
            padding: "12px 28px",
            color: "#e2e8f0",
            fontSize: 15,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Home
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("home");
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [result, setResult] = useState(null);
  const [category, setCategory] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API}/api/categories`)
      .then((r) => r.json())
      .then((d) => setCategories(d.categories || []))
      .catch(() => {});
  }, []);

  const startQuiz = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (category !== "all") params.append("category", category);
      if (difficulty !== "all") params.append("difficulty", difficulty);
      const res = await fetch(`${API}/api/questions?${params}`);
      const data = await res.json();
      if (!data.questions || data.questions.length === 0) {
        setError("No questions found for this filter. Try different options.");
        setLoading(false);
        return;
      }
      const shuffled = [...data.questions].sort(() => Math.random() - 0.5).slice(0, 5);
      setQuestions(shuffled);
      setCurrent(0);
      setScore(0);
      setAnswered(false);
      setSelectedOption(null);
      setResult(null);
      setScreen("quiz");
    } catch {
      setError("Could not connect to the server. Make sure the backend is running.");
    }
    setLoading(false);
  }, [category, difficulty]);

  const handleAnswer = async (optionIndex) => {
    setSelectedOption(optionIndex);
    setAnswered(true);
    try {
      const res = await fetch(`${API}/api/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: questions[current].id, selectedOption: optionIndex }),
      });
      const data = await res.json();
      setResult(data);
      if (data.correct) setScore((s) => s + 1);
    } catch {
      setResult({ correct: false, correctAnswer: 0, explanation: "Could not verify answer." });
    }
  };

  const handleNext = () => {
    if (current + 1 >= questions.length) {
      setScreen("result");
    } else {
      setCurrent((c) => c + 1);
      setAnswered(false);
      setSelectedOption(null);
      setResult(null);
    }
  };

  const selectStyle = {
    background: "#22263a",
    border: "1px solid #2d3148",
    borderRadius: 8,
    padding: "10px 14px",
    color: "#e2e8f0",
    fontSize: 14,
    cursor: "pointer",
    outline: "none",
    minWidth: 160,
  };

  if (screen === "home") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem 1rem" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🧠</div>
          <h1 style={{ fontSize: 36, fontWeight: 800, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 12 }}>
            Dev Quiz
          </h1>
          <p style={{ color: "#8892a4", fontSize: 16 }}>
            Test your DevOps, Docker, Kubernetes & AWS knowledge
          </p>
        </div>

        <div style={{ background: "#1a1d27", border: "1px solid #2d3148", borderRadius: 16, padding: "2rem", width: "100%", maxWidth: 420 }}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 13, color: "#8892a4", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>
              Category
            </label>
            <select style={selectStyle} value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="all">All Categories</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div style={{ marginBottom: 28 }}>
            <label style={{ display: "block", fontSize: 13, color: "#8892a4", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>
              Difficulty
            </label>
            <select style={selectStyle} value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              <option value="all">All Levels</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {error && (
            <div style={{ background: "#7f1d1d33", border: "1px solid #ef444444", borderRadius: 8, padding: "10px 14px", color: "#fca5a5", fontSize: 14, marginBottom: 16 }}>
              {error}
            </div>
          )}

          <button
            onClick={startQuiz}
            disabled={loading}
            style={{
              width: "100%",
              background: loading ? "#4338ca" : "#6366f1",
              border: "none",
              borderRadius: 10,
              padding: "14px",
              color: "#fff",
              fontSize: 16,
              fontWeight: 700,
              cursor: loading ? "wait" : "pointer",
              letterSpacing: 0.5,
            }}
          >
            {loading ? "Loading..." : "Start Quiz →"}
          </button>
        </div>

        <div style={{ display: "flex", gap: 24, marginTop: 32 }}>
          {[["DevOps", "#6366f1"], ["Docker", "#0ea5e9"], ["Kubernetes", "#8b5cf6"], ["AWS", "#f59e0b"]].map(([name, color]) => (
            <div key={name} style={{ textAlign: "center" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, margin: "0 auto 6px" }} />
              <span style={{ fontSize: 12, color: "#8892a4" }}>{name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (screen === "quiz" && questions.length > 0) {
    return (
      <div style={{ minHeight: "100vh", padding: "2rem 1rem" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <button
              onClick={() => setScreen("home")}
              style={{ background: "none", border: "none", color: "#8892a4", fontSize: 14, cursor: "pointer" }}
            >
              ← Home
            </button>
            <span style={{ color: "#8892a4", fontSize: 14 }}>
              Score: <strong style={{ color: "#22c55e" }}>{score}</strong>
            </span>
          </div>

          <div style={{ marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: "#8892a4" }}>
              Question {current + 1} of {questions.length}
            </span>
          </div>
          <div style={{ marginBottom: 24 }}>
            <ProgressBar current={current + (answered ? 1 : 0)} total={questions.length} />
          </div>

          <QuizCard
            question={questions[current]}
            onAnswer={handleAnswer}
            answered={answered}
            selectedOption={selectedOption}
            result={result}
          />

          {answered && (
            <div style={{ textAlign: "center", marginTop: 20 }}>
              <button
                onClick={handleNext}
                style={{
                  background: "#6366f1",
                  border: "none",
                  borderRadius: 10,
                  padding: "12px 32px",
                  color: "#fff",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {current + 1 >= questions.length ? "See Results →" : "Next Question →"}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (screen === "result") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <ResultScreen
          score={score}
          total={questions.length}
          onRestart={startQuiz}
          onHome={() => setScreen("home")}
        />
      </div>
    );
  }

  return null;
}