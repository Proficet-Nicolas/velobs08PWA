navigator.geolocation.getCurrentPosition(function(position) {
    faireQqc(position.coords.latitude, position.coords.longitude);
  });

  var watchID = navigator.geolocation.watchPosition(function(position) {
    faireQqc(position.coords.latitude, position.coords.longitude);
  });

  navigator.geolocation.clearWatch(watchID);

  function geo_success(position) {
    do_something(position.coords.latitude, position.coords.longitude);
  }
  
  function geo_error() {
    alert("Sorry, no position available.");
  }
  
  var geo_options = {
    enableHighAccuracy: true,
    maximumAge        : 30000,
    timeout           : 27000
  };
  
  var wpid = navigator.geolocation.watchPosition(geo_success, geo_error, geo_options);

  function errorCallback(error) {
    alert('ERROR(' + error.code + '): ' + error.message);
  };
  
  function prompt(window, pref, message, callback) {
    let branch = Components.classes["@mozilla.org/preferences-service;1"]
                           .getService(Components.interfaces.nsIPrefBranch);

    if (branch.getPrefType(pref) === branch.PREF_STRING) {
        switch (branch.getCharPref(pref)) {
        case "always":
            return callback(true);
        case "never":
            return callback(false);
        }
    }

    let done = false;

    function remember(value, result) {
        return function() {
            done = true;
            branch.setCharPref(pref, value);
            callback(result);
        }
    }

    let self = window.PopupNotifications.show(
        window.gBrowser.selectedBrowser,
        "geolocation",
        message,
        "geo-notification-icon",
        {
            label: "Share Location",
            accessKey: "S",
            callback: function(notification) {
                done = true;
                callback(true);
            }
        }, [
            {
                label: "Always Share",
                accessKey: "A",
                callback: remember("always", true)
            },
            {
                label: "Never Share",
                accessKey: "N",
                callback: remember("never", false)
            }
        ], {
            eventCallback: function(event) {
                if (event === "dismissed") {
                    if (!done) callback(false);
                    done = true;
                    window.PopupNotifications.remove(self);
                }
            },
            persistWhileVisible: true
        });
}

prompt(window,
       "extensions.foo-addon.allowGeolocation",
       "Foo Add-on wants to know your location.",
       function callback(allowed) { alert(allowed); });


function configUpdate(haveLocalStorageSetup) {
    if(haveLocalStorageSetup){
        document.getElementById('input_mail').value = window.localStorage.getItem("LSmail");

        var chosenServer = window.localStorage.getItem("LSserver");

        if(chosenServer === "https://velobs08.ouvaton.org/"){
            document.getElementById('prodServer').checked = true;
        } else if (chosenServer === "https://egnom.pro/VELOBS08/"){
            document.getElementById('devServer').checked = true;
        } else {
            document.getElementById('customServer').value = chosenServer;
        }

        getSubCategory(chosenServer);
    } else {
        var inputMail = $('#input_mail').val();

        //email test
        if (/\S+@\S+\.\S+/.test(inputMail)) {
            //URL test
            if (document.getElementById('prodServer').checked) {
                configURL = document.getElementById('prodServer').value;
    
                window.localStorage.setItem("LSmail", inputMail);
                window.localStorage.setItem("LSserver", configURL);
                window.localStorage.setItem("LSsetup", true);
                getSubCategory(configURL);
                $('#newOBS').show();
                app.router("_home");
                
            } else if (document.getElementById('devServer').checked) {
                configURL = document.getElementById('devServer').value;
    
                window.localStorage.setItem("LSmail", inputMail);
                window.localStorage.setItem("LSserver", configURL);
                window.localStorage.setItem("LSsetup", true);
                getSubCategory(configURL);
                $('#newOBS').show();
                app.router("_home");
    
            } else {
                if(document.getElementById('customServer').value !== ""){
                    configURL = document.getElementById('customServer').value;
    
                    window.localStorage.setItem("LSmail", inputMail);
                    window.localStorage.setItem("LSserver", configURL);
                    window.localStorage.setItem("LSsetup", true);
                    getSubCategory(configURL);
                    $('#newOBS').show();
                    app.router("_home");
                } else {
                    //alert("URL non valide");
                    navigator.notification.alert("URL non valide");
                }
            }
        } else {
            $('#newOBS').hide();
            //alert("Adresse email non valide");
            navigator.notification.alert("Adresse email non valide");
        }
    }

}

// Sous catégories
function getSubCategory(URL) {
    var xhr = new XMLHttpRequest();

    xhr.onload = function(){
        if (xhr.status >= 200 && xhr.status < 300) {
            //console.log('success!', xhr);

            //Delete previous subcategory may already added
            document.getElementById('obs').innerHTML = "";

            var sub = xhr.response;
            sub = sub.substring(1,sub.length);
            sub = sub.substring(0,sub.length - 1);
            sub = JSON.parse(sub);

            var i = sub["subcategory"].length;
            for (var a = 0; a < i;a++){
                document.getElementById('obs').innerHTML += '<option value="' + sub["subcategory"][a]["id_subcategory"] + '">' + sub["subcategory"][a]["lib_subcategory"] + '</option>' ;
            };
        } else {
            //console.log('The request failed!');
            //alert("La demande a échoué");
            navigator.notification.alert("La demande a échoué");
            
            
        };
        //console.log('This always runs...');
    };
    xhr.open('GET', URL + 'lib/php/public/getSubCategory.php');
    xhr.send();
};

//  Photo to show from selected file
function readURL(input) {
	if (input.files && input.files[0]) {
			var reader = new FileReader();

			reader.onload = function (e) {
					$('#showSelectedImage')
                            .attr('src', e.target.result)
                            .show()
                    ;
			};

			reader.readAsDataURL(input.files[0]);
	}
}

// Form to generate and to send 
function sendForm(){
    var formElement = new FormData();

    var chosenServer = window.localStorage.getItem("LSserver");

    // Waiting from the server but not in the APP
    formElement.append("task", "CREATEPUBLICPOI");
    //formElement.append("num_poi", document.getElementsByName("num_poi")[0].value);
    //formElement.append("tel_poi", document.getElementsByName("tel_poi")[0].value);
    //formElement.append("adherent_poi", document.getElementsByName("adherent_poi")[0].value);

    formElement.append("mail_poi", $('#input_mail').val());
    formElement.append("rue_poi", $('#Rue').val());
    formElement.append("desc_poi", $('#Description').val());
    formElement.append("prop_poi", $('#Proposition').val());
    formElement.append("latitude_poi", lat);
    formElement.append("longitude_poi", lng);
    formElement.append("subcategory_id_subcategory", $('#obs').val());

    // Server require $_FILE['photo-path'] even if empty, why ?
    if(document.getElementById("photoToSend").files && document.getElementById("photoToSend").files[0]){
        formElement.append("photo-path", document.getElementById("photoToSend").files[0]);
    } else {
        formElement.append("photo-path", new File([], ""));
    }

    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            //console.log('success!', xhr);
            var responseJSON = JSON.parse(xhr.responseText);
            //console.log(responseJSON);

            if(responseJSON.success === true){
                //alert(responseJSON.ok);
                navigator.notification.alert(responseJSON.ok);

                //Reset form
                location.reload();
            } else if (responseJSON.success === false){
                //alert(responseJSON.pb);
                navigator.notification.alert(responseJSON.pb);
            }
        } else {
            //console.log('The request failed!');
            //alert("La demande a échoué");
            navigator.notification.alert("La demande a échoué");
        }
        //console.log('This always runs...');
    };
    xhr.open("POST", chosenServer + "lib/php/admin/database.php");
    xhr.send(formElement);
}