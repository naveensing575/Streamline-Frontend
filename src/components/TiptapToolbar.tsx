import { Bold, Italic, Underline, List, ListOrdered, Link as LinkIcon, Smile } from "lucide-react";
import { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { Editor } from "@tiptap/react";

type Props = {
  editor: Editor | null;
};

export default function TiptapToolbar({ editor }: Props) {
  const [showEmoji, setShowEmoji] = useState(false);

  if (!editor) return null;

  const addLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const addEmoji = (emojiData: any) => {
    editor.chain().focus().insertContent(emojiData.emoji).run();
    setShowEmoji(false);
  };

  return (
    <div className="flex items-center gap-2 border-b pb-2 mb-2 flex-wrap">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded ${editor.isActive("bold") ? "bg-gray-200" : ""}`}
      >
        <Bold size={16} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded ${editor.isActive("italic") ? "bg-gray-200" : ""}`}
      >
        <Italic size={16} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-2 rounded ${editor.isActive("underline") ? "bg-gray-200" : ""}`}
      >
        <Underline size={16} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded ${editor.isActive("bulletList") ? "bg-gray-200" : ""}`}
      >
        <List size={16} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded ${editor.isActive("orderedList") ? "bg-gray-200" : ""}`}
      >
        <ListOrdered size={16} />
      </button>
      <button
        type="button"
        onClick={addLink}
        className={`p-2 rounded ${editor.isActive("link") ? "bg-gray-200" : ""}`}
      >
        <LinkIcon size={16} />
      </button>
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowEmoji(!showEmoji)}
          className="p-2 rounded"
        >
          <Smile size={16} />
        </button>
        {showEmoji && (
          <div className="absolute z-50">
            <EmojiPicker onEmojiClick={addEmoji} />
          </div>
        )}
      </div>
    </div>
  );
}
