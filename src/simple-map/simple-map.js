/**
 * BLOCK: tiwit-map-blocks-bundle
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

import SimpleMapEdit from './SimpleMapEdit'

const { __ } = wp.i18n // Import __() from wp.i18n

const { registerBlockType } = wp.blocks

/**
 * Register: aa Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType('arnaudban/simple-map', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __('Simple map'), // Block title.
	icon: 'location-alt', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [__('map'), __('location')],
	supports: {
		html: false,
		align: true,
		alignWide: true
	},
	attributes: {
		address: {
			type: 'string'
		},
		lat: {
			type: 'string'
		},
		lon: {
			type: 'string'
		},
		popup: {
			type: 'string'
		},
		style: {
			type: 'string',
			default: 'mapbox://styles/mapbox/outdoors-v10'
		},
		zoom: {
			type: 'int',
			default: 13
		}
	},

	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	edit: SimpleMapEdit,

	/**
	 * The save function defines the way in which the different attributes should be combined
	 * into the final markup, which is then serialized by Gutenberg into post_content.
	 *
	 * The "save" property must be specified and must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	save: function({ attributes, className }) {
		const dataMap = JSON.stringify({
			lat: attributes.lat,
			lon: attributes.lon,
			popup: attributes.popup,
			align: attributes.align,
			style: attributes.style,
			zoom: attributes.zoom
		})

		return <div className={className} data-map={dataMap} />
	}
})
