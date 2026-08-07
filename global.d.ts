export {};

declare global {
  interface Window {
    toast: {
      success: (message: string, duration?: number) => void;
      info: (message: string, duration?: number) => void;
      warning: (message: string, duration?: number) => void;
      error: (message: string, duration?: number) => void;
      toast: (message: string, type?: any, duration?: number) => void;
    };
  }
  const toast: {
    success: (message: string, duration?: number) => void;
    info: (message: string, duration?: number) => void;
    warning: (message: string, duration?: number) => void;
    error: (message: string, duration?: number) => void;
    toast: (message: string, type?: any, duration?: number) => void;
  };
}
