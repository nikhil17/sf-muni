import React, { Component } from 'react';
import { geoMercator, geoPath } from "d3-geo"
import { select } from 'd3-selection'


class Streets extends Component{
	
	componentDidMount() {
    fetch("/sfmaps/streets.json")
      .then(response => {
        if (response.status !== 200) {
          console.log(`There was a problem: ${response.status}`)
          return
        }
        response.json().then(worlddata => {
          this.setState({
            worlddata: feature(worlddata, worlddata.objects.countries).features,
          })
        })
      })
  }

	
}

export default Streets
