/// <reference types="astro/client" />
declare global {
  namespace App {
    interface Locals extends AdvancedRuntime<AppEnv> {
      user: {
        token: string,
        id: string
      },
    }

    interface Window {
      updatePublicationStamp: () => void;
    }
  }

}

export type SocialIcon = Record<string, string | any>