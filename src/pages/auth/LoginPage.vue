<template>
  <LoginBaseComp
    :title="currentTitle"
    :subtitle="currentSubtitle"
    :component-type="currentComponentType"
    :component-props="currentComponentProps"
    :on-submit="handleSubmit"
    :show-title-section="showTitleSection"
    @forgot-password="handleForgotPassword"
    @component-switch="handleComponentSwitch"
    @toggle-title="handleToggleTitle"
  />
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "src/stores/auth";
import LoginBaseComp from "src/components/auth/LoginBaseComp.vue";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

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
      title: 'Crear cuenta',
      subtitle: 'Completa los datos para crear tu cuenta.'
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
const currentComponentProps = computed(() => ({
  isLoading: authStore.isLoading
}));

const showTitleSection = ref(true);

const handleSubmit = async (formData) => {
  try {
    const handlers = {
      login: async (data) => {
        await authStore.login(data);
        router.push('/dashboard');
      },
      registro: async (data) => {
        // Handle stepper data structure
        if (data.step === 1) {
          await authStore.register(data.data);
          return;
        }
        await authStore.register(data);
        router.push('/login');
      },
      blanqueo: async (data) => {
        await authStore.resetPassword(data);
        // Don't redirect here, let the component handle the success/error view
      }
    };

    const handler = handlers[currentComponentType.value];
    if (handler) {
      return await handler(formData);
    }
  } catch (error) {
    // Error is already handled in the store
    console.error('Auth operation failed:', error);
  }
};

const handleForgotPassword = () => {
  router.push('/reset-password');
};

const handleComponentSwitch = (newComponentType) => {
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

// Handle title section toggle from child components
const handleToggleTitle = (shouldShow) => {
  showTitleSection.value = shouldShow;
};

// Watch for route changes
watch(() => route.path, () => {
  showTitleSection.value = true; // Reset title visibility on route change
  authStore.clearError(); // Clear any previous errors
}, { immediate: true });

// Hide title for registro (stepper) component
watch(currentComponentType, (newType) => {
  if (newType === 'registro') {
    showTitleSection.value = false;
  } else {
    showTitleSection.value = true;
  }
});

// Initialize auth on component mount
authStore.initializeAuth();
</script>