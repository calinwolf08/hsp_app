import type { CompletionData, ScormConfig } from '../types';

type ScormVersion = '1.2' | '2004';

interface ScormDataStore {
	[key: string]: string;
}

export class ScormAPI {
	private version: ScormVersion;
	private initialized: boolean = false;
	private terminated: boolean = false;
	private dataStore: ScormDataStore = {};
	private errorCode: string = '0';
	private onCompletion?: (data: CompletionData) => void;

	constructor(version: ScormVersion, onCompletion?: (data: CompletionData) => void) {
		this.version = version;
		this.onCompletion = onCompletion;
		this.initializeDefaults();
	}

	private initializeDefaults() {
		if (this.version === '1.2') {
			this.dataStore['cmi.core.lesson_status'] = 'not attempted';
			this.dataStore['cmi.core.score.raw'] = '';
			this.dataStore['cmi.core.score.min'] = '0';
			this.dataStore['cmi.core.score.max'] = '100';
			this.dataStore['cmi.core.session_time'] = '00:00:00';
		} else {
			// SCORM 2004
			this.dataStore['cmi.completion_status'] = 'not attempted';
			this.dataStore['cmi.success_status'] = 'unknown';
			this.dataStore['cmi.score.raw'] = '';
			this.dataStore['cmi.score.min'] = '0';
			this.dataStore['cmi.score.max'] = '100';
			this.dataStore['cmi.session_time'] = 'PT0H0M0S';
		}
	}

	// SCORM 1.2 Methods
	LMSInitialize(parameter: string): string {
		if (this.initialized) {
			this.setError('101'); // Already initialized
			return 'false';
		}
		if (this.terminated) {
			this.setError('101'); // Already terminated
			return 'false';
		}
		this.initialized = true;
		this.setError('0');
		return 'true';
	}

	LMSFinish(parameter: string): string {
		if (this.terminated) {
			this.setError('101'); // Already terminated
			return 'false';
		}
		if (!this.initialized) {
			this.setError('301'); // Not initialized
			return 'false';
		}

		this.terminated = true;
		this.initialized = false;

		// Trigger completion callback
		if (this.onCompletion) {
			const completionData = this.buildCompletionData();
			this.onCompletion(completionData);
		}

		this.setError('0');
		return 'true';
	}

	LMSGetValue(key: string): string {
		if (!this.initialized) {
			this.setError('301'); // Not initialized
			return '';
		}

		if (!this.isValidKey(key)) {
			this.setError('401'); // Invalid key
			return '';
		}

		this.setError('0');
		return this.dataStore[key] || '';
	}

	LMSSetValue(key: string, value: string): string {
		if (!this.initialized) {
			this.setError('301'); // Not initialized
			return 'false';
		}

		if (!this.isValidKey(key)) {
			this.setError('401'); // Invalid key
			return 'false';
		}

		this.dataStore[key] = value;
		this.setError('0');
		return 'true';
	}

	LMSCommit(parameter: string): string {
		if (!this.initialized) {
			this.setError('301'); // Not initialized
			return 'false';
		}

		// Commit data (in real implementation, this would save to server)
		this.setError('0');
		return 'true';
	}

	LMSGetLastError(): string {
		return this.errorCode;
	}

	LMSGetErrorString(errorCode: string): string {
		const errorStrings: { [key: string]: string } = {
			'0': 'No error',
			'101': 'General exception',
			'201': 'Invalid argument error',
			'301': 'Not initialized',
			'401': 'Not implemented error',
			'402': 'Invalid set value, element is a keyword',
			'403': 'Element is read only',
			'404': 'Element is write only'
		};
		return errorStrings[errorCode] || 'Unknown error';
	}

	LMSGetDiagnostic(errorCode: string): string {
		return this.LMSGetErrorString(errorCode);
	}

	// SCORM 2004 Methods (same as 1.2 but with different names)
	Initialize(parameter: string): string {
		return this.LMSInitialize(parameter);
	}

	Terminate(parameter: string): string {
		return this.LMSFinish(parameter);
	}

	GetValue(key: string): string {
		return this.LMSGetValue(key);
	}

	SetValue(key: string, value: string): string {
		return this.LMSSetValue(key, value);
	}

	Commit(parameter: string): string {
		return this.LMSCommit(parameter);
	}

	GetLastError(): string {
		return this.LMSGetLastError();
	}

	GetErrorString(errorCode: string): string {
		return this.LMSGetErrorString(errorCode);
	}

	GetDiagnostic(errorCode: string): string {
		return this.LMSGetDiagnostic(errorCode);
	}

	// Helper methods
	private setError(code: string) {
		this.errorCode = code;
	}

	private isValidKey(key: string): boolean {
		// Simplified validation - in real implementation, would check against full SCORM spec
		if (this.version === '1.2') {
			return key.startsWith('cmi.') || key.startsWith('adl.');
		} else {
			return key.startsWith('cmi.') || key.startsWith('adl.');
		}
	}

	private buildCompletionData(): CompletionData {
		if (this.version === '1.2') {
			const lessonStatus = this.dataStore['cmi.core.lesson_status'];
			const score = parseFloat(this.dataStore['cmi.core.score.raw']) || undefined;
			const maxScore = parseFloat(this.dataStore['cmi.core.score.max']) || undefined;

			return {
				scormData: {
					completionStatus: this.mapLessonStatusToCompletion(lessonStatus),
					successStatus: this.mapLessonStatusToSuccess(lessonStatus),
					score,
					maxScore,
					suspendData: this.dataStore['cmi.suspend_data']
				}
			};
		} else {
			// SCORM 2004
			const completionStatus = this.dataStore['cmi.completion_status'];
			const successStatus = this.dataStore['cmi.success_status'];
			const score = parseFloat(this.dataStore['cmi.score.raw']) || undefined;
			const maxScore = parseFloat(this.dataStore['cmi.score.max']) || undefined;

			return {
				scormData: {
					completionStatus: completionStatus as any,
					successStatus: successStatus as any,
					score,
					maxScore,
					suspendData: this.dataStore['cmi.suspend_data']
				}
			};
		}
	}

	private mapLessonStatusToCompletion(
		status: string
	): 'completed' | 'incomplete' | 'not attempted' {
		switch (status) {
			case 'completed':
			case 'passed':
				return 'completed';
			case 'incomplete':
			case 'failed':
				return 'incomplete';
			default:
				return 'not attempted';
		}
	}

	private mapLessonStatusToSuccess(status: string): 'passed' | 'failed' | 'unknown' {
		switch (status) {
			case 'passed':
				return 'passed';
			case 'failed':
				return 'failed';
			default:
				return 'unknown';
		}
	}

	// Public method to get current data
	getScormData(): CompletionData {
		return this.buildCompletionData();
	}

	// Public method to check if initialized
	isInitialized(): boolean {
		return this.initialized;
	}

	// Public method to check if terminated
	isTerminated(): boolean {
		return this.terminated;
	}
}

/**
 * Initialize SCORM API and attach to window
 */
export const initializeScormAPI = (
	version: ScormVersion,
	onCompletion?: (data: CompletionData) => void
): ScormAPI => {
	const api = new ScormAPI(version, onCompletion);

	// Attach to window for SCORM content to access
	if (typeof window !== 'undefined') {
		if (version === '1.2') {
			(window as any).API = api;
		} else {
			(window as any).API_1484_11 = api;
		}
	}

	return api;
};

/**
 * Clean up SCORM API from window
 */
export const cleanupScormAPI = (version: ScormVersion) => {
	if (typeof window !== 'undefined') {
		if (version === '1.2') {
			delete (window as any).API;
		} else {
			delete (window as any).API_1484_11;
		}
	}
};
