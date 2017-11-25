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
            }
        ];
        this.state = {
            trainings:trainings,
            pageTitle:"Выберите тренировку"
        };
    }
    render() {
        return (
            <div>
                <h1> {this.state.pageTitle} </h1>
                <Trenirovka t={this.state.trainings[0]} />
            </div>
        );
    }
}
function Trenirovka(props)
{
    return (
        <div>
            <h2> {props.t.name}</h2>
            <p>{props.t.exercise}</p>
            <p>{props.t.count}</p>
        </div>
    );

}
export default Main;
