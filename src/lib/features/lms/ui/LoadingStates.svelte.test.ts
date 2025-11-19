import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/svelte';
import LoadingStates from './LoadingStates.svelte';

describe('LoadingStates', () => {
	afterEach(() => {
		cleanup();
	});

	it('should render CourseCardSkeleton variant', () => {
		const { getByTestId } = render(LoadingStates, { variant: 'course-card' });
		const skeleton = getByTestId('course-card-skeleton');
		expect(skeleton).toBeTruthy();
		expect(skeleton.className).toContain('overflow-hidden');
	});

	it('should render ProgressSkeleton variant', () => {
		const { getByTestId } = render(LoadingStates, { variant: 'progress' });
		const skeleton = getByTestId('progress-skeleton');
		expect(skeleton).toBeTruthy();
		const progressBar = skeleton.querySelector('.rounded-full');
		expect(progressBar).toBeTruthy();
	});

	it('should render ListSkeleton variant', () => {
		const { getByTestId } = render(LoadingStates, { variant: 'list' });
		const skeleton = getByTestId('list-skeleton');
		expect(skeleton).toBeTruthy();
		const avatar = skeleton.querySelector('.rounded-full');
		expect(avatar).toBeTruthy();
	});

	it('should render PlayerSkeleton variant', () => {
		const { getByTestId } = render(LoadingStates, { variant: 'player' });
		const skeleton = getByTestId('player-skeleton');
		expect(skeleton).toBeTruthy();
		expect(skeleton.className).toContain('flex');
	});

	it('should render default course-card variant', () => {
		const { getByTestId } = render(LoadingStates);
		const skeleton = getByTestId('course-card-skeleton');
		expect(skeleton).toBeTruthy();
	});

	it('should render list with custom count', () => {
		const { getByTestId } = render(LoadingStates, { variant: 'list', count: 5 });
		const skeleton = getByTestId('list-skeleton');
		const items = skeleton.querySelectorAll('.animate-pulse');
		expect(items.length).toBe(5);
	});

	it('should accept custom className', () => {
		const { getByTestId } = render(LoadingStates, {
			variant: 'course-card',
			class: 'custom-class'
		});
		const skeleton = getByTestId('course-card-skeleton');
		expect(skeleton.className).toContain('custom-class');
	});

	it('should have animate-pulse on all variants', () => {
		const variants = ['course-card', 'progress', 'list', 'player'] as const;

		variants.forEach((variant) => {
			const { getByTestId } = render(LoadingStates, { variant });
			const skeleton = getByTestId(`${variant}-skeleton`);
			const animatedElement = skeleton.querySelector('.animate-pulse');
			expect(animatedElement).toBeTruthy();
		});
	});
});
