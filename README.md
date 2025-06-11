# Todo List App

Aplicación de lista de tareas desarrollada con Angular y Cordova

## Requisitos Previos

- Node.js (v14 o superior)
- npm (v6 o superior)
- Android Studio y SDK (para desarrollo Android)
- Xcode (para desarrollo iOS, solo en macOS)
- Ionic CLI: `npm install -g @ionic/cli`
- Cordova: `npm install -g cordova`

## Instalación y Configuración Mobile

1. Instalar Cordova globalmente:

```bash
npm install -g cordova
```

2. Crear proyecto Cordova:

```bash
cordova create mobile com.todo.app TodoApp
```

3. Añadir plataforma Android:

```bash
cd mobile
cordova platform add android
```

## Compilación y Despliegue

1. Construir la aplicación Angular:

```bash
ng build --configuration=production
```

2. Compilar para Android:

```bash
cd mobile
cordova build android
```

3. Ejecutar en dispositivo/emulador:

```bash
cordova run android
```

4. Limpiar build de Android:

```bash
cordova clean android
```

## Comandos Útiles

```bash
# Ver dispositivos conectados
adb devices

# Construir en modo debug
cordova build android --debug

# Construir para producción
cordova build android --release
```

## Requisitos del Sistema

### Android

- Android Studio
- JDK 8 o superior
- Android SDK
- Gradle

### iOS

- macOS
- Xcode 12 o superior
- iOS Developer Account (para despliegue)
