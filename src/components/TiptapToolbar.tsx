import { Button } from '@/components/ui/button'
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link as LinkIcon,
  Smile,
} from 'lucide-react'
import { useState } from 'react'
import EmojiPicker, { type EmojiClickData } from 'emoji-picker-react'
import { Editor } from '@tiptap/react'

type Props = {
  editor: Editor | null
}

export default function TiptapToolbar({ editor }: Props) {
  const [showEmoji, setShowEmoji] = useState(false)

  if (!editor) return null

  const addLink = () => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('Enter URL:', previousUrl)
    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url })
        .run()
    }
  }

  const addEmoji = (emojiData: EmojiClickData) => {
    editor.chain().focus().insertContent(emojiData.emoji).run()
    setShowEmoji(false)
  }

  return (
    <div className="flex items-center gap-2 border-b pb-2 mb-2 flex-wrap">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation()
          editor.chain().focus().toggleBold().run()
        }}
        className={editor.isActive('bold') ? 'bg-gray-200' : ''}
      >
        <Bold size={16} />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation()
          editor.chain().focus().toggleItalic().run()
        }}
        className={editor.isActive('italic') ? 'bg-gray-200' : ''}
      >
        <Italic size={16} />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation()
          editor.chain().focus().toggleUnderline().run()
        }}
        className={editor.isActive('underline') ? 'bg-gray-200' : ''}
      >
        <Underline size={16} />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation()
          editor.chain().focus().toggleBulletList().run()
        }}
        className={editor.isActive('bulletList') ? 'bg-gray-200' : ''}
      >
        <List size={16} />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation()
          editor.chain().focus().toggleOrderedList().run()
        }}
        className={editor.isActive('orderedList') ? 'bg-gray-200' : ''}
      >
        <ListOrdered size={16} />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation()
          addLink()
        }}
        className={editor.isActive('link') ? 'bg-gray-200' : ''}
      >
        <LinkIcon size={16} />
      </Button>

      <div className="relative">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation()
            setShowEmoji(!showEmoji)
          }}
        >
          <Smile size={16} />
        </Button>

        {showEmoji && (
          <div className="absolute z-50">
            <EmojiPicker onEmojiClick={addEmoji} />
          </div>
        )}
      </div>
    </div>
  )
}
