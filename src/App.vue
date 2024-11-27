<template>
  <div>
    <q-layout view="hHh lpr fff" style="max-height: calc(100vh - 52px); min-height: calc(100vh - 52px);">
      <q-header style="height: 52px; background-color: #082336;">
        <q-toolbar>
           <q-toolbar-title style="display: flex; align-items: center; justify-content: flex-start;">
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
  margin-left: 20px;
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
</style>
