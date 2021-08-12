/**
 * This javascript is your first ever custom javascript that will run before anything else.
 * Think about the sequence of your scripts
 */

/**
 * Initialization function after all HTML elements are loaded.
 * This is called before the loading of images stylesheets
 * @param {Event} event The triggered dom event
 */
document.addEventListener("DOMContentLoaded", function (event) {
	console.log("DOM Initialized");
});
$('#posterUpload').on('change', function () {
	let image = $("#posterUpload")[0].files[0];
	let formdata = new FormData();
	formdata.append('posterUpload', image);
	$.ajax({
		url: 'upload',
		type: 'POST',
		data: formdata,
		contentType: false,
		processData: false,
		'success': (data) => {
			$('#poster').attr('src', data.file);
			$('#posterURL').attr('value', data.file);// sets posterURL hidden field
		}
	});
});

/**
 * Initialization function after everything is loaded.
 * This event should be used for stuff that probably need to wait for dynamic contents
 * @param {Event} event The triggered dom event
 */
window.addEventListener("load", function (event) {
	console.log("HTML Initialized");
	$('[data-toggle=confirmation]').confirmation({
		rootSelector: '[data-toggle=confirmation]',
	});
});
