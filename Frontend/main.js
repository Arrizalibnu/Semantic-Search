class SemanticSearch {
    constructor() {
        this.apiUrl = 'http://127.0.0.1:8000/search'; 
        this.init();
    }

    init() {
        const searchInput = document.getElementById('searchInput');
        const searchButton = document.getElementById('searchButton');
        
        searchButton.addEventListener('click', () => this.performSearch());
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.performSearch();
        });
    }

    async performSearch() {
        const query = document.getElementById('searchInput').value.trim();
        const category = document.getElementById('categoryFilter').value;
        const limit = document.getElementById('limitFilter').value;
        
        if (!query) {
            this.showError('Please enter a search query');
            return;
        }

        this.showLoading();
        
        try {
            const url = new URL(this.apiUrl);
            url.searchParams.append("query", query);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("API response:", data);
            this.displayResults(data.results || data);
            
        } catch (error) {
            console.error('Search error:', error);
            this.showError('Failed to perform search. Please check your connection and try again.');
        }
    }

    showLoading() {
        const resultsContainer = document.getElementById('results');
        resultsContainer.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                Searching for relevant content...
            </div>
        `;
    }

    showError(message) {
        const resultsContainer = document.getElementById('results');
        resultsContainer.innerHTML = `
            <div class="error">
                 ${message}
            </div>
        `;
    }

    displayResults(results) {
        const resultsContainer = document.getElementById('results');
        
        if (!results || results.length === 0) {
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <div class="no-results-icon">🔍</div>
                    <h3>No results found</h3>
                    <p>Try different keywords or check your spelling</p>
                </div>
            `;
            return;
        }

        const resultsHtml = results.map((result, index) => `
            <div class="result-item">
                <h3 class="result-title">
                    <a href="${result.metadata?.link || result.link || '#'}" target="_blank">
                        ${result.metadata?.headline || result.headline || `Result ${index + 1}`}
                    </a>
                </h3>
                <p class="result-description">
                    ${result.metadata?.short_description || result.short_description || result.document || 'No description available'}
                </p>
                <div class="result-meta">
                    <div>
                        <span class="result-category">
                            ${result.metadata?.category || result.category || 'General'}
                        </span>
                        ${result.metadata?.authors ? 
                            `<span style="margin-left: 10px;">By: ${result.metadata.authors}</span>` : ''
                        }
                        ${result.metadata?.date ? 
                            `<span style="margin-left: 10px;">📅 ${result.metadata.date}</span>` : ''
                        }
                    </div>
                    ${result.score || result.distance ? 
                        `<span class="result-score">
                            Score: ${result.score 
                                ? (result.score * 100).toFixed(1) + '%' 
                                : (result.distance !== undefined 
                                    ? ((1 - Math.min(result.distance, 1)) * 100).toFixed(1) + '%' 
                                    : 'N/A')
                            }
                        </span>` : ''
                    }
                </div>
            </div>
        `).join('');

        resultsContainer.innerHTML = `
            <div class="results">
                ${resultsHtml}
            </div>
        `;
    }
}

// Initialize the search app
document.addEventListener('DOMContentLoaded', () => {
    new SemanticSearch();
});