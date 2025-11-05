import { type SchemaTypeDefinition } from 'sanity'
import heroSection from './heroSection';
import galleryImage from './galleryImage';
import meetingSection from './meetingSection';
import aboutUsSection from "./aboutUsSection";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [heroSection, galleryImage, meetingSection, aboutUsSection],
}
