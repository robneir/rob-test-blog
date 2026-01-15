'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'

export function ClaudeAgentWidget() {
  const { data: session } = useSession()
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim() || !session?.accessToken) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to process request')
        return
      }

      setResult(data.message || 'Changes applied successfully')
      setPrompt('')
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (!session) {
    return (
      <div className="border border-gray-200 rounded-sm p-8 text-center">
        <p className="text-gray-500">Please sign in to use the AI agent.</p>
      </div>
    )
  }

  return (
    <div className="border border-gray-200 rounded-sm p-8 space-y-6">
      <div>
        <h3 className="text-lg font-light text-gray-900 mb-2">AI Agent</h3>
        <p className="text-sm text-gray-600">
          Describe the changes you want to make to your blog. The AI will make them directly to your GitHub repository.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Add a new blog post about my latest project, or change the header color to blue, or add a contact page..."
            className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:border-gray-900 resize-none"
            rows={6}
            required
            disabled={loading}
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-sm p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {result && (
          <div className="bg-green-50 border border-green-200 rounded-sm p-4">
            <p className="text-sm text-green-800">{result}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="px-6 py-2 bg-gray-900 text-white rounded-sm hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : 'Apply Changes'}
        </button>
      </form>

      <div className="pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          The AI agent can create, edit, or delete blog posts, modify pages, update styles, and more.
          All changes are made directly to your GitHub repository.
        </p>
      </div>
    </div>
  )
}
