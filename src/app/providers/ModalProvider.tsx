import React from 'react';
import { GlobalModal } from '../../shared/ui/modal/GlobalModal';
import { MODAL_REGISTRY, LAYOUT_CONFIG } from './ModalRegistry';

/**
 * ModalProvider
 * Acts as the centralized mount point for the GlobalModal system.
 * Place this high in the component tree (e.g., inside App.tsx or index.tsx).
 */
export const ModalProvider: React.FC = () => {
  return (
    <GlobalModal 
      modalRegistry={MODAL_REGISTRY} 
      layoutConfig={LAYOUT_CONFIG} 
    />
  );
};