// Content script for Press extension
// This script runs on every page and listens for extraction requests

(function() {
  'use strict';

  // Listen for messages from background script
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'extract') {
      extractArticle()
        .then(data => sendResponse({ success: true, data }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true; // Keep channel open for async response
    }
  });

  // Extract article from current page
  async function extractArticle() {
    // Wait for Readability to be available
    if (typeof Readability === 'undefined') {
      throw new Error('Readability library not loaded');
    }

    // Clone document
    const documentClone = document.cloneNode(true);

    // Create Readability instance
    const reader = new Readability(documentClone, {
      charThreshold: 200,
      keepClasses: false
    });

    // Parse article
    const article = reader.parse();

    if (!article) {
      throw new Error('无法提取正文 - 此页面可能不是文章页面');
    }

    // Return extracted data
    return {
      title: article.title || document.title,
      byline: article.byline || extractByline(),
      content: article.content || '',
      textContent: article.textContent || '',
      length: article.length || 0,
      excerpt: article.excerpt || '',
      siteName: article.siteName || extractSiteName(),
      sourceUrl: window.location.href,
      extractedAt: new Date().toISOString()
    };
  }

  // Fallback byline extraction
  function extractByline() {
    const selectors = [
      'meta[name="author"]',
      'meta[property="article:author"]',
      '.author',
      '.byline',
      '[rel="author"]'
    ];

    for (const selector of selectors) {
      const el = document.querySelector(selector);
      if (el) {
        return el.getAttribute('content') || el.textContent.trim();
      }
    }

    return '';
  }

  // Fallback site name extraction
  function extractSiteName() {
    const meta = document.querySelector('meta[property="og:site_name"]');
    if (meta) return meta.getAttribute('content');

    try {
      return new URL(window.location.href).hostname.replace(/^www\./, '');
    } catch {
      return '';
    }
  }

  // Add visual indicator when extension is active
  console.log('Press extension loaded on:', window.location.href);
})();
