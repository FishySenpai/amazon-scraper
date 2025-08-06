document.getElementById('searchBtn').addEventListener('click', async () => {
  const keyword = document.getElementById('keyword').value.trim();
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = 'Loading...';

  try {
    const response = await fetch(`http://localhost:3000/api/scrape?keyword=${encodeURIComponent(keyword)}`);
    const data = await response.json();

    if (data.error) {
      resultsDiv.innerHTML = `<p>Error: ${data.error}</p>`;
      return;
    }

    if (!data.results.length) {
      resultsDiv.innerHTML = '<p>No results found.</p>';
      return;
    }

    resultsDiv.innerHTML = data.results.map(product => `
      <div class="product">
        <img src="${product.image}" alt="Product Image" />
        <div class="product-info">
          <h3>${product.title}</h3>
          <p><strong>Rating:</strong> ${product.rating}</p>
          <p><strong>Reviews:</strong> ${product.reviews}</p>
        </div>
      </div>
    `).join('');
  } catch (err) {
    resultsDiv.innerHTML = `<p>Error fetching data.</p>`;
  }
});