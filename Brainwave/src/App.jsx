import { useState } from "react";
import "./App.css";

function App() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");

  const handleGenerate = async () => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

    if (!apiKey) {
      setResult("❌ API key not found. Please check your .env file.");
      return;
    }

    if (!prompt.trim()) return;
    setResult("Thinking... 🤖");

    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${VITE_OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await res.json();

      if (data.error) {
        console.error(data.error);
        setResult(`❌ Error: ${data.error.message}`);
        return;
      }

      const aiResponse = data.choices?.[0]?.message?.content;
      setResult(aiResponse || "No response from AI.");
    } catch (err) {
      setResult("Something went wrong. Try again later.");
      console.error(err);
    }
  };

  return (
    <div className="App">
      <header>
        <h1>🧠 Brainwave</h1>
        <p>Your AI-powered thought partner</p>
      </header>

      <main>
        <section className="input-section">
          <textarea
            placeholder="Enter your idea or prompt..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button onClick={handleGenerate}>Generate</button>
        </section>

        <section className="result-section">
          <h2>Your Result:</h2>
          <div className="result-box">
            {result || "Results will appear here..."}
          </div>
        </section>
      </main>

      <footer>&copy; 2025 Brainwave. Built with ❤️ using React + Vite</footer>
    </div>
  );
}

export default App;
