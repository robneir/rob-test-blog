'use client'

import { useState } from 'react'

export function PostEditor() {
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
          excerpt,
          content,
        }),
      })

      if (response.ok) {
        setTitle('')
        setSlug('')
        setExcerpt('')
        setContent('')
        window.location.reload()
      }
    } catch (error) {
      console.error('Error saving post:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="border border-gray-200 rounded-sm p-8">
      <h3 className="text-xl font-light text-gray-900 mb-6">Create New Post</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm text-gray-700 mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-gray-900"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-2">Slug</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-gray-900"
            placeholder="auto-generated from title"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-2">Excerpt</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-gray-900"
            rows={2}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-2">Content (Markdown)</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-gray-900 font-mono text-sm"
            rows={12}
            required
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2 bg-gray-900 text-white rounded-sm hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Create Post'}
        </button>
      </form>
    </div>
  )
}
