import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUrlByShortcode } from '../utils/api';

export default function RedirectHandler() {
  const { shortcode } = useParams();
  const [error, setError] = useState(null);

  useEffect(() => {
    async function redirect() {
      const data = await getUrlByShortcode(shortcode);
      if (data) {
        window.location.href = data.originalUrl;
      } else {
        setError('Invalid or expired URL.');
      }
    }
    redirect();
  }, [shortcode]);

  if (error) return <div>{error}</div>;
  return <div>Redirecting...</div>;
}
