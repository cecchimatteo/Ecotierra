// AI Chat Widget JavaScript
class AIChatWidget {
    constructor() {
        this.isOpen = false;
        this.currentCustomerId = null;
        this.currentPage = null;
        this.companies = [];
        this.init();
    }

    init() {
        // Get DOM elements
        this.toggle = document.getElementById('aiChatToggle');
        this.container = document.getElementById('aiChatContainer');
        this.closeBtn = document.getElementById('aiChatClose');
        this.messages = document.getElementById('aiChatMessages');
        this.input = document.getElementById('aiChatInput');
        this.sendBtn = document.getElementById('aiChatSend');

        // Bind events
        this.toggle.addEventListener('click', () => this.toggleChat());
        this.closeBtn.addEventListener('click', () => this.closeChat());
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        // Load companies for dropdown
        this.loadCompanies();

        // Detect current page and customer context
        this.detectContext();
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        this.container.style.display = this.isOpen ? 'flex' : 'none';
        
        if (this.isOpen) {
            this.input.focus();
            this.detectContext(); // Update context when opening
        }
    }

    closeChat() {
        this.isOpen = false;
        this.container.style.display = 'none';
    }

    detectContext() {
        // Detect current page
        const path = window.location.pathname;
        if (path.includes('/financial-statements')) {
            this.currentPage = 'financial_statements';
        } else if (path.includes('/credit-reports')) {
            this.currentPage = 'credit_reports';
        } else if (path.includes('/crm')) {
            this.currentPage = 'crm';
        } else if (path.includes('/credit-analysis')) {
            this.currentPage = 'credit_analysis';
        } else {
            this.currentPage = 'general';
        }

        // Try to detect customer ID from URL or page elements
        this.detectCustomerId();
    }

    async loadCompanies() {
        try {
            const response = await fetch('/ai-assistant/companies');
            const data = await response.json();
            if (data.success) {
                this.companies = data.companies;
                this.createCompanyDropdown();
            }
        } catch (error) {
            console.error('Error loading companies:', error);
        }
    }

    createCompanyDropdown() {
        // Create dropdown container
        const dropdownContainer = document.createElement('div');
        dropdownContainer.className = 'ai-company-selector';
        dropdownContainer.innerHTML = `
            <label for="aiCompanySelect">Select Company:</label>
            <select id="aiCompanySelect" class="form-select form-select-sm">
                <option value="">-- Choose a company --</option>
                ${this.companies.map(company => 
                    `<option value="${company.CpID}">${company.CompanyNm}</option>`
                ).join('')}
            </select>
        `;

        // Insert before the input field
        const inputContainer = this.input.parentElement;
        inputContainer.parentElement.insertBefore(dropdownContainer, inputContainer);

        // Add event listener
        const select = document.getElementById('aiCompanySelect');
        select.addEventListener('change', (e) => {
            this.currentCustomerId = e.target.value || null;
        });
    }

    detectCustomerId() {
        // Try to get customer ID from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        this.currentCustomerId = urlParams.get('customer_id') || urlParams.get('id');

        // If not in URL, try to get from page elements
        if (!this.currentCustomerId) {
            const customerElement = document.querySelector('[data-customer-id]');
            if (customerElement) {
                this.currentCustomerId = customerElement.getAttribute('data-customer-id');
            }
        }

        // If still not found, try to get from table rows (for list pages)
        if (!this.currentCustomerId && this.currentPage === 'financial_statements') {
            const selectedRow = document.querySelector('.table tbody tr.selected');
            if (selectedRow) {
                this.currentCustomerId = selectedRow.getAttribute('data-customer-id');
            }
        }
    }

    async sendMessage() {
        const message = this.input.value.trim();
        if (!message) return;

        // Add user message to chat
        this.addMessage(message, 'user');
        this.input.value = '';
        this.sendBtn.disabled = true;

        try {
            // Show typing indicator
            this.showTypingIndicator();

            // Send to AI
            const response = await fetch('/ai-assistant/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    customer_id: this.currentCustomerId,
                    context_type: this.getContextType(),
                    page: this.currentPage
                })
            });

            const data = await response.json();

            // Remove typing indicator
            this.hideTypingIndicator();

            if (data.success) {
                this.addMessage(data.response, 'ai');
            } else {
                this.addMessage('Sorry, I encountered an error. Please try again.', 'ai');
            }

        } catch (error) {
            console.error('AI Chat Error:', error);
            this.hideTypingIndicator();
            this.addMessage('Sorry, I\'m having trouble connecting right now. Please try again later.', 'ai');
        } finally {
            this.sendBtn.disabled = false;
        }
    }

    addMessage(content, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = type === 'user' ? 'user-message' : 'ai-message';

        const messageContent = document.createElement('div');
        messageContent.className = type === 'user' ? 'user-message-content' : 'ai-message-content';

        if (type === 'user') {
            messageContent.innerHTML = `
                <div>${this.escapeHtml(content)}</div>
            `;
        } else {
            messageContent.innerHTML = `
                <i class="bi bi-robot"></i>
                <div><strong>AI Assistant:</strong> ${this.formatAIResponse(content)}</div>
            `;
        }

        messageDiv.appendChild(messageContent);
        this.messages.appendChild(messageDiv);
        this.messages.scrollTop = this.messages.scrollHeight;
    }

    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'ai-message typing-indicator';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `
            <div class="ai-message-content">
                <i class="bi bi-robot"></i>
                <div>
                    <strong>AI Assistant:</strong> 
                    <span class="typing-dots">
                        <span>.</span><span>.</span><span>.</span>
                    </span>
                </div>
            </div>
        `;
        this.messages.appendChild(typingDiv);
        this.messages.scrollTop = this.messages.scrollHeight;
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    getContextType() {
        switch (this.currentPage) {
            case 'financial_statements':
                return 'financial';
            case 'credit_reports':
                return 'credit';
            case 'crm':
                return 'customer';
            case 'credit_analysis':
                return 'risk';
            default:
                return 'general';
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatAIResponse(text) {
        // Convert line breaks to <br> tags
        return text.replace(/\n/g, '<br>');
    }
}

// Initialize AI Chat Widget when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.aiChatWidget = new AIChatWidget();
});

// Add typing animation CSS
const style = document.createElement('style');
style.textContent = `
    .typing-dots span {
        animation: typing 1.4s infinite;
        opacity: 0.3;
    }
    .typing-dots span:nth-child(1) { animation-delay: 0s; }
    .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
    .typing-dots span:nth-child(3) { animation-delay: 0.4s; }
    
    @keyframes typing {
        0%, 60%, 100% { opacity: 0.3; }
        30% { opacity: 1; }
    }
`;
document.head.appendChild(style);
