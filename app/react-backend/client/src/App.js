import React, { Component } from 'react';
import './App.css';
import Main from './Main';
import TrainingFinish from './TrainingFinish';
import TrainingPage from './TrainingPage';
import io from "socket.io-client";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 1,
            dataActiveTraining: null,
            socket:null
        };
        this.selectTrainingHandler = this.selectTrainingHandler.bind(this);
        this.finishTrainingHandler = this.finishTrainingHandler.bind(this);
        this.processTrainingHandler = this.processTrainingHandler.bind(this);

    }

    selectTrainingHandler(activeTraining) {
        this.setState({
           currentPage: 2,
           dataActiveTraining: activeTraining
        });
    }

    processTrainingHandler(){
        this.setState({currentPage: 3});
    }
    finishTrainingHandler(){
        this.setState({currentPage: 1});
    }

    render() {
       if(this.state.currentPage === 1) {
          return(
            <Main selectTrainingHandler={this.selectTrainingHandler}/>
          );
      }
       else if (this.state.currentPage === 2) {
            return(
                <TrainingPage socketIO={this.state.socket} dataActiveTraining={this.state.dataActiveTraining} socketData={this.state.socketData} processTrainingHandler={this.processTrainingHandler}/>
            );
        }

      else if (this.state.currentPage === 3) {
          return(
               <TrainingFinish finishTrainingHandler={this.finishTrainingHandler}/>
              );
      }
    }

    componentDidMount() {
        this.state.socket = io.connect('http://10.76.56.86:8000');

        this.state.socket.on('connect', function (data) {
            console.log('Socket connected');
        });

        this.state.socket.on('exercise', function(data) {
            console.log('Exercise event:', data);
            this.setState({socketData:data});
        }.bind(this));

        this.state.socket.on('disconnect', function(data) {
           console.log('Socket disconnected');
        });
    }
}

export default App;
