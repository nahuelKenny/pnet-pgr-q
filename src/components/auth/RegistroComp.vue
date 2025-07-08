<template>
  <div>
    <q-stepper
      v-model="step"
      ref="stepper"
      color="primary"
      animated
      flat
      bordered
      alternative-labels
      class="registro-stepper"
      header-nav
    >
      <!-- Step 1: Tus Datos -->
      <q-step
        :name="1"
        title="Tus Datos"
        icon="person"
        :done="step > 1"
        :header-nav="step > 1"
      >
        <q-form @submit.prevent="submitStep1" ref="step1Form" class="q-gutter-md">
          <q-input
            outlined
            dense
            v-model="formData.email"
            label="Email *"
            type="email"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Email es requerido',
              (val) => /.+@.+\..+/.test(val) || 'Email inválido'
            ]"
            autocomplete="email"
            :hide-bottom-space="true"
          />

          <q-input
            outlined
            dense
            clearable
            v-model="formData.nombre"
            label="Nombre *"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Nombre es requerido',
              (val) => val.length >= 2 || 'Nombre debe tener al menos 2 caracteres'
            ]"
            autocomplete="given-name"
            :hide-bottom-space="true"
          />

          <q-input
            outlined
            dense
            clearable
            v-model="formData.apellido"
            label="Apellido *"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Apellido es requerido',
              (val) => val.length >= 2 || 'Apellido debe tener al menos 2 caracteres'
            ]"
            autocomplete="family-name"
            :hide-bottom-space="true"
          />

          <q-select
            outlined
            dense
            v-model="formData.sector"
            :options="sectorOptions"
            label="Sector *"
            lazy-rules
            :rules="[
              (val) => val !== null && val !== '' || 'Sector es requerido'
            ]"
            map-options
            emit-value
            :hide-bottom-space="true"
          />

          <!-- Validation error message -->
          <div class="validation-container">
            <transition
              enter-active-class="animated slideInDown"
              leave-active-class="animated slideOutUp"
              appear
            >
              <div v-if="showValidationError" class="validation-error-message q-mt-md">
                <q-icon name="error" color="negative" size="sm" class="q-mr-xs" />
                <span>{{ validationMessage }}</span>
              </div>
            </transition>
          </div>

          <!-- Show error from store -->
          <div v-if="props.error && !props.isLoading" class="validation-error-message q-mt-md">
            <q-icon name="error" color="negative" size="sm" class="q-mr-xs" />
            <span>{{ props.error }}</span>
          </div>

          <q-stepper-navigation>
            <q-btn
              type="submit"
              color="primary"
              :label="props.isLoading ? 'Procesando...' : 'Siguiente'"
              :loading="props.isLoading"
              :disable="!isStep1Valid || props.isLoading"
              class="full-width btnRegistro"
            />
          </q-stepper-navigation>
        </q-form>
      </q-step>

      <!-- Step 2: Contraseña -->
      <q-step
        :name="2"
        title="Contraseña"
        icon="password"
        :done="step > 2"
        :header-nav="step > 2"
      >
        <div v-if="showTitleSection" class="justify-left text-left items-left title-container" :key="`${title}-${subtitle}`">
            <h5 class="logiTitle">{{ registerTitles.title }}</h5>
            <p class="subtitle-text">{{ registerTitles.subtitle }}</p>
        </div>
          <q-input
            outlined
            dense
            v-model="verificationCode"
            label="Contraseña"
            type="password"
            class="q-mt-md"
          />

        <q-stepper-navigation>
          <q-btn
            flat
            color="primary"
            @click="step = 1"
            label="Anterior"
            class="q-mr-sm"
            :disable="props.isLoading"
          />
          <q-btn
            color="primary"
            @click="submitStep2"
            :label="props.isLoading ? 'Verificando...' : 'Verificar'"
            :loading="props.isLoading"
            :disable="!verificationCode || verificationCode.length < 6 || props.isLoading"
          />
        </q-stepper-navigation>
      </q-step>

      <!-- Step 3: Activación -->
      <q-step
        :name="3"
        title="Activación"
        icon="done"
      >
        <div class="text-center q-pa-lg">
          <q-icon name="check_circle" size="4rem" color="positive" />
          <h6>¡Registro Completado!</h6>
          <p>Tu cuenta ha sido creada exitosamente.</p>
        </div>

        <q-stepper-navigation>
          <q-btn
            flat
            color="primary"
            @click="step = 2"
            label="Anterior"
            class="q-mr-sm"
            :disable="props.isLoading"
          />
          <q-btn
            color="primary"
            @click="goToLogin"
            label="Ir al Login"
            :disable="props.isLoading"
          />
        </q-stepper-navigation>
      </q-step>
    </q-stepper>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  isLoading: { type: Boolean, default: false },
  error: { type: String, default: null }
});

const emit = defineEmits(['submit', 'switch-component']);

// Stepper state
const step = ref(1);
const stepper = ref(null);
const step1Form = ref(null);

// Form data
const formData = ref({
  email: '',
  nombre: '',
  apellido: '',
  sector: null
});

const registerTitles = ref({
    title: 'Creá tu contraseña',
    subtitle: 'Seguí los requisitos para crearla'
})
// Additional step data
const verificationCode = ref('');

// Loading and validation states
const showValidationError = ref(false);
const validationMessage = ref('');
const submissionAttempted = ref(false);

// Sector options
const sectorOptions = [
  { label: 'Tecnología', value: 'tecnologia' },
  { label: 'Recursos Humanos', value: 'rrhh' },
  { label: 'Marketing', value: 'marketing' },
  { label: 'Ventas', value: 'ventas' },
  { label: 'Finanzas', value: 'finanzas' },
  { label: 'Operaciones', value: 'operaciones' },
  { label: 'Legal', value: 'legal' },
  { label: 'Administración', value: 'administracion' }
];

// Computed validation for step 1
const isStep1Valid = computed(() => {
  return formData.value.email &&
         formData.value.nombre &&
         formData.value.apellido &&
         formData.value.sector &&
         /.+@.+\..+/.test(formData.value.email) &&
         formData.value.nombre.length >= 2 &&
         formData.value.apellido.length >= 2;
});

// Watch for loading state changes to handle step progression
watch([() => props.isLoading, () => props.error], ([newLoading, newError]) => {
  // If we attempted submission and loading just finished
  if (submissionAttempted.value && !newLoading) {
    if (!newError) {
      // Success - move to next step
      if (step.value === 1) {
        step.value = 2;
      } else if (step.value === 2) {
        step.value = 3;
      }
    }
    // Error is handled by the error display in template
    submissionAttempted.value = false;
  }
});

// Submit step 1
const submitStep1 = async () => {
  const isValid = await step1Form.value.validate();
  
  if (!isValid) {
    showValidationError.value = true;
    validationMessage.value = 'Por favor completa todos los campos requeridos correctamente.';
    return;
  }
  
  showValidationError.value = false;
  submissionAttempted.value = true;
  
  // Emit to parent to handle API call through store
  // The watcher will handle step progression after the store operation completes
  emit('submit', {
    step: 1,
    data: formData.value
  });
};

// Submit step 2 (verification)
const submitStep2 = async () => {
  if (!verificationCode.value || verificationCode.value.length < 6) {
    return;
  }
  
  submissionAttempted.value = true;
  
  // Emit verification data
  emit('submit', {
    step: 2,
    data: {
      ...formData.value,
      verificationCode: verificationCode.value
    }
  });
};

const goToLogin = () => {
  emit('switch-component', 'login');
};
</script>

<style scoped>
.registro-stepper {
  box-shadow: none;
  border: none;
}

/* Mover texto del stepper debajo del ícono */
.registro-stepper :deep(.q-stepper__step-inner) {
  flex-direction: column;
  text-align: center;
}

.registro-stepper :deep(.q-stepper__step-content) {
  margin-top: 8px;
  margin-left: 0;
}

.registro-stepper :deep(.q-stepper__title) {
  margin-top: 8px;
  font-size: 12px;
  line-height: 1.2;
}

.btnRegistro {
  min-width: 200px;
  max-width: 100%;
  padding: 10px;
  font-size: 16px;
  background-color: #50504E;
}

.validation-container {
  transition: all 0.3s ease-in-out;
  overflow: hidden;
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
  margin: 0;
}

h6 {
  font-size: 18px;
  font-weight: 600;
  color: #50504E;
  margin: 16px 0 8px 0;
}

p {
  color: #666;
  margin-bottom: 8px;
}

/* Mobile adjustments */
@media (max-width: 767px) {
  .registro-stepper {
    margin: 0 -16px;
  }
  
  .q-stepper__step-content {
    padding: 16px;
  }
  
  .registro-stepper :deep(.q-stepper__title) {
    font-size: 11px;
  }
  
  .btnRegistro {
    min-width: 100%;
  }
}
</style>