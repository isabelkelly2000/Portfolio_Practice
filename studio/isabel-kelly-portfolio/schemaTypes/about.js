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
      title: 'Spotify Playlist URL',
      type: 'url',
      description: 'Link to your Spotify playlist (Spotify → playlist → Share → Copy link to playlist). Used for both the Spotify icon and the live playlist embed.',
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
    defineField({
      name: 'instagramFeedId',
      title: 'Instagram Feed ID (Behold.so)',
      type: 'string',
      description: 'The feed-id from your Behold.so widget embed (behold.so — connect your Instagram account, create a widget, then copy the "feed-id" value from the generated <behold-widget> snippet).',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'About Page'}
    },
  },
})
