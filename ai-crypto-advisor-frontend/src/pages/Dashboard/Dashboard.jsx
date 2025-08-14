import axios from "axios";
import { useState, useEffect, use } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/Card/Card.jsx";
import Header from "../../components/Header/Header.jsx";
import "./Dashboard.css";

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

  useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
      try {
      const res = await axios.get("https://ai-crypto-advisor-backend.onrender.com/api/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { news, coins, insight, memes } = res.data;

      setDashboard({
        news: JSON.parse(news).results ?? JSON.parse(news),
        coins: JSON.parse(coins),
        insight: insight ?? "No AI insights available",
        memes: JSON.parse(memes).data.children ?? JSON.parse(memes)
      });
      // setTimeout(() => {
      //   setLoading(false);
      // }, 3000);
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

        <Card title="Market News" cardType="news">
          {dashboard.news.length > 0 
            ? dashboard.news.map((n) => <p key={n.id}>{n.title}</p>) 
            : <p>No news</p>}
        </Card>

        <Card title="Coin Prices" cardType="coins">
          <p>Source: <a href="https://www.coingecko.com/">CoinGecko</a></p>
          {dashboard.coins.length > 0 
            ? dashboard.coins.map((c) => <p key={c.id}><img src={c.image} alt={c.name} className="coin-img" />{c.name}: {c.current_price}</p>) 
            : <p>No coins</p>}
        </Card>

        <Card title="AI Insight of the Day" cardType="ai-insight">
          <p>{dashboard.insight}</p>
        </Card>

        <Card title="Fun Crypto Meme" cardType="meme">
          {dashboard.memes.length > 0 ? dashboard.memes.map((m) => (
            <img src={m.data.url} alt="Crypto Meme" className="meme-img" />
          )) : (
            <p>No memes available</p>
          )}
        </Card>
      </div>
      {loading && <img className="overlay-meme" src={"https://preview.redd.it/dont-worry-little-brother-v0-qd3isrdooaqc1.jpeg?width=1080&crop=smart&auto=webp&s=8e9e3d12134c48fbded1679f629c81a3cceb5055"} alt="Crypto Meme" />}
    </>
    
  );
}
