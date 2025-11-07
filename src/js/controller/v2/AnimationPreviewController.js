/**
 * @provide pskl.controller.v2.AnimationPreviewController
 *
 * V2 - Animation preview in asset tray
 */
(function () {
  var ns = $.namespace('pskl.controller.v2');

  ns.AnimationPreviewController = function () {
    this.isPlaying = false;
    this.currentFrameIndex = 0;
    this.fps = 10;
    this.frames = [];
  };

  ns.AnimationPreviewController.prototype.init = function () {
    $.subscribe(Events.FRAMES_CHOPPED, this.onFramesChopped.bind(this));
    this.createPreviewControls();
  };

  ns.AnimationPreviewController.prototype.onFramesChopped = function (evt) {
    this.frames = evt.frames;
    this.showPreviewPanel();
  };

  ns.AnimationPreviewController.prototype.createPreviewControls = function () {
    // This will be added to the asset tray
  };

  ns.AnimationPreviewController.prototype.showPreviewPanel = function () {
    var tray = document.getElementById('asset-tray');
    if (!tray) return;
    
    // Check if preview already exists
    var existing = document.getElementById('animation-preview-panel');
    if (existing) {
      existing.remove();
    }
    
    var panel = document.createElement('div');
    panel.id = 'animation-preview-panel';
    panel.className = 'animation-preview-panel v2-only';
    panel.innerHTML = `
      <div class="preview-header">
        <h4>Animation Preview</h4>
        <button class="preview-close" id="preview-close-btn">×</button>
      </div>
      <div class="preview-canvas-container">
        <canvas id="preview-canvas" class="preview-canvas"></canvas>
      </div>
      <div class="preview-controls">
        <button class="preview-btn" id="preview-play" title="Play/Pause">
          <span class="preview-icon">▶️</span>
        </button>
        <button class="preview-btn" id="preview-prev" title="Previous Frame">
          <span class="preview-icon">⏮️</span>
        </button>
        <button class="preview-btn" id="preview-next" title="Next Frame">
          <span class="preview-icon">⏭️</span>
        </button>
        <div class="preview-fps-control">
          <label>FPS:</label>
          <input type="range" id="preview-fps" min="1" max="30" value="10" />
          <span id="preview-fps-value">10</span>
        </div>
      </div>
      <div class="preview-info">
        <span>Frame: <span id="preview-frame-index">1</span> / <span id="preview-frame-count">${this.frames.length}</span></span>
      </div>
    `;
    
    // Insert at top of tray
    tray.insertBefore(panel, tray.firstChild);
    
    this.setupPreviewCanvas();
    this.setupPreviewControls();
  };

  ns.AnimationPreviewController.prototype.setupPreviewCanvas = function () {
    this.previewCanvas = document.getElementById('preview-canvas');
    this.previewCtx = this.previewCanvas.getContext('2d');
    
    if (this.frames.length > 0) {
      var firstFrame = this.frames[0].canvas;
      this.previewCanvas.width = firstFrame.width;
      this.previewCanvas.height = firstFrame.height;
      this.drawFrame(0);
    }
  };

  ns.AnimationPreviewController.prototype.setupPreviewControls = function () {
    document.getElementById('preview-play').addEventListener('click', this.togglePlayback.bind(this));
    document.getElementById('preview-prev').addEventListener('click', this.previousFrame.bind(this));
    document.getElementById('preview-next').addEventListener('click', this.nextFrame.bind(this));
    document.getElementById('preview-close-btn').addEventListener('click', this.closePreview.bind(this));
    
    var fpsSlider = document.getElementById('preview-fps');
    fpsSlider.addEventListener('input', function (e) {
      this.fps = parseInt(e.target.value);
      document.getElementById('preview-fps-value').textContent = this.fps;
      
      if (this.isPlaying) {
        this.stopPlayback();
        this.startPlayback();
      }
    }.bind(this));
  };

  ns.AnimationPreviewController.prototype.togglePlayback = function () {
    if (this.isPlaying) {
      this.stopPlayback();
    } else {
      this.startPlayback();
    }
  };

  ns.AnimationPreviewController.prototype.startPlayback = function () {
    this.isPlaying = true;
    document.querySelector('#preview-play .preview-icon').textContent = '⏸️';
    
    this.playInterval = setInterval(function () {
      this.nextFrame();
    }.bind(this), 1000 / this.fps);
  };

  ns.AnimationPreviewController.prototype.stopPlayback = function () {
    this.isPlaying = false;
    document.querySelector('#preview-play .preview-icon').textContent = '▶️';
    
    if (this.playInterval) {
      clearInterval(this.playInterval);
      this.playInterval = null;
    }
  };

  ns.AnimationPreviewController.prototype.nextFrame = function () {
    this.currentFrameIndex = (this.currentFrameIndex + 1) % this.frames.length;
    this.drawFrame(this.currentFrameIndex);
  };

  ns.AnimationPreviewController.prototype.previousFrame = function () {
    this.currentFrameIndex = (this.currentFrameIndex - 1 + this.frames.length) % this.frames.length;
    this.drawFrame(this.currentFrameIndex);
  };

  ns.AnimationPreviewController.prototype.drawFrame = function (index) {
    if (!this.previewCtx || !this.frames[index]) return;
    
    var frame = this.frames[index];
    this.previewCtx.clearRect(0, 0, this.previewCanvas.width, this.previewCanvas.height);
    this.previewCtx.drawImage(frame.canvas, 0, 0);
    
    document.getElementById('preview-frame-index').textContent = index + 1;
  };

  ns.AnimationPreviewController.prototype.closePreview = function () {
    this.stopPlayback();
    var panel = document.getElementById('animation-preview-panel');
    if (panel) {
      panel.remove();
    }
  };
})();
