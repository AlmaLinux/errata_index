<template>
  <div>
    <q-layout view="hHh lpr fff" style="max-height: calc(100vh - 52px); min-height: calc(100vh - 52px);">
      <q-header style="height: 52px; background-color: #082336;">
        <q-toolbar>
           <q-toolbar-title style="display: flex; align-items: center; justify-content: flex-start; padding-right: 40px">
            <img class="header-logo" src="./assets/misc/static/logo.png" alt="AlmaLinux">
            <span class="header-text" style="margin-left: 10px; color: white; display: flex; align-items: center;">AlmaLinux Errata</span>
          </q-toolbar-title>
          <q-space></q-space>
          <q-btn stretch flat label="Home" href="https://almalinux.org/" style="font-weight: bold;"></q-btn>
          <q-btn stretch flat label="Wiki" href="https://wiki.almalinux.org/" style="font-weight: bold;"></q-btn>
          <q-btn stretch flat label="Chat" href="https://chat.almalinux.org/" style="font-weight: bold;"></q-btn>
          <q-btn stretch flat label="GitHub" href="https://github.com/AlmaLinux" style="font-weight: bold; margin-right: 20px"></q-btn>
        </q-toolbar>
      </q-header>
      <q-page-container style="padding-top: initial;">
        <ErrataMainPage />
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
import ErrataMainPage from './components/ErrataMainPage.vue'
import { setCssVar } from 'quasar'
setCssVar('primary', '#082336')
export default {
  name: 'App',
  components: {
    ErrataMainPage
  }
}
</script>

<style lang="css">
#app {
  font-family: "Montserrat", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 52px;
}
.header-logo {
  height: 2.2rem;
  width: auto; 
  margin-right: 0.8rem;
}
.header-text {
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji !important;
  margin-left: 10px;
  color: white;
  font-size: 1.4rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  line-height: normal; 
}

@media (max-width: 900px) {
    .q-toolbar {
        padding-top: 0; 
        padding-bottom: 0; 
        justify-content: flex-start; 
    }
    .q-toolbar-title {
        display: flex;
        align-items: center;
        margin-right: 10px; 
    }
     .header-text {
        display: none !important; 
    }
    .q-btn {
        font-size: 0.8rem; 
        padding: 0.3rem 0.5rem; 
    }
    .q-toolbar q-btn:last-child {
        margin-right: 20px !important; 
    }
}
@media (max-width: 420px) {
    .header-logo {
        width: 80px; 
        margin-right: 5px; 
    }
    .q-btn {
        font-size: 0.6rem;
        padding: 0.3rem;
    }
    .header-text {
        display: none !important; 
    }
}
</style>
