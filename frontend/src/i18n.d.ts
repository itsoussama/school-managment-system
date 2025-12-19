import 'i18next';

import resources from "@lang/translations.json";

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: "translation", // Default namespace
    resources: typeof resources.fr; // Use the type of your imported resources
  }
}