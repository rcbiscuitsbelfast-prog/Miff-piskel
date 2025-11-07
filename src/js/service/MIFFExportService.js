/**
 * @provide pskl.service.MIFFExportService
 *
 * @require pskl.utils.CanvasUtils
 */
(function () {
  var ns = $.namespace('pskl.service');

  /**
   * MIFF Export Service - Exports sprites with structured metadata for game engines
   */
  ns.MIFFExportService = function (piskelController) {
    this.piskelController = piskelController;
  };

  ns.MIFFExportService.prototype.init = function () {
    // Add export button to mobile UI if in mobile mode
    this.addExportButton();
  };

  ns.MIFFExportService.prototype.addExportButton = function () {
    if (!document.body.classList.contains('mobile-mode')) return;
    
    var exportBtn = document.createElement('button');
    exportBtn.id = 'miff-export-btn';
    exportBtn.textContent = '💾 Export';
    exportBtn.style.cssText = `
      position: fixed;
      bottom: 80px;
      left: 50%;
      transform: translateX(-50%);
      min-width: 140px;
      min-height: 56px;
      padding: 16px 32px;
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      color: white;
      border: none;
      border-radius: 28px;
      font-size: 18px;
      font-weight: bold;
      box-shadow: 0 4px 12px rgba(245, 87, 108, 0.4);
      cursor: pointer;
      z-index: 9998;
    `;
    
    exportBtn.addEventListener('click', this.showExportDialog.bind(this));
    document.body.appendChild(exportBtn);
  };

  ns.MIFFExportService.prototype.showExportDialog = function () {
    var dialog = document.createElement('div');
    dialog.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      z-index: 20000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    `;
    
    var content = document.createElement('div');
    content.style.cssText = `
      background: rgba(30, 30, 40, 0.98);
      border-radius: 16px;
      padding: 30px;
      max-width: 600px;
      width: 100%;
      max-height: 80vh;
      overflow-y: auto;
      color: white;
    `;
    
    content.innerHTML = `
      <h2 style="margin: 0 0 20px 0;">Export for MIFF</h2>
      
      <div style="margin-bottom: 20px;">
        <label style="display: block; margin-bottom: 8px; font-weight: bold;">Export Format</label>
        <select id="export-format" 
          style="width: 100%; padding: 12px; border-radius: 8px; border: 2px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.1); color: white; font-size: 16px;">
          <option value="png-sequence">PNG Sequence + JSON</option>
          <option value="spritesheet">Sprite Sheet + JSON</option>
          <option value="json-only">JSON Metadata Only</option>
          <option value="miff-bundle">MIFF Bundle (ZIP)</option>
        </select>
      </div>
      
      <div style="margin-bottom: 20px;">
        <label style="display: block; margin-bottom: 8px; font-weight: bold;">Asset Name</label>
        <input type="text" id="export-asset-name" placeholder="e.g., hero-sprite" 
          style="width: 100%; padding: 12px; border-radius: 8px; border: 2px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.1); color: white; font-size: 16px;">
      </div>
      
      <div style="margin-bottom: 20px;">
        <label style="display: flex; align-items: center; cursor: pointer;">
          <input type="checkbox" id="include-manifest" checked
            style="width: 20px; height: 20px; margin-right: 12px;">
          <span>Include manifest.txt for MIFF scaffolding</span>
        </label>
      </div>
      
      <div style="margin-bottom: 20px;">
        <label style="display: flex; align-items: center; cursor: pointer;">
          <input type="checkbox" id="lpc-compatible" 
            style="width: 20px; height: 20px; margin-right: 12px;">
          <span>LPC-compatible layout</span>
        </label>
      </div>
      
      <div style="padding: 16px; background: rgba(102, 126, 234, 0.2); border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #667eea;">
        <strong>📦 Export will include:</strong>
        <ul style="margin: 8px 0 0 20px; padding: 0;">
          <li>Sprite images (PNG)</li>
          <li>Animation metadata (JSON)</li>
          <li>Frame tags and timing</li>
          <li>Manifest scaffold for /content/sprites/</li>
        </ul>
      </div>
      
      <div style="display: flex; gap: 12px;">
        <button id="export-cancel-btn" style="flex: 1; padding: 14px; border-radius: 8px; border: none; background: rgba(255,255,255,0.1); color: white; font-size: 16px; font-weight: bold; cursor: pointer;">
          Cancel
        </button>
        <button id="export-download-btn" style="flex: 1; padding: 14px; border-radius: 8px; border: none; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-size: 16px; font-weight: bold; cursor: pointer;">
          💾 Export
        </button>
      </div>
    `;
    
    dialog.appendChild(content);
    document.body.appendChild(dialog);
    
    document.getElementById('export-cancel-btn').addEventListener('click', function () {
      dialog.remove();
    });
    
    document.getElementById('export-download-btn').addEventListener('click', this.performExport.bind(this, dialog));
  };

  ns.MIFFExportService.prototype.performExport = function (dialog) {
    var format = document.getElementById('export-format').value;
    var assetName = document.getElementById('export-asset-name').value.trim() || 'sprite';
    var includeManifest = document.getElementById('include-manifest').checked;
    var lpcCompatible = document.getElementById('lpc-compatible').checked;
    
    var piskel = this.piskelController.getPiskel();
    var metadata = this.generateMetadata(piskel, assetName);
    
    switch (format) {
      case 'png-sequence':
        this.exportPNGSequence(piskel, assetName, metadata, includeManifest);
        break;
      case 'spritesheet':
        this.exportSpriteSheet(piskel, assetName, metadata, includeManifest);
        break;
      case 'json-only':
        this.exportJSONOnly(metadata, assetName);
        break;
      case 'miff-bundle':
        this.exportMIFFBundle(piskel, assetName, metadata, includeManifest, lpcCompatible);
        break;
    }
    
    dialog.remove();
  };

  ns.MIFFExportService.prototype.generateMetadata = function (piskel, assetName) {
    var descriptor = piskel.getDescriptor();
    var animationGroups = descriptor.animationGroups || [];
    
    var metadata = {
      name: assetName,
      version: '1.0.0',
      miff: {
        compatible: true,
        created: new Date().toISOString(),
        editor: 'Piskel Mobile Edition'
      },
      sprite: {
        width: piskel.getWidth(),
        height: piskel.getHeight(),
        frameCount: piskel.getFrameCount(),
        layerCount: piskel.getLayers().length,
        fps: piskel.getFPS()
      },
      animations: animationGroups.map(function (group) {
        return {
          name: group.name,
          category: group.category,
          tags: group.tags,
          frameStart: group.frameStart,
          frameEnd: group.frameEnd,
          frameCount: group.frameCount,
          fps: group.fps
        };
      }),
      tags: this.extractTags(animationGroups),
      exportDate: new Date().toISOString()
    };
    
    return metadata;
  };

  ns.MIFFExportService.prototype.extractTags = function (animationGroups) {
    var tagSet = {};
    
    animationGroups.forEach(function (group) {
      group.tags.forEach(function (tag) {
        var parts = tag.split('-');
        var category = parts[0];
        var value = parts.slice(1).join('-') || null;
        
        if (!tagSet[category]) {
          tagSet[category] = [];
        }
        if (value && tagSet[category].indexOf(value) === -1) {
          tagSet[category].push(value);
        }
      });
    });
    
    return tagSet;
  };

  ns.MIFFExportService.prototype.exportPNGSequence = function (piskel, assetName, metadata, includeManifest) {
    // For browser, we'll download as a ZIP file
    alert('PNG Sequence export: Frames will be downloaded individually. Use MIFF Bundle for ZIP export.');
    
    // Export each frame
    var layers = piskel.getLayers();
    var frameCount = piskel.getFrameCount();
    
    for (var i = 0; i < frameCount; i++) {
      var mergedFrame = pskl.utils.LayerUtils.mergeFrameAt(layers, i);
      var canvas = pskl.utils.FrameUtils.toImage(mergedFrame);
      
      this.downloadCanvas(canvas, assetName + '_frame_' + this.padNumber(i, 3) + '.png');
    }
    
    // Export metadata
    this.downloadJSON(metadata, assetName + '_metadata.json');
    
    if (includeManifest) {
      this.downloadManifest(metadata, assetName);
    }
  };

  ns.MIFFExportService.prototype.exportSpriteSheet = function (piskel, assetName, metadata, includeManifest) {
    var renderer = new pskl.rendering.PiskelRenderer(this.piskelController);
    var canvas = renderer.renderAsCanvas();
    
    this.downloadCanvas(canvas, assetName + '_spritesheet.png');
    this.downloadJSON(metadata, assetName + '_metadata.json');
    
    if (includeManifest) {
      this.downloadManifest(metadata, assetName);
    }
  };

  ns.MIFFExportService.prototype.exportJSONOnly = function (metadata, assetName) {
    this.downloadJSON(metadata, assetName + '_metadata.json');
  };

  ns.MIFFExportService.prototype.exportMIFFBundle = function (piskel, assetName, metadata, includeManifest, lpcCompatible) {
    alert('MIFF Bundle export: This would create a ZIP file with all assets. For now, files will be downloaded separately.');
    
    this.exportSpriteSheet(piskel, assetName, metadata, includeManifest);
  };

  ns.MIFFExportService.prototype.downloadCanvas = function (canvas, filename) {
    var link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  ns.MIFFExportService.prototype.downloadJSON = function (data, filename) {
    var json = JSON.stringify(data, null, 2);
    var blob = new Blob([json], {type: 'application/json'});
    var url = URL.createObjectURL(blob);
    
    var link = document.createElement('a');
    link.download = filename;
    link.href = url;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  ns.MIFFExportService.prototype.downloadManifest = function (metadata, assetName) {
    var manifest = this.generateManifestText(metadata);
    var blob = new Blob([manifest], {type: 'text/plain'});
    var url = URL.createObjectURL(blob);
    
    var link = document.createElement('a');
    link.download = assetName + '_manifest.txt';
    link.href = url;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  ns.MIFFExportService.prototype.generateManifestText = function (metadata) {
    var lines = [];
    
    lines.push('# MIFF Sprite Manifest');
    lines.push('# Generated by Piskel Mobile Edition');
    lines.push('# ' + metadata.miff.created);
    lines.push('');
    lines.push('## Asset Information');
    lines.push('Name: ' + metadata.name);
    lines.push('Size: ' + metadata.sprite.width + 'x' + metadata.sprite.height);
    lines.push('Frames: ' + metadata.sprite.frameCount);
    lines.push('FPS: ' + metadata.sprite.fps);
    lines.push('');
    lines.push('## Animations');
    
    metadata.animations.forEach(function (anim) {
      lines.push('');
      lines.push('### ' + anim.name);
      lines.push('Category: ' + anim.category);
      lines.push('Frames: ' + anim.frameStart + '-' + anim.frameEnd + ' (' + anim.frameCount + ' frames)');
      lines.push('FPS: ' + anim.fps);
      lines.push('Tags: ' + anim.tags.join(', '));
    });
    
    lines.push('');
    lines.push('## Content Folder Structure');
    lines.push('```');
    lines.push('/content/sprites/' + metadata.name + '/');
    lines.push('  ├── spritesheet.png');
    lines.push('  ├── metadata.json');
    lines.push('  └── manifest.txt');
    lines.push('```');
    lines.push('');
    lines.push('## Usage');
    lines.push('This sprite is ready for use in MIFF, Godot, GDevelop, or other game engines.');
    lines.push('Import the spritesheet and use the metadata JSON for animation configuration.');
    
    return lines.join('\n');
  };

  ns.MIFFExportService.prototype.padNumber = function (num, size) {
    var s = num + '';
    while (s.length < size) s = '0' + s;
    return s;
  };
})();
