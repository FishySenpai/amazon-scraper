import express from 'express';
import axios from 'axios';
import { JSDOM } from 'jsdom';

const app = express();
const PORT = 3000;

app.get('/api/scrape', async (req, res) => {
  const keyword = req.query.keyword as string;

  if (!keyword) {
    return res.status(400).json({ error: 'Keyword query parameter is required' });
  }

  const url = `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`;

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/92.0.4515.107 Safari/537.36',
      },
    });

    const dom = new JSDOM(response.data);
    const document = dom.window.document;

    const products: any[] = [];

    const items = document.querySelectorAll('div.s-main-slot div[data-component-type="s-search-result"]');

    items.forEach((item) => {
      const title = item.querySelector('h2 a span')?.textContent?.trim();
      const rating = item.querySelector('i span')?.textContent?.trim();
      const reviews = item.querySelector('span[aria-label$="ratings"]')?.textContent?.trim();
      const image = item.querySelector('img.s-image')?.getAttribute('src');

      if (title && rating && reviews && image) {
        products.push({
          title,
          rating,
          reviews,
          image,
        });
      }
    });

    res.json({ keyword, results: products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch or parse data from Amazon' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});