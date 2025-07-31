import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
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

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShowNavbar(currentScrollY < lastScrollY || currentScrollY < 50);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div className="App">
      <nav className={`navbar ${showNavbar ? "show" : "hide"}`} id="nav">
        <h1 className="logo">🧠 Brainwave</h1>
        <ul>
          <li onClick={() => scrollToSection("home")}>Home</li>
          <li onClick={() => scrollToSection("about")}>About</li>
          <li onClick={() => scrollToSection("generate")}>Generate</li>
          <li onClick={() => scrollToSection("contact")}>Contact</li>
        </ul>
      </nav>

      <header id="home">
        <h1>🧠 Brainwave</h1>
        <p>Your AI-powered thought partner</p>
      </header>

      <section id="about" className="info-section">
        <h2>About Brainwave</h2>
        <p>
          Brainwave uses AI to help you brainstorm ideas, write better, and explore new thoughts.
          Powered by OpenAI.
        </p>
      </section>

      <main id="generate">
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
          <div className="result-box">{result || "Results will appear here..."}</div>
        </section>
      </main>

      <section id="contact" className="info-section contact-section">
        <h2>Contact Us</h2>
        <p>Have a question or feedback? Reach out to us below.</p>
        <form
          className="contact-form"
          onSubmit={(e) => {
            e.preventDefault();
            alert("✅ Message sent! We'll be in touch soon.");
          }}
        >
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
          <textarea rows="5" placeholder="Your Message" required />
          <button type="submit">Send Message</button>
        </form>
      </section>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-brand">
            <h2>🧠 Brainwave</h2>
            <p>AI-powered thought partner</p>
          </div>
          <div className="footer-links">
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#generate">Generate</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="footer-bottom">
            &copy; {new Date().getFullYear()} Brainwave. Built with ❤️ using React + Vite.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
