// Enrollment collection types based on PayloadCMS LMS API
import type { Course, Bundle, LearningPath } from './content';

export type EnrollmentSource = 'direct' | 'bundle' | 'learning-path';

export type OrganizationEnrollment = {
	id: string;
	organization: string;
	learningPath: number | LearningPath;
	enrolledAt: string;
	isActive: boolean;
	deactivatedAt?: string;
	createdAt: string;
	updatedAt: string;
};

export type BundleEnrollment = {
	id: string;
	user: string;
	bundle: number | Bundle;
	isActive: boolean;
	enrolledAt: string;
	deactivatedAt?: string;
	enrollmentSource: 'direct' | 'learning-path';
	sourceOrganization?: string;
	sourceLearningPath?: number | LearningPath;
	createdAt: string;
	updatedAt: string;
};

export type CourseEnrollment = {
	id: string;
	user: string;
	course: number | Course;
	isActive: boolean;
	enrolledAt: string;
	deactivatedAt?: string;
	enrollmentSource: EnrollmentSource;
	sourceOrganization?: string;
	sourceLearningPath?: number | LearningPath;
	sourceBundle?: number | Bundle;
	createdAt: string;
	updatedAt: string;
};
