import { getPosts } from '@/lib/posts'
import Link from 'next/link'

export default async function Home() {
  const posts = await getPosts()

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <Link href="/" className="text-2xl font-light text-gray-900">
            My Blog
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="space-y-12">
          {posts.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-gray-500 text-lg">No posts yet.</p>
              <p className="text-gray-400 text-sm mt-2">
                Log into the admin panel to create your first post.
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <article key={post.slug} className="space-y-4">
                <Link
                  href={`/posts/${post.slug}`}
                  className="block group"
                >
                  <h2 className="text-3xl font-light text-gray-900 group-hover:text-gray-600 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  {post.excerpt && (
                    <p className="text-gray-600 mt-4 leading-relaxed">
                      {post.excerpt}
                    </p>
                  )}
                </Link>
              </article>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
