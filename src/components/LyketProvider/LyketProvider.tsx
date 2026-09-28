"use client";

import { Provider } from "@lyket/react";

export default function LyketProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider
      apiKey="pt_0e230d6e7e20dfa46a4c040f2c8c9b"
      disableSessionId={true}
    >
      {children}
    </Provider>
  );
}