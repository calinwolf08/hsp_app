// Content collection types based on PayloadCMS LMS API

export type LearningPath = {
	id: string;
	name: string;
	internal_name: string;
	description: object; // Lexical rich text
	published: boolean;
	accessType: 'sequential' | 'automatic';
	categories: string[];
	tags: string[];
	bundles: Array<{
		id: string;
		bundle: string | Bundle;
	}>;
	createdAt: string;
	updatedAt: string;
};

export type Bundle = {
	id: string;
	name: string;
	internal_name: string;
	description: object; // Lexical rich text
	published: boolean;
	categories: string[];
	tags: string[];
	modules: Array<{
		id: string;
		module: string | Module;
	}>;
	createdAt: string;
	updatedAt: string;
};

export type Module = {
	id: string;
	name: string;
	internal_name: string;
	description: object; // Lexical rich text
	published: boolean;
	courses: Array<{
		id: string;
		course: string | Course;
	}>;
	createdAt: string;
	updatedAt: string;
};

export type Course = {
	id: string;
	name: string;
	internal_name: string;
	slug: string;
	description: object; // Lexical rich text
	published: boolean;
	categories: string[];
	tags: string[];
	thumbnail?: string;
	sections: Array<{
		id: string;
		section: string | Section;
	}>;
	createdAt: string;
	updatedAt: string;
};

export type Section = {
	id: string;
	name: string;
	internal_name: string;
	description: object; // Lexical rich text
	published: boolean;
	activities: Array<{
		id: string;
		activity: string | Activity;
	}>;
	createdAt: string;
	updatedAt: string;
};

export type ActivityType = 'scorm' | 'survey' | 'video' | 'document';

export type Activity = {
	id: string;
	name: string;
	internal_name: string;
	description: object; // Lexical rich text
	published: boolean;
	activityType: ActivityType;
	scormFile?: string;
	survey?: string;
	videoUrl?: string;
	documentUrl?: string;
	createdAt: string;
	updatedAt: string;
};

export type Category = {
	id: string;
	name: string;
	slug: string;
};

export type Tag = {
	id: string;
	name: string;
	slug: string;
};
