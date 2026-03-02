/**
 * @fileoverview 성적 입력 시트. 국어/수학/영어/탐구 등급·백분위 입력. useModalStore GRADE_INPUT 모달용.
 * @참조 ModalRegistry, GlobalModal (GRADE_INPUT)
 * @라우팅 전역 (모달)
 * @상태 useModalStore, useState (GradeData)
 */

import React, { useState } from 'react';
import { H2, BodyText } from '../../../shared/ui/Typography';
import { Button } from '../../../shared/ui/Button';
import { useModalStore } from '../../../shared/model/modalStore';
import { STRINGS } from '../../../shared/config/strings';
import { FilterChip } from '../../../shared/ui/FilterChip';

interface SubjectGrade {
  grade: number;
  percentile: number;
}

interface GradeData {
  korean: SubjectGrade;
  math: SubjectGrade;
  mathNA: boolean;
  english: SubjectGrade;
  inquiryType: 'social' | 'science';
  inquiry1: SubjectGrade;
  inquiry2: SubjectGrade;
}

const DEFAULT_GRADE: SubjectGrade = { grade: 3, percentile: 75 };

/** 성적 입력 시트. @참조 ModalRegistry @상태 useModalStore, GradeData */
export const GradeInputSheet: React.FC = () => {
  const { closeModal } = useModalStore();
  const [data, setData] = useState<GradeData>({
    korean: DEFAULT_GRADE,
    math: DEFAULT_GRADE,
    mathNA: false,
    english: DEFAULT_GRADE,
    inquiryType: 'social',
    inquiry1: DEFAULT_GRADE,
    inquiry2: DEFAULT_GRADE,
  });

  const setSubject = (subject: keyof Pick<GradeData, 'korean' | 'math' | 'english' | 'inquiry1' | 'inquiry2'>, field: 'grade' | 'percentile', val: number) => {
    setData((prev) => ({
      ...prev,
      [subject]: { ...prev[subject], [field]: val },
    }));
  };

  const SubjectInput = ({
    label,
    subject,
    disabled,
  }: {
    label: string;
    subject: keyof Pick<GradeData, 'korean' | 'math' | 'english' | 'inquiry1' | 'inquiry2'>;
    disabled?: boolean;
  }) => (
    <div className={`bg-surface-alt/80 rounded-xl p-3 space-y-2 ${disabled ? 'opacity-40' : ''}`}>
      <span className="text-xs text-text-mid font-medium">{label}</span>
      <div className="flex gap-2">
        <div className="flex-1">
          <div className="text-[10px] text-text-low mb-1">등급</div>
          <input
            type="number"
            min="1"
            max="9"
            value={(data[subject] as SubjectGrade).grade}
            onChange={(e) => setSubject(subject, 'grade', parseInt(e.target.value) || 1)}
            disabled={disabled}
            className="w-full bg-surface-alt h-10 text-center rounded-lg text-text-primary font-bold text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-lime border border-border-default"
          />
        </div>
        <div className="flex-1">
          <div className="text-[10px] text-text-low mb-1">{STRINGS.GRADE_INPUT_PERCENTILE}</div>
          <input
            type="number"
            min="1"
            max="100"
            value={(data[subject] as SubjectGrade).percentile}
            onChange={(e) => setSubject(subject, 'percentile', parseInt(e.target.value) || 1)}
            disabled={disabled}
            className="w-full bg-surface-alt h-10 text-center rounded-lg text-text-primary font-bold text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-lime border border-border-default"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6 pb-10 overflow-y-auto no-scrollbar max-h-[90vh]">
      <div className="text-center">
        <H2>{STRINGS.GRADE_INPUT_TITLE}</H2>
        <BodyText className="text-sm mt-1">{STRINGS.GRADE_INPUT_SUBTITLE}</BodyText>
      </div>

      <div className="space-y-3">
        <SubjectInput label={STRINGS.GRADE_INPUT_KOREAN} subject="korean" />

        <div className="space-y-2">
          <SubjectInput label={STRINGS.GRADE_INPUT_MATH} subject="math" disabled={data.mathNA} />
          <button
            onClick={() => setData((prev) => ({ ...prev, mathNA: !prev.mathNA }))}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              data.mathNA
                ? 'bg-primary-lime/10 border-primary-lime text-primary-lime'
                : 'border-border-default text-text-mid hover:border-border-subtle'
            }`}
          >
            {STRINGS.GRADE_INPUT_MATH_NA}
          </button>
        </div>

        <SubjectInput label={STRINGS.GRADE_INPUT_ENGLISH} subject="english" />

        {/* 탐구 섹션 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-mid font-medium">{STRINGS.GRADE_INPUT_INQUIRY}</span>
            <div className="flex gap-2">
              <FilterChip
                label={STRINGS.GRADE_INPUT_INQUIRY_SOCIAL}
                selected={data.inquiryType === 'social'}
                onClick={() => setData((prev) => ({ ...prev, inquiryType: 'social' }))}
              />
              <FilterChip
                label={STRINGS.GRADE_INPUT_INQUIRY_SCIENCE}
                selected={data.inquiryType === 'science'}
                onClick={() => setData((prev) => ({ ...prev, inquiryType: 'science' }))}
              />
            </div>
          </div>
          <SubjectInput label="탐구 1과목" subject="inquiry1" />
          <SubjectInput label="탐구 2과목" subject="inquiry2" />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button variant="secondary" fullWidth onClick={closeModal}>
          {STRINGS.GRADE_INPUT_LATER}
        </Button>
        <Button fullWidth onClick={closeModal}>
          {STRINGS.GRADE_INPUT_SAVE}
        </Button>
      </div>
    </div>
  );
};
