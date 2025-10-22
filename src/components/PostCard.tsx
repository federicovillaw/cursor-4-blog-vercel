import { Post } from '@/hooks/usePosts';
import Image from 'next/image';

/**
 * PostCard Component
 * 
 * This component displays a summary of a single post in a visually appealing
 * card format. It's designed to be used in the PostFeed grid.
 * It includes hover effects as specified in the PRD.
 */
interface PostCardProps {
  post: Post;
  onClick: () => void;
}

const PostCard = ({ post, onClick }: PostCardProps) => {
  // Truncate the title to the first 40 characters as per the PRD
  const title = post.achievedText.length > 40
    ? `${post.achievedText.substring(0, 40)}...`
    : post.achievedText;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 cursor-pointer group"
    >
      {/* Media Preview */}
      <div className="w-full h-48 bg-gray-200 relative">
        {/* We use a simple div as a placeholder for media like videos or Google Drive links */}
        {/* For images, we can use the Next.js Image component for optimization */}
        {post.mediaUrl.match(/\.(jpeg|jpg|gif|png)$/) ? (
          <Image
            src={post.mediaUrl}
            alt={title}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-500">Media Preview</span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1 truncate" title={post.achievedText}>
          {title}
        </h3>
        <p className="text-sm text-gray-600">By {post.authorName}</p>
      </div>
    </div>
  );
};

export default PostCard;
