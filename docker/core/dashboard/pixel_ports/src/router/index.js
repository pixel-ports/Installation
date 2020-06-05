import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
/*
import componentsRouter from './modules/components'
import chartsRouter from './modules/charts'
import tableRouter from './modules/table'
import nestedRouter from './modules/nested'*/

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: 'profile', icon: 'user', noCache: true }
      }
    ]
  }
]

export const asyncRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/overview',
    children: [
      {
        path: 'overview',
        component: () => import('@/views/overview/home/index'),
        name: 'overview',
        meta: { title: 'overview', icon: 'table', affix: true }
      }
    ]
  },
  {
    path: '/widget',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import('@/views/widget/manage/index'),
        name: 'widget',
        meta: { title: 'widget', icon: 'chart', affix: false, roles: ['admin'] }
      }
    ]
  },
  /* {
    path: '/form',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import('@/views/form/index'),
        name: 'form',
        meta: { title: 'form', icon: 'dashboard', affix: false }
      }
    ]
  }, */
  {
    path: '/dashboard',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import('@/views/dashboard/manage/index'),
        name: 'dasbhoard',
        meta: { title: 'dashboard', icon: 'component', affix: false }
      },
      {
        path: '/genericDashboard/:id',
        component: () => import('@/views/dashboard/manage/genericDashboard'),
        name: 'generic dashboard',
        hidden: true,
        meta: { title: 'genericDashboard', noCache: true }
      },
      {
        path: '/newDashboard',
        component: () => import('@/views/dashboard/manage/genericDashboard'),
        name: 'new dashboard',
        hidden: true,
        meta: { title: 'newDashboard', noCache: true }
      }
    ]
  },
  /* {
    path: '/dashboard',
    component: Layout,
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'dashboard',
        meta: { title: 'dashboard', icon: 'component', affix: false }
      }
    ]
  }, */
  /* {
    path: '/Toolbar',
    component: Layout,
    children: [
      {
        path: 'Toolbar',
        component: () => import('@/views/dashboard/Toolbar'),
        name: 'Toolbar',
        meta: { title: 'Toolbar', icon: 'component', affix: false }
      }
    ]
  }, */
  {
    path: '/permission',
    component: Layout,
    alwaysShow: true, // will always show the root menu
    name: 'permission',
    meta: {
      title: 'permission',
      icon: 'user',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'role',
        component: () => import('@/views/permission/role'),
        name: 'RolePermission',
        meta: {
          title: 'rolePermission',
          icon: 'skill',
          roles: ['admin']
        }
      },
      {
        path: 'user',
        component: () => import('@/views/permission/user'),
        name: 'user',
        meta: {
          title: 'user',
          icon: 'peoples',
          roles: ['admin']
        }
      }
    ]
  },
  {
    path: '/pasForm',
    component: Layout,
    alwaysShow: true, // will always show the root menu
    name: 'pasForm',
    meta: {
      title: 'pasForm',
      icon: 'form'
    },
    children: [
      {
        path: 'rules',
        component: () => import('@/views/pasForm/rules'),
        name: 'Rules',
        meta: { title: 'rules', noCache: true, icon: 'documentation' }
      },
      {
        path: 'rulesList/:id',
        component: () => import('@/views/pasForm/rulesList'),
        name: 'Rules List',
        hidden: true,
        meta: { title: 'rulesList', noCache: true }
      },
      {
        path: 'resources',
        component: () => import('@/views/pasForm/index'),
        name: 'Resources',
        meta: { title: 'resources', noCache: true, icon: 'nested' }
      },
      {
        path: 'resourcesList/:id',
        component: () => import('@/views/pasForm/resourcesList'),
        name: 'Resources List',
        hidden: true,
        meta: { title: 'resourcesList', noCache: true }
      },
      {
        path: 'supplierChain',
        component: () => import('@/views/pasForm/supplierChain'),
        name: 'Supplier Chain',
        meta: { title: 'supplyChain', noCache: true, icon: 'tree' }
      },
      {
        path: 'supplierChainList/:id',
        component: () => import('@/views/pasForm/supplierChainList'),
        name: 'Supplier Chain List',
        hidden: true,
        meta: { title: 'supplyChainList', noCache: true }
      }
      /* ,
      {
        path: '/configuration/machines',
        component: () => import('@/views/configuration/machines'),
        name: 'Machines',
        meta: { title: 'machines', icon: 'star' }
      },
      {
        path: '/configuration/supplierChain',
        component: () => import('@/views/configuration/supplierChain'),
        name: 'SupplierChain',
        meta: { title: 'supplierChain', icon: 'star' }
      },
      {
        path: '/configuration/rules',
        component: () => import('@/views/configuration/rules'),
        name: 'Rules',
        meta: { title: 'rules', icon: 'star' }
      },
      {
        path: '/configuration/resources',
        component: () => import('@/views/configuration/resources'),
        name: 'Resources',
        meta: { title: 'resources2', icon: 'star' }
      },
      {
        path: '/resources',
        component: () => import('@/views/configuration/resources/index'),
        name: 'Resources',
        meta: { title: 'resources3', icon: 'star' }
      } */
    ]
  },
  /* {
    path: '/configuration',
    component: Layout,
    alwaysShow: true, // will always show the root menu
    name: 'configuration',
    meta: {
      title: 'configuration',
      icon: 'example',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: '/configuration/areas',
        component: () => import('@/views/configuration/areas'),
        name: 'Resources',
        meta: { title: 'resources1', icon: 'star' }
      },
      {
        path: '/configuration/machines',
        component: () => import('@/views/configuration/machines'),
        name: 'Machines',
        meta: { title: 'machines', icon: 'star' }
      },
      {
        path: '/configuration/supplierChain',
        component: () => import('@/views/configuration/supplierChain'),
        name: 'SupplierChain',
        meta: { title: 'supplierChain', icon: 'star' }
      },
      {
        path: '/configuration/rules',
        component: () => import('@/views/configuration/rules'),
        name: 'Rules',
        meta: { title: 'rules', icon: 'star' }
      },
      {
        path: '/configuration/resources',
        component: () => import('@/views/configuration/resources'),
        name: 'Resources',
        meta: { title: 'resources2', icon: 'star' }
      },
      {
        path: '/resources',
        component: () => import('@/views/configuration/resources/index'),
        name: 'Resources',
        meta: { title: 'resources3', icon: 'star' }
      }
    ]
  }, */
  {
    path: '/map',
    component: Layout,
    children: [
      {
        path: 'map',
        component: () => import('@/views/map/index'),
        name: 'map',
        meta: { title: 'map',
          icon: 'international',
          affix: false }
      }
    ]
  },
  {
    path: '/alerts',
    component: Layout,
    alwaysShow: true, // will always show the root menu
    name: 'alerts',
    meta: {
      title: 'alerts',
      icon: 'guide',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/alerts/list'),
        name: 'Alerts list',
        meta: { title: 'alertList',
          icon: 'list',
          affix: false }
      },
      {
        path: 'myalerts',
        component: () => import('@/views/alerts/myAlerts'),
        name: 'My Alerts',
        meta: { title: 'myAlerts',
          icon: 'eye-open',
          affix: false }
      }
    ]
  },
  {
    path: '/operational-tools',
    component: Layout,
    alwaysShow: true, // will always show the root menu
    name: 'operationaltools',
    meta: {
      title: 'operationaltools',
      icon: 'example',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'widgets/:id/:executionId',
        component: () => import('@/views/optools/widgets'),
        name: 'opToolsView',
        hidden: true,
        meta: { title: 'opToolsView', noCache: true, breadcrumb: false }
      },
      {
        path: 'models',
        component: () => import('@/views/optools/models/index'),
        name: 'models',
        meta: { title: 'models', icon: 'lock' }
      },
      {
        path: 'models/:id/executions',
        component: () => import('@/views/optools/models/ExecutionList'),
        name: 'Model Execution List',
        hidden: true,
        meta: { title: 'executionListModels', noCache: true }
      },
      {
        path: '/models/:id/scheduled-executions/',
        component: () => import('@/views/optools/models/ScheduledExecutionList'),
        name: 'Model Scheduled Executions List',
        hidden: true,
        meta: { title: 'scheduledExecutionList', noCache: true }
      },
      {
        path: 'p_algorithm',
        component: () => import('@/views/optools/models/index'),
        name: 'predictiveAlgorithm',
        meta: { title: 'predictiveAlgorithm', icon: 'chart' }
      },
      {
        path: '/p_algorithm/:id/executions/',
        component: () => import('@/views/optools/models/ExecutionList'),
        name: 'Predictive Algorithm Execution List',
        hidden: true,
        meta: { title: 'executionListPAlgorithm', noCache: true }
      },
      {
        path: '/p_algorithm/:id/scheduled-executions/',
        component: () => import('@/views/optools/models/ScheduledExecutionList'),
        name: 'Predictive Algorithm Scheduled Executions List',
        hidden: true,
        meta: { title: 'pAlgorithmscheduledExecutionList', noCache: true }
      },
      {
        path: 'kpi',
        component: () => import('@/views/optools/kpi/index'),
        name: 'kpis',
        meta: { title: 'kpis', icon: 'link' }
      },
      // Review
      {
        path: '/models/:modelId/executions/:executionId',
        component: () => import('@/views/optools/models/ViewModelExecution'),
        name: 'ViewModelExecution',
        hidden: true,
        meta: { title: 'viewModelExecution', noCache: true }
      },
      {
        path: '/models/:modelId/newExecution',
        component: () => import('@/views/optools/models/NewModelExecution'),
        name: 'newExecution',
        hidden: true,
        meta: { title: 'newModelExecution', noCache: true }
      },
      {
        path: '/models/:modelId/scheduled-executions/:scheduledExecutionId/edit',
        component: () => import('@/views/optools/models/EditScheduledExecution'),
        name: 'Edit Model Scheduled Execution',
        hidden: true,
        meta: { title: 'editScheduledExecution', noCache: true }
      },
      {
        path: '/models/:modelId/scheduled-executions/:executionId',
        component: () => import('@/views/optools/models/ViewModelExecution'),
        name: 'ViewScheduledExecution',
        hidden: true,
        meta: { title: 'viewScheduledExecution', noCache: true }
      },
      {
        path: '/models/:modelId/dashboard',
        component: () => import('@/views/optools/models/PEIDashboard'),
        name: 'PEI Dashboard',
        hidden: true,
        meta: { title: 'peiDashboard', noCache: true }
      },
      {
        path: '/models/:modelId/dashboards',
        component: () => import('@/views/optools/models/EnergyConsumptionDashboard'),
        name: 'Energy Consumption Dashboard',
        hidden: true,
        meta: { title: 'energyDashboard', noCache: true }
      }
      /* {
        path: 'event',
        component: () => import('@/views/optools/event/index'),
        name: 'event',
        meta: { title: 'event', icon: 'education' }
      }, */
      /* {
        path: 'trends',
        component: () => import('@/views/optools/trends/index'),
        name: 'trends',
        meta: { title: 'trends', icon: 'star' }
      } */
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
