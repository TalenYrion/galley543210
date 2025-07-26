import React, { useEffect, useState, useRef } from "react";
import {
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaDownload,
} from "react-icons/fa";

export default function Gallery() {
  const [tags, setTags] = useState([]);
  const [selectedTag, setSeletedTag] = useState("ass");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [isSlideshowOpen, setIsSlideshowOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  useEffect(() => {
    fetch(`https://api.waifu.im/tags`)
      .then((res) => res.json())
      .then((data) => {
        const versatileTags = data?.versatile || [];
        const nsfw = data?.nsfw || [];
        setTags([...versatileTags, ...nsfw]);
      })
      .catch((err) => console.log("error", err));
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch(
      `https://api.waifu.im/search?included_tags=${selectedTag}&many=true&limit=12&page=${page}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (page === 1) {
          setImages(data.images);
        } else {
          setImages((prev) => [...prev, ...data.images]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch images:", err);
        setLoading(false);
      });
  }, [page, selectedTag]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight + 100 >= fullHeight && !loading) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

  useEffect(() => {
    setPage(1);
  }, [selectedTag]);

  const downloadImage = async (url, name = "anime") => {
    const response = await fetch(url);
    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = name + ".jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImageClick = (index) => {
    setCurrentIndex(index);
    setIsSlideshowOpen(true);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    handleSwipeGesture();
  };

  const handleSwipeGesture = () => {
    const distance = touchStartX.current - touchEndX.current;
    const threshold = 50; // Minimum swipe distance

    if (distance > threshold) {
      // Swipe Left
      setCurrentIndex((prev) => {
        const nextIndex = prev + 1;
        if (nextIndex >= images.length - 1 && !loading) {
          setPage((p) => p + 1);
        }
        return Math.min(nextIndex, images.length - 1);
      });
    } else if (distance < -threshold) {
      // Swipe Right
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
    }
  };

  return (
    <div className="h-full flex flex-col items-center">
      <h1 className="m-4 text-3xl font-bold text-blue-600">Gallery</h1>

      <div>
        <div className="w-full px-5 py-3 bg-white sticky top-0 z-50 flex items-center gap-3 shadow-md text-xl">
          <label>Tags:</label>
          <select
            value={selectedTag}
            onChange={(e) => setSeletedTag(e.target.value)}
            className="px-2 py-1 rounded-sm border"
          >
            {tags.length > 0 ? (
              tags.map((tag) => (
                <option value={tag} key={tag}>
                  {tag}
                </option>
              ))
            ) : (
              <option disabled>Loading tags...</option>
            )}
          </select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-5 gap-5 w-full px-5">
          {images.map((image, index) => (
            <div
              key={index}
              className="overflow-hidden bg-white shadow rounded-md"
            >
              <img
                src={image.url}
                alt="anime"
                className="w-full object-contain"
                style={{ height: "300px" }}
                onClick={() => handleImageClick(index)}
              />
              <div className="flex justify-between mx-2 my-4 items-center">
                <span className="text-gray-600">{selectedTag}</span>
                <button
                  onClick={() => downloadImage(image.url)}
                  className="text-blue-500 text-md hover:underline cursor-pointer"
                >
                  <FaDownload />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isSlideshowOpen && (
        <div
          className="fixed inset-0 bg-black z-[70] flex flex-col items-center justify-center"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Exit Button */}
          <button
            onClick={() => setIsSlideshowOpen(false)}
            className="absolute top-4 right-4 text-white text-3xl z-50 cursor-pointer"
            title="Close slideshow"
          >
            <FaTimes />
          </button>

          {/* Slideshow Content */}
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            {/* Previous Button */}
            <button
              className="absolute left-4 text-white text-4xl z-10 cursor-pointer"
              onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
              title="Previous"
            >
              <FaChevronLeft />
            </button>

            {/* Current Image */}
            {images[currentIndex] && (
              <img
                key={images[currentIndex].url}
                src={images[currentIndex].url}
                alt=""
                className="max-h-[90%] max-w-[90%] object-contain"
              />
            )}

            {/* Next Button */}
            <button
              className="absolute right-4 text-white text-4xl z-10 cursor-pointer"
              onClick={() => {
                setCurrentIndex((prev) => {
                  const nextIndex = prev + 1;

                  // If we're approaching the end, trigger load more
                  if (nextIndex >= images.length - 1 && !loading) {
                    setPage((p) => p + 1);
                  }

                  // Clamp to available image list
                  return Math.min(nextIndex, images.length - 1);
                });
              }}
              title="Next"
            >
              <FaChevronRight />
            </button>

            {/* Download Button */}
            <button
              onClick={() => downloadImage(images[currentIndex]?.url)}
              className="absolute bottom-8 right-4 text-white text-2xl bg-blue-600 p-2 rounded-full hover:bg-blue-700 z-20 cursor-pointer"
              title="Download Image"
            >
              <FaDownload />
            </button>
          </div>
        </div>
      )}

      {loading && (
        <p className="text-center my-6 text-gray-500 text-lg">
          Loading more...
        </p>
      )}
    </div>
  );
}
