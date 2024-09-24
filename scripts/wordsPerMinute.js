console.log("Time calculation script is working 3");

const WPM = 200;

const runScript = () => {
  const observer = new MutationObserver((mutations, observer) => {
    const article = document.querySelector("article");
    if (article) {
      // console.log("article found after mutation");
      observer.disconnect(); // Stop observing once the article tag is found

      const contentObserver = new MutationObserver((mutations, contentObserver) => {
        const text = article.textContent;
        if (text.trim()) {
          // Proceed when there's actual content
          // console.log("Article content loaded: ", text);
          contentObserver.disconnect(); // Stop observing when content is available

          // Check if the badge already exists
          if (!article.querySelector(".reading-time-badge")) {
            const wordMatchRegExp = /[^\s]+/g; // Regular expression
            const words = text.matchAll(wordMatchRegExp);
            const wordCount = [...words].length;
            const readingTime = Math.round(wordCount / 200);
            const badge = document.createElement("p");
            badge.classList.add("color-secondary-text", "type--caption", "reading-time-badge");
            badge.textContent = `⏱️ ${readingTime} min read (${WPM} wpm)`;

            const heading = article.querySelector("h1");
            const date = article.querySelector("time")?.parentNode;

            (date ?? heading).insertAdjacentElement("afterend", badge);
          } else {
            // console.log("Reading time badge already exists.");
          }
        }
      });

      // Start observing for content changes in the article
      contentObserver.observe(article, { childList: true, subtree: true });
    }
  });

  // Start observing the document for when the article element appears
  observer.observe(document, { childList: true, subtree: true });
};

// Helper function to monitor URL changes
const monitorUrlChanges = callback => {
  let lastUrl = window.location.href;

  new MutationObserver(() => {
    const currentUrl = window.location.href;
    if (currentUrl !== lastUrl) {
      lastUrl = currentUrl;
      callback(); // Run script when URL changes
    }
  }).observe(document, { subtree: true, childList: true });
};

// Handle URL and state changes in an SPA
const observeNavigation = () => {
  runScript(); // Run script on initial load

  // Capture SPA routing changes
  window.addEventListener("popstate", runScript);
  window.addEventListener("hashchange", runScript);

  // Monitor URL changes in case pushState/replaceState are not directly used
  monitorUrlChanges(runScript);
};

// Initialize the navigation observer
observeNavigation();
