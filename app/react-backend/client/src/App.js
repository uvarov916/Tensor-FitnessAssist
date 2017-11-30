import React, { Component } from 'react';
import './App.css';
import MainPage from './MainPage';
import ResultsPage from './ResultsPage';
import WorkoutPage from './WorkoutPage';
import io from "socket.io-client";

class App extends Component {
    constructor(props) {
        super(props);
        
		this.state = {
            currentPage: 1,
            currentWorkoutId: null,
			lastWorkoutTime: null,
			isConnected: false
        };
		
		this.socket = null;
		
		this.workouts = [
            {
				id: 0,
                name: "Программист",
                exercises: [
                    {
                        id: 'biceps',
						name: 'Бицепс',
                        count: 1
                    },
                    {
                        id: 'pushup',
						name: 'Отжимания',
                        count: 1
                    },
                    {
                        id: 'squat',
						name: 'Присед',
                        count: 1
                    }
                ]
            },
            {
				id: 1,
                name: "Девушка программиста",
                exercises: [
                    {
                        id: 'biceps',
						name: 'Бицепс',
                        count: 5
                    },
                    {
                        id: 'squat',
						name: 'Присед',
                        count: 10
                    }
                ]
            },
            {
				id: 2,
                name: "Качок",
                exercises: [
                    {
                        id: 'biceps',
						name: 'Бицепс',
                        count: 7
                    },
                    {
                        id: 'pushup',
						name: 'Отжимания',
                        count: 8
                    },
                    {
                        id: 'squat',
						name: 'Присед',
                        count: 15
                    }
                ]
            }
        ];
		
        this.selectWorkout = this.selectWorkout.bind(this);
        this.finishWorkout = this.finishWorkout.bind(this);
        this.startNewWorkout = this.startNewWorkout.bind(this);
    }

    selectWorkout(workoutId) {
        this.setState({
           currentPage: 2,
           currentWorkoutId: workoutId
        });
    }

    finishWorkout(workoutTime){
        this.setState({
			currentPage: 3,
			lastWorkoutTime: workoutTime
		});
    }
	
    startNewWorkout(){
        this.setState({currentPage: 1});
    }

    render() {
		var pageRender;
		
		switch(this.state.currentPage) {
			case 2:
				pageRender = (
					<WorkoutPage 
						socket={this.socket} 
						workoutData={this.workouts[this.state.currentWorkoutId]}
						finishWorkoutHandler={this.finishWorkout}
					/>
				);
				break;
			case 3:
				pageRender = (
					<ResultsPage
						startNewWorkoutHandler={this.startNewWorkout}
						workoutTime={this.state.lastWorkoutTime}
					/>
				);
				break;
			default:
				pageRender = (
					<MainPage 
						selectWorkoutHandler={this.selectWorkout} 
						workouts={this.workouts}
					/>
				);
		}
		
		return (<div className="approot">
            <div className={this.state.isConnected ? 'connection-status connected':'connection-status'}>
				{this.state.isConnected ? "Connected" : "Not Connected" }
			</div>
            {pageRender}
        </div>);
    }

    componentDidMount() {
        this.socket = io.connect('http://10.76.56.86:8000');

        this.socket.on('connect', function (data) {
            this.setState({isConnected:true});
            console.log('Socket connected');
        }.bind(this));

        this.socket.on('disconnect', function(data) {
           this.setState({isConnected:false});
           console.log('Socket disconnected');
        }.bind(this));
    }
}

export default App;
