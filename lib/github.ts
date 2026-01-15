import { Octokit } from '@octokit/rest'

export class GitHubService {
  private octokit: Octokit

  constructor(accessToken: string) {
    this.octokit = new Octokit({
      auth: accessToken,
    })
  }

  async createOrUpdateFile(
    repo: string,
    owner: string,
    path: string,
    content: string,
    message: string,
    sha?: string
  ) {
    const response = await this.octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message,
      content: Buffer.from(content).toString('base64'),
      ...(sha && { sha }),
    })
    return response.data
  }

  async getFileContent(repo: string, owner: string, path: string) {
    try {
      const response = await this.octokit.repos.getContent({
        owner,
        repo,
        path,
      })
      
      if (Array.isArray(response.data)) {
        return null
      }
      
      if ('content' in response.data) {
        return Buffer.from(response.data.content, 'base64').toString('utf-8')
      }
      
      return null
    } catch (error) {
      return null
    }
  }

  async deleteFile(
    repo: string,
    owner: string,
    path: string,
    message: string
  ) {
    const file = await this.octokit.repos.getContent({
      owner,
      repo,
      path,
    })

    if (Array.isArray(file.data) || !('sha' in file.data)) {
      throw new Error('File not found')
    }

    await this.octokit.repos.deleteFile({
      owner,
      repo,
      path,
      message,
      sha: file.data.sha,
    })
  }

  async listFiles(repo: string, owner: string, path: string = '') {
    const response = await this.octokit.repos.getContent({
      owner,
      repo,
      path,
    })

    if (Array.isArray(response.data)) {
      return response.data.map((item) => ({
        name: item.name,
        path: item.path,
        type: item.type,
        sha: item.sha,
      }))
    }

    return []
  }
}
