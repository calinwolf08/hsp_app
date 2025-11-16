import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
	formatDate,
	formatRelativeTime,
	formatDuration,
	formatPercentage,
	formatEnrollmentSource,
	formatActivityType
} from './formatters';

describe('Formatter Utils', () => {
	describe('formatDate', () => {
		it('should format ISO string to readable date', () => {
			const result = formatDate('2024-01-15T10:30:00Z');
			expect(result).toContain('January');
			expect(result).toContain('15');
			expect(result).toContain('2024');
		});
	});

	describe('formatRelativeTime', () => {
		beforeEach(() => {
			vi.useFakeTimers();
			vi.setSystemTime(new Date('2024-01-15T12:00:00Z'));
		});

		afterEach(() => {
			vi.useRealTimers();
		});

		it('should return "just now" for very recent times', () => {
			const thirtySecondsAgo = new Date('2024-01-15T11:59:30Z').toISOString();
			expect(formatRelativeTime(thirtySecondsAgo)).toBe('just now');
		});

		it('should format minutes ago', () => {
			const fiveMinutesAgo = new Date('2024-01-15T11:55:00Z').toISOString();
			expect(formatRelativeTime(fiveMinutesAgo)).toBe('5 minutes ago');
		});

		it('should format single minute ago', () => {
			const oneMinuteAgo = new Date('2024-01-15T11:59:00Z').toISOString();
			expect(formatRelativeTime(oneMinuteAgo)).toBe('1 minute ago');
		});

		it('should format hours ago', () => {
			const twoHoursAgo = new Date('2024-01-15T10:00:00Z').toISOString();
			expect(formatRelativeTime(twoHoursAgo)).toBe('2 hours ago');
		});

		it('should format days ago', () => {
			const threeDaysAgo = new Date('2024-01-12T12:00:00Z').toISOString();
			expect(formatRelativeTime(threeDaysAgo)).toBe('3 days ago');
		});

		it('should format months ago', () => {
			const twoMonthsAgo = new Date('2023-11-15T12:00:00Z').toISOString();
			expect(formatRelativeTime(twoMonthsAgo)).toBe('2 months ago');
		});

		it('should format years ago', () => {
			const oneYearAgo = new Date('2023-01-15T12:00:00Z').toISOString();
			expect(formatRelativeTime(oneYearAgo)).toBe('1 year ago');
		});
	});

	describe('formatDuration', () => {
		it('should format seconds only', () => {
			expect(formatDuration(45)).toBe('45s');
		});

		it('should format minutes and seconds', () => {
			expect(formatDuration(90)).toBe('1m 30s');
		});

		it('should format minutes without seconds', () => {
			expect(formatDuration(120)).toBe('2m');
		});

		it('should format hours and minutes', () => {
			expect(formatDuration(3690)).toBe('1h 1m');
		});

		it('should format hours without minutes', () => {
			expect(formatDuration(7200)).toBe('2h');
		});
	});

	describe('formatPercentage', () => {
		it('should format percentage with rounded value', () => {
			expect(formatPercentage(75)).toBe('75%');
			expect(formatPercentage(33.33)).toBe('33%');
			expect(formatPercentage(66.67)).toBe('67%');
		});

		it('should handle zero and 100', () => {
			expect(formatPercentage(0)).toBe('0%');
			expect(formatPercentage(100)).toBe('100%');
		});
	});

	describe('formatEnrollmentSource', () => {
		it('should format enrollment sources', () => {
			expect(formatEnrollmentSource('direct')).toBe('Direct Enrollment');
			expect(formatEnrollmentSource('bundle')).toBe('Bundle');
			expect(formatEnrollmentSource('learning-path')).toBe('Learning Path');
		});
	});

	describe('formatActivityType', () => {
		it('should format activity types', () => {
			expect(formatActivityType('scorm')).toBe('SCORM');
			expect(formatActivityType('survey')).toBe('Survey');
			expect(formatActivityType('video')).toBe('Video');
			expect(formatActivityType('document')).toBe('Document');
		});
	});
});
