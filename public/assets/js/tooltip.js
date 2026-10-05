const TooltipManager = (() => {
  let tooltipEl;
  let arrowEl;
  let currentTrigger = null;
  let showTimeout = null;
  let cleanupFloating = null;

  function init() {
    if (document.getElementById('u-tooltip')) return;

    tooltipEl = document.createElement('div');
    tooltipEl.id = 'u-tooltip';
    tooltipEl.className = 'u-tooltip';
    
    arrowEl = document.createElement('div');
    arrowEl.className = 'u-tooltip-arrow';
    tooltipEl.appendChild(arrowEl);
    
    document.body.appendChild(tooltipEl);

    // Event delegation on document
    document.addEventListener('mouseover', handleTriggerEnter);
    document.addEventListener('mouseout', handleTriggerLeave);
    document.addEventListener('focusin', handleTriggerEnter);
    document.addEventListener('focusout', handleTriggerLeave);
    document.addEventListener('keydown', handleKeydown);
  }

  function handleTriggerEnter(e) {
    const trigger = e.target.closest('[data-tooltip]');
    if (!trigger) return;
    
    // Only update if it's a new trigger, to avoid flickering
    if (currentTrigger !== trigger) {
      currentTrigger = trigger;
    }
    
    const content = trigger.getAttribute('data-tooltip');
    if (!content) return;

    // Set delay for hover to prevent flash
    clearTimeout(showTimeout);
    showTimeout = setTimeout(() => {
      showTooltip(trigger, content);
    }, 250);
  }

  function handleTriggerLeave(e) {
    // Determine if we actually left the trigger
    if (currentTrigger && !currentTrigger.contains(e.relatedTarget)) {
      clearTimeout(showTimeout);
      hideTooltip();
    }
  }

  function handleKeydown(e) {
    if (e.key === 'Escape' && tooltipEl.classList.contains('visible')) {
      hideTooltip();
    }
  }

  function showTooltip(trigger, text) {
    // Remove previous arrow to reset content safely
    tooltipEl.innerHTML = text;
    tooltipEl.appendChild(arrowEl);
    
    tooltipEl.classList.add('visible');

    const placement = trigger.getAttribute('data-tooltip-pos') || 'top';

    if (cleanupFloating) cleanupFloating();
    cleanupFloating = window.FloatingUIDOM.autoUpdate(
      trigger,
      tooltipEl,
      () => {
        window.FloatingUIDOM.computePosition(trigger, tooltipEl, {
          strategy: 'fixed',
          placement: placement,
          middleware: [
            window.FloatingUIDOM.offset(8),
            window.FloatingUIDOM.flip({ fallbackAxisSideDirection: 'start' }),
            window.FloatingUIDOM.shift({ padding: 8 }),
            window.FloatingUIDOM.arrow({ element: arrowEl, padding: 6 }),
          ],
        }).then(({ x, y, placement, middlewareData }) => {
          tooltipEl.dataset.placement = placement.split('-')[0];
          Object.assign(tooltipEl.style, {
            left: `${x}px`,
            top: `${y}px`,
          });

          // Handle Arrow
          if (middlewareData.arrow) {
            const { x: arrowX, y: arrowY } = middlewareData.arrow;
            const staticSide = {
              top: 'bottom',
              right: 'left',
              bottom: 'top',
              left: 'right',
            }[placement.split('-')[0]];

            Object.assign(arrowEl.style, {
              left: arrowX != null ? `${arrowX}px` : '',
              top: arrowY != null ? `${arrowY}px` : '',
              right: '',
              bottom: '',
              [staticSide]: '-4px',
            });
          }
        });
      }
    );
  }

  function hideTooltip() {
    tooltipEl.classList.remove('visible');
    currentTrigger = null;
    if (cleanupFloating) {
      cleanupFloating();
      cleanupFloating = null;
    }
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', TooltipManager.init);
