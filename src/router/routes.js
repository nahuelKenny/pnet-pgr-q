const routes = [
  {
    path: '/',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {
        path: '',
        redirect: '/login'
      },
      {
        path: '/login',
        component: () => import('pages/auth/LoginPage.vue'),
        meta: { componentType: 'login' }
      },
      {
        path: '/register',
        component: () => import('pages/auth/LoginPage.vue'),
        meta: { componentType: 'registro' }
      },
      {
        path: '/reset-password',
        component: () => import('pages/auth/LoginPage.vue'),
        meta: { componentType: 'blanqueo' }
      },
      {
        path: '/forgot-password', // alias for reset-password
        redirect: '/reset-password'
      },
      // Query parameter route (optional/fallback)
      {
        path: '/auth',
        component: () => import('pages/auth/LoginPage.vue'),
        // Will use query parameter: /auth?type=login
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
