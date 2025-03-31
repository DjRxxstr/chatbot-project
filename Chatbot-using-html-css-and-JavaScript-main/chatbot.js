// Get chatbot elements
const chatbot = document.getElementById('chatbot');
const conversation = document.getElementById('conversation');
const inputForm = document.getElementById('input-form');
const inputField = document.getElementById('input-field');

// API Configuration
const API_KEY = 'YOUR_API_KEY_HERE'; // Replace with your API key
const API_URL = 'https://api.openai.com/v1/chat/completions';

// Fallback responses for different topics
const fallbackResponses = {
  greeting: [
    "Hello! How can I help you today?",
    "Hi there! What would you like to know about our college?",
    "Welcome! I'm here to help you with any questions about our college."
  ],
  programs: [
    "We offer various programs including Computer Science, Engineering, Business, and Arts. Which field interests you?",
    "Our college provides both undergraduate and graduate programs. What level of study are you interested in?",
    "We have specialized programs in Technology, Management, and Sciences. Would you like to know more about any specific program?"
  ],
  admission: [
    "For admissions, you'll need to submit your academic records, standardized test scores, and a personal statement. Would you like specific details about any of these requirements?",
    "The admission process typically takes 4-6 weeks. You can apply online through our website. Would you like the application link?",
    "We accept applications for both fall and spring semesters. When are you planning to start?"
  ],
  campus: [
    "Our campus features modern facilities including a library, sports complex, and student center. What would you like to know about?",
    "We have multiple buildings for different departments, a cafeteria, and recreational areas. Which area would you like to learn more about?",
    "The campus is spread across 50 acres with various facilities for students. What interests you the most?"
  ],
  default: [
    "I understand you're asking about {topic}. Could you please provide more specific details about what you'd like to know?",
    "I can help you with information about {topic}. What specific aspect would you like to learn about?",
    "Regarding {topic}, I'd be happy to provide more information. What would you like to know specifically?"
  ]
};

// Add event listener to input form
inputForm.addEventListener('submit', async function (event) {
  // Prevent form submission if the input is empty
  if (inputField.value.trim() === '') {
    event.preventDefault();
    return;
  }

  // Prevent form submission
  event.preventDefault();

  // Get user input
  const input = inputField.value;

  // Clear input field
  inputField.value = '';
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Add user input to conversation
  addUserMessage(input, currentTime);

  // Show loading message
  const loadingMessage = addChatbotMessage("Thinking...", currentTime);

  try {
    // Try to get API response first
    const response = await generateResponse(input);
    
    // Remove loading message
    loadingMessage.remove();
    
    // Add chatbot response to conversation
    addChatbotMessage(response, currentTime);
  } catch (error) {
    // Remove loading message
    loadingMessage.remove();
    
    // If API fails, use fallback response
    const fallbackResponse = getFallbackResponse(input);
    addChatbotMessage(fallbackResponse, currentTime);
  }
});

// Function to add user message to conversation
function addUserMessage(message, sentTime) {
  addMessageToConversation(message, 'user-message', sentTime, 'user-text');
}

// Function to add chatbot message to conversation
function addChatbotMessage(message, sentTime) {
  return addMessageToConversation(message, 'chatbot-message', sentTime);
}

// Function to add a message to the conversation
function addMessageToConversation(messageContent, messageClass, sentTime, textClass = 'chatbot-text') {
  const message = document.createElement('div');
  message.classList.add(messageClass);
  message.innerHTML = `<p class="${textClass}" sentTime="${sentTime}">${messageContent}</p>`;
  conversation.appendChild(message);
  message.scrollIntoView({ behavior: 'smooth' });
  return message;
}

// Function to get fallback response based on user input
function getFallbackResponse(userInput) {
  const input = userInput.toLowerCase();
  
  // Check for greetings
  if (input.match(/^(hi|hello|hey|greetings)/)) {
    return getRandomResponse(fallbackResponses.greeting);
  }
  
  // Check for program-related queries
  if (input.match(/(program|course|study|degree|major)/)) {
    return getRandomResponse(fallbackResponses.programs);
  }
  
  // Check for admission-related queries
  if (input.match(/(admission|apply|enroll|application|entry)/)) {
    return getRandomResponse(fallbackResponses.admission);
  }
  
  // Check for campus-related queries
  if (input.match(/(campus|facility|building|library|sports|cafeteria)/)) {
    return getRandomResponse(fallbackResponses.campus);
  }
  
  // Default response
  const topic = extractTopic(input);
  return getRandomResponse(fallbackResponses.default).replace('{topic}', topic);
}

// Function to get random response from an array
function getRandomResponse(responses) {
  return responses[Math.floor(Math.random() * responses.length)];
}

// Function to extract topic from user input
function extractTopic(input) {
  const words = input.split(' ');
  if (words.length > 1) {
    return words.slice(0, 2).join(' ');
  }
  return input;
}

// Generate chatbot response function using API
async function generateResponse(userInput) {
  const systemPrompt = `You are a helpful college chatbot assistant. You have knowledge about:
  - College programs and courses
  - Admission procedures
  - Campus facilities
  - Student life
  - Academic calendar
  - Library services
  - Sports facilities
  - Cafeteria and food services
  - Student organizations
  - Career services
  - Financial aid and scholarships
  
  Provide accurate, helpful, and friendly responses. If you don't know something, say so politely.
  Keep responses concise and relevant to college-related queries.`;

  try {
    console.log('Sending API request...');
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userInput
          }
        ],
        temperature: 0.7,
        max_tokens: 150
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error Response:', errorData);
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('API Response:', data);
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid API response format');
    }

    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(`Failed to get response: ${error.message}`);
  }
}
