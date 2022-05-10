import $ from "jquery";

export default class Texte
{
    constructor()
    {

    }

    update()
    {
        this.spanWidth = $('#text span').width();
        $('#text').animate( { width: this.spanWidth }, 10000 );
    }
}