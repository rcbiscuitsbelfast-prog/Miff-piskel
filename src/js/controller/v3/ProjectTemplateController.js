/**
 * @provide pskl.controller.v3.ProjectTemplateController
 *
 * V3 - Project templates for quick starts
 */
(function () {
  var ns = $.namespace('pskl.controller.v3');

  ns.ProjectTemplateController = function (piskelController) {
    this.piskelController = piskelController;
    this.templates = this.getDefaultTemplates();
  };

  ns.ProjectTemplateController.prototype.init = function () {
    this.addTemplateButton();
  };

  ns.ProjectTemplateController.prototype.getDefaultTemplates = function () {
    return [
      {
        id: 'character-8x8',
        name: '8x8 Character',
        description: 'Tiny character sprite',
        width: 8,
        height: 8,
        fps: 8,
        frames: 4,
        icon: '👤',
        tags: ['character', 'tiny', 'retro']
      },
      {
        id: 'character-16x16',
        name: '16x16 Character',
        description: 'Classic character sprite',
        width: 16,
        height: 16,
        fps: 10,
        frames: 8,
        icon: '🧑',
        tags: ['character', 'classic']
      },
      {
        id: 'character-32x32',
        name: '32x32 Character',
        description: 'Detailed character sprite',
        width: 32,
        height: 32,
        fps: 12,
        frames: 12,
        icon: '👨',
        tags: ['character', 'detailed']
      },
      {
        id: 'item-16x16',
        name: '16x16 Item',
        description: 'Game item or icon',
        width: 16,
        height: 16,
        fps: 1,
        frames: 1,
        icon: '💎',
        tags: ['item', 'icon']
      },
      {
        id: 'tile-32x32',
        name: '32x32 Tile',
        description: 'Environment tile',
        width: 32,
        height: 32,
        fps: 1,
        frames: 1,
        icon: '🧱',
        tags: ['tile', 'environment']
      },
      {
        id: 'effect-64x64',
        name: '64x64 Effect',
        description: 'Visual effect animation',
        width: 64,
        height: 64,
        fps: 15,
        frames: 16,
        icon: '✨',
        tags: ['effect', 'animation']
      },
      {
        id: 'ui-icon-24x24',
        name: '24x24 UI Icon',
        description: 'User interface icon',
        width: 24,
        height: 24,
        fps: 1,
        frames: 1,
        icon: '🎨',
        tags: ['ui', 'icon']
      },
      {
        id: 'custom',
        name: 'Custom Size',
        description: 'Choose your own dimensions',
        icon: '⚙️',
        tags: ['custom']
      }
    ];
  };

  ns.ProjectTemplateController.prototype.addTemplateButton = function () {
    // Add to mode buttons
    var modeContainer = document.querySelector('.mode-button-container');
    if (!modeContainer) return;
    
    var templateBtn = document.createElement('button');
    templateBtn.className = 'mode-button template-mode v3-only';
    templateBtn.id = 'template-mode-btn';
    templateBtn.innerHTML = `
      <span class="icon">📑</span>
      <span>Templates</span>
    `;
    
    templateBtn.addEventListener('click', this.showTemplateDialog.bind(this));
    modeContainer.appendChild(templateBtn);
  };

  ns.ProjectTemplateController.prototype.showTemplateDialog = function () {
    var dialog = document.createElement('div');
    dialog.className = 'template-dialog v3-only';
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
      max-width: 800px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      color: white;
    `;
    
    content.innerHTML = `
      <h2 style="margin: 0 0 20px 0;">Project Templates</h2>
      <p style="color: rgba(255,255,255,0.7); margin: 0 0 24px 0;">
        Start with a template optimized for your project type
      </p>
      
      <div class="template-grid" style="
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 16px;
        margin-bottom: 24px;
      ">
        ${this.templates.map(function (template) {
          return `
            <button class="template-card" data-template-id="${template.id}" style="
              padding: 20px;
              background: rgba(255, 255, 255, 0.05);
              border: 2px solid rgba(255, 255, 255, 0.1);
              border-radius: 12px;
              cursor: pointer;
              transition: all 0.2s ease;
              text-align: center;
            ">
              <div style="font-size: 48px; margin-bottom: 12px;">${template.icon}</div>
              <div style="font-weight: bold; margin-bottom: 8px;">${template.name}</div>
              <div style="font-size: 12px; color: rgba(255,255,255,0.6); margin-bottom: 8px;">
                ${template.description}
              </div>
              ${template.width ? `
                <div style="font-size: 11px; color: rgba(255,255,255,0.5);">
                  ${template.width}x${template.height} • ${template.frames} frame${template.frames > 1 ? 's' : ''}
                </div>
              ` : ''}
            </button>
          `;
        }).join('')}
      </div>
      
      <div style="display: flex; gap: 12px;">
        <button id="template-cancel" style="
          flex: 1;
          padding: 14px;
          border-radius: 8px;
          border: none;
          background: rgba(255,255,255,0.1);
          color: white;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
        ">Cancel</button>
      </div>
    `;
    
    dialog.appendChild(content);
    document.body.appendChild(dialog);
    
    // Event listeners
    document.getElementById('template-cancel').addEventListener('click', function () {
      dialog.remove();
    });
    
    var templateCards = content.querySelectorAll('.template-card');
    templateCards.forEach(function (card) {
      card.addEventListener('click', function () {
        var templateId = card.dataset.templateId;
        this.applyTemplate(templateId);
        dialog.remove();
      }.bind(this));
      
      card.addEventListener('mouseenter', function () {
        card.style.background = 'rgba(102, 126, 234, 0.2)';
        card.style.borderColor = 'rgba(102, 126, 234, 0.5)';
      });
      
      card.addEventListener('mouseleave', function () {
        card.style.background = 'rgba(255, 255, 255, 0.05)';
        card.style.borderColor = 'rgba(255, 255, 255, 0.1)';
      });
    }.bind(this));
  };

  ns.ProjectTemplateController.prototype.applyTemplate = function (templateId) {
    var template = this.templates.find(function (t) { return t.id === templateId; });
    if (!template) return;
    
    if (template.id === 'custom') {
      this.showCustomSizeDialog();
      return;
    }
    
    if (!confirm('Create new project from template? Current work will be lost if not saved.')) {
      return;
    }
    
    this.createFromTemplate(template);
  };

  ns.ProjectTemplateController.prototype.createFromTemplate = function (template) {
    var descriptor = new pskl.model.piskel.Descriptor(template.name, '');
    var piskel = new pskl.model.Piskel(template.width, template.height, template.fps, descriptor);
    
    var layer = new pskl.model.Layer('Layer 1');
    
    for (var i = 0; i < template.frames; i++) {
      var frame = new pskl.model.Frame(template.width, template.height);
      layer.addFrame(frame);
    }
    
    piskel.addLayer(layer);
    
    this.piskelController.setPiskel(piskel);
    
    $.publish(Events.SHOW_NOTIFICATION, {
      content: 'Template applied: ' + template.name,
      duration: 2000
    });
  };

  ns.ProjectTemplateController.prototype.showCustomSizeDialog = function () {
    var dialog = document.createElement('div');
    dialog.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(30, 30, 40, 0.98);
      padding: 30px;
      border-radius: 16px;
      z-index: 20001;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6);
      color: white;
      min-width: 300px;
    `;
    
    dialog.innerHTML = `
      <h3 style="margin: 0 0 20px 0;">Custom Size</h3>
      <div style="margin-bottom: 16px;">
        <label style="display: block; margin-bottom: 8px;">Width:</label>
        <input type="number" id="custom-width" value="32" min="1" max="256" 
          style="width: 100%; padding: 12px; border-radius: 8px; border: 2px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.1); color: white; font-size: 16px;">
      </div>
      <div style="margin-bottom: 16px;">
        <label style="display: block; margin-bottom: 8px;">Height:</label>
        <input type="number" id="custom-height" value="32" min="1" max="256"
          style="width: 100%; padding: 12px; border-radius: 8px; border: 2px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.1); color: white; font-size: 16px;">
      </div>
      <div style="margin-bottom: 16px;">
        <label style="display: block; margin-bottom: 8px;">Frames:</label>
        <input type="number" id="custom-frames" value="1" min="1" max="100"
          style="width: 100%; padding: 12px; border-radius: 8px; border: 2px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.1); color: white; font-size: 16px;">
      </div>
      <div style="display: flex; gap: 12px;">
        <button id="custom-cancel" style="flex: 1; padding: 12px; border-radius: 8px; border: none; background: rgba(255,255,255,0.1); color: white; font-weight: bold; cursor: pointer;">Cancel</button>
        <button id="custom-create" style="flex: 1; padding: 12px; border-radius: 8px; border: none; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-weight: bold; cursor: pointer;">Create</button>
      </div>
    `;
    
    document.body.appendChild(dialog);
    
    document.getElementById('custom-cancel').addEventListener('click', function () {
      dialog.remove();
    });
    
    document.getElementById('custom-create').addEventListener('click', function () {
      var width = parseInt(document.getElementById('custom-width').value);
      var height = parseInt(document.getElementById('custom-height').value);
      var frames = parseInt(document.getElementById('custom-frames').value);
      
      this.createFromTemplate({
        name: 'Custom ' + width + 'x' + height,
        width: width,
        height: height,
        frames: frames,
        fps: 10
      });
      
      dialog.remove();
    }.bind(this));
  };
})();
