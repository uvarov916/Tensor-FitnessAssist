import React, { Component } from 'react';

/*
socket
workoutData
finishWorkoutHandler
*/
class WorkoutPage extends Component {
    
	constructor(props) {
        super(props);

		this.state = {
			currentExercise: -1,
			currentProgress: 0,
			repetitions: 0,
			inWrongState: false
		};
		
		this.startTime = new Date().getSeconds();
		this.finishWorkout = this.finishWorkout.bind(this);
		this.nextExercise = this.nextExercise.bind(this);
		
        /*this.state = {
			   picture: "1",
			   countOfTraining: 0,
            activeTraining: props.dataActiveTraining,
            socketData: {
			      name: '',
               progress: 0
            },
            showCount: false,
            numberOfExercise: 0,
            socketIO: props.socketIO
        };

        this.getTrainingHandler = this.getTrainingHandler.bind(this);
        this.countFinishHandler = this.countFinishHandler.bind(this);*/
    }

    render() {
		
		
		var workoutRender;
		if (this.state.currentExercise === -1) {
			workoutRender = (<div>Loading...</div>);
		} else {
			var wrongStateWarning;
			if (this.state.isWrongState) {
				wrongStateWarning = (<div class="wrong-state">Неверно! Вернитесь в начальное состояние!</div>);
			}
			
			workoutRender = (
				<div className="workout-info">
					<div className="workout-left">
						<DisplayPicture 
							name={this.getCurrentExercise().id}
							progress={this.state.currentProgress}
						/>
					</div>
					<div className="workout-right">
						<WorkoutButton 
							clickHandler={this.finishWorkout}
							value="Закончить тренировку"
						/>
						
						<WorkoutButton 
							clickHandler={this.nextExercise}
							value="Следующее упражнение"
						/>
						
						<div className="exercise-info">
							<p className="exercise-name">{this.getCurrentExercise().name}</p>
							<p className="exercise-count">
								<span className="current">{this.state.repetitions}</span>/{this.getCurrentExercise().count}
							</p>
						</div>
						{wrongStateWarning}
						<TelegramMotivation/>
					</div>
				</div>
			);
		};
		
		
		return (
			<div className="page">
				<div className="training-page">
					{workoutRender}
				</div>
			</div>
		);
    }
	
	getCurrentExercise() {
		return this.props.workoutData.exercises[this.state.currentExercise];
	}
	
    componentDidMount(){
		this.props.socket.on('exercise', function(data) {
			if (data.name === this.props.workoutData.exercises[this.state.currentExercise].id) {
				var updatedState = {
					isWrongState: false,
					currentProgress: data.progress
				};
				if (data.finalState) {
					updatedState.currentProgress = 0;
					updatedState.repetitions = this.state.repetitions + 1;
					
					if (this.state.repetitions + 1 === this.getCurrentExercise().count) {
						// Закончили упражнение
						this.finishExercise();
						this.startNextExercise();
					} else {
						// Не закончили упражнение
						this.setState(updatedState);
					}
				} else {
					// Не закончили повтор
					this.setState(updatedState);
				}		
			} else if (data.name === "error") {
				this.setState({
					inWrongState: true
				});
			}
        }.bind(this));
		
        this.startNextExercise();
    }
	
	finishWorkout() {
		let workoutTime = new Date().getSeconds() - this.startTime;
		this.props.finishWorkoutHandler(workoutTime);
	}
	
	nextExercise() {
		this.finishExercise();
		this.startNextExercise();
	}
	
	finishExercise() {
		this.props.socket.emit('finish_exercise');
	}

	startNextExercise() {
		if (this.props.workoutData.exercises.length - 1 > this.state.currentExercise) {
			this.props.socket.emit('start_exercise', {
				name: this.props.workoutData.exercises[this.state.currentExercise + 1].id
			});
			this.setState({
				currentExercise: this.state.currentExercise + 1,
				isWrongState: false,
				currentProgress: 0,
				repetitions: 0
			});
		} else {
			this.finishWorkout();
		}
	}
	
	
 
	
	/*countFinishHandler() {
        switch(this.state.numberOfExercise)
        {
            case 1:
                this.state.socketIO.emit("start_exercise","pushup");
                break;
            case 2:
                this.state.socketIO.emit("start_exercise","squar");
                break;

        }
        this.state.socketIO.emit("start_exercise","biceps");
        this.setState({showCount: false});
    }

    getTrainingHandler(e) {
        this.props.processTrainingHandler();
    }

    componentWillReceiveProps(nextProps) {
       if (nextProps.socketData) {
          this.setState({socketData:nextProps.socketData});
       }

        this.setState({picture: ""+nextProps.socketData.progress});

       if (nextProps.socketData.finalState === true) {
           var updateState = {
               countOfTraining: this.state.countOfTraining + 1
           };
           if (this.state.countOfTraining  === this.state.activeTraining.exercises[this.state.numberOfExercise].count) {
               updateState.showCount = true;
               updateState.countOfTraining = 0;
               updateState.numberOfExercise = this.state.numberOfExercise + 1;
               switch(this.state.numberOfExercise)
               {
                   case 0:
                       this.state.socketIO.emit("finish_exercise","biceps");
                       break;
                   case 1:
                       this.state.socketIO.emit("finish_exercise","pushup");
                       break;
                   case 2:
                       this.state.socketIO.emit("finish_exercise","squar");
                       break;

               }
           }
           else {
               updateState.showCount = false;
           }
           this.setState(updateState);
       }
    }*/
}

class TelegramMotivation extends Component{
    constructor(props) {
        super(props);
        
		this.state = {
            currentMessage: '',
			name: ''
        }
    }
	
	render() {
		return(
			<div className="telegrambot">
				<span className="telegram-link">@TensorFitBot</span> - поддержите нашего спортсмена!
				<div className="react-motivation">
					<p className="telegram-from">{this.state.name}:</p>
					<p className="telegram-message">{this.state.currentMessage}</p>
				</div>
			</div>
		);
	}

    componentDidMount() {
		
        clearInterval(window.rmInterval);
		let setState = this.setState.bind(this);
		var lastId = 0;
        
		window.rmInterval = setInterval((function() {
			fetch('https://api.telegram.org/bot479223740:AAGAkmfQ4YA7cRAAcGpedMVs2HPFvBK67f0/getUpdates?offset=' + lastId)
				.then(function(response) {
					return response.json();
				})
				.then(function(res) {
					let results = res.result;
					console.log(res);
					let lastMessage = results.pop();
					if (lastMessage) {
						lastId = lastMessage.update_id + 1;
						console.log(lastMessage.message.text);
						setState({
							name: lastMessage.message.from.first_name + ' ' + lastMessage.message.from.last_name,
							currentMessage: lastMessage.message.text
						});
					}
				});
            
        }).bind(this), 1000);
    }
	
	componentWillUnmount() {
		clearInterval(window.rmInterval);
	}
}

/*
name
progress
*/
function DisplayPicture(props) {
	var progress = props.progress;
	if (!props.progress) {
		progress = 1;
	}
	var imgLocation = "/images/" + props.name + "_" + progress + ".png";
	return(
        <img src={imgLocation}/>
   );
}

function WorkoutButton(props) {
	return(
		<div className="finish-workout-button" onClick={(e) => props.clickHandler(e)}>{props.value}</div>
	);
}

/*
count
countdownFinishHandler
*/
class Countdown extends Component{
    constructor(props) {
        super(props);
        
		this.state = {
            count: this.props.count
        }
    }

    componentDidMount() {
        clearInterval(window.myInterval);
        
		window.myInterval = setInterval((function() {
            if (this.state.count === 1) {
                clearInterval(window.myInterval);
                this.props.countdownFinishHandler();

            } else {
				this.setState({
					count: this.state.count - 1
				});
            }
        }).bind(this), 1000);
    }
	
	componentWillUnmount() {
		clearInterval(window.myInterval);
	}

    render() {
        return (
            <div>{this.state.count}</div>
        )
    }
}

export default WorkoutPage;