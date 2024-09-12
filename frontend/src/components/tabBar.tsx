import React, { ReactNode } from "react";

interface TabBar {
  children: ReactNode;
}

interface Item {
  icon: ReactNode;
  label: string;
  isActive: boolean;
}

export function TabBar({ children }: TabBar) {
  const subComponentList = Object.keys(TabBar);

  const subComponents = subComponentList.map((key) => {
    return React.Children.map(children, (child) =>
      child?.type.name === key ? child : null,
    );
  });
  return (
    <div className="tabBar fixed bottom-0 flex h-16 w-full items-center justify-center gap-x-1 border-t border-gray-200 bg-light-primary sm:hidden dark:border-gray-700 dark:bg-dark-primary">
      {subComponents.map((component) => component)}
    </div>
  );
}

function Item({ icon, label, isActive = false }: Item) {
  return (
    <div
      className={`flex w-full flex-col items-center justify-center gap-y-1 rounded-xs ${isActive ? "text-blue-600" : "text-gray-500"}`}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </div>
  );
}

TabBar.Item = Item;
