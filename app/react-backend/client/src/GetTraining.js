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
			picture:"1",
			countOfTraining:0
        };
        this.getTrainingHandler = this.getTrainingHandler.bind(this);
		console.log(this.state.picture);
    }
    render(){
        return(
			<div>
                <h1>Тренировка идет</h1>
				<p>{this.state.countOfTraining}</p>
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
        if(nextProps.socketData.finalState===true)
        {
            this.setState({countOfTraining:this.state.countOfTraining+1});
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

function OnFinishClick(props) {

    return(
		<div className="onFinish" onClick={(e) => props.handler(e)}>Посмотреть результат</div>
    );
}

export default GetTraining;