import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/svelte';
import DashboardPage from './+page.svelte';
import type { PageData } from './$types';
import type { DashboardData } from '$lib/features/lms/dashboard/types';

describe('Dashboard Page', () => {
	afterEach(() => {
		cleanup();
	});

	const mockDashboardData: DashboardData = {
		stats: {
			totalEnrolled: 3,
			inProgress: 1,
			completed: 1,
			notStarted: 1,
			overallCompletionPercentage: 50
		},
		continueLearning: null,
		courses: []
	};

	const mockPageData: PageData = {
		dashboardData: mockDashboardData
	};

	it('should render page title and description', () => {
		render(DashboardPage, { data: mockPageData });

		expect(screen.getByTestId('page-title')).toBeTruthy();
		expect(screen.getByTestId('page-title').textContent).toContain('My Dashboard');
		expect(screen.getByTestId('page-description')).toBeTruthy();
	});

	it('should render DashboardOverview component', () => {
		render(DashboardPage, { data: mockPageData });

		expect(screen.getByTestId('dashboard-overview')).toBeTruthy();
	});

	it('should display error state when error exists', () => {
		const dataWithError: PageData = {
			...mockPageData,
			error: 'Failed to load dashboard data'
		};

		render(DashboardPage, { data: dataWithError });

		expect(screen.getByTestId('error-state')).toBeTruthy();
	});

	it('should not display error state when no error', () => {
		render(DashboardPage, { data: mockPageData });

		expect(screen.queryByTestId('error-state')).toBeNull();
	});

	it('should pass dashboard data to DashboardOverview', () => {
		render(DashboardPage, { data: mockPageData });

		const overview = screen.getByTestId('dashboard-overview');
		expect(overview).toBeTruthy();

		// Check that stats are rendered
		expect(screen.getByTestId('stat-value-totalEnrolled').textContent).toBe('3');
	});
});
