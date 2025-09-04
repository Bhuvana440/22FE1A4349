import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import UrlShortenerForm from './components/UrlShortenerForm';
import UrlStatistics from './components/UrlStatistics';
import RedirectHandler from './pages/RedirectHandler';
import { getAllUrls } from './utils/api';

function App() {
  const [shortenedUrls, setShortenedUrls] = useState([]);

  const onUrlsShortened = (results) => {
    // Append new URLs with click count 0
    const updatedUrls = [
      ...shortenedUrls,
      ...results.map(({ shortcode, originalUrl, expiresAt }) => ({
        shortcode,
        originalUrl,
        expiresAt,
        clicks: 0,
      })),
    ];
    setShortenedUrls(updatedUrls);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<UrlShortenerForm onUrlsShortened={onUrlsShortened} />} />
        <Route path="/stats" element={<UrlStatistics urls={shortenedUrls} />} />
        <Route path="/:shortcode" element={<RedirectHandler />} />
      </Routes>
    </Router>
  );
}

export default App;

