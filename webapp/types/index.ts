
export interface Post {
    id: string
    content: string
    imageUrl: string
    dateCreated: string
    comments: Comment[]
    likes: Like[]
    userId: string
    userProfile: UserProfile
}

export interface Comment {
    id: string
    text: string
    dateCreated: string
    userId: string
    postId: string
    userProfile: UserProfile
}

export interface UserProfile {
    firstName: string
    lastName: string
    profilePictureUrl: string
}

export interface Like {
    id: string
    dateCreated: string
    userId: string
    userProfile: UserProfile
    postId: string
}


export interface UserProfileInfo {
    firstName: string
    lastName: string
    profileId: string
    profilePictureUrl: string
}