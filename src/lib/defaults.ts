/**
 * Default media fallback URLs
 * Used when projects have no uploaded media
 */

export const DEFAULT_MEDIA = {
  // Generic project images
  project_default:
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop',

  // Category-specific defaults
  technology:
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop',
  business:
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
  healthcare:
    'https://images.unsplash.com/photo-1576091160550-112173f7f869?w=800&h=600&fit=crop',
  ecommerce:
    'https://images.unsplash.com/photo-1563062282-a5fb92a28254?w=800&h=600&fit=crop',
  design:
    'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
  education:
    'https://images.unsplash.com/photo-1522202176988-66f6b9a3ee69?w=800&h=600&fit=crop',
  ai: 'https://images.unsplash.com/photo-1677442d019cecf8afc3fa566339bc755?w=800&h=600&fit=crop',
  finance:
    'https://images.unsplash.com/photo-1559329007-40790c9c8e4a?w=800&h=600&fit=crop',
  social:
    'https://images.unsplash.com/photo-1611532736bdc-9ab65baee0f2?w=800&h=600&fit=crop',
  video:
    'https://media.istockphoto.com/id/1462128408/video/abstract-geometric-blue-background-with-glowing-squares.mp4?s=mp4-640x640-is&k=20&c=zQrJXQMwFfvO_MKLxvqwM2e0TpOkGfD5Hx_wIqfRCO4=',
};

/**
 * Get default media based on project title
 * Intelligently matches project to category
 */
export function getDefaultMediaForProject(title: string): string {
  const titleLower = title.toLowerCase();

  if (titleLower.includes('health') || titleLower.includes('medical')) {
    return DEFAULT_MEDIA.healthcare;
  }
  if (titleLower.includes('ai') || titleLower.includes('chat')) {
    return DEFAULT_MEDIA.ai;
  }
  if (titleLower.includes('estate') || titleLower.includes('real')) {
    return DEFAULT_MEDIA.business;
  }
  if (
    titleLower.includes('shop') ||
    titleLower.includes('store') ||
    titleLower.includes('commerce')
  ) {
    return DEFAULT_MEDIA.ecommerce;
  }
  if (
    titleLower.includes('food') ||
    titleLower.includes('delivery') ||
    titleLower.includes('bite')
  ) {
    return DEFAULT_MEDIA.ecommerce;
  }
  if (titleLower.includes('design') || titleLower.includes('creative')) {
    return DEFAULT_MEDIA.design;
  }
  if (titleLower.includes('learn') || titleLower.includes('education')) {
    return DEFAULT_MEDIA.education;
  }
  if (titleLower.includes('finance') || titleLower.includes('bank')) {
    return DEFAULT_MEDIA.finance;
  }
  if (titleLower.includes('social') || titleLower.includes('network')) {
    return DEFAULT_MEDIA.social;
  }

  return DEFAULT_MEDIA.project_default;
}

interface MediaItem {
  url: string;
  type: 'image' | 'video';
  publicId: string;
}

interface Project {
  _id?: string;
  title: string;
  media?: MediaItem[];
}

/**
 * Ensure project has media
 * Adds default media if project has none
 */
export function ensureProjectMedia(project: Project): MediaItem[] {
  if (project.media && project.media.length > 0) {
    return project.media;
  }

  const defaultUrl = getDefaultMediaForProject(project.title);
  return [
    {
      url: defaultUrl,
      type: 'image',
      publicId: `default_${project._id}`,
    },
  ];
}

/**
 * Get single media item for project
 * Returns first media or default
 */
export function getProjectThumbnail(project: Project): MediaItem {
  const media = ensureProjectMedia(project);
  // ensureProjectMedia always returns at least one element
  return media[0]!;
}
