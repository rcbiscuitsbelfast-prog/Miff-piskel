Piskel 
======

[![E2E Tests](https://github.com/piskelapp/piskel/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/piskelapp/piskel/actions/workflows/ci.yml)

---

## 🎮🎨 Mobile Edition - MIFF Fork

**This branch contains a mobile-first, touch-optimized fork designed for MIFF and modular game platforms.**

### ✨ Now with V3 Professional Edition!

**Three complete versions on one platform:**
- **V1 Classic** - Clean, minimal interface for experienced users
- **V2 Enhanced** - Interactive tutorial, quick actions, animation preview, color presets
- **V3 Professional** - All V2 features PLUS advanced layers, onion skinning, symmetry tools, templates!

**Switch between versions instantly** with the ⚙️ button - choose the experience that fits you!

### 🚀 Quick Links
- 📱 **[Mobile Edition Documentation](./MOBILE_README.md)** - Complete feature guide
- 🚀 **[Quick Start Guide](./QUICKSTART_MOBILE.md)** - Get started in 5 minutes
- ✨ **[V3 Features Guide](./V3_FEATURES.md)** - What's new in V3 Professional!
- 📊 **[V1 vs V2 vs V3 Comparison](./V1_VS_V2_COMPARISON.md)** - Choose your version
- 📦 **[GitHub Pages Setup](./GITHUB_PAGES_SETUP.md)** - Deploy to web instantly
- 🎮 **[Game Engine Examples](./examples/)** - Integration examples

### 🌟 Key Features (All Versions)
✨ **Touch-optimized UI** with gesture support  
📥 **Auto-chop** sprite sheets with smart detection  
🏷️ **Animation tagging** for game engines  
💾 **MIFF-compatible export** with JSON metadata  
🎯 **Modular workflow:** Draw → Import → Tag → Export  
⚙️ **Version switcher** - Compare versions anytime

### 🎨 V3 Professional Features
🎨 **Advanced Layers** - Blend modes & opacity control  
🧅 **Onion Skinning** - Smooth animation workflow  
↔️ **Symmetry Tools** - Horizontal, vertical, radial symmetry  
📑 **Project Templates** - Quick starts for any project type  
💎 **Export Formats** - APNG, WebP, enhanced JSON  
⚡ **Performance** - Optimized for complex projects  

### 🎯 Quick Comparison

| Feature | V1 | V2 | V3 |
|---------|----|----|-----|
| Core Drawing | ✅ | ✅ | ✅ |
| Tutorial | ❌ | ✅ | ✅ |
| Quick Actions | ❌ | ✅ | ✅ |
| Color Presets | ❌ | ✅ | ✅ |
| **Advanced Layers** | ❌ | ❌ | ✅ |
| **Onion Skinning** | ❌ | ❌ | ✅ |
| **Symmetry Tools** | ❌ | ❌ | ✅ |
| **Templates** | ❌ | ❌ | ✅ |

**[Learn more about V3 Professional →](./V3_FEATURES.md)**  
**[Deploy to GitHub Pages →](./GITHUB_PAGES_SETUP.md)**

---

## Original Piskel Documentation

Piskel is an easy-to-use sprite editor. It can be used to create game sprites, animations, pixel-art...
It is the editor used in **[piskelapp.com](https://www.piskelapp.com)**.

<img
  src="https://screenletstore.appspot.com/img/95aaa0f0-37a4-11e7-a652-7b8128ce3e3b.png"
  title="Piskel editor screenshot"
  width="500">

## About Piskel

### Built with

The Piskel editor is purely built in **JavaScript, HTML and CSS**.

We also use the following **libraries** :
* [spectrum](https://github.com/bgrins/spectrum) : awesome standalone colorpicker
* [gifjs](https://jnordberg.github.io/gif.js/) : generate animated GIFs in javascript, using webworkers
* [supergif](https://github.com/buzzfeed/libgif-js) : modified version of SuperGif to parse and import GIFs
* [jszip](https://github.com/Stuk/jszip) : create, read and edit .zip files with Javascript
* [canvas-toBlob](https://github.com/eligrey/canvas-toBlob.js/) : shim for canvas toBlob
* [jquery](https://jquery.com/) : used sporadically in the application
* [bootstrap-tooltip](https://getbootstrap.com/javascript/#tooltips) : nice tooltips
* [playwright](https://playwright.dev/): End to end testing

As well as some **icons** from the [Noun Project](https://thenounproject.com/) :
* Folder by Simple Icons from The Noun Project
* (and probably one or two others)

### Browser Support

Piskel supports the following browsers:
* **Chrome** (latest)
* **Firefox** (latest)
* **Edge** (latest)
* **Brave** (latest) but **only if canvas fingerprinting is disabled** ([more info](https://github.com/piskelapp/piskel/wiki/About-canvas-based%E2%80%90browser-fingerprinting-and-Brave-browser))

### Mobile/Tablets

There is no support for mobile.

### Offline builds

Offline builds are available. More details in the [dedicated wiki page](https://github.com/piskelapp/piskel/wiki/Desktop-applications).

## Contributing ?

Help is always welcome !

* **Issues** : Found a problem when using the application, want to request a feature, [open an issue](https://github.com/piskelapp/piskel/issues).
* **Development** : Have a look at the [wiki](https://github.com/piskelapp/piskel/wiki) to set up the development environment

## License

Copyright 2017 Julian Descottes

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

