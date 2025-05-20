 const OPENROUTER_API_KEY = "votre clé api";
 const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

    let welcomeShown = false;

    function toggleChat() {
        const container = document.getElementById('chatContainer');
        const button = document.getElementById('chatButton');
        const wasHidden = container.style.display === 'none';

        container.style.display = wasHidden ? 'flex' : 'none'
        button.style.display = wasHidden ? 'none' : 'block';

        if (wasHidden && !welcomeShown) {
            showWelcomeMessage();
            welcomeShown = true;
        }
    }

    function showWelcomeMessage() {
        appendMessage("Salut 👋🏾 je suis Momar AI comment puis vous aider ! ", false);
    }

    function appendMessage(message, isUser) {
        const chatMessages = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        messageDiv.textContent = message;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function sendMessage() {
        const userInput = document.getElementById('userInput');
        const message = userInput.value.trim();
        
        if (!message) return;

        appendMessage(message, true);
        userInput.value = '';

        try {
            const response = await fetch(OPENROUTER_API_URL, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                    "HTTP-Referer": window.location.href,
                    "X-Title": "Chatbot",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "model": "deepseek/deepseek-chat:free",
                    "messages": [
                        {
                            "role": "user",
                            "content": message
                        }
                    ]
                })
            });

            const data = await response.json();
            const botResponse = data.choices[0].message.content;
            appendMessage(botResponse, false);
        } catch (error) {
            console.error("Error fetching response from OpenRouter API:", error);
            appendMessage("Sorry, I encountered an error. Please try again.", false);
        }
    }
    document.getElementById('userInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

