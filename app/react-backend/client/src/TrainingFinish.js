import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import io from "socket.io-client";


class TrainingFinish extends Component {

    constructor(props) {
        super(props);
        var results=
        [
                {
                    name: "currentName",
                    time: 15
                },
                {
                name: "otherNames",
                time: 10
                },
            ];


        let personInfo = {
            name: "BlaBla",
            time: 25,
            current: true
        };

        results.push(personInfo);

        function compareObjects (a, b) {
            if (a.time < b.time) return 1;
            if (a.time > b.time) return -1;
            return 0;
        };
        results.sort(compareObjects);

        this.state = {
            pageTitle:"Тренировка завершена",
            name:"currentName",
            results:results,
            personInfo:personInfo
        };
        this.repeatHandler = this.repeatHandler.bind(this);
    }
    render() {
        return (
            <div >
                <h1>{this.state.pageTitle} </h1>
                <div> {this.state.personInfo.name + ','}</div>
                <div>Вы закончили тренировку за {this.state.personInfo.time} секунд</div>
                <Results results = {this.state.results}/>
                <RepeatClick handler={this.repeatHandler}/>
            </div>

        );
    }

    repeatHandler(e) {
        this.props.finishTrainingHandler();
    }
}

function Results(props) {
    const results = props.results;
    const listResults = results.map((result) =>
        <div className={'resultsClass ' + (result.current ? 'current' : '')}>
            <tr>{result.name}</tr>
            <tr>{result.time}</tr>
        </div>
    );

    return (
        <div>
            <h2>{props.results.name}</h2>
            <div>{listResults}</div>
        </div>
    )
}

function RepeatClick(props) {

    return(
        <div className="repeat" onClick={(e) => props.handler(e)}>Начать тренировку заново</div>
    );
}

export default TrainingFinish;
