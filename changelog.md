# PNET Frontend - Changelog

## V1.1 Beta - *7/72025*

### Estado de Autenticación con Pinia

#### Implementación del Store
- **Centralización**: Estado global de autenticación unificado
- **Persistencia**: Token JWT almacenado en localStorage automáticamente
- **Reactividad**: Actualizaciones automáticas en todos los componentes
- **Error Handling**: Manejo centralizado de errores con mensajes user-friendly

#### Estructura del Store (auth.js)
```javascript
state: {
  isLoading: false,    // Estado global de loading
  user: null,          // Datos del usuario autenticado
  token: null,         // JWT token
  error: null          // Mensaje de error actual
}

getters: {
  isAuthenticated,     // Verificación de autenticación
  getLoadingState     // Estado de loading actual
}

actions: {
  login(),            // Autenticación de usuario
  register(),         // Registro de nuevo usuario
  resetPassword(),    // Recuperación de contraseña
  logout(),           // Cierre de sesión
  initializeAuth()    // Inicialización desde localStorage
}
```

#### Loading States Implementados
- **LoginComp**: Botón muestra "Ingresando..." durante proceso
- **RegistroComp**: Stepper con estados "Procesando..." y "Verificando..."
- **BlanqueoComp**: Estados para envío de email y validación

#### Flujo de Loading Mejorado
```
Click Submit → Store.setLoading(true) → 3s Delay → API Call → Store.setLoading(false)
     ↓              ↓                     ↓           ↓              ↓
  Button        Loading Spinner      User Sees     Real API    Button Normal
  Disable       + Loading Text       Progress      Response    + Results
```

#### Animaciones de Título
- **Fade + Slide**: Títulos aparecen desde la derecha con efecto suave
- **Transición**: Cambio fluido entre diferentes componentes
- **Responsivo**: Animaciones adaptadas para mobile/desktop
- **Key Binding**: Reactivo a cambios de título y subtítulo

#### API Integration Pattern
```javascript
// En el store
async login(credentials) {
  this.setLoading(true)
  this.clearError()
  
  try {
    await this.sleep(3000)  // Demo delay
    const response = await loginAjax(credentials)
    this.user = response.user
    this.token = response.token
    localStorage.setItem('auth_token', response.token)
    return response
  } catch (error) {
    this.setError(error.message)
    throw error
  } finally {
    this.setLoading(false)
  }
}
```

#### Mejoras de UX
- **Feedback Visual**: Loading spinners en todos los botones
- **Estados Deshabilitados**: Prevención de multiple submits
- **Manejo de Errores**: Mensajes claros y contextuales
- **Persistencia**: Sesión mantenida entre refreshes
- **Timeout Simulation**: 3 segundos de delay para testing UX

#### Patrones Implementados
- **State Management**: Pinia para estado centralizado
- **Loading Strategy**: Estados de carga unificados
- **Error Boundary**: Manejo robusto de errores
- **Persistence Layer**: localStorage para tokens
- **Animation System**: Transiciones fluidas entre estados

#### Beneficios Logrados
- ✅ **Consistencia**: Misma experiencia en todos los componentes
- ✅ **Performance**: Estado reactivo optimizado
- ✅ **Debugging**: DevTools integration para desarrollo
- ✅ **Escalabilidad**: Fácil agregar nuevos flujos de auth
- ✅ **Mantenibilidad**: Código centralizado y documentado

#### Conclusión
> La implementación con Pinia proporciona una base sólida para el manejo de autenticación, con estados de loading fluidos y animaciones que mejoran significativamente la experiencia del usuario.

---

## V1.0 Alpha - *24/6/2025*

### Login - Rutas

#### Rutas Específicas (Recomendadas)
- `/login` → LoginComponent
- `/register` → RegistroComponent  
- `/reset-password` → BlanqueoComponent

#### Rutas por Query (Fallback/Opcional)
- `/auth?type=login` → LoginComponent
- `/auth?type=registro` → RegistroComponent
- `/auth?type=blanqueo` → BlanqueoComponent

#### Navegación Programática
```javascript
// Rutas directas (recomendado)
router.push('/login');
router.push('/register'); 
router.push('/reset-password');

// Rutas por query (alternativo)
router.push('/auth?type=login');
router.push('/auth?type=registro');
router.push('/auth?type=blanqueo');
```

#### Características
- **SEO Friendly**: Rutas específicas más limpias y optimizadas
- **UX Mejorada**: URLs intuitivas para mejor experiencia
- **Flexibilidad**: Compatible con query parameters si APIs lo requieren
- **Escalabilidad**: Cada ruta tiene su propio flujo de autenticación
- **Navegación**: Manejo limpio del historial del navegador
- **Animaciones**: Transiciones fluidas entre componentes

### Arquitectura de Componentes

#### LoginPage.vue (Orchestrator)
- **Responsabilidad**: Manejo de rutas y estado global
- **Funciones**:
  - Detecta el tipo de componente según la ruta
  - Gestiona navegación entre flujos de autenticación
  - Maneja las respuestas de APIs (login, registro, reset)
  - Controla redirecciones post-autenticación

#### LoginBaseComp.vue (Container)
- **Responsabilidad**: Layout y estructura visual común
- **Funciones**:
  - Renderiza header con logo y títulos dinámicos
  - Proporciona el contenedor card responsivo
  - Gestiona transiciones entre componentes hijos
  - Maneja eventos de comunicación entre parent/child

#### LoginComponent.vue (Form Handler)
- **Responsabilidad**: Lógica específica del formulario de login
- **Funciones**:
  - Validación de campos usuario/contraseña
  - Toggle de visibilidad de contraseña
  - Manejo de estados de loading y errores
  - Emisión de eventos de submit al parent

#### Flujo de Datos
```
LoginPage.vue (Route Logic)
    ↓ props: componentType, onSubmit
LoginBaseComp.vue (UI Container)
    ↓ dynamic component injection
LoginComponent.vue (Form Logic)
    ↓ emit: submit, forgot-password
LoginBaseComp.vue (Event Relay)
    ↓ emit: submit, component-switch
LoginPage.vue (API Calls)
```

#### Patrones Implementados
- **Composite Pattern**: Base component + child components
- **Strategy Pattern**: Intercambio dinámico de componentes de formulario
- **Observer Pattern**: Comunicación via props/emit entre componentes
- **Template Method**: Estructura base común con implementaciones específicas

#### Conclusión
> Este enfoque proporciona máxima flexibilidad manteniendo una arquitectura limpia y excelente experiencia de usuario.