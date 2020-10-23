<template>
    <div id="main">
        <header id="header" class="d-none">
            <nav class="navbar navbar-dark bg-secondary d-flex p-0 fixed-bottom">
                <div class="container px-3 py-2">
                    <router-link to="/" class="navbar-brand align-bottom router-link-active">
                        <div class="nav-brand">
                            <span class>Werewolf</span>
                        </div>
                    </router-link>
                    <div class="m-n3 ml-n4 p-3 px-4 mr-1 text-white" type="button" @click="$router.go(-1)">
                        <i class="fas fa-lg fa-chevron-left"></i>
                    </div>
                </div>
            </nav>
        </header>
        <div class="container">
            <router-view :key="$route.path"></router-view>
        </div>
    </div>
</template>

<style lang="scss">
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

.container {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    width: 100vw;
    height: 100vh;
}
.nav-item {
    vertical-align: top;
    display: inline-block;
    text-align: center;
    padding-top: 5px;
    font-size: 20px;
    color: white;
}
.fas {
    display: inline;
}
.nav-text {
    display: block;
    font-size: 11px;
}
.navbar-toggler {
    display: none;
}

body,
.card,
.btn,
.alert-success,
.alert-danger,
.alert-info,
.btn-primary,
.btn-primary:hover,
.btn-primary:focus,
.btn-primary.focus {
    transition: background-color 8s ease, color 2s ease, border-color 8s ease !important;
    transition-delay: 0 !important;
}
.card-header,
.card-footer,
.card-text {
    transition: color 2s ease !important;
}

body.night {
    background-color: #222 !important;
    color: #fff !important;
}
.night .card {
    background-color: #444 !important;
}
.night .btn {
    color: #fff !important;
}
.night .card-header,
.night .card-footer,
.night .card-text {
    color: #fff !important;
}
.card-header,
.card-footer,
.card-text {
    color: #212529 !important;
}
.night .card .text-muted {
    color: #a5b2bd !important;
}
.night .alert-success {
    color: #aac2af !important;
    background-color: #1c3f25 !important;
    border-color: #06240d !important;
}
.night .alert-danger {
    color: #d6b7ba !important;
    background-color: #58292d !important;
    border-color: #200508 !important;
}
.night .alert-info {
    color: #a8c8ce !important;
    background-color: #193d44 !important;
    border-color: #082024 !important;
}
.night .btn-primary {
    background-color: #00438b !important;
    border-color: #003874 !important;
}
.night .btn-primary:hover {
    background-color: #004a99 !important;
    border-color: #0050a5 !important;
}
.night .btn-primary:focus,
.night .btn-primary.focus {
    background-color: #0055af !important;
    border-color: #0055b1 !important;
    box-shadow: 0 0 0 0.2rem rgba(38, 143, 255, 0.5);
}
</style>
