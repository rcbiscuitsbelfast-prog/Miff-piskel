/**
 * @provide pskl.controller.VersionSwitcherController
 */
(function () {
  var ns = $.namespace('pskl.controller');

  /**
   * Version Switcher Controller - Switch between V1 and V2 mobile interfaces
   */
  ns.VersionSwitcherController = function () {
    this.currentVersion = this.getStoredVersion() || 'v2'; // Default to V2
  };

  ns.VersionSwitcherController.prototype.init = function () {
    this.createVersionSwitcher();
    this.applyVersion(this.currentVersion);
  };

  ns.VersionSwitcherController.prototype.createVersionSwitcher = function () {
    var switcher = document.createElement('div');
    switcher.className = 'version-switcher';
    switcher.innerHTML = `
      <button class="version-toggle-btn" id="version-toggle-btn" title="Switch Version">
        <span class="version-icon">⚙️</span>
        <span class="version-label">V${this.currentVersion === 'v1' ? '1' : '2'}</span>
      </button>
      <div class="version-menu" id="version-menu">
        <div class="version-menu-header">
          <h3>Mobile Edition</h3>
          <button class="version-close-btn" id="version-close-btn">×</button>
        </div>
        <div class="version-options">
          <button class="version-option ${this.currentVersion === 'v1' ? 'active' : ''}" data-version="v1">
            <div class="version-option-header">
              <span class="version-badge">V1</span>
              <span class="version-name">Classic</span>
            </div>
            <p class="version-description">Original mobile interface with core features</p>
          </button>
          <button class="version-option ${this.currentVersion === 'v2' ? 'active' : ''}" data-version="v2">
            <div class="version-option-header">
              <span class="version-badge new">V2</span>
              <span class="version-name">Enhanced</span>
            </div>
            <p class="version-description">Improved UI, onboarding, quick actions, and more!</p>
            <div class="version-features">
              <span class="version-feature">✨ Tutorial</span>
              <span class="version-feature">⚡ Quick Actions</span>
              <span class="version-feature">🎬 Animation Preview</span>
              <span class="version-feature">🎨 Better Colors</span>
            </div>
          </button>
        </div>
        <div class="version-info">
          <small>Changes apply immediately and persist across sessions</small>
        </div>
      </div>
    `;
    
    document.body.appendChild(switcher);
    
    // Event listeners
    document.getElementById('version-toggle-btn').addEventListener('click', this.toggleMenu.bind(this));
    document.getElementById('version-close-btn').addEventListener('click', this.closeMenu.bind(this));
    
    var options = document.querySelectorAll('.version-option');
    options.forEach(function (option) {
      option.addEventListener('click', this.switchVersion.bind(this, option.dataset.version));
    }.bind(this));
  };

  ns.VersionSwitcherController.prototype.toggleMenu = function () {
    var menu = document.getElementById('version-menu');
    menu.classList.toggle('open');
  };

  ns.VersionSwitcherController.prototype.closeMenu = function () {
    var menu = document.getElementById('version-menu');
    menu.classList.remove('open');
  };

  ns.VersionSwitcherController.prototype.switchVersion = function (version) {
    if (version === this.currentVersion) return;
    
    this.currentVersion = version;
    this.storeVersion(version);
    this.applyVersion(version);
    this.closeMenu();
    
    // Update UI
    var label = document.querySelector('.version-label');
    if (label) {
      label.textContent = 'V' + (version === 'v1' ? '1' : '2');
    }
    
    // Update active state
    document.querySelectorAll('.version-option').forEach(function (option) {
      option.classList.toggle('active', option.dataset.version === version);
    });
    
    // Show notification
    this.showVersionNotification(version);
  };

  ns.VersionSwitcherController.prototype.applyVersion = function (version) {
    document.body.classList.remove('version-v1', 'version-v2');
    document.body.classList.add('version-' + version);
    
    // Publish event for other controllers to react
    $.publish(Events.VERSION_CHANGED, {version: version});
  };

  ns.VersionSwitcherController.prototype.getStoredVersion = function () {
    return localStorage.getItem('piskelMobileVersion');
  };

  ns.VersionSwitcherController.prototype.storeVersion = function (version) {
    localStorage.setItem('piskelMobileVersion', version);
  };

  ns.VersionSwitcherController.prototype.getCurrentVersion = function () {
    return this.currentVersion;
  };

  ns.VersionSwitcherController.prototype.showVersionNotification = function (version) {
    var notification = document.createElement('div');
    notification.className = 'version-notification';
    notification.innerHTML = `
      <span class="version-notification-icon">✨</span>
      <span class="version-notification-text">Switched to ${version === 'v1' ? 'V1 Classic' : 'V2 Enhanced'}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(function () {
      notification.classList.add('show');
    }, 10);
    
    setTimeout(function () {
      notification.classList.remove('show');
      setTimeout(function () {
        notification.remove();
      }, 300);
    }, 2000);
  };
})();
