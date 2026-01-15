import { getPost, getPosts } from '@/lib/posts'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function PostPage({
  params,
}: {
  params: { slug: string }
}) {
  const post = await getPost(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <Link href="/" className="text-2xl font-light text-gray-900">
            My Blog
          </Link>
        </div>
      </header>

      <article className="max-w-4xl mx-auto px-6 py-16">
        <div className="space-y-8">
          <div>
            <h1 className="text-5xl font-light text-gray-900 mb-4">
              {post.title}
            </h1>
            <p className="text-sm text-gray-500">
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <div
            className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </article>
    </div>
  )
}
