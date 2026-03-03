'use client';
// components/blog/TagSelector.tsx
import { useState, useRef, useEffect } from 'react';

interface TagSelectorProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
}

// Predefined tags - can be edited by user
const PREDEFINED_TAGS = [
  'Technology',
  'Design',
  'Programming',
  'Web Development',
  'Mobile',
  'AI & ML',
  'Data Science',
  'DevOps',
  'Cloud',
  'Security',
  'Blockchain',
  'JavaScript',
  'Python',
  'React',
  'Node.js',
  'Tutorial',
  'Guide',
  'Best Practices',
  'Career',
  'Productivity',
  'Startup',
  'Business',
  'Marketing',
  'Lifestyle',
  'Travel',
  'Food',
  'Health',
  'Fitness',
  'Photography',
  'Art',
  'Music',
  'Books',
  'Writing',
  'Opinion',
  'News',
  'Review',
];

export default function TagSelector({ selectedTags, onChange }: TagSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [customTag, setCustomTag] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter tags based on search
  const filteredTags = PREDEFINED_TAGS.filter(tag =>
    tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onChange(selectedTags.filter(t => t !== tag));
    } else {
      if (selectedTags.length < 5) {
        onChange([...selectedTags, tag]);
      }
    }
  };

  const addCustomTag = () => {
    const trimmedTag = customTag.trim();
    if (trimmedTag && !selectedTags.includes(trimmedTag) && selectedTags.length < 5) {
      onChange([...selectedTags, trimmedTag]);
      setCustomTag('');
      setSearchQuery('');
    }
  };

  const removeTag = (tag: string) => {
    onChange(selectedTags.filter(t => t !== tag));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-xs text-ink-600 uppercase tracking-wider mb-2" style={{ fontFamily: 'Lora, serif' }}>
        Tags (Max 5)
      </label>

      {/* Selected Tags Display */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedTags.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-ink-100 text-ink-800 border border-ink-200"
              style={{ fontFamily: 'Lora, serif' }}
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:text-ink-950"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={selectedTags.length >= 5}
        className="w-full px-4 py-3 border-2 border-ink-200 bg-white text-ink-700 text-left hover:border-ink-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        style={{ fontFamily: 'Lora, serif' }}
      >
        {selectedTags.length >= 5 ? 'Maximum tags selected' : 'Select or add tags...'}
      </button>

      {/* Dropdown Menu */}
      {isOpen && selectedTags.length < 5 && (
        <div className="absolute z-10 w-full mt-1 bg-white border-2 border-ink-200 max-h-80 overflow-y-auto shadow-lg">
          {/* Search Input */}
          <div className="p-3 border-b border-ink-200 sticky top-0 bg-white">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search or type custom tag..."
              className="w-full px-3 py-2 border border-ink-200 text-sm focus:outline-none focus:border-ink-400"
              style={{ fontFamily: 'Lora, serif' }}
            />
          </div>

          {/* Add Custom Tag */}
          {searchQuery && !filteredTags.some(t => t.toLowerCase() === searchQuery.toLowerCase()) && (
            <div className="p-2 border-b border-ink-200 bg-ink-50">
              <button
                type="button"
                onClick={() => {
                  setCustomTag(searchQuery);
                  addCustomTag();
                }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-ink-100 transition-colors"
                style={{ fontFamily: 'Lora, serif' }}
              >
                <span className="text-ink-600">Add custom tag:</span>{' '}
                <span className="font-semibold text-ink-900">"{searchQuery}"</span>
              </button>
            </div>
          )}

          {/* Predefined Tags List */}
          <div className="max-h-60 overflow-y-auto">
            {filteredTags.length > 0 ? (
              filteredTags.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    toggleTag(tag);
                    setSearchQuery('');
                  }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-ink-50 transition-colors ${
                    selectedTags.includes(tag) ? 'bg-ink-100 font-semibold' : ''
                  }`}
                  style={{ fontFamily: 'Lora, serif' }}
                >
                  <span className="flex items-center justify-between">
                    {tag}
                    {selectedTags.includes(tag) && (
                      <svg className="w-4 h-4 text-ink-700" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </span>
                </button>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-ink-500 text-sm" style={{ fontFamily: 'Lora, serif' }}>
                No tags found. Type to add a custom tag.
              </div>
            )}
          </div>

          {/* Help Text */}
          <div className="p-3 bg-ink-50 border-t border-ink-200">
            <p className="text-xs text-ink-600" style={{ fontFamily: 'Lora, serif' }}>
              💡 Tip: Select from the list or type to create custom tags
            </p>
          </div>
        </div>
      )}

      {/* Selected Count */}
      <p className="text-xs text-ink-500 mt-2" style={{ fontFamily: 'Lora, serif' }}>
        {selectedTags.length} of 5 tags selected
      </p>
    </div>
  );
}
