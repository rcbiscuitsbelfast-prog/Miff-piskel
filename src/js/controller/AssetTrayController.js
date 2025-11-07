/**
 * @provide pskl.controller.AssetTrayController
 *
 * @require pskl.utils.CanvasUtils
 */
(function () {
  var ns = $.namespace('pskl.controller');

  /**
   * Asset Tray Controller - Displays chopped tiles in scrollable tray
   */
  ns.AssetTrayController = function (piskelController) {
    this.piskelController = piskelController;
    this.frames = [];
    this.selectedFrames = [];
  };

  ns.AssetTrayController.prototype.init = function () {
    $.subscribe(Events.FRAMES_CHOPPED, this.onFramesChopped.bind(this));
    this.createTray();
  };

  ns.AssetTrayController.prototype.createTray = function () {
    var tray = document.createElement('div');
    tray.className = 'asset-tray';
    tray.id = 'asset-tray';
    tray.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      width: 300px;
      max-height: calc(100vh - 200px);
      background: rgba(30, 30, 40, 0.98);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      padding: 20px;
      z-index: 9997;
      display: none;
      flex-direction: column;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    `;
    
    tray.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <h3 style="margin: 0; color: white; font-size: 18px;">Chopped Sprites</h3>
        <button id="close-tray-btn" style="width: 32px; height: 32px; border-radius: 50%; border: none; background: rgba(255,255,255,0.1); color: white; cursor: pointer; font-size: 18px;">×</button>
      </div>
      <div style="color: rgba(255,255,255,0.7); font-size: 14px; margin-bottom: 16px;" id="tray-info"></div>
      <div id="asset-grid" style="
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
        gap: 8px;
        overflow-y: auto;
        flex: 1;
        padding: 8px;
        background: rgba(0,0,0,0.2);
        border-radius: 8px;
      "></div>
      <div style="margin-top: 16px; display: flex; gap: 8px;">
        <button id="use-selected-btn" style="
          flex: 1;
          padding: 12px;
          border-radius: 8px;
          border: none;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          font-size: 14px;
          font-weight: bold;
          cursor: pointer;
        ">Use Selected</button>
        <button id="tag-frames-btn" style="
          flex: 1;
          padding: 12px;
          border-radius: 8px;
          border: none;
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          color: white;
          font-size: 14px;
          font-weight: bold;
          cursor: pointer;
        ">Tag Frames</button>
      </div>
    `;
    
    document.body.appendChild(tray);
    
    document.getElementById('close-tray-btn').addEventListener('click', this.closeTray.bind(this));
    document.getElementById('use-selected-btn').addEventListener('click', this.useSelectedFrames.bind(this));
    document.getElementById('tag-frames-btn').addEventListener('click', this.openTaggingDialog.bind(this));
  };

  ns.AssetTrayController.prototype.onFramesChopped = function (evt) {
    this.frames = evt.frames;
    this.selectedFrames = [];
    
    var tray = document.getElementById('asset-tray');
    if (tray) {
      tray.style.display = 'flex';
    }
    
    var info = document.getElementById('tray-info');
    if (info) {
      info.textContent = `${evt.frames.length} sprites (${evt.gridSize.width}x${evt.gridSize.height} each)`;
    }
    
    this.renderFrames();
  };

  ns.AssetTrayController.prototype.renderFrames = function () {
    var grid = document.getElementById('asset-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    this.frames.forEach(function (frame, index) {
      var item = document.createElement('div');
      item.style.cssText = `
        position: relative;
        aspect-ratio: 1;
        background: rgba(255,255,255,0.05);
        border: 2px solid rgba(255,255,255,0.1);
        border-radius: 8px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        transition: all 0.2s ease;
      `;
      
      var img = document.createElement('img');
      img.src = frame.dataURL;
      img.style.cssText = `
        max-width: 100%;
        max-height: 100%;
        image-rendering: pixelated;
      `;
      
      var label = document.createElement('div');
      label.textContent = index;
      label.style.cssText = `
        position: absolute;
        top: 2px;
        right: 2px;
        background: rgba(0,0,0,0.7);
        color: white;
        font-size: 10px;
        padding: 2px 4px;
        border-radius: 4px;
      `;
      
      item.appendChild(img);
      item.appendChild(label);
      
      item.addEventListener('click', function () {
        this.toggleFrameSelection(index, item);
      }.bind(this));
      
      grid.appendChild(item);
    }.bind(this));
  };

  ns.AssetTrayController.prototype.toggleFrameSelection = function (index, element) {
    var selectedIndex = this.selectedFrames.indexOf(index);
    
    if (selectedIndex > -1) {
      // Deselect
      this.selectedFrames.splice(selectedIndex, 1);
      element.style.borderColor = 'rgba(255,255,255,0.1)';
      element.style.background = 'rgba(255,255,255,0.05)';
    } else {
      // Select
      this.selectedFrames.push(index);
      element.style.borderColor = '#667eea';
      element.style.background = 'rgba(102, 126, 234, 0.2)';
    }
  };

  ns.AssetTrayController.prototype.useSelectedFrames = function () {
    if (this.selectedFrames.length === 0) {
      alert('Please select at least one frame');
      return;
    }
    
    // Get selected frame data
    var selectedFrameData = this.selectedFrames.map(function (index) {
      return this.frames[index];
    }.bind(this));
    
    // Publish event to add frames to piskel
    $.publish(Events.ADD_FRAMES_FROM_TRAY, {
      frames: selectedFrameData
    });
    
    this.closeTray();
  };

  ns.AssetTrayController.prototype.openTaggingDialog = function () {
    $.publish(Events.OPEN_TAGGING_DIALOG, {
      frames: this.frames,
      selectedFrames: this.selectedFrames
    });
  };

  ns.AssetTrayController.prototype.closeTray = function () {
    var tray = document.getElementById('asset-tray');
    if (tray) {
      tray.style.display = 'none';
    }
    this.selectedFrames = [];
  };
})();
