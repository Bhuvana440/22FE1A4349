import React from 'react';
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

export default function UrlStatistics({ urls }) {
  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', mt: 3 }}>
      <Typography variant="h5" mb={2}>URL Statistics</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Original URL</TableCell>
            <TableCell>Short URL</TableCell>
            <TableCell>Expires At</TableCell>
            <TableCell>Clicks</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {urls.map(({ shortcode, originalUrl, expiresAt, clicks }, idx) => (
            <TableRow key={idx}>
              <TableCell>{originalUrl}</TableCell>
              <TableCell>
                <a href={`http://localhost:3000/${shortcode}`} target="_blank" rel="noreferrer">
                  {`http://localhost:3000/${shortcode}`}
                </a>
              </TableCell>
              <TableCell>{new Date(expiresAt).toLocaleString()}</TableCell>
              <TableCell>{clicks}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
