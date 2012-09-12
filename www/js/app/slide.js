(function($){
    
    var settings = {
        'width':document.compatMode=='CSS1Compat' && !window.opera?document.documentElement.clientWidth:document.body.clientWidth,
        'height':document.compatMode=='CSS1Compat' && !window.opera?document.documentElement.clientHeight:document.body.clientHeight,
        'image_link':'images/',
        'interval':6000,
        'index':1,
        'count_img':6,
        'selector':'.slide'
    };
    
    
    
    var methods = {
        init : function( options ) {
            if (options) {
                $.extend(settings, options)
            }
            methods.generate_cascade();
        },
        generate_cascade : function() {
            $('#supersized').remove();
            $('body').append('<div class="'+settings.selector.substring(1)+'"></div>');
            methods.css_style();
            $(settings.selector).append('<div class="supersized" id="supersized" style="width:100%; height:100%; opacity: 1;"></div>');
            $('#supersized').animate({'opacity':'1'},100, function(){
                $(this).supersized({slides  : [ {image : settings.image_link+settings.index+'.jpg'}]});
                
                setTimeout(function(){
                    methods.display();
                },settings.interval);
            });
            

        },
        css_style: function(){
            $(settings.selector).css({
                'width':'100%',
                'height':'100%',
                'position':'absolute',
                'z-Index':'200',
                'background':'#000000'
            });
        },     
        display: function(){

                setInterval(function(){
                    
                    if(settings.index == settings.count_img){
                        settings.index = 1;
                    }
                    $('#supersized').animate({'opacity':'0'}, 1000, "easeInQuart", function(){
                        $(this).remove();
                
                        settings.index++;
                        $(settings.selector).append('<div class="supersized" id="supersized" style="width:100%; height:100%; opacity: 0;"></div>');
                        $('#supersized').supersized({slides  : [ {image : settings.image_link+settings.index+'.jpg'}]}).animate({'opacity':'1'},1200,"easeInQuart");
                
                    });
                    
                },settings.interval);
            
            
        }
    };
    
    
    
    
    
    $.slideShow = function(method){

        if ( methods[method] ) {
            return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Метод ' +  method + ' не существует в jQuery.desctop' );
        }
        
        
        
        
      
    };
    
})(jQuery);