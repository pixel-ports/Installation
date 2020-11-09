<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
// import { getInstance } from '@/api/otools'
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from '../mixins/resize'
// import { debounce } from '@/utils'
import { dateFormatterToString } from '@/utils/common'
const hard = require('./pas2.json')
const hardErwan = require('./pas Erwan.json')
// const animationDuration = 6000
const HEIGHT_RATIO = 0.6
const DIM_CATEGORY_INDEX = 0
const DIM_TIME_ARRIVAL = 1
const DIM_TIME_DEPARTURE = 2
const DIM_TIME_ARRIVAL_DOCK = 7
const DIM_TIME_DEPARTURE_DOCK = 8
// const _cartesianXBounds = []  // only for draggable rows
// const _cartesianYBounds = []  // only for draggable rows
export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    },
    filtered: {
      type: Object,
      default: function() {
        return {
          id: [
            {
              modelId: 'hard1',
              executionId: 'hard1'
            }
          ],
          showRowsAs: ''
        }
      }
    },
    definition: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      chart: null,
      data: {},
      dataIndex: {},
      apronWidth: 120
    }
  },
  mounted() {
    // console.log(hard['actual PAS'].Terminals)
    // if (!this.filtered.id[0].executionId === 'hard1') {
    if (!this.filtered.showRowsAs) {
      this.formatToPAS(hard[0].ships_list)
      this.$nextTick(() => {
        this.initStaticChart()
      })
    } else {
      // getInstance({ id: this.filtered.id[0].executionId }).then(response => {
      //   this.formatToPAS(response.result[0].ships_list)
      //   })
      if (this.filtered.showRowsAs === 'ships') {
        this.formatToShipsInRows(hardErwan['actual PAS'].Terminals)
      } else if (this.filtered.showRowsAs === 'docks') {
        this.formatToDocksInRows(hardErwan['actual PAS'].Terminals)
      }
      this.$nextTick(() => {
        this.initChart()
      })
    }

    // this.__resizeHandler = debounce(() => {
    //   if (this.chart) {
    //     this.chart.resize()
    //   }
    // }, 100)
    window.addEventListener('resize', this.__resizeHandler)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    window.removeEventListener('resize', this.__resizeHandler)
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    // Static Gantt Chart with hardcoded values
    formatToPAS(data_raw) {
      var objectVCall = []
      var objectVCallIndex = []

      for (let i = 0; i < data_raw.length; i++) {
        const element = data_raw[i]
        const label = decodeURI(element.label)
        objectVCallIndex.push([i, label])
        if (element.stopovers_list && element.stopovers_list.length) {
          for (let j = 0; j < element.stopovers_list.length; j++) {
            const hand = element.stopovers_list[j].handlings_list[0]

            if (hand.dock && hand.dock.ETA && hand.dock.ETD) {
              objectVCall.push([i, hand.dock.ETA, hand.dock.ETD, label, hand.activities_list.length, dateFormatterToString(hand.dock.ETA), dateFormatterToString(hand.dock.ETD)])
            }
          }
        }
      }
      this.data = {
        dimensions: [
          'id',
          'arrival_dock',
          'departure_dock',
          'Name',
          'Steps',
          'Arrival dock',
          'Departure dock'
        ],
        data: objectVCall
      }

      this.dataIndex = {
        dimensions: [
          'id',
          'name'
        ],
        data: objectVCallIndex
      }
    },
    renderStaticGanttItem(params, api) {
      var categoryIndex = api.value(DIM_CATEGORY_INDEX)
      var timeArrival = api.coord([api.value(DIM_TIME_ARRIVAL), categoryIndex])
      var timeDeparture = api.coord([api.value(DIM_TIME_DEPARTURE), categoryIndex])
      var barLength = timeDeparture[0] - timeArrival[0]
      // Get the heigth corresponds to length 1 on y axis.
      var barHeight = api.size([0, 1])[1] * HEIGHT_RATIO
      var x = timeArrival[0]
      var y = timeArrival[1] - barHeight

      var rectNormal = this.clipRectByRect(params, {
        x: x, y: y, width: barLength, height: barHeight
      })

      return {
        type: 'group',
        children: [{
          type: 'rect',
          ignore: !rectNormal,
          shape: rectNormal,
          style: api.style()
        }]
      }
    },
    initStaticChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.chart.setOption({ tooltip: {
      },
      legend: {
        left: 'center',
        bottom: '10',
        data: ['Name']
      },
      toolbox: {
        left: 20,
        top: 0,
        itemSize: 20
      },
      animation: false,
      grid: {
        show: true,
        top: 50,
        bottom: 15,
        left: 5,
        right: 5,
        backgroundColor: '#fff',
        borderWidth: 0
      },
      xAxis: {
        type: 'time',
        position: 'top',
        splitLine: {
          lineStyle: {
            color: ['#E9EDFF']
          }
        },
        axisLine: {
          show: false
        },
        axisTick: {
          lineStyle: {
            color: '#929ABA'
          }
        },
        axisLabel: {
          color: '#929ABA',
          inside: false,
          align: 'center'
        }
      },
      yAxis: {
        axisTick: { show: false },
        splitLine: { show: false },
        axisLine: { show: false },
        axisLabel: { show: false },
        min: 0,
        max: 8 // 8 rows
      },
      series: [{
        id: 'dockData',
        type: 'custom',
        renderItem: this.renderStaticGanttItem,
        dimensions: this.data.dimensions,
        encode: {
          x: [DIM_TIME_ARRIVAL_DOCK, DIM_TIME_DEPARTURE_DOCK],
          y: DIM_CATEGORY_INDEX,
          tooltip: [3, 5, 6, 4]
        },
        data: this.data.data
      }
      ]
      }
      )
    },
    // Gantt Chart with real values from user selection
    formatToShipsInRows(terminals) {
      var objectVCall = []
      var objectVCallIndex = []
      var allShipsList = []

      // Reordenamos el Json para tener una lista de "ships"
      for (let i = 0; i < terminals.length; i++) {
        const terminal = terminals[i]
        const terminalID = terminal.ID
        const numberOfShips = terminal.Ships.length
        for (let j = 0; j < numberOfShips; j++) {
          const ship = terminal.Ships[j]
          // below: nuevo campo "terminal" en cada stopover
          ship.Stopovers.map(function(stopover) {
            stopover.terminal = terminalID
          })
          const index = allShipsList.findIndex(item => item.ID === ship.ID)
          if (index < 0) {
            // some code to push ship into allShipsList as new ship
            allShipsList.push(ship)
          } else {
            // some code for ship that already exists in allShipsList
            allShipsList[index].Stopovers = [...allShipsList[index].Stopovers, ...ship.Stopovers]
          }
        }
      }
      // console.log(allShipsList)

      // Una vez tenemos el nuevo json re-ordenado, lo recorremos extrayendo objectVCall para renderizarlo en el Gantt.
      const numberOfShips = allShipsList.length
      for (let i = 0; i < numberOfShips; i++) {
        const ship = allShipsList[i]
        // console.log(ship)
        // const shipID = ship.ID
        objectVCallIndex.push([
          i,
          ship.ID
        ])
        const numberOfStopovers = ship.Stopovers.length
        for (let j = 0; j < numberOfStopovers; j++) {
          const stopover = ship.Stopovers[j]
          const numberOfHandlings = ship.Stopovers[j].Handlings.length
          for (let k = 0; k < numberOfHandlings; k++) {
            const handling = stopover.Handlings[k]
            objectVCall.push([
              i,
              stopover.arrival.TS,
              stopover.departure.TS,
              ship.ID,
              stopover.terminal,
              stopover.ID,
              handling.docking.dock,
              handling.docking.arrival.TS,
              handling.docking.departure.TS,
              j
            ])
          }
        }
      }

      this.data = {
        dimensions: [
          'ShipCounter',
          'Stopover Start',
          'Stopover End',
          'Ship Id',
          'Terminal ID',
          'Stopover ID',
          'Dock ID',
          'Docking Start',
          'Docking End',
          'DockCounter'
        ],
        data: objectVCall
      }

      this.dataIndex = {
        dimensions: ['row', 'shipID'],
        data: objectVCallIndex
      }
      // console.log('this.data.data:::')
      // console.log(this.data.data)
    },
    formatToDocksInRows(terminals) {
      var objectVCall = []
      var objectVCallIndex = []
      var allDocksList = []

      // Reordenamos el Json para que tener una lista de "docks"
      for (let i = 0; i < terminals.length; i++) {
        const terminal = terminals[i]
        const terminalID = terminal.ID
        const numberOfShips = terminal.Ships.length
        for (let j = 0; j < numberOfShips; j++) {
          const ship = terminal.Ships[j]
          const shipID = ship.ID
          const numberOfStopovers = ship.Stopovers.length
          for (let k = 0; k < numberOfStopovers; k++) {
            const stopover = ship.Stopovers[k]
            // const stopoverID = stopover.ID
            const numberOfHandlings = stopover.Handlings.length
            for (let m = 0; m < numberOfHandlings; m++) {
              const handling = stopover.Handlings[m]
              // const handlingID = handling.ID
              const dockItem = {
                'dockID': handling.docking.dock,
                'terminalID': terminalID
              }
              dockItem.details = [{
                'shipID': shipID,
                'shipName': ship.info.label,
                'cargoeCategory': handling.cargoe.info.category,
                'direction': handling.direction,
                'arrival': handling.docking.arrival.TS,
                'departure': handling.docking.departure.TS
              }]

              const index = allDocksList.findIndex(item => (item.dockID === handling.docking.dock && item.terminalID === terminalID))
              if (index < 0) {
                allDocksList.push(dockItem)
              } else {
                allDocksList[index].details = [...allDocksList[index].details, ...dockItem.details]
              }
            }
          }
        }
        // console.log(allDocksList.sort((a, b) => a.dock - b.dock))
      }
      console.log(allDocksList)
      // Reordenando el array por Terminal
      allDocksList.sort((a, b) => a.terminalID.localeCompare(b.terminalID))
      // console.log(orderedAllDocksList)

      // Una vez tenemos el nuevo json re-ordenado, lo recorremos extrayendo objectVCall para renderizarlo en el Gantt.
      const numberOfDocks = allDocksList.length
      for (let i = 0; i < numberOfDocks; i++) {
        const dock = allDocksList[i]
        // console.log(ship)
        // const shipID = ship.ID
        objectVCallIndex.push([
          i,
          dock.dockID,
          dock.terminalID
        ])
        const numberOfDetails = dock.details.length
        for (let j = 0; j < numberOfDetails; j++) {
          const detail = dock.details[j]
          objectVCall.push([
            i,
            detail.arrival,
            detail.departure,
            detail.shipID,
            detail.direction,
            detail.cargoeCategory,
            dock.terminalID
          ])
        }
      }

      this.data = {
        dimensions: [
          'DockCounter',
          'Arrival at Dock',
          'Departure from Dock',
          'ShipId',
          'Direction',
          'Cargoe Category',
          'terminalID'
        ],
        data: objectVCall
      }

      this.dataIndex = {
        dimensions: ['row', 'dock', 'terminal'],
        data: objectVCallIndex
      }
      // console.log('this.data.data:::')
      // console.log(this.data.data)
    },
    renderGanttItem(params, api) {
      // console.log('PARAMS para renderGanttItem:')
      // console.log('ALTURA DE "params.coordSys.height":', params.coordSys.height)
      // console.log(api)
      var elementIndex = api.value(DIM_CATEGORY_INDEX)
      var elementTimeArrival = api.coord([
        api.value(DIM_TIME_ARRIVAL),
        elementIndex
      ])
      var elementTimeDeparture = api.coord([
        api.value(DIM_TIME_DEPARTURE),
        elementIndex
      ])

      // console.log(api.value(DIM_TIME_ARRIVAL), elementIndex)
      // console.log(api.value(DIM_TIME_DEPARTURE), elementIndex)

      // var dockTimeArrival = api.coord([
      //   api.value(DIM_TIME_ARRIVAL_DOCK),
      //   elementIndex
      // ])
      // var dockTimeDeparture = api.coord([
      //   api.value(DIM_TIME_DEPARTURE_DOCK),
      //   elementIndex
      // ])

      var elementBarLength = elementTimeDeparture[0] - elementTimeArrival[0]
      // var dockBarLength = dockTimeDeparture[0] - dockTimeArrival[0]
      // Get the heigth corresponds to length 1 on y axis.
      // console.log(api.size([0, 1]))
      var barHeight = api.size([0, 1])[1] * HEIGHT_RATIO
      var elementX = elementTimeArrival[0]
      var elementY = elementTimeArrival[1] - barHeight
      // var dockX = dockTimeArrival[0]
      // var dockY = dockTimeArrival[1] - barHeight

      // var shipId = api.value(3)
      // var shipIdWidth = echarts.format.getTextRect(shipId).width
      // var textWidth = shipIdWidth
      // var text = elementBarLength > textWidth + 20 ? `${shipId}` : '...'

      var labelPosition = this.filtered.showRowsAs === 'ships' ? 5 : 3
      var label = api.value(labelPosition)
      var labelWidth = echarts.format.getTextRect(label).width
      var text = elementBarLength > labelWidth + 20 ? `${label}` : '...'

      var rectStopover = this.clipRectByRect(params, {
        x: elementX,
        y: elementY,
        width: elementBarLength,
        height: barHeight
      })
      // var rectDock = this.clipRectByRect(params, {
      //   x: dockX,
      //   y: dockY,
      //   width: dockBarLength,
      //   height: barHeight
      // })
      var rectText = this.clipRectByRect(params, {
        x: elementX,
        y: elementY,
        width: elementBarLength,
        height: barHeight
      })

      return {
        type: 'group',
        children: [
          {
            type: 'rect',
            ignore: !rectStopover,
            shape: rectStopover,
            style: api.style({
              stroke: 'blue',
              fill: '#749f83'
            })
          }, // ************          // {          //   type: 'rect',
          //   ignore: !rectDock,
          //   shape: rectDock,
          //   style: api.style({ fill: '#ddb30b', opacity: 1 }),
          //   z2: 10, // zIndex for visibility,
          // }
          // ************

          {
            type: 'rect',
            ignore: !rectText,
            shape: rectText,
            style: api.style({
              fill: 'transparent',
              stroke: 'transparent',
              textFill: '#555',
              text: text
            })
          }
        ]
      }
    },
    renderAxisLabelItem(params, api) {
      // console.log('PARAMS PARA renderAxisLabelItem!!')
      // console.log(api.value(0))
      // console.log(api.value(1))
      // console.log(api.value(2))
      var y = api.coord([0, api.value(0)])[1]
      // var elementName = api.value(1)
      // var elementNameWidth = echarts.format.getTextRect(elementName).width
      if (y < params.coordSys.y + 5) {
        return
      }
      return {
        type: 'group',
        position: [0, y],
        children: [
          {
            type: 'path',
            shape: {
              d: 'M0,0 L0,-20 L30,-20 C42,-20 38,-1 50,-1 L70,-1 L70,0 Z',
              x: 0,
              y: -20,
              width: this.apronWidth,
              height: 20,
              layout: 'cover'
            },
            style: {
              fill: '#368c6c'
            }
          },
          {
            type: 'text',
            style: {
              x: 5,
              y: -3,
              textVerticalAlign: 'bottom',
              textAlign: 'left',
              text: api.value(1),
              textFill: '#bbb'
            }
          },
          {
            type: 'text',
            style: {
              x: this.apronWidth - 30,
              y: -3,
              textVerticalAlign: 'bottom',
              textAlign: 'left',
              text: this.filtered.showRowsAs === 'ships' ? '' : 'T' + api.value(2).split('_')[1],
              textFill: '#000'
            }
          }
        ]
      }
    },
    clipRectByRect(params, rect) {
      // console.log('X  "params.coordSys.x":', params.coordSys.x)
      // console.log('Y  "params.coordSys.y":', params.coordSys.y)
      // console.log('WIDTH DE "params.coordSys.width":', params.coordSys.width)
      // console.log('ALTURA DE "params.coordSys.height":', params.coordSys.height)
      return echarts.graphic.clipRectByRect(rect, {
        x: params.coordSys.x,
        y: params.coordSys.y,
        width: params.coordSys.width,
        height: params.coordSys.height
      })
    },
    initChart() {
      console.log('initChart called!!')
      var numberOfElements = this.data.data.length // number of elements in the series
      var numberOfRows = this.data.data[numberOfElements - 1][0] // number of rows in the chart
      this.chart = echarts.init(this.$el, 'macarons')
      // console.log(this.chart._api.getHeight())
      const seriesShipsInRows = [
        {
          id: 'dataElements',
          type: 'custom',
          renderItem: this.renderGanttItem,
          dimensions: this.data.dimensions,
          encode: {
            x: [DIM_TIME_ARRIVAL, DIM_TIME_DEPARTURE],
            y: [DIM_CATEGORY_INDEX],
            tooltip: [3, 1, 2, 4, 5]
          },
          data: this.data.data
        },
        {
          id: 'labelElements',
          type: 'custom',
          renderItem: this.renderAxisLabelItem,
          dimensions: this.dataIndex.dimensions,
          encode: {
            x: -1, // Then this series will not be controlled by x.
            y: [DIM_CATEGORY_INDEX]
          },
          data: this.dataIndex.data
          // data: echarts.util.map(this.dataIndex.data, function(item, index) {
          //   // console.log('echarts.util.map...........')
          //   // console.log(echarts)
          //   // console.log(item)
          //   // console.log(index)
          //   // console.log([index].concat(item))
          //   return [index].concat(item)
          // })
        }
      ]
      const seriesDocksInRows = [
        {
          id: 'dataElements',
          type: 'custom',
          renderItem: this.renderGanttItem,
          dimensions: this.data.dimensions,
          encode: {
            x: [DIM_TIME_ARRIVAL, DIM_TIME_DEPARTURE],
            y: [DIM_CATEGORY_INDEX],
            tooltip: [3, 4, 5]
          },
          data: this.data.data
        },
        {
          id: 'labelElements',
          type: 'custom',
          renderItem: this.renderAxisLabelItem,
          dimensions: this.dataIndex.dimensions,
          encode: {
            x: -1, // Then this series will not be controlled by x.
            y: [DIM_CATEGORY_INDEX]
          },
          data: this.dataIndex.data
          // data: echarts.util.map(this.dataIndex.data, function(item, index) {
          //   return [index].concat(item)
          // })
        }
      ]
      this.chart.setOption({
        tooltip: {
          show: true
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: ['Name']
        },
        toolbox: {
          left: 20,
          top: 0,
          itemSize: 20
        },
        animation: false,
        dataZoom: [
          {
            type: 'slider',
            show: true,
            xAxisIndex: 0,
            filterMode: 'weakFilter',
            height: 20,
            bottom: 0,
            start: 0,
            end: 50,
            handleIcon:
              'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '80%',
            showDetail: false
          },
          {
            type: 'inside',
            id: 'insideX',
            xAxisIndex: 0,
            filterMode: 'weakFilter',
            zoomOnMouseWheel: false,
            moveOnMouseMove: true,
            moveOnMouseWheel: false
          },
          {
            type: 'slider',
            show: true,
            yAxisIndex: 0,
            handleIcon:
              'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            width: 20,
            right: 0,
            top: 70,
            bottom: 20,
            // mostramos las 15 primeras rows desde la 0(startValue=0) hasta la 15(endValue=15)
            startValue: 0,
            endValue: 15,
            handleSize: '80%',
            showDetail: false
          },
          {
            type: 'inside',
            id: 'insideY',
            yAxisIndex: 0,
            filterMode: 'weakFfilter',
            zoomOnMouseWheel: false,
            moveOnMouseMove: true,
            moveOnMouseWheel: true
          }
        ],
        grid: {
          show: true,
          top: 50,
          bottom: 15,
          left: this.apronWidth,
          right: 15,
          backgroundColor: '#fff',
          borderWidth: 0
        },
        xAxis: {
          type: 'time',
          position: 'top',
          splitLine: {
            lineStyle: {
              color: ['#E9EDFF']
            }
          },
          axisLine: {
            show: false
          },
          axisTick: {
            lineStyle: {
              color: '#929ABA'
            }
          },
          axisLabel: {
            color: '#929ABA',
            inside: false,
            align: 'center'
          }
        },
        yAxis: {
          axisTick: { show: false },
          splitLine: { show: false },
          axisLine: { show: false },
          axisLabel: { show: false },
          min: 0,
          // max: this.data.data.length + 1
          max: numberOfRows + 1
        },
        series: this.filtered.showRowsAs === 'ships' ? seriesShipsInRows : seriesDocksInRows
      })
    }

  }
}
</script>
