import React, { Component } from 'react';
import {Line} from 'react-chartjs-2';



class Stocks extends Component {
  constructor(props) {
      super(props)
      this.state = {
          chartXValues : [],
          chartYValues : [],
          interval : '',
          points: '',
          historySize : '',
          stockSymbol: '',
          stockSymbolErrorMessage: '',
          stockSymbolError: false,
          stockSymbolSuccess: false
      }
      this.fetchStocks = this.fetchStocks.bind(this)
  }

  handdleChance = (e) => {
    
    let {name,value} = e.target;

    (name == 'stockSymbol') && (value = value.toUpperCase());

    this.setState({
      [name]: value})

    
    if (name == 'interval') {
      this.setState({
        historySize: '',
        points: 'compact'})
    }  
    if (name == 'points') {
      this.setState({
        historySize: '',
        interval: '1min'})
    } 
    if (name == 'historySize') {
      this.setState({
        interval: '',
        points: ''})
    }  

    
    
  }
  fetchStocks () {

    console.log('FETCHING DATA')

    const apiKey = 'APX6SHEY1COUYJDJ';
    let interval = this.state.interval;
    let historySize ;
    let stockSymbol = this.state.stockSymbol;
    
    let period = '';
    let x  
    if (interval){
      period = `INTRADAY&interval=${interval}`;
      x = interval;
      historySize = this.state.points;
    } else {
      period = 'Daily';
      x = period;
      historySize = this.state.historySize;
    }

    let apiCall =`https://www.alphavantage.co/query?function=TIME_SERIES_${period}&symbol=${stockSymbol}&outputsize=${historySize}&apikey=${apiKey}`;

    let chartXValues = [];
    let chartYValues = [];
    fetch(apiCall)
    .then(response => response.json())
    .then(data => {

      console.log('FETCH OK',interval,period);
      if (data['Thank you']){
        this.setState({
            stockSymbolErrorMessage: 'Try again later, our policy is maximum 5 API call per minute!',
            stockSymbolError:false,
            stockSymbolSuccess:true,
            chartXValues : [],
            chartYValues : [],
        })
        
      }
      if (data['Error Message']){
        this.setState({
            stockSymbol : '',
            stockSymbolErrorMessage: 'Try again, the symbol is not correct',
            stockSymbolError:true,
            stockSymbolSuccess:false,
            chartXValues : [],
            chartYValues : [],
        })
        
      } else {
        
        console.log('PUSH time',interval,period,x)
        
                            
        for (var key in data[`Time Series (${x})`]) {
          chartXValues.push(key);
          chartYValues.push(data[`Time Series (${x})`][key]['1. open'])
        }
        this.setState({chartXValues,chartYValues,stockSymbolError:false,stockSymbolSuccess:true,stockSymbolErrorMessage: ''})
      }
      
      
    })
    .catch(err => this.setState = {
                      stockSymbolError:true,
                      stockSymbolSuccess:false,
                      stockSymbolMessage: err
                    }
    );
  }

    render (){
    return (
    <div className="stocks">
       
{console.log(this.state)}
      
      <div className="inputSymbol">
            <label >Please write the symbol of the company to see their opening stock price history :</label>
            
            <div id = 'stockSymbolInput'
                className = {this.state.stockSymbolError ? 'error': this.state.stockSymbolSuccess ? 'success' : undefined}
                >

              <input 
                type= 'text' 
                placeholder =' Stock symbol' 
                value = {this.state.stockSymbol} 
                name = 'stockSymbol'
                onChange = {this.handdleChance}/> 
            </div>
        </div>

            <div className = 'inputHistorySize'>
                  <label>
                    <input 
                      type ='radio' 
                      value = 'compact'
                      name = 'historySize'
                      checked = {this.state.historySize === 'compact'}
                      onChange = {this.handdleChance}/> past 100 days 
                  </label>
                  <label>
                    <input 
                      type ='radio' 
                      value = 'full'
                      name = 'historySize'
                      checked = {this.state.historySize === 'full'}
                      onChange = {this.handdleChance}/> past 20 years
                  </label>
            </div>

            <p> OR </p>

                <div className = 'inputInterval'>
                  <label>
                    <input 
                      type ='radio' 
                      value = '1min'
                      name = 'interval'
                      checked = {this.state.interval === '1min'}
                      onChange = {this.handdleChance}/> interval 1 min 
                  </label>
                  <label>
                    <input 
                      type ='radio' 
                      value = '5min'
                      name = 'interval'
                      checked = {this.state.interval === '5min'}
                      onChange = {this.handdleChance}/> interval 5 min
                  </label>
                  <label>
                    <input 
                      type ='radio' 
                      value = '15min'
                      name = 'interval'
                      checked = {this.state.interval === '15min'}
                      onChange = {this.handdleChance}/> interval 15 min 
                  </label>
                  <label>
                    <input 
                      type ='radio' 
                      value = '30min'
                      name = 'interval'
                      checked = {this.state.interval === '30min'}
                      onChange = {this.handdleChance}/> interval 30 min
                  </label>
                  <label>
                    <input 
                      type ='radio' 
                      value = '60min'
                      name = 'interval'
                      checked = {this.state.interval === '60min'}
                      onChange = {this.handdleChance}/> interval 60 min
                  </label>
                  
                  <div className = 'inputIntervalPoints'>
                  <label>
                    <input 
                      type ='radio' 
                      value = 'compact'
                      name = 'points'
                      checked = {this.state.points === 'compact'}
                      onChange = {this.handdleChance}/> latest 100 points 
                  </label>
                  <label>
                    <input 
                      type ='radio' 
                      value = 'full'
                      name = 'points'
                      checked = {this.state.points === 'full'}
                      onChange = {this.handdleChance}/> full-length series
                  </label>
                </div>
              </div>

                  
          

          <a id = 'button' onClick = {this.fetchStocks}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            Show Grafic
            </a>
            <br/>
            <p>
                {this.state.stockSymbolErrorMessage}
            </p>
      
      <div style = {{width: '1000px'}}>
        <Line
          data = {
            {
              labels : this.state.chartXValues,
              datasets : [{
                label : 'Opening Price',
                pointBackgroundColor: 'white',
                pointBorderColor: 'rgb(247, 115, 137)',
                data : this.state.chartYValues,
                backgroundColor: 'black',
                borderColor: 'white',
              }]
           }
        }
          options={{
            responsive:true,
            scales: {
              xAxes: [{
                gridLines: {
                  display: false
                }
              }],
              yAxes: [{
                gridLines: {
                  display: false
                }
              }]
            }
          }}
          
        />
        </div>
    </div>
  );
 }
}

export default Stocks;
