import axios from "axios";
import { useState, useEffect, use } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/Card/Card.jsx";
import Header from "../../components/Header/Header.jsx";
import "./Dashboard.css";
const apiUrl = import.meta.env.VITE_API_URL;;

export default function Dashboard() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState({
    news: [],
    coins: [],
    insight: "",
    memes: [],
  });
  const [loading, setLoading] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const [sortedCards, setSortedCards] = useState([]);

  

  useEffect(() => {
  const fetchData = async () => {
    setLoading(true);

    try {
      const dashRes = await axios.get(`${apiUrl}/api/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { news, coins, insight, memes } = dashRes.data;
      const parsedDashboard = {
        news: JSON.parse(news).results ?? JSON.parse(news).message,
        coins: JSON.parse(coins) ?? JSON.parse(coins).message,
        insight: insight ?? "No AI insights available",
        memes: JSON.parse(memes)?.data?.children ?? JSON.parse(memes).message ?? [],
      };

      const prefRes = await axios.get(`${apiUrl}/api/me/preferences`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const prefs = prefRes.data;

        // 3. בונים את allCards עם תוכן מעודכן
        const allCards = [
          { type: "news", title: "Market News", content: parsedDashboard.news },
          { type: "coins", title: "Coin Prices", content: parsedDashboard.coins },
          { type: "ai-insight", title: "AI Insights", content: parsedDashboard.insight },
          { type: "memes", title: "Memes", content: parsedDashboard.memes },
        ];

        // 4. מיון לפי העדפות
        const sorted = [
          ...prefs.contentTypes.map(pref => allCards.find(c => c.title === pref)).filter(Boolean),
          ...allCards.filter(c => !prefs.contentTypes.includes(c.title)),
        ];
      setDashboard(parsedDashboard);
      setSortedCards(sorted);
      setLoading(false);
      
    } catch (err) {
      // אם השרת מחזיר 401 => נשלח את המשתמש ל-login
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        alert("Session expired. Please log in again.");
        navigate("/login");
      } else {
        console.error("Error fetching dashboard:", err);
      }
    }
    
  };
  fetchData();
}, []);
  function handleVote(type, vote) {
    console.log(`Voted ${vote} on ${type} card`);
    // כאן אפשר לשלוח POST ל-Backend כדי לשמור ב-DB
  }

  return (
    <>
      <Header />
      <div className="dashboard-grid">
        {sortedCards.map(card => (
          <Card key={card.type} title={card.title} cardType={card.type}>
            {card.type === "news" && card.content.length > 0
              ? card.content.map(n => <p key={n.id}>{n.title}</p>)
              : card.type === "coins" && card.content.length > 0
              ? card.content.map(c => <p key={c.id}><img src={c.image} alt={c.name} className="coin-img" />{c.name}: {c.current_price} USD</p>)
              : card.type === "memes" && Array.isArray(card.content) && card.content.length > 0
              ? card.content.map(m => <img key={m.data.id} src={m.data.url} alt="Crypto Meme" className="meme-img" />)
              : card.type === "ai-insight"
              ? <p>{card.content}</p>
              : <p>No content</p>
            }
          </Card>
        ))}
      </div>
        {showOverlay && (
          <div className="overlay">
            <img
              className="overlay-meme"
              src="https://preview.redd.it/dont-worry-little-brother-v0-qd3isrdooaqc1.jpeg?width=1080&crop=smart&auto=webp&s=8e9e3d12134c48fbded1679f629c81a3cceb5055"
              alt="Crypto Meme"
            />
            {!loading && <button className="overlay-close-btn" onClick={() => setShowOverlay(false)}>X</button>}
          </div>
        )}
    </>
  );
}