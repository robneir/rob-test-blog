import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { GitHubService } from '@/lib/github'
import { marked } from 'marked'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const githubService = new GitHubService(session.accessToken as string)
    const repoName = process.env.GITHUB_REPO_NAME || ''
    const repoOwner = process.env.GITHUB_REPO_OWNER || ''

    const files = await githubService.listFiles(repoName, repoOwner, 'posts')
    const postFiles = files.filter((file) => file.name.endsWith('.json'))

    const posts = await Promise.all(
      postFiles.map(async (file) => {
        const content = await githubService.getFileContent(
          repoName,
          repoOwner,
          file.path
        )
        if (content) {
          const post = JSON.parse(content)
          return { slug: post.slug, title: post.title, date: post.date }
        }
        return null
      })
    )

    return NextResponse.json(posts.filter((p) => p !== null))
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json([])
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session?.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { title, slug, excerpt, content } = body

  const githubService = new GitHubService(session.accessToken as string)
  const repoName = process.env.GITHUB_REPO_NAME || ''
  const repoOwner = process.env.GITHUB_REPO_OWNER || ''

  const postData = {
    slug,
    title,
    date: new Date().toISOString(),
    excerpt,
    content: await marked(content),
  }

  try {
    await githubService.createOrUpdateFile(
      repoName,
      repoOwner,
      `posts/${slug}.json`,
      JSON.stringify(postData, null, 2),
      `Create post: ${title}`
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}
