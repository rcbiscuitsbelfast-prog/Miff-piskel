/**
 * @provide pskl.controller.v3.SymmetryToolController
 *
 * V3 - Symmetry drawing tools (horizontal, vertical, radial)
 */
(function () {
  var ns = $.namespace('pskl.controller.v3');

  ns.SymmetryToolController = function (piskelController) {
    this.piskelController = piskelController;
    this.enabled = false;
    this.mode = 'horizontal'; // horizontal, vertical, both, radial
    this.radialSegments = 4;
  };

  ns.SymmetryToolController.prototype.init = function () {
    this.createSymmetryPanel();
    this.setupEventListeners();
  };

  ns.SymmetryToolController.prototype.createSymmetryPanel = function () {
    // Add to Quick Actions
    var quickActions = document.getElementById('quick-actions-menu');
    if (quickActions) {
      var action = document.createElement('button');
      action.className = 'quick-action v3-only';
      action.dataset.action = 'symmetry';
      action.innerHTML = `
        <span class="quick-action-icon">↔️</span>
        <span class="quick-action-label">Symmetry</span>
        <span class="quick-action-hint">Toggle</span>
      `;
      action.addEventListener('click', this.toggle.bind(this));
      quickActions.appendChild(action);
    }
    
    // Add settings panel
    var drawer = document.querySelector('.tool-drawer-content');
    if (!drawer) return;
    
    var panel = document.createElement('div');
    panel.className = 'symmetry-panel v3-only';
    panel.id = 'symmetry-panel';
    panel.innerHTML = `
      <div class="symmetry-header">
        <h4>Symmetry Drawing</h4>
        <label class="symmetry-toggle">
          <input type="checkbox" id="symmetry-enabled" />
          <span>Enabled</span>
        </label>
      </div>
      <div class="symmetry-modes">
        <button class="symmetry-mode active" data-mode="horizontal">
          <span>↔️</span>
          <span>Horizontal</span>
        </button>
        <button class="symmetry-mode" data-mode="vertical">
          <span>↕️</span>
          <span>Vertical</span>
        </button>
        <button class="symmetry-mode" data-mode="both">
          <span>✚</span>
          <span>Both</span>
        </button>
        <button class="symmetry-mode" data-mode="radial">
          <span>✴️</span>
          <span>Radial</span>
        </button>
      </div>
      <div class="symmetry-radial-control">
        <label>Segments:</label>
        <input type="range" id="symmetry-segments" min="2" max="16" value="4" />
        <span id="symmetry-segments-value">4</span>
      </div>
      <div class="symmetry-guide-control">
        <label class="symmetry-guide-toggle">
          <input type="checkbox" id="symmetry-guides" checked />
          <span>Show guides</span>
        </label>
      </div>
    `;
    
    drawer.appendChild(panel);
  };

  ns.SymmetryToolController.prototype.setupEventListeners = function () {
    var enabledCheckbox = document.getElementById('symmetry-enabled');
    var modeButtons = document.querySelectorAll('.symmetry-mode');
    var segmentsSlider = document.getElementById('symmetry-segments');
    var guidesCheckbox = document.getElementById('symmetry-guides');
    
    if (enabledCheckbox) {
      enabledCheckbox.addEventListener('change', this.toggle.bind(this));
    }
    
    modeButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        modeButtons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        this.mode = btn.dataset.mode;
        this.renderGuides();
      }.bind(this));
    }.bind(this));
    
    if (segmentsSlider) {
      segmentsSlider.addEventListener('input', function (e) {
        this.radialSegments = parseInt(e.target.value);
        document.getElementById('symmetry-segments-value').textContent = e.target.value;
        this.renderGuides();
      }.bind(this));
    }
    
    if (guidesCheckbox) {
      guidesCheckbox.addEventListener('change', this.renderGuides.bind(this));
    }
    
    // Subscribe to drawing events to apply symmetry
    $.subscribe(Events.TOOL_PRESSED, this.onToolPressed.bind(this));
  };

  ns.SymmetryToolController.prototype.toggle = function () {
    this.enabled = !this.enabled;
    
    var checkbox = document.getElementById('symmetry-enabled');
    if (checkbox) {
      checkbox.checked = this.enabled;
    }
    
    if (this.enabled) {
      this.renderGuides();
    } else {
      this.clearGuides();
    }
    
    $.publish(Events.SHOW_NOTIFICATION, {
      content: this.enabled ? 'Symmetry enabled' : 'Symmetry disabled',
      duration: 1500
    });
  };

  ns.SymmetryToolController.prototype.renderGuides = function () {
    if (!this.enabled) return;
    
    var guidesCheckbox = document.getElementById('symmetry-guides');
    if (guidesCheckbox && !guidesCheckbox.checked) {
      this.clearGuides();
      return;
    }
    
    var container = document.querySelector('#drawing-canvas-container');
    var guidesCanvas = document.getElementById('symmetry-guides-canvas');
    
    if (!guidesCanvas) {
      guidesCanvas = document.createElement('canvas');
      guidesCanvas.id = 'symmetry-guides-canvas';
      guidesCanvas.className = 'canvas symmetry-guides-canvas v3-only';
      guidesCanvas.style.cssText = 'position: absolute; top: 0; left: 0; pointer-events: none; z-index: 6;';
      container.appendChild(guidesCanvas);
    }
    
    var piskel = this.piskelController.getPiskel();
    guidesCanvas.width = piskel.getWidth();
    guidesCanvas.height = piskel.getHeight();
    
    var ctx = guidesCanvas.getContext('2d');
    ctx.clearRect(0, 0, guidesCanvas.width, guidesCanvas.height);
    
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    
    var centerX = guidesCanvas.width / 2;
    var centerY = guidesCanvas.height / 2;
    
    if (this.mode === 'horizontal' || this.mode === 'both') {
      ctx.beginPath();
      ctx.moveTo(centerX, 0);
      ctx.lineTo(centerX, guidesCanvas.height);
      ctx.stroke();
    }
    
    if (this.mode === 'vertical' || this.mode === 'both') {
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(guidesCanvas.width, centerY);
      ctx.stroke();
    }
    
    if (this.mode === 'radial') {
      var angleStep = (Math.PI * 2) / this.radialSegments;
      for (var i = 0; i < this.radialSegments; i++) {
        var angle = angleStep * i;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
          centerX + Math.cos(angle) * Math.max(guidesCanvas.width, guidesCanvas.height),
          centerY + Math.sin(angle) * Math.max(guidesCanvas.width, guidesCanvas.height)
        );
        ctx.stroke();
      }
    }
  };

  ns.SymmetryToolController.prototype.clearGuides = function () {
    var guidesCanvas = document.getElementById('symmetry-guides-canvas');
    if (guidesCanvas) {
      var ctx = guidesCanvas.getContext('2d');
      ctx.clearRect(0, 0, guidesCanvas.width, guidesCanvas.height);
    }
  };

  ns.SymmetryToolController.prototype.onToolPressed = function (evt) {
    if (!this.enabled) return;
    
    // This would hook into the drawing system to apply symmetry
    // Implementation depends on Piskel's tool architecture
  };

  ns.SymmetryToolController.prototype.getSymmetricPoints = function (x, y) {
    var piskel = this.piskelController.getPiskel();
    var centerX = piskel.getWidth() / 2;
    var centerY = piskel.getHeight() / 2;
    var points = [{x: x, y: y}];
    
    if (this.mode === 'horizontal' || this.mode === 'both') {
      points.push({
        x: centerX * 2 - x,
        y: y
      });
    }
    
    if (this.mode === 'vertical' || this.mode === 'both') {
      points.push({
        x: x,
        y: centerY * 2 - y
      });
    }
    
    if (this.mode === 'both') {
      points.push({
        x: centerX * 2 - x,
        y: centerY * 2 - y
      });
    }
    
    if (this.mode === 'radial') {
      var angleStep = (Math.PI * 2) / this.radialSegments;
      var dx = x - centerX;
      var dy = y - centerY;
      var distance = Math.sqrt(dx * dx + dy * dy);
      var baseAngle = Math.atan2(dy, dx);
      
      for (var i = 1; i < this.radialSegments; i++) {
        var angle = baseAngle + angleStep * i;
        points.push({
          x: centerX + Math.cos(angle) * distance,
          y: centerY + Math.sin(angle) * distance
        });
      }
    }
    
    return points;
  };
})();
