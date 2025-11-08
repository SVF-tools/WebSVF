import { useEffect } from 'react';
import Mousetrap from 'mousetrap';
import type { Shortcuts } from '../components/multiSession/sessionManager';

type Handlers = Partial<Record<keyof Shortcuts, () => void>>;

/**
 * Bind shortcuts using Mousetrap and handlers typed with SessionManager's Shortcuts.
 * - shortcuts: a Shortcuts object (save, run, toggle_sidebar, ...)
 * - handlers: a map of handlers keyed by the same keys (can be partial)
 *
 * The hook ignores events when focus is in editable fields (inputs, textareas, contenteditable).
 */
export default function useMousetrap(shortcuts: Shortcuts, handlers: Handlers) {
  useEffect(() => {
    const bound: { combo: string; fn: (e: KeyboardEvent) => any }[] = [];

    (Object.keys(shortcuts) as (keyof Shortcuts)[]).forEach((action) => {
      const combo = shortcuts[action];
      const handler = handlers[action];
      if (!combo || typeof handler !== 'function') return;

      const fn = (e: KeyboardEvent) => {
        try {
          const target = e.target as HTMLElement | null;
          if (target) {
            const tag = (target.tagName || '').toLowerCase();
            const isEditable =
              tag === 'input' ||
              tag === 'textarea' ||
              target.getAttribute?.('contenteditable') === 'true' ||
              (target as HTMLInputElement).isContentEditable;
            if (isEditable) {
              // Let the key event through when typing in editable fields
              return true;
            }
          }

          // Prevent default browser behavior and invoke handler
          e.preventDefault();
          handler();
          return false;
        } catch {
          return true;
        }
      };

      try {
        // Mousetrap accepts combos like 'ctrl+r' or single keys like 'r'
        Mousetrap.bind(combo, fn);
        bound.push({ combo, fn });
      } catch {
        // ignore invalid combos
      }
    });

    return () => {
      bound.forEach((b) => {
        try {
          Mousetrap.unbind(b.combo);
        } catch {
          // ignore
        }
      });
    };
  }, [shortcuts, handlers]);
}
