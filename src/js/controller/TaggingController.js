/**
 * @provide pskl.controller.TaggingController
 *
 * @require pskl.utils.CanvasUtils
 */
(function () {
  var ns = $.namespace('pskl.controller');

  /**
   * Tagging Controller - Manages metadata tagging for animations
   */
  ns.TaggingController = function (piskelController) {
    this.piskelController = piskelController;
    this.frameTags = {};
    this.animationGroups = [];
  };

  ns.TaggingController.prototype.init = function () {
    $.subscribe(Events.OPEN_TAGGING_DIALOG, this.openDialog.bind(this));
  };

  ns.TaggingController.prototype.openDialog = function (evt) {
    this.currentFrames = evt.frames;
    this.selectedFrames = evt.selectedFrames || [];
    
    this.createDialog();
  };

  ns.TaggingController.prototype.createDialog = function () {
    var dialog = document.createElement('div');
    dialog.className = 'tagging-dialog';
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
      <h2 style="margin: 0 0 20px 0;">Tag Animation</h2>
      
      <div style="margin-bottom: 20px;">
        <label style="display: block; margin-bottom: 8px; font-weight: bold;">Animation Name</label>
        <input type="text" id="animation-name" placeholder="e.g., idle, walk, attack" 
          style="width: 100%; padding: 12px; border-radius: 8px; border: 2px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.1); color: white; font-size: 16px;">
      </div>
      
      <div style="margin-bottom: 20px;">
        <label style="display: block; margin-bottom: 8px; font-weight: bold;">Tags (comma-separated)</label>
        <input type="text" id="animation-tags" placeholder="e.g., npc, character, element-fire" 
          style="width: 100%; padding: 12px; border-radius: 8px; border: 2px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.1); color: white; font-size: 16px;">
        <small style="display: block; margin-top: 8px; color: rgba(255,255,255,0.6);">
          Suggested: zone, npc, animation, element, variant
        </small>
      </div>
      
      <div style="margin-bottom: 20px;">
        <label style="display: block; margin-bottom: 8px; font-weight: bold;">Frame Range</label>
        <div style="display: flex; gap: 12px;">
          <input type="number" id="frame-start" placeholder="Start" value="0" min="0" 
            style="flex: 1; padding: 12px; border-radius: 8px; border: 2px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.1); color: white; font-size: 16px;">
          <span style="align-self: center;">to</span>
          <input type="number" id="frame-end" placeholder="End" value="${this.currentFrames.length - 1}" min="0" 
            style="flex: 1; padding: 12px; border-radius: 8px; border: 2px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.1); color: white; font-size: 16px;">
        </div>
      </div>
      
      <div style="margin-bottom: 20px;">
        <label style="display: block; margin-bottom: 8px; font-weight: bold;">Category</label>
        <select id="animation-category" 
          style="width: 100%; padding: 12px; border-radius: 8px; border: 2px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.1); color: white; font-size: 16px;">
          <option value="character">Character</option>
          <option value="npc">NPC</option>
          <option value="item">Item</option>
          <option value="effect">Effect</option>
          <option value="environment">Environment</option>
          <option value="ui">UI</option>
        </select>
      </div>
      
      <div style="margin-bottom: 20px;">
        <label style="display: block; margin-bottom: 8px; font-weight: bold;">Frame Rate (FPS)</label>
        <input type="number" id="animation-fps" placeholder="e.g., 10" value="10" min="1" max="60" 
          style="width: 100%; padding: 12px; border-radius: 8px; border: 2px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.1); color: white; font-size: 16px;">
      </div>
      
      <div style="padding: 16px; background: rgba(255,255,255,0.05); border-radius: 8px; margin-bottom: 20px;">
        <h4 style="margin: 0 0 12px 0; font-size: 14px;">Current Animation Groups:</h4>
        <div id="animation-groups-list" style="font-size: 14px; color: rgba(255,255,255,0.7);">
          ${this.animationGroups.length === 0 ? 'No groups yet' : ''}
        </div>
      </div>
      
      <div style="display: flex; gap: 12px;">
        <button id="tag-cancel-btn" style="flex: 1; padding: 14px; border-radius: 8px; border: none; background: rgba(255,255,255,0.1); color: white; font-size: 16px; font-weight: bold; cursor: pointer;">
          Cancel
        </button>
        <button id="tag-save-btn" style="flex: 1; padding: 14px; border-radius: 8px; border: none; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-size: 16px; font-weight: bold; cursor: pointer;">
          Save Tag
        </button>
      </div>
    `;
    
    dialog.appendChild(content);
    document.body.appendChild(dialog);
    
    this.renderAnimationGroups();
    
    document.getElementById('tag-cancel-btn').addEventListener('click', function () {
      dialog.remove();
    });
    
    document.getElementById('tag-save-btn').addEventListener('click', this.saveTag.bind(this, dialog));
  };

  ns.TaggingController.prototype.saveTag = function (dialog) {
    var name = document.getElementById('animation-name').value.trim();
    var tags = document.getElementById('animation-tags').value.split(',').map(function (t) { return t.trim(); });
    var frameStart = parseInt(document.getElementById('frame-start').value);
    var frameEnd = parseInt(document.getElementById('frame-end').value);
    var category = document.getElementById('animation-category').value;
    var fps = parseInt(document.getElementById('animation-fps').value);
    
    if (!name) {
      alert('Please enter an animation name');
      return;
    }
    
    var group = {
      name: name,
      tags: tags,
      frameStart: frameStart,
      frameEnd: frameEnd,
      category: category,
      fps: fps,
      frameCount: frameEnd - frameStart + 1
    };
    
    this.animationGroups.push(group);
    
    // Store in piskel metadata
    this.saveToMetadata();
    
    alert(`Animation "${name}" tagged successfully!`);
    dialog.remove();
  };

  ns.TaggingController.prototype.renderAnimationGroups = function () {
    var list = document.getElementById('animation-groups-list');
    if (!list) return;
    
    if (this.animationGroups.length === 0) {
      list.innerHTML = 'No groups yet';
      return;
    }
    
    list.innerHTML = '';
    this.animationGroups.forEach(function (group) {
      var item = document.createElement('div');
      item.style.cssText = 'padding: 8px; margin: 4px 0; background: rgba(255,255,255,0.1); border-radius: 4px;';
      item.innerHTML = `
        <strong>${group.name}</strong> [${group.category}]<br>
        <small>Frames ${group.frameStart}-${group.frameEnd} (${group.frameCount} frames @ ${group.fps}fps)</small><br>
        <small style="color: rgba(255,255,255,0.5);">Tags: ${group.tags.join(', ')}</small>
      `;
      list.appendChild(item);
    });
  };

  ns.TaggingController.prototype.saveToMetadata = function () {
    // Store in piskel descriptor
    if (this.piskelController) {
      var piskel = this.piskelController.getPiskel();
      if (piskel && piskel.getDescriptor()) {
        var descriptor = piskel.getDescriptor();
        descriptor.animationGroups = this.animationGroups;
      }
    }
  };

  ns.TaggingController.prototype.getAnimationGroups = function () {
    return this.animationGroups;
  };

  ns.TaggingController.prototype.clearTags = function () {
    this.animationGroups = [];
    this.frameTags = {};
  };
})();
