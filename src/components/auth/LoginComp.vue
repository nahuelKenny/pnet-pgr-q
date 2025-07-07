<template>
  <div>
    <q-form @submit="onSubmit" ref="loginForm">
      <q-card-section>
        <q-input
          outlined
          dense
          v-model="userForm.userName"
          label="Email *"
          lazy-rules
          :rules="[
            (val) => (val && val.length > 0) || 'Campo requerido',
            isText,
          ]"
          autocomplete="off"
          :error="showValidationError"
          :error-message="showValidationError ? '' : undefined"
        />

        <q-input
          style="margin-top: 20px"
          outlined
          dense
          :type="showPassword ? 'text' : 'password'"
          v-model="userForm.password"
          label="Contraseña"
          lazy-rules
          :rules="[
            (val) => (val !== null && val !== '') || 'Campo requerido',
          ]"
          autocomplete="off"
          :error="showValidationError"
          :error-message="showValidationError ? '' : undefined"
        >
          <template v-slot:append>
            <q-icon
              :name="showPassword ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="togglePasswordVisibility"
            />
          </template>
        </q-input>
      </q-card-section>
      
      <!-- Validation error message with animation -->
      <div class="validation-container">
        <transition
          enter-active-class="animated slideInDown"
          leave-active-class="animated slideOutUp"
          appear
        >
          <div v-if="showValidationError" class="validation-error-message q-mt-md">
            <q-icon name="error" color="negative" size="sm" class="q-mr-xs" />
            <span>Alguno o ambos datos ingresados son incorrectos. Volvé a intentarlo para ingresar.</span>
          </div>
        </transition>
      </div>
      
      <q-card-section class="loginForgotSection">
        <span class="loginForgotText" @click="$emit('forgot-password')">
          ¿Olvidaste tu contraseña?
        </span>
      </q-card-section>
      
      <q-card-actions>
        <div class="row justify-center full-width q-col-gutter-md">
          <div class="col-12">
            <q-btn
              :label="isLoading ? 'Ingresando...' : 'Ingresar'"
              type="submit"
              color="primary"
              class="full-width btnIngresar"
              :disable="!userForm.userName || !userForm.password || isLoading"
              :loading="isLoading"
            />
          </div>
        </div>
      </q-card-actions>
    </q-form>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  // You can pass additional props from parent if needed
  initialData: { type: Object, default: () => ({}) }
});

const emit = defineEmits(['submit', 'forgot-password']);

const loginForm = ref(null);
const userForm = ref({
  userName: "",
  password: "",
  ...props.initialData
});
const showPassword = ref(false);
const showValidationError = ref(false);
const isLoading = ref(false);

const isText = (val) => {
  const userPattern = /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/;
  return (
    userPattern.test(val) ||
    "El usuario no debe contener caracteres especiales ni números"
  );
};

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const onSubmit = async () => {
  const isValid = await loginForm.value.validate();
  
  if (!isValid) {
    showValidationError.value = true;
    return;
  }
  
  showValidationError.value = false;
  isLoading.value = true;
  
  // Add 3 second delay
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  try {
    // Emit the form data to parent
    await emit('submit', {
      username: userForm.value.userName,
      password: userForm.value.password,
    });
    showValidationError.value = false;
  } catch (error) {
    console.error("Error during login:", error);
    showValidationError.value = true;
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
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
</style>