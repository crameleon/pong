/************/
/* JEU PONG */
/************/

/*****************************************************************************************************************/
/* CONSTANTES */

	// Données du Terrain
	var TERRAIN_WIDTH = 600;
	var TERRAIN_HEIGHT = 400;
	var TERRAIN_COLOR = "#444";
	
	// Données du filet
	var FILET_WIDTH = 6;
	var FILET_COLOR = "#555";
	
	// Données des raquettes
	var RAQUETTE_WIDTH = 20;
	var RAQUETTE_HEIGHT = 70;
	
	// Données de la balle
	var BALLE_COLOR = "#fff";
	var BALLE_DIAMETRE = 10;
	var BALLE_X = 100;
	var BALLE_Y = 100;
	var BALLE_COEFF_VITESSE = 1;
	var BALLE_VITESSE_X = 2 * BALLE_COEFF_VITESSE;
	var BALLE_VITESSE_Y = 2 * BALLE_COEFF_VITESSE;
	
	// Données du joueur 1
	var J1_COLOR = "#00FF00";
	var SCORE_J1_X = TERRAIN_WIDTH/2 - FILET_WIDTH/2 - 42;
	var SCORE_J1_Y = 30;
	var RAQUETTE_J1_X = 30;
	var RAQUETTE_J1_Y = TERRAIN_HEIGHT/2 - RAQUETTE_HEIGHT/2;
	var RAQUETTE_VITESSE_J1 = 5;
	
	// Données du joueur 2
	var J2_COLOR = "#fe198e";
	var SCORE_J2_X = TERRAIN_WIDTH/2 + FILET_WIDTH/2 + 30;
	var SCORE_J2_Y = 30;
	var RAQUETTE_J2_X = TERRAIN_WIDTH - 30 - RAQUETTE_WIDTH;
	var RAQUETTE_J2_Y = TERRAIN_HEIGHT/2 - RAQUETTE_HEIGHT/2;
	var RAQUETTE_VITESSE_J2 = 4;
	
	// Touches du clavier
	var CODE_TOUCHE_BAS = 40;
	var CODE_TOUCHE_HAUT = 38;
	var CODE_BARRE_ESPACE = 32;
	
	// Données de l'intelligence artificielle
	var DIRECTION_DROITE = "DROITE";
	var DIRECTION_GAUCHE = "GAUCHE";
	var DIRECTION_NULLE = "INERTE";
  
	// Position de la balle sur la raquette
	var RAQUETTE_POS_HAUT = "HAUT";
	var RAQUETTE_POS_MIHAUT = "MIHAUT";
	var RAQUETTE_POS_CENTRE = "CENTRE";
	var RAQUETTE_POS_MIBAS = "MIBAS";
	var RAQUETTE_POS_BAS = "BAS";
	
	// Musiques
	var SON_RENVOI_J1 = new Audio("./sounds/renvoi.mp3");
	var SON_RENVOI_J2 = new Audio("./sounds/renvoi2.mp3");
	var SON_REBOND = new Audio("./sounds/rebond.mp3");
	var SON_VICTOIRE = new Audio("./sounds/victoire.mp3");
	var SON_DEFAITE = new Audio("./sounds/defaite.mp3");
  
	// Données pour la victoire
	var SCORE_VICTOIRE = 5;
	var SCORE_VICTOIRE_X = 300;
	var SCORE_VICTOIRE_Y = TERRAIN_HEIGHT/2;

/*****************************************************************************************************************/
/* VARIABLES */
	
	// Rafraichissement de la page
	var requestAnimId;
	
	// Contextes
	var terrainContext;
	var scoreContext;
	var raquettesContext;
	var victoireContext;
	
	// Etat de la balle
	var balle_en_jeu = false;

	// Qui engage la balle au début du jeu
	// 1 pour J1
	// 2 pour J2 = IA
	var joueur_engagement = 1;
	
	// Victoire
	var victoire = false;
	
	// Scores
	var scoreJ1 = 0;
	var scoreJ2 = 0;
	
	// Gestion du clavier
	var aller_haut = false;
	var aller_bas = false;
	

/*****************************************************************************************************************/
/* FONCTIONS DE DESSIN */
  
	// Dessin du terrain
	var dessinerTerrain = function () {
		// Dessin du fond
		terrainContext.fillStyle = TERRAIN_COLOR;
		terrainContext.fillRect(0,0,TERRAIN_WIDTH,TERRAIN_HEIGHT);
		// Dessin du filet
		terrainContext.fillStyle = FILET_COLOR;
		terrainContext.fillRect(TERRAIN_WIDTH/2 - FILET_WIDTH/2,0,FILET_WIDTH,TERRAIN_HEIGHT);
	}
	
	// Dessin des scores
	var dessinerScores = function () {
		scoreContext.clearRect(0, 0, TERRAIN_WIDTH, TERRAIN_HEIGHT);
		scoreContext.font = "1.5em Helvetica, Arial, sans-serif";
		// Score du joueur 1
		scoreContext.fillStyle = J1_COLOR;
		scoreContext.fillText(scoreJ1,SCORE_J1_X,SCORE_J1_Y);
		// Score du joueur 2
		scoreContext.fillStyle = J2_COLOR;
		scoreContext.fillText(scoreJ2,SCORE_J2_X,SCORE_J2_Y);
	}
	
	// Dessin des raquettes
	var dessinerRaquettes = function () {
		// Raquette du joueur 1
		raquettesContext.fillStyle = J1_COLOR;
		raquettesContext.fillRect(RAQUETTE_J1_X,RAQUETTE_J1_Y,RAQUETTE_WIDTH,RAQUETTE_HEIGHT);
		// Raquette du joueur 2
		raquettesContext.fillStyle = J2_COLOR;
		raquettesContext.fillRect(RAQUETTE_J2_X,RAQUETTE_J2_Y,RAQUETTE_WIDTH,RAQUETTE_HEIGHT);
	}
	
	// Dessin de la balle
	var dessinerBalle = function () {
		raquettesContext.fillStyle = BALLE_COLOR;
		raquettesContext.fillRect(BALLE_X,BALLE_Y,BALLE_DIAMETRE,BALLE_DIAMETRE);
	}
	
	// Dessin du message de victoire
	var dessinerVictoire = function () {
		// On efface l'espace de jeu
		terrainContext.clearRect(0, 0, TERRAIN_WIDTH, TERRAIN_HEIGHT);
		scoreContext.clearRect(0, 0, TERRAIN_WIDTH, TERRAIN_HEIGHT);
		raquettesContext.clearRect(0, 0, TERRAIN_WIDTH, TERRAIN_HEIGHT);
		// On affiche le message de victoire
		victoireContext.fillStyle = TERRAIN_COLOR;
		victoireContext.fillRect(0,0,TERRAIN_WIDTH,TERRAIN_HEIGHT);
		victoireContext.font = "1.5em Helvetica, Arial, sans-serif";
		if (scoreJ1 == SCORE_VICTOIRE) {
			victoireContext.fillStyle = J1_COLOR;
			victoireContext.fillText("Vous avez gagné la partie !!!",SCORE_VICTOIRE_X,SCORE_VICTOIRE_Y);	
		} else {
			victoireContext.fillStyle = J2_COLOR;
			victoireContext.fillText("L'IA a gagné la partie !!!",SCORE_VICTOIRE_X,SCORE_VICTOIRE_Y);	
		}
	}

/*****************************************************************************************************************/
/* FONCTION DE GESTION DES CANVAS */

	// Creation des Canvas
	var creerCanvasContext = function (name, width, height, zindex) {
		console.log("creerCanvas : Création du canvas "+name);
		var canvas = document.getElementById(name);
		if (!canvas || !canvas.getContext) {
			return;
		}
		canvas.width = width;
		canvas.height = height;
		canvas.style.zIndex = zindex;
		var context = canvas.getContext('2d');
		if (!context) {
			return;
		} else {
			return context;
		}
	}

/*****************************************************************************************************************/
/* FONCTION DE MISE EN JEU */

	var initialiserEngagementJ1 = function () {
		console.log("Engagement du Joueur 1");
		balle_en_jeu = true;
		BALLE_X = RAQUETTE_J1_X + RAQUETTE_WIDTH;
		BALLE_Y = RAQUETTE_J1_Y + RAQUETTE_HEIGHT/2;
		BALLE_COEFF_VITESSE = 1;
		BALLE_VITESSE_X = 2 * BALLE_COEFF_VITESSE;
		BALLE_VITESSE_Y = 2 * BALLE_COEFF_VITESSE;
		SON_RENVOI_J1.play();
	}
	
	var initialiserEngagementJ2_IA = function () {
		console.log("Engagement du Joueur 2 = IA");
		balle_en_jeu = true;
		BALLE_X = RAQUETTE_J2_X;
		BALLE_Y = RAQUETTE_J2_Y + RAQUETTE_HEIGHT/2;
		BALLE_COEFF_VITESSE = 1;
		BALLE_VITESSE_X = -2 * BALLE_COEFF_VITESSE;
		BALLE_VITESSE_Y = 2 * BALLE_COEFF_VITESSE;
		SON_RENVOI_J2.play();
	}

/*****************************************************************************************************************/
/* FONCTIONS DE GESTION DES ANIMATIONS */

	// Animation de la balle
	var animerBalle = function () {
		BALLE_X = BALLE_X + BALLE_VITESSE_X;
		if (BALLE_X > TERRAIN_WIDTH || BALLE_X < 0) {
			BALLE_VITESSE_X = -BALLE_VITESSE_X;
		}
		BALLE_Y = BALLE_Y - BALLE_VITESSE_Y;
		if (BALLE_Y >= (TERRAIN_HEIGHT - BALLE_DIAMETRE) || BALLE_Y <= 0) {
			SON_REBOND.play();
			BALLE_VITESSE_Y = -BALLE_VITESSE_Y;
			if (BALLE_Y >= TERRAIN_HEIGHT-BALLE_DIAMETRE+1) {
				BALLE_Y--; 
			} else if (BALLE_Y <= 0) {
				BALLE_Y++; 
			}
		}
		dessinerBalle();
	}

	// Animation de la raquette du joueur 1
	var animerRaquetteJ1 = function () {
		if (aller_haut && RAQUETTE_J1_Y > 0)
			RAQUETTE_J1_Y = RAQUETTE_J1_Y - RAQUETTE_VITESSE_J1;
		else if (aller_bas && RAQUETTE_J1_Y < TERRAIN_HEIGHT - RAQUETTE_HEIGHT)
			RAQUETTE_J1_Y = RAQUETTE_J1_Y + RAQUETTE_VITESSE_J1;
	}
	
	// Animation de la raquette du joueur 2 avec intelligence artificielle
	var animerRaquetteJ2_IA = function () {
		var CENTRE_RAQUETTE_J2 = RAQUETTE_J2_Y + RAQUETTE_HEIGHT/2;
		var BORD_HAUT_RAQUETTE_J2 = RAQUETTE_J2_Y;
		var BORD_BAS_RAQUETTE_J2 = RAQUETTE_J2_Y + RAQUETTE_HEIGHT;
		if (directionHorizontaleBalle() == DIRECTION_DROITE) {
			if (BALLE_Y < BORD_HAUT_RAQUETTE_J2 && RAQUETTE_J2_Y > 0) {
				// la position de la balle est sur l'écran, au dessus de celle de la raquette
				RAQUETTE_J2_Y = RAQUETTE_J2_Y - RAQUETTE_VITESSE_J2;
			} else if (BALLE_Y > BORD_BAS_RAQUETTE_J2) {
				RAQUETTE_J2_Y = RAQUETTE_J2_Y + RAQUETTE_VITESSE_J2;
			} 
		} else {
			// se recentrer sur le terrain
			if (CENTRE_RAQUETTE_J2 > TERRAIN_HEIGHT/2) {
				RAQUETTE_J2_Y -= RAQUETTE_VITESSE_J2;
			} else if (CENTRE_RAQUETTE_J2 < TERRAIN_HEIGHT/2) {
				RAQUETTE_J2_Y += RAQUETTE_VITESSE_J2;
			}
		}
	}
	
	var positionBalleSurRaquette = function (positionYBalle, positionYRaquette) {
		var taillePositionRaquette = RAQUETTE_HEIGHT/5;
		if ( positionYBalle > positionYRaquette - RAQUETTE_HEIGHT && positionYBalle < positionYRaquette + taillePositionRaquette ) {
			return RAQUETTE_POS_HAUT;
		} else if ( positionYBalle >= positionYRaquette + taillePositionRaquette && positionYBalle < positionYRaquette + taillePositionRaquette*2 ) {
			return RAQUETTE_POS_MIHAUT;
		} else if ( positionYBalle >= positionYRaquette + RAQUETTE_HEIGHT - taillePositionRaquette*2 && positionYBalle < positionYRaquette + RAQUETTE_HEIGHT - taillePositionRaquette ) {
			return RAQUETTE_POS_MIBAS;
		}else if ( positionYBalle >= positionYRaquette + RAQUETTE_HEIGHT - taillePositionRaquette && positionYBalle < positionYRaquette + RAQUETTE_HEIGHT ) {
			return RAQUETTE_POS_BAS;
		}
		return RAQUETTE_POS_CENTRE;
	}
	
	var changerTrajectoireBalle = function (positionXBalle, positionYBalle, positionXRaquetteJ1, positionYRaquetteJ1, positionXRaquetteJ2, positionYRaquetteJ2) {
		if (testerCollisionBalleRaquette(positionXRaquetteJ1, positionYRaquetteJ1, positionXBalle, positionYBalle)) {
			// Collision de la balle avec la raquette du J1
			SON_RENVOI_J1.play();
			switch(positionBalleSurRaquette(positionYBalle, positionYRaquetteJ1)) {
				case RAQUETTE_POS_HAUT:
					BALLE_VITESSE_X = 2 * BALLE_COEFF_VITESSE;
					BALLE_VITESSE_Y = 3 * BALLE_COEFF_VITESSE;
					break;
				case RAQUETTE_POS_MIHAUT:
					BALLE_VITESSE_X = 2 * BALLE_COEFF_VITESSE;
					BALLE_VITESSE_Y = 2 * BALLE_COEFF_VITESSE;
					break;
				case RAQUETTE_POS_CENTRE:
					BALLE_VITESSE_X = 3 * BALLE_COEFF_VITESSE;
					BALLE_VITESSE_Y = 1 * BALLE_COEFF_VITESSE;
					break;
				case RAQUETTE_POS_MIBAS:
					BALLE_VITESSE_X = 2 * BALLE_COEFF_VITESSE;
					BALLE_VITESSE_Y = -2 * BALLE_COEFF_VITESSE;
					break;
				case RAQUETTE_POS_BAS:
					BALLE_VITESSE_X = 2 * BALLE_COEFF_VITESSE;
					BALLE_VITESSE_Y = -3 * BALLE_COEFF_VITESSE;
					break;
			}
		} else if (testerCollisionBalleRaquette(positionXRaquetteJ2, positionYRaquetteJ2, positionXBalle, positionYBalle)) {
			SON_RENVOI_J2.play();
			// Collision de la balle avec la raquette du J2
			switch(positionBalleSurRaquette(positionYBalle, positionYRaquetteJ2)) {
				case RAQUETTE_POS_HAUT:
					BALLE_VITESSE_X = -2 * BALLE_COEFF_VITESSE;
					BALLE_VITESSE_Y = 3 * BALLE_COEFF_VITESSE;
					break;
				case RAQUETTE_POS_MIHAUT:
					BALLE_VITESSE_X = -2 * BALLE_COEFF_VITESSE;
					BALLE_VITESSE_Y = 2 * BALLE_COEFF_VITESSE;
					break;
				case RAQUETTE_POS_CENTRE:
					BALLE_VITESSE_X = -3 * BALLE_COEFF_VITESSE;
					BALLE_VITESSE_Y = -1 * BALLE_COEFF_VITESSE;
					break;
				case RAQUETTE_POS_MIBAS:
					BALLE_VITESSE_X = -2 * BALLE_COEFF_VITESSE;
					BALLE_VITESSE_Y = -2 * BALLE_COEFF_VITESSE;
					break;
				case RAQUETTE_POS_BAS:
					BALLE_VITESSE_X = -2 * BALLE_COEFF_VITESSE;
					BALLE_VITESSE_Y = -3 * BALLE_COEFF_VITESSE;
					break;
			}   
		}
	}

	var accelererBalle = function() {
		BALLE_COEFF_VITESSE = BALLE_COEFF_VITESSE + .1;
	}

/*****************************************************************************************************************/
/* FONCTION DE GESTION DES COLLISIONS */

	var testerCollisionBalleRaquette = function (raquetteX,raquetteY,balleX,balleY) {
		if ( !( raquetteX > balleX + BALLE_DIAMETRE
			|| raquetteX < balleX - RAQUETTE_WIDTH 
			|| raquetteY > balleY + BALLE_DIAMETRE
			|| raquetteY < balleY - RAQUETTE_HEIGHT) ) {
			// Collision
			return true;
		}
		return false;
	}

/*****************************************************************************************************************/
/* FONCTION DE GESTION DE LA PERTE DE BALLE */

	var ballePerdueJ1 = function (positionXBalle, positionXJ1) {
		var valeurRetour = false;
		if (positionXBalle < positionXJ1) {
			console.log("Le Joueur 1 perd la balle");
			valeurRetour = true;
		}
		return valeurRetour;
	}
	
	var ballePerdueJ2 = function (positionXBalle, positionXJ2) {
		var valeurRetour = false;
		if (positionXBalle > positionXJ2 + RAQUETTE_WIDTH) {
			console.log("Le Joueur 2 = IA perd la balle");
		    valeurRetour = true;
		}
		return valeurRetour;
	}
	
	var testerBallePerdue = function() {
		if (ballePerdueJ1(BALLE_X,RAQUETTE_J1_X)) {
			scoreJ2++;
			dessinerScores();
			SON_DEFAITE.play();
			if (scoreJ2 == SCORE_VICTOIRE) {
				victoire = true;
			} else {
				balle_en_jeu = false;
				joueur_engagement = 2;
				setTimeout(initialiserEngagementJ2_IA, 3000);
			}
		} 
		if (ballePerdueJ2(BALLE_X, RAQUETTE_J2_X)) {
			scoreJ1++;
			dessinerScores();
			SON_VICTOIRE.play();
			if (scoreJ1 == SCORE_VICTOIRE) {
				victoire = true;
			} else {
				balle_en_jeu = false;
				joueur_engagement = 1;
			}
		}
	}

/*****************************************************************************************************************/
/* FONCTION DE GESTION DE L'INTELLIGENCE ARTIFICIELLE */

	var directionHorizontaleBalle = function () {
		if (BALLE_VITESSE_X > 0 && balle_en_jeu) {
			return DIRECTION_DROITE;
		} else if (BALLE_VITESSE_X < 0 && balle_en_jeu) {
			return DIRECTION_GAUCHE;
		}
		return DIRECTION_NULLE;
	}

/*****************************************************************************************************************/
/* FONCTIONS DE GESTION DES TOUCHES CLAVIER */

	var onKeyDown = function (event) {
		if (event.keyCode == CODE_TOUCHE_BAS) {
			aller_bas = true;
		} else if (event.keyCode == CODE_TOUCHE_HAUT) {
			aller_haut = true;
		} else if (event.keyCode == CODE_BARRE_ESPACE && joueur_engagement==1 && balle_en_jeu==false) {
			initialiserEngagementJ1();
		}
	}
	var onKeyUp = function (event) {
		if (event.keyCode == CODE_TOUCHE_BAS) {
			aller_bas = false;
		} else if (event.keyCode == CODE_TOUCHE_HAUT) {
			aller_haut = false;
		}
	}

/*****************************************************************************************************************/
/* FONCTIONS DE GESTION DU JEU */

	// Gestion de requestAnimationFrame pour tous les navigateurs
	var vendors = ['ms', 'moz', 'webkit', 'o'];
	for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
		|| window[vendors[x] + 'CancelRequestAnimationFrame'];
	}

	// Initialisation 
	var initialisation = function () {
		// Récupération des contextes
		terrainContext = creerCanvasContext("canvasTerrain",TERRAIN_WIDTH,TERRAIN_HEIGHT,1);
		scoreContext = creerCanvasContext("canvasScore",TERRAIN_WIDTH,TERRAIN_HEIGHT,2);
		raquettesContext = creerCanvasContext("canvasRaquettes",TERRAIN_WIDTH,TERRAIN_HEIGHT,3);
		victoireContext = creerCanvasContext("canvasVictoire",TERRAIN_WIDTH,TERRAIN_HEIGHT,1);
		// Dessin
		dessinerTerrain();
		dessinerScores();
		// Accélération progressive de la balle
		setInterval(accelererBalle, 10000);
		// Affichage après rafraichissement de la page
		requestAnimId = window.requestAnimationFrame(dessin);
	}
 
	// Code du jeu
	var dessin = function () {
		if (!victoire) {
			// Effacement des données du canvas des Raquettes + Balle
			raquettesContext.clearRect(0,0,TERRAIN_WIDTH,TERRAIN_HEIGHT);
			// Animation de la balle
			if (balle_en_jeu) {
				animerBalle();
				testerBallePerdue();
			}
			// Animation de la raquette du joueur 1
			animerRaquetteJ1();
			// Animation de la raquette du joueur 2 = IA
			animerRaquetteJ2_IA();
			// Dessin des raquettes
			dessinerRaquettes();
			// Test de collision
			changerTrajectoireBalle(BALLE_X, BALLE_Y, RAQUETTE_J1_X,  RAQUETTE_J1_Y, RAQUETTE_J2_X, RAQUETTE_J2_Y);
			// Affichage après rafraichissement de la page
			requestAnimId = window.requestAnimationFrame(dessin);
		} else {
			dessinerVictoire();
		}
	}
	
	// Appel de la fonction d'initialisation au chargement de la page
	window.addEventListener('load', function () {
		initialisation();
		window.document.onkeydown = onKeyDown;
		window.document.onkeyup = onKeyUp;
	}, false);

/*****************************************************************************************************************/
