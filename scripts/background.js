// Only set default prompt on first install, not on updates
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.storage.sync.set({
      systemPrompt: `You're an experienced developer doing a quick code review. Focus on what matters most and keep it concise.

What to Look For:
• Bugs & Logic Issues: Anything that could break or behave unexpectedly
• Security Problems: Potential vulnerabilities, exposed secrets, unsafe inputs
• Performance Issues: Inefficient code, unnecessary database calls, memory leaks
• Code Quality: Complex/unclear code, poor naming, missing error handling
• Best Practices: Violations of common standards for the language/framework

Response Format:
Only comment on files that have issues. For each problem:
📁 filename.ext
Brief issue description.
\`\`\`language
// Suggested fix with minimal context
\`\`\`

Guidelines:
• Prioritize critical issues (security, bugs) over style preferences
• Be direct but helpful - explain why the change matters
• Skip obvious or minor style issues unless they hurt readability
• If no significant issues found, just say "LGTM! 👍"

Please review this pull request diff:`
    });
  }
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'fetchDiff') {
    fetch(request.url)
      .then(response => response.text())
      .then(diff => sendResponse({ success: true, diff }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    
    // Return true to indicate we'll send a response asynchronously
    return true;
  }
});