/**
 * Component-specific style overrides
 * This script injects style overrides for specific components that need
 * custom CSS to match the black/neon green theme
 */

document.addEventListener('DOMContentLoaded', () => {
  // Function to fix any white backgrounds to match theme
  const fixWhiteBackgrounds = () => {
    // Get all elements in the document
    const allElements = document.querySelectorAll('*');
    
    // Loop through all elements
    allElements.forEach(el => {
      const computedStyle = window.getComputedStyle(el);
      const bgColor = computedStyle.backgroundColor;
      
      // Check if background is white or close to white
      if (bgColor === 'rgb(255, 255, 255)' || 
          bgColor === 'rgba(255, 255, 255, 1)' || 
          bgColor === 'white' || 
          bgColor.includes('255, 255, 255')) {
        
        // Convert to black background
        el.style.backgroundColor = '#000000';
        
        // If text color is black or dark, change it to white for contrast
        const textColor = computedStyle.color;
        if (textColor === 'rgb(0, 0, 0)' || 
            textColor === 'rgba(0, 0, 0, 1)' || 
            textColor === 'black' || 
            textColor.includes('0, 0, 0')) {
          el.style.color = '#FFFFFF';
        }
      }
      
      // Also check for style attribute with white background
      if (el.hasAttribute('style')) {
        const styleAttr = el.getAttribute('style');
        if (styleAttr.includes('background-color: white') || 
            styleAttr.includes('background-color: #fff') || 
            styleAttr.includes('background-color: #ffffff') || 
            styleAttr.includes('background: white') || 
            styleAttr.includes('background: #fff') || 
            styleAttr.includes('background: #ffffff')) {
          
          el.style.backgroundColor = '#000000';
          el.style.color = '#FFFFFF';
        }
      }
    });
  };
  
  // Function to ensure text contrast against backgrounds
  const fixTextContrast = () => {
    // Find elements with potential contrast issues
    document.querySelectorAll('*').forEach(el => {
      // Skip elements without text content
      if (!el.textContent || el.textContent.trim() === '') return;
      
      // Skip certain elements
      if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE' || el.tagName === 'META' || el.tagName === 'LINK') return;
      
      // Get computed background color
      const bgColor = window.getComputedStyle(el).backgroundColor;
      
      // If background is black or very dark and text might be dark too
      if (bgColor === 'rgb(0, 0, 0)' || bgColor === 'rgba(0, 0, 0, 1)' || 
          bgColor === 'rgb(17, 17, 17)' || bgColor === 'rgba(17, 17, 17, 1)') {
          
        // Set text to white for visibility
        if (!el.classList.contains('MuiButton-containedPrimary') && 
            !el.classList.contains('primary-button')) {
          el.style.color = '#FFFFFF';
        }
      }
    });
  };
  
  // Function to apply styles
  const applyStyles = () => {
    // Fix any white backgrounds first
    fixWhiteBackgrounds();
    
    // Apply contrast fixing
    fixTextContrast();
    // Pricing page styles
    const pricingCards = document.querySelectorAll('.pricing-card, .price-card, .tier-card');
    pricingCards.forEach(card => {
      card.style.backgroundColor = '#000000';
      card.style.border = '1px solid #333333';
      
      // Highlight recommended card
      if (card.querySelector('.recommended, .popular') || card.classList.contains('highlight-card')) {
        card.style.border = '2px solid #CCFF00';
      }
      
      // Pricing cards checkmarks
      const checkmarks = card.querySelectorAll('.checkmark, .feature-available, svg.tick-icon');
      checkmarks.forEach(check => {
        check.style.color = '#CCFF00';
      });
    });
    
    // Documentation page styles
    const docHeaders = document.querySelectorAll('.documentation-header, .doc-header, .documentation-section header');
    docHeaders.forEach(header => {
      header.style.backgroundColor = '#000000';
      header.style.color = '#FFFFFF';
    });
    
    const docCards = document.querySelectorAll('.doc-card, .guide-card');
    docCards.forEach(card => {
      card.style.backgroundColor = '#111111';
      card.style.border = '1px solid #333333';
      
      // Find and style icons
      const icons = card.querySelectorAll('svg, .card-icon');
      icons.forEach(icon => {
        icon.style.color = '#CCFF00';
      });
    });
    
    // Changelog page styles
    const changelogItems = document.querySelectorAll('.changelog-item, .release-item');
    changelogItems.forEach(item => {
      // Style feature, bugfix, improvement, etc icons
      const typeIcons = item.querySelectorAll('.type-icon, .change-type-icon');
      typeIcons.forEach(icon => {
        icon.style.color = '#CCFF00';
      });
    });
    
    // Settings page styles
    const settingsSections = document.querySelectorAll('.settings-section, .settings-card');
    settingsSections.forEach(section => {
      section.style.backgroundColor = '#000000';
      section.style.border = '1px solid #333333';
    });
    
    // Toggle switches
    const toggleSwitches = document.querySelectorAll('.MuiSwitch-root, .toggle-switch');
    toggleSwitches.forEach(toggle => {
      const track = toggle.querySelector('.MuiSwitch-track');
      const thumb = toggle.querySelector('.MuiSwitch-thumb');
      
      if (track) track.style.backgroundColor = '#333333';
      if (thumb) {
        thumb.style.backgroundColor = '#FFFFFF';
      }
      
      // Find checked toggles
      if (toggle.classList.contains('Mui-checked') || toggle.querySelector('input:checked')) {
        if (track) track.style.backgroundColor = '#CCFF00';
      }
    });
    
    // Create Network wizard styles
    const wizardSteps = document.querySelectorAll('.step-indicator, .wizard-step');
    wizardSteps.forEach(step => {
      // Apply gray for inactive steps
      step.style.backgroundColor = '#333333';
      step.style.color = '#FFFFFF';
      
      // Apply green for active steps
      if (step.classList.contains('active') || step.querySelector('.active')) {
        step.style.backgroundColor = '#CCFF00';
        step.style.color = '#000000';
      }
    });
    
    // Feature cards on homepage
    const featureCards = document.querySelectorAll('.feature-card, .info-card');
    featureCards.forEach(card => {
      card.style.backgroundColor = '#111111';
      card.style.border = '1px solid #333333';
      
      // Style icons
      const icons = card.querySelectorAll('.feature-icon, svg');
      icons.forEach(icon => {
        icon.style.color = '#CCFF00';
      });
    });
    
    // Button styling
    const buttons = document.querySelectorAll('button, .MuiButton-root, .btn');
    buttons.forEach(button => {
      // Primary buttons
      if (button.classList.contains('MuiButton-containedPrimary') || 
          button.classList.contains('primary-button') || 
          button.classList.contains('btn-primary')) {
        button.style.backgroundColor = '#CCFF00';
        button.style.color = '#000000';
      }
      
      // Secondary/outlined buttons
      if (button.classList.contains('MuiButton-outlined') || 
          button.classList.contains('secondary-button') || 
          button.classList.contains('btn-outline')) {
        button.style.border = '1px solid #CCFF00';
        button.style.color = '#CCFF00';
        button.style.backgroundColor = 'transparent';
      }
    });
  };
  
  // Apply styles immediately
  applyStyles();
  
  // Also apply after a short delay to catch dynamically loaded content
  setTimeout(applyStyles, 1000);
  setTimeout(applyStyles, 3000);
  
  // Create an observer to watch for DOM changes
  const observer = new MutationObserver(mutations => {
    applyStyles();
  });
  
  // Start observing
  observer.observe(document.body, { childList: true, subtree: true });
});
