import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class Main extends Component {


    constructor(props) {
        super(props);
        let trainings = [
            {
                name: "Trenirovka 1",
                exercises: [
                    {
                        exercise: 'bizeps',
                        count: 2
                    },
                    {
                        exercise: 'pushup',
                        count: 3
                    },
                    {
                        exercise: 'squat',
                        count: 10
                    }
                ]
            },
            {
                name: "Trenirovka 2",
                exercises: [
                    {
                        exercise: 'bizeps',
                        count: 15
                    },
                    {
                        exercise: 'pushup',
                        count: 5
                    },
                    {
                        exercise: 'squat',
                        count: 10
                    }
                ]
            },
            {
                name: "Trenirovka 3",
                exercises: [
                    {
                        exercise: 'bizeps',
                        count: 15
                    },
                    {
                        exercise: 'pushup',
                        count: 5
                    },
                    {
                        exercise: 'squat',
                        count: 10
                    }
                ]
            }
        ];
        this.state = {
            trainings:trainings,
            pageTitle:"Выберите тренировку",
            activeTraining:{
                name:""
            },
            socketData:""
        };
        this.chooseTrainingHandler = this.chooseTrainingHandler.bind(this);
        this.putStartHandler = this.putStartHandler.bind(this);
    }
    render() {
        return (
            <div >
            <h1> {this.state.pageTitle} </h1>
        <Trenirovki trainings = {this.state.trainings} activeTraining={this.state.activeTraining} handler={this.chooseTrainingHandler}/>
        <StartClick handler={this.putStartHandler}/>
        </div>
    );
    }

    chooseTrainingHandler(e, nameActiveTraining) {
        console.log('in handler ' + nameActiveTraining);
        this.setState({activeTraining:nameActiveTraining});
    }

    putStartHandler(e) {
        console.log('putStartHandler');
        this.props.selectTrainingHandler(this.state.activeTraining);
}
}
function Trenirovka(props)
{
    const exercises = props.training.exercises;
    const listExercises = exercises.map((exercise)=>
        <div className="exercises">
    <p>{exercise.exercise}</p>
<p>{exercise.count}</p>
</div>
);


    var active = '';
    if(props.activeTraining.name === props.training.name)
    {
        active="active";
    }

    return (
        <div className={'trenirovka ' + active} onClick={(e) => props.handler(e, props.training)}>
<h2>{props.training.name}</h2>
<div>{listExercises}</div>
</div>
);

}

function  Trenirovki(props)
{
    const trainings = props.trainings;
    const listTrainings = trainings.map((training)=>
        <Trenirovka handler={props.handler} activeTraining={props.activeTraining} training = {training}/>
);
    return(
        <div className="trenirovki">{listTrainings}</div>
);
}

function StartClick(props) {

	return(
        <div className="start" onClick={(e) => props.handler(e)}>Начать тренировку</div>
	);
}

export default Main;
