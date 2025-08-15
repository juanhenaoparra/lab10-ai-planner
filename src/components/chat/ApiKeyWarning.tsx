export function ApiKeyWarning() {
  return (
    <div className="p-4 bg-yellow-50 rounded-lg">
      <h4 className="text-sm font-medium text-yellow-800 mb-2">Anthropic API Key Not Found</h4>
      <p className="text-sm text-yellow-700">
        To use the AI assistant, you need to add your Anthropic API key to the environment variables:
      </p>
      <ol className="mt-2 text-sm text-yellow-700 list-decimal list-inside space-y-1">
        <li>Create a `.env.local` file in the project root</li>
        <li>Add your API key: NEXT_PUBLIC_ANTHROPIC_API_KEY=your_key_here</li>
        <li>Restart the development server</li>
      </ol>
      <p className="mt-2 text-sm text-yellow-700">
        You can get an API key from{' '}
        <a
          href="https://console.anthropic.com/account/keys"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-yellow-800"
        >
          Anthropic&apos;s Console
        </a>
      </p>
    </div>
  );
}