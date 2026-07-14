import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Project Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'Used for the case study URL (e.g. /casestudy/my-project)',
      options: {source: 'title', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'company',
      title: 'Company Name',
      type: 'string',
    }),
    defineField({
      name: 'role',
      title: 'Your Role',
      type: 'string',
      description: 'e.g. UX Designer, Visual Designer',
    }),
    defineField({
      name: 'description',
      title: 'Short Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'tags',
      title: 'Card Pills',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
      description: 'Short buzzwords shown as pills on the project card — e.g. "UX", "Figma", "Print"',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first (1 = top left)',
    }),

    // Case study fields
    defineField({
      name: 'subtitle',
      title: 'Case Study Subtitle',
      type: 'string',
      description: 'The intro sentence shown below the title on the case study page',
    }),
    defineField({
      name: 'client',
      title: 'Client',
      type: 'string',
      description: 'Shown in the meta strip, e.g. "Airbnb (Internal — multiple teams)"',
    }),
    defineField({
      name: 'deliverables',
      title: 'Deliverables',
      type: 'array',
      of: [{type: 'string'}],
      description: 'One item per deliverable — shown as a list in the meta strip',
    }),
    defineField({
      name: 'date',
      title: 'Date / Timeline',
      type: 'string',
      description: 'e.g. "May 2023 – Present"',
    }),
    defineField({
      name: 'aboutText',
      title: 'About This Project',
      type: 'text',
      rows: 6,
      description: 'Separate paragraphs with a blank line between them',
    }),
    defineField({
      name: 'challengeText',
      title: 'The Challenge',
      type: 'text',
      rows: 6,
      description: 'Separate paragraphs with a blank line between them',
    }),
    defineField({
      name: 'solutionText',
      title: 'The Solution',
      type: 'text',
      rows: 6,
      description: 'Separate paragraphs with a blank line between them',
    }),
    defineField({
      name: 'template',
      title: 'Case Study Template',
      type: 'string',
      description: 'Which HTML page to use. Leave blank to use casestudy.html',
      initialValue: 'casestudy.html',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'company',
      media: 'coverImage',
    },
  },
})
