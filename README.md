# My Blog

A blog created with Sovereign.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Admin Panel

Visit `/admin` to manage your blog posts and use the AI agent.

## Environment Variables

### Required for Admin Panel

Set these environment variables when deploying:

```
# Use Sovereign's shared OAuth app (recommended - no setup required!)
SOVEREIGN_GITHUB_CLIENT_ID=your_sovereign_client_id
SOVEREIGN_GITHUB_CLIENT_SECRET=your_sovereign_client_secret

# OR use your own GitHub OAuth app
GITHUB_CLIENT_ID=your_own_client_id
GITHUB_CLIENT_SECRET=your_own_client_secret

# NextAuth
NEXTAUTH_URL=https://your-blog-domain.com
NEXTAUTH_SECRET=your_random_secret

# Repository info (set automatically when you create the blog)
GITHUB_REPO_NAME=your-repo-name
GITHUB_REPO_OWNER=your-github-username

# Optional: Claude API key for AI agent
CLAUDE_API_KEY=your_claude_api_key
```

### Getting Sovereign OAuth Credentials

Get the shared OAuth credentials from:
- Your Sovereign dashboard
- Or contact support at https://sovereign.app/support

No need to create your own GitHub OAuth app! Just use Sovereign's shared one.
