/**
 * Safely load Razorpay checkout script
 * Prevents duplicate script loading and handles errors gracefully
 */

interface Window {
  Razorpay?: any;
}

let scriptLoaded = false;
let scriptLoading: Promise<void> | null = null;

export const loadRazorpayScript = (): Promise<void> => {
  // If already loaded, resolve immediately
  if (scriptLoaded || (window as any).Razorpay) {
    scriptLoaded = true;
    return Promise.resolve();
  }

  // If currently loading, return the existing promise
  if (scriptLoading) {
    return scriptLoading;
  }

  const existingScript = document.querySelector(
    'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
  ) as HTMLScriptElement | null;

  if (existingScript) {
    scriptLoading = new Promise((resolve, reject) => {
      if ((window as any).Razorpay) {
        scriptLoaded = true;
        scriptLoading = null;
        resolve();
        return;
      }

      existingScript.addEventListener("load", () => {
        scriptLoaded = true;
        scriptLoading = null;
        resolve();
      });
      existingScript.addEventListener("error", () => {
        scriptLoading = null;
        reject(new Error("Failed to load Razorpay script. Please check your internet connection."));
      });
    });

    return scriptLoading;
  }

  // Start loading
  scriptLoading = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.type = "text/javascript";
    script.async = true;

    script.onload = () => {
      scriptLoaded = true;
      scriptLoading = null;
      resolve();
    };

    script.onerror = () => {
      scriptLoading = null;
      reject(new Error("Failed to load Razorpay script. Please check your internet connection."));
    };

    document.body.appendChild(script);
  });

  return scriptLoading;
};

/**
 * Check if Razorpay is available
 */
export const isRazorpayAvailable = (): boolean => {
  return !!(window as any).Razorpay && scriptLoaded;
};
