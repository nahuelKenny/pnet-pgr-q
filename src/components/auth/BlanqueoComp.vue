<template>
  <div>
    <!-- Form state -->
    <div v-if="!showResult">
      <q-form @submit.prevent="handleSubmit" ref="blanqueoForm" class="q-gutter-md">
        <q-card-section>
          <q-input
            outlined
            dense
            v-model="email"
            label="Email *"
            type="email"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Email es requerido',
              (val) => /.+@.+\..+/.test(val) || 'Email inválido'
            ]"
            autocomplete="email"
            :error="showValidationError"
            :error-message="showValidationError ? '' : undefined"
          />
        </q-card-section>

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

        <q-card-actions>
          <div class="row justify-center full-width q-col-gutter-md">
            <div class="col-12">
              <q-btn
                :label="props.isLoading ? 'Enviando...' : 'Enviar enlace'"
                type="submit"
                color="primary"
                class="full-width btnBlanqueo"
                :disable="!email || props.isLoading"
                :loading="props.isLoading"
              />
            </div>
            <div class="col-12">
              <q-btn
                label="Volver al login"
                flat
                color="primary"
                class="full-width"
                @click="$emit('switch-component', 'login')"
              />
            </div>
          </div>
        </q-card-actions>
      </q-form>
    </div>

    <!-- Success state -->
    <div v-else-if="resultType === 'success'" class="text-center q-pa-lg">
      <q-icon name="check_circle" size="4rem" color="positive" />
      <h6 class="q-mt-md q-mb-sm">¡Email enviado!</h6>
      <p>Hemos enviado un enlace de recuperación a tu email.</p>
      <p class="text-caption text-grey-6">Revisa tu bandeja de entrada y spam.</p>
      
      <q-btn
        label="Volver al login"
        color="primary"
        class="q-mt-md btnBlanqueo"
        @click="$emit('switch-component', 'login')"
      />
    </div>

    <!-- Error state -->
    <div v-else-if="resultType === 'error'" class="text-center q-pa-lg">
      <q-icon name="error" size="4rem" color="negative" />
      <h6 class="q-mt-md q-mb-sm">Error al enviar</h6>
      <p>{{ errorMessage }}</p>
      
      <div class="q-mt-md">
        <q-btn
          label="Intentar nuevamente"
          color="primary"
          class="q-mr-sm btnBlanqueo"
          @click="resetForm"
        />
        <q-btn
          label="Volver al login"
          flat
          color="primary"
          @click="$emit('switch-component', 'login')"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  isLoading: { type: Boolean, default: false },
  error: { type: String, default: null }
});

const emit = defineEmits(['submit', 'switch-component', 'toggle-title']);

// Form refs
const blanqueoForm = ref(null);

// Form data
const email = ref('');

// State management
const showValidationError = ref(false);
const validationMessage = ref('');
const showResult = ref(false);
const resultType = ref(''); // 'success' or 'error'
const errorMessage = ref('');
const submissionAttempted = ref(false);

// Watch showResult to toggle title visibility
watch(showResult, (newValue) => {
  emit('toggle-title', !newValue); // Hide title when showing result
});

// Watch for loading state changes to handle success/error after submission
watch([() => props.isLoading, () => props.error], ([newLoading, newError]) => {
  // If we attempted submission and loading just finished
  if (submissionAttempted.value && !newLoading) {
    if (newError) {
      // Show error state
      showResult.value = true;
      resultType.value = 'error';
      errorMessage.value = newError;
    } else {
      // Show success state
      showResult.value = true;
      resultType.value = 'success';
    }
    submissionAttempted.value = false;
  }
});

// Submit form
const handleSubmit = async () => {
  const isValid = await blanqueoForm.value.validate();
  
  if (!isValid) {
    showValidationError.value = true;
    validationMessage.value = 'Por favor ingresa un email válido.';
    return;
  }
  
  showValidationError.value = false;
  submissionAttempted.value = true;
  
  // Emit to parent to handle resetPassword API call through store
  // The watcher will handle showing success/error after the store operation completes
  emit('submit', { email: email.value });
};

// Reset form to initial state
const resetForm = () => {
  showResult.value = false; // This will trigger the watcher to show title again
  resultType.value = '';
  errorMessage.value = '';
  showValidationError.value = false;
  validationMessage.value = '';
  submissionAttempted.value = false;
  // Keep email value so user doesn't have to type it again
};
</script>

<style scoped>
.btnBlanqueo {
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
  margin: 0 16px;
}

/* Success/Error states styling */
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

.text-caption {
  font-size: 12px;
}

/* Mobile adjustments */
@media (max-width: 767px) {
  .q-pa-lg {
    padding: 16px;
  }
  
  .btnBlanqueo {
    min-width: 100%;
  }
}
</style>