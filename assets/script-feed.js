// API endpoint - using CORS proxy to avoid CORS issues
const API_ENDPOINT = 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://missingfeature.substack.com/api/v1/notes');

// Fetch feed data
async function fetchFeed() {
    try {
        const response = await fetch(API_ENDPOINT);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching feed:', error);
        throw error;
    }
}

// Format timestamp to relative time
function formatRelativeTime(timestamp) {
    const now = new Date();
    const date = new Date(timestamp);
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
        return 'just now';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes}m ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours}h ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
        return `${diffInDays}d ago`;
    }
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
        return `${diffInWeeks}w ago`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
        return `${diffInMonths}mo ago`;
    }
    
    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears}y ago`;
}

// Parse body JSON to extract title and text
function parseBodyJson(bodyJson) {
    if (!bodyJson || !bodyJson.content) {
        return { title: '', text: '' };
    }
    
    let title = '';
    let text = '';
    let isFirstParagraph = true;
    
    bodyJson.content.forEach(node => {
        if (node.type === 'paragraph' && node.content) {
            node.content.forEach(textNode => {
                if (textNode.type === 'text') {
                    const isBold = textNode.marks?.some(mark => mark.type === 'bold');
                    
                    if (isBold && isFirstParagraph) {
                        // First bold text becomes the title
                        title += textNode.text;
                    } else {
                        // Everything else is body text
                        text += textNode.text;
                    }
                }
            });
            
            // Add spacing between paragraphs for body text
            if (!isFirstParagraph) {
                text += ' ';
            }
            isFirstParagraph = false;
        }
    });
    
    return {
        title: title.trim(),
        text: text.trim()
    };
}

// Create feed item HTML
function createFeedItem(item) {
    const comment = item.comment;
    
    // Parse body content
    const { title, text } = parseBodyJson(comment.body_json);
    
    // Format time
    const timeAgo = formatRelativeTime(comment.date);
    
    return `
        <article class="feature-element">
            <div class="article-date">${timeAgo}</div>   
            <div class="article-title">${title}</div>
            <div class="article-excerpt">${text}</div>
        </article>
    `;
}

// Render feed
function renderFeed(data) {
    const feedContainer = document.getElementById('feed');
    
    if (!data.items || data.items.length === 0) {
        feedContainer.innerHTML = `
            <div class="empty-state">
                <h3>No activity yet</h3>
                <p>Check back later for updates</p>
            </div>
        `;
        return;
    }
    
    const feedHTML = data.items.map(item => createFeedItem(item)).join('');
    feedContainer.innerHTML = feedHTML;
}

// Show error
function showError(message) {
    const feedContainer = document.getElementById('feed');
    feedContainer.innerHTML = `
        <div class="error">
            <strong>Error loading feed</strong><br>
            ${message}
        </div>
    `;
}

// Initialize app
async function init() {
    try {
        const data = await fetchFeed();
        renderFeed(data);
    } catch (error) {
        showError(error.message);
    }
}

// Run on page load - check if DOM is already loaded
if (document.readyState === 'loading') {
    // DOM is still loading, so wait for the event
    document.addEventListener('DOMContentLoaded', init);
} else {
    // DOM is already loaded, run init immediately
    init();
}

