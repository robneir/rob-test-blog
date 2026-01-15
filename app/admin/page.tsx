'use client'

import { useState } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { ClaudeAgentWidget } from '@/components/ClaudeAgentWidget'
import { PostEditor } from '@/components/PostEditor'
import { PostList } from '@/components/PostList'
import Link from 'next/link'

export default function AdminPage() {
  const { data: session, status } = useSession()
  const [activeTab, setActiveTab] = useState<'posts' | 'agent'>('posts')

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="max-w-md mx-auto px-6 text-center space-y-6">
          <h1 className="text-3xl font-light text-gray-900">Admin Panel</h1>
          <p className="text-gray-600">Please sign in to access the admin panel.</p>
          <button
            onClick={() => signIn('github')}
            className="px-8 py-3 bg-gray-900 text-white rounded-sm hover:bg-gray-800 transition-colors"
          >
            Sign in with GitHub
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-light text-gray-900">
              ← Back to Blog
            </Link>
            <div className="flex space-x-1 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('posts')}
                className={`px-4 py-2 text-sm font-light ${activeTab === 'posts' ? 'border-b-2 border-gray-900 text-gray-900' : 'text-gray-500'}`}
              >
                Posts
              </button>
              <button
                onClick={() => setActiveTab('agent')}
                className={`px-4 py-2 text-sm font-light ${activeTab === 'agent' ? 'border-b-2 border-gray-900 text-gray-900' : 'text-gray-500'}`}
              >
                AI Agent
              </button>
            </div>
          </div>
          <button
            onClick={() => signOut()}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {activeTab === 'posts' && (
          <div className="space-y-8">
            <PostEditor />
            <PostList />
          </div>
        )}
        {activeTab === 'agent' && <ClaudeAgentWidget />}
      </main>
    </div>
  )
}
