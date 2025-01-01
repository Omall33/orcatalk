const apiKey = 'sk-svcacct-_EZ8foRO5Ly_Kbbn9een_Ow9z087zIbc2W4O_s9yKXNteXG86m6ohNAaA1KBt9mT3BlbkFJawKhon0Cg_zp0qm2VxcWQYWGBr8sAHjXf1-TtIUO39Ns6fnfXW-B6PX9r5joRAA'; // Replace with your OpenAI API key

async function sendMessage() {
    const userInput = document.getElementById("user-input");
    const chatBox = document.getElementById("chat-box");

    const userMessage = userInput.value.trim();
    if (userMessage === "") return;

    // Display user message in the chat box
    chatBox.innerHTML += `<div class="message user">${userMessage}</div>`;
    
    // Clear the input field after sending the message
    userInput.value = "";
    
    // Scroll to the bottom to show the latest message
    chatBox.scrollTop = chatBox.scrollHeight;

    // Display a "processing" message while waiting for the bot response
    chatBox.innerHTML += `<div class="message bot processing">Processing...</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const botResponse = await getBotResponse(userMessage);
        // Replace "processing" message with the bot response
        chatBox.innerHTML = chatBox.innerHTML.replace(
            `<div class="message bot processing">Processing...</div>`,
            `<div class="message bot">${botResponse}</div>`
        );
        chatBox.scrollTop = chatBox.scrollHeight;
    } catch (error) {
        console.error('Error:', error);
        chatBox.innerHTML = chatBox.innerHTML.replace(
            `<div class="message bot processing">Processing...</div>`,
            `<div class="message bot">Sorry, something went wrong. Please try again later.</div>`
        );
    }
}

// Function to call OpenAI API and get the bot response
async function getBotResponse(userMessage) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}` // Use your OpenAI API key
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo', // You can also use 'gpt-4' or other available models
            messages: [
                {
                    role: 'system',
                    content: `You are OrcaTalk, a helpful chatbot inspired by the intelligence and grace of an orca whale. 
                              Respond with concise, friendly, and empathetic answers while incorporating ocean-themed metaphors 
                              when appropriate. Stay professional but engaging.`
                },
                { role: 'user', content: userMessage }
            ]
        })
    });

    const data = await response.json();
    if (data.choices && data.choices.length > 0) {
        return data.choices[0].message.content;
    } else {
        return "Sorry, I didn't quite catch that. Could you rephrase?";
    }
}
