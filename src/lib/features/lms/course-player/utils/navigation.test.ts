import { describe, it, expect } from 'vitest';
import {
	getNextActivity,
	getPreviousActivity,
	buildNavigationTree,
	findActivityPath,
	isFirstActivity,
	isLastActivity,
	getActivityById,
	getSectionById,
	getTotalActivityCount,
	getActivityPosition,
	canNavigateNext,
	canNavigatePrevious
} from './navigation';
import type { Course, Section, Activity } from '../../shared/types';

describe('navigation utils', () => {
	// Mock data
	const mockActivity1: Activity = {
		id: 'activity-1',
		name: 'Introduction Video',
		internal_name: 'intro-video',
		description: {},
		published: true,
		activityType: 'video',
		videoUrl: 'https://example.com/intro.mp4',
		createdAt: '2024-01-01',
		updatedAt: '2024-01-01'
	};

	const mockActivity2: Activity = {
		id: 'activity-2',
		name: 'Reading Material',
		internal_name: 'reading',
		description: {},
		published: true,
		activityType: 'document',
		documentUrl: 'https://example.com/reading.pdf',
		createdAt: '2024-01-01',
		updatedAt: '2024-01-01'
	};

	const mockActivity3: Activity = {
		id: 'activity-3',
		name: 'Quiz',
		internal_name: 'quiz',
		description: {},
		published: true,
		activityType: 'scorm',
		scormFile: 'https://example.com/quiz.zip',
		createdAt: '2024-01-01',
		updatedAt: '2024-01-01'
	};

	const mockActivity4: Activity = {
		id: 'activity-4',
		name: 'Final Assessment',
		internal_name: 'final',
		description: {},
		published: true,
		activityType: 'survey',
		survey: 'survey-1',
		createdAt: '2024-01-01',
		updatedAt: '2024-01-01'
	};

	const mockSection1: Section = {
		id: 'section-1',
		name: 'Getting Started',
		internal_name: 'getting-started',
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
		name: 'Advanced Topics',
		internal_name: 'advanced',
		description: {},
		published: true,
		activities: [
			{ id: 'act-3-item', activity: mockActivity3 },
			{ id: 'act-4-item', activity: mockActivity4 }
		],
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

	describe('getNextActivity', () => {
		it('should get next activity within same section', () => {
			const next = getNextActivity(mockCourse, 'activity-1');
			expect(next).not.toBeNull();
			expect(next?.id).toBe('activity-2');
		});

		it('should get next activity from next section', () => {
			const next = getNextActivity(mockCourse, 'activity-2');
			expect(next).not.toBeNull();
			expect(next?.id).toBe('activity-3');
		});

		it('should return null if on last activity', () => {
			const next = getNextActivity(mockCourse, 'activity-4');
			expect(next).toBeNull();
		});

		it('should return null for non-existent activity', () => {
			const next = getNextActivity(mockCourse, 'non-existent');
			expect(next).toBeNull();
		});

		it('should handle course with single activity', () => {
			const singleActivitySection: Section = {
				...mockSection1,
				activities: [{ id: 'act-1-item', activity: mockActivity1 }]
			};
			const singleActivityCourse: Course = {
				...mockCourse,
				sections: [{ id: 'sec-1-item', section: singleActivitySection }]
			};
			const next = getNextActivity(singleActivityCourse, 'activity-1');
			expect(next).toBeNull();
		});
	});

	describe('getPreviousActivity', () => {
		it('should get previous activity within same section', () => {
			const prev = getPreviousActivity(mockCourse, 'activity-2');
			expect(prev).not.toBeNull();
			expect(prev?.id).toBe('activity-1');
		});

		it('should get previous activity from previous section', () => {
			const prev = getPreviousActivity(mockCourse, 'activity-3');
			expect(prev).not.toBeNull();
			expect(prev?.id).toBe('activity-2');
		});

		it('should return null if on first activity', () => {
			const prev = getPreviousActivity(mockCourse, 'activity-1');
			expect(prev).toBeNull();
		});

		it('should return null for non-existent activity', () => {
			const prev = getPreviousActivity(mockCourse, 'non-existent');
			expect(prev).toBeNull();
		});

		it('should handle course with single activity', () => {
			const singleActivitySection: Section = {
				...mockSection1,
				activities: [{ id: 'act-1-item', activity: mockActivity1 }]
			};
			const singleActivityCourse: Course = {
				...mockCourse,
				sections: [{ id: 'sec-1-item', section: singleActivitySection }]
			};
			const prev = getPreviousActivity(singleActivityCourse, 'activity-1');
			expect(prev).toBeNull();
		});
	});

	describe('buildNavigationTree', () => {
		it('should build navigation tree with sections and activities', () => {
			const tree = buildNavigationTree(mockCourse);

			expect(tree).toHaveLength(6); // 2 sections + 4 activities
			expect(tree[0].type).toBe('section');
			expect(tree[0].id).toBe('section-1');
			expect(tree[1].type).toBe('activity');
			expect(tree[1].id).toBe('activity-1');
		});

		it('should mark current activity', () => {
			const tree = buildNavigationTree(mockCourse, 'activity-2');

			const currentActivity = tree.find((item) => item.id === 'activity-2');
			expect(currentActivity?.isCurrent).toBe(true);
			expect(currentActivity?.isActive).toBe(true);
		});

		it('should mark completed activities', () => {
			const completedIds = ['activity-1', 'activity-2'];
			const tree = buildNavigationTree(mockCourse, undefined, completedIds);

			const activity1 = tree.find((item) => item.id === 'activity-1');
			const activity2 = tree.find((item) => item.id === 'activity-2');
			const activity3 = tree.find((item) => item.id === 'activity-3');

			expect(activity1?.isCompleted).toBe(true);
			expect(activity2?.isCompleted).toBe(true);
			expect(activity3?.isCompleted).toBe(false);
		});

		it('should mark section as completed when all activities are completed', () => {
			const completedIds = ['activity-1', 'activity-2'];
			const tree = buildNavigationTree(mockCourse, undefined, completedIds);

			const section1 = tree.find((item) => item.id === 'section-1');
			const section2 = tree.find((item) => item.id === 'section-2');

			expect(section1?.isCompleted).toBe(true);
			expect(section2?.isCompleted).toBe(false);
		});

		it('should include section ID in activity items', () => {
			const tree = buildNavigationTree(mockCourse);

			const activity1 = tree.find((item) => item.id === 'activity-1');
			expect(activity1?.sectionId).toBe('section-1');
		});

		it('should include activity type', () => {
			const tree = buildNavigationTree(mockCourse);

			const activity1 = tree.find((item) => item.id === 'activity-1');
			expect(activity1?.activityType).toBe('video');
		});

		it('should assign sequential order numbers', () => {
			const tree = buildNavigationTree(mockCourse);

			tree.forEach((item, index) => {
				expect(item.order).toBe(index);
			});
		});

		it('should handle course with no sections', () => {
			const emptyCourse: Course = { ...mockCourse, sections: [] };
			const tree = buildNavigationTree(emptyCourse);

			expect(tree).toEqual([]);
		});
	});

	describe('findActivityPath', () => {
		it('should return breadcrumb path for activity', () => {
			const path = findActivityPath(mockCourse, 'activity-2');

			expect(path).toHaveLength(3);
			expect(path[0]).toEqual({ id: 'course-1', name: 'Test Course', type: 'course' });
			expect(path[1]).toEqual({ id: 'section-1', name: 'Getting Started', type: 'section' });
			expect(path[2]).toEqual({ id: 'activity-2', name: 'Reading Material', type: 'activity' });
		});

		it('should return path for activity in different section', () => {
			const path = findActivityPath(mockCourse, 'activity-3');

			expect(path).toHaveLength(3);
			expect(path[1].id).toBe('section-2');
			expect(path[2].id).toBe('activity-3');
		});

		it('should return empty array for non-existent activity', () => {
			const path = findActivityPath(mockCourse, 'non-existent');
			expect(path).toEqual([]);
		});
	});

	describe('isFirstActivity', () => {
		it('should return true for first activity', () => {
			expect(isFirstActivity(mockCourse, 'activity-1')).toBe(true);
		});

		it('should return false for non-first activity', () => {
			expect(isFirstActivity(mockCourse, 'activity-2')).toBe(false);
			expect(isFirstActivity(mockCourse, 'activity-3')).toBe(false);
			expect(isFirstActivity(mockCourse, 'activity-4')).toBe(false);
		});

		it('should return false for non-existent activity', () => {
			expect(isFirstActivity(mockCourse, 'non-existent')).toBe(false);
		});
	});

	describe('isLastActivity', () => {
		it('should return true for last activity', () => {
			expect(isLastActivity(mockCourse, 'activity-4')).toBe(true);
		});

		it('should return false for non-last activity', () => {
			expect(isLastActivity(mockCourse, 'activity-1')).toBe(false);
			expect(isLastActivity(mockCourse, 'activity-2')).toBe(false);
			expect(isLastActivity(mockCourse, 'activity-3')).toBe(false);
		});

		it('should return false for non-existent activity', () => {
			expect(isLastActivity(mockCourse, 'non-existent')).toBe(false);
		});

		it('should return false for empty course', () => {
			const emptyCourse: Course = { ...mockCourse, sections: [] };
			expect(isLastActivity(emptyCourse, 'activity-1')).toBe(false);
		});
	});

	describe('getActivityById', () => {
		it('should get activity by ID', () => {
			const activity = getActivityById(mockCourse, 'activity-2');
			expect(activity).not.toBeNull();
			expect(activity?.name).toBe('Reading Material');
		});

		it('should return null for non-existent activity', () => {
			const activity = getActivityById(mockCourse, 'non-existent');
			expect(activity).toBeNull();
		});
	});

	describe('getSectionById', () => {
		it('should get section by ID', () => {
			const section = getSectionById(mockCourse, 'section-1');
			expect(section).not.toBeNull();
			expect(section?.name).toBe('Getting Started');
		});

		it('should return null for non-existent section', () => {
			const section = getSectionById(mockCourse, 'non-existent');
			expect(section).toBeNull();
		});
	});

	describe('getTotalActivityCount', () => {
		it('should return total activity count', () => {
			const count = getTotalActivityCount(mockCourse);
			expect(count).toBe(4);
		});

		it('should return 0 for empty course', () => {
			const emptyCourse: Course = { ...mockCourse, sections: [] };
			const count = getTotalActivityCount(emptyCourse);
			expect(count).toBe(0);
		});
	});

	describe('getActivityPosition', () => {
		it('should return 1-based position for first activity', () => {
			const position = getActivityPosition(mockCourse, 'activity-1');
			expect(position).toBe(1);
		});

		it('should return correct position for middle activity', () => {
			const position = getActivityPosition(mockCourse, 'activity-2');
			expect(position).toBe(2);
		});

		it('should return correct position for last activity', () => {
			const position = getActivityPosition(mockCourse, 'activity-4');
			expect(position).toBe(4);
		});

		it('should return null for non-existent activity', () => {
			const position = getActivityPosition(mockCourse, 'non-existent');
			expect(position).toBeNull();
		});
	});

	describe('canNavigateNext', () => {
		it('should return true when not on last activity', () => {
			expect(canNavigateNext(mockCourse, 'activity-1')).toBe(true);
			expect(canNavigateNext(mockCourse, 'activity-2')).toBe(true);
			expect(canNavigateNext(mockCourse, 'activity-3')).toBe(true);
		});

		it('should return false when on last activity', () => {
			expect(canNavigateNext(mockCourse, 'activity-4')).toBe(false);
		});

		it('should return false for non-existent activity', () => {
			expect(canNavigateNext(mockCourse, 'non-existent')).toBe(false);
		});
	});

	describe('canNavigatePrevious', () => {
		it('should return true when not on first activity', () => {
			expect(canNavigatePrevious(mockCourse, 'activity-2')).toBe(true);
			expect(canNavigatePrevious(mockCourse, 'activity-3')).toBe(true);
			expect(canNavigatePrevious(mockCourse, 'activity-4')).toBe(true);
		});

		it('should return false when on first activity', () => {
			expect(canNavigatePrevious(mockCourse, 'activity-1')).toBe(false);
		});

		it('should return false for non-existent activity', () => {
			expect(canNavigatePrevious(mockCourse, 'non-existent')).toBe(false);
		});
	});
});
