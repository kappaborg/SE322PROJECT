import { useState, useEffect } from 'react';
import { Image, X, Download, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Screenshots({ testId }) {
  const [screenshots, setScreenshots] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!testId) return;

    setLoading(true);
    fetch(`/api/screenshots/${testId}`)
      .then(res => res.json())
      .then(data => {
        setScreenshots(data.screenshots || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load screenshots:', err);
        setLoading(false);
      });
  }, [testId]);

  const openLightbox = (index) => {
    setSelectedIndex(index);
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
  };

  const navigateImage = (direction) => {
    if (selectedIndex === null) return;
    
    if (direction === 'prev') {
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : screenshots.length - 1));
    } else {
      setSelectedIndex(prev => (prev < screenshots.length - 1 ? prev + 1 : 0));
    }
  };

  const downloadImage = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
  };

  if (loading) {
    return (
      <div className="card h-full flex items-center justify-center">
        <div className="text-center text-gray-400">
          <Image className="w-12 h-12 mx-auto mb-2 opacity-50 animate-pulse" />
          <p>Loading screenshots...</p>
        </div>
      </div>
    );
  }

  if (screenshots.length === 0) {
    return (
      <div className="card h-full flex items-center justify-center">
        <div className="text-center text-gray-400">
          <Image className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No screenshots available</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="card h-full flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <Image className="w-5 h-5 text-primary-400" />
          <h2 className="text-xl font-semibold">Screenshots</h2>
          <span className="text-sm text-gray-400">({screenshots.length})</span>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            {screenshots.map((screenshot, index) => (
              <div
                key={index}
                className="relative group cursor-pointer bg-gray-800 rounded-lg overflow-hidden border border-gray-700/50 hover:border-primary-500/50 transition-colors"
                onClick={() => openLightbox(index)}
              >
                <img
                  src={screenshot.url}
                  alt={screenshot.name || `Screenshot ${index + 1}`}
                  className="w-full h-32 object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Image className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                  <p className="text-xs text-white truncate">
                    {screenshot.name || `Screenshot ${index + 1}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <div className="relative max-w-7xl max-h-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 bg-gray-800 hover:bg-gray-700 rounded-full p-2 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {screenshots.length > 1 && (
              <>
                <button
                  onClick={() => navigateImage('prev')}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-gray-800 hover:bg-gray-700 rounded-full p-2 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={() => navigateImage('next')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-gray-800 hover:bg-gray-700 rounded-full p-2 transition-colors"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </>
            )}

            <img
              src={screenshots[selectedIndex].url}
              alt={screenshots[selectedIndex].name}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-800/80 rounded-lg px-4 py-2 flex items-center gap-4">
              <span className="text-sm text-white">
                {selectedIndex + 1} / {screenshots.length}
              </span>
              <button
                onClick={() => downloadImage(
                  screenshots[selectedIndex].url,
                  screenshots[selectedIndex].name || `screenshot-${selectedIndex + 1}.png`
                )}
                className="btn-secondary flex items-center gap-2 text-sm"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

