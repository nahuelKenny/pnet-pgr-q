# PNET Frontend - Changelog

## V1.0 Alpha

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