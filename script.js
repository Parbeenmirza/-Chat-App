import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onChildAdded,
  remove,
  onChildRemoved,
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDzNpURFLUjNBqmaaWBrEIn7EDvP5mlNYU",
  authDomain: "chat-app-9e09d.firebaseapp.com",
  projectId: "chat-app-9e09d",
  storageBucket: "chat-app-9e09d.firebasestorage.app",
  messagingSenderId: "755649457346",
  appId: "1:755649457346:web:eb285b68fb9352baed1f5b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const messagesRef = ref(database, "messages");

// DOM elements
const chatBox = document.getElementById("chat-box");
const chatInput = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");

// Function to append messages with delete functionality
function appendMessage(message, type, messageId) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("chat-message", type);
  messageDiv.setAttribute("data-id", messageId);

  // Message content
  const messageText = document.createElement("span");
  messageText.textContent = message;
  messageDiv.appendChild(messageText);

  // Delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.classList.add("delete-btn");
  deleteBtn.onclick = () => deleteMessage(messageId);
  messageDiv.appendChild(deleteBtn);

  chatBox.appendChild(messageDiv);

  // Scroll to the bottom of the chat box
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Send a message to Firebase
sendBtn.addEventListener("click", () => {
  const message = chatInput.value.trim();
  if (message) {
    push(messagesRef, { message, sender: "User" });
    chatInput.value = "";
  }
});

// Listen for new messages from Firebase
onChildAdded(messagesRef, (snapshot) => {
  const data = snapshot.val();
  const messageId = snapshot.key; // Unique ID for the message
  const type = data.sender === "User" ? "sent" : "received";
  appendMessage(data.message, type, messageId);
});

// Function to delete a message
function deleteMessage(messageId) {
  const messageRef = ref(database, `messages/${messageId}`);

  remove(messageRef).then(() => {
    alert("Message deleted!");
  });
}

// Listen for deleted messages
onChildRemoved(messagesRef, (snapshot) => {
  const messageId = snapshot.key;
  const messageDiv = document.querySelector(`[data-id='${messageId}']`);
  if (messageDiv) {
    messageDiv.remove();
  }
});

// Send message on pressing Enter
chatInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    sendBtn.click();
  }
});
