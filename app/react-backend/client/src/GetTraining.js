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
			countOfTraining:0,
            activeTraining:props.dataActiveTraining,
            socketData: {
			    name: '',
                progress: 0
            },
            showCount: false,
            numberOfExercise:0
        };
        this.getTrainingHandler = this.getTrainingHandler.bind(this);
        this.countFinishHandler = this.countFinishHandler.bind(this);
		console.log(this.state.picture);
    }
    render(){
        var showCountDisplay;
        if (this.state.showCount) {
            showCountDisplay = <MyTimer countFinishHandler={this.countFinishHandler} />
        }
        return(
			<div>
                {showCountDisplay}
                <h1>Тренировка идет</h1>
				<p>{this.state.countOfTraining}</p>
				<p>{this.state.socketData.name}</p>
				<DisplayPicture picture = {this.state.picture} numberOfExercise={this.state.numberOfExercise} />
				<OnFinishClick handler={this.getTrainingHandler}/>
			</div>
		)
    }

    componentWillReceiveProps(newProps) {
        if (newProps.socketData) {
            this.setState({socketData:newProps.socketData});
        }
    }

    countFinishHandler(timerActive) {
        this.setState({showCount: timerActive});
    }

    getTrainingHandler(e) {
        this.props.processTrainingHandler();
    }
    componentWillReceiveProps(nextProps){
        this.setState({picture: ""+nextProps.socketData.progress});
        if(nextProps.socketData.finalState===true)
        {
            this.setState({countOfTraining:this.state.countOfTraining+1});
            if(this.state.countOfTraining === this.state.activeTraining.exercises[this.state.numberOfExercise].count)
            {
                this.setState({showCount:true, countOfTraining: 0, numberOfExercise: this.state.numberOfExercise+1});
            }
            else {
                this.setState({showCount: false});
            }
        }
    }
}

function DisplayPicture(picture){
	console.log('/images/test'+picture.picture+'.png');
	var str = "";
	switch (picture.numberOfExercise)
    {
        case 0:
            str = "/images/biceps_";
            break;
        case 1:
            str = "/images/pushup_";
            break;
        case 2:
            str = "/images/squat_";
    }
	return(
	<div>
		<img src={str+picture.picture+'.png'}/>
	</div>);
}

function OnFinishClick(props) {

    return(
		<div className="onFinish" onClick={(e) => props.handler(e)}>Посмотреть результат</div>
    );
}

class MyTimer extends Component{
    constructor(props) {
        super(props);
        this.state = {
            count: 5
        }
    }
    componentDidMount() {
        setInterval((function() {
            if (this.state.count === 1) {
                this.props.countFinishHandler();
            } else {
            this.setState({count: this.state.count - 1});
            }
        }).bind(this), 1000);
    }
    render() {
        return (
            <div>{this.state.count}</div>
        )
    }
}

export default GetTraining;