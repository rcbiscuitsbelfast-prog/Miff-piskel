/**
 * @provide pskl.service.TouchGestureService
 *
 * @require pskl.service.HistoryService
 */
(function () {
  var ns = $.namespace('pskl.service');

  /**
   * Touch Gesture Service - Handles swipe, pinch, tap-hold gestures
   */
  ns.TouchGestureService = function (piskelController) {
    this.piskelController = piskelController;
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchStartTime = 0;
    this.isSwiping = false;
    this.isLongPress = false;
    this.longPressTimer = null;
    this.initialPinchDistance = 0;
    this.currentZoom = 1;
  };

  ns.TouchGestureService.prototype.init = function () {
    this.setupGestureListeners();
    this.createGestureUI();
  };

  ns.TouchGestureService.prototype.setupGestureListeners = function () {
    var canvas = document.querySelector('#drawing-canvas-container');
    if (!canvas) return;
    
    // Touch events
    canvas.addEventListener('touchstart', this.onTouchStart.bind(this), {passive: false});
    canvas.addEventListener('touchmove', this.onTouchMove.bind(this), {passive: false});
    canvas.addEventListener('touchend', this.onTouchEnd.bind(this), {passive: false});
    
    // Prevent default touch behaviors
    canvas.addEventListener('touchstart', function (e) {
      if (e.touches.length > 1) {
        e.preventDefault(); // Prevent pinch-zoom on canvas
      }
    }, {passive: false});
  };

  ns.TouchGestureService.prototype.onTouchStart = function (e) {
    if (e.touches.length === 1) {
      // Single touch - check for swipe or long press
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
      this.touchStartTime = Date.now();
      this.isSwiping = false;
      
      // Start long press timer for color picker
      this.longPressTimer = setTimeout(this.onLongPress.bind(this), 500);
      
    } else if (e.touches.length === 2) {
      // Two finger touch - pinch zoom
      clearTimeout(this.longPressTimer);
      this.initialPinchDistance = this.getPinchDistance(e.touches);
    }
  };

  ns.TouchGestureService.prototype.onTouchMove = function (e) {
    if (e.touches.length === 1) {
      var deltaX = e.touches[0].clientX - this.touchStartX;
      var deltaY = e.touches[0].clientY - this.touchStartY;
      var distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      if (distance > 10) {
        clearTimeout(this.longPressTimer);
        this.isSwiping = true;
      }
      
    } else if (e.touches.length === 2) {
      // Handle pinch zoom
      e.preventDefault();
      var currentDistance = this.getPinchDistance(e.touches);
      var scale = currentDistance / this.initialPinchDistance;
      this.handlePinchZoom(scale);
    }
  };

  ns.TouchGestureService.prototype.onTouchEnd = function (e) {
    clearTimeout(this.longPressTimer);
    
    if (this.isSwiping && e.changedTouches.length === 1) {
      var deltaX = e.changedTouches[0].clientX - this.touchStartX;
      var deltaY = e.changedTouches[0].clientY - this.touchStartY;
      var deltaTime = Date.now() - this.touchStartTime;
      
      // Check for swipe gestures (horizontal swipes for undo/redo)
      if (Math.abs(deltaX) > 100 && Math.abs(deltaY) < 50 && deltaTime < 300) {
        if (deltaX > 0) {
          this.handleSwipeRight();
        } else {
          this.handleSwipeLeft();
        }
      }
    }
    
    this.isSwiping = false;
    this.isLongPress = false;
  };

  ns.TouchGestureService.prototype.onLongPress = function () {
    this.isLongPress = true;
    this.showColorPicker();
  };

  ns.TouchGestureService.prototype.handleSwipeRight = function () {
    // Undo
    this.showGestureHint('Undo');
    $.publish(Events.UNDO);
  };

  ns.TouchGestureService.prototype.handleSwipeLeft = function () {
    // Redo
    this.showGestureHint('Redo');
    $.publish(Events.REDO);
  };

  ns.TouchGestureService.prototype.handlePinchZoom = function (scale) {
    if (scale > 1.1) {
      $.publish(Events.ZOOM_IN);
    } else if (scale < 0.9) {
      $.publish(Events.ZOOM_OUT);
    }
  };

  ns.TouchGestureService.prototype.showColorPicker = function () {
    // Trigger color picker tool
    $.publish(Events.TOOL_SELECTED, {
      toolId: 'color-picker'
    });
    this.showGestureHint('Color Picker');
  };

  ns.TouchGestureService.prototype.getPinchDistance = function (touches) {
    var dx = touches[0].clientX - touches[1].clientX;
    var dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  ns.TouchGestureService.prototype.showGestureHint = function (message) {
    var hint = document.querySelector('.gesture-hint');
    if (hint) {
      hint.textContent = message;
      hint.classList.add('visible');
      setTimeout(function () {
        hint.classList.remove('visible');
      }, 1000);
    }
  };

  ns.TouchGestureService.prototype.createGestureUI = function () {
    // Create gesture overlay
    var overlay = document.createElement('div');
    overlay.className = 'gesture-overlay';
    overlay.innerHTML = '<div class="gesture-hint"></div>';
    document.body.appendChild(overlay);
    
    // Create undo/redo buttons
    var undoRedoContainer = document.createElement('div');
    undoRedoContainer.className = 'undo-redo-buttons';
    undoRedoContainer.innerHTML = `
      <button id="mobile-undo-btn" title="Undo (or swipe right)">↶</button>
      <button id="mobile-redo-btn" title="Redo (or swipe left)">↷</button>
    `;
    document.body.appendChild(undoRedoContainer);
    
    document.getElementById('mobile-undo-btn').addEventListener('click', function () {
      $.publish(Events.UNDO);
    });
    
    document.getElementById('mobile-redo-btn').addEventListener('click', function () {
      $.publish(Events.REDO);
    });
    
    // Create zoom controls
    var zoomContainer = document.createElement('div');
    zoomContainer.className = 'zoom-controls';
    zoomContainer.innerHTML = `
      <button id="mobile-zoom-in-btn" title="Zoom In (or pinch out)">+</button>
      <button id="mobile-zoom-out-btn" title="Zoom Out (or pinch in)">−</button>
      <button id="mobile-zoom-reset-btn" title="Reset Zoom">⊙</button>
    `;
    document.body.appendChild(zoomContainer);
    
    document.getElementById('mobile-zoom-in-btn').addEventListener('click', function () {
      $.publish(Events.ZOOM_IN);
    });
    
    document.getElementById('mobile-zoom-out-btn').addEventListener('click', function () {
      $.publish(Events.ZOOM_OUT);
    });
    
    document.getElementById('mobile-zoom-reset-btn').addEventListener('click', function () {
      $.publish(Events.ZOOM_RESET);
    });
    
    // Update button states on history changes
    $.subscribe(Events.PISKEL_RESET, this.updateUndoRedoButtons.bind(this));
    $.subscribe(Events.PISKEL_SAVE_STATE, this.updateUndoRedoButtons.bind(this));
  };

  ns.TouchGestureService.prototype.updateUndoRedoButtons = function () {
    var historyService = pskl.app.historyService;
    if (!historyService) return;
    
    var undoBtn = document.getElementById('mobile-undo-btn');
    var redoBtn = document.getElementById('mobile-redo-btn');
    
    if (undoBtn) {
      undoBtn.disabled = !historyService.canUndo();
    }
    if (redoBtn) {
      redoBtn.disabled = !historyService.canRedo();
    }
  };
})();
