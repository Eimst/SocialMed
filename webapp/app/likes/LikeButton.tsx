import React, {useEffect, useState} from 'react';
import {FaHeart, FaRegHeart} from "react-icons/fa";
import {Like} from "@/types";
import {deleteLike, postLike} from "@/app/actions/likeActions";
import toast from "react-hot-toast";
import {useUserStore} from "@/hooks/useUserStore";
import Modal from "@/app/components/Modal";
import User from "@/app/components/User";

type Props = {
    currentLikes: Like[];
    postId: string;
}

function LikeButton({currentLikes, postId}: Props) {
    const user = useUserStore(state => state.user);
    const [isModalOpen, setModalOpen] = useState(false);
    const [likes, setLikes] = useState<Like[]>(currentLikes);
    const [userLikeId, setUserLikeId] = useState<string | null>(null);

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    const createLike = async () => {
        const response = await postLike(postId);
        if (response.error) {
            toast.error(response.error.message);
        } else {
            setLikes(prevLikes => [...prevLikes, response]);
            setUserLikeId(response.id);
        }
    }

    const removeLike = async () => {
        const response = await deleteLike(postId, userLikeId!);
        if (response.error) {
            toast.error(response.error.message);
        } else {
            setLikes(prevLikes => prevLikes.filter(like => like.id !== userLikeId));
            setUserLikeId(null);
        }
    }

    const handleLikeActions = async () => {
        if (userLikeId)
            await removeLike()
        else
            await createLike()
    }

    useEffect(() => {
        if (user) {
            const like = likes.find(like => like.userId === user.profileId);
            setUserLikeId(like?.id ?? null);
        }
    }, [likes, user])

    return (
        <div className="relative">
            <div className="flex cursor-pointer gap-2.5 items-center" onClick={handleLikeActions}>
                <div className="relative">
                    {userLikeId ? <FaHeart size={25} color="red"/> : <FaRegHeart size={25} color="red"/>}

                    {likes.length > 0 && (
                        <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1 hover:bg-red-800"
                              onClick={(e) => {
                                  e.stopPropagation();
                                  openModal();
                              }}>
                            {likes.length}
                        </span>
                    )}
                </div>
                <span className="text-md text-black">{userLikeId ? "Liked" : "Like"}</span>
            </div>
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <div>
                    <span className={`flex justify-center text-black font-semibold`}>People who liked this post</span>
                    {likes.length > 0 && likes.map(like => (
                        <div key={like.userProfile.profileId} className={`flex gap-5 -mx-6 shadow items-center p-4`}>
                            <User user={like.userProfile} />
                        </div>
                    ))}
                </div>
            </Modal>
        </div>
    );

}

export default LikeButton;