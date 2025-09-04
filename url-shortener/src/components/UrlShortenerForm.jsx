import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Alert } from '@mui/material';
import { isValidUrl, isValidShortcode } from '../utils/validation';
import { shortenUrlApi } from '../utils/api';

const MAX_URLS = 5;

export default function UrlShortenerForm({ onUrlsShortened }) {
  const [urls, setUrls] = useState([{ url: '', validity: 30, shortcode: '' }]);
  const [errors, setErrors] = useState([]);
  const [apiErrors, setApiErrors] = useState(null);

  const handleChange = (idx, field, value) => {
    const newUrls = [...urls];
    newUrls[idx][field] = value;
    setUrls(newUrls);
  };

  const addUrlField = () => {
    if (urls.length < MAX_URLS) {
      setUrls([...urls, { url: '', validity: 30, shortcode: '' }]);
    }
  };

  const validate = () => {
    let errs = [];
    urls.forEach(({ url, validity, shortcode }, i) => {
      if (!isValidUrl(url)) errs.push(`URL #${i+1} invalid.`);
      if (validity && (isNaN(validity) || validity <= 0)) errs.push(`Validity #${i+1} invalid.`);
      if (shortcode && !isValidShortcode(shortcode)) errs.push(`Shortcode #${i+1} invalid.`);
    });
    setErrors(errs);
    return errs.length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiErrors(null);
    if (!validate()) return;

    try {
      const results = await Promise.all(urls.map(shortenUrlApi));
      onUrlsShortened(results);
    } catch (err) {
      setApiErrors(err.message);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, margin: 'auto' }}>
      <Typography variant="h5" mb={2}>Shorten URLs</Typography>
      {urls.map(({ url, validity, shortcode }, idx) => (
        <Box key={idx} mb={2}>
          <TextField
            label={`URL #${idx + 1}`}
            value={url}
            onChange={e => handleChange(idx, 'url', e.target.value)}
            fullWidth
            required
            sx={{ mb: 1 }}
          />
          <TextField
            label="Validity (minutes)"
            type="number"
            value={validity}
            onChange={e => handleChange(idx, 'validity', e.target.value)}
            sx={{ width: '45%', mr: 1 }}
            inputProps={{ min: 1 }}
          />
          <TextField
            label="Shortcode (optional)"
            value={shortcode}
            onChange={e => handleChange(idx, 'shortcode', e.target.value)}
            sx={{ width: '50%' }}
          />
        </Box>
      ))}
      {urls.length < MAX_URLS && (
        <Button variant="outlined" onClick={addUrlField} sx={{ mb: 2 }}>
          Add URL
        </Button>
      )}
      {errors.map((err, i) => (
        <Alert severity="error" key={i} sx={{ mb: 1 }}>{err}</Alert>
      ))}
      {apiErrors && <Alert severity="error" sx={{ mb: 1 }}>{apiErrors}</Alert>}
      <Button variant="contained" type="submit">Shorten</Button>
    </Box>
  );
}
