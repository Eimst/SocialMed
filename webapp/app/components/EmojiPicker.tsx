import React from 'react';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

type Props = {
    addEmoji: any
}

function EmojiPicker({addEmoji}: Props) {
    return (
        <div className="absolute bottom-12 right-2 z-50 bg-white rounded-lg shadow-lg">
            <Picker
                data={data}
                onEmojiSelect={addEmoji}
                theme="light" // Light theme for a cleaner look
                previewPosition="none" // Removes the large preview section
                searchPosition="none" // Hides the search bar if not needed
                maxFrequentRows={1} // Reduce frequently used emojis for compactness
                perLine={8}

            />
        </div>
    );
}

export default EmojiPicker;