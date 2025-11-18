// Enrollment collection types based on PayloadCMS LMS API
import type { Course, Bundle, LearningPath } from './content';

export type EnrollmentSource = 'direct' | 'bundle' | 'learning-path';

export type OrganizationEnrollment = {
	id: string;
	organization: string;
	learningPath: string | LearningPath;
	enrolledAt: string;
	isActive: boolean;
	deactivatedAt?: string;
	createdAt: string;
	updatedAt: string;
};

export type BundleEnrollment = {
	id: string;
	user: string;
	bundle: string | Bundle;
	isActive: boolean;
	enrolledAt: string;
	deactivatedAt?: string;
	enrollmentSource: 'direct' | 'learning-path';
	sourceOrganization?: string;
	sourceLearningPath?: string | LearningPath;
	createdAt: string;
	updatedAt: string;
};

export type CourseEnrollment = {
	id: string;
	user: string;
	course: string | Course;
	isActive: boolean;
	enrolledAt: string;
	deactivatedAt?: string;
	enrollmentSource: EnrollmentSource;
	sourceOrganization?: string;
	sourceLearningPath?: string | LearningPath;
	sourceBundle?: string | Bundle;
	createdAt: string;
	updatedAt: string;
};
