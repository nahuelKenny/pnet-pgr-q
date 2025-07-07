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
              (val) => (val && val.length > 0) ,
              (val) => /.+@.+\..+/.test(val)
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
              (val) => (val && val.length > 0),
              (val) => val.length >= 2
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
              (val) => (val && val.length > 0) ,
              (val) => val.length >= 2 
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
           <!--
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
          -->
          <q-stepper-navigation>
            <q-btn
              type="submit"
              color="primary"
              label="Siguiente"
              :loading="isLoading"
              :disable="!isStep1Valid || isLoading"
              class="full-width btnRegistro"
            />
          </q-stepper-navigation>
        </q-form>
      </q-step>

      <!-- Step 2: Verificación -->
      <q-step
        :name="2"
        title="Contraseña"
        icon="password"
        :done="step > 2"
        :header-nav="step > 2"
      >
        <div class="text-center q-pa-lg">
          <q-icon name="email" size="4rem" color="primary" />
          <h6>Verificación de Email</h6>
          <p>Hemos enviado un código de verificación a tu email.</p>
          
          <q-input
            outlined
            dense
            v-model="verificationCode"
            label="Código de verificación"
            mask="######"
            class="q-mt-md"
          />
        </div>

        <q-stepper-navigation>
          <q-btn
            flat
            color="primary"
            @click="step = 1"
            label="Anterior"
            class="q-mr-sm"
          />
          <q-btn
            color="primary"
            @click="step = 3"
            label="Verificar"
            :disable="!verificationCode || verificationCode.length < 6"
          />
        </q-stepper-navigation>
      </q-step>

      <!-- Step 3: Acticación -->
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
          />
          <q-btn
            color="primary"
            @click="goToLogin"
            label="Ir al Login"
          />
        </q-stepper-navigation>
      </q-step>
    </q-stepper>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

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

// Additional step data
const verificationCode = ref('');

// Loading and validation states
const isLoading = ref(false);
const showValidationError = ref(false);
const validationMessage = ref('');

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

// Submit step 1
const submitStep1 = async () => {
  const isValid = await step1Form.value.validate();
  
  if (!isValid) {
    showValidationError.value = true;
    validationMessage.value = 'Por favor completa todos los campos requeridos correctamente.';
    return;
  }
  
  showValidationError.value = false;
  isLoading.value = true;
  
  try {
    // Emit to parent to handle API call
    await emit('submit', {
      step: 1,
      data: formData.value
    });
    
    // Move to next step on success
    step.value = 2;
    showValidationError.value = false;
  } catch (error) {
    console.error('Error in step 1:', error);
    showValidationError.value = true;
    validationMessage.value = error.message || 'Error al procesar los datos. Inténtalo nuevamente.';
  } finally {
    isLoading.value = false;
  }
};

// Go to login
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
}
</style>