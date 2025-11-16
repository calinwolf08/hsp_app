import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
	shouldMarkComplete,
	validateCompletion,
	getCompletionTimestamp,
	buildCompletionPayload,
	calculateActivityCompletion
} from './activity-completion';
import type { CompletionData } from '../types';

describe('Activity Completion Utils', () => {
	describe('shouldMarkComplete', () => {
		it('should return true for completed SCORM activity', () => {
			const data: CompletionData = {
				scormData: {
					completionStatus: 'completed',
					successStatus: 'unknown'
				}
			};
			expect(shouldMarkComplete('scorm', data)).toBe(true);
		});

		it('should return true for passed SCORM activity', () => {
			const data: CompletionData = {
				scormData: {
					completionStatus: 'incomplete',
					successStatus: 'passed'
				}
			};
			expect(shouldMarkComplete('scorm', data)).toBe(true);
		});

		it('should return false for incomplete SCORM activity', () => {
			const data: CompletionData = {
				scormData: {
					completionStatus: 'incomplete',
					successStatus: 'unknown'
				}
			};
			expect(shouldMarkComplete('scorm', data)).toBe(false);
		});

		it('should return true for completed video', () => {
			const data: CompletionData = {
				videoData: {
					watchedSeconds: 100,
					totalSeconds: 100,
					watchedPercentage: 100,
					completed: true
				}
			};
			expect(shouldMarkComplete('video', data)).toBe(true);
		});

		it('should return false for incomplete video', () => {
			const data: CompletionData = {
				videoData: {
					watchedSeconds: 50,
					totalSeconds: 100,
					watchedPercentage: 50,
					completed: false
				}
			};
			expect(shouldMarkComplete('video', data)).toBe(false);
		});

		it('should return true for completed document', () => {
			const data: CompletionData = {
				documentData: {
					viewedPages: 10,
					totalPages: 10,
					viewTimeSeconds: 300,
					completed: true
				}
			};
			expect(shouldMarkComplete('document', data)).toBe(true);
		});

		it('should return true for submitted survey', () => {
			const data: CompletionData = {
				surveyData: {
					submitted: true,
					answeredQuestions: 5,
					totalQuestions: 5
				}
			};
			expect(shouldMarkComplete('survey', data)).toBe(true);
		});

		it('should return false for unsubmitted survey', () => {
			const data: CompletionData = {
				surveyData: {
					submitted: false
				}
			};
			expect(shouldMarkComplete('survey', data)).toBe(false);
		});
	});

	describe('validateCompletion', () => {
		describe('SCORM validation', () => {
			it('should validate correct SCORM data', () => {
				const data: CompletionData = {
					scormData: {
						completionStatus: 'completed',
						score: 80,
						maxScore: 100
					}
				};
				const result = validateCompletion('scorm', data);
				expect(result.valid).toBe(true);
				expect(result.errors).toHaveLength(0);
			});

			it('should reject missing SCORM data', () => {
				const data: CompletionData = {};
				const result = validateCompletion('scorm', data);
				expect(result.valid).toBe(false);
				expect(result.errors).toContain('SCORM data is required');
			});

			it('should reject SCORM data without completion status', () => {
				const data: CompletionData = {
					scormData: {
						completionStatus: undefined as any
					}
				};
				const result = validateCompletion('scorm', data);
				expect(result.valid).toBe(false);
				expect(result.errors).toContain('SCORM completion status is required');
			});

			it('should reject score exceeding max score', () => {
				const data: CompletionData = {
					scormData: {
						completionStatus: 'completed',
						score: 110,
						maxScore: 100
					}
				};
				const result = validateCompletion('scorm', data);
				expect(result.valid).toBe(false);
				expect(result.errors).toContain('SCORM score cannot exceed max score');
			});
		});

		describe('Video validation', () => {
			it('should validate correct video data', () => {
				const data: CompletionData = {
					videoData: {
						watchedSeconds: 80,
						totalSeconds: 100,
						watchedPercentage: 80,
						completed: false
					}
				};
				const result = validateCompletion('video', data);
				expect(result.valid).toBe(true);
				expect(result.errors).toHaveLength(0);
			});

			it('should reject missing video data', () => {
				const data: CompletionData = {};
				const result = validateCompletion('video', data);
				expect(result.valid).toBe(false);
				expect(result.errors).toContain('Video data is required');
			});

			it('should reject negative time values', () => {
				const data: CompletionData = {
					videoData: {
						watchedSeconds: -10,
						totalSeconds: 100,
						watchedPercentage: 0,
						completed: false
					}
				};
				const result = validateCompletion('video', data);
				expect(result.valid).toBe(false);
				expect(result.errors).toContain('Video time values must be positive');
			});

			it('should reject watched time exceeding total', () => {
				const data: CompletionData = {
					videoData: {
						watchedSeconds: 120,
						totalSeconds: 100,
						watchedPercentage: 120,
						completed: false
					}
				};
				const result = validateCompletion('video', data);
				expect(result.valid).toBe(false);
				expect(result.errors).toContain('Watched time cannot exceed total time');
			});

			it('should reject invalid percentage', () => {
				const data: CompletionData = {
					videoData: {
						watchedSeconds: 50,
						totalSeconds: 100,
						watchedPercentage: 150,
						completed: false
					}
				};
				const result = validateCompletion('video', data);
				expect(result.valid).toBe(false);
				expect(result.errors).toContain('Watch percentage must be between 0 and 100');
			});
		});

		describe('Document validation', () => {
			it('should validate correct document data', () => {
				const data: CompletionData = {
					documentData: {
						viewedPages: 5,
						totalPages: 10,
						viewTimeSeconds: 120,
						completed: false
					}
				};
				const result = validateCompletion('document', data);
				expect(result.valid).toBe(true);
				expect(result.errors).toHaveLength(0);
			});

			it('should reject missing document data', () => {
				const data: CompletionData = {};
				const result = validateCompletion('document', data);
				expect(result.valid).toBe(false);
				expect(result.errors).toContain('Document data is required');
			});

			it('should reject viewed pages exceeding total', () => {
				const data: CompletionData = {
					documentData: {
						viewedPages: 15,
						totalPages: 10,
						viewTimeSeconds: 120,
						completed: false
					}
				};
				const result = validateCompletion('document', data);
				expect(result.valid).toBe(false);
				expect(result.errors).toContain('Viewed pages cannot exceed total pages');
			});

			it('should reject negative view time', () => {
				const data: CompletionData = {
					documentData: {
						viewedPages: 5,
						totalPages: 10,
						viewTimeSeconds: -10,
						completed: false
					}
				};
				const result = validateCompletion('document', data);
				expect(result.valid).toBe(false);
				expect(result.errors).toContain('View time must be positive');
			});
		});

		describe('Survey validation', () => {
			it('should validate correct survey data', () => {
				const data: CompletionData = {
					surveyData: {
						submitted: true,
						answeredQuestions: 3,
						totalQuestions: 5
					}
				};
				const result = validateCompletion('survey', data);
				expect(result.valid).toBe(true);
				expect(result.errors).toHaveLength(0);
			});

			it('should reject missing survey data', () => {
				const data: CompletionData = {};
				const result = validateCompletion('survey', data);
				expect(result.valid).toBe(false);
				expect(result.errors).toContain('Survey data is required');
			});

			it('should reject answered exceeding total questions', () => {
				const data: CompletionData = {
					surveyData: {
						submitted: true,
						answeredQuestions: 8,
						totalQuestions: 5
					}
				};
				const result = validateCompletion('survey', data);
				expect(result.valid).toBe(false);
				expect(result.errors).toContain(
					'Answered questions cannot exceed total questions'
				);
			});
		});
	});

	describe('getCompletionTimestamp', () => {
		beforeEach(() => {
			vi.useFakeTimers();
		});

		afterEach(() => {
			vi.useRealTimers();
		});

		it('should return ISO timestamp', () => {
			const fixedDate = new Date('2024-01-15T10:30:00Z');
			vi.setSystemTime(fixedDate);

			const timestamp = getCompletionTimestamp();
			expect(timestamp).toBe('2024-01-15T10:30:00.000Z');
		});
	});

	describe('buildCompletionPayload', () => {
		it('should build payload for completed SCORM activity', () => {
			const data: CompletionData = {
				scormData: {
					completionStatus: 'completed',
					successStatus: 'passed'
				},
				startedAt: '2024-01-15T10:00:00Z'
			};

			const payload = buildCompletionPayload('user-1', 'activity-1', data);

			expect(payload.user).toBe('user-1');
			expect(payload.activity).toBe('activity-1');
			expect(payload.status).toBe('completed');
			expect(payload.completedAt).toBeDefined();
		});

		it('should build payload for in-progress video', () => {
			const data: CompletionData = {
				videoData: {
					watchedSeconds: 50,
					totalSeconds: 100,
					watchedPercentage: 50,
					completed: false
				},
				startedAt: '2024-01-15T10:00:00Z'
			};

			const payload = buildCompletionPayload('user-1', 'activity-1', data);

			expect(payload.status).toBe('in-progress');
			expect(payload.startedAt).toBe('2024-01-15T10:00:00Z');
			expect(payload.completedAt).toBeUndefined();
		});

		it('should use provided completedAt timestamp', () => {
			const data: CompletionData = {
				surveyData: {
					submitted: true
				},
				completedAt: '2024-01-15T11:00:00Z'
			};

			const payload = buildCompletionPayload('user-1', 'activity-1', data);

			expect(payload.completedAt).toBe('2024-01-15T11:00:00Z');
		});
	});

	describe('calculateActivityCompletion', () => {
		it('should return 100% for completed SCORM', () => {
			const data: CompletionData = {
				scormData: {
					completionStatus: 'completed',
					successStatus: 'passed'
				}
			};
			expect(calculateActivityCompletion('scorm', data)).toBe(100);
		});

		it('should return 50% for incomplete SCORM', () => {
			const data: CompletionData = {
				scormData: {
					completionStatus: 'incomplete',
					successStatus: 'unknown'
				}
			};
			expect(calculateActivityCompletion('scorm', data)).toBe(50);
		});

		it('should return 0% for not attempted SCORM', () => {
			const data: CompletionData = {
				scormData: {
					completionStatus: 'not attempted',
					successStatus: 'unknown'
				}
			};
			expect(calculateActivityCompletion('scorm', data)).toBe(0);
		});

		it('should return video watch percentage', () => {
			const data: CompletionData = {
				videoData: {
					watchedSeconds: 75,
					totalSeconds: 100,
					watchedPercentage: 75,
					completed: false
				}
			};
			expect(calculateActivityCompletion('video', data)).toBe(75);
		});

		it('should calculate document completion percentage', () => {
			const data: CompletionData = {
				documentData: {
					viewedPages: 7,
					totalPages: 10,
					viewTimeSeconds: 200,
					completed: false
				}
			};
			expect(calculateActivityCompletion('document', data)).toBe(70);
		});

		it('should return 100% for submitted survey', () => {
			const data: CompletionData = {
				surveyData: {
					submitted: true
				}
			};
			expect(calculateActivityCompletion('survey', data)).toBe(100);
		});

		it('should return 0% for unsubmitted survey', () => {
			const data: CompletionData = {
				surveyData: {
					submitted: false
				}
			};
			expect(calculateActivityCompletion('survey', data)).toBe(0);
		});

		it('should handle missing data gracefully', () => {
			const data: CompletionData = {};
			expect(calculateActivityCompletion('video', data)).toBe(0);
		});
	});
});
