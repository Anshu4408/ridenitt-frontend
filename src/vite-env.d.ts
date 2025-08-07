interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string;
  // ...other env vars
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface ImportMetaEnv {
  readonly VITE_BACKEND_ORIGIN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare global {
    interface Window {
      google: typeof google;
    }
  }
  

