import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import EnrolledCoursesList from './EnrolledCoursesList.svelte';
import type { DashboardCourse, FilterOptions } from '../types';
import type { Course, CourseEnrollment, CourseProgress } from '../../shared/types';

describe('EnrolledCoursesList', () => {
	afterEach(() => {
		cleanup();
	});

	const createMockCourse = (id: string, name: string): Course => ({
		id,
		name,
		internal_name: name.toLowerCase().replace(/\s+/g, '-'),
		slug: name.toLowerCase().replace(/\s+/g, '-'),
		description: {},
		published: true,
		categories: [],
		tags: [],
		sections: [],
		createdAt: '2024-01-01',
		updatedAt: '2024-01-01'
	});

	const createMockEnrollment = (courseId: string): CourseEnrollment => ({
		id: `enroll-${courseId}`,
		user: 'user-1',
		course: courseId,
		isActive: true,
		enrollmentSource: 'direct',
		enrolledAt: '2024-01-15',
		createdAt: '2024-01-15',
		updatedAt: '2024-01-15'
	});

	const createMockProgress = (courseId: string, status: 'in-progress' | 'completed' | 'not-started'): CourseProgress => ({
		id: `progress-${courseId}`,
		user: 'user-1',
		course: courseId,
		status,
		startedAt: status !== 'not-started' ? '2024-01-15' : undefined,
		completedAt: status === 'completed' ? '2024-01-20' : undefined,
		createdAt: '2024-01-15',
		updatedAt: '2024-01-20'
	});

	const mockCourses: DashboardCourse[] = [
		{
			course: createMockCourse('course-1', 'TypeScript Basics'),
			enrollment: createMockEnrollment('course-1'),
			progress: createMockProgress('course-1', 'in-progress'),
			completionPercentage: 50,
			status: 'in-progress'
		},
		{
			course: createMockCourse('course-2', 'React Advanced'),
			enrollment: createMockEnrollment('course-2'),
			progress: createMockProgress('course-2', 'completed'),
			completionPercentage: 100,
			status: 'completed'
		},
		{
			course: createMockCourse('course-3', 'Node.js Fundamentals'),
			enrollment: createMockEnrollment('course-3'),
			progress: null,
			completionPercentage: 0,
			status: 'not-started'
		}
	];

	it('should render title and description', () => {
		render(EnrolledCoursesList, { courses: mockCourses });

		expect(screen.getByTestId('enrolled-courses-title')).toBeTruthy();
		expect(screen.getByTestId('enrolled-courses-title').textContent).toContain('All Courses');
		expect(screen.getByTestId('enrolled-courses-description')).toBeTruthy();
	});

	it('should render loading state when loading is true', () => {
		render(EnrolledCoursesList, { courses: mockCourses, loading: true });

		expect(screen.getByTestId('courses-loading')).toBeTruthy();
		expect(screen.queryByTestId('courses-grid')).toBeNull();
		expect(screen.queryByTestId('filter-controls')).toBeNull();
	});

	it('should render empty state when no courses', () => {
		render(EnrolledCoursesList, { courses: [] });

		expect(screen.getByTestId('empty-state')).toBeTruthy();
		expect(screen.getByTestId('empty-state-title')).toBeTruthy();
		expect(screen.getByTestId('empty-state-message')).toBeTruthy();
	});

	it('should render courses grid when courses are provided', () => {
		render(EnrolledCoursesList, { courses: mockCourses });

		expect(screen.getByTestId('courses-grid')).toBeTruthy();
		expect(screen.queryByTestId('empty-state')).toBeNull();
	});

	it('should render filter controls when courses exist', () => {
		render(EnrolledCoursesList, { courses: mockCourses });

		expect(screen.getByTestId('filter-controls')).toBeTruthy();
		expect(screen.getByTestId('sort-select')).toBeTruthy();
		expect(screen.getByTestId('filter-select')).toBeTruthy();
	});

	it('should not render filter controls when no courses', () => {
		render(EnrolledCoursesList, { courses: [] });

		expect(screen.queryByTestId('filter-controls')).toBeNull();
	});

	it('should not render filter controls when loading', () => {
		render(EnrolledCoursesList, { courses: mockCourses, loading: true });

		expect(screen.queryByTestId('filter-controls')).toBeNull();
	});

	it('should call onFilterChange when sort changes', async () => {
		const user = userEvent.setup();
		const handleFilterChange = vi.fn();
		const filters: FilterOptions = { sort: 'recent', filter: 'all' };

		render(EnrolledCoursesList, {
			courses: mockCourses,
			filters,
			onFilterChange: handleFilterChange
		});

		const sortSelect = screen.getByTestId('sort-select') as HTMLSelectElement;
		await user.selectOptions(sortSelect, 'title');

		expect(handleFilterChange).toHaveBeenCalledWith({
			sort: 'title',
			filter: 'all'
		});
	});

	it('should call onFilterChange when filter changes', async () => {
		const user = userEvent.setup();
		const handleFilterChange = vi.fn();
		const filters: FilterOptions = { sort: 'recent', filter: 'all' };

		render(EnrolledCoursesList, {
			courses: mockCourses,
			filters,
			onFilterChange: handleFilterChange
		});

		const filterSelect = screen.getByTestId('filter-select') as HTMLSelectElement;
		await user.selectOptions(filterSelect, 'in-progress');

		expect(handleFilterChange).toHaveBeenCalledWith({
			sort: 'recent',
			filter: 'in-progress'
		});
	});

	it('should use default filters if not provided', () => {
		render(EnrolledCoursesList, { courses: mockCourses });

		const sortSelect = screen.getByTestId('sort-select') as HTMLSelectElement;
		const filterSelect = screen.getByTestId('filter-select') as HTMLSelectElement;

		expect(sortSelect.value).toBe('recent');
		expect(filterSelect.value).toBe('all');
	});

	it('should accept custom className', () => {
		render(EnrolledCoursesList, { courses: mockCourses, class: 'custom-class' });

		const container = screen.getByTestId('enrolled-courses-list');
		expect(container.className).toContain('custom-class');
	});
});
