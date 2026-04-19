export function track(eventName: string, props?: Record<string, any>) {
  if (typeof window === 'undefined') return;
  if (navigator.doNotTrack === "1") return;
  
  if (window.plausible) {
    window.plausible(eventName, { props });
  }
}

declare global {
  interface Window {
    plausible?: (eventName: string, options?: { props?: Record<string, any> }) => void;
  }
}
