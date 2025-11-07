/**
 * @provide pskl.service.AutoChopService
 *
 * @require pskl.utils.CanvasUtils
 */
(function () {
  var ns = $.namespace('pskl.service');

  /**
   * Auto Chop Service - Automatically detects and slices sprite sheets
   */
  ns.AutoChopService = function (piskelController) {
    this.piskelController = piskelController;
    this.choppedFrames = [];
    this.detectedGridSize = null;
  };

  ns.AutoChopService.prototype.init = function () {
    $.subscribe(Events.IMAGE_IMPORTED, this.onImageImported.bind(this));
  };

  ns.AutoChopService.prototype.onImageImported = function (evt) {
    if (!evt.imageData) return;
    
    var img = new Image();
    img.onload = function () {
      this.analyzeAndChop(img, evt.fileName);
    }.bind(this);
    img.src = evt.imageData;
  };

  ns.AutoChopService.prototype.analyzeAndChop = function (image, fileName) {
    // Try to detect grid size
    this.detectedGridSize = this.detectGridSize(image);
    
    if (!this.detectedGridSize) {
      // If auto-detection fails, prompt user
      this.promptForGridSize(image, fileName);
    } else {
      // Proceed with detected grid size
      this.chopImage(image, this.detectedGridSize.width, this.detectedGridSize.height, fileName);
    }
  };

  ns.AutoChopService.prototype.detectGridSize = function (image) {
    // Try common sprite sizes
    var commonSizes = [
      {width: 16, height: 16},
      {width: 32, height: 32},
      {width: 64, height: 64},
      {width: 48, height: 48},
      {width: 24, height: 24},
      {width: 8, height: 8}
    ];
    
    // Check if image dimensions are multiples of common sizes
    for (var i = 0; i < commonSizes.length; i++) {
      var size = commonSizes[i];
      if (image.width % size.width === 0 && image.height % size.height === 0) {
        var cols = image.width / size.width;
        var rows = image.height / size.height;
        
        // Prefer sizes that create reasonable grid counts (2-20 frames per row/col)
        if (cols >= 2 && cols <= 20 && rows >= 1 && rows <= 20) {
          return size;
        }
      }
    }
    
    // Try edge detection method
    return this.detectGridByEdges(image);
  };

  ns.AutoChopService.prototype.detectGridByEdges = function (image) {
    // Create canvas to analyze image
    var canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);
    
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var data = imageData.data;
    
    // Look for vertical and horizontal transparent lines
    var verticalGaps = this.findTransparentLines(data, canvas.width, canvas.height, true);
    var horizontalGaps = this.findTransparentLines(data, canvas.width, canvas.height, false);
    
    if (verticalGaps.length > 0 && horizontalGaps.length > 0) {
      return {
        width: verticalGaps[0],
        height: horizontalGaps[0]
      };
    }
    
    return null;
  };

  ns.AutoChopService.prototype.findTransparentLines = function (data, width, height, vertical) {
    var gaps = [];
    var maxGapSize = Math.min(width, height) / 2;
    
    var scanLength = vertical ? width : height;
    var lineLength = vertical ? height : width;
    
    for (var i = 1; i < scanLength; i++) {
      var isTransparent = true;
      
      for (var j = 0; j < lineLength; j++) {
        var index = vertical ? 
          (j * width + i) * 4 :
          (i * width + j) * 4;
        
        var alpha = data[index + 3];
        if (alpha > 10) {
          isTransparent = false;
          break;
        }
      }
      
      if (isTransparent && i < maxGapSize) {
        gaps.push(i);
      }
    }
    
    return gaps;
  };

  ns.AutoChopService.prototype.promptForGridSize = function (image, fileName) {
    // Create a dialog for grid size input
    var dialog = document.createElement('div');
    dialog.className = 'grid-size-dialog';
    dialog.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(30, 30, 40, 0.98);
      padding: 30px;
      border-radius: 16px;
      z-index: 20000;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
      color: white;
      min-width: 300px;
    `;
    
    dialog.innerHTML = `
      <h3 style="margin: 0 0 20px 0; font-size: 20px;">Set Grid Size</h3>
      <p style="margin: 0 0 20px 0; color: rgba(255,255,255,0.7);">
        Image: ${image.width}x${image.height}
      </p>
      <div style="display: flex; gap: 12px; margin-bottom: 20px;">
        <div style="flex: 1;">
          <label style="display: block; margin-bottom: 8px; font-size: 14px;">Width (px)</label>
          <input type="number" id="grid-width-input" value="32" min="1" max="${image.width}"
            style="width: 100%; padding: 12px; border-radius: 8px; border: 2px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.1); color: white; font-size: 16px;">
        </div>
        <div style="flex: 1;">
          <label style="display: block; margin-bottom: 8px; font-size: 14px;">Height (px)</label>
          <input type="number" id="grid-height-input" value="32" min="1" max="${image.height}"
            style="width: 100%; padding: 12px; border-radius: 8px; border: 2px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.1); color: white; font-size: 16px;">
        </div>
      </div>
      <div style="display: flex; gap: 12px;">
        <button id="grid-cancel-btn" style="flex: 1; padding: 14px; border-radius: 8px; border: none; background: rgba(255,255,255,0.1); color: white; font-size: 16px; font-weight: bold; cursor: pointer;">
          Cancel
        </button>
        <button id="grid-ok-btn" style="flex: 1; padding: 14px; border-radius: 8px; border: none; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-size: 16px; font-weight: bold; cursor: pointer;">
          Chop
        </button>
      </div>
    `;
    
    document.body.appendChild(dialog);
    
    var self = this;
    document.getElementById('grid-ok-btn').addEventListener('click', function () {
      var width = parseInt(document.getElementById('grid-width-input').value);
      var height = parseInt(document.getElementById('grid-height-input').value);
      
      if (width > 0 && height > 0) {
        self.chopImage(image, width, height, fileName);
        dialog.remove();
      }
    });
    
    document.getElementById('grid-cancel-btn').addEventListener('click', function () {
      dialog.remove();
    });
  };

  ns.AutoChopService.prototype.chopImage = function (image, tileWidth, tileHeight, fileName) {
    var cols = Math.floor(image.width / tileWidth);
    var rows = Math.floor(image.height / tileHeight);
    
    this.choppedFrames = [];
    
    // Create canvas for chopping
    var sourceCanvas = document.createElement('canvas');
    sourceCanvas.width = image.width;
    sourceCanvas.height = image.height;
    var sourceCtx = sourceCanvas.getContext('2d');
    sourceCtx.drawImage(image, 0, 0);
    
    // Chop into tiles
    for (var row = 0; row < rows; row++) {
      for (var col = 0; col < cols; col++) {
        var tileCanvas = document.createElement('canvas');
        tileCanvas.width = tileWidth;
        tileCanvas.height = tileHeight;
        var tileCtx = tileCanvas.getContext('2d');
        
        tileCtx.drawImage(
          sourceCanvas,
          col * tileWidth,
          row * tileHeight,
          tileWidth,
          tileHeight,
          0,
          0,
          tileWidth,
          tileHeight
        );
        
        this.choppedFrames.push({
          canvas: tileCanvas,
          index: row * cols + col,
          row: row,
          col: col,
          dataURL: tileCanvas.toDataURL()
        });
      }
    }
    
    // Publish event with chopped frames
    $.publish(Events.FRAMES_CHOPPED, {
      frames: this.choppedFrames,
      gridSize: {width: tileWidth, height: tileHeight},
      originalSize: {width: image.width, height: image.height},
      fileName: fileName
    });
  };

  ns.AutoChopService.prototype.getChoppedFrames = function () {
    return this.choppedFrames;
  };
})();
