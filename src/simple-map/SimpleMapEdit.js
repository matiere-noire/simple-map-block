/**
 * BLOCK: tiwit-map-blocks-bundle
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

import mapboxgl from 'mapbox-gl'

const { Component, Fragment } = wp.element

const { __ } = wp.i18n // Import __() from wp.i18n

const { InspectorControls } = wp.editor

const { PanelBody, TextControl, TextareaControl, RangeControl, Button, Notice } = wp.components

mapboxgl.accessToken = simpleMapData.mapboxKey

class SimpleMapEdit extends Component {
	constructor() {
		super(...arguments)

		this.getLatLongFromAddress = this.getLatLongFromAddress.bind(this)

		this.mapRef = React.createRef()

		this.state = {
			map: null,
			isWaitingForNominatim: false,
			nominatimReturnEmpty: false,
			marker: null
		}
	}

	componentDidMount() {
		this.displayMap()
	}

	componentDidUpdate(prevProps) {
		if (
			this.props.attributes.lat &&
			(this.props.attributes.lat !== prevProps.attributes.lat ||
				this.props.attributes.lon !== prevProps.attributes.lon ||
				this.props.attributes.popup !== prevProps.attributes.popup ||
				this.props.attributes.style !== prevProps.attributes.style ||
				this.props.attributes.zoom !== prevProps.attributes.zoom)
		) {
			this.displayMap()
		}
	}

	displayMap() {
		let { map, marker } = this.state
		const { lat, lon, popup, zoom, style } = this.props.attributes
		if (!map) {
			map = new mapboxgl.Map({
				container: this.mapRef.current,
				center: [-1.5335951, 47.2161494],
				zoom: zoom,
				style
			})

			this.setState({
				map: map
			})
		} else if (marker) {
			//delete every Marker on the map
			marker.remove()
			this.setState({
				marker: null
			})
		}

		if (style) {
			map.setStyle(style)
		}

		if (lat && lon) {
			const longLatObj = [parseFloat(lon), parseFloat(lat)]

			// Cet the center of the map and the new Marker
			map.setCenter(longLatObj)
			map.setZoom(zoom)

			// Create marker
			var el = document.createElement('div')
			el.className = 'marker'

			const newMarker = new mapboxgl.Marker(el).setLngLat(longLatObj)

			// Add popup
			if (popup) {
				newMarker.setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(popup))
			}

			//Add marker to Map
			newMarker.addTo(map)
			this.setState({
				marker: newMarker
			})
		}
	}

	getLatLongFromAddress() {
		const { attributes, setAttributes } = this.props
		const address = attributes.address

		this.setState({
			isWaitingForNominatim: true
		})
		fetch('https://nominatim.openstreetmap.org/search?limit=1&format=json&q=' + encodeURIComponent(address))
			.then(function(response) {
				return response.json()
			})
			.then(
				function(jsonResponse) {
					// set lat long attributes
					if (jsonResponse.length > 0 && jsonResponse[0].lat) {
						setAttributes({
							lat: jsonResponse[0].lat,
							lon: jsonResponse[0].lon
						})

						this.setState({
							isWaitingForNominatim: false,
							nominatimReturnEmpty: false
						})
					} else {
						this.setState({
							isWaitingForNominatim: false,
							nominatimReturnEmpty: true
						})
					}
				}.bind(this)
			)
	}

	render() {
		const { className, attributes, setAttributes } = this.props
		const { isWaitingForNominatim, nominatimReturnEmpty } = this.state

		return (
			<Fragment>
				<InspectorControls>
					<PanelBody title={__('Map Settings')}>
						<TextControl label={__('Address')} value={attributes.address} onChange={address => setAttributes({ address })} />
						<div className="blocks-base-control">
							<Button onClick={this.getLatLongFromAddress} isLarge isBusy={isWaitingForNominatim}>
								{attributes.lat ? __('Change marker position') : __('Add marker on map')}
							</Button>
							{nominatimReturnEmpty && (
								<Notice status="error" isDismissible={false} content={__('Error while searching the address, please verify and try again')} />
							)}
						</div>
						{attributes.lat && (
							<TextareaControl label={__('Popup content')} value={attributes.popup} onChange={popup => setAttributes({ popup })} />
						)}
						<RangeControl
							label={__('Zoom')}
							value={attributes.zoom ? attributes.zoom : 13}
							onChange={zoom => setAttributes({ zoom: zoom })}
							min={1}
							max={20}
						/>
						<TextControl label={__('Map style')} value={attributes.style} onChange={style => setAttributes({ style })} />
					</PanelBody>
				</InspectorControls>
				<div className={className} ref={this.mapRef} style={{ height: '500px' }} />
			</Fragment>
		)
	}
}

export default SimpleMapEdit
