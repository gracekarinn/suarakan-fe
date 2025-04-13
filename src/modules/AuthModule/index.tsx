// modules/AuthModule/index.tsx
import { ReactNode } from "react";

export default function AuthModule({ children }: { children: ReactNode }) {
  return (
      <div>
        {children}
      </div>
  );
}