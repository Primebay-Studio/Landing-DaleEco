//Swall global method to print and process json objects
function alerto(texto, recargar){
  //### Dissable all warnings swall alerts in the site
  var alertas_opcionales = true;
  if(recargar==true)
  {
    swal({
      title: "Registro exitoso",   
      text: texto,   
      type: "success",   
      showCancelButton: false,   
      confirmButtonColor: "#DD6B55",   
      confirmButtonText: "Cerrar",  
      closeOnConfirm: true,   
      closeOnCancel: true}, 
    function(isConfirm)
    {   
      if (isConfirm) 
      {    
        window.location.reload(); 
      } else {     
        //swal("Cancelled", "", "error");   
      } 
    });
  }else if(recargar==false){
    if(alertas_opcionales == true)
    {
      swal("Atencion!", texto, "warning");
      
      //Debug Output
      //alert(texto);
    }
  }
}


//Register Ajax 
// have to pass a form string name and a callback function able to load a json as response ej:end
function form_valid_submit(formulario, end){
  
  $(formulario).on('submit', function(event) {
    event.preventDefault();

    //Validate Jobs
    var activ_temp =  $(".actividad input:checked").map(function(){
      return this.value;
    }).get();

    //Validate Jobs fielf: otro
    var otro = 0;
    if( $('.actividad #otro').val() != '' ) {
      otro = 1;
    }
    //Jobs count
    var active_num = Number(activ_temp.length)+Number(otro);

    //Jquery Validation Engine form pass
    if ($(formulario).validationEngine('validate') && active_num >0) {
      
      // pass var to a hidden input on form
      $("#actividades").val(String(activ_temp.join(" | ")));
      //Creates form object with all the inputs inside form
      var formData = new FormData($(formulario)[0]);
      $.ajax({            
        type: "POST",
        url: 'admin/includes/ajax.php',
        data: formData,
        cache: false,
        //validacion de adjuntos en la peticion
        xhr: function() {  // custom xhr send / if something has files or photos
            myXhr = $.ajaxSettings.xhr();
            if(myXhr.upload){ 
              // revisar que el precargador existe #loader
              $('#loader').show();
                myXhr.upload.addEventListener('progress',updateProgress, false); // for handling the progress of the upload
            }
            return myXhr;
        },
        contentType: false,
        processData: false,
        async: true,
        //### success ajax ###
        success: function(response){      
          end(JSON.parse(response), formulario);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert("Error"+XMLHttpRequest+" "+textStatus+" "+errorThrown);
        }
        
      });
    //Jquery validation engine error 
    }else{
      //Validate number of jobs selected and return an alert with diferent copy
      if(active_num > 0){
        texto_out = "No haz llenado correctamente todos los campos";
      }else{
        texto_out = "No haz llenado correctamente todos los campos, \n Porfavor indica almenos uno de tus oficios o actividades";
      }
      alerto(texto_out,false);
    }
    return false;
  });
}


$(function(){
  //Jobs checkboxes validation  (onchange event)
  $('.actividad input').on('change', function (e) {
    var check = Number($('.actividad input[type=checkbox]:checked').length);
    var otro = 0;
    if( $('.actividad #otro').val() != '' ) {
      var otro = 1;
    }
		if (Number(check + otro) > 3) {
      $(this).prop('checked', false);
      //Out
      alerto("Solo se permiten 3",false);
    }
    //hide or show #otro if checkboxes are more or less than 2 to only left 3 possible choices
    if (Number(check) > 2 && otro == 0) {
      $('.actividad #otro').hide();
		}else{
      $('.actividad #otro').show();
    }
  });

 //### JSON State validation (onchange) ###
  $(".departamento").on('change', function(event) {
    event.preventDefault();
    var i = this.selectedIndex - 1;
    var ciudades = window.colombia[i]['ciudades'];
    $(".ciudad").children().each(function(index, el) {
      $(this).remove();
    });
    var html = "";
    html += "<option>Seleccione</option>";
    //Out
    for (var i = 0; i < ciudades.length; i++) {
      html += "<option value='"+ciudades[i]+"'>"+ciudades[i]+"</option>";
    }
    $(".ciudad").append(html);
  });

  //### Call back INIT  ###
  function end(e){
      if(e != "")
      {
        //### Debug output ###
        //alerto(e.salida_texto,true);

        //### Success ###
        window.location.href = 'success.php';
        //alerto("Bienvenido, ahora haces parte de la comunidad fixperto.",true);  
      }else{
        alerto("no data",false);
      }
  }

  //### INIT form ###
  form_valid_submit(String("#regForm"),end);

}); 



//Metodo de captura del progreso de subida de adjuntos
function updateProgress(evt) {
  if (evt.lengthComputable) {
    var percentComplete = Math.round((evt.loaded / evt.total)*100);
    console.log(percentComplete);
    if(percentComplete == 100){
      $('#loader').hide();
    }
  } else {
    // Unable to compute progress information since the total size is unknown
    console.log('No es posible completar');
  }
}


var currentTab = 0; // Current tab is set to be the first tab (0)
showTab(currentTab); // Display the current tab

function showTab(n) {
  // This function will display the specified tab of the form...
  var x = document.getElementsByClassName("tab");
  x[n].style.display = "block";
  //... and fix the Previous/Next buttons:
  if (n == 0) {
    document.getElementById("prevBtn").style.display = "none";
  } else {
    document.getElementById("prevBtn").style.display = "inline";
  }
  if (n == (x.length - 1)) {
    document.getElementById("nextBtn").innerHTML = "Registrarme";
  } else {
    document.getElementById("nextBtn").innerHTML = "Siguiente";
  }
  //... and run a function that will display the correct step indicator:
  fixStepIndicator(n)
}

function nextPrev(n) {
  // This function will figure out which tab to display
  var x = document.getElementsByClassName("tab");
  // Exit the function if any field in the current tab is invalid:
  if (n == 1 && !validateForm()) return false;
  // Hide the current tab:
  x[currentTab].style.display = "none";
  // Increase or decrease the current tab by 1:
  currentTab = currentTab + n;
  // if you have reached the end of the form...
  if (currentTab >= x.length) {
    // ... the form gets submitted:
    //document.getElementById("regForm").submit();
    return false;
  }
  // Otherwise, display the correct tab:
  showTab(currentTab);
}

//validacion de email valido
function ValidateEmail(email) 
{
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

function validateForm() {
  // This function deals with validation of the form fields
  var x, y, i, valid = true;
  x = document.getElementsByClassName("tab");
  y = x[currentTab].getElementsByClassName("validar");
  z = x[currentTab].getElementsByClassName("pregunta");
  // A loop that checks every input field in the current tab:
  for (i = 0; i < y.length; i++) {
    // If a field is empty...
    valor = String(y[i].value);
    //validamos emails
    if (currentTab == 1) {
      if (!ValidateEmail(valor)) {
        // add an "invalid" class to the field:
        y[i].className += " invalid";
        z[i].className += " invalid";
        // and set the current valid status to false
        valid = false;
      }else{
        y[i].classList.remove("invalid");
        
      }
    }else{
      //validamos largo mayor a 3
      if (valor.length < 3) {
        // add an "invalid" class to the field:
        y[i].className += " invalid";
        z[i].className += " invalid";
        // and set the current valid status to false
        valid = false;
      }else{
        y[i].classList.remove("invalid");
      }
    }
  }
  console.log("valido");
  // If the valid status is true, mark the step as finished and valid:
  if (valid) {
    document.getElementsByClassName("step")[currentTab].className += " finish";
  }
  return valid; // return the valid status
}

function fixStepIndicator(n) {
  // This function removes the "active" class of all steps...
  var i, x = document.getElementsByClassName("step");
  for (i = 0; i < x.length; i++) {
    x[i].className = x[i].className.replace(" active", "");
  }
  //... and adds the "active" class on the current step:
  x[n].className += " active";
  /* push state en el historial */
  window.history.pushState(null, null, '/index.php?paso='+Number(Number(n)+1));
}
/* metodo para captura de variables de URL en arreglo */
function getSearchParams(k){
  var p={};
  location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi,function(s,k,v){p[k]=v})
  return k?p[k]:p;
}
/* Validacion de historial */
$(window).on("popstate", function(e) {
  var paso = Number(getSearchParams("paso"));
  fixStepIndicator(paso);
});