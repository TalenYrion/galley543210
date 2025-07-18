// import React, { useEffect, useState } from "react";

// export default function Gallery() {
//   const [tags, setTags] = useState([]);
//   const [safeTags, setSafeTags] = useState([]);
//   const [unSafeTags, setUnSafeTags] = useState([]);
//   const [selectedTag, setSeletedTag] = useState("ass");
//   const [limit, setLimit] = useState(12);
//   const [images, setImages] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Fetch tags
//   useEffect(() => {
//     fetch(`https://api.waifu.im/tags`)
//       .then((res) => res.json())
//       .then((data) => {
//         const versatileTags = data?.versatile || [];
//         const nsfw = data?.nsfw || [];
//         setSafeTags(versatileTags);
//         setUnSafeTags(nsfw);
//         setTags([...safeTags, ...unSafeTags]);
//       })
//       .catch((err) => console.log("error", err));
//   }, [safeTags, unSafeTags]);

//   // Fetch images
//   useEffect(() => {
//     setLoading(true);
//     fetch(
//       `https://api.waifu.im/search?included_tags=${selectedTag}&many=true&limit=${limit}`
//     )
//       .then((res) => res.json())
//       .then((data) => {
//         setImages(data.images);
//         setLoading(false);
//       });
//   }, [limit, selectedTag]);

//   // Infinite scroll handler
//   useEffect(() => {
//     const handleScroll = () => {
//       const scrollTop = window.scrollY;
//       const windowHeight = window.innerHeight;
//       const fullHeight = document.documentElement.scrollHeight;

//       if (scrollTop + windowHeight + 100 >= fullHeight && !loading) {
//         setLimit((prev) => prev + 12);
//       }
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [loading]);

//   // Download function
//   async function downloadImage(url) {
//     try {
//       const res = await fetch(url);
//       const blob = await res.blob();

//       const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
//       const filename = `waifu-${timestamp}.jpg`;

//       const handle = await window.showSaveFilePicker({
//         suggestedName: filename,
//         types: [
//           {
//             description: "Image files",
//             accept: { "image/jpeg": [".jpg"] },
//           },
//         ],
//       });

//       const writable = await handle.createWritable();
//       await writable.write(blob);
//       await writable.close();
//     } catch (err) {
//       console.error("Download failed or was canceled:", err);
//     }
//   }

//   return (
//     <div className="h-full flex flex-col items-center">
//       <h1 className="m-4 text-3xl font-bold text-blue-600">Gallery</h1>
//       <div className="mt-5 text-xl flex gap-3">
//         <label>Tags: </label>
//         <select
//           value={selectedTag}
//           onChange={(e) => {
//             setSeletedTag(e.target.value);
//             setLimit(12);
//           }}
//           className="px-2 rounded-sm border"
//         >
//           {tags && tags.length > 0 ? (
//             tags.map((tag) => (
//               <option value={tag} key={tag}>
//                 {tag}
//               </option>
//             ))
//           ) : (
//             <option disabled>Loading tags...</option>
//           )}
//         </select>
//       </div>

//       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-5 gap-5 w-full px-5">
//         {images.map((image) => (
//           <div
//             key={image.signature}
//             className="overflow-hidden bg-white shadow rounded-md"
//           >
//             <img
//               src={image.url}
//               alt="anime"
//               className="w-full object-contain"
//               style={{ height: "300px" }}
//             />
//             <div className="flex justify-between mx-2 my-4 items-center">
//               <span className="text-gray-600">{selectedTag}</span>
//               <button
//                 onClick={() => downloadImage(image.url)}
//                 className="text-blue-500 text-sm hover:underline"
//               >
//                 Download
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {loading && (
//         <p className="text-center my-5 text-gray-500">Loading more...</p>
//       )}
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";

export default function Gallery() {
  const [tags, setTags] = useState([]);
  const [safeTags, setSafeTags] = useState([]);
  const [unSafeTags, setUnSafeTags] = useState([]);
  const [selectedTag, setSeletedTag] = useState("ass");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1); // for pagination

  // Fetch tags
  // useEffect(() => {
  //   fetch(`https://api.waifu.im/tags`)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       const versatileTags = data?.versatile || [];
  //       setTags(versatileTags);
  //     })
  //     .catch((err) => console.error("Failed to fetch tags:", err));
  // }, []);
  useEffect(() => {
    fetch(`https://api.waifu.im/tags`)
      .then((res) => res.json())
      .then((data) => {
        const versatileTags = data?.versatile || [];
        const nsfw = data?.nsfw || [];
        setSafeTags(versatileTags);
        setUnSafeTags(nsfw);
        setTags([...safeTags, ...unSafeTags]);
      })
      .catch((err) => console.log("error", err));
  }, [safeTags, unSafeTags]);

  // Fetch images
  useEffect(() => {
    setLoading(true);
    fetch(
      `https://api.waifu.im/search?included_tags=${selectedTag}&many=true&limit=12&page=${page}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (page === 1) {
          setImages(data.images); // Replace if first page (e.g. tag changed)
        } else {
          setImages((prev) => [...prev, ...data.images]); // Append otherwise
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch images:", err);
        setLoading(false);
      });
  }, [page, selectedTag]);

  // Infinite scroll
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

  // Reset page when tag changes
  useEffect(() => {
    setPage(1);
  }, [selectedTag]);

  // Download with unique name
  async function downloadImage(url) {
    try {
      const res = await fetch(url);
      const blob = await res.blob();

      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const filename = `waifu-${timestamp}.jpg`;

      const handle = await window.showSaveFilePicker({
        suggestedName: filename,
        types: [
          {
            description: "Image files",
            accept: { "image/jpeg": [".jpg"] },
          },
        ],
      });

      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
    } catch (err) {
      console.error("Download failed or was canceled:", err);
    }
  }

  return (
    <div className="h-full flex flex-col items-center">
      <h1 className="m-4 text-3xl font-bold text-blue-600">Gallery</h1>

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
        {images.map((image) => (
          <div
            key={image.signature}
            className="overflow-hidden bg-white shadow rounded-md"
          >
            <img
              src={image.url}
              alt="anime"
              className="w-full object-contain"
              style={{ height: "300px" }}
            />
            <div className="flex justify-between mx-2 my-4 items-center">
              <span className="text-gray-600">{selectedTag}</span>
              <button
                onClick={() => downloadImage(image.url)}
                className="text-blue-500 text-sm hover:underline"
              >
                Download
              </button>
            </div>
          </div>
        ))}
      </div>

      {loading && (
        <p className="text-center my-6 text-gray-500 text-lg">
          Loading more...
        </p>
      )}
    </div>
  );
}
