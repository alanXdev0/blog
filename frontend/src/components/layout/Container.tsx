import { createElement, type ComponentPropsWithoutRef, type ElementType, type ReactNode } from 'react';
import clsx from 'clsx';

type ContainerProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
} & ComponentPropsWithoutRef<T>;

export const Container = <T extends ElementType = 'div'>({ as, children, className, ...props }: ContainerProps<T>) => {
  const Component = as ?? 'div';
  return createElement(
    Component,
    { className: clsx('mx-auto w-full max-w-6xl px-6 md:px-10', className), ...props },
    children,
  );
};

export default Container;
