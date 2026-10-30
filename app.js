/**
 * Post Board: a small client-side REST API demo.
 * Uses JSONPlaceholder to demonstrate GET, POST, and error handling.
 */

// JSONPlaceholder accepts requests but does not persist new posts.
const GET_URL = "https://jsonplaceholder.typicode.com/posts?_limit=5";
const POST_URL = "https://jsonplaceholder.typicode.com/posts";

// Cache the elements used by both requests and their status messages.
const loadButton = document.getElementById("load-posts-btn");
const loadButtonLabel = document.getElementById("load-btn-label");
const postsList = document.getElementById("posts-list");
const postCount = document.getElementById("post-count");
const emptyState = document.getElementById("empty-state");
const getStatus = document.getElementById("get-status");
const getStatusText = document.getElementById("get-status-text");
const getStatusIcon = document.getElementById("get-status-icon");

const postForm = document.getElementById("create-post-form");
const titleInput = document.getElementById("post-title");
const bodyInput = document.getElementById("post-body");
const titleError = document.getElementById("title-error");
const bodyError = document.getElementById("body-error");
const createButton = document.getElementById("create-post-btn");
const createButtonLabel = document.getElementById("create-btn-label");
const postStatus = document.getElementById("post-status");
const postStatusText = document.getElementById("post-status-text");
const postStatusIcon = document.getElementById("post-status-icon");
const createdPreview = document.getElementById("created-preview");
const createdId = document.getElementById("created-id");
const createdTitle = document.getElementById("created-title");
const createdBody = document.getElementById("created-body");

// Keep feedback consistent across GET and POST requests.
function showStatus(box, textElement, iconElement, message, type) {
  box.hidden = false;
  box.classList.remove("notice-info", "notice-loading", "notice-success", "notice-error");
  box.classList.add(`notice-${type}`);
  textElement.textContent = message;
  iconElement.textContent = type === "success" ? "✓" : type === "error" ? "!" : "i";
}

// Treat remote data as text, never as HTML markup.
function makePostCard(post, position) {
  const article = document.createElement("article");
  article.className = "post-card";

  const meta = document.createElement("div");
  meta.className = "post-meta";

  const label = document.createElement("span");
  label.className = "post-label";
  label.textContent = `POST #${post.id}`;

  const sequence = document.createElement("span");
  sequence.className = "post-number";
  sequence.textContent = String(position).padStart(2, "0");

  const title = document.createElement("h3");
  title.textContent = post.title;

  const body = document.createElement("p");
  body.textContent = post.body;

  meta.append(label, sequence);
  article.append(meta, title, body);
  return article;
}

// Replace the current list with the latest API results.
function renderPosts(posts) {
  postsList.replaceChildren();
  posts.forEach((post, index) => {
    postsList.appendChild(makePostCard(post, index + 1));
  });

  postCount.textContent = String(posts.length);
  emptyState.hidden = posts.length !== 0;

  if (posts.length === 0) {
    emptyState.querySelector("h3").textContent = "No posts found";
    emptyState.querySelector("p").textContent = "The request succeeded but returned an empty list.";
  }
}

// GET five posts and render them in the browser.
async function loadPosts() {
  loadButton.disabled = true;
  loadButtonLabel.textContent = "Loading...";
  postsList.setAttribute("aria-busy", "true");
  showStatus(getStatus, getStatusText, getStatusIcon, "Loading five posts from the API...", "loading");

  try {
    const response = await fetch(GET_URL);

    // fetch only rejects on network failures, not HTTP error statuses.
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} — unable to load posts.`);
    }

    const posts = await response.json();
    if (!Array.isArray(posts)) {
      throw new Error("The server did not return a list of posts.");
    }

    renderPosts(posts);
    showStatus(getStatus, getStatusText, getStatusIcon,
      `Success! Loaded ${posts.length} post${posts.length === 1 ? "" : "s"} (HTTP ${response.status}).`,
      "success");
  } catch (error) {
    // Show both network failures and unsuccessful HTTP responses in the UI.
    renderPosts([]);
    emptyState.querySelector("h3").textContent = "Posts could not be loaded";
    emptyState.querySelector("p").textContent = "Check the connection or API address, then try again.";
    showStatus(getStatus, getStatusText, getStatusIcon,
      `Request failed: ${error.message} Click “Load posts” to retry.`, "error");
  } finally {

    loadButton.disabled = false;
    loadButtonLabel.textContent = "Load posts";
    postsList.setAttribute("aria-busy", "false");
  }
}

// Check the trimmed form values before sending anything.
function setFieldError(input, errorElement, message) {
  errorElement.textContent = message;
  errorElement.hidden = message === "";
  input.classList.toggle("invalid", message !== "");
  input.setAttribute("aria-invalid", message !== "" ? "true" : "false");
}

function validatePost(title, body) {
  setFieldError(titleInput, titleError, title ? "" : "Please enter a post title.");
  setFieldError(bodyInput, bodyError, body ? "" : "Please enter the post content.");
  return Boolean(title && body);
}

// POST a new post and show the response returned by the API.
async function createPost(event) {
  event.preventDefault();
  createdPreview.hidden = true;

  const title = titleInput.value.trim();
  const body = bodyInput.value.trim();

  if (!validatePost(title, body)) {
    showStatus(postStatus, postStatusText, postStatusIcon,
      "Please correct the highlighted fields before submitting.", "error");
    return;
  }

  createButton.disabled = true;
  createButtonLabel.textContent = "Sending...";
  showStatus(postStatus, postStatusText, postStatusIcon,
    "Sending your post to JSONPlaceholder...", "loading");

  try {
    const response = await fetch(POST_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body, userId: 1 })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} — the post was not created.`);
    }

    const savedPost = await response.json();
    // JSONPlaceholder simulates creation; the post is not stored permanently.
    createdId.textContent = `ID #${savedPost.id}`;
    createdTitle.textContent = savedPost.title;
    createdBody.textContent = savedPost.body;
    createdPreview.hidden = false;

    showStatus(postStatus, postStatusText, postStatusIcon,
      `Success! Server returned HTTP ${response.status}. This post is a simulated result.`,
      "success");

    postForm.reset();
    setFieldError(titleInput, titleError, "");
    setFieldError(bodyInput, bodyError, "");
  } catch (error) {
    showStatus(postStatus, postStatusText, postStatusIcon,
      `Request failed: ${error.message} Please try again.`, "error");
  } finally {
    createButton.disabled = false;
    createButtonLabel.textContent = "Create post";
  }
}

// Wire up user interactions.
loadButton.addEventListener("click", loadPosts);
postForm.addEventListener("submit", createPost);

// Remove error highlighting when students correct a field.
titleInput.addEventListener("input", () => setFieldError(titleInput, titleError, ""));
bodyInput.addEventListener("input", () => setFieldError(bodyInput, bodyError, ""));
