// Theme switcher
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


console.log("app.js loaded"); // DEBUG LINE

const firebaseConfig = {
  apiKey: "AIzaSyAGpNQEF7OTyEXwB1Y1Oq_vJCwqlitgwkc",
  authDomain: "workflow-92b7a.firebaseapp.com",
  projectId: "workflow-92b7a",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const email = localStorage.getItem("email");
if (!email) location.href = "index.html";

const list = document.getElementById("list");
const colRef = collection(db, "homework");

async function loadHomework() {
  list.innerHTML = "";
  const snap = await getDocs(colRef);

  snap.forEach(docSnap => {
    const hw = docSnap.data();

    if (hw.owner === email) {
      const li = document.createElement("li");
      const difficultyLabels = { 1: "Easy", 2: "Normal", 3: "Hard" };
      const difficultyColors = { 1: "#28a745", 2: "#ffc107", 3: "#dc3545" };
      const difficulty = hw.difficulty || 2;
      const diffLabel = difficultyLabels[difficulty];
      const diffColor = difficultyColors[difficulty];
      
      li.textContent = `${hw.subject} \n ${hw.task} (${hw.date})`;
      li.style.borderLeft = `4px solid ${diffColor}`;
      li.style.paddingLeft = "10px";
      
      const diffSpan = document.createElement("span");
      diffSpan.textContent = ` [${diffLabel}]`;
      diffSpan.style.color = diffColor;
      diffSpan.style.fontWeight = "bold";
      li.appendChild(diffSpan);

      const delBtn = document.createElement("button");
      delBtn.textContent = "Delete";
      delBtn.onclick = () => deleteHomework(docSnap.id);

      // Edit button placeholder (functionality to be added later)
      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.onclick = () => openEditPopup(docSnap.id, hw);

      li.appendChild(editBtn);
      li.appendChild(delBtn);
      list.appendChild(li);
    }
  });
}

window.addHomework = async function() {
  const subject = document.getElementById("subject").value;
  const task = document.getElementById("task").value;
  const date = document.getElementById("date").value;
  const difficulty = parseInt(document.getElementById("difficulty").value);

  if (!subject || !task || !date) return alert("Fill all fields");

  await addDoc(colRef, {
    subject,
    task,
    date,
    difficulty,
    owner: email
  });

  document.getElementById("subject").value = "";
  document.getElementById("task").value = "";
  document.getElementById("date").value = "";
  document.getElementById("difficulty").value = "2";
  updateDifficultyLabel();

  loadHomework();
};

function updateDifficultyLabel() {
  const difficulty = document.getElementById("difficulty").value;
  const labels = { "1": "Easy", "2": "Normal", "3": "Hard" };
  document.getElementById("difficulty-label").textContent = labels[difficulty];
}

// popup expression helpers
let currentEditId = null;

function updateEditDifficultyLabel() {
  const difficulty = document.getElementById("edit-difficulty").value;
  const labels = { "1": "Easy", "2": "Normal", "3": "Hard" };
  document.getElementById("edit-difficulty-label").textContent = labels[difficulty];
}

document.getElementById("edit-difficulty").addEventListener("input", updateEditDifficultyLabel);

document.getElementById("popup-cancel-btn").addEventListener("click", closePopup);

document.getElementById("popup-save-btn").addEventListener("click", async () => {
  if (!currentEditId) return;
  const updates = {
    subject: document.getElementById("edit-subject").value,
    task: document.getElementById("edit-task").value,
    date: document.getElementById("edit-date").value,
    difficulty: parseInt(document.getElementById("edit-difficulty").value, 10)
  };
  await updateHomework(currentEditId, updates);
  closePopup();
});

function closePopup() {
  document.getElementById("edit-popup").classList.add("hidden");
  document.getElementById("popup-overlay").classList.remove("active");
}

async function openEditPopup(id, hw) {
  currentEditId = id;
  document.getElementById("edit-subject").value = hw.subject || "";
  document.getElementById("edit-task").value = hw.task || "";
  document.getElementById("edit-date").value = hw.date || "";
  document.getElementById("edit-difficulty").value = hw.difficulty || 2;
  updateEditDifficultyLabel();
  document.getElementById("edit-popup").classList.remove("hidden");
  document.getElementById("popup-overlay").classList.add("active");
}

async function updateHomework(id, updates) {
  const ref = doc(db, "homework", id);
  await updateDoc(ref, updates);
  loadHomework();
}

document.getElementById("difficulty").addEventListener("input", updateDifficultyLabel);

window.deleteHomework = async function(id) {
  await deleteDoc(doc(db, "homework", id));
  loadHomework();
};

window.logout = function() {
  localStorage.removeItem("email");
  location.href = "index.html";
};

loadHomework();



const themeToggle = document.getElementById('theme-toggle');

if (themeToggle) {
  // Load saved theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
    themeToggle.textContent = 'Light Mode';
  }

  // Toggle theme on click
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    themeToggle.textContent = isDark ? 'Light Mode' : 'Dark Mode';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
}

// Page navigation
const sections = {
  'home-btn': 'home-section',
  'profile-btn': 'profile-section',
  'settings-btn': 'settings-section'
};

// Set default active
document.getElementById('home-btn').classList.add('active');

Object.keys(sections).forEach(btnId => {
  const btn = document.getElementById(btnId);
  if (btn) {
    btn.addEventListener('click', () => {
      // Remove active from all li
      document.querySelectorAll('.sidebar li').forEach(li => {
        li.classList.remove('active');
      });
      // Add active to clicked li
      btn.classList.add('active');

      // Hide all sections
      document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
      });
      // Show target section
      const targetSection = document.getElementById(sections[btnId]);
      if (targetSection) {
        targetSection.classList.add('active');
      }
    });
  }
});