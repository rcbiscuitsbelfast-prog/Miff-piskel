/**
 * @provide pskl.controller.v2.ExportPreviewController
 *
 * V2 - Enhanced export with live preview
 */
(function () {
  var ns = $.namespace('pskl.controller.v2');

  ns.ExportPreviewController = function (piskelController) {
    this.piskelController = piskelController;
  };

  ns.ExportPreviewController.prototype.init = function () {
    // Will enhance the export dialog when opened
  };

  ns.ExportPreviewController.prototype.showEnhancedExportDialog = function () {
    var piskel = this.piskelController.getPiskel();
    
    var dialog = document.createElement('div');
    dialog.className = 'enhanced-export-dialog v2-only';
    dialog.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.9);
      z-index: 20000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      overflow-y: auto;
    `;
    
    var content = document.createElement('div');
    content.style.cssText = `
      background: rgba(30, 30, 40, 0.98);
      border-radius: 16px;
      padding: 30px;
      max-width: 600px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      color: white;
    `;
    
    content.innerHTML = `
      <h2 style="margin: 0 0 20px 0;">Export Preview</h2>
      
      <div style="margin-bottom: 24px; background: rgba(0,0,0,0.3); padding: 20px; border-radius: 12px; text-align: center;">
        <canvas id="export-preview-canvas" style="max-width: 100%; image-rendering: pixelated; border: 2px solid rgba(255,255,255,0.2); border-radius: 8px;"></canvas>
        <p style="margin: 12px 0 0 0; color: rgba(255,255,255,0.7); font-size: 14px;">
          ${piskel.getWidth()}x${piskel.getHeight()} • ${piskel.getFrameCount()} frames @ ${piskel.getFPS()}fps
        </p>
      </div>
      
      <div style="margin-bottom: 20px;">
        <label style="display: block; margin-bottom: 8px; font-weight: bold;">Export Format</label>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <button class="export-format-btn active" data-format="spritesheet">
            <span style="font-size: 24px;">📋</span>
            <span>Sprite Sheet</span>
          </button>
          <button class="export-format-btn" data-format="sequence">
            <span style="font-size: 24px;">🎞️</span>
            <span>PNG Sequence</span>
          </button>
          <button class="export-format-btn" data-format="gif">
            <span style="font-size: 24px;">🎬</span>
            <span>Animated GIF</span>
          </button>
          <button class="export-format-btn" data-format="json">
            <span style="font-size: 24px;">📄</span>
            <span>JSON Only</span>
          </button>
        </div>
      </div>
      
      <div style="margin-bottom: 20px;">
        <label style="display: block; margin-bottom: 8px; font-weight: bold;">Asset Name</label>
        <input type="text" id="export-asset-name-v2" placeholder="e.g., hero-sprite" value="${piskel.getDescriptor().name || 'sprite'}"
          style="width: 100%; padding: 12px; border-radius: 8px; border: 2px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.1); color: white; font-size: 16px;">
      </div>
      
      <div style="margin-bottom: 20px;">
        <label style="display: flex; align-items: center; cursor: pointer;">
          <input type="checkbox" id="include-metadata-v2" checked
            style="width: 20px; height: 20px; margin-right: 12px;">
          <span>Include MIFF metadata and manifest</span>
        </label>
      </div>
      
      <div style="padding: 16px; background: rgba(102, 126, 234, 0.1); border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #667eea;">
        <strong style="display: block; margin-bottom: 8px;">✨ V2 Enhanced Export</strong>
        <ul style="margin: 8px 0 0 20px; padding: 0; font-size: 14px; color: rgba(255,255,255,0.8);">
          <li>Live preview before export</li>
          <li>Multiple format options</li>
          <li>Optimized file sizes</li>
          <li>MIFF-compatible metadata</li>
        </ul>
      </div>
      
      <div style="display: flex; gap: 12px;">
        <button id="export-cancel-v2" style="flex: 1; padding: 14px; border-radius: 8px; border: none; background: rgba(255,255,255,0.1); color: white; font-size: 16px; font-weight: bold; cursor: pointer;">
          Cancel
        </button>
        <button id="export-download-v2" style="flex: 1; padding: 14px; border-radius: 8px; border: none; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-size: 16px; font-weight: bold; cursor: pointer;">
          💾 Export
        </button>
      </div>
    `;
    
    dialog.appendChild(content);
    document.body.appendChild(dialog);
    
    // Render preview
    this.renderPreview(piskel);
    
    // Setup event listeners
    document.getElementById('export-cancel-v2').addEventListener('click', function () {
      dialog.remove();
    });
    
    document.getElementById('export-download-v2').addEventListener('click', function () {
      this.performEnhancedExport(dialog);
    }.bind(this));
    
    // Format selection
    var formatBtns = content.querySelectorAll('.export-format-btn');
    formatBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        formatBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
      });
    });
  };

  ns.ExportPreviewController.prototype.renderPreview = function (piskel) {
    var canvas = document.getElementById('export-preview-canvas');
    if (!canvas) return;
    
    var renderer = new pskl.rendering.PiskelRenderer(this.piskelController);
    var previewCanvas = renderer.renderAsCanvas();
    
    canvas.width = previewCanvas.width;
    canvas.height = previewCanvas.height;
    
    var ctx = canvas.getContext('2d');
    ctx.drawImage(previewCanvas, 0, 0);
  };

  ns.ExportPreviewController.prototype.performEnhancedExport = function (dialog) {
    var format = document.querySelector('.export-format-btn.active').dataset.format;
    var assetName = document.getElementById('export-asset-name-v2').value.trim() || 'sprite';
    var includeMetadata = document.getElementById('include-metadata-v2').checked;
    
    // Use existing export service
    if (pskl.app.miffExportService) {
      $.publish(Events.EXPORT_REQUEST, {
        format: format,
        name: assetName,
        includeMetadata: includeMetadata
      });
    }
    
    dialog.remove();
    
    $.publish(Events.SHOW_NOTIFICATION, {
      content: 'Export started! Check your downloads.',
      duration: 3000
    });
  };
})();
