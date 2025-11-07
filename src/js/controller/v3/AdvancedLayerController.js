/**
 * @provide pskl.controller.v3.AdvancedLayerController
 *
 * V3 - Advanced layer management with blend modes and opacity
 */
(function () {
  var ns = $.namespace('pskl.controller.v3');

  ns.AdvancedLayerController = function (piskelController) {
    this.piskelController = piskelController;
  };

  ns.AdvancedLayerController.prototype.init = function () {
    this.createLayerPanel();
    this.setupEventListeners();
  };

  ns.AdvancedLayerController.prototype.createLayerPanel = function () {
    var drawer = document.querySelector('.tool-drawer-content');
    if (!drawer) return;
    
    var panel = document.createElement('div');
    panel.className = 'advanced-layer-panel v3-only';
    panel.id = 'advanced-layer-panel';
    panel.innerHTML = `
      <div class="layer-panel-header">
        <h4>Advanced Layers</h4>
        <button class="layer-add-btn" id="layer-add-btn" title="Add Layer">+</button>
      </div>
      <div class="layer-list" id="layer-list">
        <!-- Layers will be rendered here -->
      </div>
      <div class="layer-controls">
        <div class="opacity-control">
          <label>Opacity:</label>
          <input type="range" id="layer-opacity" min="0" max="100" value="100" />
          <span id="layer-opacity-value">100%</span>
        </div>
        <div class="blend-mode-control">
          <label>Blend Mode:</label>
          <select id="layer-blend-mode">
            <option value="normal">Normal</option>
            <option value="multiply">Multiply</option>
            <option value="screen">Screen</option>
            <option value="overlay">Overlay</option>
            <option value="darken">Darken</option>
            <option value="lighten">Lighten</option>
            <option value="color-dodge">Color Dodge</option>
            <option value="color-burn">Color Burn</option>
          </select>
        </div>
      </div>
    `;
    
    drawer.appendChild(panel);
    this.renderLayers();
  };

  ns.AdvancedLayerController.prototype.setupEventListeners = function () {
    var addBtn = document.getElementById('layer-add-btn');
    var opacitySlider = document.getElementById('layer-opacity');
    var blendMode = document.getElementById('layer-blend-mode');
    
    if (addBtn) {
      addBtn.addEventListener('click', this.addNewLayer.bind(this));
    }
    
    if (opacitySlider) {
      opacitySlider.addEventListener('input', this.updateLayerOpacity.bind(this));
    }
    
    if (blendMode) {
      blendMode.addEventListener('change', this.updateBlendMode.bind(this));
    }
    
    $.subscribe(Events.PISKEL_RESET, this.renderLayers.bind(this));
  };

  ns.AdvancedLayerController.prototype.renderLayers = function () {
    var list = document.getElementById('layer-list');
    if (!list) return;
    
    var layers = this.piskelController.getLayers();
    list.innerHTML = '';
    
    layers.forEach(function (layer, index) {
      var item = document.createElement('div');
      item.className = 'layer-item';
      item.dataset.layerId = layer.getId();
      
      var thumbnail = this.generateLayerThumbnail(layer);
      
      item.innerHTML = `
        <div class="layer-thumbnail">
          <canvas class="layer-thumb-canvas" width="32" height="32"></canvas>
        </div>
        <div class="layer-info">
          <input type="text" class="layer-name" value="${layer.getName()}" />
          <div class="layer-meta">
            <span class="layer-frames">${layer.getFrames().length} frames</span>
          </div>
        </div>
        <div class="layer-actions">
          <button class="layer-toggle" title="Show/Hide">👁️</button>
          <button class="layer-lock" title="Lock/Unlock">🔓</button>
          <button class="layer-delete" title="Delete">🗑️</button>
        </div>
      `;
      
      list.appendChild(item);
      
      // Render thumbnail
      var canvas = item.querySelector('.layer-thumb-canvas');
      if (canvas && thumbnail) {
        var ctx = canvas.getContext('2d');
        ctx.drawImage(thumbnail, 0, 0, 32, 32);
      }
      
      // Event listeners
      item.querySelector('.layer-toggle').addEventListener('click', this.toggleLayerVisibility.bind(this, layer));
      item.querySelector('.layer-lock').addEventListener('click', this.toggleLayerLock.bind(this, layer));
      item.querySelector('.layer-delete').addEventListener('click', this.deleteLayer.bind(this, layer));
    }.bind(this));
  };

  ns.AdvancedLayerController.prototype.generateLayerThumbnail = function (layer) {
    var frames = layer.getFrames();
    if (frames.length === 0) return null;
    
    var firstFrame = frames[0];
    return pskl.utils.FrameUtils.toImage(firstFrame);
  };

  ns.AdvancedLayerController.prototype.addNewLayer = function () {
    var name = 'Layer ' + (this.piskelController.getLayers().length + 1);
    var layer = new pskl.model.Layer(name);
    var piskel = this.piskelController.getPiskel();
    
    // Add empty frames
    for (var i = 0; i < piskel.getFrameCount(); i++) {
      var frame = new pskl.model.Frame(piskel.getWidth(), piskel.getHeight());
      layer.addFrame(frame);
    }
    
    piskel.addLayer(layer);
    this.renderLayers();
    
    $.publish(Events.SHOW_NOTIFICATION, {
      content: 'New layer added!',
      duration: 1500
    });
  };

  ns.AdvancedLayerController.prototype.updateLayerOpacity = function (e) {
    var opacity = e.target.value;
    document.getElementById('layer-opacity-value').textContent = opacity + '%';
    
    // Apply to current layer
    var currentLayer = this.piskelController.getCurrentLayer();
    if (currentLayer) {
      currentLayer.opacity = opacity / 100;
      $.publish(Events.PISKEL_RESET);
    }
  };

  ns.AdvancedLayerController.prototype.updateBlendMode = function (e) {
    var mode = e.target.value;
    var currentLayer = this.piskelController.getCurrentLayer();
    
    if (currentLayer) {
      currentLayer.blendMode = mode;
      $.publish(Events.PISKEL_RESET);
    }
  };

  ns.AdvancedLayerController.prototype.toggleLayerVisibility = function (layer, e) {
    layer.visible = !layer.visible;
    e.target.textContent = layer.visible ? '👁️' : '👁️‍🗨️';
    $.publish(Events.PISKEL_RESET);
  };

  ns.AdvancedLayerController.prototype.toggleLayerLock = function (layer, e) {
    layer.locked = !layer.locked;
    e.target.textContent = layer.locked ? '🔒' : '🔓';
    
    $.publish(Events.SHOW_NOTIFICATION, {
      content: layer.locked ? 'Layer locked' : 'Layer unlocked',
      duration: 1500
    });
  };

  ns.AdvancedLayerController.prototype.deleteLayer = function (layer) {
    if (this.piskelController.getLayers().length <= 1) {
      alert('Cannot delete the last layer!');
      return;
    }
    
    if (confirm('Delete layer "' + layer.getName() + '"?')) {
      var piskel = this.piskelController.getPiskel();
      piskel.removeLayer(layer);
      this.renderLayers();
    }
  };
})();
