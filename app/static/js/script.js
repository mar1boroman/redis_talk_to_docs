let messageCount = 0;

function toggleChatbox() {
    const chatbox = document.getElementById('chatbox');
    const display = chatbox.style.display;
    chatbox.style.display = display === 'none' || display === '' ? 'flex' : 'none';

    if (chatbox.style.display === 'flex') {
        updateMessageCount(0); // Reset message count when chatbox is opened
    }
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function sendMessage() {
    const input = document.getElementById('chatbox-input');
    const message = input.value;
    if (message.trim() !== '') {
        const chatboxBody = document.getElementById('chatbox-body');
        const newMessage = createMessageElement('user', message);
        chatboxBody.appendChild(newMessage);
        input.value = '';
        chatboxBody.scrollTop = chatboxBody.scrollHeight;

        // Send the message to the server
        fetch('/send_message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message }),
        })
        .then(response => response.json())
        .then(data => {
            const botMessage = createMessageElement('bot', data.reply);
            chatboxBody.appendChild(botMessage);
            chatboxBody.scrollTop = chatboxBody.scrollHeight;
        });
    }
}

function createMessageElement(sender, text) {
    const message = document.createElement('div');
    message.classList.add('message', sender);

    const avatar = document.createElement('div');
    avatar.classList.add('avatar');
    avatar.textContent = sender === 'user' ? '👤' : '🤖';

    const messageText = document.createElement('div');
    messageText.classList.add('text');
    messageText.textContent = text;

    if (sender === 'user') {
        message.appendChild(avatar);
        message.appendChild(messageText);
    } else {
        message.appendChild(messageText);
        message.appendChild(avatar);
    }

    return message;
}

function updateMessageCount(count) {
    messageCount = count;
    const floatButton = document.getElementById('chatbox-float-button');
    if (messageCount > 0) {
        let badge = floatButton.querySelector('.badge');
        if (!badge) {
            badge = document.createElement('span');
            badge.className = 'badge';
            floatButton.appendChild(badge);
        }
        badge.textContent = messageCount;
    } else {
        const badge = floatButton.querySelector('.badge');
        if (badge) {
            floatButton.removeChild(badge);
        }
    }
}

document.getElementById('file-input').addEventListener('change', function(event) {
    const files = event.target.files;
    const formData = new FormData();
    for (const file of files) {
        formData.append('files', file);
    }

    fetch('/upload', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        const filenames = data.filenames;
        const chatboxBody = document.getElementById('chatbox-body');
        const botMessage = createMessageElement('bot', `The following files were uploaded: ${filenames.join(', ')}`);
        chatboxBody.appendChild(botMessage);
        chatboxBody.scrollTop = chatboxBody.scrollHeight;

        updateMessageCount(messageCount + 1); // Increase the message count
    });
});