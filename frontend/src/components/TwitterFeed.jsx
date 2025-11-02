// frontend/src/components/TwitterFeed.jsx
import React, { useEffect, useState } from 'react';
import '../styles/TwitterFeed.css';

function TwitterFeed() {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Government Twitter accounts monitoring internet shutdowns
  const accounts = [
    '@MHA_India',
    '@DoT_India',
    '@PIB_India'
  ];

  const hashtags = [
    '#InternetShutdown',
    '#DigitalRights',
    '#NetShutdown',
    '#KeepItOn'
  ];

  useEffect(() => {
    // Simulated tweets - In production, connect to Twitter API
    const mockTweets = [
      {
        id: 1,
        user: '@MHA_India',
        text: 'Internet services restored in affected areas after security situation improves.',
        time: '2 hours ago',
        verified: true
      },
      {
        id: 2,
        user: '@DoT_India',
        text: 'Telecom operators directed to comply with shutdown orders in designated areas.',
        time: '5 hours ago',
        verified: true
      },
      {
        id: 3,
        user: '@PIB_India',
        text: 'Government announces temporary internet restrictions during examination period.',
        time: '1 day ago',
        verified: true
      }
    ];

    setTimeout(() => {
      setTweets(mockTweets);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="twitter-feed-container">
      <div className="twitter-header">
        <h2>🐦 Latest Updates from Government Sources</h2>
        <p className="twitter-subtitle">
          Monitoring: {accounts.join(', ')}
        </p>
      </div>

      {loading ? (
        <div className="loading">Loading tweets...</div>
      ) : (
        <div className="tweets-list">
          {tweets.map(tweet => (
            <div key={tweet.id} className="tweet-card">
              <div className="tweet-header">
                <span className="tweet-user">
                  {tweet.user}
                  {tweet.verified && <span className="verified-badge">✓</span>}
                </span>
                <span className="tweet-time">{tweet.time}</span>
              </div>
              <div className="tweet-text">{tweet.text}</div>
            </div>
          ))}
        </div>
      )}

      <div className="twitter-hashtags">
        <h4>Tracked Hashtags:</h4>
        <div className="hashtag-list">
          {hashtags.map((tag, idx) => (
            <span key={idx} className="hashtag">{tag}</span>
          ))}
        </div>
      </div>

      <div className="twitter-note">
        <p>
          ℹ️ Note: This feed displays official government announcements and updates.
          For real-time data, connect your Twitter API credentials in the backend.
        </p>
      </div>
    </div>
  );
}

export default TwitterFeed;
