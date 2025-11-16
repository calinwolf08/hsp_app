import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/svelte';
import ProgressBar from './ProgressBar.svelte';

describe('ProgressBar', () => {
	afterEach(() => {
		cleanup();
	});

	it('should render with default props', () => {
		render(ProgressBar, { percentage: 50 });
		expect(screen.getByTestId('progress-bar-wrapper')).toBeTruthy();
	});

	it('should display correct width based on percentage', () => {
		render(ProgressBar, { percentage: 75 });
		const progressBarFill = screen.getByTestId('progress-bar-fill');
		expect(progressBarFill).toBeTruthy();
		expect(progressBarFill.getAttribute('style')).toContain('75%');
	});

	it('should clamp percentage to 0-100 range', () => {
		const { unmount } = render(ProgressBar, { percentage: 150 });
		let progressBarFill = screen.getByTestId('progress-bar-fill');
		expect(progressBarFill.getAttribute('style')).toContain('100%');
		unmount();

		render(ProgressBar, { percentage: -10 });
		progressBarFill = screen.getByTestId('progress-bar-fill');
		expect(progressBarFill.getAttribute('style')).toContain('0%');
	});

	it('should show label when showLabel is true', () => {
		render(ProgressBar, { percentage: 65, showLabel: true });
		const label = screen.getByTestId('progress-bar-label');
		expect(label).toBeTruthy();
		expect(label.textContent).toBe('65%');
	});

	it('should not show label by default', () => {
		render(ProgressBar, { percentage: 65 });
		expect(screen.queryByTestId('progress-bar-label')).toBeNull();
	});

	it('should apply size classes', () => {
		const { unmount } = render(ProgressBar, { percentage: 50, size: 'sm' });
		let track = screen.getByTestId('progress-bar-track');
		expect(track.className).toContain('h-1');
		unmount();

		render(ProgressBar, { percentage: 50, size: 'lg' });
		track = screen.getByTestId('progress-bar-track');
		expect(track.className).toContain('h-3');
	});

	it('should apply variant classes', () => {
		const { unmount } = render(ProgressBar, {
			percentage: 50,
			variant: 'default'
		});
		let fill = screen.getByTestId('progress-bar-fill');
		expect(fill.className).toContain('bg-light-orange');
		unmount();

		render(ProgressBar, {
			percentage: 50,
			variant: 'success'
		});
		fill = screen.getByTestId('progress-bar-fill');
		expect(fill.className).toContain('bg-dark-green');
	});

	it('should accept custom className', () => {
		render(ProgressBar, { percentage: 50, class: 'custom-class' });
		const wrapper = screen.getByTestId('progress-bar-wrapper');
		expect(wrapper.className).toContain('custom-class');
	});
});
