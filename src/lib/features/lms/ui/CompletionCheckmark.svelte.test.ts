import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/svelte';
import CompletionCheckmark from './CompletionCheckmark.svelte';

describe('CompletionCheckmark', () => {
	afterEach(() => {
		cleanup();
	});

	it('should render with completed state', () => {
		render(CompletionCheckmark, { completed: true });
		const checkmark = screen.getByTestId('completion-checkmark');
		expect(checkmark.className).toContain('bg-dark-green');
		expect(checkmark.className).toContain('text-white');
	});

	it('should render with not completed state', () => {
		render(CompletionCheckmark, { completed: false });
		const checkmark = screen.getByTestId('completion-checkmark');
		expect(checkmark.className).toContain('border-2');
		expect(checkmark.className).toContain('border-gray-300');
	});

	it('should show check icon when completed', () => {
		render(CompletionCheckmark, { completed: true });
		const icon = screen.getByTestId('completion-checkmark-icon');
		expect(icon).toBeTruthy();
	});

	it('should not show check icon when not completed', () => {
		render(CompletionCheckmark, { completed: false });
		const icon = screen.queryByTestId('completion-checkmark-icon');
		expect(icon).toBeFalsy();
	});

	it('should apply size classes', () => {
		render(CompletionCheckmark, {
			completed: true,
			size: 'sm'
		});
		const checkmarkSm = screen.getByTestId('completion-checkmark');
		expect(checkmarkSm.className).toContain('h-4');
		expect(checkmarkSm.className).toContain('w-4');
		cleanup();

		render(CompletionCheckmark, {
			completed: true,
			size: 'md'
		});
		const checkmarkMd = screen.getByTestId('completion-checkmark');
		expect(checkmarkMd.className).toContain('h-5');
		expect(checkmarkMd.className).toContain('w-5');
		cleanup();

		render(CompletionCheckmark, {
			completed: true,
			size: 'lg'
		});
		const checkmarkLg = screen.getByTestId('completion-checkmark');
		expect(checkmarkLg.className).toContain('h-6');
		expect(checkmarkLg.className).toContain('w-6');
	});

	it('should show border by default when not completed', () => {
		render(CompletionCheckmark, { completed: false });
		const checkmark = screen.getByTestId('completion-checkmark');
		expect(checkmark.className).toContain('border-2');
	});

	it('should hide border when showBorder is false', () => {
		render(CompletionCheckmark, { completed: false, showBorder: false });
		const checkmark = screen.getByTestId('completion-checkmark');
		expect(checkmark.className).not.toContain('border-2');
		expect(checkmark.className).toContain('bg-gray-100');
	});

	it('should accept custom className', () => {
		render(CompletionCheckmark, {
			completed: true,
			class: 'custom-class'
		});
		const checkmark = screen.getByTestId('completion-checkmark');
		expect(checkmark.className).toContain('custom-class');
	});

	it('should have rounded-full class', () => {
		render(CompletionCheckmark, { completed: true });
		const checkmark = screen.getByTestId('completion-checkmark');
		expect(checkmark.className).toContain('rounded-full');
	});
});
