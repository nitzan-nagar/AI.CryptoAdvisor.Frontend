import { useState, useEffect, use } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Header/Header.jsx";
import './Onboarding.css';
const apiUrl = process.env.REACT_APP_API_URL;


const Onboarding = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [preferredAssets, setPreferredAssets] = useState([]);
  const [investorType, setInvestorType] = useState("");
  const [contentTypes, setContentTypes] = useState([]);
  const [error, setError] = useState("");

  const contentOptions = ["Market News", "Charts", "Social", "Fun"];
  const investorOptions = ["HODLer", "Day Trader", "NFT Collector"];

  useEffect(() => {
  const fetchPreferences = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/me/preferences`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data) {
        navigate("/dashboard");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        alert("Session expired. Please log in again.");
        navigate("/login");
      } else {
        console.error("Error fetching onboarding:", err);
      }
    }
  };

  fetchPreferences();
}, [token, navigate]);
  const toggleContentType = (type) => {
    setContentTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // בדיקת חובה
    if (!investorType || contentTypes.length === 0 || preferredAssets.length === 0) {
      setError("Please select investor type, write preferred assets and choose at least one content type.");
      return;
    }

    try {
      await axios.post(`${apiUrl}/api/me/preferences`, { investorType, preferredAssets, contentTypes },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Failed to save preferences. Please try again.");
    }
  };

  return (
  <>
    <Header />
    <div className="onboarding-page">
      <div className="onboarding-box">
        <h2 className="onboarding-title">
          Welcome! Let's personalize your experience
        </h2>

        {error && <p className="onboarding-error">{error}</p>}

        <form onSubmit={handleSubmit} className="onboarding-form">
          {/* נכסים מועדפים */}
          <div className="form-group">
            <label className="form-label">
              What crypto assets are you interested in?
            </label>
            <input
              type="text"
              value={preferredAssets}
              onChange={(e) => setPreferredAssets(e.target.value)}
              placeholder="e.g. Bitcoin, Ethereum"
              className="onboarding-input"
            />
          </div>

          {/* סוג משקיע */}
          <div className="form-group">
            <label className="form-label">What type of investor are you? *</label>
            <select
              value={investorType}
              onChange={(e) => setInvestorType(e.target.value)}
              required
              className="onboarding-input"
            >
              <option value="">-- Select --</option>
              {investorOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* סוגי תוכן */}
          <div className="form-group">
            <label className="form-label">
              What kind of content would you like to see? *
            </label>
            <div className="checkbox-group">
              {contentOptions.map((opt) => (
                <label key={opt} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={contentTypes.includes(opt)}
                    onChange={() => toggleContentType(opt)}
                    className="checkbox-input"
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="onboarding-button">
            Save Preferences
          </button>
        </form>
      </div>
    </div>
  </>
);

}

export default Onboarding