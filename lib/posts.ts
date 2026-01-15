import { GitHubService } from './github'

const githubService = new GitHubService(process.env.GITHUB_TOKEN || '')

export interface Post {
  slug: string
  title: string
  date: string
  excerpt?: string
  content: string
}

async function getPostsData(): Promise<Post[]> {
  try {
    const repoName = process.env.GITHUB_REPO_NAME || ''
    const repoOwner = process.env.GITHUB_REPO_OWNER || ''
    
    if (!repoName || !repoOwner) {
      return []
    }

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
          return JSON.parse(content) as Post
        }
        return null
      })
    )

    return posts.filter((post): post is Post => post !== null).sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return []
  }
}

export async function getPosts(): Promise<Post[]> {
  return getPostsData()
}

export async function getPost(slug: string): Promise<Post | null> {
  const posts = await getPostsData()
  return posts.find((post) => post.slug === slug) || null
}
