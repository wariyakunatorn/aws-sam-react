declare global {
    namespace NodeJS {
      interface ProcessEnv {
        VITE_COGNITO_USER_POOL_ID: string
        VITE_COGNITO_CLIENT_ID: string
        VITE_API_ENDPOINT: string
      }
    }
  }
  
  export {}
  