import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ScormAPI, initializeScormAPI, cleanupScormAPI } from './scorm-api';
import type { CompletionData } from '../types';

describe('ScormAPI', () => {
	describe('SCORM 1.2', () => {
		let api: ScormAPI;

		beforeEach(() => {
			api = new ScormAPI('1.2');
		});

		describe('LMSInitialize', () => {
			it('should initialize successfully when not already initialized', () => {
				const result = api.LMSInitialize('');
				expect(result).toBe('true');
				expect(api.isInitialized()).toBe(true);
				expect(api.LMSGetLastError()).toBe('0');
			});

			it('should fail if already initialized', () => {
				api.LMSInitialize('');
				const result = api.LMSInitialize('');
				expect(result).toBe('false');
				expect(api.LMSGetLastError()).toBe('101');
			});

			it('should fail if already terminated', () => {
				api.LMSInitialize('');
				api.LMSFinish('');
				const result = api.LMSInitialize('');
				expect(result).toBe('false');
				expect(api.LMSGetLastError()).toBe('101');
			});
		});

		describe('LMSFinish', () => {
			it('should finish successfully when initialized', () => {
				api.LMSInitialize('');
				const result = api.LMSFinish('');
				expect(result).toBe('true');
				expect(api.isTerminated()).toBe(true);
				expect(api.isInitialized()).toBe(false);
				expect(api.LMSGetLastError()).toBe('0');
			});

			it('should fail if not initialized', () => {
				const result = api.LMSFinish('');
				expect(result).toBe('false');
				expect(api.LMSGetLastError()).toBe('301');
			});

			it('should fail if already terminated', () => {
				api.LMSInitialize('');
				api.LMSFinish('');
				const result = api.LMSFinish('');
				expect(result).toBe('false');
				expect(api.LMSGetLastError()).toBe('101');
			});

			it('should trigger completion callback with correct data', () => {
				const onCompletion = vi.fn();
				api = new ScormAPI('1.2', onCompletion);
				api.LMSInitialize('');
				api.LMSSetValue('cmi.core.lesson_status', 'completed');
				api.LMSSetValue('cmi.core.score.raw', '85');
				api.LMSFinish('');

				expect(onCompletion).toHaveBeenCalledTimes(1);
				const completionData: CompletionData = onCompletion.mock.calls[0][0];
				expect(completionData.scormData?.completionStatus).toBe('completed');
				expect(completionData.scormData?.score).toBe(85);
			});
		});

		describe('LMSGetValue', () => {
			it('should get default values', () => {
				api.LMSInitialize('');
				expect(api.LMSGetValue('cmi.core.lesson_status')).toBe('not attempted');
				expect(api.LMSGetValue('cmi.core.score.min')).toBe('0');
				expect(api.LMSGetValue('cmi.core.score.max')).toBe('100');
			});

			it('should get set values', () => {
				api.LMSInitialize('');
				api.LMSSetValue('cmi.core.lesson_status', 'completed');
				expect(api.LMSGetValue('cmi.core.lesson_status')).toBe('completed');
			});

			it('should fail if not initialized', () => {
				const result = api.LMSGetValue('cmi.core.lesson_status');
				expect(result).toBe('');
				expect(api.LMSGetLastError()).toBe('301');
			});

			it('should fail for invalid keys', () => {
				api.LMSInitialize('');
				const result = api.LMSGetValue('invalid.key');
				expect(result).toBe('');
				expect(api.LMSGetLastError()).toBe('401');
			});

			it('should return empty string for unset values', () => {
				api.LMSInitialize('');
				expect(api.LMSGetValue('cmi.suspend_data')).toBe('');
			});
		});

		describe('LMSSetValue', () => {
			it('should set values successfully', () => {
				api.LMSInitialize('');
				const result = api.LMSSetValue('cmi.core.lesson_status', 'completed');
				expect(result).toBe('true');
				expect(api.LMSGetValue('cmi.core.lesson_status')).toBe('completed');
				expect(api.LMSGetLastError()).toBe('0');
			});

			it('should fail if not initialized', () => {
				const result = api.LMSSetValue('cmi.core.lesson_status', 'completed');
				expect(result).toBe('false');
				expect(api.LMSGetLastError()).toBe('301');
			});

			it('should fail for invalid keys', () => {
				api.LMSInitialize('');
				const result = api.LMSSetValue('invalid.key', 'value');
				expect(result).toBe('false');
				expect(api.LMSGetLastError()).toBe('401');
			});

			it('should set score values', () => {
				api.LMSInitialize('');
				api.LMSSetValue('cmi.core.score.raw', '95');
				api.LMSSetValue('cmi.core.score.max', '100');
				expect(api.LMSGetValue('cmi.core.score.raw')).toBe('95');
				expect(api.LMSGetValue('cmi.core.score.max')).toBe('100');
			});
		});

		describe('LMSCommit', () => {
			it('should commit successfully when initialized', () => {
				api.LMSInitialize('');
				const result = api.LMSCommit('');
				expect(result).toBe('true');
				expect(api.LMSGetLastError()).toBe('0');
			});

			it('should fail if not initialized', () => {
				const result = api.LMSCommit('');
				expect(result).toBe('false');
				expect(api.LMSGetLastError()).toBe('301');
			});
		});

		describe('Error handling', () => {
			it('should return correct error strings', () => {
				expect(api.LMSGetErrorString('0')).toBe('No error');
				expect(api.LMSGetErrorString('101')).toBe('General exception');
				expect(api.LMSGetErrorString('301')).toBe('Not initialized');
				expect(api.LMSGetErrorString('401')).toBe('Not implemented error');
			});

			it('should return unknown error for invalid codes', () => {
				expect(api.LMSGetErrorString('999')).toBe('Unknown error');
			});

			it('should provide diagnostics', () => {
				expect(api.LMSGetDiagnostic('301')).toBe('Not initialized');
			});
		});

		describe('Completion data building', () => {
			it('should build completion data for completed lesson', () => {
				const onCompletion = vi.fn();
				api = new ScormAPI('1.2', onCompletion);
				api.LMSInitialize('');
				api.LMSSetValue('cmi.core.lesson_status', 'completed');
				api.LMSSetValue('cmi.core.score.raw', '90');
				api.LMSSetValue('cmi.core.score.max', '100');
				api.LMSSetValue('cmi.suspend_data', 'test-data');
				api.LMSFinish('');

				const completionData: CompletionData = onCompletion.mock.calls[0][0];
				expect(completionData.scormData?.completionStatus).toBe('completed');
				expect(completionData.scormData?.successStatus).toBe('unknown');
				expect(completionData.scormData?.score).toBe(90);
				expect(completionData.scormData?.maxScore).toBe(100);
				expect(completionData.scormData?.suspendData).toBe('test-data');
			});

			it('should build completion data for passed lesson', () => {
				const onCompletion = vi.fn();
				api = new ScormAPI('1.2', onCompletion);
				api.LMSInitialize('');
				api.LMSSetValue('cmi.core.lesson_status', 'passed');
				api.LMSFinish('');

				const completionData: CompletionData = onCompletion.mock.calls[0][0];
				expect(completionData.scormData?.completionStatus).toBe('completed');
				expect(completionData.scormData?.successStatus).toBe('passed');
			});

			it('should build completion data for failed lesson', () => {
				const onCompletion = vi.fn();
				api = new ScormAPI('1.2', onCompletion);
				api.LMSInitialize('');
				api.LMSSetValue('cmi.core.lesson_status', 'failed');
				api.LMSFinish('');

				const completionData: CompletionData = onCompletion.mock.calls[0][0];
				expect(completionData.scormData?.completionStatus).toBe('incomplete');
				expect(completionData.scormData?.successStatus).toBe('failed');
			});

			it('should handle undefined scores', () => {
				const onCompletion = vi.fn();
				api = new ScormAPI('1.2', onCompletion);
				api.LMSInitialize('');
				api.LMSSetValue('cmi.core.lesson_status', 'completed');
				api.LMSFinish('');

				const completionData: CompletionData = onCompletion.mock.calls[0][0];
				expect(completionData.scormData?.score).toBeUndefined();
				expect(completionData.scormData?.maxScore).toBe(100);
			});
		});

		describe('Public methods', () => {
			it('should get current SCORM data', () => {
				api.LMSInitialize('');
				api.LMSSetValue('cmi.core.lesson_status', 'completed');
				api.LMSSetValue('cmi.core.score.raw', '75');

				const data = api.getScormData();
				expect(data.scormData?.completionStatus).toBe('completed');
				expect(data.scormData?.score).toBe(75);
			});

			it('should check initialization state', () => {
				expect(api.isInitialized()).toBe(false);
				api.LMSInitialize('');
				expect(api.isInitialized()).toBe(true);
			});

			it('should check termination state', () => {
				expect(api.isTerminated()).toBe(false);
				api.LMSInitialize('');
				api.LMSFinish('');
				expect(api.isTerminated()).toBe(true);
			});
		});
	});

	describe('SCORM 2004', () => {
		let api: ScormAPI;

		beforeEach(() => {
			api = new ScormAPI('2004');
		});

		describe('Initialize', () => {
			it('should initialize successfully', () => {
				const result = api.Initialize('');
				expect(result).toBe('true');
				expect(api.isInitialized()).toBe(true);
				expect(api.GetLastError()).toBe('0');
			});

			it('should fail if already initialized', () => {
				api.Initialize('');
				const result = api.Initialize('');
				expect(result).toBe('false');
				expect(api.GetLastError()).toBe('101');
			});
		});

		describe('Terminate', () => {
			it('should terminate successfully when initialized', () => {
				api.Initialize('');
				const result = api.Terminate('');
				expect(result).toBe('true');
				expect(api.isTerminated()).toBe(true);
				expect(api.isInitialized()).toBe(false);
			});

			it('should fail if not initialized', () => {
				const result = api.Terminate('');
				expect(result).toBe('false');
				expect(api.GetLastError()).toBe('301');
			});

			it('should trigger completion callback', () => {
				const onCompletion = vi.fn();
				api = new ScormAPI('2004', onCompletion);
				api.Initialize('');
				api.SetValue('cmi.completion_status', 'completed');
				api.SetValue('cmi.success_status', 'passed');
				api.Terminate('');

				expect(onCompletion).toHaveBeenCalledTimes(1);
				const completionData: CompletionData = onCompletion.mock.calls[0][0];
				expect(completionData.scormData?.completionStatus).toBe('completed');
				expect(completionData.scormData?.successStatus).toBe('passed');
			});
		});

		describe('GetValue', () => {
			it('should get default values', () => {
				api.Initialize('');
				expect(api.GetValue('cmi.completion_status')).toBe('not attempted');
				expect(api.GetValue('cmi.success_status')).toBe('unknown');
				expect(api.GetValue('cmi.score.min')).toBe('0');
				expect(api.GetValue('cmi.score.max')).toBe('100');
			});

			it('should get set values', () => {
				api.Initialize('');
				api.SetValue('cmi.completion_status', 'completed');
				expect(api.GetValue('cmi.completion_status')).toBe('completed');
			});

			it('should fail if not initialized', () => {
				const result = api.GetValue('cmi.completion_status');
				expect(result).toBe('');
				expect(api.GetLastError()).toBe('301');
			});

			it('should fail for invalid keys', () => {
				api.Initialize('');
				const result = api.GetValue('invalid.key');
				expect(result).toBe('');
				expect(api.GetLastError()).toBe('401');
			});
		});

		describe('SetValue', () => {
			it('should set values successfully', () => {
				api.Initialize('');
				const result = api.SetValue('cmi.completion_status', 'completed');
				expect(result).toBe('true');
				expect(api.GetValue('cmi.completion_status')).toBe('completed');
			});

			it('should fail if not initialized', () => {
				const result = api.SetValue('cmi.completion_status', 'completed');
				expect(result).toBe('false');
				expect(api.GetLastError()).toBe('301');
			});

			it('should fail for invalid keys', () => {
				api.Initialize('');
				const result = api.SetValue('invalid.key', 'value');
				expect(result).toBe('false');
				expect(api.GetLastError()).toBe('401');
			});

			it('should set score and success status', () => {
				api.Initialize('');
				api.SetValue('cmi.score.raw', '88');
				api.SetValue('cmi.success_status', 'passed');
				expect(api.GetValue('cmi.score.raw')).toBe('88');
				expect(api.GetValue('cmi.success_status')).toBe('passed');
			});
		});

		describe('Commit', () => {
			it('should commit successfully when initialized', () => {
				api.Initialize('');
				const result = api.Commit('');
				expect(result).toBe('true');
				expect(api.GetLastError()).toBe('0');
			});

			it('should fail if not initialized', () => {
				const result = api.Commit('');
				expect(result).toBe('false');
				expect(api.GetLastError()).toBe('301');
			});
		});

		describe('Completion data building', () => {
			it('should build completion data with all fields', () => {
				const onCompletion = vi.fn();
				api = new ScormAPI('2004', onCompletion);
				api.Initialize('');
				api.SetValue('cmi.completion_status', 'completed');
				api.SetValue('cmi.success_status', 'passed');
				api.SetValue('cmi.score.raw', '92');
				api.SetValue('cmi.score.max', '100');
				api.SetValue('cmi.suspend_data', 'user-progress-data');
				api.Terminate('');

				const completionData: CompletionData = onCompletion.mock.calls[0][0];
				expect(completionData.scormData?.completionStatus).toBe('completed');
				expect(completionData.scormData?.successStatus).toBe('passed');
				expect(completionData.scormData?.score).toBe(92);
				expect(completionData.scormData?.maxScore).toBe(100);
				expect(completionData.scormData?.suspendData).toBe('user-progress-data');
			});

			it('should handle incomplete status', () => {
				const onCompletion = vi.fn();
				api = new ScormAPI('2004', onCompletion);
				api.Initialize('');
				api.SetValue('cmi.completion_status', 'incomplete');
				api.SetValue('cmi.success_status', 'unknown');
				api.Terminate('');

				const completionData: CompletionData = onCompletion.mock.calls[0][0];
				expect(completionData.scormData?.completionStatus).toBe('incomplete');
				expect(completionData.scormData?.successStatus).toBe('unknown');
			});
		});
	});

	describe('initializeScormAPI', () => {
		let windowSpy: any;

		beforeEach(() => {
			// Store original window properties
			windowSpy = {
				API: (globalThis.window as any)?.API,
				API_1484_11: (globalThis.window as any)?.API_1484_11
			};
		});

		afterEach(() => {
			// Cleanup
			cleanupScormAPI('1.2');
			cleanupScormAPI('2004');
		});

		it.skipIf(typeof window === 'undefined')('should attach SCORM 1.2 API to window as API', () => {
			const api = initializeScormAPI('1.2');
			expect((window as any).API).toBe(api);
		});

		it.skipIf(typeof window === 'undefined')('should attach SCORM 2004 API to window as API_1484_11', () => {
			const api = initializeScormAPI('2004');
			expect((window as any).API_1484_11).toBe(api);
		});

		it('should accept completion callback', () => {
			const onCompletion = vi.fn();
			const api = initializeScormAPI('1.2', onCompletion);
			api.LMSInitialize('');
			api.LMSSetValue('cmi.core.lesson_status', 'completed');
			api.LMSFinish('');

			expect(onCompletion).toHaveBeenCalled();
		});
	});

	describe('cleanupScormAPI', () => {
		it.skipIf(typeof window === 'undefined')('should remove SCORM 1.2 API from window', () => {
			initializeScormAPI('1.2');
			cleanupScormAPI('1.2');
			expect((window as any).API).toBeUndefined();
		});

		it.skipIf(typeof window === 'undefined')('should remove SCORM 2004 API from window', () => {
			initializeScormAPI('2004');
			cleanupScormAPI('2004');
			expect((window as any).API_1484_11).toBeUndefined();
		});
	});
});
