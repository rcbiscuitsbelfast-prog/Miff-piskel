/**
 * @provide pskl.controller.v3.OnionSkinController
 *
 * V3 - Onion skinning for smooth animation
 */
(function () {
  var ns = $.namespace('pskl.controller.v3');

  ns.OnionSkinController = function (piskelController) {
    this.piskelController = piskelController;
    this.enabled = false;
    this.previousFrames = 2;
    this.nextFrames = 2;
    this.opacity = 0.3;
  };

  ns.OnionSkinController.prototype.init = function () {
    this.createOnionSkinPanel();
    this.setupEventListeners();
  };

  ns.OnionSkinController.prototype.createOnionSkinPanel = function () {
    var quickActions = document.getElementById('quick-actions-menu');
    if (!quickActions) return;
    
    var action = document.createElement('button');
    action.className = 'quick-action v3-only';
    action.dataset.action = 'onion-skin';
    action.innerHTML = `
      <span class="quick-action-icon">🧅</span>
      <span class="quick-action-label">Onion Skin</span>
      <span class="quick-action-hint">Toggle</span>
    `;
    
    action.addEventListener('click', this.toggle.bind(this));
    quickActions.appendChild(action);
    
    // Create settings panel
    var drawer = document.querySelector('.tool-drawer-content');
    if (!drawer) return;
    
    var panel = document.createElement('div');
    panel.className = 'onion-skin-panel v3-only';
    panel.id = 'onion-skin-panel';
    panel.innerHTML = `
      <div class="onion-skin-header">
        <h4>Onion Skinning</h4>
        <label class="onion-skin-toggle">
          <input type="checkbox" id="onion-skin-enabled" />
          <span>Enabled</span>
        </label>
      </div>
      <div class="onion-skin-controls">
        <div class="onion-control">
          <label>Previous Frames:</label>
          <input type="range" id="onion-previous" min="0" max="5" value="2" />
          <span id="onion-previous-value">2</span>
        </div>
        <div class="onion-control">
          <label>Next Frames:</label>
          <input type="range" id="onion-next" min="0" max="5" value="2" />
          <span id="onion-next-value">2</span>
        </div>
        <div class="onion-control">
          <label>Opacity:</label>
          <input type="range" id="onion-opacity" min="10" max="80" value="30" />
          <span id="onion-opacity-value">30%</span>
        </div>
        <div class="onion-colors">
          <div class="onion-color-setting">
            <label>Previous Color:</label>
            <input type="color" id="onion-previous-color" value="#ff0000" />
          </div>
          <div class="onion-color-setting">
            <label>Next Color:</label>
            <input type="color" id="onion-next-color" value="#0000ff" />
          </div>
        </div>
      </div>
    `;
    
    drawer.appendChild(panel);
  };

  ns.OnionSkinController.prototype.setupEventListeners = function () {
    var enabledCheckbox = document.getElementById('onion-skin-enabled');
    var previousSlider = document.getElementById('onion-previous');
    var nextSlider = document.getElementById('onion-next');
    var opacitySlider = document.getElementById('onion-opacity');
    
    if (enabledCheckbox) {
      enabledCheckbox.addEventListener('change', this.toggle.bind(this));
    }
    
    if (previousSlider) {
      previousSlider.addEventListener('input', function (e) {
        this.previousFrames = parseInt(e.target.value);
        document.getElementById('onion-previous-value').textContent = e.target.value;
        this.render();
      }.bind(this));
    }
    
    if (nextSlider) {
      nextSlider.addEventListener('input', function (e) {
        this.nextFrames = parseInt(e.target.value);
        document.getElementById('onion-next-value').textContent = e.target.value;
        this.render();
      }.bind(this));
    }
    
    if (opacitySlider) {
      opacitySlider.addEventListener('input', function (e) {
        this.opacity = parseInt(e.target.value) / 100;
        document.getElementById('onion-opacity-value').textContent = e.target.value + '%';
        this.render();
      }.bind(this));
    }
  };

  ns.OnionSkinController.prototype.toggle = function () {
    this.enabled = !this.enabled;
    
    var checkbox = document.getElementById('onion-skin-enabled');
    if (checkbox) {
      checkbox.checked = this.enabled;
    }
    
    if (this.enabled) {
      this.render();
    } else {
      this.clear();
    }
    
    $.publish(Events.SHOW_NOTIFICATION, {
      content: this.enabled ? 'Onion skin enabled' : 'Onion skin disabled',
      duration: 1500
    });
  };

  ns.OnionSkinController.prototype.render = function () {
    if (!this.enabled) return;
    
    var currentFrameIndex = this.piskelController.getCurrentFrameIndex();
    var layer = this.piskelController.getCurrentLayer();
    var frames = layer.getFrames();
    
    // Get onion skin canvas or create it
    var container = document.querySelector('#drawing-canvas-container');
    var onionCanvas = document.getElementById('onion-skin-canvas');
    
    if (!onionCanvas) {
      onionCanvas = document.createElement('canvas');
      onionCanvas.id = 'onion-skin-canvas';
      onionCanvas.className = 'canvas onion-skin-canvas v3-only';
      onionCanvas.style.cssText = 'position: absolute; top: 0; left: 0; pointer-events: none; z-index: 5;';
      container.appendChild(onionCanvas);
    }
    
    var piskel = this.piskelController.getPiskel();
    onionCanvas.width = piskel.getWidth();
    onionCanvas.height = piskel.getHeight();
    
    var ctx = onionCanvas.getContext('2d');
    ctx.clearRect(0, 0, onionCanvas.width, onionCanvas.height);
    
    var previousColor = document.getElementById('onion-previous-color')?.value || '#ff0000';
    var nextColor = document.getElementById('onion-next-color')?.value || '#0000ff';
    
    // Draw previous frames
    for (var i = 1; i <= this.previousFrames; i++) {
      var index = currentFrameIndex - i;
      if (index >= 0) {
        this.drawFrame(ctx, frames[index], previousColor, this.opacity / i);
      }
    }
    
    // Draw next frames
    for (var i = 1; i <= this.nextFrames; i++) {
      var index = currentFrameIndex + i;
      if (index < frames.length) {
        this.drawFrame(ctx, frames[index], nextColor, this.opacity / i);
      }
    }
  };

  ns.OnionSkinController.prototype.drawFrame = function (ctx, frame, color, opacity) {
    var canvas = pskl.utils.FrameUtils.toImage(frame);
    ctx.globalAlpha = opacity;
    ctx.globalCompositeOperation = 'multiply';
    
    // Apply tint
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.globalCompositeOperation = 'destination-in';
    ctx.drawImage(canvas, 0, 0);
    
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  };

  ns.OnionSkinController.prototype.clear = function () {
    var onionCanvas = document.getElementById('onion-skin-canvas');
    if (onionCanvas) {
      var ctx = onionCanvas.getContext('2d');
      ctx.clearRect(0, 0, onionCanvas.width, onionCanvas.height);
    }
  };
})();
