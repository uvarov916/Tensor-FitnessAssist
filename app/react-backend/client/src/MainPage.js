import React, { Component } from 'react';

/*
selectWorkoutHandler
workouts
*/
class MainPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
			selectedWorkoutId: -1,
        };

        this.selectWorkout = this.selectWorkout.bind(this);
        this.startWorkout = this.startWorkout.bind(this);
    }

    render() {
        return (
           <div className="main">
                <h1>SBIS <span className="orange">FITNESS</span></h1>
                <Workouts 
					workouts={this.props.workouts} 
					selectedId={this.state.selectedWorkoutId} 
					selectHandler={this.selectWorkout}
				/>
                <StartWorkoutButton 
					clickHandler={this.startWorkout}
				/>
            </div>
        );
    }

    selectWorkout(e, workoutId) {
        this.setState({
			selectedWorkoutId: workoutId
		});
    }
	
    startWorkout(e) {
		if (this.state.selectedWorkoutId > -1) {
			this.props.selectWorkoutHandler(this.state.selectedWorkoutId)
		}
    }
}

function Workout(props) {
    const exercisesList = props.exercises.map((exercise)=>
		<p>{exercise.count} x {exercise.name}</p>
    );

	var classes = 'workouts-workout';
    if (props.selected) {
        classes += " selected";
    }

    return (
        <div className={classes} onClick={(e) => props.clickHandler(e, props.id)}>
            <h2>{props.name}</h2>
            <div>{exercisesList}</div>
        </div>
    );

}


function Workouts(props){
    const workoutsList = props.workouts.map((workout)=>
        <Workout 
			clickHandler={props.selectHandler} 
			selected={props.selectedId === workout.id}
			id={workout.id}
			name={workout.name}
			exercises={workout.exercises}
		/>
    );
    return(
        <div className="workouts">{workoutsList}</div>
    );
}

function StartWorkoutButton(props) {
	return(
        <div className="select-workout-button" onClick={(e) => props.clickHandler(e)}>Начать тренировку</div>
	);
}

export default MainPage;
