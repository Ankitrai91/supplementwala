import {
  DndContext,
  closestCenter
} from "@dnd-kit/core"

import {
  SortableContext,
  arrayMove,
  rectSortingStrategy
} from "@dnd-kit/sortable"

import SortableItem from "./SortableItem"

export default function ImagePreviewGrid({ images, setImages }) {

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over) return

    if (active.id !== over.id) {
      const oldIndex = images.findIndex(i => i.id === active.id)
      const newIndex = images.findIndex(i => i.id === over.id)

      setImages(arrayMove(images, oldIndex, newIndex))
    }
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={images.map(i => i.id)} strategy={rectSortingStrategy}>
        <div className="image-preview-grid">
          {images.map((img, index) => (
            <SortableItem key={img.id} id={img.id} img={img} index={index} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
