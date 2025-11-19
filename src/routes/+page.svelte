<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { PageSlugs } from '$lib/constants';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const isAuthenticated = $derived(!!data.user);
</script>

<svelte:head>
	<title>HSP Learning - Your Path to Success</title>
	<meta
		name="description"
		content="Comprehensive learning management system for professional development"
	/>
</svelte:head>

<!-- Hero Section -->
<section class="bg-blue py-20">
	<div class="container mx-auto px-4">
		<div class="mx-auto max-w-4xl text-center">
			<h1 class="mb-6 text-5xl font-bold text-white md:text-6xl">
				Transform Your Learning Journey
			</h1>
			<p class="mb-8 text-xl text-light-grey md:text-2xl">
				Access comprehensive courses, track your progress, and achieve your professional development
				goals with HSP Learning.
			</p>
			<div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
				{#if isAuthenticated}
					<Button
						variant="primary"
						size="lg"
						class="w-full sm:w-auto"
						onclick={() => window.location.href = PageSlugs.dashboard}
					>
						Go to Dashboard
					</Button>
					<Button
						variant="outline"
						size="lg"
						class="w-full sm:w-auto"
						onclick={() => window.location.href = PageSlugs.catalog}
					>
						Browse Courses
					</Button>
				{:else}
					<Button
						variant="primary"
						size="lg"
						class="w-full sm:w-auto"
						onclick={() => window.location.href = PageSlugs.login}
					>
						Get Started
					</Button>
					<Button
						variant="outline"
						size="lg"
						class="w-full border-light-grey text-light-grey hover:bg-light-grey/10 sm:w-auto"
					>
						Learn More
					</Button>
				{/if}
			</div>
		</div>
	</div>
</section>

<!-- Features Section -->
<section class="bg-background py-20">
	<div class="container mx-auto px-4">
		<div class="mb-12 text-center">
			<h2 class="mb-4 text-4xl font-bold text-foreground">Why Choose HSP Learning?</h2>
			<p class="mx-auto max-w-2xl text-lg text-muted-foreground">
				Our platform provides everything you need to succeed in your learning journey
			</p>
		</div>

		<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			<!-- Feature 1 -->
			<Card class="rounded-xl border-light-grey/20 transition-shadow hover:shadow-lg">
				<CardHeader>
					<div
						class="mb-4 flex size-12 items-center justify-center rounded-lg bg-light-orange/20"
					>
						<svg
							class="size-6 text-light-orange"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
							/>
						</svg>
					</div>
					<CardTitle>Comprehensive Courses</CardTitle>
					<CardDescription>
						Access a wide range of professionally designed courses tailored to your needs
					</CardDescription>
				</CardHeader>
			</Card>

			<!-- Feature 2 -->
			<Card class="rounded-xl border-light-grey/20 transition-shadow hover:shadow-lg">
				<CardHeader>
					<div class="mb-4 flex size-12 items-center justify-center rounded-lg bg-dark-green/20">
						<svg
							class="size-6 text-dark-green"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
							/>
						</svg>
					</div>
					<CardTitle>Track Your Progress</CardTitle>
					<CardDescription>
						Monitor your learning journey with detailed progress tracking and analytics
					</CardDescription>
				</CardHeader>
			</Card>

			<!-- Feature 3 -->
			<Card class="rounded-xl border-light-grey/20 transition-shadow hover:shadow-lg">
				<CardHeader>
					<div class="mb-4 flex size-12 items-center justify-center rounded-lg bg-dark-yellow/20">
						<svg
							class="size-6 text-dark-yellow"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</div>
					<CardTitle>Learn at Your Pace</CardTitle>
					<CardDescription>
						Flexible learning schedules that adapt to your lifestyle and commitments
					</CardDescription>
				</CardHeader>
			</Card>

			<!-- Feature 4 -->
			<Card class="rounded-xl border-light-grey/20 transition-shadow hover:shadow-lg">
				<CardHeader>
					<div class="mb-4 flex size-12 items-center justify-center rounded-lg bg-dark-orange/20">
						<svg
							class="size-6 text-dark-orange"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</div>
					<CardTitle>Industry Recognized</CardTitle>
					<CardDescription>
						Earn certificates and credentials valued by employers worldwide
					</CardDescription>
				</CardHeader>
			</Card>

			<!-- Feature 5 -->
			<Card class="rounded-xl border-light-grey/20 transition-shadow hover:shadow-lg">
				<CardHeader>
					<div class="mb-4 flex size-12 items-center justify-center rounded-lg bg-light-green/20">
						<svg
							class="size-6 text-dark-green"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
							/>
						</svg>
					</div>
					<CardTitle>Expert Instructors</CardTitle>
					<CardDescription>
						Learn from industry professionals with years of practical experience
					</CardDescription>
				</CardHeader>
			</Card>

			<!-- Feature 6 -->
			<Card class="rounded-xl border-light-grey/20 transition-shadow hover:shadow-lg">
				<CardHeader>
					<div class="mb-4 flex size-12 items-center justify-center rounded-lg bg-dark-grey/20">
						<svg
							class="size-6 text-dark-grey"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
							/>
						</svg>
					</div>
					<CardTitle>Interactive Learning</CardTitle>
					<CardDescription>
						Engage with multimedia content, quizzes, and hands-on activities
					</CardDescription>
				</CardHeader>
			</Card>
		</div>
	</div>
</section>

<!-- CTA Section -->
<section class="bg-blue py-20">
	<div class="container mx-auto px-4">
		<div class="mx-auto max-w-3xl text-center">
			<h2 class="mb-4 text-4xl font-bold text-white">Ready to Start Learning?</h2>
			<p class="mb-8 text-xl text-light-grey">
				Join thousands of learners who are advancing their careers with HSP Learning
			</p>
			{#if !isAuthenticated}
				<Button
					variant="primary"
					size="lg"
					class="w-full sm:w-auto"
					onclick={() => window.location.href = PageSlugs.login}
				>
					Get Started Today
				</Button>
			{:else}
				<Button
					variant="primary"
					size="lg"
					class="w-full sm:w-auto"
					onclick={() => window.location.href = PageSlugs.catalog}
				>
					Explore Courses
				</Button>
			{/if}
		</div>
	</div>
</section>

<!-- Footer -->
<footer class="bg-background border-t border-light-grey/20 py-8">
	<div class="container mx-auto px-4">
		<div class="text-center text-sm text-muted-foreground">
			<p>&copy; {new Date().getFullYear()} HSP Learning. All rights reserved.</p>
		</div>
	</div>
</footer>
