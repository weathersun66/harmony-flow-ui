import { createContext, useContext } from 'react';

// 内部归属标记随 React Portal 传播；没有提供者时不改变现有 DOM 属性。
export const OverlayOwner = createContext<string | undefined>(undefined);
export const useOverlayOwner = () => useContext(OverlayOwner);
