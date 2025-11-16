import { describe, it, expect } from 'vitest';
import {
	checkSectionComplete,
	checkCourseComplete,
	buildProgressUpdateChain,
	shouldUpdateSectionProgress,
	shouldUpdateCourseProgress,
	getSectionCompletionPercentage,
	getCourseCompletionPercentage
} from './completion-handler';
import type { Course, Section, Activity } from '../../shared/types';
import type { ActivityProgress, SectionProgress } from '../../shared/types';

describe('completion-handler utils', () => {
	// Mock data
	const mockActivity1: Activity = {
		id: 'activity-1',
		name: 'Activity 1',
		internal_name: 'activity-1',
		description: {},
		published: true,
		activityType: 'video',
		videoUrl: 'https://example.com/video1.mp4',
		createdAt: '2024-01-01',
		updatedAt: '2024-01-01'
	};

	const mockActivity2: Activity = {
		id: 'activity-2',
		name: 'Activity 2',
		internal_name: 'activity-2',
		description: {},
		published: true,
		activityType: 'document',
		documentUrl: 'https://example.com/doc1.pdf',
		createdAt: '2024-01-01',
		updatedAt: '2024-01-01'
	};

	const mockActivity3: Activity = {
		id: 'activity-3',
		name: 'Activity 3',
		internal_name: 'activity-3',
		description: {},
		published: true,
		activityType: 'scorm',
		scormFile: 'https://example.com/scorm.zip',
		createdAt: '2024-01-01',
		updatedAt: '2024-01-01'
	};

	const mockSection1: Section = {
		id: 'section-1',
		name: 'Section 1',
		internal_name: 'section-1',
		description: {},
		published: true,
		activities: [
			{ id: 'act-1-item', activity: mockActivity1 },
			{ id: 'act-2-item', activity: mockActivity2 }
		],
		createdAt: '2024-01-01',
		updatedAt: '2024-01-01'
	};

	const mockSection2: Section = {
		id: 'section-2',
		name: 'Section 2',
		internal_name: 'section-2',
		description: {},
		published: true,
		activities: [{ id: 'act-3-item', activity: mockActivity3 }],
		createdAt: '2024-01-01',
		updatedAt: '2024-01-01'
	};

	const mockCourse: Course = {
		id: 'course-1',
		name: 'Test Course',
		internal_name: 'test-course',
		slug: 'test-course',
		description: {},
		published: true,
		categories: [],
		tags: [],
		sections: [
			{ id: 'sec-1-item', section: mockSection1 },
			{ id: 'sec-2-item', section: mockSection2 }
		],
		createdAt: '2024-01-01',
		updatedAt: '2024-01-01'
	};

	describe('checkSectionComplete', () => {
		it('should return true when all activities are completed', () => {
			const progress: ActivityProgress[] = [
				{
					id: 'prog-1',
					user: 'user-1',
					activity: 'activity-1',
					status: 'completed',
					completedAt: '2024-01-15',
					createdAt: '2024-01-15',
					updatedAt: '2024-01-15'
				},
				{
					id: 'prog-2',
					user: 'user-1',
					activity: 'activity-2',
					status: 'completed',
					completedAt: '2024-01-16',
					createdAt: '2024-01-16',
					updatedAt: '2024-01-16'
				}
			];

			expect(checkSectionComplete(mockSection1, progress)).toBe(true);
		});

		it('should return false when some activities are not completed', () => {
			const progress: ActivityProgress[] = [
				{
					id: 'prog-1',
					user: 'user-1',
					activity: 'activity-1',
					status: 'completed',
					completedAt: '2024-01-15',
					createdAt: '2024-01-15',
					updatedAt: '2024-01-15'
				},
				{
					id: 'prog-2',
					user: 'user-1',
					activity: 'activity-2',
					status: 'in-progress',
					createdAt: '2024-01-16',
					updatedAt: '2024-01-16'
				}
			];

			expect(checkSectionComplete(mockSection1, progress)).toBe(false);
		});

		it('should return false when no progress exists', () => {
			expect(checkSectionComplete(mockSection1, [])).toBe(false);
		});

		it('should return false for section with no activities', () => {
			const emptySection: Section = {
				...mockSection1,
				activities: []
			};

			expect(checkSectionComplete(emptySection, [])).toBe(false);
		});

		it('should return false when activity progress is missing for some activities', () => {
			const partialProgress: ActivityProgress[] = [
				{
					id: 'prog-1',
					user: 'user-1',
					activity: 'activity-1',
					status: 'completed',
					completedAt: '2024-01-15',
					createdAt: '2024-01-15',
					updatedAt: '2024-01-15'
				}
			];

			expect(checkSectionComplete(mockSection1, partialProgress)).toBe(false);
		});
	});

	describe('checkCourseComplete', () => {
		it('should return true when all sections are completed', () => {
			const progress: SectionProgress[] = [
				{
					id: 'sec-prog-1',
					user: 'user-1',
					section: 'section-1',
					status: 'completed',
					completedAt: '2024-01-15',
					createdAt: '2024-01-15',
					updatedAt: '2024-01-15'
				},
				{
					id: 'sec-prog-2',
					user: 'user-1',
					section: 'section-2',
					status: 'completed',
					completedAt: '2024-01-16',
					createdAt: '2024-01-16',
					updatedAt: '2024-01-16'
				}
			];

			expect(checkCourseComplete(mockCourse, progress)).toBe(true);
		});

		it('should return false when some sections are not completed', () => {
			const progress: SectionProgress[] = [
				{
					id: 'sec-prog-1',
					user: 'user-1',
					section: 'section-1',
					status: 'completed',
					completedAt: '2024-01-15',
					createdAt: '2024-01-15',
					updatedAt: '2024-01-15'
				},
				{
					id: 'sec-prog-2',
					user: 'user-1',
					section: 'section-2',
					status: 'in-progress',
					createdAt: '2024-01-16',
					updatedAt: '2024-01-16'
				}
			];

			expect(checkCourseComplete(mockCourse, progress)).toBe(false);
		});

		it('should return false when no progress exists', () => {
			expect(checkCourseComplete(mockCourse, [])).toBe(false);
		});

		it('should return false for course with no sections', () => {
			const emptyCourse: Course = {
				...mockCourse,
				sections: []
			};

			expect(checkCourseComplete(emptyCourse, [])).toBe(false);
		});
	});

	describe('buildProgressUpdateChain', () => {
		it('should build correct update chain', () => {
			const chain = buildProgressUpdateChain('activity-1', 'section-1', 'course-1');

			expect(chain).toEqual([
				{ type: 'activity', id: 'activity-1' },
				{ type: 'section', id: 'section-1' },
				{ type: 'course', id: 'course-1' }
			]);
		});

		it('should maintain order: activity -> section -> course', () => {
			const chain = buildProgressUpdateChain('act-1', 'sec-1', 'crs-1');

			expect(chain[0].type).toBe('activity');
			expect(chain[1].type).toBe('section');
			expect(chain[2].type).toBe('course');
		});
	});

	describe('shouldUpdateSectionProgress', () => {
		it('should return completed status when all activities are done', () => {
			const progress: ActivityProgress[] = [
				{
					id: 'prog-1',
					user: 'user-1',
					activity: 'activity-1',
					status: 'completed',
					completedAt: '2024-01-15',
					createdAt: '2024-01-15',
					updatedAt: '2024-01-15'
				},
				{
					id: 'prog-2',
					user: 'user-1',
					activity: 'activity-2',
					status: 'completed',
					completedAt: '2024-01-16',
					createdAt: '2024-01-16',
					updatedAt: '2024-01-16'
				}
			];

			const result = shouldUpdateSectionProgress('section-1', mockSection1, progress);

			expect(result.shouldUpdate).toBe(true);
			expect(result.newStatus).toBe('completed');
		});

		it('should return in-progress status when some activities are done', () => {
			const progress: ActivityProgress[] = [
				{
					id: 'prog-1',
					user: 'user-1',
					activity: 'activity-1',
					status: 'completed',
					completedAt: '2024-01-15',
					createdAt: '2024-01-15',
					updatedAt: '2024-01-15'
				},
				{
					id: 'prog-2',
					user: 'user-1',
					activity: 'activity-2',
					status: 'in-progress',
					createdAt: '2024-01-16',
					updatedAt: '2024-01-16'
				}
			];

			const result = shouldUpdateSectionProgress('section-1', mockSection1, progress);

			expect(result.shouldUpdate).toBe(true);
			expect(result.newStatus).toBe('in-progress');
		});

		it('should return not-started status when no activities are started', () => {
			const result = shouldUpdateSectionProgress('section-1', mockSection1, []);

			expect(result.shouldUpdate).toBe(true);
			expect(result.newStatus).toBe('not-started');
		});

		it('should return in-progress when at least one activity is in progress', () => {
			const progress: ActivityProgress[] = [
				{
					id: 'prog-1',
					user: 'user-1',
					activity: 'activity-1',
					status: 'in-progress',
					createdAt: '2024-01-15',
					updatedAt: '2024-01-15'
				}
			];

			const result = shouldUpdateSectionProgress('section-1', mockSection1, progress);

			expect(result.shouldUpdate).toBe(true);
			expect(result.newStatus).toBe('in-progress');
		});

		it('should return false for section with no activities', () => {
			const emptySection: Section = {
				...mockSection1,
				activities: []
			};

			const result = shouldUpdateSectionProgress('section-1', emptySection, []);

			expect(result.shouldUpdate).toBe(false);
			expect(result.newStatus).toBe('not-started');
		});
	});

	describe('shouldUpdateCourseProgress', () => {
		it('should return completed status when all sections are done', () => {
			const progress: SectionProgress[] = [
				{
					id: 'sec-prog-1',
					user: 'user-1',
					section: 'section-1',
					status: 'completed',
					completedAt: '2024-01-15',
					createdAt: '2024-01-15',
					updatedAt: '2024-01-15'
				},
				{
					id: 'sec-prog-2',
					user: 'user-1',
					section: 'section-2',
					status: 'completed',
					completedAt: '2024-01-16',
					createdAt: '2024-01-16',
					updatedAt: '2024-01-16'
				}
			];

			const result = shouldUpdateCourseProgress('course-1', mockCourse, progress);

			expect(result.shouldUpdate).toBe(true);
			expect(result.newStatus).toBe('completed');
		});

		it('should return in-progress status when some sections are done', () => {
			const progress: SectionProgress[] = [
				{
					id: 'sec-prog-1',
					user: 'user-1',
					section: 'section-1',
					status: 'completed',
					completedAt: '2024-01-15',
					createdAt: '2024-01-15',
					updatedAt: '2024-01-15'
				},
				{
					id: 'sec-prog-2',
					user: 'user-1',
					section: 'section-2',
					status: 'in-progress',
					createdAt: '2024-01-16',
					updatedAt: '2024-01-16'
				}
			];

			const result = shouldUpdateCourseProgress('course-1', mockCourse, progress);

			expect(result.shouldUpdate).toBe(true);
			expect(result.newStatus).toBe('in-progress');
		});

		it('should return not-started status when no sections are started', () => {
			const result = shouldUpdateCourseProgress('course-1', mockCourse, []);

			expect(result.shouldUpdate).toBe(true);
			expect(result.newStatus).toBe('not-started');
		});

		it('should return false for course with no sections', () => {
			const emptyCourse: Course = {
				...mockCourse,
				sections: []
			};

			const result = shouldUpdateCourseProgress('course-1', emptyCourse, []);

			expect(result.shouldUpdate).toBe(false);
			expect(result.newStatus).toBe('not-started');
		});
	});

	describe('getSectionCompletionPercentage', () => {
		it('should return 100% when all activities are completed', () => {
			const progress: ActivityProgress[] = [
				{
					id: 'prog-1',
					user: 'user-1',
					activity: 'activity-1',
					status: 'completed',
					completedAt: '2024-01-15',
					createdAt: '2024-01-15',
					updatedAt: '2024-01-15'
				},
				{
					id: 'prog-2',
					user: 'user-1',
					activity: 'activity-2',
					status: 'completed',
					completedAt: '2024-01-16',
					createdAt: '2024-01-16',
					updatedAt: '2024-01-16'
				}
			];

			const percentage = getSectionCompletionPercentage(mockSection1, progress);
			expect(percentage).toBe(100);
		});

		it('should return 50% when half activities are completed', () => {
			const progress: ActivityProgress[] = [
				{
					id: 'prog-1',
					user: 'user-1',
					activity: 'activity-1',
					status: 'completed',
					completedAt: '2024-01-15',
					createdAt: '2024-01-15',
					updatedAt: '2024-01-15'
				}
			];

			const percentage = getSectionCompletionPercentage(mockSection1, progress);
			expect(percentage).toBe(50);
		});

		it('should return 0% when no activities are completed', () => {
			const percentage = getSectionCompletionPercentage(mockSection1, []);
			expect(percentage).toBe(0);
		});

		it('should return 0% for section with no activities', () => {
			const emptySection: Section = {
				...mockSection1,
				activities: []
			};

			const percentage = getSectionCompletionPercentage(emptySection, []);
			expect(percentage).toBe(0);
		});
	});

	describe('getCourseCompletionPercentage', () => {
		it('should return 100% when all sections are completed', () => {
			const progress: SectionProgress[] = [
				{
					id: 'sec-prog-1',
					user: 'user-1',
					section: 'section-1',
					status: 'completed',
					completedAt: '2024-01-15',
					createdAt: '2024-01-15',
					updatedAt: '2024-01-15'
				},
				{
					id: 'sec-prog-2',
					user: 'user-1',
					section: 'section-2',
					status: 'completed',
					completedAt: '2024-01-16',
					createdAt: '2024-01-16',
					updatedAt: '2024-01-16'
				}
			];

			const percentage = getCourseCompletionPercentage(mockCourse, progress);
			expect(percentage).toBe(100);
		});

		it('should return 50% when half sections are completed', () => {
			const progress: SectionProgress[] = [
				{
					id: 'sec-prog-1',
					user: 'user-1',
					section: 'section-1',
					status: 'completed',
					completedAt: '2024-01-15',
					createdAt: '2024-01-15',
					updatedAt: '2024-01-15'
				}
			];

			const percentage = getCourseCompletionPercentage(mockCourse, progress);
			expect(percentage).toBe(50);
		});

		it('should return 0% when no sections are completed', () => {
			const percentage = getCourseCompletionPercentage(mockCourse, []);
			expect(percentage).toBe(0);
		});

		it('should return 0% for course with no sections', () => {
			const emptyCourse: Course = {
				...mockCourse,
				sections: []
			};

			const percentage = getCourseCompletionPercentage(emptyCourse, []);
			expect(percentage).toBe(0);
		});
	});
});
