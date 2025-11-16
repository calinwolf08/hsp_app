// API response types

export type PaginatedResponse<T> = {
	docs: T[];
	totalDocs: number;
	limit: number;
	page: number;
	totalPages: number;
	hasNextPage: boolean;
	hasPrevPage: boolean;
	nextPage: number | null;
	prevPage: number | null;
};

export type ApiError = {
	errors: Array<{
		message: string;
		data?: unknown;
	}>;
};

export type QueryParams = {
	where?: Record<string, unknown>;
	depth?: number;
	limit?: number;
	page?: number;
	sort?: string;
};

export type WhereCondition = {
	[key: string]: {
		equals?: string | number | boolean;
		not_equals?: string | number | boolean;
		in?: string[];
		greater_than?: number | string;
		less_than?: number | string;
		contains?: string;
	};
};
