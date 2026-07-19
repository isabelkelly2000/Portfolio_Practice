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
      name: 'instagramWidgetUrl',
      title: 'Instagram Widget Embed URL',
      type: 'url',
      description: 'The iframe "src" URL from your LightWidget embed (lightwidget.com — create a free widget connected to your Instagram account, then copy the src from the generated iframe code, e.g. "//lightwidget.com/widgets/xxxxxx.html").',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'About Page'}
    },
  },
})
