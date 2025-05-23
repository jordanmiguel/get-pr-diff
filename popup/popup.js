document.addEventListener('DOMContentLoaded', () => {
  const systemPromptTextarea = document.getElementById('systemPrompt');
  const saveButton = document.getElementById('saveButton');
  const statusDiv = document.getElementById('status');

  // Default system prompt
  const defaultPrompt = `You're an experienced developer doing a quick code review. Focus on what matters most and keep it concise.

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

Please review this pull request diff:`;

  // Load saved prompt or use default
  chrome.storage.sync.get(['systemPrompt'], (result) => {
    systemPromptTextarea.value = result.systemPrompt || defaultPrompt;
  });

  // Save button handler
  saveButton.addEventListener('click', () => {
    const systemPrompt = systemPromptTextarea.value.trim();
    
    chrome.storage.sync.set({ systemPrompt }, () => {
      statusDiv.textContent = 'Settings saved successfully!';
      statusDiv.className = 'status success';
      
      setTimeout(() => {
        statusDiv.className = 'status';
        statusDiv.textContent = '';
      }, 2000);
    });
  });

  // Clear status message when user types
  systemPromptTextarea.addEventListener('input', () => {
    statusDiv.className = 'status';
    statusDiv.textContent = '';
  });
});