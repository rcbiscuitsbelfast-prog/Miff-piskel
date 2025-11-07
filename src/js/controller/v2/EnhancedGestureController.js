/**
 * @provide pskl.controller.v2.EnhancedGestureController
 *
 * V2 - Enhanced gesture detection with better visual feedback
 */
(function () {
  var ns = $.namespace('pskl.controller.v2');

  ns.EnhancedGestureController = function (piskelController) {
    this.piskelController = piskelController;
    this.gestureTrail = [];
    this.isDrawingGesture = false;
  };

  ns.EnhancedGestureController.prototype.init = function () {
    this.createGestureCanvas();
    this.setupGestureDetection();
  };

  ns.EnhancedGestureController.prototype.createGestureCanvas = function () {
    var canvas = document.createElement('canvas');
    canvas.id = 'gesture-feedback-canvas';
    canvas.className = 'gesture-feedback-canvas v2-only';
    canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9000;
    `;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    document.body.appendChild(canvas);
    
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    
    window.addEventListener('resize', function () {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  };

  ns.EnhancedGestureController.prototype.setupGestureDetection = function () {
    var drawingCanvas = document.querySelector('#drawing-canvas-container');
    if (!drawingCanvas) return;
    
    var hammertime = new Hammer(drawingCanvas);
    
    // Configure recognizers
    hammertime.get('swipe').set({ direction: Hammer.DIRECTION_ALL, velocity: 0.3 });
    hammertime.get('pinch').set({ enable: true });
    
    // Swipe gestures with visual feedback
    hammertime.on('swipeleft', this.onSwipeLeft.bind(this));
    hammertime.on('swiperight', this.onSwipeRight.bind(this));
    hammertime.on('swipeup', this.onSwipeUp.bind(this));
    hammertime.on('swipedown', this.onSwipeDown.bind(this));
    
    // Pinch with visual feedback
    hammertime.on('pinchstart', this.onPinchStart.bind(this));
    hammertime.on('pinchmove', this.onPinchMove.bind(this));
    hammertime.on('pinchend', this.onPinchEnd.bind(this));
    
    // Pan for drawing trail
    hammertime.on('panstart', this.onPanStart.bind(this));
    hammertime.on('panmove', this.onPanMove.bind(this));
    hammertime.on('panend', this.onPanEnd.bind(this));
  };

  ns.EnhancedGestureController.prototype.onSwipeLeft = function (e) {
    this.showSwipeIndicator('left', e.center);
    $.publish(Events.REDO);
  };

  ns.EnhancedGestureController.prototype.onSwipeRight = function (e) {
    this.showSwipeIndicator('right', e.center);
    $.publish(Events.UNDO);
  };

  ns.EnhancedGestureController.prototype.onSwipeUp = function (e) {
    this.showSwipeIndicator('up', e.center);
    // Could add frame navigation or other actions
  };

  ns.EnhancedGestureController.prototype.onSwipeDown = function (e) {
    this.showSwipeIndicator('down', e.center);
    // Could add frame navigation or other actions
  };

  ns.EnhancedGestureController.prototype.showSwipeIndicator = function (direction, center) {
    var indicator = document.createElement('div');
    indicator.className = 'gesture-indicator swipe-' + direction + ' v2-only';
    
    var arrows = {
      'left': '←',
      'right': '→',
      'up': '↑',
      'down': '↓'
    };
    
    var labels = {
      'left': 'Redo',
      'right': 'Undo',
      'up': 'Swipe Up',
      'down': 'Swipe Down'
    };
    
    indicator.innerHTML = `
      <span class="gesture-arrow">${arrows[direction]}</span>
      <span class="gesture-label">${labels[direction]}</span>
    `;
    
    indicator.style.cssText = `
      position: fixed;
      left: ${center.x}px;
      top: ${center.y}px;
      transform: translate(-50%, -50%);
    `;
    
    document.body.appendChild(indicator);
    
    setTimeout(function () {
      indicator.classList.add('show');
    }, 10);
    
    setTimeout(function () {
      indicator.classList.remove('show');
      setTimeout(function () {
        indicator.remove();
      }, 300);
    }, 800);
  };

  ns.EnhancedGestureController.prototype.onPinchStart = function (e) {
    this.showPinchIndicator(e.center, e.scale);
  };

  ns.EnhancedGestureController.prototype.onPinchMove = function (e) {
    this.updatePinchIndicator(e.scale);
  };

  ns.EnhancedGestureController.prototype.onPinchEnd = function (e) {
    this.hidePinchIndicator();
    if (e.scale > 1.2) {
      $.publish(Events.ZOOM_IN);
    } else if (e.scale < 0.8) {
      $.publish(Events.ZOOM_OUT);
    }
  };

  ns.EnhancedGestureController.prototype.showPinchIndicator = function (center, scale) {
    var existing = document.getElementById('pinch-indicator');
    if (existing) return;
    
    var indicator = document.createElement('div');
    indicator.id = 'pinch-indicator';
    indicator.className = 'gesture-indicator pinch-indicator v2-only';
    indicator.innerHTML = `
      <div class="pinch-circle"></div>
      <span class="pinch-label">Zoom</span>
    `;
    
    indicator.style.cssText = `
      position: fixed;
      left: ${center.x}px;
      top: ${center.y}px;
      transform: translate(-50%, -50%) scale(${scale});
    `;
    
    document.body.appendChild(indicator);
    
    setTimeout(function () {
      indicator.classList.add('show');
    }, 10);
  };

  ns.EnhancedGestureController.prototype.updatePinchIndicator = function (scale) {
    var indicator = document.getElementById('pinch-indicator');
    if (!indicator) return;
    
    var circle = indicator.querySelector('.pinch-circle');
    if (circle) {
      circle.style.transform = 'scale(' + scale + ')';
    }
  };

  ns.EnhancedGestureController.prototype.hidePinchIndicator = function () {
    var indicator = document.getElementById('pinch-indicator');
    if (indicator) {
      indicator.classList.remove('show');
      setTimeout(function () {
        indicator.remove();
      }, 300);
    }
  };

  ns.EnhancedGestureController.prototype.onPanStart = function (e) {
    if (e.pointers.length > 1) return; // Ignore multi-touch
    this.gestureTrail = [{x: e.center.x, y: e.center.y}];
    this.isDrawingGesture = true;
  };

  ns.EnhancedGestureController.prototype.onPanMove = function (e) {
    if (!this.isDrawingGesture || e.pointers.length > 1) return;
    
    this.gestureTrail.push({x: e.center.x, y: e.center.y});
    
    // Keep trail length reasonable
    if (this.gestureTrail.length > 20) {
      this.gestureTrail.shift();
    }
    
    this.drawGestureTrail();
  };

  ns.EnhancedGestureController.prototype.onPanEnd = function () {
    this.isDrawingGesture = false;
    this.fadeOutTrail();
  };

  ns.EnhancedGestureController.prototype.drawGestureTrail = function () {
    if (!this.ctx || this.gestureTrail.length < 2) return;
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    
    for (var i = 0; i < this.gestureTrail.length - 1; i++) {
      var progress = i / this.gestureTrail.length;
      var alpha = progress * 0.3;
      var width = (1 - progress) * 3 + 1;
      
      this.ctx.strokeStyle = 'rgba(102, 126, 234, ' + alpha + ')';
      this.ctx.lineWidth = width;
      
      this.ctx.beginPath();
      this.ctx.moveTo(this.gestureTrail[i].x, this.gestureTrail[i].y);
      this.ctx.lineTo(this.gestureTrail[i + 1].x, this.gestureTrail[i + 1].y);
      this.ctx.stroke();
    }
  };

  ns.EnhancedGestureController.prototype.fadeOutTrail = function () {
    var fadeStep = 0;
    var fadeInterval = setInterval(function () {
      fadeStep += 0.1;
      this.ctx.globalAlpha = 1 - fadeStep;
      
      if (fadeStep >= 1) {
        clearInterval(fadeInterval);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.globalAlpha = 1;
        this.gestureTrail = [];
      }
    }.bind(this), 50);
  };
})();
