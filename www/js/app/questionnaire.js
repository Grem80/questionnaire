
var Q_Settings = {
    'year_start':1990,
    'time_for_slide':60, //1_min
    'err_msg':'none',
    'validate':{
        'firstname':0,
        'lastname':0,
        'email':0,
        'phone':0,
        'city':0,
        'university':0,
        'faculty':0,
        'year':0
    },
    'email_pattern':/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i,
    'phone_pattern':/^\+\d{2}\(\d{3}\)\d{3}-\d{2}-\d{2}$/,
    //'name_pattern':/([A-Za-z])/gm
    'name_pattern':/^([A-Za-z])+$|^([А-Яа-я])+$/gm
    //'name_pattern':/^(([A-za-z]+[\s]{1}[A-za-z]+)|([A-Za-z]+))$/
};
    
  
var Questionnaire = {
            init: function(){
                //variable
                var date_obj = new Date();
                var this_year = date_obj.getFullYear();
                var year_finish = this_year + 6;
                
                //methods
                //Questionnaire.desctop_slide();
                Questionnaire.educ_check_onOff();                             
                
                //----------------------------
                while(Q_Settings.year_start != year_finish){
                    $('#year-menu').append(
                    '<li class="get_li ui-btn ui-btn-icon-right ui-li ui-li-last ui-btn-up-c" data-option-index="1" data-icon="false" role="option" data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-iconpos="right" data-theme="c" aria-selected="false">'+
                        '<div class="ui-btn-inner ui-li">'+
                            '<div class="ui-btn-text">'+
                                '<a class="ui-link-inherit" href="#" tabindex="-1">'+Q_Settings.year_start+'</a>'+
                            '</div>'+
                        '</div>'+
                    '</li>');
                    $('#year').append('<option class="get" value="'+Q_Settings.year_start+'">'+Q_Settings.year_start+'</option>');
                    $('#filter_year').append('<option class="get" value="'+Q_Settings.year_start+'">'+Q_Settings.year_start+'</option>');
                    Q_Settings.year_start++;
                    if(Q_Settings.year_start == year_finish){
                        Questionnaire.enter_data();
                    }
                }
                
                if($('body div:first').attr('id') == 'admin_main'){
                    $('body').attr('id','admin_body');
                } 
                
                    if($('body').attr('id') == 'main_body'){
                    
                        $('#education_inform').change(function(event, ui) {
                            if ($(this).attr('value') == 'on') {
                                $('.education_block').slideDown(500);
                            } else {
                                $('.education_block').slideUp(500);
                            }
                        });
                        //-------------
                        if($('#city').val() != 'Select city:' ){
                            Q_Settings.validate.city = 1;
                            Questionnaire.get_JSON('http://questionnaire2/pages/get_univer.php?callback=?', {'city_id':$('#city').val()}, 'university', 'university-menu', true);
                            Questionnaire.selected_sel('year');
                        }

                        if($('#firstname').val() != ''){
                            var pattern = new RegExp(Q_Settings.name_pattern);
                            var result = pattern.test($('#firstname').val());
                            Questionnaire.validate(result, 'firstname');
                            $('#firstname').focus(function(){Questionnaire.after_error_focus();});
                        }

                        if($('#lastname').val() != ''){
                            var pattern = new RegExp(Q_Settings.name_pattern);
                            var result = pattern.test($('#lastname').val());
                            Questionnaire.validate(result, 'lastname');
                            $('#lastname').focus(function(){Questionnaire.after_error_focus();});
                        }

                        if($('#email').val() != ''){
                            var pattern = new RegExp(Q_Settings.email_pattern);
                            var result = pattern.test($('#email').val());
                            Questionnaire.validate(result, 'email');
                            $('#email').focus(function(){Questionnaire.after_error_focus();});
                        }

                        if($('#phone').val() != ''){
                            var pattern = new RegExp(Q_Settings.phone_pattern);
                            var result = pattern.test($('#phone').val());
                            Questionnaire.validate(result, 'phone');
                            $('#phone').focus(function(){Questionnaire.after_error_focus();});
                        }
                    }
                    
                $("#send").live("click", function() {
                    Questionnaire.send_data(Q_Settings.data_saved);
                });   
            },
            educ_check_onOff: function(){
                if ($('#education_inform').attr('value') == 'on') {
                        $('.education_block').slideDown(500);
                    } else {
                        $('.education_block').slideUp(500);
                    }
            },
            desctop_slide: function(){
                var timer = 0;
                
                setInterval(function(){
                    timer++;

                    $('body').click(function(){
                        $('.slide').remove();
                        timer = 0;
                    });

                    if(timer == Q_Settings.time_for_slide){
                        $(window).scrollTop(0);
                        $.slideShow({image_link:'css/images/images/'});
                    }

                },1000);
            },
            get_JSON: function(url,data, select_id, select_menu_id, select_func){
                $.getJSON(url, data, function(response) {
                    Questionnaire.chenge_select(select_id, select_menu_id, response);
                    if(select_func == true){
                        Questionnaire.selected_sel(select_id);
                        Questionnaire.get_JSON_faculty(select_id);
                    }
                });
            },
            get_JSON_faculty: function(univer_select_id){
                $.getJSON('http://questionnaire2/pages/get_faculty.php?callback=?',{'univer_id':localStorage.getItem(univer_select_id)},function(response){
                            Questionnaire.chenge_select('faculty', 'faculty-menu', response);
                            if(localStorage.getItem('faculty') !== null){
                                Questionnaire.selected_sel('faculty');                             
                            }
                        });
            },
            selected_sel: function(select_id){
                var option_f = $('#'+select_id).find('.get');
                    var value = localStorage.getItem(select_id);
                    jQuery.each(option_f, function(i, val) {
                    if(option_f[i].value == value){
                        option_f[i].selected = true;
                        $('#'+select_id).parent().find('a').children().children().children().html(option_f[i].text);
                        Q_Settings.validate[select_id] = 1;
                    }
                }); 
            },
            clear_select: function(select_id, select_menu_id){
                $('#'+select_id).parent().find('a').children().children().children().html($('#'+select_id+' option.plch').html());
                $('#'+select_id+' option.plch').attr('selected','selected');
                $('#'+select_id).find('.get').remove();
                $('#'+select_menu_id).find('.get_li').remove();
                Q_Settings.validate[select_id] = 0;
            },
            clear_input: function(input_id){
                $('#'+input_id).val('');
                Q_Settings.validate[input_id] = 0;
            },
            enter_data: function(){
               $('#city').change(function(){   
                    Questionnaire.clear_select('university', 'university-menu');
                    Questionnaire.clear_select('faculty', 'faculty-menu');
                    
                    Questionnaire.get_JSON('http://questionnaire2/pages/get_univer.php?callback=?',{'city_id':$(this).val()}, 'university', 'university-menu', false);
                    Q_Settings.validate.city = 1;
                    Q_Settings.validate.university = 0;
                    Q_Settings.validate.faculty = 0;
               });
               
               $('#university').change(function(){
                    localStorage.setItem('university', $(this).val());
                    Questionnaire.get_JSON('http://questionnaire2/pages/get_faculty.php?callback=?',{'univer_id':$(this).val()}, 'faculty', 'faculty-menu', false);
                    Q_Settings.validate.university = 1;
                    Questionnaire.clear_select('faculty', 'faculty-menu');
               });
               
               $('#faculty').change(function(){
                   localStorage.setItem('faculty', $(this).val());
                   Q_Settings.validate.faculty = 1;
               });
               
               $('#year').change(function(){
                   localStorage.setItem('year', $(this).val());
                   Q_Settings.validate.year = 1;
               });
               
               $('#firstname').blur(function(){
                   var pattern = new RegExp(Q_Settings.name_pattern);
                   if($(this).val() !== ''){
                        var result = pattern.test($(this).val());
                        Questionnaire.validate(result, 'firstname');
                   } else if($(this).val() == ''){
                       Q_Settings.validate['firstname'] = 0;
                   }
               }).focus(function(){Questionnaire.after_error_focus();});
               
               $('#lastname').blur(function(){
                   var pattern = new RegExp(Q_Settings.name_pattern);
                   if($(this).val() !== ''){
                        var result = pattern.test($(this).val());
                        Questionnaire.validate(result, 'lastname');
                   } else if($(this).val() == ''){
                       Q_Settings.validate['lastname'] = 0;
                   }
               }).focus(function(){Questionnaire.after_error_focus();});
               
               $('#email').blur(function(){
                   var pattern = new RegExp(Q_Settings.email_pattern);
                   if($(this).val() !== ''){
                        var result = pattern.test($(this).val());
                        Questionnaire.validate(result, 'email');
                   } else if($(this).val() == ''){
                       Q_Settings.validate['email'] = 0;
                   }
               }).focus(function(){Questionnaire.after_error_focus();});
               
               $('#phone').blur(function(){
                   var pattern = new RegExp(Q_Settings.phone_pattern);
                   if($(this).val() !== ''){
                       var result = pattern.test($(this).val());
                       Questionnaire.validate(result, 'phone');
                   } else if($(this).val() == ''){
                       Q_Settings.validate['phone'] = 0;
                   }
               }).focus(function(){Questionnaire.after_error_focus();});
            },
            validate: function(result, input_id){
                   if(result == false){
                       Q_Settings.err_msg = 'active';
                       Q_Settings.validate[input_id] = 0;
                       var text = '<p class="'+input_id+'_err">Non correct <span class="error_fields">'+input_id+'</span>!</p>';
                       Questionnaire.error_msg('error', text, false)

                       $('.'+input_id+'_err').live('click', function(){
                           $('#'+input_id).focus();
                           Questionnaire.after_error_focus();
                       });
                   } else {
                       Q_Settings.validate[input_id] = 1;
                   }
            },
            after_error_focus: function(){
                if(Q_Settings.err_msg == 'active'){
                      $('.message').fadeOut(500);
                      Q_Settings.err_msg = 'none';
                }
            },
            chenge_select: function(select_id, select_menu_id, response){
                var name = select_id+'_name';
                $.each(response,function(){
                     $('#'+select_id).append('<option class="get" value="'+this.id+'">'+this[name]+'</option>');
                          $('#'+select_menu_id).append(
                              '<li class="get_li ui-btn ui-btn-icon-right ui-li ui-li-last ui-btn-up-c" data-option-index="1" data-icon="false" role="option" data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-iconpos="right" data-theme="c" aria-selected="false">'+
                                   '<div class="ui-btn-inner ui-li">'+
                                        '<div class="ui-btn-text">'+
                                             '<a class="ui-link-inherit" href="#" tabindex="-1">'+this[name]+'</a>'+
                                        '</div>'+
                                   '</div>'+
                              '</li>'
                              );
                      });
            }, 
            error_msg: function(status, text, timer){
                $('#message').removeClass("error");
                if(status == 'error') $('#message').addClass("error");

                $('#message').html(text);
                $('#message').fadeIn(500);
                if(timer !== false){
                    setTimeout(function(){
                       $('#message').fadeOut(500);
                    },timer);
                }
                    
            },
            correctly_name: function(input_id){
                var first_letter = $('#'+input_id).val()[0].toUpperCase();
                var other_letters = $('#'+input_id).val().substring(1).toLowerCase();
                $('#'+input_id).val(first_letter+other_letters);
            },
            send_data: function(data){
                    $.ajax({
                        type: "GET",
                        url: "http://questionnaire2/pages/save_user.php",
                        processData: true,
                        data: data,
                        dataType: "jsonp",
                        success: function(responce) {
                            if(responce.success)
                                console.log("Your data has been saved");
                                $(location).attr('href','#main');
                                
                                Questionnaire.clear_input('firstname');
                                Questionnaire.clear_input('lastname');
                                Questionnaire.clear_select('city', 'city-menu');
                                Questionnaire.clear_select('university', 'university-menu');
                                Questionnaire.clear_select('faculty', 'faculty-menu');
                                Questionnaire.clear_input('email');
                                Questionnaire.clear_input('phone');
                                
                                $('#year').parent().find('a').children().children().children().html($('#year option.plch').html());
                                $('#year option.plch').attr('selected','selected');
                                Q_Settings.validate.year = 1;
                                
                                Questionnaire.error_msg('success', '<p>Your data has been saved</p>', 5000);                                
                        },
                        error: function(x,y,z) {

                        }
                    });
 
            },
            save_data: function(){
                var index = 0;
                var count_valid_field = 0;
                var not_valid_field = new Array();
                
                $.each(Q_Settings.validate,function(i, val){
                    if(Q_Settings.validate[i] == 1){
                        count_valid_field++;
                    } else {
                        not_valid_field[index] = i;
                        index++;
                    }
                });

                if(count_valid_field == 8){
                    $(location).attr('href','#save');
                    Questionnaire.correctly_name('firstname');
                    Questionnaire.correctly_name('lastname');
                    
                    var data = {};
                    data.name = $('#firstname').val()+' '+$('#lastname').val();
                    data.city = $('#city').val();
                    data.city_name = $('#city').parent().find('a').children().children().children().text();
                    data.university = $('#university').val();
                    data.university_name = $('#university').parent().find('a').children().children().children().text();
                    data.faculty = $('#faculty').val();
                    data.faculty_name = $('#faculty').parent().find('a').children().children().children().text();
                    data.year_graduation = $('#year').val();
                    data.email = $('#email').val();
                    data.mobile_phone = $('#phone').val();
                    data.working_experience = $("input[name='experience']:checked").val();
                    data.english_level = $("input[name='english']:checked").val();
                    data.ready_participate = $("input[name='training_ready']:checked").val();
                    
                    switch(data.working_experience){
                        case '1':
                            data.working_experience_name = 'Yes';
                            break;
                        case '2':
                            data.working_experience_name = 'No';
                            break;
                    }
                    
                    switch(data.english_level){
                        case '1':
                            data.english_level_name = 'Beginner';
                            break;
                        case '2':
                            data.english_level_name = 'Intermediate';
                            break;
                        case '3':
                            data.english_level_name = 'Advanced';
                            break;
                    }
                    
                    switch(data.ready_participate){
                        case '1':
                            data.ready_participate_name = 'Yes';
                            break;
                        case '2':
                            data.ready_participate_name = 'Not now';
                            break;
                        case '3':
                            data.ready_participate_name = 'No';
                            break;
                    }
                    Q_Settings['data_saved'] = data;
                    
                    $('#save_container').html(
                        '<p class="save_item"><span>Name: </span>'+data.name+'</p>'+
                        '<div class="education_save">'+
                            '<p class="education_save_head">Educaion information:</p>'+
                            '<p class="save_item"><span>City: </span>'+data.city_name+'</p>'+
                            '<p class="save_item"><span>University: </span>'+data.university_name+'</p>'+
                            '<p class="save_item"><span>Faculty: </span>'+data.faculty_name+'</p>'+
                            '<p class="save_item"><span>Year graduation: </span>'+data.year_graduation+'</p>'+
                        '</div>'+
                        '<p class="save_item"><span>Email: </span>'+data.email+'</p>'+
                        '<p class="save_item"><span>Phone: </span>'+data.mobile_phone+'</p>'+
                        '<p class="save_item"><span>Working experience: </span>'+data.working_experience_name+'</p>'+
                        '<p class="save_item"><span>English level: </span>'+data.english_level_name+'</p>'+
                        '<p class="save_item"><span>Ready participate: </span>'+data.ready_participate_name+'</p>'
                    );
                    
                }else {
                    var text;
                    
                    $.each(not_valid_field, function(i, field_name){
                        text+='<span class="error_fields '+field_name+'_err">'+field_name+',</span> ';
                        $('.'+field_name+'_err').live('click', function(){
                           $('#'+field_name).focus();
                           Questionnaire.after_error_focus();
                       });
                    });
                    
                    Questionnaire.error_msg('error', '<p>Fields: '+text.substring(9)+' are not filled!</p>', 5000);

                }
 
            },
            admin_login: function(){
                var login = $('#login_name').val();
                var pass = $('#login_password').val();
                $.ajax({
                    type: "GET",
                    url: "http://questionnaire2/admin/login.php",
                    processData: true,
                    data: {login: login, pass: pass},
                    dataType: "jsonp",
                    success: function(responce) {
                        if(responce.success == 'success'){
                            localStorage.setItem("admin", 1);
                            alert("You successfully login");
                        }else{
                            alert("by");
                        }
                    }
                });
            },
            admin_export: function(){
                var data = $("#admin-filters").serializeArray();
                $.ajax({
                    type: "GET",
                    url: "http://questionnaire2/admin/export.php",
                    processData: true,
                    data: {data: data},
                    dataType: "jsonp",
                    success: function(responce) {
                        if(responce.success == 'success'){
                            Questionnaire.error_msg("success", responce.data, false);
                        }else{
                            Questionnaire.error_msg("error", responce.data, false);
                        }
                    }
                });
            }

};