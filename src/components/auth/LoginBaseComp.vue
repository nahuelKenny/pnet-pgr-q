<template>
  <q-page>
    <div class="justify-center item-center">
      <q-card class="absolute-center loginCard shadow-4 animated-card">
        <q-card-section class="justify-center text-center">
          <q-img
            :src="logoPnet"
            width="190px"
            alt="Logo"
          />
          <div>
            <h5 class="loginBandaPGR">Monitoreo PGR</h5>
          </div>
          <div v-if="showTitleSection" class="justify-left text-left items-left">
            <h5 class="logiTitle">{{ title }}</h5>
            <p>{{ subtitle }}</p>
          </div>
        </q-card-section>
        
        <!-- Dynamic component with transition -->
        <transition 
          name="component-fade" 
          mode="out-in"
          appear
        >
          <component 
            :key="componentType" 
            :is="currentComponent" 
            v-bind="componentProps"
            @submit="handleSubmit" 
            @forgot-password="$emit('forgot-password')"
            @switch-component="handleComponentSwitch"
          />
        </transition>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { computed, defineAsyncComponent } from 'vue';
import logoPnet from "assets/logo-pnet.png";

const props = defineProps({
  title: { type: String, default: 'Te damos la bienvenida' },
  subtitle: { type: String, default: 'Completá los datos para ingresar a tu cuenta.' },
  componentType: { type: String, required: true },
  componentProps: { type: Object, default: () => ({}) },
  onSubmit: { type: Function, required: true },
  showTitleSection: { type: Boolean, default: true }
});

const emit = defineEmits(['forgot-password', 'component-switch']);

const components = {
  login: defineAsyncComponent(() => import('./LoginComp.vue')),
  blanqueo: defineAsyncComponent(() => import('./BlanqueoComp.vue')),
  registro: defineAsyncComponent(() => import('./RegistroComp.vue'))
};

const currentComponent = computed(() => components[props.componentType] || components.login);

const handleSubmit = async (data) => {
  await props.onSubmit(data);
};

const handleComponentSwitch = (newComponentType, data = {}) => {
  emit('component-switch', newComponentType, data);
};
</script>

<style scoped>
.loginCard {
  min-width: 400px;
  max-width: 505px;
  min-height: 300px;
  padding: 40px;
  border-radius: 10px;
}

/* Mobile breakpoint - screens smaller than 768px */
@media (max-width: 767px) {
  .loginCard {
    min-width: 100%;
    max-width: 100%;
    min-height: 100vh; /* Full height on mobile */
    margin: 0; /* Remove all margins */
    padding: 0; /* Remove all paddings */
    border-radius: 0; /* Remove rounded borders */
  }
  
  .loginCard .q-card-section {
    padding: 16px; /* Add some padding back to sections for mobile */
  }
}

/* Tablet breakpoint - screens between 768px and 1024px */
@media (min-width: 768px) and (max-width: 1024px) {
  .loginCard {
    min-width: 400px;
    max-width: 505px;
    /* Keeps original tablet/desktop sizing */
  }
}

.animated-card {
  transition: all 0.3s ease-in-out;
  transform-origin: center;
}

.validation-container {
  transition: all 0.3s ease-in-out;
  overflow: hidden;
}

.btnIngresar {
  min-width: 200px;
  max-width: 100%;
  padding: 10px;
  font-size: 16px;
  background-color: #50504E;
}

.validation-error-message {
  color: #c10015;
  font-size: 14px;
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background-color: #ffeaea;
  border: 1px solid #ffcdd2;
  border-radius: 4px;
  margin: 0 16px;
}

.loginForgotText {
  color: #50504E;
  text-decoration: none;
  cursor: pointer;
  font-weight: 600;
}

.loginForgotSection {
  padding-top: 0;
  margin-top: 0;
  text-align: left;
}

.logiTitle {
  font-size: 24px;
  font-weight: 600;
  color: #50504E;
  margin-bottom: 8px;
}

.loginBandaPGR {
  background-color: #D9D9D9;
  padding: 5px;
  color: #50504E;
  font-weight: bold;
  font-size: 18px;
  margin: 16px 0;
}

/* Component transition styles */
.component-fade-enter-active,
.component-fade-leave-active {
  transition: all 0.3s ease;
}

.component-fade-enter-from {
  opacity: 0;
  transform: translateX(10px);
}

.component-fade-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
</style>