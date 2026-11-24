# Running Splittr

## Prerequisites

Before running the project, ensure you have the following installed:

- Node.js
- npm
- Expo account
- EAS CLI

Install EAS CLI globally:

```bash
npm install -g eas-cli
```

---

## Clone the Repository

```bash
git clone https://github.com/BethDrum/Splittr.git
cd Splittr
```

---

## Install Dependencies

```bash
npm install
```

---

## Log in to Expo

```bash
eas login
```

---

## Configure EAS

If EAS has not been configured for the project:

```bash
eas build:configure
```

---

## Create a Development Build for android

### Android

```bash
eas build --platform android --profile development
```

Once the build is complete, follow the Expo link provided in the terminal to install the development build on your device.

---

## Start the Development Server

After installing the development build:

```bash
npx expo start --dev-client
```

Open the installed development build and connect to the Metro server.

---

## Create a Production Build

### Android

```bash
eas build --platform android --profile production
```

Builds can be downloaded and distributed through the Expo dashboard or submitted directly to app stores.

---

## Useful Commands

View build history:

```bash
eas build:list
```

Monitor the latest build:

```bash
eas build:view
```

Submit a store-ready build:

```bash
eas submit --platform android
```

```bash
eas submit --platform ios
```
