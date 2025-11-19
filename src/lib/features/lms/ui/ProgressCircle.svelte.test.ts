import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/svelte';
import ProgressCircle from './ProgressCircle.svelte';

describe('ProgressCircle', () => {
	afterEach(() => {
		cleanup();
	});

	it('should render SVG element', () => {
		render(ProgressCircle, { percentage: 50 });
		const svg = screen.getByTestId('progress-circle-svg');
		expect(svg).toBeTruthy();
	});

	it('should render with default size', () => {
		render(ProgressCircle, { percentage: 50 });
		const svg = screen.getByTestId('progress-circle-svg');
		expect(svg.getAttribute('width')).toBe('100');
		expect(svg.getAttribute('height')).toBe('100');
	});

	it('should render with custom size', () => {
		render(ProgressCircle, { percentage: 50, size: 150 });
		const svg = screen.getByTestId('progress-circle-svg');
		expect(svg.getAttribute('width')).toBe('150');
		expect(svg.getAttribute('height')).toBe('150');
	});

	it('should show label by default', () => {
		render(ProgressCircle, { percentage: 75 });
		const label = screen.getByTestId('progress-circle-label');
		expect(label.textContent).toContain('75%');
	});

	it('should hide label when showLabel is false', () => {
		render(ProgressCircle, { percentage: 75, showLabel: false });
		const label = screen.queryByTestId('progress-circle-label');
		expect(label).toBeFalsy();
	});

	it('should clamp percentage to 0-100 range', () => {
		render(ProgressCircle, { percentage: 150 });
		expect(screen.getByTestId('progress-circle-label').textContent).toContain('100%');
		cleanup();

		render(ProgressCircle, { percentage: -10 });
		expect(screen.getByTestId('progress-circle-label').textContent).toContain('0%');
	});

	it('should render two circles (background and progress)', () => {
		render(ProgressCircle, { percentage: 50 });
		const background = screen.getByTestId('progress-circle-background');
		const progress = screen.getByTestId('progress-circle-progress');
		expect(background).toBeTruthy();
		expect(progress).toBeTruthy();
	});

	it('should apply custom className', () => {
		const { container } = render(ProgressCircle, { percentage: 50, class: 'custom-class' });
		const wrapper = container.querySelector('div');
		expect(wrapper?.className).toContain('custom-class');
	});

	it('should calculate correct SVG properties', () => {
		render(ProgressCircle, { percentage: 50, size: 100, strokeWidth: 8 });
		const progressCircle = screen.getByTestId('progress-circle-progress');

		// Radius should be (size - strokeWidth) / 2 = (100 - 8) / 2 = 46
		expect(progressCircle.getAttribute('r')).toBe('46');
		// Center should be size / 2 = 50
		expect(progressCircle.getAttribute('cx')).toBe('50');
		expect(progressCircle.getAttribute('cy')).toBe('50');
	});
});
