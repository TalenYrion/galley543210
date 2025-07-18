import React, { useEffect, useState } from "react";

export default function Use() {
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState("waifu");
  const [images, setImages] = useState([]);
  const [limit, setLimit] = useState(12);

  // Get all tags
  useEffect(() => {
    fetch("https://api.waifu.im/tags")
      .then((res) => res.json())
      .then((data) => {
        const safeTags = data.vers.filter(
          (tag) =>
            ![
              "ecchi",
              "ero",
              "hentai",
              "milf",
              "oral",
              "boobjob",
              "ass",
            ].includes(tag)
        );
        setTags(safeTags);
      });
  }, []);

  // Get images for selected tag + limit
  useEffect(() => {
    fetch(
      `https://api.waifu.im/search?included_tags=${selectedTag}&many=true&limit=${limit}`
    )
      .then((res) => res.json())
      .then((data) => setImages(data.images));
  }, [selectedTag, limit]);

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-center text-blue-700">
        Anime Image Gallery
      </h1>

      {/* Tag filter */}
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-3 py-1 rounded-full transition ${
              selectedTag === tag
                ? "bg-blue-600 text-white"
                : "bg-white border border-blue-300 text-blue-600"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Image count selector */}
      <div className="mb-4 text-center">
        <label className="mr-2 font-medium">Images to load:</label>
        <select
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="p-2 border rounded"
        >
          {[6, 12, 18, 24, 30].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>

      {/* Image gallery */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((img) => (
          <div
            key={img.signature}
            className="bg-white rounded-lg shadow overflow-hidden flex flex-col"
          >
            <img
              src={img.url}
              alt="anime"
              className="w-full object-contain"
              style={{ height: "300px" }}
            />
            <div className="p-3 flex justify-between items-center">
              <span className="text-sm text-gray-500">{selectedTag}</span>
              <a
                href={img.url}
                download
                className="text-blue-500 text-sm hover:underline"
              >
                Download
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
