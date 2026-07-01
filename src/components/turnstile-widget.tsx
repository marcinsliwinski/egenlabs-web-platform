'use client';

import { useEffect, useRef, useState } from 'react';

import type { PublicFormTurnstileAction } from '@/features/turnstile/turnstile-service';

type TurnstileConfig =
  | { enabled: false }
  | { enabled: true; siteKey: string };

type TurnstileRenderOptions = {
  sitekey: string;
  action: string;
  theme: 'auto';
  size: 'flexible';
  callback: () => void;
  'error-callback': () => boolean;
  'expired-callback': () => void;
  'timeout-callback': () => void;
  'response-field': true;
  'response-field-name': 'cf-turnstile-response';
};

type TurnstileApi = {
  render(container: HTMLElement, options: TurnstileRenderOptions): string;
  remove(widgetId: string): void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

type TurnstileWidgetProps = {
  action: PublicFormTurnstileAction;
  className?: string;
};

type WidgetState = 'loading' | 'widget' | 'verified' | 'error' | 'expired' | 'disabled';

let configPromise: Promise<TurnstileConfig> | null = null;
let scriptPromise: Promise<void> | null = null;

function loadConfig() {
  if (!configPromise) {
    configPromise = fetch('/api/v1/turnstile/config', { cache: 'no-store' }).then(async (response) => {
      if (!response.ok) {
        throw new Error(`Turnstile configuration request failed with ${response.status}.`);
      }

      const payload = (await response.json()) as unknown;

      if (!payload || typeof payload !== 'object' || typeof Reflect.get(payload, 'enabled') !== 'boolean') {
        throw new Error('Turnstile configuration response is invalid.');
      }

      if (Reflect.get(payload, 'enabled') === false) {
        return { enabled: false } as const;
      }

      const siteKey = Reflect.get(payload, 'siteKey');

      if (typeof siteKey !== 'string' || siteKey.length === 0) {
        throw new Error('Turnstile site key is missing.');
      }

      return { enabled: true, siteKey } as const;
    });
  }

  return configPromise;
}

function loadTurnstileScript() {
  if (window.turnstile) {
    return Promise.resolve();
  }

  if (scriptPromise) {
    return scriptPromise;
  }

  scriptPromise = new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>('script[data-egenlabs-turnstile]');
    const resolveWhenReady = () => {
      if (window.turnstile) {
        resolve();
      } else {
        reject(new Error('Turnstile API did not initialize.'));
      }
    };

    if (existingScript) {
      existingScript.addEventListener('load', resolveWhenReady, { once: true });
      existingScript.addEventListener('error', () => reject(new Error('Turnstile script failed to load.')), {
        once: true
      });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    script.dataset.egenlabsTurnstile = 'true';
    script.addEventListener('load', resolveWhenReady, { once: true });
    script.addEventListener('error', () => reject(new Error('Turnstile script failed to load.')), {
      once: true
    });
    document.head.appendChild(script);
  });

  return scriptPromise;
}

export function TurnstileWidget({ action, className }: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<WidgetState>('loading');

  useEffect(() => {
    let cancelled = false;
    let widgetId: string | undefined;

    async function initialize() {
      try {
        const config = await loadConfig();

        if (cancelled) {
          return;
        }

        if (!config.enabled) {
          setState('disabled');
          return;
        }

        await loadTurnstileScript();

        if (cancelled || !containerRef.current || !window.turnstile) {
          return;
        }

        setState('widget');
        widgetId = window.turnstile.render(containerRef.current, {
          sitekey: config.siteKey,
          action,
          theme: 'auto',
          size: 'flexible',
          'response-field': true,
          'response-field-name': 'cf-turnstile-response',
          callback: () => setState('verified'),
          'error-callback': () => {
            setState('error');
            return true;
          },
          'expired-callback': () => setState('expired'),
          'timeout-callback': () => setState('expired')
        });
      } catch {
        if (!cancelled) {
          setState('error');
        }
      }
    }

    void initialize();

    return () => {
      cancelled = true;
      if (widgetId && window.turnstile) {
        window.turnstile.remove(widgetId);
      }
    };
  }, [action]);

  if (state === 'disabled') {
    return null;
  }

  const hasError = state === 'error' || state === 'expired';

  return (
    <div className={className}>
      <div ref={containerRef} />
      <p className="meta-text" aria-live="polite">
        {state === 'loading'
          ? 'Ładowanie zabezpieczenia formularza…'
          : hasError
            ? 'Nie udało się przygotować zabezpieczenia formularza. Odśwież stronę i spróbuj ponownie.'
            : ''}
      </p>
    </div>
  );
}
