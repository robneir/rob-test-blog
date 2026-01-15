import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { GitHubService } from '@/lib/github'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const session = await getServerSession(authOptions)
  
  if (!session?.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const githubService = new GitHubService(session.accessToken as string)
  const repoName = process.env.GITHUB_REPO_NAME || ''
  const repoOwner = process.env.GITHUB_REPO_OWNER || ''

  try {
    await githubService.deleteFile(
      repoName,
      repoOwner,
      `posts/${params.slug}.json`,
      `Delete post: ${params.slug}`
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
  }
}
