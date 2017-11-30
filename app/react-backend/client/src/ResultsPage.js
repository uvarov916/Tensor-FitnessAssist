import React, { Component } from 'react';

class ResultsPage extends Component {

    constructor(props) {
        super(props);

        /*this.pageTitle = 'Тренировка завершена';

        var results= [
           {
               name: "Дмитрий",
               time: 1000003
           },
           {
               name: "Никитос",
               time: 1
           }
        ];


        let personInfo = {
            name: "Сергей",
            time: 40,
            current: true
        };

        results.push(personInfo);

        results.sort((a, b) => {
           if (a.time < b.time) return 1;
           if (a.time > b.time) return -1;
           return 0;
        });

        this.state = {
            results: results,
            personInfo: personInfo
        };

        this.finishTrainingHandler = this.finishTrainingHandler.bind(this);*/
    }

    render() {
        /*return (
            <div >
                <h1>{this.pageTitle}</h1>
                <div>{this.state.personInfo.name + ','}</div>
                <div>Вы закончили тренировку за {this.state.personInfo.time} секунд</div>
                <Results results = {this.state.results}/>
                <RepeatButton finishTrainingHandler={this.finishTrainingHandler}/>
            </div>

        );*/
		
		return (
			<div className="page">
				<div className="results-page">
					<div className="congrat-message">Поздравляем! Вы закончили тренировку за {this.props.workoutTime} сек.!</div>
					<div className="back-to-home" onClick={this.props.startNewWorkoutHandler}>В начало</div>
				</div>
			</div>
		);
		return (<h1>Results page: {this.props.workoutTime}</h1>);
    }
}

/*
function Results(props) {
    const listResults = props.results.map((result) =>
        <div className={'resultsClass ' + (result.current ? 'current' : '')}>
            <div>{result.name}</div>
            <div>{result.time}</div>
        </div>
    );

    return (
       <div>{listResults}</div>
    )
}

function RepeatButton(props) {
    return(
        <div className="repeat" onClick={(e) => props.finishTrainingHandler(e)}>Начать тренировку заново</div>
    );
}*/

export default ResultsPage;
