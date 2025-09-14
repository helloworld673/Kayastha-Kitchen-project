const RESTAURANT_INFO = {
    "name": "Kayastha Kitchen",
    "cuisine": "Indian",
    "hours": {
        "weekdays": "11:00 AM - 10:00 PM",
        "weekends": "12:00 PM - 11:00 PM"
    },
    "location": "123 Ayur Vigyan Nagar, New Delhi, India",
    "phone": "+91 976083XXXX",
    "email": "orderfood@kayasthakitchen.com",
    "popular_dishes": [
        "Paneer Butter Masala - ₹250",
        "Butter Chicken - ₹300",
        "Malai Kofta - ₹280",
        "Rajma Rice - ₹220",
        "Tandoori Platter - ₹350"
    ],
    "special_offers": [
        "Daily Happy Hour: 4-6 PM, 20% off appetizers",
        "Weekend Special: Live music with dinner",
        "Family Combo: 4 dishes + naan + dessert - ₹999"
    ],
    "reservation_policy": "Reservations recommended, especially on weekends. Call +91 976083XXXX to book."
};


const chatbotIcon = document.getElementById("chatbot-icon");
const chatbotWindow = document.getElementById("chatbot-window");
const closeBtn = document.getElementById("close-btn");
const chatMessages = document.getElementById("chat-messages");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

function getRestaurantResponse(userInput) {
    userInput = userInput.toLowerCase();

    if (anyWordIn(userInput, ["hour", "open", "close", "time", "when"])) {
        return `🕐 <strong>Opening Hours:</strong><br>Weekdays: ${RESTAURANT_INFO['hours']['weekdays']}<br>Weekends: ${RESTAURANT_INFO['hours']['weekends']}`;
    } else if (anyWordIn(userInput, ["menu", "food", "dish", "eat", "order", "curry", "naan", "biryani", "rice", "chicken", "vegetarian"])) {
        const dishes = RESTAURANT_INFO['popular_dishes'].map(dish => `• ${dish}`).join("<br>");
        return `🍽️ <strong>Our Popular Dishes:</strong><br>${dishes}<br><br>Would you like to place an order?`;
    } else if (anyWordIn(userInput, ["where", "location", "address", "find", "map", "directions"])) {
        return `📍 <strong>Location:</strong><br>${RESTAURANT_INFO['location']}`;
    } else if (anyWordIn(userInput, ["phone", "call", "number", "contact", "email"])) {
        return `📞 <strong>Contact Us:</strong><br>Phone: ${RESTAURANT_INFO['phone']}<br>Email: ${RESTAURANT_INFO['email']}`;
    } else if (anyWordIn(userInput, ["reservation", "book", "table", "reserve"])) {
        return `📅 <strong>Reservations:</strong><br>${RESTAURANT_INFO['reservation_policy']}`;
    } else if (anyWordIn(userInput, ["offer", "special", "discount", "deal", "promotion", "combo"])) {
        const offers = RESTAURANT_INFO['special_offers'].map(offer => `• ${offer}`).join("<br>");
        return `🎉 <strong>Current Offers:</strong><br>${offers}`;
    } else if (anyWordIn(userInput, ["hello", "hi", "hey", "greetings", "namaste"])) {
        return `👋 <strong>Welcome to ${RESTAURANT_INFO['name']}!</strong><br>How can I help you today?`;
    } else if (anyWordIn(userInput, ["thank", "thanks", "appreciate", "dhanyavad"])) {
        return "You're welcome! 😊<br>We hope to serve you again soon!";
    } else if (anyWordIn(userInput, ["about", "info", "restaurant", "serve", "cuisine"])) {
        return `🍴 <strong>About Us:</strong><br>We serve authentic ${RESTAURANT_INFO['cuisine']} cuisine with traditional family recipes passed down for generations.`;
    } else if (anyWordIn(userInput, ["delivery", "deliver", "takeaway", "take away", "home delivery"])) {
        return `🚚 <strong>Delivery Information:</strong><br>We offer home delivery within 5km radius. Minimum order: ₹300. Delivery time: 30-45 minutes.`;
    } else if (anyWordIn(userInput, ["price", "cost", "expensive", "cheap", "rate", "rates"])) {
        return `💲 <strong>Pricing:</strong><br>We offer competitive prices for authentic Indian cuisine. Most main dishes range from ₹200 to ₹400.`;
    } else if (anyWordIn(userInput, ["spicy", "mild", "hot", "heat", "chili"])) {
        return `🌶️ <strong>Spice Levels:</strong><br>We can adjust spice levels to your preference. Just let us know when ordering!`;
    } else if (anyWordIn(userInput, ["vegetarian", "vegan", "jain", "gluten", "diet", "allergy"])) {
        return `🥦 <strong>Dietary Preferences:</strong><br>We have extensive vegetarian options. We can accommodate vegan, Jain, and gluten-free requests. Just inform us when ordering.`;
    } else {
        return "I can help with restaurant information! Ask about our hours, menu, location, or reservations. What would you like to know?";
    }
}

function anyWordIn(input, words) {
    return words.some(word => input.includes(word));
}

chatbotIcon.addEventListener("click", () => {
    chatbotWindow.classList.remove("hidden");
    chatbotIcon.style.display = "none";
    userInput.focus();
});

closeBtn.addEventListener("click", () => {
    chatbotWindow.classList.add("hidden");
    chatbotIcon.style.display = "flex";
});


function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    addMessage(message, 'user');
    userInput.value = '';

    showTypingIndicator();

    setTimeout(() => {

        const response = getRestaurantResponse(message);

        removeTypingIndicator();

        addMessage(response, 'bot');
    }, 1000);
}


function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);

    if (sender === 'bot') {
        messageDiv.innerHTML = text;
    } else {
        messageDiv.textContent = text;
    }

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing-indicator';
    typingDiv.classList.add('typing-indicator');
    typingDiv.innerHTML = `
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
    `;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}


function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}


sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

document.addEventListener('click', (event) => {
    const isChatbot = chatbotWindow.contains(event.target) || chatbotIcon.contains(event.target);
    if (!isChatbot && !chatbotWindow.classList.contains('hidden')) {
        chatbotWindow.classList.add("hidden");
        chatbotIcon.style.display = "flex";
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !chatbotWindow.classList.contains('hidden')) {
        chatbotWindow.classList.add("hidden");
        chatbotIcon.style.display = "flex";
    }
});


document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

async function getAIResponse(userMessage) {
    try {

        const response = await fetch("https://guni501/myrestaurant-chatbot.hf.space/chat", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: userMessage
            })
        });

        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error('Error calling API:', error);
        return "I'm having trouble connecting right now. Please call us at " + RESTAURANT_INFO.phone + " for assistance.";
    }
}

console.log('Kayastha Kitchen website loaded successfully!');
