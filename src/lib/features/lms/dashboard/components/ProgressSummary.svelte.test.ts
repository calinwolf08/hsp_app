import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/svelte';
import ProgressSummary from './ProgressSummary.svelte';
import type { DashboardStats } from '../types';

describe('ProgressSummary', () => {
	afterEach(() => {
		cleanup();
	});

	const mockStats: DashboardStats = {
		totalEnrolled: 10,
		inProgress: 3,
		completed: 5,
		notStarted: 2,
		overallCompletionPercentage: 65
	};

	it('should render title', () => {
		render(ProgressSummary, { stats: mockStats });
		expect(screen.getByTestId('progress-summary-title')).toBeTruthy();
		expect(screen.getByTestId('progress-summary-title').textContent).toContain('Your Progress');
	});

	it('should render loading state when loading is true', () => {
		render(ProgressSummary, { stats: mockStats, loading: true });
		expect(screen.getByTestId('progress-summary-loading')).toBeTruthy();
		expect(screen.queryByTestId('progress-summary-stats')).toBeNull();
	});

	it('should render all stat cards when not loading', () => {
		render(ProgressSummary, { stats: mockStats });

		expect(screen.getByTestId('stat-card-totalEnrolled')).toBeTruthy();
		expect(screen.getByTestId('stat-card-inProgress')).toBeTruthy();
		expect(screen.getByTestId('stat-card-completed')).toBeTruthy();
		expect(screen.getByTestId('stat-card-notStarted')).toBeTruthy();
	});

	it('should display correct values for each stat', () => {
		render(ProgressSummary, { stats: mockStats });

		expect(screen.getByTestId('stat-value-totalEnrolled').textContent).toBe('10');
		expect(screen.getByTestId('stat-value-inProgress').textContent).toBe('3');
		expect(screen.getByTestId('stat-value-completed').textContent).toBe('5');
		expect(screen.getByTestId('stat-value-notStarted').textContent).toBe('2');
	});

	it('should use singular form for value of 1', () => {
		const statsWithOne: DashboardStats = {
			totalEnrolled: 1,
			inProgress: 0,
			completed: 0,
			notStarted: 0,
			overallCompletionPercentage: 0
		};

		render(ProgressSummary, { stats: statsWithOne });
		expect(screen.getByTestId('stat-unit-totalEnrolled').textContent).toBe('Course');
	});

	it('should use plural form for values other than 1', () => {
		render(ProgressSummary, { stats: mockStats });
		expect(screen.getByTestId('stat-unit-totalEnrolled').textContent).toBe('Courses');
		expect(screen.getByTestId('stat-unit-inProgress').textContent).toBe('Courses');
	});

	it('should render overall progress card', () => {
		render(ProgressSummary, { stats: mockStats });

		expect(screen.getByTestId('overall-progress-card')).toBeTruthy();
		expect(screen.getByTestId('overall-progress-label')).toBeTruthy();
		expect(screen.getByTestId('overall-progress-value')).toBeTruthy();
	});

	it('should display correct overall progress percentage', () => {
		render(ProgressSummary, { stats: mockStats });
		expect(screen.getByTestId('overall-progress-value').textContent).toBe('65%');
	});

	it('should accept custom className', () => {
		render(ProgressSummary, { stats: mockStats, class: 'custom-class' });
		const container = screen.getByTestId('progress-summary');
		expect(container.className).toContain('custom-class');
	});

	it('should handle zero values correctly', () => {
		const zeroStats: DashboardStats = {
			totalEnrolled: 0,
			inProgress: 0,
			completed: 0,
			notStarted: 0,
			overallCompletionPercentage: 0
		};

		render(ProgressSummary, { stats: zeroStats });
		expect(screen.getByTestId('stat-value-totalEnrolled').textContent).toBe('0');
		expect(screen.getByTestId('overall-progress-value').textContent).toBe('0%');
	});
});
