gmaps = {
    // map object
    map: null,
    
    //direction services object
    directionsService: null,
 
    //direction services object
    directionsDisplay: null,
    
    //direction services object
    stepDisplay: null,
    
    markerArray: [],
 
    // google lat lng objects
    latLngs: [],
 
    
    //layers of objects
    layers: [],
 
 
    // intialize the map
    initialize: function() {
        
        this.directionsService = new google.maps.DirectionsService();  
        var mapOptions = {
                
                center: new google.maps.LatLng(40.7711329, -73.9741874),
                //center: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
                zoom: 13,
                scaleControl: true,                
                zoomControl: true,
                mapTypeControl: false,
                panControl: false,
                rotateControl: true,
                overviewMapControl: false, 
                streetViewControl: false                    
            }        
      
        this.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
        
        var rendererOptions = {
            map: this.map
        }
        
        this.directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions)

        // Instantiate an info window to hold step text.
        this.stepDisplay = new google.maps.InfoWindow();
        
    /*                  
        if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
        var pos = new google.maps.LatLng(position.coords.latitude,
                                       position.coords.longitude);

        var infowindow = new google.maps.InfoWindow({
        map: this.map,
        position: pos,
        content: 'Location found using HTML5.'
        });

        this.map.setCenter(pos);
        }, function() {
        handleNoGeolocation(true);
        });
        }   else {
        // Browser doesn't support Geolocation
        handleNoGeolocation(false);
        }
     */
        
  
        // global flag saying we intialized already
        Session.set('map', true);
        
    },
    
    
      
        calcRoute: function() {

        // First, remove any existing markers from the map.
        for (var i = 0; i < markerArray.length; i++) {
            markerArray[i] = null;
        }

        // Now, clear the array itself.
        markerArray = [];

        // Retrieve the start and end locations and create
        // a DirectionsRequest using WALKING directions.
        var start = document.getElementById('start').onchange('value'); 
        var end = document.getElementById('end').onchange('value');
        var request = {
            origin: start,
            destination: end,
            travelMode: google.maps.TravelMode.BICYCLING
        };
            
        // Route the directions and pass the response to a
        // function to create markers for each step.
        this.directionsService.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
            var warnings = document.getElementById('warnings_panel');
            warnings.innerHTML = '<b>' + response.routes[0].warnings + '</b>';
            this.directionsDisplay.setDirections(response);
            showSteps(response);
            }
        });
        },
    
        showSteps: function(directionResult) {
        // For each step, place a marker, and add the text to the marker's
        // info window. Also attach the marker to an array so we
        // can keep track of it and remove it when calculating new
        // routes.
        var myRoute = directionResult.routes[0].legs[0];

        for (var i = 0; i < myRoute.steps.length; i++) {
            var marker = new google.maps.Marker({
                position: myRoute.steps[i].start_location,
                map: this.map
            });
            attachInstructionText(marker, myRoute.steps[i].instructions);
            markerArray[i] = marker;
        }
        },

         attachInstructionText: function(marker, text) {
            google.maps.event.addListener(marker, 'click', function() {
            // Open an info window when the marker is clicked on,
            // containing the text of the step.
            this.stepDisplay.setContent(text);
            this.stepDisplay.open(this.map, marker);
        })
        }
    
        
}
        