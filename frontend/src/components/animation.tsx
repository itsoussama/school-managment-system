import React from "react";

interface TransitionAnimation {
  children: React.ReactNode;
}

function TransitionAnimation({ children }: TransitionAnimation) {
  return <div className="animate-fade-fwd">{children}</div>;
}

export { TransitionAnimation };
