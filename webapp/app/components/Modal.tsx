import React, {ReactNode} from 'react';


type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
};

function Modal({ isOpen, onClose, children }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-15 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg relative w-1/3 h-1/2">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                >
                    ✕
                </button>
                {children}
            </div>
        </div>
    );
}

export default Modal;