import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import './InteractiveOnboarding.css';
import CloseIcon from '@mui/icons-material/Close';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

export interface OnboardingStep {
  title: string;
  content: string;
  targetElement?: string; // CSS selector for element to highlight
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: () => void; // Automated action to perform
  allowInteraction?: boolean; // Allow user to interact with highlighted element
  waitForAction?: boolean; // Wait for user to perform an action before next
  highlightPulse?: boolean; // Add pulsing effect to highlight
  arrow?: boolean; // Show arrow pointing to element
  nextLabel?: string; // Custom label for next button
  requireClick?: boolean; // Require clicking the highlighted element
  requireMultipleClicks?: string[]; // Array of selectors that must all be clicked
  clickMessage?: string; // Message to show when click is required
  requireOutput?: 'Graph' | 'CodeGPT' | 'LLVMIR' | 'Terminal Output' | 'Terminal';
  desiredOutput?: 'Graph' | 'CodeGPT' | 'LLVMIR' | 'Terminal Output' | 'Terminal';
  forcePreferredSide?: boolean; // Stick to the requested position even if space is tight
  subSteps?: Array<{
    content: string;
    targetElement?: string;
    requireClick?: boolean;
    allowInteraction?: boolean;
    clickMessage?: string;
    requireOutput?: 'Graph' | 'CodeGPT' | 'LLVMIR' | 'Terminal Output' | 'Terminal';
    desiredOutput?: 'Graph' | 'CodeGPT' | 'LLVMIR' | 'Terminal Output' | 'Terminal';
    forcePreferredSide?: boolean;
  }>; // Multiple parts within a step
}

type OutputType = 'Graph' | 'CodeGPT' | 'LLVMIR' | 'Terminal Output' | 'Terminal';

interface CompileOption {
  value: string;
  label: string;
}

interface InteractiveOnboardingProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  steps: OnboardingStep[];
  currentOutput: OutputType;
  setCurrentOutput: (output: OutputType) => void;
  setCode?: (code: string) => void;
  submitCode?: () => void;
  selectedCompileOptions?: CompileOption[];
  setSelectedCompileOptions?: (options: CompileOption[]) => void;
  selectedExecutableOptions?: CompileOption[];
  setSelectedExecutableOptions?: (options: CompileOption[]) => void;
}

const InteractiveOnboarding: React.FC<InteractiveOnboardingProps> = ({
  isOpen,
  onClose,
  onComplete,
  steps,
  currentOutput,
  setCurrentOutput,
  setCode: _setCode,
  submitCode: _submitCode,
  selectedCompileOptions: _selectedCompileOptions,
  setSelectedCompileOptions: _setSelectedCompileOptions,
  selectedExecutableOptions: _selectedExecutableOptions,
  setSelectedExecutableOptions: _setSelectedExecutableOptions,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentSubStep, setCurrentSubStep] = useState(0);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [tooltipSide, setTooltipSide] = useState<'top' | 'bottom' | 'left' | 'right'>('right');
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);
  const [clickedElements, setClickedElements] = useState<Set<string>>(new Set());
  const [actionCompleted, setActionCompleted] = useState(false);
  const [_isRunning, setIsRunning] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const navDirectionRef = useRef<'next' | 'prev' | null>(null);
  const highlightLayerRef = useRef<HTMLElement | null>(null);

  const currentStepData = steps[currentStep];
  const currentStepContent =
    currentStepData.subSteps && currentStepData.subSteps.length > 0
      ? currentStepData.subSteps[currentSubStep]
      : null;

  const hasSubSteps = !!(currentStepData.subSteps && currentStepData.subSteps.length > 0);

  // Get effective target element (substep takes priority)
  const effectiveTargetElement = currentStepContent?.targetElement || currentStepData.targetElement;
  const effectiveContent = currentStepContent?.content || currentStepData.content;
  const effectiveRequireClick = currentStepContent?.requireClick ?? currentStepData.requireClick;
  const effectiveAllowInteraction =
    currentStepContent?.allowInteraction ?? currentStepData.allowInteraction;
  const effectiveClickMessage = currentStepContent?.clickMessage || currentStepData.clickMessage;
  // Only fall back to step-level requireOutput when there are no substeps or on substep 0
  const effectiveRequireOutput =
    currentStepContent?.requireOutput ??
    (!hasSubSteps || currentSubStep === 0 ? currentStepData.requireOutput : undefined);
  const forcePreferredSide =
    currentStepContent?.forcePreferredSide ?? currentStepData.forcePreferredSide;

  // Calculate tooltip position based on highlighted element
  const calculatePosition = useCallback(() => {
    if (!effectiveTargetElement) {
      // Center position for steps without target
      setTooltipPosition({
        top: window.innerHeight / 2,
        left: window.innerWidth / 2,
      });
      setTooltipSide('right');
      setHighlightRect(null);
      return;
    }

    const nodes = Array.from(document.querySelectorAll(effectiveTargetElement));
    if (!nodes.length) {
      console.warn(`Element not found: ${effectiveTargetElement}`);
      return;
    }

    // Union bounding rect of all matched nodes
    let rect = nodes[0].getBoundingClientRect();
    for (let i = 1; i < nodes.length; i++) {
      const r = nodes[i].getBoundingClientRect();
      const top = Math.min(rect.top, r.top);
      const left = Math.min(rect.left, r.left);
      const right = Math.max(rect.right, r.right);
      const bottom = Math.max(rect.bottom, r.bottom);
      rect = new DOMRect(left, top, right - left, bottom - top);
    }

    // If a react-select dropdown menu is open (portal element), include it in the highlight
    const openMenu = document.querySelector('.react-select__menu') as HTMLElement | null;
    if (openMenu) {
      const menuRect = openMenu.getBoundingClientRect();
      const top = Math.min(rect.top, menuRect.top);
      const left = Math.min(rect.left, menuRect.left);
      const right = Math.max(rect.right, menuRect.right);
      const bottom = Math.max(rect.bottom, menuRect.bottom);
      rect = new DOMRect(left, top, right - left, bottom - top);
    }

    // Add extra visual padding ONLY for the compiler options section
    const shouldPadHighlight =
      effectiveTargetElement === '#submit-codeBar-compile-options-container';
    if (shouldPadHighlight) {
      const highlightPadding = 16; // px
      const paddedLeft = Math.max(0, rect.left - highlightPadding);
      const paddedTop = Math.max(0, rect.top - highlightPadding);
      const paddedRight = Math.min(window.innerWidth, rect.right + highlightPadding);
      const paddedBottom = Math.min(window.innerHeight, rect.bottom + highlightPadding);
      rect = new DOMRect(
        paddedLeft,
        paddedTop,
        Math.max(0, paddedRight - paddedLeft),
        Math.max(0, paddedBottom - paddedTop)
      );
    }

    // Clamp highlight to viewport so it never renders outside and gets clipped
    const clampedLeft = Math.max(0, rect.left);
    const clampedTop = Math.max(0, rect.top);
    const clampedRight = Math.min(window.innerWidth, rect.right);
    const clampedBottom = Math.min(window.innerHeight, rect.bottom);
    const visibleRect = new DOMRect(
      clampedLeft,
      clampedTop,
      Math.max(0, clampedRight - clampedLeft),
      Math.max(0, clampedBottom - clampedTop)
    );
    setHighlightRect(visibleRect);
    rect = visibleRect; // use visible portion for positioning too

    // Calculate best position for tooltip (measure actual size when possible)
    const tooltipEl = tooltipRef.current;
    const tooltipWidth = Math.min(tooltipEl?.offsetWidth || 560, window.innerWidth - 24);
    const tooltipHeight = Math.min(tooltipEl?.offsetHeight || 360, window.innerHeight - 24);
    const padding = 12; // viewport padding (matches CSS 24px total)
    const arrowSize = 20;
    const safeGap = 16; // gap used for collision spacing

    let top = 0;
    let left = 0;
    let side: 'top' | 'bottom' | 'left' | 'right' = 'right';

    // Available spaces around target
    const spaceRight = window.innerWidth - rect.right;
    const spaceLeft = rect.left;
    const spaceBottom = window.innerHeight - rect.bottom;
    const spaceTop = rect.top;

    // Try positioning based on preferred position or auto-detect
    const preferredPosition = currentStepData.position || 'auto';

    if (preferredPosition === 'center' || !preferredPosition) {
      // Center the tooltip
      top = Math.max(100, window.innerHeight / 2);
      left = Math.max(100, window.innerWidth / 2);
      side = 'right';
    } else if (
      forcePreferredSide &&
      (preferredPosition === 'right' ||
        preferredPosition === 'left' ||
        preferredPosition === 'top' ||
        preferredPosition === 'bottom')
    ) {
      // Force stick to preferred side
      side = preferredPosition;
      if (side === 'right') {
        left = rect.right + arrowSize + padding;
        top = rect.top + rect.height / 2;
      } else if (side === 'left') {
        left = rect.left - tooltipWidth - arrowSize - padding;
        top = rect.top + rect.height / 2;
      } else if (side === 'bottom') {
        top = rect.bottom + arrowSize + padding;
        left = rect.left + rect.width / 2;
      } else {
        top = rect.top - tooltipHeight - arrowSize - padding;
        left = rect.left + rect.width / 2;
      }
      // If forced side is bottom/top but there's no space, flip vertically to keep textbox visible
      if (side === 'bottom' && spaceBottom < tooltipHeight + safeGap) {
        side = 'top';
        top = Math.max(padding, rect.top - tooltipHeight - safeGap);
        left = rect.left + rect.width / 2;
      } else if (side === 'top' && spaceTop < tooltipHeight + safeGap) {
        side = 'bottom';
        top = Math.min(window.innerHeight - padding - tooltipHeight, rect.bottom + safeGap);
        left = rect.left + rect.width / 2;
      }
    } else {
      // Auto-detect best position with fallback when preferred side doesn't fit

      // Determine candidate order based on preferred position (ignore center/auto)
      const sides: Array<'right' | 'left' | 'bottom' | 'top'> = ['right', 'left', 'bottom', 'top'];
      let order: Array<'right' | 'left' | 'bottom' | 'top'> = sides;
      if (
        preferredPosition !== 'auto' &&
        (['right', 'left', 'bottom', 'top'] as string[]).includes(preferredPosition)
      ) {
        order = [
          preferredPosition as 'right' | 'left' | 'bottom' | 'top',
          ...sides.filter((s) => s !== preferredPosition),
        ];
      }

      let chosen: 'right' | 'left' | 'bottom' | 'top' | null = null;
      for (const s of order) {
        if (
          (s === 'right' && spaceRight >= tooltipWidth + padding) ||
          (s === 'left' && spaceLeft >= tooltipWidth + padding) ||
          (s === 'bottom' && spaceBottom >= tooltipHeight + padding) ||
          (s === 'top' && spaceTop >= tooltipHeight + padding)
        ) {
          chosen = s;
          break;
        }
      }
      if (!chosen) {
        // Fallback: pick the side with the most space
        const sideSpace = (s: 'right' | 'left' | 'bottom' | 'top') =>
          s === 'right'
            ? spaceRight
            : s === 'left'
            ? spaceLeft
            : s === 'bottom'
            ? spaceBottom
            : spaceTop;
        chosen = sides.reduce((best, s) => (sideSpace(s) > sideSpace(best) ? s : best), 'right');
      }

      side = chosen || 'right';
      if (side === 'right') {
        left = rect.right + arrowSize + padding;
        top = rect.top + rect.height / 2;
      } else if (side === 'left') {
        left = rect.left - tooltipWidth - arrowSize - padding;
        top = rect.top + rect.height / 2;
      } else if (side === 'bottom') {
        top = rect.bottom + arrowSize + padding;
        left = rect.left + rect.width / 2;
      } else {
        top = rect.top - tooltipHeight - arrowSize - padding;
        left = rect.left + rect.width / 2;
      }
    }

    // Global override: place tooltips at top if they would be bottom
    if (side === 'bottom') {
      side = 'top';
      // keep horizontal center; move above the target using a safe gap
      top = Math.max(padding, rect.top - tooltipHeight - Math.max(arrowSize, safeGap));
      left = rect.left + rect.width / 2;
    }

    // Collision avoidance: ensure tooltip does not overlap highlighted rect
    if (side === 'right' || side === 'left') {
      const yTop = top - tooltipHeight / 2;
      const yBottom = top + tooltipHeight / 2;
      // If vertically intersecting the target, nudge above or below based on space
      const overlapsY = !(yBottom + safeGap <= rect.top || yTop - safeGap >= rect.bottom);
      if (overlapsY) {
        if (spaceBottom >= spaceTop) {
          top = Math.min(
            rect.bottom + safeGap + tooltipHeight / 2,
            window.innerHeight - padding - tooltipHeight / 2
          );
        } else {
          top = Math.max(rect.top - safeGap - tooltipHeight / 2, padding + tooltipHeight / 2);
        }
      }
      // For left/right ensure horizontal gap
      if (side === 'right' && left < rect.right + safeGap) {
        left = rect.right + safeGap;
      }
      if (side === 'left') {
        const desiredRight = rect.left - safeGap;
        left = Math.min(left, desiredRight - tooltipWidth);
      }
    } else {
      const xLeft = left - tooltipWidth / 2;
      const xRight = left + tooltipWidth / 2;
      // If horizontally intersecting the target, nudge left/right based on space
      const overlapsX = !(xRight + safeGap <= rect.left || xLeft - safeGap >= rect.right);
      if (overlapsX) {
        if (spaceRight >= spaceLeft) {
          left = Math.min(
            rect.right + safeGap + tooltipWidth / 2,
            window.innerWidth - padding - tooltipWidth / 2
          );
        } else {
          left = Math.max(rect.left - safeGap - tooltipWidth / 2, padding + tooltipWidth / 2);
        }
      }
      // For top placement ensure vertical gap above the target
      if (side === 'top') {
        const desiredBottom = rect.top - safeGap;
        top = Math.min(top, desiredBottom - tooltipHeight);
      }
    }

    // Ensure tooltip stays within viewport after adjustments
    if (side === 'right' || side === 'left') {
      top = Math.max(
        padding + tooltipHeight / 2,
        Math.min(top, window.innerHeight - padding - tooltipHeight / 2)
      );
      left = Math.max(padding, Math.min(left, window.innerWidth - padding - tooltipWidth));
      // Account for horizontal arrow protrusion (16px)
      if (side === 'right') {
        left = Math.max(left, padding + 16);
      } else {
        left = Math.min(left, window.innerWidth - padding - tooltipWidth - 16);
      }
    } else {
      top = Math.max(padding, Math.min(top, window.innerHeight - padding - tooltipHeight));
      left = Math.max(
        padding + tooltipWidth / 2,
        Math.min(left, window.innerWidth - padding - tooltipWidth / 2)
      );
      // Account for vertical arrow protrusion (16px) on top placement
      if (side === 'top') {
        top = Math.max(top, padding + 16);
      }
    }

    // Final fallback: if still overlapping target significantly, move to safest corner
    const overlapsTarget = () => {
      const box = {
        top: side === 'right' || side === 'left' ? top - tooltipHeight / 2 : top,
        bottom: side === 'right' || side === 'left' ? top + tooltipHeight / 2 : top + tooltipHeight,
        left: side === 'right' ? left : side === 'left' ? left : left - tooltipWidth / 2,
        right:
          side === 'right'
            ? left + tooltipWidth
            : side === 'left'
            ? left + tooltipWidth
            : left + tooltipWidth / 2,
      };
      return !(
        box.right + safeGap <= rect.left ||
        box.left - safeGap >= rect.right ||
        box.bottom + safeGap <= rect.top ||
        box.top - safeGap >= rect.bottom
      );
    };

    if (overlapsTarget()) {
      if (!forcePreferredSide) {
        // Always prefer top placement now
        top = Math.max(padding, rect.top - tooltipHeight - safeGap);
        left = Math.max(padding, Math.min(rect.left, window.innerWidth - padding - tooltipWidth));
        side = 'top';
      } else {
        // Keep the chosen side and clamp near target
        if (side === 'top') {
          top = Math.max(padding, rect.top - tooltipHeight - safeGap);
        } else if (side === 'left') {
          left = Math.min(left, rect.left - safeGap - tooltipWidth);
        } else if (side === 'right') {
          left = Math.max(left, rect.right + safeGap);
        }
      }
    }

    // If x edges still overflow, center horizontally and choose top/bottom based on space
    const xStart = side === 'right' || side === 'left' ? left : left - tooltipWidth / 2;
    const xEnd = xStart + tooltipWidth;
    if (xStart < padding || xEnd > window.innerWidth - padding) {
      // Default to top placement when horizontal overflow occurs
      top = Math.max(padding, rect.top - tooltipHeight - safeGap);
      side = 'top';
      // center
      left = window.innerWidth / 2;
    }

    // Final clamp after all adjustments
    if (side === 'right' || side === 'left') {
      top = Math.max(
        padding + tooltipHeight / 2,
        Math.min(top, window.innerHeight - padding - tooltipHeight / 2)
      );
      left = Math.max(padding, Math.min(left, window.innerWidth - padding - tooltipWidth));
    } else {
      top = Math.max(padding, Math.min(top, window.innerHeight - padding - tooltipHeight));
      left = Math.max(
        padding + tooltipWidth / 2,
        Math.min(left, window.innerWidth - padding - tooltipWidth / 2)
      );
    }

    setTooltipPosition({ top, left });
    setTooltipSide(side);
  }, [currentStepData, effectiveTargetElement, forcePreferredSide]);

  // Reset tutorial state when opened
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setCurrentSubStep(0);
      setClickedElements(new Set());
      setActionCompleted(false);
      setIsRunning(false);
    }
  }, [isOpen]);

  // Mark onboarding as active for other components (e.g., modals) to react
  useEffect(() => {
    if (isOpen) {
      document.documentElement.dataset.onboardingActive = 'true';
    } else {
      delete document.documentElement.dataset.onboardingActive;
    }
    return () => {
      delete document.documentElement.dataset.onboardingActive;
    };
  }, [isOpen]);

  // Ensure substep index is valid when step changes (especially when navigating backwards)
  useEffect(() => {
    const total = currentStepData.subSteps?.length || 0;
    if (total === 0 && currentSubStep !== 0) {
      setCurrentSubStep(0);
    } else if (total > 0 && currentSubStep >= total) {
      setCurrentSubStep(0);
    }
  }, [currentStep, currentStepData.subSteps?.length, currentSubStep]);

  // Ensure highlight portal layer exists in the document body (above navbar stacking)
  useEffect(() => {
    if (!isOpen) return;
    let el = document.getElementById('onboarding-highlight-layer') as HTMLElement | null;
    if (!el) {
      el = document.createElement('div');
      el.id = 'onboarding-highlight-layer';
      // place above navbar and overlays
      el.style.position = 'fixed';
      el.style.inset = '0';
      el.style.pointerEvents = 'none';
      el.style.zIndex = '10006';
      document.body.appendChild(el);
    }
    highlightLayerRef.current = el;
    return () => {
      // keep the layer for the session; do not remove to avoid flicker
    };
  }, [isOpen]);

  // Recalculate position on step change, resize, or scroll
  useEffect(() => {
    if (!isOpen) return;

    // Initial calculation immediately and on next frame (after DOM paints)
    calculatePosition();
    const raf = requestAnimationFrame(() => calculatePosition());

    const handleResize = () => calculatePosition();
    const handleScroll = () => calculatePosition();

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen, currentStep, currentSubStep, effectiveTargetElement, calculatePosition]);

  // Reposition when tooltip size changes
  useEffect(() => {
    if (!isOpen) return;
    const el = tooltipRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => calculatePosition());
    ro.observe(el);
    return () => ro.disconnect();
  }, [isOpen, calculatePosition]);

  // Execute automated action when step changes (including tab syncing)
  useEffect(() => {
    if (!isOpen) return;

    // Sync tab if the step or substep specifies one
    const desired = currentStepContent?.desiredOutput || currentStepData.desiredOutput;
    if (desired) {
      // Only auto-switch when navigating backwards or when there was no prior click requirement
      // This avoids fighting the user when they are progressing forward through required clicks
      const cameFromPrev = navDirectionRef.current === 'prev';
      const hasClickRequirement = !!(
        currentStepContent?.requireClick ?? currentStepData.requireClick
      );
      if (cameFromPrev || !hasClickRequirement) {
        try {
          // Dispatch a custom event so parent can listen and set the tab, or call prop if available
          document.dispatchEvent(
            new CustomEvent('websvf-tutorial-set-output', { detail: { output: desired } })
          );
          // Also try direct prop when present
          setCurrentOutput?.(desired as unknown as never);
        } catch {
          // no-op
        }
      }
    }

    // Then run any step-specific action
    if (currentStepData.action) {
      const timer = setTimeout(() => {
        currentStepData.action?.();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, currentStep, currentSubStep, currentStepData, currentStepContent, setCurrentOutput]);

  // Scroll highlighted element into view
  useEffect(() => {
    if (!isOpen || !effectiveTargetElement) return;

    const element = document.querySelector(effectiveTargetElement) as HTMLElement | null;
    if (element) {
      const r = element.getBoundingClientRect();
      const isHuge =
        r.height >= window.innerHeight * 0.9 || r.top <= 0 || r.bottom >= window.innerHeight;
      if (!isHuge) {
        element.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' });
      } // For huge/viewport-filling targets, do not auto-scroll to avoid jump/cutoff
    }
  }, [isOpen, currentStep, currentSubStep, effectiveTargetElement]);

  // Boost z-index of highlighted element when allowInteraction is true
  useEffect(() => {
    if (!isOpen || !effectiveTargetElement || !effectiveAllowInteraction) return;

    const element = document.querySelector(effectiveTargetElement) as HTMLElement;
    if (!element) return;

    // Store original values
    const originalZIndex = element.style.zIndex;
    const originalPosition = element.style.position;

    // Boost z-index to be above backdrop (10000) but below tooltip (10002)
    element.style.zIndex = '10001';
    // Ensure element has positioning context
    if (!originalPosition || originalPosition === 'static') {
      element.style.position = 'relative';
    }

    return () => {
      // Restore original values
      element.style.zIndex = originalZIndex;
      if (!originalPosition || originalPosition === 'static') {
        element.style.position = originalPosition || '';
      }
    };
  }, [isOpen, effectiveTargetElement, effectiveAllowInteraction]);

  // Boost z-index of navbar only when it's the target element
  useEffect(() => {
    if (!isOpen) return;

    const navbar = document.querySelector('#six-navbar') as HTMLElement;
    if (!navbar) return;

    // Only boost navbar if it or its children are being targeted
    const isNavbarTarget =
      effectiveTargetElement &&
      (effectiveTargetElement.includes('#six-navbar') ||
        effectiveTargetElement.includes('#settings-icon') ||
        effectiveTargetElement.includes('#share-icon') ||
        effectiveTargetElement.includes('#help-icon') ||
        effectiveTargetElement.includes('#import-icon') ||
        effectiveTargetElement.includes('#export-icon'));

    if (!isNavbarTarget) return;

    const originalZIndex = navbar.style.zIndex;
    const originalPosition = navbar.style.position;

    // Boost navbar z-index above overlay (10000) to keep it accessible
    navbar.style.zIndex = '10004';
    if (!originalPosition || originalPosition === 'static') {
      navbar.style.position = 'relative';
    }

    return () => {
      navbar.style.zIndex = originalZIndex;
      if (!originalPosition || originalPosition === 'static') {
        navbar.style.position = originalPosition || '';
      }
    };
  }, [isOpen, effectiveTargetElement]);

  // Control page scrolling: lock only on center/no-target steps; allow scroll for highlighted targets
  useEffect(() => {
    if (!isOpen) return;

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    const shouldLock = !effectiveTargetElement; // lock when no element is highlighted
    if (shouldLock) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      // Allow natural page scrolling so user can bring the target into view
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, [isOpen, effectiveTargetElement]);

  // Track clicks on required elements
  useEffect(() => {
    if (!isOpen || !effectiveRequireClick || !effectiveTargetElement) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const requiredElement = document.querySelector(effectiveTargetElement);

      // Special case: For CodeGPT step, require clicking ONLY the Send button
      const sendButton = document.querySelector('#codegpt-send-button');
      const sendButtonOnly =
        !!sendButton &&
        effectiveTargetElement === '#graph-page-output-container' &&
        !!effectiveClickMessage &&
        /send button/i.test(effectiveClickMessage);
      if (sendButtonOnly) {
        if (sendButton.contains(target) || sendButton === target) {
          setClickedElements((prev) => new Set(prev).add(effectiveTargetElement));
          setActionCompleted(true);
        }
        // Regardless of other clicks inside the container, don't mark as clicked
        return;
      }

      // Default behavior: any click within the required element
      if (requiredElement && (requiredElement.contains(target) || requiredElement === target)) {
        setClickedElements((prev) => new Set(prev).add(effectiveTargetElement));
        if (!currentStepData.waitForAction) {
          setActionCompleted(true);
          // Auto-advance if this is a substep and more substeps remain
          if (currentStepData.subSteps && currentSubStep < currentStepData.subSteps.length - 1) {
            setTimeout(() => {
              setCurrentSubStep((s) => s + 1);
              setActionCompleted(false);
            }, 150);
          }
        }
      }
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [
    isOpen,
    effectiveRequireClick,
    effectiveTargetElement,
    effectiveClickMessage,
    currentStepData.waitForAction,
    currentStepData.subSteps,
    currentSubStep,
  ]);

  // Track multiple required clicks
  useEffect(() => {
    if (!isOpen || !currentStepData.requireMultipleClicks) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      currentStepData.requireMultipleClicks?.forEach((selector) => {
        const element = document.querySelector(selector);
        if (element && (element.contains(target) || element === target)) {
          setClickedElements((prev) => {
            const newSet = new Set(prev);
            newSet.add(selector);
            return newSet;
          });
        }
      });
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [isOpen, currentStep, currentStepData.requireMultipleClicks]);

  // Listen for global run start/finish events to gate progression on Run step
  useEffect(() => {
    if (!isOpen) return;

    const onStart = () => {
      if (currentStepData.waitForAction) {
        setIsRunning(true);
      }
    };
    const onFinish = () => {
      if (currentStepData.waitForAction) {
        setIsRunning(false);
        setActionCompleted(true);
      }
    };

    document.addEventListener('websvf-run-start', onStart as EventListener);
    document.addEventListener('websvf-run-finish', onFinish as EventListener);

    return () => {
      document.removeEventListener('websvf-run-start', onStart as EventListener);
      document.removeEventListener('websvf-run-finish', onFinish as EventListener);
    };
  }, [isOpen, currentStep, currentStepData.waitForAction]);

  const handleComplete = useCallback(() => {
    localStorage.setItem('websvf-onboarding-completed', 'true');
    onComplete();
    onClose();
  }, [onComplete, onClose]);

  const handleNext = useCallback(() => {
    navDirectionRef.current = 'next';
    // Enforce required click and optional wait-for-action
    if (effectiveRequireClick) {
      const clicked = clickedElements.has(effectiveTargetElement || '');
      if (currentStepData.waitForAction) {
        if (!clicked || !actionCompleted) return; // Must click and finish action
      } else {
        if (!clicked) return; // Must click
      }
    }

    // Check if multiple clicks are required
    if (currentStepData.requireMultipleClicks) {
      const allClicked = currentStepData.requireMultipleClicks.every((selector) =>
        clickedElements.has(selector)
      );
      if (!allClicked) {
        return; // Can't proceed without all clicks
      }
    }

    // Require specific output tab if configured
    if (effectiveRequireOutput && currentOutput !== effectiveRequireOutput) {
      return; // Must switch to required output tab
    }

    // Check if there are substeps
    if (currentStepData.subSteps && currentSubStep < currentStepData.subSteps.length - 1) {
      setCurrentSubStep(currentSubStep + 1);
      setActionCompleted(false); // Reset for next substep
      return;
    }

    // Move to next main step
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setCurrentSubStep(0); // Reset substep
      setActionCompleted(false);
    } else {
      handleComplete();
    }
  }, [
    effectiveRequireClick,
    clickedElements,
    effectiveTargetElement,
    currentStepData,
    actionCompleted,
    effectiveRequireOutput,
    currentOutput,
    currentSubStep,
    currentStep,
    steps.length,
    handleComplete,
  ]);

  // Expose tab gating to OutputMenuBar via document dataset
  useEffect(() => {
    if (!isOpen) {
      delete document.documentElement.dataset.onboardingTabsLocked;
      delete document.documentElement.dataset.onboardingAllowedOutput;
      return;
    }

    const targetIsOutputMenu =
      !!effectiveTargetElement && effectiveTargetElement.includes('.output-menu-bar');

    if (effectiveRequireOutput) {
      document.documentElement.dataset.onboardingTabsLocked = 'true';
      document.documentElement.dataset.onboardingAllowedOutput = String(effectiveRequireOutput);
    } else if (targetIsOutputMenu) {
      document.documentElement.dataset.onboardingTabsLocked = 'false';
      document.documentElement.dataset.onboardingAllowedOutput = 'any';
    } else {
      document.documentElement.dataset.onboardingTabsLocked = 'true';
      delete document.documentElement.dataset.onboardingAllowedOutput;
    }

    // Notify listeners (OutputMenuBar) that gate state changed
    document.dispatchEvent(new CustomEvent('websvf-onboarding-tabs-gate-change'));

    return () => {
      // Clean up on step change/unmount
      delete document.documentElement.dataset.onboardingTabsLocked;
      delete document.documentElement.dataset.onboardingAllowedOutput;
      document.dispatchEvent(new CustomEvent('websvf-onboarding-tabs-gate-change'));
    };
  }, [isOpen, currentStep, currentSubStep, effectiveRequireOutput, effectiveTargetElement]);

  // Auto-advance when a required output tab becomes active (and no other clicks are required)
  const advancedOnOutputRef = useRef<string>('');
  useEffect(() => {
    if (!isOpen) return;
    const key = `${currentStep}-${currentSubStep}`;
    if (
      effectiveRequireOutput &&
      currentOutput === effectiveRequireOutput &&
      advancedOnOutputRef.current !== key &&
      !effectiveRequireClick &&
      !currentStepData.requireMultipleClicks &&
      !currentStepData.waitForAction
    ) {
      advancedOnOutputRef.current = key;
      // Small delay to let UI settle
      setTimeout(() => {
        handleNext();
      }, 150);
    }
  }, [
    isOpen,
    currentStep,
    currentSubStep,
    currentOutput,
    effectiveRequireOutput,
    effectiveRequireClick,
    currentStepData.requireMultipleClicks,
    currentStepData.waitForAction,
    handleNext,
  ]);

  const handlePrevious = () => {
    navDirectionRef.current = 'prev';
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setCurrentSubStep(0); // reset substep when moving to previous main step
      setActionCompleted(false);
    }
  };

  const handleSkip = () => {
    setShowSkipConfirm(true);
  };

  const confirmSkip = () => {
    localStorage.setItem('websvf-onboarding-completed', 'true');
    onClose();
    setShowSkipConfirm(false);
  };

  const cancelSkip = () => {
    setShowSkipConfirm(false);
  };

  if (!isOpen) return null;

  const progress = ((currentStep + 1) / steps.length) * 100;

  const modalOpen =
    typeof document !== 'undefined' &&
    document.documentElement.dataset.onboardingModalOpen === 'true';

  const isFirstOrLast = currentStep === 0 || currentStep === steps.length - 1;

  // Render-time override: for navbar targets, render below; otherwise render above
  const targetIsNavbar =
    !!effectiveTargetElement &&
    (effectiveTargetElement.includes('#six-navbar') ||
      effectiveTargetElement.includes('#settings-icon') ||
      effectiveTargetElement.includes('#share-icon') ||
      effectiveTargetElement.includes('#help-icon') ||
      effectiveTargetElement.includes('#import-icon') ||
      effectiveTargetElement.includes('#export-icon'));
  const renderSide: 'top' | 'bottom' | 'left' | 'right' = effectiveTargetElement
    ? targetIsNavbar
      ? 'bottom'
      : 'top'
    : tooltipSide;
  const renderTop = (() => {
    if (!effectiveTargetElement || !highlightRect) return tooltipPosition.top;
    const ttH = Math.min(tooltipRef.current?.offsetHeight || 360, window.innerHeight - 24);
    const padding = 12;
    const safeGap = 16;
    const navExtraGap = 12; // extra breathing room under sticky navbar
    if (targetIsNavbar) {
      return Math.min(
        window.innerHeight - padding - ttH,
        highlightRect.bottom + safeGap + navExtraGap
      );
    }
    return Math.max(padding, highlightRect.top - ttH - safeGap);
  })();
  const renderLeft = (() => {
    if (!effectiveTargetElement || !highlightRect) return tooltipPosition.left;
    const padding = 12;
    const safeGap = 16;
    const ttW = Math.min(tooltipRef.current?.offsetWidth || 560, window.innerWidth - 24);

    // Default center relative to target
    let center = highlightRect.left + highlightRect.width / 2;

    if (!targetIsNavbar) {
      // If rendering above and would overlap the target, move fully to the side with more space
      const xLeft = center - ttW / 2;
      const xRight = center + ttW / 2;
      const overlapsX = !(
        xRight + safeGap <= highlightRect.left || xLeft - safeGap >= highlightRect.right
      );

      if (overlapsX) {
        const spaceLeft = highlightRect.left;
        const spaceRight = window.innerWidth - highlightRect.right;
        if (spaceRight >= spaceLeft) {
          center = Math.min(
            window.innerWidth - padding - ttW / 2,
            highlightRect.right + safeGap + ttW / 2
          );
        } else {
          center = Math.max(padding + ttW / 2, highlightRect.left - safeGap - ttW / 2);
        }
      }
    }

    // Clamp to viewport
    center = Math.max(padding + ttW / 2, Math.min(center, window.innerWidth - padding - ttW / 2));
    return center;
  })();

  return (
    <div className="interactive-onboarding-overlay">
      {/* Backdrop with cutout for highlighted element - hidden when a modal is open */}
      {!modalOpen && (
        <div className="interactive-onboarding-backdrop">
          {highlightRect ? (
            <>
              {/* Top section */}
              <div
                className="backdrop-section"
                style={{
                  top: 0,
                  left: 0,
                  right: 0,
                  height: highlightRect.top,
                  pointerEvents: 'all',
                }}
              />
              {/* Bottom section */}
              <div
                className="backdrop-section"
                style={{
                  top: highlightRect.bottom,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  pointerEvents: 'all',
                }}
              />
              {/* Left section */}
              <div
                className="backdrop-section"
                style={{
                  top: highlightRect.top,
                  left: 0,
                  width: highlightRect.left,
                  height: highlightRect.height,
                  pointerEvents: 'all',
                }}
              />
              {/* Right section */}
              <div
                className="backdrop-section"
                style={{
                  top: highlightRect.top,
                  left: highlightRect.right,
                  right: 0,
                  height: highlightRect.height,
                  pointerEvents: 'all',
                }}
              />
              {/* Highlight border (rendered in a portal above navbar) */}
              {highlightLayerRef.current &&
                createPortal(
                  <div
                    className={`highlight-border ${currentStepData.highlightPulse ? 'pulse' : ''} ${
                      effectiveAllowInteraction ? 'interactive' : ''
                    } ${targetIsNavbar ? 'navbar-target' : ''}`}
                    style={{
                      position: 'fixed',
                      top: Math.max(0, highlightRect.top - 3),
                      left: Math.max(0, highlightRect.left - 3),
                      width:
                        highlightRect.width +
                        Math.min(6, highlightRect.left) +
                        Math.min(0, window.innerWidth - highlightRect.right),
                      height: highlightRect.height + Math.min(6, highlightRect.top),
                      pointerEvents: 'none',
                      zIndex: targetIsNavbar ? 10006 : 10002,
                    }}
                  />,
                  highlightLayerRef.current
                )}
            </>
          ) : (
            isFirstOrLast && (
              <div
                className="backdrop-section"
                style={{ top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'all' }}
              />
            )
          )}
        </div>
      )}

      {/* Tooltip - hidden when a modal is open */}
      {!modalOpen && (
        <div
          ref={tooltipRef}
          className={`interactive-onboarding-tooltip tooltip-${renderSide} ${
            effectiveTargetElement ? '' : 'center-tooltip'
          }`}
          style={{
            // Center the welcome/finish steps; otherwise, dock right when no target element
            top: effectiveTargetElement ? `${renderTop}px` : isFirstOrLast ? '50%' : '10vh',
            left: effectiveTargetElement ? `${renderLeft}px` : isFirstOrLast ? '50%' : 'auto',
            right: effectiveTargetElement ? 'auto' : isFirstOrLast ? 'auto' : '24px',
            transform: effectiveTargetElement
              ? renderSide === 'right' || renderSide === 'left'
                ? 'translateY(-50%)'
                : 'translateX(-50%)'
              : isFirstOrLast
              ? 'translate(-50%, -50%)'
              : 'none',
            pointerEvents: 'all',
            bottom: 'auto',
            zIndex: 10002,
            position: 'fixed',
            maxWidth: 'clamp(520px, 64vw, 760px)',
          }}
        >
          {/* Close button */}
          <button className="tooltip-close-btn" onClick={handleSkip} aria-label="Close tutorial">
            <CloseIcon fontSize="small" />
          </button>

          {/* Progress bar */}
          <div className="tooltip-progress-bar">
            <div className="tooltip-progress-fill" style={{ width: `${progress}%` }} />
          </div>

          {/* Step indicator moved near dots (see tooltip-navigation) */}

          {/* Content */}
          <div
            className="tooltip-content"
            style={{ display: 'block', visibility: 'visible', opacity: 1 }}
          >
            <h3
              className="tooltip-title"
              style={{ color: 'inherit', display: 'block', visibility: 'visible', opacity: 1 }}
            >
              {currentStepData.title}
            </h3>
            <div
              className="tooltip-description"
              style={{ color: 'inherit', display: 'block', visibility: 'visible', opacity: 1 }}
            >
              {effectiveContent}
            </div>

            {/* Show click requirement message */}
            {effectiveRequireClick &&
              !clickedElements.has(effectiveTargetElement || '') &&
              !(effectiveRequireOutput && currentOutput !== effectiveRequireOutput) && (
                <div className="tooltip-requirement">
                  👆 {effectiveClickMessage || 'Click the highlighted element to continue'}
                </div>
              )}

            {/* Show waiting state if action must finish (e.g., Run) */}
            {effectiveRequireClick &&
              currentStepData.waitForAction &&
              clickedElements.has(effectiveTargetElement || '') &&
              !actionCompleted && (
                <div className="tooltip-requirement">
                  ⏳ Running analysis... please wait until it finishes
                </div>
              )}

            {/* Show multiple click progress */}
            {currentStepData.requireMultipleClicks && (
              <div className="tooltip-requirement">
                Clicked:{' '}
                {
                  Array.from(clickedElements).filter((sel) =>
                    currentStepData.requireMultipleClicks?.includes(sel)
                  ).length
                }{' '}
                / {currentStepData.requireMultipleClicks.length}
              </div>
            )}

            {/* Require specific output tab message */}
            {effectiveRequireOutput && currentOutput !== effectiveRequireOutput && (
              <div className="tooltip-requirement">
                🔁 Switch to the "{effectiveRequireOutput}" tab to continue
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="tooltip-navigation">
            <button
              className="tooltip-btn tooltip-btn-secondary"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <NavigateBeforeIcon fontSize="small" />
              Previous
            </button>

            <div className="tooltip-dots">
              <div className="tooltip-step-label">
                Step {currentStep + 1} of {steps.length}
                {currentStepData.subSteps && currentStepData.subSteps.length > 0 && (
                  <span style={{ marginLeft: '6px', opacity: 0.7 }}>
                    (Part {currentSubStep + 1}/{currentStepData.subSteps.length})
                  </span>
                )}
              </div>
              <div className="tooltip-dots-row">
                {steps.map((_, index) => (
                  <span
                    key={index}
                    className={`tooltip-dot ${index === currentStep ? 'active' : ''} ${
                      index < currentStep ? 'completed' : ''
                    }`}
                    onClick={() => {
                      setCurrentStep(index);
                      setCurrentSubStep(0);
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`Go to step ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <button
              className="tooltip-btn tooltip-btn-primary"
              onClick={handleNext}
              disabled={(() => {
                // Disable Next when waiting for required action completion
                if (effectiveRequireClick) {
                  const clicked = clickedElements.has(effectiveTargetElement || '');
                  if (currentStepData.waitForAction) {
                    if (!(clicked && actionCompleted)) return true;
                  } else if (!clicked) return true;
                }
                // For multiple required clicks
                if (currentStepData.requireMultipleClicks) {
                  const allClicked = currentStepData.requireMultipleClicks.every((selector) =>
                    clickedElements.has(selector)
                  );
                  if (!allClicked) return true;
                }
                // Require specific output tab
                if (effectiveRequireOutput && currentOutput !== effectiveRequireOutput) return true;
                return false;
              })()}
            >
              {currentStepData.nextLabel || (currentStep === steps.length - 1 ? 'Finish' : 'Next')}
              {currentStep < steps.length - 1 && <NavigateNextIcon fontSize="small" />}
            </button>
          </div>
        </div>
      )}

      {/* Skip Confirmation */}
      {showSkipConfirm && (
        <div className="skip-confirm-overlay">
          <div className="skip-confirm-modal">
            <h3>Skip Tutorial?</h3>
            <p>
              You can replay this tutorial anytime by clicking the help button (?) in the navbar.
            </p>
            <div className="skip-confirm-actions">
              <button className="tooltip-btn tooltip-btn-secondary" onClick={cancelSkip}>
                Continue Tutorial
              </button>
              <button className="tooltip-btn tooltip-btn-primary" onClick={confirmSkip}>
                Skip Tutorial
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveOnboarding;
