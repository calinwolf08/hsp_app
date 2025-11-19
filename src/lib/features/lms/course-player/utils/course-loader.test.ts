import { describe, it, expect } from 'vitest';
import {
	getActivityIds,
	getSectionIds,
	organizeProgress,
	calculateCourseCompletion,
	attachProgressToCourse,
	buildCourseWithProgress,
	getTotalActivities,
	getTotalSections,
	getActivitiesInSection,
	findSectionByActivityId
} from './course-loader';
import type { Course, Section, Activity } from '../../shared/types';
import type { CourseProgress, ActivityProgress } from '../../shared/types';

describe('course-loader utils', () => {
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

	const mockCourseProgress: CourseProgress = {
		id: 'progress-1',
		user: 'user-1',
		course: 'course-1',
		status: 'in-progress',
		startedAt: '2024-01-15',
		createdAt: '2024-01-15',
		updatedAt: '2024-01-20'
	};

	const mockActivityProgress: ActivityProgress[] = [
		{
			id: 'act-progress-1',
			user: 'user-1',
			activity: 'activity-1',
			status: 'completed',
			startedAt: '2024-01-15',
			completedAt: '2024-01-16',
			createdAt: '2024-01-15',
			updatedAt: '2024-01-16'
		},
		{
			id: 'act-progress-2',
			user: 'user-1',
			activity: 'activity-2',
			status: 'in-progress',
			startedAt: '2024-01-17',
			createdAt: '2024-01-17',
			updatedAt: '2024-01-18'
		}
	];

	describe('getActivityIds', () => {
		it('should extract all activity IDs from a course', () => {
			const activityIds = getActivityIds(mockCourse);
			expect(activityIds).toEqual(['activity-1', 'activity-2', 'activity-3']);
		});

		it('should return empty array for course with no sections', () => {
			const emptyCourse: Course = {
				...mockCourse,
				sections: []
			};
			const activityIds = getActivityIds(emptyCourse);
			expect(activityIds).toEqual([]);
		});

		it('should handle sections with string references', () => {
			const courseWithStringRefs: Course = {
				...mockCourse,
				sections: [{ id: 'sec-1', section: 'section-1' }]
			};
			const activityIds = getActivityIds(courseWithStringRefs);
			expect(activityIds).toEqual([]);
		});

		it('should handle sections with empty activities', () => {
			const sectionWithoutActivities: Section = {
				...mockSection1,
				activities: []
			};
			const course: Course = {
				...mockCourse,
				sections: [{ id: 'sec-1-item', section: sectionWithoutActivities }]
			};
			const activityIds = getActivityIds(course);
			expect(activityIds).toEqual([]);
		});
	});

	describe('getSectionIds', () => {
		it('should extract all section IDs from a course', () => {
			const sectionIds = getSectionIds(mockCourse);
			expect(sectionIds).toEqual(['section-1', 'section-2']);
		});

		it('should return empty array for course with no sections', () => {
			const emptyCourse: Course = {
				...mockCourse,
				sections: []
			};
			const sectionIds = getSectionIds(emptyCourse);
			expect(sectionIds).toEqual([]);
		});

		it('should handle sections with string references', () => {
			const courseWithStringRefs: Course = {
				...mockCourse,
				sections: [{ id: 'sec-1', section: 'section-1' }]
			};
			const sectionIds = getSectionIds(courseWithStringRefs);
			expect(sectionIds).toEqual([]);
		});
	});

	describe('organizeProgress', () => {
		it('should organize activity progress by section', () => {
			const organized = organizeProgress(mockActivityProgress, mockCourse.sections);

			expect(organized['section-1']).toHaveLength(2);
			expect(organized['section-1'][0].activity).toBe('activity-1');
			expect(organized['section-1'][1].activity).toBe('activity-2');
		});

		it('should return empty object for no progress', () => {
			const organized = organizeProgress([], mockCourse.sections);
			expect(organized).toEqual({});
		});

		it('should handle progress for activities not in any section', () => {
			const orphanProgress: ActivityProgress[] = [
				{
					id: 'orphan-1',
					user: 'user-1',
					activity: 'orphan-activity',
					status: 'completed',
					createdAt: '2024-01-01',
					updatedAt: '2024-01-01'
				}
			];
			const organized = organizeProgress(orphanProgress, mockCourse.sections);
			expect(organized).toEqual({});
		});

		it('should handle sections with string references', () => {
			const sectionsWithStringRefs = [{ id: 'sec-1', section: 'section-1' }];
			const organized = organizeProgress(mockActivityProgress, sectionsWithStringRefs);
			expect(organized).toEqual({});
		});
	});

	describe('calculateCourseCompletion', () => {
		it('should calculate completion percentage correctly', () => {
			const percentage = calculateCourseCompletion(mockCourse, mockActivityProgress);
			// 1 out of 3 activities completed = 33%
			expect(percentage).toBe(33);
		});

		it('should return 100% when all activities are completed', () => {
			const allCompleted: ActivityProgress[] = [
				{ ...mockActivityProgress[0], activity: 'activity-1', status: 'completed' },
				{ ...mockActivityProgress[0], activity: 'activity-2', status: 'completed' },
				{ ...mockActivityProgress[0], activity: 'activity-3', status: 'completed' }
			];
			const percentage = calculateCourseCompletion(mockCourse, allCompleted);
			expect(percentage).toBe(100);
		});

		it('should return 0% when no activities are completed', () => {
			const noneCompleted: ActivityProgress[] = [
				{ ...mockActivityProgress[1], activity: 'activity-1', status: 'in-progress' },
				{ ...mockActivityProgress[1], activity: 'activity-2', status: 'in-progress' },
				{ ...mockActivityProgress[1], activity: 'activity-3', status: 'not-started' }
			];
			const percentage = calculateCourseCompletion(mockCourse, noneCompleted);
			expect(percentage).toBe(0);
		});

		it('should return 0% for course with no activities', () => {
			const emptyCourse: Course = {
				...mockCourse,
				sections: []
			};
			const percentage = calculateCourseCompletion(emptyCourse, mockActivityProgress);
			expect(percentage).toBe(0);
		});

		it('should return 0% for empty progress array', () => {
			const percentage = calculateCourseCompletion(mockCourse, []);
			expect(percentage).toBe(0);
		});
	});

	describe('attachProgressToCourse', () => {
		it('should attach progress to course with completion percentage', () => {
			const result = attachProgressToCourse(
				mockCourse,
				mockCourseProgress,
				mockActivityProgress
			);

			expect(result.course).toBe(mockCourse);
			expect(result.progress).toBe(mockCourseProgress);
			expect(result.completionPercentage).toBe(33);
		});

		it('should handle null progress', () => {
			const result = attachProgressToCourse(mockCourse, null, mockActivityProgress);

			expect(result.course).toBe(mockCourse);
			expect(result.progress).toBeNull();
			expect(result.completionPercentage).toBe(33);
		});

		it('should handle empty activity progress', () => {
			const result = attachProgressToCourse(mockCourse, mockCourseProgress, []);

			expect(result.completionPercentage).toBe(0);
		});
	});

	describe('buildCourseWithProgress', () => {
		it('should build course with progress data', () => {
			const result = buildCourseWithProgress(
				mockCourse,
				mockCourseProgress,
				mockActivityProgress
			);

			expect(result.course).toBe(mockCourse);
			expect(result.progress).toBe(mockCourseProgress);
			expect(result.completionPercentage).toBe(33);
		});

		it('should handle null progress', () => {
			const result = buildCourseWithProgress(mockCourse, null, mockActivityProgress);

			expect(result.course).toBe(mockCourse);
			expect(result.progress).toBeNull();
			expect(result.completionPercentage).toBe(33);
		});

		it('should default to empty activity progress array', () => {
			const result = buildCourseWithProgress(mockCourse, mockCourseProgress);

			expect(result.completionPercentage).toBe(0);
		});

		it('should handle course with 100% completion', () => {
			const allCompleted: ActivityProgress[] = [
				{ ...mockActivityProgress[0], activity: 'activity-1', status: 'completed' },
				{ ...mockActivityProgress[0], activity: 'activity-2', status: 'completed' },
				{ ...mockActivityProgress[0], activity: 'activity-3', status: 'completed' }
			];
			const result = buildCourseWithProgress(mockCourse, mockCourseProgress, allCompleted);

			expect(result.completionPercentage).toBe(100);
		});
	});

	describe('getTotalActivities', () => {
		it('should return total number of activities', () => {
			const total = getTotalActivities(mockCourse);
			expect(total).toBe(3);
		});

		it('should return 0 for course with no activities', () => {
			const emptyCourse: Course = {
				...mockCourse,
				sections: []
			};
			const total = getTotalActivities(emptyCourse);
			expect(total).toBe(0);
		});
	});

	describe('getTotalSections', () => {
		it('should return total number of sections', () => {
			const total = getTotalSections(mockCourse);
			expect(total).toBe(2);
		});

		it('should return 0 for course with no sections', () => {
			const emptyCourse: Course = {
				...mockCourse,
				sections: []
			};
			const total = getTotalSections(emptyCourse);
			expect(total).toBe(0);
		});
	});

	describe('getActivitiesInSection', () => {
		it('should return all activities in a section', () => {
			const activities = getActivitiesInSection(mockSection1);
			expect(activities).toHaveLength(2);
			expect(activities[0].id).toBe('activity-1');
			expect(activities[1].id).toBe('activity-2');
		});

		it('should return empty array for section with no activities', () => {
			const emptySection: Section = {
				...mockSection1,
				activities: []
			};
			const activities = getActivitiesInSection(emptySection);
			expect(activities).toEqual([]);
		});

		it('should handle activities with string references', () => {
			const sectionWithStringRefs: Section = {
				...mockSection1,
				activities: [{ id: 'act-1', activity: 'activity-1' }]
			};
			const activities = getActivitiesInSection(sectionWithStringRefs);
			expect(activities).toEqual([]);
		});
	});

	describe('findSectionByActivityId', () => {
		it('should find section containing the activity', () => {
			const section = findSectionByActivityId(mockCourse, 'activity-1');
			expect(section).not.toBeNull();
			expect(section?.id).toBe('section-1');
		});

		it('should find section for activity in second section', () => {
			const section = findSectionByActivityId(mockCourse, 'activity-3');
			expect(section).not.toBeNull();
			expect(section?.id).toBe('section-2');
		});

		it('should return null if activity not found', () => {
			const section = findSectionByActivityId(mockCourse, 'non-existent');
			expect(section).toBeNull();
		});

		it('should return null for course with no sections', () => {
			const emptyCourse: Course = {
				...mockCourse,
				sections: []
			};
			const section = findSectionByActivityId(emptyCourse, 'activity-1');
			expect(section).toBeNull();
		});

		it('should handle sections with string references', () => {
			const courseWithStringRefs: Course = {
				...mockCourse,
				sections: [{ id: 'sec-1', section: 'section-1' }]
			};
			const section = findSectionByActivityId(courseWithStringRefs, 'activity-1');
			expect(section).toBeNull();
		});
	});
});
