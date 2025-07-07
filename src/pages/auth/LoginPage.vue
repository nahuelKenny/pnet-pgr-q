<template>
   <LoginBaseComp 
      :title="currentTitle" 
      :subtitle="currentSubtitle"
      :show-title-section="currentComponentType !== 'registro'" 
      :component-type="currentComponentType"
      :component-props="currentComponentProps" 
      :on-submit="handleSubmit" 
      @forgot-password="handleForgotPassword"
      @component-switch="handleComponentSwitch" />
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter, useRoute } from "vue-router";
import { loginAjax, resetPasswordAjax, registerAjax } from "src/api/auth";
import LoginBaseComp from "src/components/auth/LoginBaseComp.vue";

const router = useRouter();
const route = useRoute();

// Component type mapping
const componentTypeMap = {
  '/login': 'login',
  '/register': 'registro', 
  '/reset-password': 'blanqueo',
  '/auth': route.query.type || 'login'
};

// Reactive component type based on current route
const currentComponentType = computed(() => {
  if (route.meta?.componentType) {
    return route.meta.componentType;
  }
  
  if (route.query.type) {
    return route.query.type;
  }
  
  return componentTypeMap[route.path] || 'login';
});

// Content configuration based on component type
const contentConfig = computed(() => {
  const configs = {
    login: {
      title: 'Te damos la bienvenida',
      subtitle: 'Completá los datos para ingresar a tu cuenta.'
    },
    registro: {
      title: 'Completá tus datos',
      subtitle: 'ingresá los datos para registrarte en la plataforma.'
    },
    blanqueo: {
      title: 'Recuperar contraseña',
      subtitle: 'Ingresa tu email para recuperar tu contraseña.'
    }
  };
  
  return configs[currentComponentType.value] || configs.login;
});

const currentTitle = computed(() => contentConfig.value.title);
const currentSubtitle = computed(() => contentConfig.value.subtitle);
const currentComponentProps = ref({});

// Handle different submission types
const handleSubmit = async (formData) => {
  const handlers = {
    login: async (data) => {
      await loginAjax(data);
      router.push('/dashboard');
    },
    registro: async (data) => {
      await registerAjax(data);
      router.push('/login');
    },
    blanqueo: async (data) => {
      await resetPasswordAjax(data);
      router.push('/login');
    }
  };

  const handler = handlers[currentComponentType.value];
  if (handler) {
    // Don't use try-catch here, let the error bubble up to the child component
    return await handler(formData);
  }
};

const handleForgotPassword = () => {
  router.push('/reset-password');
};

const handleComponentSwitch = (newComponentType, data = {}) => {
  currentComponentProps.value = data;
  
  const routeMap = {
    login: '/login',
    registro: '/register',
    blanqueo: '/reset-password'
  };
  
  const targetRoute = routeMap[newComponentType];
  if (targetRoute && targetRoute !== route.path) {
    router.push(targetRoute);
  }
};

// Watch for route changes
watch(() => route.path, () => {
  currentComponentProps.value = {};
}, { immediate: true });
</script>