import { Component, ReactNode, ErrorInfo } from 'react';
import { AlertCircle } from 'lucide-react';

const getTranslation = (key: string): string => {
  const language = localStorage.getItem('language') || 'en';
  const translations: Record<string, Record<string, string>> = {
    en: {
      'something.wrong': 'Something went wrong',
      'error.message': "We're sorry, but something unexpected happened. Please try refreshing the page.",
      'refresh.page': 'Refresh Page',
      'error.details': 'Error details',
    },
    sr: {
      'something.wrong': 'Nešto je pošlo po zlu',
      'error.message': 'Izvinjavamo se, ali desilo se nešto neočekivano. Molimo pokušajte da osvežite stranicu.',
      'refresh.page': 'Osveži stranicu',
      'error.details': 'Detalji greške',
    },
  };
  return translations[language]?.[key] || key;
};

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    // Optional: in production, send to error reporting (e.g. Sentry):
    // if (import.meta.env.PROD) logErrorToService(error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4" role="alert">
          <div className="text-center max-w-md">
            <AlertCircle className="h-16 w-16 text-[#FF385C] mx-auto mb-4" aria-hidden="true" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{getTranslation('something.wrong')}</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {getTranslation('error.message')}
            </p>
            {this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400 mb-2">
                  {getTranslation('error.details')}
                </summary>
                <pre className="text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <button
              onClick={() => window.location.reload()}
              className="bg-[#FF385C] hover:bg-[#E61E4D] text-white px-6 py-3 rounded-lg font-semibold transition-colors min-h-[44px]"
              aria-label={getTranslation('refresh.page')}
            >
              {getTranslation('refresh.page')}
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
