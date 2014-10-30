var tickets = {}; // JSON object hold all ticket type and their quantity

$(document).ready(function() {
    // Add jquery UI datepicker
    $('.datepicker').datepicker({ dateFormat: "dd/mm/yy" });
    $('.combobox').combobox();
    ajax_theaters();
    ajax_schedules();
    quantity = $('select[class="quantity"]').val();
    get_tickets();
});


// Event for select tickets
$(document).on('change', 'select[class="quantity"]', function() {
    get_tickets();
});

function get_tickets() {
    var element = $('select[class="quantity"]');
    var quantity = element.val();
    var type_id = element.attr('id');
    var total = 0;
    tickets[type_id] = {"id": element.attr('data-id'), "quantity": quantity};
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


// Event for seating map page
$(document).on('click', '.ticket', function(){
    $(this).toggleClass('glyphicon-unchecked glyphicon-check');
    $(this).toggleClass('selected');
    var selected_number = $(".glyphicon-check.ticket").length;
    var total_tickets = $(".ticket_type").attr('data-quantity');

    if (selected_number > total_tickets) {
        alert("Enough already");
        $(this).toggleClass('glyphicon-unchecked glyphicon-check');
        $(this).toggleClass('selected');
    }
});

$(document).on('submit', 'form', function(e){
//$( "form" ).submit(function( event ) {
    var selected = document.getElementsByClassName('selected');
    var selected_positions = [];
    var schedule_id = $('#schedule-id').attr('data-id');

    for (var i = 0; i < selected.length; i++) {
        var position = []
        position[0] = selected[i].getAttribute('data-row');
        position[1] = selected[i].getAttribute('data-column');
        selected_positions.push(position);
    }
    $('input[type="hidden"][name="positions"]').val(JSON.stringify(selected_positions));
    $('input[type="hidden"][name="schedule_id"]').val(schedule_id);
});