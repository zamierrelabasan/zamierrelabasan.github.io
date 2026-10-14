/* =========================================================
   Student Portfolio - script.js
   1. Mobile menu   2. Projects from JSON   3. GitHub API
   4. Contact form validation   5. Back to top button
   ========================================================= */

// >>> CHANGE THIS to your real GitHub username <<<
const GITHUB_zamierrelabasan = "zamierrelabasan";


/* ---------- 1. Mobile menu ---------- */
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");

navToggle.addEventListener("click", function () {
  const isOpen = navMenu.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", isOpen);
  navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
});

// Close the menu after tapping a link
navMenu.querySelectorAll("a").forEach(function (link) {
  link.addEventListener("click", function () {
    navMenu.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
  });
});


/* ---------- 2. Load projects from data/projects.json ---------- */
const projectsGrid = document.getElementById("projectsGrid");

async function loadProjects() {
  try {
    const response = await fetch("data/projects.json");
    if (!response.ok) {
      throw new Error("HTTP status " + response.status);
    }
    const projects = await response.json();   // parse the JSON

    projectsGrid.innerHTML = "https://github.com/zamierrelabasan/zamierrelabasan.github.io.git";               // remove "Loading..." text
    projects.forEach(function (project) {
      projectsGrid.appendChild(createProjectCard(project));
      } catch (error) {
    console.warn("Projects could not be loaded:", error.message);
    projectsGrid.innerHTML =
      '<p class="status-message error">Unable to load projects. Please try again later.</p>';
  }
}
    });
  
// Build one project card (textContent is used so data is never run as HTML)
function createProjectCard(project) {
  const card = document.createElement("article");
  card.className = "card project-card";

  const img = document.createElement("img");
  img.src = project.screenshot;
  img.alt = "Screenshot of " + project.title;
  img.loading = "lazy";

  const body = document.createElement("div");
  body.className = "project-body";

  const title = document.createElement("h3");
  title.textContent = project.title;

  const description = document.createElement("p");
  description.textContent = project.description;

  const badges = document.createElement("ul");
  badges.className = "badges";
  project.technologies.forEach(function (tech) {
    const li = document.createElement("li");
    li.textContent = tech;
    badges.appendChild(li);
  });

  const role = document.createElement("p");
  role.className = "project-role";
  role.textContent = "My role: " + project.role;

  const link = document.createElement("a");
  link.className = "btn btn-outline";
  link.href = project.link;
  link.target = "_blank";
  link.rel = "noopener";
  link.textContent = "View project";

  body.append(title, description, badges, role, link);
  card.append(img, body);
  return card;
}


/* ---------- 3. Latest GitHub repositories (REST API) ---------- */
const repoList = document.getElementById("repoList");

async function loadRepos() {
  const unavailable =
    '<li class="status-message error">GitHub repositories are currently unavailable. Please try again later.</li>';

  // Skip the request until a real username is set (avoids a 404 error)
  if (GITHUB_zamierrelabasan === "zamierrelabasan") {
    repoList.innerHTML =
      '<li class="status-message">Set your GitHub username in js/script.js to show your latest repositories.</li>';
    return;
  }

  try {
    const url = "https://api.github.com/users/" + GITHUB_zamierrelabasan + "/repos?sort=updated&per_page=5";
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("HTTP status " + response.status);
    }
    const repos = await response.json();

    if (repos.length === 0) {
      repoList.innerHTML = '<li class="status-message">No public repositories yet.</li>';
      return;
    }

    repoList.innerHTML = "";
    repos.forEach(function (repo) {
      const item = document.createElement("li");
      item.className = "repo-item";

      const link = document.createElement("a");
      link.href = repo.html_url;
      link.target = "_blank";
      link.rel = "noopener";
      link.textContent = repo.name;

      const language = document.createElement("span");
      language.className = "repo-lang";
      language.textContent = repo.language || "Language not specified";

      item.append(link, language);
      repoList.appendChild(item);
    });
  } catch (error) {
    console.warn("GitHub data could not be loaded:", error.message);
    repoList.innerHTML = unavailable;
  }
}


/* ---------- 4. Contact form validation ---------- */
const form = document.getElementById("contactForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");
const formSuccess = document.getElementById("formSuccess");

// Simple email pattern: text@text.text
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function showError(input, errorId, message) {
  document.getElementById(errorId).textContent = message;
  input.classList.toggle("invalid", message !== "");
  input.setAttribute("aria-invalid", message !== "");
}

form.addEventListener("submit", function (event) {
  event.preventDefault();                 // never submit to a server
  formSuccess.textContent = "";

  let valid = true;

  if (nameInput.value.trim() === "") {
    showError(nameInput, "nameError", "Please enter your name.");
    valid = false;
  } else {
    showError(nameInput, "nameError", "");
  }

  if (emailInput.value.trim() === "") {
    showError(emailInput, "emailError", "Please enter your email address.");
    valid = false;
  } else if (!emailPattern.test(emailInput.value.trim())) {
    showError(emailInput, "emailError", "Please enter a valid email address, like name@example.com.");
    valid = false;
  } else {
    showError(emailInput, "emailError", "");
  }

  if (messageInput.value.trim() === "") {
    showError(messageInput, "messageError", "Please enter a message.");
    valid = false;
  } else {
    showError(messageInput, "messageError", "");
  }

  if (!valid) {
    return;                               // stop here if something is wrong
  }

  // Static site: the message is NOT really sent, we only simulate success
  formSuccess.textContent = "Thank you! Your message has been received.";
  form.reset();
});


/* ---------- 5. Back to top button (personal feature) ---------- */
const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", function () {
  // Show after scrolling 300px, hide near the top
  backToTop.classList.toggle("visible", window.scrollY > 300);
});

backToTop.addEventListener("click", function () {
  document.getElementById("home").scrollIntoView({ behavior: "smooth" });
});


/* ---------- Start ---------- */
loadProjects();
loadRepos();
