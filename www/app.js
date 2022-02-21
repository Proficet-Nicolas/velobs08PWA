if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
};

if ("geolocation" in navigator) {
    /* la géolocalisation est disponible */
  } else {
    /* la géolocalisation n'est pas disponible */
  };
  
