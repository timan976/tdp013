FLASH_ERROR = "error";
FLASH_SUCCESS = "success";
FLASH_NOTICE = "notice";

_flash_timeout_id = undefined;

function update_character_count() {
	var count = 140 - $("textarea[name=message]").val().length;
	var elm = $("#compose_controls > .character_count");
	elm.text(count);
	
	if(count < 0)
		elm.addClass("limit_reached");
	else
		elm.removeClass("limit_reached");
}

function flash(message, type, duration) {
	if(type != FLASH_ERROR && type != FLASH_SUCCESS && type != FLASH_NOTICE) {
		console.log("Error: Invalid type '" + type + "' passed to flash()");
		return;
	}

	if(_flash_timeout_id != undefined)
		clearInterval(_flash_timeout_id);

	var flash_elm = $("#flash");
	flash_elm.show();
	flash_elm.removeClass();
	flash_elm.addClass(type);
	flash_elm.html(message);

	if(duration != undefined) {
		_flash_timeout_id = setTimeout(function() { $("#flash").hide(); }, duration*1000);
	}
}

function add_message(message) {
	var message_elm = $(document.createElement("div"));
	message_elm.addClass("message unread");
	message_elm.html(message + "<br />");

	var date = new Date();
	var components = [
		date.getDate(),
		date.getMonth(),
		date.getFullYear(),
		date.getHours(),
		date.getMinutes(),
		date.getSeconds()
	];

	for(var i in components) {
		if(components[i] < 10)
			components[i] = "0" + components[i];
	}

	var date_string = components[0] + "-" + components[1] + "-" + components[2];
	date_string += " at ";
	date_string += components[3] + ":" + components[4] + ":" + components[5];

	var timestamp_elm = $(document.createElement("div"));
	timestamp_elm.addClass("timestamp");
	timestamp_elm.text(date_string);
	message_elm.append(timestamp_elm);

	var notice_elm = $(document.createElement("div"));
	notice_elm.addClass("notice");
	notice_elm.text("Click to mark as read.");
	message_elm.append(notice_elm);

	$("#messages").prepend(message_elm);
}

function post_message() {
	var textarea_elm = $("textarea[name=message]");
	var message = $.trim(textarea_elm.val());

	// Regex copied from http://stackoverflow.com/a/2919363
	message = message.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br />$2');

	if(message.length == 0) {
		flash("Please enter a message.", FLASH_ERROR, 3.0);
		return;
	} else if(message.length > 140) {
		flash("Your message contains more than 140 characters.", FLASH_ERROR, 3.0);
		return;
	}

	add_message(message);

	flash("Message posted!", FLASH_SUCCESS, 2.0);

	textarea_elm.val("");
	textarea_elm.attr("rows", 1);
	$("#compose_controls").hide();
	textarea_elm.blur();
}

$(document).ready(function() {
	$("textarea[name=message]").focus(function() {
		if($(this).hasClass("placeholder")) {
			$(this).removeClass("placeholder");
			$(this).val("");
		}
		$(this).attr("rows", 3);
		$("#compose_controls").show();
	});

	$("textarea[name=message]").blur(function() {
		if($(this).val() == "") {
			$(this).addClass("placeholder");
			$(this).val("Say something...");

			$(this).attr("rows", 1);
			$("#compose_controls").hide();
		}
	});

	$("textarea[name=message]").keypress(function(e) {
		update_character_count();

		if(e.which == 13 && !e.shiftKey) {
			// The user pressed Enter
			post_message();
			return false;
		}
	});

	$("textarea[name=message]").keyup(function() {
		update_character_count();
	});

	$("input[name=send]").click(function() {
		post_message();
	});

	$(document).on("click", ".message.unread", function() {
		$(this).removeClass("unread");
	});
});

