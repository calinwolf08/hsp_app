import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import ContinueLearningCard from './ContinueLearningCard.svelte';
import type { DashboardCourse } from '../types';
import type { Course, CourseEnrollment, CourseProgress } from '../../shared/types';

describe('ContinueLearningCard', () => {
	afterEach(() => {
		cleanup();
	});

	const mockCourse: Course = {
		id: 'course-1',
		name: 'Introduction to TypeScript',
		internal_name: 'typescript-101',
		slug: 'intro-typescript',
		description: {},
		published: true,
		categories: [],
		tags: [],
		sections: [],
		createdAt: '2024-01-01',
		updatedAt: '2024-01-01'
	};

	const mockEnrollment: CourseEnrollment = {
		id: 'enroll-1',
		user: 'user-1',
		course: 'course-1',
		isActive: true,
		enrollmentSource: 'direct',
		enrolledAt: '2024-01-15',
		createdAt: '2024-01-15',
		updatedAt: '2024-01-15'
	};

	const mockProgress: CourseProgress = {
		id: 'progress-1',
		user: 'user-1',
		course: 'course-1',
		status: 'in-progress',
		startedAt: '2024-01-15',
		createdAt: '2024-01-15',
		updatedAt: '2024-01-20'
	};

	const mockDashboardCourse: DashboardCourse = {
		course: mockCourse,
		enrollment: mockEnrollment,
		progress: mockProgress,
		completionPercentage: 65,
		status: 'in-progress'
	};

	it('should render title and description', () => {
		render(ContinueLearningCard, { course: mockDashboardCourse });

		expect(screen.getByTestId('continue-learning-title')).toBeTruthy();
		expect(screen.getByTestId('continue-learning-title').textContent).toContain('Continue Learning');
		expect(screen.getByTestId('continue-learning-description')).toBeTruthy();
	});

	it('should render course when provided', () => {
		render(ContinueLearningCard, { course: mockDashboardCourse });

		expect(screen.getByTestId('continue-learning-content')).toBeTruthy();
		expect(screen.queryByTestId('continue-learning-empty')).toBeNull();
	});

	it('should render empty state when course is null', () => {
		render(ContinueLearningCard, { course: null });

		expect(screen.getByTestId('continue-learning-empty')).toBeTruthy();
		expect(screen.queryByTestId('continue-learning-content')).toBeNull();
		expect(screen.getByTestId('empty-state-message')).toBeTruthy();
	});

	it('should display course name', () => {
		render(ContinueLearningCard, { course: mockDashboardCourse });

		const title = screen.getByTestId('course-title');
		expect(title.textContent).toBe('Introduction to TypeScript');
	});

	it('should display progress percentage', () => {
		render(ContinueLearningCard, { course: mockDashboardCourse });

		const percentage = screen.getByTestId('progress-percentage');
		expect(percentage.textContent).toBe('65%');
	});

	it('should render continue button', () => {
		render(ContinueLearningCard, { course: mockDashboardCourse });

		const button = screen.getByTestId('continue-button');
		expect(button).toBeTruthy();
		expect(button.textContent).toContain('Continue Course');
	});

	it('should call onClick when continue button is clicked', async () => {
		const user = userEvent.setup();
		const handleClick = vi.fn();

		render(ContinueLearningCard, { course: mockDashboardCourse, onClick: handleClick });

		const button = screen.getByTestId('continue-button');
		await user.click(button);

		expect(handleClick).toHaveBeenCalledOnce();
	});

	it('should not render continue button in empty state', () => {
		render(ContinueLearningCard, { course: null });

		expect(screen.queryByTestId('continue-button')).toBeNull();
	});

	it('should accept custom className', () => {
		render(ContinueLearningCard, { course: mockDashboardCourse, class: 'custom-class' });

		const card = screen.getByTestId('continue-learning-card');
		expect(card.className).toContain('custom-class');
	});

	it('should display progress bar', () => {
		render(ContinueLearningCard, { course: mockDashboardCourse });

		expect(screen.getByTestId('progress-label')).toBeTruthy();
		expect(screen.getByTestId('progress-label').textContent).toBe('Progress');
	});
});
