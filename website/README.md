# MinD.md Landing Page

This is the landing page for MinD.md, built with React, Vite, and Tailwind CSS.

## Hosting on GitHub Pages

You can easily host this landing page for free using GitHub Pages. The recommended way to deploy a Vite application to GitHub Pages is using GitHub Actions.

### Step 1: Push your code to GitHub
1. Create a new repository on GitHub.
2. Initialize and push your code to the remote repository:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/your-repo-name.git
git push -u origin main
```

### Step 2: Configure Vite Base URL (Optional)
If you are deploying to `https://<USERNAME>.github.io/<REPO>/` (a project site), you need to set the `base` path in `vite.config.ts`.
If you are deploying to `https://<USERNAME>.github.io/` (a user site), you can skip this step.

Open `vite.config.ts` and add the `base` property:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/your-repo-name/', // Add this line
})
```
Commit and push this change to your repository.

### Step 3: Setup GitHub Actions
1. In your GitHub repository, go to **Settings** > **Pages**.
2. Under "Build and deployment", set the **Source** to **GitHub Actions**.
3. Create a new file in your project at `.github/workflows/deploy.yml` and add the following content:

```yaml
# Simple workflow for deploying static content to GitHub Pages
name: Deploy static content to Pages

on:
  push:
    branches: ['main']
  workflow_dispatch:

# Sets the GITHUB_TOKEN permissions to allow deployment to GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# Allow one concurrent deployment
concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          # Upload dist folder
          path: './dist'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```
4. Commit and push this file to your repository.

### Step 4: Access your site
Once the GitHub Action completes successfully, your site will be live! You can find the URL in the Actions tab or under **Settings** > **Pages** in your repository.
