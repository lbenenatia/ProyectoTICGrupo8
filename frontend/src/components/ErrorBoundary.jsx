import React from 'react';

class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError() {
		return { hasError: true };
	}

	componentDidCatch(error, info) {
		// You can log the error to an error reporting service here
		console.error('Uncaught error:', error, info);
	}

	render() {
		if (this.state.hasError) {
			return (
				<div className="min-h-screen flex items-center justify-center bg-background">
					<div className="text-center">
						<h1 className="text-2xl font-semibold">Something went wrong.</h1>
						<p className="text-sm text-text-secondary mt-2">Please refresh the page or contact support.</p>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
