<template>
  <div style="width:100%;height:100%">
    <gantt-elastic :tasks="tasks" :options="options" />
  </div>
</template>

<script>
import dayjs from 'dayjs' // eslint-disable-line no-unused-vars
import GanttElastic from 'gantt-elastic/src/GanttElastic.vue'
import resize from '../mixins/resize'

// just helper to get current dates
function getDate(hours) {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() + 1
  const currentDay = currentDate.getDate()
  const timeStamp = new Date(
    `${currentYear}-${currentMonth}-${currentDay} 00:00:00`
  ).getTime()
  return new Date(timeStamp + hours * 60 * 60 * 1000).getTime()
}

const tasks = [
  {
    id: 1,
    label: 'Make some noise',
    user:
            '<a href="https://www.google.com/search?q=John+Doe" target="_blank" style="color:#0077c0;">John Doe</a>',
    start: getDate(-24 * 5),
    duration: 15 * 24 * 60 * 60 * 1000,
    progress: 85,
    type: 'project'
    // collapsed: true,
  },
  {
    id: 2,
    label: 'With great power comes great responsibility',
    user:
            '<a href="https://www.google.com/search?q=Peter+Parker" target="_blank" style="color:#0077c0;">Peter Parker</a>',
    parentId: 1,
    start: getDate(-24 * 4),
    duration: 4 * 24 * 60 * 60 * 1000,
    progress: 50,
    type: 'milestone',
    collapsed: true,
    style: {
      base: {
        fill: '#1EBC61',
        stroke: '#0EAC51'
      }
      /* 'tree-row-bar': {
              fill: '#1EBC61',
              stroke: '#0EAC51'
            },
            'tree-row-bar-polygon': {
              stroke: '#0EAC51'
            }*/
    }
  },
  {
    id: 3,
    label: 'Courage is being scared to death, but saddling up anyway.',
    user:
            '<a href="https://www.google.com/search?q=John+Wayne" target="_blank" style="color:#0077c0;">John Wayne</a>',
    parentId: 2,
    start: getDate(-24 * 3),
    duration: 2 * 24 * 60 * 60 * 1000,
    progress: 100,
    type: 'task'
  },
  {
    id: 4,
    label: 'Put that toy AWAY!',
    user:
            '<a href="https://www.google.com/search?q=Clark+Kent" target="_blank" style="color:#0077c0;">Clark Kent</a>',
    start: getDate(-24 * 2),
    duration: 2 * 24 * 60 * 60 * 1000,
    progress: 50,
    type: 'task',
    dependentOn: [3]
  }
]

const options = {
  height: 600,
  title: {
    label: 'Your project title as html (link or whatever...)',
    html: false
  },
  taskList: {
    columns: [
      {
        id: 1,
        label: 'ID',
        value: 'id',
        width: 40,
        expander: true
      }
    ]
  },
  locale: {
    name: 'en',
    Now: 'Now',
    'X-Scale': 'Zoom-X',
    'Y-Scale': 'Zoom-Y',
    'Task list width': 'Task list',
    'Before/After': 'Expand',
    'Display task list': 'Task list'
  }
}

export default {
  components: {
    ganttElastic: GanttElastic
  },
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
    }
  },
  data() {
    return {
      tasks,
      options
    }
  }
}
</script>
