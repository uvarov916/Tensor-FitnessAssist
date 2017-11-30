import React, { Component } from 'react';
import io from "socket.io-client";

/*
socket
workoutData
finishWorkoutHandler
*/
class WorkoutPage extends Component {
    constructor(props)
    {
        super(props);
		//this.putStartHandler = this.putStartHandler.bind(this);
		console.log(props.socketData);
        this.state={
			picture:"1",
			countOfTrainig:0
        };
		console.log(this.state.picture);
    }
    render() {
		
        return(
			<div>
				<h1>Тренировка идет</h1>
				<p>{this.props.socketData.progress}</p>
				<p>{this.props.socketData.name}</p>
				<p>{this.state.countOfTrainig}</p>
				<DisplayPicture picture = {this.state.picture}/>
				
			</div>
		)
    }
	componentWillReceiveProps(nextProps){
		this.setState({picture: ""+nextProps.socketData.progress});
		if(nextProps.socketData.finalState===true)
		{
			console.log("AZAZAZAZAZA"+this.state.finalState);
			this.setState({countOfTrainig:this.state.countOfTrainig+1});
			console.log("GGGGGGGGGGGG"+this.state.countOfTrainig);
		}
	}
	
}

function DisplayPicture(picture){
	console.log('/images/test'+picture.picture+'.png');
	return(
	<div>
		<img src={'/images/biceps_'+picture.picture+'.png'}/>
	</div>);
}

export default GetTraining;