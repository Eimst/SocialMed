import React, {useRef, useState} from "react";
import {Cropper, ReactCropperElement} from "react-cropper";
import "cropperjs/dist/cropper.css";
import {getUserInfo, updateProfileImage} from "@/app/actions/userActions";
import toast from "react-hot-toast";


type Props = {
    userId: string
    handleImageUpdate: () => void
}

function EditImage({userId, handleImageUpdate}: Props) {
    const [image, setImage] = useState<string>("");
    const cropperRef = useRef<ReactCropperElement | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const [dragging, setDragging] = useState(false);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = () => {
        setDragging(false);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragging(false);

        let files: FileList | null = null;

        if ("dataTransfer" in e) {
            files = e.dataTransfer.files;
        } else if ("target" in e) {
            files = e.target.files;
        }

        if (files && files.length > 0) {
            const file = files[0];

            if (file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = () => setImage(reader.result as string);
                reader.onerror = () => toast.error("Failed to read file.");
                reader.readAsDataURL(file);
            } else {
                toast.error("Please select a valid image file.");
            }
        }
    };

    const getCroppedImage = async () => {
        const cropper = cropperRef.current?.cropper;
        if (cropper) {
            setIsProcessing(true);
            cropper.getCroppedCanvas().toBlob(async (blob: Blob | null) => {
                    if (blob) {
                        const formData = new FormData();
                        formData.append("image", blob);
                        const response = await updateProfileImage(userId, formData);
                        if (response.error)
                            toast.error(response.error.message);
                        else {
                            toast.success("Profile image updated successfully!");
                            await getUserInfo();
                        }
                    } else {
                        toast.error("Failed to crop the image.");
                    }
                    setIsProcessing(false);
                    handleImageUpdate();
                },
                "image/jpeg",
                0.8);
        } else {
            toast.error("Unexpected error occurred.");
        }
    };

    if (isProcessing) {
        return (
            <div className={`flex flex-col items-center justify-center h-full`}>
                <div
                    className="w-20 h-20 border-8 border-black border-t-transparent rounded-full animate-spin"
                >
                </div>
                <span className={`mt-4 text-xs`}>This might take a few seconds</span>
            </div>
        );
    }

    return (
        <div className="edit-image-container h-full flex flex-col justify-between"
             onDragOver={handleDragOver}
             onDragLeave={handleDragLeave}
             onDrop={handleImageChange}>
            <label
                className={`cursor-pointer flex items-center gap-2 px-4 py-2 font-semibold text-white rounded-lg shadow-md transition duration-300
                ${dragging ? "bg-blue-500" : "bg-blue-600 hover:bg-blue-700"}`}
            >
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                />
                📷 Upload Image
            </label>

            {image ? (
                <Cropper
                    src={image}
                    style={{height: 350, width: "100%"}}
                    initialAspectRatio={1}
                    guides={true}
                    ref={cropperRef}
                />
            ) : (
                <div className={`border-black border-dashed border-2 h-[350px] flex items-center justify-center font-semibold`}>
                    {dragging ? "Release to Upload" : "Drag & Drop or Click to Upload"}
                </div>
            )}
            <button
                onClick={getCroppedImage}
                disabled={!image}
                className={`px-5 py-2 font-semibold text-white rounded-lg shadow-md transition duration-300 
                ${image ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"}`}
            >
                📤 Upload
            </button>

        </div>
    );
}

export default EditImage;
