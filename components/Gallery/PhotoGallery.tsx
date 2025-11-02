/**
 * Photo Gallery Component
 * Image grid with category filtering
 */

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";
import { galleryPhotos, type GalleryPhoto, type GalleryCategory } from "@/lib/data/gallery";
import { GalleryCategories } from "./GalleryCategories";

// Import categories for photo count display
const categories = [
  { id: "all" as GalleryCategory, label: "All Photos" },
  { id: "graduation" as GalleryCategory, label: "Graduation" },
  { id: "sports" as GalleryCategory, label: "Sports" },
  { id: "academics" as GalleryCategory, label: "Academics" },
  { id: "culture" as GalleryCategory, label: "Culture" },
  { id: "events" as GalleryCategory, label: "Events" },
];

export function PhotoGallery() {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>("all");
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);

  const filteredPhotos =
    activeCategory === "all"
      ? galleryPhotos
      : galleryPhotos.filter((photo) => photo.category === activeCategory);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <GalleryCategories
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* Photo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto mt-12">
          <AnimatePresence>
            {filteredPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                className="group cursor-pointer"
                onClick={() => setSelectedPhoto(photo)}
              >
                <div className="relative h-64 rounded-lg overflow-hidden border-2 border-gold shadow-lg">
                  <Image
                    src={photo.image}
                    alt={photo.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    quality={90}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <h3 className="font-bold text-lg mb-1">{photo.title}</h3>
                    <p className="text-sm text-white/90">{photo.category}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Photo Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8 text-gray-600"
        >
          Showing {filteredPhotos.length} photo{filteredPhotos.length !== 1 ? "s" : ""}
          {activeCategory !== "all" && ` in ${categories.find((c) => c.id === activeCategory)?.label}`}
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-5xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
                aria-label="Close"
              >
                <X className="h-6 w-6 text-gray-900" />
              </button>
              <div className="relative h-[80vh] rounded-lg overflow-hidden">
                <Image
                  src={selectedPhoto.image}
                  alt={selectedPhoto.title}
                  fill
                  className="object-contain"
                  sizes="90vw"
                  quality={90}
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">{selectedPhoto.title}</h3>
                <p className="text-white/90">{selectedPhoto.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
