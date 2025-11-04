import { type SchemaTypeDefinition } from 'sanity'
import heroSection from './heroSection';
import galleryImage from './galleryImage';
import meetingSection from './meetingSection';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [heroSection, galleryImage, meetingSection],
}
