/**
 * @provide pskl.controller.ToolDrawerController
 *
 * @require pskl.controller.ToolController
 */
(function () {
  var ns = $.namespace('pskl.controller');

  /**
   * Tool Drawer Controller - Manages collapsible bottom drawer with tools
   */
  ns.ToolDrawerController = function () {
    this.isExpanded = false;
    this.selectedTool = null;
  };

  ns.ToolDrawerController.prototype.init = function () {
    this.createDrawer();
    this.populateTools();
    this.setupEventListeners();
  };

  ns.ToolDrawerController.prototype.createDrawer = function () {
    var drawer = document.createElement('div');
    drawer.className = 'tool-drawer';
    drawer.id = 'mobile-tool-drawer';
    drawer.innerHTML = `
      <div class="tool-drawer-handle" id="tool-drawer-handle">
        <div class="tool-drawer-handle-bar"></div>
      </div>
      <div class="tool-drawer-content">
        <div class="tool-grid" id="tool-grid"></div>
        <div class="color-picker-section">
          <div class="color-picker-circle primary" id="mobile-primary-color" style="background-color: #000000;"></div>
          <button class="swap-colors-btn" id="mobile-swap-colors">
            <span class="icon">⇄</span>
          </button>
          <div class="color-picker-circle secondary" id="mobile-secondary-color" style="background-color: #ffffff;"></div>
        </div>
      </div>
    `;
    
    document.body.appendChild(drawer);
  };

  ns.ToolDrawerController.prototype.populateTools = function () {
    var toolGrid = document.getElementById('tool-grid');
    if (!toolGrid) return;
    
    var tools = [
      {id: 'tool-pen', icon: '✏️', label: 'Pen', title: 'Draw pixels'},
      {id: 'tool-paint-bucket', icon: '🪣', label: 'Fill', title: 'Fill with color'},
      {id: 'tool-eraser', icon: '🧽', label: 'Eraser', title: 'Erase pixels'},
      {id: 'tool-stroke', icon: '📏', label: 'Line', title: 'Draw straight lines'},
      {id: 'tool-rectangle', icon: '▭', label: 'Rectangle', title: 'Draw rectangles'},
      {id: 'tool-circle', icon: '○', label: 'Circle', title: 'Draw circles'},
      {id: 'tool-move', icon: '✋', label: 'Move', title: 'Move selection'},
      {id: 'tool-rectangle-select', icon: '⬚', label: 'Select', title: 'Select area'},
      {id: 'tool-shape-select', icon: '⟟', label: 'Lasso', title: 'Freehand select'},
      {id: 'tool-lighten', icon: '☀️', label: 'Lighten', title: 'Lighten color'},
      {id: 'tool-dithering', icon: '▦', label: 'Dither', title: 'Dithering tool'},
      {id: 'tool-colorpicker', icon: '💧', label: 'Pick Color', title: 'Pick color from canvas'}
    ];
    
    tools.forEach(function (tool) {
      var toolItem = document.createElement('div');
      toolItem.className = 'tool-item';
      toolItem.dataset.toolId = tool.id;
      toolItem.title = tool.title;
      toolItem.innerHTML = `
        <div class="icon">${tool.icon}</div>
        <div class="label">${tool.label}</div>
      `;
      
      toolItem.addEventListener('click', this.onToolSelect.bind(this, tool.id));
      toolGrid.appendChild(toolItem);
    }.bind(this));
    
    // Set pen as default
    this.selectTool('tool-pen');
  };

  ns.ToolDrawerController.prototype.setupEventListeners = function () {
    // Toggle drawer
    var handle = document.getElementById('tool-drawer-handle');
    if (handle) {
      handle.addEventListener('click', this.toggleDrawer.bind(this));
    }
    
    // Color pickers
    var primaryColor = document.getElementById('mobile-primary-color');
    var secondaryColor = document.getElementById('mobile-secondary-color');
    var swapBtn = document.getElementById('mobile-swap-colors');
    
    if (primaryColor) {
      primaryColor.addEventListener('click', this.showColorPicker.bind(this, 'primary'));
    }
    
    if (secondaryColor) {
      secondaryColor.addEventListener('click', this.showColorPicker.bind(this, 'secondary'));
    }
    
    if (swapBtn) {
      swapBtn.addEventListener('click', this.swapColors.bind(this));
    }
    
    // Subscribe to color changes
    $.subscribe(Events.PRIMARY_COLOR_UPDATED, this.onPrimaryColorChange.bind(this));
    $.subscribe(Events.SECONDARY_COLOR_UPDATED, this.onSecondaryColorChange.bind(this));
    $.subscribe(Events.TOOL_SELECTED, this.onToolChanged.bind(this));
  };

  ns.ToolDrawerController.prototype.toggleDrawer = function () {
    var drawer = document.getElementById('mobile-tool-drawer');
    if (!drawer) return;
    
    this.isExpanded = !this.isExpanded;
    
    if (this.isExpanded) {
      drawer.classList.add('expanded');
    } else {
      drawer.classList.remove('expanded');
    }
  };

  ns.ToolDrawerController.prototype.onToolSelect = function (toolId) {
    this.selectTool(toolId);
    
    // Map mobile tool IDs to Piskel tool IDs
    var toolMapping = {
      'tool-pen': 'tool-pen',
      'tool-paint-bucket': 'tool-paint-bucket',
      'tool-eraser': 'tool-eraser',
      'tool-stroke': 'tool-stroke',
      'tool-rectangle': 'tool-rectangle',
      'tool-circle': 'tool-circle',
      'tool-move': 'tool-move',
      'tool-rectangle-select': 'tool-rectangle-select',
      'tool-shape-select': 'tool-shape-select',
      'tool-lighten': 'tool-lighten',
      'tool-dithering': 'tool-dithering',
      'tool-colorpicker': 'tool-colorpicker'
    };
    
    var piskelToolId = toolMapping[toolId] || toolId;
    
    // Trigger tool selection event
    $.publish(Events.SELECT_TOOL, {
      toolId: piskelToolId
    });
    
    // Collapse drawer after selection (optional)
    // this.toggleDrawer();
  };

  ns.ToolDrawerController.prototype.selectTool = function (toolId) {
    // Remove active class from all tools
    var toolItems = document.querySelectorAll('.tool-item');
    toolItems.forEach(function (item) {
      item.classList.remove('active');
    });
    
    // Add active class to selected tool
    var selectedItem = document.querySelector('.tool-item[data-tool-id="' + toolId + '"]');
    if (selectedItem) {
      selectedItem.classList.add('active');
      this.selectedTool = toolId;
    }
  };

  ns.ToolDrawerController.prototype.onToolChanged = function (evt) {
    if (evt.toolId) {
      this.selectTool(evt.toolId);
    }
  };

  ns.ToolDrawerController.prototype.showColorPicker = function (type) {
    // Create a simple HTML5 color picker
    var input = document.createElement('input');
    input.type = 'color';
    
    // Get current color
    var currentColor = type === 'primary' ? 
      pskl.app.selectedColorsService.getPrimaryColor() :
      pskl.app.selectedColorsService.getSecondaryColor();
    
    input.value = currentColor;
    
    input.addEventListener('change', function (e) {
      var color = e.target.value;
      if (type === 'primary') {
        $.publish(Events.SELECT_PRIMARY_COLOR, {color: color});
      } else {
        $.publish(Events.SELECT_SECONDARY_COLOR, {color: color});
      }
    });
    
    input.click();
  };

  ns.ToolDrawerController.prototype.swapColors = function () {
    $.publish(Events.SWAP_COLORS);
  };

  ns.ToolDrawerController.prototype.onPrimaryColorChange = function (evt) {
    var colorCircle = document.getElementById('mobile-primary-color');
    if (colorCircle && evt.color) {
      colorCircle.style.backgroundColor = evt.color;
    }
  };

  ns.ToolDrawerController.prototype.onSecondaryColorChange = function (evt) {
    var colorCircle = document.getElementById('mobile-secondary-color');
    if (colorCircle && evt.color) {
      colorCircle.style.backgroundColor = evt.color;
    }
  };
})();
