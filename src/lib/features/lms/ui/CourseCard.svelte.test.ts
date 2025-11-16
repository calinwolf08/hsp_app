import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/svelte';
import CourseCard from './CourseCard.svelte';
import type { Course } from '../shared/types';

describe('CourseCard', () => {
	afterEach(() => {
		cleanup();
	});

	const mockCourse: Course = {
		id: 'course-1',
		name: 'Introduction to Testing',
		internal_name: 'intro-testing',
		slug: 'intro-testing',
		description: { root: { children: [] } },
		published: true,
		categories: [],
		tags: [],
		sections: [],
		createdAt: '2024-01-01',
		updatedAt: '2024-01-01'
	};

	it('should render course name', () => {
		render(CourseCard, {
			course: mockCourse,
			href: '/courses/course-1'
		});
		const card = screen.getByTestId('course-card');
		expect(card.textContent).toContain('Introduction to Testing');
	});

	it('should render link with correct href', () => {
		render(CourseCard, {
			course: mockCourse,
			href: '/courses/course-1'
		});
		const titleLink = screen.getByTestId('course-card-title-link');
		expect(titleLink.getAttribute('href')).toBe('/courses/course-1');
	});

	it('should show status badge when status is provided', () => {
		render(CourseCard, {
			course: mockCourse,
			href: '/courses/course-1',
			status: 'in-progress'
		});
		const statusArea = screen.getByTestId('course-card-status');
		expect(statusArea.textContent).toContain('In Progress');
	});

	it('should show progress bar when progress is provided', () => {
		render(CourseCard, {
			course: mockCourse,
			href: '/courses/course-1',
			progress: 75
		});
		const progressArea = screen.getByTestId('course-card-progress');
		expect(progressArea.textContent).toContain('Progress');
		expect(progressArea.textContent).toContain('75%');
	});

	it('should not show progress bar when progress is 0', () => {
		render(CourseCard, {
			course: mockCourse,
			href: '/courses/course-1',
			progress: 0
		});
		const progressArea = screen.queryByTestId('course-card-progress');
		expect(progressArea).toBeFalsy();
	});

	it('should not show progress bar when progress is undefined', () => {
		render(CourseCard, {
			course: mockCourse,
			href: '/courses/course-1'
		});
		const progressArea = screen.queryByTestId('course-card-progress');
		expect(progressArea).toBeFalsy();
	});

	it('should show View Course button', () => {
		render(CourseCard, {
			course: mockCourse,
			href: '/courses/course-1'
		});
		const viewButton = screen.getByTestId('course-card-view-button');
		expect(viewButton.textContent).toContain('View Course');
	});

	it('should show enroll button when showEnrollButton is true', () => {
		render(CourseCard, {
			course: mockCourse,
			href: '/courses/course-1',
			showEnrollButton: true,
			onEnroll: vi.fn()
		});
		const enrollButton = screen.getByTestId('course-card-enroll-button');
		expect(enrollButton.textContent).toContain('Enroll');
	});

	it('should not show enroll button by default', () => {
		render(CourseCard, {
			course: mockCourse,
			href: '/courses/course-1'
		});
		const enrollButton = screen.queryByTestId('course-card-enroll-button');
		expect(enrollButton).toBeFalsy();
	});

	it('should call onEnroll when enroll button is clicked', async () => {
		const onEnroll = vi.fn();
		render(CourseCard, {
			course: mockCourse,
			href: '/courses/course-1',
			showEnrollButton: true,
			onEnroll
		});

		const enrollButton = screen.getByTestId('course-card-enroll-button');
		await fireEvent.click(enrollButton);
		expect(onEnroll).toHaveBeenCalledOnce();
	});

	it('should accept custom className', () => {
		render(CourseCard, {
			course: mockCourse,
			href: '/courses/course-1',
			class: 'custom-class'
		});
		const card = screen.getByTestId('course-card');
		expect(card.className).toContain('custom-class');
	});
});
