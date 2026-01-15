'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Post {
  slug: string
  title: string
  date: string
}

export function PostList() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/posts')
      .then((res) => res.json())
      .then((data) => {
        setPosts(data)
        setLoading(false)
      })
  }, [])

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      await fetch(`/api/posts/${slug}`, {
        method: 'DELETE',
      })
      window.location.reload()
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }

  if (loading) {
    return <div className="text-gray-500">Loading posts...</div>
  }

  return (
    <div className="border border-gray-200 rounded-sm p-8">
      <h3 className="text-xl font-light text-gray-900 mb-6">All Posts</h3>
      {posts.length === 0 ? (
        <p className="text-gray-500">No posts yet.</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.slug}
              className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
            >
              <div>
                <Link
                  href={`/posts/${post.slug}`}
                  className="text-gray-900 hover:text-gray-600"
                >
                  {post.title}
                </Link>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(post.date).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => handleDelete(post.slug)}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
