/**
 * @provide pskl.controller.v2.QuickActionsController
 *
 * V2 - Quick actions floating menu for common tasks
 */
(function () {
  var ns = $.namespace('pskl.controller.v2');

  ns.QuickActionsController = function (piskelController) {
    this.piskelController = piskelController;
    this.isExpanded = false;
  };

  ns.QuickActionsController.prototype.init = function () {
    this.createQuickActionsMenu();
    this.setupEventListeners();
  };

  ns.QuickActionsController.prototype.createQuickActionsMenu = function () {
    var menu = document.createElement('div');
    menu.className = 'quick-actions v2-only';
    menu.id = 'quick-actions';
    menu.innerHTML = `
      <button class="quick-actions-btn" id="quick-actions-btn" title="Quick Actions">
        <span class="quick-actions-icon">⚡</span>
      </button>
      <div class="quick-actions-menu" id="quick-actions-menu">
        <button class="quick-action" data-action="undo" title="Undo">
          <span class="quick-action-icon">↶</span>
          <span class="quick-action-label">Undo</span>
          <span class="quick-action-hint">Swipe →</span>
        </button>
        <button class="quick-action" data-action="redo" title="Redo">
          <span class="quick-action-icon">↷</span>
          <span class="quick-action-label">Redo</span>
          <span class="quick-action-hint">Swipe ←</span>
        </button>
        <button class="quick-action" data-action="clear" title="Clear Canvas">
          <span class="quick-action-icon">🗑️</span>
          <span class="quick-action-label">Clear</span>
        </button>
        <button class="quick-action" data-action="grid" title="Toggle Grid">
          <span class="quick-action-icon">▦</span>
          <span class="quick-action-label">Grid</span>
        </button>
        <button class="quick-action" data-action="center" title="Center Canvas">
          <span class="quick-action-icon">⊙</span>
          <span class="quick-action-label">Center</span>
        </button>
        <button class="quick-action" data-action="flip-h" title="Flip Horizontal">
          <span class="quick-action-icon">⇄</span>
          <span class="quick-action-label">Flip H</span>
        </button>
        <button class="quick-action" data-action="flip-v" title="Flip Vertical">
          <span class="quick-action-icon">⇅</span>
          <span class="quick-action-label">Flip V</span>
        </button>
        <button class="quick-action" data-action="duplicate" title="Duplicate Frame">
          <span class="quick-action-icon">📋</span>
          <span class="quick-action-label">Duplicate</span>
        </button>
      </div>
    `;
    
    document.body.appendChild(menu);
  };

  ns.QuickActionsController.prototype.setupEventListeners = function () {
    var btn = document.getElementById('quick-actions-btn');
    var actions = document.querySelectorAll('.quick-action');
    
    btn.addEventListener('click', this.toggleMenu.bind(this));
    
    actions.forEach(function (action) {
      action.addEventListener('click', this.handleAction.bind(this, action.dataset.action));
    }.bind(this));
    
    // Close on outside click
    document.addEventListener('click', function (e) {
      if (this.isExpanded && !e.target.closest('#quick-actions')) {
        this.closeMenu();
      }
    }.bind(this));
  };

  ns.QuickActionsController.prototype.toggleMenu = function (e) {
    e.stopPropagation();
    if (this.isExpanded) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  };

  ns.QuickActionsController.prototype.openMenu = function () {
    this.isExpanded = true;
    document.getElementById('quick-actions-menu').classList.add('expanded');
    document.getElementById('quick-actions-btn').classList.add('active');
  };

  ns.QuickActionsController.prototype.closeMenu = function () {
    this.isExpanded = false;
    document.getElementById('quick-actions-menu').classList.remove('expanded');
    document.getElementById('quick-actions-btn').classList.remove('active');
  };

  ns.QuickActionsController.prototype.handleAction = function (action) {
    this.closeMenu();
    
    switch (action) {
      case 'undo':
        $.publish(Events.UNDO);
        break;
      case 'redo':
        $.publish(Events.REDO);
        break;
      case 'clear':
        if (confirm('Clear the entire canvas? This cannot be undone.')) {
          var currentFrame = this.piskelController.getCurrentFrame();
          if (currentFrame) {
            currentFrame.clear();
            $.publish(Events.PISKEL_RESET);
          }
        }
        break;
      case 'grid':
        $.publish(Events.TOGGLE_GRID);
        break;
      case 'center':
        $.publish(Events.FIT_TO_SCREEN);
        break;
      case 'flip-h':
        $.publish(Events.TRANSFORMATION_EVENT, {
          type: 'flip-horizontal'
        });
        break;
      case 'flip-v':
        $.publish(Events.TRANSFORMATION_EVENT, {
          type: 'flip-vertical'
        });
        break;
      case 'duplicate':
        $.publish(Events.DUPLICATE_FRAME);
        break;
    }
    
    this.showActionFeedback(action);
  };

  ns.QuickActionsController.prototype.showActionFeedback = function (action) {
    var labels = {
      'undo': 'Undone',
      'redo': 'Redone',
      'clear': 'Canvas Cleared',
      'grid': 'Grid Toggled',
      'center': 'Canvas Centered',
      'flip-h': 'Flipped Horizontally',
      'flip-v': 'Flipped Vertically',
      'duplicate': 'Frame Duplicated'
    };
    
    $.publish(Events.SHOW_NOTIFICATION, {
      content: labels[action] || 'Action Complete',
      duration: 1500
    });
  };
})();
