export interface Author {
  id: number
  username?: string
  email?: string
  avatar?: string | null
}

export interface CommentItem {
  id: number
  content: string
  createdAt: string
  updatedAt?: string
  author?: Author | null
}

export interface PostListItem {
  id: number
  title: string
  slug: string
  description?: string | null
  createdAt: string
  updatedAt?: string
  likeCount: number
  author?: Author | null
  _count?: {
    comments: number
  }
}

export interface PostDetail {
  id: number
  title: string
  slug: string
  description?: string | null
  content: string
  createdAt: string
  updatedAt?: string
  likeCount: number
  author?: Author | null
  comments: CommentItem[]
}

export interface LikeResponse {
  success: boolean
  likeCount: number
}

export interface CreatePostPayload {
  title: string
  description?: string
  content: string
  published?: boolean
}

export interface CreatePostResponse {
  success: boolean
  post: {
    id: number
    title: string
    slug: string
    description?: string | null
    content: string
    createdAt: string
    updatedAt?: string
    published?: boolean
    likeCount?: number
    authorId?: number | null
    author?: Author | null
  }
}

export interface DashboardPostItem {
  id: number
  title: string
  slug: string
  description?: string | null
  published: boolean
  createdAt: string
  updatedAt?: string
  likeCount: number
  _count?: {
    comments: number
  }
}

export interface DashboardMeResponse {
  user: Author & {
    email?: string
    createdAt?: string
  }
  posts: DashboardPostItem[]
}

export interface UpdatePostVisibilityResponse {
  success: boolean
  post: {
    id: number
    published: boolean
    updatedAt?: string
  }
}

export interface DeletePostResponse {
  success: boolean
  id: number
}
