// client/src/components/I18nProvider.tsx
'use client';

import '@/public/i18n'; // Initializes i18next on the client
import { ReactNode } from 'react';

export default function I18nProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}