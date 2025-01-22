

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
    status: FriendStatusType
    dateCreated: string
}

export interface CustomError {
    message: string
    status: number
}

export interface MessageType {
    message: string
    sender: UserProfileInfo
    receiver: UserProfileInfo
    dateCreated: string
    isRead: boolean
}

export interface NotificationType {
    id: string
    initiator: UserProfileInfo
    date: string
    text: string
}

export type FriendStatusType = "WaitingForConfirmation" | "NeedToConfirm" | "Friend" | "";
