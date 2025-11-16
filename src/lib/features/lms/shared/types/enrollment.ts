// Enrollment collection types based on PayloadCMS LMS API

export type EnrollmentSource = 'direct' | 'bundle' | 'learning-path';

export type OrganizationEnrollment = {
	id: string;
	organization: string;
	learningPath: string;
	enrolledAt: string;
	isActive: boolean;
	deactivatedAt?: string;
	createdAt: string;
	updatedAt: string;
};

export type BundleEnrollment = {
	id: string;
	user: string;
	bundle: string;
	isActive: boolean;
	enrolledAt: string;
	deactivatedAt?: string;
	enrollmentSource: 'direct' | 'learning-path';
	sourceOrganization?: string;
	sourceLearningPath?: string;
	createdAt: string;
	updatedAt: string;
};

export type CourseEnrollment = {
	id: string;
	user: string;
	course: string;
	isActive: boolean;
	enrolledAt: string;
	deactivatedAt?: string;
	enrollmentSource: EnrollmentSource;
	sourceOrganization?: string;
	sourceLearningPath?: string;
	sourceBundle?: string;
	createdAt: string;
	updatedAt: string;
};
