function vrPOZ(){
	 return (document.f_c.sedeActiva.value.indexOf("POZ") >= 0);
}

function vrLCM(){
	 return (document.f_c.sedeActiva.value.indexOf("CCS") >= 0);
}

function depositoRepetido(i, depo) {
	repetido = false;
	for(j=0;j < depo.length; j++){
		if (j!=i){
			repetido = repetido || (depo[i].value == depo[j].value);
		}
		if (repetido){
			depo[j].style.backgroundColor="#CCFFFF";
			break;
		}
	}
	return repetido;

}

function validar_dep(fd){
    var todo_ok = true;
	hayMontoMalo = false;
	hayDepoMalo  = false;
	hayRepetidos  = false;
	hayFechaMala  = false;
	hayHoraMala  = false;

    with (fd){
        for(i=0;i < m_dep.length;i++){
            depmalo = (p_dep[i].value.length < 8) && (p_dep[i].value.length > 0);
            depmalo = depmalo || (p_dep[i].value.length == 0) && (m_dep[i].value.length > 0);
            montomalo = (p_dep[i].value.length > 0 ) && (parseFloat("0"+m_dep[i].value) == 0);
			
			fechamala = (p_dep[i].value.length > 0 ) && (f_dep[i].value.length == 0);// valida fecha no vacia
			
			//alert(f_dep[i].value);
			
			horamala = (p_dep[i].value.length > 0 ) && ((h_dep[i].selectedIndex == 0) || (i_dep[i].selectedIndex == 0));// valida hora no vacia

			if (!p_dep[i].value.length == 0) {
				hayRepetidos = hayRepetidos || depositoRepetido(i,p_dep);
			}
			if (hayRepetidos) {
					todo_ok = false;
					break;
			}
			
            if (depmalo || montomalo || fechamala || horamala) {
                todo_ok=false;
				depmalo = depmalo || hayRepetidos;
                if (depmalo) {
					hayDepoMalo = hayDepoMalo || depmalo ;
					p_dep[i].style.backgroundColor="#CCFFFF";
				}
                if (montomalo) {
					hayMontoMalo = hayMontoMalo || montomalo ;
					m_dep[i].style.backgroundColor="#CCFFFF";
                }                
				if (fechamala) {
					hayFechaMala = hayFechaMala || fechamala ;
					f_dep[i].style.backgroundColor="#CCFFFF";
                }
				if (horamala) {
					hayHoraMala = hayHoraMala || horamala ;
					h_dep[i].style.backgroundColor="#CCFFFF";
					i_dep[i].style.backgroundColor="#CCFFFF";
                }
            }
            else if ((parseFloat("0"+m_dep[i].value) != 0)){
                p_dep[i].style.backgroundColor="#FFFFFF";
            }

			if(f_dep[i].value.length != 0){
				f_dep[i].style.backgroundColor="#EFEFEF";
			}

			if((h_dep[i].selectedIndex != 0) && (i_dep[i].selectedIndex != 0)){
				h_dep[i].style.backgroundColor="#FFFFFF";
				i_dep[i].style.backgroundColor="#FFFFFF";
			}
        }

    }

    if (!todo_ok) {
		errMsg  = "Existen errores en los datos de los dep�sitos:\n";
		if (hayRepetidos){
			errMsg += "- Las planillas no pueden repetirse.\n";
		}
		if (hayDepoMalo){
			errMsg += "- El numero de la planilla deben tener OCHO digitos.\n";
		}
		if (hayFechaMala) {
			errMsg += "- Debe seleccionar la fecha en que fue procesada la planilla de deposito.\n";
		}
		if (hayHoraMala) {
			errMsg += "- Debe seleccionar la hora en que fue procesada la planilla de deposito.\n";
		}
		if (hayMontoMalo) {
			errMsg += "- El monto de la planilla no puede ser CERO.\n";
		}
		
		errMsg += "Por favor corrija los campos marcados en azul claro.";
		alert(errMsg);
	}
    return (todo_ok);
}

function monto_exacto(ft,fd){
    exacto = (parseInt("0"+ft.t_monto.value,10) <= parseInt("0"+fd.t_dep.value,10));
    if (!exacto) {
		alert ("Disculpa, el monto total del dep�sito\n ES MENOR que el monto requerido!");
		return exacto;
	}
	exacto = (ft.t_mat.value > 0);
    if (!exacto) alert ("Disculpa, debes elegir al menos una asignatura");
    return exacto;
}

function actualizar_total_dep(fc) {
    var tdep = 0;
    with (fc){
        for(i=0;i < m_dep.length;i++){
            tdep1=parseInt("0"+m_dep[i].value,10);
            tdep+=tdep1;
			//alert('['+i+']'+m_dep[i].value);
        }
        for(i=0;i < m_depH.length - 1;i++){
            tdep1=parseInt("0"+m_depH[i].value,10);
            tdep+=tdep1;
			//alert('['+i+']'+m_depH[i].value);
        }
        t_dep.value=tdep;

    }
        return (true);
}

function habilitarDepositos(n) {

	v_materia	= parseInt(document.totales.valor_materia.value,10); //0.2 Unidades Tributarias
	fd = document.f_c; //el formulario
    with (fd) {
		i = 1;
		k = n - (m_depH.length - 2); //Toma en cuenta depositos ya registrados
		if (isNaN(k)) {
			k = n;
		};
        while(i < k){
			//m_dep[i].value = v_materia;
			p_dep[i].disabled = false;
			m_dep[i].disabled = false;
			p_dep[i].style.background = "#ffffff" ;
			m_dep[i].style.background = "#ffffff" ;
			i++;
		}
        while(i < p_dep.length){
			p_dep[i].value = "";
			m_dep[i].value = "";
			p_dep[i].disabled = true;
			m_dep[i].disabled = true;
			p_dep[i].style.background = "#f0f0f0" ;
			m_dep[i].style.background = "#f0f0f0" ;
			i++;
		}

    }
	actualizar_total_dep(fd);
}



function EsNumero(cTexto,ft, totalizar) {
        var cadena = cTexto.value;
        if((cadena.length==0) && totalizar) actualizar_total_dep(ft);
        var nums="1234567890";
        i=0;
        cl=cadena.length;
        var checkc = false;
        while(i < cl)  {
            cTemp= cadena.substring (i, i+1);
            if (nums.indexOf (cTemp, 0)==-1) {
                if (!checkc){
                    alert("Ha introducido caracteres no num�ricos y se eliminar�n");
                    checkc = true;
                }
                cadT = cadena.split(cTemp);
                cadena = cadT.join("");
                cTexto.value=cadena;
                i=-1;
                cl=cadena.length;
            }
            i++;
        }
        if(totalizar) {
			actualizar_total_dep(ft);
		}
		cTexto.style.backgroundColor = "#FFFFFF";
}

function marcarAsignaturas(asignaturas,asigSC) {

    var cod_uc = new Array();
    scod_uc = "";
    asigs = asignaturas.split(" ");
    with (document.pensum) {
        i = 0; 
        j = 0;
        while (j < asignaturas.length){
            i = 0;
            while(i < (CB.length - 1)){
                cod_uc = CB[i].value.split(" ");  
                if ((cod_uc[0] == asigs[j]) && (cod_uc[0] != asigSC )){
                    CB[i].selectedIndex = parseInt(asigs[j+3],10); 
                }
                i++;
            }
            j = j + 4;
        } 
    }
}

function prepdata(fp,fd) {
    
    fd.cedula.value = ced;
    fd.exp_e.value = exp_e;
    fd.contra.value = contra;
    fd.carrera.value = carrera;
    with (fd) {
        if(asigSC.value != "") {
            marcarAsignaturas(asignaturas.value, asigSC.value);            
            scMsg = "Lo siento, ya no hay cupo en \n";
            scMsg = scMsg + "la secci�n: " + seccSC.value + "\nde la asignatura: " + asigSC.value;
            scMsg = scMsg + "\n Por favor, modifique su selecci�n";
            asigSC.value ="";
            alert(scMsg);
       }
        else asignaturas.value = "";
    }
    
    var cod_uc = new Array();
    scod_uc ="";
	fd.asignaturas.value="";
    with(fp) {
        i = 0;
        while(i < (CB.length - 1)){
          cod_uc = CB[i].value.split(" ");  
          if (cod_uc[5] !='0'){
            scod_uc = cod_uc[0] + " " + cod_uc[5] + " " + cod_uc[6] + " " + cod_uc[8];
			fd.asignaturas.value = fd.asignaturas.value + scod_uc  + " "; 
          }
          i++;
        }
    }
	
	//registra sexo y fecha de nac:
	if (fd.c_inicial.value != "0"){
		laFechaS =	1900 + parseInt(document.getElementById('anioN').value,10); 
		laFechaS += '-';
		laFechaS +=	document.getElementById('mesN').selectedIndex + 1;
		laFechaS += '-';
		laFechaS +=	document.getElementById('diaN').selectedIndex + 1; 
		document.f_c.f_nac_e.value = laFechaS;
		elSexo  = parseInt(document.getElementById('sexoN').value,10);
		aSexo   = Array('1','2','1');
		document.f_c.sexo.value = aSexo[elSexo];
	}
	//registra los depositos:
    with (fd) {
		i = 0;
		depositos.value = ""; 
        while(i < p_dep.length){
			if (p_dep[i].value.length == 8){
				// Posiciones para el archivo destino		   [0]				  [1]						[2]							[3]
				fd.depositos.value = fd.depositos.value + p_dep[i].value+" "+f_dep[i].value+" "+h_dep[i].value+":"+i_dep[i].value+" "+m_dep[i].value+" "; 
				//alert(fd.depositos.value);
				//alert(hh_dep[i].value);
            }
            i++;
        }
    }
    if(fd.inscribe.value == fd.inscrito.value) {
        fd.submit();
        return true;
    }
    return true;
}

function actualizarTotales(fp,ft,$update) {
      
    ct_mat		= 0;
    ct_uc		= 0;
    ct_monto	= 0;
    v_materia	= parseInt(ft.valor_materia.value,10); //0.2 Unidades Tributarias
    k =fp.CB.length - 1;
    with(fp) {
       j = 0;
       while(j < k){
		//	alert('j='+j+'{'+CB[j].value+'} indice='+CB[j].selectedIndex);
          if (CB[j].selectedIndex != '0'){ 
              cod_uc = CB[j].value.split(" ");               
              uc   = parseInt(cod_uc[1],10);
              ct_mat++;
              ct_uc+=uc;
              ct_monto+=v_materia;
          }
          j++;
       }
    }
    if ($update){
        with(ft){
            t_mat.value=ct_mat;
            t_uc.value =ct_uc;
            t_monto.value=ct_monto;
        }
		habilitarDepositos(document.f_c.maxDepo.value);
		return true;
    }
    else return ct_uc;
}
   
function correqInscrito(matAinscribir,correq) {
// matAinscribir: cadena con materias que el estudiante ha inscrito o seleccionado
// correq       : cadena con los correquisitos que deben verificarse. 
// La funcion devuelve un arreglo con dos valores: 
// cOK : verdadero si TODOS los correquisitos estan seleccionados o inscritos
// cFaltantes : Una lista separada por espacios de los correquisitos que le faltan por inscribir
	//alert('materia='+m+' indice='+j);
	cOK = true;
	cFaltantes = '';
	if (correq == ""){
		return Array(cOK,cFaltantes);
	}
	cola = correq.lastIndexOf("_");
	if(cola >=0) {
		cq = correq.substring(0,correq.lastIndexOf("_"));
	}
	else {
		cq = correq;
	}
	aCorreq = cq.split("_");
	for (i=0;i < aCorreq.length; i++ ){
		//alert('MI=['+matAinscribir+'] co=['+aCorreq[i]+']');
		if (matAinscribir.indexOf(aCorreq[i]) < 0) { // No esta el correquisito
			cFaltantes = cFaltantes + aCorreq[i] + ", ";
			cOK = false;
		}
	}
	//elimino la ultima coma que se agrega a cfaltantes:
	cFaltantes = cFaltantes.substring(0,cFaltantes.lastIndexOf(","));
	return Array(cOK,cFaltantes);
}

// Determina si las materias seleccionadas estan dentro de N semestres consecutivos.
// Si no lo estan, devuelve "false" y muestra un mensaje de error.

function materiasEnNsemestres(N, fp) {

	var selOK = ! vrPOZ(); //si es otro vicerrectorado, no chequear
	var masBajo = 10000; //ridiculamente grande para inicializarlo correctamente en la primera revision
	var masAlto = 0;
	var temp = 0;
	if (selOK) {
		return(true);
	}
    with (fp) {
        for(j=0;j < (CB.length - 1); j++){
            if (CB[j].selectedIndex != '0'){
                cod_uc = CB[j].value.split(" ");                    
                temp = parseInt( "0"+cod_uc[9],10);	//el semestre esta en la posicion 9 ( a partir de cero) en el
													//chorizo del valor de la opcion seleccionada (ver planilla_r.php, linea 285) 
				//alert("semestre="+temp);
				//que hacer en el caso de electivas??? semestre > 10 en Bqto
				if (temp>10) {
					temp = temp - 2; //esto es arbitrario, no se como ajustarlo!!!
				}
				// actualizar los limites
				if (temp > masAlto) {
					masAlto = temp;
				}
				if (temp < masBajo) {
					masBajo = temp;
				}
            }
        }
	}
	//Revisamos como va la seleccion, si esta repartida en mas de N semestres seguidos
	selOK =  (masAlto - masBajo) < N;
	//alert("mas alto="+masAlto);
	//alert("mas bajo="+masBajo);
	//alert("N="+N);
	if (selOK) {
		return (true)
	}
	else { // mensaje de error
		mensaje = "       RESTRICCION DE SEMESTRE! \n";
		mensaje = mensaje + " Disculpa, la asignatura seleccionada viola la \n";
		mensaje = mensaje + " norma de que puedes inscribir materias en un \n";
		mensaje = mensaje + " maximo de " + N + " semestres consecutivos.\n " 
		mensaje = mensaje + " Semestre mas alto: " + masAlto + ".\n Semetre mas bajo: " + masBajo + "."; 
		alert(mensaje)
		return(false)
    }
}


function correquisitoOK(fp) {

    cOK = true;
    var matAInscr = "";
	correq = "";
    with (fp) {
        for(j=0;j < (CB.length - 1); j++){
            if (CB[j].selectedIndex != '0'){
                cod_uc = CB[j].value.split(" ");                    
                arrayMat[j] = cod_uc[0]+" ";
            }
            else arrayMat[j] = "";
        }
        matAInscr = arrayMat.join("");
		//alert(matAInscr);
        for(j=0;j < (CB.length - 1); j++){
           if (CB[j].selectedIndex != '0'){
			   //alert(CB[j].value);
			   chequeo = correqInscrito(matAInscr,CBC[j].value);
               if (!chequeo[0]) {
                   correq = correq + "Para poder inscribir " + arrayMat[j];
                   correq = correq + " debes inscribir:\n" + chequeo[1] +"\n"; 
                   cOK = false;
				   break;
               } 
           }

       }
    }
    if (!cOK){
        alert("Conflicto de correquisito:\n" + correq);
		return(false);
    }
	else {
		//return(materiasEnNsemestres(3, fp)); //chequea para POZ si las materias no estan en mas de 3 semestres consecutivos
		return(true)
	}
}


function actualizarSecciones() {

    with (document.pensum) {
        for(j=0;j < (CB.length - 1); j++){             
            arraySecc[j] = CB[j].selectedIndex;
        }
    }
}

function estadoAnterior(lSeccion){

    with (document.pensum) {
        for(j=0;j < (CB.length - 1); j++){
            cod_ucSel = lSeccion.value.split(" "); 
            cod_uc    = CB[j].value.split(" ");            
            if (cod_ucSel[0] == cod_uc[0]){
                        
                lSeccion.options[arraySecc[j]].selected = true;
            }
        }

    }
}


function calcularMaxCargaCCS() {
    
    iMateria = -1; //indica que ninguna materia genera exceso de creditos
    limite   = 21;
    obligatoria  = 0; //0=no obliga, 1=obliga pero puede ver otras, 2=sola
	seleccionada = 0;
	noHayMarcadas = true;
    with (document.pensum) {
        for(j=0;j < (CB.length - 1); j++){
            vcod_uc  = CB[j].value.split(" ");
            vuc      = parseInt(vcod_uc[1],10);
            vrepite  = parseInt('0'+vcod_uc[2],10);
            vcre_cur = parseInt(vcod_uc[3],10);
            if ((vrepite == 3) && (obligatoria <3)) {
					limite = 9;
                    obligatoria = 1;
                    if(noHayMarcadas) {
						iMateria = j;
					}
					if (CB[j].selectedIndex !='0') {
						seleccionada +=1;
						noHayMarcadas = false;
					}
			}
			else if (vrepite > 3) {
                    limite = vuc;
                    obligatoria = 2;
                    if(noHayMarcadas) {
						iMateria = j;
					}
					if (CB[j].selectedIndex !='0') {
						seleccionada +=1;
						noHayMarcadas = false;
					}
			}
		//alert('['+noHayMarcadas+']['+vcod_uc[0]+']['+iMateria+']['+obligatoria+']['+seleccionada+']');
		}
	}
    return(Array(iMateria,limite,obligatoria, seleccionada));
}


function excesoDeCreditosCCS(lSeccion) {
    
	// lSeccion es un campo que contiene la sgte informacion 
	// separada por espacios: 
	//      [0]              [1]          [2]              [3]                        [4] 
	// codigo_asignatura, creditos, veces_que_repite, cred_curs_ultima_repitencia, tipo_lapso 
    
    exceso  = false;
    ecod_uc  = lSeccion.value.split(" ");               
    ucm     = parseInt(ecod_uc[1],10);
    repite  = parseInt('0'+ ecod_uc[2],10);
    cre_cur = parseInt(ecod_uc[3],10);
    total_uc= parseInt(document.totales.t_uc.value,10);
    total_mat= parseInt(document.totales.t_mat.value,10);
    indice = parseFloat(document.f_c.ind_acad.value);

    maxCarga = new Array(3) //contiene maximo de creditos, condicion que aplica 
                            //y puntero a la materia que limita.
	if (actualizarTotales(document.pensum,document.totales, false) == total_uc) {
        ucm = 0;
    }
    if (lSeccion.selectedIndex == '0') {
        ucm = -ucm;
    }
	if (ucm>0) {
		total_mat +=1;
	}
	maxCarga = calcularMaxCargaCCS(); //Array(Imateria, limite, obligatoria);

    iMateria    = maxCarga[0];
	maxCreditos = maxCarga[1];
    obligatoria = maxCarga[2];
    seleccionada = maxCarga[3];
	crAinsc  = total_uc + ucm;

	noPuedeEliminarla = (ucm < 0) && (repite > 1) && (total_mat > 1) &&(seleccionada == 0);
	
	if (iMateria >= 0) {
        matLim = document.pensum.CB[iMateria].value.split(" ");
        }
    else {
         matLim = "";
    }

	if (noPuedeEliminarla) {
		// alert('no puede eliminarla');
		if (repite == 3) {
			maxCreditos = 9;
		}
		else if (repite > 3) {
			maxCreditos = -ucm;
		}
		matLim[0] = ecod_uc[0];
	}

    if ((crAinsc > maxCreditos) || ((matLim !="") &&  (seleccionada == 0) && (crAinsc > 0)) || noPuedeEliminarla) {
        exceso = true;
        mens1 = "    PROBLEMA DE EXCESO DE CR�DITOS:\nNo puedes ";
        (ucm > 0) ? mAQ = "agregar" : mAQ = "borrar";
        mens1  = mens1 + mAQ + " esta asignatura.\n"
        mcausa = "Tu l�mite es ";
		if (matLim !="") {
			mcausa = "La condici�n de repitencia de la asignatura \n";
            mcausa = mcausa + matLim[0] + " te obliga a cursarla ";
			mensLC = "con un limite de " + maxCreditos + " cr�ditos\n";
			mensCS = "";       
		}
		else {
			mensLC = maxCreditos + " cr�ditos\n";
			mensCS = " y estas intentando inscribir " + crAinsc + " cr�ditos.\n";      
		}
    }

    if (exceso) {
        alert(mens1 + mcausa + mensLC + mensCS);
    }
    return exceso;
}

function calcularMaxCargaBQTO() {
    
    iMateria = -1; //indica que ninguna materia genera exceso de creditos
    limite   = 21;
    veces    = '';
    with (document.pensum) {
        for(j=0;j < (CB.length - 1); j++){
            cod_uc  = CB[j].value.split(" ");
            uc      = parseInt(cod_uc[1],10);
            repite  = cod_uc[2];
            cre_cur = parseInt(cod_uc[3],10);
            t_lapso = cod_uc[4];
            if ((t_lapso !='I') && (CB[j].selectedIndex !='0')) {
                switch(repite) {
                    case '':
                            break;
                    case '0' :
                    case 'R' : //repite por primera vez
                            if (veces == '') {
                                limite = cre_cur;
                                iMateria = j;
                            }
                            else if((veces == '0')||(veces == 'R')){
                                if (limite < cre_cur) {
                                    limite = cre_cur;
                                    iMateria = j;
                                }
                            }
                            veces = repite;
                            break;
                    case '1' : //repite por 2da vez
                            if ((veces =='') || (veces =='0')) {
                                (cre_cur > 10) ? limite = 10 : limite = cre_cur;
                                iMateria = j;
                                veces = '1';
                            }
                            else if (veces == '1') {
                                if (limite < cre_cur ) {
                                    limite = cre_cur;
                                    iMateria = j;
                                }
                                if (limite > 10) {
                                    limite = 10;
                                }  

                            }
                            break;
                    case '2' : //repite por tercera vez : debe verla solita
                            if (veces != '2') {
                                limite = uc;
                                veces = '2';
                                iMateria = j
                            }
                } //switch (repite)
            }
   
        }
    }
    return(Array(iMateria,limite,veces));
}

function excesoDeCreditosBQTO(lSeccion) {
    
	// lSeccion es un campo que contiene la sgte informacion 
	// separada por espacios: 
	//      [0]              [1]          [2]              [3]                        [4] 
	// codigo_asignatura, creditos, veces_que_repite, cred_curs_ultima_repitencia, tipo_lapso 
    
	intensivo = document.f_c.lapso.value.indexOf("I") >= 0;

    exceso  = false;
    cod_uc  = lSeccion.value.split(" ");               
    ucm     = parseInt(cod_uc[1],10);
    repite  = cod_uc[2];
    cre_cur = parseInt(cod_uc[3],10);
    t_lapso = cod_uc[4];
    total_uc= parseInt(document.totales.t_uc.value);
    indice = parseFloat(document.f_c.ind_acad.value);

    maxCarga = new Array(3) //contiene maximo de creditos, condicion que aplica 
                            //y puntero a la materia que limita.
    if(indice >= 6.0) {
        CreditosAdic = 2;
    }
    else {
        CreditosAdic = 0;
    }
    //alert("seccion=" + lSeccion.selectedIndex );
    if (actualizarTotales(document.pensum,document.totales, false) == total_uc) {
        ucm = 0
    }
    if (lSeccion.selectedIndex == '0') {
        ucm = -ucm;
    }
	maxCarga = calcularMaxCargaBQTO(); //Array(Imateria, limite, veces);

    iMateria = maxCarga[0];
    limite   = maxCarga[1];
    veces    = maxCarga[2];
    crAinsc  = total_uc + ucm;

    (veces =='2') ? maxCreditos = limite : maxCreditos = limite + CreditosAdic;
    
	if ((intensivo && (maxCreditos > 10))) {
		maxCreditos = 10;
	}

	if (iMateria >= 0) {
        matLim = document.pensum.CB[iMateria].value.split(" ");
        }
    else {
         matLim = "";
    }
    if (crAinsc > maxCreditos){
        exceso = true;
        mens1 = "    PROBLEMA DE EXCESO DE CR�DITOS:\nNo puedes ";
        (ucm > 0) ? mAQ = "agregar" : mAQ = "borrar";
        mens1  = mens1 + mAQ + " esta asignatura.\n"
        mensLC = maxCreditos + " cr�ditos\n";
        mensCS = " y estas intentando inscribir " + crAinsc + " cr�ditos.\n";       
        mcausa = "Tu l�mite es ";
        if (veces != '') {
            mcausa = "La condici�n de repitencia de la asignatura \n";
            mcausa = mcausa + matLim[0] + " te limita a ";
        }
    }

    if (exceso) {
        alert(mens1 + mcausa + mensLC + mensCS);
    }
    return exceso;
}

function calcularMaxCargaPOZ() {
    
    iMateria = -1; //indica que ninguna materia genera exceso de creditos
    limite   = 22;
    veces    = '';
	matAinsc= 0;
    with (document.pensum) {
        for(j=0;j < (CB.length - 1); j++){
            vcod_uc  = CB[j].value.split(" ");
            vuc      = parseInt(vcod_uc[1],10);
            vrepite  = vcod_uc[2];
            cre_cur = parseInt('0'+vcod_uc[3],10);
            vt_lapso = vcod_uc[4];
			// Repite la primera vez (18 uc si inscribe la materia)
			if ((vt_lapso !='I') && (CB[j].selectedIndex !='0')) {
			
			if ((vrepite =='1') && ((veces =='') || (veces =='1'))) {
								limite = 18 ;
								//alert (vrepite);
								//alert (limite);
                                iMateria = j;
                                veces = '1';
                            }
                   
			// Para la segunda vez en adelante
              if ((vrepite >'1') && ((veces =='') || (veces =='1'))) {
								//alert (vrepite);
                                matAinsc = 2;
								//alert (limite);
                                iMateria = j;
                                veces = vrepite;
                            }             
         
                            
            }
        }
    }
    return(Array(iMateria,limite,veces,matAinsc));
}

function excesoDeCreditosPOZ(lSeccion) {

	/*alert(lSeccion.value);
	alert(document.f_c.asignaturas.value);*/
    
	// lSeccion es un campo que contiene la sgte informacion 
	// separada por espacios: 
	//      [0]              [1]          [2]              [3]                        [4] 
	// codigo_asignatura, creditos, veces_que_repite, cred_curs_ultima_repitencia, tipo_lapso 
    
	intensivo = document.f_c.lapso.value.indexOf("I") >= 0;

    exceso  = false;
    ecod_uc  = lSeccion.value.split(" ");               
    ucm     = parseInt(ecod_uc[1],10);
    repite  = ecod_uc[2];
    cre_cur = parseInt(ecod_uc[3],10);
    t_lapso = ecod_uc[4];
    total_uc= parseInt(document.totales.t_uc.value);
    total_mat= parseInt(document.totales.t_mat.value,10);
    indice = parseFloat(document.f_c.ind_acad.value);
    maxCarga = new Array(4) //contiene maximo de creditos, condicion que aplica 
                            //y puntero a la materia que limita.
    
    //alert("seccion=" + lSeccion.selectedIndex );
    if (actualizarTotales(document.pensum,document.totales, true) == total_uc) {
        ucm = 0
    }
    if (lSeccion.selectedIndex == '0') {
        ucm = -ucm;
    }
	if (ucm>0) {
		total_mat +=1;
	}
	
		maxCarga = calcularMaxCargaPOZ(); //Array(Imateria, limite, veces);

    iMateria = maxCarga[0];
    limite   = maxCarga[1];
    veces    = maxCarga[2];
	matAinsc = maxCarga[3];
    crAinsc  = total_uc + ucm;

    (veces =='1') ? maxCreditos = limite : maxCreditos = limite ;
	
    if ((intensivo && (maxCreditos > 10))) {
		maxCreditos = 10;
	}

	if (iMateria >= 0) {
		matLim = document.pensum.CB[iMateria].value.split(" ");
        }
    else {
         matLim = "";
		 
    }
    if (matAinsc!=0 ){
    
		if ( total_mat > matAinsc){
        exceso = true;
        mens1 = "    PROBLEMA DE EXCESO DE CR�DITOS:\nNo puedes ";
        (ucm > 0) ? mAQ = "agregar" : mAQ = "borrar";
        mens1  = mens1 + mAQ + " esta asignatura.\n"
        mensLC = matAinsc + " materias.\n";
        mensCS = " y estas intentando inscribir " + total_mat + " materias.\n";       
        mcausa = "Tu l�mite es ";
        if (veces != '') {
            mcausa = "La condici�n de repitencia de la asignatura \n";
            mcausa = mcausa + matLim[0] + " te limita a ";
        }
    }
	}
    else if (crAinsc > maxCreditos){
			exceso = true;
			mens1 = "    PROBLEMA DE EXCESO DE CR�DITOS:\nNo puedes ";
			(ucm > 0) ? mAQ = "agregar" : mAQ = "borrar";
			
			mens1  = mens1 + mAQ + " esta asignatura.\n"
			mensLC = maxCreditos + " cr�ditos\n";
			mensCS = " y estas intentando inscribir " + crAinsc + " cr�ditos.\n";       
			mcausa = "Tu l�mite es ";
			if (veces != '') {
				if (intensivo){
					mcausa = "Te exceder�s de lo estipulado en el reglamento: \n";
					mcausa = mcausa + " (a) Tres asignaturas y \n";
					/*mcausa = mcausa + " (b) Hasta diez cr�ditos.\n";*/
					mensLC = " \n";
				}
				else {
				mcausa = "La condici�n de repitencia de la asignatura \n";
				mcausa = mcausa + matLim[0] + " te limita a ";
				}
			}
		}
		
	if (exceso) {
        alert(mens1 + mcausa + mensLC + mensCS);
    }

	if (total_mat>3){
		mens= "Lo siento, no puedes seleccionar esa asignatura\n";
        mens= mens + "porque te exceder�s de lo estipulado en el reglamento:\n";
        mens= mens + " (a) Tres asignaturas y \n";
        /*mens= mens + " (b) Hasta diez cr�ditos.\n";*/
        alert(mens);
		exceso = true;
	}
    return exceso;
	}
 

function cambiarColor(lSeccion) {
    cod_uc = lSeccion.value.split(" ");
    for(i=0;i<7;i++){
        identCol = cod_uc[0]+i; //identificador de division
		text_color = '#000000';
        switch (cod_uc[7]) { // de acuerdo a la seleccion y estatus, se establece el color:
            case 'G' :  lcolor='#F0F0F0'; //gris : NO SELECCIONADO
                        break;
            case 'B' :  lcolor='#99CCFF'; //azul : INSCRITO
                        break;
            case 'X' :  lcolor='#FF6666'; //rojo : RETIRO
						text_color ='#FFFFFF';
                        break;
        }
        document.getElementById(identCol).style.background = lcolor;
        document.getElementById(identCol).style.color = text_color;
    }

}

function resaltar(lSeccion) {

	if (correquisitoOK(document.pensum)) {
		if (vrLCM()) {
			excesoC = excesoDeCreditosCCS(lSeccion);
		}
		if (vrPOZ()) {
			excesoC = excesoDeCreditosPOZ(lSeccion);
		}
		else {
			excesoC = excesoDeCreditosBQTO(lSeccion);
		}
		
		if (!excesoC){
             cambiarColor(lSeccion);
			 // OJO CREAR RUTINA PARA VERIFICAR SI SE HABILITA EL COMBO DE GRUPOS
		}
		else {
			estadoAnterior(lSeccion);
		}
	}
	else {
		estadoAnterior(lSeccion);
	}
    actualizarSecciones();
    actualizarTotales(document.pensum,document.totales, true);
}

function borrar_depositos(fd) {

	with (fd) {
		i = 0;
		depositos.value = ""; 
        while(i < p_dep.length){
			p_dep[i].value = "";
			m_dep[i].value = "";
            i++;
        }
    }
}


function reiniciarTodo() {
    //return true;
    with (document) {
        ind_acad = f_c.ind_acad.value;
        pensum.reset();
        totales.reset();
        actualizarTotales(pensum,totales, true); 
		borrar_depositos(f_c);
		actualizar_total_dep(f_c);
        actualizarSecciones(); 
        prepdata(pensum,f_c);
        for(j=0;j < (pensum.CB.length - 1); j++) {
            cambiarColor(pensum.CB[j]);
        }
    }
	//Actualizamos sexo y fecha de nacimiento:
	//por cortesia, femenino primero (cambiamos M=2, F=1
	//aunque en la base de datos es al reves OJO!
	laFechaS = document.f_c.f_nac_e.value+"---"; //por si la fecha esta en blanco
	laFecha  = new Array();
	laFecha = laFechaS.split('-'); //anio,mes,dia
	//	alert('['+laFecha+']'+laFecha[2]+laFecha[1]+laFecha[0]);
	if (laFechaS != ""){
		document.getElementById('diaN').selectedIndex = laFecha[2] - 1; 
		document.getElementById('mesN').selectedIndex = laFecha[1] - 1;
		document.getElementById('anioN').value = laFecha[0].substr(2,4); 
	}
	elSexo  = parseInt('0'+document.f_c.sexo.value,10);
	aSexo   = Array('1','2','1');
	document.getElementById('sexoN').value = aSexo[elSexo];
	document.f_c.c_inicial.value = "1"; //marcamos como validada la fecha
}

function fadePopIE(speed){
	//alert(miTiempo);
	if ((miTiempo > 0) && (miTiempo <= 101)) {
		document.getElementById('floatlayer').style.filter="alpha(opacity="+miTiempo+")";
		miTiempo=miTiempo-speed;
		miTimer = setTimeout("fadePopIE("+speed+")","20");
	}
	else if (miTiempo<=0){
		document.getElementById('floatlayer').style.visibility="hidden";
		clearTimeout(miTimer);
	}
	else clearTimeout(miTimer);
}

function fadePopMOZ(speed){
	//alert(miTiempo);
	if ((miTiempo > 0) && (miTiempo <= 101)) {
		document.getElementById('floatlayer').style.opacity=miTiempo/100;
		miTiempo=miTiempo-speed;
		miTimer = setTimeout("fadePopMOZ("+speed+")","20");
	}
	else if (miTiempo<=0){
		document.getElementById('floatlayer').style.visibility="hidden";
		clearTimeout(miTimer);
	}
	else clearTimeout(miTimer);
}

function desvanecer(speed) {
	miTiempo = 100;
	if (speed < 0) {
		miTiempo = 1;
	}
	//alert(miTiempo);
	if (IE4){
		miTimer = setTimeout("fadePopIE("+speed+")","20");
	}
	else if (NS6){
		miTimer = setTimeout("fadePopMOZ("+speed+")","20");
	}
}

function verificar(){
    var dia = parseInt (document.getElementById('diaN').selectedIndex) + 1;
    var mes = parseInt (document.getElementById('mesN').selectedIndex) + 1;
    var anyo = parseInt ('0'+document.getElementById('anioN').value,10) + 1900;
	clearTimeout(miTiempo);
    if (CancelPulsado){
        return false;
    }
	if (FechaValida(dia,mes,anyo)){
		vcontra = hex_md5(document.getElementById('pV').value);
		if(vcontra == contra){
			prepdata(document.pensum,document.f_c);
			if ((document.f_c.asignaturas.value != "") || (document.f_c.inscribe.value!="X")) {
				//alert(escape(document.f_c.depositos.value));
				depositosOK = false;
				document.getElementById('pV').value="";
				desvanecer(20);
				revisarDepositos(escape(document.f_c.depositos.value)+"&sede="+document.f_c.sede.value);
				//if (depositosOK){
				//	document.f_c.submit();
				//	return true;
				//}
				//else {
				//return false;
				//}
			}
			else {
				alert('Debes seleccionar al menos una materia');
				return false;
			}
		}
		else {
			alert('Clave incorrecta.\n Por favor intente de nuevo');
			document.getElementById('pV').value="";
			document.getElementById('pV').focus();
			return false;
		}
	}
}
 

function cancelar() {
    CancelPulsado = true;
    document.getElementById('pV').value="";
    //hideMe();
	desvanecer(10);
}
function Inscribirme(){

    //if( parseInt(document.totales.t_uc.value)>0){
    prepdata(document.pensum,document.f_c)
    if ((document.f_c.asignaturas.value != "") || (document.f_c.inscribe.value!="X")) {
		if (validar_dep(document.f_c) && monto_exacto(document.totales, document.f_c)) {
			CancelPulsado = false;        
			showMe();
		}
		else {
			return false;
		}
    }
    else {
        alert('Debes seleccionar al menos una materia');
    }
}

function anyoBisiesto(anyo)
 {
  var fin = anyo;
  if (fin % 4 != 0)
    return false;
    else
     {
      if (fin % 100 == 0)
       {
        if (fin % 400 == 0)
         {
          return true;
         }
          else
           {
            return false;
           }
       }
        else
         {
          return true;
         }
     }
 }

function FechaValida(dia,mes,anyo)
 {
  var anyohoy = new Date();
  var Mensaje = "";
  var yearhoy = anyohoy.getYear();
  if (yearhoy < 1999)
    yearhoy = yearhoy + 1900;
  if(anyoBisiesto(anyo))
    febrero = 29;
    else
      febrero = 28;
   if ((mes == 2) && (dia > febrero))
    {
     Mensaje += "- D�a de nacimiento inv�lido\r\n";
    }
   if (((mes == 4) || (mes == 6) || (mes == 9) || (mes == 11)) && (dia > 30))
    {
     Mensaje += "- D�a de nacimiento inv�lido\r\n";
    }
   if ((anyo<1935) || (yearhoy - anyo < 15))
    {
     Mensaje += "- A�o de nacimiento inv�lido\r\n" + anyo;
    } 
   if (Mensaje != "")
   {
	   alert(Mensaje);
	   return false;
   }
   else {
	   return true;
   }
 }
 function mostrar_ayuda(ayudaURL) {
		window.open(ayudaURL,"instruciones","left=0,top=0,width=700,height=250,scrollbars=0,resizable=0,status=0");
 }

 function cargar_grupo(grupo){
	 alert(grupo.value); 
 }
