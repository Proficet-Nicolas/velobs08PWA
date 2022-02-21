var app = {
    // Error with loading map multiple time
    mapIsLoaded: false,

    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    bindEvents: function() {
        // Here we register our callbacks for the lifecycle events we care about
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('pause', this.onPause, false);
        document.addEventListener('resume', this.onResume, false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        // Provides access to the device's audio, image, and video capture capabilities
        //console.log(navigator.device.capture);

        // Run the first page
        this.firstPage();
    },
    firstPage: function(){
        var configIsSetup = window.localStorage.getItem("LSsetup");

        if(configIsSetup){
            configUpdate(configIsSetup);

            $('#newOBS').show();
            this.router("_home");
        } else {
            $('#newOBS').hide();
            this.router("_config");
        }
    },
    router: function(page){
        if(page === "_1map"){
            $('.slide').hide();
            $('.slide'+page).show();

            if(this.mapIsLoaded){
                $( "div.infos" ).fadeIn( 300 ).delay( 2500 ).fadeOut( 400 );
            } else {
                navigator.geolocation.getCurrentPosition(onSuccess, onError);
                $( "div.infos" ).fadeIn( 300 ).delay( 2500 ).fadeOut( 400 );

                this.mapIsLoaded = true;
            }
        } else {
            $('.slide').hide();
            $('.slide'+page).show();
        }
    }
};
 
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker
        .register("sw.js")
        .then(() => console.log("sw registered"))
        .catch((err) => console.log(err))
    }

app.initialize();
app.dispatchEvent("deviceready");