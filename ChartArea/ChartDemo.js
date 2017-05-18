/**
 * Created by yudingxin on 4/19/17.
 */
import React from 'react';

import {
  LuPage,
  Utils,
  Tasks,
} from 'lubase';

import './ChartDemo.css';

import {
  ChartArea,
} from '../../../../common/components';


class ChartDemo extends LuPage {
  constructor(props) {
    super(props);
    this.state = {
      resetFlag: false,
    };
  }

  componentWillMount() {
    this.setTitle({
      naviBar: {
        title: 'Chart Demo',
      },
      leftView: {},
      rightView: {
        title: '完成',
        callback: () => {
          alert('Hello rightView!');
        },
      },
    });
  }

  //Catch click event on the page.
  componentDidMount() {
    //FIXME polyfill method for CLOSET adaptive.
    if (window.Element && !Element.prototype.closest) {
      Element.prototype.closest =
        function(s) {
          var matches = (this.document || this.ownerDocument).querySelectorAll(s),
            i,
            el = this;
          do {
            i = matches.length;
            while (--i >= 0 && matches.item(i) !== el) {};
          } while ((i < 0) && (el = el.parentElement));
          return el;
        };
    }
    let self = this;
    document.body.addEventListener('click', function (e) {
      const svg = e.target.closest('svg');
      if (svg !== null) {
        return;
      }
      self.setState({
        resetFlag: true
      });
    });
  }

  render() {
    let chartData = {
      "date": [],
      "rate": [],
    };
    Array.prototype.min = function () {
      return Math.min.apply(null, this);
    };
    let rate = [4.4, 4.6, 4.8];
    let num = 3;
    let numSize = 90;
    let i = 0, size = 1;
    for (i = 0; i < num; i++) {
      for (size = 1; size <= numSize; size++) {
        chartData.date.push(`第${size + i * numSize}天`);
        chartData.rate.push(rate[i]);
      }
    }

    const tooltip = {
      enabled: true,
      useHTML: true,
      shared: true,
      pointFormatter: function () {
        return `${chartData.date[this.x]},${this.y}%`;
      },
      headerFormat: '',
      valueDecimals: 2,
      backgroundColor: '#92BFEF',
      borderColor: '#92BFEF',
      borderRadius: 4,
      borderWidth: 1,
      shadow: false,
      followTouchMove: false, //disable touch move.
      style: {
        color: "#fff",
        fontSize: "1.2rem",
      },
    };
    return (
      <div>
        <h2 style={{color: '#abc', margin: '1.5rem'}}>Area Chart Demo</h2>
        <li>
          <ChartArea format="{value:.2f} %" callBack={(params)=> {
            console.log(params)
          }} datas={chartData.rate} categories={chartData.date} yMinAxis={rate.min() - 0.2} xStep={numSize}
                     tooltip={tooltip} flag={this.state.resetFlag}/>
        </li>

      </div>
    )
  }
}

export default ChartDemo;
