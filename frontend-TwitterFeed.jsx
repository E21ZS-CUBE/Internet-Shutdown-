// frontend/src/components/TwitterFeed.jsx
import React from 'react';
import '../styles/TwitterFeed.css';

function TwitterFeed() {
  const tweets = [
    {
      id: 1,
      author: 'NetShutdowns',
      content: 'Breaking: 3 new internet shutdowns reported across Manipur and Kashmir regions today. Real-time data updated in our tracker.',
      timestamp: '2 hours ago',
      likes: 245,
      retweets: 89
    },
    {
      id: 2,
      author: 'NetShutdowns',
      content: 'Report: India recorded 84 internet shutdowns in 2024, highest among democratic nations. Access denial tools continue to evolve.',
      timestamp: '1 day ago',
      likes: 1203,
      retweets: 456
    },
    {
      id: 3,
      author: 'NetShutdowns',
      content: 'New data available: Operator-level tower blocking information now tracked. See which providers are most affected.',
      timestamp: '2 days ago',
      likes: 567,
      retweets: 234
    },
    {
      id: 4,
      author: 'NetShutdowns',
      content: 'Analysis: 48.8% of shutdowns were protest-related in 2024. Digital rights advocates call for stricter legal frameworks.',
      timestamp: '3 days ago',
      likes: 892,
      retweets: 345
    },
    {
      id: 5,
      author: 'NetShutdowns',
      content: 'Platform update: Interactive map with district-level granularity now available. Explore shutdown patterns by location.',
      timestamp: '5 days ago',
      likes: 654,
      retweets: 278
    }
  ];

  return (
    <div className="twitter-feed-section">
      <h2>🐦 Recent Updates</h2>
      <div className="twitter-feed">
        {tweets.map(tweet => (
          <div key={tweet.id} className="tweet-card">
            <div className="tweet-header">
              <strong>@{tweet.author}</strong>
              <span className="tweet-time">{tweet.timestamp}</span>
            </div>
            <div className="tweet-content">
              {tweet.content}
            </div>
            <div className="tweet-actions">
              <span>❤️ {tweet.likes}</span>
              <span>🔄 {tweet.retweets}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TwitterFeed;