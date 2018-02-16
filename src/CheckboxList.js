import Checkbox from './Checkbox';
import React, { Component } from 'react';

class CheckboxList extends Component{
	constructor(props) {
		  super(props);
		
		  this.state = {
		  	checkedElements: [],
		  };
		  this.selectedCheckboxes = new Set();
	}	

  //method to clear all selected routes
  clearAll = () => {
    let _this = this
    _this.setState({
      checkedElements: []
    })
    this.selectedCheckboxes = new Set();
    let updateRoutesToDraw = this.props.updateRoutes
    updateRoutesToDraw([])
  }

	toggleCheckbox = label => {
    if (this.selectedCheckboxes.has(label)) {
      this.selectedCheckboxes.delete(label);
    } else {
      this.selectedCheckboxes.add(label);
    }
    let updateRoutesToDraw = this.props.updateRoutes
    const checkedRoutes = Array.from(this.selectedCheckboxes)
    //replace this chunk with updating maincontroller routedraw maps instead
    let _this = this;
    _this.setState({
    	checkedElements: checkedRoutes,
    })
    updateRoutesToDraw(checkedRoutes) 
  }

  createCheckbox = route => (
    <Checkbox
      label={route.title}
      tag={route.tag}
      handleCheckboxChange={this.toggleCheckbox}
      key={route.title}
    />
  )

  //create a checkbox for every route passed in
  createCheckboxes = () => (
  		this.props.routesList.map(this.createCheckbox)
  )


  render(){

		return (<div> 
	        {this.createCheckboxes()}
			</div>
			)
	}
}

export default CheckboxList;