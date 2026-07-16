import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'about',
  title: 'About Page',
  type: 'document',
  fields: [
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'text',
      rows: 6,
      description: 'The main body text on the About page.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'spotifyUrl',
      title: 'Spotify URL',
      type: 'url',
      description: 'Link to your Spotify profile.',
    }),
    defineField({
      name: 'linkedinUrl',
      title: 'LinkedIn URL',
      type: 'url',
      description: 'Link to your LinkedIn profile.',
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Instagram URL',
      type: 'url',
      description: 'Link to your Instagram profile.',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'About Page'}
    },
  },
})
