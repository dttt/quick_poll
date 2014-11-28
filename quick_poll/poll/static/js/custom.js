google.load('visualization', '1.0', {'packages':['corechart']});

$(document).ready(function (){
    $("#loading_gif").hide();
});

// Load the loading gif
function loading_ajax() {
    $(document).ajaxStart(function(){
        $("#loading_gif").show();
    });
    $(document).ajaxComplete(function(){
        $("#loading_gif").hide();
    });
}


// Function for AJAX POST request
function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

function sameOrigin(url) {
    // test that a given url is a same-origin URL
    // url could be relative or scheme relative or absolute
    var host = document.location.host; // host + port
    var protocol = document.location.protocol;
    var sr_origin = '//' + host;
    var origin = protocol + sr_origin;
    // Allow absolute or scheme relative URLs to same origin
    return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
        (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
        // or any other URL that isn't scheme relative or absolute i.e relative.
        !(/^(\/\/|http:|https:).*/.test(url));
}

function replace_content(selector, content) {
    $(selector).html(content);
}

function supported_api() {
    return !!(window.history && history.pushState);
}

function replace_content(selector, content) {
    $(selector).html(content);
}

function change(state) {
    replace_content('#main', change_ajax(window.location));
}

$(window).bind("popstate", function(e) {
    //change(e.originalEvent.state);
    //replace_content('#main', change_ajax(window.location));
    change_ajax(window.location);
});

$(document).on('click', '#create', function(){
    var options = document.getElementsByClassName('option');
    var options_val = get_options(options);
    if (options_val.length >= 2) {
        var poll = document.getElementById('poll').value;

        var json_options = JSON.stringify(options_val);
        var csrftoken = $.cookie('csrftoken');

        $.ajax({
            type: "POST",
            url: "/ajax/create/",
            beforeSend: function(xhr, settings) {
                if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            },
            data: {"poll": poll, "options": json_options},
        })
        .done(function(data) {
            url = data.url;
            html = data.html;
            if (supported_api()) {
                window.history.pushState(null, null, url);
                replace_content('#main', html);
            }
        })
        .fail(function() {
            alert('fail');
        });
    } else {
        alert("Need more 2 options to create!");
    }
});

function change_ajax(url) {
    $.ajax({
        type: "GET",
        url: url,
    })
    .done(function(data) {
        replace_content('#main', data);
    })
}

function get_options(options) {
    var options_val = [];

    for (var i = 0; i < options.length; i++) {
        var text = options[i].value.replace(/\s+/g, '');
        if (text !== '') {
            options_val.push(options[i].value);
        }
    }
    return options_val;
}


$(document).on('change', '.last_option', function(){
    var order = parseInt($(this).attr('data-order')) + 1;
    var div_e = $('<div/>').addClass('input-group');
    var span_e = $('<span/>').addClass('input-group-addon').text(order);
    var input_e = $('<input/>').addClass('form-control option last_option')
        .attr("id", "option_" + order)
        .attr("placeholder", "Leave flank if you don't use it")
        .attr("data-order", order);
    $(this).toggleClass('last_option');
    $("#option_list").append(div_e.append(span_e, input_e));
});


$(document).on('click', '#vote', function(e){
    e.preventDefault();
    var voted = $('#vote_form input[name=voted_option]:checked').val();
    var csrftoken = $.cookie('csrftoken');
    $.ajax({
        type: "POST",
        url: $(this).attr('href'),
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        },
        data: {'voted': voted},
    })
    .done(function(data) {
        draw_graph(data);
    });
});


$(document).on('click', '#show_result', function(e){
    e.preventDefault();
    var url = $(this).attr('href');
    $.ajax({
        type: "GET",
        url: url,
    })
    .done(function(data) {
        draw_graph(data);
        window.history.pushState(null, null, url)
    })
    .fail(function() {
        alert('fail');
    });
});


function draw_graph(data) {
    var rows = []
    for (var i = 0; i < data.length; i++) {
        option = data[i];
        rows.push([option.content, parseInt(option.voted)]);
    }

    var data_table = new google.visualization.DataTable();
    data_table.addColumn('string', 'Content');
    data_table.addColumn('number', 'Voted');
    data_table.addRows(rows);
    var options = {
        title: 'Result',
        width: '100%',
        height: '100%'
    };
    var chart = new google.visualization.PieChart(document.getElementById('option_result'));
    chart.draw(data_table, options);
}
