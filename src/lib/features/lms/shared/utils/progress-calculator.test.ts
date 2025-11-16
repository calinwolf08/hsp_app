import { describe, it, expect } from 'vitest';
import {
	calculateCompletionPercentage,
	calculateCourseProgress,
	calculateBundleProgress,
	isItemCompleted,
	getProgressStats,
	aggregateProgress
} from './progress-calculator';
import type { SectionProgress, CourseProgress, ActivityProgress } from '../types';

describe('Progress Calculator Utils', () => {
	describe('calculateCompletionPercentage', () => {
		it('should calculate percentage correctly', () => {
			expect(calculateCompletionPercentage(10, 5)).toBe(50);
			expect(calculateCompletionPercentage(10, 3)).toBe(30);
			expect(calculateCompletionPercentage(3, 3)).toBe(100);
		});

		it('should handle zero total', () => {
			expect(calculateCompletionPercentage(0, 0)).toBe(0);
		});

		it('should round to nearest integer', () => {
			expect(calculateCompletionPercentage(3, 1)).toBe(33);
			expect(calculateCompletionPercentage(3, 2)).toBe(67);
		});
	});

	describe('calculateCourseProgress', () => {
		const sections = [{ id: 'section-1' }, { id: 'section-2' }, { id: 'section-3' }];

		it('should calculate progress based on completed sections', () => {
			const sectionProgress: SectionProgress[] = [
				{
					id: '1',
					user: 'user-1',
					section: 'section-1',
					status: 'completed',
					createdAt: '2024-01-01',
					updatedAt: '2024-01-01'
				},
				{
					id: '2',
					user: 'user-1',
					section: 'section-2',
					status: 'in-progress',
					createdAt: '2024-01-01',
					updatedAt: '2024-01-01'
				}
			];

			const progress = calculateCourseProgress(sections, sectionProgress);
			expect(progress).toBe(33); // 1 out of 3 completed
		});

		it('should return 0 for no sections', () => {
			const progress = calculateCourseProgress([], []);
			expect(progress).toBe(0);
		});

		it('should return 100 when all sections completed', () => {
			const sectionProgress: SectionProgress[] = [
				{
					id: '1',
					user: 'user-1',
					section: 'section-1',
					status: 'completed',
					createdAt: '2024-01-01',
					updatedAt: '2024-01-01'
				},
				{
					id: '2',
					user: 'user-1',
					section: 'section-2',
					status: 'completed',
					createdAt: '2024-01-01',
					updatedAt: '2024-01-01'
				},
				{
					id: '3',
					user: 'user-1',
					section: 'section-3',
					status: 'completed',
					createdAt: '2024-01-01',
					updatedAt: '2024-01-01'
				}
			];

			const progress = calculateCourseProgress(sections, sectionProgress);
			expect(progress).toBe(100);
		});
	});

	describe('calculateBundleProgress', () => {
		const courses = [{ id: 'course-1' }, { id: 'course-2' }];

		it('should calculate progress based on completed courses', () => {
			const courseProgress: CourseProgress[] = [
				{
					id: '1',
					user: 'user-1',
					course: 'course-1',
					status: 'completed',
					createdAt: '2024-01-01',
					updatedAt: '2024-01-01'
				}
			];

			const progress = calculateBundleProgress(courses, courseProgress);
			expect(progress).toBe(50); // 1 out of 2 completed
		});

		it('should return 0 for no courses', () => {
			const progress = calculateBundleProgress([], []);
			expect(progress).toBe(0);
		});
	});

	describe('isItemCompleted', () => {
		it('should return true for completed status', () => {
			expect(isItemCompleted('completed')).toBe(true);
		});

		it('should return false for other statuses', () => {
			expect(isItemCompleted('not-started')).toBe(false);
			expect(isItemCompleted('in-progress')).toBe(false);
			expect(isItemCompleted(undefined)).toBe(false);
		});
	});

	describe('getProgressStats', () => {
		const activities = [{ id: 'act-1' }, { id: 'act-2' }, { id: 'act-3' }, { id: 'act-4' }];

		it('should calculate stats correctly', () => {
			const progressRecords: ActivityProgress[] = [
				{
					id: '1',
					user: 'user-1',
					activity: 'act-1',
					status: 'completed',
					createdAt: '2024-01-01',
					updatedAt: '2024-01-01'
				},
				{
					id: '2',
					user: 'user-1',
					activity: 'act-2',
					status: 'in-progress',
					createdAt: '2024-01-01',
					updatedAt: '2024-01-01'
				}
			];

			const stats = getProgressStats(activities, progressRecords);
			expect(stats.total).toBe(4);
			expect(stats.completed).toBe(1);
			expect(stats.inProgress).toBe(1);
			expect(stats.notStarted).toBe(2);
			expect(stats.completionPercentage).toBe(25);
		});

		it('should handle empty progress records', () => {
			const stats = getProgressStats(activities, []);
			expect(stats.total).toBe(4);
			expect(stats.notStarted).toBe(4);
			expect(stats.completed).toBe(0);
			expect(stats.completionPercentage).toBe(0);
		});

		it('should handle all completed', () => {
			const progressRecords: ActivityProgress[] = activities.map((act, i) => ({
				id: String(i + 1),
				user: 'user-1',
				activity: act.id,
				status: 'completed' as const,
				createdAt: '2024-01-01',
				updatedAt: '2024-01-01'
			}));

			const stats = getProgressStats(activities, progressRecords);
			expect(stats.completed).toBe(4);
			expect(stats.completionPercentage).toBe(100);
		});
	});

	describe('aggregateProgress', () => {
		it('should aggregate progress from records', () => {
			const progressRecords: ActivityProgress[] = [
				{
					id: '1',
					user: 'user-1',
					activity: 'act-1',
					status: 'completed',
					createdAt: '2024-01-01',
					updatedAt: '2024-01-01'
				},
				{
					id: '2',
					user: 'user-1',
					activity: 'act-2',
					status: 'completed',
					createdAt: '2024-01-01',
					updatedAt: '2024-01-01'
				},
				{
					id: '3',
					user: 'user-1',
					activity: 'act-3',
					status: 'in-progress',
					createdAt: '2024-01-01',
					updatedAt: '2024-01-01'
				},
				{
					id: '4',
					user: 'user-1',
					activity: 'act-4',
					status: 'not-started',
					createdAt: '2024-01-01',
					updatedAt: '2024-01-01'
				}
			];

			const stats = aggregateProgress(progressRecords);
			expect(stats.total).toBe(4);
			expect(stats.completed).toBe(2);
			expect(stats.inProgress).toBe(1);
			expect(stats.notStarted).toBe(1);
			expect(stats.completionPercentage).toBe(50);
		});

		it('should handle empty array', () => {
			const stats = aggregateProgress([]);
			expect(stats.total).toBe(0);
			expect(stats.completionPercentage).toBe(0);
		});
	});
});
