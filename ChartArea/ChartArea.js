import React, {
  Component,
} from 'react';
import ReactHighcharts from 'react-highcharts';
import './ChartArea.css';

class ChartArea extends Component {

  // FIXME get chart instance method through ref keyword.
  // componentDidUpdate() {
  //   if(this.chartInstance){
  //     const chart = this.chartInstance.getChart();
  //   }
  // }

  render() {
    const {
      categories = [],
      datas = [],
      format = '{value:.2f} %',
      tooltip: tooltipOptions = {},
      minTickInterval,
      callBack,
      resetBack,
    } = this.props;
    let xStep = this.props.xStep;
    let yMinAxis = this.props.yMinAxis || 4;
    let minY = Math.floor(yMinAxis);
    const {
      enabled = false,
    } = tooltipOptions;

    if (!this.props.xStep) {
      xStep = Math.ceil(categories.length / 5) ? Math.ceil(categories.length / 5) : 5;
    }
    const chartConfig = {
      chart: {
        spacingBottom: 10,
        spacingLeft: 0,
        spacingRight: 3,
        events: {
          load() {
            this.myRect = this.renderer.rect().add();
          },
          click: function (event) {
            let self = this;
            setTimeout(function () {
              //rect.fadeOut();
              self.tooltip.hide();
              self.myRect.hide();
              self.xAxis[0].hideCrosshair();
              self.yAxis[0].hideCrosshair();
              self.pointer.reset();
              let params = {};
              if (resetBack) {
                resetBack(params);
              }
            }, 20);
          }
        }
      },
      xAxis: {
        lineColor: '#d8e2e9',
        tickInterval: xStep,
        lineWidth: 1,
        labels: {
          rotation: 0,
          formatter: function formatter() {
            return categories[this.value];
          },
          style: {
            color: '#9dacb6',
            fontSize: '9px',
          },
        },
        crosshair: {
          color: 'rgba(252, 121, 70, 0.5)',
          zIndex: 3,
        },
      },
      yAxis: {
        title: null,
        min: minY,
        minPadding: 0,
        gridLineColor: '#d8e2e9',
        gridLineDashStyle: 'Dash',
        gridLineWidth: 0,
        labels: {
          format: format,
          style: {
            color: '#9dacb6',
            fontSize: '9px',
          },
        },
        crosshair: {
          color: 'rgba(252, 121, 70, 0.5)',
          zIndex: 3,
        },
        minTickInterval,
      },
      legend: {
        enabled: false,
      },
      credits: {
        enabled: false,
      },
      title: {
        text: null,
      },
      tooltip: tooltipOptions,
      plotOptions: {
        area: {
          dataLabels: {
            x: -18,
            y: 14,
            overflow: 'hidden',
            crop: false,
            style: {
              color: '#dcdcdc',
            },
          },
          fillColor: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1,
            },
            stops: [
              [0, 'rgba(85, 172, 238, 0.25)'],
              [1, 'rgba(255, 255, 255, 0.25)'],
            ],
          },
          lineWidth: 1,
          states: {
            hover: {
              lineWidth: 2,
            },
          },
          threshold: null,
          lineColor: 'rgba(74, 144, 226, 0.5)',
          enableMouseTracking: enabled,
        },
        series: {
          marker: {
            enabled: false,
            states: {
              hover: {
                lineWidth: 1,
                fillColor: '#fff',
                lineColor: '#92bfef',
              },
            },
          },
          cursor: 'pointer',
          point: {
            events: {
              mouseOver: function () {
                const chart = this.series.chart;
                chart.tooltip.enabled = true;
                const x0 = chart.xAxis[0].toPixels(0); // min value on X Axis.
                const x1 = chart.xAxis[0].toPixels(this.x);
                const y0 = chart.yAxis[0].toPixels(minY); // min value on Y Axis.
                const y1 = chart.yAxis[0].toPixels(this.y);
                const width = Math.abs(x1 - x0);
                const height = Math.abs(y0 - y1);
                chart.myRect.show();
                chart.myRect
                  .attr({
                    id: 'rect'
                  })
                  .animate({
                    x: x0,
                    y: y0 - height,
                    width: width,
                    height: height,
                    fill: '#fc7946',
                    zIndex: 3,
                  });
                let params = {x1: this.x, y1: this.y};
                if (callBack) {
                  callBack(params);
                }
              }
            }
          }
        },
      },
      series: [{
        type: 'area',
        data: datas,
      }],
    };
    return categories.length > 0 && datas.length > 0 ?
      (<div className="ChartAreaContain">
          <svg style={{height: 0}}>
            <defs>
              <linearGradient id="gradient-0" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0"/>
                <stop offset="1"/>
              </linearGradient>
              <linearGradient id="gradient-1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0"/>
                <stop offset="1"/>
              </linearGradient>
            </defs>
          </svg>
          <ReactHighcharts ref={(ref)=>(this.chartInstance = ref)} config={chartConfig}/>
        </div>
      ) :
      (<div className="ChartArea-NoData">
        <i className="lufont icon icon-fangdajing">
        </i>
        <span className="ChartArea-NoData-Text">
        暂无数据
      </span>
      </div>);
  }
}

ChartArea.propTypes = {
  categories: React.PropTypes.array,
  datas: React.PropTypes.array,
  format: React.PropTypes.string,
  xStep: React.PropTypes.number,
  yMinAxis: React.PropTypes.number,
  tooltip: React.PropTypes.object,
};
export default ChartArea;
