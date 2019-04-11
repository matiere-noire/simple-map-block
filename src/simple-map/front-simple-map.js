/*
 * Display map on front for simple map block
 */
const ABSimpleMap = document.querySelectorAll('.wp-block-arnaudban-simple-map')

mapboxgl.accessToken = simpleMapData.mapboxKey

Array.prototype.forEach.call(ABSimpleMap, function(mapWrapper) {
	let mapData = mapWrapper.dataset.map

	if (mapData) {
		mapData = JSON.parse(mapData)

		if (mapData.lat && mapData.lon) {
			mapWrapper.style.height = '70vh'

			let zoom = mapData.zoom ? mapData.zoom : 13
			let longLatObj = [parseFloat(mapData.lon), parseFloat(mapData.lat)]
			let map = new mapboxgl.Map({
				container: mapWrapper,
				center: longLatObj,
				zoom: zoom,
				style: mapData.style ? mapData.style : 'mapbox://styles/mapbox/streets-v10'
			})

			//disable zoom
			if (mapData.align && mapData.align === 'full') {
				map.scrollZoom.disable()
			}

			// Create marker
			var el = document.createElement('div')
			el.className = 'marker'

			const newMarker = new mapboxgl.Marker(el).setLngLat(longLatObj)

			// Add popup
			if (mapData.popup) {
				newMarker.setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(mapData.popup))
			}

			//Add marker to Map
			newMarker.addTo(map)
		}
	}
})
