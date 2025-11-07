/**
 * @provide pskl.controller.v2.OnboardingController
 *
 * V2 - Interactive onboarding and tutorial system
 */
(function () {
  var ns = $.namespace('pskl.controller.v2');

  ns.OnboardingController = function () {
    this.currentStep = 0;
    this.hasCompletedOnboarding = this.checkOnboardingStatus();
  };

  ns.OnboardingController.prototype.init = function () {
    if (!this.hasCompletedOnboarding) {
      this.startOnboarding();
    }
    
    // Add help button for re-accessing tutorial
    this.createHelpButton();
  };

  ns.OnboardingController.prototype.checkOnboardingStatus = function () {
    return localStorage.getItem('piskelV2OnboardingComplete') === 'true';
  };

  ns.OnboardingController.prototype.startOnboarding = function () {
    this.steps = [
      {
        title: 'Welcome to Piskel V2! 👋',
        message: 'Let\'s take a quick tour of the enhanced mobile interface.',
        target: null,
        highlight: null,
        action: null
      },
      {
        title: 'Mode Switcher',
        message: 'Tap here to switch between Draw and Import modes. Start drawing or import existing sprites!',
        target: '.mode-button-container',
        highlight: '.mode-button-container',
        action: null
      },
      {
        title: 'Drawing Tools',
        message: 'Tap the drawer handle to access all your drawing tools. Each tool has an icon and name for clarity.',
        target: '.tool-drawer-handle',
        highlight: '.tool-drawer',
        action: function() {
          var drawer = document.querySelector('.tool-drawer');
          if (drawer && !drawer.classList.contains('expanded')) {
            drawer.classList.add('expanded');
          }
        }
      },
      {
        title: 'Touch Gestures',
        message: 'Use intuitive gestures:\n• Swipe right for undo\n• Swipe left for redo\n• Pinch to zoom\n• Long press to pick colors',
        target: '#drawing-canvas-container',
        highlight: null,
        action: null
      },
      {
        title: 'Quick Actions (NEW!)',
        message: 'Access the quick actions menu for common tasks like undo, redo, zoom, and more.',
        target: '.quick-actions-btn',
        highlight: '.quick-actions-btn',
        action: null
      },
      {
        title: 'Export Your Work',
        message: 'When ready, tap Export to save your sprite with metadata for game engines.',
        target: '#miff-export-btn',
        highlight: '#miff-export-btn',
        action: null
      },
      {
        title: 'All Set! 🎉',
        message: 'You\'re ready to create amazing sprites! Tap the ? button anytime to replay this tutorial.',
        target: null,
        highlight: null,
        action: null
      }
    ];
    
    this.showOnboardingOverlay();
    this.showStep(0);
  };

  ns.OnboardingController.prototype.showOnboardingOverlay = function () {
    var overlay = document.createElement('div');
    overlay.className = 'onboarding-overlay v2-only';
    overlay.id = 'onboarding-overlay';
    overlay.innerHTML = `
      <div class="onboarding-spotlight" id="onboarding-spotlight"></div>
      <div class="onboarding-tooltip" id="onboarding-tooltip">
        <div class="onboarding-tooltip-header">
          <h3 class="onboarding-title" id="onboarding-title"></h3>
          <button class="onboarding-skip" id="onboarding-skip">Skip</button>
        </div>
        <p class="onboarding-message" id="onboarding-message"></p>
        <div class="onboarding-progress">
          <div class="onboarding-progress-bar" id="onboarding-progress-bar"></div>
        </div>
        <div class="onboarding-actions">
          <button class="onboarding-btn secondary" id="onboarding-prev" style="display: none;">Back</button>
          <button class="onboarding-btn primary" id="onboarding-next">Next</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Event listeners
    document.getElementById('onboarding-skip').addEventListener('click', this.skipOnboarding.bind(this));
    document.getElementById('onboarding-next').addEventListener('click', this.nextStep.bind(this));
    document.getElementById('onboarding-prev').addEventListener('click', this.prevStep.bind(this));
  };

  ns.OnboardingController.prototype.showStep = function (stepIndex) {
    this.currentStep = stepIndex;
    var step = this.steps[stepIndex];
    
    if (!step) {
      this.completeOnboarding();
      return;
    }
    
    // Update content
    document.getElementById('onboarding-title').textContent = step.title;
    document.getElementById('onboarding-message').textContent = step.message;
    
    // Update progress
    var progress = ((stepIndex + 1) / this.steps.length) * 100;
    document.getElementById('onboarding-progress-bar').style.width = progress + '%';
    
    // Show/hide navigation buttons
    document.getElementById('onboarding-prev').style.display = stepIndex > 0 ? 'block' : 'none';
    document.getElementById('onboarding-next').textContent = stepIndex === this.steps.length - 1 ? 'Get Started!' : 'Next';
    
    // Execute action if any
    if (step.action) {
      step.action();
    }
    
    // Position tooltip and spotlight
    this.positionOnboarding(step);
  };

  ns.OnboardingController.prototype.positionOnboarding = function (step) {
    var tooltip = document.getElementById('onboarding-tooltip');
    var spotlight = document.getElementById('onboarding-spotlight');
    
    if (step.highlight) {
      var target = document.querySelector(step.highlight);
      if (target) {
        var rect = target.getBoundingClientRect();
        spotlight.style.display = 'block';
        spotlight.style.top = (rect.top - 10) + 'px';
        spotlight.style.left = (rect.left - 10) + 'px';
        spotlight.style.width = (rect.width + 20) + 'px';
        spotlight.style.height = (rect.height + 20) + 'px';
        
        // Position tooltip near target
        tooltip.style.top = (rect.bottom + 20) + 'px';
        tooltip.style.left = '50%';
        tooltip.style.transform = 'translateX(-50%)';
      }
    } else {
      spotlight.style.display = 'none';
      tooltip.style.top = '50%';
      tooltip.style.left = '50%';
      tooltip.style.transform = 'translate(-50%, -50%)';
    }
  };

  ns.OnboardingController.prototype.nextStep = function () {
    if (this.currentStep < this.steps.length - 1) {
      this.showStep(this.currentStep + 1);
    } else {
      this.completeOnboarding();
    }
  };

  ns.OnboardingController.prototype.prevStep = function () {
    if (this.currentStep > 0) {
      this.showStep(this.currentStep - 1);
    }
  };

  ns.OnboardingController.prototype.skipOnboarding = function () {
    if (confirm('Skip the tutorial? You can access it anytime from the help button.')) {
      this.completeOnboarding();
    }
  };

  ns.OnboardingController.prototype.completeOnboarding = function () {
    localStorage.setItem('piskelV2OnboardingComplete', 'true');
    this.hasCompletedOnboarding = true;
    
    var overlay = document.getElementById('onboarding-overlay');
    if (overlay) {
      overlay.classList.add('fade-out');
      setTimeout(function () {
        overlay.remove();
      }, 300);
    }
  };

  ns.OnboardingController.prototype.createHelpButton = function () {
    var helpBtn = document.createElement('button');
    helpBtn.className = 'help-button v2-only';
    helpBtn.innerHTML = '?';
    helpBtn.title = 'Tutorial';
    helpBtn.addEventListener('click', function () {
      this.hasCompletedOnboarding = false;
      this.startOnboarding();
    }.bind(this));
    
    document.body.appendChild(helpBtn);
  };
})();
