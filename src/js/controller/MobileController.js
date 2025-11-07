/**
 * @provide pskl.controller.MobileController
 *
 * @require pskl.utils.UserAgent
 */
(function () {
  var ns = $.namespace('pskl.controller');

  /**
   * Mobile Controller - Manages mobile-first UI and mode switching
   */
  ns.MobileController = function (piskelController) {
    this.piskelController = piskelController;
    this.currentMode = 'draw'; // 'draw' or 'import'
    this.isMobileMode = false;
  };

  ns.MobileController.prototype.init = function () {
    this.detectMobileMode();
    
    if (this.isMobileMode) {
      this.enableMobileUI();
      this.createModeButtons();
      this.showSplashScreen();
    }
  };

  ns.MobileController.prototype.detectMobileMode = function () {
    // Check if mobile or tablet
    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    var isSmallScreen = window.innerWidth <= 768;
    var forceMobile = window.location.search.indexOf('mobile=1') !== -1 || 
                     localStorage.getItem('forceMobileMode') === 'true';
    
    this.isMobileMode = isMobile || isSmallScreen || forceMobile;
    
    if (this.isMobileMode || forceMobile) {
      document.body.classList.add('mobile-mode');
      if (forceMobile) {
        document.body.classList.add('force-mobile');
      }
    }
  };

  ns.MobileController.prototype.enableMobileUI = function () {
    // Add mobile class to main wrapper
    var mainWrapper = document.getElementById('main-wrapper');
    if (mainWrapper) {
      mainWrapper.classList.add('mobile-mode');
    }
  };

  ns.MobileController.prototype.createModeButtons = function () {
    var container = document.createElement('div');
    container.className = 'mode-button-container';
    container.innerHTML = `
      <button class="mode-button draw-mode active" id="draw-mode-btn">
        <span class="icon">✏️</span>
        <span>Draw</span>
      </button>
      <button class="mode-button import-mode" id="import-mode-btn">
        <span class="icon">📥</span>
        <span>Import</span>
      </button>
    `;
    
    document.body.appendChild(container);
    
    // Add event listeners
    document.getElementById('draw-mode-btn').addEventListener('click', this.switchToDrawMode.bind(this));
    document.getElementById('import-mode-btn').addEventListener('click', this.switchToImportMode.bind(this));
  };

  ns.MobileController.prototype.switchToDrawMode = function () {
    if (this.currentMode === 'draw') return;
    
    this.currentMode = 'draw';
    document.getElementById('draw-mode-btn').classList.add('active');
    document.getElementById('import-mode-btn').classList.remove('active');
    
    // Hide import UI, show drawing tools
    this.hideImportUI();
    this.showDrawingTools();
    
    $.publish(Events.MODE_CHANGED, {mode: 'draw'});
  };

  ns.MobileController.prototype.switchToImportMode = function () {
    if (this.currentMode === 'import') return;
    
    this.currentMode = 'import';
    document.getElementById('import-mode-btn').classList.add('active');
    document.getElementById('draw-mode-btn').classList.remove('active');
    
    // Show import UI, hide drawing tools
    this.hideDrawingTools();
    this.showImportUI();
    
    $.publish(Events.MODE_CHANGED, {mode: 'import'});
  };

  ns.MobileController.prototype.hideImportUI = function () {
    var importZone = document.querySelector('.import-drop-zone');
    if (importZone) {
      importZone.style.display = 'none';
    }
  };

  ns.MobileController.prototype.showImportUI = function () {
    var importZone = document.querySelector('.import-drop-zone');
    if (!importZone) {
      this.createImportUI();
    } else {
      importZone.style.display = 'flex';
    }
  };

  ns.MobileController.prototype.createImportUI = function () {
    var container = document.querySelector('#drawing-canvas-container');
    if (!container) return;
    
    var dropZone = document.createElement('div');
    dropZone.className = 'import-drop-zone';
    dropZone.innerHTML = `
      <div class="icon">📁</div>
      <div class="message">Drop image here</div>
      <div class="hint">or</div>
      <button class="import-upload-btn" id="import-upload-btn">
        Choose File
      </button>
      <input type="file" id="import-file-input" accept="image/*" style="display: none;">
    `;
    
    container.appendChild(dropZone);
    
    // Set up file input
    var fileInput = document.getElementById('import-file-input');
    var uploadBtn = document.getElementById('import-upload-btn');
    
    uploadBtn.addEventListener('click', function () {
      fileInput.click();
    });
    
    fileInput.addEventListener('change', this.handleFileSelect.bind(this));
    
    // Set up drag and drop
    dropZone.addEventListener('dragover', function (e) {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.add('drag-over');
    });
    
    dropZone.addEventListener('dragleave', function (e) {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.remove('drag-over');
    });
    
    dropZone.addEventListener('drop', this.handleFileDrop.bind(this));
  };

  ns.MobileController.prototype.handleFileSelect = function (e) {
    var files = e.target.files;
    if (files && files.length > 0) {
      this.processImportedFile(files[0]);
    }
  };

  ns.MobileController.prototype.handleFileDrop = function (e) {
    e.preventDefault();
    e.stopPropagation();
    
    var dropZone = document.querySelector('.import-drop-zone');
    dropZone.classList.remove('drag-over');
    
    var files = e.dataTransfer.files;
    if (files && files.length > 0) {
      this.processImportedFile(files[0]);
    }
  };

  ns.MobileController.prototype.processImportedFile = function (file) {
    if (!file.type.match('image.*')) {
      alert('Please select an image file');
      return;
    }
    
    var reader = new FileReader();
    reader.onload = function (e) {
      $.publish(Events.IMAGE_IMPORTED, {
        imageData: e.target.result,
        fileName: file.name
      });
    };
    reader.readAsDataURL(file);
  };

  ns.MobileController.prototype.hideDrawingTools = function () {
    var drawer = document.querySelector('.tool-drawer');
    if (drawer) {
      drawer.style.display = 'none';
    }
  };

  ns.MobileController.prototype.showDrawingTools = function () {
    var drawer = document.querySelector('.tool-drawer');
    if (drawer) {
      drawer.style.display = 'block';
    }
  };

  ns.MobileController.prototype.showSplashScreen = function () {
    var splash = document.createElement('div');
    splash.className = 'miff-splash';
    splash.innerHTML = `
      <div class="miff-splash-logo">🎮🎨</div>
      <div class="miff-splash-title">Mobile Sprite Editor</div>
      <div class="miff-splash-subtitle">Made with MIFF in mind</div>
      <ul class="miff-splash-features">
        <li>✏️ Draw pixel-perfect sprites</li>
        <li>📥 Import & auto-chop sprite sheets</li>
        <li>🏷️ Tag animations for game engines</li>
        <li>💾 Export with structured metadata</li>
      </ul>
      <button class="miff-splash-cta" id="miff-splash-start">Get Started</button>
    `;
    
    document.body.appendChild(splash);
    
    document.getElementById('miff-splash-start').addEventListener('click', function () {
      splash.classList.add('hidden');
      setTimeout(function () {
        splash.remove();
      }, 500);
    });
  };

  ns.MobileController.prototype.isMobile = function () {
    return this.isMobileMode;
  };

  ns.MobileController.prototype.getCurrentMode = function () {
    return this.currentMode;
  };
})();
