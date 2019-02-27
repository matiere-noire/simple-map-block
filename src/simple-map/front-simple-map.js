/*
 * Display map on front for simple map block
 */
const ABSimpleMap = document.querySelectorAll('.wp-block-arnaudban-simple-map');

Array.prototype.forEach.call( ABSimpleMap, function(mapWrapper) {
	let mapData = mapWrapper.dataset.map

	if( mapData ){
		mapData = JSON.parse( mapData )

		if( mapData.lat && mapData.lon ){

			mapWrapper.style.height =  '70vh'

			const zoom = mapData.zoom ? mapData.zoom : 13

			const latLongObj = [ parseFloat( mapData.lat ), parseFloat( mapData.lon )]
			const mymap = L.map( mapWrapper, {
				scrollWheelZoom: ! ( mapData.align && mapData.align === 'full')
			}).setView(latLongObj, zoom )

			L.tileLayer('http://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png').addTo(mymap)
			const marker = L.marker( latLongObj ).addTo( mymap )

			// Add popup
			if( mapData.popup ){
				marker.bindPopup(mapData.popup)
			}
		}

	}
})

