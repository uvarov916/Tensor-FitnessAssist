import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class Main extends Component {

    constructor(props) {
        super(props);

        this.trainings = [
            {
                name: "Программист",
                exercises: [
                    {
                        id: 'biceps',
                        count: 1
                    },
                    {
                        id: 'pushup',
                        count: 1
                    },
                    {
                        id: 'squat',
                        count: 1
                    }
                ]
            },
            {
                name: "Девушка программиста",
                exercises: [
                    {
                        id: 'biceps',
                        count: 5
                    },
                    {
                        id: 'pushup',
                        count: 3
                    },
                    {
                        id: 'squat',
                        count: 10
                    }
                ]
            },
            {
                name: "Качок",
                exercises: [
                    {
                        id: 'biceps',
                        count: 7
                    },
                    {
                        id: 'pushup',
                        count: 8
                    },
                    {
                        id: 'squat',
                        count: 15
                    }
                ]
            }
        ];
        this.pageTitle = "Выберите тренировку";

        this.state = {
            activeTraining: {
                name: "",
                exercises: []
            },
            socketData: {
                name: 'Сокет не подключен',
                progress: 0
            }
        };

        this.chooseTrainingHandler = this.chooseTrainingHandler.bind(this);
        this.startTrainingHandler = this.startTrainingHandler.bind(this);
    }

    render() {
        return (
           <div>
                <h1>{this.pageTitle}</h1>
                <Trenirovki trainings = {this.trainings} activeTraining={this.state.activeTraining} chooseTrainingHandler={this.chooseTrainingHandler}/>
                <StartButton startTrainingHandler={this.startTrainingHandler}/>
            </div>
        );
    }

    chooseTrainingHandler(e, nameActiveTraining) {
        console.log('in handler ' + nameActiveTraining);
        this.setState({activeTraining:nameActiveTraining});
    }
    startTrainingHandler(e) {
        console.log('startTrainingHandler');
        this.props.selectTrainingHandler(this.state.activeTraining);
    }
}

function Trenirovka(props)
{
    const exercises = props.training.exercises;
    const listExercises = exercises.map((exercise)=>
        <div className="exercise">
            <p>{exercise.exercise}</p>
             <p>{exercise.count}</p>
        </div>
    );


    var active = '';
    if(props.activeTraining.name === props.training.name) {
        active="active";
    }

    return (
        <div className={'trenirovka ' + active} onClick={(e) => props.chooseTrainingHandler(e, props.training)}>
            <h2>{props.training.name}</h2>
            <div>{listExercises}</div>
        </div>
    );

}

function Trenirovki(props){
    const listTrainings = props.trainings.map((training)=>
        <div><Trenirovka chooseTrainingHandler={props.chooseTrainingHandler} activeTraining={props.activeTraining} training = {training}/></div>
    );
    return(
        <div className="trenirovki">{listTrainings}</div>
    );
}

function StartButton(props) {

	return(
        <div className="start" onClick={(e) => props.startTrainingHandler(e)}>Начать тренировку</div>
	);
}

export default Main;
