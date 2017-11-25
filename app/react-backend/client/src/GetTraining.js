import React, { Component } from 'react';
import './App.css';
import io from "socket.io-client";

class GetTraining extends Component {
    constructor(props)
    {
        super(props);
		//this.putStartHandler = this.putStartHandler.bind(this);
		console.log(props.socketData);
        this.state={
			picture:"1"
        };
        this.getTrainingHandler = this.getTrainingHandler.bind(this);
		console.log(this.state.picture);
    }
    render(){
        return(
			<div>
				<h1>Тренировка идет</h1>
				<p>{this.props.socketData.progress}</p>
				<p>{this.props.socketData.name}</p>
				<DisplayPicture picture = {this.state.picture}/>
				<OnFinishClick handler={this.getTrainingHandler}/>
			</div>
		)
    }

    getTrainingHandler(e) {
        this.props.processTrainingHandler();
    }
	componentWillReceiveProps(nextProps){
		this.setState({picture: ""+nextProps.socketData.progress});
	}
}

function DisplayPicture(picture){
	console.log('/images/test'+picture.picture+'.png');
	return(
	<div>
		<img src={'/images/biceps_'+picture.picture+'.png'}/>
	</div>);
}

function OnFinishClick(props) {

    return(
		<div className="onFinish" onClick={(e) => props.handler(e)}>Посмотреть результат</div>
    );
}

export default GetTraining;