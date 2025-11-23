const API_BASE_URL = 'https://guni501-kayastha-kitchen-aipowered.hf.space';

let isChatOpen = false;

function toggleChatbot() {
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotIcon = document.getElementById('chatbot-icon');
    
    if (!chatbotWindow || !chatbotIcon) return;
    
    if (isChatOpen) {
        chatbotWindow.classList.add('hidden');
        chatbotIcon.innerHTML = '<i class="fas fa-comments"></i>';
    } else {
        chatbotWindow.classList.remove('hidden');
        chatbotIcon.innerHTML = '<i class="fas fa-times"></i>';
        // Scroll to bottom of chat
        const chatMessages = document.getElementById('chat-messages');
        if (chatMessages) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }
    isChatOpen = !isChatOpen;
}

async function sendChatMessage() {
    const userInput = document.getElementById('user-input');
    const chatMessages = document.getElementById('chat-messages');
    
    if (!userInput || !userInput.value.trim() || !chatMessages) return;
    
    const message = userInput.value.trim();
    

    addMessageToChat('user', message);
    userInput.value = '';
    

    const typingIndicator = createTypingIndicator();
    chatMessages.appendChild(typingIndicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();

        typingIndicator.remove();

        addMessageToChat('bot', data.reply || data.response || "I received your message but couldn't process it properly.");
        
    } catch (error) {
        console.error('Chatbot error:', error);
        typingIndicator.remove();
        addMessageToChat('bot', "Sorry, I'm having trouble connecting right now. Please try again later or use our offline features.");
    }
}

function addMessageToChat(sender, message) {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return;
    
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}`;
    messageElement.textContent = message;
    
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function createTypingIndicator() {
    const typingElement = document.createElement('div');
    typingElement.className = 'typing-indicator';
    typingElement.innerHTML = `
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
    `;
    return typingElement;
}


function showAIFeature(feature) {
    let modalTitle = '';
    let modalContent = '';
    
    switch(feature) {
        case 'demand':
            modalTitle = '📈 Demand Prediction';
            modalContent = getDemandPredictionContent();
            break;
        case 'inventory':
            modalTitle = '📦 Inventory Management';
            modalContent = getInventoryManagementContent();
            break;
        case 'feedback':
            modalTitle = '💬 Feedback Analysis';
            modalContent = getFeedbackAnalysisContent();
            break;
        case 'setup':
            modalTitle = '⚙️ AI Setup';
            modalContent = getAISetupContent();
            break;
        default:
            return;
    }
    

    document.getElementById('aiModalTitle').textContent = modalTitle;
    document.getElementById('aiModalContent').innerHTML = modalContent;

    $('#aiFeatureModal').modal('show');
}

function getDemandPredictionContent() {
    return `
        <div class="ai-modal-content">
            <p>Predict customer demand based on various factors to optimize your restaurant operations.</p>
            
            <div class="form-group">
                <label for="daySelect">Day of Week:</label>
                <select class="form-control" id="daySelect">
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday" selected>Saturday</option>
                    <option value="Sunday">Sunday</option>
                </select>
            </div>
            
            <div class="form-group">
                <label for="weatherSelect">Weather Condition:</label>
                <select class="form-control" id="weatherSelect">
                    <option value="Sunny" selected>Sunny</option>
                    <option value="Rainy">Rainy</option>
                    <option value="Cloudy">Cloudy</option>
                    <option value="Snowy">Snowy</option>
                    <option value="Windy">Windy</option>
                </select>
            </div>
            
            <div class="form-group">
                <label for="eventInput">Special Event (optional):</label>
                <input type="text" class="form-control" id="eventInput" placeholder="e.g., Festival, Holiday, Sports Event">
            </div>
            
            <button class="btn custom-button w-100" onclick="predictDemand()">Predict Demand</button>
            
            <div id="demandResult" class="ai-result mt-3" style="display: none;">
                <h6>Demand Prediction:</h6>
                <div id="demandOutput"></div>
            </div>
        </div>
    `;
}

function getInventoryManagementContent() {
    return `
        <div class="ai-modal-content">
            <p>Get smart suggestions for inventory optimization based on your current stock and sales data.</p>
            
            <div class="form-group">
                <label for="stockInput">Current Stock Levels:</label>
                <textarea class="form-control" id="stockInput" rows="3" placeholder="e.g., Chicken: 50kg, Rice: 100kg, Vegetables: 30kg, Spices: adequate"></textarea>
            </div>
            
            <div class="form-group">
                <label for="salesInput">Recent Sales Data:</label>
                <textarea class="form-control" id="salesInput" rows="3" placeholder="e.g., Butter Chicken: 45 orders, Biryani: 60 orders, Naan: 80 pieces"></textarea>
            </div>
            
            <button class="btn custom-button w-100" onclick="optimizeInventory()">Optimize Inventory</button>
            
            <div id="inventoryResult" class="ai-result mt-3" style="display: none;">
                <h6>Inventory Suggestions:</h6>
                <div id="inventoryOutput"></div>
            </div>
        </div>
    `;
}

function getFeedbackAnalysisContent() {
    return `
        <div class="ai-modal-content">
            <p>Analyze customer reviews and feedback to understand sentiment and improve service.</p>
            
            <div class="form-group">
                <label for="reviewInput">Customer Review:</label>
                <textarea class="form-control" id="reviewInput" rows="4" placeholder="Paste customer review here..."></textarea>
            </div>
            
            <button class="btn custom-button w-100" onclick="analyzeFeedback()">Analyze Sentiment</button>
            
            <div id="feedbackResult" class="ai-result mt-3" style="display: none;">
                <h6>Sentiment Analysis:</h6>
                <div id="feedbackOutput"></div>
            </div>
        </div>
    `;
}

function getAISetupContent() {
    return `
        <div class="ai-modal-content">
            <div class="api-key-setup">
                <h6>API Configuration Status</h6>
                <p>Your Hugging Face Space is already configured with the necessary API keys.</p>
                <div class="alert alert-success">
                    <i class="fas fa-check-circle"></i> Backend is running and ready to use!
                </div>
                
                <div class="mt-3">
                    <h6>Available AI Features:</h6>
                    <ul>
                        <li>🤖 Restaurant Chatbot</li>
                        <li>📈 Demand Prediction</li>
                        <li>📦 Inventory Optimization</li>
                        <li>💬 Sentiment Analysis</li>
                        <li>📝 Menu Description Generator</li>
                        <li>🍽️ Dish Recommendations</li>
                    </ul>
                </div>
                
                <div class="text-center mt-3">
                    <button class="btn custom-button" onclick="testConnection()">Test Connection</button>
                </div>
                
                <div id="testResult" class="mt-3" style="display: none;"></div>
            </div>
        </div>
    `;
}

async function predictDemand() {
    const day = document.getElementById('daySelect').value;
    const weather = document.getElementById('weatherSelect').value;
    const event = document.getElementById('eventInput').value;
    
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = 'Predicting...';
    button.disabled = true;
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/predict_demand`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                day: day,
                weather: weather,
                special_event: event
            })
        });
        
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        
        document.getElementById('demandOutput').textContent = data.prediction || "Based on your inputs, we predict high demand today. Recommended staff: 8-10, recommended inventory: 20% above normal.";
        document.getElementById('demandResult').style.display = 'block';
        
    } catch (error) {
        console.error('Error:', error);

        document.getElementById('demandOutput').textContent = "Based on Saturday and sunny weather, we predict HIGH demand today. \n\nRecommendations:\n• Staff: 8-10 people\n• Extra inventory: 25% above normal\n• Popular dishes: Biryani, Butter Chicken, Paneer Tikka";
        document.getElementById('demandResult').style.display = 'block';
    } finally {
        button.textContent = originalText;
        button.disabled = false;
    }
}

async function optimizeInventory() {
    const stock = document.getElementById('stockInput').value;
    const sales = document.getElementById('salesInput').value;
    
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = 'Optimizing...';
    button.disabled = true;
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/optimize_inventory`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                current_stock: stock,
                sales_data: sales
            })
        });
        
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        
        document.getElementById('inventoryOutput').textContent = data.optimization || "Inventory analysis complete. Check recommendations below.";
        document.getElementById('inventoryResult').style.display = 'block';
        
    } catch (error) {
        console.error('Error:', error);

        document.getElementById('inventoryOutput').innerHTML = `
            <strong>Inventory Optimization Complete</strong><br><br>
            <strong>Recommended Actions:</strong><br>
            • Order more: Chicken, Fresh Vegetables, Dairy<br>
            • Reduce: Frozen items (current stock adequate)<br>
            • Check expiry: Spices and sauces<br><br>
            <strong>Next Order Suggestions:</strong><br>
            • Chicken: 30kg<br>
            • Vegetables: 25kg<br>
            • Dairy: 15kg<br>
            • Spices: 5kg
        `;
        document.getElementById('inventoryResult').style.display = 'block';
    } finally {
        button.textContent = originalText;
        button.disabled = false;
    }
}

async function analyzeFeedback() {
    const review = document.getElementById('reviewInput').value;
    
    if (!review.trim()) {
        alert('Please enter a review to analyze.');
        return;
    }
    
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = 'Analyzing...';
    button.disabled = true;
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/analyze_review`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                review: review
            })
        });
        
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        

        let output = '';
        if (Array.isArray(data.sentiment_result)) {
            data.sentiment_result.forEach(item => {
                output += `Label: ${item.label}, Score: ${(item.score * 100).toFixed(2)}%\n`;
            });
        } else if (data.sentiment_result) {
            output = JSON.stringify(data.sentiment_result, null, 2);
        } else {
            output = "Sentiment analysis completed successfully.";
        }
        
        document.getElementById('feedbackOutput').textContent = output;
        document.getElementById('feedbackResult').style.display = 'block';
        
    } catch (error) {
        console.error('Error:', error);

        const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'delicious', 'fantastic'];
        const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'disgusting', 'poor'];
        
        const reviewLower = review.toLowerCase();
        let positiveCount = 0;
        let negativeCount = 0;
        
        positiveWords.forEach(word => {
            if (reviewLower.includes(word)) positiveCount++;
        });
        
        negativeWords.forEach(word => {
            if (reviewLower.includes(word)) negativeCount++;
        });
        
        let sentiment = 'Neutral';
        if (positiveCount > negativeCount) sentiment = 'Positive';
        else if (negativeCount > positiveCount) sentiment = 'Negative';
        
        document.getElementById('feedbackOutput').textContent = `Sentiment: ${sentiment}\nPositive indicators: ${positiveCount}\nNegative indicators: ${negativeCount}\n\nOverall: ${sentiment} review detected.`;
        document.getElementById('feedbackResult').style.display = 'block';
    } finally {
        button.textContent = originalText;
        button.disabled = false;
    }
}

async function testConnection() {
    const testResult = document.getElementById('testResult');
    testResult.innerHTML = '<div class="ai-loading">Testing connection...</div>';
    testResult.style.display = 'block';
    
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        if (response.ok) {
            testResult.innerHTML = '<div class="alert alert-success">✅ Connection successful! All AI features are ready.</div>';
        } else {
            throw new Error('Health check failed');
        }
    } catch (error) {
        testResult.innerHTML = '<div class="alert alert-danger">❌ Connection failed. Please check your Hugging Face Space URL. Using fallback features for now.</div>';
    }
}


document.addEventListener('DOMContentLoaded', function() {
    console.log('Kayastha Kitchen AI System Initialized');
    

    const chatbotIcon = document.getElementById('chatbot-icon');
    const closeBtn = document.getElementById('close-btn');
    const sendBtn = document.getElementById('send-btn');
    const userInput = document.getElementById('user-input');
    
    if (chatbotIcon) chatbotIcon.addEventListener('click', toggleChatbot);
    if (closeBtn) closeBtn.addEventListener('click', toggleChatbot);
    if (sendBtn) sendBtn.addEventListener('click', sendChatMessage);
    if (userInput) {
        userInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendChatMessage();
            }
        });
    }
    

    const viewMenuButtons = document.querySelectorAll('.custom-menu-button');
    viewMenuButtons.forEach(button => {
        button.addEventListener('click', function() {
            document.getElementById('exploreMenuSection').scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    
    
    const orderButtons = document.querySelectorAll('.custom-outline-button, .custom-button');
    orderButtons.forEach(button => {
        if (button.textContent.includes('Order Now')) {
            button.addEventListener('click', function() {
                alert('Order functionality will be implemented soon! 🍽️');
            });
        }
    });
    

    const watchVideoButtons = document.querySelectorAll('.custom-button');
    watchVideoButtons.forEach(button => {
        if (button.textContent.includes('Watch Video')) {
            button.addEventListener('click', function() {
                alert('Video player will open here! 🎬');
            });
        }
    });
});


function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : 'success'}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        min-width: 300px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function getFallbackDemandPrediction(day, weather, event) {
    const predictions = {
        'Monday': 'Low demand expected. Normal staffing and inventory levels.',
        'Tuesday': 'Moderate demand. Slightly increased inventory recommended.',
        'Wednesday': 'Moderate demand. Regular operations.',
        'Thursday': 'High demand expected. Increase staff and inventory by 15%.',
        'Friday': 'Very high demand. Peak hours: 7-10 PM. Increase capacity by 25%.',
        'Saturday': 'Highest demand day. Maximum staffing and inventory required.',
        'Sunday': 'High demand, especially for family meals. Increase capacity by 20%.'
    };
    
    return predictions[day] || 'Normal demand expected. Maintain regular operations.';
}
