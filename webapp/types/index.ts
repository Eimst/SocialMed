
export interface Post {
    id: string
    content: string
    imageUrl: string
    dateCreated: string
    comments: Comment[]
    likes: Like[]
    userId: string
    userProfile: UserProfileInfo
}

export interface Comment {
    id: string
    text: string
    dateCreated: string
    userId: string
    postId: string
    userProfile: UserProfileInfo
}

export interface Like {
    id: string
    dateCreated: string
    userId: string
    userProfile: UserProfileInfo
    postId: string
}


export interface UserProfileInfo {
    firstName: string
    lastName: string
    profileId: string
    profilePictureUrl: string
}

export interface Friend {
    userProfileInfo: UserProfileInfo
    status: string
    dateCreated: string
}