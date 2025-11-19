<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { loginCopy } from '../login-copy';
	import { PageSlugs } from '$lib/constants';
	import { authClient } from '$lib/auth-client';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	// Get redirect URL from query params
	let redirectTo = $derived($page.url.searchParams.get('redirectTo') || PageSlugs.dashboard);

	let email = $state('');
	let password = $state('');
	let rememberMe = $state(false);
	let emailError = $state('');
	let passwordError = $state('');
	let generalError = $state('');
	let isSubmitting = $state(false);

	function validateEmail(email: string): boolean {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();

		console.log('starting submit...');

		// Reset errors
		emailError = '';
		passwordError = '';
		generalError = '';

		// Client-side validation
		let hasErrors = false;

		if (!email.trim()) {
			emailError = loginCopy.form.fields.email.errors.required;
			hasErrors = true;
		} else if (!validateEmail(email)) {
			emailError = loginCopy.form.fields.email.errors.invalid;
			hasErrors = true;
		}

		if (!password) {
			passwordError = loginCopy.form.fields.password.errors.required;
			hasErrors = true;
		}

		if (hasErrors) return;

		// Submit to better-auth
		isSubmitting = true;

		try {
			console.log('making auth sign in request');
			const { data, error } = await authClient.signIn.email(
				{
					email,
					password,
					rememberMe
				},
				{
					onRequest: () => {
						// Loading state already set
						console.log('loading...');
					},
					onSuccess: async () => {
						// Redirect after successful login
						console.log('success, redirecting to:', redirectTo);
						await goto(redirectTo);
					},
					onError: (ctx) => {
						// Error will be handled in the catch block via the error variable
						console.log('error');
					}
				}
			);

			console.log('data: ', data);

			if (error) {
				// Check for specific error types
				if (error.status === 401 || error.message?.toLowerCase().includes('credential')) {
					generalError = loginCopy.form.errors.invalidCredentials;
				} else {
					generalError = error.message || loginCopy.form.errors.general;
				}

				console.log('error: ', generalError);
			}
		} catch (err) {
			generalError = loginCopy.form.errors.general;
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-background p-4">
	<Card class="w-full max-w-md rounded-xl shadow-lg">
		<CardHeader class="space-y-1">
			<CardTitle class="text-2xl font-semibold">{loginCopy.form.title}</CardTitle>
			<CardDescription>{loginCopy.form.description}</CardDescription>
		</CardHeader>
		<CardContent>
			<form onsubmit={handleSubmit} class="space-y-4">
				{#if generalError}
					<div class="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
						{generalError}
					</div>
				{/if}

				<div class="space-y-2">
					<Label for="email">{loginCopy.form.fields.email.label}</Label>
					<Input
						id="email"
						type="email"
						placeholder={loginCopy.form.fields.email.placeholder}
						bind:value={email}
						aria-invalid={!!emailError}
						disabled={isSubmitting}
						required
					/>
					{#if emailError}
						<p class="text-sm text-destructive">{emailError}</p>
					{/if}
				</div>

				<div class="space-y-2">
					<Label for="password">{loginCopy.form.fields.password.label}</Label>
					<Input
						id="password"
						type="password"
						placeholder={loginCopy.form.fields.password.placeholder}
						bind:value={password}
						aria-invalid={!!passwordError}
						disabled={isSubmitting}
						required
					/>
					{#if passwordError}
						<p class="text-sm text-destructive">{passwordError}</p>
					{/if}
				</div>

				<div class="flex items-center justify-between">
					<div class="flex items-center gap-2">
						<Checkbox id="remember" bind:checked={rememberMe} disabled={isSubmitting} />
						<Label
							for="remember"
							class="text-sm leading-none font-normal peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>
							{loginCopy.form.rememberMe}
						</Label>
					</div>
					<a
						href={PageSlugs.forgotPassword}
						class="text-sm font-medium text-primary hover:underline"
					>
						{loginCopy.form.forgotPassword}
					</a>
				</div>

				<Button type="submit" variant="primary" class="w-full" size="lg" disabled={isSubmitting}>
					{isSubmitting ? loginCopy.form.submittingButton : loginCopy.form.submitButton}
				</Button>
			</form>
		</CardContent>
	</Card>
</div>
