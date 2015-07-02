///////// ************** GLOBALS

var initial = true;
var fluido;
var path='https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=30&playlistId=PLTNl117aSmvEHA4RaCmhOu76SaZRakClG &key=AIzaSyCkOkN3M_gNDpeQJSObnp5KfxRfkU8HlG8';
///////// ************** MODELS

var Models = {
	Video: Backbone.Model.extend(),
};

///////// ************** COLLECTIONS

var Collections = {
	Videos: Backbone.Collection.extend({
		model: Models.Video,
		url: '',
		parse: function(resp) {
			return resp.items;
		},
	}),
};

///////// ************** VIEWS
var Views = {
	SingleVideo: Backbone.View.extend({
		className: '',
		initialize: function() {
		},
		render: function() {
            var source = $('#single-video-template').html();
            var template = Handlebars.compile(source);
            var html = template(this.model.attributes);
            this.$el.html( html );
            return this;
		},
	}),
	VideosApp: Backbone.View.extend({
		initialize: function() {
			this.collection = new Collections.Videos();
            this.collection.url=window.path;
			this.collection.on('reset', this.showVideos, this);
			this.performSearch();
		},
		render: function() {
            var source = $('#app-template').html();
            var template = Handlebars.compile(source);
            var html = template(this.collection);
            this.$el.html(html);
			this.showVideos();
			return this;
		},
		showVideos: function() {
			//this.$el.find('#video-list-container').empty();
			//var v = null;
			this.collection.each(function(item, idx) {
                v = new Views.SingleVideo({model:item, idx:idx});
                if(window.initial==true){
                    if(idx!=0){
                        v.render().el.className='video';
                    }
                    window.initial=false;
                }else{
                     v.render().el.className='video';
                }
                this.$el.find('#video-list-container').append(v.render().el);
                $( v.render().el ).fadeIn( "slow");
			}, this);
			return this;
		},
		performSearch: function(evdata) {
			evdata = evdata || {};
			this.collection.fetch({
                data:{q:evdata.queryString},
                success: function(posts, data){
                    console.log(data.nextPageToken)
                    if(data.nextPageToken != null){
                        window.path='https://www.googleapis.com/youtube/v3/playlistItems?pageToken='+data.nextPageToken+'&part=snippet&maxResults=30&playlistId=PLTNl117aSmvEHA4RaCmhOu76SaZRakClG &key=AIzaSyCkOkN3M_gNDpeQJSObnp5KfxRfkU8HlG8';
                    }
                }
            });
		},
	}),
};

///////// ************** FUNCTIONS

var vs = new Views.VideosApp();
vs.setElement($('#container')).render();

$(window).resize(function() {
var newWidth = $('body').css('width');
    var $el = $(this);
   $("#video-first-container").css('width',newWidth);
   $("#video-first-container").css('height',newWidth * $el.attr('data-aspectRatio'));


}).resize();

$(".button-up").click(function() {
    $("html, body").animate({
        scrollTop:0
    },"slow");
});
$(".button-loadMore").click(function() {
    vs.initialize();
});

$(".button-more").click(function() {
    var size = parseInt($(".first-container").css('height'))+ parseInt($("#site-name").css('height'));
    $("html, body").animate({
        scrollTop:size
    },"slow");
    $('#ytplayer').stopVideo()
});

///////// ************** HANDLEBARS

Handlebars.registerHelper('pullstring', function(text) {
    return text
         .replace('Subscribe to TRAILERS: http://bit.ly/sxaw6h', '')
         .replace('Subscribe to COMING SOON: http://bit.ly/H2vZUn', '')
         .replace('Like us on FACEBOOK: http://goo.gl/dHs73', '')
         .replace('Follow us on TWITTER: http://bit.ly/1ghOWmt', '')

});

Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
    switch (operator) {
    case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
});
