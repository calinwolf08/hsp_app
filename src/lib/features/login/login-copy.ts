export const loginCopy = {
	form: {
		title: 'Sign in to your account',
		description: 'Enter your email and password to access your account',
		fields: {
			email: {
				label: 'Email',
				placeholder: 'name@example.com',
				errors: {
					required: 'Email is required',
					invalid: 'Please enter a valid email address'
				}
			},
			password: {
				label: 'Password',
				placeholder: 'Enter your password',
				errors: {
					required: 'Password is required',
					minLength: 'Password must be at least 8 characters',
					invalid: 'Invalid password'
				}
			}
		},
		rememberMe: 'Remember me',
		forgotPassword: 'Forgot password?',
		submitButton: 'Sign in',
		submittingButton: 'Signing in...',
		errors: {
			invalidCredentials: 'Invalid email or password',
			general: 'An error occurred during sign in. Please try again.'
		}
	}
};
