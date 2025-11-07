/**
 * @provide pskl.controller.v2.ColorPaletteController
 *
 * V2 - Enhanced color palette management with presets and history
 */
(function () {
  var ns = $.namespace('pskl.controller.v2');

  ns.ColorPaletteController = function () {
    this.colorHistory = [];
    this.maxHistoryLength = 12;
    this.presets = this.getDefaultPresets();
  };

  ns.ColorPaletteController.prototype.init = function () {
    this.loadColorHistory();
    this.createColorPalettePanel();
    this.setupEventListeners();
  };

  ns.ColorPaletteController.prototype.getDefaultPresets = function () {
    return [
      {
        name: 'Game Boy',
        colors: ['#0f380f', '#306230', '#8bac0f', '#9bbc0f']
      },
      {
        name: 'NES',
        colors: ['#000000', '#fcfcfc', '#f8f8f8', '#bcbcbc', '#7c7c7c', '#a4e4fc', '#3cbcfc', '#0078f8']
      },
      {
        name: 'Pastel',
        colors: ['#ffadad', '#ffd6a5', '#fdffb6', '#caffbf', '#9bf6ff', '#a0c4ff', '#bdb2ff', '#ffc6ff']
      },
      {
        name: 'Neon',
        colors: ['#ff006e', '#fb5607', '#ffbe0b', '#8338ec', '#3a86ff']
      },
      {
        name: 'Earth',
        colors: ['#582f0e', '#7f4f24', '#936639', '#a68a64', '#b6ad90', '#c2c5aa', '#a4ac86', '#656d4a']
      },
      {
        name: 'Fire',
        colors: ['#ffedd8', '#f3d5b5', '#e7bc91', '#d4a276', '#bc8a5f', '#a47148', '#8b5a3c', '#6c4423']
      }
    ];
  };

  ns.ColorPaletteController.prototype.createColorPalettePanel = function () {
    // Add to tool drawer
    var drawer = document.querySelector('.tool-drawer-content');
    if (!drawer) return;
    
    var panel = document.createElement('div');
    panel.className = 'color-palette-panel v2-only';
    panel.id = 'color-palette-panel';
    panel.innerHTML = `
      <div class="palette-section">
        <h4 class="palette-title">Recent Colors</h4>
        <div class="palette-colors" id="color-history"></div>
      </div>
      <div class="palette-section">
        <h4 class="palette-title">Color Presets</h4>
        <div class="palette-presets" id="palette-presets"></div>
      </div>
      <div class="palette-section">
        <h4 class="palette-title">Custom</h4>
        <button class="palette-add-btn" id="add-custom-color">
          <span>+ Add Current Color</span>
        </button>
      </div>
    `;
    
    drawer.appendChild(panel);
    
    this.renderColorHistory();
    this.renderPresets();
  };

  ns.ColorPaletteController.prototype.renderColorHistory = function () {
    var container = document.getElementById('color-history');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (this.colorHistory.length === 0) {
      container.innerHTML = '<p class="palette-empty">No recent colors</p>';
      return;
    }
    
    this.colorHistory.forEach(function (color) {
      var colorBtn = document.createElement('button');
      colorBtn.className = 'palette-color';
      colorBtn.style.backgroundColor = color;
      colorBtn.title = color;
      colorBtn.addEventListener('click', this.selectColor.bind(this, color));
      container.appendChild(colorBtn);
    }.bind(this));
  };

  ns.ColorPaletteController.prototype.renderPresets = function () {
    var container = document.getElementById('palette-presets');
    if (!container) return;
    
    container.innerHTML = '';
    
    this.presets.forEach(function (preset) {
      var presetBtn = document.createElement('button');
      presetBtn.className = 'palette-preset';
      presetBtn.innerHTML = `
        <span class="preset-name">${preset.name}</span>
        <div class="preset-colors">
          ${preset.colors.map(function (color) {
            return '<span class="preset-color" style="background-color: ' + color + '"></span>';
          }).join('')}
        </div>
      `;
      presetBtn.addEventListener('click', this.applyPreset.bind(this, preset));
      container.appendChild(presetBtn);
    }.bind(this));
  };

  ns.ColorPaletteController.prototype.setupEventListeners = function () {
    $.subscribe(Events.PRIMARY_COLOR_UPDATED, this.onColorSelected.bind(this));
    
    var addBtn = document.getElementById('add-custom-color');
    if (addBtn) {
      addBtn.addEventListener('click', this.addCurrentColor.bind(this));
    }
  };

  ns.ColorPaletteController.prototype.onColorSelected = function (evt) {
    if (evt.color) {
      this.addToHistory(evt.color);
    }
  };

  ns.ColorPaletteController.prototype.addToHistory = function (color) {
    // Remove if already exists
    var index = this.colorHistory.indexOf(color);
    if (index > -1) {
      this.colorHistory.splice(index, 1);
    }
    
    // Add to front
    this.colorHistory.unshift(color);
    
    // Limit history length
    if (this.colorHistory.length > this.maxHistoryLength) {
      this.colorHistory = this.colorHistory.slice(0, this.maxHistoryLength);
    }
    
    this.saveColorHistory();
    this.renderColorHistory();
  };

  ns.ColorPaletteController.prototype.selectColor = function (color) {
    $.publish(Events.SELECT_PRIMARY_COLOR, {color: color});
  };

  ns.ColorPaletteController.prototype.applyPreset = function (preset) {
    // Show preset colors in history for quick access
    preset.colors.forEach(function (color) {
      this.addToHistory(color);
    }.bind(this));
    
    $.publish(Events.SHOW_NOTIFICATION, {
      content: preset.name + ' palette applied!',
      duration: 1500
    });
  };

  ns.ColorPaletteController.prototype.addCurrentColor = function () {
    var currentColor = pskl.app.selectedColorsService.getPrimaryColor();
    if (currentColor) {
      this.addToHistory(currentColor);
      $.publish(Events.SHOW_NOTIFICATION, {
        content: 'Color added to history',
        duration: 1500
      });
    }
  };

  ns.ColorPaletteController.prototype.loadColorHistory = function () {
    var stored = localStorage.getItem('piskelV2ColorHistory');
    if (stored) {
      try {
        this.colorHistory = JSON.parse(stored);
      } catch (e) {
        this.colorHistory = [];
      }
    }
  };

  ns.ColorPaletteController.prototype.saveColorHistory = function () {
    localStorage.setItem('piskelV2ColorHistory', JSON.stringify(this.colorHistory));
  };
})();
