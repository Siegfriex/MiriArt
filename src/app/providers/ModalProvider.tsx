import React from 'react';
import { GlobalModal } from '../../shared/ui/modal/GlobalModal';
import { MODAL_REGISTRY, LAYOUT_CONFIG } from './ModalRegistry';

/**
 * @fileoverview 모달 프로바이더. GlobalModal + ModalRegistry. useModalStore activeModal에 따라 모달 렌더.
 * @참조 App.tsx
 * @라우팅 전역
 * @상태 useModalStore (ModalRegistry 내부)
 */
export const ModalProvider: React.FC = () => {
  return (
    <GlobalModal 
      modalRegistry={MODAL_REGISTRY} 
      layoutConfig={LAYOUT_CONFIG} 
    />
  );
};