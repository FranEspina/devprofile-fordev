/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    user: {
      token: string,
      id: string
    },
  }
}

export type SocialIcon = Record<string, string | any>