import { describe, it, expect } from 'vitest';
import type { ProgressStatus, ActivityType } from './index';

describe('LMS Types', () => {
	describe('Type Guards', () => {
		it('should validate ProgressStatus values', () => {
			const validStatuses: ProgressStatus[] = ['not-started', 'in-progress', 'completed'];
			const invalidStatus = 'invalid' as ProgressStatus;

			expect(validStatuses).toHaveLength(3);
			expect(validStatuses).toContain('not-started');
			expect(validStatuses).toContain('in-progress');
			expect(validStatuses).toContain('completed');
		});

		it('should validate ActivityType values', () => {
			const validTypes: ActivityType[] = ['scorm', 'survey', 'video', 'document'];

			expect(validTypes).toHaveLength(4);
			expect(validTypes).toContain('scorm');
			expect(validTypes).toContain('survey');
			expect(validTypes).toContain('video');
			expect(validTypes).toContain('document');
		});
	});
});
