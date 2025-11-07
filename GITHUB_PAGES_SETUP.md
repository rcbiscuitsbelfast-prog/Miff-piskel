# 📦 GitHub Pages Setup Guide

## Quick Setup (Automatic Deployment)

Your Piskel Mobile Edition is now configured for **automatic deployment** to GitHub Pages!

### Prerequisites
- GitHub repository
- GitHub Actions enabled
- GitHub Pages enabled in repository settings

---

## 🚀 Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Add Piskel Mobile V1, V2, V3 with GitHub Pages"
git push origin main
```

### 2. Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings**
3. Scroll to **Pages** section
4. Under **Source**, select:
   - **Source:** GitHub Actions
5. Save

### 3. Automatic Build & Deploy
- GitHub Actions will automatically:
  1. Install dependencies (`npm ci`)
  2. Build the project (`grunt build`)
  3. Deploy `dest/prod/` to GitHub Pages

### 4. Access Your Site
Your site will be available at:
```
https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
```

**With mobile mode:**
```
https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/?mobile=1
```

---

## 📁 File Structure

### Root Landing Page
```
/index.html              # Landing page with version selector
```

### Built Application
```
/dest/prod/
  ├── index.html         # Main Piskel application
  ├── js/               # Compiled JavaScript
  ├── css/              # Compiled CSS
  └── img/              # Images
```

### GitHub Actions
```
/.github/workflows/
  └── deploy-gh-pages.yml  # Automatic deployment workflow
```

---

## 🎯 Access URLs

Once deployed, users can access:

### Landing Page (Choose Version)
```
https://yourusername.github.io/piskel/
```

### Direct to Editor (V3 Default)
```
https://yourusername.github.io/piskel/dest/prod/index.html?mobile=1
```

### Specific Versions
```
# V1 Classic
https://yourusername.github.io/piskel/dest/prod/index.html?mobile=1&version=v1

# V2 Enhanced
https://yourusername.github.io/piskel/dest/prod/index.html?mobile=1&version=v2

# V3 Professional
https://yourusername.github.io/piskel/dest/prod/index.html?mobile=1&version=v3
```

### Desktop Mode
```
https://yourusername.github.io/piskel/dest/prod/index.html
```

---

## ⚙️ GitHub Actions Workflow

The workflow (`.github/workflows/deploy-gh-pages.yml`) runs on:
- Push to `main`, `master`, or `cursor/*` branches
- Manual trigger via "Actions" tab

### Workflow Steps:
1. **Checkout** - Get code from repository
2. **Setup Node** - Install Node.js 18
3. **Install** - Run `npm ci` to install dependencies
4. **Build** - Run `grunt build` to compile
5. **Deploy** - Upload `dest/prod/` to GitHub Pages

---

## 🔧 Manual Deployment

If you prefer manual deployment:

### Option 1: GitHub Pages Branch
```bash
# Build locally
npm install
grunt build

# Create gh-pages branch
git checkout --orphan gh-pages
cp -r dest/prod/* .
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages

# Back to main
git checkout main
```

Then set **Source** to `gh-pages` branch in Settings → Pages.

### Option 2: Deploy Folder
```bash
# Build
npm install
grunt build

# Push dest/prod as root
git subtree push --prefix dest/prod origin gh-pages
```

---

## 🔄 Updating Your Deployment

### Automatic (Recommended)
Just push changes:
```bash
git add .
git commit -m "Update sprite editor"
git push origin main
```

GitHub Actions will rebuild and deploy automatically!

### Manual
```bash
npm install
grunt build
git add dest/
git commit -m "Build update"
git push origin main
```

---

## 🐛 Troubleshooting

### Build Fails
**Error:** Dependencies not found
```bash
# Solution: Ensure package.json is in root
npm install
```

**Error:** Grunt command not found
```bash
# Solution: Install grunt-cli
npm install -g grunt-cli
# Or use npx
npx grunt build
```

### Pages Not Updating
1. Check **Actions** tab for build status
2. Verify **Settings → Pages** source is set to "GitHub Actions"
3. Wait 2-3 minutes for deployment
4. Hard refresh browser (Ctrl+Shift+R / Cmd+Shift+R)
5. Check browser console for errors

### 404 Errors
1. Ensure `dest/prod/` contains `index.html`
2. Check paths in index.html are relative
3. Verify `.nojekyll` file is in root (already included)

### Mobile Mode Not Working
1. Add `?mobile=1` to URL
2. Check browser console for JavaScript errors
3. Try force mobile: `localStorage.setItem('forceMobileMode', 'true')`

---

## 🎨 Customization

### Change Default Version
Edit `/index.html` and change the default link:
```html
<!-- Change this line -->
<a href="dest/prod/index.html?mobile=1&version=v3" class="cta-button">
```

### Custom Domain
1. Add `CNAME` file to root:
```
yourdomain.com
```

2. Configure DNS:
```
CNAME record: yourdomain.com → yourusername.github.io
```

3. Enable in Settings → Pages → Custom domain

### Modify Landing Page
Edit `/index.html` to customize:
- Version descriptions
- Feature lists
- Branding
- Links

---

## 📊 Monitoring

### View Build Logs
1. Go to **Actions** tab
2. Click latest workflow run
3. Expand build steps to see logs

### Check Deployment Status
```bash
# Via GitHub CLI
gh run list

# View specific run
gh run view [RUN_ID]
```

---

## 🚀 Performance Tips

### Optimize Build Size
```bash
# Already optimized with:
- Minified JS (piskel-packaged-min.js)
- Compressed CSS
- Image optimization

# Further optimization:
grunt uglify  # Minify additional files
```

### Enable Caching
GitHub Pages automatically caches static assets.

Add cache headers in workflow if needed:
```yaml
- name: Add cache headers
  run: |
    find dest/prod -type f -name "*.js" -o -name "*.css" | \
    xargs -I {} echo "Cache-Control: max-age=31536000" > {}.headers
```

---

## 📱 Mobile Testing

Test your deployed site on:
- Real mobile devices
- Browser DevTools device emulation
- Multiple browsers (Chrome, Safari, Firefox)

### Test URLs:
```
# Your GitHub Pages URL
https://yourusername.github.io/piskel/?mobile=1

# Test specific version
https://yourusername.github.io/piskel/dest/prod/index.html?mobile=1&version=v2
```

---

## 🔐 Security

### HTTPS
GitHub Pages automatically provides HTTPS.
Always use `https://` URLs.

### Content Security Policy
If adding CSP headers, allow:
- `'self'` for scripts/styles
- `data:` for inline images
- `blob:` for canvas operations

---

## 📚 Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/pages)
- [GitHub Actions Documentation](https://docs.github.com/actions)
- [Piskel Mobile README](./MOBILE_README.md)
- [V1 vs V2 vs V3 Comparison](./V1_VS_V2_COMPARISON.md)

---

## ✅ Deployment Checklist

Before going live:
- [ ] Build completes without errors
- [ ] All three versions (V1, V2, V3) work
- [ ] Mobile mode activates correctly
- [ ] Version switcher works
- [ ] Export functionality works
- [ ] No console errors
- [ ] Tested on multiple devices
- [ ] Custom domain configured (if applicable)
- [ ] Analytics added (if desired)

---

## 🎉 Success!

Your Piskel Mobile Edition is now live on GitHub Pages!

**Share your sprite editor:**
```
https://yourusername.github.io/piskel/
```

**Made with MIFF in mind** 🎮🎨
