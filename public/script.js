const availableModels = [
  { id: 'gpt-4o', name: 'GPT-4o', icon: 'fa-solid fa-microchip' },
  { id: 'gpt-4.1-nano', name: 'GPT-4.1-Nano', icon: 'fa-solid fa-robot' },
  { id: 'deepseek-r1', name: 'DeepSeek R1', icon: 'fa-solid fa-brain' },
  { id: 'deepseek-v3', name: 'DeepSeek V3', icon: 'fa-solid fa-flask' },
  { id: 'claude-3.7', name: 'Claude 3.7', icon: 'fa-solid fa-cloud-sun' },
  { id: 'gemini-2.0', name: 'Gemini 2.0', icon: 'fa-solid fa-star' },
  { id: 'qwen-qwq-32b', name: 'Qwen QWQ 32B', icon: 'fa-solid fa-feather-pointed' }
];

const API_BASE_URL = '/api/chat';

const hamburgerBtn = document.getElementById('hamburger-btn');
const sidebar = document.getElementById('sidebar');
const modelList = document.getElementById('model-list');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatArea = document.getElementById('chat-area');
const emptyState = document.getElementById('empty-state');
const headerTitle = document.getElementById('header-title');

let selectedModel = availableModels[0].id;
let selectedModelName = availableModels[0].name;
let selectedModelIcon = availableModels[0].icon;
let initialGreeting = true;

const updateHeaderTitle = () => {
  headerTitle.textContent = selectedModelName;
};

const displayMessage = (role, content, modelName) => {
  if (initialGreeting) {
    emptyState.style.display = 'none';
    initialGreeting = false;
  }
  
  const messageContainer = document.createElement('div');
  messageContainer.className = `message-container ${role}`;

  const iconElement = document.createElement('div');
  iconElement.className = `message-icon ${role}`;
  iconElement.innerHTML = role === 'user' ? '<i class="fa-solid fa-user"></i>' : `<i class="${selectedModelIcon}"></i>`;
  
  const messageElement = document.createElement('div');
  messageElement.className = `chat-bubble ${role}`;
  messageElement.innerHTML = `
    <h4>${role === 'user' ? 'Kamu' : modelName}</h4>
    <p>${content}</p>
  `;

  if (role === 'ai') {
    messageContainer.appendChild(iconElement);
    messageContainer.appendChild(messageElement);
  } else {
    messageContainer.appendChild(messageElement);
    messageContainer.appendChild(iconElement);
  }
  
  chatArea.appendChild(messageContainer);
  chatArea.scrollTop = chatArea.scrollHeight;
};

const handleFormSubmit = async (e) => {
  e.preventDefault();
  const userMessage = chatInput.value.trim();
  if (!userMessage) return;

  displayMessage('user', userMessage);
  
  chatInput.value = '';
  chatInput.disabled = true;

  const loadingContainer = document.createElement('div');
  loadingContainer.className = 'message-container ai';

  const loadingIcon = document.createElement('div');
  loadingIcon.className = 'message-icon ai';
  loadingIcon.innerHTML = `<i class="${selectedModelIcon}"></i>`;

  const loadingBubble = document.createElement('div');
  loadingBubble.className = 'chat-bubble ai';
  loadingBubble.innerHTML = `<h4>${selectedModelName}</h4><p><span class="typing-indicator"><span>.</span><span>.</span><span>.</span></span></p>`;
  
  loadingContainer.appendChild(loadingIcon);
  loadingContainer.appendChild(loadingBubble);
  chatArea.appendChild(loadingContainer);
  chatArea.scrollTop = chatArea.scrollHeight;
  
  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: userMessage,
        model: selectedModel
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const aiResponse = await response.text();

    chatArea.removeChild(loadingContainer);
    displayMessage('ai', aiResponse, selectedModelName);

  } catch (error) {
    console.error('Error:', error);
    chatArea.removeChild(loadingContainer);
    displayMessage('ai', 'Maaf, terjadi kesalahan. Mohon coba lagi.', 'Error');
  } finally {
    chatInput.disabled = false;
    chatInput.focus();
  }
};

const handleModelSelect = (e) => {
  const button = e.target.closest('button');
  if (button) {
    const modelId = button.dataset.modelId;
    const modelData = availableModels.find(m => m.id === modelId);
    if (modelData) {
      selectedModel = modelData.id;
      selectedModelName = modelData.name;
      selectedModelIcon = modelData.icon;
      sidebar.classList.remove('open');
      updateHeaderTitle();
    }
  }
};

availableModels.forEach(model => {
  const listItem = document.createElement('li');
  const button = document.createElement('button');
  button.innerHTML = `<i class="${model.icon}"></i> ${model.name}`;
  button.dataset.modelId = model.id;
  button.addEventListener('click', handleModelSelect);
  listItem.appendChild(button);
  modelList.appendChild(listItem);
});

hamburgerBtn.addEventListener('click', () => {
  sidebar.classList.toggle('open');
});

document.addEventListener('click', (event) => {
  if (!sidebar.contains(event.target) && !hamburgerBtn.contains(event.target)) {
    sidebar.classList.remove('open');
  }
});

chatForm.addEventListener('submit', handleFormSubmit);

updateHeaderTitle();
