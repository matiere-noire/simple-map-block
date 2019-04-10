<?php
/**
 * Blocks Initializer
 *
 * Enqueue CSS/JS of all the blocks.
 *
 * @since 	1.0.0
 * @package CGB
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'enqueue_block_assets', 'simple_map_block_assets' );

/**
 * Enqueue Gutenberg block assets for both frontend + backend.
 *
 * `wp-blocks`: includes block type registration and related functions.
 *
 * @since 1.0.0
 */
function simple_map_block_assets() {

	wp_enqueue_style(
		'mapbox-css',
		'https://api.mapbox.com/mapbox-gl-js/v0.53.0/mapbox-gl.css',
		array(),
		'0.53.0'
	);
	wp_enqueue_style(
		'simple-map-common-css',
		plugins_url( '/src/common.css', dirname( __FILE__ ) ),
		null,
		null 
	);

	if( ! is_admin() ){

		wp_enqueue_script( 'mapbox-js',
			'https://api.mapbox.com/mapbox-gl-js/v0.53.0/mapbox-gl.js',
			array(),
			'0.53.0',
			true
		);

		wp_enqueue_script( 'front-simple-map',
			plugins_url( '/src/simple-map/front-simple-map.js', dirname( __FILE__ ) ),
			array( 'mapbox-js' ),
			'1.0',
			true
		);
		
		wp_localize_script( 'front-simple-map', 'simpleMapData', [
			'mapboxKey' => defined( 'MAPBOX_KEY' ) ? MAPBOX_KEY : null,
		] );
	}

}


add_action( 'enqueue_block_editor_assets', 'simple_map_editor_block_assets' );

/**
 * Enqueue Gutenberg block assets for backend editor.
 *
 * `wp-blocks`: includes block type registration and related functions.
 * `wp-element`: includes the WordPress Element abstraction for describing the structure of your blocks.
 * `wp-i18n`: To internationalize the block's text.
 *
 * @since 1.0.0
 */
function simple_map_editor_block_assets() {
	// Scripts.
	wp_enqueue_script(
		'simple-map-editor-js',
		plugins_url( '/dist/blocks.build.js', dirname( __FILE__ ) ),
		array( 'wp-blocks', 'wp-i18n', 'wp-element' ),
		'1.0'
	);
	
	wp_localize_script( 'simple-map-editor-js', 'simpleMapData', [
		'mapboxKey' => defined( 'MAPBOX_KEY' ) ? MAPBOX_KEY : null,
	] );

}

