//IMPORTS
import { csv } from "../node_modules/d3-fetch";
import { select } from '../node_modules/d3-selection';
import { forceSimulation, forceX, forceY , forceManyBody, forceCollide } from "d3-force";
//Import des données
csv("rachelwineratings.csv")
    .then(function(data) {
        var width = 800, height = 1000
        var nodes = data;
        // Bouton pour afficher le vins selon leur note
        var buttonId = null; // initialiser la variable buttonId à null
        // Ajouter un événement de click à chaque bouton pour mettre à jour la variable buttonId
        document.querySelectorAll('button').forEach(function(button) {
            button.addEventListener('click', function(b) {
            buttonId = button.id;
            const titre = document.querySelector("#titre");
            const text = document.querySelector("#text");
            const accroche = document.querySelector("#accroche");
            accroche.innerHTML = "Les vins notés";
            text.innerHTML = 'étoiles <br><span style="font-size:25px;">par Rachel</span>';
            switch(buttonId) {
                case '1':
                        nodes = data.filter((d) => d.rating === "1");
                        titre.innerHTML = '<span style="font-size: 80px;">1</span>';
                    break;
                case '2':
                        nodes = data.filter((d) => d.rating === "2");
                        titre.innerHTML = '<span style="font-size: 80px;">2</span>';
                    break;
                case '3':
                        nodes = data.filter((d) => d.rating === "3");
                        titre.innerHTML = '<span style="font-size: 80px;">3</span>';
                    break;
                case '4':
                        nodes = data.filter((d) => d.rating === "4");
                        titre.innerHTML = '<span style="font-size: 80px;">4</span>';
                    break;
                case '5':
                        nodes = data.filter((d) => d.rating === "5");
                        titre.innerHTML = '<span style="font-size: 80px;">5</span>';
                    break;
                case 'tous':
                    nodes = data;
                    titre.innerHTML = "658<br>vins";
                    accroche.innerHTML = "Entre 2018 et<br>2019, c'est...";
                    text.innerHTML = "goûté<br>et<br>noté";
                    break;
            }
          });
        });
        // Définir les possitions Y en fonction de la couleur
        var colorsY = {
            red: height * 0.3,
            white: height * 0.6,
            rose: height * 0.7,
            sparkling: height * 0.8,
            dessert: height * 0.8,
            orange: height * 0.8,
            "": height * 0.8
        };

        var simulation = forceSimulation(nodes)
        	.force('charge', forceManyBody().strength(5))
            .force("x", forceX(width/2).strength(0.05))
            .force("y", function(d) {
                return forceY(colorsY[d.style]).strength(0.05);
            })
        	.force('collide', forceCollide().radius(10))
        	.on('tick', ticked);

        function ticked() {
        	const u = select('svg')
        		.selectAll('circle')
        		.data(nodes)
        		.join('circle')
        		.attr('r', function() {
        			return 10
        		})
        		.attr('cx', function(d) {
        			return d.x
        		})
        		.attr('cy', function(d) {
        			return d.y
        		})
                .attr("fill", function(d) {
                    return d.style === "red" ? "#A52A2A" : (d.style === "white" ? "#F0E68C	" : (d.style === "rose" ? "#FFB6C1" : "#DCDCDC"));
                })
                .on('mouseover', function(d) {
                    afficherFiche(d.srcElement.__data__);
                    select("#fiche").attr("style", "visibility: visible;")
                    select(this)
                        .attr("fill", "#8B008B")
                        .attr("r", 15)
                        .on('mouseleave', function() {
                            select(this).attr("fill", function(d) {
                                return d.style === "red" ? "#A52A2A" : (d.style === "white" ? "#F0E68C	" : (d.style === "rose" ? "#FFB6C1" : "#DCDCDC"));
                            }).attr("r", 10);
                            select("#fiche").attr("style", "visibility: hidden;")
                        });
                });
        }
        // Ajouter un événement de scroll pour mettre à jour la position Y des noeuds
window.addEventListener('scroll', function(e) {
    nodes.forEach(function(node) {
        if (window.scrollY > 1) {
            // Si on scroll vers le bas, séparer les cercles par type de vin
            node.y = colorsY[node.style] + window.scrollY * 0.1;
        } else {
            // Si on scroll vers le haut, regrouper tous les noeuds au centre
            node.y = height / 2 ;
        }
    });
    simulation.alpha(0.1).restart();
});
    })
    .catch(function(error) {
        console.log(error);
    });
    function afficherFiche(data){
        console.log(data);
        const nom = document.querySelector("#fiche>h3");
        const etoile = document.querySelector("#etoile");
        const contenu = document.querySelector("#fiche>p");
        nom.textContent = data.wine_name;
        etoile.textContent = `${data.rating} étoiles`;
        contenu.textContent = `Rachel l'a goûté en ${data.month} ${data.year}.
            Il s'agit d'un vin "${(!data.style) ? "**" : data.style}" de ${data.region}.
            Il est vendu à ${(!data.estimated_price) ? "**" : data.estimated_price} $`;
    }

