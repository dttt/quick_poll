// Ajax function for select theaters
$(document).on("change", "#select-movie", function() {
    ajax_theaters();
});

function ajax_theaters() {
    reset_selects();
    var container_id = "#theaters";
    var movie_id = $('#select-movie').val();
    $.ajax({
        type: "GET",
        url: "/ajax/theaters/",
        data: {"movie_id": movie_id},
    })
    .done(function(data) {
        replace_content(container_id, data);
    })
    .fail(function() {
        replace_content(container_id, '');
    });
}

// Ajax function for select schedules
$(document).on("change", "input[type=radio][name=select-theater]", function() {
    ajax_schedules();
});

function ajax_schedules() {
    var container_id = "#schedules";
    var theater_id = $("input[type=radio][name=select-theater]:checked").val();
    var movie_id = $('#select-movie').val();
    $.ajax({
        type: "GET",
        url: "/ajax/schedules/",
        data: {"movie_id": movie_id, "theater_id": theater_id},
    })
    .done(function(data) {
        replace_content(container_id, data);
    })
    .fail(function() {
        replace_content(container_id, '')
    });
}


function replace_content(selector, content) {
    $(selector).html(content);
}


function reset_selects() {
    $("#theaters").html('');
    $("#schedules").html('');
}

// Ajax function for select seats
$(document).on("click", "#select-seats", function(){
    ajax_seats();
});

function ajax_seats() {
    var schedule_id = $('#schedule-id').attr('data-id');
    var csrftoken = $.cookie('csrftoken');
    $.ajax({
        type: "POST",
        url: "/ajax/seats/",
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        },
        data: {
            "tickets": JSON.stringify(tickets),
            "schedule_id": schedule_id,
        },
    })
    .done(function(data){
        //alert(data);
        replace_content("#ajax-container", data);
    })
    .fail(function(){
        alert("dafs");
    });
}

/*
$(document).on('click', 'a[name="finish"]', function(){
    var selected = document.getElementsByClassName('selected');
    var selected_positions = [];
    var schedule_id = $('#schedule-id').attr('data-id');
    var csrftoken = $.cookie('csrftoken');

    for (var i = 0; i < selected.length; i++) {
        var position = []
        position[0] = selected[i].getAttribute('data-row');
        position[1] = selected[i].getAttribute('data-column');
        selected_positions.push(position);
    }
    $.ajax({
        url: '/ajax/finish/',
        type: "POST",
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        },
        data: {
            "positions": JSON.stringify(selected_positions),
            "schedule_id": schedule_id,
        },
    });
});*/