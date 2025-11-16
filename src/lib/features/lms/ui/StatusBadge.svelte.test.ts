import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/svelte';
import StatusBadge from './StatusBadge.svelte';

describe('StatusBadge', () => {
	afterEach(() => {
		cleanup();
	});

	it('should render with not-started status', () => {
		render(StatusBadge, { status: 'not-started' });
		const badge = screen.getByTestId('status-badge');
		expect(badge.textContent).toContain('Not Started');
		expect(badge.className).toContain('bg-gray-100');
		expect(badge.className).toContain('text-gray-700');
	});

	it('should render with in-progress status', () => {
		render(StatusBadge, { status: 'in-progress' });
		const badge = screen.getByTestId('status-badge');
		expect(badge.textContent).toContain('In Progress');
		expect(badge.className).toContain('bg-blue-100');
		expect(badge.className).toContain('text-blue-700');
	});

	it('should render with completed status', () => {
		render(StatusBadge, { status: 'completed' });
		const badge = screen.getByTestId('status-badge');
		expect(badge.textContent).toContain('Completed');
		expect(badge.className).toContain('bg-green-100');
		expect(badge.className).toContain('text-green-700');
	});

	it('should apply size classes', () => {
		render(StatusBadge, { status: 'completed', size: 'sm' });
		const badgeSm = screen.getByTestId('status-badge');
		expect(badgeSm.className).toContain('px-2');
		expect(badgeSm.className).toContain('text-xs');
		cleanup();

		render(StatusBadge, { status: 'completed', size: 'md' });
		const badgeMd = screen.getByTestId('status-badge');
		expect(badgeMd.className).toContain('px-2.5');
		expect(badgeMd.className).toContain('text-sm');
		cleanup();

		render(StatusBadge, { status: 'completed', size: 'lg' });
		const badgeLg = screen.getByTestId('status-badge');
		expect(badgeLg.className).toContain('px-3');
		expect(badgeLg.className).toContain('text-base');
	});

	it('should accept custom className', () => {
		render(StatusBadge, { status: 'completed', class: 'custom-class' });
		const badge = screen.getByTestId('status-badge');
		expect(badge.className).toContain('custom-class');
	});

	it('should have rounded-full and border classes', () => {
		render(StatusBadge, { status: 'completed' });
		const badge = screen.getByTestId('status-badge');
		expect(badge.className).toContain('rounded-full');
		expect(badge.className).toContain('border');
	});
});
