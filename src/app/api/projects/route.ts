

import { NextResponse } from 'next/server'


interface GitHubRepo {
  name: string
  description: string
  html_url: string
  homepage: string | null
  topics: string[]
  stargazers_count: number
  forks_count: number
  language: string | null
  updated_at: string
  fork: boolean
  archived: boolean
}

interface ProjectResponse {
  title: string
  image: string
  deskripsi: string
  type: string
  demo?: string
  repo: string
}


const CONFIG = {
  GITHUB_USERNAME: 'Mojoxz', // ← Username GitHub Anda
  CACHE_DURATION: 3600,
  MAX_REPOS: 100,
  FILTER_BY_TOPIC: '', // ← KOSONGKAN untuk show semua repo (atau isi 'portfolio')
} as const


export async function GET(request: Request) {
  try {
    console.log('\n' + '='.repeat(70))
    console.log('🚀 API Request: /api/projects')
    console.log('='.repeat(70))
    
    const repos = await fetchGitHubRepos()
    const projects = transformReposToProjects(repos)
    
    console.log('\n📊 FINAL RESULT:')
    console.log(`   ✅ Projects returned: ${projects.length}`)
    console.log('='.repeat(70) + '\n')
    
    return NextResponse.json(
      { 
        data: projects, 
        success: true,
        total: projects.length,
        cached: true
      },
      {
        headers: {
          'Cache-Control': `public, s-maxage=${CONFIG.CACHE_DURATION}, stale-while-revalidate=86400`,
        }
      }
    )
  } catch (error) {
    console.error('❌ API Error:', error)
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to fetch projects',
        data: [],
        success: false
      },
      { status: 500 }
    )
  }
}


async function fetchGitHubRepos(): Promise<GitHubRepo[]> {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN
  
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'Portfolio-App',
  }

  if (GITHUB_TOKEN) {
    headers['Authorization'] = `token ${GITHUB_TOKEN}`
    console.log('✅ Using GitHub token')
  } else {
    console.log('⚠️  No GitHub token (rate limit: 60/hour)')
  }

  console.log(`\n📡 Fetching repositories for: ${CONFIG.GITHUB_USERNAME}`)
  
  const response = await fetch(
    `https://api.github.com/users/${CONFIG.GITHUB_USERNAME}/repos?sort=updated&per_page=${CONFIG.MAX_REPOS}`,
    {
      headers,
      next: { revalidate: CONFIG.CACHE_DURATION }
    }
  )

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
  }

  const repos: GitHubRepo[] = await response.json()
  console.log(`✅ Fetched ${repos.length} repositories from GitHub`)
  
  return repos
}


function filterRepos(repos: GitHubRepo[]): GitHubRepo[] {
  console.log('\n🔍 Filtering repositories...')
  console.log('-'.repeat(70))
  
  let skipCount = {
    fork: 0,
    archived: 0,
    noDescription: 0,
    skipName: 0,
    noTopic: 0
  }
  
  const filtered = repos.filter((repo, index) => {
    const reasons: string[] = []
    
 
    if (repo.fork) {
      skipCount.fork++
      reasons.push('is fork')
    }
    
   
    if (repo.archived) {
      skipCount.archived++
      reasons.push('is archived')
    }
    
  
    if (!repo.description?.trim()) {
      skipCount.noDescription++
      reasons.push('no description')
    }
    
   
    const skipNames = ['config', '.github', '.', 'dotfiles']
    const hasSkipName = skipNames.some(name => repo.name.toLowerCase().includes(name))
    if (hasSkipName) {
      skipCount.skipName++
      reasons.push('skip name')
    }
    

    if (CONFIG.FILTER_BY_TOPIC && !repo.topics?.includes(CONFIG.FILTER_BY_TOPIC)) {
      skipCount.noTopic++
      reasons.push(`no topic '${CONFIG.FILTER_BY_TOPIC}'`)
    }
    
    const pass = reasons.length === 0
    

    if (!pass) {
      console.log(`   ❌ ${repo.name} - SKIP: ${reasons.join(', ')}`)
    } else {
      const topics = repo.topics?.length > 0 ? repo.topics.join(', ') : 'no topics'
      console.log(`   ✅ ${repo.name} - PASS (topics: ${topics})`)
    }
    
    return pass
  })
  
 
  console.log('-'.repeat(70))
  console.log('\n📈 Filter Summary:')
  console.log(`   Total repos: ${repos.length}`)
  console.log(`   ✅ Passed: ${filtered.length}`)
  console.log(`   ❌ Skipped: ${repos.length - filtered.length}`)
  console.log('\n   Skip reasons:')
  console.log(`   - Fork: ${skipCount.fork}`)
  console.log(`   - Archived: ${skipCount.archived}`)
  console.log(`   - No description: ${skipCount.noDescription}`)
  console.log(`   - Skip name: ${skipCount.skipName}`)
  if (CONFIG.FILTER_BY_TOPIC) {
    console.log(`   - No topic '${CONFIG.FILTER_BY_TOPIC}': ${skipCount.noTopic}`)
  }
  
  return filtered
}


function transformReposToProjects(repos: GitHubRepo[]): ProjectResponse[] {
  const filteredRepos = filterRepos(repos)
  
  console.log('\n🔄 Transforming to project format...')
  
  const projects = filteredRepos.map(repo => ({
    title: formatRepoName(repo.name),
    image: generateRepoImage(repo.name),
    deskripsi: repo.description,
    type: detectProjectType(repo),
    demo: repo.homepage || undefined,
    repo: repo.html_url
  }))
  
  console.log(`✅ Transformed ${projects.length} projects`)
  
  return projects
}


function formatRepoName(name: string): string {
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}


function generateRepoImage(repoName: string): string {
  return `https://opengraph.githubassets.com/1/${CONFIG.GITHUB_USERNAME}/${repoName}`
}


function detectProjectType(repo: GitHubRepo): string {
  const topics = repo.topics || []
  const language = repo.language?.toLowerCase() || ''
  

  const typeMap: Record<string, string[]> = {
    api: ['api', 'backend', 'express', 'fastapi', 'nestjs'],
    mobile: ['mobile', 'android', 'ios', 'flutter', 'react-native', 'kotlin', 'swift'],
    web: ['web', 'frontend', 'nextjs', 'react', 'vue', 'angular']
  }
  
  for (const [type, keywords] of Object.entries(typeMap)) {
    if (keywords.some(keyword => topics.includes(keyword))) {
      return type
    }
  }
  

  const languageMap: Record<string, string[]> = {
    mobile: ['java', 'kotlin', 'swift', 'dart', 'objective-c'],
    api: ['python', 'go', 'rust', 'php', 'ruby', 'java'],
    web: ['javascript', 'typescript', 'html', 'css', 'vue', 'svelte']
  }
  
  for (const [type, languages] of Object.entries(languageMap)) {
    if (languages.includes(language)) {
      return type
    }
  }
  

  return 'web'
}

export async function HEAD() {
  return new NextResponse(null, { 
    status: 200,
    headers: {
      'X-API-Version': '1.0.0'
    }
  })
}