import React from 'react';
import { FaBookmark, FaShareAlt } from 'react-icons/fa';
import { useHistory } from 'react-router-dom';

interface StoriesCardProps {
  id: string;
  title: string;
  description: string;
  tags: string[];
  author: string;
  date: Date;
}

const StoriesCard: React.FC<StoriesCardProps> = ({
  id,
  title,
  description,
  tags,
  author,
  date,
}) => {
  const history = useHistory();
  const imageUrl = `https://placehold.co/600x400`;
  return (
    <div
      key={id}
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1"
      onClick={() => {
        history.push(`/stories/${id}`);
      }}
    >
      <div className="relative h-[180px] bg-gray-200">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2.5 right-2.5 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300"
            title="Save"
          >
            <FaBookmark className="text-gray-600" />
          </button>
          <button
            className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300"
            title="Share"
          >
            <FaShareAlt className="text-gray-600" />
          </button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2.5">{title}</h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">{description}</p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {tags.map((tag) => (
            <span
              key={tag}
              className="bg-blue-50 text-blue-600 text-xs px-2.5 py-1 rounded-full hover:bg-blue-600 hover:text-white transition-colors duration-300"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex justify-between items-center text-xs text-gray-500">
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center mr-2">
              {author
                .split(' ')
                .map((name) => name[0])
                .join('')}
            </div>
            <span>{author}</span>
          </div>
          <span>{date.toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default StoriesCard;
