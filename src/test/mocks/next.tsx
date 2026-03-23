import { createElement, type ReactNode } from 'react';

export const mockImage = (props: {
  src: string;
  alt: string;
  [key: string]: unknown;
}) => createElement('img', { src: props.src, alt: props.alt });

export const mockLink = (props: {
  href: string;
  children?: ReactNode;
  [key: string]: unknown;
}) => createElement('a', { href: props.href }, props.children);
