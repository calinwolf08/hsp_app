// Content collection types based on PayloadCMS LMS API
// These types are organized by depth level to match PayloadCMS relationship population

// ============================================================================
// SCORM File Type
// ============================================================================

export type ScormFile = {
	id: number;
	name: string;
	checksum: string;
	extractedPath: string;
	prefix: string;
	url: string;
	thumbnailURL: string | null;
	filename: string;
	mimeType: string;
	filesize: number;
	width: number | null;
	height: number | null;
	focalX: number | null;
	focalY: number | null;
	updatedAt: string;
	createdAt: string;
};

// ============================================================================
// Activity Types
// ============================================================================

export type ActivityType = 'scorm' | 'survey' | 'video' | 'document';

// Base Activity (depth 0 - just the ID)
export type ActivityDepth0 = number;

// Activity with ScormFile unpopulated (depth 1)
export type ActivityDepth1 = {
	id: number;
	name: string;
	ScormFile: number;
	updatedAt: string;
	createdAt: string;
};

// Activity with ScormFile populated (depth 2)
export type ActivityDepth2 = {
	id: number;
	name: string;
	ScormFile: ScormFile;
	updatedAt: string;
	createdAt: string;
};

// Union type for any Activity depth
export type Activity = ActivityDepth0 | ActivityDepth1 | ActivityDepth2;

// ============================================================================
// Section Types
// ============================================================================

// Base Section (depth 0 - just the ID)
export type SectionDepth0 = number;

// Section with activities unpopulated (depth 1)
export type SectionDepth1 = {
	id: number;
	name: string;
	activities: Array<{
		id: string; // Join table ID
		activity: ActivityDepth0;
	}>;
	updatedAt: string;
	createdAt: string;
};

// Section with activities as ActivityDepth1 (depth 2)
export type SectionDepth2 = {
	id: number;
	name: string;
	activities: Array<{
		id: string; // Join table ID
		activity: ActivityDepth1;
	}>;
	updatedAt: string;
	createdAt: string;
};

// Section with activities as ActivityDepth2 (depth 3)
export type SectionDepth3 = {
	id: number;
	name: string;
	activities: Array<{
		id: string; // Join table ID
		activity: ActivityDepth2;
	}>;
	updatedAt: string;
	createdAt: string;
};

// Union type for any Section depth
export type Section = SectionDepth0 | SectionDepth1 | SectionDepth2 | SectionDepth3;

// ============================================================================
// Course Types
// ============================================================================

// Base Course (depth 0 - just the ID)
export type CourseDepth0 = number;

// Course with sections unpopulated (depth 1)
export type CourseDepth1 = {
	id: number;
	name: string;
	internal_name: string;
	slug: string;
	description: object | null; // Lexical rich text
	published: boolean;
	categories: string[];
	tags: string[];
	sections: Array<{
		id: string; // Join table ID
		section: SectionDepth0;
	}>;
	updatedAt: string;
	createdAt: string;
};

// Course with sections as SectionDepth1 (depth 2)
export type CourseDepth2 = {
	id: number;
	name: string;
	internal_name: string;
	slug: string;
	description: object | null; // Lexical rich text
	published: boolean;
	categories: string[];
	tags: string[];
	sections: Array<{
		id: string; // Join table ID
		section: SectionDepth1;
	}>;
	updatedAt: string;
	createdAt: string;
};

// Course with sections as SectionDepth2 (depth 3) - includes Activity IDs
export type CourseDepth3 = {
	id: number;
	name: string;
	internal_name: string;
	slug: string;
	description: object | null; // Lexical rich text
	published: boolean;
	categories: string[];
	tags: string[];
	sections: Array<{
		id: string; // Join table ID
		section: SectionDepth2;
	}>;
	updatedAt: string;
	createdAt: string;
};

// Course with sections as SectionDepth3 (depth 4) - fully populated with ScormFiles
export type CourseDepth4 = {
	id: number;
	name: string;
	internal_name: string;
	slug: string;
	description: object | null; // Lexical rich text
	published: boolean;
	categories: string[];
	tags: string[];
	sections: Array<{
		id: string; // Join table ID
		section: SectionDepth3;
	}>;
	updatedAt: string;
	createdAt: string;
};

// Union type for any Course depth
export type Course = CourseDepth0 | CourseDepth1 | CourseDepth2 | CourseDepth3 | CourseDepth4;

// ============================================================================
// Module Types
// ============================================================================

// Base Module (depth 0 - just the ID)
export type ModuleDepth0 = number;

// Module with courses unpopulated (depth 1)
export type ModuleDepth1 = {
	id: number;
	name: string;
	internal_name: string;
	description: object | null; // Lexical rich text
	published: boolean;
	categories: string[];
	tags: string[];
	courses: Array<{
		id: string; // Join table ID
		course: CourseDepth0;
	}>;
	updatedAt: string;
	createdAt: string;
};

// Module with courses as CourseDepth1 (depth 2)
export type ModuleDepth2 = {
	id: number;
	name: string;
	internal_name: string;
	description: object | null; // Lexical rich text
	published: boolean;
	categories: string[];
	tags: string[];
	courses: Array<{
		id: string; // Join table ID
		course: CourseDepth1;
	}>;
	updatedAt: string;
	createdAt: string;
};

// Union type for any Module depth
export type Module = ModuleDepth0 | ModuleDepth1 | ModuleDepth2;

// ============================================================================
// Bundle Types
// ============================================================================

// Base Bundle (depth 0 - just the ID)
export type BundleDepth0 = number;

// Bundle with modules unpopulated (depth 1)
export type BundleDepth1 = {
	id: number;
	name: string;
	internal_name: string;
	description: object | null; // Lexical rich text
	published: boolean;
	categories: string[];
	tags: string[];
	modules: Array<{
		id: string; // Join table ID
		module: ModuleDepth0;
	}>;
	updatedAt: string;
	createdAt: string;
};

// Bundle with modules as ModuleDepth1 (depth 2)
export type BundleDepth2 = {
	id: number;
	name: string;
	internal_name: string;
	description: object | null; // Lexical rich text
	published: boolean;
	categories: string[];
	tags: string[];
	modules: Array<{
		id: string; // Join table ID
		module: ModuleDepth1;
	}>;
	updatedAt: string;
	createdAt: string;
};

// Union type for any Bundle depth
export type Bundle = BundleDepth0 | BundleDepth1 | BundleDepth2;

// ============================================================================
// Learning Path Types
// ============================================================================

// Base LearningPath (depth 0 - just the ID)
export type LearningPathDepth0 = number;

// LearningPath with bundles unpopulated (depth 1)
export type LearningPathDepth1 = {
	id: number;
	name: string;
	internal_name: string;
	description: object | null; // Lexical rich text
	published: boolean;
	accessType: 'sequential' | 'automatic';
	categories: string[];
	tags: string[];
	bundles: Array<{
		id: string; // Join table ID
		bundle: BundleDepth0;
	}>;
	updatedAt: string;
	createdAt: string;
};

// LearningPath with bundles as BundleDepth1 (depth 2)
export type LearningPathDepth2 = {
	id: number;
	name: string;
	internal_name: string;
	description: object | null; // Lexical rich text
	published: boolean;
	accessType: 'sequential' | 'automatic';
	categories: string[];
	tags: string[];
	bundles: Array<{
		id: string; // Join table ID
		bundle: BundleDepth1;
	}>;
	updatedAt: string;
	createdAt: string;
};

// Union type for any LearningPath depth
export type LearningPath = LearningPathDepth0 | LearningPathDepth1 | LearningPathDepth2;

// ============================================================================
// Category and Tag Types
// ============================================================================

export type Category = {
	id: number;
	name: string;
	slug: string;
};

export type Tag = {
	id: number;
	name: string;
	slug: string;
};

// ============================================================================
// Type Guards
// ============================================================================

// Activity type guards
export function isActivityDepth1(activity: Activity): activity is ActivityDepth1 {
	return typeof activity === 'object' && 'name' in activity && typeof activity.ScormFile === 'number';
}

export function isActivityDepth2(activity: Activity): activity is ActivityDepth2 {
	return typeof activity === 'object' && 'name' in activity && typeof activity.ScormFile === 'object';
}

// Section type guards
export function isSectionDepth1(section: Section): section is SectionDepth1 {
	return typeof section === 'object' && 'name' in section && section.activities.length > 0 && typeof section.activities[0].activity === 'number';
}

export function isSectionDepth2(section: Section): section is SectionDepth2 {
	return typeof section === 'object' && 'name' in section && section.activities.length > 0 && typeof section.activities[0].activity === 'object' && typeof section.activities[0].activity.ScormFile === 'number';
}

export function isSectionDepth3(section: Section): section is SectionDepth3 {
	return typeof section === 'object' && 'name' in section && section.activities.length > 0 && typeof section.activities[0].activity === 'object' && typeof section.activities[0].activity.ScormFile === 'object';
}

// Course type guards
export function isCourseDepth1(course: Course): course is CourseDepth1 {
	return typeof course === 'object' && 'name' in course && course.sections.length > 0 && typeof course.sections[0].section === 'number';
}

export function isCourseDepth2(course: Course): course is CourseDepth2 {
	return typeof course === 'object' && 'name' in course && course.sections.length > 0 && typeof course.sections[0].section === 'object' && isSectionDepth1(course.sections[0].section);
}

export function isCourseDepth3(course: Course): course is CourseDepth3 {
	return typeof course === 'object' && 'name' in course && course.sections.length > 0 && typeof course.sections[0].section === 'object' && isSectionDepth2(course.sections[0].section);
}

export function isCourseDepth4(course: Course): course is CourseDepth4 {
	return typeof course === 'object' && 'name' in course && course.sections.length > 0 && typeof course.sections[0].section === 'object' && isSectionDepth3(course.sections[0].section);
}

// Helper functions to extract IDs
export function getActivityId(activity: Activity): number {
	return typeof activity === 'number' ? activity : activity.id;
}

export function getSectionId(section: Section): number {
	return typeof section === 'number' ? section : section.id;
}

export function getCourseId(course: Course): number {
	return typeof course === 'number' ? course : course.id;
}

export function getModuleId(module: Module): number {
	return typeof module === 'number' ? module : module.id;
}

export function getBundleId(bundle: Bundle): number {
	return typeof bundle === 'number' ? bundle : bundle.id;
}

export function getLearningPathId(learningPath: LearningPath): number {
	return typeof learningPath === 'number' ? learningPath : learningPath.id;
}
