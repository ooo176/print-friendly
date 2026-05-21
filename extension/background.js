// Background service worker for Press extension

chrome.action.onClicked.addListener((tab) => {
  // Check if URL is accessible
  const url = tab.url || '';
  const restrictedProtocols = ['chrome:', 'chrome-extension:', 'edge:', 'about:', 'data:', 'file:'];
  const isRestricted = restrictedProtocols.some(protocol => url.startsWith(protocol));

  if (isRestricted || url.includes('chrome.google.com/webstore')) {
    // Show error for restricted pages
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        alert('Press: 无法在此页面使用\n\n此页面是浏览器内部页面或受保护页面，Chrome 不允许扩展访问。\n\n请在普通网页（如新闻、博客、文章页面）上使用 Press。');
      }
    }).catch(() => {
      // If even alert fails, the page is completely restricted
      console.log('Press: Cannot access this page');
    });
    return;
  }

  // Inject content script and extract article
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: extractAndOpen
  }).catch(error => {
    console.error('Press injection error:', error);
  });
});

// Function to be injected into the page
function extractAndOpen() {
  // Check if Readability is available
  if (typeof Readability === 'undefined') {
    alert('Press: 正在加载提取工具，请稍后再试...');
    return;
  }

  try {
    // Clone the document for Readability
    const documentClone = document.cloneNode(true);

    // Create Readability instance
    const reader = new Readability(documentClone, {
      charThreshold: 200
    });

    // Parse the article
    const article = reader.parse();

    if (!article) {
      alert('Press: 无法提取正文 - 此页面可能不是文章页面');
      return;
    }

    // Prepare data to send
    const data = {
      title: article.title || document.title,
      byline: article.byline || '',
      content: article.content || '',
      textContent: article.textContent || '',
      length: article.length || 0,
      excerpt: article.excerpt || '',
      siteName: article.siteName || '',
      sourceUrl: window.location.href,
      extractedAt: new Date().toISOString()
    };

    // Store in chrome.storage for the new tab to retrieve
    chrome.storage.local.set({ pressArticle: data }, () => {
      // Open print-friendly.html in a new tab
      const extensionUrl = chrome.runtime.getURL('print-friendly.html');
      window.open(extensionUrl + '?source=extension', '_blank');
    });

  } catch (error) {
    console.error('Press extraction error:', error);
    alert('Press: 提取失败 - ' + error.message);
  }
}

