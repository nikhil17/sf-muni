import React, { Component } from 'react';
import CheckboxList from './CheckboxList'
import SFMap from './SFMap'


// const styles = {
//   block: {
//     maxWidth: 250,
//   },
//   checkbox: {
//     marginBottom: 16,
//   },
// };

class MainController extends Component{
	constructor(props) {
	  super(props);
	  // define non state variables here
	  this.routeListURL = "http://webservices.nextbus.com/service/publicJSONFeed?command=routeList&a=sf-muni";
	  this.routeVehicleLocationURL = "http://webservices.nextbus.com/service/publicJSONFeed?command=vehicleLocations&a=sf-muni&r=";
	  this.refreshIntervalMS = 15000
		this.selectedCheckboxes = new Set();
	  this.state = {
	  	routesToDraw: [],
	  	allRoutesList: {},
	  	showRoutes: false,
	  	vehicleLocation: [],
	  	vehicleStore: new Map(),
	  };
	}

	componentDidMount(){
		this.getAllRoutes()
		setInterval(this.getUpdatedVehicleLocations, this.refreshIntervalMS);	 
	}


	// gets all the route info, stores it once and passes that to the checkbox component
	getAllRoutes(){
		const controller = this
		fetch(this.routeListURL)
		  .then(function(response) {
		    return response.json()
		  }).then(function(json) {
		  	//got the routes 
		    controller.setState({
		    	allRoutesList:json.route,
		    	showRoutes: true,
		    })

		  }).catch(function(ex) {
		    console.log('failed to get routes parsing failed', ex)
		  })	
	}
	//callback function that updates the MainController state of the tags of the routes to draw
	updateRoutesCallback = newRoutes => {
		let controller = this
		controller.setState({routesToDraw: newRoutes})
		//now make the requests for them 
		controller.getUpdatedVehicleLocations()
	}

	getUpdatedVehicleLocations = () => {
		let routeTags = this.state.routesToDraw
		const baseURL = this.routeVehicleLocationURL
		const controller = this
		let vehicleInfo = []
		

		for (const tag of routeTags) {
			fetch(baseURL + tag + "&t=0")
				.then(function(response) {
					return response.json()
				}).then(function(routeInfo) {
					routeInfo.tag = tag
					vehicleInfo.push(routeInfo)
					controller.setState({
						vehicleLocation: vehicleInfo,
					})
					controller.checkVehicleLocationsAndUpdateStore(routeInfo)
					//call check vehicle store here
				}).catch(function (error){
					console.log('failed to parse json ', error)
				})
		}
	}

	checkVehicleLocationsAndUpdateStore = vehicleData => {
		// console.log('trying to update vehicle store, key : ')
		let controller = this
		let myVehicleStore = this.state.vehicleStore
		let updated = false
		let tag = vehicleData.tag
		// console.log(vehicleData)
		// if there are vehicles in the data, check if the locations are new
		if (vehicleData.vehicle != undefined){
			for (let i = 0; i < vehicleData.vehicle.length; i++){
				let bus = vehicleData.vehicle[i]
				let key = tag + bus.id
				// console.log(key)
				if (bus != undefined && bus.lat != undefined && bus.lon != undefined ){
					if (!(key in myVehicleStore.keys())){
						myVehicleStore.set(key, bus)
						updated = true
					}
					else{
						// if the latitude or longitude of object has changed, update it
						const oldData = myVehicleStore.get(key)
						// console.log(oldData)
						if (oldData.lat != bus.lat || oldData.lon != bus.lon){
							myVehicleStore.set(key, bus)
							updated = true
						}
					}
				}
			}
		}
		// if the old vehiclestore is updated, change the state
		if (updated){
			// console.log('updated vehicle store state')
			// console.log(myVehicleStore)
			controller.setState({
				vehicleStore: myVehicleStore
			})
		}
		
	}
	
	render(){
		const allRoutesList = this.state.allRoutesList
		const showRoutes = this.state.showRoutes

		if (showRoutes) {
			return (
				<div>
				<CheckboxList routesList={allRoutesList} updateRoutes={this.updateRoutesCallback}/>
				<SFMap height={900} width= {1000} vehicleLocation={this.state.vehicleStore}/>
			</div>
			)
		} 
		return <div>Loading </div>
		
	}
}


export default MainController