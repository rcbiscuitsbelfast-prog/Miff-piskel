# 🚀 Deployment Guide - Piskel Mobile Edition

## Quick Deploy Options

### 1. Local Development
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Access with mobile mode
# Visit: http://localhost:9001/?mobile=1
```

### 2. GitHub Pages

#### Step 1: Build Production Files
```bash
# Build production version
grunt build

# Files will be in dest/prod/
```

#### Step 2: Deploy to GitHub Pages
```bash
# From your repository root
git checkout -b gh-pages
cp -r dest/prod/* .
git add .
git commit -m "Deploy Piskel Mobile Edition"
git push origin gh-pages
```

#### Step 3: Enable GitHub Pages
1. Go to repository Settings
2. Navigate to Pages
3. Select `gh-pages` branch
4. Save

Access at: `https://yourusername.github.io/piskel/?mobile=1`

### 3. Netlify

#### Option A: Drag and Drop
1. Build: `grunt build`
2. Go to [netlify.com](https://netlify.com)
3. Drag `dest/prod/` folder
4. Done!

#### Option B: Continuous Deployment
1. Create `netlify.toml`:
```toml
[build]
  command = "npm install && grunt build"
  publish = "dest/prod"

[[redirects]]
  from = "/*"
  to = "/index.html?mobile=1"
  status = 200
```

2. Connect repository
3. Deploy automatically

### 4. Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Build
grunt build

# Deploy
cd dest/prod
vercel --prod
```

### 5. Static Web Server

Any static file server works:

```bash
# Using Python
cd dest/prod
python -m http.server 8080

# Using Node http-server
npm install -g http-server
cd dest/prod
http-server -p 8080

# Using PHP
cd dest/prod
php -S localhost:8080
```

## Build Configuration

### Production Build
```bash
# Full build
grunt build

# Output: dest/prod/
# - index.html
# - js/piskel-packaged-min.js
# - css/piskel-style-packaged.css
# - All assets
```

### Development Build
```bash
# Watch mode
grunt play

# Serves at localhost:9001
# Auto-rebuilds on changes
```

### Desktop Build
```bash
# Build desktop app (NW.js)
grunt desktop

# Platform-specific
grunt desktop-mac
grunt build:desktop
```

## Environment Configuration

### Force Mobile Mode

#### Option 1: Default URL
Set mobile=1 as default in your deployment:

```html
<!-- In index.html -->
<script>
if (!window.location.search.includes('mobile=1')) {
  window.location.search = '?mobile=1';
}
</script>
```

#### Option 2: Environment Variable
```javascript
// In piskel-boot.js
window.FORCE_MOBILE = true;
```

#### Option 3: Build-time Config
```bash
# Create mobile-specific build
grunt build --mobile=true
```

## Mobile PWA Setup

### 1. Create manifest.json
```json
{
  "name": "Piskel Mobile",
  "short_name": "Piskel",
  "description": "Mobile sprite editor for MIFF",
  "start_url": "/?mobile=1",
  "display": "standalone",
  "background_color": "#1e1e28",
  "theme_color": "#667eea",
  "icons": [
    {
      "src": "logo.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

### 2. Add Service Worker
```javascript
// sw.js
const CACHE_NAME = 'piskel-mobile-v1';
const urlsToCache = [
  '/',
  '/index.html?mobile=1',
  '/js/piskel-packaged-min.js',
  '/css/piskel-style-packaged.css',
  '/logo.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
```

### 3. Register Service Worker
```html
<!-- In index.html -->
<script>
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
</script>
```

## Custom Domain

### 1. Add CNAME file
```bash
echo "piskel.yourdomain.com" > CNAME
```

### 2. Configure DNS
Add CNAME record:
```
piskel.yourdomain.com → your-deployment.netlify.app
```

### 3. Enable HTTPS
Most platforms auto-configure SSL. If not:
- Netlify: Automatic
- GitHub Pages: Settings → Enable HTTPS
- Custom: Use Let's Encrypt

## Mobile-Specific Optimizations

### 1. Viewport Configuration
Already configured in index.html:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### 2. Touch Action
CSS optimization for touch:
```css
* {
  touch-action: manipulation;
}
```

### 3. Performance
Minimize JavaScript:
```bash
grunt uglify
```

### 4. Asset Optimization
Compress images:
```bash
# Using ImageOptim or similar
find dest/prod/img -name "*.png" -exec pngcrush -ow {} \;
```

## Testing Deployment

### Local Testing
```bash
# Build
grunt build

# Test with mobile user agent
# Chrome DevTools → Toggle Device Toolbar
# Or add ?mobile=1 to URL
```

### Remote Testing
1. Deploy to staging
2. Test on real devices
3. Verify:
   - ✅ Mobile mode activates
   - ✅ Touch gestures work
   - ✅ Tools load correctly
   - ✅ Export functions
   - ✅ Import/auto-chop works

### Browser Testing Matrix
- [ ] Chrome iOS
- [ ] Safari iOS
- [ ] Chrome Android
- [ ] Firefox Mobile
- [ ] Samsung Internet
- [ ] Desktop (forced mobile)

## Monitoring

### Analytics
Add to index.html:
```html
<script>
// Google Analytics
(function(i,s,o,g,r,a,m){...})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-XXXXX-Y', 'auto');
ga('send', 'pageview');
</script>
```

### Error Tracking
```javascript
window.onerror = function(msg, url, line, col, error) {
  // Send to error tracking service
  console.error('Error:', msg, url, line, col, error);
};
```

## Troubleshooting

### Build Fails
```bash
# Clean build
grunt clean
npm install
grunt build
```

### Mobile Mode Not Activating
1. Check URL has `?mobile=1`
2. Verify screen width detection
3. Check browser console
4. Force mode: `localStorage.setItem('forceMobileMode', 'true')`

### Touch Gestures Not Working
1. Verify touch events supported
2. Check canvas element
3. Test on real device
4. Use button alternatives

### Export Not Working
1. Check browser download permissions
2. Verify CORS settings
3. Test different export formats
4. Check console for errors

## Production Checklist

Before deploying to production:

- [ ] Run full build: `grunt build`
- [ ] Test on multiple devices
- [ ] Verify all gestures work
- [ ] Test import/auto-chop
- [ ] Verify export formats
- [ ] Check mobile performance
- [ ] Test offline capability (if PWA)
- [ ] Verify HTTPS enabled
- [ ] Configure custom domain (if applicable)
- [ ] Set up analytics
- [ ] Configure error tracking
- [ ] Document deployment URL
- [ ] Test share functionality
- [ ] Verify backup/save works

## Rollback Plan

If deployment has issues:

### GitHub Pages
```bash
git checkout gh-pages
git revert HEAD
git push origin gh-pages
```

### Netlify/Vercel
Use platform's rollback feature in dashboard

### Custom Server
```bash
# Keep previous version
cp -r dest/prod dest/prod.backup
# Restore if needed
cp -r dest/prod.backup dest/prod
```

## Updates

### Deploy Updates
```bash
# Pull latest changes
git pull origin mobile-fork

# Rebuild
grunt build

# Redeploy using your method
```

### Version Management
Tag releases:
```bash
git tag -a v1.0.0-mobile -m "Mobile Edition v1.0.0"
git push origin v1.0.0-mobile
```

## Support

If you encounter deployment issues:

1. Check [GitHub Issues](../../issues)
2. Review build logs
3. Test locally first
4. Verify dependencies
5. Contact MIFF community

## Resources

- [Grunt Documentation](https://gruntjs.com/)
- [GitHub Pages Guide](https://pages.github.com/)
- [Netlify Docs](https://docs.netlify.com/)
- [Vercel Docs](https://vercel.com/docs)
- [PWA Guide](https://web.dev/progressive-web-apps/)

---

**Quick Start:** `npm install && grunt build && cd dest/prod && python -m http.server 8080`

Then visit: `http://localhost:8080/?mobile=1`
