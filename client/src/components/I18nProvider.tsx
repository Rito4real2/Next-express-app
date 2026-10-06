// client/src/components/I18nProvider.tsx
'use client';

import '../../lib/locales/i18n'; // Initializes i18next on the client
import { ReactNode } from 'react';

export default function I18nProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}