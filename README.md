# Post Board

A small, responsive web app that demonstrates how a browser communicates with a REST API. Built with **HTML, CSS, and vanilla JavaScript** for a Client-Side Scripts lab at NUST MISIS.

## What it does

- **Load posts:** fetch five sample posts with `GET /posts?_limit=5` and render them in the page.
- **Create a post:** validate a title and message, send JSON with `POST /posts`, and display the returned result.
- **Handle failures:** show loading states, HTTP errors, and a retry option without reloading the page.

The app uses the public [JSONPlaceholder](https://jsonplaceholder.typicode.com/) test API. **POST requests are simulated:** the service returns a response but does not permanently save new posts.

## Project files

```text
postboard-demo/
├── index.html   # Page structure and form
├── style.css    # Layout and responsive styles
├── app.js       # API requests, validation, and DOM updates
└── README.md    # Project documentation
```

No build tools, dependencies, API keys, or backend are required.

## Run locally

Open the folder in VS Code and use the **Live Server** extension to launch `index.html`. Alternatively, from the project directory run:

```bash
python -m http.server 5500
```

Then visit `http://localhost:5500` in your browser. An internet connection is needed to reach JSONPlaceholder.

## Try it

1. Click **Load posts**. Five posts should appear with an HTTP 200 success message.
2. Click **Create post** with empty fields. The form should request a title and message.
3. Enter both fields and submit. JSONPlaceholder typically responds with HTTP 201 and a simulated post ID.
4. To test error handling locally, temporarily change the GET endpoint in `app.js` from `/posts?_limit=5` to `/postz`. Reload the page and click **Load posts** to see HTTP 404. Restore the original URL afterward.

## Deploy to GitHub Pages

1. Create a **public** GitHub repository, for example `postboard-demo`.
2. Upload `index.html`, `style.css`, `app.js`, and `README.md` directly to the repository root.
3. Open **Settings → Pages → Build and deployment**.
4. Choose **Deploy from a branch**, select `main` and `/(root)`, then save.
5. Open the published URL shown in Pages settings.

GitHub Pages hosts the app's static files. API calls still go directly from the browser to JSONPlaceholder, so access to that service is required.

## Implementation notes

- Uses `fetch`, `async/await`, `response.ok`, and `try/catch/finally` for requests and feedback.
- Uses `textContent` for API data rather than inserting untrusted markup into the page.
- Prevents empty or whitespace-only posts and disables buttons during pending requests.
- Keeps the interface responsive and labels/status messages accessible.

This is a frontend demo, not a production blogging backend. Posts are not stored locally or on JSONPlaceholder.
