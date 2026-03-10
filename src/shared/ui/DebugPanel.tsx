/**
 * @fileoverview Dev/QA 전용 디버그 패널. 마지막 분석·채팅 API 에러(status, code, message, requestId) 표시.
 * import.meta.env.DEV 또는 VITE_DEBUG_PANEL=true 일 때만 렌더.
 * @참조 debugStore, miriartApi (catch에서 setLastAnalysisError/setLastChatError)
 */

import React from 'react';
import { useDebugStore, type LastApiError } from '../model/debugStore';

const SHOW_PANEL =
  import.meta.env.DEV === true || import.meta.env.VITE_DEBUG_PANEL === 'true';

function ErrorBlock({
  label,
  err,
}: {
  label: string;
  err: LastApiError | null;
}) {
  if (!err) {
    return (
      <div className="text-xs text-text-mid">
        <span className="font-medium">{label}:</span> —
      </div>
    );
  }
  return (
    <div className="text-xs space-y-0.5">
      <div className="font-medium text-text-primary">{label}</div>
      <div className="text-text-mid">
        status={err.status}
        {err.code != null && ` code=${err.code}`}
      </div>
      {err.message != null && (
        <div className="text-text-mid truncate max-w-[240px]" title={err.message}>
          {err.message}
        </div>
      )}
      {err.requestId != null && (
        <div className="text-text-subtle">requestId={err.requestId}</div>
      )}
      <div className="text-text-subtle">{err.timestamp}</div>
    </div>
  );
}

/**
 * Dev/QA에서만 보이는 고정 디버그 패널. 하단 우측 구석.
 */
export const DebugPanel: React.FC = () => {
  const lastAnalysisError = useDebugStore((s) => s.lastAnalysisError);
  const lastChatError = useDebugStore((s) => s.lastChatError);

  if (!SHOW_PANEL) return null;

  return (
    <div
      className="fixed bottom-20 right-3 z-[9999] w-64 max-h-48 overflow-y-auto rounded-lg border border-border-default bg-surface-alt/95 shadow-lg p-2 text-left"
      aria-label="디버그 패널"
    >
      <div className="text-[10px] font-medium text-text-mid mb-1.5 uppercase tracking-wide">
        Debug (Dev/QA)
      </div>
      <div className="space-y-2">
        <ErrorBlock label="Last Analysis" err={lastAnalysisError} />
        <ErrorBlock label="Last Chat" err={lastChatError} />
      </div>
    </div>
  );
};
