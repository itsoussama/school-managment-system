import React, { ReactNode } from "react";
import { Link } from "react-router-dom";

interface TabBar {
  children: ReactNode;
}

interface Item {
  icon: ReactNode;
  label: string;
  path: string;
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

function Item({ icon, label, isActive = false, path }: Item) {
  return (
    <Link
      to={path}
      className={`flex w-full flex-col items-center justify-center gap-y-1 rounded-xs ${isActive ? "text-blue-600" : "text-gray-500"}`}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </Link>
  );
}

TabBar.Item = Item;
