import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Main from './Main';
import TrainingFinish from './TrainingFinish';
import GetTraining from './GetTraining';
import io from "socket.io-client";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTraining: ''
        };
        this.selectTrainingHandler = this.selectTrainingHandler.bind(this);
        this.finishTrainingHandler = this.finishTrainingHandler.bind(this);
        this.processTrainingHandler = this.processTrainingHandler.bind(this);

    }

    selectTrainingHandler() {
     this.setState({currentTraining :'2'});
    }

    processTrainingHandler(){
        this.setState({currentTraining :'3'});
    }
    finishTrainingHandler(){
        this.setState({currentTraining :'1'});
    }

    render() {
      if(this.state.currentTraining === "")
          return (
              <Main selectTrainingHandler={this.selectTrainingHandler}/>
            );

      else if(this.state.currentTraining === '1')
      {
          return(
          <Main selectTrainingHandler={this.selectTrainingHandler}/>
          );
      }
       else if(this.state.currentTraining === '2')
        {
            return(
                <GetTraining socketData={this.state.socketData} processTrainingHandler={this.processTrainingHandler}/>
            );
        }

      else if(this.state.currentTraining === '3')
      {
          return(
               <TrainingFinish finishTrainingHandler={this.finishTrainingHandler}/>
              );
      }
  }

    componentDidMount(){
        var socket = io.connect('http://10.76.56.86:8000');
        socket.on('connect', function (data) {
            console.log('connect');
        });
        socket.on('exercise', function(data){
            console.log(data);
            this.setState({socketData:data});
        }.bind(this));
    }
}

export default App;
