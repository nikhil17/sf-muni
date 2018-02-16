import React, { Component } from 'react';
import { geoMercator, geoPath } from "d3-geo"
import { select } from 'd3-selection'


class SFMap extends Component{
	constructor(props) {
		super(props);
		this.baseMapNames = [
        'neighborhoods',
        'arteries',
        'freeways',
        'streets',
    ]
    this.baseProjectionScale = 350000,
    this.baseMapCenter= [-122.433701, 37.767683],
    this.state = {
    	mapData:[],
    	drawMaps: false,
    	mapPaths: [],
    	busPaths: [],
    }

		this.projection = geoMercator()
            .scale(this.baseProjectionScale)
            .rotate([0, 0])
            .center(this.baseMapCenter)
            // .translate([this.props.height / 4, this.props.width / 4])
    this.pathGenerator = geoPath().projection(this.projection)
		this.LoadAllBaseMaps()
	}

	componentWillReceiveProps(nextProps){
		console.log('might morph bus list')
		if (this.props.vehicleLocation.length != nextProps.vehicleLocation.length){
			this.getBusList()
		}
	}


	LoadAllBaseMaps = () =>{
		let mapNames = this.baseMapNames
		let mapController = this
		for (const mapName of mapNames){
			fetch(mapName + '.json').then(function(response){
				return response.json()
			}).then(function(json){
				let mapGeoJSON = mapController.state.mapData
				let mapPathList = mapController.state.mapPaths
				mapGeoJSON.push(json)

				mapPathList.push(mapController.drawMap(json, mapName))

				mapController.setState({
					mapData: mapGeoJSON,
					drawMaps: true,
					mapPaths: mapPathList
				})
			}).catch(function(error){
				console.log('failed to load map: ' + mapName + ' '+ error)
			})
		}
	}

	//draws a basemap and returns a list of paths that d3 will render
	drawMap = (baseMap, mapName) =>{
		let mapPaths = baseMap.features.map((d,i) =>
					<path
		        key={"path" + mapName+ i}
		        d={this.pathGenerator(d)}
		        // style={{fill: this.props.hoverElement === d.id ? "#FCBC34" : this.props.colorScale(d.launchday), stroke: "black", strokeOpacity: 0.5 }}
		        className={mapName}
		        style={{fill: "#FCBC34", stroke: "black", strokeOpacity: 0.5 }}
		      />)
		return mapPaths
	} 

	getBusList = () =>{
		console.log('morphing bus list to actual list')
		let busPathList = this.state.busPaths
		// console.log(this.props.vehicleLocation)
		// console.log(typeof this.props.vehicleLocation)
		for (const[key] in Object.entries(this.props.vehicleLocation)){
			let element = this.props.vehicleLocation[key][1]
			let obj = {id: element.id, lon: element.lon, lat: element.lat, tag: element.tag}
			busPathList.push(obj)
		}
		this.setState({
			busPaths: busPathList
		})
	}

	drawBus = (bus) => (
		<div>
			<circle 
				cx= {this.pathGenerator(bus.lat)}
				cy= {this.pathGenerator(bus.long)}
				radius='4px'
				fill="#E91E63"
				stroke="#FFFFFF"
			/>
			<text/>
		</div>

	)

	drawAllBuses = () =>(
		this.state.busPaths.map(this.drawBus)
	)


	render(){
    const drawMaps = this.state.drawMaps
    // const busLocations = this.props.vehicleLocation.map((d,i) =>
    // 		<circle
    // 			key={"path" + d+ i}
    // 			/>
    // 	)
    //<g className='Maps'> {this.state.mapPaths} </g>
    // <g className='busLocations'> </g>
    // console.log(this.state.mapPaths)
		return (<svg height={this.props.height} width={this.props.width}>
							<g className='features'>
								{this.state.mapPaths}
							</g>
							<g className='buses'>
								{this.drawAllBuses()}
							</g>
							
							

					 </svg>
		)
	}

	
}

export default SFMap

