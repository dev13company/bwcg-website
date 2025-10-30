import { defineField, defineType } from "sanity";

const galleryImage = {
  name: "galleryImage",
  title: "Gallery Images",
  type: "document",
  fields: [
    defineField({
      name: "image",
      title: "Gallery Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "alt",
      title: "Alt Text",
      type: "string",
    }),
    defineField({
      name: "weekOf",
      title: "Week Of",
      type: "date",
      description: "Monday date for this week's gallery",
    }),
  ],
};
export default galleryImage
