// This is a mock implementation of post generation
// In a real app, this would be an API call to an AI service

export interface GeneratedPost {
    id: string;
    title: string;
    content: string;
    type: "Standard" | "Story" | "Facts" | "Professional";
    authorName?: string;
    authorPosition?: string;
  }
  
  export function generatePosts(userInput: string): GeneratedPost[] {
    // Generate a unique ID suffix for this batch
    const batchId = Date.now().toString(36);
    
    // Create four different post templates
    return [
      {
        id: `standard-${batchId}`,
        title: "Standard Post",
        content: generateStandardPost(userInput),
        type: "Standard",
      },
      {
        id: `story-${batchId}`,
        title: "Story Post",
        content: generateStoryPost(userInput),
        type: "Story",
      },
      {
        id: `facts-${batchId}`,
        title: "Facts Post",
        content: generateFactsPost(userInput),
        type: "Facts",
      },
      {
        id: `professional-${batchId}`,
        title: "Professional Post",
        content: generateProfessionalPost(userInput),
        type: "Professional",
      },
    ];
  }
  
  function generateStandardPost(userInput: string): string {
    // In a real app, this would use AI to generate a post
    return `
      <p>I've been reflecting on ${userInput} lately, and it's opened up new perspectives for me in my professional journey.</p>
      <p>This insight has helped me understand how impactful ${userInput} can be in today's changing business landscape.</p>
      <p>Have you experimented with ${userInput} in your work? I'd love to hear your experiences!</p>
      <p>#${userInput.replace(/\s+/g, '')} #ProfessionalGrowth #Innovation</p>
    `;
  }
  
  function generateStoryPost(userInput: string): string {
    return `
      <p>A quick story about ${userInput} that changed my perspective:</p>
      <p>Last year, I was struggling with implementing ${userInput} in our workflow. It seemed overwhelming and unnecessarily complex.</p>
      <p>Then, a colleague shared how they had tackled a similar challenge. Their approach was eye-opening.</p>
      <p>Three months later, our team efficiency improved by 35% and we're now helping other departments implement similar solutions.</p>
      <p>The lesson? Sometimes the most valuable insights come from unexpected sources.</p>
      <p>#${userInput.replace(/\s+/g, '')} #LessonsLearned #GrowthMindset</p>
    `;
  }
  
  function generateFactsPost(userInput: string): string {
    return `
      <p>📊 3 Fascinating Facts About ${userInput} That Might Surprise You:</p>
      <p>1️⃣ Did you know? Studies show that companies implementing ${userInput} see an average 27% increase in productivity.</p>
      <p>2️⃣ Over 65% of Fortune 500 companies have integrated ${userInput} into their core strategies in the past 2 years.</p>
      <p>3️⃣ Experts predict that ${userInput} will transform our industry within the next decade, creating new job categories we haven't even imagined yet.</p>
      <p>What other facts about ${userInput} have you discovered? Share in the comments!</p>
      <p>#${userInput.replace(/\s+/g, '')} #IndustryInsights #FutureOfWork</p>
    `;
  }
  
  function generateProfessionalPost(userInput: string): string {
    return `
      <p>I'm excited to share my latest article on ${userInput} and its implications for our industry.</p>
      <p>Key takeaways:</p>
      <p>• ${userInput} is revolutionizing how we approach business challenges</p>
      <p>• Implementation requires strategic planning and cross-functional collaboration</p>
      <p>• Early adopters are already seeing significant ROI</p>
      <p>I've included a framework for assessment and implementation that my team has refined over the past quarters.</p>
      <p>Link to the full article in comments. Would appreciate your thoughts and feedback.</p>
      <p>#${userInput.replace(/\s+/g, '')} #ThoughtLeadership #IndustryTrends</p>
    `;
  }