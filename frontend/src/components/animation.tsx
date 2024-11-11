import { useAppSelector } from "@src/hooks/useReduxEvent";
import React, { useEffect } from "react";

interface TransitionAnimation {
  children: React.ReactNode;
}

function TransitionAnimation({ children }: TransitionAnimation) {
  const reduceAnimation = useAppSelector(
    (state) => state.animationSlice.animation,
  );

  return !reduceAnimation ? (
    <div className="parent-animation">
      <div className="animate-fade-fwd">{children}</div>
    </div>
  ) : (
    <>{children}</>
  );
}

export { TransitionAnimation };
